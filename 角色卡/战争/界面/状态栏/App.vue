<template>
  <div class="card">
    <div class="card-header">
      <div class="header-stamp">机 密</div>
      <div class="header-title">审 讯 记 录</div>
      <div class="header-sub">华北日伪特高课 · 审问所</div>
    </div>

    <WorldHeader />

    <StatusBars />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === '囚犯'" class="tab-pane active">
        <PrisonerPanel />
      </div>
      <div v-else-if="active_tab === '暗线'" class="tab-pane active">
        <AgentPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AgentPanel from './components/AgentPanel.vue';
import PrisonerPanel from './components/PrisonerPanel.vue';
import StatusBars from './components/StatusBars.vue';
import TabNav from './components/TabNav.vue';
import WorldHeader from './components/WorldHeader.vue';

const tabs = [
  { id: '囚犯', label: '▣ 囚犯档案' },
  { id: '暗线', label: '▤ 暗线情报' },
];

const active_tab = useLocalStorage<string | null>('war_status:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-bg-card);
  border: 2px solid var(--c-border);
  box-shadow:
    0 0 15px rgba(0, 0, 0, 0.5),
    inset 0 0 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 28px,
    rgba(90, 74, 58, 0.08) 28px,
    rgba(90, 74, 58, 0.08) 29px
  );
  pointer-events: none;
  z-index: 1;
}

.card-header {
  background: linear-gradient(180deg, #1e1914 0%, var(--c-bg-dark) 100%);
  padding: 10px 14px 8px;
  border-bottom: 2px solid var(--c-border);
  text-align: center;
  position: relative;
}

.header-stamp {
  position: absolute;
  top: 4px;
  right: 10px;
  color: var(--c-stamp-red);
  font-family: var(--font-title);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 4px;
  border: 2px solid var(--c-stamp-red);
  padding: 1px 6px;
  transform: rotate(8deg);
  opacity: 0.8;
}

.header-title {
  font-family: var(--font-title);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 8px;
  color: var(--c-text-bright);
  margin-bottom: 2px;
}

.header-sub {
  font-size: 10px;
  color: var(--c-text-dim);
  letter-spacing: 2px;
}

.content-area {
  padding: 10px;
  min-height: 0;
  position: relative;
  z-index: 2;
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
