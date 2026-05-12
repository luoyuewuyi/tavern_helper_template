<template>
  <div class="favor-section">
    <div class="favor-header">
      <span class="favor-icon">🎭</span>
      <span class="favor-title">解雨臣 · 好感度</span>
    </div>
    <div class="favor-bar-row">
      <span class="favor-stage">💘 {{ store.data.解雨臣.好感阶段 }}</span>
      <div class="favor-track">
        <div class="favor-fill" :style="{ width: store.data.解雨臣.好感度 + '%' }"></div>
      </div>
      <span class="favor-value">{{ store.data.解雨臣.好感度 }}/100</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.favor-section {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(160, 144, 112, 0.25);
}

.favor-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.favor-icon {
  font-size: 1.1em;
}

.favor-title {
  font-weight: bold;
  font-size: 0.95em;
  color: var(--c-gold);
}

.favor-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.favor-stage {
  font-weight: bold;
  font-size: 0.85em;
  color: var(--c-gold);
  white-space: nowrap;
}

.favor-track {
  flex: 1;
  height: 12px;
  border: 1.5px solid var(--c-ash-gold);
  background: rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}

.favor-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, #8b6914, #c8a882, #e8d0a8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.favor-value {
  font-size: 0.82em;
  color: var(--c-grey-ink);
  white-space: nowrap;
  min-width: 48px;
  text-align: right;
}

.favor-controls {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.favor-button {
  width: 26px;
  height: 24px;
  padding: 0;
  border: 1.5px solid var(--c-ash-gold);
  background: var(--c-parchment);
  color: var(--c-ink);
  font-family: inherit;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  border-radius: 4px;
}

.favor-button:active:not(:disabled) {
  transform: translate(1px, 1px);
}

.favor-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
