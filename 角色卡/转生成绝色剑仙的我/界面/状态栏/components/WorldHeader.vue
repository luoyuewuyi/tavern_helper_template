<template>
  <div class="world-header">
    <div class="phase-badge">{{ store.data.世界.游玩阶段 }}</div>
    <div class="meta-row">
      <span>📍 {{ store.data.世界.当前地点 }}</span>
      <span>🕐 {{ store.data.世界.当前时间 }}</span>
    </div>
    <div v-if="!_.isEmpty(store.data.世界.近期事务)" class="event-list">
      <div v-for="(desc, name) in store.data.世界.近期事务" :key="name" class="event-badge">
        <span class="event-title">{{ name }}</span>
        <span class="event-desc">{{ desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-header {
  border-bottom: 2px solid var(--c-ink);
  padding: 10px;
  background: linear-gradient(135deg, var(--c-parchment) 0%, var(--c-cream) 100%);
}

.phase-badge {
  display: inline-block;
  background: var(--c-jade);
  color: #fff;
  padding: 2px 10px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 6px;
  letter-spacing: 2px;
}

.phase-capture .phase-badge {
  background: #c9584c;
}
.phase-train .phase-badge {
  background: var(--c-pink);
}
.phase-fallen .phase-badge {
  background: #8b3a62;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.88rem;
  color: var(--c-mist);
  flex-wrap: wrap;
  gap: 4px;
}

.event-list {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-top: 4px;
}

.event-badge {
  background: var(--c-cream);
  border: 1px solid var(--c-mist);
  padding: 5px 8px;
  min-width: 120px;
  flex: 1;
  position: relative;
  border-left: 3px solid var(--c-jade);
}

.event-title {
  display: block;
  font-weight: bold;
  font-size: 0.82rem;
  margin-bottom: 2px;
}

.event-desc {
  display: block;
  font-size: 0.72rem;
  color: var(--c-mist);
}

@media (max-width: 500px) {
  .meta-row {
    flex-direction: column;
  }
  .event-list {
    flex-direction: column;
  }
  .event-badge {
    min-width: auto;
  }
}
</style>
