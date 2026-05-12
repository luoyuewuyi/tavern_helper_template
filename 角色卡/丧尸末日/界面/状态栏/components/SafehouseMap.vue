<template>
  <div class="safehouse-map">
    <!-- 楼层切换标签 -->
    <div class="floor-tabs">
      <button
        v-for="floor in floors"
        :key="floor.id"
        class="floor-tab"
        :class="{ active: activeFloor === floor.id }"
        @click="activeFloor = floor.id"
      >
        {{ floor.label }}
      </button>
    </div>

    <!-- 安全屋等级信息 -->
    <div class="safehouse-info">
      <span class="level-badge">Lv.{{ data.安全屋.等级 }}</span>
      <span class="level-text">安全屋等级</span>
    </div>

    <!-- 房间地图 -->
    <div class="room-grid">
      <div
        v-for="room in currentRooms"
        :key="room.name"
        class="room-card"
        :class="{ occupied: room.npc, expanded: expandedRoom === room.name }"
        @click="toggleRoom(room.name)"
      >
        <div class="room-header">
          <span class="room-icon">{{ room.icon }}</span>
          <span class="room-name">{{ room.shortName }}</span>
        </div>
        <div v-if="room.npc" class="room-npc">
          <span class="npc-dot"></span>
          <span class="npc-name">{{ room.npc }}</span>
        </div>
        <div v-else class="room-empty">空闲</div>

        <!-- 展开详情 -->
        <div v-if="expandedRoom === room.name" class="room-detail">
          <div v-if="room.npc && getNpcInfo(room.npc)" class="npc-detail">
            <div class="detail-row">
              <span class="detail-label">状态</span>
              <span class="detail-value">{{ getNpcInfo(room.npc)?.当前行为 }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">异能</span>
              <span class="detail-value">{{ getNpcInfo(room.npc)?.持有异能 || '无' }}</span>
            </div>
          </div>
          <div v-else class="npc-detail empty-detail">暂无住客</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../schema';

const props = defineProps<{ data: Schema }>();

const activeFloor = ref('1F');
const expandedRoom = ref<string | null>(null);

const floors = [
  { id: '1F', label: '1楼' },
  { id: '2F', label: '2楼' },
  { id: 'OUT', label: '阳台' },
];

const roomIcons: Record<string, string> = {
  车库: '🚗',
  防御大门: '🚪',
  巨大客厅: '🛋️',
  浴室: '🛁',
  棋牌室: '🎲',
  游戏屋: '🎮',
  图书室: '📚',
  健身房: '💪',
  王寅卧室: '🛏️',
  住客房间: '🏠',
  游泳池: '🏊',
  农业区: '🌾',
  冰库: '❄️',
  工程房: '🔧',
};

function getFloorPrefix(floorId: string): string {
  if (floorId === '1F') return '1楼·生活核心区';
  if (floorId === '2F') return '2楼·功能拓展区';
  return '外设阳台·资源自给区';
}

const currentRooms = computed(() => {
  const prefix = getFloorPrefix(activeFloor.value);
  return Object.entries(props.data.安全屋.房间)
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, room]) => {
      const shortName = name.split('-').pop() || name;
      return {
        name,
        shortName,
        icon: roomIcons[shortName] || '📍',
        npc: room.处于此处的NPC || '',
      };
    });
});

function toggleRoom(name: string) {
  expandedRoom.value = expandedRoom.value === name ? null : name;
}

function getNpcInfo(npcName: string) {
  // NPC名可能包含多个名字（用逗号分隔），取第一个
  const firstName = npcName.split(/[,，、]/)[0].trim();
  return props.data.NPC状态[firstName];
}
</script>

<style lang="scss" scoped>
.safehouse-map {
  padding: 12px;
}

.floor-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  background: var(--phone-bg);
  border-radius: 8px;
  padding: 3px;
}

.floor-tab {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--phone-text-dim);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: var(--phone-text);
  }

  &.active {
    background: var(--phone-accent);
    color: var(--phone-bg);
  }
}

.safehouse-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--phone-card);
  border-radius: var(--phone-radius);
  border: 1px solid var(--phone-border);
}

.level-badge {
  padding: 2px 8px;
  background: var(--phone-accent);
  color: var(--phone-bg);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.level-text {
  font-size: 12px;
  color: var(--phone-text-dim);
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.room-card {
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--phone-accent);
    box-shadow: var(--phone-glow);
  }

  &.occupied {
    border-left: 3px solid var(--phone-accent);
  }

  &.expanded {
    grid-column: 1 / -1;
  }
}

.room-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.room-icon {
  font-size: 16px;
}

.room-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--phone-text);
}

.room-npc {
  display: flex;
  align-items: center;
  gap: 4px;
}

.npc-dot {
  width: 6px;
  height: 6px;
  background: var(--phone-accent);
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.npc-name {
  font-size: 10px;
  color: var(--phone-accent);
  font-weight: 500;
}

.room-empty {
  font-size: 10px;
  color: var(--phone-text-muted);
  font-style: italic;
}

.room-detail {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--phone-border);
}

.npc-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 10px;
  color: var(--phone-text-muted);
}

.detail-value {
  font-size: 10px;
  color: var(--phone-text);
  text-align: right;
  max-width: 60%;
}

.empty-detail {
  text-align: center;
  color: var(--phone-text-muted);
  font-size: 10px;
  font-style: italic;
  padding: 4px 0;
}
</style>
