<template>
  <div class="panel">
    <!-- 待办事务 -->
    <div class="section-card">
      <h3 class="section-title"><i class="fas fa-tasks"></i> 待办事务</h3>
      <div class="todo-list">
        <div
          v-for="(item, idx) in store.data.议会事务.待办事务"
          :key="idx"
          class="todo-item"
          :class="{
            completed: item.是否完成,
            warning: !item.是否完成 && (item.物资消耗 > 300 || item.用油消耗 > 300),
          }"
          @click="toggleTodo(idx)"
        >
          <div class="todo-check">
            <i :class="item.是否完成 ? 'fas fa-check-circle' : 'far fa-circle'"></i>
          </div>
          <div class="todo-content">
            <div class="todo-name">{{ item.事项 }}</div>
            <div class="todo-cost">
              <span v-if="item.用油消耗 > 0"><i class="fas fa-oil-can"></i> {{ item.用油消耗 }}</span>
              <span v-if="item.物资消耗 > 0"><i class="fas fa-boxes-stacked"></i> {{ item.物资消耗 }}</span>
            </div>
          </div>
        </div>
        <div v-if="store.data.议会事务.待办事务.length === 0" class="empty-state">
          <i class="fas fa-clipboard-check"></i>
          <span>暂无待办事务</span>
        </div>
      </div>
    </div>

    <!-- 议会倒计时 -->
    <div class="section-card countdown-card">
      <h3 class="section-title"><i class="fas fa-landmark"></i> 中央议会</h3>
      <div class="countdown-display">
        <svg class="countdown-svg" viewBox="0 0 120 120">
          <circle class="circle-bg" cx="60" cy="60" r="50"></circle>
          <circle
            class="circle-progress"
            cx="60"
            cy="60"
            r="50"
            :style="{ strokeDasharray: circumference, strokeDashoffset: dashOffset }"
          ></circle>
        </svg>
        <div class="countdown-center">
          <div class="countdown-days">{{ store.data.议会事务.下次中央议会天数 }}</div>
          <div class="countdown-label">天后召开</div>
        </div>
      </div>
    </div>

    <!-- 常务委员会 & 秘书舰 -->
    <div class="lists-row">
      <div class="section-card">
        <h3 class="section-title"><i class="fas fa-users"></i> 常务委员会</h3>
        <div
          v-for="(m, idx) in store.data.常务委员会"
          :key="'c' + idx"
          class="member-item"
          @click="toggleExpand('c' + idx)"
        >
          <div class="member-name">{{ m.姓名 }}</div>
          <Transition name="slide">
            <div v-if="expanded === 'c' + idx" class="member-detail">阵营: {{ m.阵营 }}</div>
          </Transition>
        </div>
      </div>

      <div class="section-card">
        <h3 class="section-title"><i class="fas fa-user-tie"></i> 秘书舰</h3>
        <div
          v-for="(s, idx) in store.data.秘书舰"
          :key="'s' + idx"
          class="member-item"
          @click="toggleExpand('s' + idx)"
        >
          <div class="member-name">{{ s.姓名 }}</div>
          <Transition name="slide">
            <div v-if="expanded === 's' + idx" class="member-detail">阵营: {{ s.阵营 }}</div>
          </Transition>
        </div>
        <div v-if="store.data.秘书舰.length === 0" class="empty-state">
          <span>暂无秘书舰</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

// 待办事务交互：点击切换完成状态
function toggleTodo(idx: number) {
  store.data.议会事务.待办事务[idx].是否完成 = !store.data.议会事务.待办事务[idx].是否完成;
}

// 议会倒计时圆环
const circumference = 2 * Math.PI * 50;
const dashOffset = computed(() => {
  const days = store.data.议会事务.下次中央议会天数;
  const progress = Math.max(0, Math.min(1, (90 - days) / 90));
  return circumference - progress * circumference;
});

// 成员展开
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

/* 待办事务 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: var(--al-bg-item);
  border-radius: 8px;
  padding: 10px 12px;
  border-left: 3px solid var(--al-accent);
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background: var(--al-bg-hover);
  }

  &.completed {
    opacity: 0.5;
    border-left-color: var(--al-success);

    .todo-name {
      text-decoration: line-through;
    }
  }

  &.warning {
    border-left-color: var(--al-warn);
  }
}

.todo-check {
  color: var(--al-accent);
  font-size: 16px;
  padding-top: 1px;
  flex-shrink: 0;
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-name {
  color: var(--al-text-body);
  font-size: 13px;
  margin-bottom: 4px;
}

.todo-cost {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--al-text-muted);

  i {
    margin-right: 3px;
    font-size: 10px;
  }
}

.empty-state {
  text-align: center;
  padding: 16px;
  color: var(--al-text-muted);
  font-size: 13px;

  i {
    margin-right: 6px;
  }
}

/* 议会倒计时 */
.countdown-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-display {
  position: relative;
  width: 110px;
  height: 110px;
}

.countdown-svg {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: var(--al-border);
  stroke-width: 6;
}

.circle-progress {
  fill: none;
  stroke: var(--al-accent);
  stroke-width: 6;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.5s ease;
}

.countdown-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.countdown-days {
  font-size: 28px;
  font-weight: 700;
  color: var(--al-text-secondary);
}

.countdown-label {
  font-size: 11px;
  color: var(--al-text-muted);
}

/* 人员名单 */
.lists-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.member-item {
  background: var(--al-bg-item);
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--al-bg-hover);
    transform: translateY(-1px);
  }
}

.member-name {
  color: var(--al-text-body);
  font-size: 13px;
}

.member-detail {
  font-size: 11px;
  color: var(--al-text-muted);
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid var(--al-border);
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
  max-height: 40px;
}

@media (max-width: 400px) {
  .lists-row {
    grid-template-columns: 1fr;
  }
}
</style>
