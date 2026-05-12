<template>
  <div class="world-section">
    <div class="header-bar">
      <span class="sys-tag">SYS://STATUS</span>
      <span class="sys-ver">v2.087</span>
    </div>
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">TIME</span>
        <span class="meta-value">{{ formatted_time }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">LOC</span>
        <span class="meta-value loc">{{ store.data.世界.当前地点 }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">W/E</span>
        <span class="meta-value weather">{{ store.data.世界.天气 }}</span>
      </div>
    </div>
    <div v-if="!_.isEmpty(store.data.世界.近期事件)" class="event-list">
      <div v-for="(desc, name) in store.data.世界.近期事件" :key="name" class="event-item">
        <span class="event-marker">▸</span>
        <span class="event-name">{{ name }}</span>
        <span class="event-desc">{{ desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const formatted_time = computed(() => {
  const t = store.data.世界.当前时间;
  const match = t.match(/(\d{4}-\d{2}-\d{2})\s*(\d{2}:\d{2})/);
  return match ? `${match[1]} ${match[2]}` : t;
});
</script>

<style lang="scss" scoped>
.world-section {
  border-bottom: 1px solid var(--cp-border);
  padding: 10px;
  background: var(--cp-bg-panel);
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--cp-border);
}

.sys-tag {
  font-family: var(--font-mono);
  color: var(--cp-cyan);
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.sys-ver {
  font-family: var(--font-mono);
  color: var(--cp-text-dim);
  font-size: 0.65rem;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  gap: 6px;
  align-items: baseline;
}

.meta-label {
  font-family: var(--font-mono);
  color: var(--cp-text-dim);
  font-size: 0.7rem;
  letter-spacing: 1px;

  &::after {
    content: ':';
  }
}

.meta-value {
  font-family: var(--font-mono);
  color: var(--cp-text-bright);
  font-size: 0.8rem;
}

.meta-value.loc {
  color: var(--cp-cyan);
}

.meta-value.weather {
  color: var(--cp-text);
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 3px 6px;
  background: rgba(0, 240, 255, 0.03);
  border-left: 2px solid var(--cp-cyan);
  font-size: 0.78rem;
}

.event-marker {
  color: var(--cp-cyan);
  font-size: 0.65rem;
}

.event-name {
  color: var(--cp-text-bright);
  font-weight: 600;
  white-space: nowrap;
}

.event-desc {
  color: var(--cp-text-dim);
  font-size: 0.72rem;
}

@media (max-width: 600px) {
  .meta-row {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
