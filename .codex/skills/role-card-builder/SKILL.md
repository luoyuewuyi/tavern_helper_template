---
name: role-card-builder
description: Build or update Tavern character-card projects inside this repository. Use when creating or modifying 酒馆角色卡、世界书、脚本、状态栏、前端界面、变量界面、MVU 界面、正则替换界面, especially when the user gives a project name and expects staging/pulling the project, working under src, running pnpm build when implementation changes require it, and stopping at a locally prepared result for manual push or import.
---

# Role Card Builder

Use this skill as a strict router. Do not read every rule, example, type file, or helper up front. First classify the request, then follow only the matching lane and load only the referenced files required by that lane.

## Non-Negotiables

- Work in the repository root.
- Preserve unrelated user changes. Do not revert files unless explicitly asked.
- Default to extending the user's existing project. Unless the user explicitly says to modify, rewrite, replace, rebuild, rename, or delete existing content, do not alter the existing foundation; only add the requested missing pieces.
- If the user says they already made most of the card/project, treat that existing work as authoritative. Do not recreate the project from documents, zip files, examples, or templates; locate the existing project first and extend it in place.
- Do not infer that a similarly named project is the target. If the exact project name is not found, stop before editing and ask for the correct path or source instead of staging or modifying another project.
- Do not rename a project, change `tavern_sync.yaml` project keys, move archive projects, or create a replacement project unless the user explicitly asks for that exact operation.
- `src` may contain only the current project while building or syncing a character-card project.
- Do not run `node tavern_sync.mjs bundle <项目名>` unless the user explicitly asks for a PNG/package.
- Final verification for implementation changes is `pnpm build` or an equivalent local pnpm invocation if `pnpm` is not on PATH.
- **新建或修改角色卡项目后，必须在 `tavern_sync.yaml` 的 `配置:` 下添加同步条目**（类型/酒馆中的名称/本地文件路径/导出文件路径），否则用户无法导入。
- **index.yaml 世界书条目禁止文件夹嵌套**：`条目:` 下只能有一层 `文件夹:` → `条目:`，不准嵌套。分组用 `===名称===` 分隔符。违反则同步脚本报"无效输入"。
- Any interface-facing display counts as UI, including regex beautification blocks, status bars, HTML/CSS snippets, iframe renderers, front-end panels, and visual replacements. Unless the user explicitly says not to build or asks for prompt-only/text-only output, route it through source files under `src/<项目名>/界面/...`, run the build, and sync the built `dist/<项目名>/.../index.html` back into the regex or card entry.
- Do not treat a styled regex replacement as "just text" when it contains HTML/CSS or is meant to render a visual panel. It must have a built dist artifact unless the user explicitly requests a pure plaintext code-block status with no UI beautification.
- Stop at local prepared output. The user handles push/import unless they explicitly ask otherwise.
- If a requested patch or write is large, split by file or smaller chunks before failure.
- If switching to chunked delivery is needed, tell the user exactly: `Content is large, so I am continuing in smaller steps or per-file chunks. The content stays the same; I am only using a more reliable way to apply it.`

## Fast Start

1. Identify the project name from the user.
2. Locate the exact existing project before editing. If the user says the project already exists but the exact project cannot be found, stop and ask for the path/source.
3. Classify the task into one or more lanes in **Lane Router**.
4. Read only the lane's required references and the target project's directly relevant files.
5. Stage/pull only when the lane requires project files and only after the exact target is confirmed.
6. Make the minimal additive change required; do not rewrite existing foundation content unless explicitly requested.
7. Run the lane's verification.
8. Summarize local files changed and any skipped sync/build reason.

## Project Setup Lane

Use this lane when a project must be pulled, staged, created, synced, or edited locally.

1. Read `references/project-staging.md` and `references/workflow.md`.
2. Check whether `tavern_sync.yaml` has the project config.
3. If missing, add only that config entry, then run `node tavern_sync.mjs pull <项目名>`.
4. If present and the project is in archive, run `pnpm stage:card -- <项目名>` or the repo's equivalent stage script.
5. If `pnpm` is unavailable on PATH, use the repo's direct `node` script where appropriate, or `corepack pnpm ...` for pnpm commands.
6. Do not inspect unrelated project archives as examples unless the lane explicitly allows examples.

## Lane Router

### A. UI Prompt Only

Use when the user says the UI is already being generated elsewhere, asks for a UI prompt, asks to make a prompt for a UI-focused AI, or says they will bring the generated UI back for integration.

Allowed actions:
- Read the current project's variable/world/character files only if needed to know what the UI must display.
- Return only the implementation-ready UI prompt.

Forbidden actions:
- Do not modify character-card files.
- Do not modify schema, variables, regex, script, interface source, or worldbook files.
- Do not run build, pull, bundle, or sync unless the user separately asks for project setup.

Prompt requirements:
- Define theme, tone, important information, functional goals, constraints, and must-have content.
- Do not prescribe rigid block-by-block layout or exact visual placement.

### B. Direct Frontend or Status UI Implementation

