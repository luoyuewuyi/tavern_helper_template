<template>
  <div class="character-panel">
    <!-- 角色基础信息 -->
    <div class="char-header">
      <div class="char-name">{{ props.characterName }}</div>
      <div v-if="cultivation" class="char-cultivation">
        <span class="cultivation-icon">⚔</span>
        {{ cultivation }}
      </div>
    </div>

    <!-- 当前状态/姿态描述（始终展开） -->
    <div v-if="status_desc" class="status-section">
      <div class="section-label">◇ 当前状态</div>
      <div class="status-text">{{ status_desc }}</div>
    </div>

    <!-- 内心想法 -->
    <div v-if="character?.基础?.内心想法" class="mind-section">
      <div class="section-label">◇ 内心想法</div>
      <div class="mind-text">「{{ character.基础.内心想法 }}」</div>
    </div>

    <!-- 心理活动 -->
    <div v-if="character?.基础?.心理活动" class="mind-section">
      <div class="section-label">◇ 心理活动</div>
      <div class="mind-text">「{{ character.基础.心理活动 }}」</div>
    </div>

    <!-- 最近性行为 -->
    <div v-if="character?.基础?.最近性行为" class="status-section">
      <div class="section-label">◇ 最近性行为</div>
      <div class="status-text">{{ character.基础.最近性行为 }}</div>
    </div>

    <!-- 献祭弧光 -->
    <div v-if="character?.献祭弧光" class="arclight-section">
      <div class="section-label">◇ 献祭弧光</div>
      <div class="arclight-badge">{{ character.献祭弧光.状态 || '未知' }}</div>
      <!-- 显示献祭弧光的额外字段 -->
      <template v-for="(val, key) in extra_arclight_fields" :key="key">
        <div class="body-item">
          <span class="body-label">{{ key }}</span>
          <span class="body-value">{{ val }}</span>
        </div>
      </template>
    </div>

    <!-- 与林美艳的关系 -->
    <div v-if="relation" class="relation-section">
      <div class="section-label">◇ 与林美艳的关系</div>
      <div class="relation-grid">
        <div class="relation-item">
          <span class="relation-name">状态</span>
          <span class="relation-value status">{{ relation.状态 || '—' }}</span>
        </div>
        <div class="relation-item">
          <span class="relation-name">亲密度</span>
          <div class="relation-bar-wrap">
            <div class="relation-bar">
              <div class="relation-fill intimacy" :style="{ width: Math.min(100, relation.亲密度 || 0) + '%' }"></div>
            </div>
            <span class="relation-num">{{ relation.亲密度 || 0 }}</span>
          </div>
        </div>
        <div class="relation-item">
          <span class="relation-name">背德值</span>
          <div class="relation-bar-wrap">
            <div class="relation-bar">
              <div class="relation-fill immorality" :style="{ width: Math.min(100, relation.背德值 || 0) + '%' }"></div>
            </div>
            <span class="relation-num">{{ relation.背德值 || 0 }}</span>
          </div>
        </div>
        <div v-if="relation.受精值 !== undefined" class="relation-item">
          <span class="relation-name">受精值</span>
          <div class="relation-bar-wrap">
            <div class="relation-bar">
              <div class="relation-fill fertility" :style="{ width: Math.min(100, relation.受精值 || 0) + '%' }"></div>
            </div>
            <span class="relation-num">{{ relation.受精值 || 0 }}</span>
          </div>
        </div>
        <!-- 关系中的额外字段 -->
        <template v-for="(val, key) in extra_relation_fields" :key="key">
          <div class="relation-item">
            <span class="relation-name">{{ key }}</span>
            <span class="relation-value">{{ val }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- 认知状态 -->
    <div v-if="character?.认知" class="cognition-section">
      <div class="section-label">◇ 认知</div>
      <div class="cognition-grid">
        <div v-if="character.认知.状态" class="cognition-item">
          <span class="cognition-name">状态</span>
          <span class="cognition-value">{{ character.认知.状态 }}</span>
        </div>
        <div v-if="character.认知.警戒值 !== undefined" class="cognition-item">
          <span class="cognition-name">警戒值</span>
          <span class="cognition-value warn">{{ character.认知.警戒值 }}</span>
        </div>
        <!-- 认知中的额外字段 -->
        <template v-for="(val, key) in extra_cognition_fields" :key="key">
          <div class="cognition-item">
            <span class="cognition-name">{{ key }}</span>
            <span class="cognition-value">{{ val }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- 生理状态 -->
    <SectionCollapse v-if="character?.生理" title="生理状态" :storage-key="`physio_${props.characterName}`">
      <!-- 数值型字段用进度条 -->
      <div v-if="has_physio_numbers" class="physio-bars">
        <div v-if="character.生理.性欲值 !== undefined" class="physio-bar-item">
          <span class="physio-bar-label">性欲值</span>
          <div class="relation-bar-wrap">
            <div class="relation-bar">
              <div
                class="relation-fill desire"
                :style="{ width: Math.min(100, character.生理.性欲值 || 0) + '%' }"
              ></div>
            </div>
            <span class="relation-num">{{ character.生理.性欲值 || 0 }}</span>
          </div>
        </div>
        <div v-if="character.生理.亲密度 !== undefined" class="physio-bar-item">
          <span class="physio-bar-label">亲密度</span>
          <div class="relation-bar-wrap">
            <div class="relation-bar">
              <div
                class="relation-fill intimacy"
                :style="{ width: Math.min(100, character.生理.亲密度 || 0) + '%' }"
              ></div>
            </div>
            <span class="relation-num">{{ character.生理.亲密度 || 0 }}</span>
          </div>
        </div>
        <div v-if="character.生理.受精值 !== undefined" class="physio-bar-item">
          <span class="physio-bar-label">受精值</span>
          <div class="relation-bar-wrap">
            <div class="relation-bar">
              <div
                class="relation-fill fertility"
                :style="{ width: Math.min(100, character.生理.受精值 || 0) + '%' }"
              ></div>
            </div>
            <span class="relation-num">{{ character.生理.受精值 || 0 }}</span>
          </div>
        </div>
      </div>
      <!-- 肉棒状态 -->
      <div v-if="character.生理.肉棒状态" class="physiology-text">
        {{ character.生理.肉棒状态 }}
      </div>
      <!-- 生理中的额外字段 -->
      <template v-for="(val, key) in extra_physio_fields" :key="key">
        <div class="body-item">
          <span class="body-label">{{ key }}</span>
          <span class="body-value">{{ val }}</span>
        </div>
      </template>
    </SectionCollapse>

    <!-- 服装 -->
    <SectionCollapse
      v-if="character?.服装"
      title="当前着装"
      :badge="character.服装.风格"
      :storage-key="`attire_${props.characterName}`"
    >
      <div class="attire-grid">
        <div v-for="(desc, slot) in displayed_attire" :key="slot" class="attire-item">
          <span class="attire-slot">{{ slot }}</span>
          <span class="attire-desc">{{ desc }}</span>
        </div>
      </div>
    </SectionCollapse>

    <!-- 身体状态 -->
    <SectionCollapse v-if="character?.身体" title="身体状态" :storage-key="`body_${props.characterName}`">
      <div class="body-list">
        <div v-if="character.身体.姿态与神情" class="body-item">
          <span class="body-label">姿态与神情</span>
          <span class="body-value">{{ character.身体.姿态与神情 }}</span>
        </div>
        <div v-if="character.身体.口腔" class="body-item">
          <span class="body-label">口腔</span>
          <span class="body-value">{{ character.身体.口腔 }}</span>
        </div>
        <div v-if="character.身体.胸部" class="body-item">
          <span class="body-label">胸部</span>
          <span class="body-value">{{ character.身体.胸部 }}</span>
        </div>
        <div v-if="character.身体.阴道" class="body-item">
          <span class="body-label">阴道</span>
          <span class="body-value">{{ character.身体.阴道 }}</span>
        </div>
        <div v-if="character.身体.子宫" class="body-item">
          <span class="body-label">子宫</span>
          <span class="body-value">{{ character.身体.子宫 }}</span>
        </div>
        <!-- 子宫精液占比 (对象类型) -->
        <div
          v-if="character.身体.子宫精液占比 && Object.keys(character.身体.子宫精液占比).length > 0"
          class="body-item"
        >
          <span class="body-label">子宫精液占比</span>
          <div class="semen-grid">
            <div v-for="(ratio, name) in character.身体.子宫精液占比" :key="name" class="semen-item">
              <span class="semen-name">{{ name }}</span>
              <span class="semen-ratio">{{ ratio }}</span>
            </div>
          </div>
        </div>
        <div v-if="character.身体.后庭" class="body-item">
          <span class="body-label">后庭</span>
          <span class="body-value">{{ character.身体.后庭 }}</span>
        </div>
        <div v-if="character.身体.腿部" class="body-item">
          <span class="body-label">腿部</span>
          <span class="body-value">{{ character.身体.腿部 }}</span>
        </div>
        <div v-if="character.身体.足部" class="body-item">
          <span class="body-label">足部</span>
          <span class="body-value">{{ character.身体.足部 }}</span>
        </div>
        <!-- 身体中的额外字段 -->
        <template v-for="(val, key) in extra_body_fields" :key="key">
          <div class="body-item">
            <span class="body-label">{{ key }}</span>
            <span class="body-value">{{ val }}</span>
          </div>
        </template>
      </div>
    </SectionCollapse>

    <!-- 动态显示角色中未被上面模板覆盖的额外顶级字段 -->
    <template v-for="(val, key) in extra_top_fields" :key="key">
      <SectionCollapse :title="String(key)" :storage-key="`extra_${props.characterName}_${key}`">
        <div v-if="typeof val === 'object'" class="body-list">
          <div v-for="(v, k) in val" :key="k" class="body-item">
            <span class="body-label">{{ k }}</span>
            <span class="body-value">{{ typeof v === 'object' ? JSON.stringify(v) : v }}</span>
          </div>
        </div>
        <div v-else class="status-text">{{ val }}</div>
      </SectionCollapse>
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';
import SectionCollapse from './SectionCollapse.vue';

const props = defineProps<{
  characterName: string;
}>();

const store = useDataStore();

const character = computed(() => store.data[props.characterName] as any);

const cultivation = computed(() => {
  return character.value?.基础?.灵力修为 || character.value?.基础?.修为 || null;
});

const status_desc = computed(() => {
  return character.value?.基础?.当前状态 || character.value?.基础?.姿态描述 || null;
});

const relation = computed(() => {
  return character.value?.与林美艳的关系 || null;
});

// 是否有数值型生理字段
const has_physio_numbers = computed(() => {
  const p = character.value?.生理;
  if (!p) return false;
  return p.性欲值 !== undefined || p.亲密度 !== undefined || p.受精值 !== undefined;
});

// 显示的服装（排除风格和空值）
const displayed_attire = computed(() => {
  const attire = character.value?.服装;
  if (!attire) return {};
  return _.pickBy(attire, (v: any, k: string) => k !== '风格' && v);
});

// 额外关系字段（schema 中未预定义的）
const extra_relation_fields = computed(() => {
  const rel = character.value?.与林美艳的关系;
  if (!rel) return {};
  return _.omit(rel, ['状态', '亲密度', '背德值', '受精值']);
});

// 额外生理字段
const extra_physio_fields = computed(() => {
  const p = character.value?.生理;
  if (!p) return {};
  return _.omit(p, ['肉棒状态', '性欲值', '亲密度', '受精值']);
});

// 额外身体字段
const extra_body_fields = computed(() => {
  const b = character.value?.身体;
  if (!b) return {};
  return _.omit(b, ['姿态与神情', '口腔', '胸部', '阴道', '子宫', '子宫精液占比', '后庭', '腿部', '足部']);
});

// 额外认知字段
const extra_cognition_fields = computed(() => {
  const c = character.value?.认知;
  if (!c) return {};
  return _.omit(c, ['状态', '警戒值']);
});

// 额外献祭弧光字段
const extra_arclight_fields = computed(() => {
  const a = character.value?.献祭弧光;
  if (!a) return {};
  return _.omit(a, ['状态']);
});

// 额外顶级字段（schema 中未预定义的类别）
const extra_top_fields = computed(() => {
  const char = character.value;
  if (!char) return {};
  return _.omit(char, ['基础', '生理', '与林美艳的关系', '服装', '身体', '认知', '献祭弧光']);
});
</script>

<style lang="scss" scoped>
.character-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.char-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--c-border-brown);
}

