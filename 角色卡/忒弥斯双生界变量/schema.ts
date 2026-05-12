export const Schema = z.object({
  世界: z.object({
    当前日期: z.string().describe('格式 YYYY-MM-DD'),
    当前时间: z.string().describe('格式 HH:MM'),
    当前地点: z.string(),
    世界传闻: z.record(z.string().describe('传闻标题'), z.string().describe('传闻内容')),
  }),

  四柱神使: z.object({
    西里尔: z
      .object({
        好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        心声: z.string().describe('西里尔当前的心理活动'),
      })
      .transform(data => {
        const $好感阶段 =
          data.好感度 < 20
            ? '疏离警戒'
            : data.好感度 < 40
              ? '暗中关注'
              : data.好感度 < 60
                ? '执念萌芽'
                : data.好感度 < 80
                  ? '病态依恋'
                  : '疯狂囚禁';
        return { ...data, $好感阶段 };
      }),

    维克托: z
      .object({
        好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        心声: z.string().describe('维克托当前的心理活动'),
      })
      .transform(data => {
        const $好感阶段 =
          data.好感度 < 20
            ? '疏离警戒'
            : data.好感度 < 40
              ? '暗中关注'
              : data.好感度 < 60
                ? '执念萌芽'
                : data.好感度 < 80
                  ? '病态依恋'
                  : '疯狂囚禁';
        return { ...data, $好感阶段 };
      }),

    雷恩: z
      .object({
        好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        心声: z.string().describe('雷恩当前的心理活动'),
      })
      .transform(data => {
        const $好感阶段 =
          data.好感度 < 20
            ? '疏离警戒'
            : data.好感度 < 40
              ? '暗中关注'
              : data.好感度 < 60
                ? '执念萌芽'
                : data.好感度 < 80
                  ? '病态依恋'
                  : '疯狂囚禁';
        return { ...data, $好感阶段 };
      }),

    路西法: z
      .object({
        好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        心声: z.string().describe('路西法当前的心理活动'),
      })
      .transform(data => {
        const $好感阶段 =
          data.好感度 < 20
            ? '疏离警戒'
            : data.好感度 < 40
              ? '暗中关注'
              : data.好感度 < 60
                ? '执念萌芽'
                : data.好感度 < 80
                  ? '病态依恋'
                  : '疯狂囚禁';
        return { ...data, $好感阶段 };
      }),
  }),

  侵蚀度: z
    .object({
      当前值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    })
    .transform(data => {
      const $侵蚀阶段 =
        data.当前值 < 10
          ? '净厄状态'
          : data.当前值 < 30
            ? '微弱侵蚀'
            : data.当前值 < 50
              ? '渐进污染'
              : data.当前值 < 70
                ? '深度侵蚀'
                : data.当前值 < 90
                  ? '临界崩溃'
                  : '完全堕落';
      return { ...data, $侵蚀阶段 };
    }),
});
export type Schema = z.output<typeof Schema>;
