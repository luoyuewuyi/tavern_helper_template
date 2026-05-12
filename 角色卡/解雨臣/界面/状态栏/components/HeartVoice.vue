<template>
  <div class="heart-section">
    <div class="heart-header">
      <span class="heart-icon">💭</span>
      <span class="heart-title">解雨臣的心声</span>
    </div>
    <div class="heart-content">「{{ store.data.解雨臣.心理活动 }}」</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.heart-section {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(160, 144, 112, 0.25);
}

.heart-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.heart-icon {
  font-size: 1em;
}

.heart-title {
  font-weight: bold;
  font-size: 0.9em;
  color: var(--c-lavender);
}

.heart-content {
  font-size: 0.88em;
  font-style: italic;
  color: var(--c-grey-ink);
  padding: 8px 10px;
  background: rgba(184, 160, 200, 0.06);
  border-left: 2px solid rgba(184, 160, 200, 0.35);
  border-radius: 0 6px 6px 0;
  line-height: 1.5;
}
</style>
