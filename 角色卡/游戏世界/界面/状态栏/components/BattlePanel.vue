<template>
  <div v-if="store.data.战斗状态.是否战斗中" class="battle-panel">
    <div class="battle-header">
      <span class="battle-icon">⚔</span>
      <span class="battle-title">战斗中</span>
      <span class="round-badge">第 {{ store.data.战斗状态.战斗回合数 }} 回合</span>
    </div>
    <div class="enemy-list">
      <div v-for="(enemy, name) in store.data.战斗状态.敌人" :key="name" class="enemy-card">
        <div class="enemy-name">{{ name }}</div>
        <div class="enemy-stats">
          <span class="stat">⚔{{ enemy.攻击 }}</span>
          <span class="stat">🛡{{ enemy.防御 }}</span>
        </div>
        <div class="hp-bar-container">
          <div class="hp-bar-track">
            <div
              class="hp-bar-fill"
              :style="{ width: Math.max(0, (enemy.HP / enemy.最大HP) * 100) + '%' }"
              :class="{ critical: enemy.HP / enemy.最大HP < 0.3 }"
            ></div>
          </div>
          <span class="hp-text">{{ enemy.HP }}/{{ enemy.最大HP }}</span>
        </div>
      </div>
      <div v-if="_.isEmpty(store.data.战斗状态.敌人)" class="no-enemy">战斗已结束</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.battle-panel {
  background: linear-gradient(180deg, rgba(196, 48, 48, 0.08) 0%, transparent 100%);
  border-bottom: 2px solid var(--c-blood-dark);
  padding: 8px 12px;
}

.battle-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.battle-icon {
  font-size: 1rem;
}

.battle-title {
  color: var(--c-blood);
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 2px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.round-badge {
  margin-left: auto;
  background: var(--c-stone);
  color: var(--c-bone);
  padding: 2px 8px;
  font-size: 0.75rem;
  border: 1px solid var(--c-dim);
}

.enemy-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.enemy-card {
  background: var(--c-stone);
  border: 1px solid var(--c-dim);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.enemy-name {
  font-weight: bold;
  color: var(--c-blood);
  font-size: 0.85rem;
  min-width: 60px;
}

.enemy-stats {
  display: flex;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--c-mist);
}

.stat {
  white-space: nowrap;
}

.hp-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
}

.hp-bar-track {
  flex: 1;
  height: 8px;
  background: var(--c-abyss);
  border: 1px solid var(--c-dim);
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  background: var(--c-blood);
  transition: width 0.4s ease;
}

.hp-bar-fill.critical {
  animation: hpPulse 0.8s ease-in-out infinite;
}

@keyframes hpPulse {
  0%,
  100% {
    background: var(--c-blood);
  }
  50% {
    background: var(--c-blood-dark);
  }
}

.hp-text {
  font-size: 0.72rem;
  color: var(--c-mist);
  white-space: nowrap;
  min-width: 48px;
  text-align: right;
}

.no-enemy {
  text-align: center;
  color: var(--c-mist);
  font-style: italic;
  padding: 6px;
  font-size: 0.82rem;
}
</style>
