<template>
  <div class="panel">
    <!-- 设施概览 -->
    <div class="facilities-grid">
      <!-- 油矿区 -->
      <div class="facility-card">
        <div class="facility-header">
          <div class="facility-icon oil"><i class="fas fa-gas-pump"></i></div>
          <div class="facility-info">
            <div class="facility-name">油矿区</div>
            <div class="facility-level">Lv.{{ store.data.油矿区.等级 }}</div>
          </div>
        </div>
        <div class="facility-stat">
          <span class="stat-value">{{ store.data.油矿区._每季度产量 }}</span>
          <span class="stat-label">季度产油</span>
        </div>
        <div class="level-bar">
          <div
            class="level-fill"
            :style="{ width: (store.data.油矿区.等级 / store.data.油矿区._最高等级) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- 产业区 -->
      <div class="facility-card">
        <div class="facility-header">
          <div class="facility-icon material"><i class="fas fa-hammer"></i></div>
          <div class="facility-info">
            <div class="facility-name">产业区</div>
            <div class="facility-level">Lv.{{ store.data.产业区.等级 }}</div>
          </div>
        </div>
        <div class="facility-stat">
          <span class="stat-value">{{ store.data.产业区._每季度产量 }}</span>
          <span class="stat-label">季度产材</span>
        </div>
        <div class="level-bar">
          <div
            class="level-fill material"
            :style="{ width: (store.data.产业区.等级 / store.data.产业区._最高等级) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- 船坞 -->
      <div class="facility-card">
        <div class="facility-header">
          <div class="facility-icon dock"><i class="fas fa-anchor"></i></div>
          <div class="facility-info">
            <div class="facility-name">船坞</div>
            <div class="facility-level">Lv.{{ store.data.船坞.等级 }}</div>
          </div>
        </div>
        <div class="facility-stats-row">
          <div class="mini-stat">
            <span class="stat-value">{{ store.data.船坞._水面舰队上限 }}</span>
            <span class="stat-label">水面</span>
          </div>
          <div class="mini-stat">
            <span class="stat-value">{{ store.data.船坞._水下舰队上限 }}</span>
            <span class="stat-label">水下</span>
          </div>
        </div>
        <div class="level-bar">
          <div
            class="level-fill dock"
            :style="{ width: (store.data.船坞.等级 / store.data.船坞._最高等级) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- 研究中心 -->
      <div class="facility-card">
        <div class="facility-header">
          <div class="facility-icon research"><i class="fas fa-flask"></i></div>
          <div class="facility-info">
            <div class="facility-name">研究中心</div>
            <div class="facility-level">Lv.{{ store.data.研究中心.等级 }}</div>
          </div>
        </div>
        <div class="facility-stats-row">
          <div class="mini-stat">
            <span class="stat-value">{{ store.data.研究中心._科技点 }}</span>
            <span class="stat-label">科技点</span>
          </div>
          <div class="mini-stat">
            <span class="stat-value">{{ store.data.研究中心._同时研发数量 }}</span>
            <span class="stat-label">并发</span>
          </div>
        </div>
        <div class="level-bar">
          <div
            class="level-fill research"
            :style="{ width: (store.data.研究中心.等级 / store.data.研究中心._最高等级) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 科研舰娘 -->
    <div class="section-card">
      <h3 class="section-title"><i class="fas fa-rocket"></i> 科研舰娘</h3>

      <!-- 研发中 -->
      <div v-if="store.data.科研.研发中.length > 0" class="research-list">
        <div
          v-for="(ship, idx) in store.data.科研.研发中"
          :key="'r' + idx"
          class="research-item"
          @click="toggleExpand('r' + idx)"
        >
          <div class="research-header">
            <span class="research-name">{{ ship.姓名 }}</span>
            <span class="research-type">{{ ship.舰种 }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent(ship) + '%' }"></div>
          </div>
          <div class="research-time">剩余 {{ ship.剩余研发时间 }} 月 / 共 {{ ship.总研发时间 }} 月</div>
          <Transition name="slide">
            <div v-if="expanded === 'r' + idx" class="research-detail">
              研发消耗物资: {{ ship.研发消耗物资 }}<br />
              缩短月数: {{ store.data.研究中心._缩短研发月数 }} 月 (研究中心加成)
            </div>
          </Transition>
        </div>
      </div>
      <div v-else class="empty-state"><i class="fas fa-flask"></i> 暂无研发中的科研舰</div>

      <!-- 已研发 -->
      <div v-if="store.data.科研.已研发.length > 0" class="completed-section">
        <h4 class="sub-title">已研发完成</h4>
        <div class="completed-chips">
          <span v-for="(ship, idx) in store.data.科研.已研发" :key="'d' + idx" class="chip">
            {{ ship.姓名 }}
            <span class="chip-type">{{ ship.舰种 }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

function progressPercent(ship: { 总研发时间: number; 剩余研发时间: number }) {
  if (ship.总研发时间 <= 0) return 100;
  return Math.round(((ship.总研发时间 - ship.剩余研发时间) / ship.总研发时间) * 100);
}

const expanded = ref<string | null>(null);
function toggleExpand(key: string) {
  expanded.value = expanded.value === key ? null : key;
}
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 设施网格 */
.facilities-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.facility-card {
  background: var(--al-bg-card);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid var(--al-border);
}

.facility-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.facility-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;

  &.oil {
    background: rgba(74, 158, 255, 0.2);
    color: var(--al-accent);
  }
  &.material {
    background: rgba(38, 208, 206, 0.2);
    color: var(--al-success);
  }
  &.dock {
    background: rgba(255, 170, 74, 0.2);
    color: var(--al-warn);
  }
  &.research {
    background: rgba(164, 130, 255, 0.2);
    color: #a482ff;
  }
}

