export interface OpeningInput {
  era: string;
  region: string;
}

/** 只有字段、路径、校验和正文全部替换为目标卡真实契约后才改为 true。 */
export const OPENING_CONTRACT_CUSTOMIZED = false;

export interface OpeningFieldRule {
  inputKey: keyof OpeningInput;
  schemaPath: string;
  label: string;
  /** 把表单原始值解析成 Schema 需要的业务类型；数值/布尔值不能留作字符串。 */
  parse: (rawValue: OpeningInput[keyof OpeningInput]) => unknown;
  validate: (parsedValue: unknown) => string | null;
}

function parseShortText(rawValue: OpeningInput[keyof OpeningInput]): string {
  return String(rawValue ?? '').trim();
}

function validateShortText(value: unknown, label: string): string | null {
  if (typeof value !== 'string' || !value) return `请选择或填写${label}`;
  if (value.length > 80) return `${label}不能超过 80 个字符`;
  return null;
}

/** 只用于 XML/HTML 文本节点；属性值需要单独、按目标上下文转义。 */
export function escapeMarkupText(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/**
 * 这是可运行的结构示例，不是可直接交付的角色内容。
 * 复制后必须按目标卡 Schema 与开场设定替换字段、路径、选项和正文。
 */
export const fieldRules: readonly OpeningFieldRule[] = [
  {
    inputKey: 'era',
    schemaPath: '世界.时代',
    label: '时代',
    parse: parseShortText,
    validate: value => validateShortText(value, '时代'),
  },
  {
    inputKey: 'region',
    schemaPath: '世界.地区',
    label: '地区',
    parse: parseShortText,
    validate: value => validateShortText(value, '地区'),
  },
];

export function renderOpening(input: OpeningInput): string {
  const era = escapeMarkupText(input.era.trim());
  const region = escapeMarkupText(input.region.trim());
  return `<maintext>故事从${era}的${region}开始。玩家此刻可以观察环境、与眼前人物交谈或立即行动。</maintext>`;
}
