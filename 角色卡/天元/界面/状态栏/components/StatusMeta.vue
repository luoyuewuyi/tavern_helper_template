<template>
  <section class="status-meta">
    <div class="meta-item">
      <span class="meta-label">时</span>
      <span class="meta-value">{{ time }}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">地</span>
      <span class="meta-value">{{ location }}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">境</span>
      <span class="meta-value">{{ weather }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  time: string;
  location: string;
  weather: string;
}>();
</script>

<style lang="scss" scoped>
.status-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.meta-item {
  min-width: 0;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(214, 181, 117, 0.15);
  background: rgba(255, 255, 255, 0.03);
}

.meta-label {
  display: inline-flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border-radius: 50%;
  background: rgba(214, 181, 117, 0.12);
  color: var(--ty-accent);
  font-size: 12px;
}

.meta-value {
  font-size: 13px;
  color: var(--ty-text-soft);
  word-break: break-word;
}

@media (max-width: 760px) {
  .status-meta {
    grid-template-columns: 1fr;
  }
}
</style>
