<template>
  <div>
    <div class="section-head">博士物品清单</div>
    <div v-if="!_.isEmpty(store.data.博士.物品栏)" class="inventory-grid">
      <div v-for="(item, name) in store.data.博士.物品栏" :key="name" class="item-row">
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
  if (name.includes('通讯') || name.includes('终端')) return '📡';
  if (name.includes('药') || name.includes('医疗')) return '💊';
  if (name.includes('源石')) return '💎';
  if (name.includes('武器') || name.includes('剑')) return '⚔️';
  if (name.includes('地图') || name.includes('文件')) return '📄';
  return name.substring(0, 2);
}
</script>

<style lang="scss" scoped>
.section-head {
  font-size: 0.88rem;
  color: var(--c-cyan);
  font-weight: bold;
  letter-spacing: 2px;
  border-bottom: 1px solid var(--c-cyan-dim);
  padding-bottom: 4px;
  margin-bottom: 8px;
}

.inventory-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  border: 1px solid var(--c-border);
  padding: 8px;
  background: var(--c-bg-card);
  transition: transform 0.2s;
}

.item-row:hover {
  transform: translateX(4px);
  border-color: var(--c-cyan-dim);
}

.item-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 1rem;
}

.item-detail {
  flex: 1;
}

.item-name {
  font-weight: bold;
  display: block;
  color: var(--c-text-bright);
  font-size: 0.82rem;
}

.item-desc {
  font-size: 0.72rem;
  color: var(--c-text-dim);
}

.item-count {
  background: var(--c-cyan-dim);
  color: var(--c-text-bright);
  padding: 2px 6px;
  font-size: 0.72rem;
}

.empty-state {
  text-align: center;
  color: var(--c-text-dim);
  padding: 16px;
  font-style: italic;
}
</style>
