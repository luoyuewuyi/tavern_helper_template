export const CharacterSchema = z.object({
  好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
  信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
  修为境界: z.string(),
  身份: z.string(),
  当前行动: z.string(),
  当前内心: z.string(),
  着装: z.string(),
  状态: z.string(),
});

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    当前大陆: z.string(),
    当前坐标: z.object({
      x: z.coerce.number(),
      y: z.coerce.number(),
    }),
  }),

  角色库: z.record(z.string().describe('角色名'), CharacterSchema),

  主角: z.object({
    修为境界: z.string(),
    灵根: z.string(),
    灵石: z.coerce.number().transform(v => Math.max(v, 0)),
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
});
export type Schema = z.output<typeof Schema>;