.facility-info {
  flex: 1;
}

.facility-name {
  color: var(--al-text-secondary);
  font-size: 12px;
}

.facility-level {
  color: var(--al-text-primary);
  font-size: 14px;
  font-weight: 700;
}

.facility-stat {
  margin-bottom: 6px;
}

.facility-stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
}

.mini-stat {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--al-text-primary);
}

.stat-label {
  font-size: 10px;
  color: var(--al-text-muted);
}

.level-bar {
  height: 4px;
  background: rgba(139, 185, 254, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--al-accent);
  transition: width 0.4s ease;

  &.material {
    background: var(--al-success);
  }
  &.dock {
    background: var(--al-warn);
  }
  &.research {
    background: #a482ff;
  }
}

/* 科研 */
.section-card {
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

.research-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.research-item {
  background: var(--al-bg-item);
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--al-bg-hover);
  }
}

.research-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.research-name {
  color: var(--al-text-secondary);
  font-size: 14px;
  font-weight: 600;
}

.research-type {
  background: rgba(139, 185, 254, 0.15);
  color: var(--al-text-muted);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.progress-bar {
  height: 6px;
  background: rgba(139, 185, 254, 0.15);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--al-accent-gradient);
  transition: width 0.4s ease;
}

.research-time {
  font-size: 11px;
  color: var(--al-text-muted);
}

.research-detail {
  font-size: 11px;
  color: var(--al-text-muted);
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--al-border);
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 14px;
  color: var(--al-text-muted);
  font-size: 12px;
}

/* 已研发 */
.completed-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--al-border);
}

.sub-title {
  color: var(--al-text-muted);
  font-size: 12px;
  margin-bottom: 8px;
}

.completed-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  background: rgba(38, 208, 206, 0.15);
  color: var(--al-success);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.chip-type {
  font-weight: 400;
  font-size: 10px;
  color: var(--al-text-muted);
  margin-left: 4px;
}

/* 展开动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
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
  max-height: 60px;
}

@media (max-width: 360px) {
  .facilities-grid {
    grid-template-columns: 1fr;
  }
}
</style>
