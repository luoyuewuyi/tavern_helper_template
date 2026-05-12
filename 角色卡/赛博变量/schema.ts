export const Schema = z.object({
  世界: z.object({
    难度: z.enum(['简单', '普通', '困难', '地狱']),
    当前时间: z.string(),
    当前地点: z.string(),
    所在阶层: z.enum(['上层区', '中层区', '下层区', '城市外围']),
    近期事务: z.record(z.string().describe('事务名'), z.string().describe('事务描述')),
  }),

  主角: z
    .object({
      姓名: z.string(),
      性别: z.enum(['男', '女']),
      年龄: z.coerce.number(),
      身份: z.string(),
      阶层: z.enum([
        '核心军阀财阀',
        '核心研发者',
        '依附上层',
        '技术管理人员',
        '中层执法者',
        '普通劳工',
        '自愿服务者',
        '药剂强化者',
        '独立小团队',
        '掠夺者首领',
        '普通掠夺者',
      ]),
      外貌: z.string(),
      改造程度: z.enum(['无', '低', '中', '高', '极高']),
      抗击打能力: z.enum(['低', '中', '高', '强', '极强']),

      // 状态相关
      生命值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      身体状态: z.string(),
      腹部状态: z.string(),
      心情: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      当前情况: z.string(),
      快感值: z.coerce.number().transform(v => _.clamp(v, 0, 100)),

      // 物资和资产
      货币: z.coerce.number().transform(v => Math.max(v, 0)),
      物品栏: z
        .record(
          z.string().describe('物品名'),
          z.object({
            描述: z.string(),
            数量: z.coerce.number(),
          }),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)),
      装备: z.record(
        z.enum(['义体', '武器', '防具', '植入物', '药剂']),
        z.object({
          名称: z.string(),
          效果: z.string(),
        }),
      ),
    })
    .transform(data => {
      // 计算阶段
      const $状态阶段 =
        data.生命值 > 80
          ? '健康'
          : data.生命值 > 60
            ? '轻伤'
            : data.生命值 > 40
              ? '中伤'
              : data.生命值 > 20
                ? '重伤'
                : '濒死';
      return { ...data, $状态阶段 };
    }),

  NPC: z.record(
    z.string().describe('NPC姓名'),
    z.object({
      身份: z.string(),
      对主角态度: z.string(),
      内心OS: z.string(),
      当前状态: z.string().optional(),
    }),
  ),
});
export type Schema = z.output<typeof Schema>;
