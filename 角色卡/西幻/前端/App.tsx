import { AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { startTransition, useDeferredValue, useEffect, useEffectEvent, useRef, useState } from 'react';
import { DefaultData } from '../schema';
import ChatArea from './components/ChatArea';
import OpeningOverlay from './components/OpeningOverlay';
import Sidebar from './components/Sidebar';
import LocationModal from './components/modals/LocationModal';
import MapModal from './components/modals/MapModal';
import MembersModal from './components/modals/MembersModal';
import RulesModal from './components/modals/RulesModal';
import StatusModal from './components/modals/StatusModal';
import { ModalType, NarrativeMessage, SessionHostCommandPayload, WestFantasyState } from './types';
import { checkAndUpdateChronicle } from './utils/chronicleUpdater';
import { createOpeningFormData, createOpeningState, createOpeningStoryMessage, updateInitvarWorldbookEntry } from './utils/gameInitializer';
import { regenerateSessionHostTurn, sendSessionHostRequest } from './utils/requestHandler';
import { ensureLatestSessionHostAnchor } from './utils/sessionHost';
import { patchLatestState, readLatestState, readNarrativeMessages, repairLatestMvuData } from './utils/variableReader';

function waitFor(ms: number) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

export default function App() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [state, setState] = useState<WestFantasyState>(_.cloneDeep(DefaultData));
  const [messages, setMessages] = useState<NarrativeMessage[]>([]);
  const [isOpening, setIsOpening] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingUserText, setPendingUserText] = useState('');
  const [streamText, setStreamText] = useState('');
  const deferredMessages = useDeferredValue(messages);

  const refreshRuntime = useEffectEvent(async () => {
    const latestState = readLatestState();
    const latestMessages = readNarrativeMessages();
    const opening = getLastMessageId() === 0;

    startTransition(() => {
      setState(latestState);
      setMessages(latestMessages);
      setIsOpening(opening);
      setIsBooting(false);
    });
  });

  useEffect(() => {
    let refreshTimer = 0;
    const scheduleRefresh = (shouldRepairHost = false) => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(async () => {
        if (shouldRepairHost) {
          await ensureLatestSessionHostAnchor();
          await repairLatestMvuData();
        }
        await refreshRuntime();
      }, 120);
    };

    const bootstrapRuntime = async () => {
      await waitGlobalInitialized('Mvu');
      await ensureLatestSessionHostAnchor();
      await repairLatestMvuData();
      await refreshRuntime();
    };

    void bootstrapRuntime();

    const listeners = [
      eventOn(tavern_events.MESSAGE_RECEIVED, () => scheduleRefresh()),
      eventOn(tavern_events.MESSAGE_UPDATED, () => scheduleRefresh()),
      eventOn(tavern_events.CHAT_CHANGED, () => scheduleRefresh(true)),
    ];

    return () => {
      window.clearTimeout(refreshTimer);
      listeners.forEach(listener => listener.stop());
    };
  }, [refreshRuntime]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const nextFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(nextFullscreen);

      if (!nextFullscreen) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const latestAssistantMessage = [...messages].reverse().find(message => message.role === 'assistant') ?? null;
  const latestOptions = latestAssistantMessage?.options ?? [];
  const isImmersive = isFullscreen || isExpanded;

  async function runSessionRequest(
    executor: (hooks: {
      onUserEcho: (display: string) => void;
      onStream: (text: string) => void;
      onVariableUpdateStart: () => void;
    }) => Promise<unknown>,
    failureLogLabel: string,
    failureToast: string,
  ) {
    if (isGenerating || isUpdatingState) {
      return;
    }

    setActiveModal(null);
    setIsGenerating(true);
    setIsUpdatingState(false);
    setPendingUserText('');
    setStreamText('');
    const requestStartedAt = performance.now();
    let variableUpdateStartedAt: number | null = null;

    try {
      await executor({
        onUserEcho: display => {
          startTransition(() => {
            setPendingUserText(display);
          });
        },
        onStream: nextText => {
          startTransition(() => {
            setStreamText(nextText);
          });
        },
        onVariableUpdateStart: () => {
          variableUpdateStartedAt = performance.now();
          startTransition(() => {
            setIsGenerating(false);
            setIsUpdatingState(true);
          });
        },
      });

      if (variableUpdateStartedAt !== null) {
        const elapsed = performance.now() - variableUpdateStartedAt;
        if (elapsed < 520) {
          await waitFor(520 - elapsed);
        }
      } else {
        const elapsed = performance.now() - requestStartedAt;
        if (elapsed < 240) {
          await waitFor(240 - elapsed);
        }
      }

      await refreshRuntime();
    } catch (error) {
      console.error(failureLogLabel, error);
      toastr.error(failureToast, '西幻宿主');

      try {
        await refreshRuntime();
      } catch {
        //
      }
    } finally {
      startTransition(() => {
        setPendingUserText('');
        setStreamText('');
        setIsGenerating(false);
        setIsUpdatingState(false);
      });
    }
  }

  async function handleSend(text: string, commands: SessionHostCommandPayload[] = []) {
    await runSessionRequest(
      hooks =>
        sendSessionHostRequest({
          text,
          commands,
          ...hooks,
        }),
      '[west-fantasy-host] 发送请求失败',
      '请求发送失败，请查看控制台错误。',
    );
  }

  async function handleRegenerate(assistantMessageId: number) {
    if (!window.confirm('确认重新生成最新一轮回复？')) {
      return;
    }

    await runSessionRequest(
      hooks => regenerateSessionHostTurn(assistantMessageId, hooks),
      '[west-fantasy-host] 重生成失败',
      '重生成失败，请查看控制台错误。',
    );
  }

  async function handleCommand(command: SessionHostCommandPayload) {
    if (command.requiresConfirm && !window.confirm(`确认执行「${command.label}」？`)) {
      return;
    }

    await handleSend('', [command]);
  }

  async function handleRuleChange(groupName: string, itemKey: string, value: string | number | boolean) {
    try {
      const nextState = await patchLatestState(draft => {
        draft.法则.分组 = draft.法则.分组.map(group =>
          group.名称 === groupName
            ? {
                ...group,
                项目: group.项目.map(item => (item.键 === itemKey ? { ...item, 值: value as never } : item)),
              }
            : group,
        );
      });

      startTransition(() => {
        setState(nextState);
      });
    } catch (error) {
      console.error('[west-fantasy-host] 法则写回失败', error);
      toastr.error('法则写回失败。', '西幻宿主');
    }
  }

  async function toggleFullscreenMode() {
    if (isImmersive) {
      setIsExpanded(false);
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (error) {
          console.warn('[west-fantasy-host] 退出全屏失败', error);
        }
      }
      return;
    }

    const fullscreenTarget = document.documentElement;
    const fallbackTarget = shellRef.current;
    setIsExpanded(true);

    try {
      if (fullscreenTarget.requestFullscreen) {
        await fullscreenTarget.requestFullscreen();
        return;
      }

      if (fallbackTarget?.requestFullscreen) {
        await fallbackTarget.requestFullscreen();
      }
    } catch (error) {
      console.warn('[west-fantasy-host] 浏览器全屏不可用，已回退为沉浸模式', error);
    }
  }

  if (isBooting) {
    return <div className="flex h-full min-h-[720px] items-center justify-center text-stone-300">西幻宿主加载中...</div>;
  }

  return (
    <div
      className={`west-root relative flex h-full min-h-[720px] w-full text-stone-100 ${
        isImmersive ? 'items-stretch justify-stretch overflow-hidden' : 'items-center justify-center overflow-auto p-6'
      }`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="west-glow west-glow-left" />
        <div className="west-glow west-glow-right" />
        <div className="west-noise" />
      </div>

      <button
        onClick={() => void toggleFullscreenMode()}
        className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-full border border-amber-100/12 bg-stone-950/78 px-4 py-2 text-sm tracking-[0.18em] text-stone-100 shadow-[0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all hover:border-amber-200/24 hover:bg-stone-900/88"
      >
        {isImmersive ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        <span>{isImmersive ? '退出全屏' : '全屏'}</span>
      </button>

      <div
        ref={shellRef}
        className={`west-shell relative z-10 flex overflow-hidden ${
          isImmersive
            ? 'h-full min-h-0 w-full rounded-none border-0 shadow-none'
            : 'h-full min-h-[720px] w-[1400px] min-w-[1400px] max-w-[1400px] rounded-[2rem] border border-amber-100/10 shadow-[0_30px_90px_rgba(0,0,0,0.4)]'
        }`}
      >
        <Sidebar activeModal={activeModal} setActiveModal={setActiveModal} />

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <ChatArea
            state={state}
            messages={deferredMessages}
            pendingUserText={pendingUserText}
            streamText={streamText}
            isGenerating={isGenerating}
            isUpdatingState={isUpdatingState}
            latestOptions={latestOptions}
            onSubmit={text => void handleSend(text)}
            onQuickOption={option => void handleSend(option)}
            onRegenerate={assistantMessageId => void handleRegenerate(assistantMessageId)}
            onSceneAction={action =>
              void handleCommand({
                type: action.命令类型,
                target: action.目标,
                label: action.标签,
                description: action.描述,
                requiresConfirm: action.需要确认,
              })
            }
          />
        </main>
      </div>

      {isOpening && (
        <OpeningOverlay
          initialValue={createOpeningFormData(state)}
          onSubmit={async form => {
            const openingState = createOpeningState(form);
            await updateInitvarWorldbookEntry(openingState);
            await createOpeningStoryMessage(openingState);
            await checkAndUpdateChronicle();
            await refreshRuntime();
          }}
        />
      )}

      <AnimatePresence>
        {activeModal === 'members' && <MembersModal state={state} onClose={() => setActiveModal(null)} />}
        {activeModal === 'map' && (
          <MapModal state={state} onClose={() => setActiveModal(null)} onTravel={command => void handleCommand(command)} />
        )}
        {activeModal === 'location' && (
          <LocationModal state={state} onClose={() => setActiveModal(null)} onAction={command => void handleCommand(command)} />
        )}
        {activeModal === 'status' && <StatusModal state={state} onClose={() => setActiveModal(null)} />}
        {activeModal === 'rules' && (
          <RulesModal
            state={state}
            onClose={() => setActiveModal(null)}
            onRuleChange={(groupName, itemKey, value) => void handleRuleChange(groupName, itemKey, value)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
