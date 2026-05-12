<template>
  <div class="card" :class="phase_class">
    <WorldHeader />

    <StatsBar />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '角色'" class="tab-pane active">
        <CharacterPanel />
      </div>
      <div v-else-if="active_tab === '身体'" class="tab-pane active">
        <BodyPanel />
      </div>
      <div v-else-if="active_tab === '改造'" class="tab-pane active">
        <CorruptionPanel />
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
import BodyPanel from './components/BodyPanel.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import CorruptionPanel from './components/CorruptionPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import RelationPanel from './components/RelationPanel.vue';
import StatsBar from './components/StatsBar.vue';
import TabNav from './components/TabNav.vue';
import WorldHeader from './components/WorldHeader.vue';
import { useDataStore } from './store';

const store = useDataStore();

const tabs = [
  { id: '角色', label: '⚔ 角色' },
  { id: '身体', label: '🌸 身体' },
  { id: '改造', label: '🔮 秘值' },
  { id: '关系', label: '💠 关系' },
  { id: '物品', label: '📜 物品' },
];

const active_tab = useLocalStorage<string | null>('xianxia_status:active_tab', null);

const phase_class = computed(() => {
  const phase = store.data.世界.游玩阶段;
  return {
    'phase-xiuxian': phase === '修仙',
    'phase-capture': phase === '捕获',
    'phase-train': phase === '调教',
    'phase-fallen': phase === '堕落',
  };
});
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-parchment);
  border: 2px solid var(--c-ink);
  box-shadow: 4px 4px 0px var(--c-shadow);
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--c-ink);
  font-size: 13px;
  line-height: 1.5;
  margin: 0 auto;
  border-radius: 2px;
}

.card.phase-xiuxian {
  border-color: var(--c-jade);
}
.card.phase-capture {
  border-color: #c9584c;
}
.card.phase-train {
  border-color: var(--c-pink);
}
.card.phase-fallen {
  border-color: #8b3a62;
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
