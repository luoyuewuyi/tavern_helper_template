<template>
  <div class="card">
    <InfoHeader />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '王影'" class="tab-pane active">
        <CharacterPanel character="王影" />
      </div>
      <div v-else-if="active_tab === '付宴'" class="tab-pane active">
        <CharacterPanel character="付宴" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import InfoHeader from './components/InfoHeader.vue';
import TabNav from './components/TabNav.vue';

const tabs = [
  { id: '王影', label: '👩 王影' },
  { id: '付宴', label: '👩 付宴' },
];

const active_tab = useLocalStorage<string | null>('status_bar:active_tab', '王影');
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-bg-card);
  border: 1px solid var(--c-border-accent);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(107, 91, 149, 0.2);
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  overflow: hidden;
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
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
