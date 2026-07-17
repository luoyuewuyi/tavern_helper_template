import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import YAML from 'yaml';
import { Schema } from '../../schema';

// 复制到目标项目后，按测试文件的真实位置调整这两个路径；不得把示例路径当作已验证。
const here = path.dirname(fileURLToPath(import.meta.url));
const initvarPath = path.resolve(here, 'initvar.yaml');

describe('MVU Schema/initvar contract', () => {
  it('parses initvar and remains idempotent after a second parse', () => {
    const initvar = YAML.parse(fs.readFileSync(initvarPath, 'utf8'));
    const once = Schema.parse(initvar);
    const twice = Schema.parse(once);

    expect(twice).toEqual(once);
  });
});
