<template>
  <div class="world-section">
    <div class="meta-row">
      <span>📅 {{ store.data.世界.日期 }}</span>
      <span>🕐 {{ formatted_time }}</span>
      <span>📍 {{ store.data.世界.当前地点 }}</span>
    </div>
    <div class="event-list">
      <div v-for="(desc, name) in store.data.世界.近期事务" :key="name" class="event-badge">
        <span class="event-title">{{ name }}</span>
        <span class="event-desc">{{ desc }}</span>
      </div>
      <div v-if="_.isEmpty(store.data.世界.近期事务)" class="event-badge">
        <span class="event-title">暂无事务</span>
        <span class="event-desc">当前没有进行中的任务</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const formatted_time = computed(() => {
  const match = store.data.世界.当前时间.match(/(\d{2}:\d{2})/);
  return match ? match[1] : store.data.世界.当前时间.split(' ')[1] || '未知';
});
</script>

<style lang="scss" scoped>
.world-section {
  border-bottom: 1px solid var(--c-border);
  padding: 10px 12px;
  background: var(--c-bg-panel);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.82rem;
  color: var(--c-cyan);
  flex-wrap: wrap;
  gap: 6px;
}

.event-list {
  display: flex;
  gap: 6px;
  overflow-x: auto;
}

.event-badge {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  padding: 5px 8px;
  min-width: 120px;
  flex: 1;
  position: relative;
}

.event-badge::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--c-cyan);
}

.event-title {
  display: block;
  font-weight: bold;
  font-size: 0.78rem;
  padding-left: 6px;
  color: var(--c-text-bright);
}

.event-desc {
  display: block;
  font-size: 0.7rem;
  color: var(--c-text-dim);
  padding-left: 6px;
}

@media (max-width: 600px) {
  .meta-row {
    flex-direction: column;
  }
  .event-list {
    flex-direction: column;
  }
}
</style>
