<template>
  <main class="status-shell">
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">烽烟武林</p>
        <h1>大靖末年世界偵录</h1>
        <p class="summary">{{ world.局势摘要 }}</p>
      </div>
      <div class="hero-meta">
        <div class="meta-chip">
          <span>时间</span>
          <strong>{{ world.年号 }} · {{ world.日期 }} · {{ world.时段 }}</strong>
        </div>
        <div class="meta-chip">
          <span>地点</span>
          <strong>{{ world.所在区域 }} / {{ world.所在地点 }}</strong>
        </div>
        <div class="meta-chip">
          <span>天候</span>
          <strong>{{ world.天气 }}</strong>
        </div>
      </div>
    </section>

    <section class="overview-grid">
      <SectionCard title="存身总览" eyebrow="即刻状态" collapsible :default-open="true" storage-key="fywl:overview">
        <div class="overview-list">
          <div class="overview-item"><span>境界</span><strong>{{ player.境界 }}</strong></div>
          <div class="overview-item"><span>阵营倾向</span><strong>{{ player.当前阵营倾向 }}</strong></div>
          <div class="overview-item"><span>银两</span><strong>{{ player.银两 }} 两</strong></div>
          <div class="overview-item"><span>风险</span><strong>{{ world.通缉风险 }}</strong></div>
        </div>
        <div class="meter-stack">
          <StatMeter label="体力" :value="player.体力" />
          <StatMeter label="精神" :value="player.精神" />
          <StatMeter label="名望" :value="normalizedReputation" tone="gold" />
          <StatMeter label="恶名" :value="player.恶名" tone="alert" />
        </div>
      </SectionCard>

      <SectionCard title="天下脉动" eyebrow="局势指数" collapsible :default-open="true" storage-key="fywl:world">
        <div class="meter-stack">
          <StatMeter label="朝局热度" :value="world.朝局热度" tone="gold" />
          <StatMeter label="战乱热度" :value="world.战乱热度" tone="alert" />
          <StatMeter label="通缉风险" :value="world.通缉风险" tone="alert" />
        </div>
        <div class="brief-grid">
          <article v-for="item in worldRumorCards" :key="item.title" class="brief-card">
            <h4>{{ item.title }}</h4>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </SectionCard>
    </section>

    <section class="content-columns">
      <div class="content-column">
        <SectionCard title="玩家状态" eyebrow="人物档案" collapsible :default-open="false" storage-key="fywl:player">
          <div class="detail-grid">
            <article v-for="item in playerSummaryEntries" :key="item.label" class="info-tile">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </article>
          </div>
          <TagCloud :tags="playerTags" />
        </SectionCard>

        <SectionCard title="人物关系" eyebrow="朝局牵连" collapsible :default-open="true" storage-key="fywl:relation">
          <div class="org-panel">
            <p><strong>当前归属：</strong>{{ relationOrganization.名称 }} / {{ relationOrganization.身份 }}</p>
            <p><strong>组织评价：</strong>{{ relationOrganization.评价 }}</p>
          </div>
          <div class="entry-grid compact relation-grid">
            <article v-for="item in relationEntries" :key="item.name" class="relation-card">
              <header>
                <strong>{{ item.name }}</strong>
                <span>{{ item.stance }}</span>
              </header>
              <p>{{ item.comment }}</p>
              <div class="relation-bars">
                <StatMeter label="信任" :value="item.trustBar" tone="accent" />
                <StatMeter label="敌意" :value="item.hostility" tone="alert" />
              </div>
            </article>
          </div>
          <details class="fold-panel">
            <summary>同行者与临时同路人</summary>
            <div class="fold-body">
              <article v-for="item in companionEntries" :key="item.name" class="entry-card">
                <p class="entry-label">{{ item.identity }}</p>
                <strong>{{ item.name }}</strong>
                <p>{{ item.comment }}</p>
              </article>
              <p v-if="companionEntries.length === 0" class="empty-state">暂无稳定同行者。</p>
            </div>
          </details>
        </SectionCard>

        <SectionCard title="任务簿" eyebrow="当前牵引" collapsible :default-open="false" storage-key="fywl:tasks">
          <div class="task-columns">
            <details v-for="section in taskSections" :key="section.title" class="fold-panel" :open="section.open">
              <summary>{{ section.title }} · {{ section.items.length }}</summary>
              <div class="fold-body">
                <article v-for="task in section.items" :key="task.name" class="entry-card">
                  <p class="entry-label">{{ task.status }}</p>
                  <strong>{{ task.name }}</strong>
                  <p><strong>说明：</strong>{{ task.description }}</p>
                  <p><strong>目标：</strong>{{ task.goal }}</p>
                  <p><strong>奖惩：</strong>{{ task.reward }} / {{ task.penalty }}</p>
                </article>
                <p v-if="section.items.length === 0" class="empty-state">当前暂无此类任务。</p>
              </div>
            </details>
          </div>
        </SectionCard>
      </div>

      <div class="content-column">
        <SectionCard title="装备与携行" eyebrow="生存资源" collapsible :default-open="false" storage-key="fywl:gear">
          <div class="subsection">
            <h4>装备</h4>
            <div class="entry-grid gear-grid">
              <article v-for="item in equipmentEntries" :key="item.label" class="entry-card">
                <p class="entry-label">{{ item.label }}</p>
                <strong>{{ item.name }}</strong>
                <p>{{ item.description }}</p>
              </article>
            </div>
          </div>
          <div class="subsection">
            <h4>携带物</h4>
            <div class="entry-grid compact inventory-grid">
              <article v-for="item in inventoryEntries" :key="item.label" class="entry-card">
                <p class="entry-label">{{ item.label }}</p>
                <strong>x{{ item.count }}</strong>
                <p>{{ item.description }}</p>
              </article>
              <p v-if="inventoryEntries.length === 0" class="empty-state">暂无携带物。</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="势力态势" eyebrow="天下各方" collapsible :default-open="false" storage-key="fywl:force">
          <div class="force-grid">
            <article v-for="item in forceEntries" :key="item.name" class="force-card">
              <header>
                <strong>{{ item.name }}</strong>
                <span>{{ item.attitude }}</span>
              </header>
              <p>{{ item.motion }}</p>
              <StatMeter label="活跃度" :value="item.activity" :tone="item.tone" />
            </article>
          </div>
        </SectionCard>

        <SectionCard title="剧情记录" eyebrow="线索与回响" collapsible :default-open="false" storage-key="fywl:records">
          <div class="record-columns">
            <details v-for="section in recordSections" :key="section.title" class="fold-panel" :open="section.open">
              <summary>{{ section.title }} · {{ section.items.length }}</summary>
              <div class="fold-body">
                <article v-for="item in section.items" :key="item.label" class="entry-card">
                  <p class="entry-label">{{ item.label }}</p>
                  <p>{{ item.value }}</p>
                </article>
                <p v-if="section.items.length === 0" class="empty-state">暂无记录。</p>
              </div>
            </details>
          </div>
        </SectionCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import SectionCard from './components/SectionCard.vue';
