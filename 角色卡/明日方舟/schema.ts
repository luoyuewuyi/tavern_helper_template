export const Schema = z.object({
  世界: z
    .object({
      当前时间: z.string(),
      当前地点: z.string(),
      日期: z.string(),
      当前阶段: z.string(),
      近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')),
    })
    .transform(data => {
      const year = parseInt(data.当前时间);
      const $阶段 =
        year < 1096
          ? '前奏·暗流涌动'
          : year < 1097
            ? '序章·苏醒'
            : year < 1098
              ? '觉醒·龙门篇'
              : year < 1099
                ? '风暴·维多利亚篇'
                : year < 1100
                  ? '余波·各地纪闻'
                  : year < 1101
                    ? '浮沉·秩序重构'
                    : '终章·普瑞赛斯降临';
      return { ...data, 当前阶段: $阶段 };
    }),

  干员信赖: z.record(
    z.string().describe('角色名'),
    z
      .object({
        信赖值: z.coerce.number().transform(v => _.clamp(v, 0, 200)),
        阶段: z.string(),
      })
      .transform(data => {
        const $阶段 =
          data.信赖值 < 20
            ? '警戒陌生'
            : data.信赖值 < 40
              ? '初步信赖'
              : data.信赖值 < 60
                ? '逐渐亲近'
                : data.信赖值 < 80
                  ? '深度羁绊'
                  : data.信赖值 < 100
                    ? '至高信赖'
                    : '生死之交';
        return { ...data, 阶段: $阶段 };
      }),
  ),

  当前交互角色: z.record(
    z.string().describe('角色名'),
    z
      .object({
        姓名: z.string(),
        性别: z.string(),
        种族: z.string(),
        身份: z.string(),
        矿石病感染情况: z.string(),
        源石技艺: z.string(),
        兴趣爱好: z.string(),
        关系网: z.record(z.string().describe('人物名'), z.string().describe('关系描述')),
        容貌: z.string(),
        身材: z.string(),
        着装: z.string(),
        神态: z.string(),
        体态: z.string(),
        内心: z.string(),
        当前携带物品: z.record(z.string().describe('物品名'), z.string().describe('物品描述')),
        密录: z.string(),
        角色记忆: z.array(z.string()).transform(arr => arr.slice(-10)),
        好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        欲望值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        敏感度: z.record(z.string().describe('部位'), z.string().describe('敏感等级')),
        开发度: z.record(
          z.string().describe('类型'),
          z.coerce.number().transform(v => _.clamp(v, 0, 100)),
        ),
      })
      .transform(data => {
        const $好感度阶段 =
          data.好感度 < 20
            ? '警戒陌生'
            : data.好感度 < 40
              ? '初步信赖'
              : data.好感度 < 60
                ? '逐渐亲近'
                : data.好感度 < 80
                  ? '深度羁绊'
                  : '至高信赖';
        return { ...data, $好感度阶段 };
      }),
  ),

  博士: z.object({
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
