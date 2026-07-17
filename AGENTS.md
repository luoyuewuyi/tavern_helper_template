# AI 角色卡制作入口

本仓库同时支持 **Tavo** 与 **SillyTavern／酒馆**。两者共享角色塑造常识与 CCv3 传输格式，但变量、正则、脚本、前端渲染、导入和验收语义不同，禁止混用。

## 开工前的平台路由

1. 用户已经明确说“Tavo”时，直接读取 `.claude/skills/tavo-card-building/SKILL.md`，按其参考和脚本工作；不要加载下方酒馆规则，不要创建 MVU、`[initvar]`、TavernHelper、Slash Command 或酒馆 iframe/CDN 结构。
2. 用户已经明确说“酒馆”“SillyTavern”“MVU”或“TavernHelper”时，直接读取 `.claude/skills/tavern-card-building/SKILL.md`，再按任务加载下方酒馆规则。
3. 用户只说“做角色卡”“制卡”而未说明平台时，先只问一句：`这次做 Tavo 还是酒馆（SillyTavern）？` 得到答案后再读取对应技能并开始修改。不要自作主张默认酒馆。
4. 迁移任务同时读取来源平台与目标平台的差异章节，但最终实现、验证和导入只以目标平台为准；不能用“兼容”名义保留目标端不会运行的 API。

Tavo 分支直接构建 `dist/<角色名>.json` 作为 Tavo 可导入的完整 CCv3 成品，不先导入酒馆、不调用 TavernSync、不把酒馆作为中转。只有用户要求目标端安装且 Tavo 环境可用时，才在 Tavo 内执行导入和 ID 回读。

## 正式美化界面

正式状态栏、开局页、楼层界面、阅读器和互动面板默认使用多模块源码，不论数据源是纯文本、普通变量、Tavo 变量还是 MVU。多模块与可维护性只是手段；最终目标是界面真正美观、有题材氛围、信息清晰、交互舒服且桌面／移动端都好用。结构检查通过但视觉粗糙仍未完成，必须查看真实渲染截图并继续迭代。

## 酒馆分支规则（只在选定 SillyTavern／酒馆后读取）

- `.cursor/rules/项目基本概念.mdc`
- `.cursor/rules/mcp.mdc`
- `.cursor/rules/酒馆变量.mdc`
- `.cursor/rules/酒馆助手接口.mdc`
- `.cursor/rules/前端界面.mdc`
- `.cursor/rules/脚本.mdc`
- `.cursor/rules/mvu变量框架.mdc`
- `.cursor/rules/mvu角色卡.mdc`
