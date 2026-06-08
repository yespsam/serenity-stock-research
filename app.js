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
  general: "通用",
};

const state = {
  research: null,
  tweets: null,
  distillation: null,
  quotes: new Map(),
  renderedStocks: [],
  activeSymbol: "AAOI",
  latestReportText: "",
  history: [],
  performance: new Map(),
  monitor: null,
  liveItems: [],
  liveSeenIds: new Set(),
  livePending: new Set(),
  liveResearchPacks: new Map(),
  webPushInitialized: false,
  lastLiveFetchAt: null,
  lastLiveNewAt: null,
  lastLiveNewId: "",
  lastMatchedAlertAt: null,
  lastMatchedAlertId: "",
  lastLiveError: "",
  liveLoading: false,
  notificationEnabled: false,
  soundEnabled: false,
  watchlist: [],
  soundUnlocked: false,
};

const pageParams = new URLSearchParams(window.location.search);
const WEB_PUSH_POLL_MS = clamp(Number(pageParams.get("pushPoll") || 1000), 1000, 60_000);
const WEB_PUSH_DELAY_MS = clamp(Number(pageParams.get("pushDelay") || 30_000), 1000, 30_000);
const LIVE_API_PATH = "/api/serenity-live";
const WEB_CRYPTO_SYMBOLS = new Set(["BTC", "ETH", "SOL", "DOGE", "XRP"]);
const PUSH_NOTIFY_KEY = "serenityWebPushNotify";
const PUSH_SOUND_KEY = "serenityWebPushSound";
const PUSH_WATCHLIST_KEY = "serenityWebPushWatchlist";
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
const monitorStatus = document.querySelector("#monitorStatus");
const webPushBanner = document.querySelector("#webPushBanner");
const webPushControls = document.querySelector("#webPushControls");
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

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("zh-CN", { notation: "compact", maximumFractionDigits: 1 });

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

function watchlistSummary() {
  return state.watchlist.length ? state.watchlist.join(" / ") : "全部推文";
}

function initPushPreferences() {
  state.notificationEnabled = Boolean(storageGet(PUSH_NOTIFY_KEY, false)) && notificationPermission() === "granted";
  state.soundEnabled = Boolean(storageGet(PUSH_SOUND_KEY, false));
  state.watchlist = storageGet(PUSH_WATCHLIST_KEY, []);
  if (!Array.isArray(state.watchlist)) state.watchlist = [];
  state.watchlist = [...new Set(state.watchlist.map(normalizeWatchToken).filter(Boolean))].slice(0, 24);
}

function metricForStock(stock) {
  const symbols = state.distillation?.symbols || [];
  const aliases = new Set([stock.symbol, ...(stock.aliases || [])].map(normalizeSymbol));
  return symbols.find((item) => aliases.has(normalizeSymbol(item.symbol))) || null;
}

function quoteForStock(stock) {
  return state.quotes.get(stock.symbol) || {};
}

function stockMarketCap(stock) {
  const quote = quoteForStock(stock);
  return Number(quote.marketCap) || stock.fallbackMarketCap || 0;
}

