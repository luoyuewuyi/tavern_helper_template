<template>
  <div class="rumor-section">
    <button class="rumor-toggle" @click="isExpanded = !isExpanded">
      <span class="toggle-icon">{{ isExpanded ? '▼' : '►' }}</span>
      <span class="toggle-text">世界传闻</span>
      <span class="rumor-count">{{ rumorCount }}</span>
    </button>

    <div v-if="isExpanded" class="rumor-list">
      <div v-for="(content, title) in store.data.世界.世界传闻" :key="title" class="rumor-item">
        <div class="rumor-title">
          <span class="rumor-icon">📢</span>
          {{ title }}
        </div>
        <div class="rumor-content">{{ content }}</div>
      </div>

      <div v-if="rumorCount === 0" class="rumor-item empty">
        <div class="rumor-content">目前没有流传的传闻...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const isExpanded = ref(false);

const rumorCount = computed(() => {
  return Object.keys(store.data.世界.世界传闻 || {}).length;
});
</script>

<style lang="scss" scoped>
.rumor-section {
  border-top: 1px solid var(--c-shadow);
}

.rumor-toggle {
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(107, 58, 107, 0.2);
  }
}

.toggle-icon {
  color: var(--c-pale);
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.toggle-text {
  font-size: 0.85rem;
  color: var(--c-ghost);
  font-weight: 500;
  font-family: var(--font-gothic);
}

.rumor-count {
  margin-left: auto;
  background: var(--c-shadow);
  color: var(--c-pale);
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-family: var(--font-gothic);
}

.rumor-list {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rumor-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--c-shadow);
  border-radius: 4px;
  padding: 8px 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--c-gold);
    border-radius: 3px 0 0 3px;
  }

  &.empty::before {
    background: var(--c-shadow);
  }
}

.rumor-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--c-gold);
  margin-bottom: 4px;
}

.rumor-icon {
  font-size: 0.9rem;
}

.rumor-content {
  font-size: 0.8rem;
  color: var(--c-pale);
  padding-left: 22px;
  line-height: 1.4;
}
</style>
