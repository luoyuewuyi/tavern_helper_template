<template>
  <div class="info-header">
    <div class="meta-row">
      <span class="meta-item">📅 {{ store.data.当前日期 }}</span>
      <span class="meta-item">⏰ {{ store.data.当前时间 }}</span>
    </div>
    <div class="meta-row">
      <span class="meta-item">🗺️ {{ store.data.当前场景 }}</span>
      <span class="meta-item">🛤️ {{ store.data.时间线 }}</span>
      <span class="meta-item route" :class="store.data.路线 === '绿母' ? 'ntr' : 'pure'">
        🎭 {{ store.data.路线 }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.info-header {
  padding: 10px 12px;
  background: linear-gradient(135deg, var(--c-bg-deep), var(--c-bg-section));
  border-bottom: 1px solid var(--c-border-accent);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;

  &:last-child { margin-bottom: 0; }
}

.meta-item {
  font-size: 0.82rem;
  color: var(--c-text-dim);
  white-space: nowrap;
}

.route {
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.78rem;

  &.pure { color: var(--c-accent-pink); border: 1px solid var(--c-accent-pink); }
  &.ntr { color: var(--c-bar-ntr); border: 1px solid var(--c-bar-ntr); }
}
</style>
