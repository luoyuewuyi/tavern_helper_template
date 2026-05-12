<template>
  <div class="world-section">
    <!-- 顶部王座标题栏 -->
    <div class="throne-bar">
      <span class="throne-icon">👑</span>
      <span class="throne-text">铁王座: {{ store.data.世界.铁王座 }}</span>
    </div>

    <!-- 时间/季节/地点信息 -->
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">📅</span>
        <span>{{ store.data.世界.当前时间 }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">🌤</span>
        <span>{{ store.data.世界.当前季节 }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">📍</span>
        <span>{{ store.data.世界.当前地点 }}</span>
      </div>
    </div>

    <!-- 当前局势 -->
    <div class="situation-bar">
      <span class="situation-label">⚔ 局势</span>
      <span class="situation-text">{{ store.data.世界.当前局势 }}</span>
    </div>

    <!-- 近期事件 -->
    <div class="event-list">
      <div v-for="(description, name) in store.data.世界.近期事件" :key="name" class="event-badge">
        <span class="event-title">{{ name }}</span>
        <span class="event-desc">{{ description }}</span>
      </div>
      <div v-if="_.isEmpty(store.data.世界.近期事件)" class="event-badge">
        <span class="event-title">暂无消息</span>
        <span class="event-desc">维斯特洛暂时一片平静...</span>
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
.world-section {
  padding: 10px;
  background: linear-gradient(180deg, var(--c-iron) 0%, var(--c-obsidian) 100%);
}

.throne-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: linear-gradient(90deg, rgba(201, 168, 76, 0.2) 0%, transparent 100%);
  border-left: 3px solid var(--c-gold);
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.throne-icon {
  font-size: 1rem;
}

.throne-text {
  color: var(--c-gold);
  font-weight: bold;
  letter-spacing: 1px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.82rem;
  border-bottom: 1px dashed var(--c-steel);
  padding-bottom: 6px;
  flex-wrap: wrap;
  gap: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-label {
  font-size: 0.8rem;
}

.situation-bar {
  padding: 5px 8px;
  background: rgba(139, 37, 0, 0.15);
  border-left: 2px solid var(--c-blood);
  margin-bottom: 8px;
  font-size: 0.8rem;
  line-height: 1.3;
}

.situation-label {
  color: var(--c-fire);
  font-weight: bold;
  margin-right: 6px;
}

.situation-text {
  color: var(--c-parchment);
}

.event-list {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.event-badge {
  background: rgba(74, 74, 106, 0.3);
  border: 1px solid var(--c-steel);
  padding: 6px 8px;
  min-width: 130px;
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
  background: var(--c-gold);
}

.event-title {
  display: block;
  font-weight: bold;
  margin-bottom: 2px;
  padding-left: 6px;
  color: var(--c-gold);
  font-size: 0.78rem;
}

.event-desc {
  display: block;
  font-size: 0.72rem;
  color: var(--c-silver);
  padding-left: 6px;
}

@media (max-width: 600px) {
  .meta-row {
    flex-direction: column;
    gap: 4px;
  }

  .event-list {
    flex-direction: column;
  }

  .event-badge {
    min-width: auto;
  }
}
</style>
