import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'src');
const archiveRoot = path.join(root, '角色卡');
const targetName = process.argv[2]?.trim();

if (!targetName) {
  console.error('用法: pnpm stage:card -- 项目名');
  process.exit(1);
}

if (!fs.existsSync(srcRoot)) {
  fs.mkdirSync(srcRoot, { recursive: true });
}

if (!fs.existsSync(archiveRoot)) {
  fs.mkdirSync(archiveRoot, { recursive: true });
}

const srcProjectPath = path.join(srcRoot, targetName);
const archivedProjectPath = path.join(archiveRoot, targetName);

for (const entry of fs.readdirSync(srcRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === targetName) {
    continue;
  }

  const from = path.join(srcRoot, entry.name);
  const to = path.join(archiveRoot, entry.name);

  if (fs.existsSync(to)) {
    console.error(`无法暂存 '${entry.name}': 角色卡目录中已存在 '${to}'`);
    process.exit(1);
  }

  fs.renameSync(from, to);
  console.info(`[stage] 已将 '${entry.name}' 从 src 移回角色卡归档`);
}

if (fs.existsSync(srcProjectPath)) {
  console.info(`[stage] '${targetName}' 已经在 src 中, 可直接继续制作`);
  process.exit(0);
}

if (!fs.existsSync(archivedProjectPath)) {
  console.error(`未找到项目 '${targetName}', 既不在 src 中, 也不在角色卡归档中`);
  process.exit(1);
}

fs.renameSync(archivedProjectPath, srcProjectPath);
console.info(`[stage] 已将 '${targetName}' 移入 src, 现在可以单独构建这个项目`);
