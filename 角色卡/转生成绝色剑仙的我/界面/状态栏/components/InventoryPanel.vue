<template>
  <div class="inventory-layout">
    <div class="section-head">随身物品</div>
    <div v-if="!_.isEmpty(store.data.主角.物品栏)" class="item-list">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="item-row">
        <div class="item-icon">{{ getIcon(name as string) }}</div>
        <div class="item-detail">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-count">×{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-state">行囊空空如也...</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function getIcon(name: string): string {
  if (name.includes('剑')) return '⚔';
  if (name.includes('簪') || name.includes('饰')) return '💠';
  if (name.includes('银') || name.includes('钱')) return '💰';
  if (name.includes('丹') || name.includes('药')) return '💊';
  if (name.includes('符') || name.includes('法')) return '📜';
  if (name.includes('信') || name.includes('令')) return '🏷';
  return '📦';
}
</script>

<style lang="scss" scoped>
.inventory-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-head {
  font-size: 0.88rem;
  font-weight: bold;
  border-bottom: 2px solid var(--c-gold);
  display: inline-block;
  margin-bottom: 4px;
  padding-bottom: 2px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  border: 1px solid var(--c-mist);
  padding: 7px 8px;
  background: var(--c-cream);
  transition: transform 0.2s;
}

.item-row:hover {
  transform: translateX(4px);
  border-left: 3px solid var(--c-gold);
}

.item-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 1.1rem;
}

.item-detail {
  flex: 1;
}

.item-name {
  font-weight: bold;
  font-size: 0.85rem;
  display: block;
}

.item-desc {
  font-size: 0.72rem;
  color: var(--c-mist);
}

.item-count {
  background: var(--c-ink);
  color: var(--c-cream);
  padding: 2px 6px;
  font-size: 0.72rem;
  font-family: var(--font-mono);
}

.empty-state {
  text-align: center;
  color: var(--c-mist);
  padding: 16px;
  font-style: italic;
}
</style>
