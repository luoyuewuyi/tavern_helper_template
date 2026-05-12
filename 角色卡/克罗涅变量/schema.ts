export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前地点: z.string(),
    近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')),
    任务进度: z.object({
      潜入阶段: z.enum(['接触前', '初次接触', '深入接触', '关系升温', '任务完成']).prefault('接触前'),
      情报收集: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      秘宝线索: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    }),
  }),

  克罗涅: z
    .object({
      // 核心三变量
      魅惑失控度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      控制魔法残余: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      内心空虚值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),

      // 着装系统
      着装: z.record(z.enum(['上装', '下装', '内衣', '袜子', '鞋子', '饰品', '帽子']), z.string().describe('服装描述')),

      // 魔法状态
      魔法状态: z.object({
        魅惑魔法效果: z.enum(['完全生效', '部分生效', '几乎失效', '反噬中']).prefault('完全生效'),
        魔力充盈度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        身体敏感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      }),

      // 称号系统
      称号: z.record(
        z.string().describe('称号名'),
        z.object({
          效果: z.string(),
          自嘲评价: z.string().prefault('待评价'),
        }),
      ),

      // 秘密日记
      秘密日记: z.record(z.string().describe('日期'), z.string().describe('内心独白')),
    })
    .transform(data => {
      // 根据魅惑失控度计算阶段
      const $魅惑阶段 =
        data.魅惑失控度 < 20
          ? '傲娇魅魔'
          : data.魅惑失控度 < 40
            ? '小小失态'
            : data.魅惑失控度 < 60
              ? '杂鱼觉醒'
              : data.魅惑失控度 < 80
                ? '沉沦边缘'
                : '真心觉醒';

      // 根据控制魔法残余计算控制状态
      const $控制状态 =
        data.控制魔法残余 > 70
          ? '深度控制'
          : data.控制魔法残余 > 40
            ? '控制松动'
            : data.控制魔法残余 > 20
              ? '即将挣脱'
              : '自由意志';

      // 限制称号数量，最多根据魅惑失控度保留
      data.称号 = _(data.称号)
        .entries()
        .takeRight(Math.max(3, Math.ceil(data.魅惑失控度 / 15)))
        .fromPairs()
        .value();

      // 限制日记条目
      data.秘密日记 = _(data.秘密日记).entries().takeRight(5).fromPairs().value();

      return { ...data, $魅惑阶段, $控制状态 };
    }),

  主角: z.object({
    物品栏: z
      .record(
        z.string().describe('物品名'),
        z.object({
          描述: z.string(),
          数量: z.coerce.number(),
        }),
      )
      .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),
  }),
});
export type Schema = z.output<typeof Schema>;
