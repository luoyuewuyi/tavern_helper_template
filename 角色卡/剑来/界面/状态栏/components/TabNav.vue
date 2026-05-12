<template>
  <div class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: modelValue === tab.id }"
      type="button"
      @click.stop="toggle(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[];
  modelValue: string | null;
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
  border-bottom: 1px solid var(--jl-gold-light);
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: var(--jl-paper-dark);
  color: var(--jl-ink-faint);
  font-family: var(--font-body);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;

  &:not(:last-child) {
    border-right: 1px solid var(--jl-gold-light);
  }

  &:hover {
    background: var(--jl-paper);
    color: var(--jl-ink);
  }

  &.active {
    background: var(--jl-paper);
    color: var(--jl-ink);
    font-weight: 700;
    border-bottom-color: var(--jl-gold);
  }
}
</style>
