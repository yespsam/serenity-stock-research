const calledStocks = [
  {
    symbol: "SIVEF",
    aliases: ["SIVE", "SIVE.ST", "SIVEF"],
    name: "Sivers Semiconductors",
    theme: "cpo-silicon-photonics",
    themeLabel: "CPO / CW laser",
    thesis: "她最常用来表达 CPO 连续波激光瓶颈的标的，核心看 Ayar、Lightmatter、Jabil、GlobalFoundries 等链路。",
    risk: "小市值、瑞典主板/OTC 流动性、融资与量产节奏。",
    fallbackMarketCap: 1.7e10,
  },
  {
    symbol: "AAOI",
    aliases: ["AAOI"],
    name: "Applied Optoelectronics",
    theme: "cpo-silicon-photonics",
    themeLabel: "800G / 1.6T optical",
    thesis: "美国市场高弹性的光模块 / ELSFP / CPO 量产表达，赔率来自 hyperscaler 需求与产能爬坡。",
    risk: "客户集中、估值拥挤、光通信链 beta 过高。",
    fallbackMarketCap: 1.42e10,
  },
  {
    symbol: "AXTI",
    aliases: ["AXTI"],
    name: "AXT Inc.",
    theme: "substrate-materials",
    themeLabel: "InP substrate",
    thesis: "InP 衬底上游材料瓶颈，属于“光互连里更上游、更冷门”的 Serenity 式找法。",
    risk: "大幅波动、融资/子公司上市节奏、材料周期。",
    fallbackMarketCap: 4.0e9,
  },
  {
    symbol: "LITE",
    aliases: ["LITE"],
    name: "Lumentum",
    theme: "cpo-silicon-photonics",
    themeLabel: "Laser compounder",
    thesis: "激光器与光通信周期中的大盘复合表达，她常用它类比上一轮激光瓶颈赢家。",
    risk: "盘子更大，赔率低于小市值瓶颈股；同业带动回撤明显。",
    fallbackMarketCap: 5.9e10,
  },
  {
    symbol: "MRVL",
    aliases: ["MRVL"],
    name: "Marvell Technology",
    theme: "cpo-silicon-photonics",
    themeLabel: "CPO ecosystem",
    thesis: "AI ASIC、CPO 和高速互连生态锚点，偏稳健，不是她最偏好的小盘弹性。",
    risk: "机构拥挤，估值已经包含较多 AI 预期。",
    fallbackMarketCap: 2.3e11,
  },
  {
    symbol: "AEHR",
    aliases: ["AEHR"],
    name: "Aehr Test Systems",
    theme: "cpo-silicon-photonics",
    themeLabel: "SiPh testing",
    thesis: "光子器件量产后，测试与可靠性验证会变成刚性环节。",
    risk: "订单不连续、客户导入失败、收入节奏不稳。",
    fallbackMarketCap: 3.0e9,
  },
  {
    symbol: "NBIS",
    aliases: ["NBIS"],
    name: "Nebius",
    theme: "neocloud",
    themeLabel: "NeoCloud",
    thesis: "算力云、数据中心与 robotaxi / ClickHouse 等资产的 sum-of-parts 叙事。",
    risk: "Capex、利用率、融资路径与云合同质量。",
    fallbackMarketCap: 5.5e10,
  },
  {
    symbol: "IREN",
    aliases: ["IREN"],
    name: "IREN",
    theme: "capital-structure-veto",
    themeLabel: "NeoCloud dilution veto",
    thesis: "典型反例：即使 AI 算力方向对，资本结构和 ATM 稀释也能一票否决。",
    risk: "稀释、债务、矿转云兑现、资产折旧。",
    fallbackMarketCap: 1.5e10,
    riskFlag: true,
  },
  {
    symbol: "COHR",
    aliases: ["COHR"],
    name: "Coherent",
    theme: "cpo-silicon-photonics",
    themeLabel: "Optical components",
    thesis: "光通信器件、激光与材料链里的大盘稳健表达。",
    risk: "盘子大、重估弹性不如小盘上游瓶颈。",
    fallbackMarketCap: 6.0e10,
  },
  {
    symbol: "NVDA",
    aliases: ["NVDA"],
    name: "NVIDIA",
    theme: "ai-infrastructure",
    themeLabel: "AI anchor",
    thesis: "Serenity 更多把它当终端需求锚点，而不是最高赔率标的。",
    risk: "大市值、机构共识拥挤、上游更小节点可能弹性更高。",
    fallbackMarketCap: 5.0e12,
  },
  {
    symbol: "MSFT",
    aliases: ["MSFT"],
    name: "Microsoft",
    theme: "ai-infrastructure",
    themeLabel: "Hyperscaler demand",
    thesis: "AI 集群资本开支和光互连终端需求锚点。",
    risk: "超大市值，alpha 更多外溢到供应链小节点。",
    fallbackMarketCap: 4.0e12,
  },
  {
    symbol: "AMZN",
    aliases: ["AMZN"],
    name: "Amazon",
    theme: "ai-infrastructure",
    themeLabel: "AWS ASIC demand",
    thesis: "AWS ASIC 与数据中心建设是光互连需求侧证据。",
    risk: "终端锚点而非瓶颈本身。",
    fallbackMarketCap: 2.8e12,
  },
  {
    symbol: "META",
    aliases: ["META"],
    name: "Meta Platforms",
    theme: "ai-infrastructure",
    themeLabel: "AI capex demand",
    thesis: "大规模 AI capex 证明终端需求，但更高弹性通常在上游供应链。",
    risk: "AI 支出节奏与广告基本面扰动。",
    fallbackMarketCap: 1.8e12,
  },
  {
    symbol: "MU",
    aliases: ["MU"],
    name: "Micron",
    theme: "memory-rotation",
    themeLabel: "HBM / memory",
    thesis: "记忆体周期仍有吸引力，但 Serenity 认为 CPO 可能是更早期、更大赔率方向。",
    risk: "周期尾部、价格回落、同业供给。",
    fallbackMarketCap: 1.6e11,
  },
  {
    symbol: "TSM",
    aliases: ["TSM"],
    name: "Taiwan Semiconductor",
    theme: "ai-infrastructure",
    themeLabel: "Foundry anchor",
    thesis: "先进制程和封装需求锚点，常用于验证 CPO/AI 供应链逻辑。",
    risk: "超大市值、地缘风险、赔率外溢到更小供应商。",
    fallbackMarketCap: 1.2e12,
  },
  {
    symbol: "CIFR",
    aliases: ["CIFR"],
    name: "Cipher Mining",
    theme: "neocloud",
    themeLabel: "Power / NeoCloud",
    thesis: "电力资产与 AI 数据中心转型的高 beta 方向。",
    risk: "矿业周期、融资、合同质量。",
    fallbackMarketCap: 8.0e9,
  },
  {
    symbol: "HOOD",
    aliases: ["HOOD"],
    name: "Robinhood",
    theme: "general",
    themeLabel: "Retail brokerage",
    thesis: "交易量、用户增长与 crypto/retail cycle 相关的事件型表达。",
    risk: "监管、周期交易量、估值波动。",
    fallbackMarketCap: 6.0e10,
  },
  {
    symbol: "CRWV",
    aliases: ["CRWV"],
    name: "CoreWeave",
    theme: "neocloud",
    themeLabel: "NeoCloud comp",
    thesis: "NeoCloud 对照组，用于比较 NBIS/IREN 等算力云赔率与融资路径。",
    risk: "高 capex、客户集中、折旧与融资。",
    fallbackMarketCap: 8.0e10,
  },
  {
    symbol: "AVGO",
    aliases: ["AVGO"],
    name: "Broadcom",
    theme: "ai-infrastructure",
    themeLabel: "AI ASIC / networking",
    thesis: "AI ASIC 和网络生态核心龙头，更多是需求锚点与稳健表达。",
    risk: "大市值、估值已反映强 AI 预期。",
    fallbackMarketCap: 1.7e12,
  },
  {
    symbol: "AMD",
    aliases: ["AMD"],
    name: "Advanced Micro Devices",
    theme: "ai-infrastructure",
    themeLabel: "GPU / CPO demand",
    thesis: "AMD 推动 CPO 与台湾生态合作时，Serenity 会顺藤摸瓜找更小供应链节点。",
    risk: "GPU 竞争、毛利、路线兑现。",
    fallbackMarketCap: 3.4e11,
  },
  {
    symbol: "JBL",
    aliases: ["JBL"],
    name: "Jabil",
    theme: "cpo-silicon-photonics",
    themeLabel: "1.6T manufacturing",
    thesis: "1.6T LRO 与 Sivers 量产链路中的制造/客户证据。",
    risk: "制造服务利润率、项目节奏。",
    fallbackMarketCap: 2.5e10,
  },
  {
    symbol: "POET",
    aliases: ["POET"],
    name: "POET Technologies",
    theme: "cpo-silicon-photonics",
    themeLabel: "Optical interposer",
    thesis: "光互连上游小市值技术节点之一，适合用瓶颈框架审查。",
    risk: "商业化、融资、客户落地。",
    fallbackMarketCap: 1.2e9,
  },
  {
    symbol: "ALAB",
    aliases: ["ALAB"],
    name: "Astera Labs",
    theme: "ai-infrastructure",
    themeLabel: "Connectivity",
    thesis: "高速互连与 AI 服务器连接层，验证数据中心瓶颈从 GPU 外溢到互连。",
    risk: "估值高、竞争与客户集中。",
    fallbackMarketCap: 3.5e10,
  },
  {
    symbol: "RKLB",
    aliases: ["RKLB"],
    name: "Rocket Lab",
    theme: "general",
    themeLabel: "Space optionality",
    thesis: "她长期提到的 space 方向之一，偏 5 年以上期权型主题。",
    risk: "发射节奏、现金消耗、长期兑现。",
    fallbackMarketCap: 2.0e10,
  },
];

const themeNames = {
  "cpo-silicon-photonics": "CPO / 光子链",
  neocloud: "NeoCloud",
  "memory-rotation": "Memory",
  "ai-infrastructure": "AI 基建",
  "capital-structure-veto": "稀释否决",
  "substrate-materials": "衬底材料",
  "robotics-physical-ai": "机器人 / 实体 AI",
  "power-architecture": "电力架构",
  "crypto-rotation": "Crypto beta",
  "macro-hedge": "宏观对冲",
  general: "通用",
};

const state = {
  research: null,
  tweets: null,
  distillation: null,
  quotes: new Map(),
  bstocks: [],
  bstockLoading: false,
  bstockError: "",
  bstockUpdatedAt: null,
  analysisRequestId: 0,
  renderedStocks: [],
  activeSymbol: "AAOI",
  latestReportText: "",
  history: [],
  performance: new Map(),
  monitor: null,
  liveItems: [],
  liveSeenIds: new Set(),
  livePending: new Set(),
  liveReviewPending: new Set(),
  liveResearchPacks: new Map(),
  liveReviewPacks: new Map(),
  webPushInitialized: false,
  lastLiveFetchAt: null,
  lastLiveSuccessAt: null,
  lastLiveNewAt: null,
  lastLiveNewId: "",
  lastMatchedAlertAt: null,
  lastMatchedAlertId: "",
  lastLiveError: "",
  liveLoading: false,
  liveFetchCount: 0,
  liveFailureCount: 0,
  liveConsecutiveFailures: 0,
  liveLatencyMs: null,
  liveLastItemCount: 0,
  notificationEnabled: false,
  soundEnabled: false,
  translationEnabled: true,
  watchlist: [],
  beginnerProfile: null,
  paperTrades: [],
  priceAlerts: [],
  activeReport: null,
  symbolIdentities: [],
  symbolIdentityByAlias: new Map(),
  quoteFetchedAt: new Map(),
  lastPriceAlertQuoteAt: 0,
  lastPriceAlertTriggeredAt: null,
  soundUnlocked: false,
  swReady: false,
  swControlled: false,
  swRegistration: null,
  pwaInstallPrompt: null,
  pwaInstalled: window.matchMedia?.("(display-mode: standalone)")?.matches || navigator.standalone === true,
};

function normalizeIdentity(identity = {}) {
  const canonical = normalizeSymbol(identity.canonical);
  const marketSymbol = normalizeSymbol(identity.marketSymbol || canonical);
  const aliases = uniqueSymbols([canonical, marketSymbol, ...(identity.aliases || [])]);
  return {
    canonical,
    marketSymbol,
    aliases,
    companyName: identity.companyName || canonical,
    exchangeHint: identity.exchangeHint || "",
  };
}

function loadSymbolIdentities(identities = []) {
  const normalized = identities.map(normalizeIdentity).filter((identity) => identity.canonical);
  const byAlias = new Map();
  for (const identity of normalized) {
    for (const alias of uniqueSymbols([identity.canonical, identity.marketSymbol, ...identity.aliases])) {
      byAlias.set(alias, identity);
    }
  }
  state.symbolIdentities = normalized;
  state.symbolIdentityByAlias = byAlias;
}

function identityForSymbol(symbol = "") {
  return state.symbolIdentityByAlias.get(normalizeSymbol(symbol)) || null;
}

function canonicalSymbol(symbol = "") {
  return identityForSymbol(symbol)?.canonical || normalizeSymbol(symbol);
}

function marketSymbolFor(symbol = "") {
  const normalized = normalizeSymbol(symbol);
  return identityForSymbol(normalized)?.marketSymbol || normalized;
}

function aliasesForSymbol(symbol = "") {
  const identity = identityForSymbol(symbol);
  return identity ? uniqueSymbols([identity.canonical, identity.marketSymbol, ...identity.aliases]) : [normalizeSymbol(symbol)].filter(Boolean);
}

function stockAliases(stock = {}) {
  return uniqueSymbols([stock.symbol, stock.marketSymbol, ...(stock.aliases || []), ...aliasesForSymbol(stock.symbol)]);
}

function applySymbolIdentitiesToCalledStocks() {
  for (const stock of calledStocks) {
    const identity = identityForSymbol(stock.symbol);
    if (!identity) continue;
    stock.symbol = identity.canonical;
    stock.marketSymbol = identity.marketSymbol;
    stock.aliases = uniqueSymbols([...(stock.aliases || []), ...identity.aliases, identity.marketSymbol, identity.canonical]);
    stock.name = stock.name || identity.companyName;
  }
}

const pageParams = new URLSearchParams(window.location.search);
const WEB_PUSH_POLL_MS = clamp(Number(pageParams.get("pushPoll") || 30_000), 10_000, 120_000);
const WEB_PUSH_DELAY_MS = clamp(Number(pageParams.get("pushDelay") || 30_000), 1000, 30_000);
const WEB_REVIEW_DELAY_MS = clamp(Number(pageParams.get("reviewDelay") || 300_000), 1000, 300_000);
const LIVE_API_PATH = "/api/serenity-live";
const IS_GITHUB_PAGES_STATIC = window.location.hostname.endsWith("github.io");
const WEB_CRYPTO_SYMBOLS = new Set(["BTC", "ETH", "SOL", "DOGE", "XRP"]);
const QUOTE_CACHE_MS = 60_000;
const DETAIL_QUOTE_CACHE_MS = 10 * 60_000;
const SOCIAL_CANDIDATE_LIMIT = 22;
const SOCIAL_PREFETCH_LIMIT = 18;
const SOCIAL_MIN_MENTIONS = 40;
const SOCIAL_SYMBOL_BLOCKLIST = new Set(["BTC", "ETH", "SOL", "DOGE", "XRP", "IBIT", "EWY", "XLU", "SPY", "QQQ", "IWM", "TLT", "GLD", "LPKF", "RPI"]);
const PUSH_NOTIFY_KEY = "serenityWebPushNotify";
const PUSH_SOUND_KEY = "serenityWebPushSound";
const PUSH_TRANSLATION_KEY = "serenityWebPushTranslation";
const PUSH_WATCHLIST_KEY = "serenityWebPushWatchlist";
const BEGINNER_PROFILE_KEY = "serenityBeginnerProfile";
const BEGINNER_PAPER_TRADES_KEY = "serenityPaperTrades";
const BEGINNER_PRICE_ALERTS_KEY = "serenityPriceAlerts";
const PRICE_ALERT_QUOTE_MS = 30_000;
const BINANCE_WALLET_REFERRAL_URL = "https://web3.binance.com/referral?ref=DB7KNQGJ";
const BSTOCK_API_PATH = "/api/binance-bstocks";
const APP_SHELL_VERSION = "v16";
const BSTOCK_SYMBOLS = [
  {
    symbol: "NVDAB",
    pair: "NVDABUSDT",
    displayPair: "NVDAB/USDT",
    equity: "NVDA",
    name: "NVIDIA bStock",
    themeLabel: "AI GPU",
    thesis: "AI 算力龙头的股票代币化表达，用于观察 crypto venue 对 AI 权重股的风险偏好。",
  },
  {
    symbol: "TSLAB",
    pair: "TSLABUSDT",
    displayPair: "TSLAB/USDT",
    equity: "TSLA",
    name: "Tesla bStock",
    themeLabel: "EV / Robotics",
    thesis: "高波动成长股的 24/7 代币化盘口，适合观察非美时段资金情绪。",
  },
  {
    symbol: "CRCLB",
    pair: "CRCLBUSDT",
    displayPair: "CRCLB/USDT",
    equity: "CRCL",
    name: "Circle bStock",
    themeLabel: "Stablecoin infra",
    thesis: "稳定币基础设施主题的代币化美股表达，和 crypto beta 联动更强。",
  },
  {
    symbol: "MUB",
    pair: "MUBUSDT",
    displayPair: "MUB/USDT",
    equity: "MU",
    name: "Micron bStock",
    themeLabel: "HBM / memory",
    thesis: "HBM 与存储周期的 bStock 盘口，用来观察 AI memory 轮动热度。",
  },
  {
    symbol: "SNDKB",
    pair: "SNDKBUSDT",
    displayPair: "SNDKB/USDT",
    equity: "SNDK",
    name: "SanDisk bStock",
    themeLabel: "Storage",
    thesis: "存储链中更高弹性的股票代币化标的，适合对比 MU 的资金强弱。",
  },
];
const WATCH_THEME_TOKENS = {
  CPO: "cpo-silicon-photonics",
  PHOTONICS: "cpo-silicon-photonics",
  OPTICAL: "cpo-silicon-photonics",
  LASER: "cpo-silicon-photonics",
  "硅光": "cpo-silicon-photonics",
  "光子": "cpo-silicon-photonics",
  "光模块": "cpo-silicon-photonics",
  NEOCLOUD: "neocloud",
  CLOUD: "neocloud",
  DATACENTER: "neocloud",
  "算力": "neocloud",
  "数据中心": "neocloud",
  AI: "ai-infrastructure",
  ASIC: "ai-infrastructure",
  GPU: "ai-infrastructure",
  INFRA: "ai-infrastructure",
  "AI基建": "ai-infrastructure",
  HBM: "memory-rotation",
  MEMORY: "memory-rotation",
  DRAM: "memory-rotation",
  "存储": "memory-rotation",
  RISK: "capital-structure-veto",
  DILUTION: "capital-structure-veto",
  ATM: "capital-structure-veto",
  DEBT: "capital-structure-veto",
  "稀释": "capital-structure-veto",
};

const stockList = document.querySelector("#stockList");
const listStatus = document.querySelector("#listStatus");
const stockSearch = document.querySelector("#stockSearch");
const themeFilter = document.querySelector("#themeFilter");
const sortMode = document.querySelector("#sortMode");
const opportunityList = document.querySelector("#opportunityList");
const screenerSearch = document.querySelector("#screenerSearch");
const screenerTheme = document.querySelector("#screenerTheme");
const screenerSignal = document.querySelector("#screenerSignal");
const screenerSort = document.querySelector("#screenerSort");
const screenerStatus = document.querySelector("#screenerStatus");
const screenerFactorSummary = document.querySelector("#screenerFactorSummary");
const screenerList = document.querySelector("#screenerList");
const bstockStatus = document.querySelector("#bstockStatus");
const bstockSummary = document.querySelector("#bstockSummary");
const bstockList = document.querySelector("#bstockList");
const bstockRefresh = document.querySelector("#bstockRefresh");
const monitorStatus = document.querySelector("#monitorStatus");
const webPushBanner = document.querySelector("#webPushBanner");
const webPushControls = document.querySelector("#webPushControls");
const monitorHealth = document.querySelector("#monitorHealth");
const monitorSignalBoard = document.querySelector("#monitorSignalBoard");
const monitorHistoryList = document.querySelector("#monitorHistoryList");
const dailyTradeReport = document.querySelector("#dailyTradeReport");
const priceAlertPanel = document.querySelector("#priceAlertPanel");
const liveTweetList = document.querySelector("#liveTweetList");
const trackStatus = document.querySelector("#trackStatus");
const trackRecordList = document.querySelector("#trackRecordList");
const methodList = document.querySelector("#methodList");
const heroStats = document.querySelector("#heroStats");
const heroAnalysisForm = document.querySelector("#heroAnalysisForm");
const heroTickerInput = document.querySelector("#heroTickerInput");
const analysisForm = document.querySelector("#analysisForm");
const tickerInput = document.querySelector("#tickerInput");
const tickerSuggestions = document.querySelector("#tickerSuggestions");
const quickTickers = document.querySelector("#quickTickers");
const reportOutput = document.querySelector("#reportOutput");
const APP_PAGE_IDS = new Set(["home", "screener", "bstocks", "opportunities", "monitor", "watchlist", "analysis", "track-record", "method"]);
const APP_PAGE_ALIASES = new Map([["home-view", "home"]]);

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("zh-CN", { notation: "compact", maximumFractionDigits: 1 });

