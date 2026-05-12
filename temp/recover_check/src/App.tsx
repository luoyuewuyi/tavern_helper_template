import React, { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, TerminalSquare, RotateCcw, Loader2 } from "lucide-react";
import { useGameEngine } from "./hooks/useGameEngine";
import { cn } from "./lib/utils";

export default function App() {
  const { messages, systemPanel, isTyping, error, sendMessage, initGame } = useGameEngine();
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  const handleActionClick = (action: string) => {
    sendMessage(action);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#0d0f12] text-[#00ff9d] font-mono overflow-hidden border-[4px] md:border-[8px] border-[#1a1c23] p-2 md:p-4">
      
      {/* Global Status Bar */}
      <header className="flex justify-between items-center border-b border-[#00ff9d]/30 pb-3 mb-4 shrink-0 hidden md:flex">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-sm md:text-xl font-bold tracking-tighter glow-text">SYSTEM_OS v.2.0.77</span>
          <span className="bg-[#00ff9d]/10 px-1 md:px-2 py-0.5 text-[10px] md:text-xs border border-[#00ff9d]/40 text-white truncate max-w-[120px] md:max-w-none">CONNECTION: SECURE</span>
        </div>
        <div className="flex gap-3 md:gap-6 text-xs md:text-sm text-white items-center">
          <span className="hidden md:inline">📡 LATENCY: 12ms</span>
          <span className="hidden md:inline">🔋 POWER: 88%</span>
          <span className="animate-pulse text-[#00ff9d] flex items-center gap-1">● <span className="hidden md:inline">LIVE RECORDING</span></span>
        </div>
      </header>

      {/* Mobile narrow header */}
      <header className="flex justify-between items-center border-b border-[#00ff9d]/30 pb-2 mb-3 shrink-0 md:hidden">
        <span className="text-sm font-bold tracking-tighter glow-text">SYSTEM_OS</span>
        <span className="animate-pulse text-[#00ff9d] text-xs flex items-center gap-1">● LIVE</span>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4 md:gap-4">
        
        {/* Left / Top Panel: System Status (Terminal) */}
        <div className="flex-1 lg:w-[55%] p-3 md:p-4 border border-[#00ff9d] bg-[#1a1c23] shadow-[0_0_15px_rgba(0,255,157,0.1)] overflow-y-auto hidden-scrollbar flex flex-col relative">
          <div className="flex items-center gap-3 mb-4 text-[#00ff9d] border-b border-[#00ff9d]/20 pb-2 sticky top-0 bg-[#1a1c23] z-10">
            <TerminalSquare className="w-4 h-4 md:w-5 md:h-5" />
            <h1 className="text-xs md:text-sm font-bold tracking-widest uppercase text-white">System Panel</h1>
          </div>
          
          <div className="flex-1 w-full relative">
            {systemPanel ? (
              <pre className="whitespace-pre-wrap font-mono text-[10px] md:text-[11px] leading-relaxed text-[#00ff9d]">
                {systemPanel}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#00ff9d]/60 blink text-sm gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                {isTyping ? "Initializing system..." : "Waiting for system sync..."}
              </div>
            )}
          </div>
        </div>

        {/* Right / Bottom Panel: Chat and Narrative */}
        <div className="flex-1 lg:w-[45%] flex flex-col border border-[#00ff9d]/20 bg-[#161b22] relative overflow-hidden">
          
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-5 hidden-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "max-w-[92%] md:max-w-[85%] break-words text-xs md:text-sm",
                  msg.role === "user" 
                    ? "ml-auto text-right text-white" 
                    : "text-[#d1d5db]"
                )}
              >
                {msg.role === "user" ? (
                  <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 border border-[#00ff9d]/40 bg-[#00ff9d]/10 mb-1 text-[#00ff9d] text-xs md:text-xs tracking-wider">
                    &gt; {msg.content}
                  </div>
                ) : (
                  <div className="prose prose-invert prose-terminal max-w-none prose-p:leading-relaxed prose-pre:bg-[#1a1c23] prose-pre:border prose-pre:border-[#00ff9d]/20 prose-pre:text-[#00ff9d] text-[13px]">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </Markdown>
                  </div>
                )}
              </div>
            ))}
            {error && (
              <div className="text-red-500 bg-red-500/10 p-2 md:p-3 text-xs border border-red-500/20 blink">
                [Sys_Error]: {error}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Action Shortcuts */}
          <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-[#00ff9d]/20 bg-[#0d0f12]/50 text-[9px] md:text-[10px] uppercase">
            <button onClick={() => handleActionClick("继续")} disabled={isTyping} className="px-2 py-1 text-[#00ff9d] border border-[#00ff9d]/20 hover:bg-[#00ff9d]/20 disabled:opacity-50 transition-colors tracking-wide">[CONTINUE]</button>
            <button onClick={() => handleActionClick("精彩内容")} disabled={isTyping} className="px-2 py-1 text-[#00ff9d] border border-[#00ff9d]/20 hover:bg-[#00ff9d]/20 disabled:opacity-50 transition-colors tracking-wide">[STORY]</button>
            <button onClick={() => handleActionClick("查询")} disabled={isTyping} className="px-2 py-1 text-[#00ff9d] border border-[#00ff9d]/20 hover:bg-[#00ff9d]/20 disabled:opacity-50 transition-colors tracking-wide">[QUERY]</button>
            <button onClick={() => initGame()} disabled={isTyping} className="px-2 py-1 text-red-500 border border-red-900/50 hover:bg-red-900/30 flex items-center gap-1 ml-auto disabled:opacity-50 transition-colors">
              <RotateCcw className="w-3 h-3" /> [RESTART]
            </button>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-2 md:p-3 border-t border-[#00ff9d]/30 bg-[#0d0f12] flex gap-2">
            <input
              ref={inputRef}
              type="text"
              disabled={isTyping}
              placeholder={isTyping ? "PROCESSING..." : "INPUT CMD... e.g. 1a2b"}
              className="flex-1 bg-transparent border border-[#00ff9d]/40 px-3 py-2 text-xs font-mono text-[#00ff9d] focus:outline-none focus:border-[#00ff9d] focus:shadow-[0_0_10px_rgba(0,255,157,0.3)] transition-all disabled:opacity-50 placeholder-[#00ff9d]/30 uppercase"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="bg-[#00ff9d] hover:bg-white text-black p-2 flex items-center justify-center disabled:opacity-50 transition-colors min-w-[3rem] md:min-w-[4rem] font-bold text-xs"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : "EXEC"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
