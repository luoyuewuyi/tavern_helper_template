export const Schema = z.object({
  世界: z
    .object({
      当前时间: z.string().prefault('AC298年-夏季-第1日'),
      当前季节: z.string().prefault('夏季'),
      当前地点: z.string().prefault('君临城·红堡'),
      当前局势: z.string().prefault('劳勃·拜拉席恩坐拥铁王座，七大王国表面和平'),
      铁王座: z.string().prefault('劳勃·拜拉席恩'),
      近期事件: z.record(z.string().describe('事件名'), z.string().describe('事件描述')),
    })
    .prefault({}),

  主角: z
    .object({
      身份: z.string().prefault('流浪骑士'),
      家族: z.string().prefault('无'),
      头衔: z.string().prefault('无'),
      生命状态: z.string().prefault('健康'),
      声望: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(10),
      金龙: z.coerce
        .number()
        .transform(v => Math.max(v, 0))
        .prefault(50),
      技能: z
        .record(
          z.enum(['剑术', '骑术', '弓箭', '政治', '谋略', '口才']),
          z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(10),
        )
        .prefault({}),
      物品栏: z
        .record(
          z.string().describe('物品名'),
          z
            .object({
              描述: z.string().prefault(''),
              数量: z.coerce.number().prefault(1),
            })
            .prefault({}),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),
    })
    .prefault({}),

  人物: z.record(
    z.string().describe('角色名'),
    z
      .object({
        家族: z.string().prefault('未知'),
        头衔: z.string().prefault('未知'),
        所在地: z.string().prefault('未知'),
        好感度: z.coerce
          .number()
          .transform(v => _.clamp(v, -100, 100))
          .prefault(0),
        关系: z.string().prefault('陌生'),
        态度: z.string().prefault('中立'),
        状态: z.string().prefault('存活'),
      })
      .prefault({}),
  ),

  剧情选项: z
    .object({
      选项A: z.string().prefault(''),
      选项B: z.string().prefault(''),
      选项C: z.string().prefault(''),
      选项D: z.string().prefault(''),
    })
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