import StatMeter from './components/StatMeter.vue';
import TagCloud from './components/TagCloud.vue';
import { useDataStore } from './store';

const store = useDataStore();
const data = computed(() => store.data);
const world = computed(() => data.value.世界);
const player = computed(() => data.value.玩家);
const relation = computed(() => data.value.关系);
const forces = computed(() => data.value.势力);
const tasks = computed(() => data.value.任务);
const records = computed(() => data.value.剧情记录);
const normalizedReputation = computed(() => _.clamp(player.value.名望 + 50, 0, 100));
const worldRumorCards = computed(() => Object.entries(world.value.江湖风闻).slice(0, 4).map(([title, text]) => ({ title, text })));
const playerTags = computed(() => Object.entries(player.value.关键标签).map(([label, value]) => ({ label, value })));
const playerSummaryEntries = computed(() => [
  { label: '身份自述', value: player.value.身份自述 },
  { label: '来历', value: player.value.来历 },
  { label: '当前目标', value: player.value.当前目标 },
  { label: '外伤', value: player.value.外伤 },
  { label: '内伤', value: player.value.内伤 },
  { label: '阵营倾向', value: player.value.当前阵营倾向 },
]);
const equipmentEntries = computed(() => Object.entries(player.value.装备).map(([label, item]) => ({ label, name: item.名称, description: item.描述 })));
const inventoryEntries = computed(() => Object.entries(player.value.携带物).map(([label, item]) => ({ label, count: item.数量, description: item.描述 })));
const relationEntries = computed(() =>
  Object.entries(relation.value.关键人物).map(([name, item]) => ({ name, stance: item.立场, trustBar: _.clamp(item.信任 + 50, 0, 100), hostility: item.敌意, comment: item.评价 })),
);
const relationOrganization = computed(() => relation.value.所在门派或组织);
const companionEntries = computed(() =>
  Object.entries(relation.value.当前同行者).map(([name, item]) => ({ name, identity: `${item.身份} · ${item.状态}`, comment: `${item.评价}（信任 ${item.信任}）` })),
);
const forceEntries = computed(() =>
  Object.entries(forces.value).map(([name, item]) => ({
    name,
    attitude: item.对玩家态度,
    motion: item.动向,
    activity: item.活跃度,
    tone: item.对玩家态度.includes('敌') ? 'alert' : item.活跃度 >= 70 ? 'gold' : 'accent',
  })),
);

function mapTaskSection(section: Record<string, { 说明: string; 目标: string; 奖励: string; 惩罚: string; 状态: string }>) {
  return Object.entries(section).map(([name, item]) => ({
    name,
    description: item.说明,
    goal: item.目标,
    reward: item.奖励,
    penalty: item.惩罚,
    status: item.状态,
  }));
}

const taskSections = computed(() => [
  { title: '主线', items: mapTaskSection(tasks.value.主线), open: true },
  { title: '支线', items: mapTaskSection(tasks.value.支线), open: false },
  { title: '悬赏', items: mapTaskSection(tasks.value.悬赏), open: false },
  { title: '密令', items: mapTaskSection(tasks.value.密令), open: false },
]);

