<template>
  <div class="card">
    <WorldHeader />
    <div class="content-area">
      <CharacterPanel />
      <hr class="panel-divider" />
      <RivalPanel />
      <hr class="panel-divider" />
      <UserPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterPanel from './components/CharacterPanel.vue';
import RivalPanel from './components/RivalPanel.vue';
import UserPanel from './components/UserPanel.vue';
import WorldHeader from './components/WorldHeader.vue';
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  font-family: var(--font-main);
  color: var(--c-text-primary);
  font-size: 13px;
  line-height: 1.4;
  margin: 8px auto;
  overflow: hidden;
}

.content-area {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.panel-divider {
  border: none;
  border-top: 1px dashed var(--c-border);
  margin: 8px 0;
}
</style>
