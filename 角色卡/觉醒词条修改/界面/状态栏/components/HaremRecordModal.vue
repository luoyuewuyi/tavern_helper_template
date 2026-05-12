<template>
  <teleport to="body">
    <div v-if="open" class="overlay" @click.self="$emit('close')">
      <div class="modal">
        <div class="modal-head">
          <div>
            <span class="eyebrow">详细档案</span>
            <h3>后宫录</h3>
          </div>
          <button class="close-btn" type="button" @click="$emit('close')">×</button>
        </div>

        <div class="record-list">
          <article v-for="person in people" :key="person.name" class="record-card">
            <div class="record-top">
              <div>
                <strong>{{ person.name }}</strong>
                <p>{{ person.value.基础信息.身份 }}</p>
              </div>
              <div class="record-badges">
                <span>{{ person.value.基础信息.种族 }}</span>
                <span v-if="formatLevel(person.value.基础信息.等级)"
                  >等级：{{ formatLevel(person.value.基础信息.等级) }}</span
                >
                <span>怀孕：{{ person.value.怀孕状态 }}</span>
              </div>
            </div>

            <div class="detail-grid">
              <div>
                <span class="detail-label">关系</span>
                <p>{{ person.value.与主角关系 }}</p>
              </div>
              <div>
                <span class="detail-label">当前状态</span>
                <p>{{ person.value.当前状态 }}</p>
              </div>
              <div>
                <span class="detail-label">种族等级</span>
                <p>{{ formatLevel(person.value.基础信息.等级) || '未识别' }}</p>
              </div>
              <div>
                <span class="detail-label">人类形态</span>
                <p>{{ person.value.人类形态特征 || '暂无特别备注' }}</p>
              </div>
              <div>
                <span class="detail-label">异种形态</span>
                <p>{{ person.value.异种形态特征 || '当前未显露' }}</p>
              </div>
            </div>

            <div class="tags-block">
              <div>
                <span class="detail-label">当前可见词条</span>
                <div class="tag-row">
                  <span v-for="tag in person.value.当前可见词条" :key="tag" class="tag visible">{{ tag }}</span>
                </div>
              </div>
              <div>
                <span class="detail-label">显性词条</span>
                <div class="tag-row">
                  <span v-for="tag in person.value.显性词条" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
              <div>
                <span class="detail-label">隐性词条</span>
                <div class="tag-row">
                  <span
                    v-for="entry in hiddenEntries(person.value)"
                    :key="entry.key"
                    class="tag soft"
                    :class="{ locked: !entry.value.已识别 }"
                  >
                    {{ entry.value.已识别 ? entry.value.内容 : `未识别：${entry.key}` }}
                  </span>
                </div>
              </div>
            </div>

            <div class="history-block">
              <span class="detail-label">最近变化记录</span>
              <div v-if="historyEntries(person.value).length" class="history-list">
                <div v-for="entry in historyEntries(person.value)" :key="entry.time" class="history-item">
                  <strong>{{ entry.time }}</strong>
                  <p>变更：{{ entry.value.变更 }}</p>
                  <p>原因：{{ entry.value.原因 }}</p>
                  <p>修正：{{ entry.value.世界修正结果 }}</p>
                </div>
              </div>
              <p v-else class="empty">暂无记录，但后续剧情变化必须自动写入这里。</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';

const props = defineProps<{
  open: boolean;
  data: Schema;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const people = computed(() =>
  _(props.data.人物档案)
    .entries()
    .filter(([, value]) => value.后宫录可见)
    .map(([name, value]) => ({ name, value }))
    .value(),
);

function formatLevel(level: string) {
  if (!level || level === '无') {
    return '';
  }
  return level.endsWith('级') ? level : `${level}级`;
}

function historyEntries(person: Schema['人物档案'][string]) {
  return _(person.词条变化记录)
    .entries()
    .map(([time, value]) => ({ time, value }))
    .takeRight(5)
    .reverse()
    .value();
}

function hiddenEntries(person: Schema['人物档案'][string]) {
  return _(person.隐性词条)
    .entries()
    .map(([key, value]) => ({ key, value }))
    .value();
}
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 14, 0.78);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  z-index: 9999;
}

.modal {
  width: min(1040px, 100%);
  max-height: 88vh;
  overflow: auto;
  background: linear-gradient(180deg, rgba(10, 18, 30, 0.98), rgba(18, 29, 48, 0.98));
  border-radius: 28px;
  border: 1px solid var(--aw-line);
  box-shadow: var(--aw-shadow);
  padding: 20px;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.eyebrow {
  color: var(--aw-accent-2);
  font-size: 12px;
  letter-spacing: 0.18em;
}

.modal-head h3 {
  margin: 8px 0 0;
}

.close-btn {
  border: 1px solid rgba(255, 255, 255, 0.16);
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--aw-text);
  cursor: pointer;
}

.record-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.record-card {
  border-radius: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.record-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.record-top p {
  margin: 6px 0 0;
  color: var(--aw-muted);
  font-size: 13px;
}

.record-badges {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--aw-warn);
  font-size: 12px;
  text-align: right;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.detail-label {
  color: var(--aw-accent);
  font-size: 12px;
}

.detail-grid p,
.history-item p,
.empty {
  margin: 6px 0 0;
  line-height: 1.6;
}

.tags-block,
.history-block {
  margin-top: 14px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(124, 199, 255, 0.14);
  font-size: 12px;
}

.tag.soft {
  background: rgba(255, 255, 255, 0.08);
}

.tag.visible {
  background: rgba(136, 255, 214, 0.14);
}

.tag.locked {
  color: var(--aw-muted);
  border: 1px dashed rgba(255, 255, 255, 0.14);
}

.history-list {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.history-item {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  padding: 12px;
}

.empty {
  color: var(--aw-muted);
}

@media (max-width: 900px) {
  .record-list,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
