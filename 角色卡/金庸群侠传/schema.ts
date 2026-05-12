import _ from 'lodash';
import { z } from 'zod';

export const Schema = z.object({
  基础信息: z
    .object({
      姓名: z.string().prefault('未知'),
      性别: z.enum(['男', '女', '未知']).prefault('未知'),
      年龄: z.coerce.number().prefault(18),
      门派: z.string().prefault('无'),
      称号: z.string().prefault('江湖草莽'),
    })
    .prefault({}),
  世界状态: z
    .object({
      当前时间: z
        .object({
          年份: z.coerce.number().prefault(1265),
          月份: z.coerce.number().prefault(1),
          日期: z.coerce.number().prefault(1),
          季节: z.enum(['春', '夏', '秋', '冬']).prefault('春'),
          时辰: z.string().prefault('子时'),
        })
        .prefault({}),
      当前地点: z
        .object({
          区域: z.string().prefault('襄阳'),
          场所: z.string().prefault('悦来客栈'),
        })
        .prefault({}),
    })
    .prefault({}),
  核心属性: z
    .object({
      境界: z.string().prefault('初窥门径'),
      等级: z.coerce.number().prefault(1),
      属性: z
        .object({
          臂力: z.coerce.number().prefault(10),
          根骨: z.coerce.number().prefault(10),
          身法: z.coerce.number().prefault(10),
          悟性: z.coerce.number().prefault(10),
          内息: z.coerce.number().prefault(10),
          福源: z.coerce.number().prefault(5),
        })
        .prefault({}),
      状态: z
        .object({
          气血: z.coerce.number().prefault(100),
          内力: z.coerce.number().prefault(50),
          体力: z.coerce.number().prefault(100),
        })
        .prefault({}),
    })
    .prefault({}),
  资源资产: z
    .object({
      银两: z.coerce.number().prefault(100),
      声望: z.coerce.number().prefault(0),
      背包: z
        .record(
          z.string().describe('物品名'),
          z.object({
            描述: z.string(),
            数量: z.coerce.number(),
            品级: z.string(),
          }),
        )
        .prefault({}),
    })
    .prefault({}),
  武学装备: z
    .object({
      当前运行内功: z.string().prefault('无').describe('当前只能激活并运行一种内功'),
      装备外功列表: z
        .record(z.enum(['招式1', '招式2', '招式3', '招式4']), z.string())
        .prefault({
          招式1: '空',
          招式2: '空',
          招式3: '空',
          招式4: '空',
        })
        .describe('可同时装备最多4个外功招式'),
      当前装备物品: z.record(z.enum(['兵器', '防具', '饰品']), z.string()).prefault({
        兵器: '无',
        防具: '无',
        饰品: '无',
      }),
      已习得武学: z
        .record(
          z.string().describe('武学名'),
          z.object({
            类型: z.enum(['内功', '外功']),
            等级: z.coerce.number(),
            熟练度: z.coerce.number(),
            品级: z.string(),
            内力贡献: z.coerce.number().optional().describe('学习该内功累计提升的内力上限'),
          }),
        )
        .prefault({}),
    })
    .prefault({}),
  社交关系: z
    .object({
      好感度: z
        .record(
          z.string().describe('NPC名'),
          z.object({
            数值: z.coerce.number().transform(v => _.clamp(v, -100, 100)),
            关系描述: z.string(),
          }),
        )
        .prefault({}),
      队伍成员: z.array(z.string()).max(2).prefault([]).describe('当前随行队友'),
      后宫备用: z.array(z.string()).prefault([]).describe('可替换的队友/好友'),
      势力关系: z
        .record(
          z.string().describe('势力名'),
          z.object({
            友好度: z.coerce.number(),
            评价: z.string(),
          }),
        )
        .prefault({}),
    })
    .prefault({}),
  江湖经历: z
    .object({
      经历概况: z.string().prefault('初入江湖，默默无闻。').describe('发生过接触的角色/势力的关系和经历概况'),
      重要事件录: z.array(z.string()).prefault([]),
    })
    .prefault({}),
  当前检定: z
    .object({
      描述: z.string().prefault('无'),
      数值: z.coerce.number().prefault(0),
      加成: z.coerce.number().prefault(0),
      难度: z.coerce.number().prefault(10),
      结果: z.enum(['大成功', '成功', '失败', '大失败', '无']).prefault('无'),
    })
    .prefault({}),
});

export type Schema = z.infer<typeof Schema>;