function mapRecordSection(section: Record<string, string | boolean>) {
  return Object.entries(section).map(([label, value]) => ({ label, value: typeof value === 'boolean' ? (value ? '是' : '否') : value }));
}

const recordSections = computed(() => [
  { title: '最近大事件', items: mapRecordSection(records.value.最近大事件), open: true },
  { title: '近期遭遇', items: mapRecordSection(records.value.近期遭遇), open: true },
  { title: '已知情报', items: mapRecordSection(records.value.已知情报), open: false },
  { title: '已触发旗标', items: mapRecordSection(records.value.已触发旗标), open: false },
]);
</script>

<style scoped lang="scss">
.status-shell { max-width: 1280px; margin: 0 auto; display: grid; gap: 18px; }
.hero {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 18px;
  padding: 22px 24px;
  border-radius: 24px;
  border: 1px solid rgba(79, 70, 57, 0.55);
  background: linear-gradient(135deg, rgba(255, 251, 243, 0.94), rgba(239, 231, 214, 0.88)), var(--ink-bg);
  box-shadow: 0 18px 36px var(--shadow-ink);
}
.hero::before, .hero::after { content: ''; position: absolute; border-radius: 50%; filter: blur(2px); }
.hero::before { width: 210px; height: 210px; top: -84px; right: -50px; background: radial-gradient(circle, rgba(53, 94, 92, 0.12), transparent 72%); }
.hero::after { width: 180px; height: 180px; left: -50px; bottom: -80px; background: radial-gradient(circle, rgba(182, 139, 70, 0.18), transparent 72%); }
.hero-text, .hero-meta { position: relative; z-index: 1; }
.hero h1 { margin: 0; font-size: clamp(28px, 4vw, 42px); letter-spacing: 0.1em; }
.eyebrow { margin: 0 0 8px; color: var(--ink-accent); font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; }
.summary { max-width: 760px; margin: 12px 0 0; color: var(--ink-muted); line-height: 1.7; }
.hero-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.meta-chip { padding: 14px 16px; border-radius: 16px; border: 1px solid rgba(79, 70, 57, 0.18); background: rgba(255, 255, 255, 0.45); }
.meta-chip span { display: block; margin-bottom: 6px; color: var(--ink-soft); font-size: 12px; }
.meta-chip strong { color: var(--ink-text); font-size: 15px; }
.overview-grid, .content-columns { display: grid; gap: 16px; }
.overview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.content-columns { grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr); align-items: start; }
.content-column,
.overview-list, .brief-grid, .entry-grid, .force-grid, .record-columns, .task-columns, .meter-stack, .detail-grid { display: grid; gap: 10px; }
.overview-list { grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 12px; }
.overview-item, .brief-card, .entry-card, .relation-card, .force-card {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.54);
  border: 1px solid rgba(79, 70, 57, 0.12);
}
.overview-item span, .entry-label { color: var(--ink-soft); font-size: 12px; }
.overview-item strong { display: block; margin-top: 4px; font-size: 14px; }
.brief-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.entry-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.force-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.brief-card h4, .subsection h4 { margin: 0 0 6px; font-size: 14px; }
.brief-card p, .entry-card p, .relation-card p, .force-card p, .detail-block p { margin: 0; color: var(--ink-muted); line-height: 1.6; }
.detail-block { display: grid; gap: 8px; }
.subsection + .subsection { margin-top: 14px; }
.compact { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.relation-card, .force-card { display: grid; gap: 10px; }
.relation-card header, .force-card header { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; }
.relation-card span, .force-card span { color: var(--ink-accent); font-size: 12px; }
.relation-bars { display: grid; gap: 8px; }
.fold-panel { overflow: hidden; border-radius: 16px; border: 1px solid rgba(79, 70, 57, 0.16); background: rgba(255, 255, 255, 0.45); }
.fold-panel summary { cursor: pointer; list-style: none; padding: 12px 14px; font-weight: 600; color: var(--ink-text); }
.fold-panel summary::-webkit-details-marker { display: none; }
.fold-body { display: grid; gap: 10px; padding: 0 14px 14px; }
.empty-state { margin: 0; color: var(--ink-soft); font-size: 13px; }
.detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 10px;
}
.info-tile,
.org-panel {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(79, 70, 57, 0.1);
}
.info-tile span {
  display: block;
  margin-bottom: 4px;
  color: var(--ink-soft);
  font-size: 12px;
}
.info-tile strong {
  display: block;
  color: var(--ink-text);
  font-size: 14px;
  line-height: 1.5;
}
.org-panel {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}
.gear-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.inventory-grid,
.relation-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (max-width: 720px) {
  #app { padding: 10px; }
  .hero { padding: 18px 16px; }
  .overview-grid,
  .content-columns,
  .overview-list,
  .detail-grid,
  .brief-grid,
  .entry-grid,
  .force-grid,
  .compact,
  .gear-grid,
  .inventory-grid,
  .relation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
