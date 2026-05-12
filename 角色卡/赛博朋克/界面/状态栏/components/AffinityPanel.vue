<template>
  <div class="affinity-panel">
    <!-- 关系阶段标签 -->
    <div class="stage-row">
      <span class="stage-label">BOND</span>
      <span class="stage-value" :class="stageClass">{{ store.data.白荔.$关系阶段 }}</span>
      <span class="danger-tag" :class="dangerClass">{{ store.data.白荔.$危险等级 }}</span>
    </div>

    <!-- 好感度 -->
    <div class="bar-row">
      <span class="bar-label cyan">❤ 好感</span>
      <div class="bar-track">
        <div class="bar-fill cyan" :style="{ width: store.data.白荔.好感度 + '%' }"></div>
      </div>
      <span class="bar-value cyan">{{ store.data.白荔.好感度 }}</span>
    </div>

    <!-- 绝望值 -->
    <div class="bar-row">
      <span class="bar-label red">☠ 绝望</span>
      <div class="bar-track">
        <div class="bar-fill red" :style="{ width: store.data.白荔.绝望值 + '%' }"></div>
      </div>
      <span class="bar-value red">{{ store.data.白荔.绝望值 }}</span>
    </div>

    <!-- 病娇值 -->
    <div class="bar-row">
      <span class="bar-label magenta">♦ 病娇</span>
      <div class="bar-track">
        <div class="bar-fill magenta" :style="{ width: store.data.白荔.病娇值 + '%' }"></div>
      </div>
      <span class="bar-value magenta">{{ store.data.白荔.病娇值 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const stageClass = computed(() => {
  const stage = store.data.白荔.$关系阶段;
  if (stage === '戒备排斥') return 'stage-hostile';
  if (stage === '试探接触') return 'stage-cautious';
  if (stage === '依赖形成') return 'stage-attached';
  if (stage === '病态依恋') return 'stage-obsessed';
  return 'stage-redeemed';
});

const dangerClass = computed(() => {
  const level = store.data.白荔.$危险等级;
  if (level === '极度危险') return 'danger-critical';
  if (level === '高危') return 'danger-high';
  if (level === '警戒') return 'danger-warn';
  if (level === '低危') return 'danger-low';
  return 'danger-safe';
});
</script>

<style lang="scss" scoped>
.affinity-panel {
  padding: 10px;
  background: var(--cp-bg-panel);
  border-bottom: 1px solid var(--cp-border);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stage-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.stage-label {
  font-family: var(--font-mono);
  color: var(--cp-text-dim);
  font-size: 0.7rem;
  letter-spacing: 1px;

  &::after {
    content: ':';
  }
}

.stage-value {
  font-family: var(--font-cyber);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 1px;

  &.stage-hostile {
    color: var(--cp-red);
    text-shadow: 0 0 6px rgba(255, 51, 51, 0.4);
  }
  &.stage-cautious {
    color: #ff8c00;
    text-shadow: 0 0 6px rgba(255, 140, 0, 0.4);
  }
  &.stage-attached {
    color: var(--cp-cyan);
    text-shadow: 0 0 6px rgba(0, 240, 255, 0.4);
  }
  &.stage-obsessed {
    color: var(--cp-magenta);
    text-shadow: 0 0 6px rgba(255, 45, 120, 0.4);
  }
  &.stage-redeemed {
    color: var(--cp-green);
    text-shadow: 0 0 6px rgba(57, 255, 20, 0.4);
  }
}

.danger-tag {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 1px 6px;
  border: 1px solid;
  letter-spacing: 1px;

  &.danger-critical {
    color: var(--cp-red);
    border-color: var(--cp-red);
    background: rgba(255, 51, 51, 0.1);
    animation: dangerBlink 1s infinite;
  }
  &.danger-high {
    color: #ff6b35;
    border-color: #ff6b35;
    background: rgba(255, 107, 53, 0.08);
  }
  &.danger-warn {
    color: var(--cp-yellow);
    border-color: var(--cp-yellow);
    background: rgba(255, 215, 0, 0.06);
  }
  &.danger-low {
    color: var(--cp-text-dim);
    border-color: var(--cp-border);
  }
  &.danger-safe {
    color: var(--cp-green);
    border-color: var(--cp-green);
    background: rgba(57, 255, 20, 0.06);
  }
}

@keyframes dangerBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-family: var(--font-cyber);
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 58px;

  &.cyan {
    color: var(--cp-cyan);
  }
  &.red {
    color: var(--cp-red);
  }
  &.magenta {
    color: var(--cp-magenta);
  }
}

.bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--cp-border);
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: width 0.4s ease;

  &.cyan {
    background: linear-gradient(90deg, rgba(0, 240, 255, 0.6), var(--cp-cyan));
    box-shadow: 0 0 6px rgba(0, 240, 255, 0.3);
  }
  &.red {
    background: linear-gradient(90deg, rgba(255, 51, 51, 0.6), var(--cp-red));
    box-shadow: 0 0 6px rgba(255, 51, 51, 0.3);
  }
  &.magenta {
    background: linear-gradient(90deg, rgba(255, 45, 120, 0.6), var(--cp-magenta));
    box-shadow: 0 0 6px rgba(255, 45, 120, 0.3);
  }
}

.bar-value {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  min-width: 28px;
  text-align: right;

  &.cyan {
    color: var(--cp-cyan);
  }
  &.red {
    color: var(--cp-red);
  }
  &.magenta {
    color: var(--cp-magenta);
  }
}
</style>
