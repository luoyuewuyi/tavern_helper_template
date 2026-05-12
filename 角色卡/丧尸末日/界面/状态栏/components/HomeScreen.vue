<template>
  <div class="home-screen">
    <!-- 日期信息 -->
    <div class="date-header">
      <div class="date-text">{{ data.时间.当前日期 }}</div>
      <div class="day-count">
        <span class="day-badge">末日第 {{ data.时间.末日天数 }} 天</span>
      </div>
    </div>

    <!-- App 图标网格 -->
    <div class="app-grid">
      <div v-for="app in apps" :key="app.id" class="app-item" @click="$emit('navigate', app.id)">
        <div class="app-icon" :style="{ background: app.color }">
          <span>{{ app.icon }}</span>
        </div>
        <span class="app-name">{{ app.name }}</span>
        <span v-if="app.badge" class="app-badge">{{ app.badge }}</span>
      </div>
    </div>

    <!-- 快捷信息卡片 -->
    <div class="quick-info">
      <div class="info-card">
        <span class="info-icon">⚡</span>
        <div class="info-content">
          <span class="info-label">异能能量</span>
          <div class="energy-bar">
            <div class="energy-fill" :style="{ width: energyPercent + '%' }"></div>
          </div>
          <span class="info-value">{{ currentEnergy }} / {{ maxEnergy }}</span>
        </div>
      </div>
      <div class="info-card">
        <span class="info-icon">🏰</span>
        <div class="info-content">
          <span class="info-label">安全屋</span>
          <span class="info-value">Lv.{{ data.安全屋.等级 }}</span>
        </div>
      </div>
      <div class="info-card">
        <span class="info-icon">👥</span>
        <div class="info-content">
          <span class="info-label">住客</span>
          <span class="info-value">{{ residentCount }}人</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../schema';

const props = defineProps<{ data: Schema }>();
const emit = defineEmits<{ navigate: [page: string] }>();

const apps = computed(() => [
  { id: 'safehouse', icon: '🗺️', name: '安全屋', color: 'linear-gradient(135deg, #1a5c3a, #0d3320)', badge: null },
  { id: 'character', icon: '👤', name: '人物信息', color: 'linear-gradient(135deg, #4a1a8a, #2d1055)', badge: null },
  {
    id: 'warehouse',
    icon: '📦',
    name: '物资仓库',
    color: 'linear-gradient(135deg, #8a5a1a, #553510)',
    badge: lowStockCount.value > 0 ? '!' : null,
  },
  { id: 'contacts', icon: '📱', name: '通讯录', color: 'linear-gradient(135deg, #1a4a8a, #102d55)', badge: null },
  { id: 'groupchat', icon: '💬', name: '群聊', color: 'linear-gradient(135deg, #8a1a4a, #55102d)', badge: null },
]);

const residentCount = computed(() => {
  return Object.values(props.data.NPC状态).filter(npc => npc.是否为住客).length;
});

const currentEnergy = computed(() => {
  const abilities = Object.values(props.data.主角.异能);
  return abilities.length > 0 ? abilities[0].能量 : 0;
});

const maxEnergy = computed(() => 100);

const energyPercent = computed(() => {
  return Math.min(100, (currentEnergy.value / maxEnergy.value) * 100);
});

const lowStockCount = computed(() => {
  return Object.values(props.data.物资仓库).filter(
    item => item.每自然日消耗量 > 0 && item.数量 <= item.每自然日消耗量 * 3,
  ).length;
});
</script>

<style lang="scss" scoped>
.home-screen {
  padding: 16px;
}

.date-header {
  text-align: center;
  margin-bottom: 20px;
}

.date-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--phone-text);
  margin-bottom: 4px;
}

.day-badge {
  display: inline-block;
  padding: 3px 12px;
  background: var(--phone-danger);
  color: #fff;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 4px rgba(255, 71, 87, 0.4);
  }
  50% {
    box-shadow: 0 0 12px rgba(255, 71, 87, 0.8);
  }
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.95);
  }
}

.app-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.app-name {
  font-size: 10px;
  color: var(--phone-text-dim);
  font-weight: 500;
}

.app-badge {
  position: absolute;
  top: -4px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: var(--phone-danger);
  color: #fff;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 快捷信息
.quick-info {
  display: flex;
  gap: 8px;
}

.info-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: var(--phone-card);
  border-radius: var(--phone-radius);
  border: 1px solid var(--phone-border);
}

.info-icon {
  font-size: 20px;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  display: block;
  font-size: 9px;
  color: var(--phone-text-muted);
  margin-bottom: 2px;
}

.info-value {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--phone-text);
}

.energy-bar {
  height: 4px;
  background: var(--phone-border);
  border-radius: 2px;
  margin: 3px 0;
  overflow: hidden;
}

.energy-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--phone-energy), var(--phone-accent));
  border-radius: 2px;
  transition: width 0.3s;
}
</style>
