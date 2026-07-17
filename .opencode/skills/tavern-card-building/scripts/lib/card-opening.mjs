import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { inflateRawSync } from 'node:zlib';

const TEXT_EXTENSIONS = ['', '.txt', '.md', '.yaml', '.yml'];
const IMAGE_EXTENSIONS = ['', '.png', '.jpg', '.jpeg', '.webp', '.gif'];
const INVISIBLE = /[\s\u200B-\u200D\u2060\uFEFF]/gu;

function unique(items) {
  return [...new Set(items.map(item => path.resolve(item)))];
}

function findPackageRoots(starts) {
  const roots = [];
  for (const start of starts) {
    let current = path.resolve(start);
    while (true) {
      if (!roots.includes(current)) roots.push(current);
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  return roots;
}

function loadYaml(starts) {
  for (const root of findPackageRoots(starts)) {
    const packageJson = path.join(root, 'package.json');
    if (!fs.existsSync(packageJson)) continue;
    try {
      return createRequire(packageJson)('yaml');
    } catch {
      // Keep looking for the target workspace's dependency runtime.
    }
  }
  throw new Error('无法从目标项目或当前工作区加载 "yaml" 包。请在项目根目录运行，或先安装项目依赖。');
}

export function normalizeOpening(text) {
  return String(text ?? '').replace(/\r\n?/g, '\n').replace(/\n+$/u, '');
}

export function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export function visibleCharacterCount(text) {
  return Array.from(String(text ?? '').replace(INVISIBLE, '')).length;
}

export function resolveIndexPath(target) {
  const resolved = path.resolve(target);
  if (!fs.existsSync(resolved)) throw new Error(`目标不存在：${resolved}`);
  const indexPath = fs.statSync(resolved).isDirectory() ? path.join(resolved, 'index.yaml') : resolved;
  if (!fs.existsSync(indexPath) || !fs.statSync(indexPath).isFile()) {
    throw new Error(`找不到 index.yaml：${indexPath}`);
  }
  return indexPath;
}

function normalizeReference(reference) {
  return String(reference).replaceAll('/', path.sep).replaceAll('\\', path.sep);
}

function resolveCandidates(root, reference, extensions) {
  const base = path.resolve(root, normalizeReference(reference));
  const hasExtension = path.extname(base) !== '';
  const candidates = hasExtension ? [base] : extensions.map(extension => `${base}${extension}`);
  return unique(candidates.filter(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()));
}

function relative(root, file) {
  return path.relative(root, file).replaceAll('\\', '/');
}

function getField(object, chinese, english) {
  if (Object.prototype.hasOwnProperty.call(object ?? {}, chinese)) return object[chinese];
  return object?.[english];
}

function readOpeningEntries(doc, projectRoot, failures, warnings) {
  const rawEntries = getField(doc, '第一条消息', 'first_messages');
  const entries = Array.isArray(rawEntries) ? rawEntries : [];
  const reports = [];

  if (!Array.isArray(rawEntries) || entries.length === 0) {
    failures.push({ stage: 'source', field: '第一条消息', message: '没有非空的第一条消息数组。' });
    return reports;
  }

  for (const [index, entry] of entries.entries()) {
    const contentValue = getField(entry, '内容', 'content');
    const fileValue = getField(entry, '文件', 'file');
    const hasContent = contentValue !== undefined;
    const hasFile = fileValue !== undefined;
    const report = { index, mode: 'missing', source: null, content: '', normalized: '', sha256: '', visibleCharacters: 0 };

    if (hasContent === hasFile) {
      failures.push({
        stage: 'source',
        field: `第一条消息[${index}]`,
        message: hasContent ? '不能同时设置 内容 和 文件。' : '条目既没有 内容，也没有 文件。',
      });
    } else if (hasFile) {
      report.mode = 'file';
      report.source = String(fileValue);
      const candidates = resolveCandidates(projectRoot, fileValue, TEXT_EXTENSIONS);
      if (candidates.length === 0) {
        failures.push({ stage: 'source', field: `第一条消息[${index}].文件`, message: `找不到引用：${fileValue}` });
      } else if (candidates.length > 1) {
        failures.push({
          stage: 'source',
          field: `第一条消息[${index}].文件`,
          message: `省略扩展名后命中多个文件：${candidates.map(file => relative(projectRoot, file)).join(', ')}`,
        });
      } else {
        report.resolved = relative(projectRoot, candidates[0]);
        report.content = fs.readFileSync(candidates[0], 'utf8');
      }
    } else {
      report.mode = 'inline';
      report.source = 'index.yaml';
      report.content = String(contentValue ?? '');
    }

    report.normalized = normalizeOpening(report.content);
    report.sha256 = sha256(report.normalized);
    report.visibleCharacters = visibleCharacterCount(report.normalized);
    if (report.visibleCharacters === 0) {
      failures.push({ stage: 'source', field: `第一条消息[${index}]`, message: '解析后的内容为空。' });
    }
    if (/\b(?:TODO|TBD|FIXME)\b|待补充|占位符/iu.test(report.content)) {
      warnings.push({ stage: 'source', field: `第一条消息[${index}]`, message: '疑似仍有占位内容。' });
    }
    reports.push(report);
  }

  return reports;
}

export function detectContainer(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpeg';
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'))) return 'gif';
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  if (buffer.length >= 4 && buffer.readUInt32LE(0) === 0x04034b50) return 'charx';
  const prefix = buffer.toString('utf8', 0, Math.min(buffer.length, 256)).replace(/^\uFEFF/u, '').trimStart();
  if (prefix.startsWith('{') || prefix.startsWith('[')) return 'json';
  return 'unknown';
}

function readAvatar(doc, projectRoot, required, failures) {
  const hasChinese = Object.prototype.hasOwnProperty.call(doc ?? {}, '头像');
  const hasEnglish = Object.prototype.hasOwnProperty.call(doc ?? {}, 'avatar');
  const value = hasChinese ? doc.头像 : doc?.avatar;
  const report = { required, declared: hasChinese || hasEnglish, reference: value ?? null, resolved: null, bytes: 0, container: null };

  if (value === undefined || value === null || String(value).trim() === '') {
    if (required) {
      failures.push({
        stage: 'tavern-sync-preflight',
        field: hasChinese ? '头像' : 'avatar',
        message: 'TavernSync 实时 push 必须绑定一个实际、非空的头像文件；空字符串、null 或省略会变成 0 字节 Blob，并可能在世界书写入后静默中断角色更新。',
      });
    }
    return report;
  }

  const candidates = resolveCandidates(projectRoot, value, IMAGE_EXTENSIONS);
  if (candidates.length === 0) {
    failures.push({ stage: 'tavern-sync-preflight', field: '头像', message: `找不到头像引用：${value}` });
    return report;
  }
  if (candidates.length > 1) {
    failures.push({
      stage: 'tavern-sync-preflight',
      field: '头像',
      message: `省略扩展名后命中多个头像：${candidates.map(file => relative(projectRoot, file)).join(', ')}`,
    });
    return report;
  }

  const buffer = fs.readFileSync(candidates[0]);
  report.resolved = relative(projectRoot, candidates[0]);
  report.bytes = buffer.length;
  report.container = detectContainer(buffer);
  if (buffer.length === 0) {
    failures.push({ stage: 'tavern-sync-preflight', field: '头像', message: `头像文件是 0 字节：${report.resolved}` });
  } else if (!['png', 'jpeg', 'gif', 'webp'].includes(report.container)) {
    failures.push({ stage: 'tavern-sync-preflight', field: '头像', message: `头像不是受支持的图像容器：${report.resolved} (${report.container})` });
  }
  return report;
}

export function readProject(target, { tavernSync = false } = {}) {
  const failures = [];
  const warnings = [];
  const indexPath = resolveIndexPath(target);
  const projectRoot = path.dirname(indexPath);
  const YAML = loadYaml([projectRoot, process.cwd()]);
  let doc;
  try {
    doc = YAML.parse(fs.readFileSync(indexPath, 'utf8'));
  } catch (error) {
    throw new Error(`无法解析 ${indexPath}：${error.message}`);
  }
  const messages = readOpeningEntries(doc, projectRoot, failures, warnings);
  const avatar = readAvatar(doc, projectRoot, tavernSync, failures);
  return { indexPath, projectRoot, doc, messages, avatar, failures, warnings };
}

function parseCardJson(buffer, label) {
  try {
    return JSON.parse(buffer.toString('utf8').replace(/^\uFEFF/u, ''));
  } catch (error) {
    throw new Error(`${label} 中的角色卡 JSON 无法解析：${error.message}`);
  }
}

function parsePngCards(buffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buffer.subarray(0, 8).equals(signature)) throw new Error('PNG 魔数无效。');
  let offset = 8;
  const cards = [];
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > buffer.length) throw new Error(`PNG chunk ${type} 越界或文件被截断。`);
    if (type === 'tEXt') {
      const data = buffer.subarray(dataStart, dataEnd);
      const separator = data.indexOf(0);
      if (separator >= 0) {
        const keyword = data.toString('latin1', 0, separator).toLowerCase();
        if (keyword === 'chara' || keyword === 'ccv3') {
          const decoded = Buffer.from(data.toString('latin1', separator + 1), 'base64');
          cards.push({ keyword, card: parseCardJson(decoded, `PNG ${keyword} chunk`) });
        }
      }
    }
    offset = dataEnd + 4;
    if (type === 'IEND') break;
  }
  if (cards.length === 0) throw new Error('PNG 中没有可解码的 chara 或 ccv3 tEXt 角色卡块。');
  return cards;
}

