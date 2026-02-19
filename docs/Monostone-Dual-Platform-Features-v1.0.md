# Monostone 双端功能定义 v1.5

> 本文档定义 iOS 和 macOS 两端的功能模块、页面结构与职责划分。
> iOS 是主端（多数用户唯一设备），macOS 是增强端（iOS 全部能力 + 扩展能力）。
> 所有数据双端完全同步。
>
> v1.4 变更：日程管理为核心能力（EventKit 集成）、短录音自动创建日历事件、iOS Tab 重排（Timeline / Library / Memory / Me）、Agent 降为增强层入口、产物编辑统一为 Live Preview、核心/增强/插件边界重定义。
>
> v1.5 变更：首轮 UX 审计修复——状态流转规范（S1）、Timeline 信息分层（S2）、Memory 展示统一（S3/S5）、空状态规范（S4/M1）、错误状态规范（M2）、加载状态规范（M3）、手势/交互规范（M4）、通知系统规范（M5）、戒指触觉反馈（M6）。
>
> v2.0 变更：**Agent 升级为核心功能（Tab 4）**——类 OpenClaw 体验，BYOK + Max Plan 变现入口。原 Me Tab 降级为 Timeline 左上角 Profile 入口。核心/增强层边界重定义（Agent 从增强层提升为核心层）。

---

## 0. 产品层级关系

```
iOS = 完整独立产品
      录音 / 产物 / 日程管理 / 检索 / 投递 / 分享 / Agent（核心 Tab）/ 记忆 / Daily Digest

macOS = iOS 全部能力
      + 日历集成（EventKit API，覆盖用户所有日历源）
      + 本地文件系统集成（Finder 同步）
      + 深度 Inspector 面板
      + Agent 深度模式（高 token 任务）
      + 高级检索（智能视图 / 过滤器组合）
      + Project System（context 容器，语义索引，Project Memory）
      + 插件系统（P0 自带核心 Destination，V1.5 开放插件市场）
```

**核心/增强/插件边界：**

| 层级          | 能力                                                                         | 说明                                   |
| ----------- | -------------------------------------------------------------------------- | ------------------------------------ |
| 🔵 **Core** | 录音+转录、总结+结构化、Insight、Daily Digest、**日程管理**、Timeline、Project、Memory、搜索、文件导入、**Agent IM（对话+执行）** | 没有就不是 Monostone                      |
| 🟡 **增强层**  | 投递（Deliver）、Smart Follow-up、Context Connection、高级 Agent 能力（BYOK/Max Plan）                    | 有了更好，没有产品也成立                         |
| 🔘 **插件**   | Destination（Notion / Obsidian / 邮箱）、Processor、Agent Plugin、Renderer        | P0 自带 3-5 个核心 Destination，V1.5 开放第三方 |

**原则：**
- 用户只有 iPhone + 戒指，也能完成 100% 的核心体验，包括深度工作
- macOS 是给需要文件系统集成、高 token 任务的用户
- **日程管理是核心能力**：从录音中自动提取日程/待办 + 通过 EventKit 读写系统日历
- P0 自带 3-5 个核心 Destination（Notion / Apple Calendar / Obsidian / Email），包含在订阅中
- 插件市场 & 第三方插件开放 → V1.5
- **Agent IM 是核心功能**（v1.5→v2.0 改）——Agent 是独立 Tab 4，类 OpenClaw 体验。用户可以 BYOK 或购买 Max Plan 获取高级 Agent 能力。Agent 也是主要变现入口之一。

**UI 文案约定：**
- Candidate 确认按钮：统一为 "✨ Distill"（iOS 和 macOS 一致）（v1.5 改：原 "Process" 语义模糊，改为动词+隐喻，传达"提炼精华"）
- 批量确认：统一为 "✨ Distill N items"

**v1.5 新增：状态流转规范（S1 修复）**

Candidate → Ready 的完整状态流转：

| 阶段 | 文案（双端一致） | 时长预期 | 视觉 |
|------|-----------------|---------|------|
| 点击 "✨ Distill" | — | 即时 | 按钮变为 disabled 状态 |
| 转录中 | "Transcribing..." | 5-15s | Spinner + 进度文案 |
| 分析中 | "Analyzing..." | 3-8s | Spinner + 进度文案 |
| 生成中 | "Generating summary..." | 3-10s | Spinner + 进度文案 |
| 完成 | "✨ Ready" | 0.5s 展示后消失 | 完成动画 |

完成反馈（双端差异）：

| 平台 | 反馈方式 |
|------|---------|
| iOS | 系统 haptic（`UIImpactFeedbackGenerator` medium）+ 卡片状态变为 Ready |
| macOS | 卡片轻弹动画（scale 1.0→1.02→1.0, 200ms ease-out）+ 状态变为 Ready |

异常处理：
- 任一阶段超过 30s 无响应 → 显示 "Taking longer than usual..." + 进度条改为不定长
- 超过 60s → 显示 "Still working..." + 提供 "Cancel" 选项
- 失败 → 一句话原因 + "Retry" 按钮（详见 §6.2 错误状态规范）

---

## 1. iOS 端

### 1.0 导航结构

底部 Tab Bar（4 个）：

| Tab | 名称 | 职责 |
|-----|------|------|
| 1 | **Timeline** | 核心列表：录音产物、日历事件草稿、待办、Agent 任务卡片、Daily Digest |
| 2 | **Library** | 组织层：Projects + Folders + Notes + Search |
| 3 | **Memory** | 记忆展示 & 编辑 |
| 4 | **Agent** | AI 对话 + 执行（核心功能，类 OpenClaw 体验，BYOK / Max Plan 变现入口） |

Profile & Settings 入口：**Timeline 左上角用户头像** → Push 进入设置页面

