<template>
  <div class="group-chat">
    <!-- 群聊列表 -->
    <div v-if="!activeGroup" class="group-list">
      <div class="list-header">
        <span class="header-icon">💬</span>
        <span class="header-title">群聊列表</span>
        <span class="group-count">{{ Object.keys(data.微信系统.群聊).length }}个群</span>
      </div>

      <div
        v-for="(group, name) in data.微信系统.群聊"
        :key="name as string"
        class="group-item"
        @click="openGroup(name as string)"
      >
        <div class="group-avatar"><span>👥</span></div>
        <div class="group-info">
          <div class="group-name">{{ name }}</div>
          <div class="group-preview">{{ group.简要消息记录 }}</div>
        </div>
        <span class="group-arrow">›</span>
      </div>

      <!-- 添加群聊 -->
      <div class="add-group-section">
        <div v-if="!showAddGroup" class="add-btn" @click="showAddGroup = true"><span>➕</span> 添加新群聊</div>
        <div v-else class="add-form">
          <input v-model="newGroupName" class="add-input" placeholder="输入群聊名称" @keydown.enter="addNewGroup" />
          <input
            v-model="newGroupSetting"
            class="add-input"
            placeholder="输入群设定（如：某学校全体学生实名群聊）"
            @keydown.enter="addNewGroup"
          />
          <div class="add-actions">
            <button class="action-btn cancel" @click="showAddGroup = false">取消</button>
            <button class="action-btn confirm" :disabled="!newGroupName.trim()" @click="addNewGroup">创建群聊</button>
          </div>
        </div>
      </div>

      <!-- 全局待发送提示 -->
      <div v-if="totalPending > 0" class="pending-global">
        <span>📨</span>
        <span>共{{ totalPending }}条消息待发送</span>
        <button @click="clearPendingMessages">全部取消</button>
      </div>
    </div>

    <!-- 群聊详情 -->
    <div v-else class="group-detail">
      <div class="detail-header-bar" @click="activeGroup = null">
        <span class="back-icon">‹</span>
        <span class="detail-title">{{ activeGroup }}</span>
      </div>

      <!-- 群设定 -->
      <div class="setting-card">
        <div class="setting-label"><span>⚙️</span> 群设定</div>
        <div class="setting-value">{{ data.微信系统.群聊[activeGroup]?.群设定 || '暂无设定' }}</div>
      </div>

      <!-- 聊天记录 -->
      <div class="chat-history">
        <div class="history-title">
          <span>📋</span> 群聊记录
          <span class="history-count">{{ groupHistory.length }}/20</span>
        </div>
        <div v-if="groupHistory.length > 0" class="history-list">
          <div
            v-for="(msg, i) in groupHistory"
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
        <div v-else class="history-empty">暂无群聊记录</div>
      </div>

      <!-- 查看群聊 -->
      <button class="view-chat-btn" @click="queueViewGroupChat">
        <span>👁️</span> 查看最新群聊消息（随下条消息发出）
      </button>

      <!-- 发送群消息 -->
      <div class="send-section">
        <div class="send-title"><span>✍️</span> 在群里发消息</div>
        <div class="input-row">
          <textarea
            v-model="groupMessageText"
            class="send-input"
            placeholder="输入群消息内容..."
            rows="2"
            @keydown.enter.ctrl="queueGroupMessage"
          ></textarea>
          <button
            class="send-btn"
            :class="{ disabled: !groupMessageText.trim() }"
            :disabled="!groupMessageText.trim()"
            @click="queueGroupMessage"
          >
            暂存
          </button>
        </div>
        <div class="send-hint">Ctrl+Enter 暂存 · 消息将在你发送下一条正文消息时一同发出</div>
      </div>

      <!-- 待发送提示 -->
      <div v-if="myPendingCount > 0" class="pending-bar">
        <span class="pending-icon">📨</span>
        <span class="pending-text">{{ myPendingCount }}条消息待发送</span>
        <button class="pending-clear" @click="clearMyPending">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../schema';
import { useDataStore } from '../store';
import { useMessageQueue } from '../useMessageQueue';

const props = defineProps<{ data: Schema }>();

const store = useDataStore();
const { pendingMessages, queueMessage, clearPendingMessages } = useMessageQueue();
const activeGroup = ref<string | null>(null);
const groupMessageText = ref('');
const showAddGroup = ref(false);
const newGroupName = ref('');
const newGroupSetting = ref('');

// 当前群的聊天记录
const groupHistory = computed(() => {
  if (!activeGroup.value) return [];
  return store.data.微信系统.群聊记录?.[activeGroup.value] || [];
});

// 当前群的待发送消息数
const myPendingCount = computed(() => {
  if (!activeGroup.value) return 0;
  return pendingMessages.value.filter(
    m => (m.type === '群聊' || m.type === '查看群聊') && m.target === activeGroup.value,
  ).length;
});

// 全局待发送总数
const totalPending = computed(() => pendingMessages.value.length);

