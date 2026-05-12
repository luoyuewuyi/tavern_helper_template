// 单个角色的 Schema，复用于角色库和当前NPC
const 角色Schema = z.object({
  姓名: z.string().prefault('无'),
  性别: z.string().prefault('无'),
  年龄: z.string().prefault('无'),
  外表年龄: z.string().prefault('无'),
  身高: z.string().prefault('无'),
  种族: z.string().prefault('人类'),
  表面身份: z.string().prefault('无'),
  隐藏身份: z.string().prefault('无'),
  处女: z.string().prefault('无'),
  纹身: z.string().prefault('无'),
  颜值: z.string().prefault('无'),
  瞳孔颜色: z.string().prefault('无'),
  肤色: z.string().prefault('无'),
  怀孕: z.string().prefault('否'),
  对性知识认知: z.string().prefault('无'),
  伪装性格: z.string().prefault('无'),
  真实性格: z.string().prefault('无'),
  伪装言语风格: z.string().prefault('无'),
  真实言语风格: z.string().prefault('无'),
  性癖: z.string().prefault('无'),
  私下自称: z.string().prefault('无'),
  对我称呼: z
    .object({
      私下: z.string().prefault('无'),
      公共: z.string().prefault('无'),
    })
    .prefault({}),
  关系: z.string().prefault('无'),
  对卡尔德印象: z.string().prefault('无'),
  子嗣: z.string().prefault('无'),
  肉体改造: z.string().prefault('无'),
  生物特性: z.string().prefault('无'),
  嘴承受鸡巴: z.string().prefault('无'),
  逼承受鸡巴: z.string().prefault('无'),
  屁眼承受鸡巴: z.string().prefault('无'),
  玉精: z.string().prefault('未吸收'),
  发型衣着: z.string().prefault('无'),
  三围与身材: z.string().prefault('无'),
  身体数据: z.string().prefault('无'),
  高潮记录: z.coerce.number().prefault(0),
  性爱时间: z.string().prefault('无'),
  性爱后负面状态: z.string().prefault('无'),
  体内精液: z
    .object({
      胃: z.coerce.number().prefault(0),
      子宫: z.coerce.number().prefault(0),
      肠道: z.coerce.number().prefault(0),
    })
    .prefault({}),
  肚子: z.string().prefault('平坦'),
  体位: z.string().prefault('无'),
  具体位置: z.string().prefault('无'),
});

export const Schema = z.object({
  世界: z.object({
    天气: z.string().prefault('☀️ 晴朗'),
    当前时间: z.string().prefault('新历1年/01/01-08:00'),
    序号: z.coerce.number().prefault(1),
    大地图: z.string().prefault('朗姆镇'),
    小地图: z.string().prefault('安定区'),
    建筑结构: z.record(z.string().describe('房间/区域名'), z.string().describe('描述或🛑标注用户位置')).prefault({}),
  }),

  卡尔德: z.object({
    等级: z.coerce
      .number()
      .transform(v => _.clamp(v, 1, 999))
      .prefault(1),
    圣之力: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(1),
    魔力当前: z.coerce.number().prefault(100),
    魔力上限: z.coerce.number().prefault(100),
    魔力颜色: z.string().prefault('银白'),
    身高: z.string().prefault('180cm'),
    穿戴: z.string().prefault('黑色皮甲套装'),
    武器: z.string().prefault('无'),
    鸡巴状态: z.string().prefault('自然垂下'),
    财富: z
      .object({
        紫金币: z.coerce.number().prefault(0),
        金币: z.coerce.number().prefault(5),
        银币: z.coerce.number().prefault(50),
        铜币: z.coerce.number().prefault(200),
      })
      .prefault({}),
    物品栏: z
      .record(
        z.string().describe('物品名'),
        z.object({
          描述: z.string(),
          数量: z.coerce.number(),
        }),
      )
      .prefault({}),
    房产: z.string().prefault('无'),
    体位: z.string().prefault('站立'),
    具体位置: z.string().prefault('朗姆镇中央广场'),
  }),

  // 当前NPC：保持原始对象格式，AI自然写入，向后兼容
  当前NPC: 角色Schema.prefault({}),

  // 角色库：存储所有已创建/遇见的角色，键为角色姓名
  // 通过 index.ts 的事件监听自动从当前NPC同步
  角色库: z.record(z.string().describe('角色姓名'), 角色Schema).prefault({}),
});
export type Schema = z.output<typeof Schema>;
