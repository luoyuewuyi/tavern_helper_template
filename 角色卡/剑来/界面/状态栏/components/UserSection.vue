<template>
  <div class="user-section">
    <div class="user-header">
      <span class="user-name">🗡️ {{ store.data.user.姓名 }}</span>
      <span class="user-basic">{{ store.data.user.性别 }} · {{ store.data.user.年龄 }}岁</span>
    </div>
    <div class="user-details">
      <div class="detail-item">
        <span class="detail-label">⛰️ 境界</span>
        <span class="detail-value realm">{{ store.data.user.境界 }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">🌿 流派</span>
        <span class="detail-value">{{ store.data.user.修炼流派 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.user-section {
  padding: 10px 14px;
  border-bottom: 1px solid var(--jl-gold-light);
}

.user-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}

.user-name {
  font-family: var(--font-title);
  font-size: 1rem;
  font-weight: 700;
  color: var(--jl-ink);
}

.user-basic {
  font-size: 0.78rem;
  color: var(--jl-ink-faint);
}

.user-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-label {
  font-size: 0.8rem;
  color: var(--jl-ink-faint);
}

.detail-value {
  font-size: 0.85rem;
  color: var(--jl-ink);
  font-weight: 500;
}

.detail-value.realm {
  color: var(--jl-jade);
  font-weight: 700;
}
</style>
