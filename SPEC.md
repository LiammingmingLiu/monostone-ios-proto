# Monostone iOS — 页面地图 & 页面规格

> 本文档供前端工程师参考。定义 iOS App 的完整页面结构和每页规格。
> 配合 `Monostone-Dual-Platform-Features-v1.0.md` 阅读。

---

## 1. 语义地图

```
App
├── Onboarding（首次打开）
│   ├── 0. Welcome（品牌展示）
│   ├── 1. 注册 / 登录（Google / Apple / 邮箱）
│   ├── 2. 权限请求（蓝牙 + 麦克风 + 通知 + 日历，一次性）
│   ├── 3. 戒指配对（可跳过）
│   ├── 4. Memory 冷启动（对话式，3-4 轮）
│   └── 5. Ready（完成，进入主界面）
│
├── Tab 1: Timeline
│   ├── Timeline 列表页
│   ├── → 产物详情页
│   │   └── → 投递选择页（选择 Destination）
│   ├── → Daily Digest 详情页
│   ├── → Agent 任务卡片详情页
│   ├── → 📅 日历事件草稿卡片
│   └── → ✅ 待办事项卡片
│
├── Tab 2: Library
│   ├── Library 列表页（Projects + Notes + Folders + Search）
│   ├── → Project 详情页（过滤 Timeline + Project Memory）
│   ├── → 搜索结果页
│   └── → 产物详情页（复用 Timeline 的详情页）
│
├── Tab 3: Memory
│   └── 记忆总览页
│       └── → 记忆编辑页（inline 编辑或弹出编辑）
│
├── Tab 4: Me
│   ├── Profile 卡片 + 💬 Ask Mono 入口
│   ├── → Agent IM 对话页（全屏 Push）
│   │   └── → 执行结果预览（内联展开）
│   └── → Settings
│       ├── → 戒指管理页
│       │   └── → 配对引导页
│       ├── → Integrations（日历连接 + Destination 管理）
│       │   └── → Destination 详情页（授权状态 / 重新授权）
│       ├── → 账户 & 订阅页
│       │   └── → 升级 Plan 页
│       ├── → 隐私 & 数据页
│       └── → 高级 / 诊断页
│
全局覆盖层：
├── 录音中状态条（任何页面顶部浮动）
├── 戒指断连提示条（任何页面顶部浮动）
└── 💬 Agent 浮动按钮（全局，可选）
```

---

## 2. 页面规格

### 2.0 Onboarding 流程

**触发条件：** 新用户首次打开 App

**整体节奏：** 6 步，全程 2-3 分钟。前半段快速过（注册+权限+配对），后半段慢下来（Memory 冷启动是重头戏）。

---

#### Step 0: Welcome

**布局：** 全屏品牌页

- Monostone logo + 品牌动画（戒指轮廓 → 声波 → 文字涟漪）
- 一句话定位：**"Your second brain starts listening."**
- 底部按钮："Get Started"

**停留：** 用户点击后进入下一步

---

#### Step 1: 注册 / 登录

**布局：** 标准登录页

- **Continue with Apple**（推荐，最大按钮）
- **Continue with Google**
- 分割线 "or"
- **邮箱注册**（输入邮箱 → 验证码 → 设密码）
- 底部小字：已有账号？登录

**已有账号：** 登录后检测是否已完成 onboarding，已完成则直接进主界面。

---

#### Step 2: 权限请求

**布局：** 一屏说明 + 系统弹窗

页面先用一屏解释为什么需要这些权限，再依次触发系统弹窗：

**说明页内容：**
- 标题："Mono needs a few things to work"
- 四行，每行一个权限 + 一句话理由：
  - 🎙️ **麦克风** — "To hear what you record"
  - 📡 **蓝牙** — "To connect your ring"
  - 🔔 **通知** — "To keep you in the loop"
  - 📅 **日历** — "To see your schedule and add events"
- 底部按钮："Allow All"

**点击后：** 依次弹出系统权限对话框（Microphone → Bluetooth → Notifications → Calendar）。Calendar 使用 `EKEventStore` requestFullAccessToEvents（iOS 17+）。用户拒绝某项不阻断流程，后续使用时再引导。

---

#### Step 3: 戒指配对

**布局：** 配对引导页（可跳过）

**有戒指的用户：**
1. 动画：戒指发出蓝牙信号的示意
2. 提示："Put your ring on and bring it close"
3. 搜索中：扫描动画 + "Searching..."
4. 找到设备：显示设备名 → "Pair" 按钮
5. 配对成功：✅ 动画 + 戒指电量显示 + "Connected!"
6. 底部："Continue"

**没有戒指 / 想跳过：**
- 右上角 "Skip" 按钮
- 跳过后提示："You can pair your ring anytime in Settings"

---

#### Step 4: Memory 冷启动 —— "One Shot + Live Demo"

**这是 onboarding 的核心环节。** 目标不是"收集尽可能多的信息"，而是**让用户在 30 秒内亲眼看到"我给了一点东西，它立刻变成了对我有用的东西"**——第一次感受到复利。

**布局：** 上半屏为对话区，下半屏为实时反馈区（Memory 卡片 + Demo 产物）

**设计原则：**
- 只问一个问题，摩擦极低
- 即时展示 Memory 提取 + 模拟产物，让用户第一次看到自己的数据被用起来
- 诚实地标注"还不知道的"，不装作已经很了解用户
- 制造向前的动力——"这只是一句话的效果，想象一周后"

---

**问题（唯一一轮）：**

> 🤖 Mono: "Tell me something about yourself — anything. Your job, a project you're working on, a random thought. I'll show you what I do with it."

