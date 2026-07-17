#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(here, 'check_frontend_structure.mjs');
const assets = path.resolve(here, '..', 'assets');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tavern-frontend-contract-'));

function run(target) {
  return spawnSync(process.execPath, [checker, target, '--strict'], { encoding: 'utf8' });
}

function assertPass(name, target) {
  const result = run(target);
  assert.equal(result.status, 0, `${name} should pass:\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /"status": "PASS"/);
  process.stdout.write(`PASS ${name}\n`);
}

function assertFail(name, target, expectedMessage) {
  const result = run(target);
  const output = `${result.stdout}\n${result.stderr}`;
  assert.notEqual(result.status, 0, `${name} should fail`);
  assert.match(output, new RegExp(expectedMessage, 'u'), `${name} missed expected failure:\n${output}`);
  process.stdout.write(`PASS ${name}\n`);
}

try {
  assertPass('modular status UI asset', path.join(assets, 'status-ui-vue'));
  const openingAsset = path.join(assets, 'dynamic-opening-vue');
  assertFail('unconfigured opening skeleton is rejected', openingAsset, '开局骨架仍标记为未定制');

  const configuredOpening = path.join(tempRoot, 'configured-opening');
  fs.cpSync(openingAsset, configuredOpening, { recursive: true });
  const openingContract = path.join(configuredOpening, 'opening-contract.ts');
  fs.writeFileSync(
    openingContract,
    fs.readFileSync(openingContract, 'utf8').replace('OPENING_CONTRACT_CUSTOMIZED = false', 'OPENING_CONTRACT_CUSTOMIZED = true'),
    'utf8',
  );
  assertPass('customized transactional dynamic opening', configuredOpening);

  const singleFile = path.join(tempRoot, 'single-file');
  fs.mkdirSync(singleFile, { recursive: true });
  fs.writeFileSync(
    path.join(singleFile, 'index.html'),
    '<head><style>body{height:100vh}</style></head><body><div id="app"></div><script>console.log(1)</script></body>',
    'utf8',
  );
  fs.writeFileSync(path.join(singleFile, 'index.ts'), 'document.getElementById("status");\n', 'utf8');
  assertFail('single-file interface is rejected', singleFile, 'index.html 不是纯静态挂载壳');

  const noReadback = path.join(tempRoot, 'no-readback');
  fs.cpSync(configuredOpening, noReadback, { recursive: true });
  const adapter = path.join(noReadback, 'host', 'message-adapter.ts');
  fs.writeFileSync(adapter, fs.readFileSync(adapter, 'utf8').replaceAll('getChatMessages', 'readMessages'), 'utf8');
  assertFail('dynamic opening without readback is rejected', noReadback, 'getChatMessages 回读');

  process.stdout.write('All frontend contract regression cases passed.\n');
} finally {
  const tempBase = path.resolve(os.tmpdir());
  const resolvedTemp = path.resolve(tempRoot);
  if (resolvedTemp.startsWith(`${tempBase}${path.sep}`) && path.basename(resolvedTemp).startsWith('tavern-frontend-contract-')) {
    fs.rmSync(resolvedTemp, { recursive: true, force: true });
  }
}
