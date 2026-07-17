---
name: card-platform-router
description: AI 角色卡任务的 Tavo／SillyTavern 平台入口。用户只说“角色卡”“制卡”“开场”“世界书”“变量卡”“状态栏”等而未明确目标平台时使用；先确认 Tavo 或酒馆，再切换到对应独立技能。用户已明确平台时直接路由，不重复提问。本技能不提供制卡规范，不允许把两套运行时混在同一实现中。
---

# 角色卡平台路由

这个技能只做一件事：在 AI 开始制卡前选定目标平台，然后退出路由阶段。

## 路由算法

1. 从用户原话和目标文件判断平台。
2. 明确出现 `Tavo`、`TavoJS`、`.tpg` 或 `tavo_cards/`：直接读取 `../tavo-card-building/SKILL.md` 并执行，不再提问。
3. 明确出现 `SillyTavern`、`酒馆`、`酒馆助手`、`TavernHelper`、`MVU`、`MagVarUpdate`、`tavern_sync.yaml`：直接读取 `../tavern-card-building/SKILL.md` 并执行，不再提问。
4. 只有“角色卡”“制卡”“世界书”“正则”“变量”“开场界面”“状态栏”等平台不明词：先问且只问一句：

   `这次做 Tavo 还是酒馆（SillyTavern）？`

5. 用户回答后立即读取对应技能。答案之前不创建项目、不套模板、不设计变量、不修改目标卡。

## 迁移任务

迁移任务必须同时写清来源与目标，例如“酒馆 → Tavo”。先读取目标平台技能，再读取其中的迁移章节；只为识别来源结构而查看来源技能。最终产物、API、变量、正则、渲染、导入和回读全部服从目标平台。

## 绝对隔离

| 目标 | 允许的运行时核心 | 禁止误用 |
|---|---|---|
| Tavo | CCv3、Tavo 宏、EJS、`tavo.*`、高级渲染、Tavo 插件 | MVU、`[initvar]` 世界书、TavernHelper、Slash Command、酒馆宿主 DOM、iframe/CDN 状态栏 |
| 酒馆 | 目标项目当前 SillyTavern／酒馆助手／MVU 契约 | 把 Tavo `tavo.*`、Tavo 正则枚举或 `.tpg` 当成酒馆接口 |

CCv3 是可共享的交换格式，不代表两个平台运行时相同。不得为了“一卡两用”静默丢字段或把某平台专属能力伪装成跨平台能力；需要双平台时分别产出、分别验证。
