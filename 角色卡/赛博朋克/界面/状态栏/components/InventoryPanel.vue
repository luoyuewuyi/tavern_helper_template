<template>
  <div class="inventory">
    <div class="inv-header">
      <span class="inv-label">€$ {{ store.data.主角.欧币 }}</span>
      <span class="inv-rep">{{ store.data.主角.信誉 }}</span>
    </div>
    <div class="inv-list">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="inv-item">
        <div class="inv-item-header">
          <span class="inv-name">{{ name }}</span>
          <span class="inv-qty">x{{ item.数量 }}</span>
        </div>
        <div class="inv-desc">{{ item.描述 }}</div>
      </div>
      <div v-if="_.isEmpty(store.data.主角.物品栏)" class="inv-empty">
        <span>// 物品栏为空</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.inventory {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--cp-border);
}

.inv-label {
  font-family: var(--font-mono);
  color: var(--cp-yellow);
  font-size: 0.85rem;
  font-weight: 700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.3);
}

.inv-rep {
  font-family: var(--font-cyber);
  color: var(--cp-text-dim);
  font-size: 0.72rem;
}

.inv-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.inv-item {
  background: var(--cp-bg-card);
  border: 1px solid var(--cp-border);
  padding: 6px 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--cp-cyan);
  }
}

.inv-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.inv-name {
  font-family: var(--font-cyber);
  color: var(--cp-text-bright);
  font-size: 0.8rem;
  font-weight: 600;
}

.inv-qty {
  font-family: var(--font-mono);
  color: var(--cp-cyan);
  font-size: 0.72rem;
}

.inv-desc {
  font-size: 0.72rem;
  color: var(--cp-text-dim);
  line-height: 1.3;
}

.inv-empty {
  text-align: center;
  padding: 16px;
  font-family: var(--font-mono);
  color: var(--cp-text-dim);
  font-size: 0.75rem;
}
</style>
