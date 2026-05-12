import GlassModal from '../ui/GlassModal';
import { WestFantasyState } from '../../types';

interface MembersModalProps {
  state: WestFantasyState;
  onClose: () => void;
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs tracking-[0.18em] text-stone-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-950/60">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#c48a4a,#f2d8a7)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function MembersModal({ state, onClose }: MembersModalProps) {
  return (
    <GlassModal title="同行成员" subtitle="当前可接触对象与关系面板。" onClose={onClose}>
      <div className="grid gap-5 xl:grid-cols-2">
        {state.成员.列表.map(member => (
          <article
            key={member.目标}
            className="rounded-[1.6rem] border border-amber-100/10 bg-stone-950/45 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-100/15 bg-[radial-gradient(circle_at_30%_30%,rgba(201,157,96,0.32),rgba(33,21,18,0.95))] font-display text-xl text-amber-100">
                {member.姓名.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl text-stone-50">{member.姓名}</h3>
                  <span className="rounded-full border border-amber-100/10 bg-amber-100/5 px-3 py-1 text-xs text-amber-100/85">
                    {member.种族} / {member.职业}
                  </span>
                  {member.是否正式承诺 && (
                    <span className="rounded-full bg-amber-200/12 px-3 py-1 text-xs text-amber-100">正式承诺</span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-7 text-stone-300">{member.外观摘要}</p>
                <p className="mt-3 rounded-2xl bg-stone-900/55 px-4 py-3 text-sm leading-7 text-stone-300">
                  {member.当前评价}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <MetricBar label="好感" value={member.好感} />
              <MetricBar label="信任" value={member.信任} />
              <MetricBar label="吸引" value={member.吸引} />
              <MetricBar label="边界尊重度" value={member.边界尊重度} />
            </div>
            <div className="mt-4 text-xs tracking-[0.18em] text-stone-500">关系状态 / {member.关系状态}</div>
          </article>
        ))}
      </div>
    </GlassModal>
  );
}
