<template>
  <div class="erosion-section">
    <div class="erosion-header">
      <span class="erosion-label">浊厄侵蚀</span>
      <span class="erosion-stage" :class="stageClass">{{ store.data.侵蚀度.$侵蚀阶段 }}</span>
    </div>
    <div class="erosion-bar-container">
      <div class="erosion-track">
        <div class="erosion-fill" :style="{ width: store.data.侵蚀度.当前值 + '%' }">
          <div class="erosion-glow"></div>
        </div>
        <div class="erosion-marks">
          <span v-for="i in 5" :key="i" class="mark" :style="{ left: i * 20 + '%' }"></span>
        </div>
      </div>
      <span class="erosion-value">{{ store.data.侵蚀度.当前值 }}%</span>
    </div>
    <div class="erosion-warning" v-if="store.data.侵蚀度.当前值 >= 70">⚠ 警告：侵蚀度过高，理智正在崩溃</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const stageClass = computed(() => {
  const value = store.data.侵蚀度.当前值;
  if (value < 30) return 'safe';
  if (value < 50) return 'warning';
  if (value < 70) return 'danger';
  return 'critical';
});
</script>

<style lang="scss" scoped>
.erosion-section {
  padding: 10px 12px;
  background: linear-gradient(90deg, rgba(107, 58, 107, 0.2) 0%, transparent 100%);
  border-bottom: 1px solid var(--c-shadow);
}

.erosion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.erosion-label {
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--c-corrupt);
  letter-spacing: 1px;
}

.erosion-stage {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 500;

  &.safe {
    background: rgba(100, 180, 100, 0.3);
    color: #8fd88f;
  }
  &.warning {
    background: rgba(180, 150, 50, 0.3);
    color: #d4a857;
  }
  &.danger {
    background: rgba(139, 41, 66, 0.4);
    color: #c94a7a;
  }
  &.critical {
    background: rgba(139, 41, 66, 0.6);
    color: #ff6b8a;
    animation: blink 1s infinite;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.erosion-bar-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.erosion-track {
  flex: 1;
  height: 12px;
  background: var(--c-void);
  border: 1px solid var(--c-shadow);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.erosion-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-corrupt), var(--c-blood));
  border-radius: 5px;
  position: relative;
  transition: width 0.5s ease;
}

.erosion-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
}

.erosion-marks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.mark {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.erosion-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--c-obsession);
  min-width: 40px;
  text-align: right;
}

.erosion-warning {
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--c-blood);
  text-align: center;
  animation: blink 1.5s infinite;
}
</style>
