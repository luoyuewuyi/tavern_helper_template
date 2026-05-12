<template>
  <div class="char-panel">
    <div v-if="_.isEmpty(store.data.当前交互角色)" class="empty-state">暂无交互角色数据</div>

    <div v-for="(char, name) in store.data.当前交互角色" :key="name" class="char-card">
      <div class="char-header">
        <span class="char-name">◈ {{ char.姓名 }}</span>
        <span class="char-phase">「{{ char.$好感度阶段 }}」</span>
        <button class="delete-btn" title="移除该角色" @click="removeCharacter(name as string)">🗑️</button>
      </div>

      <!-- 好感度进度条 -->
      <div class="affection-bar">
        <span class="bar-label">好感度</span>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: char.好感度 + '%' }" :class="affectionColor(char.好感度)"></div>
        </div>
        <span class="bar-value">{{ char.好感度 }}%</span>
      </div>

      <!-- 基础档案 -->
      <div class="section">
        <div class="section-head">▎基 础 档 案</div>
        <div class="info-grid">
          <div class="info-item"><span class="label">性别</span>{{ char.性别 }}</div>
          <div class="info-item"><span class="label">种族</span>{{ char.种族 }}</div>
          <div class="info-item"><span class="label">身份</span>{{ char.身份 }}</div>
          <div class="info-item"><span class="label">矿石病</span>{{ char.矿石病感染情况 }}</div>
        </div>
        <div class="info-full"><span class="label">源石技艺</span>{{ char.源石技艺 }}</div>
        <div class="info-full"><span class="label">兴趣爱好</span>{{ char.兴趣爱好 }}</div>
      </div>

      <!-- 外观档案 -->
      <div class="section">
        <div class="section-head">▎外 观 档 案</div>
        <div class="info-full"><span class="label">容貌</span>{{ char.容貌 }}</div>
        <div class="info-full"><span class="label">身材</span>{{ char.身材 }}</div>
        <div class="info-full"><span class="label">着装</span>{{ char.着装 }}</div>
      </div>

      <!-- 实时状态 -->
      <div class="section">
        <div class="section-head">▎实 时 状 态</div>
        <div class="info-full"><span class="label">神态</span>{{ char.神态 }}</div>
        <div class="info-full"><span class="label">体态</span>{{ char.体态 }}</div>
        <div class="info-full heart"><span class="label">内心</span>'{{ char.内心 }}'</div>
      </div>

      <!-- 情报网络 -->
      <div class="section">
        <div class="section-head">▎情 报 网 络</div>
        <div v-for="(rel, person) in char.关系网" :key="person" class="relation-item">
          <span class="relation-name">{{ person }}</span>
          <span class="relation-desc">{{ rel }}</span>
        </div>
      </div>

      <!-- 携带物品 -->
      <div class="section">
        <div class="section-head">▎装 备 库 存</div>
        <div v-for="(desc, item) in char.当前携带物品" :key="item" class="item-tag">
          <span class="item-name">{{ item }}</span>
          <span class="item-desc">{{ desc }}</span>
        </div>
        <div v-if="_.isEmpty(char.当前携带物品)" class="empty-hint">无携带物品</div>
      </div>

      <!-- 情感数据 -->
      <div class="section nsfw-section">
        <div class="section-head">▎情 感 数 据</div>
        <div class="stat-row">
          <span class="label">欲望值</span>
          <div class="mini-bar"><div class="mini-fill desire" :style="{ width: char.欲望值 + '%' }"></div></div>
          <span class="stat-val">{{ char.欲望值 }}%</span>
        </div>
        <div class="sensitivity-grid">
          <div v-for="(level, part) in char.敏感度" :key="part" class="sensitivity-item">
            <span class="sens-part">{{ part }}</span>
            <span class="sens-level" :class="'level-' + level">{{ level }}</span>
          </div>
        </div>
        <div class="dev-grid">
          <div v-for="(val, type) in char.开发度" :key="type" class="dev-item">
            <span class="dev-type">{{ type }}</span>
            <div class="mini-bar"><div class="mini-fill dev" :style="{ width: val + '%' }"></div></div>
            <span class="dev-val">{{ val }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

function removeCharacter(name: string) {
  delete store.data.当前交互角色[name];
}

function affectionColor(val: number): string {
  if (val < 20) return 'aff-cold';
  if (val < 40) return 'aff-cool';
  if (val < 60) return 'aff-warm';
  if (val < 80) return 'aff-hot';
  return 'aff-max';
}
</script>

<style lang="scss" scoped>
.char-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.char-card {
  border: 1px solid var(--c-border);
  background: var(--c-bg-panel);
}

.char-header {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  background: var(--c-bg-card);
  border-bottom: 1px solid var(--c-cyan-dim);
  gap: 8px;
}

.char-name {
  font-weight: bold;
  color: var(--c-cyan);
  font-size: 0.95rem;
  flex: 1;
}

.char-phase {
  font-size: 0.75rem;
  color: var(--c-yellow);
}

.delete-btn {
  background: none;
  border: 1px solid var(--c-red);
  color: var(--c-red);
  cursor: pointer;
  padding: 2px 6px;
  font-size: 0.75rem;
  border-radius: 3px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
  background: rgba(231, 76, 60, 0.15);
}

.affection-bar {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  gap: 8px;
  border-bottom: 1px solid var(--c-border);
}

.bar-label,
.bar-value {
  font-size: 0.78rem;
  font-weight: bold;
  color: var(--c-text);
  min-width: 40px;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s;
}

.aff-cold {
  background: #6b7d8d;
}
.aff-cool {
  background: #3498db;
}
.aff-warm {
  background: #2ecc71;
}
.aff-hot {
  background: #f39c12;
}
.aff-max {
  background: linear-gradient(90deg, #e74c3c, #ff6b6b);
}

.section {
  padding: 6px 10px;
  border-bottom: 1px solid var(--c-border);
}

.section-head {
  font-size: 0.82rem;
  color: var(--c-cyan);
  font-weight: bold;
  margin-bottom: 4px;
  letter-spacing: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px;
}

.info-item,
.info-full {
  font-size: 0.78rem;
  padding: 2px 0;
  color: var(--c-text);
}

.label {
  color: var(--c-text-dim);
  font-size: 0.72rem;
  margin-right: 6px;
}

.label::before {
  content: '[';
}
.label::after {
  content: ']';
}

.heart {
  color: var(--c-yellow);
  font-style: italic;
  font-size: 0.76rem;
}

.relation-item {
  display: flex;
  gap: 8px;
  padding: 2px 0;
  font-size: 0.76rem;
}

.relation-name {
  color: var(--c-cyan);
  font-weight: bold;
  min-width: 50px;
}

.relation-desc {
  color: var(--c-text);
}

.item-tag {
  display: inline-flex;
  flex-direction: column;
  border: 1px solid var(--c-border);
  padding: 3px 6px;
  margin: 2px 4px 2px 0;
  background: var(--c-bg-card);
  font-size: 0.73rem;
}

.item-name {
  color: var(--c-text-bright);
  font-weight: bold;
}
.item-desc {
  color: var(--c-text-dim);
  font-size: 0.68rem;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
}

.stat-val {
  font-size: 0.72rem;
  min-width: 32px;
}

.mini-bar {
  flex: 1;
  height: 6px;
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  transition: width 0.3s;
}

.mini-fill.desire {
  background: #e74c3c;
}
.mini-fill.dev {
  background: #9b59b6;
}

.sensitivity-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 3px 0;
}

.sensitivity-item {
  display: flex;
  gap: 4px;
  font-size: 0.72rem;
  border: 1px solid var(--c-border);
  padding: 2px 5px;
  background: var(--c-bg-card);
}

.sens-part {
  color: var(--c-text-dim);
}

.level-极低 {
  color: #6b7d8d;
}
.level-低 {
  color: #95a5a6;
}
.level-中 {
  color: #f39c12;
}
.level-高 {
  color: #e67e22;
}
.level-极高 {
  color: #e74c3c;
}

.dev-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 3px 0;
}

.dev-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
}

.dev-type {
  color: var(--c-text-dim);
  min-width: 36px;
}
.dev-val {
  min-width: 28px;
}

.empty-state,
.empty-hint {
  text-align: center;
  color: var(--c-text-dim);
  padding: 16px;
  font-style: italic;
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
