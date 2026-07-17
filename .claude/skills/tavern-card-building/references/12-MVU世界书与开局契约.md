# MVU 世界书、初始化与开局契约

## 先记住唯一正确结论

在采用当前 Tavern Helper 模板中文索引的 MVU 角色卡中：

- 条目名使用 **`[initvar]变量初始化勿开`**；
- **必须显式写 `启用: false`**，字段缺失或写成 `true` 都是交付失败；
- `激活策略.类型: 蓝灯` 只是保存的激活策略，不代表该条目要开启；
- MVU 引擎从这个带 `[initvar]` 标记的条目取得初始化数据，正常提示词不需要、也不应该注入它；
- `变量列表`、`[mvu_update]变量更新规则`、`[mvu_update]变量输出格式` 才是正常启用的三个运行时协议条目。

不得把“蓝灯 = 常驻”简化成“所有蓝灯条目都启用”。`启用` 与 `激活策略` 是两个正交字段。最常见的错误正是把 `[initvar]` 因为写了蓝灯而打开。

## 本页的使用边界

只要任务涉及新建、迁移、修复或审查 MVU 卡，应完整阅读本页，再只执行与该卡实际功能相关的部分：四条协议和 initvar 状态属于当前中文模板的基础事实；动态开局、前端、第二 API、云端发布等仅在项目采用它们时适用。不要让模型临时参考一张未知角色卡，也不要把历史卡当模板。实现事实只来自：

1. 当前项目规则、锁定依赖与类型；
2. 当前项目提供的初始模板；
3. 本技能的固定协议资产；
4. 目标运行环境实测。

历史角色卡只能作为待审计输入，不能替代规范。

## 四个容易混淆的配置维度

| 维度 | 回答的问题 | 典型字段 | `[initvar]` 的值 |
| --- | --- | --- | --- |
| 启用状态 | 这个条目是否参加正常世界书注入 | `启用`／`enabled`／`disable` | **关闭** |
| 激活策略 | 条目启用后按何种条件激活 | 蓝灯／绿灯／constant／keys | 保存为蓝灯，但因条目关闭而不注入 |
| 插入位置 | 激活内容进入提示词的哪里 | 角色定义前／指定深度／position | 角色定义前，仅作模板元数据 |
| 递归策略 | 条目能否触发或被其他条目触发 | 两个递归开关 | 两边都禁止 |

判断一个条目是否会进入提示词，先看启用状态，再看激活策略。不能只看灯色。

## 标准数据流

```text
schema.ts
  │ 定义字段、类型、校正、默认与只读派生
  ▼
变量结构脚本 ── registerMvuSchema(Schema)
  │
  ├── [initvar]变量初始化勿开（禁用，只供初始化扫描）
  │       └── 新聊天 0 层 stat_data
  │
  ├── 变量列表（启用，D0/system）── 把当前 stat_data 给模型
  ├── 变量更新规则（启用，D0/system）── 规定何时、为何、改多少
  └── 变量输出格式（启用，D0/system）── 规定 JSON Patch 更新块
          │
          ▼
      MVU 引擎解析并写回消息变量
          │
          ├── 历史楼层 UI 读取自身 message_id
          ├── 常驻 UI 明确读取 latest
          └── 开局页克隆 0 层 stat_data 后创建第 1 层
```

该卡实际采用的链路中，任何一条箭头断开都不能把对应功能称为完成。没有 UI 或动态开局的卡不必创建这些分支；一旦采用，UI 显示正常但变量没更新、变量已更新但 UI 仍为空、开局按钮点击后没有消息，都属于链路失败。

## 中文 TavernSync 索引的四条固定协议

| 条目 | 启用 | 激活 | 插入位置 | 递归 | 内容职责 |
| --- | --- | --- | --- | --- | --- |
| `[initvar]变量初始化勿开` | **false** | 蓝灯 | 角色定义前 | 两项禁止 | 仅提供初始化数据 |
| `变量列表` | true | 蓝灯 | 指定深度、系统、0 | 两项禁止 | 注入当前 `stat_data` |
| `[mvu_update]变量更新规则` | true | 蓝灯 | 指定深度、系统、0 | 两项禁止 | 约束更新语义 |
| `[mvu_update]变量输出格式` | true | 蓝灯 | 指定深度、系统、0 | 两项禁止 | 约束更新命令 |

