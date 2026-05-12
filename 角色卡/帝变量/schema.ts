import { z } from 'zod';

// 粮草结构
const 粮草Schema = z.object({
  存粮: z.number().describe('当前存粮（万石）'),
  年净收入: z.number().describe('年粮食净收入（万石）'),
});

// 库银结构
const 库银Schema = z.object({
  存银: z.number().describe('当前国库存银（万两）'),
  年净收入: z.number().describe('年财政净收入（万两）'),
});

// 时间结构
const 当前时间Schema = z.object({
  年号: z.string().describe('当前年号'),
  年: z.number().describe('年份'),
  月: z.string().describe('月份'),
  日: z.string().describe('日期'),
  时辰: z.string().describe('时辰'),
});

// 政策结构
const 政策Schema = z.object({
  名称: z.string().describe('政策名称'),
  进度: z.number().describe('完成进度（0-100）'),
  剩余月数: z.number().describe('剩余执行月数'),
  效果说明: z.string().describe('政策效果描述'),
});

// 主Schema
export const Schema = z.object({
  stat_data: z.object({
    // 时间与地点
    当前时间: 当前时间Schema,
    当前地点: z.string().describe('当前所在位置'),
    当前事件: z.string().describe('正在进行的事件'),

    // 八大核心变量
    粮草: 粮草Schema,
    库银: 库银Schema,
    兵力: z.number().describe('中央常备军（万人）'),
    军心: z.number().min(0).max(100).describe('军队士气与忠诚度（0-100）'),
    民心: z.number().min(0).max(100).describe('百姓安定与拥戴程度（0-100）'),
    腐化: z.number().min(0).max(100).describe('官僚贪腐程度（0-100）'),
    科技: z.number().describe('综合技术发展水平（点数）'),
    威望: z.number().min(0).max(100).describe('皇权威严与朝廷向心力（0-100）'),

    // 当前推行的政策
    当前政策: z.array(政策Schema).describe('正在推行的政策列表'),

    // 最近动作（用于AI感知玩家操作）
    最近动作: z.string().optional().describe('玩家最近在状态栏执行的动作'),
  }),
});

export type Schema = z.output<typeof Schema>;
