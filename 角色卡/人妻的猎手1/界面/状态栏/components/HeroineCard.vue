<template>
  <div class="heroine-card">
    <!-- 攻略值进度条 -->
    <div class="bar-section">
      <span class="bar-label">❤️ 攻略值</span>
      <div class="bar-track">
        <div class="bar-fill" :style="{ width: data['❤️攻略值'] + '%' }">
          <div class="bar-glow"></div>
        </div>
      </div>
      <span class="bar-val">{{ data['❤️攻略值'] }}<span class="bar-max">/100</span></span>
    </div>

    <!-- 阶段 & 状态 -->
    <div class="info-row">
      <div class="info-badge stage">
        <span class="badge-icon">🎭</span>
        <span>{{ data.$攻略阶段 }}</span>
      </div>
      <div class="info-badge status" :class="statusClass">
        <span class="status-dot"></span>
        <span>{{ data.登场状态 }}</span>
      </div>
    </div>

    <!-- 突破事件 -->
    <div class="section">
      <div class="section-head">
        <span class="section-icon">⚡</span>
        <span>突破事件</span>
        <span class="section-line"></span>
      </div>
      <div class="event-grid">
        <div
          v-for="(status, eventName) in data.突破事件"
          :key="eventName"
          class="event-item"
          :class="eventStatusClass(status)"
        >
          <span class="event-name">{{ eventName }}</span>
          <span class="event-badge" :class="eventStatusClass(status)">
            <span v-if="status === '已完成'" class="event-check">✓</span>
            <span v-if="status === '进行中'" class="event-pulse-dot"></span>
            {{ status }}
          </span>
        </div>
      </div>
    </div>

    <!-- 身体状态 -->
    <div class="section">
      <div class="section-head">
        <span class="section-icon">📋</span>
        <span>身体状态</span>
        <span class="section-line"></span>
      </div>
      <div class="detail-grid">
        <div v-for="(val, key) in data.身体状态" :key="key" class="detail-item">
          <span class="detail-key">{{ key }}</span>
          <span class="detail-val">{{ val }}</span>
        </div>
      </div>
    </div>

    <!-- 体态姿势 -->
    <div class="section">
      <div class="section-head">
        <span class="section-icon">💃</span>
        <span>体态姿势</span>
        <span class="section-line"></span>
      </div>
      <div class="prose">{{ data['💃体态姿势'] }}</div>
    </div>

    <!-- 内心想法 -->
    <div class="thought-box">
      <div class="thought-bubble">
        <span class="thought-icon">💭</span>
        <span class="thought-text">{{ data['💭内心想法'] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  data: any;
}>();

const statusClass = computed(() => {
  switch (props.data.登场状态) {
    case '登场中':
      return 'on-stage';
    case '离场':
      return 'off-stage';
    default:
      return 'not-appeared';
  }
});

function eventStatusClass(status: string) {
  switch (status) {
    case '进行中':
      return 'evt-active';
    case '已完成':
      return 'evt-done';
    default:
      return 'evt-pending';
  }
}
</script>

<style lang="scss" scoped>
.heroine-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ===== 进度条 ===== */
.bar-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.bar-label {
  font-size: 12px;
  color: var(--c-gold);
  font-weight: 700;
  white-space: nowrap;
  text-shadow: 0 0 8px var(--c-glow-gold);
}

.bar-track {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--c-border);
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--c-bar-start), var(--c-bar-mid), var(--c-bar-end));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 2px;
}

.bar-glow {
  position: absolute;
  right: 0;
  top: -2px;
  bottom: -2px;
  width: 12px;
  background: radial-gradient(circle at right, var(--c-glow), transparent);
  animation: pulseGlow 2s ease-in-out infinite;
}

.bar-val {
  font-size: 13px;
  color: var(--c-gold-bright);
  font-weight: 700;
  min-width: 50px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.bar-max {
  font-size: 11px;
  color: var(--c-text-dim);
  font-weight: 400;
}

/* ===== 阶段 & 状态 ===== */
.info-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.badge-icon {
  font-size: 11px;
}

.stage {
  background: linear-gradient(135deg, rgba(90, 42, 53, 0.5), rgba(90, 42, 53, 0.2));
  border: 1px solid var(--c-wine);
  color: var(--c-gold);
  box-shadow: 0 0 8px rgba(90, 42, 53, 0.3);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status.on-stage {
  background: linear-gradient(135deg, rgba(60, 140, 60, 0.3), rgba(60, 120, 60, 0.15));
  border: 1px solid rgba(80, 180, 80, 0.4);
  color: #8fd88f;

  .status-dot {
    background: #8fd88f;
    box-shadow: 0 0 6px rgba(80, 180, 80, 0.6);
    animation: pulseGlow 2s ease-in-out infinite;
  }
}

.status.off-stage {
  background: linear-gradient(135deg, rgba(140, 120, 60, 0.3), rgba(120, 100, 60, 0.15));
  border: 1px solid rgba(180, 160, 80, 0.4);
  color: #d8c88f;

  .status-dot {
    background: #d8c88f;
  }
}

.status.not-appeared {
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.3), rgba(60, 60, 60, 0.15));
  border: 1px solid rgba(120, 120, 120, 0.3);
  color: #999;

  .status-dot {
    background: #999;
  }
}

