export const Schema = z.object({
  世界: z.object({
    当前时间: z.string().prefault('2077年1月1日 00:00'),
    当前地点: z.string().prefault('家中卧室'),
    世界危险等级: z.string().prefault('末日爆发'),
    全球动态: z.string().prefault('全球电子设备同步停滞，来自未知维度的"深渊"孢子渗透生态圈，全球生物开始异变'),
    主要灾害: z.string().prefault('丧尸群、孢子污染'),
    天气: z.string().prefault('阴云密布'),
    昼夜: z.enum(['白天', '夜晚']).prefault('白天'),
    近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')).prefault({}),
    周期性事件: z.record(z.string().describe('事件名'), z.string().describe('事件描述')).prefault({}),
  }).prefault({}),

  主角: z.object({
    基本信息: z.object({
      姓名: z.string().prefault('待设定'),
      年龄: z.coerce.number().prefault(0),
      性别: z.string().prefault('待设定'),
      人种和语言: z.string().prefault('待设定'),
      性格: z.string().prefault('待设定'),
      贡献点: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    }).prefault({}),

    核心属性: z.object({
      力量: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      敏捷: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      体质: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      精神: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      感知: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      魅力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
    }).prefault({}),

    状态面板: z.object({
      生命值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
      精神力: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(100),
      饱食度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(80),
      清洁度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(80),
      情绪: z.string().prefault('平静'),
    }).prefault({}),

    异能: z.object({
      名称: z.string().prefault('亚空间储物'),
      等级: z.coerce.number().prefault(1),
      经验值: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
      当前容量: z.coerce.number().prefault(1000),
      特性: z.record(
        z.string().describe('特性名'),
        z.object({
          效果: z.string().prefault(''),
          已解锁: z.boolean().prefault(false),
        }),
      ).prefault({
        '绝对静止': { 效果: '空间内时间流速为零，所有物品保持放入时的状态', 已解锁: true },
        '活体储存': { 效果: '可将活物存入空间（待解锁）', 已解锁: false },
        '空间切割': { 效果: '可切割小范围空间进行攻击（待解锁）', 已解锁: false },
        '短距传送': { 效果: '可在视野范围内进行瞬间移动（待解锁）', 已解锁: false },
      }),
    }).prefault({}),

    技能: z.object({
      战斗: z.object({
        枪械: z.object({ 等级: z.coerce.number().prefault(0), 经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(0) }).prefault({}),
        冷兵器: z.object({ 等级: z.coerce.number().prefault(1), 经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(50) }).prefault({}),
      }).prefault({}),
      生存: z.object({
        烹饪: z.object({ 等级: z.coerce.number().prefault(0), 经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(0) }).prefault({}),
        医疗: z.object({ 等级: z.coerce.number().prefault(1), 经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(10) }).prefault({}),
        潜行: z.object({ 等级: z.coerce.number().prefault(2), 经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(120) }).prefault({}),
      }).prefault({}),
      技术: z.object({
        维修: z.object({ 等级: z.coerce.number().prefault(0), 经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(0) }).prefault({}),
        驾驶: z.object({ 等级: z.coerce.number().prefault(1), 经验: z.coerce.number().transform(v => Math.max(0, v)).prefault(80) }).prefault({}),
      }).prefault({}),
    }).prefault({}),

    物品栏: z.record(
      z.string().describe('物品名'),
      z.object({
        描述: z.string().prefault(''),
        数量: z.coerce.number().prefault(1),
        品质: z.enum(['S', 'A', 'B']).prefault('B'),
      }),
    ).transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)).prefault({}),

    所在基地: z.string().prefault('无（末日初期，尚未加入基地）'),
    队伍成员: z.record(z.string().describe('成员名'), z.string().describe('成员简介')).prefault({}),
  }).prefault({}),

  基地总览: z.record(
    z.enum(['天空之城', '地下之城', '移动之城', '陆地之城']).describe('基地名称'),
    z.object({
      阵营: z.string().prefault(''),
      状态: z.object({
        防御: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
        物资: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
      }).prefault({}),
      人口: z.object({
        异能者: z.coerce.number().prefault(0),
        普通人: z.coerce.number().prefault(0),
      }).prefault({}),
      每月预警: z.string().prefault('暂无'),
      声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }),
  ).prefault({
    天空之城: { 阵营: '天穹堡垒（秩序与科技）', 状态: { 防御: 80, 物资: 65 }, 人口: { 异能者: 1500, 普通人: 8000 }, 每月预警: '暂无', 声望: 0 },
    地下之城: { 阵营: '蜂巢都市（自由混乱）', 状态: { 防御: 30, 物资: 70 }, 人口: { 异能者: 2000, 普通人: 12000 }, 每月预警: '暂无', 声望: 0 },
    移动之城: { 阵营: '流浪方舟（机动掠夺）', 状态: { 防御: 55, 物资: 50 }, 人口: { 异能者: 800, 普通人: 3000 }, 每月预警: '暂无', 声望: 0 },
    陆地之城: { 阵营: '伊甸园（共生进化）', 状态: { 防御: 40, 物资: 85 }, 人口: { 异能者: 1000, 普通人: 5000 }, 每月预警: '暂无', 声望: 0 },
  }).prefault({}),

  NPC关系: z.record(
    z.string().describe('NPC姓名'),
    z.object({
      好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      关系: z.string().prefault('陌生人'),
      所属基地: z.string().prefault('未知'),
      简介: z.string().prefault(''),
    }),
  ).prefault({}),

  每月行动: z.object({
    当前月份: z.coerce.number().prefault(1),
    剩余行动点: z.coerce.number().transform(v => _.clamp(v, 0, 4)).prefault(4),
    行动记录: z.record(z.string().describe('行动编号'), z.string().describe('行动执行结果')).prefault({}),
  }).prefault({}),

  待处理事件: z.record(
    z.string().describe('事件名'),
    z.string().describe('事件描述'),
  ).prefault({}),
});

export type Schema = z.output<typeof Schema>;
