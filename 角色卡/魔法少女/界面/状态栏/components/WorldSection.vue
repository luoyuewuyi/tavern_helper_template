<template>
  <div class="world-section">
    <div class="meta-row">
      <span class="meta-item">
        <i class="fa-regular fa-clock"></i>
        {{ formatted_date }} {{ formatted_time }}
      </span>
      <span class="meta-item">
        <i class="fa-solid fa-location-dot"></i>
        {{ store.data.世界.当前地点 }}
      </span>
      <span class="meta-item">
        <i class="fa-solid fa-cloud-sun"></i>
        {{ store.data.世界.天气 }}
      </span>
    </div>
    <div class="event-list">
      <div v-for="(description, name) in store.data.世界.近期事件" :key="name" class="event-badge">
        <span class="event-dot"></span>
        <div class="event-content">
          <span class="event-title">{{ name }}</span>
          <span class="event-desc">{{ description }}</span>
        </div>
      </div>
      <div v-if="_.isEmpty(store.data.世界.近期事件)" class="event-badge">
        <span class="event-dot empty"></span>
        <div class="event-content">
          <span class="event-title">暂无事件</span>
          <span class="event-desc">当前世界风平浪静</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const formatted_date = computed(() => {
  const match = store.data.世界.当前时间.match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : store.data.世界.当前时间.split(' ')[0] || '未知';
});

const formatted_time = computed(() => {
  const match = store.data.世界.当前时间.match(/(\d{2}:\d{2})/);
  return match ? match[1] : store.data.世界.当前时间.split(' ')[1] || '未知';
});
</script>

<style lang="scss" scoped>
.world-section {
  padding: 12px;
  background: linear-gradient(135deg, var(--mg-bg-dark) 0%, var(--mg-bg-panel) 100%);
  border-bottom: 1px solid var(--mg-border);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(155, 109, 215, 0.3);
}

.meta-item {
  font-size: 0.85rem;
  color: var(--mg-text-dim);

  i {
    color: var(--mg-accent-pink);
    margin-right: 4px;
    font-size: 0.75rem;
  }
}

.event-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;

  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--mg-border);
    border-radius: 2px;
  }
}

.event-badge {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(45, 27, 78, 0.6);
  border: 1px solid rgba(107, 63, 160, 0.4);
  border-radius: 4px;
  padding: 8px 10px;
  min-width: 160px;
  flex: 1;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--mg-accent-pink);
  }
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mg-accent-pink);
  margin-top: 6px;
  flex-shrink: 0;
  box-shadow: 0 0 6px var(--mg-accent-pink);

  &.empty {
    background: var(--mg-text-dim);
    box-shadow: none;
  }
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-title {
  display: block;
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--mg-text);
  margin-bottom: 2px;
}

.event-desc {
  display: block;
  font-size: 0.72rem;
  color: var(--mg-text-dim);
  line-height: 1.3;
}

@media (max-width: 500px) {
  .meta-row {
    flex-direction: column;
    gap: 4px;
  }
  .event-list {
    flex-direction: column;
  }
  .event-badge {
    min-width: auto;
  }
}
</style>
