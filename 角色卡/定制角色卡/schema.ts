export const Schema = z.object({
  时间线: z.enum(['47岁销售员', '49岁陪诊师']).prefault('49岁陪诊师'),
  当前日期: z.string().prefault('待初始化'),
  当前时间: z.string().prefault('待初始化'),
  当前场景: z.string().prefault('家中'),

  王影: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
    信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(60),
    警戒值: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(70),
    羞耻度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(90),
    心理状态: z.string().prefault('平静'),
    当前想法: z.string().prefault('无'),
    当前穿着: z.string().prefault('灰色宽松卫衣，深蓝运动裤，棉拖鞋'),
    身体状态: z.object({
      面部: z.string().prefault('素颜，表情自然放松'),
      胸部: z.string().prefault('宽松卫衣下轮廓不显'),
      腰腹: z.string().prefault('卫衣宽松垂落，腰线隐藏'),
      臀部: z.string().prefault('运动裤下弧线自然'),
      大腿: z.string().prefault('运动裤宽松包裹，自然并拢'),
      小腿: z.string().prefault('裤脚微堆叠在脚踝处'),
      双脚: z.string().prefault('棉拖鞋，脚趾自然舒展'),
      双手: z.string().prefault('手指纤细，自然搭放'),
      私处: z.string().prefault('正常保守状态'),
    }).prefault({}),
  }).prefault({}),

  付宴: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(45),
    信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(50),
    开放度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(30),
    心理状态: z.string().prefault('随意'),
    当前想法: z.string().prefault('待出场'),
    当前穿着: z.string().prefault('待出场'),
    身体状态: z.object({
      面部: z.string().prefault('待出场'),
      胸部: z.string().prefault('待出场'),
      腰腹: z.string().prefault('待出场'),
      臀部: z.string().prefault('待出场'),
      大腿: z.string().prefault('待出场'),
      小腿: z.string().prefault('待出场'),
      双脚: z.string().prefault('待出场'),
      双手: z.string().prefault('待出场'),
      私处: z.string().prefault('待出场'),
    }).prefault({}),
  }).prefault({}),

  路线: z.enum(['纯爱', '绿母']).prefault('纯爱'),
  绿母进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
});
export type Schema = z.output<typeof Schema>;
