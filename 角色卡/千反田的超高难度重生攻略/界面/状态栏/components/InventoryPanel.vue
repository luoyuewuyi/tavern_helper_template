<template>
  <div>
    <div class="section-head">物品栏</div>
    <div v-if="!_.isEmpty(store.data.主角.物品栏)" class="item-list">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="item-row">
        <div class="item-icon">{{ getIcon(name as string) }}</div>
        <div class="item-detail">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-count">x{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-state">背包空空如也...</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';
const store = useDataStore();

function getIcon(name: string): string {
  if (name.includes('手机') || name.includes('电话')) return '📱';
  if (name.includes('笔记') || name.includes('日记')) return '📓';
  if (name.includes('钥匙')) return '🔑';
  if (name.includes('钱') || name.includes('币')) return '💴';
  if (name.includes('证') || name.includes('卡')) return '🪪';
  if (name.includes('药') || name.includes('糖')) return '💊';
  if (name.includes('枪') || name.includes('武器')) return '🔫';
  if (name.includes('食') || name.includes('饭') || name.includes('吃')) return '🍱';
  return '📦';
}
</script>

<style lang="scss" scoped>
.section-head {
  font-weight: 700;
  font-size: 0.88rem;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-border);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 8px 10px;
  transition: all 0.2s;
  &:hover {
    transform: translateX(3px);
    border-color: var(--c-border-light);
  }
}

.item-icon {
  margin-right: 10px;
  font-size: 1.1rem;
}

.item-detail {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  display: block;
  font-size: 0.85rem;
}

.item-desc {
  display: block;
  font-size: 0.72rem;
  color: var(--c-text-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-count {
  background: var(--c-accent-gold-dim);
  color: var(--c-accent-gold);
  padding: 2px 8px;
  font-size: 0.72rem;
  font-family: var(--font-mono);
  border-radius: 3px;
  font-weight: 600;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  color: var(--c-text-muted);
  padding: 20px;
  font-style: italic;
}
</style>
