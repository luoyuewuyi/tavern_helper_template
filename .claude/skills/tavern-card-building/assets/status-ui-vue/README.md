# Vue 状态栏多模块骨架

把本目录内容复制到目标角色卡的 `界面/状态栏/`，再按项目路径调整 `store.ts` 中的 Schema 导入。

## 使用前提

这套源码以 StageDog 模板项目的 Vue 3／Pinia／Zod 工具链为基线，并假定构建环境已按项目配置自动导入或声明 `$`、`_`、`createApp`、`createPinia`、`nextTick`、`errorCatched`、`waitGlobalInitialized` 等全局符号；宿主 API 的真实签名必须来自目标环境当前的 `@types`。`store.ts` 还使用模板项目的 `@util/mvu` 路径别名。复制前先核对 `package.json`、构建配置、路径别名和类型声明。

如果目标不是该模板工程，不得原样复制后宣称完成：显式补齐 imports，把 `@util/mvu` 适配为该项目实际的 store／adapter，并让宿主 API 只停留在入口、context 或 adapter 层。适配后必须重新运行类型检查、构建和真实楼层回读。

- `context.ts` 的 `variableOption` 必须同时供入口、store、刷新和写回使用。
- `iframe-height.ts` 负责楼层自动撑高，业务组件不要再各自设置 iframe 高度。
- `release.ts` 的 `UI_VERSION` 是构建期发布标记；正式发布时递增它。只有用户已经授权云端／Git 发布时，才上传并同步角色卡正则 URL 的 `?v=`、标签或提交；否则只交付本地产物与待更新引用清单。
- `App.vue` 中的连接提示只是骨架提示，不是最终业务界面；正式卡应替换为按 Schema 路径拆分的组件。