function findEndOfCentralDirectory(buffer) {
  const minimum = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= minimum; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  return -1;
}

function parseCharxCard(buffer) {
  const eocd = findEndOfCentralDirectory(buffer);
  if (eocd < 0) throw new Error('CHARX 缺少 ZIP 中央目录结束记录。');
  const entryCount = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const matches = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > buffer.length || buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error('CHARX 中央目录损坏或被截断。');
    }
    const flags = buffer.readUInt16LE(offset + 8);
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const nameBuffer = buffer.subarray(offset + 46, offset + 46 + nameLength);
    const name = nameBuffer.toString(flags & 0x0800 ? 'utf8' : 'latin1').replaceAll('\\', '/');
    if (name === 'card.json') matches.push({ method, compressedSize, uncompressedSize, localOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }

  if (matches.length !== 1) throw new Error(`CHARX 根目录必须恰好有一个 card.json，实际为 ${matches.length} 个。`);
  const entry = matches[0];
  if (entry.localOffset + 30 > buffer.length || buffer.readUInt32LE(entry.localOffset) !== 0x04034b50) {
    throw new Error('CHARX 的 card.json 本地文件头无效。');
  }
  const nameLength = buffer.readUInt16LE(entry.localOffset + 26);
  const extraLength = buffer.readUInt16LE(entry.localOffset + 28);
  const dataStart = entry.localOffset + 30 + nameLength + extraLength;
  const dataEnd = dataStart + entry.compressedSize;
  if (dataEnd > buffer.length) throw new Error('CHARX 的 card.json 数据越界。');
  const compressed = buffer.subarray(dataStart, dataEnd);
  const data = entry.method === 0 ? compressed : entry.method === 8 ? inflateRawSync(compressed) : null;
  if (!data) throw new Error(`CHARX 的 card.json 使用了不支持的 ZIP 压缩方法：${entry.method}`);
  if (data.length !== entry.uncompressedSize) throw new Error('CHARX 的 card.json 解压大小与中央目录不一致。');
  return parseCardJson(data, 'CHARX card.json');
}

