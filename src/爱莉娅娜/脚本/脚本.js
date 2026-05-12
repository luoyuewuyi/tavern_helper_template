import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js'
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js'
/**
 * 辅助函数：限制记录长度（履历/履历/任务）
 */
const limitRecord = (schema, limit) => {
  return z.record(z.string(), schema.optional())
    .transform(obj => {
      return _(obj).omitBy(_.isNil).entries().take(limit).fromPairs().value();
    });
};

/* --- 子模型定义 --- */

const ItemSchema = z.object({
  名称: z.string(),
  简介: z.string(),
  数量: z.coerce.number().catch(1)
});

const SkillSchema = z.object({
  技能名称: z.string(),
  技能类型: z.enum(["主动", "被动"]).catch("主动"),
  技能等级: z.coerce.number().catch(1),
  技能熟练度: z.coerce.number().catch(0),
  最大熟练度: z.coerce.number().describe("由技能等级*100确定"),
  技能描述: z.string(),
  技能实际效果: z.string(),
  技能消耗: z.string()
});

const GearSchema = z.object({
  名称: z.string(),
  品质: z.enum(["普通", "稀有", "史诗", "传奇", "神器"]).catch("普通"),
  类别: z.enum(["普通装备", "调教装备"]).catch("普通装备"),
  部位: z.string(),
  简介: z.string(),
  外观: z.string(),
  效果: z.string()
}).nullable().prefault(null);

const RelicSchema = z.object({
  名称: z.string(),
  装备部位: z.string(),
  描述: z.string(),
  功能: z.string(),
  圣器等级: z.coerce.number().catch(1),
  内部存储类型: z.enum(["法力", "乳汁", "精液", "爱液", "无"]).catch("无"),
  当前存储量: z.coerce.number().catch(0),
  最大存储量: z.coerce.number().catch(0)
}).nullable().prefault(null);

const TaskSchema = z.object({
  任务名称: z.string(),
  任务描述: z.string(),
  成功条件: z.string(),
  失败条件: z.string(),
  成功奖励: z.string(),
  失败惩罚: z.string()
});

const HistorySchema = z.object({
  攻略时间: z.string().describe("离开副本时的正主世界时间"),
  攻略用时: z.string().describe("副本内经历时间"),
  副本表现: z.string()
});

const BodyModSchema = z.object({
  名称: z.string(),
  描述: z.string(),
  来源: z.string()
});

/* --- 主 Schema 定义 --- */

