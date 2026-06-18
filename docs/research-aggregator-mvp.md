# AI 基建美股信号聚合器 MVP

## 结论

当前数据可以支撑一个垂直投研聚合器 MVP，核心定位是：

> Serenity / AI infrastructure 信号驱动的美股研究工作台。

它不适合直接包装成全市场通用美股投研聚合器。现有优势在主题深度、实时监控、观点抽取和价格验证；短板在全市场覆盖、多源交叉验证、财报和公告数据、标准化实体库。

## 当前数据底座

本地原始层：

- `data/serenity-tweets.json`：6763 条合并公开 items，5088 条带 ticker，1266 个唯一 symbol，51400 条评论样本。
- `data/serenity-distillation.json`：主题、ticker、情绪、materiality、source breakdown 和规则沉淀。
- `data/serenity-fxtwitter-archive.json`：FxTwitter 时间线、含回复、日期切片和搜索归档。
- `data/serenity-research.json`：方法论、核心 calls 和样本推文。

公开前端层：

- `data/serenity-public.json`：220 个 symbol、63 条精选证据、18 条历史表现候选。
- `data/symbol-aliases.json`：canonical symbol、行情 symbol、跨市场后缀和常见别名映射。
- `/api/quotes`：Yahoo Finance / Nasdaq 价格、市值、财务摘要、新闻补全。
- `/api/performance`：按信号日期做 7 / 30 / 90 天表现回看。
- `/api/serenity-live`：实时抓取 Serenity 最新公开状态。

## 能支撑的用户价值

1. 主题雷达

   展示 AI 基建、CPO / silicon photonics、NeoCloud、memory、机器人、电力、资本结构风险等主题热度。

2. Ticker 研究页

   对单个 ticker 汇总 Serenity 证据、情绪、主题归因、价格、市值、新闻、风险和反证清单。

3. 实时信号台

   监听新推文，抽取 ticker 和主题，30 秒后生成可交易排序包。

4. 复盘层

   对历史信号做首日、7 天、30 天、90 天表现回看，区分 thesis 正确、入场过热和资本结构否决。

5. 新手执行层

   用仓位、止损、买点等待、watchlist 和日报把研究信号转成低冲动交易流程。

## 不应承诺的能力

- 不承诺覆盖全部美股。
- 不承诺替代 SEC 文件、财报电话会、公司公告和一手订单验证。
- 不承诺 Serenity 观点一定正确。
- 不承诺价格、新闻和财务摘要来自付费级行情源。
- 不承诺所有 ticker 已完成同股不同所、ADR、OTC、欧洲后缀和别名归一。

## 升级到通用聚合器需要补的数据

1. 公司实体库

   建立 `canonical_symbol`、交易所、CIK、ISIN、CUSIP、Yahoo symbol、Nasdaq symbol、别名和地区后缀映射。

2. SEC / 财报层

   接入 10-K、10-Q、8-K、S-3、424B、earnings transcript、investor presentation，抽取收入、毛利、订单、客户、债务、稀释和风险因素。

3. 新闻和研报层

   接入公司新闻、行业新闻、卖方目标价、评级变化、重大订单和供应链新闻，并与 ticker 归因。

4. 多源观点层

   Serenity 之外增加更多 KOL、行业专家、机构笔记、Reddit / X / YouTube / podcast 摘要，做一致性和分歧度。

5. 检索与审计层

   把原始 JSON 转成 SQLite / Postgres / DuckDB，支持全文检索、source lineage、增量更新、失败重试和重复检测。

## 建议路线

### 第 1 阶段：垂直 MVP

- 固定产品名和口径：AI 基建美股信号聚合器。
- 强化 ticker 页：证据、价格、主题、风险、反证、历史表现放在同一页。
- 给每条结论保留 source URL 和信号日期。
- 添加数据健康面板：最新抓取时间、items 数、comments 数、失败源、最新 ticker。

### 第 2 阶段：可靠研究层

- 扩展 ticker alias / canonical symbol 表，补 CIK、ISIN、交易所、ADR / OTC / 本地市场关系。
- 把 JSON 归档导入 SQLite 或 DuckDB。
- 加入 SEC 公司公告和财报摘要。
- 给每个 ticker 生成 thesis / evidence / risk / catalyst / invalidation 五段式结构。

### 第 3 阶段：泛化聚合器

- 增加多 KOL / 多媒体源。
- 增加新闻、研报、电话会和估值指标。
- 增加跨来源一致性评分。
- 增加用户自定义 watchlist、主题订阅和日报。

## 推荐对外描述

短版：

> 一个 Serenity / AI 基建信号驱动的美股投研工作台，帮助你把公开观点、主题热度、ticker 证据、实时推文和价格复盘聚合到一个页面。

长版：

> Serenity Stock Research 聚合 Serenity 公开内容、第三方镜像、主题 tracker、评论样本和市场数据，围绕 AI infrastructure、CPO、silicon photonics、NeoCloud、memory 和资本结构风险生成 ticker 级研究框架。它用于辅助公开资料整理、信号监控和复盘，不构成投资建议，也不替代公告、财报和个人风险评估。
