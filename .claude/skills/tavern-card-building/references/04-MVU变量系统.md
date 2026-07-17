# MVU 变量系统

## 目录

- [何时使用](#何时使用)
- [一条完整链路](#一条完整链路)
- [Schema 是权威来源](#schema-是权威来源)
- [initvar](#initvar)
- [更新与输出协议](#更新规则)
- [运行时读取](#运行时读取)
- [模板状态栏](#模板状态栏)
- [事件和生命周期](#事件和生命周期)
- [动态开局事务](#动态开局事务)
- [验证矩阵](#验证矩阵)

## 何时使用

MVU／MagVarUpdate 适合“会随剧情变化、需要跨楼层保存、会影响后续叙事或交互”的状态，例如时间地点、关系阶段、任务、装备、资源和角色可感知的状态。

不要把稳定设定、只为排版存在的文字、模型无法可靠观察的隐性数值全部变量化。字段越多，更新协议越脆弱、上下文成本越高。

## 一条完整链路

一个可工作的 MVU 卡通常包含：

1. `schema.ts`：变量字段、类型、校正和派生字段；
2. 变量结构脚本：导入 Schema 并注册；
3. `initvar`：与 Schema 对齐的真实初值；
4. 当前变量列表：把 `stat_data` 注入模型上下文；
5. 变量更新规则：说明何时更新、限制和语义；
6. 变量输出格式：规定更新命令协议；
7. MVU 引擎脚本；
8. 可选状态栏／脚本：读取同一份 `stat_data` 并响应更新；
9. 如使用显示占位符：稳定产生占位符的开场或输出协议，以及对应显示正则。

任何一环的字段名、路径、作用域或消息楼层不一致，都会出现“有 UI 但不更新”“变量已改但显示旧值”“首轮有值后续为空”等问题。

## Schema 是权威来源

模板项目通常在项目目录放置纯 `schema.ts`：

```ts
export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
  }),
  角色: z.object({
    信任: z.coerce.number().transform(value => _.clamp(value, 0, 100)),
  }),
});

export type Schema = z.output<typeof Schema>;
```

`schema.ts` 只定义和导出，不在里面注册、挂事件、读取 DOM 或执行初始化。变量结构脚本单独导入 Schema 并调用当前项目提供的注册函数。

### Zod 4 规则

- 使用项目锁定的 Zod 版本；当前 Tavern Helper 模板使用 Zod 4，不照搬 Zod 3 写法。
- 增量解析必须幂等：`Schema.parse(Schema.parse(input))` 应与第一次结果等价。
- 数字输入可能来自文本时优先 `z.coerce.number()`；不要随意用其他 `z.coerce.*`，尤其不要用字符串 false 可能被转为真值的布尔强转。
- 动态集合优先 `z.record`，因为数组索引在 JSON Patch 和提示词中难维护。确有顺序语义时才用数组。
- 固定同类型键可用 `z.record(z.enum(...), valueSchema)`；固定可选键用当前 Zod 支持的 `partialRecord`；固定异构字段用 `z.object`。
- 只在业务确实要求时添加裁剪、数量上限和派生字段。`transform` 的输出必须仍能再次被 Schema 接受。
- 需要缺省值时优先按项目规则使用 `prefault`，但其值必须是该 Schema 的合法输入。复杂对象若 `.prefault({})`，内部必填字段也必须能从缺省输入解析。
- 不把 `optional()` 当作“可被补默认值”的替代品；先确定删除字段后的协议语义。
- `$` 或 `_` 开头的派生／只读字段要在更新规则中明确禁止模型直接修改。
- Schema 只能看到当前输入，不能比较更新前后。需要限制单次增幅等跨版本规则时，在 MVU 更新事件中比较新旧数据。

## 设计字段

为每个字段记录：

| 项目 | 问题 |
| --- | --- |
| 路径 | 是否稳定、清晰、不会与显示文案耦合 |
| 类型 | 模型输出后能否稳定解析 |
| 初值 | 是否代表开场真实状态 |
| 更新触发 | 角色或世界中什么可观察事件会改变它 |
| 更新幅度 | 是否需要范围、冷却、证据或阶段门槛 |
| 权限 | 模型、脚本、用户或派生逻辑谁能修改 |
| 消费者 | 世界书、状态栏、按钮或事件脚本谁会读取 |

不要只从 UI 需要哪些数字倒推变量。先问它是否影响玩法和后续判断。

## initvar

- 条目名称使用 `[initvar]变量初始化勿开`，中文 TavernSync 索引中必须显式 `启用: false`；缺省、`null`、字符串 `"false"` 和 `true` 都不合格；
- `激活策略.类型: 蓝灯` 只保留 MVU 初始化器识别所需的条目语义，**不代表默认启用**；任何开局模式、世界书切换或第二 API 模式都不得把它打开；
- 设置 `不可被其他条目激活: true` 与 `不可激活其他条目: true`，防止递归带出初始化内容；
- 顶层路径与 Schema 完全一致；
- 值满足输入类型，不放演示占位符；
- 动态记录可以为空对象，但必须符合 Schema 缺省策略；
- 时间、地点、关系和物品与开场一致；
- 用构建生成的 JSON Schema 或项目校验器检查；
- 不同时维护两份不同的初值来源，除非项目明确规定合并顺序。

MVU 初始化器会在创建新聊天时读取这个关闭条目的内容来建立 0 层 `stat_data`。把它开启会让原始 YAML 作为普通世界书协议反复进入模型上下文，产生重复初始化、令牌浪费或变量回滚；关闭条目不会阻止初始化器读取它。

另外三条运行时协议必须显式开启：`变量列表`、`[mvu_update]变量更新规则`、`[mvu_update]变量输出格式`。四条精确配置、可复制资源和原始 V2／V3 等价语义见 [`12-MVU世界书与开局契约.md`](12-MVU世界书与开局契约.md)。不要从其他角色卡复制旧配置。

## 当前变量列表

主流模板常用：

```text
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>
```

这不是跨版本永恒格式。新项目先使用本技能 [`../assets/mvu-worldbook/变量列表.txt`](../assets/mvu-worldbook/变量列表.txt)，再以目标环境 `@types`／宏帮助核验；不要从任意角色卡复制，也不要在同一卡里混用多个历史变量宏而未验证合并规则。

## 更新规则

规则应按路径与语义组织，而不是把 Schema 翻译成冗长自然语言。每条写清：

- 什么事件才更新；
- 角色是否知道或感知该事件；
- 增量、范围、格式或容量；
- 新增、替换、删除的语义；
- 哪些字段只读；
- 没有新证据时保持不变。

固定同类型字段可以合并路径规则；动态 `record` 写出键和值结构。避免“每轮都更新所有字段”，那会制造漂移。

## 输出协议

使用当前 MVU 版本和模板规定的更新块。常见实现基于 JSON Patch 风格的 `replace`、`delta`、`insert`、`remove`、`move`，但支持的操作与包裹标签必须从当前项目确认。

- 示例中的路径必须符合 JSON Pointer／项目语法；
- 分析文字与实际命令分区；
- 只输出发生变化的字段；
- 状态显示占位符放在哪里由当前卡协议决定。模板示例可能在开场生成占位符，而不是硬编码在变量输出格式中；检查真实消息，不做一刀切。

## 运行时读取

先查 [`raw/api-types.txt`](raw/api-types.txt) 中当前签名。当前参考类型中：

- `await waitGlobalInitialized('Mvu')` 等待 MVU 全局就绪；
- `Mvu.getMvuData({ type: 'message', message_id: 'latest' })` 读取最新楼层；
- 楼层 iframe 内用 `getCurrentMessageId()` 读取其所在消息，再传给 `Mvu.getMvuData` 或 store；
- `getVariables({ type: 'message', message_id })` 返回变量表，可从中读取 `stat_data`；
- `getAllVariables()` 在 iframe 中返回按作用域合并后的变量表；
- `Mvu.events.VARIABLE_UPDATE_ENDED` 可用于更新完成后的刷新或新旧值约束。

这些是当前类型声明里的直接全局函数／`Mvu` 全局，不要凭记忆写成 `TavernHelper.getVariables`、`TavernHelper.createChatMessages` 或 `TavernHelper.Mvu`。只有目标项目自己的类型确实声明了命名空间封装时才能使用，并要在交付报告中指出版本证据。

不要把 `'latest'`、`-1` 和 `getCurrentMessageId()` 随意互换：

- 历史楼层状态栏通常应读自己所在楼层；
- 全局常驻面板通常应读最新楼层；
- 编辑、滑动或重演消息时要明确目标 swipe／message。

特别注意：`getVariables({ type: 'message' })` 省略 `message_id` 时，当前参考类型的默认值是 `'latest'`，不是“调用它的 iframe 所在楼层”。因此下面这种组合是确定性错误：入口等待最新楼层有数据，store 却读取当前历史楼层。最新楼层有 `stat_data` 时页面会挂载，但组件仍可能读空或读到不同快照。

```ts
// 错误：两处目标不是同一个消息楼层
await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
const store = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});
```

## 模板状态栏

正式楼层界面必须先在独立上下文模块中确定一次目标，并把同一个不可变选项交给等待、读取、store、刷新和写回：

```ts
// context.ts
export const messageId = getCurrentMessageId();

export const variableOption = Object.freeze({
  type: 'message',
  message_id: messageId,
} as const satisfies VariableOption);
```

```ts
// index.ts
import { variableOption } from './context';

await waitGlobalInitialized('Mvu');
await waitUntil(() => _.has(getVariables(variableOption), 'stat_data'));
```

```ts
// store.ts
import { defineMvuDataStore } from '@util/mvu';
import { variableOption } from './context';

export const useDataStore = defineMvuDataStore(Schema, variableOption);
```

全局常驻面板若业务上确实要追随最新楼层，应在自己的 `context.ts` 明确写 `message_id: 'latest'`，并让全链路都复用它。不要用省略参数暗示意图。

共享选项应由消费者当作只读值。store helper 如需把 `'latest'` 归一化成 `-1`，必须先复制：`const normalized = { ...variableOption }`，再修改内部副本；不得原地改写调用方对象。旧版 `util/mvu.ts` 若存在 `variable_option.message_id = -1`，冻结 `'latest'` 对象会在严格模式抛错：优先修 helper 为内部复制；暂时不能修时，不冻结会被它修改的旧对象，并把该兼容限制写在项目内。当前楼层数值选项不触发这条分支，但仍不应依赖这种偶然性。

### Store 语义审计

使用现成 `defineMvuDataStore` 前必须读它的实现，而不只看函数名：

- 首次读取是否解析 `stat_data`，Schema 失败时如何处理；
- 外部变量更新靠事件、轮询还是两者，刷新间隔是多少；
- 对响应式数据的深层修改是否会自动写回；
- 解析校正后的数据是否反写变量，是否可能形成循环；
- iframe 销毁后定时器／watch 是否由框架自动停止；
- `message_id: 'latest'` 是否在内部被归一化成 `-1`，以及 helper 是否错误地修改了调用方对象。

纯展示状态栏优先暴露只读视图，不给每个组件散落直接改 store 的能力。需要装备、使用物品、确认开局等写操作时，把它们收口到 `actions.ts`／store action：校验输入，调用变量或消息 API，确认成功后再刷新显示。不要让一个“加一”按钮绕过角色卡规则无条件改剧情状态。

当前模板常见做法：

```ts
export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});
```

界面入口在挂载前等待 `Mvu` 和当前消息变量中的 `stat_data`，再创建 Vue／Pinia 应用。沿用项目 `@util/mvu` 的解析、响应式和刷新机制；它可能使用轮询、事件或两者组合。不要在不理解现有实现时再叠加第二套刷新链路。

若不是模板项目，才根据当前类型实现读取和监听。直接可用的全局 API 优先；只有旧项目确实依赖 `parent`／`top` 桥接时保留，并测试同源和 iframe 环境。

## 事件和生命周期

- 订阅前等待对应全局初始化；
- 沿用项目已经验证的事件或轮询刷新；新增更新事件主要用于约束增幅、触发后续逻辑，或在没有现成刷新机制时驱动显示；
- 记录新旧数据的用途，避免在监听器里再次引发无限更新；
- 页面隐藏、脚本重载或 iframe 销毁时解除监听和定时器；
- 不用 mock 数据掩盖初始化失败；显示加载、空态或明确错误。

## 动态开局事务

动态开局不是“前端改完表单状态”。0 层标题页确认后必须：

1. 校验表单并用一张显式映射表把输入写到 Schema 已存在的路径；
2. `await waitGlobalInitialized('Mvu')`；
3. 从 `{ type: 'message', message_id: 0 }` 读取 MVU 数据并深拷贝 `stat_data`；
4. 生成包含非空 `<maintext>` 的开场正文；
5. 通过当前类型声明中的 `createChatMessages` 创建 assistant 第 1 层，并携带 `data: { stat_data }`；
6. 回读新消息，逐项断言角色、正文和变量快照；失败就显示错误并停留在开局页，禁止提示成功。

必须把这段写操作放在 `actions/start-game.ts` 或等价 action 中，由 `message-adapter.ts` 负责宿主 API，组件只提交表单。若同时更新世界书，整个流程要么全部成功，要么不留下“世界书已改但消息为空”的半完成状态。

静态多开场、动态创建消息、swipe 和仅显示的标题页是四种不同方案。前者以最终卡包 `first_mes`／`alternate_greetings` 回读为证，动态方案以聊天中的新 assistant 消息和 `data.stat_data` 回读为证。详细代码骨架与失败矩阵见 [`12-MVU世界书与开局契约.md`](12-MVU世界书与开局契约.md)。

## 历史卡兼容

历史卡可能使用旧宏、EJS、`_.set` 命令、聊天变量而非消息变量、外部状态栏或自定义事件。迁移前先画出现有数据流：

`初值来源 → 模型输出 → 解析器 → 存储作用域 → 消费者 → 刷新事件`

一次只替换一段，使用同一段对话／同一变量快照比较结果。不要同时改 Schema、更新协议和 UI 后只凭“能打开”判断迁移成功。

## 验证矩阵

至少测试：

1. 新聊天首条消息能得到有效 `stat_data`；
2. `[initvar]变量初始化勿开` 在源码与最终导出中均明确关闭，三个运行时协议明确开启；
3. 动态开局会创建非空 assistant 消息并携带可回读的 `data.stat_data`；
4. 普通生成只更新有证据的字段；
5. 重新生成／滑动不会串用错误楼层数据；
6. 编辑或重演后状态与目标消息一致；
7. 刷新页面和重新加载脚本后状态仍存在；
8. UI 首次挂载、更新事件和空态均正确；
9. Schema、initvar、更新规则和 UI 使用同一路径；
10. 派生字段不可被模型直接写入；
11. 非法数值能按设计校正或清楚报错；
12. 没有重复监听、无限更新或假数据回退；
13. `check_status_variable_bridge.mjs <角色卡目录> --variables-only` 无 failure。