export function readArtifact(artifactPath) {
  const resolved = path.resolve(artifactPath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) throw new Error(`产物不存在：${resolved}`);
  const buffer = fs.readFileSync(resolved);
  const container = detectContainer(buffer);
  const extension = path.extname(resolved).toLowerCase();
  const expected = { '.png': 'png', '.json': 'json', '.charx': 'charx' }[extension];
  const extensionMismatch = expected !== undefined && expected !== container;
  let variants;

  if (container === 'png') variants = parsePngCards(buffer);
  else if (container === 'json') variants = [{ keyword: 'json', card: parseCardJson(buffer, 'JSON 产物') }];
  else if (container === 'charx') variants = [{ keyword: 'card.json', card: parseCharxCard(buffer) }];
  else throw new Error(`不支持或无法识别的角色卡容器：${container}`);

  const preferred = [...variants].reverse().find(variant => variant.keyword === 'ccv3') ?? variants.at(-1);
  return {
    path: resolved,
    bytes: buffer.length,
    fileSha256: sha256(buffer),
    container,
    extension,
    expectedContainer: expected ?? null,
    extensionMismatch,
    variants,
    preferred,
  };
}

export function extractCardMessages(card) {
  const data = card && typeof card.data === 'object' && card.data !== null ? card.data : card ?? {};
  const primary = data.first_mes ?? card?.first_mes ?? '';
  const alternates = data.alternate_greetings ?? card?.alternate_greetings ?? [];
  return [primary, ...(Array.isArray(alternates) ? alternates : [])].map((content, index) => {
    const normalized = normalizeOpening(content);
    return {
      index,
      normalized,
      sha256: sha256(normalized),
      visibleCharacters: visibleCharacterCount(normalized),
    };
  });
}

export function compareOpenings(expected, actual, stage) {
  const failures = [];
  if (expected.length !== actual.length) {
    failures.push({ stage, field: '第一条消息', message: `开场数量不一致：源文件 ${expected.length}，目标 ${actual.length}。` });
  }
  const count = Math.max(expected.length, actual.length);
  for (let index = 0; index < count; index += 1) {
    const left = expected[index];
    const right = actual[index];
    if (!left || !right) continue;
    if (right.visibleCharacters === 0) {
      failures.push({ stage, field: `第一条消息[${index}]`, message: '目标中的开场为空。' });
    }
    if (left.sha256 !== right.sha256) {
      failures.push({
        stage,
        field: `第一条消息[${index}]`,
        message: `内容哈希不一致：源 ${left.sha256}，目标 ${right.sha256}。`,
      });
    }
  }
  return failures;
}

