<template>
  <div v-if="store.status" class="status-card">
    <!-- 顶部装饰边框 -->
    <div class="card-ornament top"></div>

    <!-- 头部：角色信息 -->
    <header class="card-header">
      <div class="header-left">
        <div class="avatar-ring">
          <div class="avatar-icon">⚔</div>
        </div>
        <div class="header-info">
          <h1 class="char-name">{{ store.status.姓名 }}</h1>
          <div class="char-subtitle">
            <span class="tag-sex">{{ store.status.性别 }}</span>
            <span class="tag-divider">·</span>
            <span>{{ store.status.职业 }}</span>
          </div>
        </div>
      </div>
      <div class="rank-badge">{{ store.status.等级 }}</div>
    </header>

    <!-- 核心数值条 -->
    <div class="stat-bars">
      <div class="bar-item hp">
        <div class="bar-label">
          <span class="bar-icon">❤</span>
          <span>血量</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: hpPercent + '%' }">
            <div class="bar-shine"></div>
          </div>
        </div>
        <span class="bar-value">{{ store.status.当前血量 }}<small>/{{ store.status.最大血量 }}</small></span>
      </div>
      <div class="bar-item mana">
        <div class="bar-label">
          <span class="bar-icon">💎</span>
          <span>法力</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" :style="{ width: manaPercent + '%' }">
            <div class="bar-shine"></div>
          </div>
        </div>
        <span class="bar-value">{{ store.status.法力上限 }}<small>/10</small></span>
      </div>
    </div>

    <!-- 信息标签组 -->
    <div class="info-tags">
      <div class="info-tag talent">
        <span class="tag-icon">✦</span>
        <span class="tag-text">{{ store.status.天赋 }}</span>
      </div>
      <div class="info-tag gold">
        <span class="tag-icon">⛁</span>
        <span class="tag-text">{{ store.status.金币 }} 金币</span>
      </div>
      <div class="info-tag deck">
        <span class="tag-icon">🂠</span>
        <span class="tag-text">牌组 {{ store.status.当前牌组 }}/{{ store.status.最大牌组 }}</span>
      </div>
      <div v-if="store.status.随从训练 !== '无'" class="info-tag training">
        <span class="tag-icon">⚡</span>
        <span class="tag-text">{{ store.status.随从训练 }}</span>
      </div>
    </div>

    <!-- 定位/时间/任务 -->
    <div class="info-panel">
      <div class="panel-row">
        <span class="panel-icon">📍</span>
        <span class="panel-label">位置</span>
        <span class="panel-value">{{ store.status.位置 }}</span>
      </div>
      <div class="panel-row">
        <span class="panel-icon">⏳</span>
        <span class="panel-label">时间</span>
        <span class="panel-value">{{ store.status.时间 }}</span>
      </div>
      <div class="panel-row quest">
        <span class="panel-icon">📜</span>
        <span class="panel-label">任务</span>
        <span class="panel-value">{{ store.status.当前任务 }}</span>
      </div>
    </div>

    <section class="cards-section">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Deck Ledger</p>
          <h2 class="section-title">卡牌总览</h2>
        </div>
        <span class="section-count">{{ store.status.所有卡牌.length }}/{{ store.status.当前牌组 }}</span>
      </div>

      <div v-if="store.status.所有卡牌.length" class="cards-list">
        <article v-for="card in store.status.所有卡牌" :key="card.raw" class="card-entry">
          <div class="card-entry-head">
            <h3 class="card-name">{{ card.name }}</h3>
            <div v-if="card.meta.length" class="card-meta">
              <span v-for="meta in card.meta" :key="`${card.raw}-${meta}`" class="meta-chip">{{ meta }}</span>
            </div>
          </div>
          <p class="card-effect">
            <span class="effect-label">效果</span>
            <span>{{ card.effect }}</span>
          </p>
        </article>
      </div>

      <div v-else class="cards-empty">
        当前暂无卡牌，请在后续回复中持续输出“所有卡牌”明细。
      </div>
    </section>

    <!-- 选项按钮 -->
    <div v-if="store.options.length" class="options-section">
      <div class="options-divider">
        <span class="divider-ornament">◆</span>
        <span class="divider-text">行动抉择</span>
        <span class="divider-ornament">◆</span>
      </div>
      <div class="options-list">
        <button
          v-for="opt in store.options"
          :key="opt.label"
          class="option-btn"
          :class="'option-' + opt.label.toLowerCase()"
          @click="sendOption(opt)"
        >
          <span class="option-key">{{ opt.label }}</span>
          <span class="option-text">{{ opt.text }}</span>
          <span class="option-arrow">›</span>
        </button>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="card-ornament bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { useStatusStore } from './store';

