import { SESSION_HOST_MARKER, isSessionHostAnchorMessage } from './messageParser';

function readChatMessages() {
  const lastMessageId = getLastMessageId();
  if (lastMessageId < 0) {
    return [] as ChatMessage[];
  }

  return getChatMessages(`0-${lastMessageId}`, {
    role: 'all',
    hide_state: 'all',
  });
}

function readNarrativeMessages(messages: ChatMessage[]) {
  return messages.filter(
    message => (message.role === 'assistant' || message.role === 'user') && !isSessionHostAnchorMessage(message.message),
  );
}

export async function ensureLatestSessionHostAnchor() {
  const messages = readChatMessages();
  if (messages.length === 0) {
    return false;
  }

  const anchorMessages = messages.filter(
    message => message.role === 'assistant' && isSessionHostAnchorMessage(message.message),
  );
  const narrativeMessages = readNarrativeMessages(messages);
  const latestAnchor = anchorMessages.at(-1) ?? null;
  const latestMessageId = messages.at(-1)?.message_id ?? -1;

  if (
    narrativeMessages.length === 0 &&
    latestAnchor &&
    anchorMessages.length === 1 &&
    latestAnchor.message_id === latestMessageId &&
    !latestAnchor.is_hidden
  ) {
    return false;
  }

  const updates: Array<{ message_id: number; message?: string; is_hidden?: boolean }> = [];
  let latestAnchorId = latestAnchor?.message_id ?? null;

  if (narrativeMessages.length > 0 && (latestAnchorId === null || latestAnchorId < latestMessageId)) {
    const nextData = _.cloneDeep(Mvu.getMvuData({ type: 'message', message_id: 'latest' }));
    const previousLastMessageId = getLastMessageId();

    await createChatMessages(
      [
        {
          role: 'assistant',
          message: SESSION_HOST_MARKER,
          data: nextData,
          is_hidden: false,
        },
      ],
      { refresh: 'none' },
    );

    latestAnchorId = previousLastMessageId + 1;
    await Mvu.replaceMvuData(nextData, { type: 'message', message_id: latestAnchorId });
    updates.push({
      message_id: latestAnchorId,
      message: SESSION_HOST_MARKER,
      is_hidden: false,
    });
  }

  if (latestAnchorId === null) {
    return updates.length > 0;
  }

  for (const message of messages) {
    if (message.message_id === latestAnchorId) {
      if (message.is_hidden || !isSessionHostAnchorMessage(message.message)) {
        updates.push({
          message_id: message.message_id,
          message: SESSION_HOST_MARKER,
          is_hidden: false,
        });
      }
      continue;
    }

    if (isSessionHostAnchorMessage(message.message)) {
      if (!message.is_hidden) {
        updates.push({
          message_id: message.message_id,
          is_hidden: true,
        });
      }
      continue;
    }

    if ((message.role === 'assistant' || message.role === 'user') && !message.is_hidden) {
      updates.push({
        message_id: message.message_id,
        is_hidden: true,
      });
    }
  }

  if (updates.length === 0) {
    return false;
  }

  await setChatMessages(_.uniqBy(updates, 'message_id'), { refresh: 'all' });
  return true;
}
