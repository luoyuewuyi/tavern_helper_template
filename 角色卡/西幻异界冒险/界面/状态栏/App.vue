<template>
  <div class="shell" :class="{ collapsed: !panelOpen }">
    <!-- 折叠/展开按钮 -->
    <button type="button" class="toggle-btn" @click="panelOpen = !panelOpen">
      <span class="toggle-icon">{{ panelOpen ? '▼' : '▶' }}</span>
      <span>{{ panelOpen ? '收起状态栏' : '展开状态栏' }}</span>
    </button>

    <template v-if="panelOpen">
      <!-- 顶部：世界信息 -->
      <header class="hero">
        <div class="hero-main">
          <div class="eyebrow">WESTERN FANTASY / ADVENTURE / SYSTEM</div>
          <h1>西幻异界冒险</h1>
          <p>{{ store.data.世界.世界局势摘要 }}</p>
        </div>
        <div class="hero-side">
          <span>{{ store.data.世界.当前日期 }}</span>
          <span>{{ store.data.世界.当前时段 }}</span>
          <span>{{ store.data.世界.当前地点 }}</span>
          <span>{{ store.data.世界.天气 }}</span>
        </div>
      </header>

      <!-- 主角面板 -->
      <section class="top-strip">
        <article class="panel protagonist-panel">
          <div class="section-title"><span>主角面板</span><small>{{ store.data.主角.身份 }}</small></div>
          <div class="info-grid">
            <div class="info-box"><span>姓名</span><strong>{{ store.data.主角.姓名 }}</strong></div>
            <div class="info-box"><span>境界</span><strong>{{ store.data.主角.境界 }}</strong></div>
            <div class="info-box"><span>体系</span><strong>{{ store.data.主角.修炼体系 }}</strong></div>
            <div class="info-box"><span>天赋</span><strong>{{ store.data.主角.天赋 }}</strong></div>
            <div class="info-box"><span>属性</span><strong>{{ store.data.主角.属性 }}</strong></div>
            <div class="info-box"><span>状态</span><strong>{{ store.data.主角.生命值 }}</strong></div>
            <div class="info-box full"><span>信物</span><p>{{ store.data.主角.信物 }}</p></div>
            <div class="info-box full"><span>当前目标</span><p>{{ store.data.主角.当前目标 }}</p></div>
          </div>
        </article>

        <article class="panel economy-summary">
          <div class="section-title"><span>财务</span><small>{{ store.data.经济.收支摘要 }}</small></div>
          <div class="wallet-grid">
            <div class="wallet-card"><span>铜币</span><strong>{{ store.data.经济.铜币 }}</strong></div>
            <div class="wallet-card"><span>银币</span><strong>{{ store.data.经济.银币 }}</strong></div>
            <div class="wallet-card"><span>金币</span><strong>{{ store.data.经济.金币 }}</strong></div>
            <div class="wallet-card"><span>灵石</span><strong>{{ store.data.经济.灵石 }}</strong></div>
            <div class="wallet-card"><span>华夏信用币</span><strong>{{ store.data.经济.华夏信用币 }}</strong></div>
          </div>
        </article>
      </section>

      <!-- Tab 切换 -->
      <section class="tabs">
        <button v-for="item in tabs" :key="item" type="button" class="tab" :class="{ active: currentTab === item }" @click="currentTab = item">{{ item }}</button>
      </section>

      <!-- 好感度 Tab -->
      <section v-if="currentTab === '好感度'" class="panel content-panel">
        <div class="section-title"><span>好感度</span><small>双向独立系统</small></div>
        <div class="favor-grid">
          <article v-for="[name, item] in favorEntries" :key="name" class="favor-card">
            <div class="favor-head"><strong>{{ name }}</strong><span class="favor-type">{{ item.对主角.类型 }}</span></div>
            <div class="favor-bars">
              <div class="favor-row"><span class="label">对主角</span><div class="meter"><div class="fill amber" :style="{ width: item.对主角.数值 + '%' }"></div></div><strong>{{ item.对主角.数值 }}</strong></div>
              <div class="favor-row"><span class="label">主角对其</span><div class="meter"><div class="fill blue" :style="{ width: item.主角对其.数值 + '%' }"></div></div><strong>{{ item.主角对其.数值 }}</strong></div>
            </div>
          </article>
        </div>
      </section>

      <!-- 装备与物品 Tab -->
      <section v-else-if="currentTab === '装备'" class="panel content-panel">
        <div class="section-title"><span>装备栏</span></div>
        <div class="detail-columns">
          <div class="detail-card"><span class="label">武器</span><p>{{ store.data.装备栏.武器 }}</p></div>
          <div class="detail-card"><span class="label">上装</span><p>{{ store.data.装备栏.上装 }}</p></div>
          <div class="detail-card"><span class="label">下装</span><p>{{ store.data.装备栏.下装 }}</p></div>
          <div class="detail-card"><span class="label">鞋子</span><p>{{ store.data.装备栏.鞋子 }}</p></div>
          <div class="detail-card full"><span class="label">饰品</span><p>{{ store.data.装备栏.饰品 }}</p></div>
        </div>
        <div class="section-title" style="margin-top:12px"><span>物品栏</span></div>
        <div class="item-grid">
          <article v-for="[name, item] in itemEntries" :key="name" class="item-card">
            <strong>{{ name }}</strong><span>×{{ item.数量 }}</span>
            <small>{{ item.描述 }}</small>
          </article>
        </div>
      </section>

      <!-- 系统（天命轮盘） Tab -->
      <section v-else-if="currentTab === '系统'" class="panel content-panel">
        <div class="section-title"><span>天命轮盘</span><small>积分：{{ store.data.系统.积分 }}</small></div>
        <div class="detail-columns">
          <div class="detail-card"><span class="label">当前称号</span><strong class="gold-text">{{ store.data.系统.当前称号 }}</strong><small>{{ store.data.系统.称号效果 }}</small></div>
          <div class="detail-card"><span class="label">商城</span><small>{{ store.data.系统.商城摘要 }}</small></div>
        </div>
        <div class="section-title" style="margin-top:10px"><span>技能</span></div>
        <div class="item-grid">
          <article v-for="[name, item] in skillEntries" :key="name" class="item-card">
            <strong>{{ name }}</strong><span>{{ item.等级 }}</span>
            <small>{{ item.描述 }}</small>
          </article>
        </div>
        <div class="section-title" style="margin-top:10px"><span>任务</span></div>
        <div class="detail-columns">
          <div v-for="[name, item] in taskEntries" :key="name" class="detail-card">
            <span class="label">{{ item.类型 }}</span>
            <strong>{{ name }}</strong>
            <p>{{ item.目标 }}</p>
            <small>奖励：{{ item.奖励 }} | {{ item.状态 }}</small>
          </div>
        </div>
        <div class="system-msg"><span class="label">系统消息</span><p>{{ store.data.系统.最近系统消息 }}</p></div>
      </section>

      <!-- NPC动态 Tab -->
      <section v-else-if="currentTab === 'NPC'" class="panel content-panel">
        <div class="section-title"><span>NPC 动态</span></div>
        <div class="detail-columns">
          <div v-for="[name, item] in npcEntries" :key="name" class="detail-card">
            <strong>{{ name }}</strong>
            <p>📍 {{ item.当前位置 }}</p>
            <p>🎬 {{ item.当前行动 }}</p>
            <small>{{ item.对主角态度 }}</small>
          </div>
        </div>
      </section>

      <!-- 后宫 Tab -->
      <section v-else-if="currentTab === '后宫'" class="panel content-panel">
        <div class="section-title"><span>后宫</span></div>
        <template v-if="haremEntries.length > 0">
          <div class="detail-columns">
            <div v-for="[name, item] in haremEntries" :key="name" class="detail-card">
              <strong>{{ name }}</strong>
              <p>{{ item.身份 }}</p>
              <div class="favor-row"><span class="label">好感等级</span><strong>{{ item.好感度等级 }}/10</strong></div>
              <small>{{ item.当前状态 }}</small>
            </div>
          </div>
        </template>
        <p v-else class="empty-hint">暂无后宫成员</p>
      </section>

      <!-- 日志 Tab -->
      <section v-else class="panel content-panel">
        <div class="section-title"><span>日志</span></div>
        <div class="detail-columns">
          <div class="detail-card"><span class="label">最近事件</span><ul class="plain-list"><li v-for="item in store.data.日志.最近事件" :key="item">{{ item }}</li></ul></div>
          <div class="detail-card"><span class="label">系统提示</span><ul class="plain-list"><li v-for="item in store.data.日志.最近系统提示" :key="item">{{ item }}</li></ul></div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const tabs = ['好感度', '装备', '系统', 'NPC', '后宫', '日志'] as const;
