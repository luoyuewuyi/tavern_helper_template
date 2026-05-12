<template>
  <section class="status-shell">
    <header class="shell-head">
      <article class="identity-panel">
        <div class="identity-top">
          <span class="eyebrow">Status Console</span>
          <span class="stamp">{{ status.日期 }} · {{ status.时间 }}</span>
        </div>

        <div class="identity-body">
          <div class="identity-copy">
            <h2 class="title">{{ status.角色名 }}</h2>
            <p class="subtitle">{{ status.关系 }}</p>
          </div>

          <div class="scent-card">
            <span class="mini-label">体味</span>
            <strong class="scent-value">{{ status.体味 }}</strong>
          </div>
        </div>
      </article>

      <section class="headline-grid">
        <article v-for="item in headlineItems" :key="item.label" class="headline-card">
          <span class="mini-label">{{ item.label }}</span>
          <strong class="headline-value">{{ item.value }}</strong>
        </article>
      </section>
    </header>

    <section class="board-grid">
      <article class="panel focus-panel">
        <div class="panel-head">
          <span>场景焦点</span>
          <span class="panel-tag">Scene</span>
        </div>

        <div class="text-stack">
          <div class="text-card">
            <span class="mini-label">地图描述</span>
            <p class="copy-body">{{ status.地图描述 }}</p>
          </div>

          <div class="text-card">
            <span class="mini-label">状态描写</span>
            <p class="copy-body">{{ status.状态描写 }}</p>
          </div>
        </div>
      </article>

      <article class="panel metrics-panel">
        <div class="panel-head">
          <span>状态数值</span>
          <span class="panel-tag">Metric</span>
        </div>

        <div class="metric-list">
          <article v-for="metric in metrics" :key="metric.label" class="metric-card">
            <div class="metric-top">
              <span class="mini-label">{{ metric.label }}</span>
              <strong class="metric-value">{{ metric.value }}<small>/{{ metric.max }}</small></strong>
            </div>
            <div class="metric-track">
              <div class="metric-fill" :style="{ width: metricPercent(metric.value, metric.max) }"></div>
            </div>
          </article>
        </div>
      </article>

      <article class="panel quick-panel">
        <div class="panel-head">
          <span>快速状态</span>
          <span class="panel-tag">Quick</span>
        </div>

        <div class="compact-grid">
          <div v-for="item in quickItems" :key="item.label" class="compact-card">
            <span class="mini-label">{{ item.label }}</span>
            <strong class="compact-value">{{ item.value }}</strong>
          </div>
        </div>

        <div class="chip-grid">
          <div v-for="item in sceneStatItems" :key="item.label" class="chip-card">
            <span class="mini-label">{{ item.label }}</span>
            <span class="chip-value">{{ item.value }}</span>
          </div>
        </div>
      </article>
    </section>

    <nav class="tab-strip" aria-label="状态栏分区">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        type="button"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </nav>

    <section v-if="activeTab === '概览'" class="detail-grid">
      <article class="panel span-8">
        <div class="panel-head">
          <span>穿着与外观</span>
          <span class="panel-tag">Overview</span>
        </div>

        <div class="field-grid">
          <div v-for="item in appearanceItems" :key="item.label" class="field-card">
            <span class="mini-label">{{ item.label }}</span>
            <span class="field-value">{{ item.value }}</span>
          </div>
        </div>
      </article>

      <article class="panel span-4">
        <div class="panel-head">
          <span>身体摘要</span>
          <span class="panel-tag">Preview</span>
        </div>

        <div class="stack-grid">
          <div v-for="item in previewItems" :key="item.label" class="stack-card">
            <span class="mini-label">{{ item.label }}</span>
            <span class="field-value">{{ item.value }}</span>
          </div>
        </div>
      </article>

      <article class="panel span-12">
        <div class="panel-head">
          <span>独白</span>
          <span class="panel-tag">Mind</span>
        </div>

        <div class="text-card solo-card">
          <p class="copy-body">{{ status.独白 }}</p>
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === '身体'" class="detail-grid">
      <article class="panel span-7">
        <div class="panel-head">
          <span>身体状态</span>
          <span class="panel-tag">Body</span>
        </div>

        <div class="field-grid">
          <div v-for="item in bodyItems" :key="item.label" class="field-card">
            <span class="mini-label">{{ item.label }}</span>
            <span class="field-value">{{ item.value }}</span>
          </div>
        </div>
      </article>

      <article class="panel span-5">
        <div class="panel-head">
          <span>亲密进度</span>
          <span class="panel-tag">Progress</span>
        </div>

        <div class="field-grid">
          <div v-for="item in intimacyItems" :key="item.label" class="field-card">
            <span class="mini-label">{{ item.label }}</span>
            <span class="field-value">{{ item.value }}</span>
          </div>
        </div>
      </article>
    </section>

    <section v-else class="detail-grid">
      <article class="panel span-7">
        <div class="panel-head">
          <span>环境描述</span>
          <span class="panel-tag">Map</span>
        </div>

        <div class="text-card solo-card">
          <p class="copy-body">{{ status.地图描述 }}</p>
        </div>
      </article>

      <article class="panel span-5">
        <div class="panel-head">
          <span>行为动态</span>
          <span class="panel-tag">Action</span>
        </div>

        <div class="stack-grid">
          <div v-for="item in actionItems" :key="item.label" class="stack-card">
            <span class="mini-label">{{ item.label }}</span>
            <span class="field-value">{{ item.value }}</span>
          </div>
        </div>
      </article>

      <article class="panel span-12">
        <div class="panel-head">
          <span>状态描写与独白</span>
          <span class="panel-tag">Scene</span>
        </div>

        <div class="dual-copy">
          <div class="text-card">
            <span class="mini-label">状态描写</span>
            <p class="copy-body">{{ status.状态描写 }}</p>
          </div>

          <div class="text-card">
            <span class="mini-label">独白</span>
            <p class="copy-body">{{ status.独白 }}</p>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { getMetricValue, readStatusDataFromCurrentMessage, type StatusData, type StatusField } from './parser';

