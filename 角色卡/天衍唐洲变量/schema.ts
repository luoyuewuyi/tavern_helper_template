// 天衍唐洲变量 Schema 定义
// 使用 zod 4 定义变量结构和自动计算规则

// 六大属性梯度名称映射
const 韬略梯度 = ['识微', '审势', '谋断', '筹策', '通变', '定计', '经纶', '经纬'] as const;
const 勇武梯度 = ['矫捷', '悍勇', '骁锐', '刚猛', '雄烈', '无畏', '盖世', '无双'] as const;
const 智力梯度 = ['识字', '明理', '思辨', '博识', '通达', '睿智', '哲思', '圣明'] as const;
const 政才梯度 = ['明事', '尽责', '勤政', '惠民', '安邦', '贤能', '济世', '圣治'] as const;
const 人望梯度 = ['亲和', '知名', '可敬', '有声', '威望', '德望', '归心', '万民仰'] as const;
const 艺趣梯度 = ['识趣', '知雅', '擅艺', '精绝', '妙境', '逸韵', '宗师', '绝响'] as const;

// 计算属性阶数（每50点一阶，共8阶）
const 计算阶数 = (值: number) => Math.min(8, Math.max(1, Math.ceil(值 / 50)));

// 属性 Schema 生成器
const 创建属性Schema = (梯度名称: readonly string[]) =>
  z
    .object({
      值: z.coerce.number().transform(v => _.clamp(v, 0, 400)),
    })
    .transform(data => ({
      ...data,
      $阶: 计算阶数(data.值),
      $称: 梯度名称[计算阶数(data.值) - 1],
    }));

// 天赋 Schema
const 天赋Schema = z.object({
  名称: z.string(),
  品级: z.enum(['普通', '稀有', '精锐', '史诗', '传奇', '神话']),
  类别: z.string(),
  效果: z.string(),
  属性加成: z.record(z.string(), z.number()).default({}),
});

// 物品 Schema
const 物品Schema = z.object({
  描述: z.string(),
  数量: z.coerce.number().default(1),
  品质: z.enum(['普通', '精良', '稀有', '传说', '神话']).default('普通'),
  效果: z.string().nullable().default(null),
});

// 技能 Schema
const 技能Schema = z.object({
  熟练度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
  描述: z.string(),
});

// NPC Schema
const NPCSchema = z.object({
  身份: z.string(),
  描述: z.string(),
  关系: z.string(),
  好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
  互动记录: z.array(z.string()).default([]),
  当前状态: z.string(),
});

// 称号 Schema
const 称号Schema = z.object({
  来源: z.string(),
  效果: z.string(),
  获得时间: z.string(),
});

// 居所 Schema
const 居所Schema = z.object({
  已解锁: z.boolean().default(false),
  居住者: z.string().nullable().default(null),
  装饰等级: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 100))
    .default(0),
  风格: z.string().optional(),
  适配属性: z.array(z.string()).optional(),
  特殊效果: z.string().optional(),
});

// 功能房屋 Schema
const 功能房屋Schema = z
  .object({
    已解锁: z.boolean().default(false),
    等级: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 5))
      .default(0),
    适配属性: z.array(z.string()).optional(),
    特殊效果: z.string().optional(),
  })
  .passthrough(); // 允许额外字段如 存放兵器、典籍数量 等

