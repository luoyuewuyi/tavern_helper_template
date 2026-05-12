<template>
  <div class="card">
    <div class="header">
      <div class="title">🏮 解语花 · 九门风云 🏮</div>
      <div class="subtitle">— 粉衫执念 · 戏里戏外 —</div>
    </div>

    <WorldInfo />

    <FavorBar />

    <HeartVoice />

    <details class="people-section">
      <summary class="people-header">
        <span>👥</span>
        <span class="people-title">当前场景人物</span>
        <span class="arrow">▼</span>
      </summary>
      <div class="people-content">
        <span v-for="(person, i) in store.data.世界.在场人物" :key="i" class="person-tag">
          {{ person }}
        </span>
        <span v-if="!store.data.世界.在场人物?.length" class="person-tag empty">暂无</span>
      </div>
    </details>

    <div class="footer">
      <span>═══ 🏮 解语花枝娇朵朵 🏮 ═══</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import FavorBar from './components/FavorBar.vue';
import HeartVoice from './components/HeartVoice.vue';
import WorldInfo from './components/WorldInfo.vue';
import { useDataStore } from './store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-parchment);
  border: 2px solid var(--c-ash-gold);
  display: flex;
  flex-direction: column;
  font-family: var(--font-ancient);
  color: var(--c-ink);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
}

.header {
  text-align: center;
  padding: 14px 10px 10px;
  border-bottom: 1px solid rgba(160, 144, 112, 0.3);
  background: linear-gradient(180deg, rgba(200, 168, 130, 0.08) 0%, transparent 100%);
}

.title {
  font-size: 1.3em;
  font-weight: bold;
  color: var(--c-gold);
  letter-spacing: 4px;
}

.subtitle {
  color: var(--c-grey-ink);
  font-size: 0.78em;
  margin-top: 3px;
}

.people-section {
  margin: 0 12px 8px;
  border: 1px solid rgba(120, 140, 160, 0.25);
  border-radius: 6px;
  background: rgba(120, 140, 160, 0.04);
}

.people-header {
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  color: var(--c-grey-ink);
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  font-size: 0.9em;
}

.people-title {
  flex: 1;
}

.arrow {
  font-size: 0.75em;
  color: var(--c-ash-gold);
}

.people-content {
  padding: 0 12px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.person-tag {
  background: rgba(200, 168, 130, 0.12);
  border: 1px solid rgba(200, 168, 130, 0.3);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.82em;
  color: var(--c-ink);
}

.person-tag.empty {
  color: var(--c-ash-gold);
  font-style: italic;
}

.footer {
  text-align: center;
  padding: 8px;
  border-top: 1px solid rgba(160, 144, 112, 0.2);
  color: var(--c-ash-gold);
  font-size: 0.72em;
  letter-spacing: 2px;
}
</style>
