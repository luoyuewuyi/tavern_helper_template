<template>
  <nav class="tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-btn"
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
  background: var(--bg-deep);
  border-top: 1px solid var(--border-main);
  border-bottom: 1px solid var(--border-main);
}

.tab-btn {
  flex: 1;
  padding: 8px 4px;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-size: 0.82rem;
  font-weight: 600;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid var(--border-main);
  white-space: nowrap;
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.tab-btn.active {
  background: var(--bg-section);
  color: var(--accent-purple);
  box-shadow: inset 0 -2px 0 var(--accent-purple);
}
</style>
