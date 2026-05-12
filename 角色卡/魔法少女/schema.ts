export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    天气: z.string(),
    近期事件: z.record(z.string().describe('事件名'), z.string().describe('事件描述')),
  }),

  主角: z.object({
    魔力值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    精神值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    人气值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    状态: z.string(),
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

  风间悠: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    着装: z.record(z.enum(['上装', '下装', '内衣', '袜子', '鞋子', '饰品']), z.string().describe('服装描述')),
    状态: z.string(),
  }),

  神代雪: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    着装: z.record(z.enum(['上装', '下装', '内衣', '袜子', '鞋子', '饰品']), z.string().describe('服装描述')),
    状态: z.string(),
  }),

  桐叶月: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    着装: z.record(z.enum(['上装', '下装', '内衣', '袜子', '鞋子', '饰品']), z.string().describe('服装描述')),
    状态: z.string(),
  }),

  水宫希: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    着装: z.record(z.enum(['上装', '下装', '内衣', '袜子', '鞋子', '饰品']), z.string().describe('服装描述')),
    状态: z.string(),
  }),
});
export type Schema = z.output<typeof Schema>;
