<template>
  <section class="panel">
    <div class="section-title">
      <span>高频对象</span>
      <span class="hint">正文与这里都只读当前可见词条；若识别出异类，会直接显示其等级</span>
    </div>

    <div class="people-grid">
      <article v-for="person in visiblePeople" :key="person.name" class="person-card">
        <div class="person-head">
          <div>
            <strong>{{ person.name }}</strong>
            <p>{{ person.value.基础信息.身份 }}</p>
          </div>
          <span class="species">{{ speciesLabel(person.value) }}</span>
        </div>

        <p class="status">正在做什么：{{ person.value.正在做什么 }}</p>

        <div class="tag-row">
          <span v-for="tag in person.value.当前可见词条.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="summary">{{ person.value.最近变化摘要 }}</div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';

const props = defineProps<{
  data: Schema;
}>();

const visiblePeople = computed(() =>
  _(props.data.人物档案)
    .entries()
    .filter(([, value]) => value.后宫录可见)
    .take(4)
    .map(([name, value]) => ({ name, value }))
    .value(),
);

function formatLevel(level: string) {
  if (!level || level === '无') {
    return '';
  }
  return level.endsWith('级') ? level : `${level}级`;
}

function speciesLabel(person: Schema['人物档案'][string]) {
  const level = formatLevel(person.基础信息.等级);
  return level ? `${person.基础信息.种族} · ${level}` : person.基础信息.种族;
}
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

.people-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.person-card {
  padding: 16px;
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(124, 199, 255, 0.12), transparent 30%), rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.person-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.person-head p {
  margin: 6px 0 0;
  color: var(--aw-muted);
  font-size: 13px;
}

.species {
  color: var(--aw-accent-2);
  white-space: nowrap;
}

.status,
.summary {
  line-height: 1.65;
  font-size: 13px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--aw-text);
  font-size: 12px;
}

.summary {
  color: var(--aw-warn);
}

@media (max-width: 720px) {
  .people-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    flex-direction: column;
  }
}
</style>