输入框 placeholder 轮播示例：
- *"I'm a founder building a hardware startup launching in June"*
- *"I manage a 12-person engineering team and I hate long meetings"*
- *"I'm a grad student writing my thesis on computational biology"*

右上角 "Skip" 可跳过。

---

**用户输入后，三件事同时发生（带动画依次展开）：**

**① 提取 Memory（上方浮现卡片）**

```
✨ Extracting...

About Me  → Founder, building a hardware startup
Projects  → Product launching on Kickstarter, June
           → Goal — successful crowdfunding campaign
Agent     → (not enough info yet — I'll learn this from your first recording)
```

关键细节：**最后一行明确标注"还不知道的维度"**，暗示系统需要更多数据，诚实且设定正确期望。

每张卡片带写入动画（从透明渐现 + 轻微上移），按维度依次出现，间隔 300ms。

**② 生成 Demo 产物（中部展开模拟卡片）**

> 🤖 Mono: "Here's what your morning briefing might look like:"

展示一张根据用户输入**个性化定制**的模拟 Morning Briefing 卡片：

```
☀️ Morning Briefing — [今天日期]

Based on what I know:
• You're building toward a June Kickstarter launch
• No meetings scheduled yet (connect your calendar to see them here)
• [Your first recording will appear here]

💡 The more you use your ring, the smarter this gets.
```

这是**复利的第一次可见化**——用户还没用产品，就已经看到自己的数据被用起来的样子。

**③ 钩子（底部）**

> 🤖 Mono: "That's just from one sentence. Imagine what I'll know after a week of recordings."

底部按钮："Let's go →"

---

**如果用户选择跳过：**

> 🤖 Mono: "No problem. I'll learn as we go. Your first recording is all I need to get started."

直接进入 Step 5，Memory 页面为空，第一次录音处理完后开始填充。冷启动不是必须的，但做了体验更好。

---

**技术说明：**
- 用户输入通过 NLP 提取 → 按三域分类写入 Memory L3（用户自述 = 高置信度，跳过 L1/L2）
- 域自动分类：About Me（identity / personality / beliefs）、Projects（facts / goals / people）、Agent（暂不写入，需从行为中学习）
- Demo Morning Briefing 是模拟卡片，基于提取结果 + 模板生成，不需要完整 pipeline
- 提取失败的域显示 "not enough info yet"，不伪造

---

#### Step 5: Ready

**布局：** 全屏完成页

- 标题："You're all set."
- 副标题："Mono will keep learning as you go."
- Memory 总览预览：展示刚才冷启动写入的所有 Memory 卡片（缩略版，可滚动）
- 底部按钮："Enter Mono" → 进入主界面（Timeline）

**彩蛋（可选）：**
- 如果用户在 Step 4 写了很多内容，Mono 额外说一句："You gave me a lot to work with. I'll put it to good use. 👻"

---

#### Onboarding 状态管理

- 完成标记存储在用户账号数据中（非本地），换设备登录不会重复 onboarding
- 中途退出 App：下次打开从中断步骤继续（不从头开始）
- Memory 冷启动的内容即使跳过也不影响后续使用，系统从 L1 自动积累

---

### 2.1 Timeline 列表页

**路径：** Tab 1 根页面

**布局：**
- 顶部：左侧用户头像（→ Me Tab）、中间 "Timeline" 标题、右侧戒指连接状态图标
- Project 筛选器：标题下方一行横滑 chips（"All" + 各 active Project 名称），选中后 Timeline 过滤为该 Project 的产物。默认 "All"（全量）。与 macOS 点击左栏 Project 过滤 Timeline 体验对齐。
- 今日日历事件时间锚点：Timeline 中 inline 显示今日日历事件（通过 EventKit 读取），作为时间锚点（轻量展示，不是完整日历 UI）
- 内容：垂直滚动列表，按时间倒序
- 无底部操作栏

**列表项结构（每条卡片）：**
- 左侧：来源类型图标 + emoji 状态标识（🎙️ 录音 / 📅 日程 / ✅ 待办 / 🤖 Agent / 📊 Digest / 📎 导入）
- 中部：主标题（语义标题或时间）+ 副文本（时长/字数）
- 卡片设计对齐 macOS（icon + emoji 状态，去掉 source 文字和 status 文字标签）
- Candidate 状态：行内显示"✨ Distill"按钮（v4 新增：按钮文案从"Process"改为"✨ Distill"，语义更明确——用户理解为"提炼精华"而非模糊的"处理"）
- Failed 状态：行内显示"重试"按钮

**Processing 状态分阶段反馈（v4 新增）：**
- 用户点击"✨ Distill"后，卡片进入 Processing 状态，行内显示分阶段文案：
  - `"Transcribing..."` → `"Summarizing..."` → `"Extracting action items..."`
- 卡片右侧显示预估时长提示：`"~30 seconds"`
- 处理完成时：iOS haptic feedback（`UIImpactFeedbackGenerator` medium），卡片状态平滑过渡为 Ready
- 处理超时（>60s）：文案变为 `"Taking longer than usual..."` + 保持可交互（不阻断其他操作）

**新增内容类型：**

| 类型 | 来源 | 示例 |
|------|------|------|
| 📅 日历事件草稿 | 长录音中提取的日程（Candidate 状态） | "周三 Eric 1:1 — 硬件进度"，需用户确认后写入日历 |
| ✅ 待办事项 | 录音中提取的任务 | 带 checkbox，可直接勾选完成 |
| 📅 日历确认卡片 | 短录音自动创建 | "已添加：周五 18:00 跟张三吃饭 📅"，可点击修改或删除 |

