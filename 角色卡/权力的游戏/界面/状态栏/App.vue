<template>
  <div class="card">
    <WorldSection />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '主角'" class="tab-pane active">
        <UserStats />
      </div>
      <div v-else-if="active_tab === '人物志'" class="tab-pane active">
        <NpcPanel />
      </div>
      <div v-else-if="active_tab === '命运抉择'" class="tab-pane active">
        <PlotChoices />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NpcPanel from './components/NpcPanel.vue';
import PlotChoices from './components/PlotChoices.vue';
import TabNav from './components/TabNav.vue';
import UserStats from './components/UserStats.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: '主角', label: '⚔ 主角' },
  { id: '人物志', label: '👤 人物志' },
  { id: '命运抉择', label: '🔮 命运' },
];

const active_tab = useLocalStorage<string | null>('got_status_bar:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-obsidian);
  border: 2px solid var(--c-gold);
  box-shadow:
    0 0 15px rgba(201, 168, 76, 0.15),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  font-family: var(--font-got);
  color: var(--c-parchment);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
}

.content-area {
  padding: 12px;
  min-height: 0;
}

.tab-pane {
  display: none;
  animation: fadeEffect 0.4s;
}

.tab-pane.active {
  display: block;
}

@keyframes fadeEffect {
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
