export const Schema = z.object({
  时间: z.object({
    当前日期: z.string(),
    当前时间: z.string(),
    末日天数: z.coerce.number().transform(v => Math.max(v, 1)),
  }),

  安全屋: z.object({
    等级: z.coerce.number().transform(v => _.clamp(v, 1, 10)),
    房间: z.record(
      z.string().describe('房间名'),
      z.object({
        处于此处的NPC: z.string(),
      }),
    ),
  }),

  主角: z.object({
    年龄: z.coerce.number(),
    等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)),
    异能: z.record(
      z.string().describe('异能名'),
      z.object({
        品级: z.string(),
        等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)),
        能量: z.coerce.number().transform(v => Math.max(v, 0)),
        技能: z
          .record(
            z.string().describe('技能名'),
            z.object({
              等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)),
            }),
          )
          .default({}),
      }),
    ),
    技能: z
      .record(
        z.string().describe('技能名'),
        z.object({
          等级: z.coerce.number().transform(v => _.clamp(v, 1, 99)),
        }),
      )
      .default({}),
  }),

  NPC状态: z.record(
    z.string().describe('NPC名'),
    z.object({
      年龄: z.coerce.number(),
      性别: z.string(),
      当前位置: z.string(),
      当前行为: z.string(),
      最后一次互动记录: z.string(),
      持有异能: z.string(),
      是否已加微信: z.coerce.boolean().default(false),
      是否为住客: z.coerce.boolean().default(false),
    }),
  ),

  物资仓库: z.record(
    z.string().describe('物资名'),
    z.object({
      数量: z.coerce.number().transform(v => Math.max(v, 0)),
      单位: z.string(),
      每自然日消耗量: z.coerce.number().default(0),
    }),
  ),

  微信系统: z.object({
    群聊: z.record(
      z.string().describe('群名'),
      z.object({
        群设定: z.string(),
        简要消息记录: z.string(),
      }),
    ),
    私聊记录: z
      .record(
        z.string().describe('NPC名'),
        z
          .array(
            z.object({
              发送者: z.string(),
              内容: z.string(),
              时间: z.string(),
            }),
          )
          .transform(arr => arr.slice(-20)),
      )
      .default({}),
    群聊记录: z
      .record(
        z.string().describe('群名'),
        z
          .array(
            z.object({
              发送者: z.string(),
              内容: z.string(),
              时间: z.string(),
            }),
          )
          .transform(arr => arr.slice(-20)),
      )
      .default({}),
  }),
});
export type Schema = z.output<typeof Schema>;
