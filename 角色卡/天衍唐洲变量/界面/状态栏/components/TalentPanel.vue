<template>
  <div class="talent-panel">
    <div class="section-title">天赋</div>

    <div v-if="talents.length === 0" class="empty-state">
      <i class="fa fa-star-half-alt"></i>
      <span>尚未觉醒天赋</span>
    </div>

    <div v-else class="talent-grid">
      <div v-for="(talent, index) in talents" :key="index" class="talent-card" :class="talent.rarity">
        <div class="talent-header">
          <span class="talent-rarity">{{ talent.品级 }}</span>
          <span class="talent-name">{{ talent.名称 }}</span>
        </div>
        <div class="talent-category">
          <i class="fa fa-tag"></i>
          {{ talent.类别 }}
        </div>
        <div class="talent-effect">
          {{ talent.效果 }}
        </div>
        <div v-if="hasBonus(talent)" class="talent-bonus">
          <span v-for="(val, attr) in talent.属性加成" :key="attr" class="bonus-item"> {{ attr }} +{{ val }} </span>
        </div>
      </div>
    </div>

    <!-- 天赋槽位提示 -->
    <div class="talent-slots">
      <span class="slot-info">
        <i class="fa fa-info-circle"></i>
        已激活天赋: {{ talents.length }} / 3
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const talents = computed(() => store.data.主角.天赋 || []);

function hasBonus(talent: any): boolean {
  return talent.属性加成 && Object.keys(talent.属性加成).length > 0;
}
</script>

<style lang="scss" scoped>
// 品级配色
$rarities: (
  '普通': (
    #8b8b8b,
    #f5f5f5,
  ),
  '稀有': (
    #2c82c9,
    #e8f4fc,
  ),
  '精锐': (
    #6b5b95,
    #f0edf5,
  ),
  '史诗': (
    #8b6914,
    #fdf6e3,
  ),
  '传奇': (
    #d4af37,
    #fffaed,
  ),
  '神话': (
    #e34234,
    #fff0ee,
  ),
);

.talent-panel {
  display: flex;
  flex-direction: column;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: var(--c-cloud);
  gap: 8px;

  i {
    font-size: 2rem;
    opacity: 0.5;
  }

  span {
    font-size: 0.85rem;
  }
}

.talent-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.talent-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--c-mist);
  border-radius: 4px;
  padding: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
  }

  // 根据品级应用样式
  @each $rarity, $colors in $rarities {
    &:has(.talent-rarity:contains('#{$rarity}')) {
      &::before {
        background: nth($colors, 1);
      }
    }
  }

  // 备用方案：通过 class
  &.普通 {
    &::before {
      background: #8b8b8b;
    }
  }
  &.稀有 {
    &::before {
      background: #2c82c9;
    }
  }
  &.精锐 {
    &::before {
      background: #6b5b95;
    }
  }
  &.史诗 {
    &::before {
      background: #8b6914;
    }
  }
  &.传奇 {
    &::before {
      background: #d4af37;
    }
  }
  &.神话 {
    &::before {
      background: #e34234;
    }
  }
}

.talent-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.talent-rarity {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 600;

  .普通 & {
    background: #f5f5f5;
    color: #8b8b8b;
  }
  .稀有 & {
    background: #e8f4fc;
    color: #2c82c9;
  }
  .精锐 & {
    background: #f0edf5;
    color: #6b5b95;
  }
  .史诗 & {
    background: #fdf6e3;
    color: #8b6914;
  }
  .传奇 & {
    background: #fffaed;
    color: #d4af37;
  }
  .神话 & {
    background: #fff0ee;
    color: #e34234;
  }
}

.talent-name {
  font-family: var(--font-kai);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--c-ink);
}

.talent-category {
  font-size: 0.7rem;
  color: var(--c-cloud);
  margin-bottom: 6px;

  i {
    margin-right: 4px;
  }
}

.talent-effect {
  font-size: 0.8rem;
  color: var(--c-ink);
  line-height: 1.5;
  margin-bottom: 6px;
}

.talent-bonus {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bonus-item {
  font-size: 0.7rem;
  padding: 2px 8px;
  background: rgba(0, 168, 107, 0.1);
  color: var(--c-jade);
  border-radius: 2px;
  font-weight: 600;
}

.talent-slots {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--c-mist);
}

.slot-info {
  font-size: 0.75rem;
  color: var(--c-cloud);

  i {
    margin-right: 6px;
    color: var(--c-bronze);
  }
}
</style>
