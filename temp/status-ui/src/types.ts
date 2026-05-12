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
  status: string[];
}

export interface StatData {
  player: PlayerStats;
  skills: {
    [group: string]: Skill[];
  };
  quests: Quest[];
  logs: Log[];
}

declare global {
  interface Window {
    stat_data?: StatData;
  }
}