function openGroup(name: string) {
  activeGroup.value = name;
}

function queueViewGroupChat() {
  if (!activeGroup.value) return;
  queueMessage({
    type: '查看群聊',
    target: activeGroup.value,
    content: '',
    timestamp: store.data.时间.当前时间,
  });
  toastr.info(`查看群聊请求已暂存，将随下条消息发出`);
}

function queueGroupMessage() {
  const text = groupMessageText.value.trim();
  if (!text || !activeGroup.value) return;

  queueMessage({
    type: '群聊',
    target: activeGroup.value,
    content: text,
    timestamp: store.data.时间.当前时间,
  });

  groupMessageText.value = '';
  toastr.info(`群消息已暂存，将随下条消息发出`);
}

function clearMyPending() {
  if (!activeGroup.value) return;
  const groupName = activeGroup.value;
  const remaining = pendingMessages.value.filter(
    m => !((m.type === '群聊' || m.type === '查看群聊') && m.target === groupName),
  );
  clearPendingMessages();
  remaining.forEach(m => queueMessage(m));
}

function addNewGroup() {
  const name = newGroupName.value.trim();
  const setting = newGroupSetting.value.trim() || '自定义群聊';
  if (!name) return;

  store.data.微信系统.群聊[name] = {
    群设定: setting,
    简要消息记录: '群聊刚创建，暂无消息',
  };

  newGroupName.value = '';
  newGroupSetting.value = '';
  showAddGroup.value = false;
  toastr.success(`群聊「${name}」创建成功！`);
}
</script>

<style lang="scss" scoped>
.group-chat {
  padding: 12px;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--phone-border);
}
.header-icon {
  font-size: 16px;
}
.header-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--phone-text);
  flex: 1;
}
.group-count {
  font-size: 10px;
  color: var(--phone-text-dim);
  padding: 2px 8px;
  background: var(--phone-card);
  border-radius: 8px;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 6px;
  &:hover {
    border-color: var(--phone-accent);
    transform: translateX(4px);
  }
}
.group-avatar {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a4a8a, #102d55);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.group-info {
  flex: 1;
  min-width: 0;
}
.group-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--phone-text);
}
.group-preview {
  font-size: 10px;
  color: var(--phone-text-muted);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.group-arrow {
  color: var(--phone-text-muted);
  font-size: 18px;
  flex-shrink: 0;
}

// 添加群聊
.add-group-section {
  margin-top: 10px;
}
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: var(--phone-bg);
  border: 1px dashed var(--phone-border);
  border-radius: var(--phone-radius);
  cursor: pointer;
  color: var(--phone-text-dim);
  font-size: 12px;
  &:hover {
    border-color: var(--phone-accent);
    color: var(--phone-accent);
  }
}
.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
}
.add-input {
  width: 100%;
  padding: 8px 10px;
  background: var(--phone-bg);
  border: 1px solid var(--phone-border);
  border-radius: 6px;
  color: var(--phone-text);
  font-size: 12px;
  font-family: inherit;
  outline: none;
  &:focus {
    border-color: var(--phone-accent);
  }
  &::placeholder {
    color: var(--phone-text-muted);
  }
}
.add-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.action-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  &.cancel {
    background: var(--phone-border);
    color: var(--phone-text-dim);
  }
  &.confirm {
    background: var(--phone-accent);
    color: var(--phone-bg);
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}

// 全局待发送
.pending-global {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px;
  margin-top: 10px;
  background: rgba(255, 165, 2, 0.1);
  border: 1px solid rgba(255, 165, 2, 0.3);
  border-radius: var(--phone-radius);
  font-size: 11px;
  color: var(--phone-warning);
  button {
    margin-left: auto;
    padding: 3px 8px;
    background: transparent;
    border: 1px solid var(--phone-warning);
    border-radius: 4px;
    color: var(--phone-warning);
    font-size: 9px;
    cursor: pointer;
    font-weight: 600;
  }
}

// 群详情
.detail-header-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  color: var(--phone-accent);
  &:hover {
    color: var(--phone-text);
  }
}
.back-icon {
  font-size: 20px;
}
.detail-title {
  font-size: 14px;
  font-weight: 700;
}

.setting-card {
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  padding: 10px 12px;
  margin-bottom: 8px;
}
.setting-label {
  font-size: 10px;
  color: var(--phone-text-muted);
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.setting-value {
  font-size: 12px;
  color: var(--phone-text);
  line-height: 1.5;
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

// 查看群聊按钮
.view-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: var(--phone-card);
  border: 1px solid var(--phone-accent);
  border-radius: var(--phone-radius);
  color: var(--phone-accent);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  &:hover {
    background: var(--phone-accent);
    color: var(--phone-bg);
  }
}

// 发送区
.send-section {
  background: var(--phone-card);
  border: 1px solid var(--phone-border);
  border-radius: var(--phone-radius);
  padding: 12px;
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
.send-input {
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
</style>
