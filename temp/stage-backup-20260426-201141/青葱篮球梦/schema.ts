export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    剧情阶段: z.string(),
    威胁等级: z.string(),
    重大事件记录: z.record(z.string().describe('事件名'), z.string().describe('事件描述')),
  }),

  钟致远: z.object({
    体能状态: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    心理状态: z.string(),
    伤病情况: z.string(),
    篮球实力: z.string(),
    赛季进度: z.string(),
    当前事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')),
    着装: z.record(z.enum(['上装', '下装', '鞋子', '配饰']), z.string().describe('着装描述')),
  }),

  林晓雨: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    心理创伤值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
    着装: z.string(),
  }),

  张萱: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    心理创伤值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
    着装: z.string(),
  }),

  温雪: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    依赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
  }),

  孔方颐: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    暗恋强度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
  }),

  颜妙旖: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    合作信任: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
  }),

  慕容琴: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    亲密度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
  }),

  白露: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    师生好感: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
  }),

  邱雯: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关心指数: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
  }),

  钟神秀: z.object({
    亲密度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    保护欲: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    行踪状态: z.string(),
    当前状态: z.string(),
  }),

  钟婉清: z.object({
    意识波动: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    生命体征: z.string(),
    囚禁状态: z.string(),
    当前状态: z.string(),
  }),

  小月牙: z.object({
    亲密度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    依赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    当前状态: z.string(),
  }),

  岳彦昕: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    合作度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    关系阶段: z.string(),
    当前状态: z.string(),
  }),

  赵舒奕: z.object({
    信赖度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    师徒默契: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    当前状态: z.string(),
  }),

  反派势力: z.object({
    熊安杰: z.object({
      威胁等级: z.string(),
      当前状态: z.string(),
    }),
    林老: z.object({
      威胁等级: z.string(),
      当前状态: z.string(),
    }),
    马博飞: z.object({
      威胁等级: z.string(),
      当前状态: z.string(),
    }),
    周文斌: z.object({
      威胁等级: z.string(),
      当前状态: z.string(),
    }),
    智运集团: z.object({
      威胁等级: z.string(),
      当前状态: z.string(),
    }),
    飞沃娱乐: z.object({
      威胁等级: z.string(),
      当前状态: z.string(),
    }),
  }),
});
export type Schema = z.output<typeof Schema>;
