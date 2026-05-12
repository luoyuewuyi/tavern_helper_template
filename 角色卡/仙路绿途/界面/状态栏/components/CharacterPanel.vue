<template>
  <div class="char-layout">
    <div class="section-head">◈ 姜清曦 · 情报</div>

    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">修为境界</span>
        <span class="info-value">{{ store.data.姜清曦.修为境界 || '未知' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">道心状态</span>
        <span class="info-value">{{ store.data.姜清曦.道心状态 || '未知' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">当前位置</span>
        <span class="info-value">{{ store.data.姜清曦.当前位置 || '未知' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">着装</span>
        <span class="info-value">{{ store.data.姜清曦.着装 || '未知' }}</span>
      </div>
    </div>

    <div class="section-head">◈ 心理状态</div>
    <div class="mental-box">
      <span class="mental-text">{{ store.data.姜清曦.心理状态 || '平静无波' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.char-layout {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-head {
  font-size: 0.92rem;
  font-weight: bold;
  color: var(--c-ink);
  padding-bottom: 4px;
  border-bottom: 2px solid var(--c-jade);
  display: inline-block;
  letter-spacing: 1px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.info-item {
  border: 1px solid var(--c-gold);
  padding: 8px;
  background: var(--c-cloud);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-label {
  font-size: 0.72rem;
  color: var(--c-umber);
  border-bottom: 1px dashed var(--c-gold);
  padding-bottom: 2px;
}

.info-value {
  font-size: 0.85rem;
  font-weight: bold;
}

.mental-box {
  border: 1px solid var(--c-gold);
  padding: 10px 12px;
  background: var(--c-cloud);
  position: relative;
}

.mental-box::before {
  content: '「';
  position: absolute;
  top: 4px;
  left: 6px;
  font-size: 1.1rem;
  color: var(--c-jade);
  opacity: 0.6;
}

.mental-box::after {
  content: '」';
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 1.1rem;
  color: var(--c-jade);
  opacity: 0.6;
}

.mental-text {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--c-ink);
  padding-left: 14px;
  font-style: italic;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