const store = useStatusStore();

const hpPercent = computed(() => {
  if (!store.status) return 0;
  return Math.min(100, (store.status.当前血量 / store.status.最大血量) * 100);
});

const manaPercent = computed(() => {
  if (!store.status) return 0;
  const val = parseFloat(store.status.法力上限);
  return Math.min(100, (val / 10) * 100);
});

function sendOption(opt: { label: string; text: string }) {
  const textarea = window.parent.document.querySelector('#send_textarea') as HTMLTextAreaElement;
  const sendBtn = window.parent.document.querySelector('#send_but') as HTMLElement;
  if (textarea && sendBtn) {
    textarea.value = `选项${opt.label}：${opt.text}`;
    sendBtn.click();
  }
}
</script>

<style lang="scss" scoped>
.status-card {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  font-family: var(--font-body);
  color: var(--text-primary);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(75, 60, 160, 0.08) 0%, transparent 60%);
    pointer-events: none;
  }
}

/* ===== 装饰边框 ===== */
.card-ornament {
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold-dark), var(--gold), var(--gold-dark), transparent);
  opacity: 0.7;

  &.bottom {
    opacity: 0.4;
  }
}

/* ===== 头部 ===== */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(180deg, var(--card-surface) 0%, var(--card-bg) 100%);
  border-bottom: 1px solid var(--card-border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-ring {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--gold-dark), var(--gold), var(--gold-dark), var(--gold), var(--gold-dark));
  padding: 2px;
  flex-shrink: 0;
}

.avatar-icon {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e1b3a, #2a2555);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--gold-light);
}

.char-name {
  font-family: var(--font-title);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--gold-light);
  line-height: 1.2;
}

.char-subtitle {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.tag-divider {
  margin: 0 4px;
  opacity: 0.4;
}

.rank-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(212, 168, 67, 0.12), rgba(212, 168, 67, 0.05));
  border: 1px solid rgba(212, 168, 67, 0.25);
  border-radius: 4px;
  font-family: var(--font-title);
  font-size: 11px;
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 1px;
  white-space: nowrap;
}

/* ===== 数值条 ===== */
.stat-bars {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-label {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 52px;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--text-secondary);
}

.bar-icon {
  font-size: 12px;
}

.bar-track {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--card-border);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 1px;
  position: relative;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.bar-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.2), transparent);
  border-radius: 1px 1px 0 0;
}

.hp .bar-fill {
  background: linear-gradient(90deg, var(--hp-red), var(--hp-red-light));
  box-shadow: 0 0 8px rgba(196, 64, 64, 0.3);
}

.mana .bar-fill {
  background: linear-gradient(90deg, var(--mana-blue), var(--mana-blue-light));
  box-shadow: 0 0 8px rgba(75, 140, 212, 0.3);
}

.bar-value {
  width: 80px;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-title);
  flex-shrink: 0;

  small {
    font-weight: 400;
    color: var(--text-dim);
    font-size: 10px;
  }
}

.hp .bar-value { color: var(--hp-red-light); }
.mana .bar-value { color: var(--mana-blue-light); }

/* ===== 信息标签 ===== */
.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px 12px;
}

.info-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 11px;
  border: 1px solid;
}

.info-tag.talent {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.2);
  color: var(--arcane-purple-light);
}

.info-tag.gold {
  background: rgba(212, 168, 67, 0.08);
  border-color: rgba(212, 168, 67, 0.2);
  color: var(--gold-light);
}

.info-tag.deck {
  background: rgba(52, 211, 153, 0.08);
  border-color: rgba(52, 211, 153, 0.2);
  color: var(--nature-green);
}

.info-tag.training {
  background: rgba(251, 146, 60, 0.08);
  border-color: rgba(251, 146, 60, 0.2);
  color: #fb923c;
}

.tag-icon {
  font-size: 12px;
}

/* ===== 信息面板 ===== */
.info-panel {
  margin: 0 16px 12px;
  background: var(--card-surface);
  border: 1px solid var(--card-border);
  border-radius: 4px;
  overflow: hidden;
}

