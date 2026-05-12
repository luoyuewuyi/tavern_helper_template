<template>
  <div class="fate-strip">
    <span class="fate-label">🎲 气运</span>
    <div class="fate-track">
      <div class="fate-fill" :style="{ width: store.data.user.气运 + '%' }" :class="fateClass"></div>
    </div>
    <span class="fate-value" :class="fateClass">{{ store.data.user.气运 }}</span>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();

const fateClass = computed(() => {
  const v = store.data.user.气运;
  if (v >= 70) return 'high';
  if (v >= 40) return 'mid';
  return 'low';
});
</script>

<style lang="scss" scoped>
.fate-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--jl-gold-light);
  background: var(--jl-paper);
}

.fate-label {
  font-size: 0.82rem;
  color: var(--jl-ink-faint);
  white-space: nowrap;
}

.fate-track {
  flex: 1;
  height: 8px;
  background: var(--jl-paper-dark);
  border: 1px solid var(--jl-gold);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.fate-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 3px;
  transition:
    width 0.5s ease,
    background 0.3s ease;

  &.high {
    background: linear-gradient(90deg, var(--jl-gold) 0%, #e8c84a 100%);
    box-shadow: 0 0 6px rgba(201, 169, 110, 0.5);
  }
  &.mid {
    background: var(--jl-jade-light);
  }
  &.low {
    background: var(--jl-crimson);
    box-shadow: 0 0 6px rgba(139, 46, 46, 0.3);
  }
}

.fate-value {
  font-weight: 700;
  font-size: 0.85rem;
  min-width: 28px;
  text-align: right;

  &.high {
    color: var(--jl-gold);
  }
  &.mid {
    color: var(--jl-jade);
  }
  &.low {
    color: var(--jl-crimson);
  }
}
</style>
