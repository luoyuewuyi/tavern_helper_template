export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    天气: z.string(),
    近期事件: z.record(z.string().describe('事件名'), z.string().describe('事件描述')),
  }),

  白荔: z
    .object({
      好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      绝望值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      病娇值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      义体完整度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      服务芯片状态: z.enum(['活跃', '休眠', '损坏', '已移除']).prefault('休眠'),
      当前情绪: z.string(),
      身体状态: z.string(),
      着装: z.string(),
    })
    .transform(data => {
      const $关系阶段 =
        data.好感度 < 20
          ? '戒备排斥'
          : data.好感度 < 40
            ? '试探接触'
            : data.好感度 < 60
              ? '依赖形成'
              : data.好感度 < 80
                ? '病态依恋'
                : '救赎共生';
      const $危险等级 =
        data.绝望值 > 80
          ? '极度危险'
          : data.绝望值 > 60
            ? '高危'
            : data.绝望值 > 40
              ? '警戒'
              : data.绝望值 > 20
                ? '低危'
                : '稳定';
      return { ...data, $关系阶段, $危险等级 };
    }),

  主角: z.object({
    信誉: z.string(),
    欧币: z.coerce.number().transform(v => Math.max(v, 0)),
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
