<template>
  <div class="npc-panel-epic">
    <div class="panel-header-plain">
      <h2 class="runic-text">众人之像</h2>
      <span v-if="store.data.周围人物" class="count-tag">{{ store.data.周围人物.length }} 位邂逅者</span>
    </div>

    <div v-if="store.data.周围人物 && store.data.周围人物.length > 0" class="npc-grid">
      <div v-for="npc in store.data.周围人物" :key="npc.名称" class="npc-card">
        <div class="card-bg"></div>
        <div class="card-content">
          <div class="npc-main-info">
            <span class="npc-name">{{ npc.名称 }}</span>
            <span class="npc-relation gold-glow">{{ npc.关系 }}</span>
          </div>

          <!-- 状态徽章 -->
          <div class="npc-status-tag" :class="getStatusClass(npc.当前状态)">
            <span class="status-marker">●</span>
            {{ npc.当前状态 || '正常' }}
          </div>

          <!-- 好感度条 -->
          <div class="favor-section">
            <div class="favor-label">
              <span>好感度</span>
              <span :class="getFavorClass(npc.好感度)">{{ npc.好感度 }}</span>
            </div>
            <div class="favor-bar-bg">
              <div
                class="favor-fill"
                :class="getFavorClass(npc.好感度)"
                :style="{ width: Math.abs(npc.好感度) + '%', marginLeft: npc.好感度 < 0 ? '0' : 'auto' }"
              >
                <div class="favor-glow"></div>
              </div>
            </div>
          </div>

          <p v-if="npc.备注" class="npc-note">"{{ npc.备注 }}"</p>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state ani-fade-up">
      <div class="empty-icon">🕯️</div>
      <p class="empty-text">周围暂时没有被标记的人物</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

function getStatusClass(status: string) {
  if (status === '战斗中') return 'danger';
  if (status === '虚弱') return 'alert';
  if (status === '正常') return 'calm';
  return 'normal';
}

function getFavorClass(val: number) {
  if (val >= 60) return 'ex-favorable';
  if (val >= 20) return 'favorable';
  if (val <= -60) return 'ex-hostile';
  if (val <= -20) return 'hostile';
  return 'neutral';
}
</script>

<style lang="scss" scoped>
.npc-panel-epic {
  padding: 20px;
}

.npc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.npc-card {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(139, 108, 66, 0.3);
  border-radius: 8px;
  padding: 15px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);

  &:hover {
    transform: translateY(-5px);
    border-color: var(--c-gold-bright);
    background: rgba(30, 30, 30, 0.8);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.npc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.npc-relation {
  font-size: 9px;
  text-transform: uppercase;
  color: var(--c-parchment-dark);
  letter-spacing: 1px;
}

.npc-name {
  font-family: var(--font-title);
  font-size: 18px;
  margin: 2px 0 0 0;
  color: var(--c-parchment-light);
}

.npc-status-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--c-parchment-dark);

  &.alert {
    background: rgba(155, 17, 30, 0.2);
    color: #ff4d4d;
    border: 1px solid rgba(155, 17, 30, 0.4);
  }
  &.danger {
    background: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
    border: 1px solid rgba(231, 76, 60, 0.4);
  }
  &.calm {
    background: rgba(22, 160, 133, 0.2);
    color: #1abc9c;
    border: 1px solid rgba(22, 160, 133, 0.4);
  }
}

.favorability-section {
  margin-bottom: 12px;
}

.favor-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--c-parchment-dark);
  margin-bottom: 5px;
}

.favor-val {
  font-weight: bold;
  &.ex-favorable {
    color: #f1c40f;
    text-shadow: 0 0 5px rgba(241, 196, 15, 0.5);
  }
  &.favorable {
    color: #2ecc71;
  }
  &.ex-hostile {
    color: #c0392b;
    text-shadow: 0 0 5px rgba(192, 57, 43, 0.5);
  }
  &.hostile {
    color: #e67e22;
  }
}

.favor-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.favor-fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s ease-out;

  &.positive {
    background: linear-gradient(90deg, #2ecc71, #f1c40f);
  }
  &.negative {
    background: linear-gradient(-90deg, #e67e22, #c0392b);
  }
}

.npc-memo {
  font-size: 11px;
  color: var(--c-parchment-dark);
  font-style: italic;
  display: flex;
  gap: 5px;
  opacity: 0.8;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-npc {
  padding: 60px 20px;
  text-align: center;
  color: var(--c-parchment-dark);

  .empty-icon {
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.3;
  }

  .empty-text {
    font-family: var(--font-title);
    font-size: 18px;
    margin-bottom: 5px;
  }

  .empty-sub {
    font-size: 12px;
    font-style: italic;
    opacity: 0.6;
  }
}
</style>
