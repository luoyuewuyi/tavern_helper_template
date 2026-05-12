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
  'update:modelValue': [val: string | null];
}>();

function toggle(id: string) {
  emit('update:modelValue', props.modelValue === id ? null : id);
}
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--cp-border);
  background: var(--cp-bg-panel);
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: var(--cp-text-dim);
  font-family: var(--font-cyber);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  letter-spacing: 0.5px;

  &:hover {
    color: var(--cp-text);
    background: rgba(0, 240, 255, 0.03);
  }

  &.active {
    color: var(--cp-cyan);
    background: rgba(0, 240, 255, 0.06);

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 10%;
      right: 10%;
      height: 2px;
      background: var(--cp-cyan);
      box-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
    }
  }
}
</style>
