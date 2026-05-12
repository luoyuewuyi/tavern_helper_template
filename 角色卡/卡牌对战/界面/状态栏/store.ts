import { defineStore } from 'pinia';

export interface CardItem {
  raw: string;
  name: string;
  meta: string[];
  effect: string;
}

export interface StatusData {
  姓名: string;
  性别: string;
  等级: string;
  职业: string;
  天赋: string;
  当前血量: number;
  最大血量: number;
  法力上限: string;
  金币: string;
  位置: string;
  时间: string;
  当前牌组: number;
  最大牌组: number;
  所有卡牌: CardItem[];
  随从训练: string;
  当前任务: string;
}

export interface OptionItem {
  label: string;
  text: string;
}

const STATUS_KEYS = new Set([
  '姓名',
  '性别',
  '等级',
  '职业',
  '天赋',
  '血量',
  '法力上限',
  '金币',
  '位置',
  '时间',
  '牌组',
  '所有卡牌',
  '随从训练',
  '当前任务',
]);

function extractBlock(message: string, tag: 'status_data' | 'option_list') {
  const match = message.match(new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*<\\/${tag}>`, 'i'));
  return match?.[1] ?? null;
}

function parseCardLine(line: string): CardItem | null {
  const normalized = line.replace(/^[-•]\s*/, '').trim();
  if (!normalized || normalized === '无') return null;

  const segments = normalized
    .split(/[｜|]/)
    .map(segment => segment.trim())
    .filter(Boolean);

  if (segments.length === 0) return null;

  const [name, ...rest] = segments;
  const meta: string[] = [];
  let effect = '';

  for (const segment of rest) {
    if (segment.startsWith('效果：')) {
      effect = segment.slice('效果：'.length).trim();
      continue;
    }
    meta.push(segment);
  }

  if (!effect) {
    const inlineEffectMatch = normalized.match(/效果：(.*)$/);
    effect = inlineEffectMatch?.[1]?.trim() ?? '';
  }

  return {
    raw: normalized,
    name,
    meta,
    effect: effect || '未注明效果',
  };
}

function parseStatusBlock(block: string): StatusData | null {
  const scalarValues = new Map<string, string>();
  const cardLines: string[] = [];
  let currentKey = '';

  for (const rawLine of block.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const labeledMatch = line.match(/^([^：]+)：(.*)$/);
    if (labeledMatch) {
      const [, key, value] = labeledMatch;
      if (!STATUS_KEYS.has(key)) {
        if (currentKey === '所有卡牌') {
          cardLines.push(line);
        }
        continue;
      }

      currentKey = key;
      if (key === '所有卡牌') {
        if (value.trim() && value.trim() !== '无') {
          cardLines.push(value.trim());
        }
        continue;
      }

      scalarValues.set(key, value.trim());
      continue;
    }

    if (currentKey === '所有卡牌') {
      cardLines.push(line);
    }
  }

  const 姓名 = scalarValues.get('姓名');
  const 性别 = scalarValues.get('性别');
  const 等级 = scalarValues.get('等级');
  const 职业 = scalarValues.get('职业');
  const 天赋 = scalarValues.get('天赋');
  const 血量 = scalarValues.get('血量');
  const 法力上限 = scalarValues.get('法力上限');
  const 金币 = scalarValues.get('金币');
  const 位置 = scalarValues.get('位置');
  const 时间 = scalarValues.get('时间');
  const 牌组 = scalarValues.get('牌组');
  const 随从训练 = scalarValues.get('随从训练');
  const 当前任务 = scalarValues.get('当前任务');

  if (!姓名 || !性别 || !等级 || !职业 || !天赋 || !血量 || !法力上限 || !金币 || !位置 || !时间 || !牌组 || !随从训练 || !当前任务) {
    return null;
  }

  const bloodMatch = 血量.match(/^(\d+)\s*\/\s*(\d+)$/);
  const deckMatch = 牌组.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!bloodMatch || !deckMatch) {
    return null;
  }

  return {
    姓名,
    性别,
    等级,
    职业,
    天赋,
    当前血量: Number.parseInt(bloodMatch[1], 10),
    最大血量: Number.parseInt(bloodMatch[2], 10),
    法力上限,
    金币,
    位置,
    时间,
    当前牌组: Number.parseInt(deckMatch[1], 10),
    最大牌组: Number.parseInt(deckMatch[2], 10),
    所有卡牌: cardLines.map(parseCardLine).filter((item): item is CardItem => item !== null),
    随从训练,
    当前任务,
  };
}

function parseOptionsBlock(block: string): OptionItem[] {
  return block
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.match(/^选项([A-Z])：(.*)$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map(match => ({
      label: match[1],
      text: match[2].trim(),
    }));
}

function parseStatusFromMessage(message: string): { status: StatusData | null; options: OptionItem[] } {
  const statusBlock = extractBlock(message, 'status_data');
  const optionsBlock = extractBlock(message, 'option_list');

  const status = statusBlock ? parseStatusBlock(statusBlock) : null;
  const options = optionsBlock ? parseOptionsBlock(optionsBlock) : [];

  return { status, options };
}

export const useStatusStore = defineStore('status', () => {
  const status = ref<StatusData | null>(null);
  const options = ref<OptionItem[]>([]);

  function loadFromMessage() {
    const msg_id = getCurrentMessageId();
    if (msg_id === undefined) return;
    const msgs = getChatMessages(msg_id);
    if (!msgs || msgs.length === 0) return;

    const result = parseStatusFromMessage(msgs[0].message);
    status.value = result.status;
    options.value = result.options;
  }

  loadFromMessage();

  return { status, options, loadFromMessage };
});
