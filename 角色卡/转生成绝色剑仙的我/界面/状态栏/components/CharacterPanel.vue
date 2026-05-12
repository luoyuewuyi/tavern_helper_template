<template>
  <div class="char-layout">
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">姓名</span>
        <span class="info-value">{{ store.data.主角.姓名 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">年龄</span>
        <span class="info-value">{{ store.data.主角.年龄 }}岁</span>
      </div>
      <div class="info-item">
        <span class="info-label">宗门</span>
        <span class="info-value">{{ store.data.主角.宗门 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">体质</span>
        <span class="info-value">{{ store.data.主角.体质 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">功法</span>
        <span class="info-value">{{ store.data.主角.功法 }} · {{ store.data.主角.功法境界 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">修为</span>
        <span class="info-value">{{ store.data.主角.修炼境界 }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">道心</span>
        <span class="info-value" :class="dao_class">{{ store.data.主角.道心 }} ({{ store.data.主角.道心状态 }})</span>
      </div>
      <div class="info-item">
        <span class="info-label">命格</span>
        <span class="info-value gold">{{ store.data.主角.命格 }}</span>
      </div>
      <div class="info-item full">
        <span class="info-label">前世</span>
        <span class="info-value">{{ store.data.主角.前世.姓名 }} · {{ store.data.主角.前世.经历 }}</span>
      </div>
    </div>

    <div v-if="!_.isEmpty(store.data.主角.称号)" class="section">
      <div class="section-head">称号</div>
      <div class="title-grid">
        <div v-for="(effect, name) in store.data.主角.称号" :key="name" class="title-tag">
          <span class="title-name">{{ name }}</span>
          <span class="title-effect">{{ effect }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-head">着装</div>
      <div class="attire-grid">
        <div v-for="(desc, slot) in store.data.主角.着装" :key="slot" class="attire-item">
          <span class="attire-slot">{{ slot }}</span>
          <span class="attire-desc">{{ desc }}</span>
        </div>
      </div>
    </div>

    <div v-if="store.data.牝奴状态.已激活" class="section slave-section">
      <div class="section-head pink">牝奴状态</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">赐名</span>
          <span class="info-value pink">{{ store.data.牝奴状态.赐名 || '未赐名' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">等级</span>
          <span class="info-value">{{ store.data.牝奴状态.等级 || '未定' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">职务</span>
          <span class="info-value">{{ store.data.牝奴状态.职务 || '无' }}</span>
        </div>
        <div v-if="store.data.牝奴状态.主人评价" class="info-item full">
          <span class="info-label">主人评价</span>
          <span class="info-value">{{ store.data.牝奴状态.主人评价 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const dao_class = computed(() => {
  const s = store.data.主角.道心状态;
  return {
    'dao-ok': s === '完好',
    'dao-shake': s === '动摇',
    'dao-break': s === '破损',
    'dao-sleep': s === '沉寂',
    'dao-reverse': s === '逆转',
  };
});
</script>

<style lang="scss" scoped>
.char-layout {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.info-item {
  padding: 4px 0;
  border-bottom: 1px dotted var(--c-mist);
}

.info-item.full {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.72rem;
  color: var(--c-mist);
  display: block;
}

.info-value {
  font-size: 0.88rem;
  font-weight: bold;
}

.info-value.gold {
  color: var(--c-gold);
}
.info-value.pink {
  color: var(--c-pink);
}

.dao-ok {
  color: var(--c-jade);
}
.dao-shake {
  color: var(--c-gold);
}
.dao-break {
  color: #c9584c;
}
.dao-sleep {
  color: var(--c-mist);
}
.dao-reverse {
  color: var(--c-pink);
}

.section {
  margin-top: 4px;
}

.section-head {
  font-size: 0.88rem;
  font-weight: bold;
  border-bottom: 2px solid var(--c-jade);
  display: inline-block;
  margin-bottom: 6px;
  padding-bottom: 2px;
}

.section-head.pink {
  border-bottom-color: var(--c-pink);
}

.title-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.title-tag {
  background: var(--c-cream);
  border: 1px solid var(--c-gold);
  padding: 4px 8px;
}

.title-name {
  font-weight: bold;
  font-size: 0.8rem;
  color: var(--c-gold);
  margin-right: 4px;
}

.title-effect {
  font-size: 0.72rem;
  color: var(--c-mist);
}

.attire-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 5px;
}

.attire-item {
  border: 1px solid var(--c-mist);
  padding: 5px;
  background: var(--c-cream);
}

.attire-slot {
  font-size: 0.7rem;
  color: var(--c-mist);
  display: block;
  font-weight: bold;
}

.attire-desc {
  font-size: 0.8rem;
}

.slave-section {
  background: rgba(212, 98, 142, 0.06);
  padding: 8px;
  border: 1px dashed var(--c-pink);
}

@media (max-width: 500px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  .attire-grid {
    grid-template-columns: 1fr;
  }
}
</style>
