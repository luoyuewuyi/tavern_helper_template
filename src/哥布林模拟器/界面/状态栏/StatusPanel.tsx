import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Skull, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export interface StatusData {
  basicInfo: { name: string; level: number; raceClass: string };
  godInfo: { godName: string; graceLevel: string; ruleStatus: string };
  attributes: { str: { val: number; max: number }; agi: { val: number; max: number }; mag: { val: number; max: number }; con: { val: number; max: number }; per: { val: number; max: number } };
  evolution: { form: string; nextGoal: string; geneProgress: number };
  infamy: { level: number; status: string };
  lair: { level: string; population: string; buildings: string[] };
  location: { place: string; terrainBuff: string };
  special: { marks: string[]; mutations: string[]; buffs: string[] };
  captives: { count: number; corrupted: number };
  actions: string[];
}

export default function StatusPanel({ data }: { data: StatusData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fb = (v: any) => v || '—';

  const AttrBar = ({ label, attr }: { label: string; attr: { val: number; max: number } }) => {
    const safeVal = attr?.val ?? 0, safeMax = attr?.max ?? 20, pct = Math.min(100, Math.max(0, (safeVal / safeMax) * 100));
    return <div className="flex items-center gap-3 text-xs w-full"><span className="w-8 text-[var(--color-bone-300)] font-bold">{label}</span><div className="flex-1 h-1.5 bg-[var(--color-swamp-950)] border border-[var(--color-swamp-800)] overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--color-gold-800)] to-[var(--color-gold-500)]" style={{ width: `${pct}%` }} /></div><span className="w-6 text-right font-mono text-[var(--color-gold-600)]">{safeVal}</span></div>;
  };

  return (
    <div className="my-6 border border-[var(--color-gold-900)] bg-texture-scroll shadow-lg overflow-hidden transition-all duration-300">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[var(--color-swamp-950)] to-[var(--color-swamp-800)] border-b border-[var(--color-swamp-700)] outline-none hover:bg-[var(--color-swamp-800)] transition-colors cursor-pointer font-[inherit]">
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span className="text-[var(--color-gold-500)] border-b border-[var(--color-gold-800)] pb-0.5">{fb(data.basicInfo?.name)}</span>
          <span className="text-[var(--color-bone-200)]">LV.{fb(data.basicInfo?.level)}</span>
          <div className="w-px h-3 bg-[var(--color-swamp-700)]" />
          <span className="text-[var(--color-bone-300)] flex items-center gap-1"><MapPin size={12} /> {fb(data.location?.place)}</span>
          <div className="w-px h-3 bg-[var(--color-swamp-700)] hidden md:block" />
          <span className={cn("hidden md:flex items-center gap-1 font-bold", data.infamy?.level > 5 ? 'text-[var(--color-blood-800)]' : 'text-yellow-600')}><Skull size={12} /> 恶名:{fb(data.infamy?.level)}</span>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-[var(--color-gold-700)]" /> : <ChevronDown size={16} className="text-[var(--color-gold-700)]" />}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-3 bg-[var(--color-swamp-950)] border border-[var(--color-swamp-800)] space-y-2">
                  <h3 className="text-[10px] uppercase text-[var(--color-gold-700)] tracking-widest border-b border-[var(--color-swamp-800)] pb-1 mb-2">存在刻痕</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-[var(--color-bone-200)]"><div>阶级: <span className="text-[var(--color-gold-500)]">{fb(data.basicInfo?.raceClass)}</span></div><div>信仰: <span className="text-purple-400">{fb(data.godInfo?.godName)}</span></div><div>神恩: <span>{fb(data.godInfo?.graceLevel)}</span></div><div>戒律: <span>{fb(data.godInfo?.ruleStatus)}</span></div></div>
                </div>
                <div className="p-3 bg-[var(--color-swamp-950)] border border-[var(--color-swamp-800)]">
                  <h3 className="text-[10px] uppercase text-[var(--color-gold-700)] tracking-widest border-b border-[var(--color-swamp-800)] pb-1 mb-3">起源之血</h3>
                  <div className="space-y-2"><AttrBar label="力量" attr={data.attributes?.str} /><AttrBar label="敏捷" attr={data.attributes?.agi} /><AttrBar label="魔力" attr={data.attributes?.mag} /><AttrBar label="体质" attr={data.attributes?.con} /><AttrBar label="感知" attr={data.attributes?.per} /></div>
                </div>
                <div className="p-3 bg-[var(--color-swamp-950)] border border-[var(--color-swamp-800)]">
                  <h3 className="text-[10px] uppercase text-[var(--color-gold-700)] tracking-widest border-b border-[var(--color-swamp-800)] pb-1 mb-2">异化进程</h3>
                  <div className="flex flex-col gap-2 text-sm text-[var(--color-bone-200)]"><div className="flex justify-between">形态: <span>{fb(data.evolution?.form)}</span></div><div className="flex justify-between">目标: <span className="text-[var(--color-bone-300)] italic">{fb(data.evolution?.nextGoal)}</span></div><div className="mt-1 flex items-center gap-2 text-xs"><span className="text-purple-400">基因</span><div className="flex-1 h-1 bg-[var(--color-swamp-800)]"><div className="h-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]" style={{ width: `${Math.min(100, data.evolution?.geneProgress || 0)}%` }} /></div><span>{data.evolution?.geneProgress || 0}%</span></div></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className={cn("p-3 border mt-1", data.infamy?.level > 5 ? "border-[var(--color-blood-900)] bg-[var(--color-swamp-950)]" : "border-[var(--color-swamp-800)] bg-[var(--color-swamp-950)]")}>
                  <h3 className="text-[10px] uppercase text-[var(--color-gold-700)] tracking-widest border-b border-[var(--color-swamp-800)] pb-1 mb-2">世界的恶意</h3>
                  <div className="flex justify-between items-center px-3 py-2 border border-black/50 bg-gradient-to-r from-black/50 to-transparent"><div className="font-bold text-lg" style={{ color: data.infamy?.level > 5 ? '#c44' : data.infamy?.level > 2 ? '#ca5' : '#4a7' }}>阶级 {data.infamy?.level || 0}</div><div className="text-sm text-[var(--color-bone-200)]">{fb(data.infamy?.status)}</div></div>
                  <div className="mt-3 text-xs text-[var(--color-bone-300)] flex justify-between"><span>{fb(data.location?.place)}</span><span className="italic opacity-70">{fb(data.location?.terrainBuff)}</span></div>
                </div>
                <div className="p-3 bg-[var(--color-swamp-950)] border border-[var(--color-swamp-800)]">
                  <h3 className="text-[10px] uppercase text-[var(--color-gold-700)] tracking-widest border-b border-[var(--color-swamp-800)] pb-1 mb-2">深渊结界</h3>
                  <div className="flex justify-between text-sm mb-2 text-[var(--color-bone-200)]"><span>等级: {fb(data.lair?.level)}</span><span>子民: {fb(data.lair?.population)}</span></div>
                  <div className="flex flex-wrap gap-1">{data.lair?.buildings?.length > 0 ? data.lair.buildings.map((b, i) => <span key={i} className="text-[10px] border border-[var(--color-swamp-700)] bg-[var(--color-swamp-800)] px-1.5 py-0.5">{b}</span>) : <span className="text-xs italic opacity-50">流浪中...</span>}</div>
                  {(data.captives?.count > 0 || data.captives?.corrupted > 0) && <div className="mt-3 pt-2 border-t border-[var(--color-swamp-800)] flex justify-between text-xs text-[var(--color-bone-300)]"><span>俘虏: <span className="text-[var(--color-blood-800)] font-bold">{data.captives.count}</span></span><span>堕落母体: <span className="text-purple-400 font-bold">{data.captives.corrupted}</span></span></div>}
                </div>
                <div className="p-3 bg-[var(--color-swamp-950)] border border-[var(--color-swamp-800)]">
                  <h3 className="text-[10px] uppercase text-[var(--color-gold-700)] tracking-widest border-b border-[var(--color-swamp-800)] pb-1 mb-2">混沌残响</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {data.special?.marks?.map((m, i) => <span key={'m'+i} className="text-[var(--color-gold-500)] bg-[var(--color-gold-900)]/20 px-1 border border-[var(--color-gold-900)]/50">{m}</span>)}
                    {data.special?.mutations?.map((m, i) => <span key={'mu'+i} className="text-purple-400 bg-purple-900/20 px-1 border border-purple-900/50">{m}</span>)}
                    {data.special?.buffs?.map((b, i) => <span key={'b'+i} className="text-green-400 bg-green-900/20 px-1 border border-green-900/50">{b}</span>)}
                    {(!data.special?.marks?.length && !data.special?.mutations?.length && !data.special?.buffs?.length) && <span className="italic opacity-50">无</span>}
                  </div>
                </div>
              </div>
            </div>
            {data.actions?.length > 0 && (
              <div className="p-4 bg-[var(--color-swamp-950)] border-t border-[var(--color-swamp-700)]">
                <h3 className="text-[10px] uppercase text-[var(--color-gold-700)] tracking-widest mb-2 flex items-center gap-1"><Swords size={12} /> 命运之轮</h3>
                <div className="flex flex-col gap-2">{data.actions.map((act, i) => <div key={i} className="text-sm px-3 py-2 border border-[var(--color-swamp-700)] hover:border-[var(--color-gold-800)] bg-[var(--color-swamp-900)] text-[var(--color-bone-100)] cursor-pointer transition-colors relative overflow-hidden"><div className="absolute top-0 left-0 h-full w-1 bg-[var(--color-swamp-700)] group-hover:bg-[var(--color-gold-600)] transition-colors" /><span className="opacity-50 text-xs mr-2 font-mono">[{i + 1}]</span>{act}</div>)}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