.panel-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 12px;
  border-bottom: 1px solid rgba(42, 45, 82, 0.5);

  &:last-child {
    border-bottom: none;
  }

  &.quest {
    background: linear-gradient(90deg, rgba(75, 60, 160, 0.06), transparent);
  }
}

.panel-icon {
  font-size: 13px;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}

.panel-label {
  color: var(--text-dim);
  font-size: 10px;
  width: 30px;
  flex-shrink: 0;
}

.panel-value {
  color: var(--text-primary);
  font-weight: 500;
}

.quest .panel-value {
  color: var(--arcane-purple-light);
}

/* ===== 卡牌总览 ===== */
.cards-section {
  margin: 0 16px 14px;
  padding: 12px;
  background:
    linear-gradient(180deg, rgba(18, 21, 44, 0.94), rgba(11, 13, 27, 0.98)),
    radial-gradient(circle at top right, rgba(75, 140, 212, 0.12), transparent 38%);
  border: 1px solid rgba(74, 63, 138, 0.5);
  border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(240, 208, 120, 0.05);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.section-kicker {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.section-title {
  font-family: var(--font-title);
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--gold-light);
}

.section-count {
  min-width: 48px;
  padding: 4px 8px;
  text-align: center;
  border-radius: 999px;
  background: rgba(75, 140, 212, 0.12);
  border: 1px solid rgba(75, 140, 212, 0.28);
  color: var(--mana-blue-light);
  font-size: 11px;
  font-weight: 700;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
}

.cards-list::-webkit-scrollbar {
  width: 5px;
}

.cards-list::-webkit-scrollbar-thumb {
  background: rgba(212, 168, 67, 0.35);
  border-radius: 999px;
}

.card-entry {
  padding: 10px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(75, 60, 160, 0.04));
  border: 1px solid rgba(42, 45, 82, 0.9);
  border-radius: 5px;
}

.card-entry-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.card-name {
  font-size: 13px;
  line-height: 1.35;
  color: var(--text-primary);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.meta-chip {
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(212, 168, 67, 0.08);
  border: 1px solid rgba(212, 168, 67, 0.18);
  color: var(--gold-light);
  font-size: 10px;
  line-height: 1.2;
}

.card-effect {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.55;
}

.effect-label {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.12);
  color: var(--arcane-purple-light);
  font-size: 10px;
  font-weight: 700;
}

.cards-empty {
  padding: 12px;
  border: 1px dashed rgba(90, 85, 106, 0.8);
  border-radius: 5px;
  color: var(--text-dim);
  font-size: 11px;
  line-height: 1.6;
}

/* ===== 选项区域 ===== */
.options-section {
  padding: 0 16px 14px;
}

.options-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  color: var(--text-dim);
  font-size: 10px;
}

.divider-ornament {
  color: var(--gold-dark);
  font-size: 8px;
}

.divider-text {
  font-family: var(--font-title);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: var(--card-surface);
  border: 1px solid var(--card-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: var(--font-body);
  text-align: left;
  color: var(--text-primary);

  &:hover {
    border-color: var(--card-border-glow);
    transform: translateX(3px);
    background: linear-gradient(90deg, rgba(75, 60, 160, 0.08), var(--card-surface));
  }

  &:active {
    transform: translateX(1px);
  }
}

.option-key {
  width: 26px;
  height: 26px;
  min-width: 26px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-title);
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.option-a .option-key { background: linear-gradient(135deg, #4b5cd4, #3b4cc4); box-shadow: 0 2px 6px rgba(75, 92, 212, 0.3); }
.option-b .option-key { background: linear-gradient(135deg, #8b5cf6, #7c3aed); box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3); }
.option-c .option-key { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3); }
.option-d .option-key { background: linear-gradient(135deg, #b8860b, #996b08); box-shadow: 0 2px 6px rgba(184, 134, 11, 0.3); }

.option-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
}

.option-arrow {
  color: var(--text-dim);
  font-size: 18px;
  font-weight: 300;
  transition: transform 0.2s;
}

.option-btn:hover .option-arrow {
  transform: translateX(2px);
  color: var(--gold);
}

/* ===== 响应式 ===== */
@media (max-width: 400px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .rank-badge {
    align-self: flex-end;
  }

  .bar-value {
    width: 65px;
    font-size: 11px;
  }
}
</style>
