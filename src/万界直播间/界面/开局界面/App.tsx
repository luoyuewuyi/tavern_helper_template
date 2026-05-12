import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronLeft, Play, User, Users, 
  Skull, CheckCircle, Plus, Trash2, Heart, Search, 
  ShieldAlert, Eye, Trophy, Sparkles, Tv
} from 'lucide-react';
import { submitGameStart } from './store';

type LiveType = '恋综' | '密室生存' | '剧本杀' | '';
type Difficulty = '简单' | '困难' | '';

interface Protagonist {
  name: string;
  age: number | '';
  personality: string;
  appearance: string;
  experience: string;
  origin: string;
  relations: string;
}

interface NPC {
  id: string;
  name: string;
  age: number | '';
  identity: string;
  originWork: string;
  notes: string;
}

interface GameData {
  protagonist: Protagonist;
  npcs: NPC[];
  liveType: LiveType;
  difficulty: Difficulty;
  stage: 'setup' | 'live';
}

const INITIAL_DATA: GameData = {
  protagonist: {
    name: '',
    age: 18,
    personality: '',
    appearance: '',
    experience: '',
    origin: '',
    relations: '默认不认识其他NPC'
  },
  npcs: [],
  liveType: '',
  difficulty: '',
  stage: 'setup'
};

const LIVE_TYPES = [
  {
    id: '恋综',
    name: '恋综',
    desc: '5~7天, 海岛/庄园, 投票+投币, 惩罚轻, 娱乐向',
    icon: Heart,
    color: 'text-neon-purple',
    shadow: 'shadow-[0_0_15px_rgba(255,0,255,0.4)]',
    border: 'border-neon-purple'
  },
  {
    id: '密室生存',
    name: '密室生存',
    desc: '7~10天, 别墅/庄园, 积分+任务, 死亡=真死, 恐怖向',
    icon: Skull,
    color: 'text-neon-danger',
    shadow: 'shadow-[0_0_15px_rgba(255,51,102,0.4)]',
    border: 'border-neon-danger'
  },
  {
    id: '剧本杀',
    name: '剧本杀',
    desc: '3~7天, 电影/动漫场景, 角色扮演+推理, 悬疑向',
    icon: Search,
    color: 'text-neon-gold',
    shadow: 'shadow-[0_0_15px_rgba(255,215,0,0.4)]',
    border: 'border-neon-gold'
  }
];

const DIFFICULTIES = [
  {
    id: '简单',
    name: '简单模式',
    desc: '可看到其他玩家任务，实时弹幕，可修改他人任务',
    icon: Eye,
    color: 'text-neon-blue'
  },
  {
    id: '困难',
    name: '困难模式',
    desc: '仅可看见弹幕和其他玩家任务',
    icon: ShieldAlert,
    color: 'text-neon-danger'
  }
];