**Timeline 信息分层设计（v4 新增）：**

Timeline 列表按以下优先级分层展示，避免 8 种卡片类型混排导致信息密度失控：

| 层级 | 内容 | 视觉处理 |
|------|------|---------|
| **① 置顶** | Daily Digest（Morning / Evening） | 更大卡片 + 背景色，固定顶部 |
| **② 需要你处理** | Candidate 待确认 + Agent 待确认 + 日历草稿待确认 | 分组 banner `"🔔 Needs your attention"` + 浅黄底色，集中展示 |
| **③ 常规流** | Ready 产物 + 已确认待办/日历 + 记忆更新 + 其他 | 按时间倒序正常展示 |

- **"需要你处理"分组 banner**：当存在 ≥1 个待确认项时，在 Daily Digest 下方显示分组 banner，汇聚所有 Candidate + Agent 待确认卡片。用户逐个处理后 banner 自动消失
- **自动淡出**：已确认的待办卡片和日历确认卡片，确认后 24 小时自动从 Timeline 淡出（移入 Library，不删除）
- **记忆更新通知**：不再以卡片形式占据 Timeline，改用 **Toast / Banner**（顶部浮现 2s 自动消失，如 `"🧠 Learned: Eric 负责硬件量产"`），减少 Timeline 噪音

**Daily Digest 卡片（置顶）：**

Daily Digest 分为两张卡片，分别在早晚出现在 Timeline 顶部：

| 卡片 | 默认时间 | 内容 |
|------|----------|------|
| ☀️ **Morning Briefing** | 早上（用户设定） | 今日待办、日历事件、昨日未完成项 |
| 🌙 **Evening Recap** | 晚上（用户设定） | 今日总结、完成情况、关键产物回顾、明日预览 |

- 出现时间在 **Settings → 高级** 中配置
- 视觉上与普通卡片有区分（更大、带背景色）
- 内容预览：摘要前两行 + 待办数量
- 待办可直接在卡片内勾选

**交互：**
- 点击 → 进入对应详情页
- 下拉刷新
- 长按 → 快捷操作菜单（分享 / 删除 / 投递）
- 批量选择模式（右上角"选择"按钮）→ 批量确认处理 / 批量删除

---

### 2.2 产物详情页

**路径：** Timeline → 点击条目

**布局：**
- 顶部导航：返回 + 标题 + 更多操作（⋯）
- 内容区（滚动）：
  1. Header 区：标题、来源类型徽标、状态、时间
  2. 主体内容：Markdown Live Preview（默认就是可编辑的）
     - 所有内容底层存储为 Markdown（.md 文件）
     - 展示为富文本：标题有层级、列表有缩进、粗体斜体正常渲染、链接可点击
     - 光标点击即可编辑（无需切换编辑模式），类 Obsidian Live Preview，双端统一体验
     - 结构化总结默认展开（Summary / Action Items / Decisions / Follow-ups）
     - **Action Items 每条旁边加 "📅 Add to Calendar" 按钮**（通过 EventKit 写入系统日历）
     - 转写全文在 "查看原文" 折叠区
     - 编辑后自动保存
- 底部固定操作栏：投递 | 分享 | 复制 | 删除

**记忆影响力展示（Memory Attribution）：**
- 产物详情页底部增加一个折叠区域：「📎 记忆参与」
- 展示本次生成实际使用了哪些记忆条目，例如：
  ```
  📎 本次总结参考了 3 条你的记忆：
  · 你喜欢 action items 放最前面
  · Eric 是工程负责人
  · 周五有固定团队会
  ```
- 每条记忆可点击 → 跳转到 Memory Tab 对应条目
- Agent 生成内容时也显示，例如：「✨ 这封邮件用了你的偏好「简洁直接」来生成」
- 目的：让用户看到自己编辑/Pin 的记忆真的在影响产物质量，形成"记忆有用 → 更愿意维护记忆"的正循环

**Related Memories 快捷入口（v4 新增）：**
- Memory Attribution 上方增加横滑卡片区 `"🧠 Related Memories"`
- 展示与当前产物语义相关的记忆条目（不限于被引用的，也包括关联的）
- 每张小卡片：记忆文本（截断 1 行）+ 成熟度指示器（🟢🟡🔴）
- 点击 → 跳转 Memory Tab 对应条目
- 目的：从产物侧提供 Memory 入口，保持 Memory 可达性在所有关键页面一致（对齐 macOS Inspector 面板中 Memory 始终可见的体验）

**学习反馈展示（Learned from this）：**
- 产物详情页底部另一个折叠区域：「✨ 从这条内容学到的」
- 展示这条产物触发了哪些 Pattern 更新，例如：
  - "✨ 学到了：你更喜欢把 action items 放在最前面"
  - "✨ 学到了：Eric 负责硬件量产进度"
- 每条可点击 ✕ 拒绝这条学习
- 与 Memory Attribution 配合：一个展示"用了哪些记忆"，一个展示"学到了什么新东西"

**投递按钮：**
- 点击 → 弹出已安装的 Destination 插件列表
- 选择目的地 → 确认 → 状态变为 Delivering → Delivered

---

### 2.3 Daily Digest 详情页

**路径：** Timeline → 点击 Daily Digest 卡片

Daily Digest 有两种详情页，取决于点击的是 Morning Briefing 还是 Evening Recap。

