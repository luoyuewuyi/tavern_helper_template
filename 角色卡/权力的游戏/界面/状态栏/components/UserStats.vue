<template>
  <div class="user-layout">
    <!-- 身份信息 -->
    <div class="identity-section">
      <div class="identity-row">
        <span class="label">身份</span>
        <span class="value">{{ store.data.主角.身份 }}</span>
      </div>
      <div class="identity-row">
        <span class="label">家族</span>
        <span class="value">{{ store.data.主角.家族 }}</span>
      </div>
      <div class="identity-row">
        <span class="label">头衔</span>
        <span class="value">{{ store.data.主角.头衔 }}</span>
      </div>
      <div class="identity-row">
        <span class="label">状态</span>
        <span class="value" :class="healthClass">{{ store.data.主角.生命状态 }}</span>
      </div>
    </div>

    <!-- 声望和金龙 -->
    <div class="resource-section">
      <div class="resource-bar">
        <span class="resource-label">🏅 声望</span>
        <div class="bar-track">
          <div class="bar-fill reputation" :style="{ width: store.data.主角.声望 + '%' }"></div>
        </div>
        <span class="resource-value">{{ store.data.主角.声望 }}</span>
      </div>
      <div class="resource-bar">
        <span class="resource-label">🪙 金龙</span>
        <span class="resource-value gold">{{ store.data.主角.金龙 }}</span>
      </div>
    </div>

    <!-- 六维技能 -->
    <div class="section-head">⚔ 技能面板</div>
    <div class="skills-grid">
      <div v-for="(value, skill) in store.data.主角.技能" :key="skill" class="skill-item">
        <div class="skill-header">
          <span class="skill-icon">{{ getSkillIcon(skill as string) }}</span>
          <span class="skill-name">{{ skill }}</span>
          <span class="skill-value">{{ value }}</span>
        </div>
        <div class="skill-track">
          <div class="skill-fill" :style="{ width: value + '%' }"></div>
        </div>
        <span class="skill-rank">{{ getSkillRank(value as number) }}</span>
      </div>
    </div>

    <!-- 物品栏 -->
    <div class="section-head">🎒 物品栏</div>
    <div v-if="!_.isEmpty(store.data.主角.物品栏)" class="inventory-grid">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="item-row">
        <div class="item-icon">{{ getItemIcon(name as string) }}</div>
        <div class="item-detail">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-count">x{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-state">行囊空空，身无长物...</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

// 生命状态对应的CSS类
const healthClass = computed(() => {
  const status = store.data.主角.生命状态;
  if (status === '健康') return 'health-good';
  if (status === '轻伤') return 'health-minor';
  if (status === '受伤' || status === '中毒') return 'health-hurt';
  return 'health-critical';
});

// 技能图标
function getSkillIcon(skill: string): string {
  const icons: Record<string, string> = {
    剑术: '⚔️',
    骑术: '🐎',
    弓箭: '🏹',
    政治: '🏛️',
    谋略: '🧠',
    口才: '💬',
  };
  return icons[skill] || '⭐';
}

// 技能等级
function getSkillRank(value: number): string {
  if (value <= 20) return '新手';
  if (value <= 40) return '熟练';
  if (value <= 60) return '精通';
  if (value <= 80) return '大师';
  return '传奇';
}

// 物品图标
function getItemIcon(name: string): string {
  if (name.includes('剑') || name.includes('刀')) return '⚔️';
  if (name.includes('盾')) return '🛡️';
  if (name.includes('弓') || name.includes('箭')) return '🏹';
  if (name.includes('粮') || name.includes('食') || name.includes('面包') || name.includes('肉')) return '🍖';
  if (name.includes('药') || name.includes('治')) return '🧪';
  if (name.includes('金') || name.includes('币') || name.includes('钱')) return '💰';
  if (name.includes('书') || name.includes('信') || name.includes('卷')) return '📜';
  if (name.includes('斗篷') || name.includes('甲') || name.includes('盔')) return '🛡️';
  if (name.includes('马')) return '🐎';
  if (name.includes('钥匙')) return '🔑';
  return '📦';
}
</script>

<style lang="scss" scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.identity-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.identity-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(74, 74, 106, 0.2);
  border-left: 2px solid var(--c-steel);
}

.label {
  color: var(--c-silver);
  font-size: 0.75rem;
  min-width: 28px;
}

.value {
  color: var(--c-parchment);
  font-size: 0.82rem;
  font-weight: bold;
}

.health-good {
  color: #4caf50;
}
.health-minor {
  color: var(--c-gold);
}
.health-hurt {
  color: #ff9800;
}
.health-critical {
  color: var(--c-fire);
}

.resource-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.resource-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
}

.resource-label {
  font-size: 0.78rem;
  min-width: 60px;
  color: var(--c-silver);
}

.bar-track {
  flex: 1;
  height: 8px;
  border: 1px solid var(--c-steel);
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: width 0.3s ease;
}

.bar-fill.reputation {
  background: linear-gradient(90deg, var(--c-steel) 0%, var(--c-gold) 100%);
}

.resource-value {
  font-size: 0.82rem;
  font-weight: bold;
  min-width: 30px;
  text-align: right;
}

.resource-value.gold {
  color: var(--c-lannister-gold);
}

.section-head {
  font-size: 0.88rem;
  border-bottom: 1px solid var(--c-gold);
  display: inline-block;
  padding-bottom: 2px;
  margin-bottom: 4px;
  font-weight: bold;
  color: var(--c-gold);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.skill-item {
  padding: 5px 8px;
  background: rgba(74, 74, 106, 0.2);
  border: 1px solid var(--c-steel);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 3px;
}

.skill-icon {
  font-size: 0.8rem;
}

.skill-name {
  font-size: 0.78rem;
  font-weight: bold;
  flex: 1;
}

.skill-value {
  font-size: 0.75rem;
  color: var(--c-gold);
  font-weight: bold;
}

.skill-track {
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--c-steel);
  overflow: hidden;
  margin-bottom: 2px;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-ice) 0%, var(--c-gold) 50%, var(--c-fire) 100%);
  transition: width 0.3s ease;
}

.skill-rank {
  font-size: 0.65rem;
  color: var(--c-silver);
  font-style: italic;
}

.inventory-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-row {
  display: flex;
  align-items: center;
  border: 1px solid var(--c-steel);
  padding: 6px 8px;
  background: rgba(74, 74, 106, 0.15);
  transition:
    transform 0.2s,
    background 0.2s;
}

.item-row:hover {
  transform: translateX(3px);
  background: rgba(74, 74, 106, 0.3);
}

.item-icon {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 1rem;
}

.item-detail {
  flex: 1;
}

.item-name {
  font-weight: bold;
  display: block;
  font-size: 0.82rem;
}

.item-desc {
  font-size: 0.72rem;
  color: var(--c-silver);
}

.item-count {
  background: var(--c-steel);
  color: var(--c-parchment);
  padding: 2px 5px;
  font-size: 0.7rem;
  border-radius: 2px;
}

.empty-state {
  text-align: center;
  color: var(--c-silver);
  padding: 15px;
  font-style: italic;
  font-size: 0.82rem;
}

@media (max-width: 600px) {
  .identity-section {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
