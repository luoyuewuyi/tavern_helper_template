<template>
  <div class="status-card">
    <WorldHeader />
    <HeroStats />
    <TabNav v-model="active_tab" :tabs="tabs" />
    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === 'npc'" class="tab-pane active">
        <NpcPanel />
      </div>
      <div v-else-if="active_tab === 'library'" class="tab-pane active">
        <CharacterLibrary />
      </div>
      <div v-else-if="active_tab === 'inventory'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterLibrary from './components/CharacterLibrary.vue';
import HeroStats from './components/HeroStats.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import NpcPanel from './components/NpcPanel.vue';
import TabNav from './components/TabNav.vue';
import WorldHeader from './components/WorldHeader.vue';

const tabs = [
  { id: 'npc', label: '👁 当前NPC' },
  { id: 'library', label: '🎨 角色库' },
  { id: 'inventory', label: '🎒 物品栏' },
];

const active_tab = useLocalStorage<string | null>('cthulhu_status:active_tab', null);
</script>

<style lang="scss" scoped>
.status-card {
  width: 100%;
  max-width: 720px;
  background: var(--bg-card);
  border: 1px solid var(--border-main);
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  overflow: hidden;
}

.content-area {
  padding: 12px;
  min-height: 0;
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
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
