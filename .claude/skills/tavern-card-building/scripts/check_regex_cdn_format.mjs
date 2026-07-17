#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const target = args.find(arg => !arg.startsWith('--'));
const strict = args.includes('--strict');

if (!target) {
  console.error('Usage: node check_regex_cdn_format.mjs <project-root-or-index.yaml> [--strict]');
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
  console.error(
    'Unable to load the "yaml" package from the target workspace or current workspace. Run from the project root or install its dependencies.',
  );
  process.exit(2);
}

const projectRoot = path.dirname(indexPath);
let doc;
try {
  doc = YAML.parse(fs.readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`Invalid YAML in ${indexPath}: ${error.message}`);
  process.exit(1);
}

const regexes = Array.isArray(doc?.扩展字段?.正则) ? doc.扩展字段.正则 : Array.isArray(doc?.正则) ? doc.正则 : [];
const scriptLibrary = Array.isArray(doc?.扩展字段?.酒馆助手?.脚本库)
  ? doc.扩展字段.酒馆助手.脚本库
  : Array.isArray(doc?.酒馆助手?.脚本库)
    ? doc.酒馆助手.脚本库
    : [];
const cardVersion = String(doc?.版本 ?? '').trim();
const failures = [];
const warnings = [];
const notices = [];
const reports = [];
const seenIds = new Map();

function nameOf(item, index) {
  return String(item?.正则名称 ?? item?.名称 ?? `正则[${index}]`);
}

function normalizeRef(ref) {
  return String(ref).replaceAll('/', path.sep).replaceAll('\\', path.sep);
}

