import GlassModal from '../ui/GlassModal';
import { WestFantasyState } from '../../types';

interface StatusModalProps {
  state: WestFantasyState;
  onClose: () => void;
}

function StatusBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-stone-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-950/60">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#bd7f47,#f1d5a1)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function StatusModal({ state, onClose }: StatusModalProps) {
  return (
    <GlassModal title="主角状态" subtitle="资源、周期与个人偏好摘要。" onClose={onClose}>
      <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <section className="space-y-5 rounded-[1.8rem] border border-amber-100/10 bg-stone-950/45 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.4rem] border border-amber-100/15 bg-[radial-gradient(circle_at_35%_30%,rgba(194,145,84,0.34),rgba(26,16,12,0.98))] font-display text-2xl text-amber-100">
              {state.主角.姓名.slice(0, 1)}
            </div>
            <div>
              <h3 className="font-display text-3xl text-stone-50">{state.主角.姓名}</h3>
              <p className="mt-1 text-sm text-stone-400">{state.主角.身份}</p>
            </div>
          </div>
          <StatusBar label="体力" value={state.主角.体力} />
          <StatusBar label="欲望波动" value={state.主角.欲望波动} />
          <StatusBar label="实际接受度" value={state.主角.实际接受度} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.2rem] bg-stone-900/60 p-4">
              <div className="text-xs tracking-[0.18em] text-stone-500">金钱</div>
              <div className="mt-2 font-display text-3xl text-amber-100">{state.主角.金钱}</div>
            </div>
            <div className="rounded-[1.2rem] bg-stone-900/60 p-4">
              <div className="text-xs tracking-[0.18em] text-stone-500">声望</div>
              <div className="mt-2 font-display text-3xl text-amber-100">{state.主角.声望}</div>
            </div>
          </div>
          <div className="rounded-[1.2rem] bg-stone-900/60 p-4 text-sm leading-7 text-stone-300">
            {state.主角.心情文本}
          </div>
        </section>

        <section className="space-y-5">
          <article className="rounded-[1.8rem] border border-amber-100/10 bg-stone-950/45 p-6">
            <div className="text-xs tracking-[0.26em] text-stone-500">周期</div>
            <div className="mt-3 font-display text-3xl text-stone-50">{state.主角.周期.状态}</div>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              当前天数 {state.主角.周期.当前天数} / 周期长度 {state.主角.周期.周期长度}
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-300">{state.主角.周期.身体感受}</p>
          </article>

          <article className="rounded-[1.8rem] border border-amber-100/10 bg-stone-950/45 p-6">
            <div className="text-xs tracking-[0.26em] text-stone-500">偏好摘要</div>
            <div className="mt-4 space-y-4 text-sm leading-7 text-stone-300">
              <p>
                <span className="text-amber-100/85">外貌偏好：</span>
                {state.主角.偏好摘要.外貌偏好}
              </p>
              <p>
                <span className="text-amber-100/85">关系偏好：</span>
                {state.主角.偏好摘要.关系偏好}
              </p>
              <p>
                <span className="text-amber-100/85">节奏偏好：</span>
                {state.主角.偏好摘要.节奏偏好}
              </p>
              <p>
                <span className="text-amber-100/85">禁忌摘要：</span>
                {state.主角.偏好摘要.禁忌摘要}
              </p>
            </div>
          </article>
        </section>
      </div>
    </GlassModal>
  );
}