function normalizePageId(value = "") {
  const raw = String(value || "").replace(/^#/, "").trim() || "home";
  const page = APP_PAGE_ALIASES.get(raw) || raw;
  return APP_PAGE_IDS.has(page) ? page : "home";
}

function pageFromHash() {
  try {
    return normalizePageId(decodeURIComponent(window.location.hash.replace(/^#/, "")));
  } catch {
    return "home";
  }
}

function setActivePage(page = pageFromHash(), options = {}) {
  const activePage = normalizePageId(page);
  document.body.classList.add("page-routing");
  document.body.dataset.page = activePage;
  document.querySelectorAll(".app-page").forEach((section) => {
    section.classList.toggle("active", section.dataset.page === activePage);
  });
  document.querySelectorAll('.topbar a[href^="#"], .home-actions a[href^="#"]').forEach((link) => {
    const target = normalizePageId(link.getAttribute("href"));
    link.classList.toggle("active", target === activePage);
    if (target === activePage) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (options.updateHash && window.location.hash !== `#${activePage}`) {
    window.history.pushState(null, "", `#${activePage}`);
  }
  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
  }
}

function initPageRouting() {
  setActivePage(pageFromHash(), { scroll: false });
  window.addEventListener("hashchange", () => {
    setActivePage(pageFromHash());
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href="#"]')) event.preventDefault();
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return response.json();
}

function normalizeSymbol(value = "") {
  return String(value).trim().replace(/^\$+/, "").toUpperCase();
}

function uniqueSymbols(values = []) {
  return [...new Set(values.map(normalizeSymbol).filter(Boolean))];
}

function formatMarketCap(value) {
  const cap = Number(value);
  if (!Number.isFinite(cap) || cap <= 0) return "--";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(0)}M`;
  return usd.format(cap);
}

function formatPrice(quote = {}) {
  if (!Number.isFinite(Number(quote.price))) return "--";
  return quote.currency === "USD" || !quote.currency ? usd.format(Number(quote.price)) : `${quote.currency} ${Number(quote.price).toFixed(2)}`;
}

function formatPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "--";
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
}

function dateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function storageGet(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can be unavailable in restricted browser contexts.
  }
}

function moneyValue(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "--";
  return usd.format(num);
}

function defaultBeginnerProfile() {
  return {
    accountSize: 10_000,
    riskPercent: 1,
    maxPositionPercent: 8,
  };
}

function normalizeBeginnerProfile(profile = {}) {
  const defaults = defaultBeginnerProfile();
  return {
    accountSize: clamp(moneyValue(profile.accountSize || defaults.accountSize), 500, 10_000_000),
    riskPercent: clamp(Number(profile.riskPercent || defaults.riskPercent), 0.25, 5),
    maxPositionPercent: clamp(Number(profile.maxPositionPercent || defaults.maxPositionPercent), 1, 25),
  };
}

function initBeginnerProfile() {
  state.beginnerProfile = normalizeBeginnerProfile(storageGet(BEGINNER_PROFILE_KEY, defaultBeginnerProfile()));
  const trades = storageGet(BEGINNER_PAPER_TRADES_KEY, []);
  state.paperTrades = Array.isArray(trades)
    ? trades
        .filter((trade) => trade && trade.symbol && Number.isFinite(Number(trade.entryPrice)))
        .slice(0, 40)
    : [];
  const alerts = storageGet(BEGINNER_PRICE_ALERTS_KEY, []);
  state.priceAlerts = Array.isArray(alerts)
    ? alerts
        .filter((alert) => alert && alert.symbol && Number.isFinite(Number(alert.targetPrice)) && alert.direction)
        .slice(0, 60)
    : [];
}

function saveBeginnerProfile(profile = state.beginnerProfile) {
  state.beginnerProfile = normalizeBeginnerProfile(profile);
  storageSet(BEGINNER_PROFILE_KEY, state.beginnerProfile);
}

function savePaperTrades() {
  state.paperTrades = state.paperTrades.slice(0, 40);
  storageSet(BEGINNER_PAPER_TRADES_KEY, state.paperTrades);
}

function savePriceAlerts() {
  state.priceAlerts = state.priceAlerts.slice(0, 60);
  storageSet(BEGINNER_PRICE_ALERTS_KEY, state.priceAlerts);
}

function normalizeWatchToken(value = "") {
  return String(value || "")
    .trim()
    .replace(/^[#$]+/, "")
    .replace(/\s+/g, "")
    .toUpperCase();
}

function parseWatchTokens(value = "") {
  return [...new Set(String(value || "").split(/[\s,，、/|]+/).map(normalizeWatchToken).filter(Boolean))];
}

function notificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

function notificationLabel() {
  const permission = notificationPermission();
  if (permission === "unsupported") return "通知不可用";
  if (permission === "granted" && state.notificationEnabled) return "通知已开";
  if (permission === "denied") return "通知被拒";
  return "开启通知";
}

function audioAvailable() {
  return Boolean(window.AudioContext || window.webkitAudioContext);
}

function soundLabel() {
  if (!audioAvailable()) return "声音不可用";
  return `声音${state.soundEnabled ? "已开" : "关闭"}`;
}

function translationLabel() {
  return `翻译${state.translationEnabled ? "已开" : "关闭"}`;
}

function pwaLabel() {
  if (state.pwaInstalled) return "PWA 模式";
  if (state.pwaInstallPrompt) return "安装应用";
  return state.swReady ? "PWA 就绪" : "PWA 准备中";
}

function watchlistSummary() {
  return state.watchlist.length ? state.watchlist.join(" / ") : "全部推文";
}

function initPushPreferences() {
  state.notificationEnabled = Boolean(storageGet(PUSH_NOTIFY_KEY, false)) && notificationPermission() === "granted";
  state.soundEnabled = Boolean(storageGet(PUSH_SOUND_KEY, false));
  state.translationEnabled = Boolean(storageGet(PUSH_TRANSLATION_KEY, true));
  state.watchlist = storageGet(PUSH_WATCHLIST_KEY, []);
  if (!Array.isArray(state.watchlist)) state.watchlist = [];
  state.watchlist = [...new Set(state.watchlist.map(normalizeWatchToken).filter(Boolean))].slice(0, 24);
}

async function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const hadController = Boolean(navigator.serviceWorker.controller);
    const registration = await navigator.serviceWorker.register(new URL("./sw.js", window.location.href));
    state.swRegistration = registration;
    state.swReady = true;
    state.swControlled = hadController;
    const reloadKey = `serenitySwReloaded:${APP_SHELL_VERSION}`;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      state.swControlled = true;
      if (hadController && !sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, "1");
        window.location.reload();
        return;
      }
      renderLiveMonitor();
    });
    if (registration.waiting && hadController) registration.waiting.postMessage({ type: "SKIP_WAITING" });
    registration.update?.().catch(() => {});
  } catch (error) {
    state.swReady = false;
    state.lastLiveError = `Service Worker 注册失败：${error.message}`;
  }
}

function healthTone() {
  if (state.liveConsecutiveFailures >= 3) return "down";
  if (state.lastLiveError || state.liveConsecutiveFailures > 0) return "warn";
  if (state.liveLatencyMs && state.liveLatencyMs > 6000) return "warn";
  return "ok";
}

function healthLabel() {
  const tone = healthTone();
  if (tone === "down") return "监控异常";
  if (tone === "warn") return "监控降级";
  return "监控正常";
}

function metricForStock(stock) {
  const symbols = state.distillation?.symbols || [];
  const aliases = new Set(stockAliases(stock));
  return symbols.find((item) => aliases.has(normalizeSymbol(item.symbol)) || aliases.has(canonicalSymbol(item.symbol))) || null;
}

function quoteForStock(stock) {
  for (const symbol of stockAliases(stock)) {
    const quote = state.quotes.get(symbol);
    if (quote) return quote;
  }
  return {};
}

function quickQuoteForSymbol(stock, symbol) {
  const cached = quoteForStock(stock);
  if (cached && (cached.symbol || cached.requestedSymbol || Number.isFinite(Number(cached.price)))) return cached;
  const normalized = canonicalSymbol(symbol || stock.symbol);
  return {
    symbol: normalized,
    requestedSymbol: normalized,
    currency: "USD",
    provider: "快速框架 · 详细数据加载中",
    updatedAt: Date.now(),
  };
}

function stockMarketCap(stock) {
  const quote = quoteForStock(stock);
  return Number(quote.marketCap) || stock.fallbackMarketCap || 0;
}

function getCalledEvidence(stock, limit = 4) {
  const aliases = new Set(stockAliases(stock));
  return (state.tweets?.items || [])
    .filter((item) => (item.symbols || []).some((symbol) => aliases.has(normalizeSymbol(symbol)) || aliases.has(canonicalSymbol(symbol))))
    .sort((a, b) => {
      const materiality = Number(b.materiality || 0) - Number(a.materiality || 0);
      if (materiality) return materiality;
      return Date.parse(b.date || 0) - Date.parse(a.date || 0);
    })
    .slice(0, limit);
}

function scoreStock(stock, quote = quoteForStock(stock)) {
  const metric = metricForStock(stock) || {};
  const mentions = Number(metric.mentions || 0);
  const bull = Number(metric.bull || 0);
  const bear = Number(metric.bear || 0);
  const neutral = Number(metric.neutral || 0);
  const total = Math.max(1, bull + bear + neutral);
  const marketCap = stockMarketCap(stock);
  const mentionScore = clamp((mentions / 800) * 100, 18, 100);
  const bullishScore = clamp(((bull - bear * 1.6) / total) * 100 + 54, 12, 100);
  const chokepointScore =
    stock.theme === "cpo-silicon-photonics" || stock.theme === "substrate-materials"
      ? 94
      : stock.theme === "neocloud"
        ? 72
        : stock.theme === "capital-structure-veto"
          ? 42
          : 58;
  const customerScore = clamp(mentions > 450 ? 88 : mentions > 220 ? 76 : mentions > 80 ? 62 : 48, 35, 92);
  const capScore = marketCap < 3e9 ? 94 : marketCap < 20e9 ? 84 : marketCap < 80e9 ? 70 : marketCap < 400e9 ? 55 : 36;
  const riskPenalty = (stock.riskFlag ? 18 : 0) + clamp((bear / total) * 75, 0, 16) + (Number(quote.changePercent) < -12 ? 4 : 0);
  return Math.round(clamp(chokepointScore * 0.3 + mentionScore * 0.22 + customerScore * 0.18 + capScore * 0.18 + bullishScore * 0.12 - riskPenalty, 8, 100));
}

function conclusionFor(score, stock) {
  if (stock.riskFlag || stock.theme === "capital-structure-veto") return "资本结构风险优先，暂不建立多头假设";
  if (score >= 82) return "高优先级研究，等待价格与证据共振";
  if (score >= 68) return "纳入观察池，等待增量证据确认";
  if (score >= 52) return "行业锚点属性更强，赔率一般";
  return "暂不列为优先研究标的";
}

function upsideSpace(score, stock) {
  const cap = stockMarketCap(stock);
  const capBonus = cap < 5e9 ? 42 : cap < 20e9 ? 30 : cap < 80e9 ? 18 : cap < 300e9 ? 8 : 0;
  const rawUpside = clamp((score - 45) * 2.7 + capBonus, 8, 180);
  const downside = stock.riskFlag ? clamp(34 + (100 - score) * 0.45, 32, 62) : clamp(18 + (100 - score) * 0.34, 16, 48);
  return {
    upside: Math.round(rawUpside),
    downside: Math.round(downside),
  };
}

function pricePosition(quote = {}) {
  const price = Number(quote.price);
  const high = Number(quote.fiftyTwoWeekHigh);
  const low = Number(quote.fiftyTwoWeekLow);
  if (![price, high, low].every(Number.isFinite) || high <= low) return "";
  const pct = clamp(((price - low) / (high - low)) * 100, 0, 100);
  if (pct > 82) return "价格接近 52 周高位，估值容错率下降。";
  if (pct < 35) return "价格处于低位复核区，重点确认 thesis 是否未被破坏。";
  return "价格位于区间中段，等待催化剂或订单证据确认。";
}

function priceRangePercent(quote = {}) {
  const price = Number(quote.price);
  const high = Number(quote.fiftyTwoWeekHigh);
  const low = Number(quote.fiftyTwoWeekLow);
  if (![price, high, low].every(Number.isFinite) || high <= low) return null;
  return clamp(((price - low) / (high - low)) * 100, 0, 100);
}

function compactReason(value = "", limit = 92) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function playbookFor(stock) {
  const playbooks = {
    "cpo-silicon-photonics": {
      lens: "先确认 AI 集群带宽瓶颈，再看光模块、激光器、硅光、测试与制造谁在量产路径上不可替代。",
      focus: "核心不是“光通信上涨”，而是 800G/1.6T/CPO 从实验室走向量产时，哪家公司能把客户验证转成订单。",
      catalysts: ["1.6T 或 CPO 客户认证进入量产", "hyperscaler capex 继续上修", "激光/材料/测试产能被锁定", "财报电话会出现订单与良率细节"],
      checks: ["客户是否从样品验证进入批量采购", "毛利率是否能证明瓶颈价值", "产能扩张是否领先需求而不是被动追单", "同业价格战是否压缩技术溢价"],
    },
    "substrate-materials": {
      lens: "从光互连上游材料入手，判断 InP/砷化镓等衬底是否成为下游器件扩产的实际限制。",
      focus: "材料链的赔率来自冷门与稀缺，但必须用订单、产能和客户导入去证明不是纯题材。",
      catalysts: ["核心客户披露上游材料需求", "子公司上市或融资路径清晰", "产能利用率提升", "材料价格或交付周期变紧"],
      checks: ["衬底是否真在客户 BOM 里", "产能扩张是否有资金保障", "客户集中度是否过高", "周期回落时库存是否会反噬"],
    },
    neocloud: {
      lens: "把公司拆成电力、数据中心、GPU/ASIC 算力、云合同与融资能力五块，先看合同质量，再看资产重估。",
      focus: "NeoCloud 的故事只有在高利用率、低资金成本和长期客户合同同时成立时，才配得上高市值。",
      catalysts: ["新增长期云合同", "数据中心通电或交付里程碑", "GPU 利用率披露改善", "融资成本下降或资产证券化路径清楚"],
      checks: ["客户是否可验证且合同期限足够长", "折旧和电力成本是否吃掉利润", "capex 是否需要持续稀释", "收入确认是否跟交付节奏匹配"],
    },
    "memory-rotation": {
      lens: "用 HBM、DRAM 价格、供给纪律和 AI 服务器 BOM 占比判断周期是否仍在扩张。",
      focus: "记忆体不是早期冷门链路，重点要看价格上行是否还能覆盖估值与周期尾部风险。",
      catalysts: ["HBM 价格或产能持续紧张", "云厂商训练/推理需求上修", "同业维持供给纪律", "库存天数继续下降"],
      checks: ["周期顶部是否开始被定价", "传统 DRAM/NAND 是否拖累毛利", "资本开支是否过早扩张", "客户是否开始压价"],
    },
    "ai-infrastructure": {
      lens: "把大市值龙头当需求锚点：它们证明 AI capex 存在，但最高赔率通常外溢到更小的供应链瓶颈。",
      focus: "在大盘 AI 标的上，Serenity 框架更强调确定性、估值拥挤和供应链外溢，而不是单纯追 beta。",
      catalysts: ["AI capex 指引继续上修", "ASIC/网络/互连收入增速超预期", "客户集中风险下降", "供应链小节点被主流资金重新定价"],
      checks: ["估值是否已经充分反映 AI 增长", "增长是否被毛利和竞争吞噬", "资本开支回报周期是否拉长", "上游小票是否出现更优赔率"],
    },
    "capital-structure-veto": {
      lens: "先做一票否决：即使方向正确，只要 ATM、可转债、债务或持续融资会稀释股东，故事就必须降级。",
      focus: "这类标的不是不能研究，而是需要先证明资本结构不会吞掉业务 beta。",
      catalysts: ["撤销或放缓 ATM", "长期债务再融资成本下降", "云合同足以覆盖 capex", "管理层明确降低稀释路径"],
      checks: ["是否持续发行股票", "资产折旧速度是否过快", "债务期限是否短于现金流兑现", "矿转云是否只是叙事切换"],
    },
    general: {
      lens: "先确认这家公司是否有明确终端需求、可验证客户、可扩张 TAM 和合理资本结构。",
      focus: "若无法落在供应链瓶颈、需求锚点或资本结构改善上，就只能作为观察标的。",
      catalysts: ["业务数据连续改善", "客户或订单披露超预期", "估值回到合理区间", "管理层给出更清晰的资本配置"],
      checks: ["收入增长是否可持续", "利润率是否改善", "估值是否已经透支", "是否存在监管或融资风险"],
    },
  };
  return playbooks[stock.theme] || playbooks.general;
}

function scoreBreakdown(stock, quote = {}, metric = {}) {
  const mentions = Number(metric.mentions || 0);
  const bull = Number(metric.bull || 0);
  const bear = Number(metric.bear || 0);
  const neutral = Number(metric.neutral || 0);
  const total = Math.max(1, bull + bear + neutral);
  const marketCap = Number(quote.marketCap) || stock.fallbackMarketCap || 0;
  const mentionScore = clamp((mentions / 650) * 100, 18, 100);
  const sentimentScore = clamp(((bull - bear * 1.4) / total) * 100 + 58, 15, 100);
  const capScore = marketCap < 3e9 ? 94 : marketCap < 20e9 ? 82 : marketCap < 80e9 ? 68 : marketCap < 400e9 ? 55 : 38;
  const riskPenalty = (stock.riskFlag ? 22 : 0) + clamp((bear / total) * 60, 0, 18);
  const themeDemand = stock.theme === "ai-infrastructure" ? 91 : stock.theme === "cpo-silicon-photonics" ? 88 : stock.theme === "neocloud" ? 80 : 68;
  const chokepoint =
    stock.theme === "cpo-silicon-photonics" || stock.theme === "substrate-materials"
      ? 93
      : stock.theme === "capital-structure-veto"
        ? 38
        : stock.theme === "neocloud"
          ? 72
          : 58;

  return [
    { label: "终端需求", score: Math.round(clamp(themeDemand * 0.7 + mentionScore * 0.3, 20, 98)), note: "AI capex、云厂商需求或产业周期是否真实存在" },
    { label: "瓶颈位置", score: Math.round(chokepoint), note: "公司是否处在客户必须采购、短期难替代的供应链节点" },
    { label: "客户证据", score: Math.round(clamp(mentionScore * 0.55 + sentimentScore * 0.45, 18, 95)), note: "公开样本、订单、验证、管理层措辞能否互相印证" },
    { label: "市值赔率", score: Math.round(capScore), note: "市值越小且证据越早，重估弹性越大；大盘股更偏锚点" },
    { label: "风险控制", score: Math.round(clamp(86 - riskPenalty + (stock.riskFlag ? -10 : 0), 12, 92)), note: "融资、债务、客户集中、周期尾部和估值拥挤的综合约束" },
  ];
}

function decisionFor(stock, quote = quoteForStock(stock)) {
  const metric = metricForStock(stock) || {};
  const evidence = getCalledEvidence(stock, 3);
  const baseScore = scoreStock(stock, quote);
  const breakdown = scoreBreakdown(stock, quote, metric);
  const marketCap = Number(quote.marketCap) || stock.fallbackMarketCap || 0;
  const rangePct = priceRangePercent(quote);
  const playbook = playbookFor(stock);
  const isCore = !stock.isUniversal;
  const highMateriality = evidence.filter((item) => Number(item.materiality || 0) >= 70).length;
  let fit = baseScore;

  fit += isCore ? 7 : -18;
  fit += Math.min(8, evidence.length * 2 + highMateriality * 2);
  if (marketCap > 400e9) fit -= 8;
  if (marketCap > 1e12) fit -= 7;
  if (rangePct !== null && rangePct > 86) fit -= 6;
  if (rangePct !== null && rangePct < 38 && baseScore >= 62) fit += 4;
  if (stock.riskFlag || stock.theme === "capital-structure-veto") fit -= 20;
  fit = Math.round(clamp(fit, 5, 96));

  let actionLabel = "暂不优先";
  let actionClass = "avoid";
  let stance = "低优先级观察";
  if (stock.riskFlag || stock.theme === "capital-structure-veto") {
    actionLabel = "资本结构复核";
    actionClass = "avoid";
    stance = "融资/稀释风险优先处理";
  } else if (fit >= 82) {
    actionLabel = "重点覆盖";
    actionClass = "pursue";
    stance = "高优先级研究标的";
  } else if (fit >= 68) {
    actionLabel = "观察确认";
    actionClass = "watch";
    stance = "thesis 成立，等待增量确认";
  } else if (fit >= 52) {
    actionLabel = "补证据";
    actionClass = "verify";
    stance = isCore ? "有样本，赔率与催化仍需确认" : "通用初筛，缺少高确信度样本";
  }

  const capReason =
    marketCap < 5e9
      ? "小市值结构，若订单证据兑现，重估弹性较高。"
      : marketCap < 80e9
        ? "中等市值，弹性取决于客户证据和业绩兑现。"
        : "大市值属性更强，更多承担行业锚点而非高赔率表达。";
  const priceReason =
    rangePct === null
      ? "52 周区间缺失，价格位置待补。"
      : rangePct > 86
        ? "价格接近 52 周高位，估值容错率下降。"
        : rangePct < 38
          ? "价格处于低位复核区，适合确认基本面是否未被破坏。"
          : "价格位于区间中段，等待催化或客户证据更新。";
  const coverageReason = isCore
    ? `Serenity 样本 ${evidence.length} 条，可用于交叉验证。`
    : "非核心公开喊单，按通用美股框架初筛。";

  const reasons = [coverageReason, compactReason(stock.thesis), capReason, priceReason].filter(Boolean).slice(0, 4);
  const blockers = [
    compactReason(stock.risk),
    !isCore ? "缺少 Serenity 原始样本，高确信度不足。" : "",
    evidence.length < 2 ? "公开样本不足，需补原文、财报电话会或客户证据。" : "",
    rangePct !== null && rangePct > 86 ? "价格位置偏高，需新增订单或业绩上修支撑。" : "",
  ].filter(Boolean).slice(0, 4);
  const nextActions = (stock.isUniversal
    ? ["核查最近一季收入、利润率与现金流", "对比同行估值、增速与利润质量", "确认最新新闻是否改变订单、监管或资本结构"]
    : playbook.catalysts).slice(0, 4);
  const oneLine = isCore ? "核心变量是样本证据、价格位置和订单催化是否共振。" : "核心变量是终端需求、瓶颈位置和估值赔率是否同时成立。";

  return {
    fit,
    actionLabel,
    actionClass,
    stance,
    oneLine,
    reasons,
    blockers,
    nextActions,
    evidenceCount: evidence.length,
    baseScore,
    rangePct,
    topDriver: breakdown.slice().sort((a, b) => b.score - a.score)[0]?.label || "框架匹配",
  };
}

function factorTone(score) {
  if (score >= 82) return "pursue";
  if (score >= 68) return "watch";
  if (score >= 52) return "verify";
  return "avoid";
}

function capOddsScore(marketCap = 0) {
  if (!marketCap) return 46;
  if (marketCap < 3e9) return 94;
  if (marketCap < 20e9) return 84;
  if (marketCap < 80e9) return 70;
  if (marketCap < 400e9) return 54;
  return 36;
}

function daysSince(value) {
  const time = Date.parse(value || "");
  if (!Number.isFinite(time)) return null;
  return Math.max(0, (Date.now() - time) / 86_400_000);
}

function socialRecencyBonus(value) {
  const age = daysSince(value);
  if (age === null) return 0;
  if (age <= 14) return 10;
  if (age <= 45) return 6;
  if (age <= 90) return 2;
  return -4;
}

function socialMetricScore(metric = {}) {
  const mentions = Number(metric.mentions || 0);
  const materiality = Number(metric.materiality || 0);
  const sentiment = Math.max(0, Number(metric.sentimentScore || 0));
  return mentions * 1.35 + materiality * 2.8 + sentiment * 0.08 + socialRecencyBonus(metric.latest) * 18;
}

function socialHeatScore(metric = {}, stock = {}) {
  const mentions = Number(metric.mentions || 0);
  const bull = Number(metric.bull || 0);
  const bear = Number(metric.bear || 0);
  const neutral = Number(metric.neutral || 0);
  const total = Math.max(1, bull + bear + neutral);
  const materiality = Number(metric.materiality || 0);
  const sentiment = clamp(((bull - bear * 1.5) / total) * 38, -14, 18);
  return clamp((mentions / 260) * 52 + materiality * 0.3 + sentiment + socialRecencyBonus(metric.latest) + (stock.isSocialCandidate ? 5 : 0), 8, 98);
}

function isLikelyUsEquityCandidate(symbol = "", metric = {}) {
  const canonical = canonicalSymbol(symbol);
  if (!/^[A-Z]{1,5}F?$/.test(canonical)) return false;
  if (SOCIAL_SYMBOL_BLOCKLIST.has(canonical)) return false;
  const identity = identityForSymbol(canonical);
  const marketSymbol = normalizeSymbol(identity?.marketSymbol || metric.marketSymbol || canonical);
  if (marketSymbol.includes(".") && !canonical.endsWith("F")) return false;
  return true;
}

function topSocialMetrics(limit = SOCIAL_CANDIDATE_LIMIT) {
  const seen = new Set();
  const rows = [];
  const symbols = state.distillation?.symbols || [];
  for (const metric of symbols.slice().sort((a, b) => socialMetricScore(b) - socialMetricScore(a))) {
    const canonical = canonicalSymbol(metric.symbol);
    if (!canonical || seen.has(canonical)) continue;
    if (Number(metric.mentions || 0) < SOCIAL_MIN_MENTIONS) continue;
    if (!isLikelyUsEquityCandidate(canonical, metric)) continue;
    seen.add(canonical);
    rows.push({ ...metric, symbol: canonical, marketSymbol: metric.marketSymbol || marketSymbolFor(canonical) });
    if (rows.length >= limit) break;
  }
  return rows;
}

function topSocialSymbols(limit = SOCIAL_PREFETCH_LIMIT) {
  return topSocialMetrics(limit).map((metric) => metric.symbol);
}

function socialCandidateStocks(seenAliases = new Set(), limit = SOCIAL_CANDIDATE_LIMIT) {
  const rows = [];
  for (const metric of topSocialMetrics(limit * 2)) {
    const aliases = uniqueSymbols([metric.symbol, metric.marketSymbol, ...(metric.aliases || []), ...aliasesForSymbol(metric.symbol)]);
    if (aliases.some((alias) => seenAliases.has(alias))) continue;
    const stock = fallbackStock(metric.symbol);
    const latest = metric.latest ? `，最新样本 ${dateLabel(metric.latest)}` : "";
    rows.push({
      ...stock,
      source: "social",
      sourceLabel: "Twitter 热度",
      aliases: uniqueSymbols([...(stock.aliases || []), ...aliases]),
      marketSymbol: marketSymbolFor(metric.symbol) || metric.marketSymbol || stock.marketSymbol,
      theme: metric.dominantTheme || stock.theme || "general",
      themeLabel: themeNames[metric.dominantTheme] || stock.themeLabel || "社媒高热度",
      thesis: `X/Twitter 讨论度进入前列：${compact.format(Number(metric.mentions || 0))} 次提及，materiality ${Math.round(Number(metric.materiality || 0))}${latest}。先纳入候选池，再用客户验证、资本结构和价格确认做二次筛选。`,
      risk: "社媒热度只说明资金和叙事正在聚焦，不等于基本面确认；需补财报、公告、客户证据、估值和流动性核查。",
      isUniversal: true,
      isSocialCandidate: true,
      socialMetric: metric,
    });
    for (const alias of aliases) seenAliases.add(alias);
    if (rows.length >= limit) break;
  }
  return rows;
}

function themeScore(stock = {}, bucket = "demand") {
  const scores = {
    demand: {
      "ai-infrastructure": 90,
      "cpo-silicon-photonics": 88,
      "substrate-materials": 84,
      neocloud: 82,
      "memory-rotation": 76,
      "power-architecture": 78,
      "robotics-physical-ai": 74,
      "crypto-rotation": 58,
      "macro-hedge": 44,
      "capital-structure-veto": 45,
      general: 58,
    },
    bottleneck: {
      "cpo-silicon-photonics": 94,
      "substrate-materials": 92,
      neocloud: 78,
      "memory-rotation": 68,
      "power-architecture": 74,
      "robotics-physical-ai": 60,
      "crypto-rotation": 44,
      "macro-hedge": 38,
      "ai-infrastructure": 62,
      "capital-structure-veto": 35,
      general: 52,
    },
  };
  return scores[bucket]?.[stock.theme] || scores[bucket]?.general || 50;
}

function serenityScreenerModel(stock = {}, quote = quoteForStock(stock)) {
  const metric = stock.socialMetric || metricForStock(stock) || {};
  const evidence = getCalledEvidence(stock, 3);
  const marketCap = Number(quote.marketCap) || stock.fallbackMarketCap || 0;
  const rangePct = priceRangePercent(quote);
  const changePercent = Number(quote.changePercent);
  const mentions = Number(metric.mentions || 0);
  const bull = Number(metric.bull || 0);
  const bear = Number(metric.bear || 0);
  const neutral = Number(metric.neutral || 0);
  const total = Math.max(1, bull + bear + neutral);
  const highMateriality = evidence.filter((item) => Number(item.materiality || 0) >= 70).length;
  const metricMateriality = Number(metric.materiality || 0);

  const terminalDemand = clamp(themeScore(stock, "demand") + clamp(mentions / 70, 0, 14) + clamp(((bull - bear * 1.4) / total) * 12, -12, 12), 12, 98);
  const bottleneck = clamp(themeScore(stock, "bottleneck") + (highMateriality ? 4 : 0) + (metricMateriality >= 80 ? 3 : 0), 10, 98);
  const customerEvidence = clamp(
    34 + evidence.length * 10 + highMateriality * 6 + clamp(mentions / 50, 0, 16) + clamp(metricMateriality / 10, 0, 9) + clamp(((bull - bear) / total) * 14, -12, 14),
    12,
    96
  );
  const valuationOdds = clamp(capOddsScore(marketCap) + (rangePct !== null && rangePct < 38 ? 7 : 0) - (rangePct !== null && rangePct > 86 ? 12 : 0), 8, 96);
  const capitalStructure = clamp(
    stock.riskFlag || stock.theme === "capital-structure-veto" ? 24 : 90 - clamp((bear / total) * 34, 0, 24) - (/atm|dilution|debt|convertible|融资|稀释|债务/i.test(stock.risk || "") ? 12 : 0),
    6,
    95
  );
  const priceConfirmation = clamp(
    (rangePct === null ? 54 : rangePct > 88 ? 38 : rangePct > 70 ? 55 : rangePct < 35 ? 72 : 66) +
      (Number.isFinite(changePercent) && changePercent > 12 ? -14 : 0) +
      (Number.isFinite(changePercent) && changePercent > -4 && changePercent < 6 ? 5 : 0),
    10,
    92
  );
  const socialHeat = socialHeatScore(metric, stock);

  let score = Math.round(
    terminalDemand * 0.16 +
      bottleneck * 0.18 +
      customerEvidence * 0.18 +
      valuationOdds * 0.14 +
      capitalStructure * 0.14 +
      priceConfirmation * 0.08 +
      socialHeat * 0.12
  );
  if (capitalStructure < 45) score = Math.min(score, 52);
  if (stock.isUniversal && !stock.isSocialCandidate) score = Math.max(8, score - 14);
  if (stock.isSocialCandidate && evidence.length < 1) score = Math.max(8, score - 5);
  score = Math.round(clamp(score, 5, 98));

  const factors = [
    { key: "demand", label: "终端需求", score: Math.round(terminalDemand), note: "AI capex、云厂商需求或产业周期扩张" },
    { key: "bottleneck", label: "瓶颈位置", score: Math.round(bottleneck), note: "客户必须采购、短期难替代的供应链节点" },
    { key: "customer", label: "客户验证", score: Math.round(customerEvidence), note: "订单、认证、量产、财报措辞与公开样本" },
    { key: "valuation", label: "市值赔率", score: Math.round(valuationOdds), note: "市值越小、证据越早，重估弹性越高" },
    { key: "capital", label: "资本结构", score: Math.round(capitalStructure), note: "ATM、可转债、债务和稀释风险" },
    { key: "price", label: "价格确认", score: Math.round(priceConfirmation), note: "52 周位置、涨跌幅和追价风险" },
    { key: "social", label: "社媒热度", score: Math.round(socialHeat), note: "X/Twitter 提及量、材料性、情绪和样本新鲜度" },
  ];
  const vetoes = [
    capitalStructure < 45 ? "资本结构否决" : "",
    rangePct !== null && rangePct > 88 ? "价格接近 52 周高位" : "",
    evidence.length < 2 && !stock.isUniversal && !stock.isSocialCandidate ? "样本不足" : "",
    stock.isSocialCandidate ? "社媒热度待验证" : stock.isUniversal ? "非核心样本" : "",
  ].filter(Boolean);
  const primaryFactor = factors.slice().sort((a, b) => b.score - a.score)[0];
  let actionLabel = "过滤";
  let actionClass = "avoid";
  if (capitalStructure < 45) {
    actionLabel = "资本结构否决";
    actionClass = "avoid";
  } else if (score >= 82) {
    actionLabel = "高优先级";
    actionClass = "pursue";
  } else if (score >= 70) {
    actionLabel = "等待确认";
    actionClass = "watch";
  } else if (score >= 58) {
    actionLabel = "补证据";
    actionClass = "verify";
  }

  return {
    score,
    factors,
    actionLabel,
    actionClass,
    vetoes,
    primaryFactor,
    evidenceCount: evidence.length,
    factorMap: Object.fromEntries(factors.map((factor) => [factor.key, factor.score])),
  };
}

function screenerUniverse() {
  const seenAliases = new Set();
  const core = calledStocks.map((stock) => {
    const enriched = enrichStock({ ...stock, source: "core", sourceLabel: "核心池" });
    for (const alias of stockAliases(enriched)) seenAliases.add(alias);
    return enriched;
  });
  const social = socialCandidateStocks(seenAliases).map((stock) => enrichStock(stock));
  return [...core, ...social];
}

function screenerRows() {
  const query = normalizeSymbol(screenerSearch?.value || "");
  const theme = screenerTheme?.value || "all";
  const signal = screenerSignal?.value || "all";
  const sort = screenerSort?.value || "score";
  return screenerUniverse()
    .map((stock) => ({ stock, model: serenityScreenerModel(stock, stock.quote || {}) }))
    .filter(({ stock, model }) => {
      const haystack = `${stock.symbol} ${stock.aliases.join(" ")} ${stock.name} ${stock.themeLabel} ${stock.sourceLabel || ""} ${stock.thesis}`.toUpperCase();
      const queryOk = !query || haystack.includes(query);
      const themeOk = theme === "all" || stock.theme === theme;
      const signalOk =
        signal === "all" ||
        (signal === "priority" && model.actionClass === "pursue") ||
        (signal === "confirm" && model.actionClass === "watch") ||
        (signal === "verify" && model.actionClass === "verify") ||
        (signal === "social" && stock.isSocialCandidate) ||
        (signal === "veto" && model.vetoes.includes("资本结构否决"));
      return queryOk && themeOk && signalOk;
    })
    .sort((a, b) => {
      if (sort === "customer") return b.model.factorMap.customer - a.model.factorMap.customer;
      if (sort === "bottleneck") return b.model.factorMap.bottleneck - a.model.factorMap.bottleneck;
      if (sort === "valuation") return b.model.factorMap.valuation - a.model.factorMap.valuation;
      if (sort === "social") return b.model.factorMap.social - a.model.factorMap.social;
      if (sort === "price") return b.model.factorMap.price - a.model.factorMap.price;
      return b.model.score - a.model.score;
    });
}

function renderScreener() {
  if (!screenerList) return;
  const rows = screenerRows();
  const priorityCount = rows.filter((row) => row.model.actionClass === "pursue").length;
  const confirmCount = rows.filter((row) => row.model.actionClass === "watch").length;
  const vetoCount = rows.filter((row) => row.model.vetoes.includes("资本结构否决")).length;
  const socialCount = rows.filter((row) => row.stock.isSocialCandidate).length;
  const averageScore = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.model.score, 0) / rows.length) : 0;
  screenerStatus.textContent = `${rows.length} 支标的 · 高优先级 ${priorityCount} · 等待确认 ${confirmCount} · Twitter 热度 ${socialCount} · 资本结构否决 ${vetoCount}`;
  screenerFactorSummary.innerHTML = [
    ["平均综合分", averageScore || "--"],
    ["高优先级", priorityCount],
    ["Twitter 热度", socialCount],
    ["资本结构否决", vetoCount],
  ]
    .map(([label, value]) => `<span><b>${escapeHtml(value)}</b><small>${escapeHtml(label)}</small></span>`)
    .join("");

  screenerList.innerHTML = rows
    .slice(0, 30)
    .map(({ stock, model }) => {
      const quote = stock.quote || {};
      const changeClass = Number(quote.changePercent) >= 0 ? "up" : "down";
      const metric = stock.socialMetric || stock.metric || {};
      const sourceLabel = stock.sourceLabel || "核心池";
      const socialMeta = Number(metric.mentions || 0) ? ` · X ${compact.format(Number(metric.mentions || 0))} 提及` : "";
      return `
        <button class="screener-row ${escapeHtml(model.actionClass)} ${stock.isSocialCandidate ? "social" : "core"}" type="button" data-symbol="${escapeHtml(stock.symbol)}" data-source="${stock.isSocialCandidate ? "social" : "core"}">
          <span class="screener-score">
            <b>${model.score}</b>
            <small>综合分</small>
          </span>
          <span class="screener-main">
            <strong>${escapeHtml(stock.symbol)} · ${escapeHtml(stock.name)}</strong>
            <small>${escapeHtml(sourceLabel)} · ${escapeHtml(model.primaryFactor.label)} ${model.primaryFactor.score}/100 · ${escapeHtml(stock.themeLabel)} · ${formatMarketCap(stock.marketCap)} · <em class="${changeClass}">${formatPercent(quote.changePercent)}</em>${escapeHtml(socialMeta)}</small>
            <i>${escapeHtml(model.vetoes.length ? model.vetoes.join(" / ") : stock.thesis)}</i>
          </span>
          <span class="decision-pill ${escapeHtml(model.actionClass)}">${escapeHtml(model.actionLabel)}</span>
          <span class="factor-bars">
            ${model.factors
              .map(
                (factor) => `
                  <i title="${escapeHtml(factor.label)} ${factor.score}/100">
                    <b style="height:${factor.score}%"></b>
                    <small>${escapeHtml(factor.label.slice(0, 2))}</small>
                  </i>
                `
              )
              .join("")}
          </span>
        </button>
      `;
    })
    .join("");
}

function beginnerTradeAssessment(stock, quote = {}, decision = decisionFor(stock, quote), space = upsideSpace(decision.baseScore || 60, stock)) {
  const price = Number(quote.price);
  const changePercent = Number(quote.changePercent);
  const marketCap = Number(quote.marketCap) || stock.fallbackMarketCap || 0;
  const rangePct = decision.rangePct ?? priceRangePercent(quote);
  const evidenceCount = Number(decision.evidenceCount || 0);
  const reasons = [];
  let score = Number(decision.fit || 50);

  if (stock.riskFlag || stock.theme === "capital-structure-veto") {
    score -= 34;
    reasons.push("资本结构/稀释风险未解除，暂不建立多头仓位。");
  }
  if (stock.isUniversal) {
    score -= 14;
    reasons.push("非 Serenity 核心样本，按通用美股框架降级处理。");
  }
  if (evidenceCount < 2 && !stock.isUniversal) {
    score -= 8;
    reasons.push("公开样本不足，需补原文与财报证据。");
  }
  if (Number.isFinite(changePercent) && changePercent > 18) {
    score -= 30;
    reasons.push("当日涨幅过大，不建议追价。");
  } else if (Number.isFinite(changePercent) && changePercent > 8) {
    score -= 16;
    reasons.push("短线已反映预期，等待回踩或放量确认。");
  }
  if (Number.isFinite(changePercent) && changePercent < -14) {
    score -= 14;
    reasons.push("价格快速下跌，先排除财报、融资或消息反证。");
  }
  if (Number.isFinite(rangePct) && rangePct > 88) {
    score -= 16;
    reasons.push("接近 52 周高位，风险收益比下降。");
  } else if (Number.isFinite(rangePct) && rangePct < 38 && !stock.riskFlag) {
    score += 5;
    reasons.push("处于低位复核区，优先验证 thesis 完整性。");
  }
  if (marketCap > 400e9) {
    score -= 5;
    reasons.push("市值较大，更多体现行业 beta，赔率弹性有限。");
  }
  if (marketCap > 0 && marketCap < 5e9 && !stock.riskFlag) {
    score += 4;
    reasons.push("小市值弹性较高，但需严格控制仓位波动。");
  }
  if (!Number.isFinite(price) || price <= 0) {
    score -= 20;
    reasons.push("缺少可用价格，不能计算仓位和止损。");
  }

  score = Math.round(clamp(score, 1, 100));
  const hotPrice = Number.isFinite(changePercent) && changePercent > 12;
  const highRange = Number.isFinite(rangePct) && rangePct > 86;
  let verdict = "observe";
  if (stock.riskFlag || stock.theme === "capital-structure-veto" || score < 42 || (hotPrice && highRange)) {
    verdict = "blocked";
  } else if (score >= 76 && !hotPrice && !highRange) {
    verdict = "ready";
  } else if (score >= 58) {
    verdict = "wait";
  }

  const copy = {
    ready: {
      label: "试探仓",
      className: "ready",
      summary: "允许按风险预算建立试探仓，不追价加仓。",
      allowed: true,
      pullbackPercent: 3,
      stopPercent: clamp(Math.min(Number(space.downside || 28) * 0.32, 12), 6, 12),
    },
    wait: {
      label: "等待确认",
      className: "wait",
      summary: "等待回踩、放量续强或新增订单/财报证据。",
      allowed: false,
      pullbackPercent: Number.isFinite(changePercent) && changePercent > 8 ? 6 : 4,
      stopPercent: 7,
    },
    observe: {
      label: "只观察",
      className: "observe",
      summary: "仅纳入观察池，暂不建立实盘仓位。",
      allowed: false,
      pullbackPercent: 5,
      stopPercent: 6,
    },
    blocked: {
      label: "暂不参与",
      className: "blocked",
      summary: "风险或价格结构不达标，等待反证解除。",
      allowed: false,
      pullbackPercent: 8,
      stopPercent: 0,
    },
  }[verdict];

  const buyRules = [
    `执行评级需维持“${copy.label}”或更高。`,
    hotPrice ? "当日大涨后不追价，等待回踩或收盘确认。" : "入场前确认量价延续，同主题标的同步。",
    stock.isUniversal ? "补最近财报、公告和同行估值。" : "复核 Serenity 原文语义及反证线索。",
  ];
  const invalidations = [
    "跌破止损或 thesis 被财报/公告证伪。",
    "出现融资、ATM、债务压力或客户延迟。",
    "同主题龙头不同步，或成交量无法延续。",
  ];

  return {
    verdict,
    score,
    label: copy.label,
    className: copy.className,
    summary: copy.summary,
    allowed: copy.allowed,
    pullbackPercent: copy.pullbackPercent,
    stopPercent: copy.stopPercent,
    reasons: reasons.length ? reasons.slice(0, 4) : decision.reasons.slice(0, 3),
    buyRules,
    invalidations,
  };
}

function beginnerPositionPlan(quote = {}, profile = state.beginnerProfile || defaultBeginnerProfile(), assessment = {}, space = {}) {
  const normalizedProfile = normalizeBeginnerProfile(profile);
  const price = Number(quote.price);
  const riskBudget = normalizedProfile.accountSize * (normalizedProfile.riskPercent / 100);
  const maxPositionBudget = normalizedProfile.accountSize * (normalizedProfile.maxPositionPercent / 100);
  const allowRealTrade = Boolean(assessment.allowed && Number.isFinite(price) && price > 0);
  const stopPercent = allowRealTrade ? Number(assessment.stopPercent || 8) : Number(assessment.stopPercent || 0);
  const stopPrice = allowRealTrade ? price * (1 - stopPercent / 100) : null;
  const riskPerShare = allowRealTrade ? Math.max(0.01, price - stopPrice) : null;
  const riskSizedShares = allowRealTrade ? riskBudget / riskPerShare : 0;
  const capSizedShares = allowRealTrade ? maxPositionBudget / price : 0;
  const fractionalShares = Math.max(0, Math.min(riskSizedShares, capSizedShares));
  const wholeShares = Math.floor(fractionalShares);
  const positionCost = allowRealTrade ? fractionalShares * price : 0;
  const wholeShareCost = allowRealTrade ? wholeShares * price : 0;
  const riskUsed = allowRealTrade ? fractionalShares * riskPerShare : 0;
  const targetOnePct = clamp(Number(space.upside || 20) * 0.24, 6, 32);
  const targetTwoPct = clamp(Number(space.upside || 40) * 0.55, 12, 78);
  const watchEntry = Number.isFinite(price) && price > 0 ? price * (1 - Number(assessment.pullbackPercent || 4) / 100) : null;

  return {
    allowRealTrade,
    riskBudget,
    maxPositionBudget,
    stopPercent,
    stopPrice,
    riskPerShare,
    fractionalShares,
    wholeShares,
    positionCost,
    wholeShareCost,
    riskUsed,
    targetOne: Number.isFinite(price) ? price * (1 + targetOnePct / 100) : null,
    targetTwo: Number.isFinite(price) ? price * (1 + targetTwoPct / 100) : null,
    watchEntry,
    accountSize: normalizedProfile.accountSize,
    riskPercent: normalizedProfile.riskPercent,
    maxPositionPercent: normalizedProfile.maxPositionPercent,
  };
}

function paperTradeReturn(trade = {}) {
  const quote = state.quotes.get(normalizeSymbol(trade.symbol)) || {};
  const currentPrice = Number(quote.price);
  const entryPrice = Number(trade.entryPrice);
  if (!Number.isFinite(currentPrice) || !Number.isFinite(entryPrice) || entryPrice <= 0) return null;
  return ((currentPrice - entryPrice) / entryPrice) * 100;
}

function addPaperTrade(stock, quote = {}, assessment = {}, plan = {}) {
  const price = Number(quote.price);
  if (!Number.isFinite(price) || price <= 0) return false;
  const symbol = normalizeSymbol(stock.symbol);
  state.paperTrades = state.paperTrades.filter((trade) => normalizeSymbol(trade.symbol) !== symbol);
  state.paperTrades.unshift({
    id: `${symbol}-${Date.now()}`,
    symbol,
    name: stock.name,
    entryPrice: price,
    stopPrice: plan.stopPrice || plan.watchEntry || null,
    targetOne: plan.targetOne || null,
    targetTwo: plan.targetTwo || null,
    plannedCost: plan.positionCost || 0,
    shares: plan.fractionalShares || 0,
    verdict: assessment.label,
    createdAt: Date.now(),
    thesis: compactReason(stock.thesis, 120),
  });
  savePaperTrades();
  return true;
}

function deletePaperTrade(id) {
  state.paperTrades = state.paperTrades.filter((trade) => trade.id !== id);
  savePaperTrades();
}

function priceAlertLabel(kind = "") {
  return (
    {
      pullback: "等回踩",
      breakout: "突破确认",
      stop: "止损/观察线",
    }[kind] || "价格提醒"
  );
}

function suggestedPriceAlert(stock, quote = {}, plan = {}, kind = "pullback") {
  const price = Number(quote.price);
  if (!Number.isFinite(price) || price <= 0) return null;
  if (kind === "breakout") {
    return {
      kind,
      direction: "above",
      targetPrice: price * 1.04,
      note: "突破现价上方约 4% 且放量后，重新评估执行评级。",
    };
  }
  if (kind === "stop") {
    const targetPrice = Number(plan.stopPrice) || price * 0.93;
    return {
      kind,
      direction: "below",
      targetPrice,
      note: "跌破止损或观察线后，先复盘 thesis，不做情绪补仓。",
    };
  }
  return {
    kind: "pullback",
    direction: "below",
    targetPrice: Number(plan.watchEntry) || price * 0.96,
    note: "等回踩到更舒服的位置，再检查成交量、同主题扩散和反证。",
  };
}

function addPriceAlert(stock, quote = {}, plan = {}, kind = "pullback") {
  const suggestion = suggestedPriceAlert(stock, quote, plan, kind);
  if (!suggestion) return false;
  const symbol = normalizeSymbol(stock.symbol || quote.symbol || quote.requestedSymbol);
  const id = `${symbol}-${suggestion.kind}`;
  const existing = state.priceAlerts.find((alert) => alert.id === id);
  const nextAlert = {
    id,
    symbol,
    name: stock.name || symbol,
    kind: suggestion.kind,
    direction: suggestion.direction,
    targetPrice: Number(suggestion.targetPrice),
    note: suggestion.note,
    sourcePrice: Number(quote.price),
    createdAt: Date.now(),
    triggeredAt: null,
  };
  if (existing) Object.assign(existing, nextAlert);
  else state.priceAlerts.unshift(nextAlert);
  savePriceAlerts();
  checkPriceAlerts();
  return true;
}

function deletePriceAlert(id) {
  state.priceAlerts = state.priceAlerts.filter((alert) => alert.id !== id);
  savePriceAlerts();
}

function priceAlertEvaluation(alert = {}) {
  const quote = state.quotes.get(normalizeSymbol(alert.symbol)) || {};
  const currentPrice = Number(quote.price);
  const targetPrice = Number(alert.targetPrice);
  const hasPrice = Number.isFinite(currentPrice) && currentPrice > 0 && Number.isFinite(targetPrice) && targetPrice > 0;
  const isTriggered =
    Boolean(alert.triggeredAt) ||
    (hasPrice && alert.direction === "above" && currentPrice >= targetPrice) ||
    (hasPrice && alert.direction === "below" && currentPrice <= targetPrice);
  const distancePercent = hasPrice ? ((currentPrice - targetPrice) / targetPrice) * 100 : null;
  return { quote, currentPrice, targetPrice, hasPrice, isTriggered, distancePercent };
}

function checkPriceAlerts() {
  let changed = false;
  for (const alert of state.priceAlerts) {
    if (alert.triggeredAt) continue;
    const evaluation = priceAlertEvaluation(alert);
    if (!evaluation.isTriggered) continue;
    alert.triggeredAt = Date.now();
    state.lastPriceAlertTriggeredAt = Date.now();
    changed = true;
  }
  if (changed) savePriceAlerts();
  return changed;
}

async function refreshPriceAlertQuotes(force = false) {
  const activeAlerts = state.priceAlerts.filter((alert) => !alert.triggeredAt);
  if (!activeAlerts.length) return false;
  if (!force && Date.now() - state.lastPriceAlertQuoteAt < PRICE_ALERT_QUOTE_MS) return false;
  state.lastPriceAlertQuoteAt = Date.now();
  const quotes = await fetchQuotesForSymbols(activeAlerts.map((alert) => alert.symbol));
  for (const [symbol, quote] of quotes.entries()) state.quotes.set(symbol, quote);
  return checkPriceAlerts();
}

function renderInlinePriceAlerts(symbol = "") {
  const normalized = normalizeSymbol(symbol);
  const alerts = state.priceAlerts.filter((alert) => normalizeSymbol(alert.symbol) === normalized);
  if (!alerts.length) return `<small>还没有为 ${escapeHtml(normalized)} 设置买点提醒。</small>`;
  return alerts
    .map((alert) => {
      const evaluation = priceAlertEvaluation(alert);
      const status = evaluation.isTriggered ? "已触发" : alert.direction === "above" ? "等待突破" : "等待回踩";
      return `
        <span class="${evaluation.isTriggered ? "triggered" : ""}">
          <b>${escapeHtml(priceAlertLabel(alert.kind))}</b>
          <small>${escapeHtml(status)} · ${formatMoney(alert.targetPrice)}${evaluation.hasPrice ? ` · 当前 ${formatMoney(evaluation.currentPrice)}` : ""}</small>
        </span>
      `;
    })
    .join("");
}

function scenarioSet(score, stock, quote, space) {
  const baseUpside = Math.max(5, Math.round(space.upside * 0.36));
  return [
    {
      label: "Bull Case",
      tag: "上修",
      range: `+${space.upside}%`,
      body: "客户验证进入量产，AI capex 继续上修，市场按瓶颈资产重估。",
    },
    {
      label: "Base Case",
      tag: "基准",
      range: `+${baseUpside}%`,
      body: `${stock.themeLabel} thesis 维持，等待财报、客户或产能数据确认。`,
    },
    {
      label: "Bear Case",
      tag: "下修",
      range: `-${space.downside}%`,
      body: "客户导入推迟、订单低于预期，或融资/债务压力上升。",
    },
  ];
}

function plainReportText(stock, quote, score, space, playbook, breakdown, scenarios, evidence, metric, extras = {}) {
  const profile = profileForQuote(quote);
  const decision = extras.decision || decisionFor(stock, quote);
  const priceSummary = pricePositionSummary(quote);
  const lines = [
    `${stock.symbol} · ${stock.name}`,
    `投资观点：${decision.actionLabel} · 框架匹配 ${decision.fit}/100 · Serenity 分 ${score}`,
    `结论：${conclusionFor(score, stock)}。${decision.oneLine}`,
    `市场数据：价格 ${formatPrice(quote)} · 当日 ${formatPercent(quote.changePercent)} · 市值 ${formatMarketCap(Number(quote.marketCap) || stock.fallbackMarketCap)} · ${priceSummary.label}`,
    `风险收益：验证上行 +${space.upside}% / 反证下行 -${space.downside}%`,
    extras.beginner
      ? `执行纪律：${extras.beginner.label} · ${extras.beginner.score}/100 · ${extras.beginner.summary}`
      : "",
    extras.positionPlan
      ? `风险预算：单笔风险 ${formatMoney(extras.positionPlan.riskBudget)} · 仓位上限 ${formatMoney(extras.positionPlan.maxPositionBudget)} · 止损 ${extras.positionPlan.stopPrice ? formatMoney(extras.positionPlan.stopPrice) : "待定"}`
      : "",
    profile.sector || profile.industry ? `行业：${[profile.sector, profile.industry].filter(Boolean).join(" / ")}` : "",
    stock.isUniversal
      ? "覆盖状态：通用美股初筛，非 Serenity 核心公开样本。"
      : `提及结构：${compact.format(metric.mentions || 0)} 次提及，多 ${metric.bull || 0} / 空 ${metric.bear || 0} / 中性 ${metric.neutral || 0}`,
    "",
    "核心依据：",
    ...decision.reasons.slice(0, 3).map((item, index) => `${index + 1}. ${item}`),
    "",
    "催化剂：",
    ...decision.nextActions.slice(0, 3).map((item, index) => `${index + 1}. ${item}`),
    "",
    "评分因子：",
    ...breakdown.slice(0, 5).map((item) => `${item.label} ${item.score}/100`),
  ];
  if (extras.marketRows?.length || extras.financialRows?.length) {
    lines.push("", "关键数据：");
    for (const row of (extras.marketRows || []).slice(0, 4)) lines.push(`- ${row.label}：${row.value}`);
    for (const row of (extras.financialRows || []).slice(0, 3)) lines.push(`- ${row.label}：${row.value}`);
  }
  if (extras.peers?.length) lines.push("", `同行候选：${extras.peers.join(" / ")}`);
  if (extras.execution?.length) {
    lines.push("", "执行清单：");
    for (const item of extras.execution) lines.push(`- ${item.label}｜${item.value}：${item.body}`);
  }
  if (extras.dataConfidence) {
      lines.push("", `数据完整度：${extras.dataConfidence.label} · ${extras.dataConfidence.score}/100`);
    for (const item of (extras.dataConfidence.items || []).slice(0, 4)) lines.push(`- ${item}`);
  }
  lines.push(
    "",
    "后续跟踪：",
    ...playbook.catalysts.slice(0, 3).map((item, index) => `${index + 1}. ${item}`),
    "",
    "反证清单：",
    `1. ${stock.risk}`,
    ...playbook.checks.slice(0, 3).map((item, index) => `${index + 2}. ${item}`)
  );
  if (evidence.length) {
    lines.push("", "核心样本：", ...evidence.slice(0, 3).map((item) => `- ${dateLabel(item.date)} ${item.title || item.body || item.url || "Serenity 公开样本"}`));
  }
  if (extras.news?.length) {
    lines.push("", "最新公开新闻：", ...extras.news.slice(0, 3).map((item) => `- ${formatNewsDate(item.date)} ${item.publisher || ""} ${item.title}`));
  }
  lines.push("", "公开资料整理，不构成投资建议。");
  return lines.filter((line) => line !== "").join("\n");
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the textarea fallback for local HTTP or restricted browsers.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

function binanceWalletLink(label = "去 Binance 钱包下单") {
  return `<a class="secondary binance-order-link" href="${BINANCE_WALLET_REFERRAL_URL}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function formatBstockPrice(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "--";
  return usd.format(num);
}

function formatBstockVolume(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "--";
  return `$${compact.format(num)}`;
}

function bstockRows() {
  const byPair = new Map((state.bstocks || []).map((item) => [normalizeSymbol(item.pair || item.symbol), item]));
  return BSTOCK_SYMBOLS.map((meta) => {
    const live = byPair.get(meta.pair) || {};
    return {
      ...meta,
      ...live,
      symbol: meta.symbol,
      pair: meta.pair,
      displayPair: meta.displayPair,
      equity: meta.equity,
      name: live.name || meta.name,
      themeLabel: live.themeLabel || meta.themeLabel,
      thesis: live.thesis || meta.thesis,
    };
  });
}

function renderBStocks() {
  if (!bstockList) return;
  const rows = bstockRows();
  const liveRows = rows.filter((item) => Number.isFinite(Number(item.price)) && Number(item.price) > 0);
  const topMover = liveRows
    .slice()
    .sort((a, b) => Math.abs(Number(b.changePercent || 0)) - Math.abs(Number(a.changePercent || 0)))[0];
  const totalQuoteVolume = liveRows.reduce((sum, item) => sum + (Number(item.quoteVolume) || 0), 0);
  const updatedAt = state.bstockUpdatedAt || liveRows.map((item) => Number(item.updatedAt || 0)).filter(Boolean).sort((a, b) => b - a)[0];

  if (bstockStatus) {
    const prefix = state.bstockLoading ? "同步中" : liveRows.length ? "Binance Spot 实时盘口" : "等待 Binance 行情";
    const suffix = state.bstockError ? ` · ${state.bstockError}` : updatedAt ? ` · ${dateTimeLabel(updatedAt)}` : "";
    bstockStatus.textContent = `${prefix} · ${liveRows.length}/${BSTOCK_SYMBOLS.length} 个 bStock 交易对${suffix}`;
  }

  if (bstockSummary) {
    bstockSummary.innerHTML = [
      ["覆盖交易对", `${liveRows.length || BSTOCK_SYMBOLS.length}/${BSTOCK_SYMBOLS.length}`],
      ["24h 最活跃", topMover ? `${topMover.symbol} ${formatPercent(topMover.changePercent)}` : "--"],
      ["24h 成交额", formatBstockVolume(totalQuoteVolume)],
      ["执行路径", "研报先行 / 钱包确认"],
    ]
      .map(([label, value]) => `<span><b>${escapeHtml(value)}</b><small>${escapeHtml(label)}</small></span>`)
      .join("");
  }

  bstockList.innerHTML = rows
    .map((item) => {
      const change = Number(item.changePercent);
      const changeClass = Number.isFinite(change) && change >= 0 ? "up" : "down";
      const liveOk = Number.isFinite(Number(item.price)) && Number(item.price) > 0;
      const rangeText =
        Number.isFinite(Number(item.lowPrice)) && Number.isFinite(Number(item.highPrice))
          ? `${formatBstockPrice(item.lowPrice)} - ${formatBstockPrice(item.highPrice)}`
          : "--";
      return `
        <article class="bstock-card ${changeClass}">
          <div class="bstock-token">
            <span>BINANCE bSTOCK</span>
            <strong>${escapeHtml(item.displayPair)}</strong>
            <small>${escapeHtml(item.name)} · ${escapeHtml(item.themeLabel)}</small>
          </div>
          <div class="bstock-price">
            <b>${formatBstockPrice(item.price)}</b>
            <em class="${changeClass}">${formatPercent(item.changePercent)}</em>
          </div>
          <div class="bstock-metrics">
            <span><small>24h 成交额</small><b>${formatBstockVolume(item.quoteVolume)}</b></span>
            <span><small>24h 区间</small><b>${escapeHtml(rangeText)}</b></span>
            <span><small>交易笔数</small><b>${Number.isFinite(Number(item.trades)) ? compact.format(Number(item.trades)) : "--"}</b></span>
          </div>
          <p>${escapeHtml(liveOk ? item.thesis : "Binance 行情暂未回填，保留 bStock 观察入口。")}</p>
          <div class="bstock-actions">
            <button class="secondary" type="button" data-symbol="${escapeHtml(item.equity)}">看 ${escapeHtml(item.equity)} 研报</button>
            <a class="binance-order-link" href="${BINANCE_WALLET_REFERRAL_URL}" target="_blank" rel="noreferrer">打开 Binance 钱包</a>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadBStocks() {
  state.bstockLoading = true;
  state.bstockError = "";
  renderBStocks();
  try {
    const data = await fetchJson(BSTOCK_API_PATH);
    state.bstocks = Array.isArray(data.items) ? data.items : [];
    state.bstockUpdatedAt = data.updatedAt || Date.now();
    state.bstockError = data.error || "";
  } catch (error) {
    state.bstockError = error.message || "行情接口暂不可用";
  } finally {
    state.bstockLoading = false;
    renderBStocks();
  }
}

function enrichStock(stock) {
  const quote = quoteForStock(stock);
  const metric = metricForStock(stock) || {};
  return {
    ...stock,
    quote,
    metric,
    marketCap: stockMarketCap(stock),
    score: scoreStock(stock, quote),
  };
}

function renderHeroStats() {
  const parsed = state.distillation?.parsedItems || 0;
  const comments = state.distillation?.commentCount || state.tweets?.commentCount || 0;
  const profileTweets = state.tweets?.fxTwitterProfile?.tweets || 0;
  const usCount = calledStocks.length;
  heroStats.innerHTML = `
    <span><b>${compact.format(parsed)}</b>公开样本索引</span>
    <span><b>${compact.format(comments)}</b>评论与转述样本</span>
    <span><b>${compact.format(profileTweets)}</b>X 公开口径</span>
    <span><b>${usCount}</b>覆盖美股/OTC</span>
  `;
}

function renderMethodList() {
  const rules = (state.distillation?.rules || [])
    .slice(0, 6)
    .map((rule) => ({ title: rule.rule, weight: rule.weight, body: rule.evidence }));
  methodList.innerHTML = rules
    .map(
      (rule) => `
        <article class="method-card">
          <strong>${escapeHtml(rule.title)} <b>${rule.weight}</b></strong>
          <p>${escapeHtml(rule.body)}</p>
        </article>
      `
    )
    .join("");
}

function renderQuickTickers() {
  const symbols = ["AAOI", "AXTI", "MRVL", "NBIS", "IREN", "AEHR", "SIVEF", "NVDA"];
  quickTickers.innerHTML = `
    <span class="quick-label">常用研究模板</span>
    ${symbols.map((symbol) => `<button type="button" data-symbol="${symbol}">${symbol}</button>`).join("")}
  `;
}

function renderTickerSuggestions() {
  const seen = new Set();
  const options = [];
  for (const stock of [...calledStocks.map(enrichStock), ...socialCandidateStocks(new Set(), 12).map(enrichStock)]) {
    if (seen.has(stock.symbol)) continue;
    seen.add(stock.symbol);
    options.push(`<option value="${escapeHtml(stock.symbol)}">${escapeHtml(stock.name)}</option>`);
  }
  tickerSuggestions.innerHTML = options.join("");
}

function renderStockList() {
  const query = normalizeSymbol(stockSearch.value);
  const theme = themeFilter.value;
  const sort = sortMode.value;
  const stocks = calledStocks
    .map(enrichStock)
    .filter((stock) => {
      const haystack = `${stock.symbol} ${stock.aliases.join(" ")} ${stock.name} ${stock.themeLabel} ${stock.thesis}`.toUpperCase();
      const queryOk = !query || haystack.includes(query);
      const themeOk = theme === "all" || stock.theme === theme;
      return queryOk && themeOk;
    })
    .sort((a, b) => {
      if (sort === "marketCap") return b.marketCap - a.marketCap;
      if (sort === "mentions") return Number(b.metric.mentions || 0) - Number(a.metric.mentions || 0);
      if (sort === "change") return Number(b.quote.changePercent || -999) - Number(a.quote.changePercent || -999);
      return b.score - a.score || b.marketCap - a.marketCap;
    });

  state.renderedStocks = stocks;
  const liveCaps = stocks.filter((stock) => Number(stock.quote.marketCap)).length;
  listStatus.textContent = `${stocks.length} 支覆盖标的 · ${liveCaps} 支市值来自公开行情接口 · 点击任意一行即可生成完整单股 memo`;
  stockList.innerHTML = stocks
    .map((stock) => {
      const quote = stock.quote || {};
      const changeClass = Number(quote.changePercent) >= 0 ? "up" : "down";
      const metric = stock.metric || {};
      const decision = decisionFor(stock, quote);
      const selected = normalizeSymbol(stock.symbol) === normalizeSymbol(state.activeSymbol) ? " selected" : "";
      return `
        <button class="stock-row${selected}" type="button" data-symbol="${escapeHtml(stock.symbol)}">
          <span class="stock-id">
            <strong>${escapeHtml(stock.symbol)}</strong>
            <small>${escapeHtml(stock.name)}</small>
            <i>${escapeHtml(themeNames[stock.theme] || stock.themeLabel)}</i>
          </span>
          <span class="stock-thesis">
            <b>${escapeHtml(stock.themeLabel)}</b>
            <small>${escapeHtml(stock.thesis)}</small>
          </span>
          <span class="metric">
            <small>市值</small>
            <b>${formatMarketCap(stock.marketCap)}</b>
          </span>
          <span class="metric ${changeClass}">
            <small>价格 / 涨跌</small>
            <b>${formatPrice(quote)}</b>
            <small>${formatPercent(quote.changePercent)}</small>
          </span>
          <span class="metric">
            <small>动作 / 匹配度</small>
            <b>${escapeHtml(decision.actionLabel)}</b>
            <small>${decision.fit}/100 · ${compact.format(metric.mentions || 0)} mentions</small>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderOpportunityList() {
  const stocks = calledStocks
    .map(enrichStock)
    .map((stock) => ({ stock, decision: decisionFor(stock, stock.quote) }))
    .sort((a, b) => b.decision.fit - a.decision.fit || b.stock.score - a.stock.score)
    .slice(0, 6);

  opportunityList.innerHTML = stocks
    .map(({ stock, decision }, index) => {
      const quote = stock.quote || {};
      const changeClass = Number(quote.changePercent) >= 0 ? "up" : "down";
      return `
        <button class="opportunity-card ${escapeHtml(decision.actionClass)}" type="button" data-symbol="${escapeHtml(stock.symbol)}">
          <span class="opportunity-rank">${String(index + 1).padStart(2, "0")}</span>
          <span class="opportunity-main">
            <strong>${escapeHtml(stock.symbol)} · ${escapeHtml(stock.name)}</strong>
            <small>${escapeHtml(decision.oneLine)}</small>
          </span>
          <span class="opportunity-fit">
            <b>${decision.fit}</b>
            <small>匹配度</small>
          </span>
          <span class="decision-pill ${escapeHtml(decision.actionClass)}">${escapeHtml(decision.actionLabel)}</span>
          <span class="opportunity-meta">
            <small>${escapeHtml(stock.themeLabel)}</small>
            <b>${formatMarketCap(stock.marketCap)}</b>
            <i class="${changeClass}">${formatPercent(quote.changePercent)}</i>
          </span>
        </button>
      `;
    })
    .join("");
}

function historyKey(record = {}) {
  return `${record.symbol}:${record.id}`;
}

function shortTitle(value = "", limit = 150) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
}

const zhPhraseMap = [
  ["co-packaged optics", "共封装光学"],
  ["silicon photonics", "硅光"],
  ["optical transceiver", "光模块"],
  ["data center", "数据中心"],
  ["hyperscaler", "超大规模云厂商"],
  ["ai capex", "AI 资本开支"],
  ["capital expenditure", "资本开支"],
  ["free cash flow", "自由现金流"],
  ["gross margin", "毛利率"],
  ["operating margin", "营业利润率"],
  ["revenue growth", "收入增长"],
  ["earnings call", "财报电话会"],
  ["guidance raise", "上调指引"],
  ["customer concentration", "客户集中"],
  ["supply chain", "供应链"],
  ["short interest", "空头持仓"],
  ["days to cover", "空头回补天数"],
  ["price target", "目标价"],
  ["market cap", "市值"],
  ["52 week high", "52 周高点"],
  ["52 week low", "52 周低点"],
  ["after hours", "盘后"],
  ["pre market", "盘前"],
  ["breakout", "突破"],
  ["pullback", "回踩"],
  ["risk reward", "风险收益比"],
  ["upside", "上行空间"],
  ["downside", "下行风险"],
  ["dilution", "稀释"],
  ["convertible debt", "可转债"],
  ["atm offering", "ATM 增发"],
  ["backlog", "积压订单"],
  ["bookings", "新增订单"],
  ["order book", "订单簿"],
  ["utilization", "利用率"],
  ["ramp", "爬坡"],
  ["validation", "客户验证"],
  ["qualification", "认证"],
  ["production", "量产"],
  ["volume production", "批量生产"],
  ["winner", "赢家"],
  ["long", "看多"],
  ["short", "做空"],
  ["buy", "买入"],
  ["sell", "卖出"],
  ["avoid", "回避"],
  ["hold", "持有"],
  ["watch", "观察"],
  ["thesis", "投资逻辑"],
  ["catalyst", "催化剂"],
  ["invalidation", "失效条件"],
  ["confirmation", "确认信号"],
  ["liquidity", "流动性"],
  ["volatility", "波动率"],
  ["valuation", "估值"],
  ["multiple", "估值倍数"],
  ["growth", "增长"],
  ["cycle", "周期"],
  ["memory", "存储"],
  ["networking", "网络"],
  ["laser", "激光器"],
  ["photonics", "光子"],
  ["substrate", "衬底"],
];

const enPhraseMap = [
  ["共封装光学", "co-packaged optics"],
  ["硅光", "silicon photonics"],
  ["光模块", "optical transceiver"],
  ["数据中心", "data center"],
  ["超大规模云厂商", "hyperscaler"],
  ["AI 资本开支", "AI capex"],
  ["资本开支", "capex"],
  ["自由现金流", "free cash flow"],
  ["毛利率", "gross margin"],
  ["营业利润率", "operating margin"],
  ["收入增长", "revenue growth"],
  ["财报电话会", "earnings call"],
  ["上调指引", "guidance raise"],
  ["客户集中", "customer concentration"],
  ["供应链", "supply chain"],
  ["空头持仓", "short interest"],
  ["空头回补天数", "days to cover"],
  ["目标价", "price target"],
  ["市值", "market cap"],
  ["52 周高点", "52 week high"],
  ["52 周低点", "52 week low"],
  ["盘后", "after hours"],
  ["盘前", "pre market"],
  ["突破", "breakout"],
  ["回踩", "pullback"],
  ["风险收益比", "risk reward"],
  ["上行空间", "upside"],
  ["下行风险", "downside"],
  ["稀释", "dilution"],
  ["可转债", "convertible debt"],
  ["增发", "offering"],
  ["积压订单", "backlog"],
  ["新增订单", "bookings"],
  ["订单簿", "order book"],
  ["利用率", "utilization"],
  ["爬坡", "ramp"],
  ["客户验证", "customer validation"],
  ["认证", "qualification"],
  ["量产", "production"],
  ["批量生产", "volume production"],
  ["看多", "long"],
  ["做空", "short"],
  ["买入", "buy"],
  ["卖出", "sell"],
  ["回避", "avoid"],
  ["持有", "hold"],
  ["观察", "watch"],
  ["投资逻辑", "thesis"],
  ["催化剂", "catalyst"],
  ["失效条件", "invalidation"],
  ["确认信号", "confirmation"],
  ["流动性", "liquidity"],
  ["波动率", "volatility"],
  ["估值倍数", "multiple"],
  ["估值", "valuation"],
  ["增长", "growth"],
  ["周期", "cycle"],
  ["存储", "memory"],
  ["网络", "networking"],
  ["激光器", "laser"],
  ["光子", "photonics"],
  ["衬底", "substrate"],
];

function hasCjk(value = "") {
  return /[\u3400-\u9fff]/.test(value);
}

function hasLatin(value = "") {
  return /[A-Za-z]/.test(value);
}

function replacePhrases(text = "", map = [], options = {}) {
  let output = String(text || "");
  for (const [from, to] of map) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flags = options.ignoreCase ? "gi" : "g";
    output = output.replace(new RegExp(escaped, flags), to);
  }
  return output;
}

function translateEnglishToChinese(text = "") {
  let output = replacePhrases(text, zhPhraseMap, { ignoreCase: true });
  output = output
    .replace(/if you want a tldr of today:?/gi, "今天一句话总结：")
    .replace(/>\s*be\s+(\$?[A-Z][A-Z0-9.]{1,8}),\s*\$?([\d.]+)\s*T\s+company\.\s*Force shift to/gi, "> 假设你是 $1，一家约 $2T 美元公司，强推转向")
    .replace(/>\s*analyst\s*:/gi, "> 分析师：")
    .replace(/>\s*market\s*:/gi, "> 市场：")
    .replace(/>\s*([A-Z][A-Za-z0-9 &.-]+)\s+executives after\s*:/gi, "> 随后 $1 高管：")
    .replace(/i\s+don.?t\s+think\s+u\s+can\s+do\s+it\s+in\s+time/gi, "我不认为你能按时做到")
    .replace(/i\s+don.?t\s+think\s+you\s+can\s+do\s+it\s+in\s+time/gi, "我不认为你能按时做到")
    .replace(/i\s+don.?t\s+trust\s+(.+?),\s*time\s+to\s+sell\s+everything/gi, "我不信任 $1，该卖掉一切")
    .replace(/i\s+don.?t\s+trust\s+(.+?),\s*time\s+to\s+卖出\s+everything/gi, "我不信任 $1，该卖掉一切")
    .replace(/bullish\s+on\s+([^,，]+),\s*timelines?\s+accelerating/gi, "看多 $1，时间线正在加速")
    .replace(/\btldr\b/gi, "简版总结")
    .replace(/\bu\b/g, "你")
    .replace(/\b(\w+)\s+beat(s)?\b/gi, "$1 超预期")
    .replace(/\b(\w+)\s+miss(es)?\b/gi, "$1 不及预期")
    .replace(/\bupgrade(d)?\b/gi, "上调评级")
    .replace(/\bdowngrade(d)?\b/gi, "下调评级")
    .replace(/\bre-rate\b/gi, "重估")
    .replace(/\bmoat\b/gi, "护城河")
    .replace(/\btam\b/gi, "TAM 总市场空间")
    .replace(/\byoy\b/gi, "同比")
    .replace(/\bqoq\b/gi, "环比")
    .replace(/\beps\b/gi, "EPS 每股收益")
    .replace(/\bebitda\b/gi, "EBITDA")
    .replace(/\bai\b/gi, "AI")
    .replace(/\bgpu\b/gi, "GPU")
    .replace(/\basic\b/gi, "ASIC")
    .replace(/\bhbm\b/gi, "HBM")
    .replace(/\bcpo\b/gi, "CPO")
    .replace(/\bcapex\b/gi, "资本开支")
    .replace(/\bcash flow\b/gi, "现金流")
    .replace(/\borders?\b/gi, "订单")
    .replace(/\bcustomers?\b/gi, "客户")
    .replace(/\bdemand\b/gi, "需求")
    .replace(/\bsupply\b/gi, "供给")
    .replace(/\bmargin(s)?\b/gi, "利润率")
    .replace(/\bdebt\b/gi, "债务")
    .replace(/\brisk(s)?\b/gi, "风险")
    .replace(/\bprice\b/gi, "价格")
    .replace(/\bvolume\b/gi, "成交量")
    .replace(/\bstock\b/gi, "股票")
    .replace(/\bmarket\b/gi, "市场")
    .replace(/\bstrong\b/gi, "强")
    .replace(/\bweak\b/gi, "弱")
    .replace(/\bnew\b/gi, "新增")
    .replace(/\bnext\b/gi, "下一步");
  return shortTitle(output, 520);
}

function translateChineseToEnglish(text = "") {
  let output = replacePhrases(text, enPhraseMap);
  output = output
    .replace(/同比/g, "YoY")
    .replace(/环比/g, "QoQ")
    .replace(/护城河/g, "moat")
    .replace(/重估/g, "re-rate")
    .replace(/订单/g, "orders")
    .replace(/客户/g, "customers")
    .replace(/需求/g, "demand")
    .replace(/供给/g, "supply")
    .replace(/利润率/g, "margin")
    .replace(/债务/g, "debt")
    .replace(/风险/g, "risk")
    .replace(/价格/g, "price")
    .replace(/成交量/g, "volume")
    .replace(/股票/g, "stock")
    .replace(/市场/g, "market")
    .replace(/强/g, "strong")
    .replace(/弱/g, "weak")
    .replace(/新增/g, "new")
    .replace(/下一步/g, "next step");
  return shortTitle(output, 520);
}

function englishResidueScore(value = "") {
  const protectedText = String(value || "")
    .replace(/\$?[A-Z]{2,8}\b/g, "")
    .replace(/\b(AI|GPU|ASIC|HBM|CPO|DC|TAM|EPS|EBITDA)\b/gi, "");
  const latin = (protectedText.match(/[A-Za-z]/g) || []).length;
  const cjk = (protectedText.match(/[\u3400-\u9fff]/g) || []).length;
  return latin / Math.max(1, latin + cjk);
}

function sentimentZh(sentiment = "") {
  if (sentiment === "bull") return "偏多";
  if (sentiment === "bear") return "偏风险";
  return "中性";
}

const chineseCompanyNames = {
  NVDA: "英伟达",
  MU: "美光",
  AMD: "超微",
  MSFT: "微软",
  AMZN: "亚马逊",
  META: "Meta",
  TSM: "台积电",
  AVGO: "博通",
  PLTR: "Palantir",
  TSLA: "特斯拉",
};

function stockNamesForSymbols(symbols = []) {
  return [...new Set(symbols.map(normalizeSymbol).filter(Boolean))]
    .slice(0, 6)
    .map((symbol) => {
      const chineseName = chineseCompanyNames[symbol];
      return chineseName ? `$${symbol}（${chineseName}）` : `$${symbol}`;
    });
}

function inferChineseMeaning(original = "", item = {}) {
  const text = String(original || "");
  const lower = text.toLowerCase();
  const symbols = stockNamesForSymbols(item.symbols || []);
  const symbolText = symbols.length ? symbols.join("、") : "相关标的";
  const theme = liveThemeLabel(item.theme || "general");
  const tone = sentimentZh(item.sentiment || "neutral");
  const points = [];

  if (/tldr|today/i.test(text)) points.push("这条推文是在做当天事件的简版总结。");
  if (/nvda|nvidia/i.test(text) && /lumentum/i.test(text) && /cpo/i.test(text)) {
    points.push("核心意思是：市场一度担心英伟达推动 800V 直流供电和 CPO 的节奏太激进，但英伟达与 Lumentum 高管随后对 CPO 表态积极，并暗示推进时间线正在加速。");
  } else if (/cpo|co-packaged|optical|photonics|laser|transceiver/i.test(text)) {
    points.push("核心意思是：资金仍在围绕 CPO、光互连、激光器或光模块主线寻找供应链瓶颈。");
  } else if (/neocloud|gpu cloud|datacenter|power/i.test(text)) {
    points.push("核心意思是：推文关注算力云、数据中心、电力资产和融资路径，重点不是概念，而是合同质量与资本开支能否兑现。");
  } else if (/hbm|memory|dram|nand/i.test(text)) {
    points.push("核心意思是：推文关注 HBM、DRAM 或存储周期，重点看价格、供给纪律和 AI 服务器需求。");
  } else if (/dilution|atm|debt|convertible|financing/i.test(text)) {
    points.push("核心意思是：这更像风险提示，融资、增发、可转债或债务压力可能压低可买性。");
  } else if (/bullish|long|buy|winner|upside|accelerating/i.test(text)) {
    points.push("核心意思是：原文偏正面，认为相关方向或标的仍有上行催化。");
  } else if (/sell|short|avoid|risk|bear|weak/i.test(text)) {
    points.push("核心意思是：原文偏谨慎，需要先排除风险和反证。");
  } else {
    points.push("核心意思是：原文在更新一个与美股交易相关的公开信号，需要结合价格、成交量和公告再判断。");
  }

  if (/analyst/i.test(text)) points.push("里面提到分析师质疑或市场分歧，说明短期预期并不一致。");
  if (/market/i.test(text)) points.push("里面提到市场反应，说明价格可能已经受情绪影响。");
  if (/timeline|accelerat/i.test(text)) points.push("里面提到时间线加快，这是后续催化跟踪点。");
  if (/sell everything/i.test(text)) points.push("“卖出一切”更像市场恐慌式反应，不应直接等同于基本面被证伪。");

  const action =
    item.sentiment === "bear" || /dilution|atm|debt|convertible|sell everything|risk/i.test(lower)
      ? "交易上先降级处理，等公告、财报或管理层口径确认后再看。"
      : "交易上不要只看推文情绪，需要等量价确认、同主题扩散和公告证据。";
  return shortTitle(`涉及标的：${symbolText}。主题：${theme}，语义：${tone}。${points.join("")}${action}`, 520);
}

function forceReadableChinese(original = "", item = {}) {
  const translated = translateEnglishToChinese(original);
  if (!translated || englishResidueScore(translated) > 0.28) return inferChineseMeaning(original, item);
  return translated;
}

function bilingualTweet(item = {}) {
  const original = String(item.body || item.title || "Serenity live tweet").replace(/\s+/g, " ").trim();
  const isChinese = hasCjk(original);
  const isEnglish = hasLatin(original);
  const zh = isChinese ? original : forceReadableChinese(original, item);
  const en = isEnglish && !isChinese ? original : translateChineseToEnglish(original);
  return {
    original: shortTitle(original, 420),
    zh: shortTitle(zh, 420),
    en: shortTitle(en, 420),
    sourceLanguage: isChinese && isEnglish ? "中英混合" : isChinese ? "中文" : "English",
  };
}

function renderTweetTranslation(item = {}) {
  if (!state.translationEnabled) return "";
  const translated = bilingualTweet(item);
  return `
    <div class="tweet-translation">
      <div class="translation-head">
        <strong>中英对照</strong>
        <span>${escapeHtml(translated.sourceLanguage)} 原文 · 本地金融词库翻译</span>
      </div>
      <div class="translation-grid">
        <article>
          <b>中文翻译</b>
          <p>${escapeHtml(translated.zh)}</p>
        </article>
        <article>
          <b>English Translation</b>
          <p>${escapeHtml(translated.en)}</p>
        </article>
      </div>
    </div>
  `;
}

function horizonLabel(result = {}, days) {
  const horizon = (result.horizons || []).find((item) => item.days === days);
  if (!horizon?.available) return "待验证";
  return formatPercent(horizon.returnPercent);
}

function renderTrackRecordList() {
  const records = state.history.slice(0, 12);
  const completed = records.filter((record) => state.performance.has(historyKey(record))).length;
  trackStatus.textContent = records.length
    ? `${records.length} 条高信号历史样本 · ${completed ? `${completed} 条已回填价格表现` : "正在请求历史价格"}`
    : "暂无可验证历史样本";
  trackRecordList.innerHTML = records
    .map((record) => {
      const result = state.performance.get(historyKey(record)) || {};
      const currentClass = Number(result.currentReturnPercent) >= 0 ? "up" : "down";
      const drawdownClass = Number(result.maxDrawdownPercent) < -25 ? "down" : "";
      return `
        <article class="track-card">
          <div class="track-head">
            <button type="button" data-symbol="${escapeHtml(record.symbol)}">${escapeHtml(record.symbol)}</button>
            <span>${dateLabel(record.date)}</span>
          </div>
          <p>${escapeHtml(shortTitle(record.title || record.body || "Serenity historical sample"))}</p>
          <div class="track-metrics">
            <span><small>入场参考</small><b>${result.entryPrice ? formatPrice({ price: result.entryPrice, currency: "USD" }) : "--"}</b></span>
            <span><small>至今</small><b class="${currentClass}">${Number.isFinite(result.currentReturnPercent) ? formatPercent(result.currentReturnPercent) : "--"}</b></span>
            <span><small>最大回撤</small><b class="${drawdownClass}">${Number.isFinite(result.maxDrawdownPercent) ? formatPercent(result.maxDrawdownPercent) : "--"}</b></span>
          </div>
          <div class="horizon-strip">
            <span>7D <b class="${Number(result.horizons?.find((item) => item.days === 7)?.returnPercent) >= 0 ? "up" : "down"}">${horizonLabel(result, 7)}</b></span>
            <span>30D <b class="${Number(result.horizons?.find((item) => item.days === 30)?.returnPercent) >= 0 ? "up" : "down"}">${horizonLabel(result, 30)}</b></span>
            <span>90D <b class="${Number(result.horizons?.find((item) => item.days === 90)?.returnPercent) >= 0 ? "up" : "down"}">${horizonLabel(result, 90)}</b></span>
          </div>
          ${record.url ? `<a href="${escapeHtml(record.url)}" target="_blank" rel="noreferrer">查看原始样本</a>` : ""}
        </article>
      `;
    })
    .join("");
}

async function loadPerformance() {
  const records = state.history.slice(0, 12).map((record) => ({
    id: record.id,
    symbol: record.symbol,
    date: record.date,
    title: record.title,
  }));
  if (!records.length) return;
  try {
    const data = await fetchJson(`/api/performance?records=${encodeURIComponent(JSON.stringify(records))}`);
    for (const result of data.results || []) {
      state.performance.set(historyKey(result), result);
    }
    renderTrackRecordList();
  } catch (error) {
    trackStatus.textContent = `历史表现加载失败：${error.message}`;
  }
}

function liveItemIsNew(item = {}) {
  const staticDate = Date.parse(state.monitor?.latestCaptured?.date || 0);
  const liveDate = Date.parse(item.date || 0);
  return Number.isFinite(liveDate) && Number.isFinite(staticDate) && liveDate > staticDate;
}

function liveItemKey(item = {}) {
  return String(item.id || `${item.date || ""}:${item.title || item.body || ""}`);
}

function dateTimeLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function agoLabel(value) {
  if (!value) return "等待同步";
  const time = Number(value);
  if (!Number.isFinite(time)) return "等待同步";
  const seconds = Math.max(0, Math.round((Date.now() - time) / 1000));
  if (seconds < 60) return `${seconds} 秒前`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  return `${Math.round(minutes / 60)} 小时前`;
}

function isWebTradableSymbol(symbol = "") {
  const normalized = normalizeSymbol(symbol);
  if (!normalized || WEB_CRYPTO_SYMBOLS.has(normalized)) return false;
  if (/^\d/.test(normalized)) return false;
  if (/[.](TW|HK|SS|SZ|KS|T|L|PA|DE|ST)$/i.test(normalized)) return false;
  return /^[A-Z][A-Z0-9.]{1,8}$/.test(normalized);
}

function liveTradableSymbols(item = {}) {
  return uniqueSymbols((item.symbols || []).map(canonicalSymbol)).filter(isWebTradableSymbol).slice(0, 12);
}

function liveSymbolTokens(item = {}) {
  const symbols = new Set();
  for (const symbol of (item.symbols || []).map(normalizeSymbol).filter(Boolean)) {
    for (const alias of aliasesForSymbol(symbol)) symbols.add(alias);
    symbols.add(canonicalSymbol(symbol));
    const stock = findStock(symbol);
    if (stock) {
      for (const alias of stockAliases(stock)) symbols.add(alias);
    }
  }
  return symbols;
}

function liveWatchMatch(item = {}) {
  if (!state.watchlist.length) return { matched: true, reason: "全部推文" };
  const symbols = liveSymbolTokens(item);
  const text = `${item.title || ""} ${item.body || ""}`.toUpperCase();
  const theme = item.theme || "general";
  const themeText = `${theme} ${liveThemeLabel(theme)}`.toUpperCase();

  for (const token of state.watchlist) {
    const tokenTheme = WATCH_THEME_TOKENS[token];
    if (symbols.has(token)) return { matched: true, reason: `$${token}` };
    if (tokenTheme && tokenTheme === theme) return { matched: true, reason: liveThemeLabel(theme) };
    if (themeText.includes(token)) return { matched: true, reason: liveThemeLabel(theme) };
    if (token.length >= 3 && text.includes(`$${token}`)) return { matched: true, reason: `$${token}` };
  }
  return { matched: false, reason: "" };
}

function watchTokenMatchesItem(token = "", item = {}) {
  const normalized = normalizeWatchToken(token);
  if (!normalized) return false;
  const tokenTheme = WATCH_THEME_TOKENS[normalized];
  const symbols = liveSymbolTokens(item);
  const text = `${item.title || ""} ${item.body || ""}`.toUpperCase();
  const theme = item.theme || "general";
  const themeText = `${theme} ${liveThemeLabel(theme)}`.toUpperCase();
  if (symbols.has(normalized)) return true;
  if (tokenTheme && tokenTheme === theme) return true;
  if (themeText.includes(normalized)) return true;
  return normalized.length >= 3 && text.includes(`$${normalized}`);
}

function stockForWatchToken(token = "") {
  const normalized = normalizeWatchToken(token);
  const theme = WATCH_THEME_TOKENS[normalized];
  if (theme) return calledStocks.find((stock) => stock.theme === theme && !stock.riskFlag) || null;
  return findStock(normalized) || null;
}

function monitorWatchRows(sourceItems = []) {
  const tokens = (state.watchlist.length ? state.watchlist : ["SIVE", "AAOI", "NVDA", "CPO", "NEOCLOUD"]).slice(0, 8);
  return tokens.map((token) => {
    const normalized = normalizeWatchToken(token);
    const theme = WATCH_THEME_TOKENS[normalized];
    const stock = stockForWatchToken(normalized);
    const quote = stock ? quoteForStock(stock) : {};
    const decision = stock ? decisionFor(stock, quote) : null;
    const matches = sourceItems.filter((item) => watchTokenMatchesItem(normalized, item)).length;
    const bstock = stock ? BSTOCK_SYMBOLS.find((item) => item.equity === stock.symbol) : null;
    return {
      token: normalized,
      symbol: stock?.symbol || "",
      title: stock ? `${stock.symbol} · ${stock.name}` : theme ? themeNames[theme] || normalized : normalized,
      status: matches ? `${matches} 条命中` : state.watchlist.length ? "等待命中" : "示例监听",
      action: decision?.actionLabel || (theme ? "主题监听" : "等待信号"),
      price: stock ? formatPrice(quote) : "--",
      meta: bstock
        ? `${bstock.displayPair} 已接 Binance bStock`
        : stock
          ? `${stock.themeLabel} · ${themeNames[stock.theme] || "覆盖池"}`
          : theme
            ? "按主题聚合推文与候选股"
            : "添加 ticker 后自动聚合",
    };
  });
}

async function unlockPushSound() {
  if (!state.pushAudioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;
    state.pushAudioContext = new AudioContextClass();
  }
  if (state.pushAudioContext.state === "suspended") await state.pushAudioContext.resume();
  state.soundUnlocked = state.pushAudioContext.state === "running";
  return state.soundUnlocked;
}

function playPushSound() {
  if (!state.soundEnabled || !state.soundUnlocked || !state.pushAudioContext) return;
  const audio = state.pushAudioContext;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audio.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1320, audio.currentTime + 0.13);
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.09, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.22);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.24);
}

function sendBrowserNotification(item = {}, match = {}) {
  if (!state.notificationEnabled || notificationPermission() !== "granted") return;
  const symbols = liveTradableSymbols(item);
  const title = symbols.length ? `Serenity 新推文 · ${symbols.map((symbol) => `$${symbol}`).join(" ")}` : "Serenity 新推文";
  const payload = {
    type: "SERENITY_NOTIFY",
    title,
    body: `${match.reason || liveThemeLabel(item.theme)} · ${shortTitle(item.title || item.body, 170)}`,
    tag: `serenity-${liveItemKey(item)}`,
    url: item.url || "/#monitor",
  };
  const showFallbackNotification = () => {
    const notification = new Notification(title, {
      body: payload.body,
      tag: payload.tag,
      renotify: true,
      icon: "/assets/serenity-icon.svg",
    });
    notification.onclick = () => {
      window.focus();
      setActivePage("monitor", { updateHash: true, scroll: false });
      document.querySelector("#monitor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      notification.close();
    };
  };
  if (state.swRegistration?.active) {
    state.swRegistration.active.postMessage(payload);
    return;
  }
  if (!navigator.serviceWorker?.ready) {
    showFallbackNotification();
    return;
  }
  navigator.serviceWorker.ready
    .then((registration) => {
      if (registration.active) registration.active.postMessage(payload);
      else showFallbackNotification();
    })
    .catch(showFallbackNotification);
}

function alertLiveItem(item = {}) {
  const match = liveWatchMatch(item);
  if (!match.matched) return;
  state.lastMatchedAlertAt = Date.now();
  state.lastMatchedAlertId = liveItemKey(item);
  playPushSound();
  sendBrowserNotification(item, match);
}

function liveThemeLabel(theme = "") {
  return (
    {
      "capital-structure-veto": "资本结构风险",
      "cpo-silicon-photonics": "CPO / 硅光 / 光互连",
      "substrate-materials": "InP / 衬底材料",
      neocloud: "AI 数据中心 / NeoCloud",
      "memory-rotation": "HBM / 存储周期",
      "ai-infrastructure": "AI 基建",
      general: "一般事件",
    }[theme] || theme || "一般事件"
  );
}

function liveThemeMechanism(theme = "") {
  if (theme === "cpo-silicon-photonics" || theme === "substrate-materials") {
    return "资金通常从 AI capex 主线外溢到光互连瓶颈，小市值上游、客户认证和量产路径最敏感。";
  }
  if (theme === "neocloud") return "先看合同质量、电力资产、GPU 利用率和融资路径，低稀释的长期客户合同才是核心。";
  if (theme === "ai-infrastructure") return "大市值 AI 标的是需求锚点，真正的赔率通常沿 ASIC、网络、服务器和光互连供应链外溢。";
  if (theme === "memory-rotation") return "资金关注 HBM/DRAM 紧缺和价格周期，但追高时需要额外核查供给纪律。";
  if (theme === "capital-structure-veto") return "这类信息优先当作风险过滤器处理，ATM、可转债、债务和融资会压低可买性。";
  return "先确认 Serenity 是否在强化已有主线，再看成交量、公告证据和同主题扩散。";
}

function actionForLive(item = {}, decision = {}, stock = {}) {
  if (item.sentiment === "bear" || stock.riskFlag || stock.theme === "capital-structure-veto") return "先查风险";
  return decision.actionLabel || "补证据再看";
}

function liveRowDetails(stock = {}, quote = {}, decision = {}, beginner = {}, plan = {}, item = {}, metric = {}, evidence = []) {
  const priceSummary = pricePositionSummary(quote);
  const playbook = playbookFor(stock);
  const volume = liquiditySummary(quote);
  const buy = entryGuideText(quote, beginner, plan);
  const confirm = [
    decision.topDriver ? `排序主因：${decision.topDriver}` : "",
    playbook.catalysts?.[0] || decision.nextActions?.[0],
    item.sentiment === "bull" ? "原文偏多，继续看量价是否承接" : item.sentiment === "bear" ? "原文偏风险，先降级处理" : "原文语义中性，先等二次确认",
  ]
    .filter(Boolean)
    .join("；");
  const risk = [
    decision.blockers?.[0] || stock.risk,
    priceSummary.tone === "avoid" ? "价格在高位，禁止情绪追单" : "",
    stock.isUniversal ? "非 Serenity 核心覆盖，必须补公开公告" : "",
  ]
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .join("；");
  const data = [
    formatMarketCap(Number(quote.marketCap) || stock.fallbackMarketCap),
    priceSummary.label,
    metric.mentions ? `历史提及 ${compact.format(metric.mentions)} 次` : "历史样本少",
    evidence.length ? `${evidence.length} 条样本` : "样本待补",
  ]
    .filter(Boolean)
    .join(" · ");
  return {
    buy,
    confirm,
    risk,
    data,
    volume,
    tone: beginner.className || decision.actionClass || "verify",
  };
}

async function fetchQuotesForSymbols(symbols = []) {
  const normalized = uniqueSymbols(symbols.map(canonicalSymbol)).slice(0, 12);
  if (!normalized.length) return new Map();
  const map = new Map();
  const missing = [];
  for (const symbol of normalized) {
    const cached = state.quotes.get(symbol);
    const fetchedAt = state.quoteFetchedAt.get(symbol) || 0;
    if (cached && Date.now() - fetchedAt < QUOTE_CACHE_MS) {
      map.set(symbol, cached);
    } else {
      missing.push(symbol);
    }
  }
  if (!missing.length) return map;
  const data = await fetchJson(`/api/quotes?symbols=${encodeURIComponent(missing.join(","))}`);
  for (const quote of data.quotes || []) {
    const requested = normalizeSymbol(quote.requestedSymbol || quote.symbol);
    const actual = normalizeSymbol(quote.symbol);
    const canonical = canonicalSymbol(requested || actual);
    if (requested) {
      state.quotes.set(requested, quote);
      state.quoteFetchedAt.set(requested, Date.now());
      map.set(requested, quote);
    }
    if (canonical) {
      state.quotes.set(canonical, quote);
      state.quoteFetchedAt.set(canonical, Date.now());
      map.set(canonical, quote);
    }
    if (actual) {
      state.quotes.set(actual, quote);
      state.quoteFetchedAt.set(actual, Date.now());
      map.set(actual, quote);
    }
  }
  return map;
}

function pctMove(currentPrice, entryPrice) {
  const current = Number(currentPrice);
  const entry = Number(entryPrice);
  if (!Number.isFinite(current) || !Number.isFinite(entry) || entry === 0) return null;
  return ((current - entry) / entry) * 100;
}

function reviewConclusion(rows = []) {
  if (!rows.length) return "暂无可交易标的可复盘。";
  const winners = rows.filter((row) => Number(row.movePercent) > 0).length;
  const losers = rows.filter((row) => Number(row.movePercent) < 0).length;
  const top = rows[0];
  if (winners >= Math.max(1, losers + 1)) return `初步扩散偏正：${top.symbol} 仍排第一，继续看成交和同主题扩散。`;
  if (losers > winners) return `初步反应偏弱：${top.symbol} 仍需等量价确认，避免只因喊单追高。`;
  return `初步反应中性：${top.symbol} 维持观察，等待第二波资金确认。`;
}

async function buildLiveReviewPack(item = {}, pack = {}) {
  const symbols = (pack.rows || []).map((row) => row.symbol);
  const quotes = await fetchQuotesForSymbols(symbols);
  const rows = (pack.rows || []).map((row) => {
    const quote = quotes.get(normalizeSymbol(row.symbol)) || row.quote || {};
    const movePercent = pctMove(quote.price, row.quote?.price);
    const intradayChange = Number(quote.changePercent);
    const action =
      Number.isFinite(movePercent) && movePercent > 1.8
        ? "资金确认"
        : Number.isFinite(movePercent) && movePercent < -1.8
          ? "反应偏弱"
          : "继续观察";
    return {
      ...row,
      quote,
      movePercent,
      intradayChange,
      action,
    };
  });
  rows.sort((a, b) => {
    const move = (Number(b.movePercent) || -999) - (Number(a.movePercent) || -999);
    if (move) return move;
    return b.score - a.score;
  });
  return {
    id: liveItemKey(item),
    builtAt: Date.now(),
    rows,
    conclusion: reviewConclusion(rows),
    checks: [
      "量价是否延续，而不是只出现瞬时冲高",
      "同主题标的是否扩散，龙头或供应链锚点是否同步",
      "原文是否有资本结构、融资、做空或风险语义",
    ],
  };
}

function scheduleLiveReviewPack(item = {}, pack = {}, delay = WEB_REVIEW_DELAY_MS) {
  const key = liveItemKey(item);
  if (!key || state.liveReviewPending.has(key) || state.liveReviewPacks.has(key)) return;
  state.liveReviewPending.add(key);
  renderLiveMonitor();
  setTimeout(() => {
    buildLiveReviewPack(item, pack)
      .then((review) => {
        state.liveReviewPacks.set(key, review);
        state.liveReviewPending.delete(key);
        renderLiveMonitor();
      })
      .catch((error) => {
        state.liveReviewPacks.set(key, {
          id: key,
          builtAt: Date.now(),
          error: error.message,
          rows: [],
          conclusion: "复盘生成失败，稍后刷新重试。",
          checks: [],
        });
        state.liveReviewPending.delete(key);
        renderLiveMonitor();
      });
  }, delay);
}

async function buildLiveResearchPack(item = {}) {
  const symbols = liveTradableSymbols(item);
  const rows = [];

  for (const symbol of symbols) {
    let stock = findStock(symbol) || fallbackStock(symbol);
    const quote = await ensureQuote(stock.symbol || symbol);
    stock = hydrateUniversalStock(stock, quote);
    const enriched = {
      ...stock,
      quote,
      marketCap: Number(quote.marketCap) || stock.fallbackMarketCap || 0,
    };
    const metric = metricForStock(enriched) || {};
    const decision = decisionFor(enriched, quote);
    const space = upsideSpace(decision.baseScore || scoreStock(enriched, quote), enriched);
    const beginner = beginnerTradeAssessment(enriched, quote, decision, space);
    const positionPlan = beginnerPositionPlan(quote, state.beginnerProfile, beginner, space);
    const evidence = getCalledEvidence(enriched, 3);
    const detail = liveRowDetails(enriched, quote, decision, beginner, positionPlan, item, metric, evidence);
    const themeMatch = item.theme && item.theme !== "general" && (enriched.theme === item.theme || metric.dominantTheme === item.theme) ? 6 : 0;
    const sentimentAdjust = item.sentiment === "bull" ? 5 : item.sentiment === "bear" ? -18 : 0;
    const marketCap = Number(quote.marketCap) || enriched.fallbackMarketCap || 0;
    const capAdjust = marketCap && marketCap < 20e9 ? 4 : marketCap > 400e9 ? -5 : 0;
    const score = Math.round(clamp(decision.fit + themeMatch + sentimentAdjust + capAdjust, 1, 100));
    rows.push({
      symbol: enriched.symbol,
      name: enriched.name,
      action: actionForLive(item, decision, enriched),
      score,
      quote,
      marketCap,
      theme: enriched.theme,
      beginnerLabel: beginner.label,
      tone: detail.tone,
      detail,
      reason: [
        compactReason(enriched.thesis, 86),
        metric.mentions ? `历史提及 ${compact.format(metric.mentions)} 次` : "缺少历史样本",
        item.sentiment === "bear" ? "原文偏风险语义，自动降级" : "",
      ]
        .filter(Boolean)
        .join("；"),
    });
  }

  rows.sort((a, b) => b.score - a.score || b.marketCap - a.marketCap);
  const top = rows[0];
  const frameTheme = item.theme === "general" && top?.theme ? top.theme : item.theme || "general";
  return {
    id: liveItemKey(item),
    builtAt: Date.now(),
    symbols,
    rows,
    frame: {
      conclusion: top ? `${top.action}：优先核查 ${top.symbol}，其余按分数递减观察。` : "观察：未识别到可直接交易的美股 ticker。",
      theme: liveThemeLabel(frameTheme),
      logic: liveThemeMechanism(frameTheme),
      confirmation: "原文语义偏多、标的可交易、量价确认，且无新增融资、财报或监管反向信息。",
      invalidation: "若原文是风险提示、价格已急拉但成交不足、公告证据无法对应，或同主题龙头没有同步确认，就先降级。",
    },
  };
}

function scheduleLiveResearchPack(item = {}, delay = WEB_PUSH_DELAY_MS) {
  const key = liveItemKey(item);
  if (!key || state.livePending.has(key) || state.liveResearchPacks.has(key)) return;
  state.livePending.add(key);
  renderLiveMonitor();
  setTimeout(() => {
    buildLiveResearchPack(item)
      .then((pack) => {
        state.liveResearchPacks.set(key, pack);
        state.livePending.delete(key);
        scheduleLiveReviewPack(item, pack);
        renderLiveMonitor();
      })
      .catch((error) => {
        state.liveResearchPacks.set(key, {
          id: key,
          builtAt: Date.now(),
          error: error.message,
          rows: [],
          frame: { conclusion: "研究包生成失败，稍后刷新重试。", theme: item.theme || "general", logic: "" },
        });
        state.livePending.delete(key);
        renderLiveMonitor();
      });
  }, delay);
}

function syncLivePushItems(items = []) {
  const validItems = items.filter((item) => liveItemKey(item));
  if (!state.webPushInitialized) {
    for (const item of validItems) state.liveSeenIds.add(liveItemKey(item));
    state.webPushInitialized = true;
    if (validItems[0]) scheduleLiveResearchPack(validItems[0], WEB_PUSH_DELAY_MS);
    return;
  }

  const newItems = validItems.filter((item) => !state.liveSeenIds.has(liveItemKey(item))).reverse();
  for (const item of newItems) {
    const key = liveItemKey(item);
    state.liveSeenIds.add(key);
    state.lastLiveNewAt = Date.now();
    state.lastLiveNewId = key;
    alertLiveItem(item);
    scheduleLiveResearchPack(item, WEB_PUSH_DELAY_MS);
  }
}

function renderWebPushBanner() {
  const pending = state.livePending.size;
  const packCount = state.liveResearchPacks.size;
  const reviewPending = state.liveReviewPending.size;
  const reviewCount = state.liveReviewPacks.size;
  const lastFetch = agoLabel(state.lastLiveFetchAt);
  const status = state.lastLiveError ? "接口降级" : "推送开启";
  webPushBanner.innerHTML = `
    <div class="push-live-indicator">
      <span class="pulse-dot" aria-hidden="true"></span>
      <strong>${escapeHtml(status)}</strong>
      <small>${Math.round(WEB_PUSH_POLL_MS / 1000)} 秒轮询 · ${Math.round(WEB_PUSH_DELAY_MS / 1000)} 秒研究包 · 上次同步 ${escapeHtml(lastFetch)}</small>
    </div>
    <div class="push-live-metrics">
      <span><b>${pending}</b>待生成</span>
      <span><b>${packCount}</b>研究包</span>
      <span><b>${reviewPending}</b>待复盘</span>
      <span><b>${reviewCount}</b>复盘</span>
      <span><b>${state.lastLiveNewAt ? agoLabel(state.lastLiveNewAt) : "等待"}</b>最新推送</span>
      <span><b>${state.lastMatchedAlertAt ? agoLabel(state.lastMatchedAlertAt) : "等待"}</b>命中提醒</span>
    </div>
  `;
}

function renderMonitorHealth() {
  const tone = healthTone();
  const notification = notificationPermission();
  const pwaState = state.swReady ? (state.swControlled ? "PWA 已接管" : "PWA 待接管") : "PWA 未启用";
  monitorHealth.innerHTML = `
    <div class="health-head ${tone}">
      <span></span>
      <strong>${escapeHtml(healthLabel())}</strong>
      <small>${state.lastLiveError ? escapeHtml(state.lastLiveError) : "接口、通知和复盘队列状态"}</small>
    </div>
    <div class="health-grid">
      <span><b>${state.liveLatencyMs === null ? "--" : `${Math.round(state.liveLatencyMs)}ms`}</b><small>接口延迟</small></span>
      <span><b>${state.liveLastItemCount}</b><small>最新条数</small></span>
      <span><b>${state.liveFetchCount}</b><small>轮询次数</small></span>
      <span><b>${state.liveFailureCount}</b><small>失败次数</small></span>
      <span><b>${escapeHtml(notification)}</b><small>通知权限</small></span>
      <span><b>${escapeHtml(pwaState)}</b><small>后台通道</small></span>
    </div>
    <p>说明：当前版本支持页面打开或最小化时的实时提醒；完全关闭浏览器后的服务器 Push 已预留 Service Worker 入口，需要后续增加 VAPID 推送服务。</p>
  `;
}

function livePackRows() {
  return Array.from(state.liveResearchPacks.values())
    .flatMap((pack) => (pack.rows || []).map((row) => ({ ...row, pack })))
    .filter((row) => row.symbol);
}

function renderDailyTradeReport() {
  if (!dailyTradeReport) return;
  const rows = livePackRows();
  const topRows = rows.slice().sort((a, b) => Number(b.score || 0) - Number(a.score || 0)).slice(0, 4);
  const blockedRows = rows
    .filter((row) => Number(row.quote?.changePercent) > 8 || /风险|观察|补证据/.test(row.action || ""))
    .slice(0, 4);
  const tradableSymbols = [...new Set(state.liveItems.flatMap((item) => liveTradableSymbols(item)).map(normalizeSymbol).filter(Boolean))].slice(0, 10);
  const activeAlerts = state.priceAlerts.filter((alert) => !alert.triggeredAt).length;
  const triggeredAlerts = state.priceAlerts.filter((alert) => alert.triggeredAt).length;
  const paperActive = state.paperTrades.length;
  dailyTradeReport.innerHTML = `
    <section class="daily-card">
      <div class="daily-head">
        <div>
          <span>Daily Trading Brief</span>
          <strong>每日交易简报</strong>
        </div>
        <small>${dateLabel(Date.now())} · 页面实时生成</small>
      </div>
      <div class="daily-metrics">
        <span><b>${state.liveItems.length}</b><small>最新信号</small></span>
        <span><b>${tradableSymbols.length}</b><small>可识别股票</small></span>
        <span><b>${state.livePending.size + state.liveReviewPending.size}</b><small>待研判/复盘</small></span>
        <span><b>${activeAlerts}</b><small>活跃提醒</small></span>
        <span><b>${triggeredAlerts}</b><small>已触发提醒</small></span>
        <span><b>${paperActive}</b><small>模拟盘记录</small></span>
      </div>
      <div class="daily-columns">
        <article>
          <strong>优先研究</strong>
          ${
            topRows.length
              ? topRows.map((row) => `<button class="secondary" type="button" data-symbol="${escapeHtml(row.symbol)}">${escapeHtml(row.symbol)} · ${escapeHtml(row.action)} · ${row.score}/100</button>`).join("")
              : `<p>等待研究包生成后更新排序。</p>`
          }
        </article>
        <article>
          <strong>等待确认</strong>
          ${
            blockedRows.length
              ? blockedRows.map((row) => `<span>${escapeHtml(row.symbol)} · ${formatPercent(row.quote?.changePercent)} · ${escapeHtml(row.action)}</span>`).join("")
              : `<p>暂无明显追价风险，仍按执行评级处理。</p>`
          }
        </article>
        <article>
          <strong>执行纪律</strong>
          <span>仅处理评级达标且止损明确的标的。</span>
          <span>不因单条推文放大仓位。</span>
          <span>未触发价位前，优先设置提醒或模拟观察。</span>
        </article>
      </div>
    </section>
  `;
}

function renderPriceAlertPanel() {
  if (!priceAlertPanel) return;
  checkPriceAlerts();
  const alerts = state.priceAlerts.slice(0, 8);
  priceAlertPanel.innerHTML = `
    <section class="alert-center">
      <div class="alert-center-head">
        <div>
          <span>Buy Point Alerts</span>
          <strong>买点等待系统</strong>
        </div>
        <small>${state.priceAlerts.length ? `${state.priceAlerts.length} 条提醒` : "暂无提醒"}</small>
      </div>
      ${
        alerts.length
          ? `<div class="alert-list">
              ${alerts
                .map((alert) => {
                  const evaluation = priceAlertEvaluation(alert);
                  const status = evaluation.isTriggered ? "已触发" : alert.direction === "above" ? "等待突破" : "等待回踩";
                  return `
                    <article class="alert-row ${evaluation.isTriggered ? "triggered" : ""}">
                      <button class="secondary" type="button" data-symbol="${escapeHtml(alert.symbol)}">${escapeHtml(alert.symbol)}</button>
                      <div>
                        <strong>${escapeHtml(priceAlertLabel(alert.kind))}</strong>
                        <small>${escapeHtml(alert.note || "")}</small>
                      </div>
                      <span><small>目标</small><b>${formatMoney(alert.targetPrice)}</b></span>
                      <span><small>当前</small><b>${evaluation.hasPrice ? formatMoney(evaluation.currentPrice) : "--"}</b></span>
                      <em>${escapeHtml(status)}</em>
                      <button class="secondary" type="button" data-alert-delete="${escapeHtml(alert.id)}">删除</button>
                    </article>
                  `;
                })
                .join("")}
            </div>`
          : `<p class="alert-empty">在单股研报中设置回踩、突破或止损提醒后，这里会集中显示。</p>`
      }
    </section>
  `;
}

function classifyLiveSignal(item = {}) {
  const text = `${item.title || ""} ${item.body || ""} ${(item.symbols || []).join(" ")}`.toLowerCase();
  const symbols = liveTradableSymbols(item).slice(0, 5);
  const has = (pattern) => pattern.test(text);
  if (has(/atm|offering|dilution|convertible|debt|financing|稀释|融资|债务|可转债/i) || item.theme === "capital-structure-veto") {
    return {
      label: "资本结构风险",
      tone: "avoid",
      priority: 92,
      thesis: "融资、稀释或债务信息优先作为否决项处理。",
      symbols,
    };
  }
  if (item.sentiment === "bear" || has(/delay|miss|downgrade|short|risk|lawsuit|probe|下调|推迟|风险|做空/i)) {
    return {
      label: "反证风险",
      tone: "avoid",
      priority: 82,
      thesis: "先排除客户延期、业绩下修、监管或做空反证。",
      symbols,
    };
  }
  if (has(/customer|order|booking|backlog|validation|qualification|production|ramp|客户|订单|认证|量产|爬坡/i)) {
    return {
      label: "客户验证",
      tone: "pursue",
      priority: 88,
      thesis: "客户、订单、认证或量产信息可直接提高证据权重。",
      symbols,
    };
  }
  if (has(/breakout|volume|52-week|high|target|upgrade|放量|突破|目标价|上调/i)) {
    return {
      label: "价格确认",
      tone: "watch",
      priority: 70,
      thesis: "价格或量能变化只能作为确认项，不能替代基本面证据。",
      symbols,
    };
  }
  if (has(/cpo|silicon photonics|photonics|inph|hbm|dram|neocloud|datacenter|asic|gpu|ai capex|硅光|光子|数据中心|算力|存储/i)) {
    return {
      label: "主题催化",
      tone: "verify",
      priority: 66,
      thesis: "主题命中后继续追踪终端需求和瓶颈位置。",
      symbols,
    };
  }
  return {
    label: "待归因",
    tone: "verify",
    priority: 48,
    thesis: "信息尚未形成明确催化或反证，先纳入观察。",
    symbols,
  };
}

function renderMonitorSignalBoard() {
  if (!monitorSignalBoard) return;
  const sourceItems = state.liveItems.length ? state.liveItems : state.monitor?.latestCaptured ? [state.monitor.latestCaptured] : [];
  const rows = sourceItems.slice(0, 8).map((item) => ({ item, signal: classifyLiveSignal(item) }));
  const watchRows = monitorWatchRows(sourceItems);
  const counts = rows.reduce((acc, row) => {
    acc[row.signal.label] = (acc[row.signal.label] || 0) + 1;
    return acc;
  }, {});
  monitorSignalBoard.innerHTML = `
    <section class="monitor-watch-board">
      <div class="monitor-intel-head">
        <div>
          <span>My Monitor</span>
          <strong>我的监控闭环</strong>
        </div>
        <small>${state.watchlist.length ? `${state.watchlist.length} 个监听项` : "先用示例监听，可在下方添加"}</small>
      </div>
      <div class="monitor-watch-list">
        ${watchRows
          .map(
            (row) => `
              <article class="monitor-watch-card">
                <div>
                  <span>${escapeHtml(row.token)}</span>
                  <strong>${escapeHtml(row.title)}</strong>
                  <small>${escapeHtml(row.meta)}</small>
                </div>
                <b>${escapeHtml(row.price)}</b>
                <em>${escapeHtml(row.status)} · ${escapeHtml(row.action)}</em>
                ${
                  row.symbol
                    ? `<button class="secondary" type="button" data-symbol="${escapeHtml(row.symbol)}">看研报</button>`
                    : `<small>添加具体 ticker 后可生成研报</small>`
                }
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="monitor-intel">
      <div class="monitor-intel-head">
        <div>
          <span>Signal Attribution</span>
          <strong>监控信号归因</strong>
        </div>
        <small>${rows.length ? `${rows.length} 条最新信号` : "等待实时信号"}</small>
      </div>
      <div class="monitor-intel-summary">
        ${["客户验证", "主题催化", "价格确认", "资本结构风险", "反证风险"]
          .map((label) => `<span><b>${counts[label] || 0}</b><small>${label}</small></span>`)
          .join("")}
      </div>
      <div class="monitor-intel-list">
        ${
          rows.length
            ? rows
                .map(({ item, signal }) => {
                  const title = shortTitle(item.title || item.body || "Serenity signal", 120);
                  return `
                    <article class="monitor-signal ${escapeHtml(signal.tone)}">
                      <div>
                        <strong>${escapeHtml(signal.label)}</strong>
                        <small>${dateTimeLabel(item.date)} · ${escapeHtml(liveThemeLabel(item.theme || "general"))}</small>
                      </div>
                      <p>${escapeHtml(title)}</p>
                      <em>${escapeHtml(signal.thesis)}</em>
                      <span>
                        ${
                          signal.symbols.length
                            ? signal.symbols.map((symbol) => `<button class="secondary" type="button" data-symbol="${escapeHtml(symbol)}">${escapeHtml(symbol)}</button>`).join("")
                            : "<small>暂无 ticker</small>"
                        }
                      </span>
                    </article>
                  `;
                })
                .join("")
            : `<p class="muted-line">实时接口返回后会自动按 Serenity 因子归因。</p>`
        }
      </div>
    </section>
  `;
}

function monitorHistorySymbols(item = {}) {
  return uniqueSymbols([item.symbol, ...(item.symbols || []), ...liveTradableSymbols(item)]).slice(0, 5);
}

function monitorHistoryStatus(item = {}, source = "") {
  if (source === "历史样本") {
    const result = state.performance.get(historyKey(item));
    if (Number.isFinite(Number(result?.currentReturnPercent))) return `已回填 ${formatPercent(result.currentReturnPercent)}`;
    return "待价格回填";
  }
  const key = liveItemKey(item);
  if (state.livePending.has(key)) return "研究包生成中";
  if (state.liveResearchPacks.has(key)) return "已有研究包";
  if (liveItemIsNew(item)) return "新推文";
  return "已入库";
}

function monitorHistoryRecords() {
  const seen = new Set();
  const records = [];
  const addRecord = (item = {}, source = "") => {
    const title = shortTitle(item.title || item.body || "Serenity monitor record", 180);
    const date = item.date || item.createdAt || item.timestamp || "";
    const key = String(item.id || item.url || `${source}:${date}:${item.symbol || ""}:${title}`);
    if (seen.has(key) || !title) return;
    seen.add(key);
    const symbols = monitorHistorySymbols(item);
    records.push({
      item,
      source,
      key,
      title,
      date,
      time: Date.parse(date) || 0,
      symbols,
      theme: liveThemeLabel(item.theme || "general"),
      status: monitorHistoryStatus(item, source),
      url: item.url || "",
    });
  };

  state.liveItems.forEach((item) => addRecord(item, "实时接口"));
  if (state.monitor?.latestCaptured) addRecord(state.monitor.latestCaptured, "静态快照");
  state.history.slice(0, 24).forEach((item) => addRecord(item, "历史样本"));
  return records.sort((a, b) => b.time - a.time).slice(0, 12);
}

function renderMonitorHistoryList() {
  if (!monitorHistoryList) return;
  const rows = monitorHistoryRecords();
  monitorHistoryList.innerHTML = `
    <section class="monitor-history-board">
      <div class="monitor-intel-head">
        <div>
          <span>Twitter History</span>
          <strong>X/Twitter 监控历史</strong>
        </div>
        <small>${rows.length ? `${rows.length} 条记录 · 实时 + 历史样本` : "等待历史记录"}</small>
      </div>
      ${
        rows.length
          ? `<div class="monitor-history-rows">
              ${rows
                .map(
                  (row) => `
                    <article class="monitor-history-row">
                      <div class="history-record-meta">
                        <span>${escapeHtml(row.source)}</span>
                        <strong>${escapeHtml(row.date ? dateTimeLabel(row.date) : "时间待补")}</strong>
                        <small>${escapeHtml(row.theme)} · ${escapeHtml(row.status)}</small>
                      </div>
                      <p>${escapeHtml(row.title)}</p>
                      <div class="history-record-actions">
                        ${
                          row.symbols.length
                            ? row.symbols.map((symbol) => `<button class="secondary" type="button" data-symbol="${escapeHtml(symbol)}">${escapeHtml(symbol)}</button>`).join("")
                            : `<small>暂无 ticker</small>`
                        }
                        ${row.url ? `<a href="${escapeHtml(row.url)}" target="_blank" rel="noreferrer">打开 X 原文</a>` : ""}
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>`
          : `<p class="monitor-history-empty">实时接口或静态样本返回后，这里会保留最近的推文监控记录。</p>`
      }
      <a class="monitor-history-more" href="#track-record">查看完整历史验证</a>
    </section>
  `;
}

function renderWebPushControls() {
  const notifyClass = state.notificationEnabled && notificationPermission() === "granted" ? "active" : "";
  const soundClass = state.soundEnabled ? "active" : "";
  const translationClass = state.translationEnabled ? "active" : "";
  const soundDisabled = audioAvailable() ? "" : "disabled";
  webPushControls.innerHTML = `
    <div class="push-control-actions">
      <button class="secondary ${state.pwaInstalled ? "active" : ""}" type="button" data-pwa-install ${state.pwaInstallPrompt || state.pwaInstalled ? "" : "disabled"}>${escapeHtml(pwaLabel())}</button>
      <button class="secondary ${notifyClass}" type="button" data-push-notify>${escapeHtml(notificationLabel())}</button>
      <button class="secondary ${soundClass}" type="button" data-push-sound ${soundDisabled}>${escapeHtml(soundLabel())}</button>
      <button class="secondary ${translationClass}" type="button" data-push-translate>${escapeHtml(translationLabel())}</button>
      <span>监听：${escapeHtml(watchlistSummary())}</span>
    </div>
    <form class="push-watch-form">
      <input name="watch" autocomplete="off" placeholder="SIVE, AAOI, CPO, neocloud" />
      <button type="submit">添加监听</button>
      <button class="secondary" type="button" data-watch-clear>${state.watchlist.length ? "清空" : "全部提醒"}</button>
    </form>
    <div class="push-preset-row">
      <button class="secondary" type="button" data-watch-preset="SIVE,AAOI,AXTI,LITE,MRVL,AEHR,CPO">CPO 链</button>
      <button class="secondary" type="button" data-watch-preset="NBIS,IREN,CIFR,CRWV,NEOCLOUD">NeoCloud</button>
      <button class="secondary" type="button" data-watch-preset="NVDA,AMD,AVGO,MSFT,AMZN,AI">AI 基建</button>
      ${
        state.watchlist.length
          ? state.watchlist.map((token) => `<button class="watch-chip" type="button" data-watch-remove="${escapeHtml(token)}">${escapeHtml(token)} ×</button>`).join("")
          : `<small>未设置 watchlist 时，所有新推文都会触发提醒。</small>`
      }
    </div>
  `;
}

function saveWatchlist(tokens) {
  state.watchlist = [...new Set((tokens || []).map(normalizeWatchToken).filter(Boolean))].slice(0, 24);
  storageSet(PUSH_WATCHLIST_KEY, state.watchlist);
  renderLiveMonitor();
}

function addWatchTokens(tokens) {
  saveWatchlist([...state.watchlist, ...(tokens || [])]);
}

async function toggleNotifications() {
  if (notificationPermission() === "unsupported") {
    state.notificationEnabled = false;
    storageSet(PUSH_NOTIFY_KEY, false);
    renderWebPushControls();
    return;
  }
  if (notificationPermission() === "granted") {
    state.notificationEnabled = !state.notificationEnabled;
    storageSet(PUSH_NOTIFY_KEY, state.notificationEnabled);
    renderWebPushControls();
    return;
  }
  if (notificationPermission() === "default") {
    const permission = await Notification.requestPermission();
    state.notificationEnabled = permission === "granted";
    storageSet(PUSH_NOTIFY_KEY, state.notificationEnabled);
    renderWebPushControls();
  }
}

async function toggleSound() {
  if (!state.soundEnabled) {
    const unlocked = await unlockPushSound();
    state.soundEnabled = unlocked;
    storageSet(PUSH_SOUND_KEY, state.soundEnabled);
    if (unlocked) playPushSound();
  } else {
    state.soundEnabled = false;
    storageSet(PUSH_SOUND_KEY, false);
  }
  renderWebPushControls();
}

function toggleTranslations() {
  state.translationEnabled = !state.translationEnabled;
  storageSet(PUSH_TRANSLATION_KEY, state.translationEnabled);
  renderLiveMonitor();
}

async function installPwa() {
  if (!state.pwaInstallPrompt) return;
  const promptEvent = state.pwaInstallPrompt;
  state.pwaInstallPrompt = null;
  promptEvent.prompt();
  const choice = await promptEvent.userChoice.catch(() => null);
  state.pwaInstalled = choice?.outcome === "accepted" || state.pwaInstalled;
  renderLiveMonitor();
}

function renderLiveResearchPack(pack) {
  if (!pack) return "";
  if (pack.error) {
    return `<section class="live-research-pack error"><strong>研究包生成失败</strong><p>${escapeHtml(pack.error)}</p></section>`;
  }
  const rows = (pack.rows || []).slice(0, 6);
  return `
    <section class="live-research-pack">
      <div class="live-pack-head">
        <strong>研究快照</strong>
        <span>${escapeHtml(dateTimeLabel(pack.builtAt))}</span>
      </div>
      <div class="live-frame">
        <b>${escapeHtml(pack.frame.conclusion)}</b>
        <span>主线：${escapeHtml(pack.frame.theme)}</span>
        <p>${escapeHtml(pack.frame.logic)}</p>
        <small>确认：${escapeHtml(pack.frame.confirmation)}</small>
        <small>失效：${escapeHtml(pack.frame.invalidation)}</small>
      </div>
      ${
        rows.length
          ? `<div class="live-rank-list">
              ${rows
                .map(
                  (row, index) => `
                    <article class="live-rank-card ${escapeHtml(row.tone || "")}">
                      <button type="button" data-symbol="${escapeHtml(row.symbol)}" class="live-rank-row">
                        <span>${index + 1}</span>
                        <strong>${escapeHtml(row.symbol)}</strong>
                        <small>${escapeHtml(row.action)} · ${row.score}/100 · ${escapeHtml(row.beginnerLabel || "")}</small>
                        <b>${formatPrice(row.quote)}</b>
                        <i class="${Number(row.quote.changePercent) >= 0 ? "up" : "down"}">${formatPercent(row.quote.changePercent)}</i>
                        <em>${formatMarketCap(row.marketCap)}</em>
                      </button>
                      <div class="live-rank-detail">
                        <span><b>买点</b><small>${escapeHtml(row.detail?.buy || "先等价格和证据确认")}</small></span>
                        <span><b>确认</b><small>${escapeHtml(row.detail?.confirm || row.reason)}</small></span>
                        <span><b>风险</b><small>${escapeHtml(row.detail?.risk || "追高、流动性和消息延迟")}</small></span>
                        <span><b>数据</b><small>${escapeHtml(row.detail?.data || row.reason)}</small></span>
                      </div>
                      <p>${escapeHtml(row.detail?.volume || row.reason)}</p>
                    </article>
                  `
                )
                .join("")}
            </div>`
          : `<p class="live-empty-pack">这条推文没有识别到可直接交易的美股 ticker。</p>`
      }
    </section>
  `;
}

function renderLiveReviewPack(review, pending = false) {
  if (pending) {
    return `<section class="live-review-pack pending"><strong>${Math.round(WEB_REVIEW_DELAY_MS / 1000)} 秒复盘生成中</strong><p>正在等待第二轮行情，用于判断价格反应和主题扩散。</p></section>`;
  }
  if (!review) return "";
  if (review.error) {
    return `<section class="live-review-pack error"><strong>复盘生成失败</strong><p>${escapeHtml(review.error)}</p></section>`;
  }
  const rows = (review.rows || []).slice(0, 5);
  return `
    <section class="live-review-pack">
      <div class="live-pack-head">
        <strong>5 分钟复盘</strong>
        <span>${escapeHtml(dateTimeLabel(review.builtAt))}</span>
      </div>
      <p>${escapeHtml(review.conclusion)}</p>
      ${
        rows.length
          ? `<div class="live-review-list">
              ${rows
                .map(
                  (row) => `
                    <span>
                      <b>${escapeHtml(row.symbol)}</b>
                      <small>${escapeHtml(row.action)} · 相对研究包 ${row.movePercent === null ? "--" : formatPercent(row.movePercent)} · 当日 ${formatPercent(row.intradayChange)}</small>
                    </span>
                  `
                )
                .join("")}
            </div>`
          : ""
      }
      <div class="live-review-checks">
        ${(review.checks || []).map((item) => `<small>${escapeHtml(item)}</small>`).join("")}
      </div>
    </section>
  `;
}

function renderLiveMonitor() {
  const latestStatic = state.monitor?.latestCaptured;
  const latestLive = state.liveItems[0];
  const newCount = state.liveItems.filter(liveItemIsNew).length;
  const base = latestStatic?.date ? `静态蒸馏至 ${dateLabel(latestStatic.date)}` : "等待静态蒸馏快照";
  renderWebPushBanner();
  renderWebPushControls();
  renderMonitorHealth();
  renderMonitorSignalBoard();
  renderMonitorHistoryList();
  renderDailyTradeReport();
  renderPriceAlertPanel();
  monitorStatus.textContent = latestLive
    ? `${base} · 网页推送 ${Math.round(WEB_PUSH_POLL_MS / 1000)} 秒轮询 · 接口最新 ${dateTimeLabel(latestLive.date)}${newCount ? ` · ${newCount} 条新推文待入库` : ""}`
    : IS_GITHUB_PAGES_STATIC
      ? `${base} · 静态备用站 · 实时接口暂停`
      : `${base} · 正在等待实时接口`;
  liveTweetList.innerHTML = (state.liveItems.length ? state.liveItems : latestStatic ? [latestStatic] : [])
    .slice(0, 6)
    .map((item) => {
      const key = liveItemKey(item);
      const isNew = liveItemIsNew(item);
      const isPushed = key === state.lastLiveNewId || state.livePending.has(key) || state.liveResearchPacks.has(key);
      const watchMatch = liveWatchMatch(item);
      const pack = state.liveResearchPacks.get(key);
      const pending = state.livePending.has(key);
      const review = state.liveReviewPacks.get(key);
      const reviewPending = state.liveReviewPending.has(key);
      const symbols = (item.symbols || []).slice(0, 6);
      return `
        <article class="live-tweet-card ${isNew || isPushed ? "new" : ""}">
          <div class="live-head">
            <strong>${state.watchlist.length && watchMatch.matched ? "命中监听" : isPushed ? "网页推送" : isNew ? "新推文" : "已入库"}</strong>
            <span>${dateTimeLabel(item.date)} · ${escapeHtml(item.sentiment || "neutral")} · ${escapeHtml(liveThemeLabel(item.theme || "general"))}</span>
          </div>
          <p>${escapeHtml(shortTitle(item.title || item.body || "Serenity live tweet", 190))}</p>
          ${renderTweetTranslation(item)}
          <div class="live-symbols">
            ${
              symbols.length
                ? symbols.map((symbol) => `<button class="secondary" type="button" data-symbol="${escapeHtml(symbol)}">${escapeHtml(symbol)}</button>`).join("")
                : `<small>暂无可识别 ticker</small>`
            }
          </div>
          ${pending ? `<div class="live-pack-pending"><span></span><b>${Math.round(WEB_PUSH_DELAY_MS / 1000)} 秒研究包生成中</b><small>正在等待行情、市值和 Serenity 框架回填</small></div>` : ""}
          ${renderLiveResearchPack(pack)}
          ${renderLiveReviewPack(review, reviewPending)}
          ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">打开 X 原文</a>` : ""}
        </article>
      `;
    })
    .join("");
}

async function loadLiveMonitor() {
  if (state.liveLoading) return;
  if (IS_GITHUB_PAGES_STATIC) {
    state.lastLiveError = "GitHub Pages 静态备用站暂不运行实时接口";
    monitorStatus.textContent = "静态备用站已恢复访问 · 实时监控接口暂停";
    renderLiveMonitor();
    return;
  }
  state.liveLoading = true;
  const startedAt = performance.now();
  try {
    const data = await fetchJson(LIVE_API_PATH);
    state.liveLatencyMs = performance.now() - startedAt;
    state.liveFetchCount += 1;
    state.liveConsecutiveFailures = 0;
    state.lastLiveFetchAt = data.capturedAt || Date.now();
    state.lastLiveSuccessAt = Date.now();
    state.lastLiveError = data.error || "";
    state.liveItems = data.items || [];
    state.liveLastItemCount = state.liveItems.length;
    syncLivePushItems(state.liveItems);
    await refreshPriceAlertQuotes().catch(() => false);
    renderLiveMonitor();
  } catch (error) {
    state.liveLatencyMs = performance.now() - startedAt;
    state.liveFetchCount += 1;
    state.liveFailureCount += 1;
    state.liveConsecutiveFailures += 1;
    state.lastLiveError = error.message;
    state.lastLiveFetchAt = Date.now();
    monitorStatus.textContent = `实时监控暂不可用：${error.message}`;
    renderLiveMonitor();
  } finally {
    state.liveLoading = false;
  }
}

function findStock(symbol) {
  const normalized = normalizeSymbol(symbol);
  const canonical = canonicalSymbol(normalized);
  const core = calledStocks.find((stock) => stockAliases(stock).includes(normalized) || stockAliases(stock).includes(canonical));
  if (core) return core;
  return socialCandidateStocks(new Set(), SOCIAL_CANDIDATE_LIMIT).find((stock) => stockAliases(stock).includes(normalized) || stockAliases(stock).includes(canonical));
}

function fallbackStock(symbol) {
  const normalized = normalizeSymbol(symbol);
  const canonical = canonicalSymbol(normalized);
  const aliases = aliasesForSymbol(canonical);
  const identity = identityForSymbol(canonical);
  const metric =
    (state.distillation?.symbols || []).find((item) => aliases.includes(normalizeSymbol(item.symbol)) || canonicalSymbol(item.symbol) === canonical) || {};
  return {
    symbol: canonical,
    marketSymbol: identity?.marketSymbol || canonical,
    aliases,
    name: identity?.companyName || canonical,
    theme: metric.dominantTheme || "general",
    themeLabel: themeNames[metric.dominantTheme] || "通用美股研究",
    thesis: "这支股票不在 Serenity 核心覆盖名单里，系统会先用公开行情、行业、财务和新闻做通用初筛。",
    risk: "需要补财报、公告、竞争格局、客户证据和估值对比；不要把通用初筛误读成 Serenity 已经喊单。",
    fallbackMarketCap: 0,
    isUniversal: true,
  };
}

function profileForQuote(quote = {}) {
  return {
    companyName: quote.profile?.companyName || quote.companyName || "",
    sector: quote.profile?.sector || quote.sector || "",
    industry: quote.profile?.industry || quote.industry || "",
    exchange: quote.profile?.exchange || quote.exchange || "",
    stockType: quote.profile?.stockType || "",
    isNasdaq100: Boolean(quote.profile?.isNasdaq100),
    marketStatus: quote.profile?.marketStatus || "",
  };
}

function hydrateUniversalStock(stock, quote = {}) {
  if (!stock.isUniversal) return stock;
  const profile = profileForQuote(quote);
  const companyName = profile.companyName || quote.longName || quote.shortName || stock.name;
  const industry = profile.industry || profile.sector || "通用美股研究";
  const sectorText = profile.sector ? `${profile.sector} / ${industry}` : industry;
  if (stock.isSocialCandidate) {
    const metric = stock.socialMetric || metricForStock(stock) || {};
    const latest = metric.latest ? `，最新样本 ${dateLabel(metric.latest)}` : "";
    return {
      ...stock,
      name: companyName || stock.symbol,
      themeLabel: stock.themeLabel || industry,
      thesis: `X/Twitter 讨论度进入候选池：${compact.format(Number(metric.mentions || 0))} 次提及，materiality ${Math.round(Number(metric.materiality || 0))}${latest}。报告会先判断热度是否有基本面锚点，再核查价格、估值、新闻和财务质量。`,
      risk: `社媒热度不等于可交易结论；优先核查 ${industry} 的收入质量、估值拥挤、公告证据、客户验证和异常成交是否能支持行情延续。`,
    };
  }
  return {
    ...stock,
    name: companyName || stock.symbol,
    themeLabel: industry,
    thesis: `${companyName || stock.symbol} 属于 ${sectorText}。这不是 Serenity 核心喊单标的，报告会把它当作通用美股，用价格、市值、财务质量、新闻催化和 Serenity 供应链框架做初筛。`,
    risk: `通用标的优先核查 ${industry} 的增长持续性、估值拥挤、竞争格局、财务质量和近期新闻是否改变基本面。`,
  };
}

async function ensureQuote(symbol, options = {}) {
  const normalized = canonicalSymbol(symbol);
  const requestSymbol = normalized;
  const cached = state.quotes.get(normalized);
  const fetchedAt = state.quoteFetchedAt.get(normalized) || 0;
  const cacheMs = options.detail ? DETAIL_QUOTE_CACHE_MS : QUOTE_CACHE_MS;
  if (cached && Date.now() - fetchedAt < cacheMs && (!options.detail || cached.profile || cached.news || cached.financials)) return cached;
  const detail = options.detail ? "&detail=1" : "";
  const data = await fetchJson(`/api/quotes?symbols=${encodeURIComponent(requestSymbol)}${detail}`);
  const quote = data.quotes?.[0] || { requestedSymbol: normalized };
  state.quotes.set(normalized, quote);
  state.quoteFetchedAt.set(normalized, Date.now());
  const marketSymbol = marketSymbolFor(normalized);
  if (marketSymbol) {
    state.quotes.set(marketSymbol, quote);
    state.quoteFetchedAt.set(marketSymbol, Date.now());
  }
  if (quote.symbol) {
    state.quotes.set(normalizeSymbol(quote.symbol), quote);
    state.quoteFetchedAt.set(normalizeSymbol(quote.symbol), Date.now());
  }
  return quote;
}

function metricText(metric = {}, formatter = (value) => value) {
  if (!metric) return "";
  const value = metric.raw || (Number.isFinite(metric.value) ? formatter(metric.value) : "");
  if (!value) return "";
  const yoy = Number.isFinite(metric.yoy) ? ` · YoY ${formatPercent(metric.yoy)}` : "";
  const period = metric.period ? ` · ${metric.period}` : "";
  return `${value}${yoy}${period}`;
}

function financialRows(financials = {}) {
  const rows = [
    { label: "收入", value: metricText(financials.revenue) },
    { label: "毛利", value: metricText(financials.grossProfit) },
    { label: "营业利润", value: metricText(financials.operatingIncome) },
    { label: "净利润", value: metricText(financials.netIncome) },
    { label: "毛利率", value: Number.isFinite(financials.grossMargin) ? formatPercent(financials.grossMargin) : "" },
    { label: "营业利润率", value: Number.isFinite(financials.operatingMargin) ? formatPercent(financials.operatingMargin) : "" },
  ];
  return rows.filter((row) => row.value);
}

function marketRows(quote = {}, stock = {}) {
  const range =
    Number.isFinite(Number(quote.fiftyTwoWeekLow)) && Number.isFinite(Number(quote.fiftyTwoWeekHigh))
      ? `${formatPrice({ price: Number(quote.fiftyTwoWeekLow), currency: quote.currency })} - ${formatPrice({ price: Number(quote.fiftyTwoWeekHigh), currency: quote.currency })}`
      : "";
  const target =
    Number.isFinite(Number(quote.oneYearTarget)) && Number.isFinite(Number(quote.price)) && Number(quote.price)
      ? `${formatPrice({ price: Number(quote.oneYearTarget), currency: quote.currency })} (${formatPercent(((Number(quote.oneYearTarget) - Number(quote.price)) / Number(quote.price)) * 100)})`
      : "";
  const shortInterest = quote.shortInterest || {};
  return [
    { label: "市值", value: formatMarketCap(Number(quote.marketCap) || stock.fallbackMarketCap) },
    { label: "52 周区间", value: range },
    { label: "一年目标价", value: target },
    { label: "平均成交量", value: Number.isFinite(Number(quote.averageVolume)) ? compact.format(Number(quote.averageVolume)) : "" },
    {
      label: "空头覆盖天数",
      value: Number.isFinite(Number(shortInterest.daysToCover)) ? `${Number(shortInterest.daysToCover).toFixed(2)} 天 · ${shortInterest.settlementDate || "最近披露"}` : "",
    },
  ].filter((row) => row.value && row.value !== "--");
}

function pricePositionSummary(quote = {}) {
  const rangePct = priceRangePercent(quote);
  if (rangePct === null) {
    return {
      label: "价格区间待补",
      tone: "verify",
      text: "缺少完整 52 周区间，先不要把当前价格理解成低位或高位。",
    };
  }
  const rounded = Math.round(rangePct);
  if (rangePct >= 88) {
    return {
      label: `52 周高位附近 · ${rounded}%`,
      tone: "avoid",
      text: "价格已经靠近一年高位，新增买入必须依赖订单、业绩或主题扩散继续确认，不能只因推文追高。",
    };
  }
  if (rangePct >= 68) {
    return {
      label: `偏高区间 · ${rounded}%`,
      tone: "watch",
      text: "价格已有明显预期，适合等回踩或第二根放量确认，先防止买在情绪尾部。",
    };
  }
  if (rangePct <= 35) {
    return {
      label: `低位复核区 · ${rounded}%`,
      tone: "pursue",
      text: "价格离一年高点较远，若 thesis 没被证伪，更适合做证据复核和分批观察。",
    };
  }
  return {
    label: `区间中段 · ${rounded}%`,
    tone: "verify",
    text: "价格没有明显便宜或过热，核心看催化、成交量和同主题标的是否同步。",
  };
}

function quoteTargetSummary(quote = {}) {
  const price = Number(quote.price);
  const target = Number(quote.oneYearTarget);
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(target) || target <= 0) {
    return "卖方目标价缺失，不把目标价作为主要依据。";
  }
  const gap = ((target - price) / price) * 100;
  if (gap > 25) return `卖方目标价相对现价还有 ${formatPercent(gap)}，但需要用财报和客户证据确认。`;
  if (gap < -10) return `卖方目标价低于现价 ${formatPercent(Math.abs(gap))}，说明估值争议偏大。`;
  return `卖方目标价与现价差距 ${formatPercent(gap)}，更适合看业务证据而不是目标价。`;
}

function liquiditySummary(quote = {}) {
  const rawVolume = Number(quote.primaryVolume) || Number(quote.shareVolume);
  const rawAverage = Number(quote.averageVolume);
  const volume = Number.isFinite(rawVolume) && rawVolume > 0 ? rawVolume : null;
  const average = Number.isFinite(rawAverage) && rawAverage > 0 ? rawAverage : null;
  if (!Number.isFinite(volume) && !Number.isFinite(average)) return "成交量数据不足，盘中交易先降仓位。";
  if (Number.isFinite(volume) && Number.isFinite(average) && average > 0) {
    const ratio = volume / average;
    if (ratio >= 1.8) return `当日成交约为均量 ${ratio.toFixed(1)} 倍，说明资金有明显参与，仍需看收盘能否守住。`;
    if (ratio <= 0.55) return `当日成交只有均量 ${ratio.toFixed(1)} 倍，量能不足时不适合追涨确认。`;
    return `当日成交接近均量 ${ratio.toFixed(1)} 倍，暂未形成强资金确认。`;
  }
  return `平均成交量约 ${compact.format(average || volume)}，先确认流动性能否承接仓位。`;
}

function financialQualitySummary(financials = {}) {
  const revenueYoy = Number(financials.revenue?.yoy);
  const operatingMargin = Number(financials.operatingMargin);
  const netMargin = Number(financials.netMargin);
  const fragments = [];
  if (Number.isFinite(revenueYoy)) {
    fragments.push(revenueYoy > 18 ? `收入 YoY ${formatPercent(revenueYoy)}，增长仍有支撑` : revenueYoy < 0 ? `收入 YoY ${formatPercent(revenueYoy)}，先排除基本面走弱` : `收入 YoY ${formatPercent(revenueYoy)}，增长弹性一般`);
  }
  if (Number.isFinite(operatingMargin)) {
    fragments.push(operatingMargin > 18 ? `营业利润率 ${formatPercent(operatingMargin)}，盈利质量较好` : operatingMargin < 0 ? `营业利润率 ${formatPercent(operatingMargin)}，仍在亏损或投入期` : `营业利润率 ${formatPercent(operatingMargin)}，利润弹性需继续观察`);
  } else if (Number.isFinite(netMargin)) {
    fragments.push(netMargin > 12 ? `净利率 ${formatPercent(netMargin)}，盈利能力可用` : `净利率 ${formatPercent(netMargin)}，盈利质量仍需核查`);
  }
  return fragments.length ? fragments.join("；") : "财务摘要不足，需要补 10-K/10-Q、电话会和公司公告。";
}

function dataConfidence(stock = {}, quote = {}, metric = {}, evidence = []) {
  const newsCount = (quote.news || []).length;
  let score = 38;
  if (Number.isFinite(Number(quote.price))) score += 14;
  if (Number.isFinite(Number(quote.marketCap)) || stock.fallbackMarketCap) score += 12;
  if (quote.financials && Object.keys(quote.financials).length) score += 12;
  if (newsCount) score += 8;
  if (evidence.length) score += Math.min(14, evidence.length * 3);
  if (stock.isUniversal) score -= 18;
  score = Math.round(clamp(score, 15, 96));
  const label = score >= 78 ? "数据较完整" : score >= 58 ? "数据可用" : "数据需补强";
  const items = [
    Number.isFinite(Number(quote.price)) ? "实时价格已回填" : "缺实时价格",
    Number.isFinite(Number(quote.marketCap)) || stock.fallbackMarketCap ? "市值可用" : "缺市值",
    quote.financials && Object.keys(quote.financials).length ? "财务摘要可用" : "财务摘要待补",
    newsCount ? `${newsCount} 条公开新闻` : "新闻待补",
    stock.isUniversal ? "非 Serenity 核心喊单" : `${evidence.length} 条 Serenity 样本`,
    metric.mentions ? `${compact.format(metric.mentions)} 次历史提及` : "历史提及较少",
  ];
  return { score, label, items };
}

function quoteFreshnessLabel(quote = {}) {
  if (String(quote.provider || "").includes("快速框架")) return "即时生成 · 等待接口";
  if (!quote.updatedAt) return "等待详细数据";
  return `${dateTimeLabel(quote.updatedAt)} · ${agoLabel(quote.updatedAt)}`;
}

function quoteSourceLabel(quote = {}) {
  if (quote.provider) return quote.provider;
  if (Number.isFinite(Number(quote.price))) return "公开行情接口";
  return "快速框架";
}

function dataSourceRows(stock = {}, quote = {}, confidence = {}, evidence = []) {
  const newsCount = (quote.news || []).length;
  return [
    { label: "行情", value: quoteSourceLabel(quote), meta: quoteFreshnessLabel(quote) },
    { label: "财务", value: quote.financials && Object.keys(quote.financials).length ? "Nasdaq 财务摘要" : "待补财报摘要", meta: quote.financials?.period || "后台补全" },
    { label: "样本", value: stock.isUniversal ? "通用美股初筛" : "Serenity 公开样本", meta: `${evidence.length} 条命中样本` },
    { label: "新闻", value: newsCount ? "Yahoo / 公开新闻" : "待补新闻", meta: newsCount ? `${newsCount} 条` : "后台补全" },
    { label: "置信", value: confidence.label || "待评估", meta: `${confidence.score || "--"}/100` },
  ];
}

function decisionBriefRows(stock = {}, quote = {}, decision = {}, beginner = {}, plan = {}, checklist = {}, confidence = {}) {
  const reason = decision.reasons?.[0] || decision.oneLine || compactReason(stock.thesis);
  const trigger = entryGuideText(quote, beginner, plan);
  const invalidation = checklist.invalidation?.[0] || decision.blockers?.[0] || stock.risk || "价格、成交量或基本面证伪。";
  const verification = [
    checklist.confirmation?.[0],
    confidence.items?.find((item) => /财务|新闻|样本|价格/.test(item)),
    quote.provider ? `行情源：${quoteSourceLabel(quote)}` : "等待详细行情回填",
  ].filter(Boolean);
  return [
    { label: "结论", value: decision.actionLabel || "观察", body: decision.stance || decision.oneLine || "等待确认" },
    { label: "核心原因", value: decision.topDriver || "框架匹配", body: reason },
    { label: "触发价", value: plan.watchEntry ? formatMoney(plan.watchEntry) : "待价格回填", body: trigger },
    { label: "失效条件", value: stock.riskFlag ? "风险优先" : "反证优先", body: invalidation },
    { label: "待验证数据", value: confidence.label || "数据待补", body: verification.slice(0, 3).join("；") || "补财报、公告、新闻和成交量。" },
  ];
}

function entryGuideText(quote = {}, assessment = {}, plan = {}) {
  const price = Number(quote.price);
  if (!Number.isFinite(price) || price <= 0) return "缺少可用价格，暂不生成入场区间。";
  const current = formatPrice(quote);
  const watchEntry = plan.watchEntry ? formatMoney(plan.watchEntry) : "";
  const stop = plan.stopPrice ? formatMoney(plan.stopPrice) : "";
  const target = plan.targetOne ? formatMoney(plan.targetOne) : "";
  if (assessment.allowed) {
    return `现价 ${current}；试探仓参考 ${watchEntry || "回踩后重评"}，止损 ${stop || "待设"}，第一目标 ${target || "待定"}。`;
  }
  if (assessment.verdict === "wait") {
    return `暂不追价；回踩至 ${watchEntry || "更低区间"} 或突破放量后重评。`;
  }
  if (assessment.verdict === "blocked") {
    return `暂不参与；等待价格回落、风险解除或公告证据补强。`;
  }
  return `纳入观察池；价格、量能和证据同步改善后重评。`;
}

function researchChecklist(stock = {}, quote = {}, decision = {}, playbook = {}, evidence = [], metric = {}) {
  const profile = profileForQuote(quote);
  const priceSummary = pricePositionSummary(quote);
  const confirmation = [
    decision.nextActions?.[0],
    playbook.catalysts?.[0],
    liquiditySummary(quote),
    profile.industry ? `同行 ${profile.industry} 是否同步走强` : "同主题标的是否同步走强",
  ].filter(Boolean);
  const invalidation = [
    decision.blockers?.[0],
    stock.risk,
    playbook.checks?.[0],
    priceSummary.tone === "avoid" ? "高位放量失败或冲高回落，先不追" : "",
  ]
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
  const evidenceLine = stock.isUniversal
    ? "这不是 Serenity 核心喊单，优先补财报、公告和新闻。"
    : `已有 ${evidence.length} 条公开样本，历史提及 ${compact.format(metric.mentions || 0)} 次。`;
  return {
    confirmation: confirmation.slice(0, 4),
    invalidation: invalidation.slice(0, 4),
    evidenceLine,
    priceSummary,
  };
}

function executionCards(stock = {}, quote = {}, decision = {}, beginner = {}, plan = {}, playbook = {}, evidence = [], metric = {}) {
  const checklist = researchChecklist(stock, quote, decision, playbook, evidence, metric);
  return [
    {
      label: "投资动作",
      value: beginner.label || decision.actionLabel,
      tone: beginner.className || decision.actionClass,
      body: beginner.summary || decision.oneLine,
    },
    {
      label: "交易计划",
      value: plan.allowRealTrade ? "试探仓" : "等待信号",
      tone: plan.allowRealTrade ? "ready" : "wait",
      body: entryGuideText(quote, beginner, plan),
    },
    {
      label: "确认信号",
      value: checklist.priceSummary.label,
      tone: checklist.priceSummary.tone,
      body: checklist.confirmation.slice(0, 3).join("；"),
    },
    {
      label: "降级条件",
      value: stock.riskFlag ? "风险优先" : "反证优先",
      tone: "blocked",
      body: checklist.invalidation.slice(0, 3).join("；"),
    },
  ];
}

function peerCandidates(stock, quote = {}) {
  const profile = profileForQuote(quote);
  const text = `${profile.sector} ${profile.industry} ${stock.themeLabel}`.toLowerCase();
  const groups = [
    { match: /semiconductor|chip|electronic|光|photon|cpo|silicon/i, symbols: ["NVDA", "AMD", "AVGO", "MRVL", "ALAB", "COHR"] },
    { match: /software|application|infrastructure|cloud|ai/i, symbols: ["MSFT", "AMZN", "META", "PLTR", "SNOW", "DDOG", "CRWD"] },
    { match: /bank|broker|capital|financial|insurance/i, symbols: ["HOOD", "JPM", "GS", "MS", "COIN"] },
    { match: /auto|vehicle|ev|automotive/i, symbols: ["TSLA", "RIVN", "GM", "F"] },
    { match: /space|aerospace|defense/i, symbols: ["RKLB", "LMT", "NOC", "RTX"] },
    { match: /biotech|pharma|health|medical/i, symbols: ["LLY", "NVO", "MRK", "ABBV", "AMGN"] },
  ];
  const matched = groups.find((group) => group.match.test(text));
  const symbols = (matched?.symbols || calledStocks.slice(0, 6).map((item) => item.symbol)).filter((symbol) => normalizeSymbol(symbol) !== normalizeSymbol(stock.symbol));
  return symbols.slice(0, 5);
}

function formatShares(value) {
  const shares = Number(value);
  if (!Number.isFinite(shares) || shares <= 0) return "0";
  if (shares >= 10) return shares.toFixed(0);
  return shares.toFixed(2);
}

function renderPaperTrades(activeSymbol = "") {
  if (!state.paperTrades.length) {
    return `<div class="paper-empty">暂无模拟记录。可先记录观察仓，跟踪 1D / 7D / 30D 表现。</div>`;
  }
  const active = normalizeSymbol(activeSymbol);
  return `
    <div class="paper-trade-list">
      ${state.paperTrades
        .slice(0, 6)
        .map((trade) => {
          const returnPercent = paperTradeReturn(trade);
          const currentClass = Number(returnPercent) >= 0 ? "up" : "down";
          const isActive = normalizeSymbol(trade.symbol) === active;
          return `
            <article class="paper-trade-row ${isActive ? "active" : ""}">
              <div>
                <strong>${escapeHtml(trade.symbol)} ${isActive ? "· 当前研报" : ""}</strong>
                <small>${escapeHtml(dateLabel(trade.createdAt))} · ${escapeHtml(trade.verdict || "模拟观察")}</small>
              </div>
              <span><small>入场</small><b>${formatMoney(trade.entryPrice)}</b></span>
              <span><small>止损/观察线</small><b>${trade.stopPrice ? formatMoney(trade.stopPrice) : "--"}</b></span>
              <span><small>至今</small><b class="${currentClass}">${returnPercent === null ? "--" : formatPercent(returnPercent)}</b></span>
              <button class="secondary" type="button" data-paper-delete="${escapeHtml(trade.id)}">删除</button>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderBeginnerMode(stock, quote, assessment, plan) {
  const profile = state.beginnerProfile || defaultBeginnerProfile();
  const realTradeCopy = plan.allowRealTrade
    ? `建议仓位 ${formatMoney(plan.positionCost)}，约 ${formatShares(plan.fractionalShares)} 股；整股账户参考 ${plan.wholeShares} 股。`
    : `暂不建仓；关注 ${plan.watchEntry ? formatMoney(plan.watchEntry) : "更优价格"} 附近的再评估机会。`;
  return `
    <section id="beginner-guard" class="beginner-guard ${escapeHtml(assessment.className)}">
      <div class="beginner-head">
        <div>
          <span>Risk Budget</span>
          <h3>${escapeHtml(assessment.label)}</h3>
          <p>${escapeHtml(assessment.summary)}</p>
        </div>
        <div class="beginner-score">
          <b>${assessment.score}</b>
          <small>执行分</small>
        </div>
      </div>
      <div class="beginner-grid">
        <article>
          <strong>主要约束</strong>
          ${assessment.reasons.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
        </article>
        <article>
          <strong>仓位 / 止损</strong>
          <p>${escapeHtml(realTradeCopy)}</p>
          <div class="risk-metrics">
            <span><small>单笔风险</small><b>${formatMoney(plan.riskBudget)}</b></span>
            <span><small>仓位上限</small><b>${formatMoney(plan.maxPositionBudget)}</b></span>
            <span><small>止损价</small><b>${plan.stopPrice ? formatMoney(plan.stopPrice) : "--"}</b></span>
            <span><small>第一目标</small><b>${plan.targetOne ? formatMoney(plan.targetOne) : "--"}</b></span>
          </div>
        </article>
        <article>
          <strong>风险参数</strong>
          <label>账户金额
            <input type="number" min="500" step="100" data-beginner-field="accountSize" value="${profile.accountSize}" />
          </label>
          <label>单笔最大亏损 %
            <input type="number" min="0.25" max="5" step="0.25" data-beginner-field="riskPercent" value="${profile.riskPercent}" />
          </label>
          <label>单票仓位上限 %
            <input type="number" min="1" max="25" step="0.5" data-beginner-field="maxPositionPercent" value="${profile.maxPositionPercent}" />
          </label>
        </article>
      </div>
      <div class="beginner-plan">
        <div>
          <strong>触发条件</strong>
          ${assessment.buyRules.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
        <div>
          <strong>退出条件</strong>
          ${assessment.invalidations.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
      <div class="beginner-actions">
        <button type="button" data-paper-trade="${escapeHtml(stock.symbol)}">加入模拟观察</button>
        ${binanceWalletLink()}
        <small>${plan.allowRealTrade ? "记录入场、止损与目标价，用于事后复盘。" : "当前仅建议观察，不建议建立实盘仓位。"}</small>
      </div>
      <div class="buy-alert-builder">
        <div>
          <strong>价格提醒</strong>
          <small>用具体价位约束执行。</small>
        </div>
        <button class="secondary" type="button" data-price-alert="pullback">等回踩提醒</button>
        <button class="secondary" type="button" data-price-alert="breakout">突破确认提醒</button>
        <button class="secondary" type="button" data-price-alert="stop">止损提醒</button>
      </div>
      <div class="inline-alerts">
        ${renderInlinePriceAlerts(stock.symbol)}
      </div>
      <div class="paper-trades-panel">
        <div class="paper-title">
          <strong>模拟观察</strong>
          <small>${state.paperTrades.length} 条记录 · 用于验证执行纪律</small>
        </div>
        ${renderPaperTrades(stock.symbol)}
      </div>
    </section>
  `;
}

function formatNewsDate(value) {
  if (!value) return "";
  return dateLabel(value);
}

function buildReport(stock, quote) {
  const enriched = { ...stock, quote, marketCap: Number(quote.marketCap) || stock.fallbackMarketCap || 0 };
  const metric = metricForStock(stock) || {};
  const score = scoreStock(enriched, quote);
  const space = upsideSpace(score, enriched);
  const evidence = getCalledEvidence(stock, 5);
  const capSource = Number(quote.marketCap) ? "公开接口" : enriched.marketCap ? "参考市值" : "待补源";
  const target = Number(quote.oneYearTarget);
  const targetText = Number.isFinite(target) && Number.isFinite(Number(quote.price)) ? `${formatPercent(((target - Number(quote.price)) / Number(quote.price)) * 100)} 卖方目标差` : "不依赖卖方目标";
  const position = pricePosition(quote);
  const sentimentLine = `${compact.format(metric.mentions || 0)} 次提及 · 多 ${metric.bull || 0} / 空 ${metric.bear || 0} / 中性 ${metric.neutral || 0}`;
  const profile = profileForQuote(quote);
  const marketData = marketRows(quote, enriched);
  const financialData = financialRows(quote.financials || {});
  const peers = peerCandidates(stock, quote);
  const news = (quote.news || []).slice(0, 3);
  const coverageLine = stock.isUniversal ? "通用美股初筛 · 非 Serenity 核心喊单" : sentimentLine;
  const coverageSentence = stock.isUniversal ? "非 Serenity 核心样本，结论仅作为通用美股初筛。" : `Serenity 样本 ${evidence.length} 条，需与财报、公告及订单证据交叉验证。`;
  const decision = decisionFor(enriched, quote);
  const playbook = playbookFor(stock);
  const breakdown = scoreBreakdown(enriched, quote, metric);
  const scenarios = scenarioSet(score, stock, quote, space);
  const beginner = beginnerTradeAssessment(enriched, quote, decision, space);
  const positionPlan = beginnerPositionPlan(quote, state.beginnerProfile, beginner, space);
  const execution = executionCards(enriched, quote, decision, beginner, positionPlan, playbook, evidence, metric);
  const confidence = dataConfidence(enriched, quote, metric, evidence);
  const checklist = researchChecklist(enriched, quote, decision, playbook, evidence, metric);
  const sourceRows = dataSourceRows(enriched, quote, confidence, evidence);
  const briefRows = decisionBriefRows(enriched, quote, decision, beginner, positionPlan, checklist, confidence);
  const topDrivers = breakdown
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.label)
    .join("、");
  const pricePositionLine = position ? position.replace(/[。.]$/, "") : "价格位置待补";
  const riskRewardLine = `验证上行 +${space.upside}% / 反证下行 -${space.downside}%；${pricePositionLine}；${targetText}`;
  const thesisLine = compactReason(stock.thesis, 128);
  state.activeReport = { stock: enriched, quote };
  state.latestReportText = plainReportText(stock, quote, score, space, playbook, breakdown, scenarios, evidence, metric, {
    marketRows: marketData,
    financialRows: financialData,
    peers,
    news,
    decision,
    beginner,
    positionPlan,
    execution,
    dataConfidence: confidence,
  });

  reportOutput.innerHTML = `
    <header class="report-head">
      <div class="report-title">
        <strong>${escapeHtml(stock.symbol)} · ${escapeHtml(stock.name)}</strong>
        <small>${escapeHtml([stock.themeLabel, profile.exchange, conclusionFor(score, stock)].filter(Boolean).join(" · "))}</small>
      </div>
      <div class="report-score"><b>${score}</b><small>Serenity 分</small></div>
    </header>
    <div class="report-action-row">
      <span>${stock.isUniversal ? "公开行情 / 财务 / 新闻初筛" : "公开样本 / 行情 / 风险收益框架"}</span>
      ${binanceWalletLink("打开 Binance 钱包")}
      <button class="secondary copy-report" type="button" data-copy-report>复制研报摘要</button>
    </div>
    <section class="research-brief-card">
      <div class="brief-head">
        <span>Decision Card</span>
        <strong>投研决策卡</strong>
      </div>
      <div class="brief-grid">
        ${briefRows
          .map(
            (item) => `
              <article>
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                <p>${escapeHtml(item.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="data-source-strip">
      ${sourceRows
        .map(
          (item) => `
            <span>
              <small>${escapeHtml(item.label)}</small>
              <b>${escapeHtml(item.value)}</b>
              <em>${escapeHtml(item.meta)}</em>
            </span>
          `
        )
        .join("")}
    </section>
    <section class="decision-card ${escapeHtml(decision.actionClass)}">
      <div class="decision-score">
        <span>框架匹配</span>
        <strong>${decision.fit}</strong>
        <small>/100</small>
      </div>
      <div class="decision-content">
        <div class="decision-title-row">
          <span class="decision-pill ${escapeHtml(decision.actionClass)}">${escapeHtml(decision.actionLabel)}</span>
          <small>${escapeHtml(stock.isUniversal ? "通用初筛" : `${decision.evidenceCount} 条公开样本`)}</small>
        </div>
        <h3>${escapeHtml(decision.stance)}</h3>
        <p>${escapeHtml(decision.oneLine)}</p>
        <div class="decision-reasons">
          ${decision.reasons.slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
      <div class="decision-next">
        <strong>催化剂</strong>
        ${decision.nextActions.slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
    <section class="execution-panel">
      <div class="section-kicker">
        <span>Investment Brief</span>
        <strong>结论优先，数据验证</strong>
      </div>
      <div class="execution-grid">
        ${execution
          .map(
            (item) => `
              <article class="execution-card ${escapeHtml(item.tone)}">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                <p>${escapeHtml(item.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="data-confidence">
        <div>
          <strong>${escapeHtml(confidence.label)}</strong>
          <small>${confidence.score}/100 · ${escapeHtml(checklist.evidenceLine)}</small>
        </div>
        <div>
          ${confidence.items.slice(0, 6).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
    </section>
    ${renderBeginnerMode(enriched, quote, beginner, positionPlan)}
    <div class="report-grid">
      <div class="report-metric"><span>当前价格</span><strong>${formatPrice(quote)}</strong></div>
      <div class="report-metric"><span>当日涨跌</span><strong class="${Number(quote.changePercent) >= 0 ? "up" : "down"}">${formatPercent(quote.changePercent)}</strong></div>
      <div class="report-metric"><span>市值</span><strong>${formatMarketCap(enriched.marketCap)}</strong><span>${capSource}</span></div>
      <div class="report-metric"><span>行业</span><strong>${escapeHtml(profile.sector || stock.themeLabel || "--")}</strong><span>${escapeHtml(profile.industry || "")}</span></div>
      <div class="report-metric"><span>52 周区间</span><strong>${escapeHtml(marketData.find((row) => row.label === "52 周区间")?.value || "--")}</strong></div>
      <div class="report-metric"><span>覆盖状态</span><strong>${escapeHtml(coverageLine)}</strong></div>
    </div>
    <section class="report-summary">
      <h3>投资观点</h3>
      <p><b>结论：</b>${escapeHtml(conclusionFor(score, stock))}。主要支撑因子：${escapeHtml(topDrivers)}。</p>
      <p><b>核心逻辑：</b>${escapeHtml(thesisLine)}</p>
      <p><b>风险收益：</b>${escapeHtml(riskRewardLine)}</p>
    </section>
    <section class="report-section">
      <h3>关键数据</h3>
      <div class="data-card-grid">
        <article class="data-card">
          <strong>估值与交易</strong>
          ${
            marketData.length
              ? marketData.map((row) => `<span><b>${escapeHtml(row.label)}</b><small>${escapeHtml(row.value)}</small></span>`).join("")
              : `<p>估值与交易数据待补。</p>`
          }
        </article>
        <article class="data-card">
          <strong>财务质量</strong>
          ${
            financialData.length
              ? financialData.map((row) => `<span><b>${escapeHtml(row.label)}</b><small>${escapeHtml(row.value)}</small></span>`).join("")
              : `<p>财务摘要待补，需核查 10-K/10-Q 或财报。</p>`
          }
        </article>
        <article class="data-card">
          <strong>同行候选</strong>
          <div class="peer-tags">
            ${peers.map((symbol) => `<button class="secondary" type="button" data-symbol="${escapeHtml(symbol)}">${escapeHtml(symbol)}</button>`).join("")}
          </div>
        </article>
      </div>
    </section>
    <section class="report-section">
      <h3>评分因子</h3>
      <div class="score-breakdown">
        ${breakdown
          .map(
            (item) => `
              <div class="score-line">
                <div>
                  <strong>${escapeHtml(item.label)}</strong>
                  <small>${escapeHtml(item.note)}</small>
                </div>
                <b>${item.score}</b>
                <span class="score-track"><i style="width: ${item.score}%"></i></span>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="report-section">
      <h3>风险收益</h3>
      <p>${escapeHtml(coverageSentence)} ${escapeHtml(entryGuideText(quote, beginner, positionPlan))} ${escapeHtml(quoteTargetSummary(quote))}</p>
      <div class="scenario-grid">
        ${scenarios
          .map(
            (item) => `
              <article class="scenario-card">
                <span>${escapeHtml(item.tag)}</span>
                <strong>${escapeHtml(item.label)} <b>${escapeHtml(item.range)}</b></strong>
                <p>${escapeHtml(item.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
    <section class="report-section">
      <h3>催化剂</h3>
      <div class="check-grid">
        ${playbook.catalysts.slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
    <section class="report-section">
      <h3>反证条件</h3>
      <ul>
        <li>${escapeHtml(stock.risk)}</li>
        ${playbook.checks.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
    ${
      news.length
        ? `
          <section class="report-section">
            <h3>最新公开新闻</h3>
            <div class="evidence-list news-list">
              ${news
                .map(
                  (item) => `
                    <a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">
                      <strong>${escapeHtml(item.title || "公开新闻")}</strong>
                      <small>${escapeHtml([formatNewsDate(item.date), item.publisher, (item.relatedTickers || []).slice(0, 4).join(" / ")].filter(Boolean).join(" · "))}</small>
                    </a>
                  `
                )
                .join("")}
            </div>
          </section>
        `
        : ""
    }
    <section class="report-section">
      <h3>核心样本</h3>
      <div class="evidence-list">
        ${
          evidence.length
            ? evidence
                .map(
                  (item) => `
                    <a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">
                      <strong>${escapeHtml((item.title || "Serenity 公开样本").slice(0, 110))}</strong>
                      <span>${escapeHtml((item.body || item.title || "公开样本待补正文").slice(0, 120))}</span>
                      <small>${dateLabel(item.date)} · ${escapeHtml(item.theme || "general")} · materiality ${item.materiality || "--"}</small>
                    </a>
                  `
                )
                .join("")
            : `<p>暂无高质量样本，需补原文、财报和供应链证据。</p>`
        }
      </div>
    </section>
    <p class="report-note">公开资料整理，不构成投资建议。</p>
  `;
}

async function analyzeSymbol(symbol, options = {}) {
  const normalized = canonicalSymbol(symbol);
  if (!normalized) return;
  const requestId = state.analysisRequestId + 1;
  state.analysisRequestId = requestId;
  if (options.route !== false) setActivePage("analysis", { updateHash: true, scroll: false });
  tickerInput.value = normalized;
  heroTickerInput.value = normalized;
  state.activeSymbol = normalized;
  renderStockList();
  let stock = findStock(normalized) || fallbackStock(normalized);
  const quoteSymbol = stock.symbol || normalized;
  const quickQuote = quickQuoteForSymbol(stock, quoteSymbol);
  const quickStock = hydrateUniversalStock(stock, quickQuote);
  state.activeSymbol = quickStock.symbol;
  buildReport(quickStock, quickQuote);
  renderStockList();
  if (options.scroll !== false) document.querySelector("#analysis")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const detailPromise = ensureQuote(quoteSymbol, { detail: true })
    .then((quote) => {
      if (state.analysisRequestId !== requestId) return null;
      const detailedStock = hydrateUniversalStock(stock, quote);
      state.quotes.set(detailedStock.symbol, quote);
      if (detailedStock.marketSymbol) state.quotes.set(detailedStock.marketSymbol, quote);
      state.activeSymbol = detailedStock.symbol;
      buildReport(detailedStock, quote);
      renderStockList();
      return quote;
    })
    .catch((error) => {
      if (state.analysisRequestId === requestId) {
        reportOutput.insertAdjacentHTML(
          "afterbegin",
          `<p class="report-note">详细数据接口暂缓：${escapeHtml(error.message)}。当前先展示快速框架。</p>`
        );
      }
      return null;
    });

  if (options.awaitDetail) await detailPromise;
}

function storeQuote(quote = {}) {
  const requested = normalizeSymbol(quote.requestedSymbol || quote.symbol);
  const canonical = canonicalSymbol(requested || quote.symbol);
  state.quotes.set(requested, quote);
  state.quoteFetchedAt.set(requested, Date.now());
  if (canonical) {
    state.quotes.set(canonical, quote);
    state.quoteFetchedAt.set(canonical, Date.now());
  }
  const marketSymbol = marketSymbolFor(canonical);
  if (marketSymbol) {
    state.quotes.set(marketSymbol, quote);
    state.quoteFetchedAt.set(marketSymbol, Date.now());
  }
  if (quote.symbol) {
    state.quotes.set(normalizeSymbol(quote.symbol), quote);
    state.quoteFetchedAt.set(normalizeSymbol(quote.symbol), Date.now());
  }
}

async function loadQuotes(options = {}) {
  const includeCore = options.core !== false;
  const includeSocial = options.social !== false;
  const coreAliases = new Set();
  for (const stock of calledStocks) {
    for (const alias of stockAliases(stock)) coreAliases.add(alias);
  }
  const coreSymbols = includeCore ? calledStocks.map((stock) => stock.symbol) : [];
  const socialSymbols = includeSocial ? socialCandidateStocks(coreAliases, SOCIAL_PREFETCH_LIMIT).map((stock) => stock.symbol) : [];
  const symbols = uniqueSymbols([...coreSymbols, ...socialSymbols]);
  for (let index = 0; index < symbols.length; index += 32) {
    const batch = symbols.slice(index, index + 32).join(",");
    const data = await fetchJson(`/api/quotes?symbols=${encodeURIComponent(batch)}`);
    for (const quote of data.quotes || []) {
      storeQuote(quote);
    }
  }
}

async function init() {
  initPageRouting();
  initPushPreferences();
  initBeginnerProfile();
  initServiceWorker().then(renderLiveMonitor);
  reportOutput.innerHTML = `<div class="empty-report">输入 ticker 或点击左侧名单，生成一份 Serenity 风格投研报告。</div>`;
  renderQuickTickers();
  const [publicData, symbolAliasData] = await Promise.all([
    fetchJson("./data/serenity-public.json"),
    fetchJson("./data/symbol-aliases.json").catch(() => ({ identities: [] })),
  ]);
  loadSymbolIdentities(symbolAliasData.identities || []);
  applySymbolIdentitiesToCalledStocks();
  renderTickerSuggestions();
  state.research = { profile: publicData.profile || {} };
  state.tweets = {
    commentCount: publicData.stats?.commentCount || 0,
    fxTwitterProfile: { tweets: publicData.stats?.profileTweets || 0 },
    items: publicData.items || [],
  };
  state.distillation = {
    parsedItems: publicData.stats?.parsedItems || 0,
    commentCount: publicData.stats?.commentCount || 0,
    rules: publicData.rules || [],
    symbols: publicData.symbols || [],
  };
  renderTickerSuggestions();
  state.history = publicData.history || [];
  state.monitor = publicData.monitor || null;
  renderHeroStats();
  renderMethodList();
  renderTrackRecordList();
  renderBStocks();
  loadBStocks().catch(() => false);
  renderLiveMonitor();
  loadLiveMonitor();
  setInterval(loadLiveMonitor, WEB_PUSH_POLL_MS);
  renderStockList();
  renderOpportunityList();
  renderScreener();
  loadQuotes({ social: false })
    .then(() => {
      renderTickerSuggestions();
      renderStockList();
      renderOpportunityList();
      renderScreener();
      return loadQuotes({ core: false, social: true });
    })
    .then(() => {
      renderTickerSuggestions();
      renderStockList();
      renderOpportunityList();
      renderScreener();
    })
    .catch(() => false);
  refreshPriceAlertQuotes(true)
    .then(() => checkPriceAlerts())
    .catch(() => false);
  if (pageFromHash() === "analysis") analyzeSymbol("AAOI", { route: false, scroll: false });
  loadPerformance();
}

stockSearch.addEventListener("input", renderStockList);
themeFilter.addEventListener("change", renderStockList);
sortMode.addEventListener("change", renderStockList);
screenerSearch.addEventListener("input", renderScreener);
screenerTheme.addEventListener("change", renderScreener);
screenerSignal.addEventListener("change", renderScreener);
screenerSort.addEventListener("change", renderScreener);
bstockRefresh.addEventListener("click", () => {
  loadBStocks().catch(() => false);
});

stockList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-symbol]");
  if (row) analyzeSymbol(row.dataset.symbol);
});

opportunityList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-symbol]");
  if (row) analyzeSymbol(row.dataset.symbol);
});

screenerList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-symbol]");
  if (row) analyzeSymbol(row.dataset.symbol);
});

bstockList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

liveTweetList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

monitorSignalBoard.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

monitorHistoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

dailyTradeReport.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

priceAlertPanel.addEventListener("click", (event) => {
  const symbolButton = event.target.closest("[data-symbol]");
  if (symbolButton) {
    analyzeSymbol(symbolButton.dataset.symbol);
    return;
  }
  const deleteButton = event.target.closest("[data-alert-delete]");
  if (deleteButton) {
    deletePriceAlert(deleteButton.dataset.alertDelete);
    if (state.activeReport) buildReport(state.activeReport.stock, state.activeReport.quote);
    renderLiveMonitor();
  }
});

webPushControls.addEventListener("click", async (event) => {
  const installButton = event.target.closest("[data-pwa-install]");
  if (installButton) {
    await installPwa();
    return;
  }

  const notifyButton = event.target.closest("[data-push-notify]");
  if (notifyButton) {
    await toggleNotifications();
    return;
  }

  const soundButton = event.target.closest("[data-push-sound]");
  if (soundButton) {
    await toggleSound();
    return;
  }

  const translateButton = event.target.closest("[data-push-translate]");
  if (translateButton) {
    toggleTranslations();
    return;
  }

  const presetButton = event.target.closest("[data-watch-preset]");
  if (presetButton) {
    addWatchTokens(parseWatchTokens(presetButton.dataset.watchPreset));
    return;
  }

  const removeButton = event.target.closest("[data-watch-remove]");
  if (removeButton) {
    saveWatchlist(state.watchlist.filter((token) => token !== normalizeWatchToken(removeButton.dataset.watchRemove)));
    return;
  }

  const clearButton = event.target.closest("[data-watch-clear]");
  if (clearButton) {
    saveWatchlist([]);
  }
});

webPushControls.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target.querySelector("input[name='watch']");
  const tokens = parseWatchTokens(input?.value || "");
  if (tokens.length) {
    addWatchTokens(tokens);
    input.value = "";
  }
});

trackRecordList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

quickTickers.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

reportOutput.addEventListener("click", async (event) => {
  const symbolButton = event.target.closest("[data-symbol]");
  if (symbolButton) {
    analyzeSymbol(symbolButton.dataset.symbol);
    return;
  }
  const priceAlertButton = event.target.closest("[data-price-alert]");
  if (priceAlertButton && state.activeReport) {
    const { stock, quote } = state.activeReport;
    const score = scoreStock(stock, quote);
    const space = upsideSpace(score, stock);
    const decision = decisionFor(stock, quote);
    const assessment = beginnerTradeAssessment(stock, quote, decision, space);
    const plan = beginnerPositionPlan(quote, state.beginnerProfile, assessment, space);
    if (addPriceAlert(stock, quote, plan, priceAlertButton.dataset.priceAlert)) {
      buildReport(stock, quote);
      renderLiveMonitor();
    }
    return;
  }
  const paperButton = event.target.closest("[data-paper-trade]");
  if (paperButton && state.activeReport) {
    const { stock, quote } = state.activeReport;
    const score = scoreStock(stock, quote);
    const space = upsideSpace(score, stock);
    const decision = decisionFor(stock, quote);
    const assessment = beginnerTradeAssessment(stock, quote, decision, space);
    const plan = beginnerPositionPlan(quote, state.beginnerProfile, assessment, space);
    if (addPaperTrade(stock, quote, assessment, plan)) {
      buildReport(stock, quote);
    }
    return;
  }
  const deleteButton = event.target.closest("[data-paper-delete]");
  if (deleteButton) {
    deletePaperTrade(deleteButton.dataset.paperDelete);
    if (state.activeReport) buildReport(state.activeReport.stock, state.activeReport.quote);
    return;
  }
  const button = event.target.closest("[data-copy-report]");
  if (!button || !state.latestReportText) return;
  const copied = await copyText(state.latestReportText);
  if (copied) {
    button.textContent = "已复制";
    setTimeout(() => {
      button.textContent = "复制研报摘要";
    }, 1400);
  } else {
    button.textContent = "复制失败";
    setTimeout(() => {
      button.textContent = "复制研报摘要";
    }, 1400);
  }
});

reportOutput.addEventListener("change", (event) => {
  const input = event.target.closest("[data-beginner-field]");
  if (!input) return;
  saveBeginnerProfile({
    ...state.beginnerProfile,
    [input.dataset.beginnerField]: Number(input.value),
  });
  if (state.activeReport) buildReport(state.activeReport.stock, state.activeReport.quote);
});

analysisForm.addEventListener("submit", (event) => {
  event.preventDefault();
  analyzeSymbol(tickerInput.value);
});

heroAnalysisForm.addEventListener("submit", (event) => {
  event.preventDefault();
  analyzeSymbol(heroTickerInput.value);
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.pwaInstallPrompt = event;
  renderLiveMonitor();
});

window.addEventListener("appinstalled", () => {
  state.pwaInstalled = true;
  state.pwaInstallPrompt = null;
  renderLiveMonitor();
});

init().catch((error) => {
  listStatus.textContent = `加载失败：${error.message}`;
  reportOutput.innerHTML = `<div class="empty-report">加载失败：${escapeHtml(error.message)}</div>`;
});
