<template>
  <div class="contacts">
    <!-- 分类标签 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="cat-tab"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }}
        <span class="cat-count">{{ cat.count }}</span>
      </button>
    </div>

    <!-- NPC列表 -->
    <div class="contact-list">
      <div
        v-for="(npc, name) in filteredNpcs"
        :key="name as string"
        class="contact-item"
        @click="$emit('viewContact', name as string)"
      >
        <div class="contact-avatar" :class="{ online: npc.是否为住客 }">
          <span>{{ getGenderIcon(npc.性别) }}</span>
        </div>
        <div class="contact-info">
          <div class="contact-name">{{ name }}</div>
          <div class="contact-status">
            <span class="status-location">📍 {{ npc.当前位置 }}</span>
          </div>
          <div class="contact-action">{{ npc.当前行为 }}</div>
        </div>
        <div class="contact-tags">
          <span v-if="npc.是否为住客" class="tag tag-resident">住客</span>
          <span v-if="npc.持有异能 && npc.持有异能 !== '无'" class="tag tag-ability">异能</span>
        </div>
        <span class="contact-arrow">›</span>
      </div>
    </div>

    <div v-if="Object.keys(filteredNpcs).length === 0" class="empty-state">
      <span class="empty-icon">📭</span>
      <span class="empty-text">{{ activeCategory === 'resident' ? '暂无住客' : '暂无联系人' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../schema';

const props = defineProps<{ data: Schema }>();
const emit = defineEmits<{ viewContact: [name: string] }>();

const activeCategory = ref('all');

const categories = computed(() => [
  { id: 'all', label: '全部', count: Object.keys(props.data.NPC状态).length },
  { id: 'resident', label: '住客', count: Object.values(props.data.NPC状态).filter(n => n.是否为住客).length },
  { id: 'wechat', label: '微信好友', count: Object.values(props.data.NPC状态).filter(n => n.是否已加微信).length },
]);

const filteredNpcs = computed(() => {
  const npcs = props.data.NPC状态;
  if (activeCategory.value === 'resident') {
    return Object.fromEntries(Object.entries(npcs).filter(([, n]) => n.是否为住客));
  }
  if (activeCategory.value === 'wechat') {
    return Object.fromEntries(Object.entries(npcs).filter(([, n]) => n.是否已加微信));
  }
  return npcs;
});

function getGenderIcon(gender: string): string {
  return gender === '女' ? '👩' : '👨';
}
</script>

<style lang="scss" scoped>
.contacts {
  padding: 12px;
}

.category-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  background: var(--phone-bg);
  border-radius: 8px;
  padding: 3px;
}

.cat-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px;
  border: none;
  background: transparent;
  color: var(--phone-text-dim);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    color: var(--phone-text);
  }

  &.active {
    background: var(--phone-accent);
    color: var(--phone-bg);
    .cat-count {
      background: rgba(0, 0, 0, 0.2);
      color: var(--phone-bg);
    }
  }
}

.cat-count {
  padding: 0 5px;
  background: var(--phone-border);
  border-radius: 8px;
  font-size: 9px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--phone-accent);
    transform: translateX(4px);
  }
}

.contact-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--phone-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid var(--phone-border);
  position: relative;
  flex-shrink: 0;

  &.online::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background: var(--phone-health);
    border-radius: 50%;
    border: 2px solid var(--phone-card);
  }
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--phone-text);
}

.contact-status {
  margin-top: 2px;
}

.status-location {
  font-size: 10px;
  color: var(--phone-text-dim);
}

.contact-action {
  font-size: 10px;
  color: var(--phone-text-muted);
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-tags {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.tag {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  text-align: center;
}

.tag-resident {
  background: var(--phone-accent-dim);
  color: var(--phone-accent);
}

.tag-ability {
  background: rgba(124, 58, 237, 0.2);
  color: #a78bfa;
}

.contact-arrow {
  color: var(--phone-text-muted);
  font-size: 18px;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
}

.empty-icon {
  font-size: 32px;
}

.empty-text {
  font-size: 12px;
  color: var(--phone-text-muted);
}
</style>
