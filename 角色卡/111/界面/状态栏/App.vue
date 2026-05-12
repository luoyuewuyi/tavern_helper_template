<template>
  <div class="xianxia-card">
    <!-- 主线剧情标题 -->
    <StoryHeader />

    <!-- 主角信息 -->
    <HeroinePanel />

    <!-- 角色标签导航 -->
    <TabNav v-model="active_tab" :tabs="character_tabs" />

    <!-- 角色详情面板 -->
    <div v-if="active_tab" class="content-area">
      <CharacterPanel :character-name="active_tab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import HeroinePanel from './components/HeroinePanel.vue';
import StoryHeader from './components/StoryHeader.vue';
import TabNav from './components/TabNav.vue';
import { useDataStore } from './store';

const store = useDataStore();

// 获取所有角色（排除主线剧情和林美艳）
const character_tabs = computed(() => {
  const data = store.data;
  return Object.keys(data)
    .filter(name => name !== '主线剧情' && name !== '林美艳')
    .map(name => {
      const char = data[name] as any;
      // 获取修为信息用于显示
      const cultivation = char?.基础?.灵力修为 || char?.基础?.修为 || '';
      return {
        id: name,
        label: name,
        cultivation,
      };
    });
});

const active_tab = useLocalStorage<string | null>('status_bar:active_tab', null);
</script>

<style lang="scss" scoped>
.xianxia-card {
  width: 100%;
  max-width: 800px;
  background: linear-gradient(135deg, var(--c-scroll-beige) 0%, var(--c-cloud-white) 100%);
  border: 2px solid var(--c-border-brown);
  box-shadow:
    0 4px 20px rgba(26, 26, 46, 0.15),
    inset 0 0 30px rgba(212, 175, 55, 0.05);
  display: flex;
  flex-direction: column;
  font-family: var(--font-xianxia);
  color: var(--c-ink-black);
  font-size: 14px;
  line-height: 1.5;
  margin: 0 auto;
  position: relative;

  /* 古风边角装饰 */
  &::before,
  &::after {
    content: '◆';
    position: absolute;
    color: var(--c-spirit-gold);
    font-size: 12px;
    opacity: 0.6;
  }

  &::before {
    top: 8px;
    left: 8px;
  }

  &::after {
    bottom: 8px;
    right: 8px;
  }
}

.content-area {
  padding: 12px 16px;
  min-height: 0;
}
</style>
