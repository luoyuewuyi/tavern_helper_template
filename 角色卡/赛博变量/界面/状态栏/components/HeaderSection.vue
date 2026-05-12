<template>
  <div class="header-section">
    <!-- 系统状态行 -->
    <div class="system-bar">
      <span class="sys-label">系统://</span>
      <span class="sys-time">{{ formatted_date }} {{ formatted_time }}</span>
      <span class="sys-divider">|</span>
      <span class="sys-layer" :class="layerClass">{{ store.data.世界.所在阶层 }}</span>
    </div>

    <!-- 地点显示 -->
    <div class="location-bar">
      <span class="loc-prefix">地点://</span>
      <span class="loc-text">{{ store.data.世界.当前地点 }}</span>
    </div>

    <!-- 事务列表 -->
    <div class="mission-list">
      <div class="mission-header">
        <span class="mission-icon">[!]</span>
        <span>进行中事务</span>
      </div>
      <div class="mission-items">
        <div v-for="(desc, name) in store.data.世界.近期事务" :key="name" class="mission-item">
          <span class="mission-name">&gt; {{ name }}</span>
          <span class="mission-desc">{{ desc }}</span>
        </div>
        <div v-if="_.isEmpty(store.data.世界.近期事务)" class="mission-item empty">
          <span class="mission-name">&gt; NULL</span>
          <span class="mission-desc">暂无事务</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const formatted_date = computed(() => {
  const match = store.data.世界.当前时间.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : store.data.世界.当前时间.split(' ')[0] || '----/--/--';
});

const formatted_time = computed(() => {
  const match = store.data.世界.当前时间.match(/(\d{2}:\d{2})/);
  return match ? match[1] : store.data.世界.当前时间.split(' ')[1] || '--:--';
});

const layerClass = computed(() => {
  const layer = store.data.世界.所在阶层;
  if (layer === '上层区') return 'layer-upper';
  if (layer === '中层区') return 'layer-middle';
  if (layer === '下层区') return 'layer-lower';
  return 'layer-outskirts';
});
</script>

<style lang="scss" scoped>
.header-section {
  background: var(--c-bg-dark);
  border-bottom: 1px solid var(--c-cyan);
  padding: 10px 12px;
}

.system-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.sys-label {
  color: var(--c-cyan);
  text-shadow: var(--glow-cyan);
}

.sys-time {
  color: var(--c-text);
  font-weight: bold;
}

.sys-divider {
  color: var(--c-text-dim);
}

.sys-layer {
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid;
}

.layer-upper {
  color: var(--c-magenta);
  border-color: var(--c-magenta);
  text-shadow: var(--glow-magenta);
}

.layer-middle {
  color: var(--c-cyan);
  border-color: var(--c-cyan);
  text-shadow: var(--glow-cyan);
}

.layer-lower {
  color: var(--c-yellow);
  border-color: var(--c-yellow);
}

.layer-outskirts {
  color: var(--c-red);
  border-color: var(--c-red);
  text-shadow: var(--glow-red);
}

.location-bar {
  display: flex;
  gap: 6px;
  font-size: 0.8rem;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--c-border);
}

.loc-prefix {
  color: var(--c-green);
}

.loc-text {
  color: var(--c-text);
}

.mission-list {
  background: rgba(0, 240, 255, 0.03);
  border: 1px solid var(--c-border);
  padding: 8px;
}

.mission-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-yellow);
  font-size: 0.75rem;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.mission-icon {
  animation: neonPulse 1.5s ease-in-out infinite;
}

.mission-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mission-item {
  display: flex;
  flex-direction: column;
  padding: 4px 8px;
  border-left: 2px solid var(--c-cyan);
  background: rgba(0, 0, 0, 0.3);
}

.mission-item.empty {
  border-left-color: var(--c-text-dim);
  opacity: 0.6;
}

.mission-name {
  color: var(--c-cyan);
  font-size: 0.8rem;
  font-weight: bold;
}

.mission-desc {
  color: var(--c-text-dim);
  font-size: 0.72rem;
  margin-top: 2px;
}
</style>
