<template>
  <div class="corruption-strip">
    <div v-for="(value, name) in store.data.堕落度" :key="name" class="corruption-row">
      <span class="name">{{ name }}</span>
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: value + '%' }"></div>
      </div>
      <span class="value">{{ value }}</span>
      <span class="stage">{{ getStage(value) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

function getStage(v: number): string {
  if (v < 20) return '抗拒';
  if (v < 40) return '勉强';
  if (v < 60) return '麻木';
  if (v < 80) return '动摇';
  return '崩坏';
}
</script>

<style lang="scss" scoped>
.corruption-strip {
  padding: 6px 12px;
  background: rgba(154, 48, 112, 0.05);
  border-bottom: 1px solid var(--c-dim);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.corruption-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  font-size: 0.78rem;
  color: var(--c-parchment);
  min-width: 48px;
  font-weight: bold;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: var(--c-abyss);
  border: 1px solid var(--c-corrupt-dim);
  overflow: hidden;
  max-width: 200px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-corrupt-dim), var(--c-corrupt));
  transition: width 0.4s ease;
}

.value {
  font-size: 0.72rem;
  color: var(--c-corrupt);
  font-weight: bold;
  min-width: 20px;
  text-align: right;
}

.stage {
  font-size: 0.68rem;
  color: var(--c-mist);
  padding: 1px 4px;
  border: 1px solid var(--c-dim);
  background: var(--c-stone);
}
</style>