/* ===== 分节 ===== */
.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-gold);
}

.section-icon {
  font-size: 11px;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--c-border-bright), transparent);
}

/* ===== 身体状态网格 ===== */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 6px;
}

.detail-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 6px 10px;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:hover {
    border-color: var(--c-border-bright);
    background: linear-gradient(135deg, rgba(90, 42, 53, 0.1), rgba(255, 255, 255, 0.02));
    transform: translateY(-1px);
  }
}

.detail-key {
  font-size: 11px;
  color: var(--c-gold-dim);
  font-weight: 600;
}

.detail-val {
  font-size: 12px;
  color: var(--c-text);
  line-height: 1.4;
}

/* ===== 正文 ===== */
.prose {
  font-size: 12px;
  color: var(--c-text);
  padding: 6px 10px;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.02);
  border-left: 2px solid var(--c-wine);
  border-radius: 0 4px 4px 0;
}

/* ===== 内心想法 ===== */
.thought-box {
  margin-top: 2px;
}

.thought-bubble {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(90, 42, 53, 0.15), rgba(90, 42, 53, 0.05));
  border: 1px solid rgba(180, 120, 90, 0.15);
  border-radius: 8px;
  position: relative;
  animation: breathe 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    left: 14px;
    top: -5px;
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, rgba(90, 42, 53, 0.15), transparent);
    border-left: 1px solid rgba(180, 120, 90, 0.15);
    border-top: 1px solid rgba(180, 120, 90, 0.15);
    transform: rotate(45deg);
  }
}

.thought-icon {
  flex-shrink: 0;
  font-size: 14px;
}

.thought-text {
  font-size: 12px;
  font-style: italic;
  color: var(--c-gold-dim);
  line-height: 1.6;
}

/* ===== 突破事件 ===== */
.event-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.event-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid var(--c-border);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.005));
  transition: all 0.25s ease;

  &.evt-active {
    border-color: rgba(245, 180, 60, 0.35);
    background: linear-gradient(135deg, rgba(180, 130, 30, 0.12), rgba(180, 130, 30, 0.04));
  }

  &.evt-done {
    border-color: rgba(80, 180, 80, 0.3);
    background: linear-gradient(135deg, rgba(60, 140, 60, 0.1), rgba(60, 140, 60, 0.03));
  }
}

.event-name {
  font-size: 12px;
  color: var(--c-text);
  font-weight: 500;
}

.event-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;

  &.evt-pending {
    color: #777;
    background: rgba(100, 100, 100, 0.15);
    border: 1px solid rgba(120, 120, 120, 0.2);
  }

  &.evt-active {
    color: #f5c842;
    background: linear-gradient(135deg, rgba(245, 180, 60, 0.2), rgba(200, 140, 30, 0.1));
    border: 1px solid rgba(245, 180, 60, 0.3);
    box-shadow: 0 0 8px rgba(245, 180, 60, 0.15);
    animation: eventPulse 2s ease-in-out infinite;
  }

  &.evt-done {
    color: #8fd88f;
    background: linear-gradient(135deg, rgba(80, 180, 80, 0.2), rgba(60, 140, 60, 0.1));
    border: 1px solid rgba(80, 180, 80, 0.3);
  }
}

.event-check {
  font-weight: 700;
  font-size: 12px;
}

.event-pulse-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #f5c842;
  box-shadow: 0 0 6px rgba(245, 200, 66, 0.6);
  animation: pulseGlow 1.5s ease-in-out infinite;
}

/* ===== 动画 ===== */
@keyframes pulseGlow {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes eventPulse {
  0%,
  100% {
    box-shadow: 0 0 4px rgba(245, 180, 60, 0.1);
  }
  50% {
    box-shadow: 0 0 12px rgba(245, 180, 60, 0.3);
  }
}

@keyframes breathe {
  0%,
  100% {
    box-shadow: 0 0 0 rgba(90, 42, 53, 0);
  }
  50% {
    box-shadow: 0 0 12px rgba(90, 42, 53, 0.15);
  }
}

@media (max-width: 500px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
