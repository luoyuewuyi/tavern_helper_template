<template>
  <div class="log-panel">
    <div class="section-title">▣ 副本日志</div>

    <div v-if="!_.isEmpty(store.data.副本日志)" class="log-list">
      <div
        v-for="(log, name) in store.data.副本日志"
        :key="name"
        class="log-card"
        :class="'quality-border-' + log.难度.toLowerCase()"
      >
        <div class="log-header">
          <span class="log-dungeon">{{ name }}</span>
          <span class="quality-tag" :class="'quality-' + log.难度.toLowerCase()">{{ log.难度 }}</span>
        </div>
        <div class="log-result" :class="{ success: log.结果.includes('通关'), fail: log.结果.includes('失败') }">
          {{ log.结果 }}
        </div>
        <div class="log-reward">{{ log.收获 }}</div>
      </div>
    </div>
    <div v-else class="empty-hint">尚无副本通关记录</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.log-panel {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-cyan);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid;
  padding: 8px 10px;
  border-radius: 3px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.log-dungeon {
  font-size: 12px;
  font-weight: 700;
}

.quality-tag {
  font-family: var(--font-data);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 2px;
  border: 1px solid;
}

.log-result {
  font-size: 11px;
  margin-bottom: 2px;

  &.success {
    color: var(--accent-green);
  }
  &.fail {
    color: var(--accent-red);
  }
}

.log-reward {
  font-size: 10px;
  color: var(--text-dim);
}

.empty-hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 11px;
  padding: 16px;
  font-style: italic;
}

// 品质色
.quality-border-g {
  border-left-color: var(--quality-g);
}
.quality-border-f {
  border-left-color: var(--quality-f);
}
.quality-border-e {
  border-left-color: var(--quality-e);
}
.quality-border-d {
  border-left-color: var(--quality-d);
}
.quality-border-c {
  border-left-color: var(--quality-c);
}
.quality-border-b {
  border-left-color: var(--quality-b);
}
.quality-border-a {
  border-left-color: var(--quality-a);
}
.quality-border-s {
  border-left-color: var(--quality-s);
}
.quality-border-ss {
  border-left-color: var(--quality-ss);
}
.quality-border-sss {
  border-left-color: var(--quality-sss);
}

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
</style>
