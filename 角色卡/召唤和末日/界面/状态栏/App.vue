<template>
  <section class="status-shell">
    <header class="status-head">
      <div class="head-copy">
        <span class="eyebrow">Summon & Doom</span>
        <div class="title-row">
          <h1>召唤和末日</h1>
          <span class="phase-chip" :class="pressureClass">{{ data.世界.灾变阶段 }}</span>
        </div>
        <p>{{ data.世界.区域态势 }}</p>
      </div>

      <div class="meta-grid">
        <article class="meta-card">
          <span class="meta-label">TIME</span>
          <strong>{{ data.世界.当前日期 }} {{ data.世界.当前时间 }}</strong>
          <span>{{ data.世界.当前时段 }} / {{ data.世界.当前天气 }}</span>
        </article>
        <article class="meta-card">
          <span class="meta-label">BASE</span>
          <strong>{{ data.基地.名称 }}</strong>
          <span>{{ data.基地.位置 }}</span>
        </article>
        <article class="meta-card">
          <span class="meta-label">COMMAND</span>
          <strong>{{ data.主角.代号 }} / {{ data.主角.指挥等级 }}</strong>
          <span>{{ data.主角.当前命令摘要 }}</span>
        </article>
      </div>
    </header>

    <section class="board-grid">
      <article class="panel span-8">
        <div class="panel-head">
          <span>总览</span>
          <strong>感染压力 {{ data.世界.感染压力 }}</strong>
        </div>
        <div class="metric-grid">
          <div class="metric-card">
            <span>威信</span>
            <strong>{{ data.主角.威信 }}</strong>
            <small>声望 {{ data.主角.声望 }}</small>
          </div>
          <div class="metric-card">
            <span>基地防御</span>
            <strong>{{ data.基地.防御 }}</strong>
            <small>{{ data.基地.风险等级 }}</small>
          </div>
          <div class="metric-card">
            <span>召唤上限</span>
            <strong>{{ data.召唤系统.已出动单位数 }}/{{ data.召唤系统.当前召唤上限 }}</strong>
            <small>{{ data.召唤系统.当前时代 }}</small>
          </div>
          <div class="metric-card">
            <span>主力编队</span>
            <strong>{{ data.部队.当前主力编队 }}</strong>
            <small>{{ currentMainTeam?.状态 ?? '待命' }}</small>
          </div>
        </div>
      </article>

      <article class="panel span-4">
        <div class="panel-head">
          <span>资源</span>
          <strong>{{ data.资源.资源点 }} RP</strong>
        </div>
        <div class="resource-grid">
          <div v-for="resource in resourceCards" :key="resource.key" class="resource-card">
            <span>{{ resource.label }}</span>
            <strong>{{ resource.value }}</strong>
          </div>
        </div>
      </article>

      <article class="panel span-6">
        <div class="panel-head">
          <span>设施</span>
          <strong>基地 Lv.{{ data.基地.等级 }}</strong>
        </div>
        <div class="list-stack">
          <div v-for="facility in facilityEntries" :key="facility.name" class="list-row">
            <div>
              <strong>{{ facility.name }}</strong>
              <p>{{ facility.value.说明 }}</p>
            </div>
            <div class="row-meta">
              <span>Lv.{{ facility.value.等级 }}</span>
              <span>{{ facility.value.状态 }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="panel span-6">
        <div class="panel-head">
          <span>编队</span>
          <strong>{{ teamEntries.length }} 支</strong>
        </div>
        <div class="list-stack">
          <div v-for="team in teamEntries" :key="team.name" class="list-row">
            <div>
              <strong>{{ team.name }}</strong>
              <p>{{ team.value.任务 }}</p>
            </div>
            <div class="row-meta">
              <span>{{ teamTotalCount(team.value) }}/{{ team.value.人数上限 }}</span>
              <span>{{ team.value.状态 }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="panel span-6">
        <div class="panel-head">
          <span>焦点人物</span>
          <strong>{{ focusEntries.length }} 名</strong>
        </div>
        <div class="list-stack">
          <div v-for="person in focusEntries" :key="person.name" class="list-row">
            <div>
              <strong>{{ person.name }}</strong>
              <p>{{ person.value.职责 }} / {{ person.value.状态 }}</p>
            </div>
            <div class="row-meta">
              <span>忠诚 {{ person.value.忠诚 }}</span>
              <span>{{ person.value.位置 }}</span>
            </div>
          </div>
        </div>
      </article>

      <article class="panel span-6">
        <div class="panel-head">
          <span>任务与警报</span>
          <strong>{{ taskEntries.length + alertEntries.length }} 项</strong>
        </div>
        <div class="list-stack">
          <div v-for="task in taskEntries" :key="task.name" class="list-row">
            <div>
              <strong>{{ task.name }}</strong>
              <p>{{ task.value.目标 }}</p>
            </div>
            <div class="row-meta">
              <span>{{ task.value.状态 }}</span>
              <span>{{ task.value.类型 }}</span>
            </div>
          </div>
          <div v-for="alert in alertEntries" :key="alert.name" class="list-row alert">
            <div>
              <strong>{{ alert.name }}</strong>
              <p>{{ alert.value.内容 }}</p>
            </div>
            <div class="row-meta">
              <span>{{ alert.value.等级 }}</span>
            </div>
          </div>
        </div>
      </article>
    </section>

    <footer class="status-foot">
      <span>区域威胁 {{ data.隐藏派生.区域威胁等级 }}</span>
      <span>感染波动 {{ data.隐藏派生.感染波动值 }}</span>
      <span>{{ data.世界.通用语言规则 }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

const store = useDataStore();

const EMPTY_DATA = {
  世界: {
    当前日期: '--',
    当前时间: '--',
    当前时段: '等待同步',
    当前天气: '等待同步',
    灾变阶段: '终端同步中',
    区域态势: '状态栏正在等待 MVU 变量写入。',
    感染压力: 0,
    通讯状态: '未连接',
    通用语言规则: '等待变量同步',
  },
  主角: {
    代号: '指挥官',
    身份: '待同步',
    当前位置: '待同步',
    当前状态: '等待变量同步',
    指挥等级: '待同步',
    声望: 0,
    威信: 0,
    统率倾向: '待同步',
    当前命令摘要: '等待变量同步',
  },
  基地: {
    名称: '终端同步中',
    等级: 0,
    位置: '待同步',
    耐久: 0,
    供电: 0,
    防御: 0,
    居住容量: 0,
    当前人口: 0,
    风险等级: '未知',
    设施: {},
  },
  资源: {
    资源点: 0,
    弹药: 0,
    燃料: 0,
    食物: 0,
    药品: 0,
    建材: 0,
    零件: 0,
    电子元件: 0,
  },
  召唤系统: {
    当前时代: '待同步',
    解锁阶段: '待同步',
    解锁点数: 0,
    当前召唤上限: 0,
    已出动单位数: 0,
    可召唤池: {},
    科技树: {},
  },
  部队: {
    当前主力编队: '待同步',
    编队: {},
  },
  势力: {},
  角色档案: {
    焦点人物: {},
    长期档案: {},
  },
  任务与事件: {
    当前任务: {},
    警报: {},
    历史记录: {},
  },
  隐藏派生: {
    区域威胁等级: 0,
    感染波动值: 0,
    空中支援许可: false,
    机场已取得: false,
    冷战阶段已解锁: false,
    现代阶段已解锁: false,
    关键前置完成度: 0,
  },
};

const data = computed(() => store?.data ?? EMPTY_DATA);

const facilityEntries = computed(() => _.entries(data.value.基地.设施).map(([name, value]) => ({ name, value })));
const focusEntries = computed(() => _.entries(data.value.角色档案.焦点人物).map(([name, value]) => ({ name, value })));
const alertEntries = computed(() => _.entries(data.value.任务与事件.警报).map(([name, value]) => ({ name, value })));
const teamEntries = computed(() => _.entries(data.value.部队.编队).map(([name, value]) => ({ name, value })));
const taskEntries = computed(() => _.entries(data.value.任务与事件.当前任务).map(([name, value]) => ({ name, value })));

const resourceCards = computed(() => [
  { key: '资源点', label: '资源点', value: data.value.资源.资源点 },
  { key: '弹药', label: '弹药', value: data.value.资源.弹药 },
  { key: '燃料', label: '燃料', value: data.value.资源.燃料 },
  { key: '食物', label: '食物', value: data.value.资源.食物 },
  { key: '药品', label: '药品', value: data.value.资源.药品 },
  { key: '建材', label: '建材', value: data.value.资源.建材 },
  { key: '零件', label: '零件', value: data.value.资源.零件 },
  { key: '电子元件', label: '电子元件', value: data.value.资源.电子元件 },
]);

const pressureClass = computed(() => {
  if (data.value.世界.感染压力 >= 70) return 'danger';
  if (data.value.世界.感染压力 >= 45) return 'warn';
  return 'safe';
});

const currentMainTeam = computed(() => data.value.部队.编队[data.value.部队.当前主力编队]);

function teamTotalCount(team: { 单位: Record<string, { 数量: number }> }) {
  return _.sum(_.values(team.单位).map(unit => unit.数量));
}
</script>

<style scoped lang="scss">
.status-shell {
  position: relative;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 18px;
  background: linear-gradient(180deg, rgba(142, 255, 202, 0.05), transparent 18%), rgba(4, 13, 11, 0.92);
  border: 1px solid var(--terminal-line);
  border-radius: 24px;
  box-shadow: var(--terminal-shadow);
  overflow: hidden;
  display: grid;
  gap: 14px;
}

.status-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(transparent 0, rgba(255, 255, 255, 0.03) 50%, transparent 100%),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 4px);
  mix-blend-mode: screen;
  opacity: 0.16;
}

.status-head,
.board-grid,
.status-foot {
  position: relative;
  z-index: 1;
}

.status-head {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1fr);
  gap: 14px;
}

