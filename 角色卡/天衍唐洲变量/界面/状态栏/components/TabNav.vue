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
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string; icon: string }[];
}>();

const model = defineModel<string | null>({ required: true });

function toggleTab(id: string) {
  model.value = model.value === id ? null : id;
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  background: linear-gradient(180deg, var(--c-parchment) 0%, var(--c-mist) 100%);
  border-top: 1px solid var(--c-mist);
  border-bottom: 2px solid var(--c-bronze);
}

.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border: none;
  background: transparent;
  color: var(--c-cloud);
  font-family: var(--font-kai);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--c-gold);
    transition: all 0.2s ease;
    transform: translateX(-50%);
  }

  &:hover {
    background: rgba(139, 105, 20, 0.08);
    color: var(--c-bronze);
  }

  &.active {
    background: rgba(255, 255, 255, 0.5);
    color: var(--c-bronze);

    &::after {
      width: 60%;
    }

    .tab-icon {
      transform: scale(1.1);
    }
  }
}

.tab-icon {
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.tab-label {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
}

@media (max-width: 400px) {
  .tab-label {
    display: none;
  }

  .tab-icon {
    font-size: 1.3rem;
  }
}
</style>