Use only when the user explicitly asks to directly implement UI code or when they return generated UI code for integration.

Read:
- `references/ui-types.md`
- `references/interface-sources.md`
- `references/build-and-sync.md`
- `references/style-and-safety.md`
- Relevant `.cursor/rules/前端界面.mdc`

Rules:
- Source belongs under `src/<项目名>/界面/...` or the established project path.
- Final `index.yaml` must reference built `dist/<项目名>/...` artifacts for formal UI.
- Do not place raw full UI HTML/CSS/JS directly in worldbook, message text, or regex replacement. If regex must carry a UI, it must carry a renderable container such as an `iframe srcdoc` whose content is a complete built HTML document, or use the project's established built-artifact loading path.
- A built UI artifact must be a complete webpage when it is meant to render in a floor or regex replacement: include `<!doctype html>`, `<html>`, `<head>`, viewport/meta as needed, and `<body>` with the mount root. A bare `<script>...</script><style>...</style><div...>` fragment is not acceptable.
- When adapting UI generated by another tool, remove external runtime dependencies unless the project already has a proven local loading path for them. Prefer vanilla TS/CSS or repo-local dependencies that bundle into the final artifact.
- After build, inspect the generated `dist/<项目名>/界面/.../index.html` for unintended external module URLs such as `https://.../+esm`, `scheduler`, `framer`, `react`, `motion`, or CDN imports. Fix these before delivery unless the user explicitly wants remote dependencies.
- For MVU status bars, avoid waiting forever for `stat_data` before first render. Render a safe default after `Mvu` initializes, then poll or subscribe to the current message-floor variables so later MVU writes are reflected. If a regex injects the built status HTML, sync the regex replacement from the newly built `dist` artifact after every status UI code change.
- MVU status bars must reflect variable updates after generation or interaction. Do not rely only on `getCurrentMessageId()`: first try the current iframe/message context (`getVariables({ type: 'message' })`), then `latest`, last message id, current message id, `Mvu.getMvuData(...)`, and `getAllVariables()` as fallbacks. Subscribe to `Mvu.events.VARIABLE_UPDATE_ENDED` and useful Tavern message/generation events when available, with polling as a fallback.
- If the project has mojibake/encoding-damaged schema or initvar field names, do not change the variable protocol just to make the UI read data. Add a read-only alias layer in the UI/data adapter so normal Chinese field paths and existing stored field paths both resolve.
- For variable-card/status-bar regex lookup expressions, use the repo example default exactly: `<StatusPlaceHolderImpl/>`. Do not replace it with invented tags such as `<Status/>`, `<HonghuangStatus/>`, project-specific status labels, or script-loader pseudo protocols unless the user explicitly provides a different existing protocol.
- Before finishing, inspect the actual regex replacement that Tavern will display. It must render a UI, not display minified JS, `<script>` text, escaped HTML, or source code in the chat floor.
- For regex-injected `srcdoc`/inline HTML status bars, parse-check the generated inline `<script>` before delivery, both raw and after one HTML entity decode pass. Avoid code that minifies into fragile entity/quote sequences such as raw `&quot;` or `&#39;` replacement strings; build entity text at runtime with `String.fromCharCode(38)` or another srcdoc-safe expression.
- Verify with `pnpm build`.

### C. MVU Script or Variable Structure

Use when the task mentions MVU script, schema, variable structure, variable update behavior, or missing MVU loader.

Read:
- `.cursor/rules/mvu变量框架.mdc`
- `.cursor/rules/脚本.mdc`
- `references/variable-structure.md`
- `references/build-and-sync.md` if source files under `脚本/*/index.ts` are changed.

Rules:
- MVU body script is stable by default. Add or ensure the `mvu` loader only when the card lacks it and the task requires MVU to run.
- Existing `变量列表`, `变量输出格式`, and `变量更新规则` are stable protocols. Do not change fields, tags, command format, or purpose unless the user explicitly asks.
- Schema and variable structure changes must stay limited to persistent data and validation logic.
- Formal scripts go through `src -> pnpm build -> dist`; do not inline new formal scripts into `index.yaml`.
- If an existing pulled card already has an inline or direct script, only adjust the requested missing piece; do not refactor the whole card unless asked.
- When a status bar or UI shows variables as "not updating", first verify the MVU data chain before changing presentation: the schema must be registered, the root schema and nested object groups must tolerate empty `{}` input with defaults/prefaults, the initial floor or initvar path must create `stat_data`, and later JSONPatch operations must target existing paths when using `replace` or `delta`.

### D. Opening Message or Opening Screen

Use when the user asks for 第一条消息, 开场白, opening screen, first message, or initialization scene.

Read:
- `references/opening-screen.md`
- Current project's `index.yaml`
- Current project's relevant world/character files
- Variable output format only if the first message must include MVU update commands.

Rules:
- Keep opening content as play content, not author workflow.
- Prefer `第一条消息/<n>` file references for substantial opening text.
- If MVU variables already exist and the opening is meant to initialize a floor, include a valid update block only when the project's existing protocol requires it.
- Do not add UI instructions, creator notes, or debugging notes to the opening text.

