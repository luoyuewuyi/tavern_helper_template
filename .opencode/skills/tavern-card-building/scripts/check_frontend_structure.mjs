#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const target = args.find(arg => !arg.startsWith('--'));
const strict = args.includes('--strict');

if (!target) {
  console.error('Usage: node check_frontend_structure.mjs <ui-root-or-card-root> [--strict]');
  process.exit(2);
}

const resolved = path.resolve(target);
if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
  console.error(`Directory not found: ${resolved}`);
  process.exit(2);
}

const ignoredDirectory = /^(?:node_modules|dist|build|coverage|\.git)$/i;

function isEntryDirectory(dir) {
  return (
    fs.existsSync(path.join(dir, 'index.html')) &&
    ['index.ts', 'index.tsx', 'index.js', 'index.jsx', 'main.ts', 'main.tsx', 'main.js', 'main.jsx'].some(file =>
      fs.existsSync(path.join(dir, file)),
    )
  );
}

function findInterfaces(root) {
  if (isEntryDirectory(root)) return [root];
  const result = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || ignoredDirectory.test(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (isEntryDirectory(full)) result.push(full);
      else visit(full);
    }
  }
  visit(root);
  return result;
}

function collectFiles(root) {
  const result = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredDirectory.test(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && /\.(?:ts|tsx|js|jsx|vue|html|css|scss)$/i.test(entry.name)) result.push(full);
    }
  }
  visit(root);
  return result;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function lineCount(text) {
  return text.split(/\r?\n/).length;
}

function relative(root, file) {
  return path.relative(root, file).replaceAll('\\', '/');
}

