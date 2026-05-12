import { createApp } from 'vue';
import App from './App.vue';
import './global.css';

interface StatusPayload {
  time: string;
  location: string;
  target: string;
  identity: string;
  stage: string;
  rules: string[];
  cognition: string;
  body: string;
  social: string;
  risk: string;
  next: string;
}

function cleanSegment(value: string | null | undefined): string {
  return (value ?? '').replace(/\r/g, '').trim();
}

function toFallback(value: string, fallback: string): string {
  return value || fallback;
}

function parseRules(value: string): string[] {
  const normalized = cleanSegment(value);
  if (!normalized || normalized === '无') {
    return ['暂无额外覆写'];
  }

  return normalized
    .split(/[、,，/]/)
    .map(part => cleanSegment(part))
    .filter(Boolean);
}

function buildStatus(source: HTMLElement): StatusPayload {
  return {
    time: toFallback(cleanSegment(source.dataset.time), '时间未同步'),
    location: toFallback(cleanSegment(source.dataset.location), '地点未同步'),
    target: toFallback(cleanSegment(source.dataset.target), '未锁定目标'),
    identity: toFallback(cleanSegment(source.dataset.identity), '身份未知'),
    stage: toFallback(cleanSegment(source.dataset.stage), '锁定目标'),
    rules: parseRules(source.dataset.rules ?? ''),
    cognition: toFallback(cleanSegment(source.dataset.cognition), '认知侧暂无显著偏移'),
    body: toFallback(cleanSegment(source.dataset.body), '身体侧暂无显著变化'),
    social: toFallback(cleanSegment(source.dataset.social), '社会侧无显著变化'),
    risk: toFallback(cleanSegment(source.dataset.risk), '低'),
    next: toFallback(cleanSegment(source.dataset.next), '继续观察目标对新规则的即时反馈'),
  };
}

for (const shell of Array.from(document.querySelectorAll('.rr-status-shell'))) {
  if (!(shell instanceof HTMLElement) || shell.dataset.mounted === '1') {
    continue;
  }

  const source = shell.querySelector('.rr-status-source');
  const mountNode = shell.querySelector('.rr-status-app');
  if (!(source instanceof HTMLElement) || !(mountNode instanceof HTMLElement)) {
    continue;
  }

  shell.dataset.mounted = '1';
  createApp(App, { status: buildStatus(source) }).mount(mountNode);
}
