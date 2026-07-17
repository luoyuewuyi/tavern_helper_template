export const messageId = getCurrentMessageId();

export const variableOption = Object.freeze({
  type: 'message',
  message_id: messageId,
} as const satisfies VariableOption);
