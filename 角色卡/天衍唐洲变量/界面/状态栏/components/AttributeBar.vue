<template>
  <div class="attr-bar">
    <div class="character-info">
      <span class="char-name">{{ store.data.主角.基础信息.姓名 || '待赐名' }}</span>
      <span class="char-identity">{{ store.data.主角.基础信息.当前身份 }}</span>
      <span class="char-age">{{ store.data.主角.基础信息.年龄 }}岁</span>
    </div>
    <div class="attrs-mini">
      <div v-for="(attr, name) in attributes" :key="name" class="attr-mini" :style="{ '--attr-color': attr.color }">
        <span class="attr-icon">{{ attr.icon }}</span>
        <span class="attr-name">{{ name }}</span>
        <span class="attr-value">{{ attr.value }}</span>
        <span class="attr-tier">{{ attr.tier }}</span>
      </div>
    </div>
    <div class="wealth-row">
      <span class="wealth-item gold">
        <i class="fa fa-coins"></i>
        {{ store.data.主角.财货.金币 }}金
      </span>
      <span class="wealth-item silver">
        <i class="fa fa-circle"></i>
        {{ store.data.主角.财货.银币 }}银
      </span>
      <span class="wealth-item copper">
        <i class="fa fa-circle"></i>
        {{ store.data.主角.财货.铜钱 }}文
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const attributes = computed(() => {
  const attrs = store.data.主角.属性;
  return {
    韬略: { value: attrs.韬略.值, tier: attrs.韬略.$称, icon: '🎯', color: '#6b5b95' },
    勇武: { value: attrs.勇武.值, tier: attrs.勇武.$称, icon: '⚔️', color: '#e34234' },
    智力: { value: attrs.智力.值, tier: attrs.智力.$称, icon: '📚', color: '#2c82c9' },
    政才: { value: attrs.政才.值, tier: attrs.政才.$称, icon: '🏛️', color: '#8b6914' },
    人望: { value: attrs.人望.值, tier: attrs.人望.$称, icon: '👥', color: '#00a86b' },
    艺趣: { value: attrs.艺趣.值, tier: attrs.艺趣.$称, icon: '🎭', color: '#d4af37' },
  };
});
</script>

<style lang="scss" scoped>
.attr-bar {
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid var(--c-mist);
}

.character-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--c-mist);
}

.char-name {
  font-family: var(--font-kai);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-ink);
}

.char-identity {
  font-size: 0.75rem;
  color: var(--c-bronze);
  padding: 2px 6px;
  background: rgba(139, 105, 20, 0.1);
  border-radius: 2px;
}

.char-age {
  font-size: 0.7rem;
  color: var(--c-cloud);
  margin-left: auto;
}

.attrs-mini {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 10px;
}

.attr-mini {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--c-mist);
  border-left: 3px solid var(--attr-color);
  border-radius: 2px;
  font-size: 0.72rem;

  .attr-icon {
    font-size: 0.85rem;
  }

  .attr-name {
    color: var(--c-cloud);
    min-width: 2em;
  }

  .attr-value {
    font-weight: 600;
    color: var(--c-ink);
  }

  .attr-tier {
    font-family: var(--font-kai);
    font-size: 0.65rem;
    color: var(--attr-color);
    margin-left: auto;
    padding: 1px 4px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
  }
}

.wealth-row {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.wealth-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;

  i {
    font-size: 0.6rem;
  }

  &.gold {
    color: #d4af37;
  }

  &.silver {
    color: #8b8b8b;

    i {
      font-size: 0.5rem;
    }
  }

  &.copper {
    color: #b87333;

    i {
      font-size: 0.4rem;
    }
  }
}

@media (max-width: 500px) {
  .attrs-mini {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
