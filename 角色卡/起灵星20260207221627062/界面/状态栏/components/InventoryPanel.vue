<template>
  <div class="inventory-panel">
    <div class="player-info">
      <div class="info-row">
        <span class="label">🔮 修为</span>
        <span class="value realm">{{ store.data.主角.修为境界 }}</span>
      </div>
      <div class="info-row">
        <span class="label">🌿 灵根</span>
        <span class="value">{{ store.data.主角.灵根 }}</span>
      </div>
      <div class="info-row">
        <span class="label">💎 灵石</span>
        <span class="value gold">{{ store.data.主角.灵石 }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="section-title">🎒 物品栏</div>
    <div class="item-list">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="item-card">
        <div class="item-header">
          <span class="item-name">{{ name }}</span>
          <span class="item-count">×{{ item.数量 }}</span>
        </div>
        <div class="item-desc">{{ item.描述 }}</div>
      </div>
      <div v-if="_.isEmpty(store.data.主角.物品栏)" class="empty-hint">暂无物品</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.inventory-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.label {
  color: var(--c-text-muted);
  width: 56px;
  flex-shrink: 0;
}

.value {
  color: var(--c-text);

  &.realm {
    color: var(--c-primary);
    font-weight: 600;
  }

  &.gold {
    color: var(--c-accent);
    font-weight: 600;
    font-family: var(--font-mono);
  }
}

.divider {
  height: 1px;
  background: var(--c-border);
  margin: 4px 0;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-primary);
  margin-bottom: 4px;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-card {
  background: var(--c-bg-panel);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 8px 10px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text);
}

.item-count {
  font-size: 11px;
  color: var(--c-accent);
  font-family: var(--font-mono);
  background: rgba(255, 216, 102, 0.1);
  padding: 1px 6px;
  border-radius: 3px;
}

.item-desc {
  font-size: 11px;
  color: var(--c-text-muted);
  line-height: 1.4;
}

.empty-hint {
  text-align: center;
  color: var(--c-text-muted);
  font-size: 12px;
  padding: 16px 0;
}
</style>
