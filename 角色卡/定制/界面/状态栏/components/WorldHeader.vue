<template>
  <div class="world-header">
    <!-- 第一行: 天气 时间 序号 -->
    <div class="top-row">
      <span class="weather">{{ store.data.世界.天气 }}</span>
      <span class="time">{{ store.data.世界.当前时间 }}</span>
      <span class="seq">#{{ store.data.世界.序号 }}</span>
    </div>

    <!-- 第二行: 地图信息 -->
    <div class="map-row">
      <span class="map-tag">🗺️ {{ store.data.世界.大地图 }}</span>
      <span class="map-divider">›</span>
      <span class="map-tag" :class="{ danger: store.data.世界.小地图 === '污染区' }">
        {{ store.data.世界.小地图 === '污染区' ? '☠️' : '🏛️' }} {{ store.data.世界.小地图 }}
      </span>
    </div>

    <!-- 建筑结构 -->
    <div v-if="!_.isEmpty(store.data.世界.建筑结构)" class="building-list">
      <div
        v-for="(desc, name) in store.data.世界.建筑结构"
        :key="name"
        class="building-item"
        :class="{ here: String(desc).includes('🛑') }"
      >
        <span class="building-name">{{ name }}</span>
        <span class="building-desc">{{ desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-header {
  padding: 10px 12px;
  background: linear-gradient(135deg, var(--bg-deep) 0%, var(--bg-section) 100%);
  border-bottom: 1px solid var(--border-main);
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.85rem;
  flex-wrap: wrap;
  gap: 4px;
}

.weather {
  font-weight: 600;
}

.time {
  color: var(--accent-blue);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.seq {
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.map-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 0.82rem;
}

.map-tag {
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid var(--border-main);
  font-weight: 600;
}

.map-tag.danger {
  border-color: var(--accent-red);
  color: var(--accent-red);
  background: rgba(192, 57, 43, 0.15);
}

.map-divider {
  color: var(--text-dim);
}

.building-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.building-item {
  background: var(--bg-card);
  border: 1px solid var(--border-main);
  padding: 3px 8px;
  font-size: 0.72rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: border-color 0.2s;
}

.building-item.here {
  border-color: var(--accent-gold);
  background: rgba(212, 160, 23, 0.1);
}

.building-name {
  font-weight: 600;
  color: var(--text-primary);
}

.building-desc {
  color: var(--text-dim);
  font-size: 0.68rem;
}
</style>
