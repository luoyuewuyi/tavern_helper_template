<template>
  <div class="shell" :class="phase_class">
    <div class="mist"></div>
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">White Lamia Chronicle</p>
        <h1>白荔</h1>
        <p class="subtitle">{{ stage_title }}</p>
        <p class="quote">{{ opening_quote }}</p>
      </div>
      <div class="affection-card">
        <div class="affection-head">
          <span>好感度</span>
          <strong>{{ data.白荔.好感度 }}</strong>
        </div>
        <div class="meter">
          <div class="meter-fill" :style="{ width: affection_width }"></div>
        </div>
        <div class="affection-foot">
          <span>{{ data.白荔.$好感阶段 }}</span>
          <span>{{ data.白荔.当前状态 }}</span>
        </div>
      </div>
    </header>
    <section class="quick-grid">
      <article class="info-card">
        <span class="label">当前形态</span>
        <strong>{{ data.白荔.形态 }}</strong>
        <p>{{ form_hint }}</p>
      </article>
      <article class="info-card">
        <span class="label">时空感</span>
        <strong>{{ data.世界.时段 }} · {{ data.世界.季节 }}</strong>
        <p>{{ data.世界.地点 }}</p>
      </article>
      <article class="info-card">
        <span class="label">寻暖倾向</span>
        <strong>{{ warmth_hint }}</strong>
        <p>{{ data.白荔.亲密接触 }}</p>
      </article>
      <article class="info-card">
        <span class="label">蜕皮状态</span>
        <strong>{{ data.白荔.蜕皮阶段 }}</strong>
        <p>{{ molt_hint }}</p>
      </article>
    </section>
    <section class="panel-switch">
      <button
        v-for="panel in panels"
        :key="panel.id"
        type="button"
        class="panel-btn"
        :class="{ active: active_panel === panel.id }"
        @click="active_panel = panel.id"
      >
        {{ panel.label }}
      </button>
    </section>
    <section class="content-grid">
      <article class="main-panel">
        <template v-if="active_panel === 'bond'">
          <div class="section-title">相处脉搏</div>
          <div class="tag-row">
            <span class="tag">{{ data.白荔.当前情绪 }}</span>
            <span class="tag">{{ data.白荔.季节活性 }}</span>
            <span class="tag">称呼：{{ data.白荔.对user称呼 }}</span>
          </div>
          <p class="body-copy">{{ bond_hint }}</p>
          <div class="detail-box">
            <span class="detail-label">互动提示</span>
            <p>{{ interaction_tip }}</p>
          </div>
        </template>
        <template v-else-if="active_panel === 'habit'">
          <div class="section-title">蛇妖习性</div>
          <div class="habit-list">
            <div class="habit-item">
              <span>晨间</span>
              <p>{{ morning_hint }}</p>
            </div>
            <div class="habit-item">
              <span>正午</span>
              <p>{{ noon_hint }}</p>
            </div>
            <div class="habit-item">
              <span>夜晚</span>
              <p>{{ night_hint }}</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="section-title">收藏匣</div>
          <div v-if="collection_entries.length" class="collection-list">
            <div v-for="[name, item] in collection_entries" :key="name" class="collection-item">
              <div class="collection-head">
                <strong>{{ name }}</strong>
                <span>{{ item.来历 }}</span>
              </div>
              <p>{{ item.描述 }}</p>
            </div>
          </div>
          <div v-else class="empty-box">
            尚无新藏品。若你夸她的小宝贝好看，她的尾尖会记很久。
          </div>
        </template>
      </article>
      <aside class="side-panel">
        <div class="section-title">主题摘要</div>
        <div class="summary-line">
          <span>天气</span>
          <strong>{{ data.世界.天气 }}</strong>
        </div>
        <div class="summary-line">
          <span>主题气息</span>
          <strong>{{ theme_hint }}</strong>
        </div>
        <div class="summary-line">
          <span>尾巴信号</span>
          <strong>{{ tail_hint }}</strong>
        </div>
        <div class="summary-line">
          <span>状态判读</span>
          <strong>{{ state_hint }}</strong>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from './store';

const store = useDataStore();
const active_panel = useLocalStorage<'bond' | 'habit' | 'treasure'>('白荔:status-panel', 'bond');
const panels = [
  { id: 'bond', label: '相处' },
  { id: 'habit', label: '习性' },
  { id: 'treasure', label: '收藏' },
] as const;

