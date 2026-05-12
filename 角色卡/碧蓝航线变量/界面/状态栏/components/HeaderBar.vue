<template>
  <div class="header-bar">
    <!-- 时间天气行 -->
    <div class="top-row">
      <div class="date-info">
        <div class="main-date">{{ store.data.时间与天气.日期 }}</div>
        <div class="sub-info">
          <span class="badge season">{{ store.data.时间与天气.季节 }}</span>
          <span class="badge time">{{ store.data.时间与天气.时刻 }}</span>
        </div>
      </div>
      <div class="weather-group">
        <span class="weather-icon">{{ weatherIcon }}</span>
        <span class="weather-text">{{ store.data.时间与天气.天气 }}</span>
      </div>
    </div>

    <!-- 资源摘要行 -->
    <div class="resource-row">
      <div class="resource-item">
        <i class="fas fa-oil-can"></i>
        <span class="resource-value" :class="{ danger: hasOilWarning }">
          {{ store.data.仓储中心.特殊用油 }}
        </span>
        <span class="resource-label">用油</span>
      </div>
      <div class="resource-item">
        <i class="fas fa-boxes-stacked"></i>
        <span class="resource-value" :class="{ danger: hasMaterialWarning }">
          {{ store.data.仓储中心.物资 }}
        </span>
        <span class="resource-label">物资</span>
      </div>
      <div class="resource-item council">
        <i class="fas fa-calendar-alt"></i>
        <span class="resource-value">{{ store.data.议会事务.下次中央议会天数 }}</span>
        <span class="resource-label">议会倒计时</span>
      </div>
      <!-- 预警指示 -->
      <div v-if="store.data.预警.length > 0" class="alert-indicator">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ store.data.预警.join(' / ') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const weatherIcons: Record<string, string> = {
  晴: '☀️',
  晴朗: '☀️',
  多云: '⛅',
  阴: '☁️',
  阴天: '☁️',
  小雨: '🌦️',
  大雨: '🌧️',
  雷阵雨: '⛈️',
  雪: '❄️',
  雾: '🌫️',
};

const weatherIcon = computed(() => weatherIcons[store.data.时间与天气.天气] ?? '🌊');
const hasOilWarning = computed(() => store.data.预警.includes('用油告急'));
const hasMaterialWarning = computed(() => store.data.预警.includes('物资告急'));
</script>

<style lang="scss" scoped>
.header-bar {
  background: rgba(10, 31, 68, 0.9);
  border-bottom: 1px solid var(--al-border);
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px 6px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-date {
  font-size: 15px;
  font-weight: 600;
  color: var(--al-text-primary);
}

.sub-info {
  display: flex;
  gap: 6px;
}

.badge {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  color: var(--al-text-muted);
  background: rgba(74, 158, 255, 0.15);
}

.weather-group {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--al-text-secondary);
  font-size: 13px;
}

.weather-icon {
  font-size: 22px;
}

/* 资源摘要 */
.resource-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 14px 10px;
  flex-wrap: wrap;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--al-text-muted);

  i {
    font-size: 13px;
    color: var(--al-accent);
  }

  &.council i {
    color: var(--al-success);
  }
}

.resource-value {
  font-weight: 700;
  font-size: 14px;
  color: var(--al-text-primary);

  &.danger {
    color: var(--al-danger);
    animation: pulse-text 1.5s infinite;
  }
}

.resource-label {
  font-size: 11px;
}

.alert-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(255, 74, 74, 0.2);
  color: var(--al-danger);
  font-size: 11px;
  font-weight: 600;
  animation: pulse-bg 1.5s infinite;

  i {
    font-size: 12px;
  }
}

@keyframes pulse-text {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes pulse-bg {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 74, 74, 0.3);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 74, 74, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 74, 74, 0);
  }
}
</style>
