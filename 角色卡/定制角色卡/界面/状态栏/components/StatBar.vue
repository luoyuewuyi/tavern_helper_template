<template>
  <div class="stat-bar">
    <span class="bar-label">{{ props.label }}</span>
    <div class="bar-track">
      <div class="bar-fill" :style="{ width: percentage + '%', background: props.color }"></div>
    </div>
    <span class="bar-value">{{ props.value }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: number;
  max: number;
  color: string;
}>();

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)));
</script>

<style lang="scss" scoped>
.stat-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-size: 0.78rem;
  color: var(--c-text-dim);
  white-space: nowrap;
  min-width: 58px;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: var(--c-bg-deep);
  border-radius: 4px;
  border: 1px solid var(--c-border);
  overflow: hidden;
  position: relative;
}

.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 3px;
  transition: width 0.4s ease;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.1);
}

.bar-value {
  font-size: 0.78rem;
  font-weight: bold;
  color: var(--c-text);
  min-width: 28px;
  text-align: right;
}
</style>
