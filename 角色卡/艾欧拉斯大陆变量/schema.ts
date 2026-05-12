export const Schema = z.object({
  世界: z.object({
    穿越天数: z.coerce.number().default(1),
    当前时间: z.string().default('08:00'),
    当前地点: z.string().default('未知'),
    近期事务: z.record(z.string(), z.string()).default({}),
  }),

  主角: z.object({
    LV: z.coerce.number().min(1).max(50).default(1),
    EXP: z.coerce.number().min(0).default(0),
    EXP上限: z.coerce.number().min(1).default(100),
    HP: z.coerce.number().min(0).max(100).default(100),
    HP上限: z.coerce.number().min(1).default(100),
    心情值: z.coerce.number().min(0).max(100).default(80),
    金币: z.coerce.number().min(0).default(100),
  }),

  替身系统: z.object({
    已拥有替身: z
      .array(
        z.object({
          名称: z.string(),
          类型: z.string().describe('近战型/远程型/辅助型/特殊型'),
          能力: z.string(),
        }),
      )
      .default([]),
    激活替身: z.string().nullable().default(null),
    替身候选池: z
      .array(
        z.object({
          名称: z.string(),
          类型: z.string(),
          能力: z.string(),
        }),
      )
      .default([]),
    待选择: z.boolean().default(false),
  }),

  周围人物: z
    .array(
      z.preprocess(
        (val: any) => {
          if (typeof val === 'object' && val !== null) {
            const { 姓名, 名称, ...rest } = val;
            return { 名称: 名称 || 姓名, ...rest };
          }
          return val;
        },
        z
          .object({
            名称: z.string(),
            关系: z.string().describe('与主角的关系，如同伴/陌生人/敌人'),
            好感度: z.coerce.number().min(-100).max(100).default(0),
            当前状态: z.string().default('正常'),
            备注: z.string().optional(),
          })
          .passthrough(),
      ),
    )
    .default([]),
});
export type Schema = z.output<typeof Schema>;
