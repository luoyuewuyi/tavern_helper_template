<template>
  <div class="relation-layout">
    <div v-if="!_.isEmpty(store.data.关系)" class="relation-list">
      <div v-for="(rel, name) in store.data.关系" :key="name" class="relation-card">
        <div class="rel-name">{{ name }}</div>
        <div class="rel-bars">
          <div class="bar-row">
            <span class="bar-label">好感</span>
            <div class="bar-track">
              <div class="bar-fill favor" :style="{ width: rel.好感度 + '%' }"></div>
            </div>
            <span class="bar-value">{{ rel.好感度 }}</span>
          </div>
          <div class="bar-row">
            <span class="bar-label">信任</span>
            <div class="bar-track">
              <div class="bar-fill trust" :style="{ width: rel.信任度 + '%' }"></div>
            </div>
            <span class="bar-value">{{ rel.信任度 }}</span>
          </div>
        </div>
        <div class="rel-attitude">{{ rel.当前态度 }}</div>
      </div>
    </div>
    <div v-else class="empty-state">尚未建立任何关系</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.relation-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.relation-card {
  background: var(--c-slate);
  border: 1px solid var(--c-border);
  padding: 10px;
}

.rel-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 2px solid var(--c-mana);
}

.rel-bars {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 6px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-size: 0.7rem;
  color: var(--c-faint);
  width: 28px;
  font-weight: 600;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.bar-fill.favor {
  background: linear-gradient(90deg, var(--c-warn), #fb7185);
  box-shadow: 0 0 4px rgba(244, 63, 94, 0.4);
}

.bar-fill.trust {
  background: linear-gradient(90deg, var(--c-neon), #67e8f9);
  box-shadow: 0 0 4px rgba(0, 240, 255, 0.4);
}

.bar-value {
  font-size: 0.72rem;
  color: var(--c-ghost);
  width: 24px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.rel-attitude {
  font-size: 0.78rem;
  color: var(--c-faint);
  font-style: italic;
  padding-top: 4px;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.empty-state {
  text-align: center;
  color: var(--c-faint);
  padding: 16px;
  font-style: italic;
  font-size: 0.85rem;
}
</style>
