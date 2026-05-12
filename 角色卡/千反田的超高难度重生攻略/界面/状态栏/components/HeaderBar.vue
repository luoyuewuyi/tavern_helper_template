<template>
  <div class="header">
    <div class="identity-row">
      <span class="name">{{ store.data.主角.姓名 }}</span>
      <span class="badge gender">{{ store.data.主角.性别 }}</span>
      <span class="badge identity">{{ store.data.主角.身份 }}</span>
    </div>
    <div class="meta-row">
      <span class="meta-item">📅 {{ store.data.世界.当前时间 }}</span>
      <span class="meta-item">🌸 {{ store.data.世界.当前季节 }}</span>
      <span class="meta-item">📍 {{ store.data.世界.当前地点 }}</span>
    </div>
    <div v-if="!_.isEmpty(store.data.世界.近期事务)" class="tasks-row">
      <div v-for="(desc, name) in store.data.世界.近期事务" :key="name" class="task-chip">
        <span class="task-name">{{ name }}</span>
        <span class="task-desc">{{ desc }}</span>
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
.header {
  padding: 12px 14px;
  background: linear-gradient(135deg, var(--c-bg-deep) 0%, var(--c-bg-panel) 100%);
  border-bottom: 1px solid var(--c-border);
}

.identity-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-accent-gold);
  letter-spacing: 1px;
}

.badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 600;
}
.badge.gender {
  background: var(--c-accent-blue-dim);
  color: var(--c-accent-blue);
  border: 1px solid rgba(88, 166, 255, 0.3);
}
.badge.identity {
  background: var(--c-accent-gold-dim);
  color: var(--c-accent-gold);
  border: 1px solid rgba(212, 168, 67, 0.3);
}

.meta-row {
  display: flex;
  gap: 12px;
  font-size: 0.78rem;
  color: var(--c-text-secondary);
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.meta-item {
  white-space: nowrap;
}

.tasks-row {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.task-chip {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-left: 3px solid var(--c-accent-green);
  padding: 5px 8px;
  min-width: 120px;
  flex-shrink: 0;
  border-radius: 0 4px 4px 0;
}

.task-name {
  display: block;
  font-weight: 600;
  font-size: 0.78rem;
  color: var(--c-accent-green);
}

.task-desc {
  display: block;
  font-size: 0.7rem;
  color: var(--c-text-muted);
  margin-top: 2px;
}
</style>
