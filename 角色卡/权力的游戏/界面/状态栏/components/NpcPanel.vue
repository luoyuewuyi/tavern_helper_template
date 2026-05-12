<template>
  <div class="npc-layout">
    <div class="section-head">👤 已知人物 ({{ npcCount }})</div>

    <div v-if="npcCount > 0" class="npc-list">
      <div v-for="(npc, name) in sortedNpcs" :key="name" class="npc-card">
        <!-- 删除按钮 -->
        <button class="delete-btn" title="移除此角色" @click="confirmDelete(name as string)">✕</button>

        <!-- 角色名 + 状态 -->
        <div class="npc-header">
          <span class="npc-name">{{ name }}</span>
          <span class="npc-status" :class="statusClass(npc.状态)">{{ npc.状态 }}</span>
        </div>

        <!-- 角色信息 -->
        <div class="npc-info">
          <span class="info-tag">🏠 {{ npc.家族 }}</span>
          <span class="info-tag">📍 {{ npc.所在地 }}</span>
        </div>
        <div class="npc-info">
          <span class="info-tag">👑 {{ npc.头衔 }}</span>
        </div>

        <!-- 好感度条 -->
        <div class="affinity-section">
          <div class="affinity-header">
            <span class="affinity-label">{{ npc.关系 }} · {{ npc.态度 }}</span>
            <span class="affinity-value" :class="affinityClass(npc.好感度)"
              >{{ npc.好感度 > 0 ? '+' : '' }}{{ npc.好感度 }}</span
            >
          </div>
          <div class="affinity-track">
            <div class="affinity-center"></div>
            <div
              class="affinity-fill"
              :class="npc.好感度 >= 0 ? 'positive' : 'negative'"
              :style="affinityStyle(npc.好感度)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">尚未结识任何人物...</div>

    <!-- 删除确认对话框 -->
    <div v-if="deleteTarget" class="confirm-overlay" @click.self="deleteTarget = null">
      <div class="confirm-dialog">
        <div class="confirm-text">确定要从记录中移除「{{ deleteTarget }}」吗？</div>
        <div class="confirm-text-sub">此操作将删除该角色的所有变量数据</div>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="deleteTarget = null">取消</button>
          <button class="btn-confirm" @click="executeDelete">确认移除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
const deleteTarget = ref<string | null>(null);

// 按好感度排序的NPC列表
const sortedNpcs = computed(() => {
  return _(store.data.人物)
    .entries()
    .sortBy(([, npc]) => -npc.好感度)
    .fromPairs()
    .value();
});

// NPC数量
const npcCount = computed(() => _.size(store.data.人物));

// 确认删除
function confirmDelete(name: string) {
  deleteTarget.value = name;
}

// 执行删除
function executeDelete() {
  if (deleteTarget.value && store.data.人物[deleteTarget.value]) {
    delete store.data.人物[deleteTarget.value];
    deleteTarget.value = null;
  }
}

// 好感度样式
function affinityClass(value: number): string {
  if (value >= 50) return 'affinity-high';
  if (value >= 20) return 'affinity-positive';
  if (value > -20) return 'affinity-neutral';
  if (value > -50) return 'affinity-negative';
  return 'affinity-hostile';
}

// 好感度进度条样式
function affinityStyle(value: number) {
  const percent = Math.abs(value) / 2; // 0~50%宽度
  if (value >= 0) {
    return { left: '50%', width: percent + '%' };
  } else {
    return { right: '50%', width: percent + '%' };
  }
}

// 状态CSS类
function statusClass(status: string): string {
  if (status === '存活') return 'status-alive';
  if (status === '受伤' || status === '被囚') return 'status-wounded';
  if (status === '死亡') return 'status-dead';
  return 'status-other';
}
</script>

<style lang="scss" scoped>
.npc-layout {
  position: relative;
}

.section-head {
  font-size: 0.88rem;
  border-bottom: 1px solid var(--c-gold);
  display: inline-block;
  padding-bottom: 2px;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--c-gold);
}

.npc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.npc-card {
  position: relative;
  padding: 8px 10px;
  background: rgba(74, 74, 106, 0.2);
  border: 1px solid var(--c-steel);
  transition: background 0.2s;
}

.npc-card:hover {
  background: rgba(74, 74, 106, 0.35);
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border: 1px solid var(--c-steel);
  background: rgba(139, 37, 0, 0.3);
  color: var(--c-fire);
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition:
    opacity 0.2s,
    background 0.2s;
  padding: 0;
  font-family: inherit;
}

.delete-btn:hover {
  opacity: 1;
  background: rgba(139, 37, 0, 0.6);
}

.npc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  padding-right: 22px;
}

.npc-name {
  font-weight: bold;
  font-size: 0.88rem;
  color: var(--c-parchment);
}

.npc-status {
  font-size: 0.7rem;
  padding: 1px 5px;
  border-radius: 2px;
}

.status-alive {
  background: rgba(76, 175, 80, 0.3);
  color: #4caf50;
}
.status-wounded {
  background: rgba(255, 152, 0, 0.3);
  color: #ff9800;
}
.status-dead {
  background: rgba(231, 76, 60, 0.3);
  color: var(--c-fire);
  text-decoration: line-through;
}
.status-other {
  background: rgba(142, 142, 160, 0.3);
  color: var(--c-silver);
}

.npc-info {
  display: flex;
  gap: 8px;
  margin-bottom: 3px;
  flex-wrap: wrap;
}

.info-tag {
  font-size: 0.72rem;
  color: var(--c-silver);
}

.affinity-section {
  margin-top: 4px;
}

.affinity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.affinity-label {
  font-size: 0.72rem;
  color: var(--c-silver);
}

.affinity-value {
  font-size: 0.75rem;
  font-weight: bold;
}

.affinity-high {
  color: #4caf50;
}
.affinity-positive {
  color: var(--c-ice);
}
.affinity-neutral {
  color: var(--c-silver);
}
.affinity-negative {
  color: #ff9800;
}
.affinity-hostile {
  color: var(--c-fire);
}

.affinity-track {
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--c-steel);
  position: relative;
  overflow: hidden;
}

.affinity-center {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--c-parchment);
  opacity: 0.5;
}

.affinity-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  transition: width 0.3s ease;
}

.affinity-fill.positive {
  background: linear-gradient(90deg, var(--c-ice) 0%, #4caf50 100%);
}

.affinity-fill.negative {
  background: linear-gradient(270deg, var(--c-fire) 0%, #ff9800 100%);
}

.empty-state {
  text-align: center;
  color: var(--c-silver);
  padding: 15px;
  font-style: italic;
  font-size: 0.82rem;
}

/* 确认对话框 */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background: var(--c-iron);
  border: 2px solid var(--c-gold);
  padding: 16px 20px;
  max-width: 300px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.confirm-text {
  color: var(--c-parchment);
  font-size: 0.85rem;
  margin-bottom: 6px;
  text-align: center;
}

.confirm-text-sub {
  color: var(--c-silver);
  font-size: 0.72rem;
  margin-bottom: 12px;
  text-align: center;
}

.confirm-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  padding: 5px 14px;
  border: 1px solid var(--c-steel);
  font-family: var(--font-label);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: transparent;
  color: var(--c-silver);
}

.btn-cancel:hover {
  background: rgba(142, 142, 160, 0.2);
}

.btn-confirm {
  background: rgba(139, 37, 0, 0.4);
  color: var(--c-fire);
  border-color: var(--c-blood);
}

.btn-confirm:hover {
  background: rgba(139, 37, 0, 0.7);
}
</style>
