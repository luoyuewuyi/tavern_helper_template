<template>
  <div class="team-panel">
    <div class="section-title">⧫ 队伍</div>

    <div v-if="!_.isEmpty(store.data.队友)" class="team-list">
      <div
        v-for="(mate, name) in store.data.队友"
        :key="name"
        class="mate-card"
        :class="{ expanded: expandedMate === name }"
        @click="toggleExpand(name as string)"
      >
        <!-- 卡片头部：名字 + 职业 + 等级 -->
        <div class="mate-header">
          <div class="mate-identity">
            <span class="mate-name">{{ name }}</span>
            <span class="mate-job">{{ mate.职业 }}</span>
          </div>
          <span class="mate-level">Lv.{{ mate.等级 }}</span>
        </div>

        <!-- HP 条 -->
        <div class="hp-row">
          <span class="hp-label">HP</span>
          <div class="hp-track">
            <div class="hp-fill" :style="{ width: hpPercent(mate) + '%' }" :class="hpClass(mate)"></div>
          </div>
          <span class="hp-value">{{ mate.HP }}/{{ mate.HP上限 }}</span>
        </div>

        <!-- 好感度条 -->
        <div class="favor-row">
          <span class="favor-label">好感</span>
          <div class="favor-track">
            <div
              class="favor-fill"
              :style="{ width: mate.好感度 + '%' }"
              :class="{ high: mate.好感度 >= 70, low: mate.好感度 <= 30 }"
            ></div>
          </div>
          <span class="favor-value">{{ mate.好感度 }}</span>
        </div>

        <!-- 状态 -->
        <div class="mate-status">
          <span class="status-dot" :class="getStatusClass(mate.状态)">●</span>
          {{ mate.状态 }}
          <span class="expand-hint">{{ expandedMate === name ? '▲' : '▼' }}</span>
        </div>

        <!-- 可展开详情区域 -->
        <Transition name="slide">
          <div v-if="expandedMate === name" class="mate-details" @click.stop>
            <!-- 六维属性迷你条 -->
            <div class="detail-section">
              <div class="detail-title">◈ 属性</div>
              <div class="attr-mini-grid">
                <div v-for="(val, attr) in mate.六维属性" :key="attr" class="attr-mini-row">
                  <span class="attr-mini-icon">{{ attrIcons[attr as string] || '◇' }}</span>
                  <span class="attr-mini-name">{{ attr }}</span>
                  <div class="attr-mini-track">
                    <div class="attr-mini-fill" :style="{ width: Math.min((val / 50) * 100, 100) + '%' }"></div>
                  </div>
                  <span class="attr-mini-val">{{ val }}</span>
                </div>
              </div>
            </div>

            <!-- 技能列表 -->
            <div class="detail-section" v-if="!_.isEmpty(mate.技能)">
              <div class="detail-title">✦ 技能</div>
              <div class="skill-mini-list">
                <div
                  v-for="(skill, sName) in mate.技能"
                  :key="sName"
                  class="skill-mini-card"
                  :class="'quality-border-' + skill.等级.toLowerCase()"
                >
                  <div class="skill-mini-header">
                    <span class="skill-mini-name">{{ sName }}</span>
                    <span class="skill-mini-type">{{ skill.类型 }}</span>
                    <span class="quality-tag" :class="'quality-' + skill.等级.toLowerCase()">{{ skill.等级 }}</span>
                  </div>
                  <div class="skill-mini-desc">{{ skill.描述 }}</div>
                </div>
              </div>
            </div>

            <!-- 装备简览 -->
            <div class="detail-section" v-if="hasEquipment(mate)">
              <div class="detail-title">⛨ 装备</div>
              <div class="equip-mini-grid">
                <div
                  v-for="(equip, slot) in mate.装备"
                  :key="slot"
                  class="equip-mini-item"
                  :class="{
                    empty: equip.名称 === '空置',
                    ['quality-dot-' + equip.品质.toLowerCase()]: equip.名称 !== '空置',
                  }"
                >
                  <span class="equip-mini-slot">{{ slotIcons[slot as string] || '◇' }}</span>
                  <span class="equip-mini-name" v-if="equip.名称 !== '空置'">{{ equip.名称 }}</span>
                  <span class="equip-mini-name empty-name" v-else>空置</span>
                  <span
                    v-if="equip.名称 !== '空置'"
                    class="equip-mini-quality"
                    :class="'quality-' + equip.品质.toLowerCase()"
                    >{{ equip.品质 }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- 主角评价 -->
        <div class="mate-comment" v-if="mate.主角评价">「{{ mate.主角评价 }}」</div>
      </div>
    </div>
    <div v-else class="empty-hint">尚无队友，在副本中寻找同伴吧</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

// 当前展开的队友名
const expandedMate = ref<string | null>(null);

function toggleExpand(name: string) {
  expandedMate.value = expandedMate.value === name ? null : name;
}

// 属性图标
const attrIcons: Record<string, string> = {
  力量: '💪',
  敏捷: '⚡',
  体质: '🛡',
  智力: '🧠',
  感知: '👁',
  魅力: '✨',
};

// 装备栏图标
const slotIcons: Record<string, string> = {
  武器: '⚔',
  头部: '👑',
  上身: '🧥',
  下身: '👖',
  鞋子: '👢',
  饰品: '💎',
};

// HP 百分比
function hpPercent(mate: { HP: number; HP上限: number }): number {
  return Math.max(0, Math.min(100, (mate.HP / mate.HP上限) * 100));
}

// HP 颜色等级
function hpClass(mate: { HP: number; HP上限: number }): string {
  const pct = (mate.HP / mate.HP上限) * 100;
  if (pct > 60) return 'hp-good';
  if (pct > 30) return 'hp-warn';
  return 'hp-danger';
}

// 状态文字对应的颜色
function getStatusClass(status: string): string {
  if (status.includes('正常') || status.includes('良好')) return 'good';
  if (status.includes('受伤') || status.includes('虚弱')) return 'warn';
  if (status.includes('濒死') || status.includes('失踪') || status.includes('死亡')) return 'danger';
  return 'neutral';
}

// 是否有有效装备
function hasEquipment(mate: { 装备: Record<string, { 名称: string }> }): boolean {
  return !_.isEmpty(mate.装备);
}
</script>

<style lang="scss" scoped>
.team-panel {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-cyan);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// ========== 队友卡片 ==========
.mate-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-card-hover);
    border-color: rgba(6, 182, 212, 0.3);
  }

  &.expanded {
    border-color: var(--accent-cyan);
    box-shadow: 0 0 8px rgba(6, 182, 212, 0.15);
  }
}