### E. Worldbook or Character Content

Use when adding or editing world setting, character entries, factions, rules, skills, powers, scenes, or behavior instructions.

Read:
- `自制文件放置处/世界书制作要求（变量不需读取）.txt`
- Relevant files under `自制文件放置处/角色制作指南/`
- `references/worldbook-rules.md`
- Current project's relevant worldbook files

Rules:
- Write playable content only: world logic, character behavior, scenes, factions, rules, relationships, and演绎 rules.
- Do not put variable protocol, UI prompt, file workflow, author instructions, or debug notes into worldbook.
- Character writing must be behavior-first: actions, speech patterns, pressure reactions, choices, and different reactions to different people.
- Rules, skills, magic, combat, items, and mechanics must be executable and observable: triggers, cost, limits, failure results, state changes, environment effects, and counters.

### F. Regex Interface or Regex Replacement

Use when the task mentions regex UI, `$1/$2`, status rendering via regex, tag capture, or replacement chains.

Read:
- `references/ui-types.md`
- `references/opening-screen.md` if it captures first-message tags
- `references/worldbook-rules.md`
- `references/build-and-sync.md`

Rules:
- Regex may capture tags and load built artifacts.
- Variable-card/status-bar regex lookup expressions must follow the example/template default `<StatusPlaceHolderImpl/>` unless the user explicitly supplies another existing expression. Do not invent a new status placeholder just because the project name changed.
- Do not embed raw full interface source as regex replacement content.
- If the regex drives a UI, the UI still goes through the dist build lane.
- If the user asks for a normal regex UI rather than a script-loader UI, build the UI under `src/<项目名>/界面/...` with an `index.html`, run `pnpm build`, then sync the regex replacement from the built `dist/.../index.html` into a renderable wrapper such as `iframe srcdoc`. Do not paste the built HTML or JS as naked message content.
- When syncing built HTML into `iframe srcdoc`, the `srcdoc` value must be one physical line and HTML-escaped for at least `&`, `<`, `>`, and `"`. Strip `sourceMappingURL` comments. Do not leave raw line breaks from built HTML inside YAML scalar content unless every continuation line is correctly indented and verified by `pnpm sync bundle <project>`.
- For regex-driven complete webpages, the replacement must be a valid render container in the chat floor. Check that `index.yaml` contains a wrapper such as `<iframe ... srcdoc="...">` or the project's proven equivalent, and that it does not expose `<head><script...` or minified bundle text directly to the user.

### G. Plain Text Status Bar

Use only when there is no beautified frontend/regex status UI and the task asks for a text status bar.

Read:
- `references/style-and-safety.md`
- Current variable files

Rules:
- Wrap the plain status block in triple backticks.
- Show only current stable state, not next-step suggestions, planned actions, task guidance, or plot predictions.

## Stable Boundaries

Do not "顺手优化" these unless the user explicitly asks or the current task cannot work without it:

- Variable field names and schema shape
- Variable update/output protocol
- Regex capture protocol
- Existing UI mounting protocol
- Existing script IDs unless creating a new required entry
- Worldbook entries unrelated to the request
- First-message structure unrelated to the request

If a boundary must change, state why, list the affected files, then change only that boundary.

## Build And Sync

- Use `node tavern_sync.mjs pull <项目名>` after adding missing config or when local project content must match Tavern before editing.
- Use `pnpm stage:card -- <项目名>` when the project exists in archive and must become the only `src` project.
- Use `pnpm build` after any implementation change to scripts, UI, regex-driven UI, or project config that affects generated artifacts.
- If `pnpm` is not found, try `corepack pnpm build`. If Corepack needs network and sandbox blocks it, request escalation for that build command.
- For UI builds, check the built HTML for accidental external runtime imports before finalizing. Local debug URLs, user-managed remote test hosts, or expected environment-specific paths are not automatically bugs; distinguish them from unintended dependency leakage.
- Do not keep auto-generated PNG/bundle artifacts unless the user asked to bundle.

## References

Load these only as the router requires:

- `references/workflow.md`: overall repo flow and sync order
- `references/project-staging.md`: `src` and archive staging
- `references/ui-types.md`: script/UI/MVU/regex/opening classification
- `references/interface-sources.md`: `@types`, `slash_command.txt`, `util`, helper APIs
- `references/opening-screen.md`: first message/opening screen rules
- `references/variable-structure.md`: schema, idempotency, derived fields, MVU event boundaries
- `references/worldbook-rules.md`: worldbook placement, blue/green/depth entries, regex chains
- `references/build-and-sync.md`: pnpm build, webpack behavior, post-build hooks
- `references/style-and-safety.md`: mobile-first UI, status boundaries, execution discipline

## Final Response Checklist

Include only what matters:

- What was changed and where.
- Whether `pnpm build` ran and passed, or why it was intentionally skipped.
- Whether pull/stage was used.
- Confirm no bundle/push was run unless requested.
