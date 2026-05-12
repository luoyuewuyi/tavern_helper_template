<template>
  <div class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: modelValue === tab.id }"
      @click="toggle(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null;
  tabs: { id: string; label: string }[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

function toggle(id: string) {
  emit('update:modelValue', props.modelValue === id ? null : id);
}
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-deep);
}

.tab-btn {
  flex: 1;
  padding: 8px 4px;
  background: none;
  border: none;
  color: var(--c-text-muted);
  font-family: var(--font-main);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  white-space: nowrap;

  &:hover {
    color: var(--c-text-secondary);
    background: var(--c-bg-panel);
  }

  &.active {
    color: var(--c-accent-gold);
    border-bottom-color: var(--c-accent-gold);
    background: var(--c-bg-panel);
  }
}
</style>