.char-name {
  font-size: 18px;
  font-weight: bold;
  color: var(--c-ink-black);
  letter-spacing: 3px;
}

.char-cultivation {
  font-size: 12px;
  color: var(--c-spirit-purple);
  background: rgba(128, 90, 213, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cultivation-icon {
  font-size: 10px;
}

.section-label {
  font-size: 12px;
  color: var(--c-spirit-gold);
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.status-section,
.mind-section,
.relation-section,
.cognition-section,
.physiology-section,
.arclight-section {
  margin-bottom: 14px;
}

.status-text {
  font-size: 13px;
  color: var(--c-jade-mist);
  line-height: 1.6;
  padding-left: 8px;
  border-left: 2px solid var(--c-border-brown);
}

.mind-text {
  font-size: 13px;
  color: var(--c-ink-black);
  font-style: italic;
  background: rgba(212, 175, 55, 0.08);
  padding: 10px 12px;
  border-radius: 6px;
  line-height: 1.5;
}

/* 献祭弧光 */
.arclight-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  color: var(--c-mist-blue);
  background: rgba(66, 153, 225, 0.12);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(66, 153, 225, 0.3);
}

/* 关系 */
.relation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}

.relation-item {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--c-border-brown);
  border-radius: 4px;
  padding: 8px 10px;
}