function getCalledEvidence(stock, limit = 4) {
  const aliases = new Set([stock.symbol, ...(stock.aliases || [])].map(normalizeSymbol));
  return (state.tweets?.items || [])
    .filter((item) => (item.symbols || []).some((symbol) => aliases.has(normalizeSymbol(symbol))))
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
  if (stock.riskFlag || stock.theme === "capital-structure-veto") return "先过资本结构否决，不急着做多";
  if (score >= 82) return "重点研究，等待价格和证据共振";
  if (score >= 68) return "有 thesis，可以放进观察池";
  if (score >= 52) return "作为链路锚点观察，赔率一般";
  return "不够 Serenity 式，不是优先标的";
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
  if (pct > 82) return "价格处在 52 周高位附近，Serenity 框架会更强调反证和估值拥挤。";
  if (pct < 35) return "价格离 52 周高位较远，若 thesis 没坏，可能更适合继续做证据核查。";
  return "价格处在 52 周区间中段，更适合等催化或客户证据更新。";
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
  const evidence = getCalledEvidence(stock, 5);
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
  let stance = "先放低优先级";
  if (stock.riskFlag || stock.theme === "capital-structure-veto") {
    actionLabel = "先查资本结构";
    actionClass = "avoid";
    stance = "方向可以看，但融资和稀释优先一票否决";
  } else if (fit >= 82) {
    actionLabel = "重点深挖";
    actionClass = "pursue";
    stance = "像 Serenity 会优先研究的高赔率标的";
  } else if (fit >= 68) {
    actionLabel = "观察等证据";
    actionClass = "watch";
    stance = "thesis 有吸引力，但还缺价格或证据共振";
  } else if (fit >= 52) {
    actionLabel = "补证据再看";
    actionClass = "verify";
    stance = isCore ? "有样本但赔率一般，先补关键证据" : "通用初筛可看，但不像 Serenity 典型高赔率票";
  }

  const capReason =
    marketCap < 5e9
      ? "市值仍小，若证据成立，重估弹性更像 Serenity 偏好的赔率结构。"
      : marketCap < 80e9
        ? "市值中等，赔率取决于客户证据是否继续增强。"
        : "市值已经较大，更像需求锚点或大盘 beta，未必是最高赔率节点。";
  const priceReason =
    rangePct === null
      ? "暂缺完整 52 周区间，价格位置需要继续核查。"
      : rangePct > 86
        ? "价格接近 52 周高位，先看估值拥挤和反证。"
        : rangePct < 38
          ? "价格离高位较远，若 thesis 未坏，更适合做证据复核。"
          : "价格在 52 周区间中段，适合等待催化或客户证据更新。";
  const coverageReason = isCore
    ? `核心覆盖标的，已有 ${evidence.length} 条 Serenity 公开样本可交叉验证。`
    : "非核心喊单标的，只能按 Serenity 框架做通用初筛。";

  const reasons = [coverageReason, compactReason(stock.thesis), capReason, priceReason].filter(Boolean).slice(0, 4);
  const blockers = [
    compactReason(stock.risk),
    !isCore ? "缺少 Serenity 原始喊单样本，不能证明她本人已经建立高确信度。" : "",
    evidence.length < 2 ? "公开样本偏少，需要补 X 原文、财报电话会或客户证据。" : "",
    rangePct !== null && rangePct > 86 ? "价格已高，若没有新增订单或业绩上修，赔率会被压缩。" : "",
  ].filter(Boolean).slice(0, 4);
  const nextActions = (stock.isUniversal
    ? ["打开最近一季财报和电话会，确认收入增速与利润率是否同步改善", "对比同行估值和增速，判断它是龙头溢价还是拥挤交易", "检查最新新闻是否改变客户、监管、订单或资本结构"]
    : playbook.catalysts).slice(0, 4);
  const oneLine = `${stance}。${isCore ? "先看 Serenity 样本是否和当前价格共振。" : "先判断它是否真的符合“终端需求 + 瓶颈位置 + 赔率”的三件事。"}`;

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

function scenarioSet(score, stock, quote, space) {
  const price = formatPrice(quote);
  const baseUpside = Math.max(5, Math.round(space.upside * 0.36));
  return [
    {
      label: "Bull Case",
      tag: "证据加速",
      range: `+${space.upside}%`,
      body: `客户验证进入量产、行业 capex 继续上修，市场开始按“瓶颈资产”而不是普通周期股定价。当前 ${price} 仅作为起点，核心变量是订单密度。`,
    },
    {
      label: "Base Case",
      tag: "等待确认",
      range: `+${baseUpside}%`,
      body: `${stock.themeLabel} thesis 维持，但还需要财报、客户或产能数据继续确认。适合放入观察池，等价格和证据同时改善。`,
    },
    {
      label: "Bear Case",
      tag: "反证触发",
      range: `-${space.downside}%`,
      body: `客户导入推迟、订单强度低于预期，或融资/债务压力上升。若 Serenity 的资本结构否决被触发，故事优先降级。`,
    },
  ];
}

function plainReportText(stock, quote, score, space, playbook, breakdown, scenarios, evidence, metric, extras = {}) {
  const profile = profileForQuote(quote);
  const decision = extras.decision || decisionFor(stock, quote);
  const lines = [
    `${stock.symbol} · ${stock.name}`,
    `研究动作：${decision.actionLabel} · Serenity 匹配度：${decision.fit}/100`,
    `一句话结论：${decision.oneLine}`,
    `Serenity 分：${score} · ${conclusionFor(score, stock)}`,
    `价格：${formatPrice(quote)} · 当日涨跌：${formatPercent(quote.changePercent)} · 市值：${formatMarketCap(Number(quote.marketCap) || stock.fallbackMarketCap)}`,
    profile.sector || profile.industry ? `行业：${[profile.sector, profile.industry].filter(Boolean).join(" / ")}` : "",
    stock.isUniversal
      ? "覆盖状态：通用美股初筛，不代表 Serenity 已公开喊单。"
      : `提及结构：${compact.format(metric.mentions || 0)} 次提及，多 ${metric.bull || 0} / 空 ${metric.bear || 0} / 中性 ${metric.neutral || 0}`,
    "",
    "为什么：",
    ...decision.reasons.map((item, index) => `${index + 1}. ${item}`),
    "",
    "下一步动作：",
    ...decision.nextActions.map((item, index) => `${index + 1}. ${item}`),
    "",
    "执行摘要：",
    `1. ${stock.thesis}`,
    `2. ${playbook.focus}`,
    `3. 模型给出的验证上行空间约 ${space.upside}%，反证或资本结构恶化时下行风险约 ${space.downside}%。`,
    "",
    "评分拆解：",
    ...breakdown.map((item) => `${item.label} ${item.score}/100：${item.note}`),
  ];
  if (extras.marketRows?.length || extras.financialRows?.length) {
    lines.push("", "通用数据层：");
    for (const row of extras.marketRows || []) lines.push(`- ${row.label}：${row.value}`);
    for (const row of extras.financialRows || []) lines.push(`- ${row.label}：${row.value}`);
  }
  if (extras.peers?.length) lines.push("", `同行候选：${extras.peers.join(" / ")}`);
  lines.push(
    "",
    "情景推演：",
    ...scenarios.map((item) => `${item.label} ${item.range}：${item.body}`),
    "",
    "后续跟踪：",
    ...playbook.catalysts.map((item, index) => `${index + 1}. ${item}`),
    "",
    "反证清单：",
    `1. ${stock.risk}`,
    ...playbook.checks.map((item, index) => `${index + 2}. ${item}`)
  );
  if (evidence.length) {
    lines.push("", "公开样本：", ...evidence.map((item) => `- ${dateLabel(item.date)} ${item.title || item.body || item.url || "Serenity 公开样本"}`));
  }
  if (extras.news?.length) {
    lines.push("", "最新公开新闻：", ...extras.news.map((item) => `- ${formatNewsDate(item.date)} ${item.publisher || ""} ${item.title}`));
  }
  lines.push("", "仅作公开资料整理，不构成投资建议。");
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
  tickerSuggestions.innerHTML = calledStocks.map((stock) => `<option value="${escapeHtml(stock.symbol)}">${escapeHtml(stock.name)}</option>`).join("");
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
  return [...new Set((item.symbols || []).map(normalizeSymbol).filter(isWebTradableSymbol))].slice(0, 12);
}

function liveSymbolTokens(item = {}) {
  const symbols = new Set();
  for (const symbol of (item.symbols || []).map(normalizeSymbol).filter(Boolean)) {
    symbols.add(symbol);
    const stock = findStock(symbol);
    if (stock) {
      symbols.add(normalizeSymbol(stock.symbol));
      for (const alias of stock.aliases || []) symbols.add(normalizeSymbol(alias));
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
  const notification = new Notification(title, {
    body: `${match.reason || liveThemeLabel(item.theme)} · ${shortTitle(item.title || item.body, 170)}`,
    tag: `serenity-${liveItemKey(item)}`,
    renotify: true,
    icon: "/assets/serenity-ai-strategist.png",
  });
  notification.onclick = () => {
    window.focus();
    document.querySelector("#monitor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    notification.close();
  };
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
      <span><b>${state.lastLiveNewAt ? agoLabel(state.lastLiveNewAt) : "等待"}</b>最新推送</span>
      <span><b>${state.lastMatchedAlertAt ? agoLabel(state.lastMatchedAlertAt) : "等待"}</b>命中提醒</span>
    </div>
  `;
}

function renderWebPushControls() {
  const notifyClass = state.notificationEnabled && notificationPermission() === "granted" ? "active" : "";
  const soundClass = state.soundEnabled ? "active" : "";
  webPushControls.innerHTML = `
    <div class="push-control-actions">
      <button class="secondary ${notifyClass}" type="button" data-push-notify>${escapeHtml(notificationLabel())}</button>
      <button class="secondary ${soundClass}" type="button" data-push-sound>声音${state.soundEnabled ? "已开" : "关闭"}</button>
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

function renderLiveResearchPack(pack) {
  if (!pack) return "";
  if (pack.error) {
    return `<section class="live-research-pack error"><strong>研究包生成失败</strong><p>${escapeHtml(pack.error)}</p></section>`;
  }
  const rows = (pack.rows || []).slice(0, 6);
  return `
    <section class="live-research-pack">
      <div class="live-pack-head">
        <strong>30 秒研究包</strong>
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
                    <button type="button" data-symbol="${escapeHtml(row.symbol)}" class="live-rank-row">
                      <span>${index + 1}</span>
                      <strong>${escapeHtml(row.symbol)}</strong>
                      <small>${escapeHtml(row.action)} · ${row.score}/100</small>
                      <b>${formatPrice(row.quote)}</b>
                      <i class="${Number(row.quote.changePercent) >= 0 ? "up" : "down"}">${formatPercent(row.quote.changePercent)}</i>
                      <em>${formatMarketCap(row.marketCap)}</em>
                    </button>
                    <p>${escapeHtml(row.reason)}</p>
                  `
                )
                .join("")}
            </div>`
          : `<p class="live-empty-pack">这条推文没有识别到可直接交易的美股 ticker。</p>`
      }
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
  monitorStatus.textContent = latestLive
    ? `${base} · 网页推送 ${Math.round(WEB_PUSH_POLL_MS / 1000)} 秒轮询 · 接口最新 ${dateTimeLabel(latestLive.date)}${newCount ? ` · ${newCount} 条新推文待入库` : ""}`
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
      const symbols = (item.symbols || []).slice(0, 6);
      return `
        <article class="live-tweet-card ${isNew || isPushed ? "new" : ""}">
          <div class="live-head">
            <strong>${state.watchlist.length && watchMatch.matched ? "命中监听" : isPushed ? "网页推送" : isNew ? "新推文" : "已入库"}</strong>
            <span>${dateTimeLabel(item.date)} · ${escapeHtml(item.sentiment || "neutral")} · ${escapeHtml(liveThemeLabel(item.theme || "general"))}</span>
          </div>
          <p>${escapeHtml(shortTitle(item.title || item.body || "Serenity live tweet", 190))}</p>
          <div class="live-symbols">
            ${
              symbols.length
                ? symbols.map((symbol) => `<button class="secondary" type="button" data-symbol="${escapeHtml(symbol)}">${escapeHtml(symbol)}</button>`).join("")
                : `<small>暂无可识别 ticker</small>`
            }
          </div>
          ${pending ? `<div class="live-pack-pending"><span></span><b>${Math.round(WEB_PUSH_DELAY_MS / 1000)} 秒研究包生成中</b><small>正在等待行情、市值和 Serenity 框架回填</small></div>` : ""}
          ${renderLiveResearchPack(pack)}
          ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">打开 X 原文</a>` : ""}
        </article>
      `;
    })
    .join("");
}

async function loadLiveMonitor() {
  if (state.liveLoading) return;
  state.liveLoading = true;
  try {
    const data = await fetchJson(`${LIVE_API_PATH}?fresh=1&t=${Date.now()}`);
    state.lastLiveFetchAt = data.capturedAt || Date.now();
    state.lastLiveError = data.error || "";
    state.liveItems = data.items || [];
    syncLivePushItems(state.liveItems);
    renderLiveMonitor();
  } catch (error) {
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
  return calledStocks.find((stock) => [stock.symbol, ...(stock.aliases || [])].map(normalizeSymbol).includes(normalized));
}

function fallbackStock(symbol) {
  const metric = (state.distillation?.symbols || []).find((item) => normalizeSymbol(item.symbol) === normalizeSymbol(symbol)) || {};
  return {
    symbol: normalizeSymbol(symbol),
    aliases: [normalizeSymbol(symbol)],
    name: normalizeSymbol(symbol),
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
  return {
    ...stock,
    name: companyName || stock.symbol,
    themeLabel: industry,
    thesis: `${companyName || stock.symbol} 属于 ${sectorText}。这不是 Serenity 核心喊单标的，报告会把它当作通用美股，用价格、市值、财务质量、新闻催化和 Serenity 供应链框架做初筛。`,
    risk: `通用标的优先核查 ${industry} 的增长持续性、估值拥挤、竞争格局、财务质量和近期新闻是否改变基本面。`,
  };
}

async function ensureQuote(symbol, options = {}) {
  const normalized = normalizeSymbol(symbol);
  const cached = state.quotes.get(normalized);
  if (cached && (!options.detail || cached.profile || cached.news || cached.financials)) return cached;
  const detail = options.detail ? "&detail=1" : "";
  const data = await fetchJson(`/api/quotes?symbols=${encodeURIComponent(normalized)}${detail}`);
  const quote = data.quotes?.[0] || { requestedSymbol: normalized };
  state.quotes.set(normalized, quote);
  if (quote.symbol) state.quotes.set(normalizeSymbol(quote.symbol), quote);
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
  const news = (quote.news || []).slice(0, 5);
  const coverageLine = stock.isUniversal ? "通用美股初筛 · 非 Serenity 核心喊单" : sentimentLine;
  const coverageSentence = stock.isUniversal ? "这支股票不在当前 Serenity 核心覆盖名单里，因此结论更偏通用研究框架，需要用户自行补 SEC、财报电话会和公司公告。" : "这支股票有 Serenity 公开样本可供交叉验证，但仍需要继续核查财报和公告。";
  const decision = decisionFor(enriched, quote);
  const playbook = playbookFor(stock);
  const breakdown = scoreBreakdown(enriched, quote, metric);
  const scenarios = scenarioSet(score, stock, quote, space);
  const topDrivers = breakdown
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.label)
    .join("、");
  state.latestReportText = plainReportText(stock, quote, score, space, playbook, breakdown, scenarios, evidence, metric, {
    marketRows: marketData,
    financialRows: financialData,
    peers,
    news,
    decision,
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
      <span>${stock.isUniversal ? "基于公开行情、财务、新闻与 Serenity 框架生成通用初筛" : "基于公开资料、行情数据与 Serenity 蒸馏框架生成"}</span>
      <button class="secondary copy-report" type="button" data-copy-report>复制研报摘要</button>
    </div>
    <section class="decision-card ${escapeHtml(decision.actionClass)}">
      <div class="decision-score">
        <span>Serenity 匹配度</span>
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
        <strong>下一步</strong>
        ${decision.nextActions.slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
    <div class="report-grid">
      <div class="report-metric"><span>当前价格</span><strong>${formatPrice(quote)}</strong></div>
      <div class="report-metric"><span>当日涨跌</span><strong class="${Number(quote.changePercent) >= 0 ? "up" : "down"}">${formatPercent(quote.changePercent)}</strong></div>
      <div class="report-metric"><span>市值</span><strong>${formatMarketCap(enriched.marketCap)}</strong><span>${capSource}</span></div>
      <div class="report-metric"><span>行业</span><strong>${escapeHtml(profile.sector || stock.themeLabel || "--")}</strong><span>${escapeHtml(profile.industry || "")}</span></div>
      <div class="report-metric"><span>52 周区间</span><strong>${escapeHtml(marketData.find((row) => row.label === "52 周区间")?.value || "--")}</strong></div>
      <div class="report-metric"><span>覆盖状态</span><strong>${escapeHtml(coverageLine)}</strong></div>
    </div>
    <section class="report-summary">
      <h3>执行摘要</h3>
      <p><b>核心 thesis：</b>${escapeHtml(stock.thesis)}</p>
      <p><b>研究视角：</b>${escapeHtml(playbook.focus)}</p>
      <p><b>当前结论：</b>${escapeHtml(conclusionFor(score, stock))}。模型主要由 ${escapeHtml(topDrivers)} 支撑；上行需要客户证据继续增强，下行通常来自反证或资本结构恶化。</p>
    </section>
    <section class="report-section">
      <h3>通用数据层</h3>
      <div class="data-card-grid">
        <article class="data-card">
          <strong>估值与交易</strong>
          ${
            marketData.length
              ? marketData.map((row) => `<span><b>${escapeHtml(row.label)}</b><small>${escapeHtml(row.value)}</small></span>`).join("")
              : `<p>公开接口暂未返回足够的估值和成交数据。</p>`
          }
        </article>
        <article class="data-card">
          <strong>财务质量</strong>
          ${
            financialData.length
              ? financialData.map((row) => `<span><b>${escapeHtml(row.label)}</b><small>${escapeHtml(row.value)}</small></span>`).join("")
              : `<p>暂未取得可用年度财务摘要，建议补 10-K/10-Q 或公司财报。</p>`
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
      <h3>Serenity 会先怎么想</h3>
      <p>${escapeHtml(playbook.lens)}</p>
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
      <h3>当前价格与涨跌空间</h3>
      <p>按当前价格 ${formatPrice(quote)} 和市值 ${formatMarketCap(enriched.marketCap)} 粗略看，模型给出的上行验证空间约 ${space.upside}%；若 thesis 被证伪或资本结构恶化，下行风险约 ${space.downside}%。${position ? ` ${position}` : ""} ${targetText}。</p>
      <p>${escapeHtml(coverageSentence)} 这不是机械目标价，而是 Serenity 式赔率判断：小市值瓶颈 + 客户证据 + TAM 扩张同时成立，空间才会打开；只靠题材、只靠大跌或只靠情绪，不构成买点。</p>
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
      <h3>后续跟踪清单</h3>
      <div class="check-grid">
        ${playbook.catalysts.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
    <section class="report-section">
      <h3>反证与尽调问题</h3>
      <ul>
        <li>${escapeHtml(stock.risk)}</li>
        ${playbook.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        <li>如果客户导入、量产时间、订单强度或管理层措辞变弱，先降低赔率假设。</li>
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
      <h3>公开样本</h3>
      <div class="evidence-list">
        ${
          evidence.length
            ? evidence
                .map(
                  (item) => `
                    <a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">
                      <strong>${escapeHtml((item.title || "Serenity 公开样本").slice(0, 140))}</strong>
                      <span>${escapeHtml((item.body || item.title || "公开样本待补正文").slice(0, 220))}</span>
                      <small>${dateLabel(item.date)} · ${escapeHtml(item.theme || "general")} · materiality ${item.materiality || "--"}</small>
                    </a>
                  `
                )
                .join("")
            : `<p>本地蒸馏库里暂无这支股票的高质量样本，建议先补 X 原文、财报和供应链证据。</p>`
        }
      </div>
    </section>
    <p class="report-note">提示：本报告用于把公开观点整理成研究框架，不能替代财报、公告、订单验证和个人风险评估。</p>
  `;
}

async function analyzeSymbol(symbol, options = {}) {
  const normalized = normalizeSymbol(symbol);
  if (!normalized) return;
  tickerInput.value = normalized;
  heroTickerInput.value = normalized;
  state.activeSymbol = normalized;
  renderStockList();
  reportOutput.innerHTML = `<div class="empty-report">正在读取 ${escapeHtml(normalized)} 的价格、市值、财务摘要、新闻和 Serenity 样本...</div>`;
  let stock = findStock(normalized) || fallbackStock(normalized);
  const quoteSymbol = stock.symbol || normalized;
  const quote = await ensureQuote(quoteSymbol, { detail: true });
  stock = hydrateUniversalStock(stock, quote);
  state.quotes.set(stock.symbol, quote);
  state.activeSymbol = stock.symbol;
  buildReport(stock, quote);
  renderStockList();
  if (options.scroll !== false) document.querySelector("#analysis")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadQuotes() {
  const symbols = calledStocks.map((stock) => stock.symbol).join(",");
  const data = await fetchJson(`/api/quotes?symbols=${encodeURIComponent(symbols)}`);
  for (const quote of data.quotes || []) {
    const requested = normalizeSymbol(quote.requestedSymbol || quote.symbol);
    state.quotes.set(requested, quote);
  }
}

async function init() {
  initPushPreferences();
  reportOutput.innerHTML = `<div class="empty-report">输入 ticker 或点击左侧名单，生成一份 Serenity 风格投研报告。</div>`;
  renderTickerSuggestions();
  renderQuickTickers();
  const publicData = await fetchJson("./data/serenity-public.json");
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
  state.history = publicData.history || [];
  state.monitor = publicData.monitor || null;
  renderHeroStats();
  renderMethodList();
  renderTrackRecordList();
  renderLiveMonitor();
  loadLiveMonitor();
  setInterval(loadLiveMonitor, WEB_PUSH_POLL_MS);
  await loadQuotes();
  renderStockList();
  renderOpportunityList();
  await analyzeSymbol("AAOI", { scroll: false });
  loadPerformance();
}

stockSearch.addEventListener("input", renderStockList);
themeFilter.addEventListener("change", renderStockList);
sortMode.addEventListener("change", renderStockList);

stockList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-symbol]");
  if (row) analyzeSymbol(row.dataset.symbol);
});

opportunityList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-symbol]");
  if (row) analyzeSymbol(row.dataset.symbol);
});

liveTweetList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
});

webPushControls.addEventListener("click", async (event) => {
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

analysisForm.addEventListener("submit", (event) => {
  event.preventDefault();
  analyzeSymbol(tickerInput.value);
});

heroAnalysisForm.addEventListener("submit", (event) => {
  event.preventDefault();
  analyzeSymbol(heroTickerInput.value);
});

init().catch((error) => {
  listStatus.textContent = `加载失败：${error.message}`;
  reportOutput.innerHTML = `<div class="empty-report">加载失败：${escapeHtml(error.message)}</div>`;
});
