<template>
  <div class="equip-panel">
    <!-- 装备栏 -->
    <div class="section-title">⛨ 装备栏</div>
    <div class="equip-grid">
      <div
        v-for="(equip, slot) in store.data.主角.装备栏"
        :key="slot"
        class="equip-card"
        :class="{
          empty: equip.名称 === '空置',
          ['quality-border-' + equip.品质.toLowerCase()]: equip.名称 !== '空置',
        }"
      >
        <div class="equip-slot">{{ slotIcons[slot as string] || '◇' }} {{ slot }}</div>
        <div class="equip-name" v-if="equip.名称 !== '空置'">
          <span>{{ equip.名称 }}</span>
          <span class="quality-tag" :class="'quality-' + equip.品质.toLowerCase()">{{ equip.品质 }}</span>
        </div>
        <div class="equip-name empty-name" v-else>空置</div>
        <div class="equip-effect" v-if="equip.名称 !== '空置'">{{ equip.效果 }}</div>
        <div class="equip-comment" v-if="equip.主角评价">「{{ equip.主角评价 }}」</div>
      </div>
    </div>

    <!-- 背包 -->
    <div class="section-title" style="margin-top: 12px">🎒 背包</div>
    <div v-if="!_.isEmpty(store.data.主角.背包)" class="inventory-list">
      <div
        v-for="(item, name) in store.data.主角.背包"
        :key="name"
        class="item-row"
        :class="'quality-border-' + item.品质.toLowerCase()"
      >
        <div class="item-info">
          <span class="item-name">{{ name }}</span>
          <span class="quality-dot" :class="'quality-bg-' + item.品质.toLowerCase()"></span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-count">x{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-hint">背包空空如也...</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const slotIcons: Record<string, string> = {
  武器: '⚔',
  头部: '👑',
  上身: '🧥',
  下身: '👖',
  鞋子: '👢',
  饰品: '💎',
};
</script>

<style lang="scss" scoped>
.equip-panel {
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

.equip-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.equip-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid;
  padding: 8px;
  border-radius: 3px;
  transition: all 0.2s;

  &:hover:not(.empty) {
    background: var(--bg-card-hover);
  }

  &.empty {
    opacity: 0.5;
    border-left-color: var(--border);
  }
}

.equip-slot {
  font-size: 10px;
  color: var(--text-dim);
  margin-bottom: 3px;
}

.equip-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 3px;
}

.empty-name {
  color: var(--text-dim);
  font-weight: 400;
  font-style: italic;
}

.quality-tag {
  font-family: var(--font-data);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 2px;
  border: 1px solid;
}

.equip-effect {
  font-size: 10px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.equip-comment {
  font-size: 10px;
  color: var(--text-dim);
  font-style: italic;
}

// 背包
.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid;
  padding: 6px 8px;
  border-radius: 3px;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-card-hover);
    transform: translateX(2px);
  }
}

.item-info {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.quality-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-desc {
  font-size: 10px;
  color: var(--text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-count {
  font-family: var(--font-data);
  font-size: 10px;
  color: var(--accent-cyan);
  flex-shrink: 0;
  margin-left: 6px;
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

// 品质背景色
.quality-bg-g {
  background: var(--quality-g);
}
.quality-bg-f {
  background: var(--quality-f);
}
.quality-bg-e {
  background: var(--quality-e);
}
.quality-bg-d {
  background: var(--quality-d);
}
.quality-bg-c {
  background: var(--quality-c);
}
.quality-bg-b {
  background: var(--quality-b);
}
.quality-bg-a {
  background: var(--quality-a);
}
.quality-bg-s {
  background: var(--quality-s);
}
.quality-bg-ss {
  background: var(--quality-ss);
}
.quality-bg-sss {
  background: var(--quality-sss);
}

@media (max-width: 400px) {
  .equip-grid {
    grid-template-columns: 1fr;
  }
}
</style>
