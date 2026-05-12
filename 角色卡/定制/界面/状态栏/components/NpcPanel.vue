<template>
  <div class="npc-panel">
    <template v-if="hasNpc">
      <!-- 基础信息 -->
      <div class="section-title">📋 基础信息 · {{ npc.姓名 }}</div>
      <div class="info-grid">
        <div class="field">
          <span class="k">姓名</span><span class="v">{{ npc.姓名 }}</span>
        </div>
        <div class="field">
          <span class="k">性别</span><span class="v">{{ npc.性别 }}</span>
        </div>
        <div class="field">
          <span class="k">年龄</span><span class="v">{{ npc.年龄 }}</span>
        </div>
        <div class="field">
          <span class="k">外表</span><span class="v">{{ npc.外表年龄 }}</span>
        </div>
        <div class="field">
          <span class="k">身高</span><span class="v">{{ npc.身高 }}</span>
        </div>
        <div class="field">
          <span class="k">种族</span><span class="v">{{ npc.种族 }}</span>
        </div>
        <div class="field">
          <span class="k">表面身份</span><span class="v">{{ npc.表面身份 }}</span>
        </div>
        <div class="field">
          <span class="k">隐藏身份</span><span class="v accent">{{ npc.隐藏身份 }}</span>
        </div>
        <div class="field">
          <span class="k">处女</span><span class="v">{{ npc.处女 }}</span>
        </div>
        <div class="field">
          <span class="k">颜值</span><span class="v highlight">{{ npc.颜值 }}</span>
        </div>
        <div class="field">
          <span class="k">瞳色</span><span class="v">{{ npc.瞳孔颜色 }}</span>
        </div>
        <div class="field">
          <span class="k">肤色</span><span class="v">{{ npc.肤色 }}</span>
        </div>
        <div class="field">
          <span class="k">纹身</span><span class="v">{{ npc.纹身 }}</span>
        </div>
      </div>

      <!-- 性格与风格 -->
      <div class="section-title">🎭 性格与言语</div>
      <div class="pair-grid">
        <div class="pair">
          <span class="pair-label">伪装性格</span><span class="pair-val">{{ npc.伪装性格 }}</span>
        </div>
        <div class="pair">
          <span class="pair-label">真实性格</span><span class="pair-val accent">{{ npc.真实性格 }}</span>
        </div>
        <div class="pair">
          <span class="pair-label">伪装言语</span><span class="pair-val">{{ npc.伪装言语风格 }}</span>
        </div>
        <div class="pair">
          <span class="pair-label">真实言语</span><span class="pair-val accent">{{ npc.真实言语风格 }}</span>
        </div>
      </div>

      <!-- 关系与称呼 -->
      <div class="section-title">💬 关系</div>
      <div class="info-grid compact">
        <div class="field">
          <span class="k">私下自称</span><span class="v">{{ npc.私下自称 }}</span>
        </div>
        <div class="field">
          <span class="k">私下称呼</span><span class="v">{{ npc.对我称呼.私下 }}</span>
        </div>
        <div class="field">
          <span class="k">公共称呼</span><span class="v">{{ npc.对我称呼.公共 }}</span>
        </div>
        <div class="field">
          <span class="k">关系</span><span class="v">{{ npc.关系 }}</span>
        </div>
        <div class="field">
          <span class="k">印象</span><span class="v">{{ npc.对卡尔德印象 }}</span>
        </div>
        <div class="field">
          <span class="k">子嗣</span><span class="v">{{ npc.子嗣 }}</span>
        </div>
      </div>

      <!-- 身体数据 -->
      <div class="section-title">📐 身体数据</div>
      <div class="info-grid compact">
        <div class="field full">
          <span class="k">性癖</span><span class="v warn">{{ npc.性癖 }}</span>
        </div>
        <div class="field full">
          <span class="k">三围与身材</span><span class="v">{{ npc.三围与身材 }}</span>
        </div>
        <div class="field full">
          <span class="k">身体数据</span><span class="v">{{ npc.身体数据 }}</span>
        </div>
        <div class="field full">
          <span class="k">发型衣着</span><span class="v">{{ npc.发型衣着 }}</span>
        </div>
        <div class="field">
          <span class="k">怀孕</span><span class="v">{{ npc.怀孕 }}</span>
        </div>
        <div class="field">
          <span class="k">性知识</span><span class="v">{{ npc.对性知识认知 }}</span>
        </div>
        <div class="field">
          <span class="k">玉精</span><span class="v">{{ npc.玉精 }}</span>
        </div>
      </div>

      <!-- 改造与特性 -->
      <div class="section-title">🧬 改造与特性</div>
      <div class="info-grid compact">
        <div class="field full">
          <span class="k">肉体改造</span><span class="v">{{ npc.肉体改造 }}</span>
        </div>
        <div class="field full">
          <span class="k">生物特性</span><span class="v">{{ npc.生物特性 }}</span>
        </div>
        <div class="field">
          <span class="k">嘴承受</span><span class="v">{{ npc.嘴承受鸡巴 }}</span>
        </div>
        <div class="field">
          <span class="k">逼承受</span><span class="v">{{ npc.逼承受鸡巴 }}</span>
        </div>
        <div class="field">
          <span class="k">屁眼承受</span><span class="v">{{ npc.屁眼承受鸡巴 }}</span>
        </div>
      </div>

      <!-- 性爱实时 -->
      <div class="section-title">🔥 实时状态</div>
      <div class="info-grid compact">
        <div class="field">
          <span class="k">高潮</span><span class="v highlight">{{ npc.高潮记录 }}次</span>
        </div>
        <div class="field">
          <span class="k">场景时间</span><span class="v">{{ npc.性爱时间 }}</span>
        </div>
        <div class="field full">
          <span class="k">负面状态</span><span class="v">{{ npc.性爱后负面状态 }}</span>
        </div>
        <div class="field">
          <span class="k">💧 胃</span><span class="v">{{ npc.体内精液.胃 }}ml</span>
        </div>
        <div class="field">
          <span class="k">💧 子宫</span><span class="v">{{ npc.体内精液.子宫 }}ml</span>
        </div>
        <div class="field">
          <span class="k">💧 肠道</span><span class="v">{{ npc.体内精液.肠道 }}ml</span>
        </div>
        <div class="field">
          <span class="k">肚子</span><span class="v">{{ npc.肚子 }}</span>
        </div>
        <div class="field">
          <span class="k">体位</span><span class="v">{{ npc.体位 }}</span>
        </div>
        <div class="field">
          <span class="k">位置</span><span class="v">{{ npc.具体位置 }}</span>
        </div>
      </div>
    </template>

    <!-- 空态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">👁‍🗨</div>
      <div class="empty-text">当前无互动角色</div>
      <div class="empty-hint">等待剧情中出现NPC，或去「角色库」创建角色</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

