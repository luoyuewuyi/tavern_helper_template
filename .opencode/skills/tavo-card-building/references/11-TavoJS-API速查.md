# TavoJS API 速查

本页用于选接口，不替代当前官方签名。写代码前打开 <https://docs.tavoai.dev/cn/guides/javascript-api/> 核对参数、返回值、版本和确认弹窗。

## 变量

- `tavo.get(name, scope?)`
- `tavo.set(name, value, scope?)`
- `tavo.update(name, partial, scope?)`
- `tavo.unset(name, scope?)`

scope 默认 `chat`，还可为 `global`、`message` 或 `{ scope: 'message', id }`。路径支持 `status.hp`。

## 消息 v0.78.0+

- `tavo.message.find(indexRange, filter?)`: 楼层索引／范围查找，总返回数组。
- `tavo.message.count()`: 总数。
- `tavo.message.append(message)`: 新增并返回稳定消息 ID。
- `tavo.message.update(message, opts?)`: 按 `id` 更新；更新宿主气泡且要继续脚本时复核 `reuseContext`。
- `tavo.message.delete(id)`: 删除并返回 ID 或 `null`。

楼层索引适合即时定位，跨刷新／删楼绑定使用返回对象的 `id`。

## 聊天

- `tavo.chat.current()`: 当前聊天、角色、persona、preset、世界书、正则、背景摘要。

不存在聊天时可能返回 `null`，所有调用做空值检查。

## 角色

- `all/get/find`
- `create/update/delete`
- `import(card)`

create 的 `name`、`firstMes` 必填；update 还要 `id`。创建／更新接受 CCv3 snake_case 并转换。import 接受完整 CCv3 或裸 data，并从 `character_book`、`extensions.regex_scripts` 创建伴随对象；返回 `{ characterId, lorebookId, regexId }`。写操作会确认，取消要处理。

## 用户身份

- `tavo.persona.all/get/find/create/update/delete`

create 至少 `name`、`description`；update 还要 `id`。角色卡不应未经用户明确意图修改全局 persona。

## 预设

- `tavo.preset.all/get/find/import/create/update/delete`

import 接受 SillyTavern 兼容预设；create/update 使用 Tavo 原生 `basicPrompts` 和 `entries`。角色专属卡通常不应擅自安装或覆盖用户预设，除非玩法明确依赖且已说明。

## 世界书

- `tavo.lorebook.all/get/find/import/create/update/delete`

import 接收 CCv3 `character_book`；create/update 使用 Tavo 原生字段或官方支持的 CCv3 映射。导入角色时优先随卡创建，避免重复安装同名世界书。

## 正则

- `tavo.regex.all/get/find/import/create/update/delete`

import 接收 SillyTavern 兼容组；create/update 使用 Tavo 原生 `entries`。按精确名称查找后再创建，避免重复组；写入后按 ID 回读。

## 长记忆

- `tavo.memory.current()`
- `tavo.memory.update(memory)`

长记忆属于当前聊天设置，不是角色卡的默认变量仓库。除非用户明确要求，不自动启用或改写用户记忆。

## 生成

- `tavo.generate(prompt, options?)`: 返回完整字符串，不流式。

`options.context` 决定是否带当前上下文；可选 preset 和 settings。用 `try/catch`，验证 JSON 时去掉代码围栏后仍须做结构校验，不能直接信模型输出。

## 生图与 TTS

- `tavo.image.generate(prompt, options?)`: 返回 dataUrl 或保存路径。
- `tavo.tts.play(text, options?)`／`tavo.tts.stop()`。

角色卡制作默认不擅自生图或改变语音绑定。用户明确要求后才使用；卡图来源与授权单独确认。

## 文件

- `tavo.file.save/load/delete/exists/url`

scope 为 chat/global。图片等大数据放文件，不塞进变量或消息。文件名遵守 Tavo 限制，global 文件要有清理策略。

## 工具与 UI

文档示例包含 `tavo.utils.export`、`preview`、`toast` 等便利函数。只有当前文档存在对应签名时才用，不根据旧示例自行扩展 API。

## 写操作通用模式

```js
try {
  const id = await tavo.regex.create(group)
  if (id == null) return // 用户取消
  const saved = await tavo.regex.get(id)
  if (!saved) throw new Error('创建后回读失败')
} catch (error) {
  console.error(error)
  tavo.utils.toast?.(`操作失败：${error.message}`)
}
```

确认弹窗、返回 ID、回读对象是三层证据；不能只显示“正在导入”或“已调用 API”。