**Morning Briefing 详情页：**
- 顶部导航：返回 + "☀️ 今日待办" + 日期
- 内容区（滚动）：
  1. 今日日历事件（时间线格式）—— **数据来源：通过 EventKit 读取系统日历**（包含 iCloud / Google / Outlook / Exchange 等用户已同步的所有日历账户）+ Monostone 从录音中提取并已确认的事件，合并展示
  2. 待办事项：checkbox 列表，可直接勾选完成
  3. 昨日未完成项（自动带入）
  4. 按 Project 分组的进展：每个 active Project 一个小区块，显示最新动态
  5. 天气 / 提醒（如果有相关插件）
- 底部固定操作栏：分享 | 复制

**Evening Recap 详情页：**
- 顶部导航：返回 + "🌙 今日总结" + 日期
- 内容区（滚动）：
  1. 今日摘要：基于当天所有录音和产物的自然语言总结
  2. 完成情况：待办完成率 + 未完成项
  3. 按 Project 汇总今日产物：每个 Project 下列出今日新增产物，点击跳转
  4. 明日预览：基于日历和待办的明日提醒
- 底部固定操作栏：分享 | 复制

---

### 2.4 Agent 任务卡片详情页

**路径：** Timeline → 点击 Agent 任务卡片

**布局：**
- 顶部导航：返回 + 任务标题
- 内容区：
  1. 任务描述：Agent 执行了什么
  2. 产物内容：生成的邮件草稿 / 日历事件 / 文本等（可编辑）
  3. 状态：待确认 / 已执行 / 已取消
- 底部固定操作栏：
  - 待确认状态：确认执行 | 编辑 | 取消
  - 已执行状态：查看投递结果 | 分享

---

### 2.5 Agent IM 对话页

**路径：** Me Tab → "💬 Ask Mono" 按钮（全屏 Push），或产物详情页 → "💬 Ask about this"，或全局浮动按钮

**Agent IM 不再是独立 Tab，而是增强层入口。** 用户不跟 Agent 聊天也能完成核心流程。

**布局：**
- 顶部：左侧返回按钮、中间 "Agent" 标题、右侧"新对话"按钮 + 对话历史入口
- 中部：对话气泡流（用户消息右侧，Agent 回复左侧）

**Project Scope 选择器：**
- 顶部标题区域增加 scope 切换：默认"全局" / 可选某个 active Project
- 选中 Project scope 后，Agent 自动加载该 Project Memory（Key Context + Referenced Artifacts 索引 + Conversation Memory）作为 context
- Agent 回复时优先使用 Project scope 内的信息
- 对话中产生的决策/结论自动写入该 Project 的 Conversation Memory

- 底部输入栏：文字输入框 + 语音输入按钮 + 发送按钮

**对话气泡类型：**
- 纯文本消息
- Agent 执行结果卡片（内联展示：标题 + 预览 + "查看详情"按钮 → 跳转产物详情页）
- Agent 请求确认卡片（"是否发送这封邮件？" + 确认/取消按钮）
- Agent 思考中状态（typing indicator）

**特殊交互：**
- 长按消息 → 复制 / 引用
- 引用 Timeline 条目：输入框左侧附件按钮 → 选择 Timeline 条目作为 context
- 对话历史持久化，可上滑加载更早的对话
- 语音输入：长按录音按钮，松开发送（同时支持戒指录入）

---

### 2.5b Library Tab 页面

**路径：** Tab 2 根页面

**Library 是 iOS 的组织层**——Project 管理、文件夹、笔记、搜索都在这里，解决了 iOS 端 Project 管理无处安放的问题。

**布局：**

```
┌─────────────────────────┐
│ [Search bar]         🎤 │
├─────────────────────────┤
│ 📌 Projects             │
│   Kickstarter Launch  3 │  ← badge = suggested 数量
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

**搜索（顶部）：**
- 搜索框，输入后页面切换为搜索结果
- 支持自然语言 + 全文检索 + 语音搜索
- 搜索范围：所有产物、转写文本、文件内容、记忆

**📌 Projects 区域：**
- 活跃项目列表，每行：项目名称 + suggested 产物数量 badge
- 点击 Project → Push 到 Project 详情页：
  - 上方：Project header（名称 + Key Context + 产物数 + suggested 数）
  - 下方：过滤的 Timeline（该 Project 的 confirmed + suggested 产物）
  - Project Memory 可查看/编辑
- 长按 Project → 操作菜单（重命名 / 归档 / 删除）

**💡 Notes & 📁 Folders 区域：**
- 用户手动创建的笔记和文件夹
- 点击 → Push 到内容详情 / 文件夹列表
- 长按 → 操作菜单（重命名 / 移动 / 删除）

**📦 Archived 区域：**
- 已归档 Project，默认折叠
- 点击展开列表，长按 → Unarchive / Delete

**+ Create New：**
- 底部统一入口 → 选择创建类型：
  - 📌 New Project（填写名称 + 可选描述）
  - 💡 New Note
  - 📁 New Folder

---

### 2.6 搜索页

**路径：** Library Tab（Tab 2）顶部搜索框

> 搜索已合并到 Library Tab，不再作为独立 Tab 3。

**布局：**
- 顶部：搜索输入框（自动聚焦）+ 语音搜索按钮
- 搜索前：显示最近搜索记录
- 搜索中：loading 状态
- 搜索后：结果列表

**结果列表项：**
- 类型标签（📄 产物 / 🧠 记忆 / 🤖 对话 / 🎙️ 录音）+ 标题 + 匹配片段（关键词高亮）
- 来源类型图标 + 时间
- 点击 → 跳转到对应详情页（产物详情 / Memory 条目 / Agent 对话）
- 顶部可按类型标签过滤结果

**MVP 搜索范围：** 产物 + 记忆。Agent 对话和原始录音搜索 V1.5 引入。

---

### 2.7 记忆总览页

**路径：** Tab 3 根页面

> 记忆架构详见 `Memory-Architecture.md` v2.0（三域 × 四层）。

**布局：**
- 顶部："What I Know About You" 标题

**Memory Snapshot（v4 新增）：**

标题下方显示 2-3 句自然语言总结，让用户一眼理解"AI 到底记住了我什么"：

```
┌─────────────────────────────────────────┐
│  🧠 Memory Snapshot                      │
│                                          │
│  "你是 Monostone 的创始人，正冲刺六月    │
│   Kickstarter 上线。你偏好简洁直接的      │
│   沟通风格，喜欢 action items 放最前面。" │
│                                          │
│  12 条记忆 · 最近更新 2 小时前            │
└─────────────────────────────────────────┘
```

- 每次打开 Memory Tab 时基于当前记忆条目自动生成
- 新用户首次到达时显示 `"还没有记忆，你的第一条录音会开始填充这里。"`

**三域 Segmented Control（v4 新增）：**

Snapshot 下方使用 **Segmented Control** 切换三个域，而非全部平铺：

```
┌─────────────────────────────────────────┐
│  [ About Me ]  [ Projects ]  [ Agent ]   │
└─────────────────────────────────────────┘
```

- 默认选中 "About Me"
- 切换无页面跳转，内容区平滑切换
- 每个域内的展示逻辑：
  - **默认展开**：需确认（🟡）+ 最近 7 天新增
  - **默认折叠**：已确认（🟢）的历史条目，显示折叠行 `"+ 8 条已确认记忆"`，点击展开
  - 这样减少首屏信息量，把用户注意力引导到需要操作的条目

**分组结构（以 About Me 域为例）：**

```
🟡 需确认
  ├── 🟡 喜欢先看结论再看推导              [✓ 确认] [✕]
  └── 🟡 最近在准备 Kickstarter            [✓ 确认] [✕]

