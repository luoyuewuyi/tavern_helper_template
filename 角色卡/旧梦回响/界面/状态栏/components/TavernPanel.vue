<template>
  <div class="tavern-layout">
    <div class="section-head"><span class="section-icon">◈</span> 当前气氛</div>
    <div class="atmosphere-badge">{{ store.data.酒馆.当前气氛 }}</div>

    <div class="section-head"><span class="section-icon">◈</span> 在场人员</div>
    <div v-if="store.data.酒馆.在场人员.length > 0" class="member-grid">
      <div v-for="name in store.data.酒馆.在场人员" :key="name" class="member-tag">
        {{ name }}
      </div>
    </div>
    <div v-else class="empty-state">酒馆内暂无他人</div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.tavern-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-head {
  font-size: 0.8rem;
  color: var(--c-neon);
  font-weight: 700;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.15);
}

.section-icon {
  font-size: 0.7rem;
  opacity: 0.7;
}

.atmosphere-badge {
  background: var(--c-slate);
  border: 1px solid var(--c-border);
  border-left: 3px solid var(--c-mana);
  padding: 8px 12px;
  font-size: 0.88rem;
  color: var(--c-ghost);
}

.member-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.member-tag {
  background: var(--c-slate);
  border: 1px solid var(--c-border);
  padding: 4px 10px;
  font-size: 0.82rem;
  color: var(--c-ghost);
  font-weight: 600;
  position: relative;
}

.member-tag::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-neon);
}

.empty-state {
  text-align: center;
  color: var(--c-faint);
  padding: 16px;
  font-style: italic;
  font-size: 0.85rem;
}
</style>
