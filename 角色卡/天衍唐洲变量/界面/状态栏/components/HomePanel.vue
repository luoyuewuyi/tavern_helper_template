<template>
  <div class="home-panel">
    <div class="section-title">家园·{{ store.data.家园.基础信息.名称 }}</div>

    <!-- 家园基础信息 -->
    <div class="home-info">
      <div class="info-item">
        <i class="fa fa-map-marker-alt"></i>
        <span>{{ store.data.家园.基础信息.所在 }}</span>
      </div>
      <div class="info-item highlight">
        <i class="fa fa-home"></i>
        <span>当前居所：{{ store.data.家园.基础信息.当前居所 }}</span>
      </div>
    </div>

    <!-- 女主人居所 -->
    <div class="divider"></div>
    <div class="section-title">居所列表</div>

    <div class="residence-grid">
      <div
        v-for="(res, name) in residences"
        :key="name"
        class="residence-card"
        :class="{ locked: !res.已解锁, current: name === store.data.家园.基础信息.当前居所 }"
      >
        <div class="res-header">
          <span class="res-name">{{ name }}</span>
          <span v-if="res.已解锁" class="res-status unlocked">
            <i class="fa fa-unlock"></i>
          </span>
          <span v-else class="res-status locked">
            <i class="fa fa-lock"></i>
          </span>
        </div>

        <div v-if="res.已解锁" class="res-details">
          <div class="res-style">
            <span class="label">风格</span>
            <span class="value">{{ res.风格 }}</span>
          </div>
          <div class="res-attrs">
            <span class="label">适配</span>
            <span v-for="attr in res.适配属性" :key="attr" class="attr-tag">
              {{ attr }}
            </span>
          </div>
          <div class="res-decoration">
            <span class="label">装饰</span>
            <div class="deco-bar">
              <div class="deco-fill" :style="{ width: res.装饰等级 + '%' }"></div>
            </div>
            <span class="deco-value">{{ res.装饰等级 }}%</span>
          </div>
          <div v-if="res.居住者" class="res-occupant">
            <i class="fa fa-user"></i>
            {{ res.居住者 }}
          </div>
        </div>

        <div v-else class="res-locked-hint">
          <i class="fa fa-question-circle"></i>
          待解锁
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const residences = computed(() => store.data.家园.女主人居所);
</script>

<style lang="scss" scoped>
.home-panel {
  display: flex;
  flex-direction: column;
}

.home-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--c-ink);

  i {
    color: var(--c-bronze);
  }

  &.highlight {
    padding: 4px 10px;
    background: rgba(212, 175, 55, 0.1);
    border-radius: 4px;
    font-weight: 600;
  }
}

.residence-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.residence-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--c-mist);
  border-radius: 4px;
  padding: 10px;
  transition: all 0.2s;

  &.current {
    border-color: var(--c-gold);
    box-shadow: 0 0 0 1px var(--c-gold);

    .res-name {
      color: var(--c-gold);
    }
  }

  &.locked {
    opacity: 0.6;
    background: rgba(0, 0, 0, 0.03);
  }
}

.res-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.res-name {
  font-family: var(--font-kai);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-ink);
}

.res-status {
  font-size: 0.7rem;

  &.unlocked {
    color: var(--c-jade);
  }

  &.locked {
    color: var(--c-cloud);
  }
}

.res-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.res-style,
.res-attrs,
.res-decoration {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;

  .label {
    color: var(--c-cloud);
    min-width: 2.5em;
  }

  .value {
    color: var(--c-ink);
  }
}

.attr-tag {
  padding: 1px 6px;
  background: rgba(139, 105, 20, 0.1);
  color: var(--c-bronze);
  border-radius: 2px;
  font-size: 0.65rem;
}

.deco-bar {
  flex: 1;
  height: 6px;
  background: var(--c-parchment);
  border: 1px solid var(--c-mist);
  border-radius: 3px;
  overflow: hidden;
}

.deco-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-bronze), var(--c-gold));
  transition: width 0.3s;
}

.deco-value {
  font-size: 0.65rem;
  color: var(--c-bronze);
  min-width: 2.5em;
  text-align: right;
}

.res-occupant {
  font-size: 0.7rem;
  color: var(--c-jade);
  padding-top: 4px;
  border-top: 1px dashed var(--c-mist);
  margin-top: 4px;

  i {
    margin-right: 4px;
  }
}

.res-locked-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  font-size: 0.75rem;
  color: var(--c-cloud);
}

@media (max-width: 500px) {
  .residence-grid {
    grid-template-columns: 1fr;
  }
}
</style>
