export const Schema = z.object({
  天下: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    当前事件: z.string(),
  }),

  user: z.object({
    姓名: z.string(),
    年龄: z.coerce.number(),
    性别: z.string(),
    境界: z.string(),
    修炼流派: z.string(),
    气运: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    物品栏: z
      .record(
        z.string().describe('物品名'),
        z.object({
          描述: z.string(),
          数量: z.coerce.number(),
        }),
      )
      .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),
  }),

  人物关系: z.record(
    z.string().describe('人物名'),
    z.object({
      境界: z.string(),
      好感度: z.coerce.number().transform(v => _.clamp(v, -100, 100)),
      当前状态: z.string(),
      内心活动: z.string(),
    }),
  ),
});
export type Schema = z.output<typeof Schema>;
