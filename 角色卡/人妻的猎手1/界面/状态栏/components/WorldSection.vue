<template>
  <div class="world-section">
    <div class="title-row">
      <span class="deco-line left"></span>
      <span class="title-text">人 妻 の 猎 手</span>
      <span class="deco-line right"></span>
    </div>
    <div class="meta-row">
      <span class="meta-item">
        <span class="meta-icon">📅</span>
        <span class="meta-val">{{ store.data.世界.当前日期 }}</span>
      </span>
      <span class="meta-item">
        <span class="meta-icon">⏰</span>
        <span class="meta-val">{{ store.data.世界.当前时间 }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-section {
  background: linear-gradient(180deg, rgba(90, 42, 53, 0.2) 0%, rgba(26, 16, 21, 0.6) 100%);
  border-bottom: 1px solid var(--c-border);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--c-wine-bright),
      var(--c-gold-dim),
      var(--c-wine-bright),
      transparent
    );
    opacity: 0.6;
  }
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px 6px;
}

.title-text {
  font-family: var(--font-title);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--c-gold);
  text-shadow: 0 0 12px var(--c-glow-gold);
  white-space: nowrap;
}

.deco-line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  position: relative;

  &.left {
    background: linear-gradient(90deg, transparent, var(--c-gold-dim));
  }
  &.right {
    background: linear-gradient(90deg, var(--c-gold-dim), transparent);
  }

  &::after {
    content: '◆';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 5px;
    color: var(--c-gold-dim);
    line-height: 1;
  }

  &.left::after {
    left: 0;
  }
  &.right::after {
    right: 0;
  }
}

.meta-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 4px 16px 10px;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.meta-icon {
  font-size: 11px;
  opacity: 0.8;
}

.meta-val {
  color: var(--c-text);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 500px) {
  .meta-row {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
}
</style>
