import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = path.resolve(import.meta.dirname, '..');
const sourcePath = path.join(workspaceRoot, 'dist', '西幻', '前端', 'index.html');
const targetPath = path.join(workspaceRoot, 'src', '西幻', '正则', '界面.txt');

if (!fs.existsSync(sourcePath)) {
  throw new Error(`未找到已构建的宿主 HTML: ${sourcePath}`);
}

fs.mkdirSync(path.dirname(targetPath), { recursive: true });

const html = fs.readFileSync(sourcePath, 'utf8').trim();
fs.writeFileSync(targetPath, `${html}\n`, 'utf8');

console.info(`[west_fantasy_host_sync] 已同步 ${path.relative(workspaceRoot, sourcePath)} -> ${path.relative(workspaceRoot, targetPath)}`);
