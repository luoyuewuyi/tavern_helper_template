export const STATUS_FIELDS = [
  '日期',
  '时间',
  '地点',
  '天气',
  '地图描述',
  '角色名',
  '好感度',
  '服从度',
  '健康值',
  '性欲值',
  '饱腹值',
  '理智值',
  '关系',
  '上衣',
  '下衣',
  '鞋子',
  '配饰',
  '妆容',
  '嘴巴',
  '胸部',
  '手部',
  '发型',
  '腹部',
  '阴部',
  '大腿',
  '脚部',
  '尾巴',
  '耳朵',
  '姿势',
  '行为',
  '性次数',
  '怀孕状态',
  '怀孕可能',
  '精液量',
  '胸部开发',
  '小穴开发',
  '肛门开发',
  '尾巴开发',
  '体味',
  '状态描写',
  '独白',
] as const;

export type StatusField = (typeof STATUS_FIELDS)[number];
export type StatusData = Record<StatusField, string>;

const DEFAULTS: StatusData = {
  日期: '未知',
  时间: '未知',
  地点: '未知',
  天气: '未知',
  地图描述: '无',
  角色名: '未命名',
  好感度: '0',
  服从度: '0',
  健康值: '0',
  性欲值: '0',
  饱腹值: '0',
  理智值: '0',
  关系: '未知',
  上衣: '无',
  下衣: '无',
  鞋子: '无',
  配饰: '无',
  妆容: '无',
  嘴巴: '无',
  胸部: '无',
  手部: '无',
  发型: '无',
  腹部: '无',
  阴部: '无',
  大腿: '无',
  脚部: '无',
  尾巴: '无',
  耳朵: '无',
  姿势: '无',
  行为: '无',
  性次数: '0',
  怀孕状态: '未怀孕',
  怀孕可能: '极低',
  精液量: '无',
  胸部开发: '0',
  小穴开发: '0',
  肛门开发: '0',
  尾巴开发: '0',
  体味: '无',
  状态描写: '无',
  独白: '无',
};

const NUMERIC_MAX: Partial<Record<StatusField, number>> = {
  好感度: 1000,
  服从度: 100,
  健康值: 100,
  性欲值: 100,
  饱腹值: 100,
  理智值: 100,
  性次数: 9999,
  胸部开发: 100,
  小穴开发: 100,
  肛门开发: 100,
  尾巴开发: 100,
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractStatusBlock(message: string) {
  const wrappedMatch = message.match(
    /(?:<StatusBlock>\s*<details>\s*<summary>[\s\S]*?<\/summary>\s*)?(?:```[^\n]*\s*)?(<状态栏>[\s\S]*?<\/状态栏>)(?:\s*```)?(?:\s*<\/details>\s*<\/StatusBlock>)?\s*$/i,
  );
  if (wrappedMatch?.[1]) {
    return wrappedMatch[1];
  }

  const plainMatches = [...message.matchAll(/<状态栏>[\s\S]*?<\/状态栏>/gi)];
  return plainMatches.at(-1)?.[0] ?? null;
}

function readField(block: string, field: StatusField, nextField?: StatusField) {
  const escapedField = escapeRegExp(field);
  const nextAnchor = nextField ? `<${escapeRegExp(nextField)}>` : '</状态栏>';
  const match = block.match(
    new RegExp(`<${escapedField}>\\s*([\\s\\S]*?)(?=\\s*<\\/${escapedField}>|\\s*${nextAnchor})`, 'i'),
  );

  const raw = match?.[1] ?? '';
  const cleaned = raw.replace(/\s*<\/[^>]+>\s*$/g, '').trim();
  return cleaned || DEFAULTS[field];
}

function normalizeValue(field: StatusField, value: string) {
  const max = NUMERIC_MAX[field];
  if (max === undefined) {
    return value || DEFAULTS[field];
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    return DEFAULTS[field];
  }

  return String(Math.max(0, Math.min(max, parsed)));
}

export function parseStatusMessage(message: string): StatusData {
  const block = extractStatusBlock(message);
  if (!block) {
    return { ...DEFAULTS };
  }

  const data = {} as StatusData;
  STATUS_FIELDS.forEach((field, index) => {
    const value = readField(block, field, STATUS_FIELDS[index + 1]);
    data[field] = normalizeValue(field, value);
  });

  return data;
}

export function readStatusDataFromCurrentMessage() {
  const messageId = getCurrentMessageId();
  const message = getChatMessages(messageId)[0]?.message ?? '';
  return parseStatusMessage(message);
}

export function getMetricValue(data: StatusData, field: StatusField) {
  const value = Number.parseFloat(data[field]);
  return Number.isFinite(value) ? value : 0;
}
