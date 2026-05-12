<template>
  <div class="card">
    <WorldSection />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <Transition name="fade-slide" mode="out-in">
      <div v-if="active_tab" :key="active_tab" class="content-area">
        <HeroineCard v-if="heroines[active_tab]" :name="active_tab" :data="heroines[active_tab]" />
      </div>
    </Transition>

    <OptionsPanel />
  </div>
</template>

<script setup lang="ts">
import HeroineCard from './components/HeroineCard.vue';
import OptionsPanel from './components/OptionsPanel.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';
import { useDataStore } from './store';

const store = useDataStore();

const heroineNames = ['陆沉雪', '陆美玲', '柳如玉', '何美兰', '李淑慧', '张雪', '白曼文'] as const;

const tabs = heroineNames.map(name => ({
  id: name,
  label: name,
}));

const heroines = computed(() => {
  const result: Record<string, any> = {};
  for (const name of heroineNames) {
    result[name] = (store.data as any)[name];
  }
  return result;
});

const active_tab = useLocalStorage<string | null>('hunter_status:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 760px;
  background: linear-gradient(180deg, var(--c-dark) 0%, var(--c-dark-alt) 100%);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.5),
    0 0 1px rgba(212, 169, 106, 0.1);
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.content-area {
  padding: 14px;
  min-height: 0;
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