固定片段位于 [`../assets/mvu-worldbook/index-fragment.yaml`](../assets/mvu-worldbook/index-fragment.yaml)。创建新卡时复制该片段，再只改项目实际需要的文件相对路径。不要凭记忆重写四条配置。

### 为什么 `[initvar]` 不能开启

初始化条目的职责是给 MVU 初始化器提供新聊天的种子，不是给模型反复阅读。打开它会带来这些确定性风险：

- 初始快照每轮进入提示词，浪费 token；
- 初始值与当前变量列表同时出现，形成两套互相冲突的状态；
- 模型可能把旧初值当成当前值，回滚、覆盖或错误推理；
- 私有／内部字段被无条件暴露给模型；
- 递归或重复条目使初始化数据被多次注入；
- 较弱模型会误以为每轮都应恢复初值。

因此：`启用: false` 是硬规则，不是风格偏好。即使界面暂时“还能运行”，开启状态也必须修复。

### 为什么仍然保留“蓝灯”和插入位置

这些字段构成当前模板完整、可往返的世界书条目结构。关闭条目后，它们不会使条目进入正常提示词；保留它们可以与项目 Schema、同步器和未来人工查看保持一致。不要为了“既然关闭就删掉”而破坏模板结构。

## `schema.ts`：唯一字段契约

每个字段必须先写字段设计表，再落 Schema：

| 项 | 必须回答 |
| --- | --- |
| 稳定路径 | UI、规则和补丁是否使用完全同一路径 |
| 类型 | 模型输出字符串时是否需要 `z.coerce.number()` 等校正 |
| 初值 | 是否与开场的时间、地点、人物、装备一致 |
| 更新证据 | 正文中出现什么事实才允许改变 |
| 幅度与边界 | 一次能改多少，范围和阶段门槛是什么 |
| 写权限 | 模型、玩家按钮、脚本或派生逻辑谁能修改 |
| 消费者 | 哪个世界书、组件、按钮或事件使用它 |

硬规则：

- `schema.ts` 只定义并导出 Schema；注册逻辑放到单独脚本入口；
- 以当前项目锁定的 Zod 版本为准；
- `Schema.parse(Schema.parse(input))` 的输出语义必须稳定；使用 default、transform、coerce 或复杂 refine 时可从 [`../assets/mvu-worldbook/schema-idempotence.test.ts`](../assets/mvu-worldbook/schema-idempotence.test.ts) 建立幂等回归测试；
- 动态成员、物品、任务通常用 `z.record`，只有顺序有业务意义时才用数组；
- `$`／`_` 开头的派生或只读字段必须在更新规则中禁止写入；
- 不因 UI 想展示某个字段就自动把它持久化；先证明它会变化且影响玩法；
- Schema 路径变更必须在同一次改动中同步 initvar、规则、UI 和测试。

## `initvar`：只负责一个真实的新局种子

`initvar.yaml` 的根路径必须与 Schema 输出一致，内容必须代表开场时的真实状态：

- 不允许 `TODO`、`待定`、`示例值`、`xxx` 或为了演示而编造的成员；
- 动态集合可以是空对象，但 Schema 必须允许；
- 时间、地点、关系、物品、任务与开场白逐项一致；
- 不在另一个脚本或世界书里再维护第二份不同的初始真相；
- 完成卡不得保留只有 `{}` 的空初始化，除非 Schema 本身确实为空；
- 开发时用项目生成的 `schema.json` 或项目校验器验证 initvar。

正确条目配置：

```yaml
- 名称: '[initvar]变量初始化勿开'
  启用: false
  激活策略:
    类型: 蓝灯
  插入位置:
    类型: 角色定义之前
    顺序: 14720
  递归:
    不可被其他条目激活: true
    不可激活其他条目: true
  文件: 世界书/变量/initvar
```

错误配置，任何一项命中都必须失败：

