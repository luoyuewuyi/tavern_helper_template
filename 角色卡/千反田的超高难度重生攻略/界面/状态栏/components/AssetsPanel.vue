<template>
  <div>
    <div class="section-head">资产清单</div>
    <div v-if="!_.isEmpty(store.data.主角.资产清单)" class="asset-list">
      <div v-for="(asset, name) in store.data.主角.资产清单" :key="name" class="asset-card">
        <div class="asset-icon">{{ typeIcon(asset.类型) }}</div>
        <div class="asset-info">
          <div class="asset-name">{{ name }}</div>
          <div class="asset-meta">
            <span class="asset-type">{{ asset.类型 }}</span>
            <span class="asset-status" :class="statusClass(asset.状态)">{{ asset.状态 }}</span>
          </div>
        </div>
        <div class="asset-value">{{ asset.估值 }}</div>
      </div>
    </div>
    <div v-else class="empty-state">暂无资产</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';
const store = useDataStore();

function typeIcon(type: string) {
  if (type.includes('不动产') || type.includes('土地') || type.includes('建筑')) return '🏠';
  if (type.includes('股权') || type.includes('股份')) return '📈';
  if (type.includes('金融')) return '💹';
  if (type.includes('知识') || type.includes('专利')) return '💡';
  return '📦';
}

function statusClass(status: string) {
  if (status.includes('良好') || status.includes('正常') || status.includes('盈利')) return 'status-good';
  if (status.includes('亏损') || status.includes('危险') || status.includes('恶化')) return 'status-bad';
  return 'status-neutral';
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

.asset-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.asset-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 8px 10px;
  transition: all 0.2s;
  &:hover {
    border-color: var(--c-border-light);
  }
}

.asset-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.asset-info {
  flex: 1;
  min-width: 0;
}

.asset-name {
  font-weight: 600;
  font-size: 0.85rem;
}

.asset-meta {
  display: flex;
  gap: 6px;
  margin-top: 3px;
}

.asset-type,
.asset-status {
  font-size: 0.68rem;
  padding: 1px 6px;
  border-radius: 3px;
}

.asset-type {
  background: var(--c-accent-blue-dim);
  color: var(--c-accent-blue);
}

.status-good {
  background: var(--c-accent-green-dim);
  color: var(--c-accent-green);
}
.status-bad {
  background: var(--c-accent-red-dim);
  color: var(--c-accent-red);
}
.status-neutral {
  background: rgba(139, 148, 158, 0.15);
  color: var(--c-text-secondary);
}

.asset-value {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--c-accent-gold);
  font-weight: 600;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  color: var(--c-text-muted);
  padding: 20px;
  font-style: italic;
}
</style>