// ========== 头部 ==========
.mate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.mate-identity {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mate-name {
  font-size: 13px;
  font-weight: 700;
}

.mate-job {
  font-size: 10px;
  color: var(--accent-cyan);
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  padding: 1px 6px;
  border-radius: 2px;
}

.mate-level {
  font-family: var(--font-data);
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-amber);
}

// ========== HP 条 ==========
.hp-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.hp-label {
  font-size: 10px;
  color: var(--text-dim);
  width: 24px;
  font-family: var(--font-data);
  font-weight: 600;
}

.hp-track {
  flex: 1;
  height: 5px;
  background: rgba(30, 58, 95, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;

  &.hp-good {
    background: linear-gradient(90deg, var(--accent-green), #34d399);
  }
  &.hp-warn {
    background: linear-gradient(90deg, var(--accent-amber), #fbbf24);
  }
  &.hp-danger {
    background: linear-gradient(90deg, var(--accent-red), #f87171);
    animation: pulse-bar 1.5s ease-in-out infinite;
  }
}

.hp-value {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--text-secondary);
  min-width: 48px;
  text-align: right;
}

// ========== 好感度条 ==========
.favor-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.favor-label {
  font-size: 10px;
  color: var(--text-dim);
  width: 24px;
}

.favor-track {
  flex: 1;
  height: 5px;
  background: rgba(30, 58, 95, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.favor-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
  border-radius: 3px;
  transition: width 0.5s ease;

  &.high {
    background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan));
  }
  &.low {
    background: linear-gradient(90deg, var(--accent-red), var(--accent-amber));
  }
}

.favor-value {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--text-secondary);
  min-width: 24px;
  text-align: right;
}

// ========== 状态 ==========
.mate-status {
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 3px;
}

.status-dot {
  font-size: 8px;
  &.good {
    color: var(--accent-green);
  }
  &.warn {
    color: var(--accent-amber);
  }
  &.danger {
    color: var(--accent-red);
  }
  &.neutral {
    color: var(--text-dim);
  }
}

.expand-hint {
  margin-left: auto;
  font-size: 9px;
  color: var(--text-dim);
  transition: color 0.2s;
}

.mate-card:hover .expand-hint {
  color: var(--accent-cyan);
}

// ========== 展开详情 ==========
.mate-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  cursor: default;
}

.detail-section {
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-cyan);
  margin-bottom: 6px;
  opacity: 0.8;
}

// --- 属性迷你条 ---
.attr-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
}

.attr-mini-row {
  display: flex;
  align-items: center;
  gap: 3px;
}

.attr-mini-icon {
  font-size: 10px;
  width: 14px;
  text-align: center;
}

.attr-mini-name {
  font-size: 10px;
  color: var(--text-dim);
  width: 20px;
}

