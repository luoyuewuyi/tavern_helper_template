import { ParsedAssistantMessage, SessionHostCommandPayload } from '../types';

export const SESSION_HOST_MARKER = '<WestFantasySessionHost/>';
const SESSION_HOST_COMMAND_TAG = 'SessionHostCommands';
const SESSION_HOST_USER_TEXT_TAG = 'SessionHostUserText';

function trimBlock(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function extractAllTagContents(source: string, tag: string) {
  const matcher = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  return [...source.matchAll(matcher)].map(match => trimBlock(match[1])).filter(Boolean);
}

function extractLastTag(source: string, tag: string) {
  const matches = extractAllTagContents(source, tag);
  return matches.at(-1) ?? null;
}

export function stripThinkingBlocks(source: string) {
  return source
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<thinking>[\s\S]*$/gi, '')
    .trim();
}

function stripKnownBlocks(source: string) {
  return stripThinkingBlocks(source)
    .replace(/<maintext>[\s\S]*?<\/maintext>/gi, '')
    .replace(/<option>[\s\S]*?<\/option>/gi, '')
    .replace(/<sum>[\s\S]*?<\/sum>/gi, '')
    .replace(/<updatevariable>[\s\S]*?<\/updatevariable>/gi, '')
    .replace(/<analysis>[\s\S]*?<\/analysis>/gi, '')
    .replace(/<jsonpatch>[\s\S]*?<\/jsonpatch>/gi, '')
    .trim();
}

export function parseOptionLines(source: string | null | undefined) {
  const text = trimBlock(source);
  if (!text) {
    return [];
  }

  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/^[*\d一二三四五六七八九十、.）)\s-]+/u, '').trim())
    .filter(Boolean);
}

function stripHtmlLikeTags(source: string) {
  return source
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseAssistantMessage(raw: string): ParsedAssistantMessage {
  const sanitized = stripThinkingBlocks(raw);
  const maintext = extractLastTag(sanitized, 'maintext') ?? stripHtmlLikeTags(stripKnownBlocks(sanitized));
  const optionText = extractLastTag(sanitized, 'option');
  const sum = extractLastTag(sanitized, 'sum');
  const updateVariable = extractLastTag(sanitized, 'UpdateVariable');

  return {
    maintext: trimBlock(maintext),
    options: parseOptionLines(optionText),
    sum,
    updateVariable,
    raw,
  };
}

export function isSessionHostAnchorMessage(raw: string) {
  return trimBlock(raw) === SESSION_HOST_MARKER;
}

export function extractMaintextFromStream(raw: string) {
  const sanitized = stripThinkingBlocks(raw);
  const complete = extractLastTag(sanitized, 'maintext');
  if (complete) {
    return complete;
  }

  const openIndex = sanitized.toLowerCase().lastIndexOf('<maintext>');
  if (openIndex >= 0) {
    return stripHtmlLikeTags(sanitized.slice(openIndex + '<maintext>'.length));
  }

  return stripHtmlLikeTags(stripKnownBlocks(sanitized));
}

export function buildAssistantMessage(payload: {
  maintext: string;
  options: string[];
  sum?: string | null;
  updateVariable?: string | null;
}) {
  const parts = [
    `<maintext>\n${trimBlock(payload.maintext)}\n</maintext>`,
    `<option>\n${payload.options.map(option => trimBlock(option)).filter(Boolean).join('\n')}\n</option>`,
  ];

  if (trimBlock(payload.sum)) {
    parts.push(`<sum>\n${trimBlock(payload.sum)}\n</sum>`);
  }

  if (trimBlock(payload.updateVariable)) {
    parts.push(`<UpdateVariable>\n${trimBlock(payload.updateVariable)}\n</UpdateVariable>`);
  }

  return parts.join('\n\n');
}

function safeParseCommands(raw: string | null) {
  if (!raw) {
    return [] as SessionHostCommandPayload[];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionHostCommandPayload[]) : [];
  } catch {
    return [];
  }
}

export function parseUserRequestPayload(raw: string) {
  return {
    text: extractLastTag(raw, SESSION_HOST_USER_TEXT_TAG) ?? '',
    commands: safeParseCommands(extractLastTag(raw, SESSION_HOST_COMMAND_TAG)),
  };
}

export function parseUserDisplayMessage(raw: string) {
  const { text, commands } = parseUserRequestPayload(raw);
  if (text) {
    return text;
  }

  const labels = commands
    .map(command => trimBlock(command.label) || trimBlock(command.target))
    .filter(Boolean);

  if (labels.length > 0) {
    return labels.join(' / ');
  }

  return trimBlock(stripHtmlLikeTags(raw));
}
