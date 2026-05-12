import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const schema = z.object({
  世界: z.object({
    当前日期: z.string().prefault('XXXX年X月X日'),
    当前时间: z.string().prefault('00:00'),
    灾难本质: z.string().prefault('未知'),
    世界现状: z.string().prefault('未知'),
    时间线节点: z.string().prefault('灾难爆发后')
  }).prefault({}),

  避难所: z.object({
    空间大小: z.string().prefault('small'),
    空间大小具体定义: z.string().prefault(''),
    基础生存资源: z.object({
      电力: z.object({ 当前负载值: z.coerce.number(), 负载上限: z.coerce.number() }).prefault({}),
      水源: z.object({ 当前负载值: z.coerce.number(), 负载上限: z.coerce.number() }).prefault({}),
      食物: z.object({ 当前负载值: z.coerce.number(), 负载上限: z.coerce.number() }).prefault({}),
      人口: z.object({ 当前人口数: z.coerce.number(), 负载上限: z.coerce.number() }).prefault({})
    }).prefault({}),
    环境指标: z.object({
      设施设备: z.string().prefault('normal'),
      设施设备具体定义: z.string().prefault(''),
      卫生度: z.string().prefault('普通'),
      精神健康度: z.coerce.number().prefault(100)
    }).prefault({}),
    居民职业组成: z.string().prefault('random'),
    居民职业组成具体定义: z.string().prefault(''),
    居民族裔组成: z.string().prefault('diverse'),
    居民族裔组成具体定义: z.string().prefault(''),
    社会制度: z.object({
      分配制度: z.string().prefault('未定'),
      分配制度说明: z.string().prefault(''),
      信息管控: z.string().prefault('未定'),
      信息管控说明: z.string().prefault(''),
      社会伦理: z.string().prefault('未定'),
      社会伦理说明: z.string().prefault(''),
      治安手段: z.string().prefault('未定'),
      治安手段说明: z.string().prefault(''),
      繁衍政策: z.string().prefault('未定'),
      繁衍政策说明: z.string().prefault(''),
      对外态度: z.string().prefault('未定'),
      对外态度说明: z.string().prefault(''),
      惩罚机制: z.string().prefault('未定'),
      惩罚机制说明: z.string().prefault('')
    }).prefault({}),
    宏观属性: z.object({
      统治力: z.coerce.number().prefault(50),
      防御等级: z.coerce.number().prefault(0),
      隐蔽度: z.coerce.number().prefault(100)
    }).prefault({}),
    避难所试验目的: z.string().prefault('normal'),
    避难所试验目的具体定义: z.string().prefault('')
  }).prefault({}),

  派系: z.record(
    z.string().describe('派系名称'),
    z.object({
      宗旨: z.string().prefault(''),
      好感度: z.coerce.number().prefault(0),
      领导人: z.string().prefault('未知'),
      人数: z.string().prefault('0%')
    }).prefault({})
  ).prefault({}),

  设施区域: z.record(
    z.string().describe('设施名称'),
    z.object({
      等级: z.coerce.number().prefault(1),
      效果: z.string().prefault(''),
      说明: z.string().prefault('')
    }).prefault({})
  ).prefault({}),

  仓库系统: z.record(
    z.string().describe('物品名称'),
    z.object({
      类型: z.string().prefault('其他'),
      说明: z.string().prefault(''),
      效果: z.object({
        武力: z.coerce.number().optional(),
        管理: z.coerce.number().optional(),
        探索: z.coerce.number().optional(),
        生命值: z.coerce.number().optional(),
        防护等级: z.coerce.number().optional()
      }).prefault({}),
      剩余数量: z.coerce.number()
    }).prefault({})
  ).prefault({}),

  监督者: z.object({
    姓名: z.string().prefault('{{user}}'),
    当前位置: z.string().prefault('未知'),
    行动点数: z.coerce.number().prefault(10),
    生命值: z.coerce.number().prefault(100),
    当前状态: z.record(
      z.string().describe('状态名称'),
      z.object({
        效果: z.string().prefault(''),
        剩余时间: z.string().prefault('')
      }).prefault({})
    ).prefault({}),
    "S.P.E.C.I.A.L": z.object({
      S: z.coerce.number().prefault(5),
      P: z.coerce.number().prefault(5),
      E: z.coerce.number().prefault(5),
      C: z.coerce.number().prefault(5),
      I: z.coerce.number().prefault(5),
      A: z.coerce.number().prefault(5),
      L: z.coerce.number().prefault(5)
    }).prefault({}),
    特质: z.record(z.string(), z.string()).prefault({}),
    性格: z.array(z.string()).prefault([])
  }).prefault({}),

  追随者: z.record(
    z.string().describe('NPC姓名'),
    z.object({
      年龄: z.coerce.number().prefault(20),
      性别: z.string().prefault('未知'),
      外貌: z.string().prefault(''),
      性格: z.string().prefault(''),
      爱好: z.string().prefault(''),
      弱点: z.string().prefault(''),
      反差: z.string().prefault(''),
      武力: z.coerce.number().prefault(1),
      管理: z.coerce.number().prefault(1),
      探索: z.coerce.number().prefault(1),
      生命值: z.coerce.number().prefault(100),
      防护等级: z.coerce.number().prefault(0),
      状态: z.string().prefault('健康'),
      忠诚度: z.coerce.number().prefault(50),
      装备栏: z.object({
        武器位: z.string().prefault('无'),
        防具位: z.string().prefault('无'),
        饰品工具位: z.string().prefault('无')
      }).prefault({}),
      特质: z.record(z.string(), z.string()).prefault({})
    }).prefault({})
  ).prefault({}),

  外交情况: z.record(
    z.string().describe('势力ID'),
    z.object({
      势力名称: z.string().prefault(''),
      介绍: z.string().prefault(''),
      等级: z.coerce.number().prefault(1),
      好感度: z.coerce.number().transform(v => _.clamp(v, -100, 100)).prefault(0),
      当前关系: z.string().prefault('未知')
    }).prefault({})
  ).prefault({})
});

$(() => {
  registerMvuSchema(schema);
})