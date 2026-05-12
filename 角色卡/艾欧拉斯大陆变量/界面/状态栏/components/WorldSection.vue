<template>
  <div class="world-header-epic">
    <div class="top-meta">
      <div class="meta-item ani-fade-up" style="animation-delay: 0.1s">
        <span class="label">神历纪年</span>
        <span class="value gold-glow">第 {{ store.data.世界.穿越天数 }} 天</span>
      </div>
      <div class="clock-display ani-fade-up" style="animation-delay: 0.2s">
        <span class="label">等候之时</span>
        <div class="time-container">
          <span class="date">{{ dateString }}</span>
          <span class="time">{{ timeString }}</span>
        </div>
      </div>
      <div class="location-display ani-fade-up" style="animation-delay: 0.3s">
        <span class="label">所在之地</span>
        <span class="value">{{ store.data.世界.当前地点 }}</span>
      </div>
    </div>

    <div v-if="hasEvents" class="event-marquee">
      <div
        v-for="(desc, name, index) in store.data.世界.近期事务"
        :key="name"
        class="event-card ani-slide-in"
        :style="{ animationDelay: 0.4 + index * 0.1 + 's' }"
      >
        <span class="event-name">{{ name }}</span>
        <span class="event-desc">{{ desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();

const hasEvents = computed(() => {
  return store.data.世界.近期事务 && Object.keys(store.data.世界.近期事务).length > 0;
});

const dateString = computed(() => {
  return store.data.世界.当前时间.split(' ')[0] || '';
});

const timeString = computed(() => {
  return store.data.世界.当前时间.split(' ')[1] || store.data.世界.当前时间;
});
</script>

<style lang="scss" scoped>
.world-header-epic {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
  border-bottom: 2px solid var(--c-deep-gold);
  padding: 20px 30px;
}

.top-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.meta-item,
.clock-display,
.location-display {
  display: flex;
  flex-direction: column;
}

.label {
  font-family: var(--font-title);
  font-size: 10px;
  color: var(--c-parchment-dark);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.value {
  font-family: var(--font-title);
  font-weight: 900;
  font-size: 18px;
  color: var(--c-parchment-light);
}

.time-container {
  display: flex;
  flex-direction: column;
  .date {
    font-size: 11px;
    color: var(--c-parchment-dark);
    line-height: 1;
  }
  .time {
    font-family: var(--font-title);
    font-size: 22px;
    font-weight: 900;
    color: var(--c-gold-bright);
    text-shadow: 0 0 10px rgba(241, 196, 15, 0.3);
  }
}

.gold-glow {
  color: var(--c-gold-bright);
  text-shadow: 0 0 12px rgba(241, 196, 15, 0.4);
}

.event-marquee {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 5px 2px 10px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--c-deep-gold);
    border-radius: 2px;
  }
}

.event-card {
  flex: 0 0 auto;
  min-width: 160px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 2px solid var(--c-gold-bright);
  padding: 10px 15px;
  border-radius: 0 4px 4px 0;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.ani-slide-in {
  animation: slide-in-right 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.event-name {
  display: block;
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: bold;
  color: var(--c-gold-bright);
  letter-spacing: 1px;
}

.event-desc {
  display: block;
  font-size: 11px;
  color: var(--c-parchment-dark);
  margin-top: 4px;
  line-height: 1.4;
}
</style>
