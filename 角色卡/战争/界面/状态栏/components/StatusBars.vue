<template>
  <div class="status-bars">
    <div class="bars-title">
      <span class="bars-icon">◆</span>
      囚犯状态监测
      <span class="spirit-badge">{{ store.data.林秋禾.$精神状态 }}</span>
      <span class="attitude-badge">{{ store.data.林秋禾.$对审问者态度 }}</span>
    </div>

    <div class="bars-grid">
      <div v-for="bar in bars" :key="bar.label" class="bar-row">
        <span class="bar-label">{{ bar.icon }} {{ bar.label }}</span>
        <div class="bar-track">
          <div class="bar-fill" :class="bar.colorClass" :style="{ width: bar.percent + '%' }"></div>
        </div>
        <span class="bar-value" :class="bar.colorClass">{{ bar.display }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const bars = computed(() => {
  const d = store.data.林秋禾;
  return [
    {
      label: '疼痛度',
      icon: '▸',
      value: d.疼痛度,
      percent: d.疼痛度,
      display: d.疼痛度 + '%',
      colorClass: d.疼痛度 > 70 ? 'danger' : d.疼痛度 > 40 ? 'warn' : 'safe',
    },
    {
      label: '绝望度',
      icon: '▸',
      value: d.绝望度,
      percent: d.绝望度,
      display: d.绝望度 + '%',
      colorClass: d.绝望度 > 70 ? 'danger' : d.绝望度 > 40 ? 'warn' : 'safe',
    },
    {
      label: '好感度',
      icon: '▸',
      value: d.好感度,
      percent: (d.好感度 + 100) / 2,
      display: (d.好感度 > 0 ? '+' : '') + d.好感度,
      colorClass: d.好感度 > 20 ? 'positive' : d.好感度 > -20 ? 'neutral' : 'hostile',
    },
    {
      label: '恶心度',
      icon: '▸',
      value: d.恶心度,
      percent: d.恶心度,
      display: d.恶心度 + '%',
      colorClass: d.恶心度 > 70 ? 'danger' : d.恶心度 > 40 ? 'warn' : 'safe',
    },
    {
      label: '忠诚度',
      icon: '★',
      value: d.忠诚度,
      percent: d.忠诚度,
      display: d.忠诚度 + '%',
      colorClass: 'loyalty',
    },
    {
      label: '警觉度',
      icon: '▸',
      value: d.警觉度,
      percent: d.警觉度,
      display: d.警觉度 + '%',
      colorClass: d.警觉度 > 60 ? 'alert-high' : d.警觉度 > 30 ? 'warn' : 'safe',
    },
    {
      label: '体力值',
      icon: '▸',
      value: d.体力值,
      percent: d.体力值,
      display: d.体力值 + '%',
      colorClass: d.体力值 < 30 ? 'danger' : d.体力值 < 60 ? 'warn' : 'safe',
    },
    {
      label: '羞耻度',
      icon: '▸',
      value: d.羞耻度,
      percent: d.羞耻度,
      display: d.羞耻度 + '%',
      colorClass: d.羞耻度 > 70 ? 'danger' : d.羞耻度 > 40 ? 'warn' : 'safe',
    },
    {
      label: '信任度',
      icon: '▸',
      value: d.信任度,
      percent: (d.信任度 + 100) / 2,
      display: (d.信任度 > 0 ? '+' : '') + d.信任度,
      colorClass: d.信任度 > 20 ? 'positive' : d.信任度 > -20 ? 'neutral' : 'hostile',
    },
    {
      label: '求生意志',
      icon: '▸',
      value: d.求生意志,
      percent: d.求生意志,
      display: d.求生意志 + '%',
      colorClass: d.求生意志 < 30 ? 'danger' : d.求生意志 < 60 ? 'warn' : 'safe',
    },
  ];
});
</script>

<style lang="scss" scoped>
.status-bars {
  padding: 8px 12px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-section);
}

.bars-title {
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: bold;
  color: var(--c-text);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.bars-icon {
  color: var(--c-accent-red-bright);
}

.spirit-badge,
.attitude-badge {
  font-size: 10px;
  padding: 1px 6px;
  font-family: var(--font-main);
  letter-spacing: 1px;
}

.spirit-badge {
  background: var(--c-accent-red);
  color: var(--c-text-bright);
}

.attitude-badge {
  background: var(--c-accent-blue);
  color: var(--c-text-bright);
}

.bars-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-size: 11px;
  color: var(--c-text-dim);
  width: 72px;
  flex-shrink: 0;
  letter-spacing: 1px;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--c-border-light);
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 0.4s ease;
}

.bar-fill.safe {
  background: var(--c-accent-green);
}
.bar-fill.warn {
  background: var(--c-accent-amber);
}
.bar-fill.danger {
  background: var(--c-accent-red-bright);
}
.bar-fill.loyalty {
  background: linear-gradient(90deg, var(--c-accent-red), #d4444a);
}
.bar-fill.positive {
  background: var(--c-accent-green-bright);
}
.bar-fill.neutral {
  background: var(--c-accent-amber);
}
.bar-fill.hostile {
  background: var(--c-accent-red);
}
.bar-fill.alert-high {
  background: var(--c-accent-amber);
  box-shadow: 0 0 4px var(--c-accent-amber);
}

.bar-value {
  font-size: 11px;
  font-weight: bold;
  width: 40px;
  text-align: right;
  flex-shrink: 0;
}

.bar-value.safe {
  color: var(--c-accent-green-bright);
}
.bar-value.warn {
  color: var(--c-accent-amber);
}
.bar-value.danger {
  color: var(--c-accent-red-bright);
}
.bar-value.loyalty {
  color: var(--c-accent-red-bright);
}
.bar-value.positive {
  color: var(--c-accent-green-bright);
}
.bar-value.neutral {
  color: var(--c-accent-amber);
}
.bar-value.hostile {
  color: var(--c-accent-red-bright);
}
.bar-value.alert-high {
  color: var(--c-accent-amber);
}

@media (max-width: 500px) {
  .bar-label {
    width: 60px;
    font-size: 10px;
  }
}
</style>
