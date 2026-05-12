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
      <span class="tab-label">{{ tab.label }}</span>
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
  background: var(--c-void);
  border-bottom: 1px solid var(--c-shadow);
}

.tab-button {
  flex: 1;
  padding: 10px 8px;
  border: none;
  background: transparent;
  color: var(--c-pale);
  font-size: 0.85rem;
  font-weight: 500;
  font-family: var(--font-gothic);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  border-right: 1px solid var(--c-shadow);

  &:last-child {
    border-right: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--c-obsession);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover {
    background: rgba(107, 58, 107, 0.2);
    color: var(--c-ghost);
  }

  &.active {
    background: rgba(107, 58, 107, 0.3);
    color: var(--c-obsession);

    &::after {
      width: 60%;
    }
  }
}

.tab-label {
  position: relative;
  z-index: 1;
}
</style>
