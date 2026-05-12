<template>
  <nav class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: modelValue === tab.id }"
      type="button"
      @click="$emit('update:modelValue', modelValue === tab.id ? null : tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
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
}

.tab-btn {
  flex: 1;
  padding: 10px 8px;
  background: none;
  border: none;
  color: var(--c-text-secondary);
  font-family: var(--font-main);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    color: var(--c-text-primary);
    background: rgba(155, 89, 182, 0.08);
  }

  &.active {
    color: var(--c-accent-pink);

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 15%;
      right: 15%;
      height: 2px;
      background: var(--c-accent-pink);
      border-radius: 1px;
    }
  }

  & + & {
    border-left: 1px solid var(--c-border);
  }
}
</style>
