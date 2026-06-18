# Serenity Stock Research

一个 Serenity / AI 基建信号驱动的美股投研聚合工作台。

当前版本适合做垂直信号聚合、ticker 快速研究、主题榜、实时监控和复盘，不定位为全市场通用美股数据库。

公开站点：

https://serenity-stock-research.netlify.app

## 功能

- Serenity 喊过或高频研究过的美股/OTC 标的列表
- AI 基建、CPO / silicon photonics、NeoCloud、memory、资本结构风险等主题聚合
- 真实价格、涨跌和公开市值数据
- 输入 ticker 后生成 Serenity 风格投研报告
- 新手盈利模式：买前评分、仓位/止损计算、模拟盘复盘
- 买点等待系统：回踩、突破、止损提醒与每日新手交易日报
- 网页端实时监控 Serenity 新推文，并在 30 秒后生成可交易标的排序研究包
- 5 分钟复盘报告：回看首轮价格反应、主题扩散和反证信号
- PWA / Service Worker 通知通道、监控健康面板和自选 watchlist
- Telegram 监控脚本，可同步发送即时提醒和 30 秒研究包
- 供应链瓶颈、客户证据、TAM 重估、资本结构风险框架

## 产品口径

目前的数据足以支撑一个垂直 MVP：

- 信号源：Serenity 公开 X 内容、公开镜像站、第三方整理站、Supercycle 资产页和评论样本
- 结构化层：ticker、canonical symbol / alias、主题、情绪、materiality、提及频次、证据样本、历史表现候选
- 市场层：Yahoo Finance / Nasdaq 价格、市值、财务摘要、新闻和历史价格回测

暂不把它包装成泛化的全市场美股投研聚合器。要升级为通用聚合器，还需要补 SEC / 财报 / 电话会、新闻和研报、多 KOL / 多机构来源、实体归一、全文检索和数据质量审计。

产品与数据路线见：

```text
docs/research-aggregator-mvp.md
```

## 实时监控

网页端默认 1 秒轮询 `/api/serenity-live`，新推文出现后会在“实时监控”区域推送，并在 30 秒后展示研究包。

页面打开或最小化时可以通过浏览器通知和声音提醒命中 watchlist。完全关闭浏览器后的服务器 Push 已预留 Service Worker 入口，后续需要 VAPID 推送服务配合。

Telegram 监控配置见：

```text
docs/telegram-monitor.md
```

## 本地运行

```bash
npm start
```

然后打开：

```text
http://localhost:4180
```

## 构建公开静态包

```bash
npm run build
```

构建产物在 `netlify-dist/`。

## 数据说明

仓库只包含轻量公开数据 `data/serenity-public.json` 和 symbol 归一表 `data/symbol-aliases.json`。原始抓取档案和本地截图输出体积较大，保留在本地并通过 `.gitignore` 排除，未上传到 GitHub。

本项目仅用于公开资料整理和投研框架演示，不构成投资建议。
