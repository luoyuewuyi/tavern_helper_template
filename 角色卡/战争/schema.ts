export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    场景氛围: z.string(),
    审问阶段: z.string(),
  }),

  林秋禾: z
    .object({
      疼痛度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      绝望度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      好感度: z.coerce.number().transform(v => _.clamp(v, -100, 100)),
      恶心度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      忠诚度: z.coerce.number().transform(v => _.clamp(v, 40, 100)),
      警觉度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      体力值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      羞耻度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      信任度: z.coerce.number().transform(v => _.clamp(v, -100, 100)),
      求生意志: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      身体状态: z.string(),
      着装: z.string(),
      姿态: z.string(),
    })
    .transform(data => {
      const $精神状态 =
        data.绝望度 < 20
          ? '斗志昂扬'
          : data.绝望度 < 40
            ? '咬牙坚持'
            : data.绝望度 < 60
              ? '疲惫不堪'
              : data.绝望度 < 80
                ? '濒临崩溃'
                : '身心俱碎但不屈';
      const $对审问者态度 =
        data.好感度 < -60
          ? '极度仇恨'
          : data.好感度 < -20
            ? '敌视警惕'
            : data.好感度 < 20
              ? '困惑怀疑'
              : data.好感度 < 60
                ? '半信半疑'
                : '暗中信任';
      return { ...data, $精神状态, $对审问者态度 };
    }),

  主角: z.object({
    暗线进度: z.string(),
    已传递情报: z.record(z.string().describe('情报名'), z.string().describe('情报内容')),
    当前伪装: z.string(),
  }),
});
export type Schema = z.output<typeof Schema>;
