# UI Types

## 普通脚本

特征：

- 项目主要是 `index.ts`
- 无独立 `index.html`
- 运行在后台 iframe

适用：

- 监听消息
- 调整页面
- 注册按钮
- 操作酒馆变量

## 普通前端界面

特征：

- 同目录同时存在 `index.ts` 和 `index.html`
- 由 webpack 打包到 `dist/.../index.html`

适用：

- 楼层内展示界面
- 卡片式面板
- 独立阅读、选择、展示页

规则：

- `index.html` 只写静态 body 内容
- 样式和逻辑从 TS/Vue 导入
- 若该界面会被正则替换注入到聊天楼层，最终承载必须是完整网页容器。源码侧至少提供完整 `index.html` 骨架，构建后再由正则用 `iframe srcdoc` 或项目既有等价容器承载。

## MVU 变量界面

特征：

- 明确依赖 `schema.ts`
- 数据来自 `stat_data`
- 需要 `Mvu`、`waitGlobalInitialized('Mvu')`、`waitUntil(...)`

适用：

- 状态栏
- 消息楼层变量展示
- 变量驱动界面

规则：

- 先确认是否已有 `schema.ts`
- 优先复用 `store.ts` 或 `defineMvuDataStore`
- 不擅自改变现有变量层级和语义

## `$1` / `$2` 正则替换界面

特征：

- 正则内容中使用捕获组
- 渲染模板依赖 `$1`、`$2` 等文本替换

适用：

- 从标签块中抽取部分内容再展示
- 折叠块、美化块、局部渲染块

规则：

- 先确认输出标签来自哪里
- 再确认正则捕获表达式是否稳定
- 最后再写替换内容和界面
- 正则替换内容不能把构建后的 `<script>`、`<style>`、minified JS 或 HTML 片段裸露在消息楼层里。完整界面必须放进可渲染容器，例如 `iframe srcdoc`，否则酒馆会把源码当正文显示。
- 变量卡/状态栏的查找表达式沿用示例和初始模板默认值：`<StatusPlaceHolderImpl/>`。除非用户明确给出另一个现有协议，不要改成 `<Status/>`、`<HonghuangStatus/>`、项目名状态标签，或脚本加载伪协议。
- Regex `iframe srcdoc` content must be one physical line after build, HTML-escaped for `&`, `<`, `>`, and `"`, and stripped of `sourceMappingURL` comments. Raw built HTML line breaks inside YAML can break bundle parsing or cause source code to appear in chat.
- MVU status UIs must refresh from actual variable updates, not only initial render. Prefer `getVariables({ type: 'message' })` as the example does, then fall back through `latest`, last message id, current message id, `Mvu.getMvuData(...)`, and `getAllVariables()`. Listen for `Mvu.events.VARIABLE_UPDATE_ENDED` and Tavern message/generation events when available, with short polling as backup.
- If a project has existing mojibake/encoding-damaged variable keys, preserve the protocol and add UI read aliases instead of renaming schema fields during a UI fix.

## 普通世界书 + 标签 + 正则界面

链路：

1. 世界书要求 AI 输出固定标签。
2. 正则捕捉该标签。
3. 正则替换为代码渲染界面或前端页面。

规则：

- 世界书负责格式约束
- 正则负责匹配和注入
- 界面负责渲染
- 三者缺一不可
- 若正则注入的是一个完整页面，必须确认实际楼层显示的是渲染后的 UI，而不是 `<head><script...`、源码、转义 HTML 或打包文本。

## 开局界面

特征：

- 只处理开局阶段
- 只捕捉第一个 `【开局界面】` 标签
- 用于登记初始输入、路线选择、开场设置或初始化数据

可选落点：

- 直接发送到后续流程
- 写入世界书条目
- 写入初始变量

规则：

- 只消费第一个同名标签，避免重复初始化
- 若写入世界书，先确认目标条目和写入格式
- 若写入变量，必须先做结构检测并保证符合现有 schema
- 若当前项目没有变量结构定义，不要硬写变量；先补齐 `schema.ts` 或等价结构

## 界面实现底线

- 任何界面产物都必须是完整的 HTML 结构，不要省略成残片。
- 面向正则或楼层 iframe 的界面产物必须是完整网页：`<!doctype html>`、`<html>`、`<head>`、viewport/meta、`<body>` 和 mount root 都应存在。裸 `<script> + <style> + <div>` 片段不算完整网页。
- 界面内容保持精简，只显示真正需要的重要信息。
- 不要自作主张加入说教式说明、教程式引导或你以为玩家需要的长段提示。
- 如果界面基于变量系统，显示内容必须以实际变量为准；不要额外添加无用变量或无意义展示。
- 默认手机优先
- 不产生横向滚动
- 尺寸适配酒馆 iframe
- 风格服务题材，不做模板化通用 UI
- 任何界面需求都必须 `pnpm build`
- build 后必须检查最终注入内容的显示形态：如果正则替换会在聊天楼层中展示，确认它被包在可渲染容器中，不能把打包源码直接显示给玩家。
- 若界面项目带有专属构建后同步逻辑，构建前先检查 `webpack.config.ts` 和 `util/`，不要把专属流程漏掉

## 成品界面参考

参考仓库内 `战龙四驱` 开局界面的成品表现，界面默认应尽量具备这些特征：

- 先有一个强主题的头部区块，再进入输入区、摘要区和操作区，不要把所有表单平铺成一整页。
- 用卡片分组、渐变背景、清晰层次和少量高亮色建立气质，不要做成裸表单。
- 信息密度要克制，首屏只放核心输入和少量关键信息预览。
- 预览卡、标签、按钮和输入框要有统一视觉语言，不要每块都像不同页面拼起来的。
- 响应式下优先单列堆叠，桌面端再扩成双列或三列。
- 视觉目标是“紧凑、利落、好看”，不是“把所有东西塞满”或“默认浏览器样式加一点边框”。
