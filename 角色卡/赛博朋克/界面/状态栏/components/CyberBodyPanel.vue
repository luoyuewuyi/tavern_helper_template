<template>
  <div class="cyber-body">
    <!-- 义体完整度 -->
    <div class="integrity-row">
      <span class="integrity-label">⚙ 义体完整度</span>
      <div class="integrity-track">
        <div class="integrity-fill" :class="integrityClass" :style="{ width: store.data.白荔.义体完整度 + '%' }"></div>
      </div>
      <span class="integrity-value" :class="integrityClass">{{ store.data.白荔.义体完整度 }}%</span>
    </div>

    <!-- 详细信息 -->
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">芯片状态</span>
        <span class="info-value" :class="chipClass">{{ store.data.白荔.服务芯片状态 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">情绪</span>
        <span class="info-value">{{ store.data.白荔.当前情绪 }}</span>
      </div>
      <div class="info-item full-width">
        <span class="info-label">身体状态</span>
        <span class="info-value body">{{ store.data.白荔.身体状态 }}</span>
      </div>
      <div class="info-item full-width">
        <span class="info-label">着装</span>
        <span class="info-value">{{ store.data.白荔.着装 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const integrityClass = computed(() => {
  const v = store.data.白荔.义体完整度;
  if (v <= 20) return 'critical';
  if (v <= 50) return 'damaged';
  if (v <= 75) return 'fair';
  return 'good';
});

const chipClass = computed(() => {
  const s = store.data.白荔.服务芯片状态;
  if (s === '活跃') return 'chip-active';
  if (s === '损坏') return 'chip-damaged';
  if (s === '已移除') return 'chip-removed';
  return 'chip-dormant';
});
</script>

<style lang="scss" scoped>
.cyber-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.integrity-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.integrity-label {
  font-family: var(--font-cyber);
  color: var(--cp-yellow);
  font-size: 0.78rem;
  font-weight: 600;
  min-width: 95px;
}

.integrity-track {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--cp-border);
  position: relative;
  overflow: hidden;
}

.integrity-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: width 0.4s ease;

  &.good {
    background: linear-gradient(90deg, rgba(57, 255, 20, 0.6), var(--cp-green));
    box-shadow: 0 0 6px rgba(57, 255, 20, 0.3);
  }
  &.fair {
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.6), var(--cp-yellow));
    box-shadow: 0 0 6px rgba(255, 215, 0, 0.3);
  }
  &.damaged {
    background: linear-gradient(90deg, rgba(255, 107, 53, 0.6), #ff6b35);
    box-shadow: 0 0 6px rgba(255, 107, 53, 0.3);
  }
  &.critical {
    background: linear-gradient(90deg, rgba(255, 51, 51, 0.6), var(--cp-red));
    box-shadow: 0 0 6px rgba(255, 51, 51, 0.3);
    animation: criticalPulse 1.5s infinite;
  }
}

@keyframes criticalPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.integrity-value {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  min-width: 36px;
  text-align: right;

  &.good {
    color: var(--cp-green);
  }
  &.fair {
    color: var(--cp-yellow);
  }
  &.damaged {
    color: #ff6b35;
  }
  &.critical {
    color: var(--cp-red);
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.info-item {
  background: var(--cp-bg-card);
  border: 1px solid var(--cp-border);
  padding: 6px 8px;

  &.full-width {
    grid-column: 1 / -1;
  }
}

.info-label {
  display: block;
  font-family: var(--font-mono);
  color: var(--cp-text-dim);
  font-size: 0.65rem;
  letter-spacing: 1px;
  margin-bottom: 3px;
  text-transform: uppercase;
}

.info-value {
  font-family: var(--font-cyber);
  color: var(--cp-text-bright);
  font-size: 0.78rem;

  &.chip-active {
    color: var(--cp-red);
    text-shadow: 0 0 4px rgba(255, 51, 51, 0.5);
  }
  &.chip-dormant {
    color: var(--cp-yellow);
  }
  &.chip-damaged {
    color: #ff6b35;
  }
  &.chip-removed {
    color: var(--cp-green);
  }
  &.body {
    color: var(--cp-text);
  }
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item.full-width {
    grid-column: auto;
  }
}
</style>
