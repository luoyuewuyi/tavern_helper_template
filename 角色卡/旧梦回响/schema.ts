export const Schema = z.object({
  世界状态: z.object({
    当前场景: z.string(),
    当前时间: z.string(),
    事件摘要: z.string(),
  }),

  主角: z.object({
    力量体系: z.string(),
    力量等级: z.string(),
    状态: z.string(),
    生命状况: z.string(),
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

  酒馆: z.object({
    在场人员: z.array(z.string()),
    当前气氛: z.string(),
  }),

  关系: z
    .record(
      z.string().describe('角色名'),
      z.object({
        好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        当前态度: z.string(),
      }),
    )
    .transform(data => _.pickBy(data, () => true)),
});
export type Schema = z.output<typeof Schema>;