Agent 辅助入口（Tab 4 为主入口）：
- 产物详情页底部 "💬 Ask about this" → 跳转 Agent Tab，携带当前产物 context

---

### 1.1 戒指连接 & 录音

**功能：**
- 蓝牙配对 & 连接状态（Timeline 顶部状态指示 + Settings 详细管理）
- 长录音（拇指双击）：会议模式，实时显示录音时长
- 短录音（拇指按住上推）：口述模式，松开结束
- 录音中状态指示（波形动画 / 时长 / 录音类型标识）
- 录音结束 → 自动上传云端 → 进入处理队列 → Timeline 出现 Candidate 条目

**短录音自动创建日历事件：**

短录音（口述模式）支持自动识别日程意图并静默创建日历事件。

| 条件 | 说明 |
|------|------|
| **触发** | 来源 = 短录音 + Agent 识别意图为「日程/约会/提醒」+ 时间明确 + 内容明确 |
| **行为** | 静默创建日历事件（通过 EventKit 写入系统日历），不询问用户 |
| **Timeline 反馈** | 出一张确认卡片："已添加：周五 18:00 跟张三吃饭 📅"，用户可点击修改或删除 |

**降级条件（需要确认）：**
- 时间模糊（"改天"、"下周找个时间"）→ Agent 追问或生成 draft 卡片
- 内容模糊（"那个事儿"）→ Agent 追问
- 时间冲突（跟已有日历事件撞了）→ 提示冲突，让用户选择

**不触发自动创建：**
- 长录音里提到的日程 → 走正常处理流程，日程作为 extracted item（Candidate 状态），让用户确认
- 原因：长录音 context 复杂，自动创建容易误判

**连接状态展示：**
- 已连接：绿色指示
- 未连接 / 搜索中：灰色 + 引导重连
- 固件更新提示

---

### 1.2 Timeline（Tab 1）

Timeline 是用户打开 App 看到的第一个页面，**也是每天最常看的页面**。

**承载的内容类型：**

| 类型 | 来源 | 示例 |
|------|------|------|
| 录音产物 | 戒指录音处理后 | Meeting Note、Cleaned Text、Insight |
| 📅 日历事件草稿 | 录音中提取的日程（Candidate） | "周三 Eric 1:1 — 硬件进度"、"周五 deadline — 发 deck 给 Lisa" |
| ✅ 待办事项 | 录音中提取的任务 | 带 checkbox，可直接勾选完成 |
| Agent 任务卡片 | Agent 执行结果 | "✉️ 邮件草稿：会议改期 → Eric" |
| 日历事件确认卡片 | 短录音自动创建 | "已添加：周五 18:00 跟张三吃饭 📅" |
| Daily Digest | 系统每日生成 | 今日摘要 + 待办 + 明日预览 |
| ~~记忆更新通知~~ | ~~Pattern Mining 触发~~ | ~~"学到了 2 件关于你的新事" → 点击跳转 Memory~~ **v1.5 改：不占 Timeline 位置，改为 Memory Tab badge 提示** |
| 手动导入 | 用户从相册/文件导入 | 文件 Markdown、截图 OCR |

**每条 Timeline 条目展示：**
- 主标题：未总结 → 时间；已总结 → 语义标题
- 左侧图标 + emoji 状态标识（🎙️ 录音 / 📅 日程 / ✅ 待办 / 🤖 Agent / 📊 Digest）
- 副信息：时长或字数
- 去掉 source 文字和 status 文字，用 icon + emoji 传达（与 macOS 卡片设计对齐）

**状态交互：**
- **Candidate**：显示"✨ Distill"按钮，支持批量确认（v1.5 改）
- **Processing**：分阶段文案 spinner 动画（见 §0 状态流转规范），无操作（v1.5 改）
- **Ready**：点击进入详情页（iOS haptic / macOS 轻弹动画完成反馈）（v1.5 新增）
- **Delivered**：已投递标识 + 可再次投递
- **Failed**：一句话原因 + 重试按钮

**Agent 任务卡片交互：**
- 卡片内直接显示任务摘要（如邮件草稿前几行）
- 展开后：完整内容 + 确认执行 / 编辑 / 取消
- 执行后状态变为 Delivered
- 如果 Agent 需要用户补充信息，卡片变成"需要你的输入"状态

**Daily Digest 卡片：**
- 分为两张卡片：
  - ☀️ **Morning Briefing**（早上）：今日待办、日历事件、昨日未完成项
  - 🌙 **Evening Recap**（晚上）：今日总结、完成情况、关键产物回顾、明日预览
- 各自按用户设定时间出现在 Timeline 顶部（置顶），出现时间在 Settings 中配置
- 可点击展开查看详情
- 可直接在卡片内勾选待办完成

**v1.5 新增：Timeline 信息分层规范（S2 修复）**

Timeline 卡片混排容易信息密度失控。双端统一以下分层规则：

```
┌─────────────────────────────┐
│ 📊 Daily Digest（置顶层）    │  ← 置顶，Morning/Evening 各一张
├─────────────────────────────┤
│ ⚡ 需要你处理（操作层）       │  ← Candidate + Agent 待确认
│   🎙️ 昨天的会议录音 [✨ Distill]  │
│   🤖 邮件草稿需确认 [确认/编辑]    │
│   📅 日程冲突需选择 [选择]         │
├─────────────────────────────┤
│ 🕐 时间流（已处理产物）       │  ← 按时间倒序
│   14:30 Meeting Note — 产品会
│   11:00 Insight — 竞品分析
│   09:15 Cleaned Text — 晨间录音
└─────────────────────────────┘
```

| 层级 | 内容 | 排序规则 | 说明 |
|------|------|---------|------|
| **置顶层** | Daily Digest（Morning / Evening） | 固定置顶，按出现时间 | 用户设定时间出现 |
| **操作层** | Candidate 条目 + Agent 待确认任务 | 按创建时间倒序 | 标题 "⚡ 需要你处理"，分组折叠 |
| **时间流层** | Ready / Delivered / 已确认的日历+待办 | 按时间倒序 | 正常 Timeline 流 |

