#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const target = args.find(arg => !arg.startsWith('--'));
const strict = args.includes('--strict');
const variablesOnly = args.includes('--variables-only');

if (!target) {
  console.error(
    'Usage: node check_status_variable_bridge.mjs <project-root-or-index.yaml> [--variables-only] [--strict]',
  );
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
const rawIndex = fs.readFileSync(indexPath, 'utf8');
let doc;
try {
  doc = YAML.parse(rawIndex);
} catch (error) {
  console.error(`Invalid YAML in ${indexPath}: ${error.message}`);
  process.exit(1);
}

function flattenEntries(items, result = []) {
  if (!Array.isArray(items)) return result;
  for (const item of items) {
    if (Array.isArray(item?.条目)) flattenEntries(item.条目, result);
    else result.push(item);
  }
  return result;
}

function walk(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(projectRoot, full).replaceAll('\\', '/');
    if (/(^|\/)(node_modules|\.git|dist|build|coverage)(\/|$)/i.test(rel)) continue;
    if (entry.isDirectory()) walk(full, result);
    else if (entry.isFile() && /\.(?:ts|tsx|js|jsx|vue|html|txt|md|ya?ml|json)$/i.test(entry.name)) result.push(full);
  }
  return result;
}

function safeRead(file) {
  try {
    if (fs.statSync(file).size > 1024 * 1024) return '';
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function normalizeRef(ref) {
  return String(ref).replaceAll('/', path.sep).replaceAll('\\', path.sep);
}

function resolveRef(ref) {
  const base = path.resolve(projectRoot, normalizeRef(ref));
  const candidates = [base, `${base}.yaml`, `${base}.yml`, `${base}.txt`, `${base}.ts`, `${base}.js`, `${base}.html`];
  return candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

function contentOf(item) {
  if (!item) return { file: null, text: '' };
  if (item.内容 !== undefined) return { file: null, text: String(item.内容) };
  if (item.替换为 !== undefined) return { file: null, text: String(item.替换为) };
  if (item.文件 !== undefined) {
    const file = resolveRef(item.文件);
    return { file, text: file ? safeRead(file) : '' };
  }
  return { file: null, text: '' };
}

function nameOf(item) {
  return String(item?.名称 ?? item?.正则名称 ?? '');
}

function relative(file) {
  return file ? path.relative(projectRoot, file).replaceAll('\\', '/') : null;
}

function uniqueFiles(items) {
  const map = new Map();
  for (const item of items) {
    const key = item.file ? `file:${path.resolve(item.file)}` : `inline:${item.name ?? ''}:${item.text}`;
    map.set(key, item);
  }
  return [...map.values()];
}

function schemaRootKeys(text) {
  const start = text.search(/export\s+const\s+Schema\s*=\s*z\.(?:object|strictObject|looseObject)\s*\(\s*\{/);
  if (start < 0) return [];
  const sample = text.slice(start);
  const keys = new Set();
  for (const match of sample.matchAll(/^\s{2}([A-Za-z0-9_$\u4e00-\u9fff]+)\s*:/gm)) keys.add(match[1]);
  return [...keys];
}

function yamlRootKeys(items) {
  const keys = new Set();
  const parseErrors = [];
  for (const item of items) {
    try {
      const value = YAML.parse(item.text.replace(/^\s*---\s*/, ''));
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const key of Object.keys(value)) keys.add(key);
      }
    } catch (error) {
      parseErrors.push({ source: relative(item.file) ?? item.name ?? '(inline initvar)', message: error.message });
    }
  }
  return { keys: [...keys], parseErrors };
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object ?? {}, key);
}

function isChineseWorldbookEntry(entry) {
  return Boolean(
    entry &&
      typeof entry === 'object' &&
      (hasOwn(entry, '名称') ||
        hasOwn(entry, '启用') ||
        hasOwn(entry, '激活策略') ||
        hasOwn(entry, '插入位置') ||
        hasOwn(entry, '递归') ||
        hasOwn(entry, '文件')),
  );
}

function normalizedName(entry) {
  return nameOf(entry).replaceAll(/\s+/g, '');
}

function protocolConfig(entry) {
  return {
    name: nameOf(entry),
    enabled: hasOwn(entry, '启用') ? entry.启用 : '(missing)',
    activation: entry?.激活策略?.类型 ?? '(missing)',
    position: entry?.插入位置?.类型 ?? '(missing)',
    role: entry?.插入位置?.角色 ?? '(missing)',
    depth: entry?.插入位置?.深度 ?? '(missing)',
    order: entry?.插入位置?.顺序 ?? '(missing)',
    blockIncomingRecursion: entry?.递归?.不可被其他条目激活 ?? '(missing)',
    blockOutgoingRecursion: entry?.递归?.不可激活其他条目 ?? '(missing)',
    file: entry?.文件 ?? '(missing)',
  };
}

function meaningfulUpdateRules(text) {
  const body = String(text)
    .replace(/^\s*---\s*/u, '')
    .replace(/^\s*变量更新规则\s*:\s*/u, '')
    .replace(/[\s#:_-]/g, '');
  return body.length >= 8;
}

const entries = flattenEntries(doc?.条目);
const regexes = Array.isArray(doc?.扩展字段?.正则) ? doc.扩展字段.正则 : Array.isArray(doc?.正则) ? doc.正则 : [];
const scriptLib = Array.isArray(doc?.扩展字段?.酒馆助手?.脚本库)
  ? doc.扩展字段.酒馆助手.脚本库
  : Array.isArray(doc?.酒馆助手?.脚本库)
    ? doc.酒馆助手.脚本库
    : [];
const files = walk(projectRoot);
const fileItems = files.map(file => ({ file, text: safeRead(file), name: path.basename(file) }));
const sourceFileItems = fileItems.filter(item => path.resolve(item.file) !== path.resolve(indexPath));
const entryItems = entries.map(entry => ({ ...contentOf(entry), name: nameOf(entry), entry }));
const scriptItems = scriptLib.map(script => ({ ...contentOf(script), name: nameOf(script), script }));
const allText = [
  rawIndex,
  ...fileItems.map(item => item.text),
  ...entryItems.map(item => item.text),
  ...scriptItems.map(item => item.text),
].join('\n');

if (!/\bMvu\b|MagVarUpdate|registerMvuSchema|<UpdateVariable>|stat_data|StatusPlaceHolderImpl/.test(allText)) {
  console.log(
    JSON.stringify(
      {
        indexPath,
        status: 'SKIP_NO_MVU',
        message: '未发现 MVU 变量链信号。纯文字卡或其他变量方案无需运行本检查。',
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const failures = [];
const warnings = [];

const chineseWorldbookContract = Array.isArray(doc?.条目) && entries.some(isChineseWorldbookEntry);
const protocolEntryGroups = {
  initvar: entries.filter(entry => /^\[initvar\]/i.test(normalizedName(entry))),
  variableList: entries.filter(entry => /^(?:\[mvu_update\])?变量列表$/i.test(normalizedName(entry))),
  updateRules: entries.filter(entry => /^\[mvu_update\]变量更新规则$/i.test(normalizedName(entry))),
  outputFormat: entries.filter(entry => /^\[mvu_update\]变量输出格式$/i.test(normalizedName(entry))),
};
const protocolEntryConfig = Object.fromEntries(
  Object.entries(protocolEntryGroups).map(([key, group]) => [key, group.map(protocolConfig)]),
);

function fail(field, message) {
  failures.push({ field, message });
}

function validateProtocolEntry(key, label, expectedEnabled, runtime) {
  const group = protocolEntryGroups[key];
  if (group.length !== 1) {
    fail(label, `中文 TavernSync 索引必须恰好存在 1 条 ${label}，当前为 ${group.length} 条。`);
    return;
  }

  const entry = group[0];
  if (!hasOwn(entry, '启用')) fail(label, '缺少显式布尔字段 启用；缺省值不能代替协议状态。');
  else if (entry.启用 !== expectedEnabled)
    fail(label, `启用 必须为布尔值 ${expectedEnabled}，当前为 ${JSON.stringify(entry.启用)}。`);

  if (entry?.激活策略?.类型 !== '蓝灯') fail(label, '激活策略.类型 必须为 蓝灯。');
  if (entry?.递归?.不可被其他条目激活 !== true)
    fail(label, '递归.不可被其他条目激活 必须为 true。');
  if (entry?.递归?.不可激活其他条目 !== true) fail(label, '递归.不可激活其他条目 必须为 true。');

  if (runtime) {
    if (entry?.插入位置?.类型 !== '指定深度') fail(label, '运行时协议的 插入位置.类型 必须为 指定深度。');
    if (entry?.插入位置?.角色 !== '系统') fail(label, '运行时协议的 插入位置.角色 必须为 系统。');
    if (entry?.插入位置?.深度 !== 0) fail(label, '运行时协议的 插入位置.深度 必须为数值 0（D0）。');
  } else if (entry?.插入位置?.类型 !== '角色定义之前') {
    fail(label, '初始化条目的 插入位置.类型 必须为 角色定义之前。');
  }

  if (!Number.isFinite(entry?.插入位置?.顺序)) fail(label, '插入位置.顺序 必须是显式有限数值。');

  if (typeof entry?.文件 !== 'string' || !entry.文件.trim()) {
    fail(label, '必须通过 文件 绑定独立协议文件，不能省略或改为隐式内容。');
    return;
  }
  const file = resolveRef(entry.文件);
  if (!file) fail(label, `文件引用无法解析：${entry.文件}`);
  else if (!safeRead(file).trim()) fail(label, `绑定文件为空：${relative(file)}`);
}

if (chineseWorldbookContract) {
  validateProtocolEntry('initvar', '[initvar]变量初始化勿开', false, false);
  validateProtocolEntry('variableList', '变量列表', true, true);
  validateProtocolEntry('updateRules', '[mvu_update]变量更新规则', true, true);
  validateProtocolEntry('outputFormat', '[mvu_update]变量输出格式', true, true);

  const variableListText = contentOf(protocolEntryGroups.variableList[0]).text;
  if (
    protocolEntryGroups.variableList.length === 1 &&
    !/\{\{\s*format_message_variable::stat_data\s*\}\}/.test(variableListText)
  ) {
    fail('变量列表', '绑定文件必须包含 {{format_message_variable::stat_data}}。');
  }
  const updateRulesText = contentOf(protocolEntryGroups.updateRules[0]).text;
  if (protocolEntryGroups.updateRules.length === 1 && !meaningfulUpdateRules(updateRulesText)) {
    fail('[mvu_update]变量更新规则', '绑定文件只有空标题或占位内容，必须写入逐路径更新规则。');
  }
  const outputFormatText = contentOf(protocolEntryGroups.outputFormat[0]).text;
  if (
    protocolEntryGroups.outputFormat.length === 1 &&
    (!/<UpdateVariable>/i.test(outputFormatText) || !/<JSONPatch>/i.test(outputFormatText))
  ) {
    fail('[mvu_update]变量输出格式', '绑定文件必须同时包含 <UpdateVariable> 与 <JSONPatch>。');
  }
}

const schemaItems = uniqueFiles([
  ...sourceFileItems.filter(item => /export\s+const\s+Schema\s*=\s*z\./.test(item.text)),
  ...scriptItems.filter(item => /export\s+const\s+Schema\s*=\s*z\./.test(item.text)),
]);
const registrationItems = uniqueFiles(
  [...sourceFileItems, ...scriptItems].filter(item => /registerMvuSchema\s*\(/.test(item.text)),
);
const initItems = uniqueFiles([
  ...sourceFileItems.filter(item => /(^|[\\/])(initvar|变量初始化)(?:\.|[\\/])/i.test(item.file)),
  ...entryItems.filter(item => /initvar|变量初始化/i.test(item.name)),
]);
const variableListItems = uniqueFiles([
  ...sourceFileItems.filter(item => /变量列表|status_current_variable/i.test(`${item.name}\n${item.text}`)),
  ...entryItems.filter(item => /变量列表|status_current_variable/i.test(`${item.name}\n${item.text}`)),
]);
const updateRuleItems = uniqueFiles([
  ...sourceFileItems.filter(item => /变量更新规则|update[_ -]?rules?/i.test(`${item.name}\n${item.text}`)),
  ...entryItems.filter(item => /变量更新规则|update[_ -]?rules?/i.test(`${item.name}\n${item.text}`)),
]);
const outputItems = uniqueFiles([
  ...sourceFileItems.filter(item => /<UpdateVariable>|变量输出格式|output[_ -]?format/i.test(`${item.name}\n${item.text}`)),
  ...entryItems.filter(item => /<UpdateVariable>|变量输出格式|output[_ -]?format/i.test(`${item.name}\n${item.text}`)),
]);
const engineItems = uniqueFiles(
  [...sourceFileItems, ...scriptItems].filter(item =>
    /MagVarUpdate|\bMvu\.events\b|mvu_zod/i.test(`${item.name}\n${item.text}`),
  ),
);

if (schemaItems.length === 0)
  failures.push({ field: 'Schema', message: '未找到 export const Schema = z.* 的变量结构。' });
if (registrationItems.length === 0)
  warnings.push({ field: 'Schema 注册', message: '未找到 registerMvuSchema 调用；若由外部扩展注册，请人工确认。' });
if (initItems.length === 0) failures.push({ field: 'initvar', message: '未找到变量初始化条目或文件。' });
if (!variableListItems.some(item => /\{\{\s*format_message_variable::stat_data\s*\}\}/.test(item.text))) {
  failures.push({
    field: '变量列表',
    message: '未找到 {{format_message_variable::stat_data}}，无法证明消息 stat_data 被准确注入上下文。',
  });
}
if (updateRuleItems.length === 0) failures.push({ field: '变量更新规则', message: '未找到变量更新规则。' });
else if (!updateRuleItems.some(item => meaningfulUpdateRules(item.text))) {
  failures.push({ field: '变量更新规则', message: '变量更新规则只有空标题或占位内容，尚未定义任何可执行规则。' });
}
if (!outputItems.some(item => /<UpdateVariable>/i.test(item.text) && /<JSONPatch>/i.test(item.text))) {
  failures.push({ field: '变量输出格式', message: '输出协议必须同时包含 <UpdateVariable> 与 <JSONPatch>。' });
}
if (engineItems.length === 0)
  warnings.push({ field: 'MVU 引擎', message: '未在项目中发现 MVU 引擎或事件引用；确认目标环境已提供并启用。' });

const schemaText = schemaItems.map(item => item.text).join('\n');
const schemaRoots = schemaRootKeys(schemaText);
const { keys: initRoots, parseErrors: initParseErrors } = yamlRootKeys(initItems);
for (const error of initParseErrors) {
  const issue = { field: 'initvar YAML', message: `${error.source}: ${error.message}` };
  if (chineseWorldbookContract) failures.push(issue);
  else warnings.push(issue);
}
if (initItems.length > 0 && initRoots.length === 0) {
  const issue = {
    field: 'initvar',
    message:
      schemaRoots.length > 0
        ? 'Schema 已定义字段，但 initvar 是空对象、只有注释或无法提取任何 YAML 顶层字段。'
        : '找到初始化来源，但未能提取任何 YAML 顶层字段；Schema/initvar 路径对比未完成。',
  };
  if (chineseWorldbookContract || schemaRoots.length > 0) failures.push(issue);
  else warnings.push(issue);
}
if (schemaRoots.length > 0 && initRoots.length > 0) {
  const missingInInit = schemaRoots.filter(key => !initRoots.includes(key));
  const extraInInit = initRoots.filter(key => !schemaRoots.includes(key));
  if (missingInInit.length > 0) {
    const issue = {
      field: 'Schema/initvar',
      message: `Schema 顶层字段在 initvar 中未发现：${missingInInit.join(', ')}`,
    };
    if (chineseWorldbookContract) failures.push(issue);
    else warnings.push(issue);
  }
  if (extraInInit.length > 0) {
    const issue = {
      field: 'Schema/initvar',
      message: `initvar 顶层字段在 Schema 中未发现：${extraInInit.join(', ')}`,
    };
    if (chineseWorldbookContract) failures.push(issue);
    else warnings.push(issue);
  }
}

const statusRegexes = regexes.filter(item =>
  /StatusPlaceHolderImpl|状态栏|status/i.test(`${item?.查找表达式 ?? ''}\n${nameOf(item)}`),
);
const placeholderPresent = /<StatusPlaceHolderImpl\s*\/>/.test(allText);
if (statusRegexes.some(item => item?.启用 !== false) && !placeholderPresent) {
  warnings.push({
    field: '状态占位符',
    message: '存在启用的状态栏正则，但未在项目文本中找到 <StatusPlaceHolderImpl/> 来源。',
  });
}
for (const item of statusRegexes.filter(item => item?.启用 !== false)) {
  const content = contentOf(item);
  if (!String(item?.查找表达式 ?? '').trim())
    failures.push({ field: nameOf(item), message: '启用的状态栏正则缺少查找表达式。' });
  if (!content.text) failures.push({ field: nameOf(item), message: '启用的状态栏正则缺少可读取的替换内容。' });
}

const uiItems = fileItems.filter(
  item => /(^|[\\/])(界面|frontend|ui)([\\/]|$)/i.test(item.file) && /\.(?:ts|tsx|js|jsx|vue|html)$/i.test(item.file),
);
const statusUiItems = uiItems.filter(item =>
  /状态栏|status|defineMvuDataStore|StatusPlaceHolderImpl/i.test(`${item.file}\n${item.text}`),
);
function messageReadModes(item) {
  const calls = [];
  const callPattern = /(?:getVariables|Mvu\.getMvuData)\s*\(\s*\{([\s\S]{0,500}?)\}\s*\)/g;
  for (const match of item.text.matchAll(callPattern)) {
    const options = match[1];
    if (!/type\s*:\s*['"]message['"]/.test(options)) continue;
    calls.push({
      file: relative(item.file),
      unscoped: !/message_id\s*:/.test(options),
      current: /message_id\s*:\s*getCurrentMessageId\s*\(/.test(options),
      latest: /message_id\s*:\s*['"]latest['"]/.test(options),
      negative: /message_id\s*:\s*-\d+/.test(options),
    });
  }
  return calls;
}

let uiMessageAccess = {
  messageScope: false,
  currentMessage: false,
  latestMessage: false,
  negativeIndex: false,
  unscopedMessageReads: [],
  currentMessageFiles: [],
};
if (!variablesOnly && statusUiItems.length > 0) {
  const uiText = statusUiItems.map(item => item.text).join('\n');
  const explicitCalls = statusUiItems.flatMap(messageReadModes);
  const currentMessageFiles = statusUiItems
    .filter(item => /getCurrentMessageId\s*\(/.test(item.text))
    .map(item => relative(item.file));
  uiMessageAccess = {
    messageScope: /type\s*:\s*['"]message['"]/.test(uiText),
    currentMessage: /getCurrentMessageId\s*\(/.test(uiText),
    latestMessage: /message_id\s*:\s*['"]latest['"]/.test(uiText),
    negativeIndex: /message_id\s*:\s*-\d+/.test(uiText),
    unscopedMessageReads: explicitCalls.filter(call => call.unscoped).map(call => call.file),
    currentMessageFiles,
  };
  if (!/defineMvuDataStore|Mvu\.getMvuData|getVariables|getAllVariables/.test(uiText)) {
    failures.push({ field: '状态栏 UI', message: '发现状态栏源码，但未发现读取 MVU／变量的代码。' });
  }
  if (/\bTavernHelper\.(?:getVariables|getAllVariables|replaceVariables|createChatMessages|getChatMessages|Mvu)\b/.test(uiText)) {
    failures.push({
      field: '状态栏 UI',
      message: '把当前全局 API 错挂在 TavernHelper 命名空间下；请按目标 @types 使用直接全局函数／Mvu。',
    });
  }
  if (/\bMvu\b/.test(uiText) && !/waitGlobalInitialized\s*\(\s*['"]Mvu['"]\s*\)/.test(uiText)) {
    failures.push({
      field: '状态栏 UI',
      message: '直接使用 Mvu，但未在状态栏源码中发现 waitGlobalInitialized(\'Mvu\')；入口必须先等待全局就绪。',
    });
  }
  if (/\|\|\s*(?:mock|default)|useState\s*\(\s*(?:mock|default)/i.test(uiText)) {
    warnings.push({
      field: '状态栏 UI',
      message: '疑似把 mock/default 数据作为运行时回退；确认生产界面不会伪装真实状态。',
    });
  }
  if (uiMessageAccess.unscopedMessageReads.length > 0) {
    failures.push({
      field: '状态栏 UI',
      message: `消息变量读取省略了 message_id（默认 latest），无法证明与 store 读取同一楼层：${[...new Set(uiMessageAccess.unscopedMessageReads)].join(', ')}`,
    });
  }
  if (uiMessageAccess.currentMessage && (uiMessageAccess.latestMessage || uiMessageAccess.negativeIndex)) {
    failures.push({
      field: '状态栏 UI',
      message:
        '同一状态栏源码同时出现 getCurrentMessageId() 与 latest／负索引。等待、读取、刷新和写回必须复用同一个 VariableOption。',
    });
  } else if (
    statusRegexes.some(item => item?.启用 !== false) &&
    uiMessageAccess.messageScope &&
    !uiMessageAccess.currentMessage &&
    (uiMessageAccess.latestMessage || uiMessageAccess.negativeIndex)
  ) {
    failures.push({
      field: '状态栏 UI',
      message: '楼层占位符界面显式读取 latest／负索引而不是所在楼层；历史消息会串用最新状态。',
    });
  }
} else if (!variablesOnly && statusRegexes.some(item => item?.启用 !== false) && statusUiItems.length === 0) {
  warnings.push({
    field: '状态栏 UI',
    message: '存在启用的状态栏正则，但本地未找到对应界面源码；可能由外部 CDN 维护，需要另行验证。',
  });
}

const status = failures.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';
console.log(
  JSON.stringify(
    {
      indexPath,
      status,
      summary: {
        schemaCount: schemaItems.length,
        registrationCount: registrationItems.length,
        initSourceCount: initItems.length,
        variableListSourceCount: variableListItems.length,
        updateRuleSourceCount: updateRuleItems.length,
        outputProtocolSourceCount: outputItems.length,
        chineseWorldbookContract,
        statusRegexCount: statusRegexes.length,
        statusUiFileCount: statusUiItems.length,
        failureCount: failures.length,
        warningCount: warnings.length,
      },
      detected: {
        schemaFiles: schemaItems.map(item => relative(item.file) ?? item.name ?? '(inline Schema)'),
        registrationFiles: registrationItems.map(item => relative(item.file)).filter(Boolean),
        initSources: initItems.map(item => relative(item.file) ?? item.name),
        variableListSources: variableListItems.map(item => relative(item.file) ?? item.name),
        updateRuleSources: updateRuleItems.map(item => relative(item.file) ?? item.name),
        outputProtocolSources: outputItems.map(item => relative(item.file) ?? item.name),
        mvuWorldbookContract: {
          applicable: chineseWorldbookContract,
          expected:
            '[initvar] disabled; variable list, update rules and output format enabled; all blue and recursion-isolated; runtime entries system D0',
          entries: protocolEntryConfig,
        },
        statusUiFiles: statusUiItems.map(item => relative(item.file)),
        uiMessageAccess,
        schemaRoots,
        initRoots,
      },
      note:
        '中文 TavernSync 索引的 MVU 四条世界书协议是硬检查；历史原始卡、外部 CDN 和全局安装的 MVU 仍需结合目标环境人工确认等价语义。',
      failures,
      warnings,
    },
    null,
    2,
  ),
);

if (failures.length > 0 || (strict && warnings.length > 0)) process.exit(1);
