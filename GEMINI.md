# AI 角色卡制作平台路由

本仓库同时支持 Tavo 与 SillyTavern／酒馆。开始角色卡工作前必须先确定平台：

1. 用户明确说 Tavo：读取 `.claude/skills/tavo-card-building/SKILL.md`，只按 Tavo／CCv3／TavoJS 规范制作，不加载酒馆 MVU、TavernHelper、Slash Command 或 iframe/CDN 规则。
2. 用户明确说酒馆、SillyTavern、MVU 或 TavernHelper：读取 `.claude/skills/tavern-card-building/SKILL.md`，并按需读取 `.cursor/rules/` 中的酒馆规则。
3. 用户没说平台：先问 `这次做 Tavo 还是酒馆（SillyTavern）？`，回答前不要开始改卡。
4. 用户已经明确平台时不得重复询问。迁移任务最终只服从目标平台的运行时和验收方式。

保留用户已有修改；不要把其他旧角色卡当规范。Tavo 直接构建可导入的完整 CCv3，不经过酒馆或 TavernSync；先完成结构与成品验证，有 Tavo 环境并执行目标端安装时再以真实导入和回读为准。不能只凭命令提示声称成功。

任何正式美化状态栏、开局页或楼层界面都默认使用多模块源码，与是否有 MVU／变量无关。模块化只是为了把视觉和交互做得更好；最终要以真实桌面／移动画面的美观、氛围、层级和可用性验收，不能只交付规整但粗糙的骨架。