.eyebrow,
.meta-label {
  font: 600 11px var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--terminal-muted);
}

.title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 6px 0 8px;
}

.title-row h1 {
  margin: 0;
  font-size: clamp(28px, 5vw, 42px);
  line-height: 1;
}

.head-copy p {
  margin: 0;
  color: var(--terminal-muted);
  font-size: 14px;
}

.meta-grid {
  display: grid;
  gap: 10px;
}

.meta-card {
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(15, 36, 31, 0.95), rgba(10, 24, 21, 0.88));
  border: 1px solid var(--terminal-line);
  border-radius: 16px;
  display: grid;
  gap: 4px;
}

.meta-card strong {
  font-size: 15px;
}

.meta-card span:last-child {
  color: var(--terminal-muted);
  font-size: 12px;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 14px;
}

.panel {
  padding: 14px;
  background: linear-gradient(180deg, rgba(15, 35, 30, 0.94), rgba(10, 23, 20, 0.92));
  border: 1px solid var(--terminal-line);
  border-radius: 18px;
  min-width: 0;
}

.span-8 {
  grid-column: span 8;
}

.span-6 {
  grid-column: span 6;
}

.span-4 {
  grid-column: span 4;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(127, 255, 214, 0.1);
  font: 600 12px var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-head strong {
  font-size: 12px;
  color: var(--terminal-accent);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.metric-card,
.resource-card {
  padding: 12px;
  background: rgba(5, 18, 15, 0.88);
  border: 1px solid rgba(127, 255, 214, 0.09);
  border-radius: 14px;
  display: grid;
  gap: 4px;
}

.metric-card span,
.resource-card span {
  color: var(--terminal-muted);
  font-size: 12px;
}

.metric-card strong,
.resource-card strong {
  font-size: 18px;
}

.metric-card small {
  color: var(--terminal-muted);
  font-size: 12px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.phase-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font: 700 11px var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.phase-chip.safe {
  color: var(--terminal-accent);
  background: rgba(142, 255, 202, 0.09);
  border-color: rgba(142, 255, 202, 0.2);
}

.phase-chip.warn {
  color: var(--terminal-warn);
  background: rgba(255, 209, 102, 0.08);
  border-color: rgba(255, 209, 102, 0.22);
}

.phase-chip.danger {
  color: var(--terminal-danger);
  background: rgba(255, 125, 125, 0.08);
  border-color: rgba(255, 125, 125, 0.2);
}

.list-stack {
  display: grid;
  gap: 10px;
}

.list-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(5, 18, 15, 0.84);
  border: 1px solid rgba(127, 255, 214, 0.08);
}

.list-row.alert {
  border-color: rgba(255, 209, 102, 0.18);
}

.list-row strong {
  display: block;
  margin-bottom: 4px;
}

.list-row p {
  margin: 0;
  color: var(--terminal-muted);
  font-size: 12px;
  line-height: 1.5;
}

.row-meta {
  display: grid;
  justify-items: end;
  gap: 6px;
  color: var(--terminal-muted);
  font-size: 12px;
}

.status-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--terminal-muted);
  font: 600 11px var(--font-mono);
  letter-spacing: 0.08em;
  padding-top: 12px;
  border-top: 1px solid rgba(127, 255, 214, 0.12);
}

@media (max-width: 960px) {
  .status-head,
  .metric-grid,
  .resource-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .status-head {
    grid-template-columns: 1fr;
  }

  .span-8,
  .span-6,
  .span-4 {
    grid-column: span 12;
  }
}

@media (max-width: 720px) {
  .status-shell {
    padding: 14px;
    border-radius: 18px;
  }

  .metric-grid,
  .resource-grid {
    grid-template-columns: 1fr;
  }

  .panel-head,
  .status-foot,
  .list-row {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: start;
  }

  .panel-head {
    display: grid;
  }

  .row-meta {
    justify-items: start;
  }
}
</style>
