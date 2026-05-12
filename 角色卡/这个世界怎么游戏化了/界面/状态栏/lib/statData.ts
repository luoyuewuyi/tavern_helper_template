import { Log, Quest, Skill, StatData } from '../types';

type AnyRecord = Record<string, any>;

const defaultMockData: StatData = {
  player: {
    name: '未知访问者',
    level: 1,
    exp: 0,
    maxExp: 100,
    hp: 100,
    maxHp: 100,
    mp: 0,
    maxMp: 100,
    money: 0,
    skillPoints: 0,
    unassignedSkillExp: 0,
    world: '待设定',
    location: '待初始化',
    time: '开局',
    identity: '待设定',
    status: ['技能系统已激活'],
  },
  skills: {
    日常生活: [],
    战斗: [],
    职业: [],
    探索: [],
  },
  quests: [],
  logs: [{ time: 'SYSTEM', msg: '等待开局输入。' }],
};

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' ? (value as AnyRecord) : {};
}

function getRawStatData(): AnyRecord {
  const direct = asRecord(window.stat_data);
  if (Object.keys(direct).length > 0) {
    return direct;
  }

  try {
    const messageId = window.getCurrentMessageId?.();
    const mvuData = window.Mvu?.getMvuData?.({ type: 'message', message_id: messageId });
    const statData = asRecord(mvuData?.stat_data);
    if (Object.keys(statData).length > 0) {
      return statData;
    }
  } catch {
    // fall through to other sources
  }

  try {
    return asRecord(window.getVariables?.({ type: 'message' })?.stat_data);
  } catch {
    return {};
  }
}

function toStatusList(status: AnyRecord): string[] {
  return Object.entries(status).map(([name, value]) => {
    const record = asRecord(value);
    const desc = record.描述 ? `: ${record.描述}` : '';
    const remain = record.剩余 && record.剩余 !== '未知' ? ` (${record.剩余})` : '';
    return `${name}${desc}${remain}`;
  });
}

function mapSkills(rawSkills: AnyRecord): Record<string, Skill[]> {
  const groups = Object.entries(rawSkills).map(([group, skills]) => {
    const mapped = Object.entries(asRecord(skills)).map(([name, value]) => {
      const skill = asRecord(value);
      return {
        name,
        level: Number(skill.等级 ?? 1),
        exp: Number(skill.经验 ?? 0),
        maxExp: 100,
      };
    });
    return [group, mapped] as const;
  });

  if (groups.length === 0) {
    return defaultMockData.skills;
  }
  return Object.fromEntries(groups);
}

function mapQuests(rawQuests: AnyRecord): Quest[] {
  const active = asRecord(rawQuests.活跃);
  return Object.entries(active).map(([name, value]) => {
    const quest = asRecord(value);
    const reward = asRecord(quest.奖励);
    const status = quest.状态 === '可提交' ? 'completable' : quest.状态 === '进行中' ? 'ongoing' : 'available';
    const rewards = [
      Number(reward.技能经验 ?? 0) > 0 ? `技能经验+${reward.技能经验}` : '',
      Number(reward.金钱 ?? 0) !== 0 ? `金钱${Number(reward.金钱) > 0 ? '+' : ''}${reward.金钱}` : '',
      reward.道具 && reward.道具 !== '无' ? `道具: ${reward.道具}` : '',
      reward.其他 && reward.其他 !== '无' ? `${reward.其他}` : '',
    ].filter(Boolean);

    return {
      name,
      status,
      desc: `${quest.目标 ?? '目标待明确'}${quest.发布者 ? ` / 发布者: ${quest.发布者}` : ''}`,
      progress: `${quest.难度 ?? '低'}难度${rewards.length > 0 ? ` / ${rewards.join(' / ')}` : ''}`,
    };
  });
}

function mapLogs(rawSystem: AnyRecord): Log[] {
  const logs = Object.entries(asRecord(rawSystem.日志)).map(([key, value]) => {
    const log = asRecord(value);
    return {
      time: String(log.时间 ?? key),
      msg: String(log.内容 ?? ''),
    };
  });
  return logs.length > 0 ? logs.slice(-12) : defaultMockData.logs;
}

export function getStatData(): StatData {
  const raw = getRawStatData();
  if (Object.keys(raw).length === 0) {
    return defaultMockData;
  }

  const world = asRecord(raw.世界);
  const player = asRecord(raw.玩家);
  const system = asRecord(raw.系统);
  const status = toStatusList(asRecord(player.当前状态));

  return {
    player: {
      name: String(player.姓名 ?? defaultMockData.player.name),
      level: Number(player.等级 ?? 1),
      exp: Number(player.经验 ?? 0),
      maxExp: 100,
      hp: 100,
      maxHp: 100,
      mp: Number(system.待分配技能经验 ?? 0),
      maxMp: Math.max(100, Number(system.待分配技能经验 ?? 0)),
      money: Number(player.金钱 ?? 0),
      skillPoints: Number(player.可用技能点 ?? 0),
      unassignedSkillExp: Number(system.待分配技能经验 ?? 0),
      world: String(world.世界类型 ?? defaultMockData.player.world),
      location: String(world.当前地点 ?? defaultMockData.player.location),
      time: String(world.当前时间 ?? defaultMockData.player.time),
      identity: String(player.身份 ?? '待设定'),
      status: status.length > 0 ? status : ['正常'],
    },
    skills: mapSkills(asRecord(raw.技能)),
    quests: mapQuests(asRecord(raw.任务)),
    logs: mapLogs(system),
  };
}
