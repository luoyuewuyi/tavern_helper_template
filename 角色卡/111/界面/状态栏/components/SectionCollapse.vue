<template>
  <div class="collapse-section" :class="{ expanded: is_open }">
    <button class="collapse-header" @click="toggle">
      <span class="collapse-icon">{{ is_open ? '▾' : '▸' }}</span>
      <span class="collapse-title">◇ {{ title }}</span>
      <span v-if="badge" class="collapse-badge">{{ badge }}</span>
    </button>
    <div v-show="is_open" class="collapse-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  storageKey: string;
  badge?: string;
  defaultOpen?: boolean;
}>();

const is_open = useLocalStorage<boolean>(`status_bar:collapse:${props.storageKey}`, props.defaultOpen ?? false);

function toggle() {
  is_open.value = !is_open.value;
}
</script>

<style lang="scss" scoped>
.collapse-section {
  margin-bottom: 10px;
  border: 1px solid rgba(139, 115, 85, 0.2);
  border-radius: 6px;
  overflow: hidden;
  transition: border-color 0.2s ease;

  &.expanded {
    border-color: var(--c-border-brown);
  }
}

.collapse-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: rgba(139, 115, 85, 0.06);
  color: var(--c-spirit-gold);
  font-size: 12px;
  font-family: var(--font-xianxia);
  cursor: pointer;
  letter-spacing: 1px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(212, 175, 55, 0.12);
  }
}

.collapse-icon {
  font-size: 10px;
  color: var(--c-jade-mist);
  flex-shrink: 0;
  width: 12px;
}

.collapse-title {
  flex: 1;
  text-align: left;
}

.collapse-badge {
  font-size: 10px;
  color: var(--c-spirit-purple);
  background: rgba(128, 90, 213, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}

.collapse-body {
  padding: 10px 12px;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
