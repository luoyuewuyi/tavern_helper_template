<template>
  <div class="status-card">
    <!-- 顶部装饰 -->
    <div class="header-strip">
      <div class="scanline-overlay"></div>
      <div class="header-content">
        <span class="header-icon">◈</span>
        <span class="header-title">SYSTEM STATUS</span>
        <span class="header-icon">◈</span>
      </div>
      <div class="header-line"></div>
    </div>

    <!-- 标签导航 -->
    <TabNav v-model="activeTab" :tabs="tabs" />

    <!-- 内容区域 -->
    <div v-if="activeTab" class="content-area">
      <Transition name="fade" mode="out-in">
        <div v-if="activeTab === 'character'" class="tab-pane" key="character">
          <CharacterStatus />
        </div>
        <div v-else-if="activeTab === 'twitter'" class="tab-pane" key="twitter">
          <TwitterFeed />
        </div>
      </Transition>
    </div>

    <!-- 底部装饰 -->
    <div class="footer-strip">
      <span class="footer-text">SYS://MONITORING</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterStatus from './components/CharacterStatus.vue';
import TabNav from './components/TabNav.vue';
import TwitterFeed from './components/TwitterFeed.vue';

const tabs = [
  { id: 'character', label: '角色状态', icon: '👤' },
  { id: 'twitter', label: '推特', icon: '🐦' },
];

const activeTab = useLocalStorage<string | null>('tweet_status:active_tab', null);
</script>

<style lang="scss" scoped>
.status-card {
  width: 100%;
  max-width: 720px;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  font-family: var(--font-sans);
  color: var(--c-text-primary);
  font-size: 13px;
  line-height: 1.5;
  margin: 0 auto;
  overflow: hidden;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    0 0 1px var(--c-border-glow);
}

/* 顶部装饰 */
.header-strip {
  position: relative;
  background: var(--c-bg-card);
  padding: 10px 0 0;
  overflow: hidden;
}

.scanline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 229, 255, 0.015) 2px,
    rgba(0, 229, 255, 0.015) 4px
  );
  pointer-events: none;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 16px 8px;
}

.header-icon {
  color: var(--c-cyan);
  font-size: 0.7rem;
  opacity: 0.6;
}

.header-title {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: var(--c-cyan);
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
  text-transform: uppercase;
}

.header-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-cyan), transparent);
  opacity: 0.3;
}

/* 内容区域 */
.content-area {
  padding: 12px;
  min-height: 0;
  background: var(--c-bg-deep);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* 底部装饰 */
.footer-strip {
  padding: 6px 16px;
  text-align: center;
  background: var(--c-bg-card);
  border-top: 1px solid var(--c-border);
}

.footer-text {
  font-family: var(--font-mono);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  color: var(--c-text-muted);
  text-transform: uppercase;
}
</style>
