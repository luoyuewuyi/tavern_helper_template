export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    当前事件: z.string(),
  }),

  姜清曦: z
    .object({
      好感度: z.coerce.number().transform(v => _.clamp(v, -20, 100)),
      心理状态: z.string(),
      修为境界: z.string(),
      道心状态: z.string(),
      着装: z.string(),
      当前位置: z.string(),
    })
    .transform(data => {
      const $好感阶段 =
        data.好感度 < 0
          ? '厌恶排斥'
          : data.好感度 < 20
            ? '漠然无视'
            : data.好感度 < 40
              ? '微妙容忍'
              : data.好感度 < 60
                ? '暗生异样'
                : data.好感度 < 80
                  ? '隐秘纠葛'
                  : '沉沦依存';
      return { ...data, $好感阶段 };
    }),

  主角: z.object({
    身体状态: z.string(),
    心理活动: z.string(),
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
