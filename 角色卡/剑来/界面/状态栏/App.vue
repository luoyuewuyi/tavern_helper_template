<template>
  <div class="scroll" @click="expanded = !expanded">
    <!-- 卷轴头部 -->
    <div class="scroll-header">
      <div class="header-deco left">☰</div>
      <div class="header-title">天 机 录</div>
      <div class="header-deco right">{{ expanded ? '▲' : '▼' }}</div>
    </div>

    <div v-show="expanded" class="scroll-body">
      <!-- 天地板块 -->
      <WorldSection />

      <!-- user信息 -->
      <UserSection />

      <!-- 气运条 -->
      <FateBar />

      <!-- 标签页导航 -->
      <TabNav v-model="activeTab" :tabs="tabs" />

      <!-- 标签内容 -->
      <div v-if="activeTab" class="content-area" @click.stop>
        <div v-if="activeTab === 'relations'" class="tab-pane active">
          <RelationsPanel />
        </div>
        <div v-else-if="activeTab === 'inventory'" class="tab-pane active">
          <InventoryPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FateBar from './components/FateBar.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import RelationsPanel from './components/RelationsPanel.vue';
import TabNav from './components/TabNav.vue';
import UserSection from './components/UserSection.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: 'relations', label: '⚔ 江湖往来' },
  { id: 'inventory', label: '🎒 随身之物' },
];

const expanded = useLocalStorage('jl_status:expanded', true);
const activeTab = useLocalStorage<string | null>('jl_status:active_tab', 'relations');
</script>

<style lang="scss" scoped>
.scroll {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: var(--jl-paper);
  border: 2px solid var(--jl-gold);
  box-shadow:
    0 4px 20px var(--jl-shadow),
    inset 0 0 60px rgba(201, 169, 110, 0.05);
  font-family: var(--font-body);
  color: var(--jl-ink);
  font-size: 13px;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
}

.scroll::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, var(--jl-gold) 20%, var(--jl-gold) 80%, transparent 100%);
}

.scroll::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, var(--jl-gold) 20%, var(--jl-gold) 80%, transparent 100%);
}

.scroll-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: linear-gradient(180deg, var(--jl-ink) 0%, #2a2a4a 100%);
  cursor: pointer;
  user-select: none;
}

.header-title {
  font-family: var(--font-title);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--jl-gold);
  letter-spacing: 0.5em;
  text-shadow: 0 0 8px rgba(201, 169, 110, 0.4);
}

.header-deco {
  color: var(--jl-gold-light);
  font-size: 0.8rem;
  opacity: 0.7;
}

.header-deco.left {
  margin-right: auto;
}
.header-deco.right {
  margin-left: auto;
}

.scroll-body {
  animation: unfold 0.3s ease;
}

.content-area {
  padding: 10px 12px 14px;
  min-height: 0;
}

.tab-pane {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tab-pane.active {
  display: block;
}

@keyframes unfold {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 2000px;
  }
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
