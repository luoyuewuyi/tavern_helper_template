<template>
  <nav class="tabs-container">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-item"
      :class="{ active: model === tab.id }"
      @click="toggleTab(tab.id)"
    >
      <span class="tab-label">{{ tab.label }}</span>
      <div v-if="model === tab.id" class="tab-underline"></div>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[];
}>();

const model = defineModel<string | null>({ required: true });

function toggleTab(id: string) {
  model.value = id;
}
</script>

<style lang="scss" scoped>
.tabs-container {
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 2px solid var(--c-deep-gold);
  padding: 0 10px;
}

.tab-item {
  padding: 12px 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover .tab-label {
    color: var(--c-gold-bright);
  }

  &.active .tab-label {
    color: var(--c-gold-bright);
    text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
  }
}

.tab-label {
  font-family: var(--font-title);
  font-size: 14px;
  font-weight: 700;
  color: var(--c-parchment-dark);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.tab-underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--c-gold-bright);
  box-shadow: 0 0 10px var(--c-gold-bright);
  border-radius: 2px 2px 0 0;
}
</style>
