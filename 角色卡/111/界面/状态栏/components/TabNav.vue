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
      <span class="tab-name">{{ tab.label }}</span>
      <span v-if="tab.cultivation" class="tab-cultivation">{{ tab.cultivation }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string; cultivation?: string }[];
}>();

const model = defineModel<string | null>({ required: true });

function toggleTab(id: string) {
  model.value = model.value === id ? null : id;
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(180deg, rgba(139, 115, 85, 0.1) 0%, rgba(139, 115, 85, 0.05) 100%);
  border-bottom: 2px solid var(--c-border-brown);
  gap: 2px;
  padding: 4px;
}

.tab-button {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--c-jade-mist);
  font-size: 13px;
  font-family: var(--font-xianxia);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border-radius: 4px;

  &:hover {
    background: rgba(212, 175, 55, 0.1);
    color: var(--c-ink-black);
  }

  &.active {
    background: var(--c-cloud-white);
    color: var(--c-spirit-gold);
    border-color: var(--c-border-brown);
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.tab-name {
  letter-spacing: 2px;
}

.tab-cultivation {
  font-size: 10px;
  color: var(--c-spirit-purple);
  opacity: 0.8;
}

@media (max-width: 500px) {
  .tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tab-button {
    flex: 0 0 auto;
    min-width: 70px;
  }
}
</style>
