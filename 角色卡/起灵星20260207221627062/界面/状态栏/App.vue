<template>
  <div class="card">
    <WorldSection />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '角色'" class="tab-pane active">
        <CharacterPanel />
      </div>
      <div v-else-if="active_tab === '地图'" class="tab-pane active">
        <MapPanel />
      </div>
      <div v-else-if="active_tab === '物品'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import MapPanel from './components/MapPanel.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: '角色', label: '⚔️ 角色情报' },
  { id: '地图', label: '🗺️ 世界地图' },
  { id: '物品', label: '🎒 物品栏' },
];

const active_tab = useLocalStorage<string | null>('qilingxing_status:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(180, 140, 255, 0.05);
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.5;
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
