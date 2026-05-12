<template>
  <div class="plot-layout">
    <div class="section-head">🔮 命运抉择</div>
    <div class="section-desc">选择你的道路，改变维斯特洛的命运</div>

    <div class="choices-grid">
      <button
        v-for="(choice, idx) in choices"
        :key="choice.key"
        class="choice-btn"
        :class="choice.style"
        :disabled="!choice.text"
        @click="sendChoice(choice.text)"
      >
        <span class="choice-icon">{{ choice.icon }}</span>
        <span class="choice-label">{{ choice.label }}</span>
        <span class="choice-text">{{ choice.text || '暂无选项' }}</span>
      </button>
    </div>

    <div class="hint-text">点击选项将触发对应的剧情发展</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

// 四个选项的配置
const choices = computed(() => [
  {
    key: 'A',
    icon: '🗡️',
    label: '正义之路',
    text: store.data.剧情选项.选项A,
    style: 'choice-honor',
  },
  {
    key: 'B',
    icon: '🏛️',
    label: '权谋之道',
    text: store.data.剧情选项.选项B,
    style: 'choice-politic',
  },
  {
    key: 'C',
    icon: '🔥',
    label: '冒险之途',
    text: store.data.剧情选项.选项C,
    style: 'choice-bold',
  },
  {
    key: 'D',
    icon: '🌑',
    label: '暗影之策',
    text: store.data.剧情选项.选项D,
    style: 'choice-dark',
  },
]);

// 发送选项给AI，触发回复
async function sendChoice(text: string) {
  if (!text) return;
  // 通过酒馆助手接口发送用户输入
  await triggerSlash(`/send ${text}`);
}
</script>

<style lang="scss" scoped>
.plot-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-head {
  font-size: 0.88rem;
  border-bottom: 1px solid var(--c-gold);
  display: inline-block;
  padding-bottom: 2px;
  font-weight: bold;
  color: var(--c-gold);
}

.section-desc {
  font-size: 0.72rem;
  color: var(--c-silver);
  font-style: italic;
  margin-bottom: 4px;
}

.choices-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.choice-btn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--c-steel);
  background: rgba(74, 74, 106, 0.15);
  color: var(--c-parchment);
  font-family: var(--font-got);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.25s;
  text-align: left;
  line-height: 1.3;
  position: relative;
  overflow: hidden;
}

.choice-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  transition: width 0.25s;
}

.choice-btn:hover:not(:disabled) {
  transform: translateX(3px);
}

.choice-btn:hover:not(:disabled)::before {
  width: 5px;
}

.choice-btn:active:not(:disabled) {
  transform: translateX(1px);
}

.choice-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 各选项的颜色主题 */
.choice-honor {
  border-color: rgba(111, 168, 220, 0.4);
}
.choice-honor::before {
  background: var(--c-ice);
}
.choice-honor:hover:not(:disabled) {
  background: rgba(111, 168, 220, 0.15);
  border-color: var(--c-ice);
}

.choice-politic {
  border-color: rgba(201, 168, 76, 0.4);
}
.choice-politic::before {
  background: var(--c-gold);
}
.choice-politic:hover:not(:disabled) {
  background: rgba(201, 168, 76, 0.15);
  border-color: var(--c-gold);
}

.choice-bold {
  border-color: rgba(231, 76, 60, 0.4);
}
.choice-bold::before {
  background: var(--c-fire);
}
.choice-bold:hover:not(:disabled) {
  background: rgba(231, 76, 60, 0.1);
  border-color: var(--c-fire);
}

.choice-dark {
  border-color: rgba(142, 142, 160, 0.4);
}
.choice-dark::before {
  background: var(--c-silver);
}
.choice-dark:hover:not(:disabled) {
  background: rgba(142, 142, 160, 0.1);
  border-color: var(--c-silver);
}

.choice-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.choice-label {
  font-size: 0.7rem;
  color: var(--c-silver);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  min-width: 55px;
}

.choice-text {
  flex: 1;
}

.hint-text {
  font-size: 0.68rem;
  color: var(--c-steel);
  text-align: center;
  font-style: italic;
  margin-top: 4px;
}
</style>
