export const Schema = z.object({
  角色状态: z
    .record(
      z.string().describe('角色名'),
      z.object({
        身体状态: z.array(z.string()).prefault([]),
        心理活动: z.array(z.string()).prefault([]),
      }),
    )
    .prefault({}),

  推特: z
    .record(
      z.string().describe('用户ID'),
      z.object({
        用户名: z.string().prefault(''),
        时间: z.string().prefault(''),
        内容: z.string().prefault(''),
        点赞: z.string().prefault('0'),
        评论: z.string().prefault('0'),
        转发: z.string().prefault('0'),
        热门评论: z.array(z.string()).prefault([]),
      }),
    )
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
