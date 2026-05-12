import { createApp } from 'vue';
import App from './App.vue';
import './global.css';

interface BodyState {
  label: string;
  value: string;
}

interface StatusPayload {
  route: string;
  controller: string;
  sanity: number;
  alert: number;
  progress: number;
  stage: string;
  clues: number;
  ending: string;
  bodyStates: BodyState[];
}

function clean(value: string | undefined): string {
  return (value ?? '').replace(/\r/g, '').trim();
}

function toNumber(value: string | undefined, fallback = 0): number {
  const parsed = Number.parseInt(clean(value), 10);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback;
}

function buildStatus(shell: HTMLElement): StatusPayload {
  return {
    route: clean(shell.dataset.route) || '未定路线',
    controller: clean(shell.dataset.controller) || '未知主控',
    sanity: toNumber(shell.dataset.sanity, 100),
    alert: toNumber(shell.dataset.alert, 0),
    progress: toNumber(shell.dataset.progress, 0),
    stage: clean(shell.dataset.stage) || '未定阶段',
    clues: toNumber(shell.dataset.clues, 0),
    ending: clean(shell.dataset.ending) || '未定',
    bodyStates: [
      { label: '口部', value: clean(shell.dataset.mouth) || '未知' },
      { label: '胸部', value: clean(shell.dataset.chest) || '未知' },
      { label: '手部', value: clean(shell.dataset.hands) || '未知' },
      { label: '腿部', value: clean(shell.dataset.legs) || '未知' },
      { label: '阴部', value: clean(shell.dataset.genitals) || '未知' },
    ],
  };
}

for (const shell of Array.from(document.querySelectorAll('.hypno-status-shell'))) {
  if (!(shell instanceof HTMLElement) || shell.dataset.mounted === '1') {
    continue;
  }

  const mountNode = shell.querySelector('.hypno-status-app');
  if (!(mountNode instanceof HTMLElement)) {
    continue;
  }

  shell.dataset.mounted = '1';
  createApp(App, { status: buildStatus(shell) }).mount(mountNode);
}