const data = computed(() => store.data);
const affection_width = computed(() => `${data.value.白荔.好感度}%`);
const collection_entries = computed(() => _.entries(data.value.白荔.收藏));
const stage_title = computed(
  () => `${data.value.白荔.$好感阶段} · ${data.value.白荔.当前状态} · ${data.value.白荔.季节活性}`,
);
const phase_class = computed(() => {
  const stage = data.value.白荔.$好感阶段;
  if (stage === '疏冷观察') return 'phase-cold';
  if (stage === '藏尾试探') return 'phase-watch';
  if (stage === '软化靠近') return 'phase-soft';
  if (stage === '缠尾依恋') return 'phase-wrap';
  return 'phase-nest';
});
const opening_quote = computed(() => {
  const stage = data.value.白荔.$好感阶段;
  if (stage === '疏冷观察') return '她看你时仍似隔着一层水雾，冷淡里藏着衡量。';
  if (stage === '藏尾试探') return '她口中仍带几分矜冷，尾尖却已先一步替她迟疑。';
  if (stage === '软化靠近') return '她开始学着把想念说浅一点，把靠近留久一点。';
  if (stage === '缠尾依恋') return '她的尾巴比嘴更诚实，总爱在你身侧绕出一小圈。';
  return '她已把你当作暖巢，连沉默都愿意贴在你怀里消磨。';
});
const form_hint = computed(() => {
  const form = data.value.白荔.形态;
  if (form === '巨蛇') return '更适合打盹、游水或本能地盘起身子守着热源。';
  if (form === '拉弥亚') return '这是她最自在的相处形态，既方便靠近你，也方便用尾巴传递没说完的情绪。';
  return '人形不稳，情绪起伏大时最容易维持不住。';
});
const warmth_hint = computed(() => {
  const season = data.value.世界.季节;
  const time = data.value.世界.时段;
  if (season === '冬') return '极强，恨不得把你整个人卷进被窝';
  if (time === '晨间') return '明显，低体温让她格外会赖床';
  if (time === '深夜') return '上升，夜里她最爱往你怀里借热';
  return '适中，会挑着不经意的时候靠近';
});
const molt_hint = computed(() => {
  const molt = data.value.白荔.蜕皮阶段;
  if (molt === '蜕皮前') return '视力变差，懒得挪动，更不喜欢被频繁打扰。';
  if (molt === '蜕皮后敏感') return '碰触会被放大感知，语气也比平日更轻软一点。';
  return '鳞片与情绪都较稳定，适合平静相处。';
});
const bond_hint = computed(() => {
  const stage = data.value.白荔.$好感阶段;
  if (stage === '疏冷观察') return '她会先嗅、先看、先听你有没有恶意，必要时宁可先把你挡在安全距离外。';
  if (stage === '藏尾试探') return '她偶尔会故意吞吐信子吓你，想看你究竟是退，还是留下。';
  if (stage === '软化靠近') return '她开始默许你在她身边停留，甚至会为你留出尾巴盘踞的位置。';
  if (stage === '缠尾依恋') return '她已经习惯把亲近写进小动作里，表面仍装得不很在意。';
  return '她把你视作可靠热源与归处，哪怕只是并肩发呆也会很满足。';
});
const interaction_tip = computed(() => {
  const contact = data.value.白荔.亲密接触;
  if (contact === '不可触碰') return '先说话、别硬碰她，保持耐心比逞强更有用。';
  if (contact === '可近身') return '可以靠近她，但动作最好慢一些，让她有余裕分辨你的好意。';
  if (contact === '可牵手') return '轻牵、递热饮、夸她收藏，都会让她悄悄记住。';
  if (contact === '可依偎') return '她已经会自己把距离缩短，别拆穿她的小傲气。';
  return '此时最适合陪她取暖、抱住她的尾巴，或听她慢慢说心事。';
});
const morning_hint = computed(() => '清晨体温低、脑子转得慢，最容易被逗得耳尖发热。');
const noon_hint = computed(() => '正午最活跃，也最会反过来拿半真半假的话撩你。');
const night_hint = computed(() => '入睡前会格外渴望热源，冬夜里尤其容易贴人。');
const theme_hint = computed(() => {
  const season = data.value.世界.季节;
  if (season === '夏') return '潭水、暑热与活泼的恶作剧';
  if (season === '冬') return '冷鳞、被窝与无言的求暖';
  if (season === '春') return '春困、蜕皮与慢吞吞的靠近';
  return '水汽、落叶与安静盘绕的陪伴';
});
const tail_hint = computed(() => {
  const stage = data.value.白荔.$好感阶段;
  if (stage === '疏冷观察') return '尾尖僵直，更多是在戒备。';
  if (stage === '藏尾试探') return '尾尖会轻晃，说明她在偷看你的反应。';
  if (stage === '软化靠近') return '尾巴会自然贴近你的座位或脚边。';
  if (stage === '缠尾依恋') return '她常不自知地用尾巴圈住你的一角。';
  return '尾巴盘得很松，却迟迟不肯放开。';
});
const state_hint = computed(() => {
  const state = data.value.白荔.当前状态;
  if (state === '警惕') return '仍在判断你是否安全。';
  if (state === '试探') return '明面傲娇，暗里观察。';
  if (state === '依恋') return '已经会主动把你划进亲近范围。';
  if (state === '缠宠') return '会变着法子缠人，只是不肯先承认。';
  return '最想做的事只有贴着你睡。';
});
</script>

