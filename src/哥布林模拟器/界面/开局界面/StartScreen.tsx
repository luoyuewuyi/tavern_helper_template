import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dices, Skull } from 'lucide-react';
import { cn } from '../lib/utils';
import { GodsData, EventsData, DifficultyData } from '../lib/data';

interface Props { onStart: (data: any) => void; }
const GoblinNames = ['格尔什','巴克','斯尼克','格鲁兹','碎骨者','毒牙','泥沼','黑皮','烂牙','血钩'];

export default function StartScreen({ onStart }: Props) {
  const [name, setName] = useState('');
  const [selectedGod, setSelectedGod] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState('normal');
  const [customSetting, setCustomSetting] = useState('');
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const isFormValid = name.trim().length > 0 && selectedEvent !== null;

  const handleSubmit = () => {
    if (!isFormValid) return;
    onStart({ name, god: selectedGod || 'none', event: selectedEvent, difficulty, customSetting });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-5xl md:text-6xl font-title text-[var(--color-gold-500)] drop-shadow-[0_0_15px_rgba(212,184,114,0.3)] tracking-widest">哥布林模拟器</h1>
        <p className="text-sm md:text-base text-[var(--color-bone-300)] tracking-widest uppercase opacity-80">神陨纪元第347年 · 维斯特拉大陆</p>
        <div className="h-px w-64 mx-auto bg-gradient-to-r from-transparent via-[var(--color-gold-700)] to-transparent mt-4 opacity-50" />
      </div>

      <div className="space-y-8 bg-texture-scroll p-6 md:p-8 border border-[var(--color-swamp-700)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-gold-800)] opacity-50 m-2" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--color-gold-800)] opacity-50 m-2" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--color-gold-800)] opacity-50 m-2" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-gold-800)] opacity-50 m-2" />

        <section className="space-y-3 relative z-10">
          <label className="block text-[var(--color-gold-500)] text-lg font-semibold tracking-wider">真名刻板</label>
          <div className="flex gap-2">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="输入哥布林的名字..." className="flex-1 bg-[var(--color-swamp-900)] border border-[var(--color-swamp-700)] text-[var(--color-bone-100)] px-4 py-3 outline-none focus:border-[var(--color-gold-700)] transition-all placeholder:text-[var(--color-bone-300)] placeholder:opacity-50 font-[inherit]" />
            <button onClick={() => setName(GoblinNames[Math.floor(Math.random()*GoblinNames.length)])} title="随机名字" className="bg-[var(--color-swamp-900)] border border-[var(--color-swamp-700)] hover:border-[var(--color-gold-700)] px-4 py-3 text-[var(--color-gold-600)] transition-all flex items-center"><Dices size={20} /></button>
          </div>
        </section>

        <section className="space-y-3 relative z-10">
          <label className="block text-[var(--color-gold-500)] text-lg font-semibold tracking-wider">神灵眷属 <span className="text-sm opacity-60 font-normal">(可选)</span></label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GodsData.filter(g => !g.hidden).map(god => (
              <button key={god.id} onClick={() => setSelectedGod(selectedGod === god.id ? null : god.id)}
                className={cn("p-3 border text-left flex flex-col gap-1 transition-all font-[inherit] cursor-pointer",
                  selectedGod === god.id ? "border-[var(--color-gold-700)] bg-[var(--color-void-900)] shadow-[0_0_15px_rgba(107,33,168,0.3)] border-gold-glow" : "border-[var(--color-swamp-700)] bg-[var(--color-swamp-900)] hover:border-[var(--color-swamp-500)] opacity-80 hover:opacity-100")}>
                <div className="flex justify-between items-center"><span className="font-bold text-[var(--color-bone-50)] text-sm">{god.name}</span>{god.id==='death'&&<Skull size={14} className="text-[var(--color-bone-300)] opacity-50"/>}</div>
                <span className="text-xs text-[var(--color-gold-600)]">{god.domain}</span>
                <span className="text-xs text-[var(--color-bone-300)] mt-1">核心: {god.power}</span>
                <span className="text-xs text-[var(--color-blood-800)] font-medium">戒律: {god.rule}</span>
              </button>
            ))}
            <button onClick={() => setSelectedGod('none')}
              className={cn("p-3 border text-left flex flex-col justify-center items-center gap-1 transition-all font-[inherit] cursor-pointer",
                selectedGod === 'none' ? "border-[var(--color-blood-800)] bg-[var(--color-blood-900)] shadow-[0_0_15px_rgba(122,26,26,0.3)] border-gold-glow" : "border-[var(--color-swamp-700)] bg-[var(--color-swamp-900)] hover:border-[var(--color-swamp-500)] opacity-80 hover:opacity-100")}>
              <span className="font-bold text-[var(--color-bone-50)] text-center w-full text-sm">拒绝神灵</span>
              <span className="text-xs text-[var(--color-bone-300)] text-center w-full mt-1">无信者之路</span>
            </button>
          </div>
        </section>

        <section className="space-y-3 relative z-10">
          <label className="block text-[var(--color-gold-500)] text-lg font-semibold tracking-wider">开局事件 <span className="text-sm text-[var(--color-blood-800)]">*必选</span></label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EventsData.map(evt => (
              <button key={evt.id} onClick={() => setSelectedEvent(evt.id)}
                className={cn("p-4 border text-left flex flex-col gap-2 transition-all relative overflow-hidden font-[inherit] cursor-pointer",
                  selectedEvent === evt.id ? "border-gold-glow bg-[var(--color-swamp-900)] shadow-[0_0_15px_rgba(140,119,67,0.15)]" : "border-[var(--color-swamp-700)] bg-[var(--color-swamp-950)] hover:border-[var(--color-swamp-500)] opacity-80 hover:opacity-100")}>
                {selectedEvent===evt.id && <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[var(--color-gold-800)] to-transparent opacity-20" />}
                <span className="font-bold text-[var(--color-gold-500)] text-lg">{evt.name}</span>
                <span className="text-sm text-[var(--color-bone-200)] leading-relaxed italic opacity-90">&ldquo;{evt.desc}&rdquo;</span>
                <div className="flex gap-4 mt-2 pt-2 border-t border-[var(--color-swamp-800)] text-xs">
                  <div className="flex flex-col gap-1"><span className="text-[var(--color-swamp-500)]">初始资源</span><span className="text-[var(--color-bone-100)]">{evt.resource}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[var(--color-blood-900)] font-bold">主要风险</span><span className="text-[var(--color-blood-800)]">{evt.risk}</span></div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 relative z-10">
          <label className="block text-[var(--color-gold-500)] text-lg font-semibold tracking-wider">生存难度</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DifficultyData.map(d => (
              <button key={d.id} onClick={() => setDifficulty(d.id)}
                className={cn("p-3 border text-center transition-all flex flex-col gap-1 items-center font-[inherit] cursor-pointer",
                  difficulty===d.id ? "border-[var(--color-gold-600)] bg-[var(--color-swamp-900)] text-[var(--color-gold-500)] shadow-[inset_0_0_10px_rgba(140,119,67,0.2)]" : "border-[var(--color-swamp-700)] bg-[var(--color-swamp-950)] text-[var(--color-bone-300)] hover:border-[var(--color-swamp-500)]")}>
                <span className="font-bold">{d.name}</span><span className="text-[10px] opacity-70 leading-tight">{d.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 relative z-10">
          <button onClick={() => setIsCustomExpanded(!isCustomExpanded)} className="flex items-center gap-2 text-[var(--color-gold-700)] hover:text-[var(--color-gold-500)] transition-colors text-sm font-semibold tracking-wider uppercase bg-transparent border-none cursor-pointer font-[inherit]">
            <span className="text-lg leading-none">{isCustomExpanded ? '−' : '+'}</span> 自定义法则
          </button>
          <AnimatePresence>
            {isCustomExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <textarea value={customSetting} onChange={e => setCustomSetting(e.target.value)} placeholder="输入额外的初始设定（如：主角有一只瞎眼，左臂畸形粗大...），供命运之手参考。" className="w-full bg-[var(--color-swamp-950)] border border-[var(--color-swamp-700)] text-[var(--color-bone-100)] p-4 min-h-[100px] outline-none focus:border-[var(--color-gold-700)] transition-all resize-y mt-2 text-sm placeholder:text-[var(--color-bone-300)] placeholder:opacity-40 font-[inherit]" />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="pt-8 flex flex-col items-center gap-3 relative z-10">
          <button onClick={handleSubmit} disabled={!isFormValid}
            className={cn("px-10 py-4 font-bold text-lg tracking-[0.2em] transition-all relative overflow-hidden group font-[inherit] cursor-pointer",
              isFormValid ? "bg-[var(--color-gold-800)] text-[var(--color-swamp-950)] hover:bg-[var(--color-gold-600)] shadow-[0_0_20px_rgba(140,119,67,0.3)] border border-[var(--color-gold-500)]" : "bg-[var(--color-swamp-800)] text-[var(--color-swamp-700)] cursor-not-allowed border border-[var(--color-swamp-700)]")}>
            {isFormValid && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />}
            选择我的命运
          </button>
          {!isFormValid && <span className="text-[var(--color-blood-800)] text-sm animate-pulse">*神明要求你提供一个【真名】与【开局事件】</span>}
        </div>
      </div>
    </div>
  );
}