function resolveRef(ref) {
  const base = path.resolve(projectRoot, normalizeRef(ref));
  const candidates = [base, `${base}.txt`, `${base}.html`, `${base}.md`, `${base}.yaml`, `${base}.yml`];
  return candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

function relative(file) {
  return file ? path.relative(projectRoot, file).replaceAll('\\', '/') : null;
}

function replacementOf(item) {
  if (item?.文件 !== undefined) {
    const file = resolveRef(item.文件);
    return { mode: 'file', reference: String(item.文件), file, text: file ? fs.readFileSync(file, 'utf8') : '' };
  }
  if (item?.内容 !== undefined) return { mode: 'inline', reference: null, file: null, text: String(item.内容) };
  if (item?.替换为 !== undefined) return { mode: 'inline', reference: null, file: null, text: String(item.替换为) };
  return { mode: 'missing', reference: null, file: null, text: '' };
}

function urlsIn(text) {
  return [...String(text).matchAll(/https?:\/\/[^\s'"<>`)]+/g)].map(match => match[0]);
}

function isVersionLike(value) {
  return /^(?:v?\d+(?:\.\d+){1,3}(?:[-+][\w.-]+)?|\d{8}(?:[.-]\d+)?|[0-9a-f]{7,40})$/i.test(value);
}

function hasStableReleaseVersion(rawUrl) {
  try {
    const url = new URL(rawUrl);
    for (const key of ['v', 'version', 'rev', 'build']) {
      const value = url.searchParams.get(key);
      if (value && isVersionLike(value)) return true;
    }

    const githubRef = url.pathname.match(/\/gh\/[^/]+\/[^/@]+@([^/]+)\//i)?.[1];
    if (
      githubRef &&
      !/^(?:main|master|latest|head|dev|develop)$/i.test(githubRef) &&
      (isVersionLike(githubRef) || /^[0-9a-f]{7,40}$/i.test(githubRef))
    )
      return true;

    return /\/(?:_?v?\d+\.\d+(?:\.\d+){0,2}|\d{8}(?:[.-]\d+)?)\//i.test(url.pathname);
  } catch {
    return false;
  }
}

function looksLikeUiEntryUrl(url) {
  return /\.html?(?:[?#]|$)/i.test(url) || /\/(?:status|状态栏|opening|开局|frontend|界面)(?:\/|%2f)/i.test(url);
}

function uiEntryUrlsIn(text) {
  const result = new Set(urlsIn(text).filter(looksLikeUiEntryUrl));
  for (const pattern of [
    /\.load\s*\(\s*['"](https?:\/\/[^'"]+)['"]/gi,
    /<iframe\b[^>]*\bsrc\s*=\s*['"](https?:\/\/[^'"]+)['"]/gi,
  ]) {
    for (const match of String(text).matchAll(pattern)) result.add(match[1]);
  }
  return [...result];
}

function findReleaseVersions(root) {
  const result = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && /^(?:node_modules|dist|build|\.git)$/i.test(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && /^(?:release|version)\.(?:ts|js)$/i.test(entry.name)) {
        const text = fs.readFileSync(full, 'utf8');
        const version = text.match(/\bUI_VERSION\s*=\s*['"]([^'"]+)['"]/)?.[1];
        if (version)
          result.push({
            file: path.relative(root, full).replaceAll('\\', '/'),
            directory: path.relative(root, path.dirname(full)).replaceAll('\\', '/'),
            version,
          });
      }
    }
  }
  visit(root);
  return result;
}

function queryReleaseVersion(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.searchParams.get('v') ?? url.searchParams.get('version') ?? null;
  } catch {
    return null;
  }
}

function matchingLocalRelease(rawUrl, releases) {
  try {
    const pathname = decodeURIComponent(new URL(rawUrl).pathname).replaceAll('\\', '/').toLowerCase();
    const matches = releases.filter(release => pathname.includes(`/${release.directory.toLowerCase()}/`));
    return matches.length === 1 ? matches[0] : null;
  } catch {
    return null;
  }
}

function findLocalScriptDirectories(root) {
  const result = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || /^(?:node_modules|dist|build|\.git)$/i.test(entry.name)) continue;
      const full = path.join(dir, entry.name);
      const hasScriptEntry = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'].some(file =>
        fs.existsSync(path.join(full, file)),
      );
      const hasHtmlEntry = fs.existsSync(path.join(full, 'index.html'));
      if (hasScriptEntry && !hasHtmlEntry) result.push(path.relative(root, full).replaceAll('\\', '/'));
      visit(full);
    }
  }
  visit(root);
  return result;
}

function matchingLocalScript(rawUrl, directories) {
  try {
    const pathname = decodeURIComponent(new URL(rawUrl).pathname).replaceAll('\\', '/').toLowerCase();
    const matches = directories.filter(directory => pathname.includes(`/${directory.toLowerCase()}/`));
    return matches.length === 1 ? matches[0] : null;
  } catch {
    return null;
  }
}

function looksLikeUi(item, text) {
  return /界面|状态栏|placeholder|<iframe|<body|<script|srcdoc|\.load\s*\(|https?:\/\//i.test(
    `${item?.正则名称 ?? ''}\n${item?.查找表达式 ?? ''}\n${text}`,
  );
}

const releaseVersions = findReleaseVersions(projectRoot);
const localScriptDirectories = findLocalScriptDirectories(projectRoot);
const scriptReports = [];

for (const [index, item] of regexes.entries()) {
  const name = nameOf(item, index);
  const enabled = item?.启用 !== false;
  const expression = String(item?.查找表达式 ?? '');
  const replacement = replacementOf(item);
  const urls = urlsIn(replacement.text);
  const uiEntryUrls = uiEntryUrlsIn(replacement.text);
  const uiLike = looksLikeUi(item, replacement.text);
  const report = {
    index,
    name,
    id: item?.id ?? null,
    enabled,
    expressionChars: expression.length,
    replacementMode: replacement.mode,
    replacementFile: relative(replacement.file),
    emptyReplacement: replacement.mode !== 'missing' && replacement.text.length === 0,
    uiLike,
    urls,
    uiEntryUrls: uiEntryUrls.map(url => ({ url, stableVersion: hasStableReleaseVersion(url) })),
  };

  if (item?.id) {
    if (seenIds.has(item.id))
      warnings.push({ field: name, message: `与“${seenIds.get(item.id)}”使用相同 id：${item.id}` });
    else seenIds.set(item.id, name);
  }

  if (enabled && expression.length === 0) failures.push({ field: name, message: '启用的正则没有查找表达式。' });

  if (replacement.mode === 'file' && !replacement.file) {
    const issue = { field: name, message: `找不到替换文件：${replacement.reference}` };
    (enabled ? failures : warnings).push(issue);
  }
  if (enabled && replacement.mode === 'missing')
    failures.push({ field: name, message: '启用的正则既没有 内容，也没有 文件。' });
  if (replacement.file) {
    const rel = path.relative(projectRoot, replacement.file);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      warnings.push({ field: name, message: `替换文件位于项目目录外：${replacement.file}` });
    }
  }

  if (uiLike && enabled && !/<(?:body|script|style|iframe)\b|\.load\s*\(|srcdoc|https?:\/\//i.test(replacement.text)) {
    warnings.push({ field: name, message: '疑似界面正则，但替换内容中未发现可识别的界面入口；请在目标版本实测。' });
  }

  if (uiLike && enabled && /Date\.now\s*\(|Math\.random\s*\(|new\s+Date\s*\(|\.getTime\s*\(/.test(replacement.text)) {
    failures.push({
      field: name,
      message: '界面 URL 使用每次加载都会变化的时间戳／随机数破缓存。请改为每次发布递增、同一版本稳定的版本号。',
    });
  }
  for (const url of uiEntryUrls) {
    if (!hasStableReleaseVersion(url)) {
      failures.push({
        field: name,
        message: `云端界面入口没有稳定版本标识（固定标签／提交、版本目录或 ?v=发布版本）：${url}`,
      });
    }
    const localRelease = matchingLocalRelease(url, releaseVersions);
    const referencedVersion = queryReleaseVersion(url);
    if (referencedVersion && isVersionLike(cardVersion) && referencedVersion !== cardVersion) {
      failures.push({
        field: name,
        message: `界面引用版本 ${referencedVersion} 与角色卡顶层版本 ${cardVersion} 不一致。`,
      });
    }
    if (localRelease && referencedVersion && referencedVersion !== localRelease.version) {
      failures.push({
        field: name,
        message: `界面引用版本 ${referencedVersion} 与 ${localRelease.file} 的 UI_VERSION ${localRelease.version} 不一致。发布时必须同步更新真实 URL。`,
      });
    }
  }

  for (const url of urls) {
    if (/^http:\/\//i.test(url)) warnings.push({ field: name, message: `外部资源使用明文 HTTP：${url}` });
    if (/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(url))
      warnings.push({ field: name, message: `替换内容仍引用本地开发地址：${url}` });
    if (/testingcf\.jsdelivr\.net\/gh\//i.test(url)) {
      notices.push({
        field: name,
        message: `使用 testingcf.jsdelivr.net 开发通道；开发预览可保留，正式发布前应评估固定提交／标签或版本目录：${url}`,
      });
    } else if (/cdn\.jsdelivr\.net\/gh\//i.test(url) && !hasStableReleaseVersion(url)) {
      warnings.push({
        field: name,
        message: `CDN URL 未显示固定提交／标签或版本目录，发布时可能受缓存和分支变化影响：${url}`,
      });
    }
  }

  if (/StatusPlaceHolderImpl/.test(expression) && enabled) {
    if (item?.来源 && item.来源.AI输出 === false) {
      warnings.push({ field: name, message: '状态占位符正则未作用于 AI 输出；确认占位符实际来源。' });
    }
    if (item?.作用于 && item.作用于.仅格式显示 === false) {
      warnings.push({ field: name, message: '状态占位符替换不只作用于显示；确认不会污染发给模型的文本。' });
    }
  }

  reports.push(report);
}

for (const [index, item] of scriptLibrary.entries()) {
  const name = String(item?.名称 ?? `脚本[${index}]`);
  const enabled = item?.启用 !== false;
  const content = replacementOf(item);
  const urls = urlsIn(content.text);
  const selfHostedUrls = [];

  if (enabled && /Date\.now\s*\(|Math\.random\s*\(|new\s+Date\s*\(|\.getTime\s*\(/.test(content.text)) {
    failures.push({
      field: name,
      message: '脚本 URL 使用每次加载都会变化的时间戳／随机数破缓存；请改为稳定发布版本。',
    });
  }

  for (const url of urls) {
    const localDirectory = matchingLocalScript(url, localScriptDirectories);
    if (localDirectory) {
      selfHostedUrls.push({ url, localDirectory, stableVersion: hasStableReleaseVersion(url) });
      if (enabled && !hasStableReleaseVersion(url)) {
        failures.push({
          field: name,
          message: `本项目自托管脚本入口没有稳定发布版本：${url}`,
        });
      }
      const referencedVersion = queryReleaseVersion(url);
      if (enabled && referencedVersion && isVersionLike(cardVersion) && referencedVersion !== cardVersion) {
        failures.push({
          field: name,
          message: `脚本引用版本 ${referencedVersion} 与角色卡顶层版本 ${cardVersion} 不一致：${url}`,
        });
      }
    } else if (enabled && /testingcf\.jsdelivr\.net\/gh\//i.test(url) && !hasStableReleaseVersion(url)) {
      notices.push({
        field: name,
        message: `已扫描到未固定版本的第三方脚本；升级稳定性需结合上游兼容性评估：${url}`,
      });
    }
  }

  scriptReports.push({
    index,
    name,
    enabled,
    contentMode: content.mode,
    contentFile: relative(content.file),
    urls,
    selfHostedUrls,
  });
}

const status = failures.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';
console.log(
  JSON.stringify(
    {
      indexPath,
      status,
      summary: {
        regexCount: regexes.length,
        enabledCount: reports.filter(item => item.enabled).length,
        uiLikeCount: reports.filter(item => item.uiLike).length,
        scriptCount: scriptReports.length,
        enabledScriptCount: scriptReports.filter(item => item.enabled).length,
        failureCount: failures.length,
        warningCount: warnings.length,
        noticeCount: notices.length,
      },
      failures,
      warnings,
      notices,
      cardVersion,
      releaseVersions,
      localScriptDirectories,
      regexes: reports,
      scripts: scriptReports,
    },
    null,
    2,
  ),
);

if (failures.length > 0 || (strict && warnings.length > 0)) process.exit(1);
