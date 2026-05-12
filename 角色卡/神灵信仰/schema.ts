// ═══════════════════════════════════════════════════════════
// 神灵信仰 · MVU 变量结构定义
// 完整好感度网络 + 女角色多路线系统 + 详细状态追踪
// ═══════════════════════════════════════════════════════════

// === 常量 ===
const 核心角色列表 = ['张建珍', '王群荣', '张素菲', '张宇', '张哲恺', '诺姆'] as const;
const 女角色列表 = ['张建珍', '张素菲', '张宇'] as const;


const 登场状态列表 = ['登场中', '待命', '离场'] as const;
const 路线倾向列表 = ['未定', '纯爱', 'NTR_张哲恺', 'NTR_诺姆', '多线并行'] as const;
const 贞操状态列表 = ['完整', '已破'] as const;


// === 好感度阶段映射 ===
function 好感度阶段(v: number): string {
  if (v < 10) return '敌视';
  if (v < 20) return '厌恶';
  if (v < 30) return '冷淡';
  if (v < 40) return '疏离';
  if (v < 50) return '平淡';
  if (v < 60) return '好感';
  if (v < 70) return '亲近';
  if (v < 80) return '信赖';
  if (v < 90) return '深情';
  return '挚爱';
}

// === 路线阶段映射 ===

// --- 纯爱阶段（对 user）---
const 纯爱阶段映射 = {
  张建珍: [
    '母子日常', '关注加深', '不自觉在意', '暧昧萌芽',
    '内心挣扎', '禁忌试探', '秘密亲密', '心意确认',
    '依赖沉溺', '不可回头',
  ],
  张素菲: [
    '姐弟日常', '格外照顾', '异样心动', '暗中在意',
    '情感困惑', '越界靠近', '私下依偎', '彼此确认',
    '深度缠绵', '只认你一人',
  ],
  张宇: [
    '新婚疏远', '重新靠近', '甜蜜尝试', '心意相通',
    '热恋升温', '身心交融', '婚盟加深', '无条件信赖',
    '灵魂相依', '命运共锁',
  ],
} satisfies Record<(typeof 女角色列表)[number], string[]>;

// --- NTR_张哲恺阶段 ---
const NTR张哲恺阶段映射 = {
  张建珍: [
    '长辈疼爱', '无意触碰', '模糊容忍', '理智动摇',
    '暗中放纵', '罪恶沉溺', '身体习惯', '主动索取',
    '精神依附', '自甘堕落',
  ],
  张素菲: [
    '表姐关爱', '无防借势', '被缠纠缠', '抵抗变弱',
    '暗生愧疚', '禁忌快感', '身心沦陷', '秘密依赖',
    '甘愿配合', '彻底臣服',
  ],
  张宇: [
    '嫂子礼貌', '意外接触', '困惑不安', '被动忍受',
    '心理防线崩', '背德快感', '无法自拔', '隐秘私情',
    '精神控制', '甘为禁脔',
  ],
} satisfies Record<(typeof 女角色列表)[number], string[]>;

// --- NTR_诺姆阶段 ---
const NTR诺姆阶段映射 = {
  张建珍: [
    '极度仇视', '被迫接触', '信仰撬动', '认知混乱',
    '赐福侵蚀', '欲望觉醒', '身体背叛', '精神腐蚀',
    '邪神附体', '堕为信徒',
  ],
  张素菲: [
    '鄙夷排斥', '礼节容忍', '好奇试探', '暗中心动',
    '赐福诱导', '欲望膨胀', '理智瓦解', '身心献祭',
    '邪神烙印', '忠诚侍奉',
  ],
  张宇: [
    '歧视地精', '被迫礼貌', '异样感受', '认知扭曲',
    '赐福渗透', '身体异变', '抗拒崩塌', '精神奴役',
    '完全堕化', '邪神玩物',
  ],
} satisfies Record<(typeof 女角色列表)[number], string[]>;

