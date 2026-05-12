<template>
  <div class="warehouse">
    <div class="section-header">
      <span class="section-icon">📦</span>
      <span class="section-title">物资总览</span>
      <span class="item-count">{{ Object.keys(data.物资仓库).length }}种</span>
    </div>

    <!-- 物资列表 -->
    <div class="item-list">
      <div
        v-for="(item, name) in data.物资仓库"
        :key="name as string"
        class="item-card"
        :class="{ 'low-stock': isLowStock(item), depleted: item.数量 <= 0 }"
      >
        <div class="item-main">
          <span class="item-icon">{{ getItemIcon(name as string) }}</span>
          <div class="item-info">
            <span class="item-name">{{ name }}</span>
            <div class="item-meta">
              <span class="item-quantity">{{ item.数量 }} {{ item.单位 }}</span>
              <span v-if="item.每自然日消耗量 > 0" class="item-consume"> -{{ item.每自然日消耗量 }}/天 </span>
            </div>
          </div>
          <div v-if="item.每自然日消耗量 > 0" class="days-left">
            <span class="days-num">{{ getDaysLeft(item) }}</span>
            <span class="days-label">天</span>
          </div>
        </div>

        <!-- 库存条 -->
        <div v-if="item.每自然日消耗量 > 0" class="stock-bar">
          <div class="stock-fill" :class="stockClass(item)" :style="{ width: getStockPercent(item) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 总消耗提示 -->
    <div class="daily-summary">
      <span class="summary-icon">⏱️</span>
      <span class="summary-text"> 每日消耗：{{ dailyFoodConsume }}食物 | {{ dailyWaterConsume }}饮水 </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../schema';

const props = defineProps<{ data: Schema }>();

const itemIcons: Record<string, string> = {
  饮用水: '💧',
  压缩饼干: '🍪',
  罐头: '🥫',
  方便面: '🍜',
  急救药品: '💊',
  电池: '🔋',
  燃料: '⛽',
  武器: '🔫',
  弹药: '💥',
};

function getItemIcon(name: string): string {
  return itemIcons[name] || '📋';
}

function isLowStock(item: { 数量: number; 每自然日消耗量: number }): boolean {
  return item.每自然日消耗量 > 0 && item.数量 > 0 && item.数量 <= item.每自然日消耗量 * 3;
}

function getDaysLeft(item: { 数量: number; 每自然日消耗量: number }): string {
  if (item.每自然日消耗量 <= 0) return '∞';
  if (item.数量 <= 0) return '0';
  return Math.floor(item.数量 / item.每自然日消耗量).toString();
}

function getStockPercent(item: { 数量: number; 每自然日消耗量: number }): number {
  const maxDays = 30;
  const daysVal = item.每自然日消耗量 > 0 ? item.数量 / item.每自然日消耗量 : maxDays;
  return Math.min(100, (daysVal / maxDays) * 100);
}

function stockClass(item: { 数量: number; 每自然日消耗量: number }): string {
  const days = item.每自然日消耗量 > 0 ? item.数量 / item.每自然日消耗量 : 999;
  if (days <= 3) return 'critical';
  if (days <= 7) return 'warning';
  return 'safe';
}

const dailyFoodConsume = computed(() => {
  return Object.entries(props.data.物资仓库)
    .filter(([name]) => ['压缩饼干', '罐头', '方便面'].includes(name))
    .reduce((sum, [, item]) => sum + item.每自然日消耗量, 0);
});

const dailyWaterConsume = computed(() => {
  return props.data.物资仓库['饮用水']?.每自然日消耗量 || 0;
});
</script>

<style lang="scss" scoped>
.warehouse {
  padding: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--phone-border);
}

.section-icon {
  font-size: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--phone-text);
  flex: 1;
}

.item-count {
  font-size: 10px;
  color: var(--phone-text-dim);
  padding: 2px 8px;
  background: var(--phone-card);
  border-radius: 8px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.item-card {
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  padding: 10px 12px;
  transition: all 0.2s;

  &.low-stock {
    border-color: var(--phone-warning);
    .item-name {
      color: var(--phone-warning);
    }
  }

  &.depleted {
    border-color: var(--phone-danger);
    opacity: 0.6;
    .item-name {
      color: var(--phone-danger);
      text-decoration: line-through;
    }
  }
}

.item-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-icon {
  font-size: 20px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--phone-text);
  display: block;
}

.item-meta {
  display: flex;
  gap: 8px;
  margin-top: 2px;
}

.item-quantity {
  font-size: 10px;
  color: var(--phone-text-dim);
  font-weight: 500;
}

.item-consume {
  font-size: 10px;
  color: var(--phone-danger);
  font-weight: 600;
}

.days-left {
  text-align: center;
  min-width: 36px;
}

.days-num {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--phone-text);
  font-family: var(--font-mono);
}

.days-label {
  display: block;
  font-size: 9px;
  color: var(--phone-text-muted);
}

.stock-bar {
  height: 3px;
  background: var(--phone-border);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.stock-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;

  &.safe {
    background: var(--phone-health);
  }
  &.warning {
    background: var(--phone-warning);
  }
  &.critical {
    background: var(--phone-danger);
    animation: flash 1s infinite;
  }
}

@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.daily-summary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--phone-bg);
  border-radius: var(--phone-radius);
  border: 1px dashed var(--phone-border);
}

.summary-icon {
  font-size: 14px;
}

.summary-text {
  font-size: 10px;
  color: var(--phone-text-dim);
}
</style>
