import { useState, useCallback, useEffect } from "react";
import { getGeminiChat, startNewGame } from "../lib/gemini";

export interface Message {
  role: "user" | "model";
  content: string;
}

export function useGameEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [systemPanel, setSystemPanel] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract the system panel (plaintext block) from raw markdown
  const parseResponse = (raw: string) => {
    const defaultMsg = { narrative: raw, panel: "" };
    const markerStart = "\`\`\`plaintext";
    const markerEnd = "\`\`\`";

    const startIndex = raw.indexOf(markerStart);
    if (startIndex === -1) {
      return defaultMsg;
    }

    const contentStart = startIndex + markerStart.length;
    let endIndex = raw.indexOf(markerEnd, contentStart);
    
    // Sometimes the model might close with something else or not close at all
    if (endIndex === -1) {
      endIndex = raw.length;
    }

    const panel = raw.substring(contentStart, endIndex).trim();
    
    const narrativeBefore = raw.substring(0, startIndex).trim();
    const narrativeAfter = raw.substring(endIndex + markerEnd.length).trim();
    
    const narrative = [narrativeBefore, narrativeAfter].filter(Boolean).join("\n\n");

    return { narrative, panel };
  };

  const initGame = useCallback(async () => {
    try {
      setIsTyping(true);
      setError(null);
      startNewGame();
      setMessages([]);
      setSystemPanel("");
      
      const chat = getGeminiChat();
      // Trigger the first message secretly
      const responseStream = await chat.sendMessageStream({ message: "系统唤醒：请根据初始指令，开始引导用户创建角色并展示系统面板。" });
      
      let fullText = "";
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          const { panel, narrative } = parseResponse(fullText);
          if (panel) setSystemPanel(panel);
          
          setMessages([
            { role: "model", content: narrative || fullText }
          ]);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to start game");
    } finally {
      setIsTyping(false);
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    try {
      if (text.trim() === "重开") {
        initGame();
        return;
      }

      setIsTyping(true);
      setError(null);
      
      setMessages(prev => [...prev, { role: "user", content: text }]);
      
      const chat = getGeminiChat();
      const responseStream = await chat.sendMessageStream({ message: text });
      
      let fullText = "";
      // Initialize a new empty message for the model
      setMessages(prev => [...prev, { role: "model", content: "" }]);
      
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          const { panel, narrative } = parseResponse(fullText);
          
          if (panel) {
            setSystemPanel(panel);
          }
          
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = narrative || fullText;
            return newMessages;
          });
        }
      }
    } catch(err: any) {
      console.error(err);
      setError(err.message || "Failed to send message");
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, initGame]);

  return {
    messages,
    systemPanel,
    isTyping,
    error,
    sendMessage,
    initGame
  };
}
