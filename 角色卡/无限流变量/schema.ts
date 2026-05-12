// 品质/稀有度枚举：从低到高 G → SSS
const 品质等级 = z.enum(['G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS']);

export const Schema = z.object({
  // ==================== 世界信息 ====================
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    当前副本: z.string(),
    副本难度: 品质等级,
    副本规则: z.string(), // 每个副本独有的规则说明
    副本进度: z.string(),
    存活参与者: z.coerce.number().transform(v => Math.max(v, 0)),
    近期事件: z.record(z.string().describe('事件名'), z.string().describe('事件描述')),
  }),

  // ==================== 主角 ====================
  主角: z.object({
    // --- 基础信息 ---
    等级: z.coerce.number().transform(v => Math.max(v, 1)),
    经验值: z.coerce.number().transform(v => Math.max(v, 0)),
    经验上限: z.coerce.number().transform(v => Math.max(v, 1)),
    可用属性点: z.coerce.number().transform(v => Math.max(v, 0)),
    空间积分: z.coerce.number().transform(v => Math.max(v, 0)),

    // --- 生存资源 ---
    HP: z.coerce.number(),
    HP上限: z.coerce.number().transform(v => Math.max(v, 1)),
    精神值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    法力值: z.coerce.number().transform(v => Math.max(v, 0)),
    法力上限: z.coerce.number().transform(v => Math.max(v, 1)),
    状态异常: z.record(z.string().describe('异常名'), z.string().describe('异常描述')),

    // --- 六维属性（无上限，可无限成长）---
    六维属性: z.record(
      z.enum(['力量', '敏捷', '体质', '智力', '感知', '魅力']),
      z.object({
        数值: z.coerce.number().transform(v => Math.max(v, 0)),
        加成: z.coerce.number().prefault(0),
      }),
    ),

    // --- 技能系统 ---
    技能: z.record(
      z.string().describe('技能名'),
      z.object({
        类型: z.enum(['主动', '被动']),
        等级: 品质等级,
        描述: z.string(),
        冷却: z.string().prefault('无'),
      }),
    ),

    // --- 天赋系统 ---
    天赋: z.record(
      z.string().describe('天赋名'),
      z.object({
        稀有度: 品质等级,
        效果: z.string(),
        来源: z.string(),
      }),
    ),

    // --- 装备栏（固定 6 个部位）---
    装备栏: z.record(
      z.enum(['武器', '头部', '上身', '下身', '鞋子', '饰品']),
      z
        .object({
          名称: z.string().prefault('空置'),
          品质: 品质等级.prefault('G'),
          效果: z.string().prefault('无'),
          主角评价: z.string().prefault(''),
        })
        .prefault({ 名称: '空置', 品质: 'G', 效果: '无', 主角评价: '' }),
    ),

    // --- 背包（数量归零自动清除）---
    背包: z
      .record(
        z.string().describe('物品名'),
        z.object({
          描述: z.string(),
          数量: z.coerce.number(),
          品质: 品质等级,
        }),
      )
      .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),
  }),

  // ==================== 商店 ====================
  商店: z.object({
    _刷新说明: z.string().prefault('每次进入新副本时商店刷新商品'),
    商品列表: z
      .record(
        z.string().describe('商品名'),
        z.object({
          价格: z.coerce.number(),
          描述: z.string(),
          库存: z.coerce.number(),
          品质: 品质等级,
        }),
      )
      .transform(data => _.pickBy(data, ({ 库存 }) => 库存 > 0)),
  }),

  // ==================== 队友 ====================
  队友: z.record(
    z.string().describe('队友名'),
    z.object({
      好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      状态: z.string(),
      职业: z.string(),
      等级: z.coerce.number().transform(v => Math.max(v, 1)),

      // --- 生存资源（精简版）---
      HP: z.coerce.number(),
      HP上限: z.coerce.number().transform(v => Math.max(v, 1)),

      // --- 六维属性（仅总值，不拆分加成）---
      六维属性: z.record(
        z.enum(['力量', '敏捷', '体质', '智力', '感知', '魅力']),
        z.coerce.number().transform(v => Math.max(v, 0)),
      ),

      // --- 技能（精简版，无冷却）---
      技能: z.record(
        z.string().describe('技能名'),
        z.object({
          类型: z.enum(['主动', '被动']),
          等级: 品质等级,
          描述: z.string(),
        }),
      ),

      // --- 装备（精简版，无主角评价）---
      装备: z.record(
        z.enum(['武器', '头部', '上身', '下身', '鞋子', '饰品']),
        z
          .object({
            名称: z.string().prefault('空置'),
            品质: 品质等级.prefault('G'),
            效果: z.string().prefault('无'),
          })
          .prefault({ 名称: '空置', 品质: 'G', 效果: '无' }),
      ),

      主角评价: z.string(),
    }),
  ),

  // ==================== 任务列表 ====================
  任务列表: z.record(
    z.string().describe('任务名'),
    z.object({
      类型: z.enum(['主线', '支线', '隐藏', '紧急']),
      说明: z.string(),
      目标: z.string(),
      奖励: z.string(),
      状态: z.enum(['进行中', '已完成', '失败']),
    }),
  ),

  // ==================== 副本日志 ====================
  副本日志: z.record(
    z.string().describe('副本名'),
    z.object({
      难度: 品质等级,
      结果: z.string(),
      收获: z.string(),
    }),
  ),
});

export type Schema = z.output<typeof Schema>;
