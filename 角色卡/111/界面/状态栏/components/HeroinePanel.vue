<template>
  <div class="heroine-panel">
    <!-- 林美艳头部信息 -->
    <div class="heroine-header">
      <div class="heroine-name">林美艳</div>
      <div v-if="heroine?.基础?.姿态描述" class="heroine-status">{{ heroine.基础.姿态描述 }}</div>
    </div>

    <!-- 当前状态 -->
    <div v-if="heroine?.基础?.当前状态" class="status-section">
      <div class="section-title">◇ 当前状态</div>
      <div class="status-text">{{ heroine.基础.当前状态 }}</div>
    </div>

    <!-- 核心数值 -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-label">性欲值</span>
        <div class="stat-bar">
          <div class="stat-fill desire" :style="{ width: desire_percent + '%' }"></div>
        </div>
        <span class="stat-value">{{ heroine?.生理?.性欲值 ?? 0 }}</span>
      </div>
    </div>

    <!-- 服装信息 -->
    <div v-if="heroine?.服装" class="attire-section">
      <div class="section-title">◈ 当前着装</div>
      <div v-if="heroine.服装.风格" class="attire-style">风格：{{ heroine.服装.风格 }}</div>
      <div class="attire-grid">
        <div v-for="(desc, slot) in displayed_attire" :key="slot" class="attire-item">
          <span class="attire-slot">{{ slot }}</span>
          <span class="attire-desc">{{ desc }}</span>
        </div>
      </div>
    </div>

    <!-- 内心想法 -->
    <div v-if="heroine?.基础?.内心想法" class="thought-bubble">
      <span class="thought-icon">💭</span>
      <span class="thought-text">{{ heroine.基础.内心想法 }}</span>
    </div>

    <!-- 心理活动 -->
    <div v-if="heroine?.基础?.心理活动" class="thought-bubble mind-bubble">
      <span class="thought-icon">🧠</span>
      <span class="thought-text">{{ heroine.基础.心理活动 }}</span>
    </div>

    <!-- 最近性行为 -->
    <div v-if="heroine?.基础?.最近性行为" class="recent-act-section">
      <div class="section-title">◇ 最近性行为</div>
      <div class="status-text">{{ heroine.基础.最近性行为 }}</div>
    </div>

    <!-- 身体状态 -->
    <SectionCollapse v-if="heroine?.身体" title="身体状态" storage-key="heroine_body">
      <div class="body-list">
        <div v-if="heroine.身体.姿态与神情" class="body-item">
          <span class="body-label">姿态与神情</span>
          <span class="body-value">{{ heroine.身体.姿态与神情 }}</span>
        </div>
        <div v-if="heroine.身体.口腔" class="body-item">
          <span class="body-label">口腔</span>
          <span class="body-value">{{ heroine.身体.口腔 }}</span>
        </div>
        <div v-if="heroine.身体.胸部" class="body-item">
          <span class="body-label">胸部</span>
          <span class="body-value">{{ heroine.身体.胸部 }}</span>
        </div>
        <div v-if="heroine.身体.阴道" class="body-item">
          <span class="body-label">阴道</span>
          <span class="body-value">{{ heroine.身体.阴道 }}</span>
        </div>
        <div v-if="heroine.身体.子宫" class="body-item">
          <span class="body-label">子宫</span>
          <span class="body-value">{{ heroine.身体.子宫 }}</span>
        </div>
        <div v-if="heroine.身体.子宫精液占比 && Object.keys(heroine.身体.子宫精液占比).length > 0" class="body-item">
          <span class="body-label">子宫精液占比</span>
          <div class="semen-grid">
            <div v-for="(ratio, name) in heroine.身体.子宫精液占比" :key="name" class="semen-item">
              <span class="semen-name">{{ name }}</span>
              <span class="semen-ratio">{{ ratio }}</span>
            </div>
          </div>
        </div>
        <div v-if="heroine.身体.后庭" class="body-item">
          <span class="body-label">后庭</span>
          <span class="body-value">{{ heroine.身体.后庭 }}</span>
        </div>
        <div v-if="heroine.身体.腿部" class="body-item">
          <span class="body-label">腿部</span>
          <span class="body-value">{{ heroine.身体.腿部 }}</span>
        </div>
        <div v-if="heroine.身体.足部" class="body-item">
          <span class="body-label">足部</span>
          <span class="body-value">{{ heroine.身体.足部 }}</span>
        </div>
        <!-- 额外身体字段 -->
        <template v-for="(val, key) in extra_body_fields" :key="key">
          <div class="body-item">
            <span class="body-label">{{ key }}</span>
            <span class="body-value">{{ val }}</span>
          </div>
        </template>
      </div>
    </SectionCollapse>

    <!-- 额外基础字段 -->
    <template v-for="(val, key) in extra_basic_fields" :key="key">
      <div class="status-section">
        <div class="section-title">◇ {{ key }}</div>
        <div class="status-text">{{ val }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';
import SectionCollapse from './SectionCollapse.vue';

const store = useDataStore();

const heroine = computed(() => store.data['林美艳'] as any);

const desire_percent = computed(() => {
  const val = heroine.value?.生理?.性欲值 ?? 0;
  return Math.min(100, val);
});

// 显示的服装（排除空值和风格）
const displayed_attire = computed(() => {
  const attire = heroine.value?.服装;
  if (!attire) return {};
  return _.pickBy(attire, (v: any, k: string) => k !== '风格' && v);
});

// 额外身体字段
const extra_body_fields = computed(() => {
  const b = heroine.value?.身体;
  if (!b) return {};
  return _.omit(b, ['姿态与神情', '口腔', '胸部', '阴道', '子宫', '子宫精液占比', '后庭', '腿部', '足部']);
});

// 额外基础字段
const extra_basic_fields = computed(() => {
  const b = heroine.value?.基础;
  if (!b) return {};
  return _.omit(b, ['当前状态', '姿态描述', '内心想法', '心理活动', '最近性行为', '灵力修为', '修为']);
});
</script>

<style lang="scss" scoped>
.heroine-panel {
  padding: 12px 16px;
  border-bottom: 2px solid var(--c-border-brown);
  background: linear-gradient(135deg, rgba(128, 90, 213, 0.05) 0%, transparent 100%);
}

.heroine-header {
  margin-bottom: 12px;
}

.heroine-name {
  font-size: 20px;
  font-weight: bold;
  color: var(--c-spirit-purple);
  letter-spacing: 4px;
  margin-bottom: 4px;
}

.heroine-status {
  font-size: 12px;
  color: var(--c-jade-mist);
  line-height: 1.4;
}

.section-title {
  font-size: 13px;
  color: var(--c-spirit-gold);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.status-section,
.recent-act-section {
  margin-bottom: 12px;
}

.status-text {
  font-size: 13px;
  color: var(--c-jade-mist);
  line-height: 1.6;
  padding-left: 8px;
  border-left: 2px solid var(--c-border-brown);
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: var(--c-jade-mist);
  min-width: 50px;
}

.stat-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;

  &.desire {
    background: linear-gradient(90deg, var(--c-blood-red), #e53e3e);
  }
}

.stat-value {
  font-size: 12px;
  font-weight: bold;
  color: var(--c-ink-black);
  min-width: 24px;
  text-align: right;
}

.attire-section {
  margin-bottom: 12px;
}

.attire-style {
  font-size: 11px;
  color: var(--c-spirit-purple);
  margin-bottom: 6px;
  font-style: italic;
}

.attire-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.attire-item {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--c-border-brown);
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 11px;
  flex: 1 1 auto;
  min-width: 120px;
  max-width: 100%;
}

.attire-slot {
  display: block;
  color: var(--c-spirit-purple);
  font-weight: bold;
  margin-bottom: 2px;
}

.attire-desc {
  color: var(--c-jade-mist);
  line-height: 1.4;
  display: block;
  word-break: break-all;
}

.thought-bubble {
  background: rgba(212, 175, 55, 0.1);
  border: 1px dashed var(--c-spirit-gold);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 10px;

  &.mind-bubble {
    background: rgba(128, 90, 213, 0.08);
    border-color: var(--c-spirit-purple);
  }
}

.thought-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.thought-text {
  font-size: 12px;
  color: var(--c-ink-black);
  font-style: italic;
  line-height: 1.5;
}

/* 身体状态 */
.body-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.body-item {
  padding: 6px 0;
  border-bottom: 1px dashed rgba(139, 115, 85, 0.15);

  &:last-child {
    border-bottom: none;
  }
}

.body-label {
  display: block;
  font-size: 11px;
  color: var(--c-spirit-purple);
  font-weight: bold;
  margin-bottom: 3px;
}

.body-value {
  display: block;
  font-size: 12px;
  color: var(--c-jade-mist);
  line-height: 1.5;
}

.semen-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.semen-item {
  background: rgba(197, 48, 48, 0.06);
  border: 1px solid rgba(197, 48, 48, 0.15);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.semen-name {
  color: var(--c-ink-black);
  font-weight: bold;
}

.semen-ratio {
  color: var(--c-blood-red);
}

@media (max-width: 500px) {
  .attire-item {
    min-width: 100%;
  }
}
</style>
