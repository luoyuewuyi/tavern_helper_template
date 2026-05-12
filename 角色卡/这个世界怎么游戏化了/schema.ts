export const Schema = z
  .object({
    世界: z.object({
      世界类型: z.string().prefault('待设定'),
      当前时间: z.string().prefault('待初始化'),
      当前地点: z.string().prefault('待初始化'),
      世界规则摘要: z.string().prefault('由开局输入决定；若留空，由AI生成一个可游玩的现实/奇幻/科幻/同人世界。'),
      近期事件: z
        .record(
          z.string().describe('事件名'),
          z.object({
            描述: z.string().prefault('待记录'),
            影响: z.string().prefault('暂无'),
          }),
        )
        .prefault({}),
    }),

    玩家: z.object({
      姓名: z.string().prefault('{{user}}'),
      年龄: z.string().prefault('待设定'),
      外表: z.string().prefault('待设定'),
      背景: z.string().prefault('待设定'),
      身份: z.string().prefault('待设定'),
      等级: z.coerce.number().prefault(1).transform(value => _.clamp(value, 1, 999)),
      经验: z.coerce.number().prefault(0).transform(value => _.clamp(value, 0, 99)),
      可用技能点: z.coerce.number().prefault(0).transform(value => Math.max(0, value)),
      金钱: z.coerce.number().prefault(0),
      声望: z
        .record(z.string().describe('圈层或势力名'), z.coerce.number().transform(value => _.clamp(value, -100, 100)))
        .prefault({}),
      当前状态: z
        .record(
          z.string().describe('状态名'),
          z.object({
            描述: z.string().prefault('待记录'),
            剩余: z.string().prefault('未知'),
          }),
        )
        .prefault({}),
    }),

    技能: z
      .record(
        z.string().describe('技能大类'),
        z.record(
          z.string().describe('技能名'),
          z.object({
            等级: z.coerce.number().prefault(1).transform(value => _.clamp(value, 1, 4)),
            经验: z.coerce.number().prefault(0).transform(value => _.clamp(value, 0, 100)),
            描述: z.string().prefault('待记录'),
            来源: z.string().prefault('背景或剧情获得'),
          }),
        ),
      )
      .prefault({}),

    任务: z.object({
      活跃: z
        .record(
          z.string().describe('任务名'),
          z.object({
            发布者: z.string().prefault('未知'),
            类型: z.enum(['主线', '支线', '日常', '临机']).prefault('支线'),
            目标: z.string().prefault('待明确'),
            难度: z.enum(['低', '中', '高', '突破']).prefault('低'),
            奖励: z.object({
              技能经验: z.coerce.number().prefault(1).transform(value => Math.max(0, value)),
              金钱: z.coerce.number().prefault(0),
              道具: z.string().prefault('无'),
              其他: z.string().prefault('无'),
            }),
            状态: z.enum(['可接取', '进行中', '可提交']).prefault('可接取'),
            隐性价值: z.string().prefault('无'),
          }),
        )
        .prefault({}),
      已完成: z
        .record(
          z.string().describe('任务名'),
          z.object({
            完成时间: z.string().prefault('未知'),
            结果: z.string().prefault('已完成'),
            奖励去向: z.string().prefault('待分配'),
          }),
        )
        .prefault({}),
    }),

    人物: z
      .record(
        z.string().describe('人物名'),
        z.object({
          身份: z.string().prefault('待记录'),
          关系: z.string().prefault('陌生'),
          好感: z.coerce.number().prefault(0).transform(value => _.clamp(value, -100, 100)),
          可发布任务倾向: z.string().prefault('未知'),
          备注: z.string().prefault('无'),
        }),
      )
      .prefault({}),

    背包: z
      .record(
        z.string().describe('物品名'),
        z.object({
          描述: z.string().prefault('待记录'),
          数量: z.coerce.number().prefault(1),
          来源: z.string().prefault('未知'),
        }),
      )
      .prefault({})
      .transform(data => _.pickBy(data, item => item.数量 > 0)),

    系统: z.object({
      当前提示: z.string().prefault('技能与任务系统已激活。'),
      待分配技能经验: z.coerce.number().prefault(0).transform(value => Math.max(0, value)),
      日志: z
        .record(
          z.string().describe('日志编号'),
          z.object({
            时间: z.string().prefault('未知'),
            内容: z.string().prefault('待记录'),
          }),
        )
        .prefault({}),
    }),
  })
  .transform(data => {
    const skill_rank = (level: number) => (level <= 1 ? '低级' : level === 2 ? '中级' : level === 3 ? '高级' : 'MAX');
    const 技能 = _.mapValues(data.技能, category =>
      _.mapValues(category, skill => ({
        ...skill,
        $阶位: skill_rank(skill.等级),
      })),
    );
    return { ...data, 技能 };
  });

export type Schema = z.output<typeof Schema>;