```yaml
# 错：默认开启
- 名称: '[initvar]初始变量'
  启用: true

# 错：缺少启用字段，不能依赖宿主默认值
- 名称: '[initvar]初始变量'
  激活策略:
    类型: 蓝灯

# 错：去掉 [initvar] 标签后仍声称 MVU 会初始化
- 名称: 初始变量
  启用: false
```

## 三个正常启用的运行时条目

### 变量列表

使用资产 [`../assets/mvu-worldbook/变量列表.txt`](../assets/mvu-worldbook/变量列表.txt)：

```text
---
<status_current_variable>
{{format_message_variable::stat_data}}
</status_current_variable>
```

它向模型提供当前状态，不负责初始化，也不负责显示 UI。必须实测宏在目标环境中展开为当前目标楼层的 `stat_data`。

### 变量更新规则

按稳定路径组织，每个路径至少写：触发证据、更新幅度、边界、增删语义和不更新条件。示例：

```yaml
---
变量更新规则:
  玩家.体力:
    type: number
    range: 0~100
    check:
      - 只在正文发生消耗、休息、治疗或明确时间推进时更新
      - 普通行动通常变化 1~10；重大事件才可超过该幅度
      - 没有新证据时保持不变
  成员:
    type: record
    check:
      - 只有角色正式加入队伍时 insert 完整成员对象
      - 离队不等于死亡；按玩法决定保留、标记或 remove
```

不要写“根据剧情合理更新全部变量”。那会让弱模型每轮重写所有字段并持续漂移。

### 变量输出格式

使用资产 [`../assets/mvu-worldbook/变量输出格式.yaml`](../assets/mvu-worldbook/变量输出格式.yaml)，再按目标 MVU 版本核对支持的操作。当前模板协议包含 `replace`、`delta`、`insert`、`remove`、`move`，更新块使用 `<UpdateVariable>` 与 `<JSONPatch>`。

模板列出操作符不等于目标运行时一定支持全部变体。只核对这张卡实际会用到的操作：优先查目标版本类型／文档；签名不清或跨版本时，在一次性聊天中发送最小合法更新并回读 `stat_data`。目标不支持或本卡不会使用的操作，要从交付版规则说明和 JSONPatch 示例中一起删除；无需为了清单逐个测试。无法运行时标为“未实测”，不要伪造兼容结论。

输出要求：

- 只写本轮有证据变化的路径；
- JSON 数组与每个操作对象必须可解析；
- `path` 使用目标项目的 JSON Pointer 语法；
- 不写 `$`／`_` 开头只读字段；
- `delta` 只用于已存在的数值；
- `insert` 新对象时一次提供 Schema 要求的完整结构；
- 没有变化时按项目协议输出空更新或不输出，不能伪造变化。

## 脚本与占位符

MVU 引擎脚本、变量结构注册脚本和状态栏显示正则是三件不同的事：

1. **MVU 引擎**解析更新块、维护消息变量，并可能注入 `<StatusPlaceHolderImpl/>`；
2. **变量结构脚本**导入并注册当前角色卡的 Schema；
3. **状态栏正则／界面**把占位符替换为显示内容，再从目标消息变量读取 `stat_data`。

必须逐项确认：

- 两个必需脚本都已启用；
- 自托管变量结构脚本 URL 带稳定发布版本；
- `<StatusPlaceHolderImpl/>` 在真实 assistant 消息中确有来源；
- 正则仅作用于格式显示，不把 UI HTML 发送给模型；
- 正则查找表达式确实匹配占位符；
- 替换内容加载的是本次构建产物而非旧 URL；
- 页面初始化等待 `Mvu` 和目标消息的 `stat_data`，失败时显示错误，不回退到 mock。

不要为了“状态栏没显示”让模型额外输出第二个占位符。先查引擎是否已注入、正则是否匹配、加载 URL 是否正确。

## 楼层作用域：状态栏读取哪一份变量

### 消息内状态栏

每个历史楼层应显示该楼层自己的快照。只在 `context.ts` 计算一次：

```ts
export const messageId = getCurrentMessageId();
export const variableOption = Object.freeze({
  type: 'message',
  message_id: messageId,
} as const satisfies VariableOption);
```

