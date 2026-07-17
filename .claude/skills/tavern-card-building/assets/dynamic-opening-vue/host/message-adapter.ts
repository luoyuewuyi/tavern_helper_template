import type { StatData } from './mvu-adapter';

export interface CreatedOpening {
  messageId: number;
  message: string;
  statData: StatData;
}

function assertOpeningBody(message: string): void {
  if (!/<maintext>[\s\S]*\S[\s\S]*<\/maintext>/i.test(message)) {
    throw new Error('开场正文为空或缺少非空 <maintext>。');
  }
}

export async function createAndVerifyOpeningMessage(
  message: string,
  statData: StatData,
): Promise<CreatedOpening> {
  assertOpeningBody(message);
  const previousLastId = getLastMessageId();
  if (previousLastId >= 1) {
    const existingOpening = getChatMessages(`1-${previousLastId}`).find(
      item => _.get(item, 'data.tavern_card_building.kind') === 'dynamic-opening',
    );
    if (existingOpening) throw new Error(`动态开局已创建在第 ${existingOpening.message_id} 层，请勿重复提交。`);
  }
  if (previousLastId !== 0) {
    throw new Error(`动态开局只能在仅含第 0 层的新聊天执行；当前最后楼层为 ${previousLastId}。`);
  }

  await createChatMessages([
    {
      role: 'assistant',
      message,
      data: {
        stat_data: statData,
        tavern_card_building: { kind: 'dynamic-opening', source_message_id: 0 },
      },
    },
  ]);

  const createdId = getLastMessageId();
  if (createdId !== 1) throw new Error(`动态开局应创建第 1 层，实际最后楼层为 ${createdId}。`);

  const created = getChatMessages(createdId)[0];
  if (!created || created.role !== 'assistant') throw new Error('无法回读刚创建的 assistant 开场消息。');
  assertOpeningBody(created.message);

  const createdStatData = _.get(created, 'data.stat_data');
  if (!_.isPlainObject(createdStatData)) throw new Error('新开场消息缺少 data.stat_data。');
  if (!_.isEqual(createdStatData, statData)) throw new Error('新开场消息的 stat_data 与提交快照不一致。');
  if (_.get(created, 'data.tavern_card_building.kind') !== 'dynamic-opening') {
    throw new Error('新开场消息缺少动态开局幂等标记。');
  }

  return { messageId: createdId, message: created.message, statData: createdStatData as StatData };
}
