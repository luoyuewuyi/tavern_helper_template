<template>
  <div class="bb-card">
    <div class="court-line"></div>

    <div class="world-bar">
      <span class="world-item">
        🏀 <b>{{ data?.世界?.剧情阶段 }}</b>
      </span>
      <span class="world-item">📍 {{ data?.世界?.当前地点 }}</span>
      <span class="world-item">🕐 {{ data?.世界?.当前时间 }}</span>
      <span class="world-item">⚠ {{ data?.世界?.威胁等级 }}</span>
    </div>

    <div class="hero-layout">
      <section class="hero-section">
        <div class="hero-header">
          <div>
            <div class="hero-name">🏅 钟致远</div>
            <div class="hero-caption">世界核心人物 / 深海大学男篮主线</div>
          </div>
          <span class="hero-tag">{{ data?.钟致远?.篮球实力 }}</span>
        </div>

        <div class="hero-metrics">
          <div class="metric-card">
            <div class="metric-head">
              <span>体能</span>
              <strong>{{ data?.钟致远?.体能状态 ?? 0 }}</strong>
            </div>
            <div class="bar-track">
              <div class="bar-fill bar-green" :style="{ width: (data?.钟致远?.体能状态 ?? 0) + '%' }"></div>
            </div>
          </div>

          <div class="metric-card">
            <span class="metric-label">心理状态</span>
            <strong class="metric-text">{{ data?.钟致远?.心理状态 }}</strong>
          </div>

          <div class="metric-card">
            <span class="metric-label">伤病情况</span>
            <strong class="metric-text" :class="{ 'text-danger': data?.钟致远?.伤病情况 !== '健康' }">
              {{ data?.钟致远?.伤病情况 }}
            </strong>
          </div>

          <div class="metric-card">
            <span class="metric-label">赛季进度</span>
            <strong class="metric-text">{{ data?.钟致远?.赛季进度 }}</strong>
          </div>
        </div>

        <div class="task-block" v-if="heroTasks.length">
          <div class="section-mini-title">当前事务</div>
          <div class="task-list">
            <div v-for="task in heroTasks" :key="task.name" class="task-item">
              <span class="task-name">{{ task.name }}</span>
              <span class="task-desc">{{ task.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="family-section">
        <div class="section-mini-title">家族暗线</div>
        <div class="family-list">
          <div v-for="member in familyWatch" :key="member.name" class="family-card">
            <div class="family-head">
              <span class="family-name">{{ member.icon }} {{ member.name }}</span>
              <span class="family-badge">{{ member.badge }}</span>
            </div>
            <div class="family-main">{{ member.main }}</div>
            <div class="family-sub">{{ member.sub }}</div>
            <div class="family-note">{{ member.note }}</div>
          </div>
        </div>
      </section>
    </div>

    <div class="panel-header" @click="showFocus = !showFocus">
      <span>💕 焦点关系</span>
      <div class="panel-right">
        <span class="panel-meta">{{ focusCharacters.length }}人</span>
        <span class="toggle">{{ showFocus ? '▲' : '▼' }}</span>
      </div>
    </div>
    <div v-if="showFocus" class="focus-grid">
      <div v-for="char in focusCharacters" :key="char.name" class="relation-card">
        <div class="relation-head">
          <span class="relation-name">{{ char.icon }} {{ char.name }}</span>
          <span class="relation-badge">{{ char.section }}</span>
        </div>
        <div class="relation-stage">{{ char.relation || '关系待展开' }}</div>
        <div class="mini-bars">
          <div v-for="bar in char.bars" :key="bar.label" class="mini-bar-row">
            <span class="mini-label">{{ bar.label }}</span>
            <div class="mini-bar-wrap">
              <div class="bar-fill" :class="bar.cls" :style="{ width: bar.val + '%' }"></div>
            </div>
            <span class="mini-val">{{ bar.val }}</span>
          </div>
        </div>
        <div class="relation-status">{{ char.status }}</div>
      </div>
    </div>

    <div class="panel-header" @click="showArchive = !showArchive">
      <span>📚 全部角色档案</span>
      <div class="panel-right">
        <span class="panel-meta">{{ archiveCount }}人</span>
        <span class="toggle">{{ showArchive ? '▲' : '▼' }}</span>
      </div>
    </div>
    <div v-if="showArchive" class="archive-grid">
      <section v-for="section in relationshipSections" :key="section.title" class="archive-section">
        <div class="archive-title">{{ section.title }}</div>
        <div class="archive-list">
          <div v-for="char in section.items" :key="char.name" class="archive-row">
            <div class="archive-main">
              <span class="archive-name">{{ char.icon }} {{ char.name }}</span>
              <span class="archive-stage">{{ char.relation || '关系待展开' }}</span>
            </div>
            <div class="archive-status">{{ char.status }}</div>
          </div>
        </div>
      </section>
    </div>

    <div class="panel-header" @click="showVillain = !showVillain">
      <span>⚠️ 威胁势力</span>
      <div class="panel-right">
        <span class="panel-meta">{{ villainList.length }}项</span>
        <span class="toggle">{{ showVillain ? '▲' : '▼' }}</span>
      </div>
    </div>
    <div v-if="showVillain" class="villain-grid">
      <div v-for="villain in villainList" :key="villain.name" class="villain-card">
        <div class="villain-head">
          <span class="villain-name">{{ villain.name }}</span>
          <span class="villain-threat" :class="'threat-' + villain.level">{{ villain.threat }}</span>
        </div>
        <div class="villain-status">{{ villain.status }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

type BarItem = {
  label: string;
  val: number;
  cls: string;
};

type RelationItem = {
  name: string;
  icon: string;
  section: string;
  relation: string;
  status: string;
  bars: BarItem[];
  available: boolean;
  focusable: boolean;
  focusWeight: number;
};

const store = useDataStore();
const data = computed(() => store.data);
const showFocus = useLocalStorage('bb_status:showFocus', true);
const showArchive = useLocalStorage('bb_status:showArchive', false);
const showVillain = useLocalStorage('bb_status:showVillain', false);

const hiddenTags = ['尚未相识', '尚未出场', '陌生人'];

function isHiddenState(...values: Array<string | undefined>) {
  return values.some(value => hiddenTags.includes(value ?? ''));
}

function makeRelation(item: RelationItem) {
  return item;
}

const heroTasks = computed(() =>
  Object.entries(data.value?.钟致远?.当前事务 ?? {})
    .slice(0, 3)
    .map(([name, desc]) => ({ name, desc })),
);

const familyWatch = computed(() => [
  {
    name: '钟神秀',
    icon: '🗡️',
    badge: `${data.value?.钟神秀?.亲密度 ?? 0}/${data.value?.钟神秀?.保护欲 ?? 0}`,
    main: data.value?.钟神秀?.当前状态 ?? '状态未明',
    sub: data.value?.钟神秀?.行踪状态 ?? '暂无行踪',
    note: '钟家外层护盾',
  },
  {
    name: '钟婉清',
    icon: '🫧',
    badge: `波动 ${data.value?.钟婉清?.意识波动 ?? 0}`,
    main: data.value?.钟婉清?.当前状态 ?? '信息缺失',
    sub: data.value?.钟婉清?.囚禁状态 ?? '位置未知',
    note: data.value?.钟婉清?.生命体征 ?? '生命体征未知',
  },
]);

const relationshipCards = computed<RelationItem[]>(() => {
  const d = data.value;
  if (!d) {
    return [];
  }

  return [
    makeRelation({
      name: '林晓雨',
      icon: '🌸',
      section: '校园情线',
      relation: d.林晓雨?.关系阶段 ?? '',
      status: d.林晓雨?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.林晓雨?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '信赖', val: d.林晓雨?.信赖度 ?? 0, cls: 'bar-cyan' },
        { label: '创伤', val: d.林晓雨?.心理创伤值 ?? 0, cls: 'bar-red' },
      ],
      available: true,
      focusable: true,
      focusWeight: 100,
    }),
    makeRelation({
      name: '张萱',
      icon: '🔥',
      section: '校园情线',
      relation: d.张萱?.关系阶段 ?? '',
      status: d.张萱?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.张萱?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '信赖', val: d.张萱?.信赖度 ?? 0, cls: 'bar-cyan' },
        { label: '创伤', val: d.张萱?.心理创伤值 ?? 0, cls: 'bar-red' },
      ],
      available: true,
      focusable: true,
      focusWeight: 96,
    }),
    makeRelation({
      name: '温雪',
      icon: '❄️',
      section: '校园情线',
      relation: d.温雪?.关系阶段 ?? '',
      status: d.温雪?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.温雪?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '依赖', val: d.温雪?.依赖度 ?? 0, cls: 'bar-purple' },
      ],
      available: true,
      focusable: true,
      focusWeight: 72,
    }),
    makeRelation({
      name: '孔方颐',
      icon: '🎀',
      section: '校园情线',
      relation: d.孔方颐?.关系阶段 ?? '',
      status: d.孔方颐?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.孔方颐?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '暗恋', val: d.孔方颐?.暗恋强度 ?? 0, cls: 'bar-orange' },
      ],
      available: true,
      focusable: true,
      focusWeight: 68,
    }),
    makeRelation({
      name: '颜妙旖',
      icon: '👑',
      section: '事业暗线',
      relation: d.颜妙旖?.关系阶段 ?? '',
      status: d.颜妙旖?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.颜妙旖?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '合作', val: d.颜妙旖?.合作信任 ?? 0, cls: 'bar-gold' },
      ],
      available: true,
      focusable: true,
      focusWeight: 86,
    }),
    makeRelation({
      name: '慕容琴',
      icon: '🌟',
      section: '事业暗线',
      relation: d.慕容琴?.关系阶段 ?? '',
      status: d.慕容琴?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.慕容琴?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '亲密', val: d.慕容琴?.亲密度 ?? 0, cls: 'bar-orange' },
      ],
      available: !isHiddenState(d.慕容琴?.关系阶段, d.慕容琴?.当前状态),
      focusable: true,
      focusWeight: 84,
    }),
    makeRelation({
      name: '白露',
      icon: '📖',
      section: '事业暗线',
      relation: d.白露?.关系阶段 ?? '',
      status: d.白露?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.白露?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '师生', val: d.白露?.师生好感 ?? 0, cls: 'bar-cyan' },
      ],
      available: true,
      focusable: true,
      focusWeight: 58,
    }),
    makeRelation({
      name: '邱雯',
      icon: '💉',
      section: '事业暗线',
      relation: d.邱雯?.关系阶段 ?? '',
      status: d.邱雯?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.邱雯?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '关心', val: d.邱雯?.关心指数 ?? 0, cls: 'bar-green' },
      ],
      available: true,
      focusable: true,
      focusWeight: 54,
    }),
    makeRelation({
      name: '钟神秀',
      icon: '🗡️',
      section: '家人与盟友',
      relation: d.钟神秀?.行踪状态 ?? '',
      status: d.钟神秀?.当前状态 ?? '',
      bars: [
        { label: '亲密', val: d.钟神秀?.亲密度 ?? 0, cls: 'bar-purple' },
        { label: '保护', val: d.钟神秀?.保护欲 ?? 0, cls: 'bar-red' },
      ],
      available: true,
      focusable: false,
      focusWeight: 88,
    }),
    makeRelation({
      name: '小月牙',
      icon: '🌙',
      section: '家人与盟友',
      relation: '',
      status: d.小月牙?.当前状态 ?? '',
      bars: [
        { label: '亲密', val: d.小月牙?.亲密度 ?? 0, cls: 'bar-gold' },
        { label: '依赖', val: d.小月牙?.依赖度 ?? 0, cls: 'bar-purple' },
      ],
      available: !isHiddenState(d.小月牙?.当前状态),
      focusable: true,
      focusWeight: 48,
    }),
    makeRelation({
      name: '岳彦昕',
      icon: '⚖️',
      section: '家人与盟友',
      relation: d.岳彦昕?.关系阶段 ?? '',
      status: d.岳彦昕?.当前状态 ?? '',
      bars: [
        { label: '好感', val: d.岳彦昕?.好感度 ?? 0, cls: 'bar-pink' },
        { label: '合作', val: d.岳彦昕?.合作度 ?? 0, cls: 'bar-cyan' },
      ],
      available: true,
      focusable: true,
      focusWeight: 56,
    }),
    makeRelation({
      name: '赵舒奕',
      icon: '📋',
      section: '家人与盟友',
      relation: '',
      status: d.赵舒奕?.当前状态 ?? '',
      bars: [
        { label: '信赖', val: d.赵舒奕?.信赖度 ?? 0, cls: 'bar-cyan' },
        { label: '默契', val: d.赵舒奕?.师徒默契 ?? 0, cls: 'bar-green' },
      ],
      available: true,
      focusable: true,
      focusWeight: 46,
    }),
  ].filter(item => item.available);
});

