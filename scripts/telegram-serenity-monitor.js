#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DATA = path.join(ROOT, "data", "serenity-public.json");
const DEFAULT_STATE_FILE = path.join(ROOT, "data", "telegram-monitor-state.json");
const FX_URL = "https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses";
const DEFAULT_QUOTE_BASE = process.env.SERENITY_TG_QUOTE_BASE || "https://serenity-stock-research.netlify.app";
const POLL_MS = Math.max(1000, Number(process.env.SERENITY_TG_POLL_MS || 1000));
const DELAY_MS = Math.max(1000, Number(process.env.SERENITY_TG_DELAY_MS || 30_000));
const STATE_FILE = process.env.SERENITY_TG_STATE_FILE || DEFAULT_STATE_FILE;
const DRY_RUN = process.argv.includes("--dry-run") || process.env.SERENITY_TG_DRY_RUN === "1";
const ONCE = process.argv.includes("--once");
const TEST = process.argv.includes("--test");
const ALERT_ON_START = process.env.SERENITY_TG_ALERT_ON_START === "1";
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const THREAD_ID = process.env.TELEGRAM_THREAD_ID || "";

const TICKER_STOPLIST = new Set(["AI", "API", "ATH", "CEO", "CFO", "CPO", "CPU", "GPU", "IPO", "ROI", "SEC", "TAM", "USD"]);
const CRYPTO_SYMBOLS = new Set(["BTC", "ETH", "SOL", "DOGE", "XRP"]);
const WATCHLIST_THESES = {
  SIVEF: "CPO 连续波激光瓶颈，小市值高赔率，但注意 OTC/流动性。",
  AAOI: "光模块/ELSFP/CPO 高弹性表达，核心看 hyperscaler 订单和产能爬坡。",
  AXTI: "InP 衬底上游材料，冷门瓶颈但周期和融资风险更高。",
  LITE: "激光器/光通信大盘表达，稳健但赔率低于小盘上游。",
  MRVL: "AI ASIC、CPO 和高速互连生态锚点，偏确定性。",
  AEHR: "硅光测试和可靠性验证，订单连续性是核心。",
  NBIS: "NeoCloud/数据中心/算力云，重点看合同质量和融资路径。",
  IREN: "NeoCloud 反例，资本结构和 ATM 稀释优先一票否决。",
  COHR: "光器件/激光/材料链大盘稳健表达。",
  NVDA: "AI 需求锚点，Serenity 框架里不是最高赔率小节点。",
  MSFT: "hyperscaler capex 需求锚点，alpha 往供应链外溢。",
  AMZN: "AWS ASIC 和数据中心需求锚点。",
  META: "AI capex 需求锚点，重点看支出节奏。",
  MU: "HBM/Memory 周期表达，注意周期尾部。",
  TSM: "先进制程/封装需求锚点，地缘和大市值压低赔率。",
  CIFR: "电力资产转 AI 数据中心，高 beta 高融资风险。",
  HOOD: "交易量/retail/crypto 周期表达。",
  CRWV: "NeoCloud 对照组，capex、客户集中和折旧是核心。",
  AVGO: "AI ASIC/网络龙头，需求强但估值拥挤。",
  AMD: "GPU/CPO 需求外溢锚点。",
  JBL: "1.6T 制造和客户证据链。",
  POET: "光互连小市值技术节点，商业化和融资是关键。",
  ALAB: "高速互连/AI 服务器连接层，高估值高弹性。",
  RKLB: "Space 长期期权型主题。",
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function nowIso() {
  return new Date().toISOString();
}

function log(...args) {
  console.log(`[${nowIso()}]`, ...args);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeSymbol(value = "") {
  return String(value || "").trim().replace(/^\$+/, "").toUpperCase();
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function extractSymbols(text = "") {
  const cashtags = [...String(text || "").matchAll(/\$+\s*([A-Z][A-Z0-9.]{1,8})/g)]
    .map((match) => normalizeSymbol(match[1]).replace(/\.+$/, ""))
    .filter((symbol) => symbol && !TICKER_STOPLIST.has(symbol) && !CRYPTO_SYMBOLS.has(symbol));
  return unique(cashtags);
}

function isTradableCandidate(symbol = "") {
  const normalized = normalizeSymbol(symbol);
  if (!normalized || CRYPTO_SYMBOLS.has(normalized)) return false;
  if (/^\d/.test(normalized)) return false;
  if (/[.](TW|HK|SS|SZ|KS|T|L|PA|DE|ST)$/i.test(normalized)) return false;
  return /^[A-Z][A-Z0-9.]{1,8}$/.test(normalized);
}

function inferSentiment(text = "") {
  const lower = String(text || "").toLowerCase();
  if (/bear|short|avoid|sell|reduce|risk|dilution|atm|debt|convertible|稀释|融资|债务|风险|做空|卖出/.test(lower)) return "bear";
  if (/long|bull|buy|accumulate|winner|upside|conviction|undervalued|看多|买入|加仓|低估|高确信/.test(lower)) return "bull";
  return "neutral";
}

function classifyTheme(text = "") {
  const lower = String(text || "").toLowerCase();
  if (/atm|dilution|convertible|debt|稀释|融资|债务|资本结构/.test(lower)) return "capital-structure-veto";
  if (/cpo|co-packaged|silicon photonics|siph|photonics|laser|optical|transceiver|光子|硅光|激光|光模块|光互连/.test(lower)) {
    return "cpo-silicon-photonics";
  }
  if (/neocloud|gpu cloud|datacenter|power|算力|数据中心|电力/.test(lower)) return "neocloud";
  if (/hbm|memory|dram|nand|记忆体|存储/.test(lower)) return "memory-rotation";
  if (/hyperscaler|asic|gpu|ai capex|networking|ai infra|ai 基建/.test(lower)) return "ai-infrastructure";
  return "general";
}

function normalizeStatus(status = {}) {
  const text = status.text || status.raw_text?.text || "";
  const facetSymbols = (status.raw_text?.facets || [])
    .filter((facet) => facet.type === "symbol")
    .map((facet) => facet.original || "")
    .map(normalizeSymbol);
  const symbols = unique([...facetSymbols, ...extractSymbols(text)]);
  return {
    id: String(status.id || ""),
    date: status.created_at ? new Date(status.created_at).toISOString() : "",
    body: text,
    title: text.replace(/\s+/g, " ").trim().slice(0, 220),
    symbols,
    tradableSymbols: symbols.filter(isTradableCandidate),
    sentiment: inferSentiment(text),
    theme: classifyTheme(text),
    url: status.url || (status.id ? `https://x.com/aleabitoreddit/status/${status.id}` : ""),
    engagement: {
      likes: Number(status.likes) || 0,
      reposts: Number(status.retweets ?? status.reposts) || 0,
      replies: Number(status.replies) || 0,
      views: Number(status.views) || 0,
    },
  };
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 15_000);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0",
        accept: "application/json,text/plain,*/*",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchLatestStatuses() {
  const raw = await fetchJson(FX_URL, { timeout: 12_000 });
  return (raw.results || [])
    .filter((item) => item.type === "status")
    .map(normalizeStatus)
    .filter((item) => item.id && item.body)
    .sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0));
}

function html(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function short(value = "", limit = 420) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

async function sendTelegram(message, options = {}) {
  if (DRY_RUN || !TOKEN || !CHAT_ID) {
    log("TG DRY RUN", message.replace(/<[^>]+>/g, "").slice(0, 1400));
    return;
  }
  const body = {
    chat_id: CHAT_ID,
    text: message.slice(0, 3900),
    parse_mode: "HTML",
    disable_web_page_preview: options.preview === true ? false : true,
  };
  if (THREAD_ID) body.message_thread_id = Number(THREAD_ID);
  const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Telegram send failed ${response.status}: ${text.slice(0, 300)}`);
  }
}

function metricForSymbol(publicData, symbol) {
  const normalized = normalizeSymbol(symbol);
  return (publicData.symbols || []).find((item) => normalizeSymbol(item.symbol) === normalized) || {};
}

function capScore(marketCap) {
  const cap = Number(marketCap);
  if (!Number.isFinite(cap) || cap <= 0) return 45;
  if (cap < 3e9) return 95;
  if (cap < 20e9) return 84;
  if (cap < 80e9) return 68;
  if (cap < 400e9) return 54;
  return 35;
}

function themeScore(theme = "") {
  if (theme === "cpo-silicon-photonics" || theme === "substrate-materials") return 94;
  if (theme === "neocloud") return 74;
  if (theme === "ai-infrastructure") return 58;
  if (theme === "memory-rotation") return 60;
  if (theme === "capital-structure-veto") return 25;
  return 45;
}

function formatMoney(value, currency = "USD") {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  if (currency !== "USD") return `${currency} ${num.toFixed(2)}`;
  return `$${num.toFixed(2)}`;
}

function formatCap(value) {
  const cap = Number(value);
  if (!Number.isFinite(cap) || cap <= 0) return "--";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(0)}M`;
  return `$${cap.toFixed(0)}`;
}

function formatPct(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
}

function rankCandidate({ symbol, quote = {}, publicData, status }) {
  const metric = metricForSymbol(publicData, symbol);
  const dominantTheme = metric.dominantTheme || status.theme || "general";
  const mentions = Number(metric.mentions || 0);
  const materiality = Number(metric.materiality || 0);
  const sentimentBonus = status.sentiment === "bull" ? 10 : status.sentiment === "bear" ? -18 : 0;
  const mentionScore = Math.min(100, Math.max(12, (mentions / 650) * 100));
  const materialityScore = Math.min(100, Math.max(20, materiality || 35));
  const riskPenalty =
    dominantTheme === "capital-structure-veto" || /dilution|atm|debt|稀释|融资|债务/i.test(status.body)
      ? 28
      : 0;
  const score = Math.round(
    Math.max(
      1,
      Math.min(
        100,
        themeScore(dominantTheme) * 0.28 +
          mentionScore * 0.2 +
          materialityScore * 0.16 +
          capScore(quote.marketCap) * 0.2 +
          52 * 0.16 +
          sentimentBonus -
          riskPenalty
      )
    )
  );
  const action = score >= 82 ? "优先研究" : score >= 68 ? "可观察" : score >= 52 ? "补证据" : "暂不优先";
  const reason = [
    WATCHLIST_THESES[symbol],
    dominantTheme !== "general" ? `主题：${dominantTheme}` : "",
    mentions ? `历史提及 ${mentions} 次` : "缺少历史样本",
    riskPenalty ? "触发资本结构/风险词，先降级" : "",
  ]
    .filter(Boolean)
    .join("；");
  return {
    symbol,
    score,
    action,
    reason,
    quote,
    metric,
    theme: dominantTheme,
  };
}

async function fetchQuotes(symbols) {
  if (!symbols.length) return new Map();
  const url = `${DEFAULT_QUOTE_BASE.replace(/\/$/, "")}/api/quotes?symbols=${encodeURIComponent(symbols.join(","))}&detail=1`;
  const data = await fetchJson(url, { timeout: 25_000 });
  const map = new Map();
  for (const quote of data.quotes || []) {
    const requested = normalizeSymbol(quote.requestedSymbol || quote.symbol);
    if (requested) map.set(requested, quote);
    if (quote.symbol) map.set(normalizeSymbol(quote.symbol), quote);
  }
  return map;
}

function buildImmediateMessage(status) {
  const tradable = status.tradableSymbols.length ? status.tradableSymbols.map((symbol) => `$${symbol}`).join(" ") : "未识别到可交易美股 ticker";
  return [
    "🚨 <b>Serenity 新推文捕获</b>",
    `时间：${html(status.date)}`,
    `Ticker：${html(tradable)}`,
    `情绪：${html(status.sentiment)} · 主题：${html(status.theme)}`,
    "",
    html(short(status.body, 700)),
    "",
    status.url ? `<a href="${html(status.url)}">打开原文</a>` : "",
    `\n将在 ${Math.round(DELAY_MS / 1000)} 秒后发送行情和排序研究包。`,
  ]
    .filter(Boolean)
    .join("\n");
}

function themeLabel(theme = "") {
  const labels = {
    "capital-structure-veto": "资本结构风险",
    "cpo-silicon-photonics": "CPO / 硅光 / 光互连",
    neocloud: "AI 数据中心 / NeoCloud",
    "memory-rotation": "HBM / 存储周期",
    "ai-infrastructure": "AI 基建",
    general: "一般事件",
  };
  return labels[theme] || theme || "一般事件";
}

function themeMechanism(theme = "") {
  if (theme === "cpo-silicon-photonics") {
    return "资金通常从 AI capex 主线外溢到光互连瓶颈，小市值上游和订单证据最敏感。";
  }
  if (theme === "neocloud") {
    return "资金会先看算力合同、电力资产、客户质量和融资路径，强订单与低稀释是核心。";
  }
  if (theme === "ai-infrastructure") {
    return "资金倾向沿 hyperscaler capex、AI ASIC、网络和服务器供应链寻找确定性。";
  }
  if (theme === "memory-rotation") {
    return "资金关注 HBM/DRAM 价格、产能紧缺和周期位置，追高时需要额外谨慎。";
  }
  if (theme === "capital-structure-veto") {
    return "这类信息优先当作风险过滤器处理，融资、ATM、可转债和债务会压低可买性。";
  }
  return "先确认 Serenity 是否在强化已有主线，再看成交量、公告证据和同主题扩散。";
}

function buildTradingFrame(status, ranked) {
  const top = ranked[0];
  const frameTheme = status.theme === "general" && top?.theme ? top.theme : status.theme;
  const conclusion = top ? `${top.action}：优先核查 $${top.symbol}，其余按分数递减观察。` : "观察：未识别到可直接交易的美股 ticker。";
  return [
    `结论：${conclusion}`,
    `主线：${themeLabel(frameTheme)}`,
    `交易逻辑：${themeMechanism(frameTheme)}`,
    "买入条件：原文语义偏多，标的可交易，盘前/盘中量价确认，且无新增融资、财报或监管反向信息。",
    "失效条件：原文是风险提示或做空语义，价格已急拉但成交不足，公告证据无法对应，或同主题龙头没有同步确认。",
    "风险：追高、流动性不足、小市值融资稀释、OTC/ADR 差异、消息延迟和盘中波动。",
  ].join("\n");
}

function buildRankingMessage(status, ranked) {
  const header = [
    "📊 <b>30 秒研究包：可交易标的排序</b>",
    `来源：<a href="${html(status.url)}">Serenity 推文</a>`,
    `识别 ticker：${html(status.symbols.length ? status.symbols.map((symbol) => `$${symbol}`).join(" ") : "无")}`,
    "",
  ];
  if (!ranked.length) {
    return [...header, "这条推文未识别到可直接交易的美股 ticker。"].join("\n");
  }
  const rows = ranked.slice(0, 12).map((item, index) => {
    const quote = item.quote || {};
    const name = quote.profile?.companyName || quote.symbol || item.symbol;
    return [
      `<b>${index + 1}. $${html(item.symbol)} · ${html(item.action)} · ${item.score}/100</b>`,
      `${html(short(name, 68))}`,
      `价格 ${html(formatMoney(quote.price, quote.currency))} · 涨跌 ${html(formatPct(quote.changePercent))} · 市值 ${html(formatCap(quote.marketCap))}`,
      `理由：${html(short(item.reason, 160))}`,
    ].join("\n");
  });
  return [
    ...header,
    `<b>研究框架</b>\n${html(buildTradingFrame(status, ranked))}`,
    ...rows,
    "",
    "⚠️ 这是公开数据研究排序，不是投资建议；下单前必须自己核查流动性、公告、财报和风险。",
  ].join("\n\n");
}

async function sendDelayedRanking(status) {
  await sleep(DELAY_MS);
  const publicData = readJson(PUBLIC_DATA, { symbols: [] });
  const symbols = unique(status.tradableSymbols).slice(0, 12);
  const quotes = await fetchQuotes(symbols);
  const ranked = symbols
    .map((symbol) =>
      rankCandidate({
        symbol,
        quote: quotes.get(symbol) || {},
        publicData,
        status,
      })
    )
    .filter((item) => !item.quote.error)
    .sort((a, b) => b.score - a.score);
  await sendTelegram(buildRankingMessage(status, ranked), { preview: false });
}

function isNewer(status, state) {
  const latestDate = Date.parse(status.date || 0);
  const seenDate = Date.parse(state.lastSeenDate || 0);
  if (Number.isFinite(latestDate) && Number.isFinite(seenDate) && latestDate > seenDate) return true;
  return status.id && status.id !== state.lastSeenId && !state.processedIds?.includes(status.id);
}

async function processStatus(status, state) {
  log("new status", status.id, status.tradableSymbols.join(",") || "no tickers");
  await sendTelegram(buildImmediateMessage(status), { preview: true });
  state.processedIds = unique([status.id, ...(state.processedIds || [])]).slice(0, 80);
  state.lastSeenId = status.id;
  state.lastSeenDate = status.date;
  state.updatedAt = nowIso();
  writeJson(STATE_FILE, state);
  if (status.tradableSymbols.length) {
    setTimeout(() => {
      sendDelayedRanking(status).catch((error) => log("delayed ranking failed", error.message));
    }, 0);
  }
}

async function checkOnce() {
  const state = readJson(STATE_FILE, { processedIds: [] });
  const statuses = await fetchLatestStatuses();
  const latest = statuses[0];
  if (!latest) {
    log("no live statuses");
    return;
  }

  if (!state.lastSeenId && !ALERT_ON_START) {
    writeJson(STATE_FILE, {
      lastSeenId: latest.id,
      lastSeenDate: latest.date,
      processedIds: [latest.id],
      initializedAt: nowIso(),
      updatedAt: nowIso(),
    });
    log("initialized state at", latest.id, latest.date);
    return;
  }

  if (!state.lastSeenId && ALERT_ON_START) {
    await processStatus(latest, state);
    return;
  }

  const newStatuses = statuses.filter((status) => isNewer(status, state)).reverse();
  if (!newStatuses.length) {
    log("no new statuses; latest", latest.id, latest.date);
    return;
  }
  for (const status of newStatuses) {
    await processStatus(status, state);
  }
}

async function sendTest() {
  await sendTelegram("✅ <b>Serenity Telegram monitor test</b>\n监控脚本已能发送 Telegram 消息。");
}

async function main() {
  if (TEST) {
    await sendTest();
    return;
  }
  if (!DRY_RUN && (!TOKEN || !CHAT_ID)) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID. Use --dry-run to test without sending.");
    process.exit(1);
  }
  log(`Serenity TG monitor started. poll=${POLL_MS}ms delay=${DELAY_MS}ms dryRun=${DRY_RUN}`);
  do {
    try {
      await checkOnce();
    } catch (error) {
      log("check failed", error.message);
    }
    if (ONCE) break;
    await sleep(POLL_MS);
  } while (true);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
