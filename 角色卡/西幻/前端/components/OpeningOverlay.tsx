import { useState } from 'react';
import { OpeningFormData } from '../types';

interface OpeningOverlayProps {
  initialValue: OpeningFormData;
  onSubmit: (value: OpeningFormData) => Promise<void>;
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-2xl text-stone-50">{title}</h3>
      <p className="mt-1 text-sm text-stone-400">{description}</p>
    </div>
  );
}

function TextField(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <div className="text-xs tracking-[0.18em] text-stone-500">{props.label}</div>
      <input
        type="text"
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
        className="w-full rounded-[1rem] border border-amber-100/10 bg-stone-950/80 px-4 py-3 text-sm text-stone-100 outline-none transition-colors focus:border-amber-200/30"
      />
    </label>
  );
}

function TextAreaField(props: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <div className="text-xs tracking-[0.18em] text-stone-500">{props.label}</div>
      <textarea
        rows={3}
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
        className="custom-scrollbar w-full rounded-[1rem] border border-amber-100/10 bg-stone-950/80 px-4 py-3 text-sm leading-7 text-stone-100 outline-none transition-colors focus:border-amber-200/30"
      />
    </label>
  );
}

export default function OpeningOverlay({ initialValue, onSubmit }: OpeningOverlayProps) {
  const [form, setForm] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[rgba(8,5,4,0.72)] px-4 py-6 backdrop-blur-md sm:px-8 sm:py-8">
      <div className="mx-auto w-[1400px] min-w-[1400px] max-w-[1400px] rounded-[2rem] border border-amber-100/15 bg-[rgba(16,10,8,0.94)] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="border-b border-amber-100/10 px-6 py-6 sm:px-8">
          <div className="text-xs tracking-[0.32em] text-amber-100/70">OPENING</div>
          <h2 className="mt-3 font-display text-4xl text-stone-50">西幻开局设定</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-400">
            开局只收集主角基础信息。地点、地区、周期、偏好与法则先沿用默认世界书，进入游戏后再从界面里调整。
          </p>
        </div>

        <form
          onSubmit={async event => {
            event.preventDefault();
            setIsSubmitting(true);
            try {
              await onSubmit(form);
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="space-y-8 px-6 py-6 sm:px-8"
        >
          <section className="rounded-[1.8rem] border border-amber-100/10 bg-stone-950/45 p-5">
            <SectionTitle title="主角基础" description="只保留最必要的人物信息，其他参数进入游戏后再调。" />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="姓名"
                value={form.主角.姓名}
                onChange={value => setForm(current => ({ ...current, 主角: { ...current.主角, 姓名: value } }))}
              />
              <TextField
                label="身份"
                value={form.主角.身份}
                onChange={value => setForm(current => ({ ...current, 主角: { ...current.主角, 身份: value } }))}
              />
              <TextField
                label="头像 URL"
                value={form.主角.头像}
                onChange={value => setForm(current => ({ ...current, 主角: { ...current.主角, 头像: value } }))}
              />
            </div>
            <div className="mt-4">
              <TextAreaField
                label="当前心情"
                value={form.主角.心情文本}
                onChange={value => setForm(current => ({ ...current, 主角: { ...current.主角, 心情文本: value } }))}
              />
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-amber-100/10 bg-stone-950/45 p-5">
            <SectionTitle title="默认开局说明" description="这些内容会直接沿用默认世界书，不再要求你手填。" />
            <div className="grid gap-4 text-sm leading-7 text-stone-300 sm:grid-cols-2">
              <div className="rounded-[1rem] bg-stone-900/55 p-4">
                <div className="text-xs tracking-[0.18em] text-stone-500">默认地点</div>
                <div className="mt-2 text-stone-100">潮汐关，港口外环的旅店街</div>
              </div>
              <div className="rounded-[1rem] bg-stone-900/55 p-4">
                <div className="text-xs tracking-[0.18em] text-stone-500">默认规则</div>
                <div className="mt-2 text-stone-100">进入游戏后在法则面板内再调整</div>
              </div>
              <div className="rounded-[1rem] bg-stone-900/55 p-4">
                <div className="text-xs tracking-[0.18em] text-stone-500">默认身体参数</div>
                <div className="mt-2 text-stone-100">周期、体力、欲望波动沿用默认初始值</div>
              </div>
              <div className="rounded-[1rem] bg-stone-900/55 p-4">
                <div className="text-xs tracking-[0.18em] text-stone-500">默认偏好摘要</div>
                <div className="mt-2 text-stone-100">后续如需微调，可再通过世界书或规则界面处理</div>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[linear-gradient(90deg,#b87c40,#edcf98)] px-7 py-3 font-medium text-stone-950 transition-opacity disabled:opacity-60"
            >
              {isSubmitting ? '正在创建开局...' : '写入开局并进入冒险'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