淡出规则：
- 已确认的待办/日历卡片 → 确认后 **24 小时** 自动从 Timeline 淡出（仍可在 Library 搜到）
- 记忆更新通知 → **不占 Timeline 位置**，改为 Memory Tab badge 提示（v1.5 改）
- 操作层清空后 → 分组标题自动隐藏

---

### 1.3 产物详情页

从 Timeline 点击条目进入。

**页面结构：**
1. **Header**：标题、来源类型、状态、时间
2. **Content**：
   - 转写全文（可折叠，默认折叠）
   - 结构化总结（默认展开）：summary / action items / decisions / follow-ups
   - **Markdown Live Preview**（无阅读/编辑切换）：光标点击即可编辑，类 Obsidian Live Preview，双端统一体验
   - Action Items 每条旁边加 "📅 Add to Calendar" 按钮（通过 EventKit 写入系统日历）
3. **Actions Bar**（底部固定）：
   - 投递（选择已安装的 Destination 插件）
   - 分享（系统 Share Sheet）
   - 复制文本
   - 删除

**编辑反馈信号：**
- 用户编辑保存后，生成反馈信号 → 写入 Pattern Mining L1
- 如果触发了显著 Pattern 更新，在 Timeline 推一条记忆更新通知

**记忆影响力展示（Memory Attribution）：**
- 产物详情页底部折叠区域：「📎 记忆参与」
- 展示本次生成实际使用了哪些记忆条目（如："你喜欢 action items 放最前面"）
- 每条可点击 → 跳转 Memory 对应条目
- Agent 生成内容时同理："✨ 这封邮件用了你的偏好「简洁直接」来生成"
- 核心价值：让用户看到记忆在起作用 → 更愿意维护记忆 → 产物质量更高的正循环

---

### 1.4 Agent（Tab 4 — 核心功能）

**Agent 是 Monostone 的核心功能**，拥有独立 Tab（Tab 4），类似 OpenClaw 的 Agent 体验。这是用户每天高频使用的界面，也是 BYOK / Max Plan 的主要变现入口。

**入口：**
- **Tab 4 "Agent"**（主入口，底部 Tab Bar）
- 产物详情页底部 "💬 Ask about this" → 跳转 Agent Tab，携带产物 context

**页面结构：**
- 完整对话界面，类似 iMessage / OpenClaw
- 顶部 Scope 选择器：全局 / 某个 active Project
- 顶部 Agent 设置按钮：Model 选择 / BYOK / Plan 管理
- 对话历史持久化，可回溯
- 支持文字输入 + 语音输入（利用戒指或手机麦克风）
- 支持 📎 附件引用 Timeline 条目

**上下文能力：**
- 自动注入近期产物 + 记忆作为 context
- 可手动引用某条 Timeline 条目作为 context（通过 📎 附件按钮）
- Project Scope 下自动加载 Project Memory

**能力范围（按 Plan 分层）：**

| 能力 | Free | Pro ($9.9/月) | Max ($29.9/月) |
|------|------|---------------|----------------|
| 基础对话 | ✅ 50次/天 | ✅ 无限 | ✅ 无限 |
| 录音总结 & Distill | ✅ 5次/天 | ✅ 无限 | ✅ 无限 |
| 邮件/任务生成 | ❌ | ✅ | ✅ |
| 高级推理（复杂任务） | ❌ | ❌ | ✅ |
| 自定义 Agent 指令 | ❌ | ❌ | ✅ |
| BYOK（自带 API Key） | ❌ | ✅ | ✅ |

**BYOK 模式：**
- 用户自带 API Key（OpenAI / Anthropic / Google / 自定义兼容端点）
- 使用用户自己的模型额度，Monostone 不收取 AI 调用费用
- BYOK 用户可使用任意模型（包括 o1-pro、Opus 等），不受 Plan 模型限制
- Monostone 只收取平台订阅费（Pro $9.9/月起）

**执行结果：**
- Agent 执行的所有结果同时作为 Timeline 卡片落盘
- 对话中可直接看到执行状态和结果
- Tool 调用过程实时展示（如"正在查询日历..."、"正在创建 Notion 页面..."）

---

### 1.5 Library（Tab 2）

**Library 是 iOS 的组织层**——Project 管理、文件夹、笔记、搜索都在这里。

**页面结构：**

```
┌─────────────────────────┐
│ [Search bar]         🎤 │
├─────────────────────────┤
│ 📌 Projects             │
│   Kickstarter Launch  3 │
│   Ring Hardware v3      │
│   融资                1 │
├─────────────────────────┤
│ 💡 Notes                │
│ 📁 Weekly Review        │
│ 📁 Reading List         │
├─────────────────────────┤
│ 📦 Archived          2  │
├─────────────────────────┤
│ + Create New            │
└─────────────────────────┘
```

**功能：**
- 顶部搜索框：输入后页面切换为搜索结果（自然语言 + 全文检索）
- 📌 Projects：活跃项目列表，点击 → Push 到 Project 详情页（Timeline 过滤 + Project Memory）
- 💡 Notes：用户手动创建的笔记
- 📁 自定义文件夹：用户创建的文件夹（整理产物）
- 📦 Archived：已归档 Project，默认折叠
- \+ Create New：创建新 Project / Note / Folder

**Project 管理交互（从 Memory Tab 迁移到 Library）：**
- 点击 Project → Project 详情页（过滤的 Timeline + Project Memory 视图）
- 长按 Project → 归档 / 重命名 / 删除
- \+ 按钮 → 手动创建新 Project（填写名称 + 可选描述）
- 系统自动发现新项目时，推送通知到 Timeline："发现了一个新项目：XX。要创建吗？"

