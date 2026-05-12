<template>
  <section class="panel">
    <div class="section-title">
      <span>修改统计</span>
      <span class="hint">升阶看当前等级进度；累计统计只做回顾</span>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <strong>总成功次数</strong>
        <span>{{ data.主角.成功修改次数 }}</span>
      </article>
      <article class="stat-card">
        <strong>当前等级成功</strong>
        <span>{{ data.主角.当前等级进度.成功修改 }}</span>
      </article>
      <article class="stat-card">
        <strong>当前等级异类</strong>
        <span>{{ data.主角.当前等级进度.异类修改 }}</span>
      </article>
      <article class="stat-card">
        <strong>累计普通人</strong>
        <span>{{ data.主角.修改统计.普通人 }}</span>
      </article>
      <article class="stat-card">
        <strong>累计异类</strong>
        <span>{{ data.主角.修改统计.异类 }}</span>
      </article>
      <article class="stat-card">
        <strong>现实修正</strong>
        <span>{{ data.主角.修改统计.现实修正 }}</span>
      </article>
    </div>

    <div class="threshold-box">
      <strong>升阶条件</strong>
      <p>E→D：3 次成功修改</p>
      <p>D→C：5 次成功修改 + 1 次异类修改</p>
      <p>C→B：5 次成功修改 + 3 次异类修改</p>
      <p>B→A：7 次成功修改 + 5 次异类修改</p>
      <p>A→S：10 次异类修改</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';

defineProps<{
  data: Schema;
}>();
</script>

<style scoped lang="scss">
.panel {
  background: var(--aw-panel);
  border: 1px solid var(--aw-line);
  border-radius: var(--aw-radius);
  box-shadow: var(--aw-shadow);
  padding: 18px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
  margin-bottom: 14px;
}

.hint {
  color: var(--aw-muted);
  font-size: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  border-radius: 18px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-card strong {
  color: var(--aw-muted);
}

.stat-card span {
  font-size: 26px;
  color: var(--aw-accent);
}

.threshold-box {
  margin-top: 14px;
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
}

.threshold-box p {
  margin: 8px 0 0;
  line-height: 1.6;
}

@media (max-width: 720px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    flex-direction: column;
  }
}
</style>
