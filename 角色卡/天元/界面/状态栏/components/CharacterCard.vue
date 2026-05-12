<template>
  <article class="character-card">
    <div class="card-head">
      <div>
        <div class="name">{{ character.name }}</div>
        <div class="role">{{ character.role }}</div>
      </div>
      <div class="meta-tags">
        <span>{{ character.gender }}</span>
        <span>{{ character.age }}</span>
      </div>
    </div>

    <div class="state-row">
      <span class="state-label">外相</span>
      <span class="state-value">{{ character.state }}</span>
    </div>

    <div class="voice-panel">
      <div class="voice-mark">念</div>
      <p>{{ character.innerVoice }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  character: {
    name: string;
    gender: string;
    age: string;
    role: string;
    state: string;
    innerVoice: string;
  };
}>();
</script>

<style lang="scss" scoped>
.character-card {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(214, 181, 117, 0.14);
  background:
    radial-gradient(circle at top right, rgba(214, 181, 117, 0.08), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.038), rgba(255, 255, 255, 0.015)),
    var(--ty-card);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.character-card:hover {
  transform: translateY(-2px);
  border-color: rgba(214, 181, 117, 0.28);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.name {
  font-size: 18px;
  color: #f7e8c4;
  letter-spacing: 2px;
}

.role {
  margin-top: 4px;
  font-size: 12px;
  color: var(--ty-text-faint);
}

.meta-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}

.meta-tags span {
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--ty-accent-soft);
  color: var(--ty-text-soft);
  font-size: 11px;
}

.state-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
}

.state-label {
  flex: 0 0 auto;
  color: var(--ty-accent);
  font-size: 12px;
  letter-spacing: 2px;
}

.state-value {
  color: var(--ty-text-soft);
  font-size: 13px;
}

.voice-panel {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(214, 181, 117, 0.18);
}

.voice-mark {
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(131, 171, 176, 0.14);
  color: var(--ty-cyan);
  font-size: 12px;
}

.voice-panel p {
  margin: 0;
  color: var(--ty-text-soft);
  font-size: 13px;
  line-height: 1.78;
  font-style: italic;
}
</style>
