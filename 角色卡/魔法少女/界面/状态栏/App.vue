<template>
  <div class="mg-card">
    <WorldSection />

    <HeroStats />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '风间悠'" class="tab-pane active">
        <CharacterPanel chara-key="风间悠" theme-color="var(--mg-love-pink)" />
      </div>
      <div v-else-if="active_tab === '神代雪'" class="tab-pane active">
        <CharacterPanel chara-key="神代雪" theme-color="var(--mg-magic-blue)" />
      </div>
      <div v-else-if="active_tab === '桐叶月'" class="tab-pane active">
        <CharacterPanel chara-key="桐叶月" theme-color="var(--mg-fame-gold)" />
      </div>
      <div v-else-if="active_tab === '水宫希'" class="tab-pane active">
        <CharacterPanel chara-key="水宫希" theme-color="var(--mg-trust-cyan)" />
      </div>
      <div v-else-if="active_tab === '物品'" class="tab-pane active">
        <InventoryPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import HeroStats from './components/HeroStats.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: '风间悠', label: '悠', emoji: '🎀' },
  { id: '神代雪', label: '雪', emoji: '❄️' },
  { id: '桐叶月', label: '月', emoji: '🌙' },
  { id: '水宫希', label: '希', emoji: '👑' },
  { id: '物品', label: '物品', emoji: '🎒' },
];

const active_tab = useLocalStorage<string | null>('mg_status:active_tab', null);
</script>

<style lang="scss" scoped>
.mg-card {
  width: 100%;
  max-width: 720px;
  background: var(--mg-bg-dark);
  border: 1px solid var(--mg-border);
  box-shadow:
    0 0 20px rgba(107, 63, 160, 0.3),
    inset 0 0 30px rgba(26, 16, 40, 0.5);
  display: flex;
  flex-direction: column;
  font-family: var(--font-mg);
  color: var(--mg-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  overflow: hidden;
}

.content-area {
  padding: 12px;
  min-height: 0;
  background: var(--mg-bg-card);
}

.tab-pane {
  display: none;
  animation: mgFadeIn 0.35s ease-out;
}

.tab-pane.active {
  display: block;
}

@keyframes mgFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