**搜索能力：**
- 搜索范围：所有产物、转写文本、文件内容、记忆
- 结果列表按相关度排序，带类型标签（📄 产物 / 🧠 记忆 / 🤖 对话 / 🎙️ 录音）
- 点击结果 → 跳转到对应详情页
- 支持语音搜索

---

### 1.6 Search（原 Tab 3 → 合并到 Library）

搜索功能已合并到 Library Tab 的顶部搜索框。不再作为独立 Tab。

**搜索结果展示：**
- 标题 + 匹配片段高亮
- 来源类型 + 时间
- 点击直接进入详情

---

### 1.7 Memory（Tab 3）

**页面结构：**

> 记忆架构详见 `Memory-Architecture.md` v2.0（三域 × 四层）。
> Project 的创建/归档/管理操作已迁移到 Library Tab（§1.5），Memory Tab 专注记忆展示与编辑。

**v1.5 新增：Memory Snapshot + Segmented Control（S3/S5 修复）**

```
┌─────────────────────────────┐
│ 🧠 Memory Snapshot          │  ← 自然语言概览（双端一致）
│ "你是一位硬件创业者，正在做   │
│  Monostone 戒指。偏好简洁直  │
│  接的沟通风格，最近关注       │
│  Kickstarter 上线。"         │
├─────────────────────────────┤
│ [About Me] [Projects] [Agent]│  ← Segmented Control 切换三域
├─────────────────────────────┤
│ （当前域的记忆条目列表）       │
└─────────────────────────────┘
```

- **Memory Snapshot**（顶部）：系统自动生成的 2-4 句自然语言概览，帮用户快速理解"AI 记住了什么"。双端一致。
- **Segmented Control**：切换三个域，取代原来的折叠分组——减少嵌套深度，一屏聚焦一个域。双端一致。

三个域的内容（通过 Segmented Control 切换）：

- **About Me（关于我）**：identity / personality / beliefs / state / thoughts → 自然语言卡片
- **Projects（我的世界）**：按 project 分组，每个 project 下 people / facts / domain / tools / goals / priorities / intentions → 标签 + 关系描述
- **Agent（AI 偏好）**：voice / format / behavior / execution / failures → 偏好描述卡片

**iOS 端**：Memory 保持独立 Tab（Tab 3），不变。
**macOS 端**：Memory 改为左栏导航项（见 §2.0），不再抢占 Inspector 面板。（v1.5 改）

**每条记忆的操作：**
- **Reject**（左滑或点 ✕）：删除 + 标记为负反馈
- **Edit**（点击编辑）：修改描述文字
- **Pin**（长按或点 📌）：提高权重，不被衰减

**Project 管理（已迁移到 Library Tab §1.5，Memory 仅展示记忆条目）：**
- Projects 域在 Memory Tab 中仍可查看每个 project 的记忆条目
- 但 Project 的创建/归档/重命名操作 → Library Tab
- 系统自动发现新项目时，推送通知到 Timeline

**Project Memory（项目记忆）：**
- 每个 Project 有一份 Project.md，是索引式路由表，不是内容复制
- 结构：
  - **Key Context**：2-5 行高层摘要，系统自动提取
  - **Referenced Artifacts**：指向产物文件的索引，每条一句话描述，Agent 按需加载
  - **Conversation Memory**：用户在 Project scope 下与 Agent 对话产生的决策/结论
- iOS 端可查看和编辑 Project.md（点击 Project 名称 → 展开 Project Memory 视图）
- 用户编辑 = 最高置信度信号，系统不会覆盖用户修改

**记忆成熟度标识：**
- 每条记忆旁边显示置信度：🟢 确认 / 🟡 推测 / 🔴 冲突
- 🟡 推测的记忆会温和询问用户确认

**双模式管理：**
- **自动挡**：L1 写入和 L1→L2 整理全自动，用户不管也能用
- **手动挡**：L2→L3 晋升时推送通知（如「发现你连续 3 周改邮件语气为更简洁，确认这个偏好吗？」），可确认/拒绝/编辑

**学习摘要：**
- 当积累到一定量新记忆时，Memory Tab 显示 badge 提示（v1.5 改：不再在 Timeline 推卡片，避免信息过载）
- 进入 Memory 页面后，新增的记忆高亮展示
- macOS 端：左栏 Memory 导航项显示 badge 小红点

---

### 1.8 Profile & Settings（Timeline 左上角头像入口）

入口：**Timeline 左上角用户头像** → Push 进入

**不再是独立 Tab。** Profile & Settings 降级为 Push 页面，从 Timeline 顶部左侧头像进入。Tab 4 已让给 Agent。

**页面结构：**

1. **Profile 卡片**
   - 头像、用户名
   - 当前 plan、credits 余额
   - 升级入口

2. **戒指管理**
   - 连接状态、电量、固件版本
   - 蓝牙配对管理
   - 固件更新

3. **Integrations（日历连接 + Destination 管理）**
   - 📅 **日历连接**（EventKit）：
     - 显示当前系统日历账户列表（Apple Calendar 已同步的所有源）
     - 权限状态：已授权 / 未授权 → 引导到系统设置授权
     - 默认日历选择（新事件写入哪个日历）
     - 如果用户没有在系统日历添加 Google/Outlook 账号：引导"在系统设置中添加日历账户"
   - 🔗 **Destination 管理**：
     - 已连接的 Destination 列表（Notion / Obsidian / Email 等）
     - 每个 Destination：授权状态 + 配置 + 重新授权
     - P0 自带 3-5 个核心 Destination，不做插件市场页面

4. **隐私 & 数据**
   - 本地加密设置
   - 云同步状态
   - 数据导出
   - 删除账户

5. **高级**
   - 处理队列状态
   - 日志 & 诊断

