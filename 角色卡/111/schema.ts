// 仙侠角色状态栏 Schema
// 用于定义 stat_data 的数据结构

// 角色基础信息
const 基础信息Schema = z
  .object({
    当前状态: z.string().optional(),
    姿态描述: z.string().optional(),
    内心想法: z.string().optional(),
    心理活动: z.string().optional(),
    最近性行为: z.string().optional(),
    灵力修为: z.string().optional(),
    修为: z.string().optional(),
  })
  .passthrough();

// 生理状态
const 生理Schema = z
  .object({
    肉棒状态: z.string().optional(),
    性欲值: z.coerce.number().optional(),
    亲密度: z.coerce.number().optional(),
    受精值: z.coerce.number().optional(),
  })
  .passthrough();

// 与主角关系
const 关系Schema = z
  .object({
    状态: z.string().optional(),
    亲密度: z.coerce.number().default(0),
    背德值: z.coerce.number().default(0),
    受精值: z.coerce.number().default(0),
  })
  .passthrough();

// 服装信息
const 服装Schema = z
  .object({
    风格: z.string().optional(),
    上装: z.string().optional(),
    下装: z.string().optional(),
    内衣: z.string().optional(),
    袜子: z.string().optional(),
    鞋履: z.string().optional(),
  })
  .passthrough();

// 身体状态
const 身体Schema = z
  .object({
    姿态与神情: z.string().optional(),
    口腔: z.string().optional(),
    胸部: z.string().optional(),
    阴道: z.string().optional(),
    子宫: z.string().optional(),
    子宫精液占比: z.record(z.string(), z.any()).optional(),
    后庭: z.string().optional(),
    腿部: z.string().optional(),
    足部: z.string().optional(),
  })
  .passthrough();

// 认知状态
const 认知Schema = z
  .object({
    警戒值: z.coerce.number().optional(),
    状态: z.string().optional(),
  })
  .passthrough();

// 献祭弧光（特殊状态）
const 献祭弧光Schema = z
  .object({
    状态: z.string().optional(),
  })
  .passthrough();

// 通用角色 Schema
const 角色Schema = z
  .object({
    基础: 基础信息Schema.optional(),
    生理: 生理Schema.optional(),
    与林美艳的关系: 关系Schema.optional(),
    服装: 服装Schema.optional(),
    身体: 身体Schema.optional(),
    认知: 认知Schema.optional(),
    献祭弧光: 献祭弧光Schema.optional(),
  })
  .passthrough();

// 主线剧情
const 主线剧情Schema = z.object({
  阶段: z.string(),
});

export const Schema = z.record(z.string(), z.union([角色Schema, 主线剧情Schema]));

export type Schema = z.output<typeof Schema>;
