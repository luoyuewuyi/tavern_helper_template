# Tavo 变量、宏与 EJS

## 作用域

| 作用域 | 用途 | 特性 |
|---|---|---|
| `chat` | 单次聊天的角色状态，默认首选 | 随聊天导出，不影响其他聊天 |
| `global` | 跨聊天偏好、成就或共享设置 | 易命名冲突，谨慎使用卡名前缀 |
| `message` | 绑定某条消息／楼层的状态 | v0.88.0+；随该消息删除 |

不同作用域完全隔离，不存在同名覆盖。提示词变量宏直接覆盖 chat/global；message 变量由 TavoJS 在气泡环境或稳定消息 ID 上读写。

## TavoJS 变量 API

```js
tavo.get('status.hp')
tavo.set('status', { hp: 100, mp: 50 })
tavo.update('status', { hp: 70 })
tavo.unset('status.hp')

tavo.get('bestScore', 'global')
tavo.set('hp', 50, { scope: 'message', id: 2338 })
```

对象部分更新用 `update`；完整替换才用 `set`。消息索引会随删楼变化，持久引用使用消息 `id`。

## 宏

聊天变量：`setvar`、`addvar`、`incvar`、`decvar`、`getvar`。
全局变量：`setglobalvar`、`addglobalvar`、`incglobalvar`、`decglobalvar`、`getglobalvar`。

宏可用在角色、预设、世界书、正则和其他生成提示词字段。需要条件、循环或结构化运算时用 EJS；需要消息、角色、世界书、正则、文件或 UI 交互时用 TavoJS。

## 初始化契约

每个变量先写清：路径、类型、作用域、初值、写入者、读取者、更新事件、重置方式和版本门槛。

本仓库 `tavo/variables.json` 的单项格式：

```json
{
  "name": "status.hp",
  "type": "number",
  "scope": "chat",
  "initial": 100,
  "description": "当前生命值",
  "writer": "战斗结算 TavoJS",
  "readers": ["提示词摘要", "状态显示"],
  "initialization": {
    "mode": "tavojs",
    "entry": "新聊天首楼挂载",
    "idempotent": true
  },
  "reset": "用户明确点击重新开始"
}
```

`type` 可为 `string/number/boolean/array/object/null`；`initialization.mode` 可为 `none/macro/ejs/tavojs`。message scope 不用宏或 EJS 初始化，改用 TavoJS 和稳定消息 ID。

初始化必须满足：

1. 只在新聊天或明确重置入口发生；
2. 已有值时不覆盖；
3. 候选开场与主开场行为一致；
4. 刷新页面不会重置；
5. 显示状态栏不会触发初始化；
6. 失败可诊断，不用演示值悄悄回退。

简单全新聊天可在开场使用变量宏设置初值，但要验证 Tavo 实际渲染时机，且不要在每轮常驻字段中重复出现。需要“仅缺失时设置”时，用 EJS 条件或 TavoJS：

```js
if (tavo.get('status') == null) {
  tavo.set('status', { hp: 100, mp: 50, initializedVersion: 1 })
}
```

项目级 `initialization_version` 不是装饰字段。构建器会为每个 `tavojs` 初始化变量写入独立版本标记：值缺失时创建；版本提高时只递归补对象中缺少的默认字段，不覆盖玩家已经改变的字段，然后更新版本标记。变更初值但不提高版本不会触发迁移；数组或基本类型的破坏性迁移必须另写用户明确触发的迁移操作，不能借初始化偷偷覆盖。

构建器把这一初始化片段放在所有可选开场的渲染脚本之前，保证状态适配器第一次读取时已有数据。不要在源码中另写第二套无版本初始化。

## EJS

EJS v0.87.0+，在所有生成提示词字段先执行，再执行 `{{...}}` 宏。它适合条件、循环和变量计算。任何 EJS 标签报错会让整个字段回退原文，因此：

- 保持片段短小；
- 对缺失变量给显式空态；
- 不在一个巨大字段中混入大量有副作用逻辑；
- 当前 EJS 变量范围以 chat/global 为主，不把 message scope 当普通别名使用；
- 导入后用缺失值、正常值、边界值和错误值测试。

## 状态真相

正文、变量、状态栏和正则只能有一个权威状态源。推荐：

- Tavo 变量保存结构化真相；
- 提示词用宏/EJS读取必要摘要；
- 高级渲染只展示，不维护第二份状态；
- AI 更新状态时必须有明确事件和边界，不让数值无因变化。

## 常见错误

- 把酒馆 `stat_data`、Zod Schema、JSONPatch 或 MVU 事件复制进 Tavo；
- 每轮 `setvar::hp::100` 覆盖伤害结果；
- 用 global 保存本应随聊天导出的角色状态；
- 用楼层索引长期绑定 message 变量；
- 让状态栏打开／关闭控制变量是否初始化；
- 宏里塞复杂 JSON 却未验证解析类型。
