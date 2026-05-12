<template>
  <div>
    <div class="section-head">
      <span>人脉网络</span>
      <span class="count">{{ connectionCount }}人</span>
    </div>

    <div v-if="!_.isEmpty(store.data.主角.人脉网络)" class="connection-list">
      <div v-for="(info, name) in store.data.主角.人脉网络" :key="name" class="connection-card">
        <div class="card-left">
          <div class="avatar">{{ (name as string).charAt(0) }}</div>
        </div>
        <div class="card-center">
          <div class="conn-name">{{ name }}</div>
          <div class="conn-level" :class="levelClass(info.关系等级)">
            {{ levelIcon(info.关系等级) }} {{ info.关系等级 }}
          </div>
          <div v-if="info.备注" class="conn-note">{{ info.备注 }}</div>
        </div>
        <div class="card-right">
          <button class="delete-btn" title="移除此人脉" @click="deleteConnection(name as string)">✕</button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">暂无人脉记录</div>

    <!-- 删除确认弹窗 -->
    <div v-if="confirmTarget" class="modal-overlay" @click="confirmTarget = null">
      <div class="modal-box" @click.stop>
        <div class="modal-title">⚠️ 确认移除</div>
        <div class="modal-text">
          确定要从人脉网络中移除「<strong>{{ confirmTarget }}</strong
          >」吗？<br />
          这将删除该角色的关系记录，可以减少变量占用。
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="confirmTarget = null">取消</button>
          <button class="btn-confirm" @click="confirmDelete">确认移除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
const confirmTarget = ref<string | null>(null);

const connectionCount = computed(() => Object.keys(store.data.主角.人脉网络).length);

function levelClass(level: string) {
  const map: Record<string, string> = {
    亲密: 'lv-intimate',
    信任: 'lv-trust',
    友好: 'lv-friendly',
    中立: 'lv-neutral',
    警惕: 'lv-wary',
    敌对: 'lv-hostile',
  };
  return map[level] || 'lv-neutral';
}

function levelIcon(level: string) {
  const map: Record<string, string> = {
    亲密: '💖',
    信任: '🤝',
    友好: '😊',
    中立: '😐',
    警惕: '⚠️',
    敌对: '⚔️',
  };
  return map[level] || '❓';
}

function deleteConnection(name: string) {
  confirmTarget.value = name;
}

function confirmDelete() {
  if (!confirmTarget.value) return;
  const target = confirmTarget.value;
  confirmTarget.value = null;

  // 使用酒馆助手API删除变量
  const scope = { type: 'message' as const, message_id: getCurrentMessageId() };
  const vars = getVariables(scope);
  if (vars?.stat_data?.主角?.人脉网络?.[target]) {
    delete vars.stat_data.主角.人脉网络[target];
    replaceVariables(vars, scope);
  }
}
</script>

<style lang="scss" scoped>
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 0.88rem;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-border);
}

.count {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--c-text-muted);
  background: var(--c-bg-deep);
  padding: 2px 8px;
  border-radius: 10px;
}

.connection-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.connection-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--c-bg-deep);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 8px 10px;
  transition: all 0.2s;
  &:hover {
    border-color: var(--c-border-light);
    background: var(--c-bg-panel);
  }
}

.card-left {
  flex-shrink: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-accent-gold-dim), var(--c-accent-blue-dim));
  border: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--c-accent-gold);
}

.card-center {
  flex: 1;
  min-width: 0;
}

.conn-name {
  font-weight: 600;
  font-size: 0.85rem;
}

.conn-level {
  font-size: 0.72rem;
  padding: 1px 6px;
  border-radius: 3px;
  display: inline-block;
  margin-top: 2px;
}
.lv-intimate {
  background: rgba(255, 105, 180, 0.15);
  color: #ff69b4;
}
.lv-trust {
  background: var(--c-accent-green-dim);
  color: var(--c-accent-green);
}
.lv-friendly {
  background: var(--c-accent-blue-dim);
  color: var(--c-accent-blue);
}
.lv-neutral {
  background: rgba(139, 148, 158, 0.15);
  color: var(--c-text-secondary);
}
.lv-wary {
  background: rgba(210, 153, 34, 0.15);
  color: #d29922;
}
.lv-hostile {
  background: var(--c-accent-red-dim);
  color: var(--c-accent-red);
}

.conn-note {
  font-size: 0.7rem;
  color: var(--c-text-muted);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-right {
  flex-shrink: 0;
}

.delete-btn {
  width: 24px;
  height: 24px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background: var(--c-accent-red-dim);
    border-color: var(--c-accent-red);
    color: var(--c-accent-red);
  }
}

.empty-state {
  text-align: center;
  color: var(--c-text-muted);
  padding: 20px;
  font-style: italic;
  font-size: 0.85rem;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: var(--c-bg-card);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 20px;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.modal-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 10px;
}

.modal-text {
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel,
.btn-confirm {
  padding: 6px 16px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--c-border);
  font-family: var(--font-main);
}

.btn-cancel {
  background: var(--c-bg-panel);
  color: var(--c-text-secondary);
  &:hover {
    background: var(--c-bg-deep);
  }
}

.btn-confirm {
  background: var(--c-accent-red-dim);
  color: var(--c-accent-red);
  border-color: rgba(248, 81, 73, 0.4);
  &:hover {
    background: rgba(248, 81, 73, 0.25);
  }
}
</style>