---

## 2. macOS 端

macOS 拥有 iOS 的全部能力，以下只描述 **iOS 没有的额外能力**。

### 2.0 主窗口布局

两栏（默认）→ 三栏（Agent IM 展开时）：

```
默认两栏：
┌──────────────────┬──────────────────────────┐
│   左栏            │   右栏                    │
│  ┌────────────┐  │                          │
│  │ Timeline   │  │   Inspector              │
│  │ 列表       │  │   详情 & 操作面板         │
│  ├────────────┤  │                          │
│  │ 🧠 Memory  │  │  （v1.5 新增导航项）      │
│  ├────────────┤  │                          │
│  │ Projects   │  │                          │
│  │ + Archived │  │                          │
│  └────────────┘  │                          │
└──────────────────┴──────────────────────────┘

三栏（Agent IM 展开）：
┌────────────┬──────────────────┬──────────────┐
│   左栏      │   中栏            │   右栏        │
│  Timeline  │   Inspector      │   Agent IM   │
│  + 导航    │   详情面板        │   对话        │
└────────────┴──────────────────┴──────────────┘
```

**v1.5 新增：macOS Memory 导航（S5 修复）**

macOS 端 Memory 从 Inspector 面板改为左栏独立导航项：
- 点击左栏 "🧠 Memory" → 中栏（原 Inspector 区域）展示 Memory Snapshot + Segmented Control + 记忆列表
- 与 iOS Memory Tab 信息架构完全一致：同样的 Snapshot + Segmented Control + 三域切换
- 不再抢占 Inspector——选中 Timeline 条目时，Inspector 始终展示产物详情
- Memory 编辑与 Timeline 浏览可以同屏进行（左栏导航切换，不影响中栏其他操作）

顶部 Header：应用名 / 全局 Search / 状态图标（同步、戒指连接、队列） / Agent IM 开关按钮

---

### 2.1 插件系统

**macOS 独有的管理能力。iOS 只能开关，macOS 负责市场浏览、安装、配置。**

**插件类型：**

| 类型 | 职责 | 示例 |
|------|------|------|
| **Processor** | 输入条目 → 产出文件 | 转录增强、多语言总结 |
| **Renderer** | 接管某类产物在 Inspector 的渲染 | Digest 用更美的布局展示 |
| **Destination** | 投递到外部系统 | Notion / Calendar / 邮箱 / API |
| **Command** | 注册到 Search/Command 的命令 | "对选中内容执行某处理" |
| **Organizer** | 自动整理文件到目录 | 按项目归类产物 |
| **Agent Plugin** | 扩展 Agent 的能力 | 特定领域的 Agent 技能 |

**管理界面（Settings → Plugins）：**
- 插件市场（浏览 / 搜索 / 安装 / 更新）
- 已安装列表（启用 / 禁用 / 权限管理）
- 插件配置（每个插件自定义设置页）
- 安装 & 配置后自动同步到 iOS 端

---

### 2.2 文件系统集成

**本地路径结构：**
```
Mono/
├── Recordings/    原始音频文件（按月份）
├── Artifacts/     系统生成的产物（按月份）
├── Imports/       用户手动导入的文件（按月份）
├── Projects/      Project.md 文件（每个 Project 一份）
│   └── .archived/ 归档的 Project.md
└── Exports/       用户导出的文件
```

- Project 是逻辑容器（context 容器），不对应 Finder 文件夹
- 产物不因 Project 归入而移动物理位置
- Project.md 存在 `Mono/Projects/` 下，可用 Obsidian 等编辑器直接打开
- 目录与 Finder 完全同步
- App 内新建/重命名/移动 = Finder 操作
- Finder 改动 → App 文件监听自动更新
- UUID 内部主键，文件名可随意改不影响追踪

---

### 2.3 Inspector 深度面板

**比 iOS 详情页多出的部分：**

- **Learned from this** 折叠区：展示这条产物触发了哪些 Pattern 更新
  - 例："✨ 学到了：你更喜欢把 action items 放在最前面"
  - 可直接 ✕ 拒绝这条学习
- **Runs 区**：展示处理历史、插件运行状态、日志
- **关联文件**：展示相关的其他产物、原始文件链接
- **元数据**：文件路径、UUID、版本、来源 segment

---

### 2.4 Agent 深度模式

**macOS 的 Agent 是第三栏（核心功能），与 iOS Agent Tab 共享对话历史，但额外支持：**

- 允许高 token 消耗任务（复杂推理、coding、批量处理）
- 与当前选中条目联动（Inspector 里的内容作为 context）
- 执行结果落到 Timeline + 文件系统
- 基于 plan + credits 控制用量（BYOK 用户不受限制）
- Agent 设置入口同 iOS：Model 选择 / BYOK 配置 / Plan 管理

---

### 2.5 高级检索

**比 iOS 多出的能力：**

- 搜索 scope 可选全局或某个 Project
- 过滤器组合：按来源、时间、状态、Project、类型
- Intent Router 分层返回（文件 / 事件 / 模式）
- Search 结果直接在 Inspector 展示

---

### 2.6 Project System（左栏下半区）

**macOS 左栏下半区展示 Project 列表：**

```
┌─────────────────────┐
│ 📌 Projects          │
│   Kickstarter Launch │
│   技术架构           │
│   融资               │
│   + New Project      │
├─────────────────────┤
│ 📦 Archived          │  ← 默认折叠
│   竞品调研 2025      │
└─────────────────────┘
```

- **Project = context 容器**，不是文件夹，不对应 Finder 路径
- 一个产物可属于多个 Project
- 点击 Project → Timeline 过滤为该 Project 下的产物 + Inspector 默认显示 Project.md
- 右键 Project → Rename / Archive / Edit Description / Toggle Auto-collect / Delete
- 产物自动归入基于 LLM 语义判断（置信度 ≥0.8 自动确认 / 0.5-0.8 建议态 / <0.5 不归入）
- 详见 `Monostone-macOS-Features.md` §4 Project System

