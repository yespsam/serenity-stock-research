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
};

const stockList = document.querySelector("#stockList");
const listStatus = document.querySelector("#listStatus");
const stockSearch = document.querySelector("#stockSearch");
const themeFilter = document.querySelector("#themeFilter");
const methodList = document.querySelector("#methodList");
const heroStats = document.querySelector("#heroStats");
const heroAnalysisForm = document.querySelector("#heroAnalysisForm");
const heroTickerInput = document.querySelector("#heroTickerInput");
const analysisForm = document.querySelector("#analysisForm");
const tickerInput = document.querySelector("#tickerInput");
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
    <span><b>${compact.format(parsed)}</b>公开索引</span>
    <span><b>${compact.format(comments)}</b>评论样本</span>
    <span><b>${compact.format(profileTweets)}</b>X 公开口径</span>
    <span><b>${usCount}</b>美股名单</span>
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
  quickTickers.innerHTML = symbols.map((symbol) => `<button type="button" data-symbol="${symbol}">${symbol}</button>`).join("");
}

function renderStockList() {
  const query = normalizeSymbol(stockSearch.value);
  const theme = themeFilter.value;
  const stocks = calledStocks
    .map(enrichStock)
    .filter((stock) => {
      const haystack = `${stock.symbol} ${stock.aliases.join(" ")} ${stock.name} ${stock.themeLabel} ${stock.thesis}`.toUpperCase();
      const queryOk = !query || haystack.includes(query);
      const themeOk = theme === "all" || stock.theme === theme;
      return queryOk && themeOk;
    })
    .sort((a, b) => b.marketCap - a.marketCap);

  state.renderedStocks = stocks;
  const liveCaps = stocks.filter((stock) => Number(stock.quote.marketCap)).length;
  listStatus.textContent = `${stocks.length} 支美股/OTC 标的 · ${liveCaps} 支市值来自实时公开接口，其余使用参考市值兜底 · 点击任意一行生成报告`;
  stockList.innerHTML = stocks
    .map((stock) => {
      const quote = stock.quote || {};
      const changeClass = Number(quote.changePercent) >= 0 ? "up" : "down";
      const metric = stock.metric || {};
      return `
        <button class="stock-row" type="button" data-symbol="${escapeHtml(stock.symbol)}">
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
            <small>模型分 / 提及</small>
            <b>${stock.score}</b>
            <small>${compact.format(metric.mentions || 0)} mentions</small>
          </span>
        </button>
      `;
    })
    .join("");
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
    themeLabel: themeNames[metric.dominantTheme] || "未归类",
    thesis: "这支股票不在核心喊单名单里，但可以用 Serenity 的框架先做初筛。",
    risk: "需要补客户证据、供应链位置和资本结构资料。",
    fallbackMarketCap: 0,
  };
}

async function ensureQuote(symbol) {
  const normalized = normalizeSymbol(symbol);
  if (state.quotes.has(normalized)) return state.quotes.get(normalized);
  const data = await fetchJson(`/api/quotes?symbols=${encodeURIComponent(normalized)}`);
  const quote = data.quotes?.[0] || { requestedSymbol: normalized };
  state.quotes.set(normalized, quote);
  return quote;
}