const focusCharacters = computed(() =>
  relationshipCards.value
    .filter(item => item.focusable && !isHiddenState(item.relation, item.status))
    .sort((lhs, rhs) => rhs.focusWeight - lhs.focusWeight)
    .slice(0, 4),
);

const relationshipSections = computed(() => {
  const groups = [
    '校园情线',
    '事业暗线',
    '家人与盟友',
  ].map(title => ({
    title,
    items: relationshipCards.value.filter(item => item.section === title),
  }));

  return groups.filter(group => group.items.length > 0);
});

const archiveCount = computed(() => relationshipSections.value.reduce((sum, section) => sum + section.items.length, 0));

const villainList = computed(() => {
  const d = data.value?.反派势力;
  if (!d) {
    return [];
  }

  const levelMap: Record<string, string> = {
    低: 'low',
    潜伏: 'mid',
    中: 'mid',
    高: 'high',
    极高: 'critical',
  };
  const weightMap: Record<string, number> = {
    低: 1,
    潜伏: 2,
    中: 3,
    高: 4,
    极高: 5,
  };

  return [
    { name: '林老', threat: d.林老?.威胁等级 ?? '低', status: d.林老?.当前状态 ?? '' },
    { name: '熊安杰', threat: d.熊安杰?.威胁等级 ?? '低', status: d.熊安杰?.当前状态 ?? '' },
    { name: '周文斌', threat: d.周文斌?.威胁等级 ?? '低', status: d.周文斌?.当前状态 ?? '' },
    { name: '智运集团', threat: d.智运集团?.威胁等级 ?? '低', status: d.智运集团?.当前状态 ?? '' },
    { name: '飞沃娱乐', threat: d.飞沃娱乐?.威胁等级 ?? '低', status: d.飞沃娱乐?.当前状态 ?? '' },
    { name: '马博飞', threat: d.马博飞?.威胁等级 ?? '低', status: d.马博飞?.当前状态 ?? '' },
  ]
    .map(item => ({
      ...item,
      level: levelMap[item.threat] ?? 'low',
      weight: weightMap[item.threat] ?? 1,
    }))
    .sort((lhs, rhs) => rhs.weight - lhs.weight);
});
</script>

