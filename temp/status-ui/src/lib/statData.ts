import { StatData } from '../types';

const defaultMockData: StatData = {
  player: {
    name: "未知访问者",
    level: 3,
    exp: 450,
    maxExp: 1000,
    hp: 80,
    maxHp: 100,
    mp: 30,
    maxMp: 50,
    money: 2450,
    skillPoints: 2,
    unassignedSkillExp: 150,
    world: "初级赛博城市",
    location: "下层贫民窟-7号街区",
    time: "2077.10.23 14:30",
    status: ["轻微疲劳", "饱腹"]
  },
  skills: {
    "战斗": [
      { name: "灵巧避让", level: 3, exp: 75, maxExp: 100 },
      { name: "枪械连击", level: 2, exp: 40, maxExp: 100 }
    ],
    "日常": [
      { name: "交涉技巧", level: 4, exp: 90, maxExp: 100 }
    ],
    "探索": []
  },
  quests: [
    { name: "清理后巷鼠群", status: "ongoing", desc: "打扫7号街区后巷的变异老鼠。", progress: "5/10" },
    { name: "送餐任务", status: "completable", desc: "把外卖送到顶层公寓。" },
    { name: "新手指引", status: "available", desc: "向导师了解世界规则。" }
  ],
  logs: [
    { time: "14:28", msg: "获得【过期营养膏】x1" },
    { time: "14:25", msg: "击杀【变异老鼠】，经验+10" },
    { time: "14:20", msg: "接受任务【清理后巷鼠群】" },
    { time: "14:15", msg: "登录系统。欢迎来到游戏化现实。" }
  ]
};

export function getStatData(): StatData {
  // If embedded in a context where window.stat_data exists, it will use that.
  // Otherwise it falls back to mock data so it looks good in standalone preview.
  return window.stat_data || defaultMockData;
}
