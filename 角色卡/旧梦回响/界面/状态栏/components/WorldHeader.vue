<template>
  <div class="world-header">
    <div class="header-top">
      <span class="header-tag">LOCATION</span>
      <span class="header-scene">{{ store.data.世界状态.当前场景 }}</span>
    </div>
    <div class="header-meta">
      <span class="meta-item">
        <span class="meta-label">TIME</span>
        <span class="meta-value">{{ store.data.世界状态.当前时间 }}</span>
      </span>
    </div>
    <div class="header-event">
      <span class="event-label">EVENT //</span>
      <span class="event-text">{{ store.data.世界状态.事件摘要 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-header {
  padding: 10px 12px;
  background: linear-gradient(135deg, var(--c-slate) 0%, var(--c-deep) 100%);
  border-bottom: 1px solid var(--c-border);
  position: relative;
  overflow: hidden;
}

.world-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--c-neon), var(--c-mana), var(--c-neon));
  opacity: 0.7;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.header-tag {
  font-size: 0.65rem;
  color: var(--c-neon);
  letter-spacing: 2px;
  font-weight: 700;
  opacity: 0.8;
}

.header-scene {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.header-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label {
  font-size: 0.65rem;
  color: var(--c-faint);
  letter-spacing: 1px;
  font-weight: 600;
}

.meta-value {
  font-size: 0.85rem;
  color: var(--c-ghost);
  font-variant-numeric: tabular-nums;
}

.header-event {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(0, 240, 255, 0.15);
}

.event-label {
  font-size: 0.65rem;
  color: var(--c-mana);
  letter-spacing: 1px;
  font-weight: 700;
  white-space: nowrap;
}

.event-text {
  font-size: 0.82rem;
  color: var(--c-ghost);
  line-height: 1.3;
}
</style>