---

## 3. 双端同步规则

| 数据 | 同步方向 | 说明 |
|------|----------|------|
| 产物 & 文件 | 双向 | 两端看到的产物完全一致 |
| 记忆（Memory） | 双向 | 任一端编辑，另一端实时同步 |
| Agent 对话历史 | 双向 | 两端共享对话记录 |
| 日历事件 | 通过 EventKit 双向 | 两端都通过 EventKit 读写系统日历，系统日历本身负责跨设备同步（iCloud / Google / Exchange） |
| 插件安装 | macOS → iOS | macOS 安装，iOS 同步 |
| 插件开关 | 双向 | 任一端可开关 |
| 插件配置 | macOS → iOS | macOS 配置，iOS 只读 |
| Daily Digest | 双向 | 系统生成，两端同步展示 |
| 戒指连接 | 独立 | 各端独立蓝牙连接 |
| Project 筛选状态 | 独立 | 各端独立选择当前 Project 筛选，不同步 |

---

## 4. P0 交付边界（六月 Kickstarter）

### iOS 必须有：
- [ ] 戒指蓝牙连接 & 录音（含短录音自动创建日历事件）
- [ ] Timeline（录音产物 + 📅 日历事件草稿 + ✅ 待办 + Agent 卡片 + 状态机）
- [ ] Daily Digest + 待办（Morning Briefing 集成 EventKit 日历事件）
- [ ] 产物详情页（转写 + 总结 + Markdown Live Preview + "📅 Add to Calendar"）
- [ ] Library Tab（Projects + Notes + Folders + Search）
- [ ] 投递（P0 自带 3-5 个核心 Destination：Notion / Apple Calendar / Obsidian / Email）
- [ ] 分享（Share Sheet）
- [ ] Agent Tab（Tab 4，核心对话 + BYOK / Plan 管理 + 产物详情入口）
- [ ] Memory 展示 & 编辑
- [ ] Profile & Settings（Timeline 左上角头像入口 + Integrations）
- [ ] 日历集成（EventKit 读写，Onboarding 权限请求）

### macOS 必须有：
- [ ] iOS 全部能力的桌面版
- [ ] 两栏布局（Timeline + Inspector，Live Preview 无读/编切换）
- [ ] 文件系统集成
- [ ] 左栏：Notes + 自定义文件夹 + Create New
- [ ] Project System（CRUD、自动归入、Project Memory、Agent scope 选择）
- [ ] 日历集成（EventKit API + entitlements 声明）
- [ ] P0 自带核心 Destination（不做插件市场，V1.5 开放）
- [ ] Agent IM 第三栏

### 可以 P1 的：
- [ ] 第三方插件开放 & 插件市场（V1.5）
- [ ] 高级检索（智能视图 / facets）
- [ ] Agent 深度模式（高 token 任务）
- [ ] Organizer 自动整理
- [ ] Pattern 可导出 / 分场景 / 历史演变
- [ ] Project Memory 周级 Consolidate
- [ ] 系统自动建议创建 Project
- [ ] 跨项目深度关联发现
- [ ] P2：OAuth 对接 Google/Outlook 日历（针对不用系统日历的用户）

---

## 5. 日历集成技术方案

### 5.1 方案概述

**不自建日历 UI，保持 Calendar 作为 Integration（读+写）。**

通过 Apple EventKit API 读写系统日历。Apple Calendar 包含用户已同步的 Google / Outlook / Exchange 账号，一个 API 覆盖所有日历源，不需要用户在 Monostone 里再登一次。

### 5.2 平台权限

| 平台 | 权限要求 | 说明 |
|------|----------|------|
| iOS | `EKEventStore` Full Access（iOS 17+） | Onboarding Step 2 请求，用户可跳过 |
| macOS | entitlements 声明 `com.apple.security.personal-information.calendars` | App Sandbox 配置 |

### 5.3 读取能力

- 读取所有日历源的事件（iCloud / Google / Outlook / Exchange）
- 用于 Morning Briefing 的"今日日历事件"
- 用于短录音自动创建时的冲突检测
- Timeline 可 inline 显示今日日历事件作为时间锚点（轻量展示，不是完整日历 UI）

### 5.4 写入能力

- 从录音中提取的日程 → 写入用户选择的默认日历
- 短录音自动创建 → 静默写入
- 长录音提取的日程 → Candidate 状态，用户确认后写入
- 产物详情页 Action Items → "📅 Add to Calendar" 按钮写入

### 5.5 P2 降级路径

如果用户没有在系统日历中添加 Google / Outlook 账号（只用网页版日历），才走 OAuth 对接：
- Settings → Integrations → 日历连接 → "连接 Google Calendar" / "连接 Outlook"
- 通过 OAuth 2.0 获取授权，使用各自的 Calendar API
- 这是 P2 特性，P0 不实现

### 5.6 Settings 中的日历引导

Settings → Integrations → 📅 日历连接：
- 显示当前已授权的日历账户
- 如果权限未授权 → 引导到系统设置
- 如果没有外部日历账户 → 引导"在系统设置 → 日历账户中添加 Google / Outlook 账号"
- 默认日历选择（新创建的事件写入哪个日历）

---

## 6. 交互设计规范（v1.5 新增）

> 以下规范覆盖双端（iOS + macOS），确保一致的交互质量。源自首轮 UX 审计（S4/M1-M6）。

### 6.1 空状态规范（S4 / M1 修复）

**设计原则（双端一致）：**

每个空状态必须包含三要素：
1. **说明文字**：告诉用户"这里是什么"
2. **引导操作**：一个明确的 CTA 按钮
3. **下一步提示**：告诉用户接下来会发生什么

