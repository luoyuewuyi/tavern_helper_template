<template>
  <div class="char-status-panel">
    <div v-if="characterList.length === 0" class="empty-state">
      <i class="fa fa-ghost"></i>
      <span>暂无角色状态数据</span>
    </div>

    <div v-for="(char, name) in store.data.角色状态" :key="name" class="char-card">
      <!-- 角色名称 -->
      <div class="char-header">
        <span class="char-avatar">{{ String(name).charAt(0) }}</span>
        <span class="char-name">{{ name }}</span>
        <span class="status-dot" :class="{ active: char.身体状态.length > 0 }"></span>
      </div>

      <!-- 身体状态 -->
      <div v-if="char.身体状态.length > 0" class="status-section">
        <div class="section-label">
          <i class="fa fa-heartbeat"></i>
          <span>身体状态</span>
        </div>
        <div class="tag-list">
          <span v-for="(status, i) in char.身体状态" :key="i" class="status-tag body">
            {{ status }}
          </span>
        </div>
      </div>

      <!-- 心理活动 -->
      <div v-if="char.心理活动.length > 0" class="status-section">
        <div class="section-label">
          <i class="fa fa-brain"></i>
          <span>心理活动</span>
        </div>
        <div class="thought-list">
          <div v-for="(thought, i) in char.心理活动" :key="i" class="thought-bubble">
            <span class="thought-quote">"</span>
            <span class="thought-text">{{ thought }}</span>
            <span class="thought-quote">"</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const characterList = computed(() => Object.keys(store.data.角色状态 || {}));
</script>

<style lang="scss" scoped>
.char-status-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 0.8rem;

  i {
    font-size: 1.5rem;
    opacity: 0.4;
  }
}

.char-card {
  background: var(--c-bg-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--c-cyan), var(--c-purple), transparent);
  }
}

.char-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--c-border);
}

.char-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-cyan-dim), var(--c-purple-dim));
  border: 1px solid var(--c-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-cyan);
  text-shadow: 0 0 6px var(--c-cyan);
  flex-shrink: 0;
}

.char-name {
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text-primary);
  letter-spacing: 0.05em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-text-muted);
  margin-left: auto;
  flex-shrink: 0;

  &.active {
    background: var(--c-green);
    box-shadow: 0 0 6px var(--c-green);
    animation: glowPulse 2s infinite;
  }
}

.status-section {
  padding: 10px 14px;

  & + & {
    border-top: 1px dashed var(--c-border);
  }
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;

  i {
    font-size: 0.7rem;
    color: var(--c-cyan);
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.status-tag {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  padding: 3px 10px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;

  &.body {
    background: var(--c-pink-dim);
    color: var(--c-pink);
    border: 1px solid rgba(255, 96, 144, 0.25);
  }
}

.thought-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.thought-bubble {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--c-text-secondary);
  padding: 8px 12px;
  background: var(--c-bg-hover);
  border-left: 2px solid var(--c-purple);
  border-radius: 0 4px 4px 0;
  line-height: 1.5;
  font-style: italic;
}

.thought-quote {
  color: var(--c-purple);
  font-size: 0.9rem;
  font-weight: 700;
  font-style: normal;
}
</style>
