import React, { useState } from 'react';
import { 
  Terminal, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Zap,
  Box,
  Crosshair,
  User,
  HeartPulse,
  Shield,
  Eye,
  BrainCircuit,
  MessageSquare,
  ChevronsRight
} from 'lucide-react';

const DEFAULT_TEXT = `╔════ 末日异能生存系统 ════╗
时间: 2077年1月1日 / 深夜
地点: 卧室
危险: 低 ▰▱▱▱▱
灾害: 大寂静前夕

【世界信息】
全球动态: 表面平静，深渊渗透即将显性化。
周期事件: 大寂静倒计时。
资源趋势: 末日前物资仍可通过正常渠道采购。

【人物界面】
姓名: 未登记｜年龄: 18｜身份: 学生
生命: 100/100｜精神: 82/100
饱食: 70/100｜清洁: 80/100｜情绪: 紧绷
力量: 10｜敏捷: 12｜体质: 9｜精神: 15｜感知: 14｜魅力: 8

【异能】
亚空间储物 Lv.1｜容量: 1000立方米
特性: 绝对静止
反噬: 无

【物资与技能】
空间库存: 矿泉水x10箱, 泡面x20箱, 应急包x1
晶核数量: 0
关键生存物资: 暂无
枪械: 0｜冷兵器: 1｜烹饪: 2｜医疗: 1

【基地与关系】
基地名称: 未加入基地
每月预警: 暂无
人物关系网:
├─ 妹妹 (好感 80, 依赖)
└─ 神秘商人 (好感 10, 中立)

【行动】
行动点: 0/4
已选行动: 暂无
执行记录: 重生确认，等待人设登记。
待处理事件: 
1. 大寂静即将发生 
2. 规划囤货路线`;

const parseText = (text: string) => {
  const lines = text.split('\n');
  const sections: { title: string, lines: string[] }[] = [];
  let currentSection = { title: 'HEADER', lines: [] as string[] };
  
  for (const line of lines) {
    const titleMatch = line.match(/^【(.*?)】/);
    if (titleMatch) {
      if (currentSection.lines.length > 0 || currentSection.title !== 'HEADER') {
        sections.push(currentSection);
      }
      currentSection = { title: titleMatch[1].trim(), lines: [] };
    } else if (line.trim() !== '') {
      currentSection.lines.push(line.trim());
    }
  }
  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }
  return sections;
};

const parseHeader = (lines: string[]) => {
  const data: Record<string, string> = {};
  lines.forEach(line => {
    if (line.includes('╔') || line.includes('╝')) return;
    const match = line.match(/^(.+?)[:：]\s*(.+)$/);
    if (match) {
      data[match[1].replace(/【|】/g, '').trim()] = match[2].trim();
    }
  });
  return data;
};

const getSectionIcon = (title: string) => {
  if (title.includes('世界')) return Activity;
  if (title.includes('人物')) return User;
  if (title.includes('异能')) return Zap;
  if (title.includes('物资') || title.includes('库存') || title.includes('技能')) return Box;
  if (title.includes('基地') || title.includes('关系')) return MapPin;
  if (title.includes('行动')) return Crosshair;
  if (title.includes('状态')) return HeartPulse;
  return Terminal;
}

