<template>
  <div class="trust-panel">
    <div class="section-head">干员信赖值总览</div>
    <div v-if="_.isEmpty(store.data.干员信赖)" class="empty-state">暂无信赖记录</div>
    <div v-for="(info, name) in store.data.干员信赖" :key="name" class="trust-item">
      <div class="trust-header">
        <span class="trust-name">{{ name }}</span>
        <span class="trust-phase">{{ info.阶段 }}</span>
      </div>
      <div class="trust-bar-row">
        <div class="trust-track">
          <div
            class="trust-fill"
            :style="{ width: Math.min(info.信赖值, 200) / 2 + '%' }"
            :class="trustColor(info.信赖值)"
          ></div>
        </div>
        <span class="trust-value">{{ info.信赖值 }}/200</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function trustColor(val: number): string {
  if (val < 40) return 'trust-low';
  if (val < 80) return 'trust-mid';
  if (val < 120) return 'trust-high';
  return 'trust-max';
}
</script>

<style lang="scss" scoped>
.trust-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-head {
  font-size: 0.88rem;
  color: var(--c-cyan);
  font-weight: bold;
  letter-spacing: 2px;
  border-bottom: 1px solid var(--c-cyan-dim);
  padding-bottom: 4px;
}

.trust-item {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  padding: 8px;
}

.trust-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.trust-name {
  font-weight: bold;
  color: var(--c-text-bright);
  font-size: 0.85rem;
}

.trust-phase {
  font-size: 0.75rem;
  color: var(--c-yellow);
}

.trust-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trust-track {
  flex: 1;
  height: 10px;
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  overflow: hidden;
}

.trust-fill {
  height: 100%;
  transition: width 0.3s;
}

.trust-low {
  background: #6b7d8d;
}
.trust-mid {
  background: #3498db;
}
.trust-high {
  background: #2ecc71;
}
.trust-max {
  background: linear-gradient(90deg, #f39c12, #e74c3c);
}

.trust-value {
  font-size: 0.78rem;
  font-weight: bold;
  min-width: 52px;
  text-align: right;
}

.empty-state {
  text-align: center;
  color: var(--c-text-dim);
  padding: 16px;
  font-style: italic;
}
</style>
