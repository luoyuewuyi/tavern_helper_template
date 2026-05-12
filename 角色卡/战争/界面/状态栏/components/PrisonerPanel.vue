<template>
  <div class="prisoner-panel">
    <!-- 身体状态 -->
    <div class="section">
      <div class="section-title"><span class="title-marker">■</span> 身体状况</div>
      <div class="info-block">
        <div class="info-row">
          <span class="info-label">伤情</span>
          <span class="info-content">{{ store.data.林秋禾.身体状态 }}</span>
        </div>
      </div>
    </div>

    <!-- 着装 -->
    <div class="section">
      <div class="section-title"><span class="title-marker">■</span> 着装记录</div>
      <div class="info-block">
        <div class="info-row">
          <span class="info-content">{{ store.data.林秋禾.着装 }}</span>
        </div>
      </div>
    </div>

    <!-- 当前姿态 -->
    <div class="section">
      <div class="section-title"><span class="title-marker">■</span> 当前姿态</div>
      <div class="info-block">
        <div class="info-row">
          <span class="info-content">{{ store.data.林秋禾.姿态 }}</span>
        </div>
      </div>
    </div>

    <!-- 数值详情表 -->
    <div class="section">
      <div class="section-title"><span class="title-marker">■</span> 审讯数据</div>
      <div class="data-table">
        <div v-for="item in dataItems" :key="item.label" class="data-row">
          <span class="data-label">{{ item.label }}</span>
          <span class="data-value" :class="item.colorClass">{{ item.display }}</span>
          <span class="data-note">{{ item.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const dataItems = computed(() => {
  const d = store.data.林秋禾;
  return [
    {
      label: '疼 痛 度',
      display: d.疼痛度 + '/100',
      note: d.疼痛度 > 70 ? '剧烈疼痛' : d.疼痛度 > 40 ? '持续疼痛' : d.疼痛度 > 10 ? '轻微不适' : '无明显疼痛',
      colorClass: d.疼痛度 > 70 ? 'val-danger' : d.疼痛度 > 40 ? 'val-warn' : 'val-safe',
    },
    {
      label: '绝 望 度',
      display: d.绝望度 + '/100',
      note: d.绝望度 > 70 ? '身心俱碎' : d.绝望度 > 40 ? '疲惫不堪' : d.绝望度 > 20 ? '咬牙坚持' : '斗志昂扬',
      colorClass: d.绝望度 > 70 ? 'val-danger' : d.绝望度 > 40 ? 'val-warn' : 'val-safe',
    },
    {
      label: '好 感 度',
      display: (d.好感度 > 0 ? '+' : '') + d.好感度,
      note: d.好感度 > 20 ? '半信半疑' : d.好感度 > -20 ? '困惑怀疑' : d.好感度 > -60 ? '敌视警惕' : '极度仇恨',
      colorClass: d.好感度 > 0 ? 'val-positive' : d.好感度 > -40 ? 'val-warn' : 'val-danger',
    },
    {
      label: '恶 心 度',
      display: d.恶心度 + '/100',
      note: d.恶心度 > 70 ? '极度厌恶' : d.恶心度 > 40 ? '强烈反感' : '尚可忍受',
      colorClass: d.恶心度 > 70 ? 'val-danger' : d.恶心度 > 40 ? 'val-warn' : 'val-safe',
    },
    {
      label: '忠 诚 度',
      display: d.忠诚度 + '/100',
      note: d.忠诚度 > 80 ? '坚如磐石' : d.忠诚度 > 60 ? '信念坚定' : '受到动摇但不屈',
      colorClass: 'val-loyalty',
    },
    {
      label: '警 觉 度',
      display: d.警觉度 + '/100',
      note: d.警觉度 > 60 ? '开始主动试探' : d.警觉度 > 30 ? '有所察觉' : '未起疑心',
      colorClass: d.警觉度 > 60 ? 'val-alert' : d.警觉度 > 30 ? 'val-warn' : 'val-safe',
    },
    {
      label: '体 力 值',
      display: d.体力值 + '/100',
      note: d.体力值 < 30 ? '极度虚弱' : d.体力值 < 60 ? '体力不支' : '尚有余力',
      colorClass: d.体力值 < 30 ? 'val-danger' : d.体力值 < 60 ? 'val-warn' : 'val-safe',
    },
    {
      label: '羞 耻 度',
      display: d.羞耻度 + '/100',
      note: d.羞耻度 > 70 ? '怒火中烧' : d.羞耻度 > 40 ? '难以忍受' : '尚可承受',
      colorClass: d.羞耻度 > 70 ? 'val-danger' : d.羞耻度 > 40 ? 'val-warn' : 'val-safe',
    },
    {
      label: '信 任 度',
      display: (d.信任度 > 0 ? '+' : '') + d.信任度,
      note: d.信任度 > 20 ? '隐约信任' : d.信任度 > -20 ? '存疑观望' : '完全不信',
      colorClass: d.信任度 > 0 ? 'val-positive' : d.信任度 > -40 ? 'val-warn' : 'val-danger',
    },
    {
      label: '求生意志',
      display: d.求生意志 + '/100',
      note: d.求生意志 < 30 ? '生死已不在意' : d.求生意志 < 60 ? '勉力支撑' : '坚信会被营救',
      colorClass: d.求生意志 < 30 ? 'val-danger' : d.求生意志 < 60 ? 'val-warn' : 'val-safe',
    },
  ];
});
</script>

<style lang="scss" scoped>
.prisoner-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: bold;
  color: var(--c-text);
  margin-bottom: 6px;
  padding-bottom: 3px;
  border-bottom: 1px dashed var(--c-border-light);
}

.title-marker {
  color: var(--c-accent-red-bright);
  margin-right: 4px;
}

.info-block {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--c-border-light);
  padding: 7px 10px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 1.5;
}

.info-label {
  color: var(--c-text-dim);
  flex-shrink: 0;
  min-width: 36px;
  font-size: 11px;
}

.info-content {
  color: var(--c-text);
}

/* 数据表格 */
.data-table {
  border: 1px solid var(--c-border-light);
  background: rgba(0, 0, 0, 0.2);
}

.data-row {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-bottom: 1px solid rgba(90, 74, 58, 0.2);
  font-size: 11px;
  gap: 8px;
}

.data-row:last-child {
  border-bottom: none;
}

.data-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.data-label {
  width: 68px;
  flex-shrink: 0;
  color: var(--c-text-dim);
  letter-spacing: 2px;
  font-size: 11px;
}

.data-value {
  width: 52px;
  flex-shrink: 0;
  font-weight: bold;
  font-size: 12px;
  text-align: right;
}

.data-note {
  flex: 1;
  color: var(--c-text-dim);
  font-size: 10px;
  font-style: italic;
  text-align: right;
}

.val-safe {
  color: var(--c-accent-green-bright);
}
.val-warn {
  color: var(--c-accent-amber);
}
.val-danger {
  color: var(--c-accent-red-bright);
}
.val-loyalty {
  color: var(--c-accent-red-bright);
  text-shadow: 0 0 4px rgba(196, 80, 80, 0.3);
}
.val-positive {
  color: var(--c-accent-green-bright);
}
.val-alert {
  color: var(--c-accent-amber);
}
</style>
