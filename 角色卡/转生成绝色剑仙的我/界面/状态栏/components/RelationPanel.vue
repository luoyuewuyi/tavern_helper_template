<template>
  <div class="relation-layout">
    <div class="section-head">人物关系</div>
    <div v-if="!_.isEmpty(store.data.关系)" class="relation-list">
      <div v-for="(info, name) in store.data.关系" :key="name" class="relation-card">
        <div class="relation-header">
          <span class="relation-name">{{ name }}</span>
          <span class="relation-type">{{ info.关系 }}</span>
        </div>
        <div class="relation-bar-row">
          <span class="relation-favor-label">好感</span>
          <div class="relation-bar">
            <div
              class="relation-fill"
              :class="favorClass(info.好感度 as number)"
              :style="{ width: favorWidth(info.好感度 as number) + '%' }"
            ></div>
          </div>
          <span class="relation-favor-value">{{ info.好感度 }}</span>
        </div>
        <div v-if="info.印象" class="relation-impression">{{ info.印象 }}</div>
      </div>
    </div>
    <div v-else class="empty-state">尚未结识任何人物</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function favorWidth(v: number): number {
  return Math.abs(v) / 2;
}

function favorClass(v: number): string {
  if (v >= 80) return 'favor-high';
  if (v >= 40) return 'favor-mid';
  if (v >= 0) return 'favor-low';
  return 'favor-neg';
}
</script>

<style lang="scss" scoped>
.relation-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-head {
  font-size: 0.88rem;
  font-weight: bold;
  border-bottom: 2px solid var(--c-jade);
  display: inline-block;
  margin-bottom: 4px;
  padding-bottom: 2px;
}

.relation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-card {
  background: var(--c-cream);
  border: 1px solid var(--c-mist);
  padding: 8px;
  border-left: 3px solid var(--c-jade);
}

.relation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.relation-name {
  font-weight: bold;
  font-size: 0.88rem;
}

.relation-type {
  font-size: 0.72rem;
  background: var(--c-parchment);
  border: 1px solid var(--c-mist);
  padding: 1px 6px;
  color: var(--c-mist);
}

.relation-bar-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.relation-favor-label {
  font-size: 0.7rem;
  color: var(--c-mist);
  width: 24px;
}

.relation-bar {
  flex: 1;
  height: 6px;
  background: var(--c-parchment);
  border: 1px solid var(--c-mist);
  border-radius: 3px;
  overflow: hidden;
}

.relation-fill {
  height: 100%;
  transition: width 0.4s ease;
  border-radius: 3px;
}

.relation-fill.favor-high {
  background: var(--c-jade);
}
.relation-fill.favor-mid {
  background: var(--c-jade-light);
}
.relation-fill.favor-low {
  background: var(--c-mist);
}
.relation-fill.favor-neg {
  background: #c9584c;
}

.relation-favor-value {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--c-mist);
  width: 28px;
  text-align: right;
}

.relation-impression {
  font-size: 0.76rem;
  color: var(--c-mist);
  font-style: italic;
  padding-top: 2px;
  border-top: 1px dotted var(--c-mist);
}

.empty-state {
  text-align: center;
  color: var(--c-mist);
  padding: 16px;
  font-style: italic;
}
</style>
