import { DefaultData } from '../schema';

export type WestFantasyState = typeof DefaultData;
export type ModalType = 'members' | 'map' | 'location' | 'status' | 'rules' | null;
export type SessionHostCommandType = 'travel-region' | 'travel-place' | 'event' | 'npc';

export interface SessionHostCommandPayload {
  type: SessionHostCommandType;
  target: string;
  label: string;
  description?: string;
  requiresConfirm?: boolean;
}

export interface ParsedAssistantMessage {
  maintext: string;
  options: string[];
  sum: string | null;
  updateVariable: string | null;
  raw: string;
}

export interface NarrativeMessage {
  id: number;
  role: 'assistant' | 'user';
  display: string;
  raw: string;
  options: string[];
  sum: string | null;
}

export interface OpeningFormData {
  主角: {
    姓名: string;
    身份: string;
    头像: string;
    心情文本: string;
  };
}
