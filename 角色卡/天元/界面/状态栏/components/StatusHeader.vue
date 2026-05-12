<template>
  <header class="status-header">
    <div class="status-seal">天元</div>
    <div class="status-heading">
      <div class="status-title">{{ title }}</div>
      <div class="status-subtitle">山海有灵，人物心潮皆见于一隅</div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style lang="scss" scoped>
.status-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--ty-line);
}

.status-seal {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  border: 1px solid var(--ty-line-strong);
  background: linear-gradient(180deg, rgba(120, 91, 39, 0.42), rgba(214, 181, 117, 0.08));
  color: #f7e6bd;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
}

.status-title {
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: 4px;
  color: #f3e3bb;
}

.status-subtitle {
  margin-top: 6px;
  font-size: 12px;
  color: var(--ty-text-faint);
  letter-spacing: 2px;
}

@media (max-width: 760px) {
  .status-title {
    font-size: 18px;
    letter-spacing: 2px;
  }

  .status-subtitle {
    letter-spacing: 1px;
  }
}
</style>
