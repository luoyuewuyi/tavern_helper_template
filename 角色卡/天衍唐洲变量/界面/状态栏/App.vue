<template>
  <div class="tianyan-card">
    <!-- 顶部装饰花纹 -->
    <div class="header-ornament">
      <span class="ornament-line"></span>
      <span class="ornament-icon">☯</span>
      <span class="ornament-line"></span>
    </div>

    <!-- 世界信息区 -->
    <WorldHeader />

    <!-- 属性概览条 -->
    <AttributeBar />

    <!-- 标签导航 -->
    <TabNav v-model="activeTab" :tabs="tabs" />

    <!-- 内容区域 -->
    <div v-if="activeTab" class="content-area">
      <Transition name="fade" mode="out-in">
        <div v-if="activeTab === 'attributes'" class="tab-pane" key="attributes">
          <AttributePanel />
        </div>
        <div v-else-if="activeTab === 'talents'" class="tab-pane" key="talents">
          <TalentPanel />
        </div>
        <div v-else-if="activeTab === 'attire'" class="tab-pane" key="attire">
          <AttirePanel />
        </div>
        <div v-else-if="activeTab === 'home'" class="tab-pane" key="home">
          <HomePanel />
        </div>
      </Transition>
    </div>

    <!-- 底部装饰 -->
    <div class="footer-ornament">
      <span class="footer-text">天衍唐洲 · 静尘苑</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttirePanel from './components/AttirePanel.vue';
import AttributeBar from './components/AttributeBar.vue';
import AttributePanel from './components/AttributePanel.vue';
import HomePanel from './components/HomePanel.vue';
import TabNav from './components/TabNav.vue';
import TalentPanel from './components/TalentPanel.vue';
import WorldHeader from './components/WorldHeader.vue';

const tabs = [
  { id: 'attributes', label: '属性', icon: '⚔' },
  { id: 'talents', label: '天赋', icon: '✦' },
  { id: 'attire', label: '着装', icon: '👘' },
  { id: 'home', label: '家园', icon: '🏠' },
];

const activeTab = useLocalStorage<string | null>('tianyan:active_tab', null);
</script>

<style lang="scss" scoped>
.tianyan-card {
  width: 100%;
  max-width: 720px;
  background: linear-gradient(135deg, var(--c-paper) 0%, var(--c-parchment) 100%);
  border: 2px solid var(--c-bronze);
  border-radius: 4px;
  box-shadow:
    0 4px 20px rgba(44, 36, 22, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  font-family: var(--font-song);
  color: var(--c-ink);
  font-size: 13px;
  line-height: 1.5;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

/* 顶部装饰 */
.header-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  background: linear-gradient(90deg, transparent 0%, var(--c-mist) 50%, transparent 100%);
}

.ornament-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-bronze), transparent);
  max-width: 100px;
}

.ornament-icon {
  font-size: 1.2rem;
  color: var(--c-gold);
  margin: 0 12px;
  text-shadow: 0 1px 2px rgba(212, 175, 55, 0.3);
}

/* 内容区域 */
.content-area {
  padding: 12px;
  min-height: 0;
  background: rgba(255, 255, 255, 0.3);
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* 底部装饰 */
.footer-ornament {
  padding: 6px;
  text-align: center;
  background: linear-gradient(90deg, transparent 0%, var(--c-mist) 50%, transparent 100%);
  border-top: 1px solid var(--c-mist);
}

.footer-text {
  font-family: var(--font-kai);
  font-size: 0.75rem;
  color: var(--c-cloud);
  letter-spacing: 0.2em;
}
</style>
