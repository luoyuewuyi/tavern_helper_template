<template>
  <div class="resource-bars">
    <div class="bar-row" v-for="bar in bars" :key="bar.label">
      <span class="bar-label">{{ bar.icon }} {{ bar.label }}</span>
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: bar.percent + '%', background: bar.gradient }"></div>
      </div>
      <span class="bar-value" :style="{ color: bar.color }">{{ bar.current }}/{{ bar.max }}</span>
    </div>

    <!-- 状态异常 -->
    <div class="status-effects" v-if="!_.isEmpty(store.data.主角.状态异常)">
      <span v-for="(desc, name) in store.data.主角.状态异常" :key="name" class="effect-tag" :title="desc as string">
        ⚠ {{ name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const bars = computed(() => {
  const d = store.data.主角;
  return [
    {
      label: 'HP',
      icon: '♥',
      current: d.HP,
      max: d.HP上限,
      percent: _.clamp((d.HP / d.HP上限) * 100, 0, 100),
      gradient:
        d.HP / d.HP上限 > 0.3 ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
      color: d.HP / d.HP上限 > 0.3 ? 'var(--accent-green)' : 'var(--accent-red)',
    },
    {
      label: 'MP',
      icon: '✦',
      current: d.法力值,
      max: d.法力上限,
      percent: _.clamp((d.法力值 / d.法力上限) * 100, 0, 100),
      gradient: 'linear-gradient(90deg, #3b82f6, #6366f1)',
      color: 'var(--accent-blue)',
    },
    {
      label: 'SAN',
      icon: '◎',
      current: d.精神值,
      max: 100,
      percent: d.精神值,
      gradient: d.精神值 > 30 ? 'linear-gradient(90deg, #a855f7, #7c3aed)' : 'linear-gradient(90deg, #ef4444, #991b1b)',
      color: d.精神值 > 30 ? 'var(--accent-purple)' : 'var(--accent-red)',
    },
  ];
});
</script>

<style lang="scss" scoped>
.resource-bars {
  padding: 6px 12px 8px;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bar-label {
  font-size: 10px;
  color: var(--text-secondary);
  width: 40px;
  flex-shrink: 0;
  font-weight: 600;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: rgba(30, 58, 95, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}

.bar-value {
  font-family: var(--font-data);
  font-size: 9px;
  width: 55px;
  text-align: right;
  flex-shrink: 0;
}

.status-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.effect-tag {
  font-size: 10px;
  color: var(--accent-red);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  padding: 1px 6px;
  border-radius: 2px;
  cursor: help;
}
</style>
