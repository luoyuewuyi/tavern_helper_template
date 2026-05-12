<template>
  <div class="npc-panel">
    <div class="section-title">// 在场人物</div>

    <div v-if="!_.isEmpty(store.data.NPC)" class="npc-list">
      <div
        v-for="(npc, name) in store.data.NPC"
        :key="name"
        class="npc-card"
        :class="{ expanded: expandedNPC === name }"
        @click="toggleNPC(name as string)"
      >
        <div class="npc-header">
          <span class="npc-avatar">{{ (name as string).substring(0, 1) }}</span>
          <div class="npc-info">
            <span class="npc-name">{{ name }}</span>
            <span class="npc-role">{{ npc.身份 }}</span>
          </div>
          <span class="attitude-badge" :class="getAttitudeClass(npc.对主角态度)">
            {{ npc.对主角态度 }}
          </span>
        </div>

        <div v-if="expandedNPC === name" class="npc-detail">
          <div class="thought-bubble">
            <span class="thought-prefix">[内心]</span>
            <span class="thought-text">"{{ npc.内心OS }}"</span>
          </div>
          <div v-if="npc.当前状态" class="status-line">
            <span class="status-prefix">[状态]</span>
            <span class="status-text">{{ npc.当前状态 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">[?]</span>
      <span>暂无在场人物</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
const expandedNPC = ref<string | null>(null);

function toggleNPC(name: string) {
  expandedNPC.value = expandedNPC.value === name ? null : name;
}

function getAttitudeClass(attitude: string): string {
  if (attitude.includes('友') || attitude.includes('好')) return 'positive';
  if (attitude.includes('敌') || attitude.includes('恨') || attitude.includes('恶')) return 'negative';
  if (attitude.includes('中') || attitude.includes('普')) return 'neutral';
  return 'unknown';
}
</script>

<style lang="scss" scoped>
.npc-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  color: var(--c-cyan);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 0;
  border-bottom: 1px solid var(--c-cyan);
  text-shadow: var(--glow-cyan);
}

.npc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.npc-card {
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  cursor: pointer;
  transition: all 0.2s;
}

.npc-card:hover {
  border-color: var(--c-yellow);
}

.npc-card.expanded {
  border-color: var(--c-yellow);
  box-shadow: 0 0 8px rgba(240, 255, 0, 0.15);
}

.npc-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.npc-avatar {
  width: 32px;
  height: 32px;
  background: var(--c-bg-panel);
  border: 1px solid var(--c-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--c-yellow);
  font-size: 0.9rem;
}

.npc-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.npc-name {
  color: var(--c-text);
  font-weight: bold;
  font-size: 0.9rem;
}

.npc-role {
  color: var(--c-text-dim);
  font-size: 0.72rem;
}

.attitude-badge {
  padding: 3px 8px;
  font-size: 0.7rem;
  font-weight: bold;
  border: 1px solid;
}

.attitude-badge.positive {
  color: var(--c-green);
  border-color: var(--c-green);
  background: rgba(0, 255, 136, 0.1);
}

.attitude-badge.negative {
  color: var(--c-red);
  border-color: var(--c-red);
  background: rgba(255, 51, 102, 0.1);
}

.attitude-badge.neutral {
  color: var(--c-text-dim);
  border-color: var(--c-border);
  background: rgba(125, 133, 144, 0.1);
}

.attitude-badge.unknown {
  color: var(--c-yellow);
  border-color: var(--c-yellow);
  background: rgba(240, 255, 0, 0.1);
}

.npc-detail {
  padding: 10px;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: slideDown 0.2s ease;
}

.thought-bubble {
  padding: 8px;
  background: rgba(255, 0, 255, 0.05);
  border-left: 2px solid var(--c-magenta);
}

.thought-prefix {
  color: var(--c-magenta);
  font-size: 0.7rem;
  display: block;
  margin-bottom: 4px;
}

.thought-text {
  color: var(--c-text-dim);
  font-size: 0.8rem;
  font-style: italic;
}

.status-line {
  display: flex;
  gap: 6px;
  font-size: 0.78rem;
}

.status-prefix {
  color: var(--c-cyan);
}

.status-text {
  color: var(--c-text-dim);
}

@keyframes slideDown {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--c-text-dim);
  font-size: 0.85rem;
  background: var(--c-bg-dark);
  border: 1px dashed var(--c-border);
}

.empty-icon {
  color: var(--c-yellow);
}
</style>