const ProgressBar = ({ label, current, max, colorClass }: { label: string, current: number, max: number, colorClass: string }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="flex flex-col gap-[2px] mb-1">
      <div className="flex justify-between text-[12px] font-mono">
        <span className="text-text-primary tracking-wider uppercase">{label}</span>
        <span className="text-text-primary">{current}/{max}</span>
      </div>
      <div className="h-[6px] w-full bg-[#000] border border-[#333] relative">
        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const StatBar = ({ label, val, max = 100 }: { label: string, val: number, max?: number }) => (
  <div className="flex justify-between font-mono bg-white/5 px-[6px] py-[4px] rounded-[2px] w-full h-full items-center">
    <span className="text-text-primary text-[12px] leading-none">{label}</span>
    <span className="text-text-primary text-[12px] leading-none">{val}</span>
  </div>
);

const RenderLine = ({ line }: { line: string }) => {
  // Tree structure or numbered lists
  if (line.trim().startsWith('├') || line.trim().startsWith('└') || /^\d+\.\s/.test(line.trim())) {
    const isTree = line.trim().startsWith('├') || line.trim().startsWith('└');
    return <div className={`font-sans text-[11px] py-0.5 whitespace-pre-wrap flex items-start ${isTree ? "ml-2.5 border-l border-border-dim pl-2 relative before:content-['├─'] before:absolute before:-left-2.5 before:text-border-dim" : "text-text-dim border-t border-border-dim border-dashed pt-1 mt-1"}`}>
      <span className={isTree ? "text-text-primary" : "text-text-dim font-mono"}>{line.replace(/^[├└]─\s?/, '')}</span>
    </div>;
  }
  
  // Decorative lines
  if (line.includes('╔') || line.includes('═') || line.includes('╝')) {
    return null;
  }

  // Split by ｜ or spaces for some patterns
  const chunks = line.split(/[｜|]+/).map(s => s.trim()).filter(Boolean);
  
  if (chunks.length === 1) {
    const single = chunks[0];
    const kvMatch = single.match(/^(.+?)[:：]\s*(.+)$/);
    if (!kvMatch) {
       return <div className="text-text-primary text-[12px] py-0.5 leading-relaxed whitespace-pre-wrap">{single}</div>;
    }
  }

  return (
    <div className="flex flex-wrap gap-1 py-0.5">
      {chunks.map((chunk, i) => {
         // Progress bar "生命 100/100" or "生命: 100/100"
         const progMatch = chunk.match(/^(.+?)\s*[:：]?\s*(\d+)\s*\/\s*(\d+)$/);
         if (progMatch) {
            const [, lbl, cur, max] = progMatch;
            let color = "bg-accent-green shadow-[0_0_5px_var(--color-accent-green)]";
            if (lbl.includes('生命')) color = "bg-accent-green shadow-[0_0_5px_var(--color-accent-green)]";
            if (lbl.includes('精神')) color = "bg-accent-blue shadow-[0_0_5px_var(--color-accent-blue)]";
            if (lbl.includes('饱食')) color = "bg-accent-amber";
            if (lbl.includes('清洁')) color = "bg-white";
            if (lbl.includes('行动')) color = "bg-accent-green shadow-[0_0_5px_var(--color-accent-green)]";
            return <div key={i} className="w-[48%] flex-grow min-w-[130px]"><ProgressBar label={lbl.trim()} current={parseInt(cur)} max={parseInt(max)} colorClass={color} /></div>;
         }
         
         // Key-Value "力量: 10"
         const kvMatch = chunk.match(/^(.+?)[:：]\s*(.+)$/);
         if (kvMatch) {
           const [, k, v] = kvMatch;
           const key = k.trim();
           const val = v.trim();
           
           // If value is numeric <= 100 and it's a short key, render as a little stat bar
           if (/^\d+$/.test(val) && key.length <= 4 && parseInt(val) <= 100) {
              return <div key={i} className="w-[45%] flex-grow min-w-[80px]"><StatBar label={key} val={parseInt(val)} /></div>;
           }
           
           // Render as tag
           return (
             <div key={i} className="inline-flex items-center bg-black/20 border border-border-dim rounded-[2px] px-1.5 py-[2px] mr-0.5 mb-1 text-[11px] font-sans">
               <span className="text-text-dim whitespace-nowrap mr-1">{key}:</span>
               <span className={key.includes("亚空间") ? "text-accent-blue font-bold" : "text-text-primary break-words"}>{val}</span>
             </div>
           );
         }
         
         // Fallback spaced: "情绪 紧绷"
         const spcMatch = chunk.match(/^(.+?)\s+(\S+)$/);
         if (spcMatch) {
           const [, k, v] = spcMatch;
           return (
             <div key={i} className="inline-flex items-center bg-black/20 border border-border-dim rounded-[2px] px-1.5 py-[2px] mr-0.5 mb-1 text-[11px] font-sans">
               <span className="text-text-dim whitespace-nowrap mr-1">{k.trim()}:</span>
               <span className="text-text-primary">{v.trim()}</span>
             </div>
           );
         }

         return <span key={i} className="text-text-primary text-[12px] px-1 py-0.5 font-sans">{chunk}</span>;
      })}
    </div>
  );
};

const TopHUD = ({ data }: { data: Record<string, string> }) => {
  const isHigh = (data['危险'] || '').includes('高');
  const isMid = (data['危险'] || '').includes('中');
  const hazardColor = isHigh ? 'bg-hazard-high' : (isMid ? 'bg-hazard-mid' : 'bg-hazard-low');
  const hazardTextColor = isHigh ? 'text-hazard-high' : (isMid ? 'text-hazard-mid' : 'text-hazard-low');
  
  return (
    <header className="col-span-full border-b border-accent-green pb-2 flex flex-col md:flex-row justify-between md:items-end gap-2.5">
      <div className="font-mono text-[18px] font-bold text-accent-green drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]">
        SURVIVAL_OS v4.2 // 避难所实时链路
      </div>
      <div className="text-[12px] flex flex-wrap gap-x-5 gap-y-2 font-sans">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-dim uppercase tracking-wider">当前时间</span>
          <span className="text-text-primary font-mono">{data['时间'] || '2077年1月1日 / 深夜'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-text-dim uppercase tracking-wider">地理坐标</span>
          <span className="text-text-primary font-mono">{data['地点'] || '旧城区 / 卧室'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-text-dim uppercase tracking-wider">威胁等级</span>
          <div className="flex gap-0.5 mt-0.5 items-center">
             <div className={`w-[12px] h-[4px] bg-[#222] ${hazardColor}`}></div>
             <div className={`w-[12px] h-[4px] bg-[#222] ${hazardColor}`}></div>
             <div className={`w-[12px] h-[4px] bg-[#222] ${isMid || isHigh ? hazardColor : ''}`}></div>
             <div className={`w-[12px] h-[4px] bg-[#222] ${isHigh ? hazardColor : ''}`}></div>
             <div className={`w-[12px] h-[4px] bg-[#222]`}></div>
             <span className={`text-[10px] uppercase font-mono ml-1 font-bold ${hazardTextColor}`}>
                {isHigh ? "HIGH" : (isMid ? "MED" : "LOW")}
             </span>
          </div>
        </div>
      </div>
    </header>
  );
};

const SectionCard = ({ sec }: { sec: any }) => {
  const isSupernatural = sec.title.includes('异能');
  
  return (
    <div className="bg-bg-card border border-border-dim p-2.5 flex flex-col gap-2">
      <div className="text-[11px] font-bold text-accent-green border-l-[3px] border-accent-green pl-1.5 mb-1 uppercase tracking-widest font-sans flex items-center gap-1.5">
        {sec.title}
      </div>
      
      <div className={`flex flex-col gap-1 ${isSupernatural ? 'bg-[rgba(0,229,255,0.05)] border border-accent-blue p-2' : ''}`}>
        {sec.lines.map((line: string, lidx: number) => (
           <RenderLine key={lidx} line={line} />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [showInput, setShowInput] = useState(false);

  const parsedSections = parseText(text);
  const headerSection = parsedSections.find(s => s.title === 'HEADER');
  const headerData = headerSection ? parseHeader(headerSection.lines) : {};
  const otherSections = parsedSections.filter(s => s.title !== 'HEADER');

  const leftSections = otherSections.filter(s => s.title.includes('人物') || s.title.includes('世界'));
  const centerSections = otherSections.filter(s => s.title.includes('异能') || s.title.includes('基地') || s.title.includes('行动'));
  const rightSections = otherSections.filter(s => !s.title.includes('人物') && !s.title.includes('世界') && !s.title.includes('异能') && !s.title.includes('基地') && !s.title.includes('行动'));

  return (
    <div className="min-h-screen bg-bg-main text-text-primary p-2 md:p-3 lg:p-4 font-sans selection:bg-accent-green/30 flex justify-center items-center overflow-auto">
      <div className="w-full max-w-[1024px] relative">
        
        {/* Toggle Input Modal Button */}
        <button 
          onClick={() => setShowInput(!showInput)}
          className="absolute -top-7 right-0 text-accent-green/50 hover:text-accent-green text-xs flex items-center gap-1 transition-colors z-20"
        >
          <MessageSquare className="w-3 h-3" />
          {showInput ? "Hide Input" : "Paste Raw Text"}
        </button>

        {/* Input Area */}
        {showInput && (
          <div className="mb-4 bg-bg-card border border-border-dim p-3 relative z-10 shadow-lg">
             <div className="text-[11px] text-accent-green mb-2 uppercase tracking-widest font-bold">Input Raw Text</div>
             <textarea 
               value={text}
               onChange={(e) => setText(e.target.value)}
               className="w-full h-32 bg-[#000] border border-border-dim p-2 text-[12px] font-mono text-text-primary focus:outline-none focus:border-accent-green/50 resize-y"
             />
          </div>
        )}

        {/* Main UI Container */}
        <div className="border-[2px] border-border-dim p-[10px] bg-[radial-gradient(circle_at_center,_#151d18_0%,_#0a0c0b_100%)] grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] grid-rows-[auto_1fr_auto] gap-[10px] min-h-[90vh]">
          
          <TopHUD data={headerData} />
          
          <aside className="flex flex-col gap-[10px]">
             {leftSections.map((sec, idx) => <SectionCard key={idx} sec={sec} />)}
          </aside>
          
          <main className="flex flex-col gap-[10px]">
             {centerSections.map((sec, idx) => <SectionCard key={idx} sec={sec} />)}
          </main>

          <aside className="flex flex-col gap-[10px]">
             {rightSections.map((sec, idx) => <SectionCard key={idx} sec={sec} />)}
          </aside>

          {/* Footer Bar */}
          <footer className="col-span-full flex justify-between text-[10px] text-text-dim pt-2 border-t border-border-dim font-mono">
             <div>SYSTEM STATUS: ONLINE // DATA REFRESHED 2077.01.01_04:22:15</div>
             <div>UUID: 77-RF-SF-01 // END_OF_BLOCK</div>
          </footer>

        </div>

      </div>
    </div>
  );
}