等待、首次读取、store、刷新与写回都导入同一个 `variableOption`。禁止入口省略 `message_id` 而 store 使用 `getCurrentMessageId()`。

### 跨楼层常驻面板

若业务明确要求永远显示最新状态，则在它自己的 `context.ts` 写：

```ts
export const variableOption = Object.freeze({
  type: 'message',
  message_id: 'latest',
} as const satisfies VariableOption);
```

仍然禁止省略参数来“默认 latest”。显式写出意图，才能审查。

### 生成与更新后的刷新

- 使用项目现成 store 的事件／轮询机制前先读实现；
- 若监听 `Mvu.events.VARIABLE_UPDATE_ENDED`，订阅前等待 `Mvu` 初始化；
- swipe、编辑、重演、删除、读档后重新确认目标 message id；
- iframe `pagehide` 时解除监听、定时器和 Observer；
- 不让组件各自直接调用 `getVariables` 或 `Mvu.getMvuData`。

## 动态开局：从 0 层产生真实的第 1 层

动态标题页／开局页通常显示在角色卡的第 0 层。MVU 已依据禁用的 `[initvar]` 为 0 层建立 `stat_data`。玩家提交开局表单后，必须完成一个可回读的事务：

1. 校验所有必填选项，禁止空字段静默通过；
2. 从 0 层读取 MVU 数据；
3. 深拷贝 `stat_data`，不得直接修改 0 层对象；
4. 按映射表解析数值／布尔／枚举等表单值，写入 Schema 中已存在的准确路径，再对整个快照执行 `Schema.parse`；
5. 对进入 XML／HTML 文本的玩家输入按输出上下文转义，用模板生成非空的 `<maintext>` 与必要 `<option>`；
6. 创建前断言当前最后楼层确实为 0；调用 `createChatMessages` 创建 assistant 第 1 层，并把新 `stat_data` 放入消息 `data`；
7. 读取新建消息，确认消息号恰为 1、正文非空、角色为 assistant、`data.stat_data` 已存在且字段值正确；
8. 再进入主界面。任一步失败都停留在开局页显示可诊断错误，不能提示“导入完成”。

参考实现骨架，调用签名仍须以当前 `@types` 为准：

```ts
await waitGlobalInitialized('Mvu');

const initialData = Mvu.getMvuData({
  type: 'message',
  message_id: 0,
});
const statData = _.cloneDeep(_.get(initialData, 'stat_data', {}));

// 所有路径都必须来自 Schema 与表单映射表。
_.set(statData, '世界.时代', form.era);
_.set(statData, '世界.地区', form.region);

const opening = renderOpening(form);
if (!opening.match(/<maintext>[\s\S]*\S[\s\S]*<\/maintext>/)) {
  throw new Error('开场白为空或缺少 maintext');
}

await createChatMessages([
  {
    role: 'assistant',
    message: opening,
    data: { stat_data: statData },
  },
]);
```

上面不是“点击按钮后更新一个前端本地对象”。真正完成的证据是酒馆聊天中新建了可回读的 assistant 消息，且该消息携带变量快照。

### 开局表单映射表

实现前为每个输入写清：

| 表单字段 | Schema 路径 | 必填 | 输入校验 | 开场模板位置 | 世界书副作用 |
| --- | --- | --- | --- | --- | --- |
| 时代 | `世界.时代` | 是 | 枚举／自定义规则 | 场景首句 | 开启对应时代条目 |
| 地区 | `世界.地区` | 是 | 非空、长度限制 | 场景地点 | 写入游戏信息 |
| 玩家性别 | `玩家.性别` | 是 | 枚举 | 人物介绍 | 无 |

不得用 UI 标签文字猜 Schema 路径。映射表是唯一桥梁。

### 静态多开场与动态开局不能混为一谈

- **静态开场**：写入角色卡 `first_mes`／`alternate_greetings`，由 `index.yaml` 的第一条消息引用；
- **动态开局**：0 层前端根据表单创建新的 assistant 消息；
- **swipe 开场**：同一消息的多个 swipe，由目标 API 切换；
- **显示页**：只渲染标题／表单，不等于已经产生开场消息。

