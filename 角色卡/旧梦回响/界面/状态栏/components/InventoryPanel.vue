<template>
  <div>
    <div v-if="!_.isEmpty(store.data.主角.物品栏)" class="inventory-grid">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="item-row">
        <div class="item-icon">{{ getItemIcon(name as string) }}</div>
        <div class="item-detail">
          <span class="item-name">{{ name }}</span>
          <span class="item-desc">{{ item.描述 }}</span>
        </div>
        <span class="item-count">x{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty-state">暂无物品</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function getItemIcon(name: string): string {
  if (name.includes('枪') || name.includes('武器')) return '⚔';
  if (name.includes('芯片') || name.includes('义体')) return '⚙';
  if (name.includes('药') || name.includes('治疗')) return '✚';
  if (name.includes('钥匙') || name.includes('卡')) return '⊞';
  if (name.includes('书') || name.includes('卷轴')) return '☰';
  return name.substring(0, 1);
}
</script>

<style lang="scss" scoped>
.inventory-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  background: var(--c-slate);
  border: 1px solid var(--c-border);
  padding: 8px;
  transition: all 0.2s;
}

.item-row:hover {
  border-color: var(--c-neon);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.1);
}

.item-icon {
  width: 28px;
  height: 28px;
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 0.85rem;
  color: var(--c-neon);
}

.item-detail {
  flex: 1;
}

.item-name {
  font-weight: 700;
  display: block;
  font-size: 0.88rem;
  color: var(--c-ghost);
}

.item-desc {
  font-size: 0.72rem;
  color: var(--c-faint);
}

.item-count {
  background: var(--c-border);
  color: var(--c-ghost);
  padding: 2px 6px;
  font-size: 0.72rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.empty-state {
  text-align: center;
  color: var(--c-faint);
  padding: 16px;
  font-style: italic;
  font-size: 0.85rem;
}
</style>
