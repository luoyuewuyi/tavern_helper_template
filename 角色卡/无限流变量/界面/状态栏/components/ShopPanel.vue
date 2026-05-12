<template>
  <div class="shop-panel">
    <div class="shop-header">
      <span class="section-title">◉ 空间商店</span>
      <span class="balance">
        <span class="balance-icon">◈</span>
        {{ store.data.主角.空间积分 }}
      </span>
    </div>

    <div v-if="!_.isEmpty(store.data.商店.商品列表)" class="shop-grid">
      <div
        v-for="(item, name) in store.data.商店.商品列表"
        :key="name"
        class="shop-card"
        :class="'quality-border-' + item.品质.toLowerCase()"
      >
        <div class="shop-item-header">
          <span class="shop-item-name">{{ name }}</span>
          <span class="quality-tag" :class="'quality-' + item.品质.toLowerCase()">{{ item.品质 }}</span>
        </div>
        <div class="shop-item-desc">{{ item.描述 }}</div>
        <div class="shop-item-footer">
          <span class="shop-price" :class="{ insufficient: item.价格 > store.data.主角.空间积分 }">
            ◈ {{ item.价格 }}
          </span>
          <span class="shop-stock">库存: {{ item.库存 }}</span>
          <button
            class="buy-btn"
            :disabled="item.价格 > store.data.主角.空间积分"
            @click="buyItem(name as string, item)"
          >
            购买
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-hint">商店暂无商品，进入新副本后刷新</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

// 购买商品
function buyItem(name: string, item: { 价格: number; 描述: string; 库存: number; 品质: string }) {
  if (store.data.主角.空间积分 < item.价格) {
    toastr.error('空间积分不足！');
    return;
  }
  if (item.库存 <= 0) {
    toastr.warning('库存不足！');
    return;
  }

  // 扣除积分
  store.data.主角.空间积分 -= item.价格;

  // 减少库存
  item.库存 -= 1;

  // 添加到背包
  const backpack = store.data.主角.背包;
  if (backpack[name]) {
    backpack[name].数量 += 1;
  } else {
    backpack[name] = {
      描述: item.描述,
      数量: 1,
      品质: item.品质 as any,
    };
  }

  toastr.success(`购买了 ${name}！`);
}
</script>

<style lang="scss" scoped>
.shop-panel {
  display: flex;
  flex-direction: column;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-cyan);
  letter-spacing: 1px;
}

.balance {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-data);
  font-size: 13px;
  color: var(--accent-gold);
}

.balance-icon {
  font-size: 11px;
}

.shop-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.shop-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid;
  padding: 8px 10px;
  border-radius: 3px;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-card-hover);
  }
}

.shop-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.shop-item-name {
  font-size: 12px;
  font-weight: 700;
}

.quality-tag {
  font-family: var(--font-data);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 2px;
  border: 1px solid;
}

.shop-item-desc {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.shop-item-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shop-price {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--accent-gold);

  &.insufficient {
    color: var(--accent-red);
    text-decoration: line-through;
  }
}

.shop-stock {
  font-size: 10px;
  color: var(--text-dim);
  flex: 1;
}

.buy-btn {
  font-family: var(--font-hud);
  font-size: 10px;
  font-weight: 600;
  padding: 3px 10px;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(6, 182, 212, 0.2);
    box-shadow: var(--glow-cyan);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
}

.empty-hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 11px;
  padding: 16px;
  font-style: italic;
}

// 品质色
.quality-border-g {
  border-left-color: var(--quality-g);
}
.quality-border-f {
  border-left-color: var(--quality-f);
}
.quality-border-e {
  border-left-color: var(--quality-e);
}
.quality-border-d {
  border-left-color: var(--quality-d);
}
.quality-border-c {
  border-left-color: var(--quality-c);
}
.quality-border-b {
  border-left-color: var(--quality-b);
}
.quality-border-a {
  border-left-color: var(--quality-a);
}
.quality-border-s {
  border-left-color: var(--quality-s);
}
.quality-border-ss {
  border-left-color: var(--quality-ss);
}
.quality-border-sss {
  border-left-color: var(--quality-sss);
}

.quality-g {
  color: var(--quality-g);
  border-color: var(--quality-g);
}
.quality-f {
  color: var(--quality-f);
  border-color: var(--quality-f);
}
.quality-e {
  color: var(--quality-e);
  border-color: var(--quality-e);
}
.quality-d {
  color: var(--quality-d);
  border-color: var(--quality-d);
}
.quality-c {
  color: var(--quality-c);
  border-color: var(--quality-c);
}
.quality-b {
  color: var(--quality-b);
  border-color: var(--quality-b);
}
.quality-a {
  color: var(--quality-a);
  border-color: var(--quality-a);
}
.quality-s {
  color: var(--quality-s);
  border-color: var(--quality-s);
}
.quality-ss {
  color: var(--quality-ss);
  border-color: var(--quality-ss);
}
.quality-sss {
  color: var(--quality-sss);
  border-color: var(--quality-sss);
}
</style>