动态开局卡建议让 `first_mes` 同时承担失败兜底：可以是完整的静态备选剧情，也可以在纯动态设计中提供加载失败提示、恢复／重试路径和基本行动入口。是否需要第二套完整剧情按设计决定，但 `first_mes` 不能是空字符串或只有无法诊断的占位标签。

AI 声称“已经导入开场”时，必须按实际方案给出相应证据：

- 静态方案：最终 PNG／JSON／CHARX 的 `first_mes` 和 `alternate_greetings` 非空并回读一致；
- 动态方案：点击后创建的新消息非空、`stat_data` 存在且新聊天重测通过；
- swipe 方案：目标 swipe 确实存在且可切换。

只写了模板函数、只生成了本地文件、只更新了 UI，均不能称为“开场已导入”。

## 开局后写世界书与互斥条目

开局选择需要长期影响玩法时，可以在“开始游戏”事务中更新绑定世界书，但必须分清所有权：

- 建议把玩家最终选择写入单一 `游戏信息` 条目；
- 内容是设定事实，不复制整个 `stat_data`；
- 互斥模块使用稳定前缀／ID，如 `时代-1990`、`时代-2020`；
- 根据玩家选择只启用匹配条目，关闭同组其他条目；
- `[initvar]` 不属于可切换运行时条目，任何模式都不得把它打开；
- 世界书写入失败时，不创建半完成的第 1 层；需要事务回退或明确重试。

若是双 API 模式，只切换 `变量列表`、`变量更新规则`、`变量输出格式` 等运行时提示词条目的启用状态。`[initvar]` 始终保持关闭。第二 API 的输入应显式组装：当前正文、当前变量 JSON、更新规则、输出格式和独立任务；不得默认泄露预设、全世界书、聊天历史或密钥。

## 原始 V2／V3 卡的等价字段

没有中文 TavernSync 索引时，先解析实际角色书结构，再做等价映射：

| 中文索引语义 | 常见原始卡语义 | 审查目标 |
| --- | --- | --- |
| `启用: false` | `enabled: false`、`disable: true` 或宿主扩展字段 | 明确关闭，不能依赖缺省 |
| 蓝灯 | `constant: true` 或等价 strategy | 仅描述启用后的触发方式 |
| 指定深度 D0/system | `position`、`depth: 0`、`role: system` | 运行时协议靠近当前轮 |
| 禁止被激活 | `excludeRecursion`／等价字段 | 其他条目不能带出它 |
| 禁止激活别人 | `preventRecursion`／等价字段 | 它不能继续递归 |

字段名在版本间可能不同，不能只按字符串改写。完成标准是语义等价、扩展字段无损、导出后重新解析仍为关闭状态。

## 弱模型也必须逐项执行的建卡算法

不要把下列步骤压缩成“照模板完成 MVU”。每一步都要留下文件或检查结果，前一步失败不得继续宣称完成。

