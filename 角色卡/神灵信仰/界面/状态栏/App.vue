<template>
  <div v-if="store.data.开局设置.已完成创建" class="shell">
    <header class="hero">
      <div class="hero-main">
        <div class="eyebrow">DIVINE ORDER / HIDDEN CORRUPTION</div>
        <h1>神灵信仰状态栏</h1>
        <p>{{ store.data.世界.当前焦点事件 }}</p>
      </div>
      <div class="hero-side">
        <div class="spot">{{ store.data.世界.当前日期 }}</div>
        <div class="spot">{{ store.data.世界.当前时段 }}</div>
        <div class="spot">{{ store.data.世界.当前地点 }}</div>
      </div>
    </header>

    <section class="world-grid">
      <article class="metric-card">
        <span class="metric-label">外交热度</span>
        <strong>{{ store.data.世界.外交热度 }}</strong>
        <div class="meter"><div class="fill gold" :style="{ width: store.data.世界.外交热度 + '%' }"></div></div>
      </article>
      <article class="metric-card">
        <span class="metric-label">宗司局警戒</span>
        <strong>{{ store.data.世界.宗司局警戒 }}</strong>
        <div class="meter"><div class="fill blue" :style="{ width: store.data.世界.宗司局警戒 + '%' }"></div></div>
      </article>
      <article class="metric-card danger">
        <span class="metric-label">邪神渗透度</span>
        <strong>{{ store.data.世界.邪神渗透度 }}</strong>
        <div class="meter"><div class="fill red" :style="{ width: store.data.世界.邪神渗透度 + '%' }"></div></div>
      </article>
    </section>

    <section class="protagonist">
      <div class="section-title">
        <span>主角信息</span>
        <small>{{ store.data.当前焦点角色 }}</small>
      </div>
      <div class="protagonist-grid">
        <div class="info-block">
          <span class="label">姓名</span>
          <p>{{ store.data.主角.姓名 }}</p>
        </div>
        <div class="info-block">
          <span class="label">年龄</span>
          <p>{{ store.data.主角.年龄 }}</p>
        </div>
        <div class="info-block protagonist-full">
          <span class="label">身份</span>
          <p>{{ store.data.主角.身份 }}</p>
        </div>
        <div class="info-block">
          <span class="label">行事风格</span>
          <p>{{ store.data.主角.行事风格 }}</p>
        </div>
        <div class="info-block">
          <span class="label">初始信仰倾向</span>
          <p>{{ store.data.主角.初始信仰倾向 }}</p>
        </div>
      </div>
    </section>

    <section class="characters">
      <div class="section-title">
        <span>核心人物</span>
        <small>当前关系、阶段与风险</small>
      </div>
      <div class="tab-row">
        <button
          v-for="name in coreCharacters"
          :key="name"
          class="tab"
          :class="{ active: selected === name }"
          type="button"
          @click="selected = name"
        >
          {{ name }}
        </button>
      </div>

      <article v-if="current" class="character-card">
        <div class="card-top">
          <div>
            <div class="name-row">
              <h2>{{ selected }}</h2>
              <span class="stage">{{ current.$关系阶段 }}</span>
            </div>
            <div class="subline">
              <span>{{ current.阵营 }}</span>
              <span>{{ current.与主角关系 }}</span>
              <span>{{ current.登场状态 }}</span>
            </div>
          </div>
          <div class="badges">
            <span v-for="tag in current.$风险标签" :key="tag" class="badge">{{ tag }}</span>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <span class="label">关系值</span>
            <strong>{{ current.关系值 }}</strong>
            <div class="meter"><div class="fill gold" :style="{ width: current.关系值 + '%' }"></div></div>
          </div>
          <div class="stat-box">
            <span class="label">欲望失衡</span>
            <strong>{{ current.欲望失衡度 }}</strong>
            <div class="meter"><div class="fill red" :style="{ width: current.欲望失衡度 + '%' }"></div></div>
          </div>
          <div class="stat-box">
            <span class="label">宗司局关注</span>
            <strong>{{ current.宗司局关注度 }}</strong>
            <div class="meter"><div class="fill blue" :style="{ width: current.宗司局关注度 + '%' }"></div></div>
          </div>
        </div>

        <div class="detail-grid">
          <div class="info-block">
            <span class="label">信仰倾向</span>
            <p>{{ current.信仰倾向 }}</p>
          </div>
          <div class="info-block">
            <span class="label">当前立场</span>
            <p>{{ current.当前立场 }}</p>
          </div>
          <div class="info-block">
            <span class="label">当前行动</span>
            <p>{{ current.当前行动 }}</p>
          </div>
          <div class="info-block">
            <span class="label">公开态度</span>
            <p>{{ current.公开态度 }}</p>
          </div>
        </div>

        <div class="thoughts">
          <div class="thought">
            <span class="label">私下想法</span>
            <p>{{ current.私下想法 }}</p>
          </div>
          <div class="thought">
            <span class="label">关键事件</span>
            <ul>
              <li v-for="[key, value] in Object.entries(current.关键事件)" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </div>
        </div>
      </article>
    </section>

    <details class="outer-box">
      <summary>外围人物</summary>
      <div class="outer-grid">
        <article v-for="name in outerCharacters" :key="name" class="outer-card">
          <div class="outer-head">
            <strong>{{ name }}</strong>
            <span>{{ getCharacter(name).$关系阶段 }}</span>
          </div>
          <p>{{ getCharacter(name).当前行动 }}</p>
          <div class="outer-tags">
            <span>{{ getCharacter(name).信仰倾向 }}</span>
            <span>{{ getCharacter(name).当前立场 }}</span>
          </div>
        </article>
      </div>
    </details>

    <section class="events">
      <div class="section-title">
        <span>事件池</span>
        <small>主线与支线风险</small>
      </div>
      <div class="event-grid">
        <article v-for="[name, event] in Object.entries(store.data.事件池)" :key="name" class="event-card">
          <div class="event-head">
            <strong>{{ name }}</strong>
            <span>{{ event.当前状态 }}</span>
          </div>
          <div class="duo">
            <div>
              <span class="label">危险度</span><strong>{{ event.危险度 }}</strong>
            </div>
            <div>
              <span class="label">推进度</span><strong>{{ event.推进度 }}</strong>
            </div>
          </div>
          <div class="meter"><div class="fill red" :style="{ width: event.危险度 + '%' }"></div></div>
          <p>{{ event.备注 }}</p>
          <div class="involved">
            <span v-for="person in event.牵涉人物" :key="person">{{ person }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const characterKeys = [
  '张建珍',
  '王群荣',
  '张素菲',
  '张宇',
  '张哲恺',
  '诺姆',
  '宋野',
  '许廷',
  '孙彪',
  '马会三',
] as const;

const getCharacter = (name: (typeof characterKeys)[number]) => store.data.角色池[name];
const allCharacters = computed(() => [...characterKeys]);
const coreCharacters = computed(() => allCharacters.value.filter(name => getCharacter(name).角色分组 !== '外围人物'));
const outerCharacters = computed(() => allCharacters.value.filter(name => getCharacter(name).角色分组 === '外围人物'));
const selected = ref(store.data.当前焦点角色 || coreCharacters.value[0] || '张建珍');

watch(coreCharacters, names => {
  if (names.length > 0 && !names.includes(selected.value as (typeof characterKeys)[number])) selected.value = names[0];
});

const current = computed(() => {
  if (!characterKeys.includes(selected.value as (typeof characterKeys)[number])) return null;
  return getCharacter(selected.value as (typeof characterKeys)[number]);
});
</script>

<style lang="scss" scoped>
.shell {
  --bg: linear-gradient(180deg, rgba(16, 21, 34, 0.96), rgba(11, 10, 17, 0.98));
  --panel: rgba(255, 255, 255, 0.05);
  --line: rgba(230, 197, 123, 0.24);
  --gold: #e6c57b;
  --pale: #efe2bf;
  --text: #f5efe3;
  --text-soft: #bfb7aa;
  width: 100%;
  max-width: 780px;
  margin: 8px auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: var(--text);
  background:
    radial-gradient(circle at top right, rgba(182, 69, 69, 0.16), transparent 28%),
    radial-gradient(circle at top left, rgba(230, 197, 123, 0.18), transparent 24%), var(--bg);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  font-family: Georgia, 'Times New Roman', serif;
}

.hero,
.section-title,
.card-top,
.name-row,
.outer-head,
.event-head,
.duo {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.hero {
  padding: 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(182, 69, 69, 0.08));
  border: 1px solid var(--line);
  border-radius: 14px;
}

.hero-main h1 {
  margin: 4px 0 6px;
  font-size: 24px;
  letter-spacing: 0.04em;
}

.hero-main p,
.info-block p,
.thought p,
.event-card p,
.outer-card p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.55;
}

