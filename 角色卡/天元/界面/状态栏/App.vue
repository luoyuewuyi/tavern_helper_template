<template>
  <div class="status-shell">
    <div class="status-backdrop"></div>
    <div class="status-frame">
      <StatusHeader :title="status.title" />
      <StatusMeta :time="status.time" :location="status.location" :weather="status.weather" />

      <section class="main-grid">
        <ProtagonistPanel :protagonist="status.protagonist" />

        <section class="character-section">
          <div class="section-head">
            <div class="section-title">在场人物</div>
            <div class="section-subtitle">{{ status.characters.length }} 名命名角色</div>
          </div>

          <div v-if="status.characters.length" class="character-list">
            <CharacterCard v-for="character in status.characters" :key="character.name + character.role" :character="character" />
          </div>

          <div v-else class="empty-state">此刻无命名人物在场，风过檐角，只余灵息回荡。</div>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterCard from './components/CharacterCard.vue';
import ProtagonistPanel from './components/ProtagonistPanel.vue';
import StatusHeader from './components/StatusHeader.vue';
import StatusMeta from './components/StatusMeta.vue';

defineProps<{
  status: {
    title: string;
    time: string;
    location: string;
    weather: string;
    protagonist: {
      name: string;
      role: string;
      realm: string;
      state: string;
    };
    characters: Array<{
      name: string;
      gender: string;
      age: string;
      role: string;
      state: string;
      innerVoice: string;
    }>;
  };
}>();
</script>

<style lang="scss" scoped>
.status-shell {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--ty-line);
  border-radius: 22px;
  background:
    radial-gradient(circle at top right, rgba(212, 178, 109, 0.18), transparent 26%),
    radial-gradient(circle at bottom left, rgba(105, 132, 136, 0.18), transparent 32%),
    linear-gradient(180deg, rgba(9, 13, 19, 0.98), rgba(17, 25, 34, 0.96));
  color: var(--ty-text);
  box-shadow: var(--ty-shadow);
}

.status-backdrop {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.03) 40%, transparent 62%),
    repeating-linear-gradient(
      120deg,
      transparent 0,
      transparent 18px,
      rgba(214, 181, 117, 0.02) 18px,
      rgba(214, 181, 117, 0.02) 19px
    );
  pointer-events: none;
}

.status-frame {
  position: relative;
  z-index: 1;
  padding: 20px;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(220px, 270px) minmax(0, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.character-section {
  min-width: 0;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(214, 181, 117, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.015)),
    rgba(16, 24, 34, 0.86);
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  letter-spacing: 3px;
  color: var(--ty-accent);
}

.section-subtitle {
  font-size: 12px;
  color: var(--ty-text-faint);
}

.character-list {
  display: grid;
  gap: 12px;
  max-height: 420px;
  overflow: auto;
  padding-right: 4px;
}

.empty-state {
  padding: 28px 18px;
  border-radius: 14px;
  border: 1px dashed rgba(214, 181, 117, 0.18);
  color: var(--ty-text-faint);
  text-align: center;
  line-height: 1.8;
  background: rgba(255, 255, 255, 0.02);
}

@media (max-width: 760px) {
  .status-frame {
    padding: 16px;
  }

  .main-grid {
    grid-template-columns: 1fr;
  }

  .character-list {
    max-height: none;
  }
}
</style>
