<template>
  <div class="panel">
    <div class="section-title">👤 自我感知</div>

    <!-- 绿帽值 -->
    <div class="stat-group">
      <div class="stat-label-row">
        <span>🟢 绿帽值</span>
        <span class="stat-val" :class="greenHatClass">{{ store.data.用户.绿帽值 }}</span>
      </div>
      <div class="stat-bar">
        <div class="stat-fill fill-green-hat" :style="{ width: store.data.用户.绿帽值 + '%' }"></div>
      </div>
      <div class="awakening-tag" :class="awakeningClass">
        {{ store.data.用户.$绿帽癖觉醒 }}
      </div>
    </div>

    <!-- 心理承压阈值 -->
    <div class="stat-group">
      <div class="stat-label-row">
        <span>🧠 心理承压阈值</span>
        <span class="stat-val">{{ store.data.用户.心理承压阈值 }}</span>
      </div>
      <div class="stat-bar">
        <div class="stat-fill fill-psyche" :style="{ width: store.data.用户.心理承压阈值 + '%' }"></div>
      </div>
      <div class="psyche-type">
        {{ psycheType }}
      </div>
    </div>

    <!-- 生殖器长度 -->
    <div class="info-card">
      <span class="info-label">生殖器长度</span>
      <span class="info-value">{{ store.data.用户.生殖器长度 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const greenHatClass = computed(() => ({
  'val-danger': store.data.用户.绿帽值 >= 80,
  'val-warn': store.data.用户.绿帽值 >= 60 && store.data.用户.绿帽值 < 80,
}));

const awakeningClass = computed(() => {
  const state = store.data.用户.$绿帽癖觉醒;
  return {
    'tag-normal': state === '未觉醒',
    'tag-warn': state === '初步觉醒',
    'tag-danger': state === '彻底觉醒',
  };
});

const psycheType = computed(() => {
  const v = store.data.用户.心理承压阈值;
  if (v < 30) return '焦虑型 — 容易被NTR事件刺激';
  if (v < 70) return '平衡型 — 适度反应';
  return '信任型 — 高度容忍';
});
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--c-accent-violet);
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-border);
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--c-text-label);
}
.stat-val {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--c-text-primary);
}
.val-danger {
  color: var(--c-danger) !important;
}
.val-warn {
  color: var(--c-accent-gold) !important;
}

.stat-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--c-bar-bg);
  overflow: hidden;
}
.stat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}
.fill-green-hat {
  background: linear-gradient(90deg, #2ecc71, #fdcb6e, #d63031);
}
.fill-psyche {
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
}

.awakening-tag {
  display: inline-block;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  width: fit-content;
}
.tag-normal {
  background: rgba(46, 204, 113, 0.1);
  color: var(--c-success);
  border: 1px solid rgba(46, 204, 113, 0.25);
}
.tag-warn {
  background: rgba(253, 203, 110, 0.12);
  color: var(--c-accent-gold);
  border: 1px solid rgba(253, 203, 110, 0.25);
}
.tag-danger {
  background: rgba(214, 48, 49, 0.12);
  color: var(--c-danger);
  border: 1px solid rgba(214, 48, 49, 0.25);
}

.psyche-type {
  font-size: 11px;
  color: var(--c-text-secondary);
  font-style: italic;
}

.info-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--c-bg-section);
  border-radius: 6px;
  border: 1px solid var(--c-border);
}
.info-label {
  font-size: 12px;
  color: var(--c-text-label);
}
.info-value {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
}
</style>
