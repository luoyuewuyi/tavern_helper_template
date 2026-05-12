<template>
  <div class="stand-section">
    <!-- 当前激活替身 -->
    <div class="active-contract-banner ani-fade-up">
      <div class="banner-title">Active Contract</div>
      <div v-if="store.data.替身系统.激活替身" class="active-stand-name">
        <span class="magic-star">✨</span>
        {{ store.data.替身系统.激活替身 }}
        <span class="magic-star">✨</span>
      </div>
      <div v-else class="no-stand-text">No Soul Contracted Currently</div>
    </div>

    <!-- 已拥有替身列表 -->
    <div class="summon-panel-epic ani-fade-up" style="animation-delay: 0.2s">
      <div class="panel-header-simple">
        <h2 class="runic-text">古老灵魂契约</h2>
        <div class="capacity-bar">
          <span class="bind-count"
            >已绑定之心: <b>{{ store.data.替身系统.已拥有替身.length }}</b> / {{ maxStands }}</span
          >
        </div>
      </div>

      <div class="contract-grid">
        <div
          v-for="(stand, index) in store.data.替身系统.已拥有替身"
          :key="stand.名称"
          class="contract-card-modern"
          :class="[{ active: stand.名称 === store.data.替身系统.激活替身 }, getTypeClass(stand.类型)]"
          :style="{ animationDelay: 0.3 + index * 0.1 + 's' }"
          @click="selectStand(stand.名称)"
        >
          <div class="card-inner">
            <div class="contract-header">
              <span class="soul-type">{{ stand.类型 }}</span>
              <h3 class="soul-name">{{ stand.名称 }}</h3>
            </div>
            <div class="ability-wrap">
              <p class="soul-ability">{{ stand.能力 }}</p>
            </div>
            <div class="card-footer">
              <div class="status-indicator">
                <span class="dot"></span>
                {{ stand.名称 === store.data.替身系统.激活替身 ? '已同调' : '由于契约' }}
              </div>
            </div>
          </div>
          <div v-if="stand.名称 === store.data.替身系统.激活替身" class="active-bg-glow"></div>
        </div>

        <!-- 空位展示 -->
        <div v-for="i in emptySlots" :key="'empty-' + i" class="empty-slot-card">
          <div class="slot-plus">+</div>
          <span class="slot-text">虚位以待</span>
        </div>
      </div>
    </div>

    <!-- 觉醒界面 -->
    <Transition name="summon-modal-fancy">
      <div v-if="store.data.替身系统.待选择" class="summon-overlay">
        <div class="summon-modal-modern">
          <div class="modal-bg-effect"></div>
          <h3 class="runic-text awakening-title">核心契约觉醒</h3>
          <p class="awakening-desc">星辰正位，你的灵魂在回响。请选择你要缔结的契约：</p>
          <div class="candidate-row">
            <div
              v-for="(c, idx) in store.data.替身系统.替身候选池"
              :key="c.名称"
              class="candidate-card-epic"
              :style="{ animationDelay: 0.2 + idx * 0.15 + 's' }"
              @click="chooseStand(c)"
            >
              <div class="glow-edge"></div>
              <div class="type-tag">{{ c.类型 }}</div>
              <div class="c-name">{{ c.名称 }}</div>
              <div class="c-ability">{{ c.能力 }}</div>
              <div class="bind-action">签订契约</div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();

const maxStands = computed(() => {
  return Math.min(6, 1 + Math.floor(store.data.主角.LV / 10));
});

const emptySlots = computed(() => {
  const currentCount = store.data.替身系统.已拥有替身.length;
  const max = maxStands.value;
  return Math.max(0, max - currentCount);
});

function selectStand(name: string | null) {
  if (name) store.data.替身系统.激活替身 = name;
}

function chooseStand(candidate: { 名称: string; 类型: string; 能力: string }) {
  store.data.替身系统.已拥有替身.push(candidate);
  store.data.替身系统.激活替身 = candidate.名称;
  store.data.替身系统.替身候选池 = [];
  store.data.替身系统.待选择 = false;
}

function getTypeClass(type: string) {
  if (type.includes('近战')) return 't-melee';
  if (type.includes('远程')) return 't-range';
  if (type.includes('辅助')) return 't-supp';
  return 't-spec';
}
</script>

<style lang="scss" scoped>
.panel-header-simple {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--c-deep-gold);
  padding-bottom: 8px;
}

.capacity-bar {
  font-size: 11px;
  color: var(--c-parchment-dark);
  .bind-count b {
    color: var(--c-gold-bright);
    font-size: 14px;
    font-family: var(--font-title);
  }
}

