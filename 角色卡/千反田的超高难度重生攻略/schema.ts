export const Schema = z.object({
  世界: z.object({
    当前时间: z.string().prefault('199X年04月08日 08:30'),
    当前地点: z.string().prefault('岐阜县神山市 千反田家本宅'),
    当前季节: z.enum(['春', '夏', '秋', '冬']).prefault('春'),
    近期事务: z
      .record(z.string().describe('事务名'), z.string().describe('事务描述'))
      .transform(data => ({ ...data }))
      .prefault({}),
  }),

  主角: z.object({
    姓名: z.string().prefault('千反田神奈'),
    性别: z.string().prefault('女'),
    身份: z.string().prefault('千反田家长女·神山高中学生'),
    资金: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, Infinity))
      .prefault(500),
    声望: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(15),
    体力: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, 100))
      .prefault(70),
    资产清单: z
      .record(
        z.string().describe('资产名'),
        z
          .object({
            类型: z.string().prefault('未分类'),
            估值: z.string().prefault('未估值'),
            状态: z.string().prefault('正常'),
          })
          .prefault({}),
      )
      .transform(data => ({ ...data }))
      .prefault({}),
    人脉网络: z
      .record(
        z.string().describe('人物名'),
        z
          .object({
            关系等级: z.enum(['亲密', '信任', '友好', '中立', '警惕', '敌对']).prefault('中立'),
            备注: z.string().prefault(''),
          })
          .prefault({}),
      )
      .transform(data => ({ ...data }))
      .prefault({}),
    物品栏: z
      .record(
        z.string().describe('物品名'),
        z.object({
          描述: z.string().prefault(''),
          数量: z.coerce.number().prefault(1),
        }),
      )
      .transform(data => ({ ..._.pickBy(data, ({ 数量 }) => 数量 > 0) }))
      .prefault({}),
  }),

  家族: z.object({
    千反田商事状态: z.string().prefault('传统农产品贸易为主'),
    千家良品状态: z.string().prefault('尚未创立'),
    总资产估值: z.coerce
      .number()
      .transform(v => _.clamp(v, 0, Infinity))
      .prefault(50),
  }),
});

export type Schema = z.output<typeof Schema>;
