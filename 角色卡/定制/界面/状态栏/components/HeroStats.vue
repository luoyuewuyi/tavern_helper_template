<template>
  <div class="hero-stats">
    <!-- 等级与圣之力 -->
    <div class="stat-row">
      <div class="stat-block">
        <span class="label">⚔️ 等级</span>
        <span class="value">Lv.{{ store.data.卡尔德.等级 }}</span>
      </div>
      <div class="stat-block bar-block">
        <span class="label">✝️ 圣之力</span>
        <div class="bar-wrap">
          <div class="bar-fill holy" :style="{ width: store.data.卡尔德.圣之力 + '%' }"></div>
        </div>
        <span class="bar-val">{{ store.data.卡尔德.圣之力 }}%</span>
      </div>
    </div>

    <!-- 魔力 -->
    <div class="stat-row">
      <div class="stat-block bar-block full">
        <span class="label"
          >🔮 魔力 <small>({{ store.data.卡尔德.魔力颜色 }})</small></span
        >
        <div class="bar-wrap">
          <div class="bar-fill mp" :style="{ width: mpPercent + '%' }"></div>
        </div>
        <span class="bar-val">{{ store.data.卡尔德.魔力当前 }}/{{ store.data.卡尔德.魔力上限 }}</span>
      </div>
    </div>

    <!-- 装备与状态 -->
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">👤 身高</span>
        <span class="info-val">{{ store.data.卡尔德.身高 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">🛡️ 穿戴</span>
        <span class="info-val">{{ store.data.卡尔德.穿戴 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">⚔️ 武器</span>
        <span class="info-val">{{ store.data.卡尔德.武器 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">🍆 状态</span>
        <span class="info-val">{{ store.data.卡尔德.鸡巴状态 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">🧍 体位</span>
        <span class="info-val">{{ store.data.卡尔德.体位 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">🏠 房产</span>
        <span class="info-val">{{ store.data.卡尔德.房产 }}</span>
      </div>
    </div>

    <!-- 财富 -->
    <div class="wealth-row">
      <span class="wealth-item purple" v-if="store.data.卡尔德.财富.紫金币 > 0">
        💎 {{ store.data.卡尔德.财富.紫金币 }}
      </span>
      <span class="wealth-item gold">🪙 {{ store.data.卡尔德.财富.金币 }}</span>
      <span class="wealth-item silver">🥈 {{ store.data.卡尔德.财富.银币 }}</span>
      <span class="wealth-item copper">🥉 {{ store.data.卡尔德.财富.铜币 }}</span>
    </div>

    <!-- 位置 -->
    <div class="location-row">📍 {{ store.data.卡尔德.具体位置 }}</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const mpPercent = computed(() => {
  const max = store.data.卡尔德.魔力上限;
  if (max <= 0) return 0;
  return Math.round((store.data.卡尔德.魔力当前 / max) * 100);
});
</script>

<style lang="scss" scoped>
.hero-stats {
  padding: 10px 12px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-main);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.stat-block {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-block.bar-block {
  flex: 1;
}

.stat-block.full {
  width: 100%;
}

.label {
  font-size: 0.78rem;
  color: var(--text-secondary);
  white-space: nowrap;
  small {
    color: var(--text-dim);
    font-size: 0.68rem;
  }
}

.value {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--accent-gold);
  font-family: var(--font-mono);
}

.bar-wrap {
  flex: 1;
  height: 8px;
  background: var(--bar-bg);
  border: 1px solid var(--border-main);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.bar-fill.holy {
  background: linear-gradient(90deg, var(--accent-gold), #f1c40f);
}

.bar-fill.mp {
  background: linear-gradient(90deg, var(--bar-fill-mp), var(--accent-purple));
}

.bar-val {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--text-dim);
  white-space: nowrap;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.info-item {
  background: var(--bg-section);
  padding: 4px 6px;
  border: 1px solid var(--border-main);
  font-size: 0.72rem;
  display: flex;
  flex-direction: column;
}

.info-label {
  color: var(--text-dim);
  font-size: 0.65rem;
  margin-bottom: 1px;
}

.info-val {
  color: var(--text-primary);
  word-break: break-all;
}

.wealth-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 4px 0;
}

.wealth-item {
  font-size: 0.78rem;
  font-family: var(--font-mono);
  font-weight: 600;
}

.wealth-item.purple {
  color: #a855f7;
}
.wealth-item.gold {
  color: var(--accent-gold);
}
.wealth-item.silver {
  color: #bdc3c7;
}
.wealth-item.copper {
  color: #cd7f32;
}

.location-row {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
  padding: 2px 0;
  border-top: 1px dashed var(--border-main);
}

@media (max-width: 400px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