const currentTab = ref<(typeof tabs)[number]>('好感度');
const panelOpen = ref(false);

const favorEntries = computed(() => Object.entries(store.data.好感度));
const itemEntries = computed(() => Object.entries(store.data.物品栏));
const skillEntries = computed(() => Object.entries(store.data.系统.已解锁技能));
const taskEntries = computed(() => Object.entries(store.data.系统.当前任务));
const npcEntries = computed(() => Object.entries(store.data.NPC动态));
const haremEntries = computed(() => Object.entries(store.data.后宫));
</script>

<style scoped lang="scss">
.shell {
  --bg: linear-gradient(180deg, rgba(17, 14, 12, 0.98), rgba(10, 10, 12, 0.98));
  --panel: rgba(255, 255, 255, 0.045);
  --line: rgba(199, 145, 81, 0.24);
  --text: #f4eadb;
  --soft: #c9bcaa;
  --gold: #d59d57;
  width: 100%; max-width: 860px; margin: 8px auto; padding: 14px;
  display: grid; gap: 14px; color: var(--text);
  background: radial-gradient(circle at top left, rgba(181, 111, 44, 0.18), transparent 28%),
              radial-gradient(circle at top right, rgba(111, 33, 22, 0.18), transparent 26%),
              var(--bg);
  border: 1px solid var(--line); border-radius: 20px;
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.34);
  font-family: Georgia, 'Times New Roman', serif;
}
.shell.collapsed { gap: 0; }

