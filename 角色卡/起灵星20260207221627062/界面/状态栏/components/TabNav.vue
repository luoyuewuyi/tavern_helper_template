<template>
  <div class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: modelValue === tab.id }"
      @click="$emit('update:modelValue', modelValue === tab.id ? null : tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | null;
  tabs: { id: string; label: string }[];
}>();

defineEmits<{
  'update:modelValue': [value: string | null];
}>();
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-deep);
}

.tab-btn {
  flex: 1;
  padding: 10px 8px;
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-size: 12px;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.25s ease;
  border-bottom: 2px solid transparent;
  letter-spacing: 0.5px;

  &:hover {
    color: var(--c-text);
    background: rgba(180, 140, 255, 0.05);
  }

  &.active {
    color: var(--c-primary);
    border-bottom-color: var(--c-primary);
    background: rgba(180, 140, 255, 0.08);
    font-weight: 600;
  }
}
</style>