// Helper components
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-neon-blue/80 mb-1 tracking-wider uppercase">
    {children}
  </label>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<GameData>(INITIAL_DATA);

  // Transitions
  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const updateProtagonist = (field: keyof Protagonist, value: any) => {
    setData(prev => ({ ...prev, protagonist: { ...prev.protagonist, [field]: value } }));
  };

  const addNpc = () => {
    if (data.npcs.length >= 7) return;
    const newNpc: NPC = {
      id: Math.random().toString(36).substring(7),
      name: '', age: '', identity: '', originWork: '', notes: ''
    };
    setData(prev => ({ ...prev, npcs: [...prev.npcs, newNpc] }));
  };

  const updateNpc = (id: string, field: keyof NPC, value: any) => {
    setData(prev => ({
      ...prev,
      npcs: prev.npcs.map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const removeNpc = (id: string) => {
    setData(prev => ({ ...prev, npcs: prev.npcs.filter(n => n.id !== id) }));
  };

  const startGame = () => {
    submitGameStart({
      protagonist: data.protagonist,
      npcs: data.npcs.map(n => ({ name: n.name, age: n.age, identity: n.identity, originWork: n.originWork, notes: n.notes })),
      liveType: data.liveType,
      difficulty: data.difficulty,
    });
    setData(prev => ({ ...prev, stage: 'live' }));
  };

  if (data.stage === 'live') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Sparkles className="w-24 h-24 mx-auto text-neon-gold mb-6 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold text-glow-gold mb-4">连接万界流...</h1>
          <p className="text-xl text-neon-blue/80">
            「初始设定加载完毕，主角 {data.protagonist.name} 准备降临。」
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        layout
        className="w-full max-w-4xl neon-border-box p-6 md:p-10 relative z-10"
      >
        {/* Progress Bar Header */}
        {step > 0 && (
          <div className="mb-8 relative z-20">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-glow-blue flex items-center gap-2">
                {step === 1 && <><User className="w-5 h-5" /> 建立主角档案</>}
                {step === 2 && <><Users className="w-5 h-5" /> 招募NPC ({data.npcs.length}/7)</>}
                {step === 3 && <><Tv className="w-5 h-5" /> 选择直播类型</>}
                {step === 4 && <><ShieldAlert className="w-5 h-5" /> 选择难度</>}
                {step === 5 && <><CheckCircle className="w-5 h-5" /> 数据汇总</>}
              </h2>
              <span className="text-neon-blue/60 text-sm font-mono">STEP 0{step}/05</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: START */}
          {step === 0 && (
            <motion.div 
              key="step0"
              variants={variants} initial="initial" animate="animate" exit="exit"
              className="text-center py-12 md:py-20"
            >
              <div className="w-24 h-24 mx-auto border-2 border-neon-blue rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                <Tv className="w-12 h-12 text-neon-blue" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-glow-blue mb-6 tracking-tighter">
                万界直播间
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                连接多元宇宙的尽头，设定你的宿命与法则。<br/>
                观众们已经就位，只等主角登场。
              </p>
              <button onClick={nextStep} className="btn-primary text-xl px-8 py-4">
                <Play className="w-6 h-6 mr-2" /> 开始构建宇宙
              </button>
            </motion.div>
          )}

          {/* STEP 1: PROTAGONIST */}
          {step === 1 && (
            <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FieldLabel>姓名 (NAME)</FieldLabel>
                  <input type="text" className="input-neon" value={data.protagonist.name} onChange={e => updateProtagonist('name', e.target.value)} placeholder="如: 楚云" />
                </div>
                <div>
                  <FieldLabel>年龄 (AGE)</FieldLabel>
                  <input type="number" min="1" max="200" className="input-neon" value={data.protagonist.age} onChange={e => updateProtagonist('age', e.target.value ? Number(e.target.value) : '')} placeholder="1-200" />
                </div>
                <div>
                  <FieldLabel>来自哪里 (ORIGIN)</FieldLabel>
                  <input type="text" className="input-neon" value={data.protagonist.origin} onChange={e => updateProtagonist('origin', e.target.value)} placeholder="如: 赛博废土 / 现世" />
                </div>
                <div>
                  <FieldLabel>与其他NPC关系 (RELATIONS)</FieldLabel>
                  <input type="text" className="input-neon" value={data.protagonist.relations} onChange={e => updateProtagonist('relations', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>外表 (APPEARANCE)</FieldLabel>
                  <textarea className="input-neon min-h-[80px]" value={data.protagonist.appearance} onChange={e => updateProtagonist('appearance', e.target.value)} placeholder="描述五官、穿着、独特标志..." />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>性格 (PERSONALITY)</FieldLabel>
                  <textarea className="input-neon min-h-[80px]" value={data.protagonist.personality} onChange={e => updateProtagonist('personality', e.target.value)} placeholder="描述心理特征、处事风格..." />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>个人经历 (EXPERIENCE)</FieldLabel>
                  <textarea className="input-neon min-h-[80px]" value={data.protagonist.experience} onChange={e => updateProtagonist('experience', e.target.value)} placeholder="主角的过去..." />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: NPCs */}
          {step === 2 && (
            <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex justify-between items-center bg-neon-blue/10 p-4 rounded-lg border border-neon-blue/20">
                <span className="text-neon-blue font-medium">配置配角面板 (总人数阈值: 8内)</span>
                <button 
                  onClick={addNpc} 
                  disabled={data.npcs.length >= 7}
                  className="btn-primary flex items-center text-sm py-1.5 px-3"
                >
                  <Plus className="w-4 h-4 mr-1" /> 调取新干员
                </button>
              </div>

              {data.npcs.length === 0 && (
                <div className="text-center py-12 text-slate-500 border border-dashed border-neon-blue/20 rounded-lg">
                  暂无挂载任何 NPC，主角将孤身前行。
                </div>
              )}

              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                {data.npcs.map((npc, index) => (
                  <div key={npc.id} className="p-4 bg-slate-900/50 border border-neon-blue/30 rounded-lg relative group">
                    <button 
                      onClick={() => removeNpc(npc.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-neon-danger transition-colors cursor-pointer z-10"
                      title="删除此NPC"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <h3 className="text-neon-blue font-mono mb-4">#NPC_0{index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>姓名 (NAME)</FieldLabel>
                        <input type="text" className="input-neon" value={npc.name} onChange={e => updateNpc(npc.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>年龄 (AGE)</FieldLabel>
                        <input type="number" className="input-neon" value={npc.age} onChange={e => updateNpc(npc.id, 'age', e.target.value ? Number(e.target.value) : '')} />
                      </div>
                      <div>
                        <FieldLabel>身份设定 (IDENTITY)</FieldLabel>
                        <input type="text" className="input-neon" value={npc.identity} onChange={e => updateNpc(npc.id, 'identity', e.target.value)} placeholder="如: 财阀千金 / 杀手" />
                      </div>
                      <div>
                        <FieldLabel>重置来源 (SOURCE WORK)</FieldLabel>
                        <input type="text" className="input-neon" value={npc.originWork} onChange={e => updateNpc(npc.id, 'originWork', e.target.value)} placeholder="原创 / 或动漫角色名(出处)" />
                      </div>
                      <div className="md:col-span-2">
                        <FieldLabel>综合备注 (NOTES)</FieldLabel>
                        <textarea className="input-neon min-h-[60px]" value={npc.notes} onChange={e => updateNpc(npc.id, 'notes', e.target.value)} placeholder="性格/经历/关系 等补充" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: LIVE TYPE */}
          {step === 3 && (
            <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {LIVE_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = data.liveType === type.id;
                  const btnColorClass = isSelected ? type.color : 'text-slate-500';
                  const titleColorClass = isSelected ? `${type.color} drop-shadow-md` : 'text-slate-200';
                  const containerClass = isSelected ? `bg-slate-900/80 ${type.border} ${type.shadow}` : 'bg-slate-900/40 border-slate-700 hover:border-slate-500';

                  return (
                    <div 
                      key={type.id}
                      onClick={() => setData({ ...data, liveType: type.id as LiveType })}
                      className={`cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 flex flex-col items-center text-center ${containerClass}`}
                    >
                      <Icon className={`w-16 h-16 mb-4 ${btnColorClass}`} />
                      <h3 className={`text-xl font-bold mb-2 ${titleColorClass}`}>{type.name}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{type.desc}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

           {/* STEP 4: DIFFICULTY */}
           {step === 4 && (
            <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="max-w-2xl mx-auto pt-8 space-y-6">
              {DIFFICULTIES.map(diff => {
                const Icon = diff.icon;
                const isSelected = data.difficulty === diff.id;
                
                let containerClass = 'bg-slate-900/40 border-slate-700 hover:border-slate-500';
                let iconWrapperClass = 'bg-slate-800';
                
                if (isSelected) {
                  if (diff.id === '简单') {
                    containerClass = 'bg-neon-blue/10 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.4)]';
                    iconWrapperClass = 'bg-neon-blue/20';
                  } else {
                    containerClass = 'bg-neon-danger/10 border-neon-danger shadow-[0_0_15px_rgba(255,51,102,0.4)]';
                    iconWrapperClass = 'bg-neon-danger/20';
                  }
                }

                return (
                  <div 
                    key={diff.id}
                    onClick={() => setData({ ...data, difficulty: diff.id as Difficulty })}
                    className={`cursor-pointer border-2 rounded-xl p-6 transition-all flex items-start gap-6 ${containerClass}`}
                  >
                    <div className={`p-4 rounded-full ${iconWrapperClass}`}>
                      <Icon className={`w-8 h-8 ${isSelected ? diff.color : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-2 ${isSelected ? diff.color : 'text-slate-200'}`}>{diff.name}</h3>
                      <p className="text-slate-400">{diff.desc}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* STEP 5: SUMMARY */}
          {step === 5 && (
            <motion.div key="step5" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-8">
              <div className="bg-slate-900/60 border border-neon-blue/20 rounded-xl p-6 backdrop-blur">
                <h3 className="text-neon-blue font-bold text-lg mb-4 flex items-center border-b border-neon-blue/20 pb-2">
                  <User className="w-5 h-5 mr-2" /> 主角简报
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-slate-500">姓名:</span> <span className="text-slate-200">{data.protagonist.name || '--'}</span></div>
                  <div><span className="text-slate-500">年龄:</span> <span className="text-slate-200">{data.protagonist.age || '--'}</span></div>
                  <div className="col-span-2"><span className="text-slate-500">来源:</span> <span className="text-slate-200">{data.protagonist.origin || '--'}</span></div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-neon-blue/20 rounded-xl p-6 backdrop-blur">
                <h3 className="text-neon-blue font-bold text-lg mb-4 flex items-center border-b border-neon-blue/20 pb-2">
                  <Users className="w-5 h-5 mr-2" /> NPC矩阵 ({data.npcs.length})
                </h3>
                {data.npcs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.npcs.map((n, i) => (
                      <div key={n.id} className="text-sm border-l-2 border-neon-blue/50 pl-3">
                        <div className="font-bold text-slate-200">{n.name || `未命名 (No.${i})`} <span className="text-slate-500 font-normal">({n.identity})</span></div>
                        <div className="text-slate-400 truncate">{n.originWork ? `来源：${n.originWork}` : '原创'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm">无外加矩阵人员。</div>
                )}
              </div>

              <div className="bg-slate-900/60 border border-neon-blue/20 rounded-xl p-6 backdrop-blur">
                <h3 className="text-neon-blue font-bold text-lg mb-4 flex items-center border-b border-neon-blue/20 pb-2">
                  <Tv className="w-5 h-5 mr-2" /> 协议与法则
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-slate-500 text-sm block mb-1">直播主题:</span>
                    <span className="text-lg font-bold text-neon-purple">{data.liveType || '--'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm block mb-1">生存难度:</span>
                    <span className="text-lg font-bold text-neon-danger">{data.difficulty || '--'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer Navigation */}
        {step > 0 && (
          <div className="mt-8 pt-6 border-t border-neon-blue/20 flex justify-between items-center relative z-20">
            <button 
              onClick={prevStep}
              className="px-6 py-2 rounded font-medium text-slate-400 hover:text-white transition-colors flex items-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> 返回上层
            </button>
            
            {step < 5 ? (
              <button onClick={nextStep} className="btn-primary cursor-pointer">
                确认写入 <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button 
                onClick={startGame}
                disabled={!data.protagonist.name || !data.liveType || !data.difficulty}
                className="btn-primary bg-neon-blue/20 border-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] cursor-pointer"
              >
                <Trophy className="w-5 h-5 mr-2 inline" /> 同步MVU数据并开启直播
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