🟢 已确认
  └── 🟢 创业者，Monostone 创始人          [📌] [✕]

+ 3 条更早的记忆                            [展开]
```

**Projects 域内按 Project 分组（保持不变）：**

```
▼ Monostone
  ├── 🟢 Eric — 工程负责人               [📌] [✕]
  └── 🟡 Kevin — 上周会议中提到          [📌] [✕]
▼ 融资
  └── 🟡 在考虑是否做 Android 版         [📌] [✕]
```

**Agent 域：**

```
  ├── 🟢 邮件偏好：简洁直接                [📌] [✕]
  ├── 🟢 目标：六月上 Kickstarter          [📌] [✕]
  └── 🟡 action items 放最前面             [📌] [✕]
```

**每条记忆交互：**
- 点击 → 进入编辑模式（inline 展开编辑区，修改文字后保存）
- 左滑 → Reject（删除 + 负反馈）
- 点击 📌 → Pin（提高权重）
- 点击 ✕ → Reject
- 🟡 推测的记忆：下方显示"这个对吗？"+ 确认/拒绝小按钮

**Project 管理交互（已迁移到 Library Tab §2.5b）：**
- Project 的创建/归档/重命名操作 → Library Tab
- Memory Tab 中 Projects 域仍可查看每个 project 的记忆条目
- 系统自动发现新项目时，推送通知到 Timeline
- 连续 8 周无新内容的 project，推送通知建议归档

**Project Memory 查看/编辑：**
- 点击 Project 名称 → 展开 Project Memory 视图（内联展开，不跳转新页面）
- 展示三个区块：
  - **Key Context**：2-5 行高层摘要（可编辑）
  - **Referenced Artifacts**：产物索引列表（点击跳转产物详情）
  - **Conversation Memory**：对话中的决策/结论（可编辑）
- 用户编辑后保存 → 回写 Memory Store，标记为高置信度
- 折叠收起后回到记忆条目列表视图

**双模式管理：**
- **自动挡**：L1 写入和 L1→L2 整理全自动，用户不管也能用
- **手动挡**：L2→L3 晋升时推送通知（如「发现你连续 3 周改邮件语气为更简洁，确认这个偏好吗？」），可确认/拒绝/编辑

---

### 2.8 Me Tab & Settings

**路径：** Tab 4 根页面

**布局：** 全屏页面

**结构：**

```
┌─────────────────────────────┐
│  头像  用户名                │
│  当前 Plan: Pro  Credits: 42 │
│  [升级]                      │
├─────────────────────────────┤
│  💬 Ask Mono             →   │  ← Agent IM 入口
├─────────────────────────────┤
│  🔗 戒指管理            →   │
│  📅 Integrations        →   │  ← 日历连接 + Destination 管理
│  🔒 隐私 & 数据         →   │
│  ⚙️ 高级               →   │
├─────────────────────────────┤
│  退出登录                    │
└─────────────────────────────┘
```

**Integrations 页面（替代原来的"插件管理"）：**

```
┌─────────────────────────────┐
│  📅 日历                     │
│    Apple Calendar     ✅ 已连接│
│    默认日历: 个人      [更改]  │
│    如未看到日历 → "在系统设置  │
│    中添加日历账户"            │
├─────────────────────────────┤
│  🔗 Destinations             │
│    Notion            ✅ 已连接│
│    Obsidian          ⚙️ 配置 │
│    Email             ✅ 已连接│
│    + 更多（P0 自带 3-5 个）   │
└─────────────────────────────┘
```

---

### 2.9 戒指管理页

**路径：** Settings → 戒指管理

**内容：**
- 连接状态（已连接 / 未连接）+ 蓝牙图标
- 戒指名称 / 型号
- 电量
- 固件版本 + 更新按钮（有新版本时高亮）
- 断开连接 / 重新配对
- 首次使用 → 进入配对引导页（分步引导）

---

### 2.10 Integrations 页

**路径：** Me Tab → Integrations

**布局：**

**📅 日历连接**（顶部分组）：
- 权限状态：已授权 / 未授权 → 未授权时显示"在系统设置中授权日历访问"
- 当前系统日历账户列表（iCloud / Google / Outlook / Exchange，由系统日历管理）
- 默认日历选择（新创建的事件写入哪个日历）
- 引导："如未看到外部日历 → 在系统设置 → 日历账户中添加 Google / Outlook 账号"

**🔗 Destination 管理**（下方分组）：
- 列表展示已连接的 Destination（P0 自带 3-5 个：Notion / Apple Calendar / Obsidian / Email）
- 每行：图标 + 名称 + 连接状态（✅ 已连接 / ⚙️ 需配置）
- 点击行 → 详情页（查看配置、授权状态、重新授权、Test Deliver）
- P0 不做插件市场——Destination 就几个，列在这里够了

---

### 2.11 录音中状态条

**路径：** 全局覆盖，录音进行中时显示在任何页面顶部

**布局：**
- 固定在顶部安全区下方，不遮挡导航
- 内容：红色圆点 + "正在录音" + 时长计时 + 录音类型（会议 / 口述）
- 点击 → 跳转到 Timeline（如果不在的话）
- 类似 iOS 通话中的绿色状态条

---

### 2.12 戒指断连提示条

**路径：** 全局覆盖，戒指断开连接时显示

**布局：**
- 黄色/橙色提示条
- 内容："戒指已断开连接" + "重新连接"按钮
- 可手动关闭

---

### 2.13 架构预留：Agent 记忆

> ⚠️ **MVP 阶段只做 L1 写入，不做晋升逻辑。但 `source` 字段和 `domain` 字段必须从第一天就落进数据模型。**

**背景：** 记忆系统 v2.0 拆为三域（About Me / Projects / Agent），其中 Agent 域的 execution / failures 维度本质上就是 agent 的执行记忆。数据模型中 `domain: "agent"` 天然覆盖了原来 `source: "system"` 的预留需求。

**MVP 实现范围：**
- `domain` 字段（me / project / agent）从第一天写入
- `project_id` 字段从第一天写入（仅 domain=project 时有值）
- Agent 域只做 L1 自动写入（记录执行结果、用户编辑信号）
- Agent 域的 L2→L4 晋升 → P1 再做

**详见：** `Memory-Architecture.md` v2.0 §4.3 和 §7。

---

### 2.14 空状态设计（v4 新增：S4 + M1）

> 空状态是新用户的第一印象。每个空状态都是一次"教用户下一步做什么"的机会。

**Timeline 空状态（新用户 / 无内容）：**
```
┌─────────────────────────────────────────┐
│                                          │
│           🎙️                             │
│    "Your timeline is waiting."           │
│                                          │
│    Record something with your ring       │
│    or ask Mono to help you get started.  │
│                                          │
│    [ 🎙️ Record Now ]  [ 💬 Ask Mono ]   │
│                                          │
└─────────────────────────────────────────┘
```
- 未配对戒指时隐藏 "Record Now"，改为 `"Pair your ring to start recording"`

**Library 空状态：**
```
┌─────────────────────────────────────────┐
│                                          │
│           📁                             │
│    "Nothing here yet."                   │
│                                          │
│    Projects and notes will appear here   │
│    as you use Mono.                      │
│                                          │
│    [ + Create a Project ]                │
│                                          │
└─────────────────────────────────────────┘
```

**Memory 空状态：**
```
┌─────────────────────────────────────────┐
│                                          │
│           🧠                             │
│    "I don't know you yet."               │
│                                          │
│    After your first recording, I'll      │
│    start building your memory here.      │
│                                          │
│    [ Tell me about yourself → ]          │
│    （跳转 Agent IM，触发冷启动对话）       │
│                                          │
└─────────────────────────────────────────┘
```

**Agent IM 空状态（无对话历史）：**
```
┌─────────────────────────────────────────┐
│                                          │
│           💬                             │
│    "Hey, I'm Mono."                      │
│                                          │
│    Ask me to draft an email, summarize   │
│    your day, or just brainstorm.         │
│                                          │
│    ┌──────────────────────────────────┐  │
│    │ Try: "Summarize today's meetings"│  │
│    │ Try: "Draft a follow-up email"   │  │
│    │ Try: "What did I decide about X?"│  │
│    └──────────────────────────────────┘  │
│    （点击示例直接填入输入框）               │
│                                          │
└─────────────────────────────────────────┘
```

**Project 详情页空状态（新建 Project，无产物）：**
```
┌─────────────────────────────────────────┐
│                                          │
│           📌                             │
│    "No artifacts yet."                   │
│                                          │
│    Recordings mentioning this project    │
│    will appear here automatically.       │
│                                          │
│    [ 🎙️ Record about this project ]     │
│                                          │
└─────────────────────────────────────────┘
```

**搜索无结果：**
```
┌─────────────────────────────────────────┐
│                                          │
│           🔍                             │
│    "No results for 'xxx'"                │
│                                          │
│    Try a different keyword, or ask Mono  │
│    to help you find what you're looking  │
│    for.                                  │
│                                          │
│    [ 💬 Ask Mono about this ]            │
│                                          │
└─────────────────────────────────────────┘
```

---

### 2.15 错误状态设计（v4 新增：M2）

> 错误不可避免。好的错误设计 = 告诉用户发生了什么 + 能做什么 + 不要慌。

**网络断开时的 Timeline 表现：**
- 顶部显示橙色提示条：`"📡 No connection — showing cached content"`
- Timeline 正常展示本地缓存内容（已下载的产物仍可查看/编辑）
- 新卡片不出现，下拉刷新显示 `"Can't refresh — check your connection"`
- 网络恢复后自动刷新 + 提示条消失

**录音传输失败：**
- Timeline 中对应卡片显示 ⚠️ 图标 + 文案 `"Upload failed"`
- 卡片内显示重试按钮：`"Retry Upload"`
- 副文本：`"Recording saved locally — it won't be lost"`（缓解用户焦虑）
- 自动重试策略：WiFi 恢复后自动重试，无需用户操作

**日历写入失败：**
- 日历确认卡片显示 ⚠️ + `"Couldn't add to calendar"`
- 展开显示原因提示：`"Calendar access may have been revoked"` 或 `"Calendar sync error"`
- 操作按钮：`"Retry"` | `"Open Settings"`（跳转系统日历权限）

**AI 处理降级（超时 / 失败）：**
- Processing 超过 60s：文案变为 `"Taking longer than usual..."`，不阻断 UI
- Processing 超过 120s：显示降级通知 `"⚠️ Processing is taking too long. We'll notify you when it's done."`，用户可离开页面
- Processing 失败：卡片显示 `"Processing failed"` + `"Retry"` 按钮 + 副文本 `"Your recording is safe — you can try again anytime"`
- 部分成功（转写成功但摘要失败）：展示已完成部分 + 标注 `"Summary unavailable — tap to retry"`

---

### 2.16 加载状态规范（v4 新增：M3）

> 原则：让用户感知到"正在发生的事"，但不阻断操作。

**加载模式选择标准：**

| 时长阈值 | 加载模式 | 使用场景 |
|---------|---------|---------|
| < 1s | 无指示 | 切换 Tab、本地操作 |
| 1s - 3s | **Spinner**（小型圆形旋转） | 确认操作、删除、Pin 记忆、投递 |
| > 3s | **Skeleton + 文案** | 页面首次加载、长列表、详情页 |

**具体场景：**

| 页面 / 操作 | 加载模式 | 细节 |
|-------------|---------|------|
| Timeline 列表加载 | **Skeleton** | 3-5 个占位卡片，灰色矩形块模拟卡片结构 |
| 产物详情页加载 | **Shimmer** | Header 区 Skeleton + 内容区 Shimmer（从左到右流光扫过），暗示"内容正在填充" |
| 确认 / 删除 / Pin | **Spinner** | 按钮内置 Spinner 替换文字，操作完成后恢复 |
| Agent IM 回复 | **Typing indicator** | 三个跳动圆点（已有），>5s 加文案 `"Thinking..."` |
| 搜索 | **Spinner → Skeleton** | 输入后 Spinner，结果加载中 Skeleton |
| Daily Digest 生成 | **Shimmer + 文案** | `"Preparing your briefing..."` |

---

### 2.17 手势交互规范（v4 新增：M4）

> 手势是 iOS 的核心交互语言，但必须可发现。所有手势操作都有等价的长按菜单选项。

**Timeline 卡片：**
- **左滑** → 显示操作按钮：🗑️ 删除（红色）/ 📦 归档（灰色）
- **右滑** → 标为已处理（绿色 ✓），卡片向右滑出 + haptic feedback
- **长按** → 快捷操作菜单（已有：分享 / 删除 / 投递）

**产物详情页：**
- **Swipe back**（从左边缘右滑）→ 返回 Timeline / Library（iOS 标准交互）
- **捏合缩放** → 调整文字大小（可选，V1.5）

**Memory 条目：**
- **左滑** → 🗑️ 删除 / ✕ 拒绝（红色），弹出二次确认 toast `"Memory removed"` + Undo 按钮（3s 超时）
- **点击** → 内联展开编辑（已有）
- **长按** → 操作菜单（Pin / Reject / 查看来源产物）

**Agent IM 消息：**
- **长按** → 复制 / 引用（已有）
- **左滑回复** → 引用该消息回复（iOS 标准 IM 交互）

---

### 2.18 通知系统设计（v4 新增：M5）

> 通知是特权——滥用则被用户关闭。分层 + 控频 + 尊重免打扰。

**通知优先级分层：**

| 优先级 | 场景 | 通知方式 | 跳转目标 |
|--------|------|---------|---------|
| 🔴 **紧急** | 录音处理完成 · 日程冲突检测 · Agent 任务需确认 | **系统推送通知 + App Badge** | 对应产物详情 / Agent 确认卡片 |
| 🟡 **普通** | Daily Digest 就绪 · 记忆更新 · Project 新产物 | **App Badge only** | Timeline / Memory Tab |
| 🟢 **低优先级** | Weekly Report · 系统更新 · 使用 tips | **下次打开 App 时 In-App 展示** | 对应页面 |

**频率控制：**
- 同类通知合并：5 分钟内多条录音处理完成 → 合并为一条 `"3 recordings ready"`
- 每日系统通知上限：15 条（超出后合并为摘要通知）
- 用户可在 Settings → 通知 中按类别开关

**免打扰时段（v4 新增）：**
- 默认静默时段：**22:00 - 08:00**（本地时间）
- 静默期间所有通知暂存，次日早上与 Morning Briefing 一起释放
- 用户可自定义时段或关闭
- 例外：戒指断连告警不受免打扰限制（涉及设备安全）

---

### 2.19 戒指触觉反馈规范（v4 新增：M6）

> 戒指是无屏设备，触觉反馈是唯一的实时通信通道。必须简洁、可辨别、不打扰。

**触觉反馈模式定义：**

| 事件 | 振动模式 | 描述 |
|------|---------|------|
| 录音开始 | 短振 × 1 | 单次轻振（~100ms），确认"我开始听了" |
| 录音结束 | 短振 × 2 | 两次轻振（~100ms，间隔 200ms），确认"我停了" |
| 上传确认 | 长振 × 1 | 单次长振（~300ms），确认"已安全上传" |
| 断连警告 | 连续短振 × 3 | 三次急促振动（~80ms，间隔 100ms），提醒"连接断了" |
| 低电量（<10%） | 慢振 × 2 | 两次慢振（~400ms，间隔 500ms），柔和提醒 |

**设计原则：**
- **可辨别**：每种事件的振动模式节奏不同，用户戴几天后能凭感觉区分
- **不打扰**：最强振动（断连警告）也只有 3 次，不会持续骚扰
- **可关闭**：Settings → 戒指管理 → 触觉反馈开关（默认开启）
- **省电**：触觉马达单次功耗极低，不显著影响续航

---

### 2.20 改进项（v4 新增：I1 / I4 / I6）

**I1：Library Tab 顶部 Recents 横滑区**

在 Library 列表页搜索框下方、Projects 区域上方，新增 Recents 横滑区：

```
┌─────────────────────────────────────────┐
│ [Search bar]                         🎤 │
├─────────────────────────────────────────┤
│ 🕐 Recents                              │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ │周三 │ │Eric│ │产品│ │融资│ │... │ →  │
│ │1:1  │ │邮件│ │规格│ │备忘│ │    │    │
│ └────┘ └────┘ └────┘ └────┘ └────┘    │
├─────────────────────────────────────────┤
│ 📌 Projects                             │
│   ...                                    │
```

- 最近打开/编辑的 5-8 个产物，横滑展示
- 每个缩略卡片：类型图标 + 标题（截断 2 行）+ 时间
- 点击 → 跳转产物详情页
- 无历史时不显示此区域

**I4：短录音日历创建的渐进信任期**

短录音自动创建日历事件的确认策略改为渐进信任模型：

| 阶段 | 条件 | 行为 |
|------|------|------|
| 学习期 | 前 10 次短录音日历创建 | 弹出确认卡片 `"Add to calendar?"` + 预填信息，用户必须确认 |
| 信任期 | 第 11 次起 | 静默创建 + 系统通知 `"📅 Added: 周五 18:00 跟张三吃饭"` + Timeline 确认卡片（可修改/删除） |

- 用户任何一次在信任期拒绝 → 回退到学习期重新计数
- 信任期计数存储在用户数据中，跨设备同步
- 在 Settings → 高级 中可手动切换"总是确认 / 自动创建"

**I6：Onboarding Live Demo skeleton + timeout 降级**

Step 4 Memory 冷启动的 Live Demo 环节增加 LLM 延迟保护：

- 用户输入后立即显示 **Skeleton 占位卡片**（Memory 卡片 + Demo Briefing 卡片的灰色骨架）
- Skeleton → 实际内容：依次填充动画（每张卡片 300ms 间隔，已有）
- **超时降级策略**：
  - 5s 内无响应：显示 `"Thinking..."` + 保持 Skeleton
  - 10s 内无响应：显示 `"Almost there..."` + 进度条（不确定进度，左右摆动）
  - 15s 超时：降级为预设模板 Demo + 提示 `"I'll finish processing in the background — let's get you started!"` → 自动进入 Step 5
- 降级后 Memory 提取在后台继续，完成后静默写入，不阻断 onboarding

---

## 3. 页面总数

| 序号 | 页面 | 类型 |
|------|------|------|
| 1 | Welcome（品牌页） | Onboarding |
| 2 | 注册 / 登录 | Onboarding |
| 3 | 权限请求说明页（含日历权限） | Onboarding |
| 4 | 戒指配对引导页 | Onboarding |
| 5 | Memory 冷启动（对话式） | Onboarding |
| 6 | Ready（完成页） | Onboarding |
| 7 | Timeline 列表页 | Tab 1 根页面 |
| 8 | 产物详情页 | Push 页面 |
| 9 | Daily Digest 详情页 | Push 页面 |
| 10 | Agent 任务卡片详情页 | Push 页面 |
| 11 | Library 列表页 | Tab 2 根页面 |
| 12 | Project 详情页 | Push 页面 |
| 13 | 记忆总览页 | Tab 3 根页面 |
| 14 | Me Tab 页 | Tab 4 根页面 |
| 15 | Agent IM 对话页 | Push 页面（全屏） |
| 16 | 戒指管理页 | Push 页面 |
| 17 | 配对引导页（Settings 入口） | Modal 流程 |
| 18 | Integrations 页（日历连接 + Destination） | Push 页面 |
| 19 | Destination 详情页 | Push 页面 |
| 20 | 账户 & 订阅页 | Push 页面 |
| 21 | 升级 Plan 页 | Modal 页面 |
| 22 | 隐私 & 数据页 | Push 页面 |
| 23 | 高级 / 诊断页 | Push 页面 |
| 24 | 投递选择页 | Bottom Sheet |
| — | 录音中状态条 | 全局覆盖层 |
| — | 戒指断连提示条 | 全局覆盖层 |
| — | 💬 Agent 浮动按钮 | 全局覆盖层 |

**共 24 个页面 + 3 个全局覆盖层。**

> v4 新增 §2.14-2.20 为设计规范章节（空状态 / 错误状态 / 加载状态 / 手势交互 / 通知系统 / 戒指触觉反馈 / 改进项），不新增页面，是对已有页面的交互定义补全。