<style lang="scss" scoped>
.bb-card {
  width: 100%;
  max-width: 720px;
  background: var(--bb-bg-deep);
  border: 1px solid var(--bb-border);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(249, 132, 38, 0.06);
  font-family: var(--font-main);
  color: var(--bb-text);
  font-size: 13px;
  line-height: 1.5;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.court-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--bb-orange), var(--bb-gold), var(--bb-orange), transparent);
  opacity: 0.8;
}

.world-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--bb-border);
  font-size: 12px;
}

.world-item {
  color: var(--bb-text-dim);
}

.world-item b {
  color: var(--bb-orange);
  font-weight: 600;
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(240px, 1fr);
  gap: 10px;
  padding: 12px 14px 14px;
  border-bottom: 1px solid var(--bb-border);
}

.hero-section,
.family-section,
.relation-card,
.archive-section,
.villain-card {
  background: var(--bb-bg-panel);
  border: 1px solid var(--bb-border);
  border-radius: 8px;
}

.hero-section,
.family-section {
  padding: 10px;
}

.hero-header,
.relation-head,
.villain-head,
.family-head,
.archive-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hero-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--bb-text-bright);
}

.hero-caption {
  font-size: 11px;
  color: var(--bb-text-dim);
}

.hero-tag,
.family-badge,
.relation-badge,
.panel-meta {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--bb-orange-dim);
  color: var(--bb-orange);
  white-space: nowrap;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.metric-card {
  min-width: 0;
  padding: 8px;
  border-radius: 8px;
  background: rgba(28, 35, 51, 0.9);
  border: 1px solid rgba(249, 132, 38, 0.08);
}

