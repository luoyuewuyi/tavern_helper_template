<template>
  <div class="story-header">
    <div class="story-stage">
      <span class="stage-label">当前章节</span>
      <span class="stage-value">{{ current_stage }}</span>
    </div>
    <div class="decorative-line"></div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const current_stage = computed(() => {
  const story = store.data['主线剧情'] as any;
  return story?.阶段 || '未知章节';
});
</script>

<style lang="scss" scoped>
.story-header {
  padding: 16px 20px 12px;
  text-align: center;
  background: linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid var(--c-border-brown);
}

.story-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.stage-label {
  font-size: 12px;
  color: var(--c-jade-mist);
  letter-spacing: 2px;
}

.stage-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--c-spirit-gold);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 3px;
}

.decorative-line {
  margin-top: 10px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--c-spirit-gold) 20%,
    var(--c-spirit-gold) 80%,
    transparent 100%
  );
  opacity: 0.4;
}
</style>