function inspect(root) {
  const failures = [];
  const warnings = [];
  const files = collectFiles(root);
  const byRelative = new Map(files.map(file => [relative(root, file), file]));
  const textByFile = new Map(files.map(file => [file, read(file)]));
  const entryFile = ['index.ts', 'index.tsx', 'index.js', 'index.jsx', 'main.ts', 'main.tsx', 'main.js', 'main.jsx']
    .map(file => byRelative.get(file))
    .find(Boolean);
  const appFile = byRelative.get('App.vue') ?? byRelative.get('App.tsx');
  const contextFile = files.find(file => /(^|[\\/])context\.(?:ts|js)$/i.test(file));
  const releaseFile = files.find(file => /(^|[\\/])(?:release|version)\.(?:ts|js)$/i.test(file));
  const storeFiles = files.filter(file =>
    /(^|[\\/])(?:store|adapter|state|actions?)(?:[\\/.]|$)/i.test(relative(root, file)),
  );
  const actionFiles = files.filter(file => /(^|[\\/])actions?(?:[\\/]|\.)/i.test(relative(root, file)));
  const adapterFiles = files.filter(file => /(^|[\\/])(?:adapters?|host)(?:[\\/]|\.)/i.test(relative(root, file)));
  const heightCandidates = files.filter(file => /iframe[-_]?height|height[-_]?sync/i.test(relative(root, file)));
  const heightFiles = files.filter(
    file =>
      /ResizeObserver/.test(textByFile.get(file)) &&
      /body\.scrollHeight/.test(textByFile.get(file)) &&
      /frameElement(?:\.style|\s+as)/.test(textByFile.get(file)),
  );
  const componentFiles = files.filter(file => /(^|[\\/])components?[\\/].+\.(?:vue|tsx?)$/i.test(relative(root, file)));
  const htmlFile = byRelative.get('index.html');

  if (!htmlFile) failures.push({ field: 'index.html', message: '缺少静态挂载壳。' });
  if (!entryFile) failures.push({ field: '入口', message: '缺少 index.ts／main.ts（或对应 TSX／JS）薄入口。' });
  if (!appFile) failures.push({ field: 'App', message: '缺少页面级 App.vue／App.tsx。' });
  if (!contextFile) failures.push({ field: 'context', message: '缺少独立宿主上下文模块 context.ts。' });
  if (!releaseFile)
    warnings.push({
      field: '发布版本',
      message: '缺少 release.ts／version.ts 构建期版本源；云端发布时容易忘记同步破缓存版本。',
    });
  if (storeFiles.length === 0)
    failures.push({ field: '数据层', message: '缺少 store／adapter／state／actions 数据边界。' });
  if (componentFiles.length === 0)
    failures.push({
      field: 'components',
      message: '没有 components/ 下的业务或壳组件；正式界面不能全部堆在 App／index。',
    });
  if (heightFiles.length === 0)
    failures.push({
      field: 'iframe 高度',
      message: '缺少独立自动撑高模块（ResizeObserver + body.scrollHeight + frameElement.style.height）。',
    });
  if (heightCandidates.length > 0 && !heightCandidates.some(file => heightFiles.includes(file))) {
    failures.push({
      field: 'iframe 高度',
      message: `文件名看似高度模块，但自身没有完整协议：${heightCandidates.map(file => relative(root, file)).join(', ')}`,
    });
  }

  if (htmlFile) {
    const html = textByFile.get(htmlFile);
    if (/<(?:script|style|link)\b/i.test(html)) {
      failures.push({
        field: 'index.html',
        message: 'index.html 不是纯静态挂载壳；脚本和样式应由 TypeScript／组件导入并打包。',
      });
    }
    if (!/<(?:div|main)\b[^>]*\bid=["']app["']/i.test(html)) {
      warnings.push({
        field: 'index.html',
        message: '未发现 id="app" 挂载节点；若项目使用其他节点请人工确认入口一致。',
      });
    }
  }

  if (entryFile) {
    const entryText = textByFile.get(entryFile);
    if (lineCount(entryText) > 100)
      warnings.push({ field: '入口', message: `入口有 ${lineCount(entryText)} 行，可能混入业务逻辑。` });
    if (heightFiles.length > 0 && !/iframe[-_]?height|installIframeHeightSync|heightSync/i.test(entryText)) {
      failures.push({ field: '入口', message: '存在高度模块，但入口未导入／安装它。' });
    }
  }

  if (appFile && lineCount(textByFile.get(appFile)) > 320) {
    warnings.push({
      field: 'App',
      message: `App 文件有 ${lineCount(textByFile.get(appFile))} 行；应继续按信息职责拆分组件。`,
    });
  }

  for (const file of heightFiles) {
    const text = textByFile.get(file);
    if (!/pagehide/.test(text) || !/\.disconnect\s*\(/.test(text)) {
      failures.push({
        field: relative(root, file),
        message: '高度同步模块缺少 pagehide 清理或 ResizeObserver.disconnect()。',
      });
    }
    if (!/requestAnimationFrame/.test(text)) {
      warnings.push({
        field: relative(root, file),
        message: '高度测量未使用 requestAnimationFrame 合帧，可能在频繁布局变化时抖动。',
      });
    }
  }

  const componentHostApi =
    /\b(?:getVariables|replaceVariables|updateVariablesWith|getCurrentMessageId|triggerSlash|createChatMessages|getChatMessages)\s*\(|\bMvu\.|\bSillyTavern\./;
  const compositionFiles = [...new Set([appFile, ...componentFiles].filter(Boolean))];
  for (const file of compositionFiles) {
    if (componentHostApi.test(textByFile.get(file))) {
      failures.push({
        field: relative(root, file),
        message: 'App／组件直接调用酒馆宿主 API；请移到 context／store／adapter／actions。',
      });
    }
  }

  const allText = [...textByFile.values()].join('\n');
  if (/\bOPENING_CONTRACT_CUSTOMIZED\s*=\s*false\b/.test(allText)) {
    failures.push({
      field: '动态开局',
      message: '开局骨架仍标记为未定制；必须替换字段、Schema 路径、校验与正文后再设为 true。',
    });
  }
  const dynamicOpening =
    /\bcreateChatMessages\s*\(/.test(allText) && /开局|start[_-]?game|opening/i.test(allText);
  if (dynamicOpening) {
    const creationFiles = files.filter(file => /\bcreateChatMessages\s*\(/.test(textByFile.get(file)));
    if (actionFiles.length === 0) {
      failures.push({ field: '动态开局', message: '发现动态开局，但缺少独立 actions/ 或 action 文件承载事务。' });
    }
    if (adapterFiles.length === 0) {
      failures.push({ field: '动态开局', message: '发现动态开局，但缺少 adapter／host 模块封装消息与 MVU API。' });
    }
    const misplacedCreation = creationFiles.filter(
      file => !/(^|[\\/])(?:actions?|adapters?|host)(?:[\\/]|\.)/i.test(relative(root, file)),
    );
    if (misplacedCreation.length > 0) {
      failures.push({
        field: '动态开局',
        message: `createChatMessages 不在 action／adapter／host 边界中：${misplacedCreation
          .map(file => relative(root, file))
          .join(', ')}`,
      });
    }
    const readsZeroDirectly = /Mvu\.getMvuData\s*\(\s*\{[\s\S]{0,500}?message_id\s*:\s*0\b/.test(allText);
    const readsZeroThroughContext =
      contextFile &&
      /Mvu\.getMvuData\s*\(\s*variableOption\s*\)/.test(allText) &&
      /message_id\s*:\s*0\b/.test(textByFile.get(contextFile));
    if (!readsZeroDirectly && !readsZeroThroughContext) {
      failures.push({ field: '动态开局', message: '未发现从 message_id: 0 读取 MVU 初始数据。' });
    }
    if (!/\b(?:structuredClone|cloneDeep)\s*\(/.test(allText)) {
      failures.push({ field: '动态开局', message: '未发现深拷贝 0 层 stat_data；禁止原地修改初始化快照。' });
    }
    if (!/\bSchema\.parse\s*\(/.test(allText)) {
      failures.push({ field: '动态开局', message: '表单映射完成后未发现完整 Schema.parse 校验。' });
    }
    if (!/\bparse\s*:\s*/.test(allText)) {
      failures.push({ field: '动态开局', message: '开局字段契约缺少原始表单值到业务类型的 parse 步骤。' });
    }
    if (!/role\s*:\s*['"]assistant['"]/.test(allText)) {
      failures.push({ field: '动态开局', message: 'createChatMessages 的新开场必须明确创建 assistant 消息。' });
    }
    if (!/data\s*:\s*\{[\s\S]{0,300}?stat_data\b/.test(allText)) {
      failures.push({ field: '动态开局', message: '新开场消息未明确携带 data.stat_data。' });
    }
    if (!/<maintext>[\s\S]*<\/maintext>/i.test(allText)) {
      failures.push({ field: '动态开局', message: '未发现非空开场正文的 <maintext> 协议来源或校验。' });
    }
    if (!/escape(?:Markup|Xml|Html|Text)/i.test(allText)) {
      failures.push({ field: '动态开局', message: '自由输入进入开场标记前未发现 XML／HTML 文本转义函数。' });
    }
    if (!/previousLastId\s*!==\s*0\b/.test(allText) || !/createdId\s*!==\s*1\b/.test(allText)) {
      failures.push({ field: '动态开局', message: '未硬断言创建前只有第 0 层、创建后恰好得到第 1 层。' });
    }
    if (!/\bgetChatMessages\s*\(/.test(allText)) {
      failures.push({ field: '动态开局', message: '创建消息后未发现 getChatMessages 回读；成功提示没有目标端证据。' });
    }
  }
  if (releaseFile && !/data-ui-version/.test(allText)) {
    warnings.push({ field: '发布版本', message: '存在发布版本模块，但界面根节点没有 data-ui-version 核验标记。' });
  }
  const unscopedReads = [];
  const globalElementLookups = [];
  for (const file of files) {
    const text = textByFile.get(file);
    for (const match of text.matchAll(/(?:getVariables|Mvu\.getMvuData)\s*\(\s*\{([\s\S]{0,500}?)\}\s*\)/g)) {
      if (/type\s*:\s*['"]message['"]/.test(match[1]) && !/message_id\s*:/.test(match[1])) {
        unscopedReads.push(relative(root, file));
      }
    }
    for (const match of text.matchAll(/document\.getElementById\s*\(\s*(['"])([^'"]+)\1\s*\)/g)) {
      if (match[2] !== 'app') globalElementLookups.push(`${relative(root, file)}#${match[2]}`);
    }
  }
  if (unscopedReads.length > 0) {
    failures.push({
      field: '消息上下文',
      message: `消息读取省略 message_id（默认 latest）：${[...new Set(unscopedReads)].join(', ')}`,
    });
  }
  if (globalElementLookups.length > 0) {
    failures.push({
      field: '楼层 DOM 隔离',
      message: `使用 document.getElementById 查找业务节点会在多个楼层／面板间串实例；改用组件 ref 或当前根容器内查询：${[
        ...new Set(globalElementLookups),
      ].join(', ')}`,
    });
  }
  if (
    /getCurrentMessageId\s*\(/.test(allText) &&
    (/message_id\s*:\s*['"]latest['"]/.test(allText) || /message_id\s*:\s*-\d+/.test(allText))
  ) {
    failures.push({
      field: '消息上下文',
      message: '同一界面同时使用当前楼层和 latest／负索引。全链路必须复用同一 VariableOption。',
    });
  }
  if (
    /defineMvuDataStore|\bstat_data\b/.test(allText) &&
    contextFile &&
    !/variableOption/.test(textByFile.get(contextFile))
  ) {
    failures.push({ field: 'context', message: 'MVU 界面的 context.ts 未导出共享 variableOption。' });
  }

  for (const file of files.filter(file => /\.(?:css|scss|vue)$/i.test(file))) {
    const text = textByFile.get(file);
    if (/\b100vh\b/i.test(text))
      failures.push({ field: relative(root, file), message: '使用 100vh 会与消息 iframe 宿主高度形成错误依赖。' });
    if (/(?:html|body|#app)[^{]*\{[^}]*\b(?:height|min-height)\s*:\s*100%/is.test(text)) {
      failures.push({
        field: relative(root, file),
        message: '根节点使用 height/min-height: 100%，可能阻止 iframe 正确回缩并触发反馈循环。',
      });
    }
  }

  return {
    root,
    status: failures.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS',
    summary: {
      fileCount: files.length,
      componentCount: componentFiles.length,
      dataModuleCount: storeFiles.length,
      actionModuleCount: actionFiles.length,
      adapterModuleCount: adapterFiles.length,
      heightModuleCount: heightFiles.length,
      failureCount: failures.length,
      warningCount: warnings.length,
    },
    detected: {
      entry: entryFile ? relative(root, entryFile) : null,
      app: appFile ? relative(root, appFile) : null,
      context: contextFile ? relative(root, contextFile) : null,
      release: releaseFile ? relative(root, releaseFile) : null,
      dynamicOpening,
      actions: actionFiles.map(file => relative(root, file)),
      adapters: adapterFiles.map(file => relative(root, file)),
      heightModules: heightFiles.map(file => relative(root, file)),
      components: componentFiles.map(file => relative(root, file)),
    },
    failures,
    warnings,
  };
}

const interfaces = findInterfaces(resolved);
if (interfaces.length === 0) {
  console.error(`No frontend project (index.html + index/main entry) found under: ${resolved}`);
  process.exit(2);
}

const reports = interfaces.map(inspect);
const failures = reports.reduce((sum, report) => sum + report.summary.failureCount, 0);
const warnings = reports.reduce((sum, report) => sum + report.summary.warningCount, 0);
const status = failures > 0 ? 'FAIL' : warnings > 0 ? 'WARN' : 'PASS';

console.log(
  JSON.stringify(
    {
      target: resolved,
      status,
      summary: { interfaceCount: reports.length, failureCount: failures, warningCount: warnings },
      interfaces: reports,
    },
    null,
    2,
  ),
);

if (failures > 0 || (strict && warnings > 0)) process.exit(1);
