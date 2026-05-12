<template>
  <nav class="nav-bar">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="nav-btn"
      :class="{ active: model === tab.id }"
      @click="model = tab.id"
    >
      <i :class="tab.icon"></i>
      <span>{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string; icon: string }[];
}>();

const model = defineModel<string>({ required: true });
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 6px 0;
  background: rgba(10, 31, 68, 0.95);
  border-top: 1px solid var(--al-border);
}

.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--al-text-secondary);
  font-size: 11px;
  font-family: var(--al-font);
  cursor: pointer;
  transition: all 0.3s;
  width: 64px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: transparent;
  gap: 3px;

  i {
    font-size: 18px;
  }

  &.active {
    color: var(--al-text-primary);
    background: rgba(74, 158, 255, 0.2);
    transform: translateY(-3px);
  }

  &:hover:not(.active) {
    color: var(--al-text-primary);
    background: rgba(74, 158, 255, 0.1);
  }
}
</style>
