<template>
  <section class="yuki-status-card" style="--favor: $5; --trust: $6">
    <div class="status-aura"></div>

    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">TOKYO HOME LOG</p>
        <h1 class="title">Yuki · 同居日常状态栏</h1>
        <p class="subtitle">温柔、黏人、安静依恋的此刻切片</p>
      </div>
      <div class="hero-seal">
        <span class="seal-label">情绪</span>
        <span class="seal-value">$4</span>
      </div>
    </header>

    <section class="top-grid">
      <article class="info-card time-card">
        <span class="card-label">时间</span>
        <strong class="card-main">$1</strong>
      </article>
      <article class="info-card location-card">
        <span class="card-label">地点</span>
        <strong class="card-main">$2</strong>
      </article>
      <article class="info-card weather-card">
        <span class="card-label">天气</span>
        <strong class="card-main">$3</strong>
      </article>
    </section>

    <section class="middle-grid">
      <article class="panel status-panel">
        <div class="panel-head">
          <span class="panel-kicker">身体状态</span>
          <span class="state-pill">$7</span>
        </div>
        <p class="panel-title">此刻身体反馈</p>
        <p class="panel-text">$8</p>
      </article>

      <article class="panel mood-panel">
        <div class="panel-head">
          <span class="panel-kicker">关系温度</span>
          <span class="mood-mark">心绪稳定</span>
        </div>
        <p class="panel-title">她现在的情绪底色</p>
        <p class="panel-text">$4</p>
      </article>
    </section>

    <section class="bars">
      <article class="bar-card">
        <div class="bar-meta">
          <span class="bar-label">好感度</span>
          <span class="bar-value">$5 / 1000</span>
        </div>
        <div class="bar-track favor-track">
          <span class="bar-fill favor-fill"></span>
        </div>
      </article>

      <article class="bar-card">
        <div class="bar-meta">
          <span class="bar-label">信任度</span>
          <span class="bar-value">$6 / 1000</span>
        </div>
        <div class="bar-track trust-track">
          <span class="bar-fill trust-fill"></span>
        </div>
      </article>
    </section>

    <footer class="footer-note">
      <span class="note-dot"></span>
      <span>身体说明与关系数值来自当前剧情上下文的即时状态推断</span>
    </footer>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.yuki-status-card {
  position: relative;
  width: min(100%, 760px);
  margin: 0 auto;
  padding: 18px;
  border-radius: 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.92), rgba(255, 250, 246, 0.94) 44%, rgba(250, 240, 244, 0.98) 100%);
  border: 1px solid var(--yuki-line);
  box-shadow:
    0 18px 40px var(--yuki-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.status-aura {
  position: absolute;
  inset: auto -40px -90px auto;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(212, 135, 152, 0.24) 0%, rgba(212, 135, 152, 0.08) 40%, rgba(212, 135, 152, 0) 72%);
  pointer-events: none;
}

.hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding-bottom: 16px;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.36em;
  color: var(--yuki-ink-soft);
}

.title {
  font-size: clamp(22px, 4vw, 30px);
  line-height: 1.08;
  color: var(--yuki-rose-deep);
  font-weight: 700;
}

.subtitle {
  font-size: 13px;
  color: var(--yuki-ink-soft);
}

.hero-seal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 10px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(212, 135, 152, 0.24);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.seal-label {
  font-size: 11px;
  color: var(--yuki-ink-soft);
  letter-spacing: 0.12em;
}

.seal-value {
  font-size: 15px;
  color: var(--yuki-rose-deep);
  font-weight: 700;
}

.top-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.info-card,
.panel,
.bar-card {
  position: relative;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(255, 250, 246, 0.94));
  border: 1px solid var(--yuki-line);
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 8px 18px rgba(186, 143, 157, 0.08);
}

.info-card {
  min-height: 98px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.time-card {
  background:
    linear-gradient(160deg, rgba(255, 248, 244, 0.96), rgba(250, 238, 241, 0.92));
}

.location-card {
  background:
    linear-gradient(160deg, rgba(255, 251, 248, 0.96), rgba(243, 237, 247, 0.92));
}

.weather-card {
  background:
    linear-gradient(160deg, rgba(255, 252, 249, 0.96), rgba(237, 244, 250, 0.94));
}

.card-label,
.panel-kicker {
  font-size: 11px;
  color: var(--yuki-ink-soft);
  letter-spacing: 0.16em;
}

.card-main {
  font-size: 16px;
  line-height: 1.35;
  color: var(--yuki-ink);
  font-weight: 700;
}

.middle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.panel {
  min-height: 160px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.state-pill,
.mood-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.state-pill {
  background: rgba(138, 182, 154, 0.18);
  color: var(--yuki-good);
}

.mood-mark {
  background: rgba(201, 191, 216, 0.24);
  color: #776785;
}

.panel-title {
  font-size: 19px;
  line-height: 1.2;
  color: var(--yuki-rose-deep);
  font-weight: 700;
}

.panel-text {
  font-size: 14px;
  line-height: 1.72;
  color: var(--yuki-ink);
}

.bars {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.bar-card {
  padding: 14px 16px;
}

.bar-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.bar-label {
  font-size: 13px;
  color: var(--yuki-ink-soft);
  letter-spacing: 0.1em;
}

.bar-value {
  font-size: 15px;
  color: var(--yuki-ink);
  font-weight: 700;
}

.bar-track {
  position: relative;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(164, 126, 138, 0.2);
}

.bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.favor-fill {
  width: min(calc(var(--favor) * 0.1%), 100%);
  background: linear-gradient(90deg, #f6b0bb 0%, var(--yuki-favor) 45%, var(--yuki-rose-deep) 100%);
}

.trust-fill {
  width: min(calc(var(--trust) * 0.1%), 100%);
  background: linear-gradient(90deg, #d9e6f1 0%, var(--yuki-trust) 48%, #6f94bf 100%);
}

.footer-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: var(--yuki-ink-soft);
  font-size: 12px;
}

.note-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--yuki-rose) 0%, var(--yuki-lilac) 100%);
  flex-shrink: 0;
}

@media (max-width: 760px) {
  .top-grid,
  .middle-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .hero-seal {
    width: fit-content;
  }
}

@media (max-width: 520px) {
  .yuki-status-card {
    padding: 14px;
    border-radius: 22px;
  }

  .title {
    font-size: 24px;
  }

  .info-card {
    min-height: 86px;
  }

  .panel {
    min-height: unset;
  }

  .bar-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
