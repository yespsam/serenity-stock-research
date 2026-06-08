# Serenity Stock Research

一个免费的 Serenity 风格美股投研小工具。

公开站点：

https://serenity-stock-research.netlify.app

## 功能

- Serenity 喊过或高频研究过的美股/OTC 标的列表
- 真实价格、涨跌和公开市值数据
- 输入 ticker 后生成 Serenity 风格投研报告
- 新手盈利模式：买前评分、仓位/止损计算、模拟盘复盘
- 买点等待系统：回踩、突破、止损提醒与每日新手交易日报
- 网页端实时监控 Serenity 新推文，并在 30 秒后生成可交易标的排序研究包
- 5 分钟复盘报告：回看首轮价格反应、主题扩散和反证信号
- PWA / Service Worker 通知通道、监控健康面板和自选 watchlist
- Telegram 监控脚本，可同步发送即时提醒和 30 秒研究包
- 供应链瓶颈、客户证据、TAM 重估、资本结构风险框架

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

仓库只包含轻量公开数据 `data/serenity-public.json`。原始抓取档案和本地截图输出体积较大，未上传到 GitHub。

本项目仅用于公开资料整理和投研框架演示，不构成投资建议。
