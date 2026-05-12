<template>
  <div class="world-header">
    <div class="header-row">
      <span class="header-icon">🌙</span>
      <span class="header-title">关系竞争模拟</span>
      <span class="header-day">第 {{ store.data.世界.当前日 }} 天</span>
    </div>
    <div class="info-row">
      <span class="info-item">
        <i class="fa fa-clock-o"></i>
        {{ store.data.世界.当前时间 }}
      </span>
      <span class="info-item">
        <i class="fa fa-map-marker"></i>
        {{ store.data.世界.当前地点 }}
      </span>
    </div>
    <div v-if="store.data.当前互动角色 !== '无'" class="interact-tag">
      当前互动: <strong>{{ store.data.当前互动角色 }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-header {
  padding: 14px 16px 10px;
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(232, 62, 140, 0.1));
  border-bottom: 1px solid var(--c-border);
}

.header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.header-icon {
  font-size: 1.2em;
}

.header-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--c-accent-rose);
  letter-spacing: 1px;
}

.header-day {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--c-accent-gold);
  background: rgba(253, 203, 110, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(253, 203, 110, 0.2);
}

.info-row {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--c-text-secondary);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;

  i {
    font-size: 11px;
    color: var(--c-accent-purple);
  }
}

.interact-tag {
  margin-top: 6px;
  font-size: 11px;
  color: var(--c-accent-cyan);
  background: rgba(0, 206, 201, 0.08);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 206, 201, 0.15);
  display: inline-block;
}
</style>
