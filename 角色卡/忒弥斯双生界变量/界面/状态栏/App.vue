<template>
  <div class="abyss-card">
    <!-- 世界信息区 -->
    <WorldSection />

    <!-- 侵蚀度条 -->
    <ErosionBar />

    <!-- 角色标签导航 -->
    <TabNav v-model="active_tab" :tabs="tabs" />

    <!-- 角色面板内容 -->
    <div v-if="active_tab" class="content-area">
      <CharacterPanel :character-id="active_tab" />
    </div>

    <!-- 世界传闻（折叠区） -->
    <RumorSection />
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import ErosionBar from './components/ErosionBar.vue';
import RumorSection from './components/RumorSection.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: '西里尔', label: '圣子' },
  { id: '维克托', label: '研究员' },
  { id: '雷恩', label: '疯狗' },
  { id: '路西法', label: '外交官' },
];

const active_tab = useLocalStorage<string | null>('themis_status:active_tab', null);
</script>

<style lang="scss" scoped>
.abyss-card {
  width: 100%;
  max-width: 720px;
  background: linear-gradient(145deg, var(--c-abyss) 0%, var(--c-void) 100%);
  border: 2px solid var(--c-shadow);
  box-shadow:
    0 0 20px rgba(107, 58, 107, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  font-family: var(--font-gothic);
  color: var(--c-ghost);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.abyss-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--c-corrupt), transparent);
}

.content-area {
  padding: 12px;
  min-height: 0;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
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