const tabs = ['概览', '身体', '场景'] as const;
type TabKey = (typeof tabs)[number];

const activeTab = ref<TabKey>('概览');
const status = ref<StatusData>(readStatusDataFromCurrentMessage());

function fields(labels: StatusField[]) {
  return labels.map(label => ({ label, value: status.value[label] }));
}

const headlineItems = computed(() => fields(['地点', '天气', '日期', '时间']));
const appearanceItems = computed(() => fields(['上衣', '下衣', '鞋子', '配饰', '妆容', '发型']));
const previewItems = computed(() => fields(['嘴巴', '胸部', '手部', '腹部', '阴部', '大腿']));
const bodyItems = computed(() =>
  fields(['嘴巴', '胸部', '手部', '腹部', '阴部', '大腿', '脚部', '尾巴', '耳朵', '姿势', '行为']),
);
const intimacyItems = computed(() =>
  fields(['性次数', '怀孕状态', '怀孕可能', '精液量', '胸部开发', '小穴开发', '肛门开发', '尾巴开发']),
);
const quickItems = computed(() => fields(['怀孕状态', '怀孕可能', '性次数', '精液量']));
const sceneStatItems = computed(() => fields(['姿势', '行为', '耳朵', '尾巴']));
const actionItems = computed(() => fields(['姿势', '行为', '耳朵', '尾巴']));

const metrics = computed(() => [
  { label: '好感度', value: getMetricValue(status.value, '好感度'), max: 1000 },
  { label: '服从度', value: getMetricValue(status.value, '服从度'), max: 100 },
  { label: '健康值', value: getMetricValue(status.value, '健康值'), max: 100 },
  { label: '性欲值', value: getMetricValue(status.value, '性欲值'), max: 100 },
  { label: '饱腹值', value: getMetricValue(status.value, '饱腹值'), max: 100 },
  { label: '理智值', value: getMetricValue(status.value, '理智值'), max: 100 },
]);

