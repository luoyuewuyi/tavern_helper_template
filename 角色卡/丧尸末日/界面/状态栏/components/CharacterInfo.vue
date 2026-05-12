<template>
  <div class="character-info">
    <!-- 主角基本信息 -->
    <div class="profile-card">
      <div class="profile-avatar">
        <span class="avatar-icon">👤</span>
        <div class="level-ring">
          <span>Lv.{{ data.主角.等级 }}</span>
        </div>
      </div>
      <div class="profile-details">
        <div class="profile-name">王寅</div>
        <div class="profile-meta">
          <span>{{ data.主角.年龄 }}岁</span>
          <span class="separator">·</span>
          <span>末日第{{ data.时间.末日天数 }}天</span>
        </div>
      </div>
    </div>

    <!-- 异能列表 -->
    <div class="section">
      <div class="section-title">
        <span class="section-icon">⚡</span>
        持有异能
      </div>
      <div v-if="!_.isEmpty(data.主角.异能)" class="ability-list">
        <div
          v-for="(ability, name) in data.主角.异能"
          :key="name as string"
          class="ability-card"
          :class="{ expanded: expandedAbility === name }"
          @click="toggleAbility(name as string)"
        >
          <div class="ability-header">
            <div class="ability-name-row">
              <span class="ability-name">{{ name }}</span>
              <span class="ability-grade" :class="gradeClass(ability.品级)">{{ ability.品级 }}</span>
            </div>
            <div class="ability-stats">
              <span class="stat">Lv.{{ ability.等级 }}</span>
              <div class="energy-mini">
                <div class="energy-mini-fill" :style="{ width: (ability.能量 / 100) * 100 + '%' }"></div>
              </div>
              <span class="stat energy-text">{{ ability.能量 }}</span>
            </div>
          </div>

          <!-- 技能树展开 -->
          <div v-if="expandedAbility === name && !_.isEmpty(ability.技能)" class="skill-tree">
            <div class="skill-title">技能列表</div>
            <div v-for="(skill, skillName) in ability.技能" :key="skillName as string" class="skill-item">
              <span class="skill-name">{{ skillName }}</span>
              <span class="skill-level">Lv.{{ skill.等级 }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-hint">暂未觉醒异能</div>
    </div>

    <!-- 通用技能 -->
    <div class="section">
      <div class="section-title">
        <span class="section-icon">🎯</span>
        掌握技能
      </div>
      <div v-if="!_.isEmpty(data.主角.技能)" class="skill-grid">
        <div v-for="(skill, name) in data.主角.技能" :key="name as string" class="skill-chip">
          <span class="chip-name">{{ name }}</span>
          <span class="chip-level">Lv.{{ skill.等级 }}</span>
        </div>
      </div>
      <div v-else class="empty-hint">暂无技能</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import type { Schema } from '../../schema';

const props = defineProps<{ data: Schema }>();

const expandedAbility = ref<string | null>(null);

function toggleAbility(name: string) {
  expandedAbility.value = expandedAbility.value === name ? null : name;
}

function gradeClass(grade: string): string {
  const g = grade.toUpperCase();
  if (g === 'SSS' || g === 'SS') return 'grade-legendary';
  if (g === 'S') return 'grade-epic';
  if (g === 'A' || g === 'B') return 'grade-rare';
  if (g === 'C' || g === 'D') return 'grade-common';
  return 'grade-low';
}
</script>

<style lang="scss" scoped>
.character-info {
  padding: 12px;
}

// 头像卡片
.profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: linear-gradient(135deg, var(--phone-card), var(--phone-bg));
  border: 1px solid var(--phone-border);
  border-radius: 12px;
  margin-bottom: 16px;
}

.profile-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 32px;
}

.level-ring {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1px 6px;
  background: var(--phone-accent);
  color: var(--phone-bg);
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--phone-text);
}

.profile-meta {
  font-size: 11px;
  color: var(--phone-text-dim);
  margin-top: 2px;
}

.separator {
  margin: 0 4px;
}

// 区块
.section {
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--phone-text);
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--phone-border);
}

.section-icon {
  font-size: 14px;
}

// 异能卡片
.ability-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ability-card {
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--phone-energy);
  }

  &.expanded {
    border-color: var(--phone-energy);
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
  }
}

.ability-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ability-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ability-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--phone-text);
}

.ability-grade {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;

  &.grade-legendary {
    background: linear-gradient(135deg, #ffd700, #ff8c00);
    color: #000;
  }
  &.grade-epic {
    background: linear-gradient(135deg, #9b59b6, #8e44ad);
    color: #fff;
  }
  &.grade-rare {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: #fff;
  }
  &.grade-common {
    background: var(--phone-border);
    color: var(--phone-text);
  }
  &.grade-low {
    background: var(--phone-text-muted);
    color: var(--phone-bg);
  }
}

.ability-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat {
  font-size: 10px;
  color: var(--phone-text-dim);
  font-weight: 600;
}

.energy-mini {
  flex: 1;
  height: 4px;
  background: var(--phone-border);
  border-radius: 2px;
  overflow: hidden;
}

.energy-mini-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--phone-energy), #a855f7);
  border-radius: 2px;
  transition: width 0.3s;
}

.energy-text {
  color: var(--phone-energy);
}

// 技能树
.skill-tree {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--phone-border);
}

.skill-title {
  font-size: 10px;
  color: var(--phone-text-muted);
  margin-bottom: 6px;
  font-weight: 600;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: var(--phone-bg);
  border-radius: 4px;
  margin-bottom: 4px;
}

.skill-name {
  font-size: 11px;
  color: var(--phone-text);
}

.skill-level {
  font-size: 10px;
  color: var(--phone-accent);
  font-weight: 600;
}

// 通用技能
.skill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: 16px;
  transition: all 0.2s;

  &:hover {
    border-color: var(--phone-accent);
  }
}

.chip-name {
  font-size: 11px;
  color: var(--phone-text);
  font-weight: 500;
}

.chip-level {
  font-size: 9px;
  color: var(--phone-accent);
  font-weight: 700;
}

.empty-hint {
  text-align: center;
  color: var(--phone-text-muted);
  font-size: 11px;
  font-style: italic;
  padding: 16px;
}
</style>
