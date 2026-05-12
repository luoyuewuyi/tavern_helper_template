<template>
  <div class="char-panel">
    <!-- 三维度横条 -->
    <div class="trio-bars">
      <div class="trio-item">
        <span class="trio-label love"> <i class="fa-solid fa-heart"></i> 好感 </span>
        <div class="trio-track">
          <div class="trio-fill love" :style="{ width: chara.好感度 + '%' }"></div>
        </div>
        <span class="trio-val">{{ chara.好感度 }}</span>
      </div>
      <div class="trio-item">
        <span class="trio-label trust"> <i class="fa-solid fa-shield-halved"></i> 信赖 </span>
        <div class="trio-track">
          <div class="trio-fill trust" :style="{ width: chara.信赖度 + '%' }"></div>
        </div>
        <span class="trio-val">{{ chara.信赖度 }}</span>
      </div>
      <div class="trio-item">
        <span class="trio-label corrupt"> <i class="fa-solid fa-skull"></i> 堕落 </span>
        <div class="trio-track">
          <div class="trio-fill corrupt" :style="{ width: chara.堕落度 + '%' }"></div>
        </div>
        <span class="trio-val">{{ chara.堕落度 }}</span>
      </div>
    </div>

    <!-- 堕落警告 -->
    <div v-if="chara.堕落度 >= 50" class="corrupt-warn">
      <i class="fa-solid fa-triangle-exclamation"></i>
      恶堕征兆出现！堕落度已达危险阈值
    </div>

    <!-- 状态标签 -->
    <div class="status-tag" :class="statusClass">
      <i class="fa-solid fa-circle-info"></i>
      {{ chara.状态 }}
    </div>

    <!-- 着装列表 -->
    <div class="section-title" :style="{ borderColor: props.themeColor }">
      <i class="fa-solid fa-shirt"></i> 着装信息
    </div>
    <div class="outfit-grid">
      <div v-for="(desc, slot) in chara.着装" :key="slot" class="outfit-item">
        <span class="outfit-slot">{{ getSlotIcon(slot as string) }} {{ slot }}</span>
        <span class="outfit-desc">{{ desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const props = defineProps<{
  charaKey: '风间悠' | '神代雪' | '桐叶月' | '水宫希';
  themeColor: string;
}>();

const store = useDataStore();

const chara = computed(() => store.data[props.charaKey]);

const statusClass = computed(() => {
  const s = chara.value.状态;
  if (s.includes('正常')) return 'st-normal';
  if (s.includes('变身')) return 'st-transform';
  if (s.includes('恶堕')) return 'st-corrupt';
  return 'st-warn';
});

function getSlotIcon(slot: string): string {
  const icons: Record<string, string> = {
    上装: '👚',
    下装: '👗',
    内衣: '🩱',
    袜子: '🧦',
    鞋子: '👠',
    饰品: '💎',
  };
  return icons[slot] || '📦';
}
</script>

<style lang="scss" scoped>
.char-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trio-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.trio-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trio-label {
  width: 56px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;

  i {
    font-size: 0.68rem;
    margin-right: 2px;
    width: 12px;
    text-align: center;
    display: inline-block;
  }

  &.love {
    color: var(--mg-love-pink);
  }
  &.trust {
    color: var(--mg-trust-cyan);
  }
  &.corrupt {
    color: var(--mg-corrupt-red);
  }
}

.trio-track {
  flex: 1;
  height: 7px;
  background: rgba(45, 27, 78, 0.8);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(107, 63, 160, 0.25);
}

.trio-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease;

  &.love {
    background: linear-gradient(90deg, #d946a8, #f472b6);
    box-shadow: 0 0 6px rgba(244, 114, 182, 0.4);
  }
  &.trust {
    background: linear-gradient(90deg, #14b8a6, #5eead4);
    box-shadow: 0 0 6px rgba(94, 234, 212, 0.4);
  }
  &.corrupt {
    background: linear-gradient(90deg, #b91c3c, #e74c6f);
    box-shadow: 0 0 6px rgba(231, 76, 111, 0.4);
  }
}

.trio-val {
  width: 24px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--mg-text);
  flex-shrink: 0;
}

.corrupt-warn {
  background: rgba(231, 76, 111, 0.12);
  border: 1px solid rgba(231, 76, 111, 0.4);
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.75rem;
  color: var(--mg-corrupt-red);
  font-weight: 600;

  i {
    margin-right: 4px;
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 600;
  width: fit-content;

  &.st-normal {
    background: rgba(110, 231, 183, 0.12);
    color: var(--mg-spirit-green);
    border: 1px solid rgba(110, 231, 183, 0.3);
  }
  &.st-transform {
    background: rgba(123, 170, 255, 0.12);
    color: var(--mg-magic-blue);
    border: 1px solid rgba(123, 170, 255, 0.3);
  }
  &.st-corrupt {
    background: rgba(231, 76, 111, 0.15);
    color: var(--mg-corrupt-red);
    border: 1px solid rgba(231, 76, 111, 0.4);
  }
  &.st-warn {
    background: rgba(245, 197, 66, 0.12);
    color: var(--mg-fame-gold);
    border: 1px solid rgba(245, 197, 66, 0.3);
  }
}

.section-title {
  font-size: 0.85rem;
  font-weight: 700;
  padding-bottom: 4px;
  border-bottom: 2px solid var(--mg-accent-pink);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--mg-text);

  i {
    font-size: 0.75rem;
  }
}

.outfit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 6px;
}

.outfit-item {
  background: rgba(45, 27, 78, 0.4);
  border: 1px solid rgba(107, 63, 160, 0.25);
  border-radius: 4px;
  padding: 6px 8px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--mg-border-glow);
  }
}

.outfit-slot {
  display: block;
  font-size: 0.7rem;
  color: var(--mg-text-dim);
  margin-bottom: 2px;
}

.outfit-desc {
  font-size: 0.78rem;
  color: var(--mg-text);
  line-height: 1.3;
}

@media (max-width: 500px) {
  .outfit-grid {
    grid-template-columns: 1fr;
  }
}
</style>
