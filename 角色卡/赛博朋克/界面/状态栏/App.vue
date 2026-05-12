<template>
  <div class="cyber-card">
    <div class="scanline"></div>
    <WorldSection />
    <AffinityPanel />
    <TabNav v-model="active_tab" :tabs="tabs" />
    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '义体'" class="tab-pane active">
        <CyberBodyPanel />
      </div>
      <div v-else-if="active_tab === '物品'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AffinityPanel from './components/AffinityPanel.vue';
import CyberBodyPanel from './components/CyberBodyPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: '义体', label: '⚙️ 义体状态' },
  { id: '物品', label: '📦 持有物品' },
];

const active_tab = useLocalStorage<string | null>('cyber_status:active_tab', null);
</script>

<style lang="scss" scoped>
.cyber-card {
  width: 100%;
  max-width: 720px;
  background: var(--cp-bg-deep);
  border: 1px solid var(--cp-border);
  box-shadow:
    0 0 15px rgba(0, 240, 255, 0.08),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  font-family: var(--font-cyber);
  color: var(--cp-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--cp-cyan), transparent);
  animation: borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.015) 2px,
    rgba(0, 240, 255, 0.015) 4px
  );
  pointer-events: none;
  z-index: 10;
}

.content-area {
  padding: 10px;
  min-height: 0;
}

.tab-pane {
  display: none;
  animation: cyberFade 0.3s;
}

.tab-pane.active {
  display: block;
}

@keyframes cyberFade {
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
