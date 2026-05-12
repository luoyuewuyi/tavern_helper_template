import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MVUData {
  主角: { 姓名: string; 年龄: number | string; 外表: string; 性格: string; 个人经历: string; 来自哪里: string; 与其他NPC关系: string; };
  直播配置: { 阶段: string; 类型: string; 当前天数: number; 总天数: number; 地点: string; 难度: string; };
  积分与投币: { 积分: number; 观众投币: number; };
  住处: { 类型: string; 价格: number; };
  道具: Record<string, number>;
  任务: Record<string, { 难度: string; 状态: string }>;
  NPC: Record<string, { 年龄: string | number; 身份: string; 存活: boolean; 阵营隐藏?: boolean; 备注: string; 来源: string }>;
  弹幕: { 最新弹幕: string[] };
}

function readMvuRaw(): any {
  const mvu = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });
  return _.get(mvu, 'stat_data', {});
}

function flattenForUI(raw: any): MVUData {
  const npcs: MVUData['NPC'] = {};
  for (const [name, n] of Object.entries(raw.NPC || {})) {
    const npc = n as any;
    npcs[name] = {
      年龄: npc.年龄 ?? '', 身份: npc.身份 ?? '',
      存活: npc.存活 ?? true, 阵营隐藏: npc.阵营 !== '未分配' ? false : undefined,
      备注: npc.备注?.性格 ?? '', 来源: npc.备注?.来源 ?? '',
    };
  }
  const items: Record<string, number> = {};
  for (const [name, item] of Object.entries(raw.道具 || {})) {
    items[name] = (item as any).数量 ?? 0;
  }
  const tasks: MVUData['任务'] = {};
  for (const [name, t] of Object.entries(raw.任务 || {})) {
    const task = t as any;
    tasks[name] = { 难度: task.难度 ?? '普通', 状态: task.完成状态 ?? '未开始' };
  }
  return {
    主角: raw.主角 || {},
    直播配置: raw.直播配置 || {},
    积分与投币: raw.积分与投币 || { 积分: 0, 观众投币: 0 },
    住处: { 类型: raw.住处?.类型 ?? '无', 价格: raw.住处?.每晚价格 ?? 0 },
    道具: items,
    任务: tasks,
    NPC: npcs,
    弹幕: raw.弹幕 || { 最新弹幕: [] },
  };
}

const StoreContext = createContext<{ data: MVUData }>({ data: {} as MVUData });

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MVUData>(() => flattenForUI(readMvuRaw()));

  useEffect(() => {
    const refresh = () => setData(flattenForUI(readMvuRaw()));
    eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, refresh);
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  return <StoreContext.Provider value={{ data }}>{children}</StoreContext.Provider>;
};

export const useDataStore = () => useContext(StoreContext);
