# Tavo AI 角色卡项目

此目录只存放 Tavo 目标项目。不要把 `src/`、`角色卡/` 中的酒馆 MVU／TavernHelper 工程直接复制进来。

AI 开始新卡时运行：

```powershell
python -B -X utf8 .claude/skills/tavo-card-building/scripts/new_tavo_project.py "角色显示名"
```

随后按 `.claude/skills/tavo-card-building/SKILL.md` 自动完成内容、构建与验证，直接在项目 `dist/` 生成 Tavo 可导入的完整 CCv3 JSON；不经过酒馆或 TavernSync。若当前能连接 Tavo 且任务要求安装，再由 AI 在 Tavo 内导入并回读。用户不需要手工填写项目文件。