/* 折叠按钮 */
.toggle-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; border: 1px solid var(--line); border-radius: 12px;
  background: linear-gradient(135deg, rgba(213, 157, 87, 0.12), rgba(111, 33, 22, 0.1));
  color: var(--gold); cursor: pointer; font-size: 13px; font-family: inherit;
  transition: all 0.25s ease;
  width: fit-content;
}
.toggle-btn:hover { background: linear-gradient(135deg, rgba(213, 157, 87, 0.22), rgba(111, 33, 22, 0.18)); }
.toggle-icon { font-size: 10px; }

.hero, .section-title, .top-strip, .tabs, .tab-row, .hero-side, .hero-main, .focus-head, .duo, .badge-stack, .chip-row { display: flex; gap: 10px; }
.hero, .top-strip { justify-content: space-between; }
.hero { padding: 14px; border-radius: 16px; border: 1px solid var(--line); background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(213, 157, 87, 0.05)); }
.hero-main, .hero-side { flex-direction: column; }
.hero-main h1, .prelude h1 { margin: 4px 0; }
.eyebrow { font-size: 10px; letter-spacing: 0.28em; color: var(--gold); }
.hero-main p, .detail-card p, .wallet-card p, .info-box p, .system-msg p, .favor-card p { margin: 0; color: var(--soft); line-height: 1.55; }
.hero-side span, .badge-stack span, .chip-row span, .mini-tab, .tab { padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.04); }
.world-grid, .wallet-grid, .detail-columns, .info-grid, .item-grid, .favor-grid { display: grid; }
.protagonist-panel, .economy-summary { flex: 1; }
.panel, .metric-card, .wallet-card, .detail-card, .item-card, .favor-card, .stat-box, .info-box, .system-msg { border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); background: var(--panel); padding: 14px; }
.section-title { justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-title span { color: var(--gold); font-size: 18px; }
.section-title small, .label, .info-box span, .wallet-card span { color: var(--soft); font-size: 12px; }
.info-box strong, .wallet-card strong, .stat-box strong, .duo strong, .gold-text { font-size: 22px; color: #f7ddb4; }

/* 好感度条 - 缩小版 */
.meter { height: 5px; margin-top: 4px; border-radius: 999px; overflow: hidden; background: rgba(255, 255, 255, 0.08); flex: 1; }
.fill { height: 100%; }
.amber { background: linear-gradient(90deg, #8d5926, #d59d57); }
.blue { background: linear-gradient(90deg, #2f4867, #6d8eb8); }
.red { background: linear-gradient(90deg, #5b1e1e, #b75e55); }

.tabs, .tab-row, .chip-row, .badge-stack { flex-wrap: wrap; }
.tab, .mini-tab { color: var(--soft); cursor: pointer; }
.tab.active, .mini-tab.active { border-color: var(--line); background: linear-gradient(135deg, rgba(213, 157, 87, 0.18), rgba(111, 33, 22, 0.18)); color: var(--text); }
.content-panel { display: grid; gap: 12px; }
.wallet-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.detail-columns { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.info-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.info-box.full, .detail-card.full { grid-column: 1 / -1; }
.wallet-card, .detail-card, .item-card, .stat-box { display: grid; gap: 6px; }
.plain-list { margin: 0; padding-left: 18px; color: var(--soft); }

/* 好感度卡片 - 紧凑版 */
.favor-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.favor-card { display: grid; gap: 6px; padding: 10px; }
.favor-head { display: flex; justify-content: space-between; align-items: center; }
.favor-head strong { font-size: 13px; color: #f7ddb4; }
.favor-type { padding: 2px 6px; border-radius: 999px; font-size: 10px; background: rgba(213, 157, 87, 0.15); color: var(--gold); }
.favor-bars { display: grid; gap: 4px; }
.favor-row { display: flex; align-items: center; gap: 6px; }
.favor-row strong { font-size: 12px; min-width: 24px; text-align: right; color: #f7ddb4; }
.favor-row .label { min-width: 48px; font-size: 11px; }

.item-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.item-card { display: grid; gap: 4px; }
.item-card strong { color: #f7ddb4; }
.item-card span { color: var(--gold); font-size: 13px; }
.item-card small { color: var(--soft); }
.system-msg { margin-top: 8px; }
.system-msg .label { margin-bottom: 4px; display: block; }
.empty-hint { text-align: center; color: var(--soft); padding: 20px; }
@media (max-width: 720px) { .wallet-grid, .detail-columns, .info-grid, .favor-grid, .item-grid { grid-template-columns: 1fr; } .hero, .top-strip { flex-direction: column; align-items: flex-start; } }
</style>
