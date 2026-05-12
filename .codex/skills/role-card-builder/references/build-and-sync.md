# Build And Sync

## Regex UI Sync Hard Rules

- After any regex-driven UI build, sync the exact built `dist/.../index.html` back into `index.yaml`; stale replacements are a bug even if source files build.
- For `iframe srcdoc`, collapse the built HTML to one physical line before inserting into YAML, escape `&`, `<`, `>`, and `"`, and strip `sourceMappingURL` comments. Then run `pnpm sync bundle "<project>"` or an equivalent YAML parse/bundle check to verify the card can be packaged.
- Inspect the final `index.yaml` replacement block, not only `dist`. It must contain a renderable iframe/container and must not contain raw `<script`, unescaped `<head>`, minified source printed as chat text, or YAML-broken continuation lines.
- Build hooks may generate `src/<project>/<project>.png`; remove that generated PNG unless the user explicitly requested a bundle/export.

## 基本规则

- 任何包含界面的需求都必须执行 `pnpm build`。
- 不能把“源码已写完但还没 build”当成完成。
- 若构建失败，先修到构建通过，再结束任务。
- 若界面由正则替换注入，build 后必须把正则替换内容同步为可渲染容器，而不是裸 HTML/JS 源码。检查 `index.yaml` 中最终替换内容不会在聊天楼层显示 `<script>`、minified JS、转义 HTML 或构建文本。
- 默认以 `pnpm build` 作为最终收尾验证；不要在任务末尾执行 `node tavern_sync.mjs bundle <项目名>`。
- 只有用户当次明确要求打包、导出 PNG 或 bundle 时，才执行 `tavern_sync bundle`。

## 当前仓库行为

- 当前仓库默认只构建 `src/**`，示例不会随普通 build 一起打包；只有显式设置 `BUILD_INCLUDE_EXAMPLES=true` 时才包含示例。
- 当前仓库的同步打包只处理 `src/*/index.yaml` 对应的当前项目；不要再按旧习惯假设会自动打包示例或归档目录。
- 开始实现前，先查看 `package.json` 和 `webpack.config.ts`，确认是否存在项目专属构建脚本或 post-build 钩子。
- 如果某项目已有专属构建后同步逻辑，必须保留并兼容，不要被通用流程覆盖掉。

## 当前脚本

- `pnpm stage:card -- <项目名>`：维护 `src` 与 `角色卡/` 的切换。
- `pnpm build`：构建当前 `src` 项目。
- `pnpm sync ...`：按当前仓库同步规则处理 tavern_sync。
- `node tavern_sync.mjs bundle <项目名>`：非默认收尾命令，只在用户明确要求打包 PNG 时使用。

## 特殊情况

- 如果任务涉及专属宿主同步或 post-build 文件回写，先检查 `webpack.config.ts` 与 `util/` 中是否已有项目专属逻辑。