function metricPercent(value: number, max: number) {
  return `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
}

function refreshStatus(messageId?: number) {
  if (messageId === undefined || messageId === getCurrentMessageId()) {
    status.value = readStatusDataFromCurrentMessage();
  }
}

const listeners = [
  eventOn(tavern_events.MESSAGE_UPDATED, refreshStatus),
  eventOn(tavern_events.MESSAGE_SWIPED, refreshStatus),
  eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, messageId => refreshStatus(messageId)),
  eventOn(tavern_events.USER_MESSAGE_RENDERED, refreshStatus),
];

onBeforeUnmount(() => {
  listeners.forEach(listener => listener.stop());
});
</script>

<style scoped>
.status-shell {
  --bg-main: linear-gradient(158deg, #0d1620 0%, #152231 48%, #213246 100%);
  --bg-panel: linear-gradient(180deg, rgba(9, 18, 28, 0.96), rgba(17, 29, 42, 0.92));
  --bg-soft: rgba(15, 27, 39, 0.84);
  --bg-accent: rgba(29, 50, 70, 0.74);
  --line: rgba(133, 157, 183, 0.2);
  --line-strong: rgba(173, 194, 214, 0.34);
  --text-main: #e6edf5;
  --text-soft: #90a3b7;
  --text-strong: #f5f8fc;
  --text-accent: #cad8e6;
  --shadow: 0 16px 34px rgba(4, 9, 15, 0.34);
  width: 100%;
  min-width: 0;
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--line-strong);
  border-radius: 22px;
  background: var(--bg-main);
  box-shadow: var(--shadow);
  overflow: hidden;
  position: relative;
  container-type: inline-size;
}

.status-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(132, 161, 188, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 18%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0 1px, transparent 1px 26px);
  pointer-events: none;
}

.status-shell > * {
  position: relative;
  z-index: 1;
}

.shell-head,
.headline-grid,
.board-grid,
.detail-grid,
.text-stack,
.metric-list,
.compact-grid,
.chip-grid,
.field-grid,
.stack-grid,
.dual-copy {
  display: grid;
  gap: 12px;
}

.shell-head {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  align-items: stretch;
}

.board-grid,
.detail-grid {
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: start;
}

.identity-panel,
.headline-card,
.panel,
.tab-btn {
  min-width: 0;
  border: 1px solid var(--line);
  background: var(--bg-panel);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.identity-panel,
.panel {
  border-radius: 18px;
  padding: 14px;
}

.identity-panel {
  display: grid;
  gap: 14px;
}

.identity-top,
.identity-body,
.metric-top,
.panel-head {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.identity-body {
  align-items: start;
}

.identity-copy {
  min-width: 0;
}

.eyebrow,
.mini-label {
  color: var(--text-soft);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stamp {
  color: var(--text-accent);
  font-size: 12px;
  white-space: nowrap;
}

.title {
  margin: 0;
  color: var(--text-strong);
  font-size: clamp(22px, 4cqi, 30px);
  line-height: 1.08;
}

.subtitle {
  margin: 6px 0 0;
  color: var(--text-soft);
  font-size: 13px;
}

.scent-card,
.text-card,
.compact-card,
.chip-card,
.field-card,
.stack-card,
.metric-card {
  min-width: 0;
  border: 1px solid rgba(146, 169, 192, 0.14);
  border-radius: 14px;
  background: var(--bg-soft);
}

.scent-card {
  width: min(100%, 280px);
  padding: 12px 14px;
  display: grid;
  gap: 6px;
}

.scent-value,
.headline-value,
.compact-value,
.field-value,
.chip-value,
.metric-value {
  color: var(--text-main);
}

.headline-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.headline-card {
  border-radius: 16px;
  padding: 12px 14px;
  display: grid;
  gap: 6px;
}

.headline-value {
  font-size: 15px;
  line-height: 1.3;
}

.focus-panel {
  grid-column: span 6;
}

.metrics-panel {
  grid-column: span 3;
}

.quick-panel {
  grid-column: span 3;
}

.span-12 {
  grid-column: span 12;
}

.span-8 {
  grid-column: span 8;
}

.span-7 {
  grid-column: span 7;
}

.span-5 {
  grid-column: span 5;
}

.span-4 {
  grid-column: span 4;
}

.panel-head {
  margin-bottom: 12px;
}

.panel-head > span:first-child {
  color: var(--text-strong);
  font-size: 14px;
  font-weight: 600;
}

.panel-tag {
  color: #adc3d8;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.text-card,
.compact-card,
.chip-card,
.field-card,
.stack-card,
.metric-card {
  padding: 12px;
}

.copy-body {
  margin: 6px 0 0;
  color: var(--text-main);
  line-height: 1.62;
  white-space: pre-wrap;
  max-block-size: 11.5em;
  overflow: auto;
}

.solo-card .copy-body {
  max-block-size: 13.5em;
}

.metric-list {
  gap: 10px;
}

.metric-top {
  align-items: baseline;
}

.metric-value {
  font-size: 14px;
}

.metric-value small {
  color: var(--text-soft);
  font-size: 11px;
}

.metric-track {
  margin-top: 10px;
  height: 6px;
  border-radius: 999px;
  background: rgba(125, 148, 173, 0.2);
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #88a8c7 0%, #d2e0ee 100%);
}

.compact-grid,
.chip-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.chip-grid {
  margin-top: 12px;
}

.field-grid {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.stack-grid {
  gap: 10px;
}

.tab-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.tab-btn {
  min-width: 0;
  padding: 10px 12px;
  border-radius: 14px;
  color: var(--text-soft);
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color 140ms ease,
    background 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

.tab-btn:hover {
  border-color: rgba(173, 194, 214, 0.42);
  color: var(--text-main);
  transform: translateY(-1px);
}

.tab-btn.active {
  border-color: rgba(190, 208, 226, 0.48);
  background: linear-gradient(180deg, rgba(24, 39, 56, 0.94), rgba(14, 24, 36, 0.96));
  color: var(--text-strong);
}

.dual-copy {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@container (max-width: 1040px) {
  .shell-head {
    grid-template-columns: 1fr;
  }

  .focus-panel {
    grid-column: span 12;
  }

  .metrics-panel {
    grid-column: span 7;
  }

  .quick-panel {
    grid-column: span 5;
  }
}

@container (max-width: 820px) {
  .status-shell {
    padding: 12px;
    border-radius: 18px;
  }

  .metrics-panel,
  .quick-panel,
  .span-8,
  .span-7,
  .span-5,
  .span-4,
  .span-12 {
    grid-column: span 12;
  }

  .identity-body,
  .dual-copy {
    grid-template-columns: 1fr;
    display: grid;
  }

  .field-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container (max-width: 560px) {
  .headline-grid,
  .compact-grid,
  .chip-grid,
  .field-grid,
  .dual-copy {
    grid-template-columns: 1fr;
  }

  .tab-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .stamp {
    white-space: normal;
    text-align: right;
  }

  .scent-card {
    width: 100%;
  }
}
</style>
