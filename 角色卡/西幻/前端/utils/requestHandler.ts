import { normalizeStateData } from '../../schema';
import { SessionHostCommandPayload } from '../types';
import { checkAndUpdateChronicle } from './chronicleUpdater';
import {
  buildAssistantMessage,
  extractMaintextFromStream,
  isSessionHostAnchorMessage,
  parseAssistantMessage,
  parseUserRequestPayload,
  SESSION_HOST_MARKER,
} from './messageParser';
import { ensureLatestSessionHostAnchor } from './sessionHost';
import { sanitizeUpdateVariableBlock } from './updateVariableSanitizer';
import { createNormalizedMvuData, readLatestState } from './variableReader';

interface SendSessionHostRequestOptions {
  text?: string;
  commands?: SessionHostCommandPayload[];
  onUserEcho?: (display: string) => void;
  onStream?: (text: string) => void;
  onVariableUpdateStart?: () => void;
}

function composeUserInput(text: string, commands: SessionHostCommandPayload[]) {
  const trimmed = text.trim();
  if (commands.length === 0) {
    return trimmed;
  }

  const parts = [`<SessionHostCommands>${JSON.stringify(commands)}</SessionHostCommands>`];
  if (trimmed) {
    parts.push(`<SessionHostUserText>${trimmed}</SessionHostUserText>`);
  }
  return parts.join('\n');
}

function buildUserDisplay(text: string, commands: SessionHostCommandPayload[]) {
  const trimmed = text.trim();
  if (trimmed) {
    return trimmed;
  }
  return commands.map(command => command.label || command.target).join(' / ');
}

function deriveFallbackOptions() {
  const latestState = readLatestState();
  const labels = latestState.地点.候选动作
    .concat(latestState.场景.候选动作)
    .map(action => action.标签)
    .filter(Boolean);

  return _.uniq(labels).slice(0, 6);
}

