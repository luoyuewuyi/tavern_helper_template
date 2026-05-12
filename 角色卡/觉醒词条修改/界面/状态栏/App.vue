<template>
  <div class="shell">
    <OverviewPanel :data="data" @open-record="recordOpen = true" />
    <div class="grid">
      <TasksPanel :data="data" />
      <PeoplePanel :data="data" />
    </div>
    <HaremRecordModal :open="recordOpen" :data="data" @close="recordOpen = false" />
  </div>
</template>

<script setup lang="ts">
import './global.css';
import HaremRecordModal from './components/HaremRecordModal.vue';
import OverviewPanel from './components/OverviewPanel.vue';
import PeoplePanel from './components/PeoplePanel.vue';
import TasksPanel from './components/TasksPanel.vue';
import { useDataStore } from './store';

const store = useDataStore();
const data = computed(() => store.data);
const recordOpen = ref(false);
</script>

<style scoped lang="scss">
.shell {
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 14px;
}

@media (max-width: 780px) {
  .shell {
    padding: 8px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
