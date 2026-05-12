const 评级列表 = ['S', 'A', 'B', 'C', 'D', 'E'] as const;
const 梦境状态列表 = ['未入梦', '浅眠', '入梦中', '神树共鸣'] as const;
const 神树阶段列表 = ['E级', 'D级', 'C级', 'B级', 'A级', 'S级'] as const;
const 公开阶段列表 = ['隐秘萌芽', '局部异常', '暗面扩张', '全球警觉', '超凡震荡', '秩序改写'] as const;
const 库存类型列表 = ['灵魂碎片', '提取能力'] as const;
const 库存状态列表 = ['未使用', '已保留', '已赐予', '已献祭'] as const;
const 焦点类型列表 = ['个人', '团体', '组织'] as const;
const 势力态度列表 = ['无察觉', '零散关注', '谨慎调查', '高度警惕', '暗中争夺', '公开介入'] as const;
const 事件等级列表 = ['地方级', '城市级', '区域级', '国家级', '全球级'] as const;

const 能力条目Schema = z.object({
  名称: z.string(),
  来源作品: z.string(),
  评级: z.enum(评级列表),
  类型: z.enum(库存类型列表),
  形态: z.string(),
  核心效果: z.string(),
  适配对象: z.string(),
  风险提示: z.string(),
  当前状态: z.enum(库存状态列表),
  备注: z.string(),
});

const 焦点人物Schema = z.object({
  名称: z.string(),
  类型: z.enum(焦点类型列表),
  身份: z.string(),
  当前地区: z.string(),
  获得内容: z.string(),
  获得形式: z.string(),
  评级: z.enum(评级列表),
  变化趋势: z.string(),
  认知距离: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
  暴露风险: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
  对世界影响: z.string(),
  当前状态: z.string(),
});

const 势力Schema = z.object({
  名称: z.string(),
  类型: z.string(),
  态度: z.enum(势力态度列表),
  关注焦点: z.string(),
  当前动作: z.string(),
  风险评级: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
  渗透程度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
});

const 世界事件Schema = z.object({
  标题: z.string(),
  等级: z.enum(事件等级列表),
  地区: z.string(),
  摘要: z.string(),
  公开影响: z.string(),
  幕后关联: z.string(),
  状态: z.string(),
});

const 编年史Schema = z.object({
  时间标记: z.string(),
  标题: z.string(),
  摘要: z.string(),
  影响层级: z.string(),
});

export const Schema = z.object({
  世界: z.object({
    当前日期: z.string(),
    当前时段: z.string(),
    当前地点: z.string(),
    灵气复苏阶段: z.enum(公开阶段列表),
    世界改变进度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    全球关注度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    最近异象: z.string(),
    当前局势摘要: z.string(),
  }),
  主角: z.object({
    公开身份: z.string(),
    年龄: z.coerce.number().transform(value => _.clamp(value, 16, 99)),
    职业学业: z.string(),
    健康状态: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    情绪状态: z.string(),
    隐蔽度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    梦境状态: z.enum(梦境状态列表),
    当前目标: z.string(),
    自我认知: z.string(),
  }),
  系统: z.object({
    当前积分: z.coerce.number().transform(value => Math.max(0, value)),
    累计抽卡次数: z.coerce.number().transform(value => Math.max(0, value)),
    距离保底还需次数: z.coerce.number().transform(value => _.clamp(value, 0, 10)),
    最近抽卡结果: z.string(),
    抽奖池摘要: z.string(),
    本周自动积分是否已结算: z.boolean(),
  }),
  神树: z.object({
    当前等级: z.enum(神树阶段列表),
    成长百分比: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    下一级目标: z.string(),
    每周自然成长: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    最近喂养记录: z.string(),
    结果状态: z.string(),
    神树摘要: z.string(),
  }),
  保留能力: z.object({
    槽位上限: z.coerce.number().transform(value => _.clamp(value, 1, 5)),
    当前保留数: z.coerce.number().transform(value => _.clamp(value, 0, 5)),
    当前主保留能力: z.string(),
    来源作品: z.string(),
    评级: z.enum(评级列表),
    效果摘要: z.string(),
    已保留列表: z.array(
      z.object({
        名称: z.string(),
        来源作品: z.string(),
        评级: z.enum(评级列表),
        效果摘要: z.string(),
      }),
    ),
  }),
  能力库存: z.record(z.string(), 能力条目Schema),
  焦点人物: z.record(z.string(), 焦点人物Schema),
  势力: z.record(z.string(), 势力Schema),
  世界事件: z.record(z.string(), 世界事件Schema),
  编年史: z.record(z.string(), 编年史Schema),
});

export type StateData = z.output<typeof Schema>;
