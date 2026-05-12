<template>
  <div class="attire-panel">
    <div class="section-title">当前着装</div>

    <div class="attire-grid">
      <!-- 外装 -->
      <div class="attire-card main">
        <div class="attire-label">
          <i class="fa fa-tshirt"></i>
          外装
        </div>
        <div class="attire-type">{{ store.data.着装.外装.类型 }}</div>
        <div class="attire-desc">{{ store.data.着装.外装.描述 }}</div>
        <div class="attire-quality">{{ store.data.着装.外装.品质 }}</div>
      </div>

      <!-- 内衣 -->
      <div class="attire-card inner">
        <div class="attire-label">
          <i class="fa fa-heart"></i>
          内衣
        </div>
        <div class="attire-type">{{ store.data.着装.内衣.类型 }}</div>
        <div class="attire-desc">{{ store.data.着装.内衣.描述 }}</div>
        <div class="attire-quality">{{ store.data.着装.内衣.品质 }}</div>
      </div>

      <!-- 丝袜 -->
      <div class="attire-card hosiery">
        <div class="attire-label">
          <i class="fa fa-socks"></i>
          丝袜
        </div>
        <div class="attire-type">{{ store.data.着装.丝袜.类型 }}</div>
        <div class="attire-desc">{{ store.data.着装.丝袜.描述 }}</div>
        <div class="attire-quality">{{ store.data.着装.丝袜.品质 }}</div>
      </div>

      <!-- 高跟鞋 -->
      <div class="attire-card shoes">
        <div class="attire-label">
          <i class="fa fa-shoe-prints"></i>
          高跟鞋
        </div>
        <div class="attire-type">{{ store.data.着装.高跟鞋.类型 }}</div>
        <div class="attire-desc">{{ store.data.着装.高跟鞋.描述 }}</div>
        <div class="attire-quality">{{ store.data.着装.高跟鞋.品质 }}</div>
      </div>
    </div>

    <!-- 饰品 -->
    <div class="divider"></div>
    <div class="section-title">饰品</div>

    <div class="accessory-grid">
      <div v-for="(value, name) in accessories" :key="name" class="accessory-item">
        <span class="acc-name">{{ name }}</span>
        <span class="acc-value">{{ value || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const accessories = computed(() => store.data.着装.饰品);
</script>

<style lang="scss" scoped>
.attire-panel {
  display: flex;
  flex-direction: column;
}

.attire-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.attire-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--c-mist);
  border-radius: 4px;
  padding: 10px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 4px 4px 0 0;
  }

  &.main::before {
    background: linear-gradient(90deg, #e34234, #d4af37);
  }
  &.inner::before {
    background: linear-gradient(90deg, #ff9a9e, #fad0c4);
  }
  &.hosiery::before {
    background: linear-gradient(90deg, #a18cd1, #fbc2eb);
  }
  &.shoes::before {
    background: linear-gradient(90deg, #8b6914, #d4af37);
  }
}

.attire-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: var(--c-cloud);
  margin-bottom: 6px;

  i {
    font-size: 0.75rem;
  }
}

.attire-type {
  font-family: var(--font-kai);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-ink);
  margin-bottom: 4px;
}

.attire-desc {
  font-size: 0.72rem;
  color: var(--c-cloud);
  line-height: 1.4;
  margin-bottom: 6px;
}

.attire-quality {
  font-size: 0.65rem;
  padding: 2px 6px;
  background: rgba(139, 105, 20, 0.1);
  color: var(--c-bronze);
  border-radius: 2px;
  display: inline-block;
}

.accessory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.accessory-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--c-mist);
  border-radius: 4px;
}

.acc-name {
  font-size: 0.7rem;
  color: var(--c-cloud);
  margin-bottom: 4px;
}

.acc-value {
  font-size: 0.8rem;
  color: var(--c-ink);
  line-height: 1.4;
}

@media (max-width: 500px) {
  .attire-grid,
  .accessory-grid {
    grid-template-columns: 1fr;
  }
}
</style>
