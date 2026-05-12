<template>
  <div class="inventory-panel">
    <div v-if="!_.isEmpty(store.data.user.物品栏)" class="inventory-list">
      <div v-for="(item, name) in store.data.user.物品栏" :key="name" class="item-card">
        <div class="item-icon">{{ getIcon(name as string) }}</div>
        <div class="item-info">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-count">×{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-state">行囊空空，身无长物……</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';
const store = useDataStore();

function getIcon(name: string): string {
  if (name.includes('剑') || name.includes('刀')) return '⚔️';
  if (name.includes('丹') || name.includes('药')) return '💊';
  if (name.includes('书') || name.includes('经') || name.includes('卷')) return '📜';
  if (name.includes('玉') || name.includes('珠')) return '💎';
  if (name.includes('符') || name.includes('咒')) return '🔮';
  if (name.includes('钱') || name.includes('银') || name.includes('金') || name.includes('铜')) return '💰';
  if (name.includes('酒') || name.includes('壶')) return '🍶';
  if (name.includes('粮') || name.includes('饼') || name.includes('食')) return '🍙';
  if (name.includes('甲') || name.includes('衣') || name.includes('袍')) return '👘';
  if (name.includes('信') || name.includes('帖')) return '✉️';
  return '📦';
}
</script>

<style lang="scss" scoped>
.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--jl-gold-light);
  background: var(--jl-paper);
  border-radius: 2px;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    border-color: var(--jl-gold);
  }
}

.item-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--jl-paper-dark);
  border: 1px solid var(--jl-gold-light);
  border-radius: 4px;
  font-size: 1rem;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--jl-ink);
}

.item-desc {
  display: block;
  font-size: 0.73rem;
  color: var(--jl-ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-count {
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--jl-gold);
  background: var(--jl-ink);
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  color: var(--jl-ink-faint);
  padding: 20px;
  font-style: italic;
}
</style>
