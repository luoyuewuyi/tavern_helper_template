<template>
  <nav class="tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ active: model === tab.id }"
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
  background: var(--c-bg-panel);
  border-bottom: 1px solid var(--c-cyan-dim);
}

.tab-button {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--c-text-dim);
  font-size: 0.85rem;
  font-weight: bold;
  font-family: var(--font-prts);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
  border-right: 1px solid var(--c-border);
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background: var(--c-bg-card);
  color: var(--c-cyan);
}

.tab-button.active {
  background: var(--c-bg-dark);
  color: var(--c-cyan);
  border-bottom: 2px solid var(--c-cyan);
  position: relative;
}
</style>
