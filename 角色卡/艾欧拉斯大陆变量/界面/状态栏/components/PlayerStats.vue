<template>
  <div class="character-panel-epic">
    <div class="main-stats-grid">
      <!-- 左侧：核心环形/大进度条 -->
      <div class="core-vitals">
        <div class="vital-circle hp-vital ani-fade-up" style="animation-delay: 0.1s">
          <svg viewBox="0 0 100 100">
            <circle class="track" cx="50" cy="50" r="45" />
            <circle class="fill" cx="50" cy="50" r="45" :style="{ strokeDashoffset: 283 - (283 * hpPercent) / 100 }" />
          </svg>
          <div class="vital-overlay">
            <span class="vital-icon">❤️</span>
            <div class="value-group">
              <span class="vital-value">{{ store.data.主角.HP }}</span>
              <span class="vital-max">/ {{ store.data.主角.HP上限 }}</span>
            </div>
          </div>
          <div class="vital-label">生命力</div>
        </div>

        <div class="vital-circle exp-vital ani-fade-up" style="animation-delay: 0.2s">
          <svg viewBox="0 0 100 100">
            <circle class="track" cx="50" cy="50" r="45" />
            <circle class="fill" cx="50" cy="50" r="45" :style="{ strokeDashoffset: 283 - (283 * expPercent) / 100 }" />
          </svg>
          <div class="vital-overlay">
            <span class="vital-icon">✨</span>
            <div class="value-group">
              <span class="vital-value">{{ store.data.主角.EXP }}</span>
              <span class="vital-max">/ {{ store.data.主角.EXP上限 }}</span>
            </div>
          </div>
          <div class="vital-label">冒险历程</div>
        </div>
      </div>

      <!-- 右侧：详细数值列表 -->
      <div class="detail-stats ani-fade-up" style="animation-delay: 0.3s">
        <div class="rank-header">
          <span class="rank-title">冒险者等级</span>
          <span class="rank-lv gold-glow">LV.{{ store.data.主角.LV }}</span>
        </div>

        <div class="stats-list">
          <div class="stat-line">
            <span class="s-label">黄金资产</span>
            <span class="s-value gold">{{ formatGold(store.data.主角.金币) }} <span class="unit">G</span></span>
          </div>
          <div class="stat-line">
            <span class="s-label">灵魂韧性</span>
            <div class="s-progress">
              <div class="s-fill mood-glow" :style="{ width: store.data.主角.心情值 + '%' }"></div>
            </div>
            <span class="s-value">{{ store.data.主角.心情值 }}%</span>
          </div>
        </div>

        <div class="flavor-section">
          <div class="divider"></div>
          <div class="quote">“愿古老的星辰垂怜于你的剑刃。”</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();

const hpPercent = computed(() => Math.min(100, (store.data.主角.HP / store.data.主角.HP上限) * 100));
const expPercent = computed(() => Math.min(100, (store.data.主角.EXP / store.data.主角.EXP上限) * 100));

function formatGold(value: number) {
  return value >= 10000 ? (value / 1000).toFixed(1) + 'k' : value.toLocaleString();
}
</script>

<style lang="scss" scoped>
.character-panel-epic {
  padding: 30px;
}

.main-stats-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

.core-vitals {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.vital-circle {
  width: 120px;
  position: relative;
  text-align: center;

  svg {
    transform: rotate(-90deg);
  }

  circle {
    fill: none;
    stroke-width: 8;

    &.track {
      stroke: rgba(255, 255, 255, 0.05);
    }
    &.fill {
      stroke-dasharray: 283;
      transition: stroke-dashoffset 0.8s ease;
    }
  }

  &.hp-vital .fill {
    stroke: var(--c-ruby-red);
    filter: drop-shadow(0 0 5px var(--c-ruby-red));
  }
  &.exp-vital .fill {
    stroke: var(--c-magic-purple);
    filter: drop-shadow(0 0 5px var(--c-magic-purple));
  }
}

.vital-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vital-icon {
  font-size: 14px;
  margin-bottom: 2px;
}

.value-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.vital-value {
  font-family: var(--font-title);
  font-size: 24px;
  font-weight: 900;
  color: var(--c-parchment-light);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.vital-max {
  font-size: 10px;
  color: var(--c-parchment-dark);
  opacity: 0.7;
}

.vital-label {
  margin-top: 12px;
  font-family: var(--font-title);
  font-size: 10px;
  color: var(--c-parchment-dark);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.detail-stats {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-left: 20px;
  border-left: 1px solid rgba(139, 108, 66, 0.2);
}

.rank-header {
  border-bottom: 2px solid var(--c-deep-gold);
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rank-title {
  font-family: var(--font-title);
  color: var(--c-parchment-dark);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rank-lv {
  font-family: var(--font-title);
  font-size: 36px;
  font-weight: 900;
  color: var(--c-gold-bright);
}

.stat-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.s-label {
  font-family: var(--font-title);
  font-size: 11px;
  color: var(--c-parchment-dark);
  text-transform: uppercase;
  width: 70px;
}

.s-value {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: bold;

  &.gold {
    color: var(--c-gold-bright);
    text-shadow: 0 0 5px rgba(241, 196, 15, 0.3);
  }

  .unit {
    font-size: 10px;
    opacity: 0.7;
    margin-left: 2px;
  }
}

.s-progress {
  flex: 1;
  margin: 0 15px;
  height: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  padding: 1px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.s-fill {
  height: 100%;
  background: var(--c-magic-teal);
  border-radius: 2px;
  transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &.mood-glow {
    box-shadow: 0 0 10px var(--c-magic-teal);
  }
}

.flavor-section {
  margin-top: auto;
  font-style: italic;
  color: var(--c-parchment-dark);
  opacity: 0.6;
  font-size: 12px;
  text-align: right;

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--c-deep-gold));
    margin-bottom: 10px;
  }
}
</style>
