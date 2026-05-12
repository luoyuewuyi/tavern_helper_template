<template>
  <div class="skill-panel">
    <!-- 主动技能 -->
    <div class="section-title">⚔ 主动技能</div>
    <div v-if="activeSkills.length > 0" class="skill-list">
      <div
        v-for="[name, skill] in activeSkills"
        :key="name"
        class="skill-card"
        :class="'quality-border-' + skill.等级.toLowerCase()"
      >
        <div class="skill-header">
          <span class="skill-name">{{ name }}</span>
          <span class="quality-tag" :class="'quality-' + skill.等级.toLowerCase()">{{ skill.等级 }}</span>
        </div>
        <div class="skill-desc">{{ skill.描述 }}</div>
        <div class="skill-meta">
          <span class="cd-tag">⏱ {{ skill.冷却 }}</span>
        </div>
      </div>
    </div>
    <div v-else class="empty-hint">暂无主动技能</div>

    <!-- 被动技能 -->
    <div class="section-title" style="margin-top: 12px">🛡 被动技能</div>
    <div v-if="passiveSkills.length > 0" class="skill-list">
      <div
        v-for="[name, skill] in passiveSkills"
        :key="name"
        class="skill-card passive"
        :class="'quality-border-' + skill.等级.toLowerCase()"
      >
        <div class="skill-header">
          <span class="skill-name">{{ name }}</span>
          <span class="quality-tag" :class="'quality-' + skill.等级.toLowerCase()">{{ skill.等级 }}</span>
        </div>
        <div class="skill-desc">{{ skill.描述 }}</div>
      </div>
    </div>
    <div v-else class="empty-hint">暂无被动技能</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const activeSkills = computed(() => Object.entries(store.data.主角.技能).filter(([, s]) => s.类型 === '主动'));

const passiveSkills = computed(() => Object.entries(store.data.主角.技能).filter(([, s]) => s.类型 === '被动'));
</script>

<style lang="scss" scoped>
.skill-panel {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-cyan);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skill-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid;
  padding: 8px 10px;
  border-radius: 3px;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-card-hover);
  }

  &.passive {
    opacity: 0.85;
  }
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.skill-name {
  font-size: 12px;
  font-weight: 700;
}

.quality-tag {
  font-family: var(--font-data);
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 2px;
  border: 1px solid;
}

.skill-desc {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.skill-meta {
  display: flex;
  gap: 8px;
}

.cd-tag {
  font-size: 10px;
  color: var(--text-dim);
}

.empty-hint {
  text-align: center;
  color: var(--text-dim);
  font-size: 11px;
  padding: 16px;
  font-style: italic;
}

// 品质边框色
.quality-border-g {
  border-left-color: var(--quality-g);
}
.quality-border-f {
  border-left-color: var(--quality-f);
}
.quality-border-e {
  border-left-color: var(--quality-e);
}
.quality-border-d {
  border-left-color: var(--quality-d);
}
.quality-border-c {
  border-left-color: var(--quality-c);
}
.quality-border-b {
  border-left-color: var(--quality-b);
}
.quality-border-a {
  border-left-color: var(--quality-a);
}
.quality-border-s {
  border-left-color: var(--quality-s);
}
.quality-border-ss {
  border-left-color: var(--quality-ss);
}
.quality-border-sss {
  border-left-color: var(--quality-sss);
}

// 品质文字色
.quality-g {
  color: var(--quality-g);
  border-color: var(--quality-g);
}
.quality-f {
  color: var(--quality-f);
  border-color: var(--quality-f);
}
.quality-e {
  color: var(--quality-e);
  border-color: var(--quality-e);
}
.quality-d {
  color: var(--quality-d);
  border-color: var(--quality-d);
}
.quality-c {
  color: var(--quality-c);
  border-color: var(--quality-c);
}
.quality-b {
  color: var(--quality-b);
  border-color: var(--quality-b);
}
.quality-a {
  color: var(--quality-a);
  border-color: var(--quality-a);
}
.quality-s {
  color: var(--quality-s);
  border-color: var(--quality-s);
}
.quality-ss {
  color: var(--quality-ss);
  border-color: var(--quality-ss);
}
.quality-sss {
  color: var(--quality-sss);
  border-color: var(--quality-sss);
}
</style>
