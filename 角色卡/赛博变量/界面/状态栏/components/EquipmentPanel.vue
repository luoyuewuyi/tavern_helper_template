<template>
  <div class="equip-panel">
    <div class="section-title">// 装备栏</div>

    <div class="equip-grid">
      <div
        v-for="slot in equipSlots"
        :key="slot.key"
        class="equip-slot"
        :class="{ expanded: expandedSlot === slot.key, empty: !store.data.主角.装备[slot.key] }"
        @click="toggleSlot(slot.key)"
      >
        <div class="slot-header">
          <span class="slot-icon">{{ slot.icon }}</span>
          <span class="slot-name">{{ slot.label }}</span>
          <span class="expand-icon">{{ expandedSlot === slot.key ? '[-]' : '[+]' }}</span>
        </div>

        <div v-if="store.data.主角.装备[slot.key]" class="slot-content">
          <span class="gear-name">{{ store.data.主角.装备[slot.key].名称 }}</span>
        </div>
        <div v-else class="slot-content empty">
          <span class="gear-name">-- 空 --</span>
        </div>

        <div v-if="expandedSlot === slot.key && store.data.主角.装备[slot.key]" class="slot-detail">
          <span class="detail-label">效果://</span>
          <span class="detail-text">{{ store.data.主角.装备[slot.key].效果 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const expandedSlot = ref<string | null>(null);

const equipSlots = [
  { key: '义体' as const, label: '义体', icon: '⚙' },
  { key: '武器' as const, label: '武器', icon: '⚔' },
  { key: '防具' as const, label: '防具', icon: '🛡' },
  { key: '植入物' as const, label: '植入物', icon: '💉' },
  { key: '药剂' as const, label: '药剂', icon: '💊' },
];

function toggleSlot(key: string) {
  expandedSlot.value = expandedSlot.value === key ? null : key;
}
</script>

<style lang="scss" scoped>
.equip-panel {
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

.equip-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.equip-slot {
  background: var(--c-bg-dark);
  border: 1px solid var(--c-border);
  cursor: pointer;
  transition: all 0.2s;
}

.equip-slot:hover {
  border-color: var(--c-magenta);
}

.equip-slot.expanded {
  border-color: var(--c-magenta);
  box-shadow: 0 0 8px rgba(255, 0, 255, 0.2);
}

.equip-slot.empty {
  opacity: 0.6;
}

.slot-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(255, 0, 255, 0.05);
  border-bottom: 1px solid var(--c-border);
}

.slot-icon {
  font-size: 1rem;
}

.slot-name {
  color: var(--c-magenta);
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.expand-icon {
  margin-left: auto;
  color: var(--c-text-dim);
  font-size: 0.7rem;
}

.slot-content {
  padding: 8px 10px;
}

.slot-content.empty .gear-name {
  color: var(--c-text-muted);
  font-style: italic;
}

.gear-name {
  color: var(--c-text);
  font-size: 0.85rem;
  font-weight: bold;
}

.slot-detail {
  padding: 8px 10px;
  padding-top: 0;
  border-top: 1px dashed var(--c-border);
  margin-top: 0;
  animation: slideDown 0.2s ease;
}

.detail-label {
  color: var(--c-green);
  font-size: 0.7rem;
  display: block;
  margin-bottom: 4px;
}

.detail-text {
  color: var(--c-text-dim);
  font-size: 0.78rem;
  display: block;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 100px;
  }
}
</style>
