<template>
  <div class="stats-strip">
    <!-- 武技 -->
    <div v-for="(value, key) in store.data.主角.能力面板.武技" :key="'wuji-' + key" class="stat-item">
      <span class="stat-label">{{ key }}</span>
      <div class="stat-track">
        <div
          class="stat-fill"
          :style="{ width: (value as number) + '%', background: getStatColor(key as string, value as number) }"
        ></div>
      </div>
      <span class="stat-value">{{ value }}</span>
    </div>
    <!-- 其他六维 -->
    <div v-for="key in six_dims" :key="key" class="stat-item">
      <span class="stat-label">{{ key }}</span>
      <div class="stat-track">
        <div
          class="stat-fill"
          :style="{ width: getDimValue(key) + '%', background: getStatColor(key, getDimValue(key)) }"
        ></div>
      </div>
      <span class="stat-value">{{ getDimValue(key) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const six_dims = ['步法', '灵力', '智慧', '体魄', '意志', '肉欲'] as const;

function getDimValue(key: (typeof six_dims)[number]): number {
  return (store.data.主角.能力面板 as any)[key] ?? 0;
}

function getStatColor(key: string, value: number): string {
  if (key === '肉欲') return `hsl(330, 60%, ${65 - value * 0.2}%)`;
  if (value >= 80) return 'var(--c-gold)';
  if (value >= 50) return 'var(--c-jade)';
  return 'var(--c-mist)';
}
</script>

<style lang="scss" scoped>
.stats-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 4px;
  padding: 8px 10px;
  background: var(--c-cream);
  border-bottom: 1.5px dashed var(--c-mist);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: bold;
  color: var(--c-ink);
}

.stat-track {
  width: 100%;
  height: 6px;
  background: var(--c-parchment);
  border: 1px solid var(--c-mist);
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  transition: width 0.4s ease;
  border-radius: 3px;
}

.stat-value {
  font-size: 0.68rem;
  color: var(--c-mist);
  font-family: var(--font-mono);
}
</style>
