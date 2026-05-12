<template>
  <div class="card">
    <WorldSection />

    <FavorBar />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '姜清曦'" class="tab-pane active">
        <CharacterPanel />
      </div>
      <div v-else-if="active_tab === '主角'" class="tab-pane active">
        <ProtagonistPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import FavorBar from './components/FavorBar.vue';
import ProtagonistPanel from './components/ProtagonistPanel.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: '姜清曦', label: '清曦情报' },
  { id: '主角', label: '自身状态' },
];

const active_tab = useLocalStorage<string | null>('status_bar:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-parchment);
  border: 2px solid var(--c-gold);
  box-shadow: 4px 4px 0px rgba(42, 31, 26, 0.12), inset 0 0 20px rgba(201, 168, 92, 0.08);
  display: flex;
  flex-direction: column;
  font-family: var(--font-xianxia);
  color: var(--c-ink);
  font-size: 13px;
  line-height: 1.5;
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
