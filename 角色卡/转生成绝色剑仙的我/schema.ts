export const Schema = z.object({
  世界: z
    .object({
      当前时间: z.string().prefault('天元历-1024/03/15-辰时'),
      当前地点: z.string().prefault('玉仙观 清泉练剑场'),
      游玩阶段: z.enum(['修仙', '捕获', '调教', '堕落']).prefault('修仙'),
      近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')).prefault({}),
    })
    .prefault({}),

  主角: z
    .object({
      姓名: z.string().prefault('待设定'),
      年龄: z.coerce.number().prefault(18),
      宗门: z.string().prefault('待设定'),
      体质: z.string().prefault('至阴之体'),
      功法: z.string().prefault('玉女诀'),
      功法境界: z.enum(['入门', '小成', '大成', '成仙']).prefault('小成'),
      修炼境界: z.string().prefault('金丹期'),
      道心: z.string().prefault('玉女道心·无瑕'),
      道心状态: z.enum(['完好', '动摇', '破损', '沉寂', '逆转']).prefault('完好'),
      命格: z.string().prefault('天命剑仙'),
      称号: z.record(z.string().describe('称号名'), z.string().describe('称号来源或效果')).prefault({}),
      外貌简述: z.string().prefault('待描述'),
      前世: z
        .object({
          姓名: z.string().prefault('待设定'),
          经历: z.string().prefault('来自现代世界的普通人'),
        })
        .prefault({}),
      着装: z
        .record(z.enum(['上装', '下装', '内衣', '足部', '饰品', '特殊']), z.string().describe('服装描述'))
        .prefault({}),
      能力面板: z
        .object({
          武技: z
            .record(
              z.string().describe('武技名称（如剑法/刀法/枪法/扇法等）'),
              z.coerce.number().transform(v => _.clamp(v, 0, 100)),
            )
            .prefault({ 剑法: 50 }),
          步法: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(30),
          灵力: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(40),
          智慧: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(80),
          体魄: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(25),
          意志: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(30),
          肉欲: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(0),
        })
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
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
        .prefault({}),
    })
    .prefault({}),

  身体状态: z
    .object({
      体质变化: z.string().prefault('至阴之体，灵气纯净，身体微带寒意'),
      灵力属性: z.string().prefault('纯白色灵气，质量数倍于常人'),
      体香: z.string().prefault('淡淡幽香，不甚明显'),
      敏感度: z.string().prefault('正常，道心压制下无异常感受'),
      身材变化: z.string().prefault('修行塑造的清丽绝色容貌，身材匀称'),
      观想形象: z.string().prefault('灵台识海中的白兔仙子——清冷脱俗的道袍仙女，手持长剑'),
      道心内景: z.string().prefault('一柄无瑕玉剑，通体洁白剔透'),
    })
    .prefault({}),

  改造数值: z
    .object({
      改造值: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(5),
      常识更改: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(0),
      堕落值: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(0),
      _功法真实属性: z.string().prefault('奴篇功法变种——修炼越深身心改造越彻底，修行者无法自行察觉'),
    })
    .prefault({}),

  关系: z
    .record(
      z.string().describe('角色名'),
      z
        .object({
          好感度: z.coerce
            .number()
            .transform(v => _.clamp(v, -100, 100))
            .prefault(0),
          关系: z.string().prefault('陌生'),
          印象: z.string().prefault(''),
        })
        .prefault({}),
    )
    .prefault({}),

  牝奴状态: z
    .object({
      已激活: z.boolean().prefault(false),
      赐名: z.string().prefault(''),
      等级: z.string().prefault(''),
      职务: z.string().prefault(''),
      主人评价: z.string().prefault(''),
      调教进度: z.string().prefault(''),
    })
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
