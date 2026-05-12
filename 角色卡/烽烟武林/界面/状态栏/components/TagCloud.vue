<template>
  <div class="tag-cloud">
    <span v-for="tag in tags" :key="tag.label" class="tag">
      <strong>{{ tag.label }}</strong>
      <span>{{ tag.value }}</span>
    </span>
    <span v-if="tags.length === 0" class="empty">暂无</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: Array<{ label: string; value: string }>;
}>();
</script>

<style scoped lang="scss">
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag,
.empty {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(53, 94, 92, 0.2);
  background: rgba(255, 255, 255, 0.56);
  color: var(--ink-muted);
  font-size: 12px;
}

.tag strong {
  color: var(--ink-text);
  font-weight: 600;
}

.empty {
  border-style: dashed;
}
</style>
