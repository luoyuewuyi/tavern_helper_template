# Interface Sources

## 主来源

- `@types/` 是本仓库中酒馆助手、酒馆本体、MVU 和扩展能力的主要接口定义来源。
- `slash_command.txt` 是酒馆 slash 命令参考，不是 `@types/` 的替代品。
- `.cursor/rules/酒馆助手接口.mdc` 用于先定位该查哪个 `@types` 文件。
- `util/` 中的工具函数是项目推荐封装，能用时优先复用，不要重复造轮子。
- `README.md` 与其外链文档用于补足仓库工作流、构建和使用背景。

## 选择顺序

1. 先看 `.cursor/rules/酒馆助手接口.mdc`
2. 再查 `@types/function/*.d.ts`
3. 再查 `@types/iframe/*.d.ts`
4. 再看 `util/` 是否已有封装
5. 只有高层接口不够时，再考虑 `slash_command.txt`

## 约束

- 能直接用高层接口解决时，优先用 `@types/function/*.d.ts` 中的函数，不要先退回 slash 命令。
- 如果任务涉及世界书、变量、正则、生成、角色卡、聊天消息、按钮、事件、MVU 或其他接口，先查本地 `@types/`，再决定实现方式。
- 如果需要使用 slash 命令，优先通过 `triggerSlash` 等项目约定方式调用，并以 `slash_command.txt` 为命令参考。
- 不要凭旧记忆写接口；本地 `@types/`、`slash_command.txt` 和 rules 才是当前仓库的准绳。
