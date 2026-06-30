const FED_FEEDS = [
  {
    url: "https://www.federalreserve.gov/feeds/press_monetary.xml",
    source: "Federal Reserve",
    category: "Monetary Policy",
  },
  {
    url: "https://www.federalreserve.gov/feeds/speeches_and_testimony.xml",
    source: "Federal Reserve",
    category: "Speeches & Testimony",
  },
  {
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    source: "Federal Reserve",
    category: "Press Releases",
  },
];

const YAHOO_NEWS_QUERIES = [
  "Federal Reserve FOMC Powell rate cuts inflation yields",
  "Treasury yields inflation CPI PCE jobs market stocks",
  "Nasdaq growth stocks rates dollar risk off",
];

const MARKET_SYMBOLS = [
  { symbol: "^TNX", label: "10Y Treasury Yield", kind: "yield" },
  { symbol: "^VIX", label: "VIX", kind: "volatility" },
  { symbol: "SPY", label: "S&P 500 ETF", kind: "equity" },
  { symbol: "QQQ", label: "Nasdaq 100 ETF", kind: "growth" },
  { symbol: "IWM", label: "Russell 2000 ETF", kind: "small-cap" },
  { symbol: "TLT", label: "20+Y Treasury ETF", kind: "duration" },
  { symbol: "UUP", label: "US Dollar ETF", kind: "dollar" },
];

