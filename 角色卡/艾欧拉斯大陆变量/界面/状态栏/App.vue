<template>
  <div class="epic-container">
    <div class="epic-frame">
      <!-- 黄金角标设计 -->
      <div class="corner tl"></div>
      <div class="corner tr"></div>
      <div class="corner bl"></div>
      <div class="corner br"></div>

      <WorldSection />

      <TabNav v-model="active_tab" :tabs="tabs" />

      <div class="content-wrapper">
        <Transition name="fade-slide" mode="out-in">
          <div :key="active_tab" class="pane-content">
            <PlayerStats v-if="active_tab === 'status'" />
            <NPCSection v-else-if="active_tab === 'npcs'" />
            <StandSelector v-else-if="active_tab === 'summon'" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NPCSection from './components/NPCSection.vue';
import PlayerStats from './components/PlayerStats.vue';
import StandSelector from './components/StandSelector.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: 'status', label: '角色状态' },
  { id: 'npcs', label: '众人之像' },
  { id: 'summon', label: '灵魂契约' },
];

const active_tab = ref('status');
</script>

<style lang="scss" scoped>
.epic-container {
  width: 100%;
  max-width: 720px;
  margin: 20px auto;
  padding: 15px;
  box-sizing: border-box;
}

.epic-frame {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  background:
    radial-gradient(circle at center, rgba(139, 108, 66, 0.05), transparent),
    url('https://www.transparenttextures.com/patterns/black-paper.png');
}

.pane-content {
  padding: 5px;
}

/* 装饰性角标 */
.corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid var(--c-gold-bright);
  z-index: 10;
  pointer-events: none;

  &.tl {
    top: -5px;
    left: -5px;
    border-right: none;
    border-bottom: none;
  }
  &.tr {
    top: -5px;
    right: -5px;
    border-left: none;
    border-bottom: none;
  }
  &.bl {
    bottom: -5px;
    left: -5px;
    border-right: none;
    border-top: none;
  }
  &.br {
    bottom: -5px;
    right: -5px;
    border-left: none;
    border-top: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: var(--c-ruby-red);
    box-shadow: 0 0 10px var(--c-ruby-red);
    border-radius: 50%;
  }

  &.tl::after {
    top: -3px;
    left: -3px;
  }
  &.tr::after {
    top: -3px;
    right: -3px;
  }
  &.bl::after {
    bottom: -3px;
    left: -3px;
  }
  &.br::after {
    bottom: -3px;
    right: -3px;
  }
}

/* 动画效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
