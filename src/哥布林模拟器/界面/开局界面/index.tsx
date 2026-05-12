import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import StartScreen from './StartScreen';
import '../index.css';

const TH = (window.parent as any).TavernHelper;

async function persistSettings(data: any) {
  const godEffects: Record<string, string> = {
    war: '{{user}}是战争之神·巴鲁克的眷属。战斗中获得15%战力加成，击败强敌后经验获取翻倍。解锁「战狂」形态（濒死时全属性+50%持续3回合）。戒律：不可逃避战斗，不可背弃誓言，不可使用毒药。违反戒律则失去战力加成5天。',
    shadow: '{{user}}是阴影之神·诺克斯的眷属。潜行成功率+40%，解锁「暗影步」短距传送（每日3次）。刺杀伤害2倍。戒律：每日在阳光下暴露不得超过1小时，不可光明正大行事。违反戒律则失去暗影庇护至次日日落。',
    fertility: '{{user}}是繁衍女神·莉莉丝的眷属。淫语效果翻倍，调教效率+50%。巢穴中母体受孕率翻倍，子代变异概率+30%。解锁「魅惑之眼」（对视目标意志-20%）。戒律：不可杀死怀有身孕的生物，不可拒绝繁衍的机会。违反戒律则巢穴中所有胚胎死亡。',
    wisdom: '{{user}}是智慧之神·索菲亚的眷属。魔力成长速度+50%，解锁「解析之眼」（可看穿目标能力值和弱点）。学习魔法效率翻倍，每获取一条新知识获得微量神恩。戒律：不可摧毁书籍、卷轴、碑文等知识载体，不可以无知为借口。违反戒律则暂时失去所有魔法能力。',
    death: '{{user}}是死亡之神·莫尔斯的眷属。击杀目标后吸收其20%生命力回复自身，解锁「死亡感知」（探测周围百米内濒死生物）。不死族亲和，不会被主动攻击。戒律：不可复活死者，不可怜悯垂死之人。违反戒律则自身生命被抽取一半。',
    none: '{{user}}不信仰任何神灵，走独立路线。无神恩加成，亦无戒律束缚。自由但脆弱——没有人会在你坠落时伸手。',
  };

  const eventEffects: Record<string, string> = {
    orphan: '开局事件「勇者遗孤」已触发。初始拥有一把破损的勇者佩剑（可修复）、半瓶治疗药水。对「冒险者」类型目标有15%额外伤害。注意：该冒险者小队的其他成员可能回来寻找同伴；初始恶名+2。',
    bloodmoon: '开局事件「血月降临」已触发。初始拥有随机初级突变（骰子决定）。血月之夜（每月一次）全属性翻倍。突变概率永久+50%，但突变方向不可控——可能有益也可能有害。注意：各方势力会因血月异象前来调查。',
    rebellion: '开局事件「奴隶起义」已触发。初始拥有两名虚弱同伴：受伤的半兽人工兵（可战斗/采矿）和恐惧的人类农奴少女（可采集/烹饪）。解放其他奴隶可招募追随者。注意：奴隶贩子追捕队正在搜索，预计3-7天内到达。',
    tycoon: '开局事件「矿脉大亨」已触发。初始拥有一处小型富魔矿脉（可开采10-15次）和三块高纯度魔力结晶（加速进化）。可与地下商人交易换取装备或情报。注意：魔力波动每2-5天吸引一波掠食者或探矿者。',
    legacy: '开局事件「魔族遗产」已触发。初始拥有恶魔刻痕（火焰抗性+30%，对低级恶魔具有威慑）。解锁隐藏恶魔进化路线。可感知附近其他恶魔遗物。注意：刻痕每7天进行一次意志检定——失败则理性-10%，连续失败3次将触发恶魔化。',
    forest: '开局事件「森林之王」已触发。初始拥有森之种（在森林地形中全属性+10%，缓慢吸收自然魔力，解锁自然系进化路线）。树精偶尔通过森之种给予模糊指引。注意：精灵巡林者感应到森之种存在，遭遇时必定触发追杀。',
    survivor: '开局事件「战争遗民」已触发。初始拥有大量可吞噬尸骸（人类+兽人基因碎片充足，首次进化需求-50%）和一件随机残破装备。对战场地形有天然嗅觉，可感知附近战争遗迹。注意：食腐者群（食尸鬼、巨乌鸦）已在路上，24小时内到达。',
  };

  const diffEffects: Record<string, string> = {
    easy: '当前难度：轻松。敌人等级-2，掉落资源翻倍。突发事件频率低（每10-15天一次）。初始巢穴自带基础陷阱。适合体验剧情。',
    normal: '当前难度：普通。标准平衡。敌人等级无修正，标准资源量。突发事件每5-10天一次。推荐首次游玩。',
    hard: '当前难度：困难。敌人等级+3，资源稀缺（掉落-40%）。突发事件每2-5天一次，死亡率高。冒险者讨伐队会主动追踪恶名。',
    nightmare: '当前难度：噩梦。敌人等级+6，资源极度匮乏（掉落-70%）。突发事件每1-3天一次。一步走错就可能死亡，但稀有掉落概率+200%。唯有疯狂方能生存。',
  };

  const entry = (name: string, content: string, order: number) => ({
    name, enabled: true,
    strategy: { type: 'constant' as const, keys: [], keys_secondary: { logic: 'and_any' as const, keys: [] }, scan_depth: 'same_as_global' as const },
    position: { type: 'before_character_definition' as const, role: 'system' as const, depth: 0, order },
    content, probability: 100,
    recursion: { prevent_incoming: true, prevent_outgoing: true, delay_until: null },
    effect: { sticky: null, cooldown: null, delay: null },
  });

  const api = TH || window as any;
  const wbName = api.getCharWorldbookNames('current').primary || '哥布林模拟器';
  await api.createWorldbookEntries(wbName, [
    entry('玩家姓名', `{{user}}的哥布林名字是「${data.name}」。`, 1),
    entry('生存难度', diffEffects[data.difficulty] || diffEffects.normal, 2),
    entry('信仰神灵', godEffects[data.god] || godEffects.none, 3),
    entry('开局事件', eventEffects[data.event] || eventEffects.orphan, 4),
  ]);
}

function App() {
  const handleStart = async (data: any) => {
    const gn: Record<string, string> = { war: '战争之神·巴鲁克', shadow: '阴影之神·诺克斯', fertility: '繁衍女神·莉莉丝', wisdom: '智慧之神·索菲亚', death: '死亡之神·莫尔斯', void: '虚空之神·阿比斯' };
    const en: Record<string, string> = { orphan: '勇者遗孤', bloodmoon: '血月降临', rebellion: '奴隶起义', tycoon: '矿脉大亨', legacy: '魔族遗产', forest: '森林之王', survivor: '战争遗民' };
    const dn: Record<string, string> = { easy: '轻松', normal: '普通', hard: '困难', nightmare: '噩梦' };
    const parts = ['我叫' + data.name + '，', data.god !== 'none' ? '信仰' + (gn[data.god] || data.god) + '，' : '不信仰任何神灵，', '开局事件选择「' + (en[data.event] || data.event) + '」，难度：' + (dn[data.difficulty] || data.difficulty) + '。'];
    if (data.customSetting) parts.push('\n自定义设定：' + data.customSetting);

    try { await persistSettings(data); } catch (e) { console.error('持久化失败:', e); }

    const api = TH || window as any;
    await api.createChatMessages([{ role: 'user', message: parts.join('') }]);
    api.triggerSlash('/trigger');
  };
  return <StartScreen onStart={handleStart} />;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
