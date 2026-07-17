#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const target = args.find(arg => !arg.startsWith('--'));
const strict = args.includes('--strict');

if (!target) {
  console.error('Usage: node check_worldbook_quality.mjs <project-root-or-worldbook-dir> [--strict]');
  process.exit(2);
}

const resolved = path.resolve(target);
if (!fs.existsSync(resolved)) {
  console.error(`Target not found: ${resolved}`);
  process.exit(2);
}

function findWorldbookDir(input) {
  if (!fs.statSync(input).isDirectory()) return null;
  if (/^(世界书|worldbooks?|lorebooks?)$/i.test(path.basename(input))) return input;
  for (const name of ['世界书', 'worldbook', 'worldbooks', 'lorebook', 'lorebooks']) {
    const candidate = path.join(input, name);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) return candidate;
  }
  return null;
}

const worldbookDir = findWorldbookDir(resolved);
if (!worldbookDir) {
  console.error(`Worldbook directory not found under: ${resolved}`);
  process.exit(2);
}

const allowedExtensions = new Set(['.yaml', '.yml', '.txt', '.md', '.json']);

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, result);
    else if (entry.isFile() && allowedExtensions.has(path.extname(entry.name).toLowerCase())) result.push(full);
  }
  return result;
}

function relative(file) {
  return path.relative(worldbookDir, file).replaceAll('\\', '/');
}

function isProtocolFile(file) {
  const rel = relative(file);
  return /(^|\/)(变量|variables?|mvu)(\/|$)/i.test(rel)
    || /initvar|变量列表|变量更新规则|变量输出格式|update.?variable|status.?current/i.test(path.basename(file));
}

function normalizedContent(text) {
  return text
    .replace(/^\s*#.*$/gm, '')
    .replace(/^\s*---\s*$/gm, '')
    .replace(/\s+/g, '')
    .trim();
}

const files = walk(worldbookDir).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
const failures = [];
const warnings = [];
const reports = [];
const duplicateIndex = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const normalized = normalizedContent(text);
  const chars = Array.from(normalized).length;
  const protocol = isProtocolFile(file);
  const hash = crypto.createHash('sha256').update(normalized).digest('hex');
  const report = {
    file: relative(file),
    kind: protocol ? 'protocol' : 'content',
    nonWhitespaceChars: chars,
    lines: text.split(/\r?\n/).length,
    placeholder: /\b(?:TODO|TBD|FIXME)\b|待补充|待完善|占位符|lorem ipsum/i.test(text),
  };

  if (chars === 0) failures.push({ file: report.file, message: '文件去除注释和分隔符后为空。' });
  if (!protocol && chars > 0 && chars < 80) {
    warnings.push({ file: report.file, message: '内容很短；确认它是职责明确的短条目，而不是空壳。' });
  }
  if (chars > 50000) {
    warnings.push({ file: report.file, message: '单文件非常大；检查是否应按触发职责拆分，或是否误放了源码／资料全集。' });
  }
  if (report.placeholder) warnings.push({ file: report.file, message: '检测到疑似 TODO／占位内容。' });

  if (chars > 0) {
    if (!duplicateIndex.has(hash)) duplicateIndex.set(hash, []);
    duplicateIndex.get(hash).push(report.file);
  }
  reports.push(report);
}

const duplicateGroups = [...duplicateIndex.values()].filter(group => group.length > 1);
for (const group of duplicateGroups) {
  warnings.push({ file: group.join(', '), message: '这些文件去除空白和注释后内容完全相同；确认不是重复权威来源。' });
}

if (files.length === 0) failures.push({ file: relative(worldbookDir), message: '世界书目录中没有支持的文本条目。' });

const contentReports = reports.filter(report => report.kind === 'content');
const status = failures.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';
console.log(JSON.stringify({
  worldbookDir,
  status,
  summary: {
    fileCount: reports.length,
    contentFileCount: contentReports.length,
    protocolFileCount: reports.length - contentReports.length,
    contentChars: contentReports.reduce((sum, report) => sum + report.nonWhitespaceChars, 0),
    duplicateGroupCount: duplicateGroups.length,
    failureCount: failures.length,
    warningCount: warnings.length,
  },
  note: '数量和长度仅用于发现异常，不是世界书完整度评分；最终必须审查覆盖、触发、因果和注入效果。',
  failures,
  warnings,
  duplicateGroups,
  files: reports,
}, null, 2));

if (failures.length > 0 || (strict && warnings.length > 0)) process.exit(1);
