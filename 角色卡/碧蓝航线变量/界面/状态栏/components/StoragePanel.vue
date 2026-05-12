<template>
  <div class="panel">
    <!-- 资源卡片 -->
    <div class="resources-grid">
      <!-- 用油储备 -->
      <div class="resource-card" :class="{ danger: hasOilWarning }">
        <div class="resource-header">
          <div class="resource-icon"><i class="fas fa-oil-can"></i></div>
          <div class="resource-label">特殊用油储备</div>
        </div>
        <div class="resource-amount">{{ store.data.仓储中心.特殊用油 }}</div>
        <div class="resource-sub">
          <span class="income"><i class="fas fa-arrow-up"></i> +{{ store.data.油矿区._每季度产量 }}/季</span>
          <span class="expense"><i class="fas fa-arrow-down"></i> -{{ store.data.舰队._每季度总耗油 }}/季</span>
        </div>
        <div class="balance-bar">
          <div class="balance-label">
            季度净变化:
            <span :class="oilBalance >= 0 ? 'positive' : 'negative'">
              {{ oilBalance >= 0 ? '+' : '' }}{{ oilBalance }}
            </span>
          </div>
        </div>
      </div>

      <!-- 物资储备 -->
      <div class="resource-card" :class="{ danger: hasMaterialWarning }">
        <div class="resource-header">
          <div class="resource-icon material"><i class="fas fa-boxes-stacked"></i></div>
          <div class="resource-label">物资储备</div>
        </div>
        <div class="resource-amount">{{ store.data.仓储中心.物资 }}</div>
        <div class="resource-sub">
          <span class="income"><i class="fas fa-arrow-up"></i> +{{ store.data.产业区._每季度产量 }}/季</span>
        </div>
        <div class="balance-bar">
          <div class="balance-label">
            季度净变化:
            <span :class="materialBalance >= 0 ? 'positive' : 'negative'">
              {{ materialBalance >= 0 ? '+' : '' }}{{ materialBalance }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预警列表 -->
    <div v-if="store.data.预警.length > 0" class="warning-section">
      <h3 class="section-title"><i class="fas fa-exclamation-triangle"></i> 预警信息</h3>
      <div class="warning-list">
        <div v-for="(w, idx) in store.data.预警" :key="idx" class="warning-item">
          <i class="fas fa-bolt"></i>
          <span>{{ w }}</span>
        </div>
      </div>
    </div>

    <!-- 收支明细 -->
    <div class="section-card">
      <h3 class="section-title"><i class="fas fa-chart-bar"></i> 季度收支概览</h3>
      <div class="ledger">
        <div class="ledger-group">
          <div class="ledger-title">收入</div>
          <div class="ledger-row">
            <span>油矿区产油</span>
            <span class="income-val">+{{ store.data.油矿区._每季度产量 }} 油</span>
          </div>
          <div class="ledger-row">
            <span>产业区产材</span>
            <span class="income-val">+{{ store.data.产业区._每季度产量 }} 物资</span>
          </div>
        </div>
        <div class="ledger-divider"></div>
        <div class="ledger-group">
          <div class="ledger-title">支出</div>
          <div class="ledger-row">
            <span>舰队耗油</span>
            <span class="expense-val">-{{ store.data.舰队._每季度总耗油 }} 油</span>
          </div>
          <div v-for="(item, idx) in pendingTasks" :key="idx" class="ledger-row">
            <span>{{ item.事项 }}</span>
            <span class="expense-val">
              <template v-if="item.用油消耗 > 0">-{{ item.用油消耗 }} 油 </template>
              <template v-if="item.物资消耗 > 0">-{{ item.物资消耗 }} 材</template>
            </span>
          </div>
          <div v-for="(ship, idx) in store.data.科研.研发中" :key="'rs' + idx" class="ledger-row">
            <span>科研: {{ ship.姓名 }}</span>
            <span class="expense-val">-{{ ship.研发消耗物资 }} 物资</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const hasOilWarning = computed(() => store.data.预警.includes('用油告急'));
const hasMaterialWarning = computed(() => store.data.预警.includes('物资告急'));

const pendingTasks = computed(() => store.data.议会事务.待办事务.filter(t => !t.是否完成));

const oilBalance = computed(() => store.data.油矿区._每季度产量 - store.data.舰队._每季度总耗油);

const materialBalance = computed(() => store.data.产业区._每季度产量);
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resources-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.resource-card {
  background: var(--al-bg-card);
  border-radius: 12px;
  padding: 14px;
  border: 1px solid var(--al-border);
  transition: all 0.3s;

  &.danger {
    border-color: rgba(255, 74, 74, 0.4);
    animation: danger-pulse 2s infinite;
  }
}

@keyframes danger-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(255, 74, 74, 0);
  }
  50% {
    box-shadow: 0 0 12px 2px rgba(255, 74, 74, 0.15);
  }
}

.resource-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.resource-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 158, 255, 0.2);
  color: var(--al-accent);
  font-size: 14px;

  &.material {
    background: rgba(38, 208, 206, 0.2);
    color: var(--al-success);
  }
}

.resource-label {
  color: var(--al-text-secondary);
  font-size: 12px;
}

.resource-amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--al-text-primary);
  margin-bottom: 6px;
}

.resource-sub {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
  margin-bottom: 6px;

  .income {
    color: var(--al-success);
  }
  .expense {
    color: var(--al-warn);
  }

  i {
    margin-right: 3px;
    font-size: 10px;
  }
}

.balance-bar {
  padding-top: 6px;
  border-top: 1px solid var(--al-border);
}

.balance-label {
  font-size: 11px;
  color: var(--al-text-muted);

  .positive {
    color: var(--al-success);
    font-weight: 600;
  }
  .negative {
    color: var(--al-danger);
    font-weight: 600;
  }
}

/* 预警 */
.warning-section {
  background: rgba(255, 74, 74, 0.1);
  border: 1px solid rgba(255, 74, 74, 0.3);
  border-radius: 12px;
  padding: 14px;
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

.warning-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--al-danger);
  font-size: 13px;
  font-weight: 600;

  i {
    font-size: 12px;
  }
}

/* 收支 */
.section-card {
  background: var(--al-bg-card);
  border-radius: 12px;
  padding: 14px;
  border: 1px solid var(--al-border);
}

.ledger {
  font-size: 12px;
}

.ledger-group {
  margin-bottom: 6px;
}

.ledger-title {
  color: var(--al-text-secondary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.ledger-row {
  display: flex;
  justify-content: space-between;
  color: var(--al-text-body);
  padding: 3px 0;
}

.income-val {
  color: var(--al-success);
  font-weight: 600;
}

.expense-val {
  color: var(--al-warn);
  font-weight: 600;
}

.ledger-divider {
  height: 1px;
  background: var(--al-border);
  margin: 6px 0;
}

@media (max-width: 360px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
