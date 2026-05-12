export const Schema = z.object({
  世界: z.object({
    当前日期: z.string(),
    当前时间: z.string(),
    当前时段: z.string(),
    当前天气: z.string(),
    灾变阶段: z.string(),
    区域态势: z.string(),
    感染压力: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    通讯状态: z.string(),
    通用语言规则: z.string(),
  }),

  主角: z.object({
    代号: z.string(),
    身份: z.string(),
    当前位置: z.string(),
    当前状态: z.string(),
    指挥等级: z.string(),
    声望: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    威信: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    统率倾向: z.string(),
    当前命令摘要: z.string(),
  }),

  基地: z.object({
    名称: z.string(),
    等级: z.coerce.number().transform(value => _.clamp(value, 1, 10)),
    位置: z.string(),
    耐久: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    供电: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    防御: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    居住容量: z.coerce.number().transform(value => Math.max(value, 0)),
    当前人口: z.coerce.number().transform(value => Math.max(value, 0)),
    风险等级: z.string(),
    设施: z.record(
      z.string().describe('设施名'),
      z.object({
        等级: z.coerce.number().transform(value => _.clamp(value, 0, 10)),
        状态: z.string(),
        说明: z.string(),
      }),
    ),
  }),

  资源: z.object({
    资源点: z.coerce.number().transform(value => Math.max(value, 0)),
    弹药: z.coerce.number().transform(value => Math.max(value, 0)),
    燃料: z.coerce.number().transform(value => Math.max(value, 0)),
    食物: z.coerce.number().transform(value => Math.max(value, 0)),
    药品: z.coerce.number().transform(value => Math.max(value, 0)),
    建材: z.coerce.number().transform(value => Math.max(value, 0)),
    零件: z.coerce.number().transform(value => Math.max(value, 0)),
    电子元件: z.coerce.number().transform(value => Math.max(value, 0)),
  }),

  召唤系统: z.object({
    当前时代: z.string(),
    解锁阶段: z.string(),
    解锁点数: z.coerce.number().transform(value => Math.max(value, 0)),
    当前召唤上限: z.coerce.number().transform(value => Math.max(value, 0)),
    已出动单位数: z.coerce.number().transform(value => Math.max(value, 0)),
    可召唤池: z.record(
      z.string().describe('单位名'),
      z.object({
        类型: z.string(),
        时代: z.string(),
        解锁状态: z.string(),
        默认编入: z.string(),
        单次召唤数量: z.coerce.number().transform(value => Math.max(value, 1)),
        资源点消耗: z.coerce.number().transform(value => Math.max(value, 0)),
        弹药消耗: z.coerce.number().transform(value => Math.max(value, 0)),
        燃料消耗: z.coerce.number().transform(value => Math.max(value, 0)),
        建材消耗: z.coerce.number().transform(value => Math.max(value, 0)),
        解锁前置: z.string(),
        描述: z.string(),
      }),
    ),
    科技树: z.record(
      z.string().describe('科技名'),
      z.object({
        阶段: z.string(),
        状态: z.string(),
        解锁点消耗: z.coerce.number().transform(value => Math.max(value, 0)),
        前置: z.string(),
        效果: z.string(),
      }),
    ),
  }),

  部队: z.object({
    当前主力编队: z.string(),
    编队: z.record(
      z.string().describe('编队名'),
      z.object({
        任务: z.string(),
        状态: z.string(),
        士气: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        补给: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        人数上限: z.coerce.number().transform(value => Math.max(value, 0)),
        单位: z.record(
          z.string().describe('单位名'),
          z.object({
            数量: z.coerce.number().transform(value => Math.max(value, 0)),
            类型: z.string(),
            状态: z.string(),
            火力评级: z.string(),
          }),
        ),
      }),
    ),
  }),

  势力: z.record(
    z.string().describe('势力名'),
    z.object({
      关系: z.string(),
      威胁度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
      活跃区域: z.string(),
      情报摘要: z.string(),
    }),
  ),

  角色档案: z.object({
    焦点人物: z.record(
      z.string().describe('人物名'),
      z.object({
        身份: z.string(),
        忠诚: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
        评价: z.string(),
        位置: z.string(),
        职责: z.string(),
        状态: z.string(),
      }),
    ),
    长期档案: z.record(
      z.string().describe('人物名'),
      z.object({
        身份: z.string(),
        关系备注: z.string(),
      }),
    ),
  }),

  任务与事件: z.object({
    当前任务: z.record(
      z.string().describe('任务名'),
      z.object({
        类型: z.string(),
        状态: z.string(),
        目标: z.string(),
        奖励: z.string(),
      }),
    ),
    警报: z.record(
      z.string().describe('警报名'),
      z.object({
        等级: z.string(),
        内容: z.string(),
      }),
    ),
    历史记录: z.record(
      z.string().describe('记录名'),
      z.object({
        时间: z.string(),
        内容: z.string(),
      }),
    ),
  }),

  隐藏派生: z.object({
    区域威胁等级: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    感染波动值: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
    空中支援许可: z.boolean(),
    机场已取得: z.boolean(),
    冷战阶段已解锁: z.boolean(),
    现代阶段已解锁: z.boolean(),
    关键前置完成度: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
  }),
});

export type Schema = z.output<typeof Schema>;
