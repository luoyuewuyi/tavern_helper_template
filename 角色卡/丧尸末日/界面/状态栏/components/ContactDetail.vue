<template>
  <div class="contact-detail">
    <!-- NPC头像和基本信息 -->
    <div class="detail-header">
      <div class="detail-avatar">
        <span>{{ npc.性别 === '女' ? '👩' : '👨' }}</span>
      </div>
      <div class="detail-basic">
        <div class="detail-name">{{ npcName }}</div>
        <div class="detail-age">{{ npc.年龄 }}岁 · {{ npc.性别 }}</div>
        <div class="detail-badges">
          <span v-if="npc.是否为住客" class="badge badge-resident">🏠 住客</span>
          <span v-if="npc.是否已加微信" class="badge badge-wechat">💬 微信好友</span>
        </div>
      </div>
    </div>

    <!-- 信息卡片列表 -->
    <div class="info-cards">
      <div class="info-card">
        <div class="card-label"><span class="card-icon">📍</span> 当前位置</div>
        <div class="card-value">{{ npc.当前位置 }}</div>
      </div>
      <div class="info-card">
        <div class="card-label"><span class="card-icon">📝</span> 当前行为</div>
        <div class="card-value">{{ npc.当前行为 }}</div>
      </div>
      <div class="info-card">
        <div class="card-label"><span class="card-icon">⚡</span> 持有异能</div>
        <div class="card-value" :class="{ 'no-ability': !npc.持有异能 || npc.持有异能 === '无' }">
          {{ npc.持有异能 || '无' }}
        </div>
      </div>
      <div class="info-card">
        <div class="card-label"><span class="card-icon">💬</span> 最后一次互动</div>
        <div class="card-value interaction">{{ npc.最后一次互动记录 }}</div>
      </div>
    </div>

    <!-- 私聊功能区 -->
    <div v-if="npc.是否已加微信" class="chat-section">
      <!-- 聊天记录 -->
      <div class="chat-history">
        <div class="history-title">
          <span>📋</span> 私聊记录
          <span class="history-count">{{ chatHistory.length }}/20</span>
        </div>
        <div v-if="chatHistory.length > 0" class="history-list">
          <div
            v-for="(msg, i) in chatHistory"
            :key="i"
            class="history-msg"
            :class="{ 'msg-self': msg.发送者 === '王寅' }"
          >
            <div class="msg-header">
              <span class="msg-sender">{{ msg.发送者 }}</span>
              <span class="msg-time">{{ msg.时间 }}</span>
            </div>
            <div class="msg-body">{{ msg.内容 }}</div>
          </div>
        </div>
        <div v-else class="history-empty">暂无聊天记录</div>
      </div>

      <!-- 发送消息 -->
      <div class="send-area">
        <div class="send-title"><span>✍️</span> 发送私信</div>
        <div class="input-row">
          <textarea
            v-model="messageText"
            class="chat-input"
            placeholder="输入私信内容..."
            rows="2"
            @keydown.enter.ctrl="queuePrivateMessage"
          ></textarea>
          <button
            class="send-btn"
            :class="{ disabled: !messageText.trim() }"
            :disabled="!messageText.trim()"
            @click="queuePrivateMessage"
          >
            暂存
          </button>
        </div>
        <div class="send-hint">Ctrl+Enter 暂存 · 消息将在你发送下一条正文消息时一同发出</div>
      </div>

      <!-- 待发送消息提示 -->
      <div v-if="myPendingCount > 0" class="pending-bar">
        <span class="pending-icon">📨</span>
        <span class="pending-text">{{ myPendingCount }}条私信待发送，将随你下条消息送出</span>
        <button class="pending-clear" @click="clearMyPending">取消</button>
      </div>
    </div>

    <!-- 未加微信时的提示 -->
    <div v-else class="no-wechat-hint">
      <span class="hint-icon">📵</span>
      <span class="hint-text">尚未添加微信好友，在对话中与{{ npcName }}互动后添加微信</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../schema';
import { useDataStore } from '../store';
import { useMessageQueue } from '../useMessageQueue';

type NpcData = Schema['NPC状态'][string];

const props = defineProps<{
  npcName: string;
  npc: NpcData;
}>();

const store = useDataStore();
const { pendingMessages, queueMessage, clearPendingMessages } = useMessageQueue();
const messageText = ref('');

// 获取该NPC的私聊记录
const chatHistory = computed(() => {
  return store.data.微信系统.私聊记录?.[props.npcName] || [];
});

// 待发送的此NPC私信数量
const myPendingCount = computed(() => {
  return pendingMessages.value.filter(m => m.type === '私聊' && m.target === props.npcName).length;
});

