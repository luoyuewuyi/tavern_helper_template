import { useState, useEffect } from 'react';
import { getStatData } from './lib/statData';
import { StatData, Quest } from './types';

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="inline-block mb-6 mt-4 relative">
       <div className="bg-white text-black px-6 py-2 border-l-8 border-red-600 -skew-x-12 transform origin-left shadow-[4px_4px_0_#444]">
          <h2 className="text-xl font-black italic uppercase tracking-tighter skew-x-12">{title}</h2>
       </div>
    </div>
  );
}

function ProgressBar({ value, max, color = "bg-red-600" }: { value: number; max: number; color?: string }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-1 md:h-1.5 bg-gray-200 mt-2 relative border-0 skew-x-0">
       <div 
         className={`absolute left-0 top-0 h-full ${color} transition-all duration-500 ease-out`}
         style={{ width: `${percent}%` }}
       />
    </div>
  );
}

function StatusTab({ data }: { data: StatData }) {
  const { player } = data;
  return (
    <div className="text-white space-y-6 animate-in fade-in duration-300">
      <SectionHeader title="System Overlay // 个人面板" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-white text-black p-4 border-b-4 border-red-600 -skew-x-3 transform shadow-[4px_4px_0_#000] flex flex-col gap-2">
           <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 skew-x-3">PLAYER INFO</p>
           <div className="flex items-end justify-between skew-x-3 border-b-2 border-black pb-2">
              <span className="text-2xl font-black italic">{player.name}</span>
              <span className="text-sm font-bold text-red-600 font-mono">[LV.{player.level}]</span>
           </div>
           
           <div className="space-y-4 font-bold text-sm mt-2 skew-x-3">
               <div>
                 <div className="flex justify-between items-center text-[10px] font-mono">
                   <span>HP / 生命</span>
                   <span>{player.hp} / {player.maxHp}</span>
                 </div>
                 <ProgressBar value={player.hp} max={player.maxHp} color="bg-red-600" />
               </div>

               <div>
                 <div className="flex justify-between items-center text-[10px] font-mono">
                   <span>MP / 精神</span>
                   <span>{player.mp} / {player.maxMp}</span>
                 </div>
                 <ProgressBar value={player.mp} max={player.maxMp} color="bg-blue-600" />
               </div>
               
               <div className="pt-2">
                 <div className="flex justify-between items-center text-[10px] font-mono uppercase text-gray-500">
                   <span>EXP / 经验</span>
                   <span>{player.exp} / {player.maxExp} ({((player.exp / player.maxExp) * 100).toFixed(1)}%)</span>
                 </div>
                 <ProgressBar value={player.exp} max={player.maxExp} color="bg-black" />
               </div>
            </div>
        </div>

        {/* World Info Card */}
        <div className="bg-black border-2 border-white p-5 flex flex-col gap-4 font-mono shadow-[4px_4px_0_#222]">
             <div className="flex justify-between items-center text-red-500 mb-1 border-b border-gray-800 pb-2">
                <span className="text-[10px] uppercase font-bold text-gray-500">Location</span>
                <span className="text-xs font-bold text-white">{player.world}</span>
             </div>
             <div className="flex justify-between items-center text-gray-300">
                <span className="text-[10px] text-gray-500 uppercase">Area</span>
                <span className="text-xs">{player.location}</span>
             </div>
             <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-gray-500 uppercase">System Time</span>
                <span className="text-red-500 font-bold text-xs">{player.time}</span>
             </div>
             
             <div className="flex justify-between items-center mt-3 border-t border-gray-800 pt-4">
                <span className="text-[10px] text-gray-500 uppercase">Currency</span>
                <span className="font-mono text-xl font-bold text-white">$ {player.money.toLocaleString()}</span>
             </div>

             <div className="mt-2 border-t border-gray-800 pt-3 flex flex-wrap gap-2">
               <span className="text-gray-500 font-bold block w-full mb-1 text-[10px] uppercase">Player State</span>
               {player.status.length > 0 ? player.status.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-900/30 text-red-400 text-[10px] font-bold border border-red-500/50 uppercase tracking-widest">
                     {s}
                  </span>
               )) : <span className="text-gray-600 text-[10px] italic uppercase tracking-widest font-black">NORMAL / 正常</span>}
             </div>
        </div>
      </div>
    </div>
  );
}

