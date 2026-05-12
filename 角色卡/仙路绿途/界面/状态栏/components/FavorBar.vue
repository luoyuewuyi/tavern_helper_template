<template>
  <div class="favor-strip">
    <span class="favor-label">好感</span>
    <div class="favor-track">
      <div class="favor-fill" :style="{ width: fill_percent + '%' }"></div>
      <div class="favor-zero-mark" :style="{ left: zero_position + '%' }"></div>
    </div>
    <span class="favor-value">{{ store.data.姜清曦.好感度 }}</span>
    <span class="favor-phase">{{ store.data.姜清曦.$好感阶段 }}</span>
    <div class="favor-controls">
      <button
        class="favor-button"
        :disabled="store.data.姜清曦.好感度 <= -20"
        type="button"
        @click="adjustFavor(-1)"
      >
        −
      </button>
      <button
        class="favor-button"
        :disabled="store.data.姜清曦.好感度 >= 100"
        type="button"
        @click="adjustFavor(1)"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

// 好感度范围 -20 ~ 100，需要映射到 0% ~ 100%
const fill_percent = computed(() => {
  return ((store.data.姜清曦.好感度 - (-20)) / (100 - (-20))) * 100;
});

// 零点在进度条上的位置
const zero_position = computed(() => {
  return ((0 - (-20)) / (100 - (-20))) * 100;
});

function adjustFavor(delta: number) {
  store.data.姜清曦.好感度 = store.data.姜清曦.好感度 + delta;
}
</script>

<style lang="scss" scoped>
.favor-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--c-cloud);
  border-bottom: 1px dashed var(--c-gold);
  flex-wrap: wrap;
}

.favor-label {
  font-weight: bold;
  font-size: 0.88rem;
  color: var(--c-umber);
}

.favor-track {
  flex: 1;
  max-width: 300px;
  height: 10px;
  border: 1px solid var(--c-gold);
  background: var(--c-bamboo);
  position: relative;
  overflow: hidden;
}

.favor-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, var(--c-jade), var(--c-jade-light));
  transition: width 0.3s ease;
}

.favor-zero-mark {
  position: absolute;
  top: -1px;
  bottom: -1px;
  width: 2px;
  background: var(--c-ink);
  opacity: 0.4;
  z-index: 1;
}

.favor-value {
  font-weight: bold;
  font-size: 0.9rem;
  min-width: 28px;
  text-align: right;
}

.favor-phase {
  font-size: 0.78rem;
  color: var(--c-jade);
  border: 1px solid var(--c-jade);
  padding: 1px 6px;
  white-space: nowrap;
}

.favor-controls {
  display: flex;
  gap: 3px;
}

.favor-button {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--c-gold);
  background: var(--c-parchment);
  color: var(--c-ink);
  font-family: inherit;
  font-weight: bold;
  font-size: 0.9rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.15s;
}

.favor-button:hover:not(:disabled) {
  background: var(--c-jade);
  color: var(--c-cloud);
  border-color: var(--c-jade);
}

.favor-button:active:not(:disabled) {
  transform: scale(0.92);
}

.favor-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