function queuePrivateMessage() {
  const text = messageText.value.trim();
  if (!text) return;

  queueMessage({
    type: '私聊',
    target: props.npcName,
    content: text,
    timestamp: store.data.时间.当前时间,
  });

  messageText.value = '';
  toastr.info(`私信已暂存，将随下条消息发出`);
}

function clearMyPending() {
  // 只清除针对这个NPC的待发消息（重新注入其余的）
  const remaining = pendingMessages.value.filter(m => !(m.type === '私聊' && m.target === props.npcName));
  clearPendingMessages();
  remaining.forEach(m => queueMessage(m));
}
</script>

<style lang="scss" scoped>
.contact-detail {
  padding: 12px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: linear-gradient(135deg, var(--phone-card), var(--phone-bg));
  border: 1px solid var(--phone-border);
  border-radius: 12px;
  margin-bottom: 12px;
}
.detail-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--phone-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border: 2px solid var(--phone-accent);
  flex-shrink: 0;
}
.detail-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--phone-text);
}
.detail-age {
  font-size: 12px;
  color: var(--phone-text-dim);
  margin-top: 2px;
}
.detail-badges {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}
.badge-resident {
  background: var(--phone-accent-dim);
  color: var(--phone-accent);
}
.badge-wechat {
  background: rgba(16, 185, 129, 0.15);
  color: var(--phone-health);
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.info-card {
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  padding: 10px 12px;
}
.card-label {
  font-size: 10px;
  color: var(--phone-text-muted);
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-icon {
  font-size: 12px;
}
.card-value {
  font-size: 12px;
  color: var(--phone-text);
  line-height: 1.5;
  &.no-ability {
    color: var(--phone-text-muted);
    font-style: italic;
  }
  &.interaction {
    font-size: 11px;
    color: var(--phone-text-dim);
  }
}

// 聊天区
.chat-section {
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  padding: 12px;
}

// 聊天记录
.chat-history {
  margin-bottom: 12px;
}
.history-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--phone-text);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.history-count {
  margin-left: auto;
  font-size: 9px;
  color: var(--phone-text-muted);
  padding: 1px 6px;
  background: var(--phone-bg);
  border-radius: 6px;
}
.history-list {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 4px;
}
.history-msg {
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--phone-bg);
  border: 1px solid var(--phone-border);
  &.msg-self {
    border-color: var(--phone-accent-dim);
    background: rgba(0, 212, 170, 0.05);
  }
}
.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}
.msg-sender {
  font-size: 10px;
  font-weight: 600;
  color: var(--phone-accent);
}
.msg-self .msg-sender {
  color: var(--phone-text);
}
.msg-time {
  font-size: 9px;
  color: var(--phone-text-muted);
}
.msg-body {
  font-size: 11px;
  color: var(--phone-text-dim);
  line-height: 1.5;
}
.history-empty {
  text-align: center;
  color: var(--phone-text-muted);
  font-size: 10px;
  font-style: italic;
  padding: 12px;
}

// 发送区
.send-area {
  margin-bottom: 8px;
}
.send-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--phone-text);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.input-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
.chat-input {
  flex: 1;
  background: var(--phone-bg);
  border: 1px solid var(--phone-border);
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--phone-text);
  font-size: 12px;
  font-family: inherit;
  resize: none;
  outline: none;
  &:focus {
    border-color: var(--phone-accent);
  }
  &::placeholder {
    color: var(--phone-text-muted);
  }
}
.send-btn {
  padding: 8px 16px;
  background: var(--phone-accent);
  color: var(--phone-bg);
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  &:hover:not(.disabled) {
    transform: scale(1.05);
    box-shadow: var(--phone-glow);
  }
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
.send-hint {
  margin-top: 6px;
  font-size: 9px;
  color: var(--phone-text-muted);
  font-style: italic;
}

// 待发送提示
.pending-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: rgba(255, 165, 2, 0.1);
  border: 1px solid rgba(255, 165, 2, 0.3);
  border-radius: var(--phone-radius);
  margin-top: 8px;
}
.pending-icon {
  font-size: 14px;
}
.pending-text {
  flex: 1;
  font-size: 10px;
  color: var(--phone-warning);
  font-weight: 600;
}
.pending-clear {
  padding: 3px 8px;
  background: transparent;
  border: 1px solid var(--phone-warning);
  border-radius: 4px;
  color: var(--phone-warning);
  font-size: 9px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: rgba(255, 165, 2, 0.15);
  }
}

// 未加微信
.no-wechat-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--phone-card);
  border: 1px dashed var(--phone-border);
  border-radius: var(--phone-radius);
}
.hint-icon {
  font-size: 20px;
}
.hint-text {
  font-size: 11px;
  color: var(--phone-text-dim);
}
</style>