1. **确认目标**：找到唯一的角色卡根目录、`index.yaml`、构建命令、`tavern_sync.yaml` 配置名和目标角色显示名；特殊字符按原名保存。
2. **读取规范**：读取项目规则、当前 `@types`、本页和 `04-MVU变量系统.md`。不得打开任意其他角色卡寻找“能抄的写法”。
3. **建立字段表**：为每个变量写出稳定路径、类型、初值、谁能修改、更新证据、消费者和是否派生；删除没有玩法消费者的装饰变量。
4. **实现 Schema**：使用项目当前 Zod／MVU 模板；为数值边界、缺省值、动态记录和派生字段写明语义；注册脚本只注册这一份 Schema。使用 default、transform、coerce 或复杂 refine 时，增加 `Schema.parse(Schema.parse(initvar))` 幂等验证；简单 Schema 可用项目现有测试覆盖，不必机械新增测试文件。
5. **实现 initvar 内容**：初值必须是开场时的真实状态，顶层字段与 Schema 对齐，不能是 `{}`、示例值或第二份相互矛盾的默认值。
6. **配置四条世界书协议**：从 `assets/mvu-worldbook/` 复制结构。`[initvar]变量初始化勿开` 必须显式 `启用: false`；另外三条必须显式 `启用: true`；四条均设置准确的灯色、位置和双向递归隔离。
7. **实现更新规则**：逐路径说明更新证据、允许操作、范围和只读条件；禁止“每轮全部更新”。
8. **实现输出格式**：只使用目标 MVU 版本支持的 JSON Patch 操作与标签；至少包含 `<UpdateVariable>` 和 `<JSONPatch>`，并要求无变化时不伪造更新。对本卡实际使用且版本支持性不明确的操作做最小烟测；不测试不会使用的操作。
9. **实现引擎链**：确认 Schema 注册、MVU 引擎和状态占位符来源。不要在多个条目中重复注入同一协议。
10. **实现楼层上下文**：在 `context.ts` 只导出一个 `variableOption`。楼层 UI 使用 `getCurrentMessageId()`；全局面板若确实追随最新消息才显式使用 `'latest'`。等待、读取、store、刷新和写回全部复用它。
11. **实现多模块界面**：从 `assets/status-ui-vue/` 或 `assets/dynamic-opening-vue/` 复制相应骨架，把宿主适配、store、actions、高度同步、组件、样式和薄入口分开；组件不得直接猜 API 或维护第二份变量真相。执行 `check_frontend_structure.mjs`。
12. **实现开局**：先写“表单字段 → 解析器 → Schema 路径”映射，再按本页事务从第 0 层创建且回读恰好第 1 层的非空 assistant 消息并携带 `data.stat_data`；外部输入按输出上下文转义。静态 greeting 必须真实写入并打包进 `first_mes`／`alternate_greetings`；动态卡至少保留可诊断的失败／恢复路径。
13. **静态验收**：运行本技能所有适用检查器。`check_status_variable_bridge.mjs` 的任何 failure，尤其是 initvar 启用、缺少显式启用状态、协议条目禁用或 Schema／初值不一致，都必须修复。
14. **运行时验收**：新建聊天测试 0 层初始化、创建第 1 层、普通生成、历史楼层、swipe、刷新、移动端、长内容和错误态；用实际消息回读正文与 `stat_data`，不能只看按钮提示。
15. **构建与发布验收**：正式构建后检查 `dist` 入口；若用户已经授权云端／Git 发布，URL 使用稳定版本号并同步更新角色卡真实引用；未获授权只生成本地产物和待更新清单。在酒馆中确认 iframe 首屏及展开内容均能主动撑高。
16. **最终同步**：若本次实际新建或修改了 TavernSync 角色卡，先确认合法非空头像；未知头像来源时停在 push 前报告，不擅自造占位图。条件满足后执行最终 `push`，再用隔离 pull／API 回读开场数量、内容哈希、关键字段和可回读的 MVU 协议。push 后又改文件就必须重跑构建、检查和 push。

## 多模块 MVU 界面最低结构

正式状态栏或开局页至少应有这些职责，不要求文件名完全相同：

```text
src/<界面名>/
├─ index.html              # 仅静态挂载壳
├─ main.ts                 # 等待宿主、创建应用、安装生命周期
├─ App.vue                 # 页面组合，不直接猜宿主 API
├─ context.ts              # 唯一 VariableOption／当前消息上下文
├─ host/
│  ├─ mvu-adapter.ts       # MVU 读取、写回、事件适配
│  └─ message-adapter.ts   # create/get/update 消息与回读
├─ stores/
│  └─ use-character-store.ts
├─ actions/
│  └─ start-game.ts        # 开局事务与错误回滚
├─ lifecycle/
│  └─ iframe-height.ts     # ResizeObserver、首帧和销毁清理
├─ components/
│  └─ ...
└─ styles/
   └─ ...
```

构建产物可以是单个 `dist/<界面名>/index.html`，源码不能因此退化为单文件。是否“多模块”按源码职责判断，不按最终打包文件数量判断。完整规范见 [`10-多模块界面工程规范.md`](10-多模块界面工程规范.md)。

可复制骨架：

