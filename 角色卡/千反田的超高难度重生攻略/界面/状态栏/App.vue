<template>
  <div class="dashboard">
    <!-- 顶部信息栏 -->
    <HeaderBar />

    <!-- 核心属性条 -->
    <StatsBar />

    <!-- Tab导航 -->
    <TabNav v-model="active_tab" :tabs="tabs" />

    <!-- 内容区域 -->
    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === 'connections'" class="tab-pane active">
        <ConnectionsPanel />
      </div>
      <div v-else-if="active_tab === 'assets'" class="tab-pane active">
        <AssetsPanel />
      </div>
      <div v-else-if="active_tab === 'inventory'" class="tab-pane active">
        <InventoryPanel />
      </div>
      <div v-else-if="active_tab === 'family'" class="tab-pane active">
        <FamilyPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AssetsPanel from './components/AssetsPanel.vue';
import ConnectionsPanel from './components/ConnectionsPanel.vue';
import FamilyPanel from './components/FamilyPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import StatsBar from './components/StatsBar.vue';
import TabNav from './components/TabNav.vue';

const tabs = [
  { id: 'connections', label: '📇 人脉' },
  { id: 'assets', label: '🏢 资产' },
  { id: 'inventory', label: '🎒 物品' },
  { id: 'family', label: '🏠 家族' },
];

const active_tab = useLocalStorage<string | null>('chitanda_status:active_tab', null);
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  max-width: 720px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--c-text-primary);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
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
