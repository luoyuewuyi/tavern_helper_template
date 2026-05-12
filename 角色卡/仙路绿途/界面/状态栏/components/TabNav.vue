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
  background: var(--c-umber);
  border-bottom: 2px solid var(--c-gold);
}

.tab-button {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--c-parchment);
  font-size: 0.9rem;
  font-weight: bold;
  font-family: var(--font-xianxia);
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 2px;
  border-right: 1px solid rgba(201, 168, 92, 0.3);
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background: rgba(201, 168, 92, 0.15);
}

.tab-button.active {
  background: var(--c-parchment);
  color: var(--c-ink);
  position: relative;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--c-parchment);
}
</style>