export const Schema = z.object({
  时间系统: z.object({
    主世界时间: z.string().describe("年-月-日-时-分，副本内暂停").catch("0000-00-00-00-00"),
    个人时间: z.string().describe("年-月-日-时-分，觉醒起持续流动").catch("0000-00-00-00-00"),
    副本经历时间: z.string().describe("年-月-日，离开副本重置").catch("0000-00-00")
  }).prefault({}),

  世界信息: z.object({
    当前世界名称: z.string().catch("主世界"),
    当前世界简介: z.string().catch("现代都市，网游法则降临后的主位面。"),
    当前天气: z.string().catch("晴")
  }).prefault({}),

  角色概览: z.object({
    姓名: z.string().catch("爱丽亚娜"),
    年龄: z.coerce.number().catch(18),
    寿命: z.coerce.number().catch(80),
    等级: z.coerce.number().catch(1),
    经验值: z.coerce.number().catch(0),
    最大经验值: z.coerce.number().describe("等级*100"),
    欲望等级: z.coerce.number().catch(1),
    欲望值: z.coerce.number().catch(0),
    最大欲望值: z.coerce.number().describe("欲望等级*500"),
    生命值: z.coerce.number().catch(100),
    法力值: z.coerce.number().catch(100),
    金钱_元: z.coerce.number().catch(0)
  }).prefault({}),

  战斗属性: z.object({
    体质: z.coerce.number().catch(10),
    力量: z.coerce.number().catch(10),
    精神: z.coerce.number().catch(10),
    敏捷: z.coerce.number().catch(10),
    防御: z.coerce.number().catch(100),
    物理攻击: z.coerce.number().catch(100),
    法术攻击: z.coerce.number().catch(100),
    自由属性点: z.coerce.number().catch(0)
  }).prefault({}),

  社会身份: z.object({
    主职业: z.string().catch("新手冒险者"),
    隐藏职业: z.string().catch("无"),
    主身份: z.string().catch("大一新生"),
    隐藏身份: z.string().catch("无"),
    副本临时身份: z.string().catch("无"),
    外貌描述: z.string().catch("青春靓丽的少女。"),
    着装描述: z.string().catch("学院发放的新手套装。"),
    称号: z.string().catch("无"),
    社会评价: z.string().catch("优秀的觉醒者苗子。")
  }).prefault({}),

  /* 独立装备槽位 - 严禁合并 */
  普通装备槽: z.object({
    头部: GearSchema,
    颈部: GearSchema,
    手部: GearSchema,
    衣服: GearSchema,
    裤子: GearSchema,
    鞋子: GearSchema
  }).prefault({}),

  调教装备槽: z.object({
    口穴: GearSchema,
    乳房: GearSchema,
    小腹: GearSchema,
    菊穴: GearSchema,
    阴道: GearSchema,
    尿道: GearSchema
  }).prefault({}),

  圣器槽位: z.object({
    圣器槽1: RelicSchema,
    圣器槽2: RelicSchema,
    圣器槽3: RelicSchema,
    圣器槽4: RelicSchema,
    圣器槽5: RelicSchema
  }).prefault({}),

  /* 生理监视系统 */
  子宫监视: z.object({
    状态描述: z.string().catch("待开发状态"),
    内有异物: z.string().catch("无"),
    精液量_ml: z.coerce.number().catch(0),
    当前容量_ml: z.coerce.number().catch(200),
    开发等级: z.coerce.number().catch(0),
    开发度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).catch(0),
    怀孕状态: z.boolean().catch(false),
    胎儿情况: z.string().catch("无")
  }).prefault({}),

  菊穴监视: z.object({
    状态描述: z.string().catch("紧致"),
    内有异物: z.string().catch("无"),
    内容物: z.string().catch("无"),
    内容物总量_ml: z.coerce.number().catch(0),
    当前容量_ml: z.coerce.number().catch(200),
    开发等级: z.coerce.number().catch(0),
    开发度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).catch(0)
  }).prefault({}),

  尿道膀胱监视: z.object({
    状态描述: z.string().catch("正常"),
    内有异物: z.string().catch("无"),
    膀胱内容物: z.string().catch("尿液"),
    内容物总量_ml: z.coerce.number().catch(0),
    当前容量_ml: z.coerce.number().catch(100),
    开发等级: z.coerce.number().catch(0),
    开发度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).catch(0)
  }).prefault({}),

  乳房监视: z.object({
    状态描述: z.string().catch("挺拔"),
    乳房饰品: z.string().catch("无"),
    乳汁量_ml: z.coerce.number().catch(0),
    当前容量_ml: z.coerce.number().catch(200),
    开发等级: z.coerce.number().catch(0),
    开发度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).catch(0)
  }).prefault({}),

  私密统计: z.object({
    总高潮次数: z.coerce.number().catch(0),
    累积转化精液量_ml: z.coerce.number().catch(0),
    累积分娩次数: z.coerce.number().catch(0),
    累积乳汁产出_ml: z.coerce.number().catch(0)
  }).prefault({}),

  /* 动态容器 */
  背包物品栏: z.record(z.string(), ItemSchema).prefault({}),
  技能栏: z.record(z.string(), SkillSchema).prefault({}),
  任务栏: z.record(z.string(), TaskSchema).prefault({}),
  肉体改造列表: z.record(z.string(), BodyModSchema).prefault({}),
  履历信息: limitRecord(HistorySchema, 50).prefault({})
}).prefault({});

$(() => { registerMvuSchema(Schema); });