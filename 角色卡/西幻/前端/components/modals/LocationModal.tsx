import GlassModal from '../ui/GlassModal';
import { SessionHostCommandPayload, WestFantasyState } from '../../types';

interface LocationModalProps {
  state: WestFantasyState;
  onClose: () => void;
  onAction: (command: SessionHostCommandPayload) => void;
}

export default function LocationModal({ state, onClose, onAction }: LocationModalProps) {
  return (
    <GlassModal title="当前地点" subtitle="地点信息与前端候选动作。" onClose={onClose}>
      <section className="rounded-[1.8rem] border border-amber-100/10 bg-stone-950/45 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-3xl text-stone-50">{state.地点.名称}</h3>
          <span className="rounded-full border border-amber-100/10 bg-amber-100/5 px-3 py-1 text-xs tracking-[0.18em] text-amber-100/80">
            {state.地点.所属城镇}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-stone-300">{state.地图.当前区域文案}</p>
      </section>

      <section className="mt-6 space-y-4">
        <div className="text-xs tracking-[0.26em] text-stone-500">地点动作</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {state.地点.候选动作.map(action => (
            <button
              key={`${action.命令类型}-${action.目标}-${action.标签}`}
              onClick={() =>
                onAction({
                  type: action.命令类型,
                  target: action.目标,
                  label: action.标签,
                  description: action.描述,
                  requiresConfirm: action.需要确认,
                })
              }
              className="rounded-[1.4rem] border border-amber-100/10 bg-stone-950/45 px-5 py-4 text-left transition-all hover:border-amber-200/20 hover:bg-stone-900/70"
            >
              <div className="font-display text-xl text-stone-50">{action.标签}</div>
              <div className="mt-2 text-xs tracking-[0.18em] text-amber-100/75">{action.类型}</div>
              <p className="mt-3 text-sm leading-7 text-stone-300">{action.描述}</p>
            </button>
          ))}
        </div>
      </section>
    </GlassModal>
  );
}
