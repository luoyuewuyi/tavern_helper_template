# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A workspace for building **Tavern Helper** frontends and scripts for **SillyTavern** (酒馆). Projects are character cards (角色卡), worldbooks (世界书), status bars (状态栏), script enhancements, and MVU-driven variable systems that run inside SillyTavern via iframe-based scripts.

Rules live in `.cursor/rules/` — read the relevant one for each task domain:

- `项目基本概念.mdc` — core concepts (always applied)
- `酒馆变量.mdc` — variable types (global/character/chat/message/script)
- `酒馆助手接口.mdc` — Tavern Helper API surface
- `mvu变量框架.mdc` — MVU variable framework (per-message `stat_data`, `Mvu.*` API)
- `mvu角色卡.mdc` — MVU card folder structure, schema rules, worldbook protocol
- `前端界面.mdc` — frontend UI (has `index.html` + `index.ts`)
- `脚本.mdc` — scripts (has only `index.ts`)

## Essential commands

```bash
# Build all projects (TypeScript → dist/)
pnpm build

# Watch mode with live reload to connected Tavern
pnpm watch

# Sync tavern_sync.yaml projects from/to Tavern
node tavern_sync.mjs pull <项目名>       # pull card from Tavern
node tavern_sync.mjs push <项目名> -f   # push card to Tavern (force)
node tavern_sync.mjs update             # update sync script

# Lint / format
pnpm lint
pnpm format

# Bundle all configured cards into distributable PNGs
node tavern_sync.mjs bundle all
```

## Project structure

```
src/<项目名>/           # active project (only one at a time for card work)
  界面/                 # frontend UI source (has index.html + index.ts)
  脚本/                 # script source (has index.ts or plain .js)
  正则/                 # regex replacement text files
  世界书/               # worldbook entry text files
  第一条消息/           # opening message files

示例/                   # reference examples (read-only)
初始模板/               # templates for new projects
角色卡/                 # card archives (yaml/png bundles)
dist/                   # webpack build output
util/                   # shared utilities (mvu.ts, script.ts, common.ts, streaming.ts)
@types/                 # TypeScript declarations for Tavern Helper APIs
```

## Key architectural concepts

### Frontend vs Script

- **Frontend** (`index.html` + `index.ts`): renders a visible iframe UI in a chat message
- **Script** (`index.ts` only): runs in a hidden iframe, jQuery operates on the full Tavern page via `window.$ = window.parent.$`

### MVU variable system

- Data stored per-message under `stat_data` key: `_.get(variables, 'stat_data')`
- Initialized via `<UpdateVariable><initvar>...</initvar></UpdateVariable>` in opening message
- Updated via AI-generated `<UpdateVariable><JSONPatch>[...]</JSONPatch></UpdateVariable>`
- Schema registered via `registerMvuSchema(Schema)` using zod 4
- Each message copies previous message's `stat_data` forward; reading latest data requires `Mvu.getMvuData({type:'message', message_id: -1})` NOT `getAllVariables()`

### Build pipeline

- webpack compiles every `{示例,src}/**/index.{ts,tsx,js,jsx}` entry point
- If a sibling `index.html` exists → produces inline `dist/<project>/index.html`
- If no `index.html` → produces `dist/<project>/index.js`
- Build also dumps `schema.ts` → `schema.json` and bundles all configured cards

### Imports

- `import 'file?raw'` → file content as string (TS/SCSS get compiled first)
- `import 'file.html'` → minified HTML string via html-loader
- `import 'file.md'` → HTML string via remark-loader
- `import Component from 'file.vue'` → Vue SFC
- Globals always available (no import needed): `$`, `_`, `z`, `toastr`, `YAML`
- External CDN modules use full URLs: `import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js'`

## Character card hard rules (violating = import failure)

1. **No nested folders in worldbook entries**: `条目:` → `文件夹:` → flat `条目:` only. Group with `===分隔符===` entries.
2. **Must configure `tavern_sync.yaml`**: Add entry under `配置:` with `类型`, `酒馆中的名称`, `本地文件路径` (no extension), `导出文件路径`.
3. **Opening message file ref uses backslash**: `第一条消息\0` not `第一条消息/0.txt`.
4. **Top-level metadata uses empty strings, never `null`**: `头像: ''`, `版本: ''`, `作者: ''`, `备注: ''`.
5. **Workflow is `配置 → pull → 修改`**: Pull from Tavern first, edit pulled files. Never create from scratch or copy from templates.
6. **Never make character art (卡图)**. The user handles images.
7. **Worldbook = playable content only**. No "原作: xxx" meta-info.
8. **Character lore must be web-searched and verified**. Don't rely on memory.
9. **Only two insertion positions for worldbook**: `角色定义之前` (default) or `指定深度` + `角色: 系统`.
10. **Regex replacement content = code block only**. No extra text/descriptions outside ``` ```.
11. **MVU schema rules**: all `z.object()` must have `.prefault({})` at root and every nested level. Use `z.coerce.number()` for numbers, `z.record()` over arrays, `.prefault()` over `.default()`, `.catch()` for fallback values.

## MVU status bar data reading (CRITICAL)

Status bars in regex replacements must read from the LATEST message's MVU data, not the current message:

```javascript
// WRONG — only reads the current message's stat_data (stale after first update)
const d = _.get(getAllVariables(), 'stat_data', {});

// RIGHT — reads latest message's propagated stat_data
const mvuData = Mvu.getMvuData({ type: 'message', message_id: -1 });
const d = _.get(mvuData, 'stat_data', {});
```

Subscribe to `Mvu.events.VARIABLE_UPDATE_ENDED` for real-time updates with `setInterval` as fallback.

## UI build & deploy (HARD RULES)

1. **Workflow**: 用户酒馆建空白卡 → `pull` → 改本地 → `push -f`。pull 过一次后直接改本地 push。
2. **Build**: `pnpm build`（生产模式），产出在 `dist/`。
3. **CDN deploy**: dist 产出 push 到 `luoyuewuyi/tavern-ui`。引用 URL 用 `testingcf.jsdelivr.net` 国内镜像，**不加 `@main`**（镜像不支持版本标签）：`https://testingcf.jsdelivr.net/gh/luoyuewuyi/tavern-ui/...`。国内备选：`fastly.jsdelivr.net`、`gcore.jsdelivr.net`。
4. **Regex markers**: 占位符用中文标记 `【开局界面】` `【状态栏】`，查找用 `/【标记】/g` 格式。
5. **Regex replacement**: UI 类正则必须用 ` ```html ` 包裹完整网页内容，酒馆才会渲染为 iframe。
6. **大 UI 加载**: 用 `$('body').load(CDN_URL)` 加载，绝不可内联大 HTML 到正则。
7. **API 优先**: 优先使用酒馆助手 `@types` 参考文件里的接口（`triggerSlash`、`Mvu`、`getVariables` 等），不用酒馆底层 API。
8. **触发生成**: 对齐 道渊 模式，用 `triggerSlash('/trigger')`，加 `parent` 回退和函数存在性检查。
7. **第一条消息**: 只能放占位符或开篇剧情，绝不放 `<UpdateVariable>` 变量初始化。
8. **No localhost**: CDN URL 用 jsDelivr `@main`，不用 localhost。
