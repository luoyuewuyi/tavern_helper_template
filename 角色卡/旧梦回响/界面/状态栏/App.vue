<template>
  <div class="card">
    <WorldHeader />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '主角'" class="tab-pane active">
        <PlayerPanel />
      </div>
      <div v-else-if="active_tab === '酒馆'" class="tab-pane active">
        <TavernPanel />
      </div>
      <div v-else-if="active_tab === '关系'" class="tab-pane active">
        <RelationPanel />
      </div>
      <div v-else-if="active_tab === '物品'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InventoryPanel from './components/InventoryPanel.vue';
import PlayerPanel from './components/PlayerPanel.vue';
import RelationPanel from './components/RelationPanel.vue';
import TabNav from './components/TabNav.vue';
import TavernPanel from './components/TavernPanel.vue';
import WorldHeader from './components/WorldHeader.vue';

const tabs = [
  { id: '主角', label: '主角' },
  { id: '酒馆', label: '酒馆' },
  { id: '关系', label: '关系' },
  { id: '物品', label: '物品' },
];

const active_tab = useLocalStorage<string | null>('cyber_status:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-deep);
  border: 1px solid var(--c-border);
  box-shadow:
    0 0 24px rgba(0, 240, 255, 0.08),
    inset 0 1px 0 rgba(0, 240, 255, 0.05);
  display: flex;
  flex-direction: column;
  font-family: var(--font-cyber);
  color: var(--c-ghost);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  border-radius: 2px;
  overflow: hidden;
}

.content-area {
  padding: 12px;
  min-height: 0;
}

.tab-pane {
  display: none;
  animation: fadeIn 0.35s ease;
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
