<template>
  <div class="agent-panel">
    <!-- 伪装状态 -->
    <div class="section">
      <div class="section-title"><span class="title-marker">◇</span> 当前伪装</div>
      <div class="cover-block">
        <div class="cover-text">{{ store.data.主角.当前伪装 }}</div>
      </div>
    </div>

    <!-- 暗线进度 -->
    <div class="section">
      <div class="section-title"><span class="title-marker">◇</span> 暗线进度</div>
      <div class="progress-block">
        <div class="progress-text">{{ store.data.主角.暗线进度 }}</div>
      </div>
    </div>

    <!-- 已传递情报 -->
    <div class="section">
      <div class="section-title"><span class="title-marker">◇</span> 已传递情报</div>
      <div v-if="!_.isEmpty(store.data.主角.已传递情报)" class="intel-list">
        <div v-for="(content, name) in store.data.主角.已传递情报" :key="name" class="intel-item">
          <div class="intel-name">{{ name }}</div>
          <div class="intel-content">{{ content }}</div>
        </div>
      </div>
      <div v-else class="empty-intel">
        <span class="empty-icon">◌</span>
        <span>尚无情报传出</span>
      </div>
    </div>

    <!-- 警告提示 -->
    <div class="warning-box">
      <span class="warning-icon">▲</span>
      <span>此面板内容属于高度机密。任何暴露都将导致整个情报网络的覆灭。</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.agent-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: bold;
  color: var(--c-text);
  margin-bottom: 6px;
  padding-bottom: 3px;
  border-bottom: 1px dashed var(--c-border-light);
}

.title-marker {
  color: var(--c-accent-green-bright);
  margin-right: 4px;
}

.cover-block,
.progress-block {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--c-border-light);
  border-left: 3px solid var(--c-accent-green);
  padding: 8px 10px;
}

.cover-text,
.progress-text {
  font-size: 12px;
  color: var(--c-text);
  line-height: 1.5;
}

.intel-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.intel-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--c-border-light);
  padding: 7px 10px;
  position: relative;
}

.intel-item::before {
  content: '▸';
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translate(-50%, -50%);
  color: var(--c-accent-green-bright);
  font-size: 10px;
}

.intel-name {
  font-size: 11px;
  font-weight: bold;
  color: var(--c-accent-green-bright);
  margin-bottom: 2px;
}

.intel-content {
  font-size: 11px;
  color: var(--c-text-dim);
  line-height: 1.4;
}

.empty-intel {
  text-align: center;
  color: var(--c-text-dim);
  padding: 14px;
  font-size: 12px;
  font-style: italic;
  background: rgba(0, 0, 0, 0.15);
  border: 1px dashed var(--c-border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-icon {
  font-size: 14px;
}

.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(139, 58, 58, 0.15);
  border: 1px solid var(--c-accent-red);
  font-size: 10px;
  color: var(--c-accent-red-bright);
  line-height: 1.4;
}

.warning-icon {
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