function 读取路线阶段(映射: Record<string, string[]>, 角色名: string, 进度: number): string {
  const 列表 = 映射[角色名];
  if (!列表) return '未知';
  const 索引 = Math.min(列表.length - 1, Math.floor(_.clamp(进度, 0, 100) / (100 / 列表.length)));
  return 列表[索引];
}

// === 好感度对象构建 ===
function 创建好感度(
  对象列表: readonly string[],
  默认值: Partial<Record<string, number>>,
) {
  const fields: Record<string, any> = {};
  for (const 名 of 对象列表) {
    fields[名] = z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(默认值[名] ?? 50);
  }
  return z.object(fields).prefault({}).transform(data => {
    const 结果: Record<string, unknown> = { ...data };
    for (const [k, v] of Object.entries(data)) {
      结果[`$${k}阶段`] = 好感度阶段(v as number);
    }
    return 结果;
  });
}

// === 路线追踪 ===
function 创建路线追踪(角色名: (typeof 女角色列表)[number]) {
  return z.object({
    当前倾向: z.enum(路线倾向列表).prefault('未定'),
    纯爱进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    NTR_张哲恺进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    NTR_诺姆进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    纯爱关键标记: z.record(z.string(), z.coerce.boolean()).prefault({}),
    NTR_张哲恺关键标记: z.record(z.string(), z.coerce.boolean()).prefault({}),
    NTR_诺姆关键标记: z.record(z.string(), z.coerce.boolean()).prefault({}),
  }).prefault({}).transform(data => ({
    ...data,
    $纯爱阶段: 读取路线阶段(纯爱阶段映射, 角色名, data.纯爱进度),
    $NTR_张哲恺阶段: 读取路线阶段(NTR张哲恺阶段映射, 角色名, data.NTR_张哲恺进度),
    $NTR_诺姆阶段: 读取路线阶段(NTR诺姆阶段映射, 角色名, data.NTR_诺姆进度),
    $主导路线: (() => {
      const max = Math.max(data.纯爱进度, data.NTR_张哲恺进度, data.NTR_诺姆进度);
      if (max <= 5) return '未定';
      if (data.纯爱进度 === max) return '纯爱';
      if (data.NTR_张哲恺进度 === max) return 'NTR_张哲恺';
      return 'NTR_诺姆';
    })(),
  }));
}

// === 身体状态 ===
function 创建身体状态(处女默认: (typeof 贞操状态列表)[number]) {
  return z.object({
    贞操: z.enum(贞操状态列表).prefault(处女默认),
    处女膜: z.enum(['完整', '已破']).prefault(处女默认 === '完整' ? '完整' : '已破'),
    敏感度: z.object({
      口腔: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
      胸部: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(15),
      私处: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
      后庭: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(5),
    }).prefault({}),
    经验次数: z.object({
      口交: z.coerce.number().transform(v => Math.max(v, 0)).prefault(0),
      性交: z.coerce.number().transform(v => Math.max(v, 0)).prefault(0),
      后庭: z.coerce.number().transform(v => Math.max(v, 0)).prefault(0),
      其他: z.coerce.number().transform(v => Math.max(v, 0)).prefault(0),
    }).prefault({}),
    最近性对象: z.string().prefault('无'),
    当前着装: z.string().prefault('日常服装'),
    身体特殊状态: z.array(z.string()).prefault([]),
  }).prefault({});
}

// === 心理状态 ===
function 创建心理状态() {
  return z.object({
    理智值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
    抗拒力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    邪神影响度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    罪恶感: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    快感记忆: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    情感依赖: z.string().prefault('无'),
    当前心境: z.string().prefault('平静'),
  }).prefault({}).transform(data => ({
    ...data,
    $精神状态: data.理智值 >= 80 ? '清醒坚定'
      : data.理智值 >= 60 ? '理智尚存'
      : data.理智值 >= 40 ? '意志动摇'
      : data.理智值 >= 20 ? '精神恍惚'
      : '心智崩塌',
    $堕落阶段: data.堕落度 < 10 ? '清白无瑕'
      : data.堕落度 < 25 ? '微有动摇'
      : data.堕落度 < 45 ? '暗生贪念'
      : data.堕落度 < 65 ? '身心交战'
      : data.堕落度 < 85 ? '深陷泥沼'
      : '堕入深渊',
  }));
}

