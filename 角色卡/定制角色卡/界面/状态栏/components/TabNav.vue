<template>
  <nav class="tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ active: model === tab.id }"
      :aria-expanded="model === tab.id"
      @click="toggleTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[];
}>();

const model = defineModel<string | null>({ required: true });

function toggleTab(id: string) {
  model.value = model.value === id ? null : id;
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  background: var(--c-bg-deep);
  border-bottom: 1px solid var(--c-border-accent);
}

.tab-button {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--c-text-dim);
  font-size: 0.88rem;
  font-weight: bold;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid var(--c-border);

  &:last-child { border-right: none; }
  &:hover { background: var(--c-bg-section); color: var(--c-text); }

  &.active {
    background: var(--c-bg-card);
    color: var(--c-text);
    border-bottom: 2px solid var(--c-accent-pink);
  }
}
</style>
