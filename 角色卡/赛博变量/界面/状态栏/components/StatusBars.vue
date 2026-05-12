<template>
  <div class="status-bars">
    <!-- 生命值 -->
    <div class="stat-row">
      <span class="stat-label">HP</span>
      <div class="stat-track">
        <div class="stat-fill hp" :style="{ width: store.data.主角.生命值 + '%' }"></div>
        <span class="stat-value">{{ store.data.主角.生命值 }}/100</span>
      </div>
      <div class="stat-controls">
        <button class="ctrl-btn" :disabled="store.data.主角.生命值 <= 0" @click="adjust('生命值', -5)">-</button>
        <button class="ctrl-btn" :disabled="store.data.主角.生命值 >= 100" @click="adjust('生命值', 5)">+</button>
      </div>
    </div>

    <!-- 心情 -->
    <div class="stat-row">
      <span class="stat-label">心情</span>
      <div class="stat-track">
        <div class="stat-fill mood" :style="{ width: store.data.主角.心情 + '%' }"></div>
        <span class="stat-value">{{ store.data.主角.心情 }}/100</span>
      </div>
      <div class="stat-controls">
        <button class="ctrl-btn" :disabled="store.data.主角.心情 <= 0" @click="adjust('心情', -5)">-</button>
        <button class="ctrl-btn" :disabled="store.data.主角.心情 >= 100" @click="adjust('心情', 5)">+</button>
      </div>
    </div>

    <!-- 快感值 -->
    <div class="stat-row">
      <span class="stat-label">快感</span>
      <div class="stat-track">
        <div class="stat-fill pleasure" :style="{ width: store.data.主角.快感值 + '%' }"></div>
        <span class="stat-value">{{ store.data.主角.快感值 }}/100</span>
      </div>
      <div class="stat-controls">
        <button class="ctrl-btn" :disabled="store.data.主角.快感值 <= 0" @click="adjust('快感值', -5)">-</button>
        <button class="ctrl-btn" :disabled="store.data.主角.快感值 >= 100" @click="adjust('快感值', 5)">+</button>
      </div>
    </div>

    <!-- 货币 -->
    <div class="currency-row">
      <span class="currency-icon">¤</span>
      <span class="currency-value">{{ store.data.主角.货币.toLocaleString() }}</span>
      <span class="currency-label">货币</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

function adjust(field: '生命值' | '心情' | '快感值', delta: number) {
  store.data.主角[field] = Math.max(0, Math.min(100, store.data.主角[field] + delta));
}
</script>

<style lang="scss" scoped>
.status-bars {
  background: var(--c-bg-card);
  padding: 10px 12px;
  border-bottom: 1px solid var(--c-border);
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stat-row:last-of-type {
  margin-bottom: 10px;
}

.stat-label {
  width: 45px;
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--c-text-dim);
}

.stat-track {
  flex: 1;
  height: 16px;
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  position: relative;
  overflow: hidden;
}

.stat-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  transition: width 0.3s ease;
}

.stat-fill.hp {
  background: linear-gradient(90deg, var(--c-red), #ff6688);
  box-shadow: inset 0 0 10px rgba(255, 51, 102, 0.5);
}

.stat-fill.mood {
  background: linear-gradient(90deg, var(--c-cyan), #66f0ff);
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.5);
}

.stat-fill.pleasure {
  background: linear-gradient(90deg, var(--c-magenta), #ff66ff);
  box-shadow: inset 0 0 10px rgba(255, 0, 255, 0.5);
}

.stat-value {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  color: var(--c-text);
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  z-index: 1;
}

.stat-controls {
  display: flex;
  gap: 2px;
}

.ctrl-btn {
  width: 22px;
  height: 22px;
  border: 1px solid var(--c-cyan);
  background: var(--c-bg-dark);
  color: var(--c-cyan);
  font-family: inherit;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;
}

.ctrl-btn:hover:not(:disabled) {
  background: var(--c-cyan);
  color: var(--c-bg-dark);
  box-shadow: var(--glow-cyan);
}

.ctrl-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.ctrl-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.currency-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(240, 255, 0, 0.05);
  border: 1px solid var(--c-yellow);
}

.currency-icon {
  color: var(--c-yellow);
  font-size: 1.1rem;
  font-weight: bold;
}

.currency-value {
  color: var(--c-yellow);
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(240, 255, 0, 0.3);
}

.currency-label {
  color: var(--c-text-dim);
  font-size: 0.7rem;
  margin-left: auto;
}
</style>
