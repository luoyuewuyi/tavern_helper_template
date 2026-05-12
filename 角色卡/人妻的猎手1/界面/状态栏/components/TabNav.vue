<template>
  <nav class="tabs" ref="tabsRef">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-btn"
      :class="{ active: model === tab.id }"
      @click="toggleTab(tab.id)"
    >
      <span class="tab-label">{{ tab.label }}</span>
      <span v-if="model === tab.id" class="tab-indicator"></span>
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
  overflow-x: auto;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid var(--c-border);
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-btn {
  flex: 0 0 auto;
  min-width: 72px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: var(--c-text-faint);
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  white-space: nowrap;
  border-right: 1px solid rgba(180, 120, 90, 0.08);

  &:last-child {
    border-right: none;
  }

  &:hover:not(.active) {
    background: rgba(90, 42, 53, 0.15);
    color: var(--c-gold-dim);
  }

  &.active {
    color: var(--c-gold);
    background: linear-gradient(180deg, rgba(90, 42, 53, 0.2), transparent);
    text-shadow: 0 0 8px var(--c-glow-gold);
  }
}

.tab-label {
  position: relative;
  z-index: 1;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-crimson), transparent);
  border-radius: 1px;
  box-shadow: 0 0 6px var(--c-glow);
  animation: indicatorIn 0.3s ease;
}

@keyframes indicatorIn {
  from {
    opacity: 0;
    transform: scaleX(0.3);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
</style>
