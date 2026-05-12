const 性别列表 = ['男', '女'] as const;
const 天赋列表 = ['废材', '普通', '良好', '优秀', '卓越', '天纵之才', '绝世天才'] as const;
const 体系列表 = ['古武', '修仙', '魔法', '斗气', '神术', '妖修', '鬼修', '混合'] as const;
const 好感度类型列表 = ['友情', '爱情', '亲情'] as const;

const 好感度Schema = z.object({
  数值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  类型: z.enum(好感度类型列表).prefault('友情'),
}).prefault({});

const 角色基础Schema = z.object({
  种族: z.string().prefault('人类'),
  年龄: z.coerce.number().prefault(22),
  性别: z.enum(性别列表).prefault('男'),
  身份: z.string().prefault('冒险者'),
  实力等级: z.string().prefault('初级（1级）'),
  修炼体系: z.enum(体系列表).prefault('古武'),
  天赋: z.enum(天赋列表).prefault('普通'),
  属性: z.string().prefault('无'),
  当前状态: z.string().prefault('正常'),
}).prefault({});

export const Schema = z.object({
  世界: z.object({
    当前日期: z.string().prefault('华夏穿越第3年·初春'),
    当前时段: z.string().prefault('上午'),
    当前地点: z.string().prefault('边锋镇·冒险者管理局'),
    天气: z.string().prefault('晴'),
    世界局势摘要: z.string().prefault('华夏结界持续衰退，缓冲区冒险者活动日益增多，各方势力开始渗透。'),
  }).prefault({}),

  主角: z.object({
    姓名: z.string().prefault('{{user}}'),
    年龄: z.coerce.number().transform(v => _.clamp(v, 18, 60)).prefault(22),
    性别: z.enum(性别列表).prefault('男'),
    身份: z.string().prefault('新注册冒险者'),
    修炼体系: z.enum(体系列表).prefault('古武'),
    境界: z.string().prefault('高阶（3级）'),
    天赋: z.enum(天赋列表).prefault('优秀'),
    属性: z.string().prefault('待觉醒'),
    生命值: z.string().prefault('健康'),
    信物: z.string().prefault('龙凤玉佩（刻有名字，来历不明）'),
    当前目标: z.string().prefault('在边锋镇注册冒险者，开始冒险生涯'),
  }).prefault({}),

  经济: z.object({
    铜币: z.coerce.number().transform(v => Math.max(0, v)).prefault(500),
    银币: z.coerce.number().transform(v => Math.max(0, v)).prefault(30),
    金币: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    灵石: z.coerce.number().transform(v => Math.max(0, v)).prefault(0),
    华夏信用币: z.coerce.number().transform(v => Math.max(0, v)).prefault(200),
    收支摘要: z.string().prefault('积攒多年的盘缠，够维持半个月基本开销。'),
  }).prefault({}),

  物品栏: z.record(
    z.string().describe('物品名'),
    z.object({
      数量: z.coerce.number().prefault(1),
      描述: z.string().prefault(''),
    })
  ).transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
   .prefault({
    '铁背刀': { 数量: 1, 描述: '普通铁刀，刃口锋利' },
    '低阶回复药剂': { 数量: 3, 描述: '恢复轻伤' },
    '干粮': { 数量: 5, 描述: '几天的口粮' },
    '龙凤玉佩': { 数量: 1, 描述: '信物，翠绿温润，一面雕龙一面刻凤' },
  }),

  装备栏: z.object({
    武器: z.string().prefault('铁背刀'),
    上装: z.string().prefault('华夏制式外套'),
    下装: z.string().prefault('耐磨长裤'),
    鞋子: z.string().prefault('军用作战鞋'),
    饰品: z.string().prefault('龙凤玉佩（贴身佩戴）'),
  }).prefault({}),

  好感度: z.record(
    z.string().describe('角色名'),
    z.object({
      对主角: 好感度Schema,
      主角对其: 好感度Schema,
    }).prefault({})
  ).prefault({
    '韩霄': { 对主角: { 数值: 75, 类型: '友情' }, 主角对其: { 数值: 75, 类型: '友情' } },
    '万峰': { 对主角: { 数值: 65, 类型: '友情' }, 主角对其: { 数值: 65, 类型: '友情' } },
    '顾承安': { 对主角: { 数值: 30, 类型: '友情' }, 主角对其: { 数值: 55, 类型: '友情' } },
    '叶青鸾': { 对主角: { 数值: 20, 类型: '友情' }, 主角对其: { 数值: 15, 类型: '友情' } },
    '苏挽晴': { 对主角: { 数值: 15, 类型: '友情' }, 主角对其: { 数值: 10, 类型: '友情' } },
    '主角母亲': { 对主角: { 数值: 0, 类型: '友情' }, 主角对其: { 数值: 0, 类型: '友情' } },
  }),

  后宫: z.record(
    z.string().describe('后宫成员名'),
    z.object({
      身份: z.string().prefault(''),
      好感度等级: z.coerce.number().transform(v => _.clamp(v, 1, 10)).prefault(1),
      当前状态: z.string().prefault(''),
      被黄毛觊觎程度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }).prefault({})
  ).prefault({}),

  系统: z.object({
    系统名称: z.string().prefault('天命轮盘'),
    积分: z.coerce.number().transform(v => Math.max(0, v)).prefault(100),
    当前称号: z.string().prefault('初出茅庐'),
    称号效果: z.string().prefault('无特殊效果'),
    已解锁技能: z.record(
      z.string().describe('技能名'),
      z.object({
        等级: z.string().prefault('初级'),
        描述: z.string().prefault(''),
      })
    ).prefault({
      '源力感知': { 等级: '初级', 描述: '感知周围源力波动，探测10米内的源力生物' },
      '基础话术': { 等级: '初级', 描述: '社交时对方好感度增幅+1' },
    }),
    当前任务: z.record(
      z.string().describe('任务名'),
      z.object({
        类型: z.string().prefault('支线'),
        目标: z.string().prefault(''),
        奖励: z.string().prefault(''),
        状态: z.string().prefault('进行中'),
      })
    ).prefault({
      '冒险者注册': { 类型: '主线', 目标: '前往边锋镇冒险者管理局完成登记', 奖励: '50积分、F级冒险者证', 状态: '进行中' },
    }),
    商城摘要: z.string().prefault('可兑换：低阶回复药剂(10积分)、源力感知升级(50积分)、初级魅力光环称号(100积分)'),
    最近系统消息: z.string().prefault('【天命轮盘】绑定成功！欢迎宿主，你的精彩人生从此刻开始~'),
  }).prefault({}),

  NPC动态: z.record(
    z.string().describe('NPC名'),
    z.object({
      当前位置: z.string().prefault(''),
      当前行动: z.string().prefault(''),
      对主角态度: z.string().prefault(''),
    }).prefault({})
  ).prefault({
    '韩霄': { 当前位置: '边锋镇·流火酒馆', 当前行动: '喝酒搭讪酒馆女侍', 对主角态度: '兄弟，无条件支持' },
    '万峰': { 当前位置: '边锋镇·训练场', 当前行动: '练拳', 对主角态度: '如同亲弟弟' },
    '顾承安': { 当前位置: '边锋镇·客栈', 当前行动: '独自研究地图', 对主角态度: '表面亲近，暗中观察' },
  }),

  日志: z.object({
    最近事件: z.array(z.string()).prefault(['抵达边锋镇', '系统「天命轮盘」绑定激活']),
    最近系统提示: z.array(z.string()).prefault(['初始积分100已到账', '主线任务「冒险者注册」已开启']),
  }).prefault({}),
}).prefault({});

export type StateData = z.output<typeof Schema>;
