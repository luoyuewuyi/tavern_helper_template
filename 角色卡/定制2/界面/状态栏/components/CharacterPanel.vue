<template>
  <div class="panel">
    <div v-if="characterNames.length === 0" class="empty-state">暂无角色数据，等待AI生成角色...</div>
    <template v-else>
      <!-- 角色选择器 -->
      <div v-if="characterNames.length > 1" class="char-selector">
        <button
          v-for="name in characterNames"
          :key="name"
          class="char-btn"
          :class="{ active: selectedChar === name }"
          type="button"
          @click="selectedChar = name"
        >
          {{ name }}
        </button>
      </div>

      <!-- 角色详情 -->
      <div v-if="currentChar" class="char-detail">
        <div class="char-header">
          <span class="char-name">{{ selectedChar }}</span>
          <span class="char-stage">{{ currentChar.$关系阶段 }}</span>
        </div>

        <div class="stat-group">
          <div class="stat-label-row">
            <span>❤️ 好感度</span>
            <span class="stat-val">{{ currentChar.好感度 }}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-fill fill-pink" :style="{ width: currentChar.好感度 + '%' }"></div>
          </div>
        </div>

        <div class="stat-group">
          <div class="stat-label-row">
            <span>🤝 信任度</span>
            <span class="stat-val">{{ currentChar.信任度 }}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-fill fill-cyan" :style="{ width: currentChar.信任度 + '%' }"></div>
          </div>
        </div>

        <div class="stat-group">
          <div class="stat-label-row">
            <span>✨ 吸引张力</span>
            <span class="stat-val">{{ currentChar.吸引张力 }}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-fill fill-purple" :style="{ width: currentChar.吸引张力 + '%' }"></div>
          </div>
        </div>

        <div class="stat-row-grid">
          <div class="mini-stat">
            <span class="mini-label">💔 动摇</span>
            <span class="mini-val" :class="{ 'val-danger': currentChar.动摇值 > 60 }">{{ currentChar.动摇值 }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-label">🧠 理智</span>
            <span class="mini-val" :class="{ 'val-danger': currentChar.理智度 < 30 }">{{ currentChar.理智度 }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-label">😶 空窗</span>
            <span class="mini-val" :class="{ 'val-danger': currentChar.情绪空窗值 > 60 }">{{
              currentChar.情绪空窗值
            }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-label">🤫 隐瞒</span>
            <span class="mini-val" :class="{ 'val-warn': currentChar.隐瞒倾向 > 40 }">{{ currentChar.隐瞒倾向 }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-label">🔗 稳定</span>
            <span class="mini-val">{{ currentChar.关系稳定度 }}</span>
          </div>
          <div class="mini-stat">
            <span class="mini-label">⚡ 竞争影响</span>
            <span class="mini-val" :class="{ 'val-danger': currentChar.竞争者影响指数 > 60 }">{{
              currentChar.竞争者影响指数
            }}</span>
          </div>
        </div>

        <div class="stat-group">
          <div class="stat-label-row">
            <span>🔥 淫乱度</span>
            <span class="stat-val" :class="{ 'val-danger': currentChar.淫乱度 > 60 }">{{ currentChar.淫乱度 }}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-fill fill-warm" :style="{ width: currentChar.淫乱度 + '%' }"></div>
          </div>
        </div>

        <div class="stat-group">
          <div class="stat-label-row">
            <span>🐷 对猪田好感</span>
            <span class="stat-val" :class="{ 'val-danger': currentChar.对猪田好感度 > 50 }">{{
              currentChar.对猪田好感度
            }}</span>
          </div>
          <div class="stat-bar">
            <div class="stat-fill fill-danger" :style="{ width: currentChar.对猪田好感度 + '%' }"></div>
          </div>
        </div>

        <div class="info-row">
          <span class="info-tag">📍 {{ currentChar.当前位置 }}</span>
          <span class="info-tag">{{ currentChar.当前状态 }}</span>
          <span class="info-tag">{{ currentChar.情绪 }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const characterNames = computed(() => Object.keys(store.data.角色库));
const selectedChar = ref(characterNames.value[0] ?? '');

watch(characterNames, names => {
  if (names.length > 0 && !names.includes(selectedChar.value)) {
    selectedChar.value = names[0];
  }
});

const currentChar = computed(() => store.data.角色库[selectedChar.value]);
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--c-text-secondary);
  font-style: italic;
}

.char-selector {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.char-btn {
  padding: 4px 12px;
  border-radius: 4px;
  background: var(--c-bg-section);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
  font-family: var(--font-main);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: var(--c-accent-rose);
    color: var(--c-text-primary);
  }
  &.active {
    background: rgba(232, 62, 140, 0.15);
    border-color: var(--c-accent-pink);
    color: var(--c-accent-rose);
  }
}

.char-detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.char-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-border);
}
.char-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--c-accent-rose);
}
.char-stage {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(155, 89, 182, 0.15);
  color: var(--c-accent-purple);
  border: 1px solid rgba(155, 89, 182, 0.25);
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
  font-size: 13px;
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
.fill-pink {
  background: linear-gradient(90deg, #e83e8c, #fd79a8);
}
.fill-cyan {
  background: linear-gradient(90deg, #00cec9, #81ecec);
}
.fill-purple {
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
}
.fill-warm {
  background: linear-gradient(90deg, #e17055, #fab1a0);
}
.fill-danger {
  background: linear-gradient(90deg, #d63031, #ff7675);
}

.stat-row-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.mini-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: var(--c-bg-section);
  border-radius: 4px;
  border: 1px solid var(--c-border);
  font-size: 11px;
}
.mini-label {
  color: var(--c-text-secondary);
}
.mini-val {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--c-text-primary);
}
.val-danger {
  color: var(--c-danger) !important;
}
.val-warn {
  color: var(--c-accent-gold) !important;
}

.info-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.info-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--c-bg-section);
  border: 1px solid var(--c-border);
  color: var(--c-text-secondary);
}
</style>
