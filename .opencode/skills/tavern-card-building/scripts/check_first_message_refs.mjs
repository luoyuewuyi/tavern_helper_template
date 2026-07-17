#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const target = args.find(arg => !arg.startsWith('--'));
const strict = args.includes('--strict');

if (!target) {
  console.error('Usage: node check_first_message_refs.mjs <project-root-or-index.yaml> [--strict]');
  process.exit(2);
}

const resolved = path.resolve(target);
if (!fs.existsSync(resolved)) {
  console.error(`Target not found: ${resolved}`);
  process.exit(2);
}

const indexPath = fs.statSync(resolved).isDirectory() ? path.join(resolved, 'index.yaml') : resolved;
if (!fs.existsSync(indexPath)) {
  console.error(`index.yaml not found: ${indexPath}`);
  process.exit(2);
}

function loadProjectYaml(startPaths) {
  const roots = [];
  for (const start of startPaths) {
    let current = path.resolve(start);
    while (true) {
      if (!roots.includes(current)) roots.push(current);
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  for (const root of roots) {
    const packageJson = path.join(root, 'package.json');
    if (!fs.existsSync(packageJson)) continue;
    try {
      return createRequire(packageJson)('yaml');
    } catch {
      // Try the next project/workspace root.
    }
  }
  return null;
}

const YAML = loadProjectYaml([path.dirname(indexPath), process.cwd()]);
if (!YAML) {
  console.error('Unable to load the "yaml" package from the target workspace or current workspace. Run from the project root or install its dependencies.');
  process.exit(2);
}

const projectRoot = path.dirname(indexPath);
const raw = fs.readFileSync(indexPath, 'utf8');
let doc;
try {
  doc = YAML.parse(raw);
} catch (error) {
  console.error(`Invalid YAML in ${indexPath}: ${error.message}`);
  process.exit(1);
}

const messages = Array.isArray(doc?.第一条消息) ? doc.第一条消息 : [];
const failures = [];
const warnings = [];
const reports = [];
const referencedFiles = new Set();

function normalizeRef(ref) {
  return String(ref).replaceAll('/', path.sep).replaceAll('\\', path.sep);
}

function resolveRef(ref) {
  const base = path.resolve(projectRoot, normalizeRef(ref));
  const candidates = [base, `${base}.txt`, `${base}.md`, `${base}.yaml`, `${base}.yml`];
  return candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

function relative(file) {
  return path.relative(projectRoot, file).replaceAll('\\', '/');
}

if (messages.length === 0) {
  failures.push({ field: '第一条消息', message: 'index.yaml 中没有非空的第一条消息数组。' });
}

for (const [index, entry] of messages.entries()) {
  const report = { index };
  if (entry?.文件 !== undefined) {
    const file = resolveRef(entry.文件);
    report.mode = 'file';
    report.reference = String(entry.文件);
    report.resolved = file ? relative(file) : null;
    if (!file) {
      failures.push({ field: `第一条消息[${index}].文件`, message: `找不到引用：${entry.文件}` });
    } else {
      referencedFiles.add(path.resolve(file));
      const text = fs.readFileSync(file, 'utf8');
      report.nonWhitespaceChars = Array.from(text.replace(/\s/g, '')).length;
      if (report.nonWhitespaceChars === 0) {
        failures.push({ field: `第一条消息[${index}].文件`, message: `引用文件为空：${relative(file)}` });
      }
      if (/\b(?:TODO|TBD|FIXME)\b|待补充|占位符/i.test(text)) {
        warnings.push({ field: `第一条消息[${index}].文件`, message: `疑似仍有占位内容：${relative(file)}` });
      }
    }
  } else if (entry?.内容 !== undefined) {
    const text = String(entry.内容);
    report.mode = 'inline';
    report.nonWhitespaceChars = Array.from(text.replace(/\s/g, '')).length;
    if (report.nonWhitespaceChars === 0) {
      failures.push({ field: `第一条消息[${index}].内容`, message: '内联内容为空。' });
    }
    if (text.includes('\\n') && !text.includes('\n')) {
      warnings.push({ field: `第一条消息[${index}].内容`, message: '只检测到字面量 \\n；确认这不是序列化造成的换行损坏。' });
    }
  } else {
    report.mode = 'missing';
    failures.push({ field: `第一条消息[${index}]`, message: '条目既没有 文件，也没有 内容。' });
  }
  reports.push(report);
}

const firstMessageDir = path.join(projectRoot, '第一条消息');
const unreferenced = [];
if (fs.existsSync(firstMessageDir) && fs.statSync(firstMessageDir).isDirectory()) {
  for (const name of fs.readdirSync(firstMessageDir)) {
    const file = path.join(firstMessageDir, name);
    if (fs.statSync(file).isFile() && !referencedFiles.has(path.resolve(file))) {
      unreferenced.push(relative(file));
    }
  }
  if (unreferenced.length > 0) {
    warnings.push({ field: '第一条消息目录', message: `存在未被 index.yaml 引用的文件：${unreferenced.join(', ')}` });
  }
}

const status = failures.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';
console.log(JSON.stringify({
  indexPath,
  status,
  summary: {
    entryCount: messages.length,
    referencedFileCount: referencedFiles.size,
    failureCount: failures.length,
    warningCount: warnings.length,
  },
  failures,
  warnings,
  entries: reports,
}, null, 2));

if (failures.length > 0 || (strict && warnings.length > 0)) process.exit(1);
