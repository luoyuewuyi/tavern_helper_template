<template>
  <section class="panel overview">
    <div class="panel-head">
      <span class="eyebrow">觉醒面板</span>
      <button class="ghost-btn" type="button" @click="$emit('open-record')">打开后宫录</button>
    </div>

    <div class="hero-grid">
      <article class="hero-card ability">
        <div class="card-title">
          <span>能力等级</span>
          <strong>{{ data.主角.$能力阶段 }}</strong>
        </div>
        <p class="hero-main">当前限制：{{ data.能力系统.当前等级限制 }}</p>
        <div class="meta-row">
          <span>距离 {{ data.能力系统.最大作用距离 }}</span>
          <span>单次最多 {{ maxCharsLabel }}</span>
          <span v-if="data.能力系统.可见异类等级">可见异类等级</span>
          <span>{{ data.能力系统.$现实改写权限 }}</span>
        </div>
      </article>

      <article class="hero-card progress">
        <div class="card-title">
          <span>升级进度</span>
          <strong>{{ data.主角.$下一级门槛说明 }}</strong>
        </div>
        <div class="progress-row">
          <div class="track">
            <div class="fill" :style="{ width: progressPercent + '%' }" />
          </div>
          <span>{{ progressLabel }}</span>
        </div>
        <p class="hero-main">升阶按当前等级进度结算；异类条件未满足时不会升级。</p>
        <div v-if="nextRequirement" class="meta-row">
          <span v-if="nextRequirement.成功修改 > 0">
            当前等级成功 {{ data.主角.当前等级进度.成功修改 }}/{{ nextRequirement.成功修改 }}
          </span>
          <span v-if="nextRequirement.异类修改 > 0">
            当前等级异类 {{ data.主角.当前等级进度.异类修改 }}/{{ nextRequirement.异类修改 }}
          </span>
        </div>
      </article>
    </div>

    <div class="world-row">
      <div class="meta-chip">📍 {{ data.世界.当前地点 }}</div>
      <div class="meta-chip">🕒 {{ data.世界.当前时间 }}</div>
      <div class="meta-chip">⚠ 暴露值 {{ data.主角.暴露值 }}</div>
      <div class="meta-chip">🌫 背景态势 {{ data.世界.异类暴露风险 }}</div>
    </div>

    <article class="focus-box">
      <span class="focus-label">当前目标</span>
      <p>{{ data.主角.当前目标 }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';

const NEXT_LEVEL = {
  E: 'D',
  D: 'C',
  C: 'B',
  B: 'A',
  A: 'S',
  S: null,
} as const;

const props = defineProps<{
  data: Schema;
}>();

defineEmits<{
  (e: 'open-record'): void;
}>();

const nextLevel = computed(() => NEXT_LEVEL[props.data.主角.能力等级]);

const nextRequirement = computed(() => (nextLevel.value ? props.data.主角.各等级升级门槛[nextLevel.value] : null));

const progressPercent = computed(() => {
  const requirement = nextRequirement.value;
  if (!requirement) {
    return 100;
  }

  const totalNeed = requirement.成功修改 + requirement.异类修改;
  if (totalNeed <= 0) {
    return 100;
  }

  const success = Math.min(props.data.主角.当前等级进度.成功修改, requirement.成功修改);
  const anomaly = Math.min(props.data.主角.当前等级进度.异类修改, requirement.异类修改);
  return Math.min(100, ((success + anomaly) / totalNeed) * 100);
});

const progressLabel = computed(() => {
  const requirement = nextRequirement.value;
  if (!requirement) {
    return '已满级';
  }

  const parts = [];
  if (requirement.成功修改 > 0) {
    parts.push(`${props.data.主角.当前等级进度.成功修改}/${requirement.成功修改} 成功`);
  }
  if (requirement.异类修改 > 0) {
    parts.push(`${props.data.主角.当前等级进度.异类修改}/${requirement.异类修改} 异类`);
  }
  return parts.join(' / ');
});

const maxCharsLabel = computed(() =>
  props.data.能力系统.单次最大改字数 > 99 ? '不设上限' : `${props.data.能力系统.单次最大改字数} 字`,
);
</script>

<style scoped lang="scss">
.panel {
  background: var(--aw-panel);
  border: 1px solid var(--aw-line);
  border-radius: var(--aw-radius);
  box-shadow: var(--aw-shadow);
  padding: 18px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}

.eyebrow {
  color: var(--aw-accent-2);
  font-size: 13px;
  letter-spacing: 0.18em;
}

.ghost-btn {
  border: 1px solid rgba(124, 199, 255, 0.4);
  background: rgba(124, 199, 255, 0.08);
  color: var(--aw-text);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.hero-card {
  background: var(--aw-panel-soft);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 14px;
}

.card-title,
.progress-row,
.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.card-title strong {
  color: var(--aw-accent);
}

.hero-main {
  margin: 10px 0 0;
  color: var(--aw-text);
  line-height: 1.6;
}

.meta-row {
  margin-top: 10px;
  color: var(--aw-muted);
  font-size: 12px;
  flex-wrap: wrap;
}

.track {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, var(--aw-accent), var(--aw-accent-2));
}

.world-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.meta-chip {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 12px;
  color: var(--aw-muted);
  font-size: 13px;
}

.focus-box {
  margin-top: 14px;
  border-radius: 18px;
  padding: 14px;
  background:
    radial-gradient(circle at top right, rgba(136, 255, 214, 0.12), transparent 32%), rgba(255, 255, 255, 0.04);
}

.focus-label {
  color: var(--aw-warn);
  font-size: 13px;
}

.focus-box p {
  margin: 8px 0 0;
  line-height: 1.7;
}

@media (max-width: 720px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .panel-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