.relation-name {
  display: block;
  font-size: 11px;
  color: var(--c-jade-mist);
  margin-bottom: 4px;
}

.relation-value {
  font-size: 12px;
  font-weight: bold;
  color: var(--c-ink-black);

  &.status {
    color: var(--c-mist-blue);
  }
}

.relation-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.relation-bar {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.relation-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;

  &.intimacy {
    background: linear-gradient(90deg, var(--c-jade-green), #48bb78);
  }

  &.immorality {
    background: linear-gradient(90deg, var(--c-spirit-purple), #9f7aea);
  }

  &.fertility {
    background: linear-gradient(90deg, var(--c-blood-red), #fc8181);
  }

  &.desire {
    background: linear-gradient(90deg, #e53e3e, var(--c-blood-red));
  }
}

.relation-num {
  font-size: 11px;
  font-weight: bold;
  color: var(--c-ink-black);
  min-width: 24px;
  text-align: right;
}

/* 认知 */
.cognition-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cognition-item {
  background: rgba(66, 153, 225, 0.1);
  border: 1px solid var(--c-mist-blue);
  border-radius: 4px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cognition-name {
  font-size: 11px;
  color: var(--c-jade-mist);
}

.cognition-value {
  font-size: 12px;
  font-weight: bold;
  color: var(--c-mist-blue);

  &.warn {
    color: var(--c-blood-red);
  }
}

/* 生理数值条 */
.physio-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.physio-bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.physio-bar-label {
  font-size: 11px;
  color: var(--c-jade-mist);
  min-width: 50px;
  flex-shrink: 0;
}

.physiology-text {
  font-size: 12px;
  color: var(--c-jade-mist);
  line-height: 1.5;
  padding: 8px 10px;
  background: rgba(197, 48, 48, 0.05);
  border: 1px solid rgba(197, 48, 48, 0.2);
  border-radius: 4px;
}

/* 服装 */
.attire-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.attire-item {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--c-border-brown);
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 11px;
  flex: 1 1 auto;
  min-width: 120px;
  max-width: 100%;
}

.attire-slot {
  display: block;
  color: var(--c-spirit-purple);
  font-weight: bold;
  margin-bottom: 2px;
}

.attire-desc {
  color: var(--c-jade-mist);
  line-height: 1.4;
  display: block;
  word-break: break-all;
}

/* 身体状态 */
.body-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.body-item {
  padding: 6px 0;
  border-bottom: 1px dashed rgba(139, 115, 85, 0.15);

  &:last-child {
    border-bottom: none;
  }
}

.body-label {
  display: block;
  font-size: 11px;
  color: var(--c-spirit-purple);
  font-weight: bold;
  margin-bottom: 3px;
}

.body-value {
  display: block;
  font-size: 12px;
  color: var(--c-jade-mist);
  line-height: 1.5;
}

/* 子宫精液占比 */
.semen-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.semen-item {
  background: rgba(197, 48, 48, 0.06);
  border: 1px solid rgba(197, 48, 48, 0.15);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.semen-name {
  color: var(--c-ink-black);
  font-weight: bold;
}

.semen-ratio {
  color: var(--c-blood-red);
}

@media (max-width: 500px) {
  .relation-grid {
    grid-template-columns: 1fr;
  }

  .char-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .attire-item {
    min-width: 100%;
  }
}
</style>