**所有需要空状态的页面：**

| 页面 | 说明文字 | 引导操作 | 下一步提示 |
|------|---------|---------|-----------|
| **Timeline（首次）** | "这是你的时间线。\n所有录音产物和日程都会出现在这里。" | "🎙️ 录一段试试" / "📄 导入文件" | "录完后，我会自动帮你整理。" |
| **Timeline（空 Candidate）** | "没有需要处理的内容 ✨" | — | "新录音会自动出现在这里。" |
| **Library（无 Project）** | "项目帮你组织不同主题的内容。" | "+ 创建第一个项目" | "系统也会自动发现你的项目。" |
| **Library（无 Notes）** | "快速记录想法，随时查阅。" | "+ 新建笔记" | — |
| **Memory（首次）** | "我还在学习了解你。\n用得越多，我越懂你。" | "🎙️ 先录一段" | "我会从你的录音中学习偏好和习惯。" |
| **Memory（某域为空）** | About Me: "还没有个人记忆"\nProjects: "还没有项目记忆"\nAgent: "还没有 AI 偏好" | "了解记忆如何工作 →" | "随着使用，这里会自动填充。" |
| **Agent IM（首次）** | "我是 Mono，你的 AI 助手。\n问我任何关于你的录音和项目的问题。" | 预设 3 个问题气泡 | — |
| **Project 详情（无产物）** | "这个项目还没有内容。" | "🎙️ 录一段关于这个项目的内容" | "相关录音会自动归入这里。" |
| **搜索无结果** | "没有找到「{query}」的结果。" | "试试其他关键词" / "问 Mono →" | — |
| **Digest（无数据）** | "还没有足够的数据生成 Digest。" | "🎙️ 先录几段内容" | "积累 3 条以上产物后，我会开始每日摘要。" |

**视觉规范：**
- 图标/插画：轻量线条图标，不要大面积插画（保持极简）
- 文字颜色：`secondaryLabel`（iOS / macOS 系统色）
- CTA 按钮：使用 `.borderedProminent` 风格（iOS）/ Primary Button（macOS）
- 位置：垂直居中偏上（视觉重心在黄金分割位置）

---

### 6.2 错误状态规范（M2 修复）

**设计原则（双端一致）：**

1. **说人话**：不展示技术错误码，用用户能理解的语言描述
2. **给出路**：每个错误必须有至少一个恢复操作
3. **保上下文**：错误不清空用户已输入的内容
4. **分级响应**：根据严重程度用不同视觉层级

**错误场景完整定义：**

| 场景 | 用户看到的文案 | 恢复操作 | 视觉层级 |
|------|--------------|---------|---------|
| **网络断开** | "网络连接断开，内容已保存在本地。" | "重试" / 自动重连 | 顶部 Banner（黄色） |
| **录音传输失败** | "录音上传失败，已保存在本地。" | "重新上传"（自动重试 3 次后展示） | 卡片内 inline 提示 |
| **AI 处理失败** | "处理遇到问题，请稍后重试。" | "重试" | 卡片状态变为 Failed |
| **日历写入失败** | "无法添加到日历。" | "检查日历权限" → 跳转系统设置 | Toast + 操作按钮 |
| **投递失败** | "投递到 {Destination} 失败。" | "重试" / "检查连接" | 卡片状态 + Toast |
| **AI 降级**（模型不可用） | "当前使用轻量模式，部分功能可能受限。" | 自动恢复后消失 | 顶部 Banner（蓝色，信息级） |
| **戒指断连** | "戒指连接断开。" | "重新连接" | 状态栏图标变灰 + Toast |
| **存储空间不足** | "存储空间不足，请清理后重试。" | "管理存储" → 跳转设置 | 全屏 Alert |
| **权限被拒** | "需要 {权限名} 才能使用此功能。" | "前往设置" → 跳转系统设置 | 页面内引导卡片 |

**视觉层级：**
- **Banner**（顶部横条）：全局影响，如网络断开、AI 降级
- **Toast**（底部浮层，3s 自动消失）：单次操作失败
- **Inline**（卡片内）：特定条目的状态
- **Alert**（模态弹窗）：需要用户立即决策，极少使用

---

### 6.3 加载状态规范（M3 修复）

**使用场景 + 时长阈值（双端一致）：**

| 加载类型 | 使用场景 | 时长阈值 | 说明 |
|---------|---------|---------|------|
| **Skeleton** | Timeline 列表加载、产物详情页加载、Memory 页加载 | 首次加载 >200ms | 灰色占位块模拟内容结构，让用户预知布局 |
| **Shimmer** | 卡片内容刷新、Digest 生成中、搜索结果加载 | 数据更新 >500ms | Skeleton 上叠加从左到右的光泽扫过动画 |
| **Spinner** | Distill 处理中、投递中、Agent 回复中 | 明确的用户操作触发 | 小型 spinner + 分阶段文案（见 §0 状态流转） |
| **不显示** | 页面间导航切换、本地数据读取 | <200ms | 低于感知阈值，不加任何加载指示 |

**规则：**
- **<200ms**：不显示任何加载状态（避免闪烁）
- **200ms - 2s**：Skeleton / Shimmer
- **>2s**：Spinner + 进度文案（告诉用户在做什么）
- **>10s**：增加取消选项 + "仍在处理中..."文案
- **>30s**：提供取消 + 后台继续选项

**Skeleton 规范：**
- 颜色：`systemGray6`（iOS）/ `NSColor.separatorColor`（macOS）
- 圆角：与实际内容一致
- 行高：模拟真实文字行高
- 数量：展示 3-5 个占位条目（不要太多）

---

### 6.4 手势 & 交互规范（M4 修复）

**iOS 手势规范：**

