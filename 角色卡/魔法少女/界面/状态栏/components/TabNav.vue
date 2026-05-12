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
      <span class="tab-emoji">{{ tab.emoji }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string; emoji: string }[];
}>();

const model = defineModel<string | null>({ required: true });

function toggleTab(id: string) {
  model.value = model.value === id ? null : id;
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  background: var(--mg-bg-dark);
  border-bottom: 1px solid var(--mg-border);
  border-top: 1px solid var(--mg-border);
}

.tab-btn {
  flex: 1;
  padding: 8px 4px;
  border: none;
  background: transparent;
  color: var(--mg-text-dim);
  font-size: 0.82rem;
  font-family: var(--font-mg);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border-right: 1px solid rgba(107, 63, 160, 0.2);
  position: relative;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: rgba(107, 63, 160, 0.15);
    color: var(--mg-text);
  }

  &.active {
    background: var(--mg-bg-card);
    color: var(--mg-accent-pink);

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 20%;
      right: 20%;
      height: 2px;
      background: var(--mg-accent-pink);
      box-shadow: 0 0 8px var(--mg-accent-pink);
      border-radius: 1px;
    }
  }
}

.tab-emoji {
  font-size: 1rem;
  line-height: 1;
}

.tab-label {
  font-size: 0.7rem;
  font-weight: 600;
}
</style>
