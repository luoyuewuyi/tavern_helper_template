---
name: tavo-card-building
description: Tavo AI 角色卡全流程技能与百科。用于 AI 自动新建、续写、重构、迁移、审查或排错 Tavo 角色卡，涵盖 CCv3 JSON／PNG、角色与开场、世界书、聊天／全局／消息变量、宏、EJS、TavoJS、Tavo 原生正则、高级渲染、插件边界、从 SillyTavern 迁移、导入与回读。用户明确提到 Tavo、TavoJS、Tavo 角色卡或将酒馆卡迁移到 Tavo 时使用；不得用于 SillyTavern／酒馆目标。
---

# Tavo Card Building

这是一套供 AI 自动制卡的 Tavo 工程知识库，不是让用户手工填表的编辑器，也不是要求所有卡执行同一套重型流程。AI 负责读取需求、建项目、写角色卡、生成需要的世界书／变量／正则／渲染、构建、验证，并直接输出 Tavo 可导入的完整 CCv3 角色卡；有 Tavo 运行环境时再按需完成 Tavo 内导入回读。

## 平台边界

Tavo 与 SillyTavern 可以交换部分 CCv3 字段，但运行时不是同一平台。开始后只使用本技能和 Tavo 官方文档：

- 变量使用 Tavo 宏、EJS 或 `tavo.get/set/update/unset`，不是 MVU／MagVarUpdate。
- 世界书使用 CCv3 `character_book` 或 Tavo 原生字段，不创建酒馆 `[initvar]`、`[mvu_update]` 协议条目。
- 正则编写使用 Tavo `placements`、`timing`、`substitution` 语义；CCv3 内嵌传输才按官方兼容入口保存 `extensions.regex_scripts`。
- 高级渲染是消息内标准 HTML／CSS；JavaScript 使用 TavoJS。不要使用 TavernHelper、Slash Command、酒馆宿主 DOM、`$('body').load(...)`、iframe/CDN 状态栏或酒馆助手类型声明。
- 跨卡复用且需要生命周期能力时考虑 Tavo `.tpg` 插件；角色专属功能优先留在卡片与 TavoJS。
- Tavo 项目直接生成 `dist/<角色名>.json` 作为可导入成品；不得先导入 SillyTavern、不得调用 TavernSync、不得把酒馆作为中转或验收环境。

检测到上述酒馆专属结构时，不做表面改名。先按 `references/08-从酒馆迁移.md` 列损失与改写方案，再实现 Tavo 版本。

## 如何使用这部百科

- **硬规则**：目标端会拒绝、不会运行或会造成错误的事实，例如 CCv3 必填字段、把 MVU 当 Tavo API、正则字段混用、声称导入但没有回读。
- **适用流程**：只在卡片采用该能力时执行。纯文本卡不必创建变量、正则、渲染或插件。
- **推荐验证**：按复杂度选择。简单文本卡做结构与导入；变量卡增加变量读写；动态渲染卡增加 JavaScript、重载和移动端测试。
- **可选增强**：EJS、TavoJS、消息变量、文件 API、插件等是能力，不是每卡必选清单。

复杂度从低到高选择：

`纯文本 CCv3 → 世界书／宏 → 变量与正则 → 高级渲染／TavoJS → 插件`

只有下一级无法稳定满足需求时才升级。

## 美化界面的默认原则

“是否使用变量”和“是否制作正式美化界面”互不绑定。用户要正式状态栏、开局页、消息面板、阅读器或互动界面时，默认使用多模块源码，即使它只是解析纯文本、只读静态内容或完全不用变量。只有明确要求极简／纯文字，或一次性最小复现，才用单文件。

多模块与可维护性只是让 AI 能持续打磨界面的手段，最终目标是成品真的更美观、更有题材氛围、更清晰、更顺手。目录齐全但像默认表单、颜色与角色无关、信息拥挤或移动端难用，仍然不合格。正式交付必须查看真实渲染画面，检查桌面／移动端的主题、层级、字体、间距、图标、空态、反馈和动效，再迭代到视觉达标。

## 开工前必须确认

