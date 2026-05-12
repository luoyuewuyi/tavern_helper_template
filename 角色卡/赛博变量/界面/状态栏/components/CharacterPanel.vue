<template>
  <div class="char-panel">
    <!-- 基础信息 -->
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">姓名://</span>
        <span class="info-value">{{ store.data.主角.姓名 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">年龄:</span>
        <span class="info-value">{{ store.data.主角.年龄 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">性别:</span>
        <span class="info-value">{{ store.data.主角.性别 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">身份:</span>
        <span class="info-value">{{ store.data.主角.身份 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">阶层:</span>
        <span class="info-value tier">{{ store.data.主角.阶层 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">改造:</span>
        <span class="info-value mod">{{ store.data.主角.改造程度 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">抗击:</span>
        <span class="info-value def">{{ store.data.主角.抗击打能力 }}</span>
      </div>
    </div>

    <!-- 状态区 -->
    <div class="section-title">// 身体状态</div>
    <div class="status-block">
      <div class="status-item">
        <span class="status-label">[全身]</span>
        <span class="status-text">{{ store.data.主角.身体状态 }}</span>
      </div>
      <div class="status-item highlight">
        <span class="status-label">[腹部]</span>
        <span class="status-text">{{ store.data.主角.腹部状态 }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">[状况]</span>
        <span class="status-text">{{ store.data.主角.当前情况 }}</span>
      </div>
    </div>

    <!-- 外貌 -->
    <div class="section-title">// 外貌</div>
    <div class="appearance-box">
      {{ store.data.主角.外貌 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.char-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 6px;
}

.info-item {
  display: flex;
  gap: 6px;
  padding: 6px 8px;
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
}

.info-label {
  color: var(--c-cyan);
  font-size: 0.72rem;
  white-space: nowrap;
}

.info-value {
  color: var(--c-text);
  font-size: 0.8rem;
  font-weight: bold;
}

.info-value.tier {
  color: var(--c-yellow);
}

.info-value.mod {
  color: var(--c-magenta);
}

.info-value.def {
  color: var(--c-green);
}

.section-title {
  color: var(--c-cyan);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 0;
  border-bottom: 1px solid var(--c-cyan);
  text-shadow: var(--glow-cyan);
}

.status-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-item {
  display: flex;
  gap: 8px;
  padding: 6px 10px;
  background: var(--c-bg-dark);
  border-left: 2px solid var(--c-border);
}

.status-item.highlight {
  border-left-color: var(--c-magenta);
  background: rgba(255, 0, 255, 0.05);
}

.status-label {
  color: var(--c-text-dim);
  font-size: 0.72rem;
  min-width: 45px;
}

.status-text {
  color: var(--c-text);
  font-size: 0.8rem;
}

.appearance-box {
  padding: 10px;
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  color: var(--c-text-dim);
  font-size: 0.8rem;
  line-height: 1.5;
}
</style>
