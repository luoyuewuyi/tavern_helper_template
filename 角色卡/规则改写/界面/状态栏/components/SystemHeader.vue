<template>
  <header class="system-header">
    <div class="title-block">
      <div class="crest">RW</div>
      <div>
        <div class="eyebrow">FORBIDDEN PROTOCOL / WORLD RULE REWRITER</div>
        <div class="title">世界规则改写器</div>
      </div>
    </div>

    <div class="status-block">
      <div class="pill online">SYSTEM ONLINE</div>
      <div class="pill stage">{{ stage }}</div>
      <div :class="['pill', riskClass]">{{ riskText }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  stage: string;
  risk: string;
}>();

const riskClass = computed(() => {
  if (props.risk.includes('极高')) {
    return 'risk-max';
  }
  if (props.risk.includes('高')) {
    return 'risk-high';
  }
  if (props.risk.includes('中')) {
    return 'risk-mid';
  }
  return 'risk-low';
});

const riskText = computed(() => `RISK ${props.risk}`);
</script>

<style lang="scss" scoped>
.system-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 18px;
}

.title-block {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.crest {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  border: 1px solid var(--rr-line-strong);
  background:
    linear-gradient(180deg, rgba(216, 176, 88, 0.24), rgba(123, 216, 230, 0.06)),
    rgba(13, 18, 25, 0.96);
  color: var(--rr-gold);
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  letter-spacing: 3px;
  box-shadow: 0 0 20px rgba(216, 176, 88, 0.12);
}

.eyebrow {
  color: var(--rr-text-faint);
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
}

.title {
  margin-top: 6px;
  color: var(--rr-text);
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: 3px;
}

.status-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.pill {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(123, 216, 230, 0.14);
  background: rgba(15, 21, 30, 0.84);
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--rr-text-soft);
}

.online {
  color: var(--rr-cyan);
  box-shadow: inset 0 0 0 1px rgba(123, 216, 230, 0.06);
}

.risk-low {
  color: var(--rr-cyan);
}

.risk-mid {
  color: var(--rr-gold);
}

.risk-high,
.risk-max {
  color: #ff8d9f;
  border-color: rgba(217, 72, 95, 0.2);
  box-shadow: 0 0 18px rgba(217, 72, 95, 0.12);
}

.risk-max {
  animation: pulse 1.8s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 14px rgba(217, 72, 95, 0.1);
  }
  50% {
    box-shadow: 0 0 24px rgba(217, 72, 95, 0.22);
  }
}

@media (max-width: 760px) {
  .system-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px;
  }

  .title {
    font-size: 20px;
    letter-spacing: 2px;
  }

  .status-block {
    justify-content: flex-start;
  }
}
</style>