.attr-mini-track {
  flex: 1;
  height: 4px;
  background: rgba(30, 58, 95, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.attr-mini-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
  border-radius: 2px;
  transition: width 0.3s ease;
}

.attr-mini-val {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--text-primary);
  width: 22px;
  text-align: right;
  font-weight: 600;
}

// --- 技能迷你列表 ---
.skill-mini-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skill-mini-card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-left: 3px solid;
  padding: 5px 8px;
  border-radius: 3px;
}

.skill-mini-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.skill-mini-name {
  font-size: 11px;
  font-weight: 700;
  flex: 1;
}

.skill-mini-type {
  font-size: 9px;
  color: var(--text-dim);
  padding: 0 4px;
  border: 1px solid var(--border);
  border-radius: 2px;
}

.skill-mini-desc {
  font-size: 10px;
  color: var(--text-dim);
}

// --- 装备迷你格 ---
.equip-mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.equip-mini-item {
  display: flex;
  align-items: center;
  gap: 3px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  padding: 4px 6px;
  border-radius: 2px;
  border-left: 2px solid var(--border);

  &.empty {
    opacity: 0.45;
  }
}

.equip-mini-slot {
  font-size: 10px;
}

.equip-mini-name {
  font-size: 10px;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.empty-name {
    color: var(--text-dim);
    font-weight: 400;
    font-style: italic;
  }
}

.equip-mini-quality {
  font-family: var(--font-data);
  font-size: 8px;
  font-weight: 700;
  flex-shrink: 0;
}

// ========== 主角评价 ==========
.mate-comment {
  font-size: 10px;
  color: var(--text-dim);
  font-style: italic;
  margin-top: 4px;
}

// ========== 空提示 ==========
.empty-hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 11px;
  padding: 16px;
  font-style: italic;
}

// ========== 展开动画 ==========
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 600px;
}

// ========== HP 危险脉冲 ==========
@keyframes pulse-bar {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

// ========== 品质色 ==========
// 品质边框色
.quality-border-g {
  border-left-color: var(--quality-g);
}
.quality-border-f {
  border-left-color: var(--quality-f);
}
.quality-border-e {
  border-left-color: var(--quality-e);
}
.quality-border-d {
  border-left-color: var(--quality-d);
}
.quality-border-c {
  border-left-color: var(--quality-c);
}
.quality-border-b {
  border-left-color: var(--quality-b);
}
.quality-border-a {
  border-left-color: var(--quality-a);
}
.quality-border-s {
  border-left-color: var(--quality-s);
}
.quality-border-ss {
  border-left-color: var(--quality-ss);
}
.quality-border-sss {
  border-left-color: var(--quality-sss);
}

// 品质文字色
.quality-g {
  color: var(--quality-g);
  border-color: var(--quality-g);
}
.quality-f {
  color: var(--quality-f);
  border-color: var(--quality-f);
}
.quality-e {
  color: var(--quality-e);
  border-color: var(--quality-e);
}
.quality-d {
  color: var(--quality-d);
  border-color: var(--quality-d);
}
.quality-c {
  color: var(--quality-c);
  border-color: var(--quality-c);
}
.quality-b {
  color: var(--quality-b);
  border-color: var(--quality-b);
}
.quality-a {
  color: var(--quality-a);
  border-color: var(--quality-a);
}
.quality-s {
  color: var(--quality-s);
  border-color: var(--quality-s);
}
.quality-ss {
  color: var(--quality-ss);
  border-color: var(--quality-ss);
}
.quality-sss {
  color: var(--quality-sss);
  border-color: var(--quality-sss);
}

// 品质圆点色（装备简览左边框）
.quality-dot-g {
  border-left-color: var(--quality-g);
}
.quality-dot-f {
  border-left-color: var(--quality-f);
}
.quality-dot-e {
  border-left-color: var(--quality-e);
}
.quality-dot-d {
  border-left-color: var(--quality-d);
}
.quality-dot-c {
  border-left-color: var(--quality-c);
}
.quality-dot-b {
  border-left-color: var(--quality-b);
}
.quality-dot-a {
  border-left-color: var(--quality-a);
}
.quality-dot-s {
  border-left-color: var(--quality-s);
}
.quality-dot-ss {
  border-left-color: var(--quality-ss);
}
.quality-dot-sss {
  border-left-color: var(--quality-sss);
}

.quality-tag {
  font-family: var(--font-data);
  font-size: 8px;
  font-weight: 700;
  padding: 0 4px;
  border-radius: 2px;
  border: 1px solid;
}

@media (max-width: 400px) {
  .attr-mini-grid {
    grid-template-columns: 1fr;
  }
  .equip-mini-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
