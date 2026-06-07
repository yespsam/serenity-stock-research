# Serenity Stock Research

一个免费的 Serenity 风格美股投研小工具。

公开站点：

https://serenity-stock-research.netlify.app

## 功能

- Serenity 喊过或高频研究过的美股/OTC 标的列表
- 真实价格、涨跌和公开市值数据
- 输入 ticker 后生成 Serenity 风格投研报告
- 供应链瓶颈、客户证据、TAM 重估、资本结构风险框架

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
