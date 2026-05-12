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

    <section class="hero-section">
      <div class="hero-header">
        <div>
          <div class="hero-name">{{ currentRoleName }}</div>
          <div class="hero-caption">{{ currentRoleSummary }}</div>
        </div>
        <span class="hero-tag">{{ currentRoleTag }}</span>
      </div>

      <div class="simple-grid">
        <div class="info-card">
          <span class="metric-label">姓名</span>
          <strong class="metric-text">{{ currentRoleName }}</strong>
        </div>

        <div class="info-card">
          <span class="metric-label">性别</span>
          <strong class="metric-text">{{ data?.当前角色?.性别 || '未知' }}</strong>
        </div>

        <div class="info-card info-card-wide">
          <span class="metric-label">服饰</span>
          <strong class="metric-text">{{ data?.当前角色?.服饰 || '未知' }}</strong>
        </div>

        <div class="info-card info-card-wide">
          <span class="metric-label">身材</span>
          <strong class="metric-text">{{ data?.当前角色?.身材 || '未知' }}</strong>
        </div>
      </div>

      <div class="task-block" v-if="currentTasks.length">
        <div class="section-mini-title">当前事务</div>
        <div class="task-list">
          <div v-for="task in currentTasks" :key="task.name" class="task-item">
            <span class="task-name">{{ task.name }}</span>
            <span class="task-desc">{{ task.desc }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="panel-header" @click="showCharacters = !showCharacters">
      <span>👥 出场角色</span>
      <div class="panel-right">
        <span class="panel-meta">{{ visibleCharacters.length }}人</span>
        <span class="toggle">{{ showCharacters ? '▲' : '▼' }}</span>
      </div>
    </div>
    <div v-if="showCharacters" class="characters-grid">
      <div v-for="char in visibleCharacters" :key="char.name" class="character-card">
        <div class="character-head">
          <span class="character-name">{{ char.icon }} {{ char.name }}</span>
          <span class="character-tag">{{ char.section }}</span>
        </div>
        <div class="character-relation">{{ char.relation || '关系待展开' }}</div>
        <div class="character-status">{{ char.status }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

type RelationItem = {
  name: string;
  icon: string;
  section: string;
  relation: string;
  status: string;
  available: boolean;
};

const store = useDataStore();
const data = computed(() => store.data);
const showCharacters = useLocalStorage('bb_status:showCharacters', true);

const hiddenTags = ['尚未相识', '尚未出场', '陌生人'];

function isHiddenState(...values: Array<string | undefined>) {
  return values.some(value => hiddenTags.includes(value ?? ''));
}

function extractCurrentRoleName() {
  const userName = substitudeMacros('{{user}}')?.trim();
  if (userName) {
    return userName;
  }

  const messageId = getCurrentMessageId();
  const chatMessage = getChatMessages(messageId)?.[0]?.message ?? '';
  const customName = chatMessage.match(/姓名[:：]\s*([^\n]+)/)?.[1]?.trim();
  return customName || '当前角色';
}

const currentRoleName = computed(() => extractCurrentRoleName());

const currentRoleSummary = computed(() => data.value?.当前角色?.当前状态 || '当前视角角色');

const currentRoleTag = computed(() => '当前视角');

const currentTasks = computed(() =>
  Object.entries(data.value?.当前角色?.当前事务 ?? data.value?.钟致远?.当前事务 ?? {})
    .slice(0, 3)
    .map(([name, desc]) => ({ name, desc })),
);

const relationshipCards = computed<RelationItem[]>(() => {
  const d = data.value;
  if (!d) {
    return [];
  }

  return [
    {
      name: '林晓雨',
      icon: '🌸',
      section: '校园情线',
      relation: d.林晓雨?.关系阶段 ?? '',
      status: d.林晓雨?.当前状态 ?? '',
      available: true,
    },
    {
      name: '张萱',
      icon: '🔥',
      section: '校园情线',
      relation: d.张萱?.关系阶段 ?? '',
      status: d.张萱?.当前状态 ?? '',
      available: true,
    },
    {
      name: '温雪',
      icon: '❄️',
      section: '校园情线',
      relation: d.温雪?.关系阶段 ?? '',
      status: d.温雪?.当前状态 ?? '',
      available: true,
    },
    {
      name: '孔方颐',
      icon: '🎀',
      section: '校园情线',
      relation: d.孔方颐?.关系阶段 ?? '',
      status: d.孔方颐?.当前状态 ?? '',
      available: true,
    },
    {
      name: '颜妙旖',
      icon: '👑',
      section: '外部角色',
      relation: d.颜妙旖?.关系阶段 ?? '',
      status: d.颜妙旖?.当前状态 ?? '',
      available: true,
    },
    {
      name: '慕容琴',
      icon: '🌟',
      section: '外部角色',
      relation: d.慕容琴?.关系阶段 ?? '',
      status: d.慕容琴?.当前状态 ?? '',
      available: !isHiddenState(d.慕容琴?.关系阶段, d.慕容琴?.当前状态),
    },
    {
      name: '白露',
      icon: '📖',
      section: '外部角色',
      relation: d.白露?.关系阶段 ?? '',
      status: d.白露?.当前状态 ?? '',
      available: true,
    },
    {
      name: '邱雯',
      icon: '💉',
      section: '外部角色',
      relation: d.邱雯?.关系阶段 ?? '',
      status: d.邱雯?.当前状态 ?? '',
      available: true,
    },
    {
      name: '小月牙',
      icon: '🌙',
      section: '其他角色',
      relation: '',
      status: d.小月牙?.当前状态 ?? '',
      available: !isHiddenState(d.小月牙?.当前状态),
    },
    {
      name: '岳彦昕',
      icon: '⚖️',
      section: '其他角色',
      relation: d.岳彦昕?.关系阶段 ?? '',
      status: d.岳彦昕?.当前状态 ?? '',
      available: true,
    },
    {
      name: '赵舒奕',
      icon: '📋',
      section: '其他角色',
      relation: '',
      status: d.赵舒奕?.当前状态 ?? '',
      available: true,
    },
  ].filter(item => item.available);
});

const visibleCharacters = computed(() =>
  relationshipCards.value
    .filter(item => !isHiddenState(item.relation, item.status))
    .slice(0, 6),
);
</script>

<style lang="scss" scoped>
.bb-card {
  width: 100%;
  max-width: 640px;
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

.hero-section,
.character-card {
  background: var(--bb-bg-panel);
  border: 1px solid var(--bb-border);
  border-radius: 8px;
}

.hero-section {
  margin: 12px 14px;
  padding: 10px;
}

.hero-header,
.character-head {
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
.character-tag,
.panel-meta {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--bb-orange-dim);
  color: var(--bb-orange);
  white-space: nowrap;
}

.simple-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.info-card {
  min-width: 0;
  padding: 8px;
  border-radius: 8px;
  background: rgba(28, 35, 51, 0.9);
  border: 1px solid rgba(249, 132, 38, 0.08);
}

.info-card-wide {
  grid-column: span 2;
}

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

.task-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 8px;
  border-radius: 6px;
  background: rgba(13, 17, 23, 0.65);
}

.task-name,
.character-name {
  color: var(--bb-text-bright);
  font-weight: 600;
}

.task-desc,
.character-status {
  font-size: 11px;
  color: var(--bb-text-dim);
}

.character-relation {
  color: var(--bb-orange);
  font-size: 12px;
  margin-top: 6px;
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

.characters-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 14px 14px;
}

.character-card {
  padding: 9px;
}

@media (max-width: 720px) {
  .characters-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .simple-grid {
    grid-template-columns: 1fr;
  }

  .info-card-wide {
    grid-column: span 1;
  }

  .world-bar {
    gap: 8px;
  }
}
</style>