// 直接读取当前NPC对象（AI自然写入的格式）
const npc = computed(() => store.data.当前NPC);
const hasNpc = computed(() => npc.value.姓名 && npc.value.姓名 !== '无');
</script>

<style lang="scss" scoped>
.npc-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent-purple);
  border-bottom: 1px solid var(--border-main);
  padding-bottom: 3px;
  margin-top: 4px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.info-grid.compact {
  grid-template-columns: repeat(3, 1fr);
}

.field {
  background: var(--bg-section);
  padding: 3px 6px;
  border: 1px solid var(--border-main);
  font-size: 0.7rem;
  overflow: hidden;
}

.field.full {
  grid-column: 1 / -1;
}

.k {
  display: block;
  color: var(--text-dim);
  font-size: 0.62rem;
  margin-bottom: 1px;
}

.v {
  color: var(--text-primary);
  word-break: break-all;
}
.v.highlight {
  color: var(--accent-gold);
  font-weight: 600;
}
.v.accent {
  color: var(--accent-pink);
}
.v.warn {
  color: var(--accent-red);
}

.pair-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}

.pair {
  background: var(--bg-section);
  padding: 4px 6px;
  border: 1px solid var(--border-main);
  font-size: 0.72rem;
}

.pair-label {
  display: block;
  color: var(--text-dim);
  font-size: 0.62rem;
}
.pair-val {
  color: var(--text-primary);
}
.pair-val.accent {
  color: var(--accent-pink);
}

.empty-state {
  text-align: center;
  padding: 24px 12px;
}
.empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  opacity: 0.5;
}
.empty-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 4px;
}
.empty-hint {
  color: var(--text-dim);
  font-size: 0.72rem;
}

@media (max-width: 400px) {
  .info-grid,
  .info-grid.compact {
    grid-template-columns: repeat(2, 1fr);
  }
  .pair-grid {
    grid-template-columns: 1fr;
  }
}
</style>
