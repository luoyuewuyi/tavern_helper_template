#!/usr/bin/env node
import path from 'node:path';
import {
  compareOpenings,
  extractCardMessages,
  readArtifact,
  readProject,
} from './lib/card-opening.mjs';

function usage() {
  console.error('Usage: node check_character_roundtrip.mjs <project-root-or-index.yaml> [--tavern-sync] [--artifact <png|json|charx>] [--readback <project-root-or-index.yaml>] [--strict]');
}

function parseArgs(argv) {
  const result = { target: null, tavernSync: false, artifact: null, readback: null, strict: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--tavern-sync') result.tavernSync = true;
    else if (arg === '--strict') result.strict = true;
    else if (arg === '--artifact' || arg === '--readback') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) throw new Error(`${arg} 缺少路径参数。`);
      result[arg.slice(2)] = value;
      index += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`未知参数：${arg}`);
    } else if (result.target === null) {
      result.target = arg;
    } else {
      throw new Error(`多余的位置参数：${arg}`);
    }
  }
  return result;
}

function messageSummary(message) {
  return {
    index: message.index,
    mode: message.mode,
    source: message.resolved ?? message.source ?? null,
    visibleCharacters: message.visibleCharacters,
    sha256: message.sha256,
  };
}

function cardMessageSummary(message) {
  return {
    index: message.index,
    visibleCharacters: message.visibleCharacters,
    sha256: message.sha256,
  };
}

let options;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  usage();
  console.error(error.message);
  process.exit(2);
}

if (!options.target) {
  usage();
  process.exit(2);
}

const failures = [];
const warnings = [];
let source;

try {
  source = readProject(options.target, { tavernSync: options.tavernSync });
  failures.push(...source.failures);
  warnings.push(...source.warnings);
} catch (error) {
  console.error(error.message);
  process.exit(2);
}

const report = {
  source: {
    indexPath: source.indexPath,
    messages: source.messages.map(messageSummary),
    avatar: source.avatar,
  },
  artifact: null,
  readback: null,
};

if (options.artifact) {
  try {
    const artifact = readArtifact(options.artifact);
    if (artifact.extensionMismatch) {
      failures.push({
        stage: 'artifact',
        field: 'container',
        message: `扩展名 ${artifact.extension} 声称是 ${artifact.expectedContainer}，文件魔数却是 ${artifact.container}。`,
      });
    }

    const variants = artifact.variants.map(variant => {
      const messages = extractCardMessages(variant.card);
      failures.push(...compareOpenings(source.messages, messages, `artifact:${variant.keyword}`));
      return {
        keyword: variant.keyword,
        spec: variant.card?.spec ?? null,
        specVersion: variant.card?.spec_version ?? null,
        messages: messages.map(cardMessageSummary),
      };
    });

    report.artifact = {
      path: artifact.path,
      bytes: artifact.bytes,
      fileSha256: artifact.fileSha256,
      container: artifact.container,
      extension: artifact.extension,
      expectedContainer: artifact.expectedContainer,
      extensionMismatch: artifact.extensionMismatch,
      preferredVariant: artifact.preferred.keyword,
      variants,
    };
  } catch (error) {
    failures.push({ stage: 'artifact', field: 'file', message: error.message });
  }
}

if (options.readback) {
  try {
    const readback = readProject(options.readback, { tavernSync: options.tavernSync });
    failures.push(...readback.failures.map(item => ({ ...item, stage: 'readback' })));
    warnings.push(...readback.warnings.map(item => ({ ...item, stage: 'readback' })));
    failures.push(...compareOpenings(source.messages, readback.messages, 'readback'));
    report.readback = {
      indexPath: readback.indexPath,
      messages: readback.messages.map(messageSummary),
      avatar: readback.avatar,
    };
  } catch (error) {
    failures.push({ stage: 'readback', field: 'file', message: error.message });
  }
}

if (!options.artifact && !options.readback) {
  warnings.push({
    stage: 'roundtrip',
    field: 'evidence',
    message: '只完成了源文件／TavernSync 前置检查；没有提供 --artifact 或 --readback，不能据此声称已打包或已导入。',
  });
}

const status = failures.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';
const verifiedLevel = options.readback ? 'target-readback' : options.artifact ? 'artifact' : 'source-preflight';
const allowedClaim = failures.length > 0
  ? '验证失败，不得声明开场已打包或已导入。'
  : options.readback
    ? '可声明“目标角色定义已导入并回读一致”；仍不能据此声明已有聊天首楼已自动更新。'
    : options.artifact
      ? '只可声明“已打包并解码一致”；没有目标端回读，不得声明“已导入”。'
      : '只可声明“源项目／TavernSync 前置检查已完成”；不得声明已打包、已 push 或已导入。';
console.log(JSON.stringify({
  status,
  verifiedLevel,
  allowedClaim,
  summary: {
    sourceMessageCount: source.messages.length,
    artifactChecked: Boolean(options.artifact),
    readbackChecked: Boolean(options.readback),
    tavernSyncPreflight: options.tavernSync,
    failureCount: failures.length,
    warningCount: warnings.length,
  },
  failures,
  warnings,
  ...report,
}, null, 2));

if (failures.length > 0 || (options.strict && warnings.length > 0)) process.exit(1);
