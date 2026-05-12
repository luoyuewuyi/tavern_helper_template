<template>
  <div class="quest-panel">
    <div class="section-title">◆ 任务</div>

    <!-- 主线任务 -->
    <div class="quest-group">
      <div class="group-label main-label">▶ 主线任务</div>
      <div v-if="mainQuests.length > 0">
        <div v-for="[name, quest] in mainQuests" :key="name" class="quest-card main" :class="'status-' + quest.状态">
          <div class="quest-header">
            <span class="quest-name">{{ name }}</span>
            <span class="quest-status" :class="'status-tag-' + quest.状态">{{ quest.状态 }}</span>
          </div>
          <div class="quest-desc">{{ quest.说明 }}</div>
          <div class="quest-target">🎯 {{ quest.目标 }}</div>
          <div class="quest-reward">🏆 {{ quest.奖励 }}</div>
        </div>
      </div>
      <div v-else class="empty-hint">暂无主线任务</div>
    </div>

    <!-- 支线任务 -->
    <div class="quest-group">
      <div class="group-label side-label">▷ 支线任务</div>
      <div v-if="sideQuests.length > 0">
        <div v-for="[name, quest] in sideQuests" :key="name" class="quest-card side" :class="'status-' + quest.状态">
          <div class="quest-header">
            <span class="quest-name">{{ name }}</span>
            <span class="type-tag" :class="'type-' + quest.类型">{{ quest.类型 }}</span>
            <span class="quest-status" :class="'status-tag-' + quest.状态">{{ quest.状态 }}</span>
          </div>
          <div class="quest-desc">{{ quest.说明 }}</div>
          <div class="quest-target">🎯 {{ quest.目标 }}</div>
          <div class="quest-reward">🏆 {{ quest.奖励 }}</div>
        </div>
      </div>
      <div v-else class="empty-hint">暂无支线任务</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const mainQuests = computed(() => Object.entries(store.data.任务列表).filter(([, q]) => q.类型 === '主线'));

const sideQuests = computed(() => Object.entries(store.data.任务列表).filter(([, q]) => q.类型 !== '主线'));
</script>

<style lang="scss" scoped>
.quest-panel {
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

.quest-group {
  margin-bottom: 10px;
}

.group-label {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 6px;
}

.main-label {
  color: var(--accent-amber);
}

.side-label {
  color: var(--accent-cyan);
}

.quest-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 8px 10px;
  border-radius: 3px;
  margin-bottom: 4px;
  transition: all 0.2s;

  &.main {
    border-left: 3px solid var(--accent-amber);
  }

  &.side {
    border-left: 3px solid var(--accent-cyan);
  }

  &:hover {
    background: var(--bg-card-hover);
  }

  &.status-已完成 {
    opacity: 0.5;
  }

  &.status-失败 {
    opacity: 0.4;
    border-left-color: var(--accent-red);
  }
}

.quest-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.quest-name {
  font-size: 12px;
  font-weight: 700;
  flex: 1;
}

.type-tag {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 2px;
  border: 1px solid;

  &.type-支线 {
    color: var(--accent-cyan);
    border-color: rgba(6, 182, 212, 0.3);
  }
  &.type-隐藏 {
    color: var(--accent-purple);
    border-color: rgba(168, 85, 247, 0.3);
  }
  &.type-紧急 {
    color: var(--accent-red);
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.quest-status {
  font-family: var(--font-data);
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 2px;

  &.status-tag-进行中 {
    color: var(--accent-green);
    background: rgba(34, 197, 94, 0.1);
  }
  &.status-tag-已完成 {
    color: var(--text-dim);
    background: rgba(100, 116, 139, 0.1);
  }
  &.status-tag-失败 {
    color: var(--accent-red);
    background: rgba(239, 68, 68, 0.1);
  }
}

.quest-desc {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.quest-target {
  font-size: 10px;
  color: var(--accent-amber);
  margin-bottom: 2px;
}

.quest-reward {
  font-size: 10px;
  color: var(--accent-green);
}

.empty-hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 11px;
  padding: 12px;
  font-style: italic;
}
</style>
