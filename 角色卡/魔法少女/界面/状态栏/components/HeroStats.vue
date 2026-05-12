<template>
  <div class="hero-stats">
    <div class="hero-header">
      <span class="hero-name">
        <i class="fa-solid fa-star"></i>
        桐浩
      </span>
      <span class="hero-status" :class="statusClass">{{ store.data.主角.状态 }}</span>
    </div>

    <div class="bars">
      <!-- 魔力值 -->
      <div class="bar-row">
        <span class="bar-label">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          魔力
        </span>
        <div class="bar-track">
          <div class="bar-fill magic" :style="{ width: store.data.主角.魔力值 + '%' }"></div>
        </div>
        <span class="bar-value">{{ store.data.主角.魔力值 }}</span>
      </div>

      <!-- 精神值 -->
      <div class="bar-row">
        <span class="bar-label">
          <i class="fa-solid fa-brain"></i>
          精神
        </span>
        <div class="bar-track">
          <div class="bar-fill spirit" :style="{ width: store.data.主角.精神值 + '%' }"></div>
        </div>
        <span class="bar-value">{{ store.data.主角.精神值 }}</span>
      </div>

      <!-- 人气值 -->
      <div class="bar-row">
        <span class="bar-label">
          <i class="fa-solid fa-fire"></i>
          人气
        </span>
        <div class="bar-track">
          <div class="bar-fill fame" :style="{ width: store.data.主角.人气值 + '%' }"></div>
        </div>
        <span class="bar-value">{{ store.data.主角.人气值 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const statusClass = computed(() => {
  const s = store.data.主角.状态;
  if (s.includes('正常')) return 'normal';
  if (s.includes('疲劳') || s.includes('枯竭')) return 'tired';
  if (s.includes('受伤') || s.includes('污染')) return 'danger';
  return 'normal';
});
</script>

<style lang="scss" scoped>
.hero-stats {
  padding: 10px 12px;
  background: var(--mg-bg-card);
  border-bottom: 1px solid var(--mg-border);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.hero-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--mg-accent-gold);

  i {
    font-size: 0.8rem;
    margin-right: 4px;
  }
}

.hero-status {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;

  &.normal {
    background: rgba(110, 231, 183, 0.15);
    color: var(--mg-spirit-green);
    border: 1px solid rgba(110, 231, 183, 0.3);
  }
  &.tired {
    background: rgba(245, 197, 66, 0.15);
    color: var(--mg-fame-gold);
    border: 1px solid rgba(245, 197, 66, 0.3);
  }
  &.danger {
    background: rgba(231, 76, 111, 0.15);
    color: var(--mg-corrupt-red);
    border: 1px solid rgba(231, 76, 111, 0.3);
  }
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  width: 52px;
  font-size: 0.78rem;
  color: var(--mg-text-dim);
  flex-shrink: 0;

  i {
    font-size: 0.7rem;
    margin-right: 3px;
    width: 14px;
    text-align: center;
    display: inline-block;
  }
}

.bar-track {
  flex: 1;
  height: 8px;
  background: rgba(45, 27, 78, 0.8);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(107, 63, 160, 0.3);
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;

  &.magic {
    background: linear-gradient(90deg, #4a7fff, #7baaff);
    box-shadow: 0 0 8px rgba(123, 170, 255, 0.4);
  }
  &.spirit {
    background: linear-gradient(90deg, #34d399, #6ee7b7);
    box-shadow: 0 0 8px rgba(110, 231, 183, 0.4);
  }
  &.fame {
    background: linear-gradient(90deg, #d4a012, #f5c542);
    box-shadow: 0 0 8px rgba(245, 197, 66, 0.4);
  }
}

.bar-value {
  width: 28px;
  text-align: right;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--mg-text);
  flex-shrink: 0;
}
</style>