| 手势 | 位置 | 操作 | 说明 |
|------|------|------|------|
| **左滑** | Timeline 卡片 | 删除（红色）| 二次确认 via undo toast（3s） |
| **右滑** | Timeline Candidate 卡片 | ✨ Distill（蓝色）| 快速确认 |
| **左滑** | Memory 记忆条目 | 删除 + 负反馈 | 同 Reject 操作 |
| **长按** | Timeline 卡片 | Context Menu（分享/投递/归入项目/删除）| 系统标准 Context Menu |
| **长按** | Memory 记忆条目 | 📌 Pin | 提高权重 |
| **下拉** | Timeline 列表 | 刷新 | 标准 Pull-to-Refresh |
| **横滑** | 产物详情页 | 返回（系统手势）| 不自定义 |

**macOS 交互规范：**

| 交互 | 位置 | 操作 | 说明 |
|------|------|------|------|
| **Hover** | Timeline 卡片 | 显示操作按钮（✨ Distill / 投递 / 删除）| 悬停 200ms 后出现 |
| **右键** | Timeline 卡片 | Context Menu（完整操作列表）| 系统标准右键菜单 |
| **右键** | Project 列表项 | Rename / Archive / Delete | — |
| **双击** | Timeline 卡片 | 在 Inspector 展开详情 | — |
| **拖拽** | Timeline 卡片 → Project | 手动归入 Project | 拖拽视觉反馈 |

**macOS 快捷键：**

| 快捷键 | 操作 |
|--------|------|
| `⌘K` | 全局搜索 / Command Palette |
| `⌘N` | 新建笔记 |
| `⌘⇧N` | 新建 Project |
| `⌘Enter` | 对选中 Candidate 执行 ✨ Distill |
| `⌘D` | 投递选中产物 |
| `⌘⌫` | 删除选中条目（带 undo） |
| `⌘1/2/3` | 切换左栏导航（Timeline / Memory / Projects） |
| `⌘⇧A` | 打开/关闭 Agent IM 第三栏 |
| `Esc` | 关闭 Agent IM / 退出搜索 |

---

### 6.5 通知系统规范（M5 修复）

**通知分层（双端一致的优先级定义）：**

| 优先级 | 类型 | 示例 | 打断等级 |
|--------|------|------|---------|
| 🔴 **紧急** | 需要立即操作 | 戒指断连 + 正在录音、日历冲突需选择、存储空间严重不足 | 系统通知 + App 内 Alert |
| 🟡 **普通** | 有新内容可查看 | Distill 完成、Agent 任务完成、Daily Digest 就绪、新记忆学习 | 系统通知 + Badge |
| 🔵 **低优先级** | 信息性通知 | 系统自动发现新 Project、固件更新可用、周统计 | 仅 Badge / App 内展示 |

**免打扰时段：**
- 默认：23:00 — 08:00（用户可在 Settings 自定义）
- 免打扰期间：🔴 紧急通知仍然推送，🟡🔵 静默（App 内累积，解除免打扰后不补发系统通知）
- 跟随系统 Focus Mode（如果用户开启了系统专注模式，Monostone 遵守）

**双端差异：**

| 行为 | iOS | macOS |
|------|-----|-------|
| 系统通知 | `UNUserNotificationCenter`，标准 iOS 通知 | 原生 `NSUserNotification` / `UNUserNotificationCenter` |
| Badge | App 图标角标（未处理 Candidate 数量） | Dock 图标角标 + **菜单栏状态图标 badge**（小红点） |
| App 内通知 | Banner（顶部滑入 3s）| 右上角 Toast（3s）|
| 声音 | 系统默认通知音 | 系统默认通知音（可配置静音） |
| 震动 | 配合戒指 haptic（见 §6.6）| — |

**macOS 菜单栏状态图标：**
- 常驻菜单栏小图标（Mono logo）
- 有未处理内容时：加红色小圆点 badge
- 点击展开：快捷面板（最近 3 条未处理 + "打开 Monostone"）
- 录音中：图标变为红色录音指示

**通知跳转目标：**

| 通知类型 | 点击跳转到 |
|---------|-----------|
| Distill 完成 | 对应产物详情页 |
| Agent 任务完成 | Agent IM 对话 |
| Daily Digest | Digest 详情 |
| 戒指断连 | Settings → 戒指管理 |
| 新记忆学习 | Memory Tab 对应域 |
| 日历冲突 | Timeline 对应卡片 |

---

### 6.6 戒指触觉反馈规范（M6 修复）

**振动模式定义（双端一致——戒指硬件层面）：**

| 事件 | 振动模式 | 时长 | 说明 |
|------|---------|------|------|
| **录音开始** | 单次短振 | 50ms | 确认"我听到了，开始录音" |
| **录音结束** | 双次短振 | 50ms × 2（间隔 100ms） | 确认"录音结束" |
| **上传成功** | 单次轻振 | 30ms | 无声确认，不打断用户 |
| **上传失败** | 三次急促振 | 30ms × 3（间隔 50ms） | 提示需要注意 |
| **Distill 完成** | 单次柔和长振 | 150ms | "你的内容准备好了" |
| **蓝牙断连** | 两次长振 | 200ms × 2（间隔 200ms） | 警告级别 |
| **低电量（<10%）** | 单次长振 + 暂停 + 单次短振 | 200ms + 500ms + 50ms | 每 30 分钟提醒一次 |
| **充电开始** | 渐强振 | 100ms（从弱到强） | 确认充电连接 |
| **免打扰开启** | 无振动 | — | 遵守免打扰设定 |

**设计原则：**
- 所有振动模式可在 Settings → 戒指管理 → 触觉反馈 中单独开关
- "安静模式"一键关闭所有振动（仅保留录音开始/结束确认）
- 振动强度可调：轻 / 中 / 强（默认"中"）
- 不在免打扰时段内发送非紧急振动