// === 女角色完整结构 ===
function 创建女角色(
  角色名: (typeof 女角色列表)[number],
  好感度默认: Partial<Record<string, number>>,
  处女默认: (typeof 贞操状态列表)[number],
  额外默认: {
    与主角关系: string;
    信仰倾向: string;
    登场状态: (typeof 登场状态列表)[number];
    当前立场: string;
    当前行动: string;
    公开态度: string;
    私下想法: string;
  },
) {
  const 好感度对象列表 = ['{{user}}', ...核心角色列表.filter(n => n !== 角色名)] as const;
  return z.object({
    与主角关系: z.string().prefault(额外默认.与主角关系),
    信仰倾向: z.string().prefault(额外默认.信仰倾向),
    登场状态: z.enum(登场状态列表).prefault(额外默认.登场状态),
    当前立场: z.string().prefault(额外默认.当前立场),
    当前行动: z.string().prefault(额外默认.当前行动),
    公开态度: z.string().prefault(额外默认.公开态度),
    私下想法: z.string().prefault(额外默认.私下想法),
    好感度: 创建好感度(好感度对象列表, 好感度默认),
    路线: 创建路线追踪(角色名),
    身体状态: 创建身体状态(处女默认),
    心理状态: 创建心理状态(),
    关键事件: z.record(z.string(), z.string()).prefault({}),
  }).prefault({});
}

// === 男角色/NTR源：张哲恺 ===
const 张哲恺Schema = z.object({
  与主角关系: z.string().prefault('表弟'),
  登场状态: z.enum(登场状态列表).prefault('登场中'),
  信仰倾向: z.string().prefault('暂无正式信仰'),
  好感度: 创建好感度(
    ['{{user}}', '张建珍', '张素菲', '张宇', '王群荣', '诺姆'],
    { '{{user}}': 40, 张建珍: 72, 张素菲: 68, 张宇: 65, 王群荣: 45, 诺姆: 20 },
  ),
  觊觎度: z.object({
    张建珍: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(25),
    张素菲: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(30),
    张宇: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(28),
  }).prefault({}),
  大胆度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(15),
  欲望失衡度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(24),
  宗司局关注度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(38),
  当前立场: z.string().prefault('想借家里威势扩自己面子'),
  当前行动: z.string().prefault('偷听大人谈话，准备去学校放风'),
  公开态度: z.string().prefault('在家装乖，在外张扬'),
  私下想法: z.string().prefault('他想证明自己不是被庇护的孩子'),
  关键事件: z.record(z.string(), z.string()).prefault({}),
}).prefault({}).transform(data => ({
  ...data,
  $觊觎阶段: (() => {
    const max = Math.max(data.觊觎度.张建珍, data.觊觎度.张素菲, data.觊觎度.张宇);
    if (max < 15) return '隐忍窥探';
    if (max < 30) return '暗中试探';
    if (max < 50) return '小心越线';
    if (max < 70) return '胆大妄为';
    if (max < 90) return '肆无忌惮';
    return '完全失控';
  })(),
  $风险标签: (() => {
    const 标签: string[] = ['未成年'];
    if (data.大胆度 >= 50) 标签.push('行为越线');
    if (data.欲望失衡度 >= 60) 标签.push('欲望失衡');
    if (data.宗司局关注度 >= 60) 标签.push('宗司局关注');
    return 标签;
  })(),
}));

