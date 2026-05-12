<template>
  <article class="body-card">
    <div class="body-label">{{ label }}</div>
    <div class="body-value">{{ value }}</div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>

<style scoped>
.body-card {
  min-height: 108px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(231, 198, 145, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    rgba(11, 12, 18, 0.44);
}

.body-label {
  color: var(--hyp-faint);
  letter-spacing: 0.18em;
  font-size: 12px;
}

.body-value {
  margin-top: 14px;
  color: var(--hyp-text);
  font-size: 18px;
  line-height: 1.5;
}
</style>
