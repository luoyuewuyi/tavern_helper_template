<template>
  <div class="body-layout">
    <div class="section-head">身体状态</div>
    <div class="body-grid">
      <div v-for="(value, key) in store.data.身体状态" :key="key" class="body-item">
        <span class="body-label">{{ key }}</span>
        <span class="body-value">{{ value }}</span>
      </div>
    </div>

    <div class="section-head" style="margin-top: 10px">外貌简述</div>
    <div class="appearance-box">
      {{ store.data.主角.外貌简述 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.body-layout {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-head {
  font-size: 0.88rem;
  font-weight: bold;
  border-bottom: 2px solid var(--c-pink-light);
  display: inline-block;
  margin-bottom: 4px;
  padding-bottom: 2px;
}

.body-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.body-item {
  background: var(--c-cream);
  border: 1px solid var(--c-mist);
  padding: 6px 8px;
  border-left: 3px solid var(--c-pink-light);
}

.body-label {
  display: block;
  font-size: 0.72rem;
  font-weight: bold;
  color: var(--c-pink);
  margin-bottom: 2px;
}

.body-value {
  font-size: 0.82rem;
  color: var(--c-ink);
  line-height: 1.4;
}

.appearance-box {
  background: var(--c-cream);
  border: 1px solid var(--c-mist);
  padding: 8px;
  font-size: 0.82rem;
  line-height: 1.5;
  font-style: italic;
  color: var(--c-ink);
}
</style>
