<template>
  <div class="port-container">
    <!-- 顶部信息栏 -->
    <HeaderBar />

    <!-- 内容区域 -->
    <div class="content-area">
      <Transition name="fade" mode="out-in">
        <CouncilPanel v-if="activeTab === 'home'" key="home" />
        <IndustryPanel v-else-if="activeTab === 'industry'" key="industry" />
        <FleetPanel v-else-if="activeTab === 'fleet'" key="fleet" />
        <StoragePanel v-else-if="activeTab === 'storage'" key="storage" />
      </Transition>
    </div>

    <!-- 底部导航 -->
    <TabNav v-model="activeTab" :tabs="tabs" />
  </div>
</template>

<script setup lang="ts">
import CouncilPanel from './components/CouncilPanel.vue';
import FleetPanel from './components/FleetPanel.vue';
import HeaderBar from './components/HeaderBar.vue';
import IndustryPanel from './components/IndustryPanel.vue';
import StoragePanel from './components/StoragePanel.vue';
import TabNav from './components/TabNav.vue';

const tabs = [
  { id: 'home', label: '港区', icon: 'fas fa-home' },
  { id: 'industry', label: '产业', icon: 'fas fa-industry' },
  { id: 'fleet', label: '舰队', icon: 'fas fa-ship' },
  { id: 'storage', label: '仓储', icon: 'fas fa-warehouse' },
];

const activeTab = useLocalStorage<string>('azur_lane_status:tab', 'home');
</script>

<style lang="scss" scoped>
.port-container {
  width: 100%;
  max-width: 420px;
  background: #0a1f44;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: var(--al-font);
  border: 1px solid rgba(139, 185, 254, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  min-height: 0;
  max-height: 520px;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
