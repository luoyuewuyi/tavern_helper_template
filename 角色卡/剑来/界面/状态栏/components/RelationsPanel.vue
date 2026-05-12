<template>
  <div class="relations-panel">
    <div v-if="!_.isEmpty(store.data.人物关系)" class="relations-list">
      <div
        v-for="(info, name) in store.data.人物关系"
        :key="name"
        class="relation-card"
        :class="{ expanded: expandedChar === name }"
        @click="toggleExpand(name as string)"
      >
        <div class="relation-header">
          <span class="char-name">{{ name }}</span>
          <span class="char-realm">{{ info.境界 }}</span>
        </div>

        <!-- 好感度条 -->
        <div class="favor-row">
          <span class="favor-label">好感</span>
          <div class="favor-track">
            <div class="favor-center"></div>
            <div
              class="favor-fill"
              :class="info.好感度 >= 0 ? 'positive' : 'negative'"
              :style="favorStyle(info.好感度)"
            ></div>
          </div>
          <span class="favor-value" :class="info.好感度 >= 0 ? 'positive' : 'negative'">
            {{ info.好感度 > 0 ? '+' : '' }}{{ info.好感度 }}
          </span>
        </div>

        <!-- 展开的详细信息 -->
        <div v-if="expandedChar === name" class="relation-detail">
          <div class="detail-row">
            <span class="detail-icon">📌</span>
            <span class="detail-text">{{ info.当前状态 }}</span>
          </div>
          <div class="detail-row thought">
            <span class="detail-icon">💭</span>
            <span class="detail-text">{{ info.内心活动 }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">江湖茫茫，尚未结识任何人……</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
const expandedChar = ref<string | null>(null);

function toggleExpand(name: string) {
  expandedChar.value = expandedChar.value === name ? null : name;
}

function favorStyle(value: number) {
  const pct = Math.min(Math.abs(value), 100) / 2;
  if (value >= 0) {
    return { left: '50%', width: pct + '%' };
  } else {
    return { right: '50%', width: pct + '%' };
  }
}
</script>

<style lang="scss" scoped>
.relations-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-card {
  border: 1px solid var(--jl-gold-light);
  padding: 8px 10px;
  background: var(--jl-paper);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 2px;

  &:hover {
    border-color: var(--jl-gold);
    box-shadow: 0 2px 8px var(--jl-shadow);
  }

  &.expanded {
    border-color: var(--jl-gold);
    background: #fff;
  }
}

.relation-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.char-name {
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--jl-ink);
}

.char-realm {
  font-size: 0.75rem;
  color: var(--jl-jade);
  font-weight: 500;
}

.favor-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.favor-label {
  font-size: 0.72rem;
  color: var(--jl-ink-faint);
  min-width: 28px;
}

.favor-track {
  flex: 1;
  height: 6px;
  background: var(--jl-paper-dark);
  border: 1px solid var(--jl-gold-light);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.favor-center {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--jl-ink-faint);
  opacity: 0.5;
}

.favor-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  transition: width 0.4s ease;

  &.positive {
    background: linear-gradient(90deg, var(--jl-jade-light), var(--jl-jade));
  }

  &.negative {
    background: linear-gradient(270deg, var(--jl-crimson), #b84040);
  }
}

.favor-value {
  font-size: 0.78rem;
  font-weight: 700;
  min-width: 32px;
  text-align: right;

  &.positive {
    color: var(--jl-jade);
  }
  &.negative {
    color: var(--jl-crimson);
  }
}

.relation-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--jl-gold-light);
  animation: fadeIn 0.25s ease;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 4px;
}

.detail-icon {
  flex-shrink: 0;
  font-size: 0.8rem;
}

.detail-text {
  font-size: 0.8rem;
  color: var(--jl-ink-light);
  line-height: 1.4;
}

.detail-row.thought .detail-text {
  font-style: italic;
  color: var(--jl-ink-faint);
}

.empty-state {
  text-align: center;
  color: var(--jl-ink-faint);
  padding: 20px;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
