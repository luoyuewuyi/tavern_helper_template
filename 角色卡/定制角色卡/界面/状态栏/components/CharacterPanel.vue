<template>
  <div class="char-panel">
    <!-- 数值条区域 -->
    <div class="bars-section">
      <template v-if="props.character === '王影'">
        <StatBar label="❤️ 好感" :value="(charData as any).好感度" :max="100" color="var(--c-bar-love)" />
        <StatBar label="🤝 信任" :value="(charData as any).信任度" :max="100" color="var(--c-bar-trust)" />
        <StatBar label="⚠️ 警戒" :value="(charData as any).警戒值" :max="100" color="var(--c-bar-alert)" />
        <StatBar label="😳 羞耻" :value="(charData as any).羞耻度" :max="100" color="var(--c-bar-shame)" />
      </template>
      <template v-else>
        <StatBar label="❤️ 好感" :value="(charData as any).好感度" :max="100" color="var(--c-bar-love)" />
        <StatBar label="🤝 信任" :value="(charData as any).信任度" :max="100" color="var(--c-bar-trust)" />
        <StatBar label="🔓 开放" :value="(charData as any).开放度" :max="100" color="var(--c-bar-open)" />
      </template>
    </div>

    <!-- 心理与穿着 -->
    <div class="info-section">
      <div class="info-row">
        <span class="info-label">🎭 心理</span>
        <span class="info-value">{{ charData.心理状态 }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">💭 想法</span>
        <span class="info-value thought">{{ charData.当前想法 }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">👗 穿着</span>
        <span class="info-value">{{ charData.当前穿着 }}</span>
      </div>
    </div>

    <!-- 身体状态表格 -->
    <div class="body-section">
      <div class="section-title">身体状态</div>
      <div class="body-grid">
        <div v-for="(desc, part) in charData.身体状态" :key="part" class="body-row">
          <span class="body-icon">{{ bodyIcons[part as string] || '📍' }}</span>
          <span class="body-part">{{ part }}</span>
          <span class="body-desc">{{ desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
import StatBar from './StatBar.vue';

const props = defineProps<{
  character: '王影' | '付宴';
}>();

const store = useDataStore();

const charData = computed(() => store.data[props.character]);

const bodyIcons: Record<string, string> = {
  面部: '😊',
  胸部: '🍈',
  腰腹: '💃',
  臀部: '🍑',
  大腿: '🦵',
  小腿: '🦶',
  双脚: '👣',
  双手: '🤲',
  私处: '🌸',
};
</script>

<style lang="scss" scoped>
.char-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bars-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: var(--c-bg-section);
  border-radius: 6px;
  border: 1px solid var(--c-border);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: var(--c-bg-section);
  border-radius: 6px;
  border: 1px solid var(--c-border);
}

.info-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 0.82rem;
}

.info-label {
  color: var(--c-text-dim);
  white-space: nowrap;
  min-width: 58px;
}

.info-value {
  color: var(--c-text);
  flex: 1;
  word-break: break-all;
}

.thought {
  font-style: italic;
  color: var(--c-text-dim);
}

.body-section {
  background: var(--c-bg-section);
  border-radius: 6px;
  border: 1px solid var(--c-border);
  overflow: hidden;
}

.section-title {
  padding: 6px 10px;
  font-weight: bold;
  font-size: 0.85rem;
  background: var(--c-bg-deep);
  border-bottom: 1px solid var(--c-border);
  color: var(--c-accent-pink);
}

.body-grid {
  display: flex;
  flex-direction: column;
}

.body-row {
  display: flex;
  align-items: flex-start;
  padding: 5px 10px;
  border-bottom: 1px solid var(--c-border);
  font-size: 0.8rem;
  transition: background 0.15s;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(107, 91, 149, 0.1); }
}

.body-icon {
  width: 20px;
  flex-shrink: 0;
  text-align: center;
}

.body-part {
  width: 36px;
  flex-shrink: 0;
  color: var(--c-text-dim);
  font-weight: bold;
}

.body-desc {
  flex: 1;
  color: var(--c-text);
  word-break: break-all;
  line-height: 1.4;
}
</style>