// === 男角色/NTR源：诺姆 ===
const 诺姆Schema = z.object({
  与主角关系: z.string().prefault('地精使团对接对象'),
  登场状态: z.enum(登场状态列表).prefault('登场中'),
  信仰倾向: z.string().prefault('伪装成福星信仰，实为邪神色孽'),
  好感度: 创建好感度(
    ['{{user}}', '张建珍', '张素菲', '张宇', '张哲恺', '王群荣'],
    { '{{user}}': 35, 张建珍: 10, 张素菲: 22, 张宇: 25, 张哲恺: 30, 王群荣: 15 },
  ),
  渗透度: z.object({
    张建珍: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(5),
    张素菲: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(3),
    张宇: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(4),
    张哲恺: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(8),
    '{{user}}': z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(6),
  }).prefault({}),
  操控度: z.object({
    张哲恺: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(5),
    孙彪: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
    马会三: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(8),
  }).prefault({}),
  欲望失衡度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(78),
  宗司局关注度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(98),
  邪神赐福蓄能: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(40),
  当前立场: z.string().prefault('以合作之名刺探乾国高层关系网'),
  当前行动: z.string().prefault('提前抵达庄园制造节奏差'),
  公开态度: z.string().prefault('礼貌谦和，频频示弱'),
  私下想法: z.string().prefault('先让人放松，再把缝隙撬开'),
  关键事件: z.record(z.string(), z.string()).prefault({ 渗透任务: '已开始', 外交接触: '点名主角负责' }),
}).prefault({}).transform(data => ({
  ...data,
  $渗透阶段: (() => {
    const max = Math.max(
      data.渗透度.张建珍, data.渗透度.张素菲, data.渗透度.张宇,
      data.渗透度.张哲恺, data.渗透度['{{user}}'],
    );
    if (max < 10) return '初始观察';
    if (max < 25) return '话术铺垫';
    if (max < 40) return '信仰试水';
    if (max < 55) return '信徒诱捕';
    if (max < 70) return '暗中分化';
    if (max < 85) return '欲望点火';
    return '多线操盘';
  })(),
  $风险标签: (() => {
    const 标签: string[] = ['邪神渗透源'];
    if (data.邪神赐福蓄能 >= 60) 标签.push('赐福高能');
    if (data.宗司局关注度 >= 90) 标签.push('宗司局重点');
    return 标签;
  })(),
}));

// === 男角色：王群荣 ===
const 王群荣Schema = z.object({
  与主角关系: z.string().prefault('父亲兼王家掌权人'),
  登场状态: z.enum(登场状态列表).prefault('登场中'),
  信仰倾向: z.string().prefault('福神'),
  好感度: 创建好感度(
    ['{{user}}', '张建珍', '张素菲', '张宇', '张哲恺', '诺姆'],
    { '{{user}}': 55, 张建珍: 72, 张素菲: 68, 张宇: 60, 张哲恺: 48, 诺姆: 12 },
  ),
  欲望失衡度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
  宗司局关注度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(52),
  警觉度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(60),
  当前立场: z.string().prefault('优先保住家门与王家利益'),
  当前行动: z.string().prefault('评估诺姆接触王氏集团的风险'),
  公开态度: z.string().prefault('寡言稳重，话少但分量重'),
  私下想法: z.string().prefault('若局势失控，他不介意动用王家暗线'),
  关键事件: z.record(z.string(), z.string()).prefault({ 家族安排: '亲自坐镇', 商业封锁: '随时可启用' }),
}).prefault({});

// === 外围角色 ===
function 创建外围角色(默认值: {
  与主角关系: string;
  登场状态: (typeof 登场状态列表)[number];
  信仰倾向: string;
  好感度_user: number;
  好感度_张哲恺: number;
  好感度_诺姆: number;
  欲望失衡度: number;
  宗司局关注度: number;
  当前立场: string;
  当前行动: string;
}) {
  return z.object({
    与主角关系: z.string().prefault(默认值.与主角关系),
    登场状态: z.enum(登场状态列表).prefault(默认值.登场状态),
    信仰倾向: z.string().prefault(默认值.信仰倾向),
    好感度: 创建好感度(
      ['{{user}}', '张哲恺', '诺姆'],
      { '{{user}}': 默认值.好感度_user, 张哲恺: 默认值.好感度_张哲恺, 诺姆: 默认值.好感度_诺姆 },
    ),
    欲望失衡度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(默认值.欲望失衡度),
    宗司局关注度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(默认值.宗司局关注度),
    当前立场: z.string().prefault(默认值.当前立场),
    当前行动: z.string().prefault(默认值.当前行动),
    关键事件: z.record(z.string(), z.string()).prefault({}),
  }).prefault({});
}

