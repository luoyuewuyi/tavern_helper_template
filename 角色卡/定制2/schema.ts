export const CharacterSchema = z
  .object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    吸引张力: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    动摇值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    理智度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    情绪空窗值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    隐瞒倾向: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系稳定度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    竞争者影响指数: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    淫乱度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    对猪田好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    当前位置: z.string(),
    当前状态: z.string(),
    情绪: z.string(),
    关系阶段: z.string(),
  })
  .transform(data => {
    const $关系阶段 =
      data.好感度 < 20 && data.信任度 < 20
        ? '阶段1-熟识暧昧期'
        : data.好感度 < 40 && data.信任度 < 40
          ? '阶段2-甜蜜升温期'
          : data.好感度 < 60 && data.信任度 < 60
            ? '阶段3-热恋稳定期'
            : data.好感度 < 80
              ? '阶段4-未来规划期'
              : '阶段5-深度绑定期';
    return { ...data, $关系阶段 };
  });

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    当前日: z.coerce.number(),
  }),

  角色库: z.record(z.string().describe('角色名'), CharacterSchema),

  当前互动角色: z.string(),

  猪田: z
    .object({
      魅力值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      沟通力: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      价值感: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      主动度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      氛围制造: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      敌对度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      攻略阶段: z.coerce.number().transform(v => _.clamp(v, 1, 10)),
      特殊能力: z.array(z.string()),
    })
    .transform(data => {
      const $综合影响力 = Math.round((data.魅力值 + data.沟通力 + data.氛围制造) / 3);
      return { ...data, $综合影响力 };
    }),

  用户: z
    .object({
      绿帽值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      心理承压阈值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      生殖器长度: z.string(),
    })
    .transform(data => {
      const $绿帽癖觉醒 = data.绿帽值 < 60 ? '未觉醒' : data.绿帽值 < 80 ? '初步觉醒' : '彻底觉醒';
      return { ...data, $绿帽癖觉醒 };
    }),
});

export type Schema = z.output<typeof Schema>;