function json(data, status = 200, cacheControl = "public, max-age=180, s-maxage=300, stale-while-revalidate=900") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheControl,
    },
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/rss+xml,application/xml,text/xml,text/plain,*/*",
      "user-agent": "Mozilla/5.0 SerenityResearch/1.0",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json,text/plain,*/*",
      "user-agent": "Mozilla/5.0 SerenityResearch/1.0",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function decodeXml(value = "") {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(itemXml = "", name = "") {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = itemXml.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function parseRssItems(xml = "", feed = {}) {
  return [...String(xml).matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => {
    const itemXml = match[0];
    const title = tag(itemXml, "title");
    const url = tag(itemXml, "link") || tag(itemXml, "guid");
    const summary = tag(itemXml, "description");
    const dateText = tag(itemXml, "pubDate") || tag(itemXml, "dc:date") || tag(itemXml, "updated");
    const date = Date.parse(dateText);
    return {
      title,
      summary,
      url,
      date: Number.isFinite(date) ? date : null,
      publisher: feed.source,
      source: feed.source,
      category: feed.category,
    };
  });
}

function daysSince(value) {
  if (!value) return 30;
  return Math.max(0, (Date.now() - Number(value)) / 86_400_000);
}

function impactForNews(item = {}) {
  const text = `${item.title || ""} ${item.summary || ""}`.toLowerCase();
  let score = 0;
  const reasons = [];
  const hit = (pattern) => pattern.test(text);

  if (hit(/fomc|federal open market|powell|federal reserve|fed chair|monetary policy|target range|policy rate|interest rate|rate cut|rate hike/i)) {
    score += 12;
    reasons.push("Fed/利率相关");
  }
  if (hit(/inflation|cpi|pce|ppi|jobs report|payroll|wage|treasury yield|yields?|dollar|employment|unemployment/i)) {
    score += 9;
    reasons.push("通胀/就业/收益率相关");
  }
  if (hit(/higher for longer|hawkish|restrictive|tightening|rate hike|inflation elevated|not confident|no rush|above target/i)) {
    score += 24;
    reasons.push("偏鹰/利率压力");
  }
  if (hit(/rate cut|cuts|easing|dovish|lower rates|disinflation|liquidity|ample reserves|soft landing/i)) {
    score -= 12;
    reasons.push("偏鸽/流动性友好");
  }
  if (hit(/financial stability|bank stress|liquidity stress|credit tightening|recession|shutdown|tariff|geopolitical|war|sanction/i)) {
    score += 18;
    reasons.push("风险事件");
  }
  if (hit(/maintain the target range|unchanged|reaffirmed/i)) {
    score += 2;
    reasons.push("政策维持");
  }

  const age = daysSince(item.date);
  if (age <= 2) score *= 1.15;
  else if (age > 14) score *= 0.55;
  else if (age > 7) score *= 0.75;

  const impactScore = Math.round(Math.max(-18, Math.min(45, score)));
  return {
    ...item,
    impactScore,
    impact: impactScore >= 24 ? "risk-off" : impactScore <= -8 ? "risk-on" : "neutral",
    reason: reasons.slice(0, 3).join(" / ") || "宏观新闻",
  };
}

async function fedItems() {
  const batches = await Promise.allSettled(
    FED_FEEDS.map(async (feed) => {
      const xml = await fetchText(feed.url);
      return parseRssItems(xml, feed).slice(0, 8);
    })
  );
  return batches.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function yahooNewsItems() {
  const batches = await Promise.allSettled(
    YAHOO_NEWS_QUERIES.map(async (query) => {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=0&newsCount=8`;
      const raw = await fetchJson(url);
      return (raw.news || []).slice(0, 8).map((item) => ({
        title: item.title || "",
        summary: item.summary || "",
        url: item.link || "",
        date: item.providerPublishTime ? item.providerPublishTime * 1000 : null,
        publisher: item.publisher || "Yahoo Finance",
        source: "Yahoo Finance",
        category: "Macro News",
        relatedTickers: item.relatedTickers || [],
      }));
    })
  );
  return batches.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function marketSignal({ symbol, label, kind }) {
  const safe = encodeURIComponent(symbol);
  const raw = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${safe}?range=5d&interval=1d&includePrePost=false`);
  const result = raw?.chart?.result?.[0] || {};
  const meta = result.meta || {};
  const quote = result.indicators?.quote?.[0] || {};
  const closes = (quote.close || []).filter(Number.isFinite);
  const price = Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : closes.at(-1);
  const previous = Number.isFinite(meta.chartPreviousClose) ? meta.chartPreviousClose : closes.at(-2);
  const changePercent = Number.isFinite(price) && Number.isFinite(previous) && previous ? ((price - previous) / previous) * 100 : null;
  return {
    symbol,
    label,
    kind,
    price,
    changePercent,
    updatedAt: meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
  };
}

async function marketSignals() {
  const batches = await Promise.allSettled(MARKET_SYMBOLS.map(marketSignal));
  return batches.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}

function marketRiskImpact(signals = []) {
  let impact = 0;
  const reasons = [];
  const bySymbol = new Map(signals.map((item) => [item.symbol, item]));
  const vix = bySymbol.get("^VIX");
  const tnx = bySymbol.get("^TNX");
  const qqq = bySymbol.get("QQQ");
  const spy = bySymbol.get("SPY");
  const iwm = bySymbol.get("IWM");
  const tlt = bySymbol.get("TLT");
  const uup = bySymbol.get("UUP");

  if (Number(vix?.price) >= 24 || Number(vix?.changePercent) >= 8) {
    impact += 14;
    reasons.push("VIX 上行");
  }
  if (Number(tnx?.price) >= 4.5 || Number(tnx?.changePercent) >= 2.2) {
    impact += 14;
    reasons.push("10Y 收益率压力");
  }
  if (Number(qqq?.changePercent) <= -1.2 || Number(spy?.changePercent) <= -1.1) {
    impact += 12;
    reasons.push("指数风险偏好转弱");
  }
  if (Number(iwm?.changePercent) <= -1.5) {
    impact += 8;
    reasons.push("小盘流动性承压");
  }
  if (Number(tlt?.changePercent) <= -1) {
    impact += 8;
    reasons.push("长久期债券走弱");
  }
  if (Number(uup?.changePercent) >= 0.45) {
    impact += 6;
    reasons.push("美元走强");
  }
  if (Number(qqq?.changePercent) >= 1.1 && Number(vix?.changePercent) <= -4) {
    impact -= 7;
    reasons.push("成长股风险偏好改善");
  }

  return {
    impact: Math.round(Math.max(-10, Math.min(40, impact))),
    reasons,
  };
}

function buildRisk(items = [], signals = []) {
  const freshItems = items
    .slice()
    .sort((a, b) => Number(b.date || 0) - Number(a.date || 0))
    .slice(0, 14);
  const highImpact = freshItems
    .slice()
    .sort((a, b) => Math.abs(b.impactScore) - Math.abs(a.impactScore))
    .slice(0, 5);
  const newsImpact = Math.round(highImpact.reduce((sum, item) => sum + Number(item.impactScore || 0), 0) / Math.max(1, highImpact.length));
  const marketImpact = marketRiskImpact(signals);
  const score = Math.round(Math.max(5, Math.min(95, 45 + newsImpact + marketImpact.impact)));
  const riskOff = score >= 62;
  const riskOn = score <= 35;
  const level = score >= 78 ? "high" : score >= 62 ? "cautious" : score <= 35 ? "friendly" : "neutral";
  const label = score >= 78 ? "宏观高压" : score >= 62 ? "宏观偏谨慎" : score <= 35 ? "流动性友好" : "宏观中性";
  const keyNews = highImpact[0];
  const reasons = [
    keyNews ? `${keyNews.source}: ${keyNews.title}` : "",
    ...marketImpact.reasons,
  ].filter(Boolean);
  return {
    score,
    level,
    label,
    riskOff,
    riskOn,
    newsImpact,
    marketImpact: marketImpact.impact,
    reason: reasons.slice(0, 3).join("；") || "宏观新闻与市场代理指标未出现极端信号",
    sourceCount: items.length,
    signalCount: signals.length,
  };
}

function dedupeItems(items = []) {
  const seen = new Set();
  const rows = [];
  for (const item of items) {
    const key = String(item.url || item.title || "").toLowerCase();
    if (!key || seen.has(key) || !item.title) continue;
    seen.add(key);
    rows.push(impactForNews(item));
  }
  return rows
    .sort((a, b) => Number(b.date || 0) - Number(a.date || 0))
    .slice(0, 24);
}

export default async () => {
  const [fedResult, yahooResult, signalResult] = await Promise.allSettled([
    fedItems(),
    yahooNewsItems(),
    marketSignals(),
  ]);
  const errors = [fedResult, yahooResult, signalResult]
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason?.message || "fetch failed");
  const items = dedupeItems([
    ...(fedResult.status === "fulfilled" ? fedResult.value : []),
    ...(yahooResult.status === "fulfilled" ? yahooResult.value : []),
  ]);
  const signals = signalResult.status === "fulfilled" ? signalResult.value : [];
  const risk = buildRisk(items, signals);
  return json({
    provider: "Federal Reserve RSS / Yahoo Finance macro news / Yahoo market proxies",
    updatedAt: Date.now(),
    risk,
    items,
    signals,
    errors,
  });
};

export const config = {
  path: "/api/macro-news",
  method: ["GET"],
};
