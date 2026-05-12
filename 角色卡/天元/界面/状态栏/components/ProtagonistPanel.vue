<template>
  <section class="protagonist-panel">
    <div class="panel-head">
      <div class="panel-title">主角命盘</div>
      <div class="panel-name">{{ protagonist.name }}</div>
    </div>

    <div class="info-list">
      <div class="info-row">
        <span class="info-label">身份</span>
        <span class="info-value">{{ protagonist.role }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">境界</span>
        <span class="info-value accent">{{ protagonist.realm }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">状态</span>
        <span class="info-value">{{ protagonist.state }}</span>
      </div>
    </div>

    <div class="panel-foot">灵机浮沉，皆系一念与一息。</div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  protagonist: {
    name: string;
    role: string;
    realm: string;
    state: string;
  };
}>();
</script>

<style lang="scss" scoped>
.protagonist-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(214, 181, 117, 0.16);
  background:
    linear-gradient(180deg, rgba(131, 171, 176, 0.08), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.038), rgba(255, 255, 255, 0.018)),
    rgba(13, 20, 30, 0.88);
}

.panel-head {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(214, 181, 117, 0.12);
}

.panel-title {
  font-size: 13px;
  color: var(--ty-text-faint);
  letter-spacing: 3px;
}

.panel-name {
  margin-top: 6px;
  font-size: 24px;
  color: #f7e9c7;
  letter-spacing: 4px;
}

.info-list {
  display: grid;
  gap: 10px;
}

.info-row {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(214, 181, 117, 0.08);
}

.info-label {
  font-size: 11px;
  color: var(--ty-text-faint);
  letter-spacing: 2px;
}

.info-value {
  color: var(--ty-text-soft);
  line-height: 1.6;
}

.info-value.accent {
  color: var(--ty-accent);
}

.panel-foot {
  margin-top: auto;
  padding-top: 4px;
  color: var(--ty-cyan);
  font-size: 12px;
  line-height: 1.7;
}
</style>
