import { useEffect, useRef, useState } from 'react';
import { Compass, LoaderCircle, Send, Sparkles } from 'lucide-react';
import { NarrativeMessage, WestFantasyState } from '../types';

interface ChatAreaProps {
  state: WestFantasyState;
  messages: NarrativeMessage[];
  pendingUserText: string;
  streamText: string;
  isGenerating: boolean;
  isUpdatingState: boolean;
  latestOptions: string[];
  onSubmit: (text: string) => void;
  onQuickOption: (option: string) => void;
  onRegenerate: (assistantMessageId: number) => void;
  onSceneAction: (action: WestFantasyState['场景']['候选动作'][number]) => void;
}

export default function ChatArea({
  state,
  messages,
  pendingUserText,
  streamText,
  isGenerating,
  isUpdatingState,
  latestOptions,
  onSubmit,
  onQuickOption,
  onRegenerate,
  onSceneAction,
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottomRef = useRef(true);
  const previousPendingUserTextRef = useRef('');
  const previousStreamTextRef = useRef('');
  const longPressTimerRef = useRef<number | null>(null);
  const longPressStartRef = useRef<{ x: number; y: number } | null>(null);

  function updateScrollStickiness() {
    const container = scrollAreaRef.current;
    if (!container) {
      return;
    }

    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldStickToBottomRef.current = distanceToBottom < 96;
  }

  function scrollToBottom(behavior: ScrollBehavior) {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }

  function clearLongPress() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    longPressStartRef.current = null;
  }

  useEffect(() => {
    const container = scrollAreaRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => updateScrollStickiness();
    updateScrollStickiness();
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const isNewPendingMessage = Boolean(pendingUserText) && !previousPendingUserTextRef.current;
    previousPendingUserTextRef.current = pendingUserText;

    if (isNewPendingMessage) {
      shouldStickToBottomRef.current = true;
      scrollToBottom('smooth');
    }
  }, [pendingUserText]);

  useEffect(() => {
    const isStreaming = streamText.length > previousStreamTextRef.current.length;
    previousStreamTextRef.current = streamText;

    if (!shouldStickToBottomRef.current) {
      return;
    }

    scrollToBottom(isStreaming ? 'auto' : 'smooth');
  }, [messages, streamText, latestOptions, isUpdatingState]);

  const lastAssistantId = [...messages].reverse().find(message => message.role === 'assistant')?.id ?? null;
  const isBusy = isGenerating || isUpdatingState;
  const submitLabel = isUpdatingState ? '更新中' : isGenerating ? '生成中' : '发送';
  const placeholder = isUpdatingState ? '正在写入变量与刷新界面...' : isGenerating ? '正在生成本轮叙事...' : '输入你的行动、对话或计划...';
  const busyHint = isUpdatingState ? '正在写入变量并同步界面...' : isGenerating ? '正在等待模型输出...' : '';

  useEffect(() => () => clearLongPress(), []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-amber-100/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs tracking-[0.3em] text-amber-100/65">{state.地点.所属城镇}</div>
          <h1 className="mt-2 font-display text-3xl text-stone-50 sm:text-4xl">{state.场景.标题}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400">{state.场景.副标题}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {state.场景.状态徽章.map(badge => (
            <span
              key={badge}
              className="rounded-full border border-amber-100/10 bg-amber-100/6 px-3 py-1.5 text-xs tracking-[0.16em] text-amber-100/80"
            >
              {badge}
            </span>
          ))}
        </div>
      </header>

      <section className="mb-5">
        <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.26em] text-stone-500">
          <Compass size={14} />
          <span>界面行动</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {state.场景.候选动作.map(action => (
            <button
              key={`${action.命令类型}-${action.目标}-${action.标签}`}
              onClick={() => onSceneAction(action)}
              disabled={isBusy}
              className="rounded-full border border-amber-100/10 bg-stone-950/45 px-4 py-2 text-sm text-stone-200 transition-all hover:border-amber-200/20 hover:bg-stone-900/70"
            >
              {action.标签}
            </button>
          ))}
        </div>
      </section>

      <div ref={scrollAreaRef} className="west-chat-scroll custom-scrollbar flex-1 space-y-6 overflow-y-auto pr-1 sm:pr-3">
        {messages.map(message => {
          const canRegenerate = message.role === 'assistant' && message.id === lastAssistantId && !isBusy;

          return (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] rounded-[1.6rem] border px-5 py-4 shadow-[0_16px_42px_rgba(0,0,0,0.2)] sm:max-w-[80%] ${
                message.role === 'user'
                  ? 'rounded-tr-md border-amber-300/16 bg-[linear-gradient(180deg,rgba(100,54,28,0.66),rgba(50,23,14,0.9))] text-stone-100'
                  : 'rounded-tl-md border-amber-100/10 bg-[linear-gradient(180deg,rgba(38,25,18,0.88),rgba(20,14,11,0.94))] text-stone-200'
              }`}
              onContextMenu={event => {
                if (!canRegenerate) {
                  return;
                }

                event.preventDefault();
                onRegenerate(message.id);
              }}
              onPointerDown={event => {
                if (!canRegenerate || event.pointerType !== 'touch') {
                  return;
                }

                longPressStartRef.current = {
                  x: event.clientX,
                  y: event.clientY,
                };
                longPressTimerRef.current = window.setTimeout(() => {
                  onRegenerate(message.id);
                  clearLongPress();
                }, 460);
              }}
              onPointerMove={event => {
                if (!longPressStartRef.current || event.pointerType !== 'touch') {
                  return;
                }

                const deltaX = Math.abs(event.clientX - longPressStartRef.current.x);
                const deltaY = Math.abs(event.clientY - longPressStartRef.current.y);
                if (deltaX > 12 || deltaY > 12) {
                  clearLongPress();
                }
              }}
              onPointerUp={() => clearLongPress()}
              onPointerCancel={() => clearLongPress()}
              onPointerLeave={() => clearLongPress()}
            >
              {message.role === 'assistant' && (
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.26em] text-amber-100/70">
                  <Sparkles size={12} />
                  <span>系统叙述者</span>
                </div>
              )}
              <p className="whitespace-pre-wrap font-body text-[1.03rem] leading-8">{message.display}</p>
              {canRegenerate && (
                <div className="mt-4 text-[11px] tracking-[0.2em] text-amber-100/46">长按 / 右键可重生成本轮</div>
              )}
              {message.role === 'assistant' && message.id === lastAssistantId && latestOptions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {latestOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => onQuickOption(option)}
                      disabled={isBusy}
                      className="rounded-full border border-amber-200/16 bg-amber-100/7 px-4 py-2 text-left text-sm text-amber-50 transition-all hover:border-amber-200/30 hover:bg-amber-100/12"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          );
        })}

        {pendingUserText && (
          <div className="flex justify-end">
            <div className="max-w-[88%] rounded-[1.6rem] rounded-tr-md border border-amber-300/16 bg-[linear-gradient(180deg,rgba(100,54,28,0.66),rgba(50,23,14,0.9))] px-5 py-4 text-stone-100 shadow-[0_16px_42px_rgba(0,0,0,0.2)] sm:max-w-[80%]">
              <p className="whitespace-pre-wrap font-body text-[1.03rem] leading-8">{pendingUserText}</p>
            </div>
          </div>
        )}

        {streamText && (
          <div className="flex justify-start">
            <div className="max-w-[88%] rounded-[1.6rem] rounded-tl-md border border-amber-100/10 bg-[linear-gradient(180deg,rgba(38,25,18,0.88),rgba(20,14,11,0.94))] px-5 py-4 text-stone-200 shadow-[0_16px_42px_rgba(0,0,0,0.2)] sm:max-w-[80%]">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.26em] text-amber-100/70">
                <Sparkles size={12} />
                <span>{isUpdatingState ? '系统叙述者已完成，变量更新中' : isGenerating ? '系统叙述者生成中' : '系统叙述者'}</span>
              </div>
              <p className="whitespace-pre-wrap font-body text-[1.03rem] leading-8">{streamText}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="mt-5">
        <div className="west-input-shell relative rounded-[1.7rem] border border-amber-100/10 bg-[rgba(18,13,10,0.92)] p-3 shadow-[0_16px_52px_rgba(0,0,0,0.35)]">
          <textarea
            rows={1}
            value={input}
            disabled={isBusy}
            onChange={event => setInput(event.target.value)}
            onKeyDown={event => {
              if (isBusy) {
                return;
              }
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (input.trim()) {
                  onSubmit(input.trim());
                  setInput('');
                }
              }
            }}
            placeholder={placeholder}
            className="custom-scrollbar max-h-40 min-h-[64px] w-full resize-none bg-transparent px-4 py-3 font-body text-[1.02rem] leading-8 text-stone-100 placeholder:text-stone-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-65"
          />
          {busyHint && <div className="px-4 pt-1 text-xs tracking-[0.14em] text-amber-100/55">{busyHint}</div>}
          <div className="mt-3 flex items-center justify-end">
            <button
              onClick={() => {
                if (input.trim()) {
                  onSubmit(input.trim());
                  setInput('');
                }
              }}
              disabled={!input.trim() || isBusy}
              className={`flex h-12 min-w-[118px] items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-[0.12em] text-stone-950 shadow-[0_0_22px_rgba(216,155,76,0.25)] transition-all ${
                isBusy
                  ? 'bg-[linear-gradient(135deg,#f0c36d,#f7e3bc)] shadow-[0_0_34px_rgba(241,190,92,0.45)]'
                  : 'bg-[linear-gradient(135deg,#c58a4b,#efd39e)]'
              } disabled:cursor-not-allowed disabled:opacity-55`}
            >
              {isBusy ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Send size={18} className="translate-x-[1px]" />
              )}
              <span>{submitLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
