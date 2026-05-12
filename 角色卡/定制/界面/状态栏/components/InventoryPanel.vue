<template>
  <div class="inventory-panel">
    <div class="section-title">🎒 物品清单</div>
    <div v-if="!_.isEmpty(store.data.卡尔德.物品栏)" class="item-list">
      <div v-for="(item, name) in store.data.卡尔德.物品栏" :key="name" class="item-row">
        <div class="item-icon">{{ getIcon(name as string) }}</div>
        <div class="item-info">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-qty">×{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-state">
      <div class="empty-icon">📦</div>
      <div class="empty-text">背包空空如也</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function getIcon(name: string): string {
  if (name.includes('药') || name.includes('丹')) return '💊';
  if (name.includes('剑') || name.includes('刀') || name.includes('武')) return '🗡️';
  if (name.includes('盾')) return '🛡️';
  if (name.includes('粮') || name.includes('食') || name.includes('肉')) return '🍖';
  if (name.includes('水') || name.includes('酒')) return '🍶';
  if (name.includes('币') || name.includes('钱')) return '💰';
  if (name.includes('钥')) return '🔑';
  if (name.includes('书') || name.includes('卷')) return '📜';
  if (name.includes('石') || name.includes('矿')) return '💎';
  if (name.includes('衣') || name.includes('甲')) return '👕';
  return '📦';
}
</script>

<style lang="scss" scoped>
.inventory-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent-purple);
  border-bottom: 1px solid var(--border-main);
  padding-bottom: 3px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-row {
  display: flex;
  align-items: center;
  background: var(--bg-section);
  border: 1px solid var(--border-main);
  padding: 6px 8px;
  gap: 8px;
  transition:
    border-color 0.2s,
    transform 0.15s;
}

.item-row:hover {
  border-color: var(--accent-purple);
  transform: translateX(3px);
}

.item-icon {
  font-size: 1.1rem;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  display: block;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.item-desc {
  display: block;
  font-size: 0.68rem;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-qty {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.78rem;
  color: var(--accent-gold);
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 20px;
}

.empty-icon {
  font-size: 1.8rem;
  opacity: 0.4;
  margin-bottom: 6px;
}

.empty-text {
  color: var(--text-dim);
  font-size: 0.82rem;
}
</style>
