<template>
  <section class="target-panel">
    <div class="section-head">
      <span class="section-title">TARGET DOSSIER</span>
      <span class="section-subtitle">当前锁定对象</span>
    </div>

    <div class="target-name">{{ target }}</div>
    <div class="identity">{{ identity }}</div>

    <div class="status-stack">
      <div class="status-card">
        <span class="card-label">推进阶段</span>
        <span class="card-value">{{ stage }}</span>
      </div>
      <div class="status-card">
        <span class="card-label">风险警示</span>
        <span :class="['card-value', riskClass]">{{ risk }}</span>
      </div>
    </div>

    <div class="advice">
      <div class="advice-title">控制建议</div>
      <div class="advice-body">
        维持单目标观察视角，优先放大当前最显著的异常反馈，再决定是否叠加下一条规则。
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  target: string;
  identity: string;
  stage: string;
  risk: string;
}>();

const riskClass = computed(() => {
  if (props.risk.includes('极高') || props.risk.includes('高')) {
    return 'alert';
  }
  if (props.risk.includes('中')) {
    return 'warn';
  }
  return 'safe';
});
</script>

<style lang="scss" scoped>
.target-panel {
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(216, 176, 88, 0.14);
  background:
    linear-gradient(180deg, rgba(29, 21, 14, 0.58), rgba(14, 18, 25, 0.92)),
    rgba(16, 20, 28, 0.94);
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
}

.section-title {
  color: var(--rr-gold);
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  letter-spacing: 2px;
}

.section-subtitle {
  color: var(--rr-text-faint);
  font-size: 12px;
}

.target-name {
  color: var(--rr-text);
  font-size: 26px;
  line-height: 1.2;
  font-weight: 700;
}

.identity {
  margin-top: 8px;
  color: var(--rr-text-soft);
  font-size: 14px;
  line-height: 1.6;
}

.status-stack {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.status-card {
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid rgba(123, 216, 230, 0.12);
  background: rgba(11, 15, 20, 0.58);
}

.card-label {
  display: block;
  color: var(--rr-text-faint);
  font-size: 11px;
  letter-spacing: 1px;
}

.card-value {
  display: block;
  margin-top: 8px;
  color: var(--rr-text);
  font-size: 15px;
  line-height: 1.5;
}

.safe {
  color: var(--rr-cyan);
}

.warn {
  color: var(--rr-gold);
}

.alert {
  color: #ff93a3;
}

.advice {
  margin-top: 18px;
  padding: 14px;
  border-radius: 18px;
  border: 1px dashed rgba(216, 176, 88, 0.2);
  background: rgba(255, 255, 255, 0.02);
}

.advice-title {
  color: var(--rr-gold);
  font-size: 12px;
  letter-spacing: 2px;
}

.advice-body {
  margin-top: 10px;
  color: var(--rr-text-soft);
  font-size: 13px;
  line-height: 1.7;
}
</style>
