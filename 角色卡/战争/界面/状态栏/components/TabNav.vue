<template>
  <nav class="tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-btn"
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
  background: var(--c-bg-dark);
  border-bottom: 2px solid var(--c-border);
}

.tab-btn {
  flex: 1;
  padding: 7px 8px;
  border: none;
  background: transparent;
  color: var(--c-text-dim);
  font-size: 12px;
  font-weight: bold;
  font-family: var(--font-title);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 2px;
  border-right: 1px solid var(--c-border-light);
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  background: var(--c-bg-section);
  color: var(--c-text);
}

.tab-btn.active {
  background: var(--c-bg-card);
  color: var(--c-text-bright);
  position: relative;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--c-accent-red-bright);
}
</style>
