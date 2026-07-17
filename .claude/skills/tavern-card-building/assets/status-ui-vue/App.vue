<template>
  <StatusShell>
    <p v-if="hasData" class="connection-state">状态数据已连接。请在 components/ 中按 Schema 路径实现业务面板。</p>
    <p v-else class="connection-state is-error">当前楼层没有可显示的状态数据。</p>
  </StatusShell>
</template>

<script setup lang="ts">
import StatusShell from './components/StatusShell.vue';
import { useDataStore } from './store';

const store = useDataStore();
const hasData = computed(() => Object.keys(store.data).length > 0);
</script>
