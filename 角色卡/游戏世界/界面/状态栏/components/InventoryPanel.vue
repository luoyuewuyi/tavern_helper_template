<template>
  <div>
    <div class="section-head">道具栏</div>
    <div v-if="!_.isEmpty(store.data.道具栏)" class="inv-grid">
      <div v-for="(item, name) in store.data.道具栏" :key="name" class="item-row">
        <div class="item-icon">{{ getIcon(name as string) }}</div>
        <div class="item-detail">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
          <span class="item-owner">{{ item.持有者 }}</span>
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
  if (name.includes('剑') || name.includes('刀') || name.includes('武器')) return '⚔';
  if (name.includes('盾') || name.includes('甲') || name.includes('防具')) return '🛡';
  if (name.includes('药') || name.includes('草') || name.includes('治愈')) return '💊';
  if (name.includes('钥匙') || name.includes('地图')) return '🗝';
  if (name.includes('食物') || name.includes('面包') || name.includes('水')) return '🍞';
  return '📦';
}
</script>

<style lang="scss" scoped>
.section-head {
  font-size: 0.88rem;
  border-bottom: 2px solid var(--c-gold);
  display: inline-block;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--c-gold);
}

.inv-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  border: 1px solid var(--c-dim);
  padding: 6px 8px;
  background: var(--c-stone);
  transition: border-color 0.2s;
}

.item-row:hover {
  border-color: var(--c-mist);
}

.item-icon {
  width: 26px;
  height: 26px;
  background: var(--c-abyss);
  border: 1px solid var(--c-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 0.85rem;
}

.item-detail {
  flex: 1;
}

.item-name {
  font-weight: bold;
  display: block;
  color: var(--c-bone);
  font-size: 0.82rem;
}

.item-desc {
  font-size: 0.72rem;
  color: var(--c-mist);
  display: block;
}

.item-owner {
  font-size: 0.65rem;
  color: var(--c-dim);
}

.item-count {
  background: var(--c-dim);
  color: var(--c-bone);
  padding: 1px 5px;
  font-size: 0.7rem;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  color: var(--c-mist);
  padding: 16px;
  font-style: italic;
  font-size: 0.82rem;
}
</style>