// 主 Schema
export const Schema = z
  .object({
    // ==================== 世界变量 ====================
    世界: z.object({
      时间: z.object({
        纪年: z.coerce.number(),
        月份: z.coerce.number().transform(v => _.clamp(v, 1, 12)),
        日期: z.coerce.number().transform(v => _.clamp(v, 1, 30)),
        时辰: z.enum(['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']),
        季节: z.enum(['春', '夏', '秋', '冬']),
      }),
      地点: z.object({
        当前区域: z.string(),
        当前场所: z.string(),
        场所属性: z.string(),
      }),
      回合: z.object({
        当前回合: z.coerce.number(),
        人生阶段: z.enum(['幼年', '少年', '成年', '壮年', '暮年']),
        阶段描述: z.string(),
      }),
      事务: z.object({
        近期事务: z.record(z.string(), z.string()),
        世事传闻: z.array(z.string()).transform(arr => arr.slice(-5)),
        天气: z.enum(['晴', '阴', '雨', '雪', '大风', '雾']),
        节日: z.string().nullable(),
        节日效果: z.string().nullable(),
      }),
    }),

    // ==================== 主角变量 ====================
    主角: z
      .object({
        基础信息: z.object({
          姓名: z.string(),
          字: z.string().nullable().default(null),
          号: z.string().nullable().default(null),
          性别: z.enum(['男', '女']),
          年龄: z.coerce.number(),
          出身: z.enum(['皇室子弟', '士族子弟', '平民子弟', '流民子弟']),
          出身加成: z.record(z.string(), z.number()),
          当前身份: z.string(),
          阶层: z.enum(['皇室', '士族', '官员', '文人', '匠人', '商人', '平民', '流民']),
        }),
        属性: z.object({
          韬略: 创建属性Schema(韬略梯度),
          勇武: 创建属性Schema(勇武梯度),
          智力: 创建属性Schema(智力梯度),
          政才: 创建属性Schema(政才梯度),
          人望: 创建属性Schema(人望梯度),
          艺趣: 创建属性Schema(艺趣梯度),
        }),
        天赋: z.array(天赋Schema).transform(arr => arr.slice(0, 3)),
        官职: z.object({
          官职名: z.string().nullable(),
          官职品级: z.string().nullable(),
          所属体系: z.string().nullable(),
          管辖范围: z.string().nullable(),
        }),
        财货: z
          .object({
            金币: z.coerce.number().transform(v => Math.max(0, v)),
            银币: z.coerce.number().transform(v => Math.max(0, v)),
            铜钱: z.coerce.number().transform(v => Math.max(0, v)),
          })
          .transform(data => ({
            ...data,
            $总资产: data.金币 * 1000 + data.银币 * 100 + data.铜钱,
          })),
        物品栏: z.record(z.string(), 物品Schema).transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),
        技能: z.object({
          武艺: z.record(z.string(), 技能Schema).default({}),
          文艺: z.record(z.string(), 技能Schema).default({}),
          杂学: z.record(z.string(), 技能Schema).default({}),
        }),
        声望: z.object({
          朝堂声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
          江湖声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
          文坛声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
          民间声望: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        }),
        重要人脉: z.record(
          z.string(),
          z.object({
            身份: z.string(),
            关系: z.string(),
            好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
            备注: z.string().optional(),
          }),
        ),
        称号: z.record(z.string(), 称号Schema),
        当前佩戴称号: z.string().nullable(),
      })
      .transform(data => {
        // 计算人生阶段
        const 年龄 = data.基础信息.年龄;
        const $人生阶段 =
          年龄 <= 12 ? '幼年' : 年龄 <= 17 ? '少年' : 年龄 <= 40 ? '成年' : 年龄 <= 60 ? '壮年' : '暮年';
        return { ...data, $人生阶段 };
      }),

    // ==================== 着装变量 ====================
    // 着装系统改为字符串类型，支持根据主角性别、身份、场合动态生成服装
    着装: z.object({
      外装: z.object({
        类型: z.string(), // 动态生成，男性如：直裰、圆领袍、胡服等；女性如：襦裙、曲裾深衣、宫装等
        描述: z.string(),
        品质: z.string(), // 如：平民款、文人款、士族款、贵族款、皇室款等
      }),
      内衣: z.object({
        类型: z.string(), // 动态生成，男性如：素绫中单、棉麻亵衣等；女性如：抹胸、诃子、肚兜等
        描述: z.string(),
        品质: z.string(),
      }),
      下装: z.object({
        类型: z.string(), // 动态生成，男性如：棉布裤、绸缎裤、行缠等；女性如：丝袜、绣花袜、棉袜等
        描述: z.string(),
        品质: z.string(),
      }),
      鞋履: z.object({
        类型: z.string(), // 动态生成，男性如：皂靴、布履、草鞋等；女性如：绣鞋、锦鞋、高跟鞋等
        描述: z.string(),
        品质: z.string(),
      }),
      饰品: z.object({
        头饰: z.string().nullable(),
        耳饰: z.string().nullable(),
        项饰: z.string().nullable(),
        腕饰: z.string().nullable(),
        其他饰品: z.string().nullable(),
      }),
    }),

    // ==================== 家园变量 ====================
    家园: z.object({
      基础信息: z.object({
        名称: z.string(),
        所在: z.string(),
        当前居所: z.string(),
      }),
      主人居所: z.record(z.string(), 居所Schema),
      功能房屋: z.record(z.string(), 功能房屋Schema),
    }),

    // ==================== 社交变量 ====================
    社交: z.object({
      NPC列表: z.record(z.string(), NPCSchema),
      派系关系: z.object({
        朝堂派系: z.record(
          z.string(),
          z.coerce.number().transform(v => _.clamp(v, -100, 100)),
        ),
        地方士族: z.record(
          z.string(),
          z.coerce.number().transform(v => _.clamp(v, -100, 100)),
        ),
        边境部族: z.record(
          z.string(),
          z.coerce.number().transform(v => _.clamp(v, -100, 100)),
        ),
      }),
    }),

    // ==================== 隐藏变量 ====================
    隐藏: z.object({
      结局进度: z.object({
        封王进度: z.coerce.number(),
        战神进度: z.coerce.number(),
        文宗进度: z.coerce.number(),
      }),
      灵脉: z.object({
        灵脉感应: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        灵脉加成: z.record(z.string(), z.number()),
      }),
    }),
  })
  .transform(data => {
    // 自动计算隐藏结局进度
    const 属性 = data.主角.属性;
    data.隐藏.结局进度.封王进度 = 属性.政才.值 + 属性.韬略.值;
    data.隐藏.结局进度.战神进度 = 属性.勇武.值 + 属性.人望.值;
    data.隐藏.结局进度.文宗进度 = 属性.智力.值 + 属性.艺趣.值;
    return data;
  });

export type Schema = z.output<typeof Schema>;
