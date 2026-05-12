<template>
  <div class="cyber-card">
    <!-- 扫描线效果 -->
    <div class="scanline"></div>

    <!-- 顶部信息区 -->
    <HeaderSection />

    <!-- 状态进度条区 -->
    <StatusBars />

    <!-- 标签导航 -->
    <TabNav v-model="active_tab" :tabs="tabs" />

    <!-- 内容区域 -->
    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === 'character'" class="tab-pane active">
        <CharacterPanel />
      </div>
      <div v-else-if="active_tab === 'inventory'" class="tab-pane active">
        <InventoryPanel />
      </div>
      <div v-else-if="active_tab === 'equipment'" class="tab-pane active">
        <EquipmentPanel />
      </div>
      <div v-else-if="active_tab === 'npc'" class="tab-pane active">
        <NPCPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import EquipmentPanel from './components/EquipmentPanel.vue';
import HeaderSection from './components/HeaderSection.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import NPCPanel from './components/NPCPanel.vue';
import StatusBars from './components/StatusBars.vue';
import TabNav from './components/TabNav.vue';

const tabs = [
  { id: 'character', label: '// 主角' },
  { id: 'inventory', label: '// 物品' },
  { id: 'equipment', label: '// 装备' },
  { id: 'npc', label: '// NPC' },
];

const active_tab = useLocalStorage<string | null>('cyber_status:active_tab', null);
</script>

<style lang="scss" scoped>
.cyber-card {
  width: 100%;
  max-width: 720px;
  background: var(--c-bg-panel);
  border: 1px solid var(--c-cyan);
  box-shadow:
    var(--glow-cyan),
    inset 0 0 30px rgba(0, 240, 255, 0.03);
  display: flex;
  flex-direction: column;
  font-family: var(--font-cyber);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to bottom, transparent, rgba(0, 240, 255, 0.15), transparent);
  animation: scanline 4s linear infinite;
  pointer-events: none;
  z-index: 10;
}

.content-area {
  padding: 12px;
  min-height: 0;
  background: var(--c-bg-card);
}

.tab-pane {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tab-pane.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