.contract-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 15px;
}

.contract-card-modern {
  background: rgba(10, 10, 10, 0.4);
  border: 1px solid rgba(139, 108, 66, 0.3);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  opacity: 0;
  animation: slide-in-bottom 0.5s ease-out forwards;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--c-silver-ash);
    opacity: 0.5;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--c-gold-bright);
    background: rgba(20, 20, 20, 0.6);
  }

  &.active {
    border-color: var(--c-gold-bright) !important;
    &::before {
      background: var(--c-gold-bright);
      box-shadow: 0 0 10px var(--c-gold-bright);
    }
  }

  /* 类型配色 */
  &.t-melee::before {
    background: var(--c-ruby-red);
  }
  &.t-range::before {
    background: #3498db;
  }
  &.t-supp::before {
    background: var(--c-magic-teal);
  }
  &.t-spec::before {
    background: var(--c-magic-purple);
  }

  .card-inner {
    padding: 12px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}

.contract-header {
  margin-bottom: 10px;
}

.soul-type {
  font-size: 9px;
  text-transform: uppercase;
  color: var(--c-parchment-dark);
  display: block;
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.soul-name {
  font-family: var(--font-title);
  font-size: 15px;
  color: var(--c-parchment-light);
  margin: 0;
}

.ability-wrap {
  flex: 1;
  min-height: 48px;
}

.soul-ability {
  font-size: 11px;
  color: var(--c-parchment-dark);
  line-height: 1.4;
  margin: 0;
}

.card-footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.status-indicator {
  font-size: 10px;
  color: var(--c-parchment-dark);
  display: flex;
  align-items: center;
  gap: 5px;

  .dot {
    width: 4px;
    height: 4px;
    background: currentColor;
    border-radius: 50%;
  }
}

.active .status-indicator {
  color: var(--c-gold-bright);
  .dot {
    box-shadow: 0 0 5px var(--c-gold-bright);
    animation: pulse-glow-dot 2s infinite;
  }
}

.empty-slot-card {
  border: 1px dashed rgba(139, 108, 66, 0.2);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: rgba(139, 108, 66, 0.3);

  .slot-plus {
    font-size: 24px;
    line-height: 1;
    margin-bottom: 5px;
  }
  .slot-text {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

/* 觉醒遮罩层 */
.summon-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summon-modal-modern {
  width: 90%;
  max-width: 600px;
  background: linear-gradient(145deg, #1a1a1a, #0d0d0d);
  border: 2px solid var(--c-gold-muted);
  box-shadow:
    0 0 50px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(139, 108, 66, 0.2);
  padding: 40px;
  text-align: center;
  position: relative;
  border-radius: 8px;
}

.awakening-title {
  font-size: 28px;
  color: var(--c-gold-bright);
  margin-bottom: 15px;
  text-shadow: 0 0 15px rgba(241, 196, 15, 0.4);
}

.awakening-desc {
  font-style: italic;
  color: var(--c-parchment-dark);
  margin-bottom: 30px;
  font-size: 13px;
}

.candidate-row {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.candidate-card-epic {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--c-gold-muted);
  padding: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  opacity: 0;
  animation: fade-in-up 0.6s forwards;

  &:hover {
    transform: scale(1.05) translateY(-10px);
    border-color: var(--c-gold-bright);
    background: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(241, 196, 15, 0.2);

    .bind-action {
      background: var(--c-gold-bright);
      color: #000;
    }
  }
}

.type-tag {
  font-size: 9px;
  color: var(--c-silver-ash);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.c-name {
  font-family: var(--font-title);
  font-size: 18px;
  color: var(--c-parchment-light);
  margin-bottom: 12px;
}

.c-ability {
  font-size: 11px;
  color: var(--c-parchment-dark);
  line-height: 1.5;
  margin-bottom: 20px;
  min-height: 45px;
}

.bind-action {
  font-family: var(--font-title);
  font-size: 10px;
  padding: 8px;
  border: 1px solid var(--c-gold-muted);
  color: var(--c-gold-bright);
  transition: all 0.3s;
}

/* 动画定义 */
@keyframes slide-in-bottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow-dot {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.summon-modal-fancy-enter-active,
.summon-modal-fancy-leave-active {
  transition: all 0.5s ease;
  .summon-modal-modern {
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
}

.summon-modal-fancy-enter-from,
.summon-modal-fancy-leave-to {
  opacity: 0;
  .summon-modal-modern {
    transform: scale(0.8) translateY(20px);
  }
}
</style>
