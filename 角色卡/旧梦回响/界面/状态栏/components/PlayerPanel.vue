<template>
  <div class="player-layout">
    <div class="stat-row">
      <div class="stat-card">
        <span class="stat-label">力量体系</span>
        <span class="stat-value system">{{ store.data.主角.力量体系 }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">力量等级</span>
        <span class="stat-value level">{{ store.data.主角.力量等级 }}</span>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-card">
        <span class="stat-label">当前状态</span>
        <span class="stat-value">{{ store.data.主角.状态 }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">生命状况</span>
        <span class="stat-value" :class="healthClass">{{ store.data.主角.生命状况 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const healthClass = computed(() => {
  const h = store.data.主角.生命状况;
  if (h.includes('濒死') || h.includes('危险')) return 'danger';
  if (h.includes('重伤')) return 'warn';
  if (h.includes('轻伤')) return 'minor';
  return 'good';
});
</script>

<style lang="scss" scoped>
.player-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-card {
  background: var(--c-slate);
  border: 1px solid var(--c-border);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.65rem;
  color: var(--c-faint);
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-ghost);
}

.stat-value.system {
  color: var(--c-neon);
  text-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
}

.stat-value.level {
  color: var(--c-amber);
  text-shadow: 0 0 6px rgba(245, 158, 11, 0.3);
}

.stat-value.good {
  color: #34d399;
}

.stat-value.minor {
  color: var(--c-amber);
}

.stat-value.warn {
  color: #f97316;
}

.stat-value.danger {
  color: var(--c-warn);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 400px) {
  .stat-row {
    grid-template-columns: 1fr;
  }
}
</style>
