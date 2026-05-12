<template>
  <div class="meter">
    <div class="meter-top">
      <span>{{ label }}</span>
      <strong>{{ value }}</strong>
    </div>
    <div class="meter-track">
      <div class="meter-fill" :class="toneClass" :style="{ width: `${clampedValue}%` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: number;
  tone?: 'accent' | 'alert' | 'gold';
}>();

const clampedValue = computed(() => _.clamp(props.value, 0, 100));
const toneClass = computed(() => (props.tone ? `tone-${props.tone}` : 'tone-accent'));
</script>

<style scoped lang="scss">
.meter {
  display: grid;
  gap: 6px;
}

.meter-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  color: var(--ink-muted);
}

.meter-top strong {
  color: var(--ink-text);
  font-size: 14px;
}

.meter-track {
  height: 8px;
  background: rgba(79, 70, 57, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  border-radius: inherit;
  transition: width 0.35s ease;
}

.tone-accent {
  background: linear-gradient(90deg, var(--ink-accent-soft), var(--ink-accent));
}

.tone-alert {
  background: linear-gradient(90deg, #c57d65, var(--ink-alert));
}

.tone-gold {
  background: linear-gradient(90deg, #d8b56f, var(--ink-gold));
}
</style>
