/** 动态开局固定从新聊天 0 层读取初始化后的 MVU 快照。 */
export const variableOption = Object.freeze({
  type: 'message',
  message_id: 0,
} as const satisfies VariableOption);
