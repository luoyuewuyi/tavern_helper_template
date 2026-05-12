<template>
  <div class="exp-bar-container">
    <div class="exp-info">
      <span class="level-badge">
        <span class="level-label">LV</span>
        <span class="level-value">{{ store.data.主角.等级 }}</span>
      </span>
      <span class="exp-text"> {{ store.data.主角.经验值 }} / {{ store.data.主角.经验上限 }} </span>
      <span class="points-badge" v-if="store.data.主角.可用属性点 > 0"> +{{ store.data.主角.可用属性点 }}PT </span>
      <span class="credits">
        <span class="credits-icon">◈</span>
        {{ store.data.主角.空间积分 }}
      </span>
    </div>
    <div class="exp-track">
      <div class="exp-fill" :style="{ width: expPercent + '%' }">
        <div class="exp-glow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const expPercent = computed(() => {
  const { 经验值, 经验上限 } = store.data.主角;
  return Math.min((经验值 / 经验上限) * 100, 100);
});
</script>

<style lang="scss" scoped>
.exp-bar-container {
  padding: 6px 12px 8px;
  border-bottom: 1px solid var(--border);
}

.exp-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 11px;
}

.level-badge {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.level-label {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--accent-cyan);
  letter-spacing: 1px;
}

.level-value {
  font-family: var(--font-data);
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-cyan);
  text-shadow: var(--glow-cyan);
}

.exp-text {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--text-secondary);
}

.points-badge {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--accent-amber);
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 1px 5px;
  border-radius: 2px;
  animation: pulse-glow 2s ease-in-out infinite;
}

.credits {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--accent-gold);
}

.credits-icon {
  font-size: 10px;
}

.exp-track {
  height: 4px;
  background: rgba(30, 58, 95, 0.4);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.exp-glow {
  position: absolute;
  right: 0;
  top: -2px;
  bottom: -2px;
  width: 20px;
  background: radial-gradient(ellipse at right, rgba(6, 182, 212, 0.6), transparent);
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