1. **交付物**：Tavo 可导入 JSON、带头像 PNG、源码项目、迁移报告、修复补丁，还是已经导入的角色。
2. **项目状态**：新建、已有 `tavo_cards/<角色名>/`、单个 JSON／PNG，还是酒馆卡迁移。
3. **功能层级**：纯文本、世界书、变量、正则、高级渲染、TavoJS、插件。
4. **目标版本与开关**：消息变量需 Tavo v0.88.0+；EJS 需 v0.87.0+；插件需 v0.91.0+；高级渲染和 JavaScript 支持是否开启。

用户没有提供版本且功能依赖新 API 时，查当前官方文档并在交付中写明最低版本。不要靠模型记忆猜接口。

## 资料优先级

1. 目标 Tavo 当前官方文档和实际导出／回读；
2. CCv3 当前规范；
3. 本技能参考与验证脚本；
4. 用户当前目标卡；
5. 社区经验。

不得把任意其他角色卡当规范来源。旧卡只能作为用户明确要求修复／迁移时的待审输入；“能导入”不证明变量、正则或渲染语义正确。

## 按任务加载参考

- 资料版本、官方链接和适用版本：[`references/00-来源与版本.md`](references/00-来源与版本.md)
- AI 自动制卡流程、复杂度和完成门：[`references/01-工作流与架构.md`](references/01-工作流与架构.md)
- CCv3 字段、JSON／PNG、扩展与无损往返：[`references/02-CCv3与导入格式.md`](references/02-CCv3与导入格式.md)
- 人设、开场、示例对话与可玩性：[`references/03-角色与开场.md`](references/03-角色与开场.md)
- 世界书字段、触发、注入与覆盖：[`references/04-世界书.md`](references/04-世界书.md)
- 变量、宏、EJS、初始化与状态真相：[`references/05-变量宏与EJS.md`](references/05-变量宏与EJS.md)
- Tavo 原生正则与 CCv3 兼容传输：[`references/06-正则.md`](references/06-正则.md)
- 高级渲染、TavoJS、消息、文件与插件：[`references/07-渲染脚本与插件.md`](references/07-渲染脚本与插件.md)
- 从 SillyTavern／MVU 迁移：[`references/08-从酒馆迁移.md`](references/08-从酒馆迁移.md)
- 验证、真实导入、回读和排错：[`references/09-验证与排错.md`](references/09-验证与排错.md)
- 本仓库 `tavo_cards/` 项目格式与 AI 命令：[`references/10-项目格式与命令.md`](references/10-项目格式与命令.md)
- 需要写 TavoJS 时的 API 选择与调用速查：[`references/11-TavoJS-API速查.md`](references/11-TavoJS-API速查.md)

## AI 标准工作流

### 1. 建立基线

- 检查当前目录规则、工作区改动、已有目标项目和输入卡；保护不相关修改。
- 新项目使用 `scripts/new_tavo_project.py` 创建 `tavo_cards/<角色名>/`，不要复制其他角色卡。
- 现有 JSON／PNG 先提取和规范化，再定点修改；保留未知扩展字段，禁止用简化结构覆盖整卡。
- 迁移任务先运行 Tavo 污染检查，列出 MVU、TavernHelper、酒馆正则和 iframe/CDN 依赖。

### 2. 写清设计契约

- 角色欲望、阻力、关系动力、边界、主动性、持续剧情钩子；
- 主开场和备选开场分别建立什么场景、关系、冲突与用户行动点；
- 世界书每条职责、触发和注入位置；
- 若使用变量：唯一真相、作用域、初值、写入者、读取者、更新条件、重置语义；
- 若使用正则：作用对象、执行时机、是否持久化、是否宏替换；
- 若使用渲染／脚本：无脚本降级、开关依赖、事件清理、消息稳定 ID 与回读方式。

变量初始化不能靠“打开一个条目”或“显示状态栏”碰运气。Tavo 没有酒馆 `[initvar]变量初始化勿开` 条目；按参考 05 选择宏、EJS 或 TavoJS 的明确入口，并保证同一新聊天只初始化一次、已有状态不被重载覆盖。

### 3. 分层实现

