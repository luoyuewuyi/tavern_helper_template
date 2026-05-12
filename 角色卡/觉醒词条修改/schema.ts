const 能力等级顺序 = ['E', 'D', 'C', 'B', 'A', 'S'] as const;
const 能力等级枚举 = z.enum(能力等级顺序);
const 旧能力等级映射 = {
  1: 'E',
  2: 'D',
  3: 'C',
  4: 'B',
  5: 'A',
  6: 'S',
} as const;
const 能力等级Schema = z.union([
  能力等级枚举,
  z.coerce.number().transform(v => 旧能力等级映射[_.clamp(v, 1, 6) as keyof typeof 旧能力等级映射]),
]);
const 升级门槛Schema = z.object({
  成功修改: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 999))
    .prefault(0),
  异类修改: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 999))
    .prefault(0),
});
const 下一级映射 = {
  E: 'D',
  D: 'C',
  C: 'B',
  B: 'A',
  A: 'S',
  S: null,
} as const;

export const Schema = z.object({
  世界: z
    .object({
      当前时间: z.string().prefault('现代大学开学周的上午'),
      当前地点: z.string().prefault('待设定校园场景'),
      当前阶段: z.enum(['开局建档', '能力觉醒', '校园探索', '异类接触', '现实改写']).prefault('开局建档'),
      校园公开事件: z
        .record(
          z.string().describe('事件名'),
          z.object({
            描述: z.string().prefault(''),
            热度: z.coerce
              .number()
              .transform(v => _.clamp(v, 0, 100))
              .prefault(0),
          }),
        )
        .prefault({}),
      异类暴露风险: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(8),
      政府管控氛围: z.string().prefault('异类与政府维持脆弱合作，公共场合必须严格伪装成人类。'),
      近期事务: z
        .record(
          z.string().describe('事务名'),
          z.object({
            描述: z.string().prefault(''),
            优先级: z.enum(['高', '中', '低']).prefault('中'),
          }),
        )
        .prefault({}),
    })
    .prefault({}),

  主角: z
    .object({
      姓名: z.string().prefault('待设定'),
      性别: z.enum(['男', '女', '其他']).prefault('男'),
      年龄: z.coerce
        .number()
        .transform(v => _.clamp(v, 18, 30))
        .prefault(18),
      身高: z.coerce
        .number()
        .transform(v => _.clamp(v, 140, 220))
        .prefault(175),
      学校名称: z.string().prefault('待设定'),
      专业: z.string().prefault('待设定'),
      学院: z.string().prefault('待设定'),
      宿舍: z.string().prefault('待设定'),
      外形特点: z.string().prefault('待设定'),
      能力等级: 能力等级Schema.prefault('E'),
      暴露值: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 100))
        .prefault(3),
      已接触目标: z
        .record(
          z.string().describe('人物名'),
          z.object({
            接触方式: z.string().prefault(''),
            最近接触时间: z.string().prefault(''),
            已建立词条视野: z.boolean().prefault(false),
          }),
        )
        .prefault({}),
      当前目标: z.string().prefault('先确认词条系统能看到什么、能改什么、会如何回弹或兑现。'),
      成功修改次数: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 999))
        .prefault(0),
      当前等级进度: z
        .object({
          成功修改: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          异类修改: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
        })
        .prefault({}),
      各等级升级门槛: z
        .object({
          D: 升级门槛Schema.prefault({ 成功修改: 3, 异类修改: 0 }),
          C: 升级门槛Schema.prefault({ 成功修改: 5, 异类修改: 1 }),
          B: 升级门槛Schema.prefault({ 成功修改: 5, 异类修改: 3 }),
          A: 升级门槛Schema.prefault({ 成功修改: 7, 异类修改: 5 }),
          S: 升级门槛Schema.prefault({ 成功修改: 0, 异类修改: 10 }),
        })
        .prefault({}),
      修改统计: z
        .object({
          普通人: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          异类: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          异种: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          现实修正: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
        })
        .transform(data => ({
          普通人: data.普通人,
          异类: Math.max(data.异类, data.异种),
          现实修正: data.现实修正,
        }))
        .prefault({}),
    })
    .transform(data => {
      const nextLevel = 下一级映射[data.能力等级];
      const nextRequirement = nextLevel ? data.各等级升级门槛[nextLevel] : null;
      const progressParts = [];
      if (nextRequirement !== null) {
        if (nextRequirement.成功修改 > 0) {
          progressParts.push(`成功修改 ${data.当前等级进度.成功修改}/${nextRequirement.成功修改}`);
        }
        if (nextRequirement.异类修改 > 0) {
          progressParts.push(`异类修改 ${data.当前等级进度.异类修改}/${nextRequirement.异类修改}`);
        }
      }
      const $能力阶段 = `${data.能力等级}级`;
      const $下一级门槛说明 =
        nextLevel === null ? '已达S级' : `${data.能力等级}→${nextLevel}：${progressParts.join(' / ')}`;
      return { ...data, $能力阶段, $下一级门槛说明 };
    })
    .prefault({}),

  能力系统: z
    .object({
      当前等级限制: z
        .string()
        .prefault('E级：只能接触后修改情绪或心情词条，单次最多3字，只能做轻微偏转，不能触及思想与现实。'),
      单次最大改字数: z.coerce
        .number()
        .transform(v => _.clamp(v, 3, 999))
        .prefault(3),
      最大作用距离: z.string().prefault('接触'),
      必须身体接触: z.boolean().prefault(true),
      允许短距观察修改: z.boolean().prefault(false),
      允许修改思想: z.boolean().prefault(false),
      允许新增词条: z.boolean().prefault(false),
      允许删除词条: z.boolean().prefault(false),
      允许现实改写: z.boolean().prefault(false),
      现实小范围即时生效: z.boolean().prefault(false),
      允许修改无机物: z.boolean().prefault(false),
      可见异类等级: z.boolean().prefault(true),
      修改逻辑约束: z
        .string()
        .prefault(
          'E级只能轻微拨动情绪心情，不能改思想和现实；D级起才可偏转思想；B级起改现实也必须通过世界逻辑自发演化兑现；S级前都不能把结果硬写成凭空出现的奇迹。',
        ),
      高危禁令: z
        .array(z.string())
        .prefault([
          '禁止把明显现实属性直接改成会立刻违反常识的结果',
          '禁止用词条修改直接暴露异类与自身能力',
          '禁止对军政力量做高调试验',
        ]),
      即时生效阈值: z
        .union([z.string(), z.coerce.number()])
        .transform(() => 'S')
        .prefault('S'),
    })
    .transform(data => {
      const $现实改写权限 = !data.允许现实改写
        ? '未解锁'
        : data.允许修改无机物
          ? '言出法随'
          : data.现实小范围即时生效
            ? '可局部即时生效'
            : '通过世界逻辑演化兑现';
      return { ...data, $现实改写权限 };
    })
    .prefault({}),

  人物档案: z
    .record(
      z.string().describe('人物名'),
      z.object({
        基础信息: z
          .object({
            身份: z.string().prefault(''),
            年龄: z.coerce
              .number()
              .transform(v => _.clamp(v, 0, 999))
              .prefault(18),
            种族: z.string().prefault('人类'),
            等级: z.string().prefault('无'),
            外形: z.string().prefault(''),
            初始关系: z.string().prefault(''),
          })
          .prefault({}),
        当前可见词条: z.array(z.string()).prefault([]),
        显性词条: z.array(z.string()).prefault([]),
        隐性词条: z
          .record(
            z.string().describe('词条文本'),
            z.object({
              内容: z.string().prefault(''),
              已识别: z.boolean().prefault(false),
            }),
          )
          .prefault({}),
        当前状态: z.string().prefault('尚未深入接触'),
        正在做什么: z.string().prefault('未知'),
        怀孕状态: z.enum(['否', '可能', '确认']).prefault('否'),
        与主角关系: z.string().prefault('普通同学'),
        后宫录可见: z.boolean().prefault(false),
        人类形态特征: z.string().prefault(''),
        异种形态特征: z.string().prefault(''),
        最近变化摘要: z.string().prefault('暂无显著变化'),
        词条变化记录: z
          .record(
            z.string().describe('记录时间'),
            z.object({
              变更: z.string().prefault(''),
              原因: z.string().prefault(''),
              世界修正结果: z.string().prefault(''),
            }),
          )
          .prefault({}),
      }),
    )
    .prefault({}),

  现实修正队列: z
    .record(
      z.string().describe('修正编号'),
      z.object({
        目标人物: z.string().prefault(''),
        被修改词条: z.string().prefault(''),
        目标结果: z.string().prefault(''),
        修正方式: z.enum(['事件链兑现', '小范围即时生效']).prefault('事件链兑现'),
        当前阶段: z.enum(['待观察', '酝酿中', '兑现中', '已完成', '失败回弹']).prefault('待观察'),
        是否允许即时兑现: z.boolean().prefault(false),
        剧情说明: z.string().prefault(''),
      }),
    )
    .prefault({}),
});

export type Schema = z.output<typeof Schema>;
