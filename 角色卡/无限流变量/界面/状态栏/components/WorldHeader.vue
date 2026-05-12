<template>
  <div class="world-header">
    <div class="header-top">
      <div class="dungeon-info">
        <span class="dungeon-label">DUNGEON</span>
        <span class="dungeon-name">{{ store.data.世界.当前副本 }}</span>
        <span class="difficulty-badge" :class="'quality-' + store.data.世界.副本难度.toLowerCase()">
          {{ store.data.世界.副本难度 }}
        </span>
      </div>
      <div class="survivors">
        <span class="survivor-icon">👤</span>
        <span class="survivor-count">{{ store.data.世界.存活参与者 }}</span>
      </div>
    </div>

    <div class="header-meta">
      <div class="meta-item">
        <span class="meta-icon">◉</span>
        <span class="meta-text">{{ store.data.世界.当前地点 }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-icon">◷</span>
        <span class="meta-text">{{ store.data.世界.当前时间 }}</span>
      </div>
    </div>

    <div class="progress-line">
      <span class="progress-label">进度</span>
      <span class="progress-text">{{ store.data.世界.副本进度 }}</span>
    </div>

    <!-- 副本规则（可折叠）-->
    <div class="rule-section" v-if="store.data.世界.副本规则">
      <div class="rule-toggle" @click="showRule = !showRule">
        <span>{{ showRule ? '▾' : '▸' }} 副本规则</span>
      </div>
      <Transition name="slide">
        <div v-if="showRule" class="rule-content">
          <pre>{{ store.data.世界.副本规则 }}</pre>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const showRule = ref(false);
</script>

<style lang="scss" scoped>
.world-header {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(6, 182, 212, 0.05) 0%, transparent 100%);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.dungeon-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dungeon-label {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--accent-cyan);
  letter-spacing: 2px;
  opacity: 0.7;
}

.dungeon-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.difficulty-badge {
  font-family: var(--font-data);
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 2px;
  border: 1px solid;
}

.survivors {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.survivor-count {
  font-family: var(--font-data);
  color: var(--accent-amber);
}

.header-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 6px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-secondary);
}

.meta-icon {
  color: var(--accent-cyan);
  font-size: 10px;
}

.progress-line {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.progress-label {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--accent-cyan);
  letter-spacing: 1px;
  flex-shrink: 0;
}

.progress-text {
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rule-section {
  margin-top: 6px;
}

.rule-toggle {
  font-size: 11px;
  color: var(--accent-cyan);
  cursor: pointer;
  user-select: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
}

.rule-content {
  margin-top: 4px;
  padding: 6px 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 3px;

  pre {
    font-size: 11px;
    color: var(--text-secondary);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: var(--font-hud);
    line-height: 1.5;
  }
}

// 品质颜色
.quality-g {
  color: var(--quality-g);
  border-color: var(--quality-g);
}
.quality-f {
  color: var(--quality-f);
  border-color: var(--quality-f);
}
.quality-e {
  color: var(--quality-e);
  border-color: var(--quality-e);
}
.quality-d {
  color: var(--quality-d);
  border-color: var(--quality-d);
}
.quality-c {
  color: var(--quality-c);
  border-color: var(--quality-c);
}
.quality-b {
  color: var(--quality-b);
  border-color: var(--quality-b);
}
.quality-a {
  color: var(--quality-a);
  border-color: var(--quality-a);
}
.quality-s {
  color: var(--quality-s);
  border-color: var(--quality-s);
}
.quality-ss {
  color: var(--quality-ss);
  border-color: var(--quality-ss);
}
.quality-sss {
  color: var(--quality-sss);
  border-color: var(--quality-sss);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 200px;
}
</style>
