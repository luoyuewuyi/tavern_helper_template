<template>
  <div class="world-header">
    <div class="time-row">
      <div class="time-block">
        <span class="label">纪年</span>
        <span class="value">{{ store.data.世界.时间.纪年 }}年</span>
      </div>
      <div class="time-block">
        <span class="label">时节</span>
        <span class="value"
          >{{ store.data.世界.时间.季节 }}·{{ store.data.世界.时间.月份 }}月{{ store.data.世界.时间.日期 }}日</span
        >
      </div>
      <div class="time-block">
        <span class="label">时辰</span>
        <span class="value">{{ store.data.世界.时间.时辰 }}时</span>
      </div>
      <div class="time-block weather">
        <span class="label">天气</span>
        <span class="value">{{ weatherIcon }} {{ store.data.世界.事务.天气 }}</span>
      </div>
    </div>

    <div class="location-row">
      <div class="location-main">
        <i class="fa fa-map-marker-alt"></i>
        <span class="area">{{ store.data.世界.地点.当前区域 }}</span>
        <span class="separator">·</span>
        <span class="place">{{ store.data.世界.地点.当前场所 }}</span>
      </div>
      <div class="stage-badge">
        <span class="stage-label">第{{ store.data.世界.回合.当前回合 }}回合</span>
        <span class="stage-name">{{ store.data.世界.回合.人生阶段 }}</span>
      </div>
    </div>

    <!-- 近期事务 -->
    <div v-if="hasEvents" class="events-row">
      <div class="events-title">
        <i class="fa fa-scroll"></i>
        近期事务
      </div>
      <div class="events-list">
        <div v-for="(desc, name) in store.data.世界.事务.近期事务" :key="name" class="event-item">
          <span class="event-name">{{ name }}</span>
          <span class="event-desc">{{ desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const weatherIcon = computed(() => {
  const weather = store.data.世界.事务.天气;
  const icons: Record<string, string> = {
    晴: '☀️',
    阴: '☁️',
    雨: '🌧️',
    雪: '❄️',
    风: '💨',
    雷: '⛈️',
  };
  return icons[weather] || '🌤️';
});

const hasEvents = computed(() => {
  return Object.keys(store.data.世界.事务.近期事务 || {}).length > 0;
});
</script>

<style lang="scss" scoped>
.world-header {
  padding: 10px 12px;
  background: linear-gradient(180deg, rgba(139, 105, 20, 0.08) 0%, transparent 100%);
  border-bottom: 1px solid var(--c-mist);
}

.time-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;

  .label {
    font-size: 0.65rem;
    color: var(--c-cloud);
    letter-spacing: 0.1em;
  }

  .value {
    font-family: var(--font-kai);
    font-size: 0.85rem;
    color: var(--c-bronze);
    font-weight: 600;
  }
}

.weather .value {
  display: flex;
  align-items: center;
  gap: 4px;
}

.location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-top: 1px dashed var(--c-mist);
  border-bottom: 1px dashed var(--c-mist);
}

.location-main {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-kai);

  i {
    color: var(--c-vermilion);
  }

  .area {
    font-size: 0.9rem;
    color: var(--c-ink);
    font-weight: 600;
  }

  .separator {
    color: var(--c-cloud);
  }

  .place {
    font-size: 0.85rem;
    color: var(--c-bronze);
  }
}

.stage-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .stage-label {
    font-size: 0.65rem;
    color: var(--c-cloud);
  }

  .stage-name {
    font-family: var(--font-kai);
    font-size: 0.8rem;
    color: var(--c-jade);
    font-weight: 600;
    padding: 2px 8px;
    background: rgba(0, 168, 107, 0.1);
    border-radius: 2px;
  }
}

.events-row {
  margin-top: 10px;
}

.events-title {
  font-size: 0.75rem;
  color: var(--c-bronze);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: var(--c-gold);
  }
}

.events-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.event-item {
  flex: 0 0 auto;
  min-width: 150px;
  max-width: 200px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--c-mist);
  border-left: 3px solid var(--c-gold);
  border-radius: 2px;

  .event-name {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--c-ink);
    margin-bottom: 4px;
  }

  .event-desc {
    display: block;
    font-size: 0.7rem;
    color: var(--c-cloud);
    line-height: 1.4;
  }
}

@media (max-width: 500px) {
  .time-row {
    justify-content: center;
  }

  .location-row {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .stage-badge {
    align-items: flex-start;
  }

  .events-list {
    flex-direction: column;
  }

  .event-item {
    max-width: none;
  }
}
</style>
