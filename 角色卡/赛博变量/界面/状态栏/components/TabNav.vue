<template>
  <nav class="cyber-tabs">
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
.cyber-tabs {
  display: flex;
  background: var(--c-bg-dark);
  border-bottom: 1px solid var(--c-cyan);
}

.tab-btn {
  flex: 1;
  padding: 10px 8px;
  border: none;
  background: transparent;
  color: var(--c-text-dim);
  font-size: 0.8rem;
  font-weight: bold;
  font-family: var(--font-cyber);
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid var(--c-border);
  position: relative;
  overflow: hidden;
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--c-cyan);
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.tab-btn:hover {
  color: var(--c-text);
  background: rgba(0, 240, 255, 0.05);
}

.tab-btn:hover::before {
  transform: scaleX(0.5);
}

.tab-btn.active {
  color: var(--c-cyan);
  background: var(--c-bg-card);
  text-shadow: var(--glow-cyan);
}

.tab-btn.active::before {
  transform: scaleX(1);
  box-shadow: var(--glow-cyan);
}
</style>
