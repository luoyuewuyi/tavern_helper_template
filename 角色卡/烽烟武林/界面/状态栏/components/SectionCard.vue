<template>
  <section class="section-card" :class="{ collapsed: collapsible && !isOpen }">
    <button
      v-if="collapsible"
      type="button"
      class="section-head section-toggle"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <div>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h3>{{ title }}</h3>
      </div>
      <div class="section-meta">
        <slot name="meta" />
        <span class="chevron" :class="{ open: isOpen }">⌄</span>
      </div>
    </button>
    <header v-else class="section-head">
      <div>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h3>{{ title }}</h3>
      </div>
      <slot name="meta" />
    </header>
    <div v-show="!collapsible || isOpen" class="section-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  eyebrow?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  storageKey?: string;
}>();

const localState = props.storageKey ? useLocalStorage(props.storageKey, props.defaultOpen ?? true) : null;
const fallbackOpen = ref(props.defaultOpen ?? true);
const isOpen = computed({
  get: () => localState?.value ?? fallbackOpen.value,
  set: value => {
    if (localState) {
      localState.value = value;
      return;
    }
    fallbackOpen.value = value;
  },
});

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<style scoped lang="scss">
.section-card {
  position: relative;
  overflow: hidden;
  background: var(--ink-panel);
  border: 1px solid rgba(79, 70, 57, 0.5);
  border-radius: 18px;
  box-shadow: 0 12px 26px var(--shadow-ink);
}

.section-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(53, 94, 92, 0.06), transparent 42%, rgba(182, 139, 70, 0.08));
  pointer-events: none;
}

.section-head {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  padding: 16px 18px 10px;
  border-bottom: 1px solid rgba(79, 70, 57, 0.12);
}

.section-toggle {
  width: 100%;
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.section-toggle:hover {
  background: rgba(53, 94, 92, 0.05);
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-head h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--ink-accent);
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.section-body {
  position: relative;
  z-index: 1;
  padding: 12px 16px 16px;
}

.chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid rgba(79, 70, 57, 0.16);
  background: rgba(255, 255, 255, 0.54);
  color: var(--ink-muted);
  font-size: 18px;
  line-height: 1;
  transition:
    transform 0.22s ease,
    background-color 0.22s ease;
}

.chevron.open {
  transform: rotate(180deg);
  background: rgba(53, 94, 92, 0.1);
}

.collapsed {
  box-shadow: 0 8px 18px rgba(32, 24, 18, 0.1);
}
</style>