// === 事件结构 ===
function 创建事件结构(默认值: { 当前状态: string; 危险度: number; 推进度: number; 牵涉人物: string[]; 备注: string }) {
  return z.object({
    当前状态: z.string().prefault(默认值.当前状态),
    危险度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(默认值.危险度),
    推进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(默认值.推进度),
    牵涉人物: z.array(z.string()).prefault(默认值.牵涉人物),
    备注: z.string().prefault(默认值.备注),
  }).prefault({});
}

// ═══════════════════════════════════════════════════════════
// 主 Schema
// ═══════════════════════════════════════════════════════════

export const Schema = z.object({
  世界: z.object({
    当前日期: z.string().prefault('乾历七十七年·初秋'),
    当前时段: z.string().prefault('夜间'),
    当前地点: z.string().prefault('王氏庄园会客厅'),
    外交热度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(62),
    宗司局警戒: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(74),
    邪神渗透度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(21),
    当前焦点事件: z.string().prefault('诺姆提前抵达王氏庄园'),
  }).prefault({}),

  主角: z.object({
    姓名: z.string().prefault('{{user}}'),
    年龄: z.coerce.number().transform(v => _.clamp(v, 18, 30)).prefault(20),
    身份: z.string().prefault('乾国外交部外交官'),
    行事风格: z.string().prefault('克制审慎'),
    初始信仰倾向: z.string().prefault('福运未定'),
  }).prefault({}),

  开局设置: z.object({
    已完成创建: z.coerce.boolean().prefault(false),
  }).prefault({}),

  当前焦点角色: z.enum(核心角色列表).prefault('张建珍'),

  // ─── 三位女角色（完整路线系统）───
  张建珍: 创建女角色('张建珍',
    { '{{user}}': 62, 王群荣: 70, 张素菲: 75, 张宇: 55, 张哲恺: 78, 诺姆: 5 },
    '完整',
    {
      与主角关系: '母亲兼宗司局总局局长',
      信仰倾向: '正义女神',
      登场状态: '登场中',
      当前立场: '保护家人，同时防范地精使团',
      当前行动: '亲自审看诺姆资料与安保配置',
      公开态度: '冷静强势，不接受任何越线行为',
      私下想法: '只要事态失控，她会立刻切断一切外交体面',
    },
  ),

  张素菲: 创建女角色('张素菲',
    { '{{user}}': 68, 张建珍: 80, 王群荣: 65, 张宇: 72, 张哲恺: 65, 诺姆: 10 },
    '完整',
    {
      与主角关系: '姐姐',
      信仰倾向: '财神',
      登场状态: '登场中',
      当前立场: '把公司、舆论和家门一起稳住',
      当前行动: '压媒体口风，调整集团安保',
      公开态度: '锋利强势，护短明显',
      私下想法: '她比谁都清楚这次风声能毁掉多少人',
    },
  ),

  张宇: 创建女角色('张宇',
    { '{{user}}': 78, 张建珍: 60, 王群荣: 55, 张素菲: 74, 张哲恺: 42, 诺姆: 8 },
    '完整',
    {
      与主角关系: '妻子',
      信仰倾向: '未公开祈愿',
      登场状态: '登场中',
      当前立场: '无条件站在主角这边',
      当前行动: '陪同并观察家中气氛',
      公开态度: '体面亲和，适合出现在镜头前',
      私下想法: '她不喜欢诺姆看人的方式',
    },
  ),

  // ─── 男角色 ───
  王群荣: 王群荣Schema,
  张哲恺: 张哲恺Schema,
  诺姆: 诺姆Schema,

  // ─── 外围角色 ───
  外围: z.object({
    宋野: 创建外围角色({
      与主角关系: '张哲恺在贵族学校的跟班之一',
      登场状态: '待命',
      信仰倾向: '跟风拜所谓好运神',
      好感度_user: 30, 好感度_张哲恺: 70, 好感度_诺姆: 15,
      欲望失衡度: 18, 宗司局关注度: 12,
      当前立场: '想靠近张家圈层抬身份',
      当前行动: '等张哲恺放消息',
    }),
    许廷: 创建外围角色({
      与主角关系: '张哲恺在贵族学校的跟班之一',
      登场状态: '待命',
      信仰倾向: '表面无信仰，私下喜欢神秘传闻',
      好感度_user: 35, 好感度_张哲恺: 65, 好感度_诺姆: 18,
      欲望失衡度: 15, 宗司局关注度: 14,
      当前立场: '精于看风向，想攥一点把柄',
      当前行动: '悄悄收集与使团相关的八卦',
    }),
    孙彪: 创建外围角色({
      与主角关系: '张哲恺在社会面结识的狐朋狗友',
      登场状态: '待命',
      信仰倾向: '求财求快，容易被邪神话术诱导',
      好感度_user: 20, 好感度_张哲恺: 55, 好感度_诺姆: 30,
      欲望失衡度: 41, 宗司局关注度: 33,
      当前立场: '谁给钱就替谁办事',
      当前行动: '打探使团周边的安保空档',
    }),
    马会三: 创建外围角色({
      与主角关系: '张哲恺在社会面结识的狐朋狗友',
      登场状态: '待命',
      信仰倾向: '对任何神都不敬，只认利益',
      好感度_user: 18, 好感度_张哲恺: 50, 好感度_诺姆: 25,
      欲望失衡度: 37, 宗司局关注度: 29,
      当前立场: '趁乱卖消息抬价',
      当前行动: '联系外宾馆附近的内线',
    }),
  }).prefault({}),

  // ─── 事件池 ───
  事件池: z.object({
    外交接待: 创建事件结构({
      当前状态: '进行中', 危险度: 66, 推进度: 24,
      牵涉人物: ['{{user}}', '张建珍', '诺姆', '张宇'],
      备注: '使团提前抵达，接待节奏被打乱。',
    }),
    宗司局调查: 创建事件结构({
      当前状态: '升级预警', 危险度: 73, 推进度: 31,
      牵涉人物: ['张建珍', '诺姆', '王群荣'],
      备注: '总局怀疑使团中夹带伪装信仰材料。',
    }),
    家族舆情: 创建事件结构({
      当前状态: '暗流扩散', 危险度: 52, 推进度: 28,
      牵涉人物: ['张素菲', '张宇', '{{user}}'],
      备注: '商界与社交圈都在盯着两家会不会借外交翻桌。',
    }),
    诺姆渗透: 创建事件结构({
      当前状态: '初始试探', 危险度: 81, 推进度: 19,
      牵涉人物: ['诺姆', '{{user}}', '张建珍'],
      备注: '目标是先找到高影响力人物的心理缝隙。',
    }),
    校园支线: 创建事件结构({
      当前状态: '风声待起', 危险度: 36, 推进度: 15,
      牵涉人物: ['张哲恺', '宋野', '许廷'],
      备注: '张哲恺的圈层保密能力很差。',
    }),
    社会支线: 创建事件结构({
      当前状态: '灰线活动', 危险度: 44, 推进度: 17,
      牵涉人物: ['孙彪', '马会三', '诺姆'],
      备注: '有人想借外宾消息换钱。',
    }),
    NTR暗线: 创建事件结构({
      当前状态: '潜伏期', 危险度: 20, 推进度: 0,
      牵涉人物: ['张哲恺', '诺姆'],
      备注: '张哲恺的觊觎和诺姆的渗透目前还是独立的暗线。',
    }),
  }).prefault({}),

}).prefault({});

export type Schema = z.output<typeof Schema>;
