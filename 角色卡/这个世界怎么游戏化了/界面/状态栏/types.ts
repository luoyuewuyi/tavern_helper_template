export interface Skill {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
}

export interface Quest {
  name: string;
  status: 'available' | 'ongoing' | 'completable';
  desc: string;
  progress?: string;
}

export interface Log {
  time: string;
  msg: string;
}

export interface PlayerStats {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  money: number;
  skillPoints: number;
  unassignedSkillExp: number;
  world: string;
  location: string;
  time: string;
  identity: string;
  status: string[];
}

export interface StatData {
  player: PlayerStats;
  skills: Record<string, Skill[]>;
  quests: Quest[];
  logs: Log[];
}

declare global {
  interface Window {
    stat_data?: unknown;
    Mvu?: {
      getMvuData?: (option: { type: 'message'; message_id?: number }) => { stat_data?: unknown };
    };
    getVariables?: (option?: { type?: 'message' }) => { stat_data?: unknown };
    getCurrentMessageId?: () => number;
  }
}
