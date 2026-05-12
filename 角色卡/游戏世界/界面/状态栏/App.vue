<template>
  <div class="card">
    <DungeonHeader />

    <BattlePanel v-if="store.data.战斗状态.是否战斗中" />

    <CorruptionBars />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === 'team'" class="tab-pane active">
        <TeamPanel />
      </div>
      <div v-else-if="active_tab === 'inventory'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BattlePanel from './components/BattlePanel.vue';
import CorruptionBars from './components/CorruptionBars.vue';
import DungeonHeader from './components/DungeonHeader.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import TabNav from './components/TabNav.vue';
import TeamPanel from './components/TeamPanel.vue';
import { useDataStore } from './store';

const store = useDataStore();

const tabs = [
  { id: 'team', label: '⚔ 队伍' },
  { id: 'inventory', label: '🎒 道具' },
];

const active_tab = useLocalStorage<string | null>('game_world:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-dark-stone);
  border: 2px solid var(--c-dim);
  box-shadow:
    0 0 20px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  font-family: var(--font-dungeon);
  color: var(--c-parchment);
  font-size: 13px;
  line-height: 1.35;
  margin: 0 auto;
}

.content-area {
  padding: 10px;
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