function SkillsTab({ data }: { data: StatData }) {
  const { skills, player } = data;
  const groups = Object.keys(skills);

  return (
    <div className="text-white space-y-6 animate-in fade-in duration-300 pb-10 font-sans">
      <SectionHeader title="Skills // 技能" />
      <div className="bg-[#1a1a1a] p-4 border-2 border-white flex justify-between items-center gap-4 mb-4 relative z-10 w-full max-w-sm mr-auto md:ml-auto md:mr-0">
         <p className="text-[10px] font-bold text-red-500 mb-2 uppercase absolute -top-[10px] left-4 bg-[#0f0f0f] px-2 tracking-widest">Resources</p>
         <div className="flex justify-between items-center mb-1 flex-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold">SP points</span>
            <span className="font-mono font-bold text-white text-lg">{player.skillPoints > 9 ? player.skillPoints : `0${player.skillPoints}`}</span>
         </div>
         <div className="h-8 w-px bg-gray-700"></div>
         <div className="flex justify-between items-center mb-1 flex-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Unalloc EXP</span>
            <span className="font-mono font-bold text-red-500 text-lg">{player.unassignedSkillExp.toLocaleString()}</span>
         </div>
      </div>

      <div className="bg-white border-4 border-black text-black p-6 relative overflow-hidden space-y-6 shadow-[8px_8px_0_#222]">
        <div className="absolute top-0 right-0 p-2 opacity-[0.03] font-black text-6xl rotate-12 select-none tracking-tighter">SKILLS</div>
        <div className="relative z-10 space-y-8">
          {groups.map(group => (
            <div key={group}>
              <p className="text-[10px] font-bold bg-black text-white inline-block px-3 py-1 mb-4 uppercase tracking-widest shadow-[2px_2px_0_#e60000]">{group} SKILLS</p>
              {skills[group].length === 0 ? (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-4 text-center mt-2">
                   <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase font-bold">No skills unlocked in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {skills[group].map((skill, idx) => (
                    <div key={idx} className="flex flex-col">
                       <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-sm tracking-wide text-black">{skill.name}</span>
                          <span className="font-mono text-[10px] font-bold bg-gray-200 px-1 py-0.5 text-gray-700">LV.{skill.level > 9 ? skill.level : `0${skill.level}`}</span>
                       </div>
                       <ProgressBar value={skill.exp} max={skill.maxExp} color="bg-red-600" />
                       <div className="flex justify-end mt-0.5 opacity-50">
                          <span className="font-mono text-[8px]">{skill.exp} / {skill.maxExp} EXP</span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestsTab({ data }: { data: StatData }) {
  const { quests } = data;

  if (quests.length === 0) {
    return (
      <div className="text-white pt-20 text-center animate-in fade-in duration-300">
        <div className="inline-block bg-[#1a1a1a] border-2 border-gray-700 px-12 py-8 relative shadow-[6px_6px_0_#000]">
           <span className="block text-2xl font-black tracking-widest text-gray-500">NO ACTIVE QUESTS</span>
           <span className="block text-sm font-bold text-gray-600 mt-2">没有任何待办任务。</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white space-y-6 animate-in fade-in duration-300 pb-10">
      <SectionHeader title="Quests // 任务列表" />
      <div className="bg-white border-4 border-black text-black p-6 relative overflow-hidden shadow-[8px_8px_0_#222] min-h-[400px]">
        <div className="absolute top-0 right-0 p-2 opacity-[0.03] font-black text-6xl rotate-12 select-none tracking-tighter">QUESTS</div>
        <div className="relative z-10">
           <p className="text-[10px] font-bold text-red-600 uppercase mb-4 tracking-widest border-b-2 border-gray-200 pb-2 inline-block">Active Missions</p>
           
           <div className="space-y-4 text-sm font-sans mt-2">
             {quests.map((q, idx) => {
                if (q.status === 'ongoing') {
                   return (
                      <div key={idx} className="border-l-[3px] border-red-600 pl-4 py-1">
                        <p className="font-black uppercase tracking-wider text-black">{q.name} <span className="text-red-600 font-mono text-[10px] ml-2 tracking-widest">[ONGOING]</span></p>
                        <p className="text-gray-600 mt-1.5 font-bold text-xs">{q.desc}</p>
                        {q.progress && <p className="text-red-500 font-mono text-[10px] mt-2 font-bold tracking-widest">PROGRESS: {q.progress}</p>}
                      </div>
                   );
                }
                if (q.status === 'available') {
                   return (
                      <div key={idx} className="border-l-[3px] border-black pl-4 py-1 opacity-60">
                        <p className="font-black uppercase tracking-wider text-black">{q.name} <span className="text-gray-500 font-mono text-[10px] ml-2 tracking-widest">[AVAILABLE]</span></p>
                        <p className="text-gray-500 mt-1.5 font-bold text-xs">{q.desc}</p>
                      </div>
                   );
                }
                return (
                   <div key={idx} className="bg-red-50/50 p-3 border border-red-200">
                     <p className="font-black text-red-600 uppercase tracking-wider flex justify-between items-center">
                        {q.name}
                        <span className="bg-red-600 text-white font-mono text-[10px] px-2 py-0.5 tracking-widest">COMPLETE</span>
                     </p>
                     <p className="text-[11px] mt-2 text-gray-700 font-bold">{q.desc}</p>
                   </div>
                );
             })}
           </div>
        </div>
      </div>
    </div>
  );
}

function LogTab({ data }: { data: StatData }) {
  const { logs } = data;

  return (
    <div className="text-white space-y-4 animate-in fade-in duration-300 pb-10 h-[500px] flex flex-col">
      <SectionHeader title="Logs // 系统日志" />
      <div className="flex-1 bg-black border-[3px] border-gray-800 p-5 font-mono flex flex-col shadow-[6px_6px_0_#111]">
         <p className="text-[10px] text-gray-500 mb-4 border-b border-gray-800 pb-2 tracking-widest font-bold">SYSTEM LOGS</p>
         <div className="flex-1 space-y-3 text-xs overflow-y-auto pr-2 scrollbar-hide">
           {logs.length === 0 ? (
             <div className="text-gray-600 py-10 tracking-widest text-center italic">[ EMPTY RECORD ]</div>
           ) : (
             logs.map((log, idx) => (
                <div key={idx} className="text-gray-400 flex gap-3 pb-1 border-b border-gray-900/50">
                   <span className="text-red-500 shrink-0">[{log.time}]</span>
                   <span className="text-gray-300">{log.msg}</span>
                </div>
             ))
           )}
           <div className="text-gray-600 italic mt-4">[EOF] Data stream established...</div>
         </div>
         <div className="mt-4 border-t border-gray-800 pt-3 flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-600 animate-pulse rounded-full" />
            <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest">System Sync Online</span>
         </div>
      </div>
    </div>
  );
}

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 font-black skew-x-[-15deg] transition-all active:scale-95 group focus:outline-none border-2 ${
        active 
           ? 'bg-red-600 text-white border-white scale-[1.02] z-20 shadow-[4px_4px_0_rgba(0,0,0,0.5)]' 
           : 'bg-black text-gray-500 border-gray-700 hover:bg-gray-800 hover:text-white z-10'
      }`}
    >
      <span className="block skew-x-[15deg] tracking-[0.2em]">{label}</span>
    </button>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'status' | 'skills' | 'quests' | 'logs'>('skills');
  const [data, setData] = useState<StatData | null>(null);

  useEffect(() => {
    // Initial read
    setData(getStatData());
    
    // In a real MVU environment like SillyTavern, window.stat_data might change arbitrarily.
    // A simple polling mechanism ensures the UI stays updated without needing an event listener API.
    const interval = setInterval(() => {
       setData(getStatData());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-[100dvh] bg-[#0f0f0f] text-white p-4 md:p-8 flex justify-center selection:bg-red-600 selection:text-white" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="absolute top-0 left-0 w-full h-2 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] pointer-events-none z-50 py-0 m-0 border-0" />
      <div className="w-full max-w-2xl relative mt-4">
        
        {/* Top Navigation Tabs */}
        <div className="flex gap-2 mb-8 items-center justify-between w-full">
          <TabButton 
            label="STATUS" 
            active={activeTab === 'status'} 
            onClick={() => setActiveTab('status')} 
          />
          <TabButton 
            label="SKILLS" 
            active={activeTab === 'skills'} 
            onClick={() => setActiveTab('skills')} 
          />
          <TabButton 
            label="QUESTS" 
            active={activeTab === 'quests'} 
            onClick={() => setActiveTab('quests')} 
          />
          <TabButton 
            label="LOGS" 
            active={activeTab === 'logs'} 
            onClick={() => setActiveTab('logs')} 
          />
        </div>

        {/* Dynamic Content Panel */}
        <div className="relative font-sans text-sm pb-10">
          {activeTab === 'status' && <StatusTab data={data} />}
          {activeTab === 'skills' && <SkillsTab data={data} />}
          {activeTab === 'quests' && <QuestsTab data={data} />}
          {activeTab === 'logs' && <LogTab data={data} />}
        </div>
      </div>
    </div>
  );
}
