<template>
  <div class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: modelValue === tab.id }"
      @click="$emit('update:modelValue', modelValue === tab.id ? null : tab.id)"
    >
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
      <span v-if="modelValue === tab.id" class="tab-indicator"></span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { id: string; label: string; icon: string }[];
  modelValue: string | null;
}>();

defineEmits<{
  'update:modelValue': [value: string | null];
}>();
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-card);
  gap: 2px;
  padding: 0 8px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
  position: relative;
  transition: all 0.25s ease;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &:hover {
    color: var(--c-text-secondary);
    background: var(--c-bg-hover);
  }

  &.active {
    color: var(--c-cyan);

    .tab-icon {
      filter: drop-shadow(0 0 4px var(--c-cyan));
    }
  }
}

.tab-icon {
  font-size: 0.9rem;
  transition: filter 0.25s ease;
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--c-cyan);
  box-shadow: 0 0 8px var(--c-cyan);
  border-radius: 1px;
}
</style>
