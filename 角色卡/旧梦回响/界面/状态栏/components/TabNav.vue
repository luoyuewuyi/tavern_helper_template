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
  background-color: var(--c-slate);
  border-bottom: 1px solid var(--c-border);
}

.tab-button {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--c-faint);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-cyber);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
  border-right: 1px solid var(--c-border);
  position: relative;
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  color: var(--c-ghost);
  background: rgba(0, 240, 255, 0.05);
}

.tab-button.active {
  color: var(--c-neon);
  background: var(--c-deep);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--c-neon);
  box-shadow: 0 0 6px var(--c-neon);
}
</style>
