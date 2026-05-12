<template>
  <header class="header-shell">
    <div>
      <div class="eyebrow">双路线催眠博弈</div>
      <div class="title-row">
        <h1>催眠态势仪</h1>
        <span class="route-tag" :class="routeClass">{{ route }}</span>
      </div>
      <p class="caption">当前主控为 {{ controller }}，终局倾向为 {{ ending }}。</p>
    </div>
    <div class="ending-panel">
      <div class="ending-label">当前阶段</div>
      <div class="ending-value">{{ stage }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  route: string;
  controller: string;
  stage: string;
  ending: string;
}>();

const routeClass = computed(() => (props.route.includes('催眠者') ? 'is-controller' : 'is-cousin'));
</script>

<style scoped>
.header-shell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}

.eyebrow {
  color: var(--hyp-faint);
  letter-spacing: 0.32em;
  font-size: 11px;
  text-transform: uppercase;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

h1 {
  margin: 0;
  font-size: 30px;
  color: var(--hyp-text);
  letter-spacing: 0.08em;
}

.route-tag {
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  letter-spacing: 0.12em;
}

.route-tag.is-cousin {
  background: rgba(56, 102, 162, 0.22);
  color: #b7d6ff;
}

.route-tag.is-controller {
  background: rgba(137, 30, 57, 0.26);
  color: #ffd0d7;
}

.caption {
  margin: 10px 0 0;
  color: var(--hyp-soft);
}

.ending-panel {
  min-width: 156px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  border: 1px solid rgba(231, 198, 145, 0.16);
}

.ending-label {
  color: var(--hyp-faint);
  font-size: 12px;
  letter-spacing: 0.2em;
}

.ending-value {
  margin-top: 8px;
  font-size: 20px;
  color: var(--hyp-gold);
}

@media (max-width: 720px) {
  .header-shell {
    flex-direction: column;
    align-items: flex-start;
  }

  .ending-panel {
    width: 100%;
  }
}
</style>
