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
  background: var(--c-ink);
  border-bottom: 2px solid var(--c-ink);
}

.tab-btn {
  flex: 1;
  padding: 7px 4px;
  border: none;
  background: transparent;
  color: var(--c-mist);
  font-size: 0.82rem;
  font-weight: bold;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.tab-btn.active {
  background: var(--c-parchment);
  color: var(--c-ink);
  position: relative;
  top: 1px;
  padding-bottom: 9px;
}
</style>
