import { StatusData } from './StatusPanel';

const STATUS_FIELD_COUNT = 27;

function clean(value: string | undefined) {
  const text = (value ?? '').trim();
  return text === '-' ? '' : text;
}

function toNumber(value: string | undefined, fallback = 0) {
  const parsed = Number.parseInt(clean(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toList(value: string | undefined) {
  return clean(value)
    .split(/[,，]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function toActions(value: string | undefined) {
  return clean(value)
    .split(/[;；]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function hasUnexpandedPlaceholder(fields: string[]) {
  return fields.some(field => /^\$\d+$/.test(field.trim()));
}

export function parseStatusFields(fields: string[]): StatusData | null {
  if (fields.length < STATUS_FIELD_COUNT || hasUnexpandedPlaceholder(fields)) return null;
  const normalized = fields.slice(0, STATUS_FIELD_COUNT - 1);
  normalized.push(fields.slice(STATUS_FIELD_COUNT - 1).join('|'));

  return {
    basicInfo: {
      name: clean(normalized[0]),
      level: toNumber(normalized[1]),
      raceClass: clean(normalized[2]),
    },
    godInfo: {
      godName: clean(normalized[3]),
      graceLevel: clean(normalized[4]),
      ruleStatus: clean(normalized[5]),
    },
    attributes: {
      str: { val: toNumber(normalized[6]), max: 20 },
      agi: { val: toNumber(normalized[7]), max: 20 },
      mag: { val: toNumber(normalized[8]), max: 20 },
      con: { val: toNumber(normalized[9]), max: 20 },
      per: { val: toNumber(normalized[10]), max: 20 },
    },
    evolution: {
      form: clean(normalized[11]),
      nextGoal: clean(normalized[12]),
      geneProgress: toNumber(normalized[13]),
    },
    infamy: {
      level: toNumber(normalized[14]),
      status: clean(normalized[15]),
    },
    lair: {
      level: clean(normalized[16]),
      population: clean(normalized[17]),
      buildings: toList(normalized[18]),
    },
    location: {
      place: clean(normalized[19]),
      terrainBuff: clean(normalized[20]),
    },
    special: {
      marks: toList(normalized[21]),
      mutations: toList(normalized[22]),
      buffs: toList(normalized[23]),
    },
    captives: {
      count: toNumber(normalized[24]),
      corrupted: toNumber(normalized[25]),
    },
    actions: toActions(normalized[26]),
  };
}

export function parseStatusLine(raw: string | null | undefined): StatusData | null {
  if (!raw) return null;
  const line = raw.match(/\[STATUS\]\s*([^\r\n]+)/)?.[1] ?? raw;
  const fields = line.split('|').map(field => field.trim());
  return parseStatusFields(fields);
}

function parseJsonData(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as StatusData;
  } catch {
    return null;
  }
}

function fromParams(params: URLSearchParams) {
  return (
    parseJsonData(params.get('data')) ??
    parseStatusLine(params.get('status')) ??
    parseStatusLine(params.get('status_line')) ??
    parseStatusLine(params.get('fields'))
  );
}

function readTextSource(element: Element | null) {
  if (!element) return null;
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    return element.value;
  }
  return element.textContent;
}

function readFromCurrentDocument() {
  const source = readTextSource(document.getElementById('status-source'));
  return parseStatusLine(source) ?? parseStatusLine(document.body?.dataset.status);
}

function readFromParentDocument() {
  try {
    const frame = window.frameElement;
    const direct =
      frame?.getAttribute('data-status') ??
      frame?.getAttribute('data-status-line') ??
      frame?.getAttribute('data-fields');
    const fromFrame = parseStatusLine(direct);
    if (fromFrame) return fromFrame;

    let node = frame?.parentElement ?? null;
    for (let depth = 0; node && depth < 6; depth += 1) {
      const parsed = parseStatusLine(node.textContent);
      if (parsed) return parsed;
      node = node.parentElement;
    }
  } catch {
    return null;
  }
  return null;
}

export function readInitialStatusData() {
  const search = fromParams(new URLSearchParams(window.location.search));
  if (search) return search;

  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  const hashData = fromParams(new URLSearchParams(hash));
  if (hashData) return hashData;

  return readFromCurrentDocument() ?? parseStatusLine(window.name) ?? readFromParentDocument();
}

export function parseIncomingStatusMessage(message: unknown) {
  if (typeof message === 'string') return parseStatusLine(message);
  if (!message || typeof message !== 'object') return null;

  const payload = message as { type?: string; data?: unknown; status?: string; status_line?: string; fields?: string[] };
  if (payload.type && !['status', 'status-line', 'status_line'].includes(payload.type)) return null;
  if (Array.isArray(payload.fields)) return parseStatusFields(payload.fields);
  if (typeof payload.data === 'string') return parseJsonData(payload.data) ?? parseStatusLine(payload.data);
  if (payload.data && typeof payload.data === 'object') return payload.data as StatusData;
  return parseStatusLine(payload.status ?? payload.status_line);
}
