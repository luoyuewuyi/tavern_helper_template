import { createApp } from 'vue';
import App from './App.vue';
import './global.css';

interface ProtagonistStatus {
  name: string;
  role: string;
  realm: string;
  state: string;
}

interface CharacterStatus {
  name: string;
  gender: string;
  age: string;
  role: string;
  state: string;
  innerVoice: string;
}

interface StatusPayload {
  title: string;
  time: string;
  location: string;
  weather: string;
  protagonist: ProtagonistStatus;
  characters: CharacterStatus[];
}

function cleanSegment(value: string | null | undefined): string {
  return (value ?? '').replace(/\r/g, '').trim();
}

function splitFixedFields(value: string, count: number): string[] {
  const parts = cleanSegment(value)
    .split('^')
    .map(part => cleanSegment(part));

  while (parts.length < count) {
    parts.push('未知');
  }

  return parts.slice(0, count);
}

function parseProtagonist(raw: string): ProtagonistStatus {
  const [name, role, realm, state] = splitFixedFields(raw, 4);
  return { name, role, realm, state };
}

function parseCharacters(raw: string): CharacterStatus[] {
  const normalized = cleanSegment(raw);
  if (!normalized || normalized === '无') {
    return [];
  }

  return normalized
    .split('~~')
    .map(segment => splitFixedFields(segment, 6))
    .filter(fields => fields.some(field => field && field !== '未知'))
    .map(([name, gender, age, role, state, innerVoice]) => ({
      name,
      gender,
      age,
      role,
      state,
      innerVoice,
    }));
}

function buildStatus(source: HTMLElement): StatusPayload {
  return {
    title: '天元灵鉴',
    time: cleanSegment(source.dataset.time) || '时序未明',
    location: cleanSegment(source.dataset.location) || '地界未明',
    weather: cleanSegment(source.dataset.weather) || '气象未明',
    protagonist: parseProtagonist(source.dataset.protagonist ?? ''),
    characters: parseCharacters(source.textContent ?? ''),
  };
}

for (const shell of Array.from(document.querySelectorAll('.ty-status-shell'))) {
  if (!(shell instanceof HTMLElement) || shell.dataset.mounted === '1') {
    continue;
  }

  const source = shell.querySelector('.ty-status-source');
  const mountNode = shell.querySelector('.ty-status-app');
  if (!(source instanceof HTMLElement) || !(mountNode instanceof HTMLElement)) {
    continue;
  }

  shell.dataset.mounted = '1';
  createApp(App, { status: buildStatus(source) }).mount(mountNode);
}