先写角色与开场，再补需要的世界书；变量／正则／渲染只解决已定义的问题。Tavo 项目中核心卡片保持 CCv3，平台原生伴随配置放入明确的 `tavo/` 子目录，由构建脚本合并可内嵌部分并输出安装说明，不把无法随卡导入的内容伪装成已内嵌。

### 4. 静态验证、构建与成品复核

在技能目录运行：

```powershell
python -B -X utf8 scripts/validate_tavo_project.py <项目目录>
python -B -X utf8 scripts/build_tavo_project.py <项目目录>
python -B -X utf8 scripts/validate_tavo_project.py <项目目录> --dist
```

构建器直接生成 Tavo 可导入的完整 CCv3 JSON；若采用 TavoJS 初始化或多模块渲染，构建器必须把实际运行入口装配进最终卡，不能只复制 sidecar。验证至少覆盖：CCv3 必填字段、开场非空、数组类型、世界书字段、正则传输格式、Tavo 原生 sidecar、变量初始化幂等性与版本升级、平台污染、文件名安全、JSON 可重开、运行入口和输出哈希。启用正式界面但 `visual_review.status=pending` 时可以生成产物，只能报告“视觉未验证”，不能声称美化完成。

### 5. 可选的 Tavo 真实导入与回读

- `dist/<角色名>.json` 已是可直接交付给 Tavo 文件导入的角色卡，不需要经过酒馆。`dist/<角色名>.tavo-deploy.js` 是在 Tavo 内自动导入、安装无法内嵌的原生正则并严格回读的可选脚本，不是酒馆脚本。若 `manifest.single_file_function_complete=false`，JSON 结构完整但原生-only 能力需要整个 `dist/` 配套安装，不能声称单文件功能完整。
- Tavo 可连接且用户要求完成目标端安装时，导入最终 JSON／PNG；使用 `tavo.character.import(card)` 时记录返回的 `characterId`、`lorebookId`、`regexId`。
- 通过 `tavo.character.get(id)` 回读角色，通过 `tavo.lorebook.get(id)`、`tavo.regex.get(id)` 回读伴随对象并比较关键字段。
- 新建聊天检查首楼非空；变量卡验证初始化、一次更新、刷新后持久化；渲染卡在开启和关闭高级渲染／JavaScript 两种状态检查降级。
- 用户取消 Tavo 的确认弹窗、缺少 Tavo 运行环境或版本过低时，准确写“产物已验证、未在 Tavo 导入”，不得声称成功。

## 不可妥协的要求

- 不交付只有空字段、TODO、演示数据或“让用户自己补”的卡。
- 不替用户说话、做决定或无条件推动关系；角色要有主动性、阻力和因果。
- 不把变量宏输出、正则显示层和正文状态各维护一套互相冲突的真相。
- 不在每轮无条件执行 `setvar` 覆盖玩家进度；初始化必须幂等且只在正确入口发生。
- 不把 Tavo `message` 作用域当 chat 宏可直接读取；提示词宏只直接覆盖 chat/global，消息变量由 TavoJS 按稳定消息 ID 处理。
- 不把 `generation:*` 当普通 HTML 片段的 `tavo.events`；该生命周期属于已安装插件的 `tavo.plugin.on(...)`。
- 正式美化界面默认多模块，不因没有变量或没有 MVU 而退回单文件；模块化服务于审美与体验，不能替代真实视觉验收。
- 不用正则掩盖破损协议；先修数据和输出，再做显示替换。
- 不因 CCv3 能交换文本就宣称酒馆 MVU、脚本或界面已迁移。
- 不把“制作 Tavo 卡”解释成先导入酒馆再同步；Tavo 构建与验收全程不经过酒馆。
- 不以“已生成 JSON”“已点击导入”“弹窗出现”替代目标端回读。

## 完成定义

结束前必须说明：

1. AI 制作了哪些角色卡内容和平台能力；
2. 可直接导入的最终文件与源码项目路径；
3. 实际执行的构建、验证、导入和回读结果；
4. Tavo 版本、开关或确认弹窗造成的未验证项；
5. 是否发生 Tavo 导入、文件发布或 Git push。

只在最终产物通过适用验证、无酒馆运行时污染，并且真实导入已完成或客观限制已明确报告后结束。
