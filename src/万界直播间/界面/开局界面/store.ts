export async function submitGameStart(gameData: {
  protagonist: { name: string; age: number | ''; personality: string; appearance: string; experience: string; origin: string; relations: string; };
  npcs: Array<{ name: string; age: number | ''; identity: string; originWork: string; notes: string; }>;
  liveType: string;
  difficulty: string;
}): Promise<void> {
  const mvuData = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });
  const updates: Record<string, any> = {
    '主角.姓名': gameData.protagonist.name,
    '主角.年龄': gameData.protagonist.age || 18,
    '主角.备注.性格': gameData.protagonist.personality,
    '主角.备注.外表': gameData.protagonist.appearance,
    '主角.备注.个人经历': gameData.protagonist.experience,
    '主角.备注.来自哪里': gameData.protagonist.origin,
    '主角.备注.与其他NPC关系': gameData.protagonist.relations || '默认不认识其他NPC',
    '直播配置.类型': gameData.liveType,
    '直播配置.难度': gameData.difficulty,
    '直播配置.阶段': '直播中',
    '_系统.初始化完成': true,
  };
  for (const npc of gameData.npcs) {
    if (!npc.name) continue;
    updates[`NPC.${npc.name}.年龄`] = npc.age || 18;
    updates[`NPC.${npc.name}.身份`] = npc.identity;
    updates[`NPC.${npc.name}.备注.性格`] = npc.notes;
    updates[`NPC.${npc.name}.备注.来源`] = npc.originWork;
    updates[`NPC.${npc.name}.备注.与其他NPC关系`] = '默认不认识其他NPC';
  }
  for (const [path, value] of Object.entries(updates)) {
    _.set(mvuData, `stat_data.${path}`, value);
  }
  await Mvu.replaceMvuData(mvuData, { type: 'message', message_id: getCurrentMessageId() });
  triggerSlash('/trigger');
}