export async function sendSessionHostRequest({
  text = '',
  commands = [],
  onUserEcho,
  onStream,
  onVariableUpdateStart,
}: SendSessionHostRequestOptions) {
  const userInput = composeUserInput(text, commands);
  const display = buildUserDisplay(text, commands);

  if (!userInput.trim()) {
    return { ok: false as const, reason: 'empty' };
  }

  const generationId = `west-fantasy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const streamListener = eventOn(iframe_events.STREAM_TOKEN_RECEIVED_FULLY, (fullText, currentId) => {
    if (currentId === generationId) {
      onStream?.(extractMaintextFromStream(fullText));
    }
  });

  try {
    onUserEcho?.(display);
    const raw = await generate({
      user_input: userInput,
      should_stream: true,
      should_silence: true,
      generation_id: generationId,
    });

    const parsed = parseAssistantMessage(raw);
    if (!parsed.maintext) {
      throw new Error('AI 回复缺少 <maintext>');
    }

    const baseData = createNormalizedMvuData();
    const sanitizedUpdateVariable = sanitizeUpdateVariableBlock(
      parsed.updateVariable,
      normalizeStateData(baseData.stat_data),
    );

    if (sanitizedUpdateVariable) {
      onVariableUpdateStart?.();
    }

    const options = parsed.options.length > 0 ? parsed.options : deriveFallbackOptions();
    const assistantMessage = buildAssistantMessage({
      maintext: parsed.maintext,
      options,
      sum: parsed.sum,
      updateVariable: sanitizedUpdateVariable,
    });

    let nextData = baseData;
    if (sanitizedUpdateVariable) {
      try {
        nextData = await Mvu.parseMessage(assistantMessage, baseData);
      } catch (error) {
        console.warn('[west-fantasy-host] 变量更新解析失败，已保留归一化后的旧状态', error);
      }
    }

    nextData.stat_data = normalizeStateData(nextData.stat_data);

    const previousLastId = getLastMessageId();
    const userMessageId = previousLastId + 1;
    const assistantMessageId = previousLastId + 2;
    const sessionHostMessageId = previousLastId + 3;

    await createChatMessages(
      [
        {
          role: 'user',
          message: userInput,
          is_hidden: true,
        },
        {
          role: 'assistant',
          message: assistantMessage,
          data: nextData,
          is_hidden: true,
        },
        {
          role: 'assistant',
          message: SESSION_HOST_MARKER,
          data: nextData,
        },
      ],
      { refresh: 'none' },
    );

    await Mvu.replaceMvuData(nextData, { type: 'message', message_id: userMessageId });
    await Mvu.replaceMvuData(nextData, { type: 'message', message_id: assistantMessageId });
    await Mvu.replaceMvuData(nextData, { type: 'message', message_id: sessionHostMessageId });
    await ensureLatestSessionHostAnchor();

    setTimeout(() => {
      void checkAndUpdateChronicle(assistantMessageId);
    }, 500);

    return {
      ok: true as const,
      assistantMessage,
      nextState: normalizeStateData(nextData.stat_data),
    };
  } finally {
    streamListener.stop();
  }
}

function cloneChatMessage(message: ChatMessage) {
  return {
    role: message.role,
    name: message.name,
    message: message.message,
    is_hidden: message.is_hidden,
    data: _.cloneDeep(message.data),
    extra: _.cloneDeep(message.extra),
  };
}

async function restoreDeletedTurn(messages: ChatMessage[]) {
  if (messages.length === 0) {
    return;
  }

  const previousLastId = getLastMessageId();
  await createChatMessages(messages.map(cloneChatMessage), { refresh: 'none' });

  await Promise.all(
    messages.map((message, index) =>
      Mvu.replaceMvuData(_.cloneDeep(message.data), {
        type: 'message',
        message_id: previousLastId + index + 1,
      }),
    ),
  );

  await ensureLatestSessionHostAnchor();
}

function readRegenerateTurn(assistantMessageId: number) {
  const userMessage = getChatMessages(assistantMessageId - 1, {
    hide_state: 'all',
    role: 'all',
  })[0];
  const assistantMessage = getChatMessages(assistantMessageId, {
    hide_state: 'all',
    role: 'all',
  })[0];
  const sessionHostMessage = getChatMessages(assistantMessageId + 1, {
    hide_state: 'all',
    role: 'all',
  })[0];

  if (!assistantMessage || assistantMessage.role !== 'assistant' || isSessionHostAnchorMessage(assistantMessage.message)) {
    throw new Error('当前楼层不是可重生成的叙事楼层');
  }

  if (!userMessage || userMessage.role !== 'user') {
    throw new Error('当前楼层前没有可回放的用户输入');
  }

  const parsedUser = parseUserRequestPayload(userMessage.message);
  if (!parsedUser.text.trim() && parsedUser.commands.length === 0) {
    throw new Error('上一轮缺少可重放的输入内容');
  }

  const turnMessages = [userMessage, assistantMessage];
  if (sessionHostMessage?.role === 'assistant' && isSessionHostAnchorMessage(sessionHostMessage.message)) {
    turnMessages.push(sessionHostMessage);
  }

  return {
    text: parsedUser.text,
    commands: parsedUser.commands,
    deleteIds: turnMessages.map(message => message.message_id),
    backupMessages: turnMessages,
  };
}

export async function regenerateSessionHostTurn(
  assistantMessageId: number,
  options: Omit<SendSessionHostRequestOptions, 'text' | 'commands'> = {},
) {
  const turn = readRegenerateTurn(assistantMessageId);

  await deleteChatMessages(turn.deleteIds, { refresh: 'none' });

  try {
    return await sendSessionHostRequest({
      ...options,
      text: turn.text,
      commands: turn.commands,
    });
  } catch (error) {
    await restoreDeletedTurn(turn.backupMessages);
    throw error;
  }
}
