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
  background-color: var(--c-iron);
  border-bottom: 2px solid var(--c-gold);
  border-top: 1px solid var(--c-steel);
}

.tab-button {
  flex: 1;
  padding: 8px 4px;
  border: none;
  background: transparent;
  color: var(--c-silver);
  font-size: 0.85rem;
  font-weight: bold;
  font-family: var(--font-label);
  cursor: pointer;
  transition: all 0.25s;
  border-right: 1px solid var(--c-steel);
  letter-spacing: 0.5px;
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background-color: rgba(201, 168, 76, 0.1);
  color: var(--c-gold);
}

.tab-button.active {
  background-color: var(--c-obsidian);
  color: var(--c-gold);
  position: relative;
  border-bottom: 2px solid var(--c-gold);
  margin-bottom: -2px;
}
</style>
