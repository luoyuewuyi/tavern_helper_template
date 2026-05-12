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
  tabs: { id: string; label: string; icon?: string }[];
  modelValue: string | null;
}>();

defineEmits<{
  'update:modelValue': [value: string | null];
}>();
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-btn {
  flex: 1;
  min-width: 0;
  padding: 7px 4px;
  font-size: 11px;
  font-family: var(--font-hud);
  font-weight: 600;
  color: var(--text-dim);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  text-align: center;

  &:hover {
    color: var(--text-secondary);
    background: rgba(6, 182, 212, 0.03);
  }

  &.active {
    color: var(--accent-cyan);
    border-bottom-color: var(--accent-cyan);
    background: rgba(6, 182, 212, 0.05);
    text-shadow: var(--glow-cyan);
  }
}
</style>
