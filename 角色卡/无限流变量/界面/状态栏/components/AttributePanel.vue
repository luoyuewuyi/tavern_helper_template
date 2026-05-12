<template>
  <div class="attr-panel">
    <!-- 六维属性 -->
    <div class="section-title">◈ 六维属性</div>
    <div class="attr-grid">
      <div v-for="(attr, name) in store.data.主角.六维属性" :key="name" class="attr-card">
        <div class="attr-header">
          <span class="attr-icon">{{ attrIcons[name as string] || '◇' }}</span>
          <span class="attr-name">{{ name }}</span>
        </div>
        <div class="attr-values">
          <span class="attr-base">{{ attr.数值 }}</span>
          <span v-if="attr.加成" class="attr-bonus" :class="{ negative: attr.加成 < 0 }">
            {{ attr.加成 > 0 ? '+' : '' }}{{ attr.加成 }}
          </span>
          <span class="attr-total">= {{ attr.数值 + attr.加成 }}</span>
        </div>
        <!-- 加点按钮 -->
        <button
          v-if="store.data.主角.可用属性点 > 0"
          class="add-point-btn"
          @click="addPoint(name as string)"
          title="分配1点属性点"
        >
          ⊕
        </button>
      </div>
    </div>

    <!-- 可用属性点提示 -->
    <div v-if="store.data.主角.可用属性点 > 0" class="points-hint">
      <span class="hint-pulse">●</span>
      剩余 <strong>{{ store.data.主角.可用属性点 }}</strong> 点可分配
    </div>

    <!-- 天赋列表 -->
    <div class="section-title" style="margin-top: 12px">✦ 天赋</div>
    <div v-if="!_.isEmpty(store.data.主角.天赋)" class="talent-list">
      <div
        v-for="(talent, name) in store.data.主角.天赋"
        :key="name"
        class="talent-card"
        :class="'quality-border-' + talent.稀有度.toLowerCase()"
      >
        <div class="talent-header">
          <span class="talent-name">{{ name }}</span>
          <span class="quality-tag" :class="'quality-' + talent.稀有度.toLowerCase()">
            {{ talent.稀有度 }}
          </span>
        </div>
        <div class="talent-effect">{{ talent.效果 }}</div>
        <div class="talent-source">来源: {{ talent.来源 }}</div>
      </div>
    </div>
    <div v-else class="empty-hint">暂无天赋</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const attrIcons: Record<string, string> = {
  力量: '💪',
  敏捷: '⚡',
  体质: '🛡',
  智力: '🧠',
  感知: '👁',
  魅力: '✨',
};

// 属性加点功能
function addPoint(attrName: string) {
  if (store.data.主角.可用属性点 <= 0) return;

  const attrData = store.data.主角.六维属性[attrName as keyof typeof store.data.主角.六维属性];
  if (attrData) {
    attrData.数值 += 1;
    store.data.主角.可用属性点 -= 1;

    // 体质增加时同步HP上限
    if (attrName === '体质') {
      store.data.主角.HP上限 += 5;
      store.data.主角.HP += 5;
    }
    // 智力增加时同步法力上限
    if (attrName === '智力') {
      store.data.主角.法力上限 += 3;
      store.data.主角.法力值 += 3;
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-panel {
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

.attr-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.attr-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 8px;
  border-radius: 3px;
  position: relative;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--accent-cyan);
  }
}

.attr-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.attr-icon {
  font-size: 12px;
}

.attr-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
}

.attr-values {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.attr-base {
  font-family: var(--font-data);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.attr-bonus {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--accent-green);

  &.negative {
    color: var(--accent-red);
  }
}

.attr-total {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--text-dim);
}

.add-point-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border: 1px solid var(--accent-amber);
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-amber);
  font-size: 12px;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  animation: pulse-glow 2s ease-in-out infinite;

  &:hover {
    background: rgba(245, 158, 11, 0.25);
    box-shadow: var(--glow-gold);
  }

  &:active {
    transform: scale(0.9);
  }
}

.points-hint {
  margin-top: 6px;
  font-size: 11px;
  color: var(--accent-amber);
  text-align: center;
  padding: 4px;
  background: rgba(245, 158, 11, 0.05);
  border: 1px dashed rgba(245, 158, 11, 0.2);
  border-radius: 3px;
}

.hint-pulse {
  animation: pulse-glow 1.5s ease-in-out infinite;
}

// 天赋区域
.talent-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.talent-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 8px;
  border-radius: 3px;
  border-left: 3px solid;
}

.talent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.talent-name {
  font-size: 12px;
  font-weight: 700;
}

.quality-tag {
  font-family: var(--font-data);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 2px;
  border: 1px solid;
}

.talent-effect {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.talent-source {
  font-size: 10px;
  color: var(--text-dim);
}

.empty-hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 11px;
  padding: 16px;
  font-style: italic;
}

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

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 400px) {
  .attr-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
