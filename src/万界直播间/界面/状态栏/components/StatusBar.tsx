import React from 'react';
import { useDataStore } from '../store';
import { Tv, MapPin, User, Star, Coins, Home, Backpack, ClipboardList, Users, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StatusBar() {
  const { data } = useDataStore();
  const config = data.直播配置;
  const protagonist = data.主角;
  const points = data.积分与投币;
  const residence = data.住处;

  if (config.阶段 === '开局') {
    return (
      <div className="neon-border-box p-4 text-neon-blue text-center font-mono animate-pulse max-w-md mx-auto shadow-lg backdrop-blur bg-slate-900/80">
        [SYS] 等待角色创建...
      </div>
    );
  }

  const npcEntries = Object.entries(data.NPC || {});
  const aliveCount = npcEntries.filter(([_, n]) => n.存活).length;
  const totalNpc = npcEntries.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="neon-border-box p-4 md:p-5 font-mono text-sm space-y-4 max-w-md mx-auto w-full bg-slate-900/85 backdrop-blur shadow-2xl border-neon-blue/40 text-slate-200"
    >
      {/* Header Info */}
      <div className="border-b border-neon-blue/20 pb-3 space-y-2">
        <div className="flex justify-between items-center text-neon-blue font-bold text-base">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4" /> 
            万界直播间 · {config.类型}
          </div>
          <div className="text-neon-danger border border-neon-danger/30 px-2 py-0.5 rounded bg-neon-danger/10 text-xs">
            {config.难度}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">📅 第 {config.当前天数} / {config.总天数} 天</span>
          <span className="flex items-center gap-1 text-neon-gold">
            <MapPin className="w-3 h-3" /> {config.地点}
          </span>
        </div>
      </div>

      {/* Protagonist Info */}
      <div className="border-b border-neon-blue/20 pb-3 space-y-2">
        <div className="flex items-center text-neon-purple font-bold gap-2">
          <User className="w-4 h-4" /> {protagonist.姓名} · 年龄 {protagonist.年龄}
        </div>
        <div className="flex gap-4 pl-6">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-neon-gold" /> 积分: {points.积分}
          </span>
          <span className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-400" /> 投币: {points.观众投币}
          </span>
        </div>
      </div>

      {/* Assets & Residence */}
      <div className="border-b border-neon-blue/20 pb-3 space-y-2">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-slate-400" /> 
          <span className="text-slate-400">住处:</span> {residence.类型} 
          {residence.价格 > 0 && <span className="text-xs ml-1 bg-slate-800 px-1 rounded">({residence.价格}/晚)</span>}
        </div>
        <div className="flex items-start gap-2">
          <Backpack className="w-4 h-4 text-slate-400 mt-0.5" /> 
          <div className="flex-1">
            <span className="text-slate-400 block mb-1">道具:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(data.道具 || {}).map(([item, count]) => (
                <span key={item} className="bg-neon-blue/10 border border-neon-blue/30 px-2 py-0.5 rounded text-neon-blue">
                  {item} x{count}
                </span>
              ))}
              {Object.keys(data.道具 || {}).length === 0 && <span className="text-slate-500">空</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="border-b border-neon-blue/20 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="w-4 h-4 text-slate-400" /> 
          <span className="text-slate-400">当前任务:</span>
        </div>
        <div className="space-y-1.5">
          {Object.entries(data.任务 || {}).map(([task, info]) => (
            <div key={task} className="flex justify-between items-start text-xs pl-6">
              <span className="flex-1 break-all pr-2">· {task} <span className="text-slate-500">[{info.难度}]</span></span>
              <span className={`px-1.5 py-0.5 border rounded flex-shrink-0 ${info.状态 === '完成' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-neon-gold text-neon-gold bg-neon-gold/10'}`}>
                {info.状态}
              </span>
            </div>
          ))}
          {Object.keys(data.任务 || {}).length === 0 && <div className="pl-6 text-slate-500 text-xs">暂无任务</div>}
        </div>
      </div>

      {/* NPCs */}
      <div className="border-b border-neon-blue/20 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-slate-400" /> 
          <span className="text-slate-400">参与者 (存活: {aliveCount}/{totalNpc}):</span>
        </div>
        <div className="space-y-1.5 text-xs pl-6">
          {npcEntries.map(([name, info]) => (
             <div key={name} className="flex justify-between items-center">
               <span className={info.存活 ? 'text-slate-200' : 'text-slate-600 line-through'}>
                 · {name} <span className="text-slate-500">· {info.身份}</span>
               </span>
               {info.阵营隐藏 && <span className="text-neon-danger" title="阵营隐藏">?</span>}
             </div>
          ))}
          {totalNpc === 0 && <div className="text-slate-500 text-xs">无</div>}
        </div>
      </div>

      {/* Danmaku */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-slate-400" /> 
          <span className="text-slate-400">弹幕:</span>
        </div>
        <div className="relative text-xs text-slate-300 pl-6 border-l-2 border-slate-700 ml-1.5 space-y-1.5">
          <AnimatePresence>
            {data.弹幕.最新弹幕.map((msg, i) => (
               <motion.div 
                 key={`${msg}-${i}`}
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="italic"
               >
                 "{msg}"
               </motion.div>
            ))}
          </AnimatePresence>
          {data.弹幕.最新弹幕.length === 0 && <div className="text-slate-500">暂无弹幕</div>}
        </div>
      </div>
    </motion.div>
  );
}
