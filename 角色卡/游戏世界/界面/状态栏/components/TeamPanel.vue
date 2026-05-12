<template>
  <div class="team-layout">
    <div
      v-for="(player, name) in store.data.玩家"
      :key="name"
      class="player-card"
      :class="{ dead: player.状态 === '死亡' }"
    >
      <div class="player-header">
        <span class="player-name">{{ name }}</span>
        <span class="player-level">Lv.{{ player.等级 }}</span>
        <span class="player-status" :class="statusClass(player.状态)">{{ player.状态 }}</span>
      </div>

      <!-- HP Bar -->
      <div class="stat-row">
        <span class="stat-label">HP</span>
        <div class="hp-track">
          <div
            class="hp-fill"
            :style="{ width: hpPercent(player) + '%' }"
            :class="{ critical: hpPercent(player) < 30 }"
          ></div>
        </div>
        <span class="stat-value hp-value">{{ player.HP }}/{{ player.最大HP }}</span>
      </div>

      <!-- ATK / DEF -->
      <div class="stat-row compact">
        <span class="stat-chip">⚔ {{ player.攻击 }}</span>
        <span class="stat-chip">🛡 {{ player.防御 }}</span>
        <span class="stat-chip exp">✦ {{ player.经验值 }}/100</span>
      </div>

      <!-- Skill -->
      <div class="skill-row">
        <span class="skill-name" :class="{ active: player.技能.是否激活 }">
          {{ player.技能.是否激活 ? '✨' : '◇' }} {{ player.技能.名称 }}
          <span class="skill-lv">Lv.{{ player.技能.等级 }}</span>
        </span>
        <span v-if="player.技能.是否激活" class="skill-tag active-tag"> 激活中 ({{ player.技能.持续剩余 }}回合) </span>
        <span v-else-if="player.技能.冷却剩余 > 0" class="skill-tag cd-tag"> 冷却 {{ player.技能.冷却剩余 }}回合 </span>
        <span v-else class="skill-tag ready-tag">就绪</span>
      </div>
    </div>

    <div v-if="_.isEmpty(store.data.玩家)" class="empty">无存活玩家</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function hpPercent(player: { HP: number; 最大HP: number }): number {
  return player.最大HP > 0 ? Math.max(0, (player.HP / player.最大HP) * 100) : 0;
}

function statusClass(status: string): string {
  switch (status) {
    case '正常':
      return 'status-normal';
    case '受伤':
      return 'status-injured';
    case '濒死':
      return 'status-dying';
    case '死亡':
      return 'status-dead';
    default:
      return '';
  }
}
</script>

<style lang="scss" scoped>
.team-layout {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.player-card {
  background: var(--c-stone);
  border: 1px solid var(--c-dim);
  padding: 8px 10px;
  transition: border-color 0.2s;
}

.player-card:hover {
  border-color: var(--c-mist);
}

.player-card.dead {
  opacity: 0.4;
}

.player-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.player-name {
  font-weight: bold;
  color: var(--c-bone);
  font-size: 0.88rem;
}

.player-level {
  color: var(--c-gold);
  font-size: 0.72rem;
  font-weight: bold;
}

.player-status {
  margin-left: auto;
  font-size: 0.68rem;
  padding: 1px 5px;
  border: 1px solid;
}

.status-normal {
  color: var(--c-poison);
  border-color: var(--c-poison);
}

.status-injured {
  color: var(--c-gold);
  border-color: var(--c-gold);
}

.status-dying {
  color: var(--c-blood);
  border-color: var(--c-blood);
  animation: pulse 1.2s ease-in-out infinite;
}

.status-dead {
  color: var(--c-mist);
  border-color: var(--c-dim);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.stat-row.compact {
  gap: 8px;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--c-mist);
  min-width: 18px;
}

.hp-track {
  flex: 1;
  height: 6px;
  background: var(--c-abyss);
  border: 1px solid var(--c-blood-dark);
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  background: var(--c-blood);
  transition: width 0.4s ease;
}

.hp-fill.critical {
  animation: hpBlink 0.8s infinite;
}

@keyframes hpBlink {
  0%,
  100% {
    background: var(--c-blood);
  }
  50% {
    background: var(--c-blood-dark);
  }
}

.stat-value {
  font-size: 0.72rem;
  color: var(--c-parchment);
  min-width: 42px;
  text-align: right;
}

.hp-value {
  color: var(--c-blood);
}

.stat-chip {
  font-size: 0.72rem;
  color: var(--c-parchment);
  background: var(--c-abyss);
  padding: 1px 5px;
  border: 1px solid var(--c-dim);
}

.stat-chip.exp {
  color: var(--c-gold);
}

.skill-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.skill-name {
  font-size: 0.78rem;
  color: var(--c-mist);
}

.skill-name.active {
  color: var(--c-arcane);
}

.skill-lv {
  font-size: 0.65rem;
  color: var(--c-arcane-dim);
}

.skill-tag {
  font-size: 0.65rem;
  padding: 1px 4px;
  border: 1px solid;
}

.active-tag {
  color: var(--c-arcane);
  border-color: var(--c-arcane-dim);
  background: rgba(106, 90, 205, 0.1);
}

.cd-tag {
  color: var(--c-frost);
  border-color: var(--c-frost);
  opacity: 0.7;
}

.ready-tag {
  color: var(--c-poison);
  border-color: var(--c-poison);
}

.empty {
  text-align: center;
  color: var(--c-mist);
  padding: 16px;
  font-style: italic;
}
</style>
