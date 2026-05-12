<template>
  <div class="panel">
    <!-- 水面舰队 -->
    <div class="fleet-section">
      <h3 class="section-title">
        <i class="fas fa-ship"></i> 水面舰队
        <span class="fleet-count">{{ store.data.舰队.水面舰队.length }} / {{ store.data.船坞._水面舰队上限 }}</span>
      </h3>
      <div class="fleet-list">
        <div
          v-for="(fleet, idx) in store.data.舰队.水面舰队"
          :key="'sf' + idx"
          class="fleet-card"
          :class="{ expanded: expandedFleet === 'sf' + idx }"
          @click="toggleFleet('sf' + idx)"
        >
          <div class="fleet-header">
            <span class="fleet-name">{{ fleet.舰队名称 }}</span>
            <span class="fleet-oil"> <i class="fas fa-fire"></i> {{ fleet._舰队每季度耗油 }} </span>
          </div>
          <div class="fleet-members">
            <span v-for="(m, mi) in fleet.成员" :key="mi" class="member-tag">
              {{ m.姓名 }}
            </span>
          </div>
          <Transition name="slide">
            <div v-if="expandedFleet === 'sf' + idx" class="fleet-detail">
              <div v-for="(m, mi) in fleet.成员" :key="'d' + mi" class="detail-row">
                <span class="detail-name">{{ m.姓名 }}</span>
                <span class="detail-type">{{ m.舰种 }}</span>
                <span class="detail-oil">{{ getOilCost(m.舰种) }} 油/季</span>
              </div>
            </div>
          </Transition>
        </div>
        <!-- 空槽位提示 -->
        <div v-for="i in emptySlotsSurface" :key="'es' + i" class="fleet-card empty-slot">
          <div class="empty-content">
            <i class="fas fa-plus-circle"></i>
            <span>空闲舰队槽位</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 水下舰队 -->
    <div class="fleet-section">
      <h3 class="section-title">
        <i class="fas fa-water"></i> 水下舰队
        <span class="fleet-count">{{ store.data.舰队.水下舰队.length }} / {{ store.data.船坞._水下舰队上限 }}</span>
      </h3>
      <div class="fleet-list">
        <div
          v-for="(fleet, idx) in store.data.舰队.水下舰队"
          :key="'uf' + idx"
          class="fleet-card sub"
          :class="{ expanded: expandedFleet === 'uf' + idx }"
          @click="toggleFleet('uf' + idx)"
        >
          <div class="fleet-header">
            <span class="fleet-name">{{ fleet.舰队名称 }}</span>
            <span class="fleet-oil"> <i class="fas fa-fire"></i> {{ fleet._舰队每季度耗油 }} </span>
          </div>
          <div class="fleet-members">
            <span v-for="(m, mi) in fleet.成员" :key="mi" class="member-tag sub">
              {{ m.姓名 }}
            </span>
          </div>
          <Transition name="slide">
            <div v-if="expandedFleet === 'uf' + idx" class="fleet-detail">
              <div v-for="(m, mi) in fleet.成员" :key="'d' + mi" class="detail-row">
                <span class="detail-name">{{ m.姓名 }}</span>
                <span class="detail-type">{{ m.舰种 }}</span>
                <span class="detail-oil">{{ getOilCost(m.舰种) }} 油/季</span>
              </div>
            </div>
          </Transition>
        </div>
        <!-- 空槽位提示 -->
        <div v-for="i in emptySlotsUnder" :key="'eu' + i" class="fleet-card empty-slot sub">
          <div class="empty-content">
            <i class="fas fa-plus-circle"></i>
            <span>空闲潜艇槽位</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 总耗油 -->
    <div class="total-card">
      <div class="total-row">
        <span class="total-label">季度总耗油</span>
        <span class="total-value">
          <i class="fas fa-fire"></i>
          {{ store.data.舰队._每季度总耗油 }}
          <span class="total-unit">单位/季</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const 油耗表: Record<string, number> = {
  驱逐舰: 8,
  轻型巡洋舰: 9,
  重型巡洋舰: 10,
  战列巡洋舰: 12,
  战列舰: 14,
  轻型航空母舰: 11,
  航空母舰: 13,
  潜艇: 7,
};

function getOilCost(type: string): number {
  return 油耗表[type] ?? 0;
}

// 空闲槽位计算
const emptySlotsSurface = computed(() => Math.max(0, store.data.船坞._水面舰队上限 - store.data.舰队.水面舰队.length));
const emptySlotsUnder = computed(() => Math.max(0, store.data.船坞._水下舰队上限 - store.data.舰队.水下舰队.length));

// 展开详情
const expandedFleet = ref<string | null>(null);
function toggleFleet(key: string) {
  expandedFleet.value = expandedFleet.value === key ? null : key;
}
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fleet-section {
  background: var(--al-bg-card);
  border-radius: 12px;
  padding: 14px;
  border: 1px solid var(--al-border);
}

.section-title {
  color: var(--al-text-secondary);
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 14px;
  }
}

.fleet-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--al-text-muted);
  font-weight: 400;
}

.fleet-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fleet-card {
  background: var(--al-bg-item);
  border-radius: 10px;
  padding: 12px;
  border-left: 3px solid var(--al-accent);
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background: var(--al-bg-hover);
  }

  &.sub {
    border-left-color: var(--al-success);
  }

  &.empty-slot {
    border-style: dashed;
    border-color: var(--al-border);
    border-left-width: 3px;
    cursor: default;
    opacity: 0.5;

    &:hover {
      background: var(--al-bg-item);
    }
  }
}

.fleet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.fleet-name {
  color: var(--al-text-body);
  font-size: 14px;
  font-weight: 600;
}

.fleet-oil {
  color: var(--al-warn);
  font-size: 12px;
  font-weight: 600;

  i {
    margin-right: 3px;
    font-size: 11px;
  }
}

.fleet-members {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.member-tag {
  background: rgba(74, 158, 255, 0.15);
  color: var(--al-text-muted);
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;

  &.sub {
    background: rgba(38, 208, 206, 0.15);
  }
}

/* 展开详情 */
.fleet-detail {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--al-border);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
  font-size: 12px;
}

.detail-name {
  color: var(--al-text-body);
  flex: 1;
}

.detail-type {
  color: var(--al-text-muted);
  flex: 1;
  text-align: center;
}

.detail-oil {
  color: var(--al-warn);
  font-size: 11px;
  text-align: right;
  width: 60px;
}

.empty-content {
  text-align: center;
  color: var(--al-text-muted);
  font-size: 12px;
  padding: 8px;

  i {
    margin-right: 6px;
    font-size: 14px;
  }
}

/* 总耗油 */
.total-card {
  background: var(--al-bg-card);
  border-radius: 12px;
  padding: 14px 18px;
  border: 1px solid var(--al-border);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  color: var(--al-text-secondary);
  font-size: 14px;
}

.total-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--al-text-primary);

  i {
    color: var(--al-warn);
    font-size: 16px;
    margin-right: 4px;
  }
}

.total-unit {
  font-size: 12px;
  font-weight: 400;
  color: var(--al-text-muted);
  margin-left: 4px;
}

/* 展开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
