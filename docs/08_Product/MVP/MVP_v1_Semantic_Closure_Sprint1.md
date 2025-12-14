以下为 System & Semantics 组 在 Sprint 1 下的正式产出。
这是裁判文书，不是技术方案。

⸻

《Sprint 1 最小闭环语义确认单》

范围：Fact → Timeline →（极简）WDL
阶段：MVP v1 · Sprint 1
角色：System & Semantics（裁判）

⸻

一、结论（唯一结论位）

结论：成立（YES）

在不新增任何字段、不修改任何语义、不引入任何规则的前提下：
• 人工输入的 Fact
• 可以被 System 接收并持久化
• 可以按时间顺序进入 Timeline
• Timeline 可以生成一个字段大量为空但语义合法的 WDL

该链路在现有冻结规范下是合法且自洽的。

⸻

二、必须字段清单（摘抄自既有规范）

说明：以下为“存在即合法”的最小集合
不代表完整 Schema，只代表 Sprint 1 最小闭环所需

1️⃣ Fact（Fact Envelope）必须字段
• fact_id（系统生成，唯一）
• occurred_at（UTC，写入即冻结）
• source（human / monitor）
• raw_payload（opaque，不解析）

说明：
• raw_payload 内容不受 System 约束
• 不要求任何业务字段
• 描述文本、图片引用均可包含在 raw_payload 中

⸻

2️⃣ Timeline Entry 必须字段
• fact_id
• occurred_at
• source

说明：
• Timeline 是 Fact 的时间序列视图
• 一条 Fact = 一条 Timeline Entry
• 不允许合并、派生、补充

⸻

3️⃣ WDL（WorldState-Lite）必须存在的字段（允许为空）

注意：存在 ≠ 有值

• block_id（若无，可为空）
• timestamp_utc（来自 Timeline 时间点）
• fact_refs（至少包含 1 个 fact_id）

⸻

三、可为空字段清单（明确允许为空）

以下字段在 Sprint 1 允许为空，不构成违规，不影响合法性：

WDL 层
• phenology_state
• soil_moisture_state
• management_events
• extreme_events
• consistency_features
• env_meta
• block_meta（除 block_id 外）

判定依据：
WDL v1.0 允许“低维度、无推断、字段存在但值为空”的合法快照。

⸻

四、护栏判定结果（Yes / No）

1️⃣ Fact Intake 护栏
• 唯一入口：Fact Envelope → YES
• 顶层字段 strict 校验 → YES
• raw_payload opaque → YES
• 无 update / delete → YES
• occurred_at 冻结 → YES

⸻

2️⃣ Fact Store（可重启不丢）
• append-only → YES
• 重启后 Fact ID 不变 → YES
• 重启后时间顺序不乱 → YES

⸻

3️⃣ Timeline 读取接口（只读）
• 按时间顺序返回 → YES
• 不合并 / 不解释 / 不派生 → YES
• 只返回 system 已有字段 → YES
• 新提交 Fact 可见 → YES

⸻

五、明确声明（防越界）

本确认单 不包含、也不隐含 以下任何内容：
• ❌ 实现建议
• ❌ API 设计建议
• ❌ UI / UX 建议
• ❌ 字段扩展提议
• ❌ Sprint 2 规划
• ❌ “更好做法”或“优化空间”

⸻

六、裁判备注（只此一句）

Sprint 1 成功的前提已经满足。

后续若出现任何“为了方便 / 为了展示 / 为了跑通”而：
• 请求新增字段
• 请求修改语义
• 请求引入派生规则

一律判定为越界。