<template>
  <div>
    <div class="section-title"><i class="fa-solid fa-box-open"></i> 物品栏</div>
    <div v-if="!_.isEmpty(store.data.主角.物品栏)" class="inv-list">
      <div v-for="(item, name) in store.data.主角.物品栏" :key="name" class="inv-item">
        <div class="inv-icon">{{ getIcon(name as string) }}</div>
        <div class="inv-detail">
          <span class="inv-name">{{ name }}</span>
          <span class="inv-desc">{{ item.描述 }}</span>
        </div>
        <span class="inv-count">×{{ item.数量 }}</span>
      </div>
    </div>
    <div v-else class="empty">
      <i class="fa-regular fa-folder-open"></i>
      <span>暂无物品</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function getIcon(name: string): string {
  if (name.includes('护符') || name.includes('御守')) return '🛡️';
  if (name.includes('药') || name.includes('药剂')) return '🧪';
  if (name.includes('武器') || name.includes('剑')) return '⚔️';
  if (name.includes('钥匙')) return '🔑';
  if (name.includes('书') || name.includes('卷')) return '📜';
  if (name.includes('宝石') || name.includes('水晶')) return '💎';
  return '📦';
}
</script>

<style lang="scss" scoped>
.section-title {
  font-size: 0.85rem;
  font-weight: 700;
  padding-bottom: 4px;
  margin-bottom: 10px;
  border-bottom: 2px solid var(--mg-accent-pink);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--mg-text);

  i {
    font-size: 0.75rem;
  }
}

.inv-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.inv-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(45, 27, 78, 0.4);
  border: 1px solid rgba(107, 63, 160, 0.25);
  border-radius: 4px;
  padding: 8px 10px;
  transition: all 0.2s;

  &:hover {
    border-color: var(--mg-border-glow);
    transform: translateX(4px);
  }
}

.inv-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: rgba(107, 63, 160, 0.2);
  border-radius: 4px;
  flex-shrink: 0;
}

.inv-detail {
  flex: 1;
  min-width: 0;
}

.inv-name {
  display: block;
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--mg-text);
}

.inv-desc {
  display: block;
  font-size: 0.72rem;
  color: var(--mg-text-dim);
  line-height: 1.3;
}

.inv-count {
  background: var(--mg-border);
  color: #fff;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  flex-shrink: 0;
}

.empty {
  text-align: center;
  padding: 24px;
  color: var(--mg-text-dim);
  font-size: 0.85rem;

  i {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 6px;
    opacity: 0.5;
  }
}
</style>
