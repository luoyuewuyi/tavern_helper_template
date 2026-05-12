<template>
  <div class="panel">
    <div class="section-title">🐷 猪田 · 竞争者数据</div>

    <div class="rival-stats">
      <div class="stat-group">
        <div class="stat-label-row">
          <span>💪 魅力值</span>
          <span class="stat-val">{{ store.data.猪田.魅力值 }}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill fill-rival" :style="{ width: store.data.猪田.魅力值 + '%' }"></div>
        </div>
      </div>

      <div class="stat-group">
        <div class="stat-label-row">
          <span>🗣️ 沟通力</span>
          <span class="stat-val">{{ store.data.猪田.沟通力 }}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill fill-rival" :style="{ width: store.data.猪田.沟通力 + '%' }"></div>
        </div>
      </div>

      <div class="stat-group">
        <div class="stat-label-row">
          <span>💎 价值感</span>
          <span class="stat-val">{{ store.data.猪田.价值感 }}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill fill-rival" :style="{ width: store.data.猪田.价值感 + '%' }"></div>
        </div>
      </div>

      <div class="stat-group">
        <div class="stat-label-row">
          <span>🏃 主动度</span>
          <span class="stat-val">{{ store.data.猪田.主动度 }}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill fill-rival" :style="{ width: store.data.猪田.主动度 + '%' }"></div>
        </div>
      </div>

      <div class="stat-group">
        <div class="stat-label-row">
          <span>🎭 氛围制造</span>
          <span class="stat-val">{{ store.data.猪田.氛围制造 }}</span>
        </div>
        <div class="stat-bar">
          <div class="stat-fill fill-rival" :style="{ width: store.data.猪田.氛围制造 + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- 综合指标 -->
    <div class="computed-row">
      <div class="computed-item">
        <span class="computed-label">综合影响力</span>
        <span class="computed-val highlight-danger">{{ store.data.猪田.$综合影响力 }}</span>
      </div>
      <div class="computed-item">
        <span class="computed-label">敌对度</span>
        <span class="computed-val" :class="{ 'highlight-danger': store.data.猪田.敌对度 > 50 }">{{
          store.data.猪田.敌对度
        }}</span>
      </div>
      <div class="computed-item">
        <span class="computed-label">攻略阶段</span>
        <span class="computed-val highlight-warn">{{ store.data.猪田.攻略阶段 }}/10</span>
      </div>
    </div>

    <!-- 特殊能力 -->
    <div v-if="store.data.猪田.特殊能力.length > 0" class="skills-section">
      <div class="skills-label">🎯 已获特殊能力</div>
      <div class="skills-list">
        <span v-for="(skill, i) in store.data.猪田.特殊能力" :key="i" class="skill-tag">{{ skill }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--c-accent-warm);
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-border);
}

.rival-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.stat-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--c-text-label);
}
.stat-val {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--c-text-primary);
}

.stat-bar {
  height: 6px;
  border-radius: 3px;
  background: var(--c-bar-bg);
  overflow: hidden;
}
.stat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}
.fill-rival {
  background: linear-gradient(90deg, #e17055, #d63031);
}

.computed-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.computed-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px;
  background: var(--c-bg-section);
  border-radius: 6px;
  border: 1px solid var(--c-border);
}
.computed-label {
  font-size: 11px;
  color: var(--c-text-secondary);
}
.computed-val {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 16px;
  color: var(--c-text-primary);
}
.highlight-danger {
  color: var(--c-danger) !important;
}
.highlight-warn {
  color: var(--c-accent-gold) !important;
}

.skills-section {
  margin-top: 4px;
}
.skills-label {
  font-size: 12px;
  color: var(--c-text-label);
  margin-bottom: 6px;
}
.skills-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.skill-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(225, 112, 85, 0.12);
  border: 1px solid rgba(225, 112, 85, 0.25);
  color: var(--c-accent-warm);
}
</style>
