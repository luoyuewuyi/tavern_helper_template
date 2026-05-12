export const Schema = z.object({
  世界状态: z.object({
    当前楼层: z.coerce.number().transform(v => _.clamp(v, 1, 9)),
    当前回合: z.coerce.number().transform(v => Math.max(0, v)),
    当前阶段: z.enum(['探索', '战斗', '事件', '休息']).prefault('探索'),
    当前时间: z.string().prefault('第1天 08:00'),
  }),

  玩家: z.record(
    z.string().describe('角色名'),
    z
      .object({
        攻击: z.coerce
          .number()
          .transform(v => Math.max(0, v))
          .prefault(1),
        防御: z.coerce
          .number()
          .transform(v => Math.max(0, v))
          .prefault(1),
        HP: z.coerce
          .number()
          .transform(v => Math.max(0, v))
          .prefault(10),
        最大HP: z.coerce
          .number()
          .transform(v => Math.max(1, v))
          .prefault(10),
        等级: z.coerce
          .number()
          .transform(v => Math.max(1, v))
          .prefault(1),
        经验值: z.coerce
          .number()
          .transform(v => Math.max(0, v))
          .prefault(0),
        状态: z.enum(['正常', '受伤', '濒死', '死亡']).prefault('正常'),
        技能: z
          .object({
            名称: z.string(),
            等级: z.coerce
              .number()
              .transform(v => _.clamp(v, 1, 3))
              .prefault(1),
            冷却剩余: z.coerce
              .number()
              .transform(v => Math.max(0, v))
              .prefault(0),
            持续剩余: z.coerce
              .number()
              .transform(v => Math.max(0, v))
              .prefault(0),
            是否激活: z.boolean().prefault(false),
          })
          .prefault({ 名称: '未知', 等级: 1, 冷却剩余: 0, 持续剩余: 0, 是否激活: false }),
      })
      .prefault({
        攻击: 1,
        防御: 1,
        HP: 10,
        最大HP: 10,
        等级: 1,
        经验值: 0,
        状态: '正常',
        技能: { 名称: '未知', 等级: 1, 冷却剩余: 0, 持续剩余: 0, 是否激活: false },
      }),
  ),

  战斗状态: z
    .object({
      是否战斗中: z.boolean().prefault(false),
      战斗回合数: z.coerce
        .number()
        .transform(v => Math.max(0, v))
        .prefault(0),
      敌人: z
        .record(
          z.string().describe('敌人名'),
          z
            .object({
              攻击: z.coerce.number().prefault(0),
              防御: z.coerce.number().prefault(0),
              HP: z.coerce
                .number()
                .transform(v => Math.max(0, v))
                .prefault(0),
              最大HP: z.coerce.number().prefault(0),
            })
            .prefault({ 攻击: 0, 防御: 0, HP: 0, 最大HP: 0 }),
        )
        .prefault({}),
    })
    .prefault({ 是否战斗中: false, 战斗回合数: 0, 敌人: {} }),

  堕落度: z
    .object({
      孙承芬: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(0),
      汪碧静: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(0),
    })
    .prefault({ 孙承芬: 0, 汪碧静: 0 }),

  团队: z
    .object({
      存活人数: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 5))
        .prefault(5),
      已死亡: z.array(z.string()).prefault([]),
    })
    .prefault({ 存活人数: 5, 已死亡: [] }),

  道具栏: z
    .record(
      z.string().describe('道具名'),
      z.object({
        描述: z.string(),
        数量: z.coerce.number().prefault(1),
        持有者: z.string().prefault('团队共有'),
      }),
    )
    .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
    .prefault({}),
});

export type Schema = z.output<typeof Schema>;
