export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    在场人物: z.array(z.string()),
  }),

  解雨臣: z
    .object({
      好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      好感阶段: z.string(),
      心理活动: z.string(),
    })
    .transform(data => {
      // 自动根据好感度计算阶段名称
      const $好感阶段 =
        data.好感度 < 10
          ? '初识'
          : data.好感度 < 20
            ? '点头之交'
            : data.好感度 < 30
              ? '试探'
              : data.好感度 < 40
                ? '相熟'
                : data.好感度 < 50
                  ? '信任'
                  : data.好感度 < 60
                    ? '欣赏'
                    : data.好感度 < 70
                      ? '亲近'
                      : data.好感度 < 80
                        ? '心动'
                        : data.好感度 < 90
                          ? '情根深种'
                          : data.好感度 < 100
                            ? '锲而不舍'
                            : '此生唯你';
      return { ...data, 好感阶段: $好感阶段 };
    }),
});
export type Schema = z.output<typeof Schema>;
