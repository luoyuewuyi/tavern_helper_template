<template>
  <div class="stats-bar">
    <div class="stat-item">
      <div class="stat-label">💰 资金</div>
      <div class="stat-value money">{{ formatMoney(store.data.主角.资金) }}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">⭐ 声望</div>
      <div class="stat-bar-wrap">
        <div class="stat-bar fame" :style="{ width: store.data.主角.声望 + '%' }"></div>
      </div>
      <div class="stat-num">{{ store.data.主角.声望 }}/100</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">💪 体力</div>
      <div class="stat-bar-wrap">
        <div class="stat-bar stamina" :style="{ width: store.data.主角.体力 + '%' }" :class="staminaClass"></div>
      </div>
      <div class="stat-num">{{ store.data.主角.体力 }}/100</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();

function formatMoney(val: number): string {
  if (val >= 10000) return (val / 10000).toFixed(1) + '亿円';
  if (val >= 100) return (val / 100).toFixed(1) + '百万円';
  return val + '万円';
}

const staminaClass = computed(() => {
  const v = store.data.主角.体力;
  if (v <= 10) return 'critical';
  if (v <= 30) return 'low';
  return '';
});
</script>

<style lang="scss" scoped>
.stats-bar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--c-border);
}

.stat-item {
  flex: 1;
  padding: 8px 10px;
  border-right: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 4px;
  &:last-child {
    border-right: none;
  }
}

.stat-label {
  font-size: 0.72rem;
  color: var(--c-text-muted);
  font-weight: 600;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 700;
}
.stat-value.money {
  color: var(--c-accent-gold);
}

.stat-bar-wrap {
  height: 6px;
  background: var(--c-bg-deep);
  border-radius: 3px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}
.stat-bar.fame {
  background: linear-gradient(90deg, var(--c-accent-purple), var(--c-accent-blue));
}
.stat-bar.stamina {
  background: linear-gradient(90deg, #2ea043, var(--c-accent-green));
}
.stat-bar.stamina.low {
  background: linear-gradient(90deg, #d29922, #e3b341);
}
.stat-bar.stamina.critical {
  background: linear-gradient(90deg, #da3633, var(--c-accent-red));
  animation: pulse 1.2s infinite;
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

.stat-num {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--c-text-secondary);
  text-align: right;
}
</style>
