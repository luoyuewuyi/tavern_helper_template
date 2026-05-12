import { useDataStore } from './store';

/**
 * 消息队列系统
 * 暂存手机UI中发送的消息，在用户下一次发送正文消息时随之一起注入AI
 */

interface PendingMessage {
  type: '私聊' | '群聊' | '查看群聊';
  target: string; // NPC名或群名
  content: string;
  timestamp: string;
}

// 全局消息队列
const pendingMessages = ref<PendingMessage[]>([]);
const isInjected = ref(false);
let currentInject: { uninject: () => void } | null = null;

/**
 * 添加消息到队列并注入提示词
 */
function queueMessage(msg: PendingMessage) {
  pendingMessages.value.push(msg);
  updateInjection();
}

/**
 * 更新注入的提示词内容（合并所有待发送消息）
 */
function updateInjection() {
  // 先取消旧的注入
  if (currentInject) {
    currentInject.uninject();
    currentInject = null;
  }

  if (pendingMessages.value.length === 0) {
    isInjected.value = false;
    return;
  }

  // 构建注入内容
  const lines = pendingMessages.value.map(msg => {
    if (msg.type === '查看群聊') {
      return `*王寅打开手机微信，查看「${msg.target}」的群聊消息*`;
    } else if (msg.type === '私聊') {
      return `【微信私聊 → ${msg.target}】${msg.content}`;
    } else {
      return `【微信群聊「${msg.target}」发言】${msg.content}`;
    }
  });

  const injectContent = `[用户通过手机发送了以下微信消息，请在本次回复中处理这些消息并推进相关剧情]\n${lines.join('\n')}`;

  // 注入为 user 角色提示词，depth=0 表示最靠近AI回复的位置
  currentInject = injectPrompts(
    [
      {
        id: 'phone-chat-queue',
        position: 'in_chat',
        depth: 0,
        role: 'user',
        content: injectContent,
        should_scan: true,
      },
    ],
    { once: true },
  );

  isInjected.value = true;
}

/**
 * 监听AI生成结束事件，清空队列并保存聊天记录
 */
function setupMessageQueueListener() {
  eventOn(tavern_events.GENERATION_ENDED, () => {
    if (pendingMessages.value.length > 0) {
      // 保存聊天记录到变量
      saveChatHistory();

      // 清空队列
      pendingMessages.value = [];
      isInjected.value = false;
      currentInject = null;
    }
  });
}

/**
 * 将待发送消息保存到 MVU 变量的聊天记录中
 */
function saveChatHistory() {
  try {
    const store = useDataStore();
    for (const msg of pendingMessages.value) {
      if (msg.type === '私聊') {
        // 保存私聊记录
        if (!store.data.微信系统.私聊记录[msg.target]) {
          store.data.微信系统.私聊记录[msg.target] = [];
        }
        store.data.微信系统.私聊记录[msg.target].push({
          发送者: '王寅',
          内容: msg.content,
          时间: msg.timestamp,
        });
        // 截断保留最近20条
        if (store.data.微信系统.私聊记录[msg.target].length > 20) {
          store.data.微信系统.私聊记录[msg.target] = store.data.微信系统.私聊记录[msg.target].slice(-20);
        }
      } else if (msg.type === '群聊') {
        // 保存群聊记录
        if (!store.data.微信系统.群聊记录[msg.target]) {
          store.data.微信系统.群聊记录[msg.target] = [];
        }
        store.data.微信系统.群聊记录[msg.target].push({
          发送者: '王寅',
          内容: msg.content,
          时间: msg.timestamp,
        });
        if (store.data.微信系统.群聊记录[msg.target].length > 20) {
          store.data.微信系统.群聊记录[msg.target] = store.data.微信系统.群聊记录[msg.target].slice(-20);
        }
      }
    }
  } catch (e) {
    console.error('保存聊天记录失败:', e);
  }
}

/**
 * 取消所有待发送消息
 */
function clearPendingMessages() {
  pendingMessages.value = [];
  if (currentInject) {
    currentInject.uninject();
    currentInject = null;
  }
  isInjected.value = false;
}

export function useMessageQueue() {
  return {
    pendingMessages: readonly(pendingMessages),
    isInjected: readonly(isInjected),
    queueMessage,
    clearPendingMessages,
    setupMessageQueueListener,
  };
}