.metric-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  color: var(--bb-text-dim);
}

.metric-head strong,
.metric-text {
  color: var(--bb-text-bright);
  font-weight: 600;
}

.metric-label,
.section-mini-title {
  display: block;
  margin-bottom: 4px;
  color: var(--bb-text-dim);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.task-block {
  margin-top: 10px;
}

.task-list,
.family-list,
.archive-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-item,
.archive-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 8px;
  border-radius: 6px;
  background: rgba(13, 17, 23, 0.65);
}

.task-name,
.family-name,
.relation-name,
.archive-name,
.villain-name {
  color: var(--bb-text-bright);
  font-weight: 600;
}

.task-desc,
.family-sub,
.family-note,
.relation-status,
.archive-status,
.villain-status {
  font-size: 11px;
  color: var(--bb-text-dim);
}

.family-main,
.relation-stage,
.archive-stage {
  color: var(--bb-orange);
  font-size: 12px;
}

.family-card {
  padding: 8px;
  border-radius: 8px;
  background: rgba(13, 17, 23, 0.65);
}

.bar-track,
.mini-bar-wrap {
  width: 100%;
  height: 6px;
  background: #111827;
  border-radius: 999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.35s ease;
}

.bar-green {
  background: linear-gradient(90deg, #1a5c2e, var(--bb-green));
}

.bar-pink {
  background: linear-gradient(90deg, #7a2048, var(--bb-pink));
}

.bar-cyan {
  background: linear-gradient(90deg, #1a3a5c, var(--bb-cyan));
}

.bar-red {
  background: linear-gradient(90deg, #5c1a1a, var(--bb-red));
}

.bar-orange {
  background: linear-gradient(90deg, #5c3a1a, var(--bb-orange));
}

.bar-gold {
  background: linear-gradient(90deg, #5c4a00, var(--bb-gold));
}

.bar-purple {
  background: linear-gradient(90deg, #3a1a5c, var(--bb-purple));
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 14px;
  background: var(--bb-bg-panel);
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--bb-text-bright);
  border-top: 1px solid rgba(249, 132, 38, 0.04);
  border-bottom: 1px solid var(--bb-border);
}

.panel-header:hover {
  background: var(--bb-bg-card);
}

.panel-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle {
  font-size: 10px;
  color: var(--bb-text-dim);
}

.focus-grid,
.villain-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 14px 14px;
}

.archive-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 14px 14px;
}

.relation-card,
.archive-section,
.villain-card {
  padding: 9px;
}

.mini-bars {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 8px;
}

.mini-bar-row {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 26px;
  align-items: center;
  gap: 6px;
}

.mini-label,
.mini-val {
  font-size: 11px;
}

.mini-label {
  color: var(--bb-text-dim);
}

.mini-val {
  text-align: right;
  color: var(--bb-text-bright);
  font-family: var(--font-num);
}

.archive-title {
  margin-bottom: 8px;
  color: var(--bb-orange);
  font-size: 12px;
  font-weight: 700;
}

.villain-threat {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.threat-low {
  background: #1a2e1a;
  color: var(--bb-green);
}

.threat-mid {
  background: #2e2a1a;
  color: var(--bb-gold);
}

.threat-high {
  background: #2e1a1a;
  color: var(--bb-red);
}

.threat-critical {
  background: #3e0a0a;
  color: #ff7373;
}

.text-danger {
  color: var(--bb-red) !important;
}

@media (max-width: 720px) {
  .hero-layout,
  .focus-grid,
  .archive-grid,
  .villain-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .hero-metrics {
    grid-template-columns: 1fr;
  }

  .world-bar {
    gap: 8px;
  }
}
</style>
