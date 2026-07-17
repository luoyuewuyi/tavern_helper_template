import {
  fieldRules,
  OPENING_CONTRACT_CUSTOMIZED,
  renderOpening,
  type OpeningInput,
} from '../opening-contract';
import { createAndVerifyOpeningMessage, type CreatedOpening } from '../host/message-adapter';
import { readInitialStatData } from '../host/mvu-adapter';
import { Schema } from '../../../schema';

let pending = false;

export async function startGame(input: OpeningInput): Promise<CreatedOpening> {
  if (!OPENING_CONTRACT_CUSTOMIZED) {
    throw new Error('开局契约仍是技能示例；请先替换字段、Schema 路径、校验和正文，再标记为已定制。');
  }
  if (pending) throw new Error('开局正在创建，请勿重复提交。');
  pending = true;

  try {
    const statData = await readInitialStatData();
    for (const rule of fieldRules) {
      const value = rule.parse(input[rule.inputKey]);
      const error = rule.validate(value);
      if (error) throw new Error(error);
      if (!_.has(statData, rule.schemaPath)) {
        throw new Error(`Schema/initvar 中不存在开局映射路径：${rule.schemaPath}`);
      }
      _.set(statData, rule.schemaPath, value);
    }

    // 映射完成后必须重新校验整个快照；只校验单个表单字段不等于符合 Schema。
    const validatedStatData = Schema.parse(statData);
    const opening = renderOpening(input);
    return await createAndVerifyOpeningMessage(opening, validatedStatData);
  } finally {
    pending = false;
  }
}
