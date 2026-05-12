<template>
  <div class="corruption-layout">
    <div class="section-head">隐秘数值</div>
    <div class="bar-list">
      <div class="bar-item">
        <div class="bar-header">
          <span class="bar-label">改造值</span>
          <span class="bar-value">{{ store.data.改造数值.改造值 }}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill reform" :style="{ width: store.data.改造数值.改造值 + '%' }"></div>
        </div>
        <div class="bar-hint">{{ getReformHint(store.data.改造数值.改造值 as number) }}</div>
      </div>

      <div class="bar-item">
        <div class="bar-header">
          <span class="bar-label">常识更改</span>
          <span class="bar-value">{{ store.data.改造数值.常识更改 }}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill common" :style="{ width: store.data.改造数值.常识更改 + '%' }"></div>
        </div>
        <div class="bar-hint">{{ getCommonHint(store.data.改造数值.常识更改 as number) }}</div>
      </div>

      <div class="bar-item">
        <div class="bar-header">
          <span class="bar-label">堕落值</span>
          <span class="bar-value">{{ store.data.改造数值.堕落值 }}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill fallen" :style="{ width: store.data.改造数值.堕落值 + '%' }"></div>
        </div>
        <div class="bar-hint">{{ getFallenHint(store.data.改造数值.堕落值 as number) }}</div>
      </div>
    </div>

    <div class="secret-box">
      <span class="secret-label">🔒 功法真实属性</span>
      <span class="secret-value">{{ store.data.改造数值._功法真实属性 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

function getReformHint(v: number): string {
  if (v < 20) return '身体微有变化，尚不明显';
  if (v < 40) return '体质已在改变，敏感度上升';
  if (v < 60) return '鼎炉体质初成，身材开始变化';
  if (v < 80) return '改造接近完成，道心勉强压制';
  return '彻底化为鼎炉圣体';
}

function getCommonHint(v: number): string {
  if (v < 20) return '思想正常，偶有梦中呢喃';
  if (v < 40) return '某些想法不知不觉浮现';
  if (v < 60) return '开始认同一些被灌输的观念';
  if (v < 80) return '真假观念逐渐混淆';
  return '三观已被彻底改写';
}

function getFallenHint(v: number): string {
  if (v === 0) return '尚未激活';
  if (v < 20) return '意志尚存，奋力抵抗';
  if (v < 40) return '抵抗减弱，快感侵蚀';
  if (v < 60) return '身心动摇，屈服念头涌现';
  if (v < 80) return '意志几近崩溃';
  return '彻底沦陷';
}
</script>

<style lang="scss" scoped>
.corruption-layout {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-head {
  font-size: 0.88rem;
  font-weight: bold;
  border-bottom: 2px solid var(--c-pink);
  display: inline-block;
  margin-bottom: 2px;
  padding-bottom: 2px;
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-item {
  background: var(--c-cream);
  border: 1px solid var(--c-mist);
  padding: 8px;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.bar-label {
  font-weight: bold;
  font-size: 0.82rem;
}

.bar-value {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--c-mist);
}

.bar-track {
  height: 8px;
  background: var(--c-parchment);
  border: 1px solid var(--c-mist);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.bar-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 4px;
}

.bar-fill.reform {
  background: linear-gradient(90deg, var(--c-jade) 0%, var(--c-pink-light) 100%);
}
.bar-fill.common {
  background: linear-gradient(90deg, var(--c-gold) 0%, var(--c-pink) 100%);
}
.bar-fill.fallen {
  background: linear-gradient(90deg, var(--c-pink) 0%, #8b3a62 100%);
}

.bar-hint {
  font-size: 0.7rem;
  color: var(--c-mist);
  font-style: italic;
}

.secret-box {
  background: rgba(212, 98, 142, 0.08);
  border: 1px dashed var(--c-pink);
  padding: 8px;
}

.secret-label {
  display: block;
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--c-pink);
  margin-bottom: 3px;
}

.secret-value {
  font-size: 0.78rem;
  color: var(--c-ink);
}
</style>
