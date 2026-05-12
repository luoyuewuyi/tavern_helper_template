<template>
  <article class="cluster-card" :class="accentClass">
    <div class="cluster-head">
      <span class="cluster-title">{{ title }}</span>
      <span class="cluster-value">{{ value }}</span>
    </div>
    <div class="track">
      <div class="fill" :style="{ width: safeValue + '%' }"></div>
    </div>
    <p class="cluster-summary">{{ summary }}</p>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: number;
  summary: string;
  accent: 'progress' | 'sanity' | 'alert' | 'clue';
}>();

const safeValue = computed(() => Math.max(0, Math.min(100, props.value)));
const accentClass = computed(() => `accent-${props.accent}`);
</script>

<style scoped>
.cluster-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(231, 198, 145, 0.12);
  background: rgba(255, 255, 255, 0.035);
}

.cluster-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.cluster-title {
  color: var(--hyp-soft);
  letter-spacing: 0.12em;
  font-size: 13px;
}

.cluster-value {
  font-size: 24px;
  color: var(--hyp-text);
}

.track {
  margin-top: 12px;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.fill {
  height: 100%;
  border-radius: inherit;
}

.cluster-summary {
  margin: 12px 0 0;
  font-size: 12px;
  color: var(--hyp-faint);
  line-height: 1.75;
}

.accent-progress .fill {
  background: linear-gradient(90deg, #f2c37f, #cc6a5b);
}

.accent-sanity .fill {
  background: linear-gradient(90deg, #92d7d0, #4aa4c6);
}

.accent-alert .fill {
  background: linear-gradient(90deg, #f6c66b, #f08b4b);
}

.accent-clue .fill {
  background: linear-gradient(90deg, #d38ca6, #8d4569);
}
</style>
