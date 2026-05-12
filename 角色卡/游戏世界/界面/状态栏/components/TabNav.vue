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
  background-color: var(--c-stone);
  border-bottom: 2px solid var(--c-dim);
}

.tab-button {
  flex: 1;
  padding: 7px;
  border: none;
  background: transparent;
  color: var(--c-mist);
  font-size: 0.85rem;
  font-weight: bold;
  font-family: var(--font-dungeon);
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid var(--c-dim);
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background-color: var(--c-dim);
  color: var(--c-bone);
}

.tab-button.active {
  background-color: var(--c-dark-stone);
  color: var(--c-gold);
  position: relative;
  top: 1px;
  padding-bottom: 9px;
}
</style>