function buildReport(stock, quote) {
  const enriched = { ...stock, quote, marketCap: Number(quote.marketCap) || stock.fallbackMarketCap || 0 };
  const metric = metricForStock(stock) || {};
  const score = scoreStock(enriched, quote);
  const space = upsideSpace(score, enriched);
  const evidence = getCalledEvidence(stock, 4);
  const capSource = Number(quote.marketCap) ? "公开接口" : enriched.marketCap ? "参考市值" : "待补源";
  const target = Number(quote.oneYearTarget);
  const targetText = Number.isFinite(target) && Number.isFinite(Number(quote.price)) ? `${formatPercent(((target - Number(quote.price)) / Number(quote.price)) * 100)} 卖方目标差` : "不依赖卖方目标";
  const position = pricePosition(quote);
  const sentimentLine = `${compact.format(metric.mentions || 0)} 次提及 · 多 ${metric.bull || 0} / 空 ${metric.bear || 0} / 中性 ${metric.neutral || 0}`;

  reportOutput.innerHTML = `
    <header class="report-head">
      <div class="report-title">
        <strong>${escapeHtml(stock.symbol)} · ${escapeHtml(stock.name)}</strong>
        <small>${escapeHtml(stock.themeLabel)} · ${escapeHtml(conclusionFor(score, stock))}</small>
      </div>
      <div class="report-score"><b>${score}</b><small>Serenity 分</small></div>
    </header>
    <div class="report-grid">
      <div class="report-metric"><span>当前价格</span><strong>${formatPrice(quote)}</strong></div>
      <div class="report-metric"><span>当日涨跌</span><strong class="${Number(quote.changePercent) >= 0 ? "up" : "down"}">${formatPercent(quote.changePercent)}</strong></div>
      <div class="report-metric"><span>市值</span><strong>${formatMarketCap(enriched.marketCap)}</strong><span>${capSource}</span></div>
      <div class="report-metric"><span>提及结构</span><strong>${escapeHtml(sentimentLine)}</strong></div>
    </div>
    <section class="report-section">
      <h3>Serenity 会先怎么想</h3>
      <p>${escapeHtml(stock.thesis)}</p>
      <ul>
        <li>先画终端需求：AI 集群、ASIC、CPO、NeoCloud 或其他终端为什么必须发生。</li>
        <li>再拆供应链：这家公司是否处在材料、激光、封装、测试、制造、电力里不可绕开的节点。</li>
        <li>最后看赔率：市值是否还小、机构是否还没完全进场、有没有稀释或债务一票否决。</li>
      </ul>
    </section>
    <section class="report-section">
      <h3>当前价格与涨跌空间</h3>
      <p>按当前价格 ${formatPrice(quote)} 和市值 ${formatMarketCap(enriched.marketCap)} 粗略看，模型给出的上行验证空间约 ${space.upside}%；若 thesis 被证伪或资本结构恶化，下行风险约 ${space.downside}%。${position ? ` ${position}` : ""} ${targetText}。</p>
      <p>这不是机械目标价，而是 Serenity 式赔率判断：小市值瓶颈 + 客户证据 + TAM 扩张同时成立，空间才会打开；只靠题材或大跌，不算买点。</p>
    </section>
    <section class="report-section">
      <h3>反证清单</h3>
      <ul>
        <li>${escapeHtml(stock.risk)}</li>
        <li>如果客户导入、量产时间、订单强度或管理层措辞变弱，先降低赔率假设。</li>
        <li>如果出现 ATM、可转债、大额融资或债务压力，资本结构优先于故事本身。</li>
      </ul>
    </section>
    <section class="report-section">
      <h3>公开样本</h3>
      <div class="evidence-list">
        ${
          evidence.length
            ? evidence
                .map(
                  (item) => `
                    <a href="${escapeHtml(item.url || "#")}" target="_blank" rel="noreferrer">
                      ${escapeHtml((item.title || item.body || "Serenity 公开样本").slice(0, 220))}
                      <small>${dateLabel(item.date)} · ${escapeHtml(item.theme || "general")} · materiality ${item.materiality || "--"}</small>
                    </a>
                  `
                )
                .join("")
            : `<p>本地蒸馏库里暂无这支股票的高质量样本，建议先补 X 原文、财报和供应链证据。</p>`
        }
      </div>
    </section>
  `;
}

async function analyzeSymbol(symbol, options = {}) {
  const normalized = normalizeSymbol(symbol);
  if (!normalized) return;
  tickerInput.value = normalized;
  heroTickerInput.value = normalized;
  reportOutput.innerHTML = `<div class="empty-report">正在读取 ${escapeHtml(normalized)} 的价格、市值和 Serenity 样本...</div>`;
  const stock = findStock(normalized) || fallbackStock(normalized);
  const quoteSymbol = stock.symbol || normalized;
  const quote = await ensureQuote(quoteSymbol);
  state.quotes.set(stock.symbol, quote);
  buildReport(stock, quote);
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
  reportOutput.innerHTML = `<div class="empty-report">输入 ticker 或点击左侧名单，生成一份 Serenity 风格投研报告。</div>`;
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
  renderHeroStats();
  renderMethodList();
  await loadQuotes();
  renderStockList();
  await analyzeSymbol("AAOI", { scroll: false });
}

stockSearch.addEventListener("input", renderStockList);
themeFilter.addEventListener("change", renderStockList);

stockList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-symbol]");
  if (row) analyzeSymbol(row.dataset.symbol);
});

quickTickers.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (button) analyzeSymbol(button.dataset.symbol);
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