- [`../assets/status-ui-vue/README.md`](../assets/status-ui-vue/README.md)：楼层状态栏；
- [`../assets/dynamic-opening-vue/README.md`](../assets/dynamic-opening-vue/README.md)：0 层动态开局、assistant 消息创建与回读。

骨架中的示例业务字段必须替换为目标角色真实 Schema 与内容；模块边界、错误处理、回读断言、稳定版本和高度生命周期不得删除。

## 按功能适用的检查命令

在角色卡项目根目录运行，路径按实际技能安装位置替换：

```powershell
node <skill>/scripts/check_status_variable_bridge.mjs <角色卡目录> --variables-only
node <skill>/scripts/check_frontend_structure.mjs <角色卡目录>
node <skill>/scripts/check_first_message_refs.mjs <角色卡目录>
node <skill>/scripts/check_regex_cdn_format.mjs <角色卡目录>
```

`check_status_variable_bridge.mjs` 对中文 TavernSync 索引执行四条协议的硬检查：

- `[initvar]` 只能有一条，必须显式关闭；
- 初始变量、变量列表、更新规则、输出格式必须各自绑定可读非空文件；
- 三条运行时协议必须显式开启；
- 四条都必须是蓝灯且双向禁止递归；
- 三条运行时协议必须位于 system 指定深度 D0；
- Schema 非空时，initvar 不能是空对象，顶层字段不能缺失或多出；
- 变量列表必须准确展开消息 `stat_data`，输出格式必须含两个协议标签。

只有历史原始卡确实无法映射为中文索引时，才人工核对 V2／V3 等价字段，并把“为何语义等价”的证据写入交付报告。不得因为检查器不理解旧格式就默认通过。

## 故障到根因的最短路径

| 现象 | 先查 | 不应先做 |
| --- | --- | --- |
| 初始变量世界书默认打开 | `index.yaml` 中 `[initvar]` 的 `启用`，导出后等价字段，是否被开局脚本误切换 | 重写变量内容或 UI |
| 状态栏为空 | 占位符 → 正则 → iframe → 该楼层 `stat_data` → Schema parse → 高度 | 填 mock 数据 |
| 状态栏总显示最新值 | 所有读取是否复用当前楼层 `variableOption` | 增加第二个轮询 |
| 点击“开始”却没有开场 | `createChatMessages` 是否执行、正文是否非空、消息是否回读、是否携带 `data.stat_data` | 只改按钮成功提示 |
| 导入后新聊天没有首楼 | 源引用 → 打包产物 `first_mes` → TavernSync push → 隔离回读 → 新聊天 | 反复换 YAML 写法 |
| 展开后页面被截断 | 正常文档流、`ResizeObserver`、`body.scrollHeight`、当前 `frameElement` | 固定 2000px 高度 |
| 云端已更新但酒馆不变 | 正式构建、稳定版本号、角色卡实际 URL、直接请求返回内容 | 使用 `Date.now()` |
| 特殊名称导入失败 | 原名、URL 编码、`worldbook: null`、同步器回退逻辑 | 擅自删方括号或改角色名 |

## 完成判定

以下条件只检查该卡实际采用的功能；例如没有楼层 UI／动态开局／云端发布时，对应项直接不适用。适用项满足后才能说相应功能完成：

- `[initvar]变量初始化勿开` 在源码和最终导出中都明确关闭，且任何开局分支都不会启用它；
- Schema、initvar、更新规则、输出格式、运行时 `stat_data` 和 UI 路径形成一条可回读链；
- 开局正文和变量快照均通过新聊天实测，不存在“提示成功但未创建消息”；
- 楼层状态栏显示所在消息的状态，刷新、swipe 和历史楼层不串层；
- 界面源码多模块、无生产 mock、可在内容变化后主动撑高；
- 正式构建、稳定版本引用、桌面和移动端关键场景已验证；
- 适用检查器无 failure，warning 已逐项解释或修复；
- 本次修改角色卡且使用 TavernSync 时，最后一次操作包含最终 push 和隔离回读。

只完成代码生成、只通过构建、只看到 push stdout、只看到 UI 成功提示，均不满足完成定义。
