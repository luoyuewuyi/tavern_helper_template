# Vue 动态开局多模块骨架

本目录只解决“0 层表单如何可靠地产生第 1 层开场消息”的工程边界，不替代角色内容设计。复制到目标角色卡的 `界面/开局/` 后：

## 使用前提

这套源码以 StageDog 模板项目的 Vue 3／Pinia／Zod 工具链为基线，并假定构建环境已按项目配置自动导入或声明 `$`、`_`、`createApp`、`createPinia`、`nextTick`、`errorCatched`、`waitGlobalInitialized` 等全局符号；宿主消息和 MVU API 的真实签名必须来自目标环境当前的 `@types`。非模板项目必须显式补齐 imports，并只在 `host/` adapter 中适配 API，不能把宿主调用散回组件。

1. 在 `opening-contract.ts` 把字段改成该卡真实的表单字段、Schema 路径与校验；不得保留与角色无关的示例字段；全部完成后才把 `OPENING_CONTRACT_CUSTOMIZED` 改为 `true`；
2. 在 `renderOpening` 生成该角色的真实、非空 `<maintext>` 和必要 `<option>`；
3. 确认这些 Schema 路径也存在于 `schema.ts` 与 initvar；
4. 保留 `host/`、`actions/`、`lifecycle/`、`components/` 边界，组件不要直接调用宿主 API；
5. 递增 `release.ts` 的稳定 `UI_VERSION`；只有用户已授权云端发布时才上传并同步角色卡实际 URL，未授权时保留本地产物和待更新引用清单；
6. 运行 `check_frontend_structure.mjs`，再在新聊天中点击开局并回读新 assistant 消息和 `data.stat_data`。

正式交付建议保留一个正文非空、与当前 Schema/initvar 一致的静态 `first_mes` 作为动态 UI 加载失败时的兜底，并给玩家明确可行动点。若设计明确要求只有动态开局，可以不加第二套剧情正文，但必须让 `first_mes` 至少包含可诊断的加载失败提示／恢复路径，并完成真实新聊天测试；不得用空字符串或纯占位标签冒充开场。静态兜底不替代动态事务测试。

`start-game.ts` 只有在消息创建后回读成功才返回。`message-adapter.ts` 会写入并回读一个消息级幂等标记，刷新页面后也能拒绝重复开局。任何异常都应由界面显示为错误并允许重试，不能弹出虚假的“导入完成”。
