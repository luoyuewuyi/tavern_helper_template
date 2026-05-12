export const Schema = z
  .object({
    世界: z.object({
      季节: z.enum(['春', '夏', '秋', '冬']),
      时段: z.enum(['晨间', '正午', '午后', '夜晚', '深夜']),
      地点: z.string(),
      天气: z.string(),
    }),
    白荔: z.object({
      好感度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
      形态: z.enum(['巨蛇', '拉弥亚', '人形']),
      当前状态: z.string(),
      季节活性: z.enum(['春困', '盛夏活跃', '秋缓', '冬日寻暖']),
      蜕皮阶段: z.enum(['稳定期', '蜕皮前', '蜕皮后敏感']),
      当前情绪: z.string(),
      对user称呼: z.string(),
      亲密接触: z.enum(['不可触碰', '可近身', '可牵手', '可依偎', '可缠抱']),
      收藏: z
        .record(
          z.string().describe('收藏名'),
          z.object({
            描述: z.string(),
            来历: z.string(),
          }),
        )
        .transform(data => _(data).entries().takeRight(8).fromPairs().value()),
    }),
  })
  .transform(data => {
    const $好感阶段 =
      data.白荔.好感度 < 20
        ? '疏冷观察'
        : data.白荔.好感度 < 40
          ? '藏尾试探'
          : data.白荔.好感度 < 60
            ? '软化靠近'
            : data.白荔.好感度 < 80
              ? '缠尾依恋'
              : '眷巢贴身';

    const 季节活性 =
      data.世界.季节 === '春'
        ? '春困'
        : data.世界.季节 === '夏'
          ? '盛夏活跃'
          : data.世界.季节 === '秋'
            ? '秋缓'
            : '冬日寻暖';

    const 亲密接触 =
      $好感阶段 === '疏冷观察'
        ? '不可触碰'
        : $好感阶段 === '藏尾试探'
          ? '可近身'
          : $好感阶段 === '软化靠近'
            ? '可牵手'
            : $好感阶段 === '缠尾依恋'
              ? '可依偎'
              : '可缠抱';

    const 当前状态 =
      data.世界.季节 === '冬' && data.世界.时段 === '深夜'
        ? '冬眠贴贴'
        : $好感阶段 === '疏冷观察'
          ? '警惕'
          : $好感阶段 === '藏尾试探'
            ? '试探'
            : $好感阶段 === '软化靠近'
              ? '依恋'
              : $好感阶段 === '缠尾依恋'
                ? '缠宠'
                : '冬眠贴贴';

    return {
      ...data,
      白荔: {
        ...data.白荔,
        当前状态:
          data.白荔.蜕皮阶段 === '蜕皮前' && 当前状态 === '缠宠'
            ? '依恋'
            : 当前状态,
        季节活性,
        亲密接触,
        $好感阶段,
      },
    };
  });

export type Schema = z.output<typeof Schema>;
