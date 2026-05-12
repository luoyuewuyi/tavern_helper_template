<template>
  <div class="character-panel">
    <div class="char-header">
      <div class="char-name">{{ characterName }}</div>
      <div class="char-title">{{ characterTitle }}</div>
    </div>

    <!-- 好感度条 -->
    <div class="affection-section">
      <div class="affection-header">
        <span class="affection-label">执念度</span>
        <span class="affection-stage" :class="stageClass">{{ character.$好感阶段 }}</span>
      </div>
      <div class="affection-bar">
        <div class="affection-track">
          <div class="affection-fill" :style="{ width: character.好感度 + '%' }"></div>
        </div>
        <span class="affection-value">{{ character.好感度 }}</span>
      </div>
    </div>

    <!-- 心声区域 -->
    <div class="inner-voice">
      <div class="voice-label">
        <span class="icon">💭</span>
        <span>心声</span>
      </div>
      <div class="voice-content">"{{ character.心声 }}"</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const props = defineProps<{
  characterId: string;
}>();

const store = useDataStore();

const characterNames: Record<string, { name: string; title: string }> = {
  西里尔: { name: '西里尔 Cyril', title: '圣子 · 殉道者' },
  维克托: { name: '维克托 Viktor', title: '研究员 · 解构者' },
  雷恩: { name: '雷恩 Ryan', title: '疯狗 · 处刑人' },
  路西法: { name: '路西法 Lucifer', title: '外交官 · 伪装者' },
};

const characterName = computed(() => characterNames[props.characterId]?.name || props.characterId);
const characterTitle = computed(() => characterNames[props.characterId]?.title || '');

const character = computed(() => {
  return store.data.四柱神使[props.characterId as keyof typeof store.data.四柱神使];
});

const stageClass = computed(() => {
  const value = character.value.好感度;
  if (value < 20) return 'stage-1';
  if (value < 40) return 'stage-2';
  if (value < 60) return 'stage-3';
  if (value < 80) return 'stage-4';
  return 'stage-5';
});
</script>

<style lang="scss" scoped>
.character-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.char-header {
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--c-shadow);
}

.char-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--c-ghost);
  letter-spacing: 1px;
}

.char-title {
  font-size: 0.8rem;
  color: var(--c-pale);
  margin-top: 2px;
}

.affection-section {
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 4px;
}

.affection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.affection-label {
  font-size: 0.85rem;
  color: var(--c-obsession);
  font-weight: 500;
}

.affection-stage {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;

  &.stage-1 {
    background: rgba(100, 100, 100, 0.4);
    color: #aaa;
  }
  &.stage-2 {
    background: rgba(100, 130, 180, 0.3);
    color: #8fb8d8;
  }
  &.stage-3 {
    background: rgba(180, 130, 180, 0.3);
    color: #d88fd8;
  }
  &.stage-4 {
    background: rgba(201, 74, 122, 0.4);
    color: #ff8fb8;
  }
  &.stage-5 {
    background: rgba(139, 41, 66, 0.6);
    color: #ff6b8a;
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.affection-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.affection-track {
  flex: 1;
  height: 8px;
  background: var(--c-void);
  border: 1px solid var(--c-shadow);
  border-radius: 4px;
  overflow: hidden;
}

.affection-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-corrupt), var(--c-obsession));
  border-radius: 3px;
  transition: width 0.5s ease;
}

.affection-value {
  font-size: 0.85rem;
  font-weight: bold;
  color: var(--c-obsession);
  min-width: 25px;
  text-align: right;
}

.inner-voice {
  background: rgba(107, 58, 107, 0.15);
  border: 1px solid var(--c-corrupt);
  border-radius: 4px;
  padding: 10px;
}

.voice-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--c-pale);
  margin-bottom: 8px;
}

.icon {
  font-size: 1rem;
}

.voice-content {
  font-size: 0.85rem;
  color: var(--c-ghost);
  font-style: italic;
  line-height: 1.5;
  padding-left: 8px;
  border-left: 2px solid var(--c-corrupt);
}
</style>
