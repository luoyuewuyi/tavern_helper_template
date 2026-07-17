# AI 角色卡制作仓库

本仓库让 AI 自动制作、修改、验证和交付角色卡，支持两个彼此独立的目标平台：**Tavo** 与 **SillyTavern／酒馆**。

## 第一条规则：先确定目标平台

- 用户已明确说 Tavo：立即读取 `.claude/skills/tavo-card-building/SKILL.md`，只使用 Tavo／CCv3／TavoJS 规则。
- 用户已明确说酒馆、SillyTavern、MVU 或 TavernHelper：立即读取 `.claude/skills/tavern-card-building/SKILL.md`，再按该技能指引加载 `.cursor/rules/`。
- 用户只说“角色卡”“制卡”而没有平台：在改文件、套模板或设计变量前，先问：`这次做 Tavo 还是酒馆（SillyTavern）？`
- 不要在用户已明确平台后重复询问。
- 迁移任务可以读取两边的差异说明，但产物必须服从目标平台；不能把酒馆 MVU、TavernHelper、Slash Command、iframe/CDN 前端当成 Tavo 能力。

## 两个分支的工程入口

### Tavo

- 技能入口：`.claude/skills/tavo-card-building/SKILL.md`
- AI 项目目录：`tavo_cards/<角色名>/`
- 创建项目：`python .claude/skills/tavo-card-building/scripts/new_tavo_project.py <角色名>`
- 构建与验证：按 Tavo 技能的完成门执行。
- 直接生成 `dist/<角色名>.json` 作为 Tavo 可导入成品；不得先导入酒馆或调用 TavernSync。
- 交付以 Tavo 可导入 CCv3 JSON／PNG、必要的 Tavo 原生伴随文件为准；有可用 Tavo 环境并要求安装时，再在 Tavo 内真实导入回读。

### SillyTavern／酒馆

- 技能入口：`.claude/skills/tavern-card-building/SKILL.md`
- 项目目录：`src/<项目名>/`、`角色卡/<项目名>/`，以目标项目现状和 `tavern_sync.yaml` 为准。
- 构建：`pnpm build`
- 酒馆同步：`node tavern_sync.mjs pull|push|bundle ...`
- TavernSync 的方向、MVU 四条协议、变量初始化开关、状态栏数据桥、多模块界面和最终 push／回读，全部以技能当前版为准。

## 通用边界

- 不把任意旧角色卡当规范；旧卡只在用户要求修复或迁移该卡时作为待审输入。
- 保留工作区已有修改，不覆盖或回滚不相关文件。
- 先完成可玩的角色与开场，再按需求增加世界书、变量、正则和界面；不为凑结构制造无用模块。
- 正式美化状态栏／开局页／楼层界面默认使用多模块源码，与是否采用 MVU 或其他变量无关。模块化是实现手段，最终必须以真实画面的美观、题材氛围、信息层级、交互和移动端体验验收。
- “文件已写好”“命令成功”“提示已导入”都不等于目标端已可用。完成必须包括目标平台要求的结构与成品验证；若执行了目标端导入，还必须提供回读证据。
- Git push 与平台导入／同步是两件事。按对应技能完成平台侧交付；只有用户要求或项目已有明确授权时才做 Git 远端写入。