.eyebrow {
  font-size: 10px;
  letter-spacing: 0.28em;
  color: var(--gold);
}

.hero-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.spot,
.badge,
.outer-tags span,
.involved span {
  padding: 4px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  font-size: 11px;
}

.world-grid,
.event-grid,
.protagonist-grid,
.detail-grid,
.outer-grid,
.stats-grid,
.thoughts {
  display: grid;
  gap: 10px;
}

.world-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.protagonist-grid,
.detail-grid,
.event-grid,
.outer-grid,
.thoughts {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stats-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metric-card,
.info-block,
.character-card,
.event-card,
.outer-card,
.stat-box,
.outer-box {
  background: var(--panel);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
}

.metric-card,
.info-block,
.event-card,
.outer-card,
.stat-box,
.outer-box,
.character-card,
.thought {
  padding: 12px;
}

.metric-card strong,
.stat-box strong,
.duo strong {
  font-size: 22px;
  color: var(--pale);
}

.danger strong {
  color: #ffb2b2;
}

.metric-label,
.label,
.section-title small,
.subline {
  font-size: 11px;
  color: var(--text-soft);
}

.meter {
  height: 6px;
  border-radius: 999px;
  margin-top: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.fill {
  height: 100%;
  border-radius: inherit;
}

.gold {
  background: linear-gradient(90deg, #8a6832, #e6c57b);
}

.blue {
  background: linear-gradient(90deg, #304966, #6d8db6);
}

.red {
  background: linear-gradient(90deg, #5e1b1b, #c96262);
}

.section-title {
  margin-bottom: 10px;
}

.section-title span {
  font-size: 16px;
  color: var(--gold);
}

.tab-row,
.subline,
.badges,
.outer-tags,
.involved {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-soft);
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
}

.tab.active {
  background: linear-gradient(135deg, rgba(230, 197, 123, 0.22), rgba(182, 69, 69, 0.24));
  color: var(--text);
  border-color: var(--line);
}

.name-row h2 {
  margin: 0;
  font-size: 24px;
}

.stage {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(230, 197, 123, 0.12);
  border: 1px solid rgba(230, 197, 123, 0.22);
  font-size: 12px;
}

.outer-box summary {
  cursor: pointer;
  color: var(--gold);
}

.thought ul {
  margin: 8px 0 0;
  padding-left: 18px;
  color: var(--text-soft);
}

.protagonist-full {
  grid-column: 1 / -1;
}

@media (max-width: 640px) {
  .hero,
  .card-top {
    flex-direction: column;
  }

  .hero-side {
    align-items: flex-start;
  }

  .world-grid,
  .protagonist-grid,
  .detail-grid,
  .event-grid,
  .outer-grid,
  .thoughts,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
