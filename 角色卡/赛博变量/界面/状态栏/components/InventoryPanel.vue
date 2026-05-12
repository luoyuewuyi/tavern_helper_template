<template>
  <div class="inv-panel">
    <div class="section-title">// 物品栏</div>

    <div v-if="!_.isEmpty(store.data.主角.物品栏)" class="item-list">
      <div
        v-for="(item, name) in store.data.主角.物品栏"
        :key="name"
        class="item-card"
        :class="{ expanded: expandedItem === name }"
        @click="toggleItem(name as string)"
      >
        <div class="item-header">
          <span class="item-icon">{{ getIcon(name as string) }}</span>
          <span class="item-name">{{ name }}</span>
          <span class="item-qty">x{{ item.数量 }}</span>
          <span class="expand-icon">{{ expandedItem === name ? '[-]' : '[+]' }}</span>
        </div>
        <div v-if="expandedItem === name" class="item-detail">
          <span class="detail-prefix">&gt;</span>
          {{ item.描述 }}
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">[!]</span>
      <span>物品栏为空</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
const expandedItem = ref<string | null>(null);

function toggleItem(name: string) {
  expandedItem.value = expandedItem.value === name ? null : name;
}

function getIcon(name: string): string {
  if (name.includes('胶囊') || name.includes('药')) return 'RX';
  if (name.includes('贴片') || name.includes('绷带')) return '+';
  if (name.includes('通讯') || name.includes('终端')) return 'CM';
  if (name.includes('芯片')) return 'IC';
  if (name.includes('枪') || name.includes('武器')) return 'WP';
  return name.substring(0, 2).toUpperCase();
}
</script>

<style lang="scss" scoped>
.inv-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  color: var(--c-cyan);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 0;
  border-bottom: 1px solid var(--c-cyan);
  text-shadow: var(--glow-cyan);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-card {
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  cursor: pointer;
  transition: all 0.2s;
}

.item-card:hover {
  border-color: var(--c-cyan);
  box-shadow: 0 0 5px rgba(0, 240, 255, 0.2);
}

.item-card.expanded {
  border-color: var(--c-cyan);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
}

.item-icon {
  width: 26px;
  height: 26px;
  background: var(--c-bg-panel);
  border: 1px solid var(--c-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--c-cyan);
}

.item-name {
  flex: 1;
  color: var(--c-text);
  font-size: 0.85rem;
  font-weight: bold;
}

.item-qty {
  color: var(--c-yellow);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 6px;
  background: rgba(240, 255, 0, 0.1);
  border: 1px solid var(--c-yellow);
}

.expand-icon {
  color: var(--c-text-dim);
  font-size: 0.7rem;
}

.item-detail {
  padding: 8px 10px;
  padding-top: 0;
  color: var(--c-text-dim);
  font-size: 0.78rem;
  border-top: 1px dashed var(--c-border);
  margin-top: 0;
  animation: slideDown 0.2s ease;
}

.detail-prefix {
  color: var(--c-green);
  margin-right: 4px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 100px;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--c-text-dim);
  font-size: 0.85rem;
  background: var(--c-bg-dark);
  border: 1px dashed var(--c-border);
}

.empty-icon {
  color: var(--c-yellow);
  animation: neonPulse 1.5s ease-in-out infinite;
}
</style>
