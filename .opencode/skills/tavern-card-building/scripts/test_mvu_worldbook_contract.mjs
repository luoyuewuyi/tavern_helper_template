#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(here, 'check_status_variable_bridge.mjs');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tavern-mvu-contract-'));

function write(relativePath, content) {
  const target = path.join(tempRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
}

function indexYaml({ initEnabled = 'false', includeInitEnabled = true, runtimeEnabled = 'true' } = {}) {
  const initEnabledLine = includeInitEnabled ? `        启用: ${initEnabled}\n` : '';
  return `名称: MVU 契约回归样例
条目:
  - 文件夹: 变量
    条目:
      - 名称: '[initvar]变量初始化勿开'
${initEnabledLine}        激活策略:
          类型: 蓝灯
        插入位置:
          类型: 角色定义之前
          顺序: 14720
        递归:
          不可被其他条目激活: true
          不可激活其他条目: true
        文件: 世界书/变量/initvar
      - 名称: 变量列表
        启用: ${runtimeEnabled}
        激活策略:
          类型: 蓝灯
        插入位置:
          类型: 指定深度
          角色: 系统
          深度: 0
          顺序: 14720
        递归:
          不可被其他条目激活: true
          不可激活其他条目: true
        文件: 世界书/变量/变量列表
      - 名称: '[mvu_update]变量更新规则'
        启用: true
        激活策略:
          类型: 蓝灯
        插入位置:
          类型: 指定深度
          角色: 系统
          深度: 0
          顺序: 14720
        递归:
          不可被其他条目激活: true
          不可激活其他条目: true
        文件: 世界书/变量/变量更新规则
      - 名称: '[mvu_update]变量输出格式'
        启用: true
        激活策略:
          类型: 蓝灯
        插入位置:
          类型: 指定深度
          角色: 系统
          深度: 0
          顺序: 14720
        递归:
          不可被其他条目激活: true
          不可激活其他条目: true
        文件: 世界书/变量/变量输出格式
`;
}

function prepareFixture(options = {}) {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  fs.mkdirSync(tempRoot, { recursive: true });
  write('index.yaml', indexYaml(options));
  write(
    'schema.ts',
    `export const Schema = z.object({
  世界: z.object({ 当前时间: z.string() }),
});
registerMvuSchema(Schema);
Mvu.events.on('updated', () => undefined);
`,
  );
  write('世界书/变量/initvar.yaml', options.emptyInit ? '{}\n' : '世界:\n  当前时间: 清晨\n');
  write(
    '世界书/变量/变量列表.txt',
    '---\n<status_current_variable>\n{{format_message_variable::stat_data}}\n</status_current_variable>\n',
  );
  write(
    '世界书/变量/变量更新规则.yaml',
    '---\n变量更新规则:\n  世界.当前时间:\n    - 只有正文明确发生时间推进时才更新，否则保持不变。\n',
  );
  write(
    '世界书/变量/变量输出格式.yaml',
    '---\n变量输出格式:\n  format: |-\n    <UpdateVariable>\n    <JSONPatch>[]</JSONPatch>\n    </UpdateVariable>\n',
  );
}

function runCase(name, options, expectedSuccess, expectedMessage = '') {
  prepareFixture(options);
  const result = spawnSync(process.execPath, [checker, tempRoot, '--variables-only', '--strict'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  const combined = `${result.stdout}\n${result.stderr}`;
  if (expectedSuccess) {
    assert.equal(result.status, 0, `${name} should pass:\n${combined}`);
    assert.match(result.stdout, /"status": "PASS"/, `${name} should report PASS`);
  } else {
    assert.notEqual(result.status, 0, `${name} should fail`);
    assert.match(combined, new RegExp(expectedMessage, 'u'), `${name} missed expected failure:\n${combined}`);
  }
  process.stdout.write(`PASS ${name}\n`);
}

try {
  runCase('valid canonical contract', {}, true);
  runCase('initvar enabled is rejected', { initEnabled: 'true' }, false, '启用 必须为布尔值 false');
  runCase('missing initvar enabled is rejected', { includeInitEnabled: false }, false, '缺少显式布尔字段');
  runCase('empty initvar is rejected', { emptyInit: true }, false, 'initvar 是空对象');
  runCase('disabled runtime protocol is rejected', { runtimeEnabled: 'false' }, false, '启用 必须为布尔值 true');
  process.stdout.write('All MVU worldbook contract regression cases passed.\n');
} finally {
  const tempBase = path.resolve(os.tmpdir());
  const resolvedTemp = path.resolve(tempRoot);
  if (resolvedTemp.startsWith(`${tempBase}${path.sep}`) && path.basename(resolvedTemp).startsWith('tavern-mvu-contract-')) {
    fs.rmSync(resolvedTemp, { recursive: true, force: true });
  }
}
