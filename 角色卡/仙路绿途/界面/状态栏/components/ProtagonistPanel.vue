<template>
  <div class="protagonist-layout">
    <div class="section-head">◈ 自身状态</div>
    <div class="status-grid">
      <div class="status-item">
        <span class="status-label">身体状态</span>
        <span class="status-value">{{ store.data.主角.身体状态 || '正常' }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">心理活动</span>
        <span class="status-value mental">{{ store.data.主角.心理活动 || '暂无' }}</span>
      </div>
    </div>

    <div class="section-head">◈ 物品栏</div>
    <div v-if="!_.isEmpty(store.data.主角.物品栏)" class="inventory-list">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="item-row">
        <div class="item-icon">{{ getItemIcon(name as string) }}</div>
        <div class="item-detail">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-count">×{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-state">行囊空空，身无长物...</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function getItemIcon(name: string): string {
  if (name.includes('丹') || name.includes('药')) return '丹';
  if (name.includes('剑') || name.includes('刀') || name.includes('兵')) return '⚔';
  if (name.includes('符') || name.includes('咒') || name.includes('纸')) return '符';
  if (name.includes('玉') || name.includes('珠') || name.includes('石')) return '玉';
  if (name.includes('书') || name.includes('经') || name.includes('卷')) return '卷';
  if (name.includes('钱') || name.includes('银') || name.includes('金')) return '金';
  return name.substring(0, 1);
}
</script>

<style lang="scss" scoped>
.protagonist-layout {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-head {
  font-size: 0.92rem;
  font-weight: bold;
  color: var(--c-ink);
  padding-bottom: 4px;
  border-bottom: 2px solid var(--c-jade);
  display: inline-block;
  letter-spacing: 1px;
}

.status-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  border: 1px solid var(--c-gold);
  padding: 8px 10px;
  background: var(--c-cloud);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.status-label {
  font-size: 0.72rem;
  color: var(--c-umber);
  border-bottom: 1px dashed var(--c-gold);
  padding-bottom: 2px;
}

.status-value {
  font-size: 0.85rem;
  font-weight: bold;
}

.status-value.mental {
  font-style: italic;
  font-weight: normal;
  color: var(--c-umber);
}

.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  border: 1px solid var(--c-gold);
  padding: 7px 8px;
  background: var(--c-cloud);
  transition: transform 0.2s;
}

.item-row:hover {
  transform: translateX(4px);
  border-color: var(--c-jade);
}

.item-icon {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--c-jade), var(--c-jade-light));
  border: 1px solid var(--c-jade);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-weight: bold;
  font-size: 0.8rem;
  color: var(--c-cloud);
}

.item-detail {
  flex: 1;
}

.item-name {
  font-weight: bold;
  display: block;
  font-size: 0.85rem;
}

.item-desc {
  font-size: 0.74rem;
  color: var(--c-umber);
}

.item-count {
  background: var(--c-ink);
  color: var(--c-parchment);
  padding: 2px 6px;
  font-size: 0.72rem;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  color: var(--c-umber);
  padding: 16px;
  font-style: italic;
  font-size: 0.85rem;
  border: 1px dashed var(--c-gold);
}
</style>