<style scoped lang="scss">
.shell {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 18px;
  border: 1px solid var(--line-strong);
  border-radius: 26px;
  background:
    radial-gradient(circle at top right, rgba(238, 139, 154, 0.12), transparent 34%),
    radial-gradient(circle at 15% 15%, rgba(141, 199, 217, 0.28), transparent 26%),
    linear-gradient(180deg, rgba(13, 20, 31, 0.96), rgba(19, 28, 42, 0.96));
  color: var(--ink-main);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  font-family: var(--font-body);
}
.shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.08), transparent 10%),
    radial-gradient(circle at 50% 16%, rgba(255, 255, 255, 0.05), transparent 7%),
    linear-gradient(120deg, transparent 0 25%, rgba(255, 255, 255, 0.04) 25% 27%, transparent 27% 52%, rgba(255, 255, 255, 0.03) 52% 54%, transparent 54% 100%);
  pointer-events: none;
}
.mist {
  position: absolute;
  inset: auto -10% -35% auto;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18), transparent 68%);
  filter: blur(10px);
  pointer-events: none;
}
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 16px;
  margin-bottom: 16px;
}
.hero-copy,
.affection-card,
.info-card,
.main-panel,
.side-panel {
  position: relative;
  z-index: 1;
  border: 1px solid var(--line-soft);
  background: var(--bg-soft);
  backdrop-filter: blur(6px);
}
.hero-copy {
  padding: 18px 18px 16px;
  border-radius: 22px;
}
.eyebrow {
  color: var(--accent-water);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-bottom: 8px;
}
.hero-copy h1 {
  font-family: var(--font-title);
  font-size: clamp(2rem, 5vw, 2.9rem);
  line-height: 1;
  margin-bottom: 8px;
}
.subtitle {
  color: var(--accent-gold);
  font-size: 0.95rem;
  margin-bottom: 12px;
}
.quote {
  color: var(--ink-soft);
  line-height: 1.7;
}
.affection-card {
  border-radius: 22px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}
.affection-head,
.affection-foot,
.summary-line,
.collection-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.affection-head strong {
  color: var(--accent-eye);
  font-size: 1.8rem;
  font-family: var(--font-title);
}
.meter {
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}
.meter-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-water), var(--accent-eye));
  box-shadow: 0 0 18px rgba(238, 139, 154, 0.45);
}
.affection-foot {
  color: var(--ink-soft);
  font-size: 0.86rem;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.info-card,
.main-panel,
.side-panel {
  border-radius: 18px;
}
.info-card {
  padding: 14px;
}
.label,
.detail-label {
  display: block;
  color: var(--ink-faint);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.info-card strong,
.summary-line strong {
  display: block;
  color: var(--accent-scale);
  margin-bottom: 5px;
}
.info-card p,
.body-copy,
.detail-box p,
.habit-item p,
.collection-item p {
  color: var(--ink-soft);
  line-height: 1.65;
}
.panel-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.panel-btn {
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--ink-soft);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}
.panel-btn.active {
  color: var(--bg-deep);
  background: linear-gradient(90deg, var(--accent-scale), var(--accent-water));
  border-color: transparent;
}
.panel-btn:hover {
  transform: translateY(-1px);
}
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  gap: 12px;
}
.main-panel,
.side-panel {
  padding: 16px;
}
.section-title {
  font-family: var(--font-title);
  font-size: 1.15rem;
  margin-bottom: 12px;
  color: var(--accent-scale);
}
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--accent-water);
  font-size: 0.82rem;
}
.detail-box,
.habit-item,
.collection-item,
.empty-box {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 14px;
}
.detail-box {
  margin-top: 12px;
  padding: 12px;
}
.habit-list,
.collection-list {
  display: grid;
  gap: 10px;
}
.habit-item,
.collection-item,
.empty-box {
  padding: 12px;
}
.habit-item span {
  display: inline-block;
  margin-bottom: 6px;
  color: var(--accent-gold);
}
.collection-head span {
  color: var(--ink-faint);
  font-size: 0.8rem;
}
.summary-line {
  padding: 10px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.09);
}
.summary-line:last-child {
  border-bottom: 0;
}
.phase-cold {
  --accent-water: #8ca4b7;
  --accent-eye: #d88492;
}
.phase-watch {
  --accent-water: #90c2d0;
  --accent-eye: #ea9198;
}
.phase-soft {
  --accent-water: #8fd3da;
  --accent-eye: #f1a3ae;
}
.phase-wrap {
  --accent-water: #9fdae2;
  --accent-eye: #f39ba6;
}
.phase-nest {
  --accent-water: #b3e0df;
  --accent-eye: #ffb0b4;
}
@media (max-width: 900px) {
  .quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .content-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .shell {
    padding: 14px;
    border-radius: 20px;
  }
  .hero {
    grid-template-columns: 1fr;
  }
  .quick-grid {
    grid-template-columns: 1fr;
  }
  .affection-head strong {
    font-size: 1.55rem;
  }
}
</style>
