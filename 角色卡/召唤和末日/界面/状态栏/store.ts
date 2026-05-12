import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

const storeDefinitions = new Map<number, ReturnType<typeof defineMvuDataStore<typeof Schema>>>();

function resolveMessageId() {
  const messageId = getCurrentMessageId();
  return messageId === undefined || messageId === 'latest' ? -1 : messageId;
}

export function useDataStore() {
  const messageId = resolveMessageId();
  if (!storeDefinitions.has(messageId)) {
    storeDefinitions.set(
      messageId,
      defineMvuDataStore(Schema, { type: 'message', message_id: messageId }),
    );
  }
  return storeDefinitions.get(messageId)!();
}
