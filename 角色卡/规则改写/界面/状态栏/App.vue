<template>
  <div class="rewrite-shell">
    <div class="scanline"></div>
    <div class="noise"></div>

    <SystemHeader :stage="status.stage" :risk="status.risk" />

    <section class="meta-strip">
      <div class="meta-card">
        <span class="meta-label">TIME</span>
        <span class="meta-value">{{ status.time }}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">LOCATION</span>
        <span class="meta-value">{{ status.location }}</span>
      </div>
      <div class="meta-card">
        <span class="meta-label">ACTIVE RULES</span>
        <span class="meta-value">{{ status.rules.length }}</span>
      </div>
    </section>

    <section class="content-grid">
      <TargetPanel :target="status.target" :identity="status.identity" :stage="status.stage" :risk="status.risk" />
      <MonitorPanel
        :rules="status.rules"
        :cognition="status.cognition"
        :body="status.body"
        :social="status.social"
        :next="status.next"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import MonitorPanel from './components/MonitorPanel.vue';
import SystemHeader from './components/SystemHeader.vue';
import TargetPanel from './components/TargetPanel.vue';

defineProps<{
  status: {
    time: string;
    location: string;
    target: string;
    identity: string;
    stage: string;
    rules: string[];
    cognition: string;
    body: string;
    social: string;
    risk: string;
    next: string;
  };
}>();
</script>

<style lang="scss" scoped>
.rewrite-shell {
  position: relative;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid var(--rr-line);
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(216, 176, 88, 0.22), transparent 26%),
    radial-gradient(circle at bottom left, rgba(123, 216, 230, 0.16), transparent 30%),
    linear-gradient(180deg, rgba(7, 9, 13, 0.98), rgba(11, 15, 20, 0.96));
  box-shadow: var(--rr-shadow);
}

.rewrite-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 28px;
  padding: 1px;
  background: linear-gradient(130deg, rgba(216, 176, 88, 0.32), rgba(123, 216, 230, 0.16), rgba(217, 72, 95, 0.28));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.scanline,
.noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.scanline {
  background: repeating-linear-gradient(
    180deg,
    transparent 0,
    transparent 3px,
    rgba(123, 216, 230, 0.028) 3px,
    rgba(123, 216, 230, 0.028) 4px
  );
  opacity: 0.9;
}

.noise {
  background:
    linear-gradient(90deg, transparent 0, rgba(255, 255, 255, 0.025) 50%, transparent 100%),
    radial-gradient(circle at 20% 20%, rgba(217, 72, 95, 0.08), transparent 22%);
  mix-blend-mode: screen;
  opacity: 0.7;
}

.meta-strip {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 0 18px 18px;
}

.meta-card {
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(123, 216, 230, 0.12);
  background: linear-gradient(180deg, rgba(21, 28, 38, 0.92), rgba(13, 18, 25, 0.9));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.meta-label {
  display: block;
  color: var(--rr-text-faint);
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  letter-spacing: 2px;
}

.meta-value {
  display: block;
  margin-top: 8px;
  color: var(--rr-text);
  font-size: 14px;
  line-height: 1.5;
}

.content-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
  gap: 16px;
  padding: 0 18px 18px;
}

@media (max-width: 760px) {
  .meta-strip {
    grid-template-columns: 1fr;
    padding: 0 14px 14px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    padding: 0 14px 14px;
  }
}
</style>
