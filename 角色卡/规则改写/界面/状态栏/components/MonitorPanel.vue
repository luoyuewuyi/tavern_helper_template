<template>
  <section class="monitor-panel">
    <div class="section-head">
      <span class="section-title">RULE MONITOR</span>
      <span class="section-subtitle">覆写结果实时摘要</span>
    </div>

    <div class="rule-area">
      <div class="area-title">已生效规则</div>
      <div class="rule-list">
        <span v-for="rule in rules" :key="rule" class="rule-chip">{{ rule }}</span>
      </div>
    </div>

    <div class="state-grid">
      <div class="state-card cognition">
        <div class="state-label">认知变化</div>
        <div class="state-value">{{ cognition }}</div>
      </div>
      <div class="state-card body">
        <div class="state-label">身体变化</div>
        <div class="state-value">{{ body }}</div>
      </div>
      <div class="state-card social">
        <div class="state-label">社会变化</div>
        <div class="state-value">{{ social }}</div>
      </div>
    </div>

    <details class="next-panel">
      <summary>下一步建议</summary>
      <div class="next-body">{{ next }}</div>
    </details>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  rules: string[];
  cognition: string;
  body: string;
  social: string;
  next: string;
}>();
</script>

<style lang="scss" scoped>
.monitor-panel {
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(123, 216, 230, 0.14);
  background:
    linear-gradient(180deg, rgba(18, 24, 34, 0.96), rgba(11, 15, 20, 0.94)),
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
  color: var(--rr-cyan);
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  letter-spacing: 2px;
}

.section-subtitle {
  color: var(--rr-text-faint);
  font-size: 12px;
}

.rule-area {
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(123, 216, 230, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.area-title {
  color: var(--rr-text-soft);
  font-size: 12px;
  letter-spacing: 1px;
}

.rule-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.rule-chip {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(216, 176, 88, 0.16);
  background:
    linear-gradient(180deg, rgba(216, 176, 88, 0.12), rgba(123, 216, 230, 0.05)),
    rgba(13, 18, 25, 0.9);
  color: var(--rr-text);
  font-size: 12px;
  line-height: 1.4;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.state-card {
  min-width: 0;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(9, 13, 19, 0.62);
}

.state-card.cognition {
  box-shadow: inset 0 0 0 1px rgba(123, 216, 230, 0.05);
}

.state-card.body {
  box-shadow: inset 0 0 0 1px rgba(216, 176, 88, 0.05);
}

.state-card.social {
  box-shadow: inset 0 0 0 1px rgba(217, 72, 95, 0.05);
}

.state-label {
  color: var(--rr-text-faint);
  font-size: 12px;
  letter-spacing: 1px;
}

.state-value {
  margin-top: 10px;
  color: var(--rr-text);
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.next-panel {
  margin-top: 16px;
  border-radius: 18px;
  border: 1px solid rgba(217, 72, 95, 0.12);
  background: rgba(217, 72, 95, 0.05);
  overflow: hidden;
}

.next-panel summary {
  padding: 14px 16px;
  cursor: pointer;
  list-style: none;
  color: #ffc4cf;
  font-size: 13px;
  letter-spacing: 1px;
}

.next-panel summary::-webkit-details-marker {
  display: none;
}

.next-body {
  padding: 0 16px 16px;
  color: var(--rr-text-soft);
  font-size: 14px;
  line-height: 1.7;
}

@media (max-width: 760px) {
  .state-grid {
    grid-template-columns: 1fr;
  }
}
</style>
