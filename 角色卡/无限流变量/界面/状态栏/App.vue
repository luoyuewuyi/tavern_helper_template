<template>
  <div class="hud-container">
    <!-- 顶部副本信息 -->
    <WorldHeader />

    <!-- 经验条 -->
    <ExpBar />

    <!-- 生存资源条 -->
    <ResourceBars />

    <!-- Tab 导航 -->
    <TabNav v-model="active_tab" :tabs="tabs" />

    <!-- Tab 内容区 -->
    <div v-if="active_tab" class="content-area">
      <Transition name="fade" mode="out-in">
        <AttributePanel v-if="active_tab === 'attribute'" />
        <SkillPanel v-else-if="active_tab === 'skill'" />
        <EquipmentPanel v-else-if="active_tab === 'equipment'" />
        <ShopPanel v-else-if="active_tab === 'shop'" />
        <TeamPanel v-else-if="active_tab === 'team'" />
        <QuestPanel v-else-if="active_tab === 'quest'" />
        <DungeonLog v-else-if="active_tab === 'log'" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttributePanel from './components/AttributePanel.vue';
import DungeonLog from './components/DungeonLog.vue';
import EquipmentPanel from './components/EquipmentPanel.vue';
import ExpBar from './components/ExpBar.vue';
import QuestPanel from './components/QuestPanel.vue';
import ResourceBars from './components/ResourceBars.vue';
import ShopPanel from './components/ShopPanel.vue';
import SkillPanel from './components/SkillPanel.vue';
import TabNav from './components/TabNav.vue';
import TeamPanel from './components/TeamPanel.vue';
import WorldHeader from './components/WorldHeader.vue';

const tabs = [
  { id: 'attribute', label: '⬡ 属性', icon: '◈' },
  { id: 'skill', label: '✦ 能力', icon: '✦' },
  { id: 'equipment', label: '⛨ 装备', icon: '⛨' },
  { id: 'shop', label: '◉ 商店', icon: '◉' },
  { id: 'team', label: '⧫ 队伍', icon: '⧫' },
  { id: 'quest', label: '◆ 任务', icon: '◆' },
  { id: 'log', label: '▣ 日志', icon: '▣' },
];

const active_tab = useLocalStorage<string | null>('infinite_status:active_tab', null);
</script>

<style lang="scss" scoped>
.hud-container {
  width: 100%;
  max-width: 720px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  box-shadow:
    var(--glow-cyan),
    inset 0 1px 0 rgba(6, 182, 212, 0.05);
  display: flex;
  flex-direction: column;
  font-family: var(--font-hud);
  color: var(--text-primary);
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  // 顶部扫描线装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-cyan), transparent);
  }
}

.content-area {
  padding: 10px 12px;
  min-height: 100px;
}

// 淡入动画
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
