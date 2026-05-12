<template>
  <div class="prts-terminal">
    <div class="terminal-header">
      <span class="header-icon">◈</span>
      <span class="header-title">PRTS · 干员实时数据链</span>
      <span class="header-status">▣ ONLINE</span>
    </div>

    <WorldSection />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '干员档案'" class="tab-pane active">
        <CharacterPanel />
      </div>
      <div v-else-if="active_tab === '信赖面板'" class="tab-pane active">
        <TrustPanel />
      </div>
      <div v-else-if="active_tab === '博士背包'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import TabNav from './components/TabNav.vue';
import TrustPanel from './components/TrustPanel.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: '干员档案', label: '干员档案' },
  { id: '信赖面板', label: '信赖面板' },
  { id: '博士背包', label: '博士背包' },
];

const active_tab = useLocalStorage<string | null>('prts_status:active_tab', null);
</script>

<style lang="scss" scoped>
.prts-terminal {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-bg-dark);
  border: 1px solid var(--c-border-active);
  box-shadow:
    0 0 15px rgba(0, 180, 216, 0.2),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  font-family: var(--font-prts);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: linear-gradient(90deg, var(--c-bg-panel), var(--c-bg-dark));
  border-bottom: 1px solid var(--c-border-active);
  gap: 8px;
}

.header-icon {
  color: var(--c-cyan);
  font-size: 1.1rem;
}

.header-title {
  flex: 1;
  font-weight: bold;
  font-size: 0.9rem;
  color: var(--c-cyan);
  letter-spacing: 2px;
}

.header-status {
  font-size: 0.7rem;
  color: var(--c-green);
  animation: blink 2s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.content-area {
  padding: 10px;
  min-height: 0;
}

.tab-pane {
  display: none;
  animation: fadeIn 0.3s;
}

.tab-pane.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
