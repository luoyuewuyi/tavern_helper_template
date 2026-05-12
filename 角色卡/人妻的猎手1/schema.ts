const 突破事件状态 = z.enum(['未触发', '进行中', '已完成']);

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前日期: z.string(),
  }),

  建议选项: z.array(z.string()).prefault([]).default([]),

  陆沉雪: createHeroineSchema(
    ['🏠慈母之心🏠', '🌙暗夜迷惑🌙', '💧禁忌裂痕💧', '🔥母性沦陷🔥', '💋完全归属💋'],
    '登场中',
  ),

  陆美玲: createHeroineSchema(
    ['🎀亲情纽带🎀', '🍷暧昧试探🍷', '💄欲拒还迎💄', '🌹情欲觉醒🌹', '💝甘愿为奴💝'],
    '未登场',
  ),

  柳如玉: createHeroineSchema(['🛡冰封之心🛡', '🌊赎罪之门🌊', '⛓愧疚枷锁⛓', '🔓防线瓦解🔓', '💠以身赎罪💠'], '未登场'),

  何美兰: createHeroineSchema(
    ['👔女王姿态👔', '🗝隐秘渴望🗝', '💊权力让渡💊', '🧎高傲折腰🧎', '👠彻底驯服👠'],
    '未登场',
  ),

  李淑慧: createHeroineSchema(
    ['🌾隐忍求生🌾', '🤲感恩依靠🤲', '💦身心动摇💦', '🎐甘愿付出🎐', '🏷完全所有🏷'],
    '未登场',
  ),

  张雪: createHeroineSchema(['🐚怯懦之壳🐚', '🌱萌芽依赖🌱', '🌸少女绽放🌸', '💕深陷其中💕', '🎀只属于你🎀'], '未登场'),

  白曼文: createHeroineSchema(
    ['👑师道尊严👑', '🔥暗流涌动🔥', '⚡防线崩裂⚡', '💔骄傲碎片💔', '🖤完全臣服🖤'],
    '未登场',
  ),
});

function clampByBreakthrough(value: number, events: Record<string, string>) {
  // 攻略值到达临界点时，若对应突破事件未完成则锁定
  if (value >= 100 && events['👑认主仪式'] !== '已完成') return 100;
  if (value >= 79 && events['🔒烙印宣誓'] !== '已完成') return _.clamp(value, 0, 79);
  if (value >= 59 && events['⛓身心交融'] !== '已完成') return _.clamp(value, 0, 59);
  if (value >= 39 && events['🔥禁忌之吻'] !== '已完成') return _.clamp(value, 0, 39);
  if (value >= 19 && events['🔑破冰试探'] !== '已完成') return _.clamp(value, 0, 19);
  return value;
}

function getStage(value: number, stages: string[]) {
  if (value >= 80) return stages[4];
  if (value >= 60) return stages[3];
  if (value >= 40) return stages[2];
  if (value >= 20) return stages[1];
  return stages[0];
}

function createHeroineSchema(stages: string[], defaultStatus: '登场中' | '未登场' | '离场') {
  return z
    .object({
      '❤️攻略值': z.coerce.number().transform(v => _.clamp(v, 0, 100)),
      登场状态: z.enum(['登场中', '未登场', '离场']).prefault(defaultStatus),
      突破事件: z
        .object({
          '🔑破冰试探': 突破事件状态.prefault('未触发'),
          '🔥禁忌之吻': 突破事件状态.prefault('未触发'),
          '⛓身心交融': 突破事件状态.prefault('未触发'),
          '🔒烙印宣誓': 突破事件状态.prefault('未触发'),
          '👑认主仪式': 突破事件状态.prefault('未触发'),
        })
        .prefault({}),
      身体状态: z.object({
        '👚衣着': z.string(),
        '👄口腔': z.string(),
        '🍈胸乳': z.string(),
        '🌸小穴': z.string(),
        '💮菊穴': z.string(),
        '🏠子宫': z.string(),
      }),
      '💃体态姿势': z.string(),
      '💭内心想法': z.string(),
    })
    .transform(data => {
      const clamped = clampByBreakthrough(data['❤️攻略值'], data.突破事件);
      return {
        ...data,
        '❤️攻略值': clamped,
        $攻略阶段: getStage(clamped, stages),
      };
    });
}

export type Schema = z.output<typeof Schema>;
