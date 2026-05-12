<template>
  <div>
    <div class="section-head">家族经营</div>
    <div class="family-grid">
      <div class="family-card">
        <div class="fc-header">
          <span class="fc-icon">🏢</span>
          <span class="fc-title">千反田商事</span>
        </div>
        <div class="fc-status">{{ store.data.家族.千反田商事状态 }}</div>
      </div>
      <div class="family-card">
        <div class="fc-header">
          <span class="fc-icon">🛍️</span>
          <span class="fc-title">千家良品</span>
        </div>
        <div class="fc-status">{{ store.data.家族.千家良品状态 }}</div>
      </div>
      <div class="family-card total">
        <div class="fc-header">
          <span class="fc-icon">💎</span>
          <span class="fc-title">家族总资产</span>
        </div>
        <div class="fc-value">{{ store.data.家族.总资产估值 }} <span class="unit">亿日元</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.section-head {
  font-weight: 700;
  font-size: 0.88rem;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-border);
}

.family-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.family-card {
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 10px 12px;
  transition: all 0.2s;
  &:hover {
    border-color: var(--c-border-light);
  }
}

.family-card.total {
  border-color: rgba(212, 168, 67, 0.3);
  background: linear-gradient(135deg, var(--c-bg-deep), var(--c-accent-gold-dim));
}

.fc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.fc-icon {
  font-size: 1rem;
}

.fc-title {
  font-weight: 700;
  font-size: 0.85rem;
}

.fc-status {
  font-size: 0.78rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
}

.fc-value {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-accent-gold);
}

.unit {
  font-size: 0.72rem;
  color: var(--c-text-muted);
  font-weight: normal;
}
</style>
