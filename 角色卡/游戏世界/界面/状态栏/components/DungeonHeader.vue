<template>
  <div class="header">
    <div class="title-row">
      <span class="tower-icon">🗼</span>
      <span class="tower-name">魔 塔</span>
      <span class="floor-badge">{{ store.data.世界状态.当前楼层 }}F</span>
    </div>
    <div class="info-row">
      <span class="info-item">
        <span class="label">阶段</span>
        <span class="value" :class="phaseClass">{{ store.data.世界状态.当前阶段 }}</span>
      </span>
      <span class="info-item">
        <span class="label">回合</span>
        <span class="value">{{ store.data.世界状态.当前回合 }}</span>
      </span>
      <span class="info-item">
        <span class="label">时间</span>
        <span class="value">{{ store.data.世界状态.当前时间 }}</span>
      </span>
    </div>
    <div class="team-row">
      <span class="label">存活</span>
      <span class="survivors">
        <span v-for="i in 5" :key="i" class="dot" :class="{ dead: i > store.data.团队.存活人数 }"></span>
      </span>
      <span class="count">{{ store.data.团队.存活人数 }}/5</span>
      <span v-if="store.data.团队.已死亡.length > 0" class="dead-list">
        † {{ store.data.团队.已死亡.join(', ') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const phaseClass = computed(() => {
  switch (store.data.世界状态.当前阶段) {
    case '战斗':
      return 'phase-combat';
    case '探索':
      return 'phase-explore';
    case '事件':
      return 'phase-event';
    case '休息':
      return 'phase-rest';
    default:
      return '';
  }
});
</script>

<style lang="scss" scoped>
.header {
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(42, 42, 58, 0.9) 0%, var(--c-dark-stone) 100%);
  border-bottom: 2px solid var(--c-dim);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tower-icon {
  font-size: 1.2rem;
}

.tower-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--c-bone);
  letter-spacing: 4px;
}

.floor-badge {
  margin-left: auto;
  background: var(--c-blood);
  color: #fff;
  padding: 2px 8px;
  font-weight: bold;
  font-size: 0.85rem;
  border: 1px solid var(--c-blood-dark);
}

.info-row {
  display: flex;
  gap: 12px;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px dashed var(--c-dim);
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  gap: 4px;
  align-items: center;
}

.label {
  color: var(--c-mist);
  font-size: 0.75rem;
}

.value {
  color: var(--c-bone);
  font-weight: bold;
  font-size: 0.82rem;
}

.phase-combat {
  color: var(--c-blood) !important;
}

.phase-explore {
  color: var(--c-frost) !important;
}

.phase-event {
  color: var(--c-gold) !important;
}

.phase-rest {
  color: var(--c-poison) !important;
}

.team-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.survivors {
  display: flex;
  gap: 3px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--c-poison);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dot.dead {
  background: var(--c-blood-dark);
  opacity: 0.5;
}

.count {
  color: var(--c-bone);
  font-weight: bold;
  font-size: 0.8rem;
}

.dead-list {
  color: var(--c-blood);
  font-size: 0.75rem;
  font-style: italic;
}
</style>
