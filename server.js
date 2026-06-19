const fs = require("node:fs");
const crypto = require("node:crypto");
const http = require("node:http");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 4180);
const ROOT = __dirname;
const CACHE_MS = 120_000;
const LIVE_CACHE_MS = 30_000;
const QUOTE_CACHE_MS = 120_000;
const DETAIL_QUOTE_CACHE_MS = 900_000;
const PERFORMANCE_CACHE_MS = 21_600_000;
const RESEARCH_REFRESH_TIMEOUT_MS = 240_000;
const BACKFILL_REFRESH_TIMEOUT_MS = 360_000;
const AUTO_BACKFILL_TIMEOUT_MS = 900_000;
const cache = new Map();
const execFileAsync = promisify(execFile);
const MARKET_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const YAHOO_UA = "Mozilla/5.0";
const FALLBACK_MARKET_SYMBOL_ALIASES = {
  ALRIB: "ALRIB.PA",
  IQE: "IQE.L",
  LPK: "LPK.DE",
  LPKFF: "LPK.DE",
  SOI: "SOI.PA",
  XFAB: "XFAB.PA",
  "XFAB.PA": "XFAB.PA",
  SIVE: "SIVEF",
  "SIVE.ST": "SIVEF",
  SIVERS: "SIVEF",
};
const MARKET_SYMBOL_ALIASES = { ...FALLBACK_MARKET_SYMBOL_ALIASES, ...loadMarketSymbolAliases() };
const symbolSearchCache = new Map();
const TICKER_STOPLIST = new Set(["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L14", "TICKER"]);
const CRYPTO_ONLY_SYMBOLS = new Set(["BTC", "ETH", "SOL", "DOGE", "XRP"]);
const STATUS_REF_RE = /https?:\/\/[^\s"'<>]*(?:status|statuses|conversation)\/(\d{15,22})[^\s"'<>]*|\b(\d{15,22})\b/gi;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function normalizeAliasToken(value = "") {
  return String(value || "").trim().replace(/^\$+/, "").toUpperCase();
}

function loadMarketSymbolAliases() {
  try {
    const file = path.join(ROOT, "data", "symbol-aliases.json");
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const aliases = {};
    for (const identity of data.identities || []) {
      const marketSymbol = normalizeAliasToken(identity.marketSymbol || identity.canonical);
      if (!marketSymbol) continue;
      for (const alias of [identity.canonical, identity.marketSymbol, ...(identity.aliases || [])]) {
        const normalized = normalizeAliasToken(alias);
        if (normalized) aliases[normalized] = marketSymbol;
      }
    }
    return aliases;
  } catch {
    return {};
  }
}

function send(res, status, body, type = "application/json; charset=utf-8", cacheControl = status === 200 ? "no-store" : "no-cache") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": cacheControl,
  });
  res.end(body);
}

async function fetchJson(url, options = {}) {
  const ua = options.ua || MARKET_UA;
  const accept = options.accept || "application/json,text/plain,*/*";
  const cacheMs = options.cacheMs ?? CACHE_MS;
  const hit = cache.get(url);
  if (cacheMs > 0 && hit && Date.now() - hit.time < cacheMs) return hit.data;

  const { stdout } = await execFileAsync(
    "curl",
    ["-L", "-sS", "--max-time", "12", "-f", "-A", ua, "-H", `Accept: ${accept}`, url],
    { maxBuffer: 8 * 1024 * 1024 }
  );
  const data = JSON.parse(stdout);
  if (cacheMs > 0) cache.set(url, { data, time: Date.now() });
  return data;
}

function normalizeMarketSymbol(symbol = "") {
  return String(symbol || "").trim().replace(/^\$+/, "").toUpperCase();
}

function resolveStaticMarketSymbol(symbol = "") {
  const normalized = normalizeMarketSymbol(symbol);
  return MARKET_SYMBOL_ALIASES[normalized] || normalized;
}

function yahooSearchScore(query, quote = {}) {
  const symbol = String(quote.symbol || "").toUpperCase();
  const quoteType = String(quote.quoteType || "").toUpperCase();
  const exchange = String(quote.exchange || "").toUpperCase();
  if (!symbol || quoteType !== "EQUITY") return -1000;
  let score = 0;
  if (symbol === query) score += 130;
  if (symbol.startsWith(`${query}.`)) score += 70;
  if (symbol.startsWith(query)) score += 18;
  if (["PAR", "LSE", "GER", "STO", "FRA", "MIL", "AMS", "BRU", "SWX", "OSL"].includes(exchange)) score += 12;
  if (["PNK", "OTC", "OTCBB"].includes(exchange)) score -= 10;
  if (/\\.(PA|L|DE|ST|F|MI|AS|BR|SW|OL)$/.test(symbol)) score += 8;
  return score;
}

async function discoverYahooSymbol(symbol = "") {
  const normalized = String(symbol || "").trim().replace(/^\$+/, "").toUpperCase();
  if (!normalized || normalized.includes(".") || MARKET_SYMBOL_ALIASES[normalized]) return "";
  if (symbolSearchCache.has(normalized)) return symbolSearchCache.get(normalized);

  const params = new URLSearchParams({
    q: normalized,
    quotesCount: "8",
    newsCount: "0",
    enableFuzzyQuery: "false",
    quotesQueryId: "tss_match_phrase_query",
  });
  try {
    const raw = await fetchJson(`https://query1.finance.yahoo.com/v1/finance/search?${params.toString()}`, { ua: YAHOO_UA });
    const best = (raw.quotes || [])
      .map((quote) => ({ quote, score: yahooSearchScore(normalized, quote) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)[0]?.quote?.symbol;
    const resolved = best ? String(best).toUpperCase() : "";
    symbolSearchCache.set(normalized, resolved);
    return resolved;
  } catch {
    symbolSearchCache.set(normalized, "");
    return "";
  }
}

async function tryYahooStack(symbol, range, interval, requestedSymbol, providerPrefix = "", options = {}) {
  let lastError;
  try {
    const data = await getYahooCandlesWithFallback(symbol, range, interval, options);
    return {
      ...data,
      requestedSymbol,
      provider: providerPrefix ? `${data.provider} · ${providerPrefix}` : data.provider,
    };
  } catch (error) {
    lastError = error;
  }

  try {
    const data = await getSparkSeries(symbol, range, interval, options);
    return {
      ...data,
      requestedSymbol,
      provider: providerPrefix ? `${data.provider} · ${providerPrefix}` : data.provider,
    };
  } catch (error) {
    throw lastError || error;
  }
}

async function fetchText(url) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.time < CACHE_MS) return hit.data;

  const { stdout: text } = await execFileAsync(
    "curl",
    ["-L", "-sS", "--max-time", "12", "-f", "-A", MARKET_UA, "-H", "Accept: text/csv,text/plain,*/*", url],
    { maxBuffer: 2 * 1024 * 1024 }
  );
  cache.set(url, { data: text, time: Date.now() });
  return text;
}

function normalizeCandles(raw, symbol, sourceUrl) {
  const result = raw?.chart?.result?.[0];
  if (!result) {
    const error = raw?.chart?.error?.description || "No chart result";
    throw new Error(error);
  }

  const quote = result.indicators?.quote?.[0] || {};
  const timestamps = result.timestamp || [];
  const candles = timestamps
    .map((time, index) => ({
      time: time * 1000,
      open: quote.open?.[index],
      high: quote.high?.[index],
      low: quote.low?.[index],
      close: quote.close?.[index],
      volume: quote.volume?.[index] || 0,
    }))
    .filter((bar) => [bar.open, bar.high, bar.low, bar.close].every((value) => Number.isFinite(value)));

  const meta = result.meta || {};
  const last = candles.at(-1);
  const previousClose = Number.isFinite(meta.chartPreviousClose) ? meta.chartPreviousClose : candles.at(-2)?.close;
  const price = Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : last?.close;
  const change = Number.isFinite(price) && Number.isFinite(previousClose) ? price - previousClose : null;
  const changePercent = Number.isFinite(change) && previousClose ? (change / previousClose) * 100 : null;

  return {
    symbol: meta.symbol || symbol,
    currency: meta.currency || "USD",
    exchange: meta.fullExchangeName || meta.exchangeName || "",
    provider: "Yahoo Finance OHLC",
    sourceUrl,
    range: meta.range || "",
    interval: meta.dataGranularity || "",
    updatedAt: meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
    price,
    previousClose,
    change,
    changePercent,
    ohlc: true,
    synthetic: false,
    candles,
  };
}

async function getYahooCandles(symbol, range = "1d", interval = "5m", options = {}) {
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const safeRange = encodeURIComponent(range);
  const safeInterval = encodeURIComponent(interval);
  const urls = [
    `https://query2.finance.yahoo.com/v8/finance/chart/${safeSymbol}?range=${safeRange}&interval=${safeInterval}&includePrePost=false&events=history`,
    `https://query1.finance.yahoo.com/v8/finance/chart/${safeSymbol}?range=${safeRange}&interval=${safeInterval}&includePrePost=false&events=history`,
  ];

  let lastError;
  for (const url of urls) {
    try {
      const raw = await fetchJson(url, { ua: YAHOO_UA, cacheMs: options.cacheMs });
      return normalizeCandles(raw, symbol, url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("yahoo chart unavailable");
}

async function getYahooCandlesWithFallback(symbol, range = "1d", interval = "5m", options = {}) {
  const attempts = [{ range, interval }];
  if (range === "1d" && interval !== "1d") attempts.push({ range: "5d", interval: "1d" });
  if (interval !== "1d") attempts.push({ range: "1mo", interval: "1d" });

  let lastError;
  for (const attempt of attempts) {
    try {
      const data = await getYahooCandles(symbol, attempt.range, attempt.interval, options);
      if (attempt.range !== range || attempt.interval !== interval) {
        return {
          ...data,
          provider: `${data.provider} 日线兜底`,
          requestedRange: range,
          requestedInterval: interval,
        };
      }
      return data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("yahoo chart unavailable");
}

async function getCandles(symbol, range = "1d", interval = "5m", options = {}) {
  const requestedSymbol = String(symbol || "").trim();
  const marketSymbol = resolveStaticMarketSymbol(requestedSymbol);
  const isUsSymbol = /^[A-Z]+$/i.test(marketSymbol);
  let lastError;

  try {
    return await tryYahooStack(marketSymbol, range, interval, requestedSymbol, marketSymbol !== normalizeMarketSymbol(requestedSymbol) ? "映射" : "", options);
  } catch (error) {
    lastError = error;
  }

  if (isUsSymbol) {
    try {
      const data = await getNasdaqChart(marketSymbol);
      return { ...data, requestedSymbol };
    } catch (error) {
      lastError = error;
    }
  }

  const discoveredSymbol = await discoverYahooSymbol(requestedSymbol);
  if (discoveredSymbol && discoveredSymbol !== marketSymbol) {
    try {
      return await tryYahooStack(discoveredSymbol, range, interval, requestedSymbol, "自动映射", options);
    } catch (error) {
      lastError = error;
    }
  }

  try {
    const data = await getStooqQuote(marketSymbol);
    return { ...data, requestedSymbol };
  } catch (error) {
    throw lastError || error;
  }
}

function parseMarketNumber(value) {
  if (typeof value === "number") return value;
  if (!value) return null;
  const cleaned = String(value).replace(/[$,%+,]/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseFinancialNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value || value === "--" || value === "N/A") return null;
  const text = String(value).replace(/[$,%+,]/g, "").trim();
  const isNegative = /^-/.test(text) || /^\(.*\)$/.test(text);
  const parsed = Number(text.replace(/[()]/g, ""));
  if (!Number.isFinite(parsed)) return null;
  return isNegative ? -Math.abs(parsed) : parsed;
}

function percentChange(latest, previous) {
  if (!Number.isFinite(latest) || !Number.isFinite(previous) || previous === 0) return null;
  return ((latest - previous) / Math.abs(previous)) * 100;
}

function parseNasdaqRange(value = "") {
  const matches = String(value || "").match(/[\d,.]+/g) || [];
  const numbers = matches.map(parseMarketNumber).filter((item) => Number.isFinite(item));
  if (numbers.length < 2) return {};
  return {
    fiftyTwoWeekHigh: Math.max(numbers[0], numbers[1]),
    fiftyTwoWeekLow: Math.min(numbers[0], numbers[1]),
  };
}

async function getNasdaqSummary(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) throw new Error("nasdaq summary supports US symbols only");
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const url = `https://api.nasdaq.com/api/quote/${safeSymbol}/summary?assetclass=stocks`;
  const raw = await fetchJson(url);
  const summary = raw?.data?.summaryData || {};
  const range = parseNasdaqRange(summary.FiftTwoWeekHighLow?.value);
  return {
    marketCap: parseMarketNumber(summary.MarketCap?.value),
    oneYearTarget: parseMarketNumber(summary.OneYrTarget?.value),
    averageVolume: parseMarketNumber(summary.AverageVolume?.value),
    shareVolume: parseMarketNumber(summary.ShareVolume?.value),
    sector: summary.Sector?.value || "",
    industry: summary.Industry?.value || "",
    exchange: summary.Exchange?.value || "",
    ...range,
  };
}

async function getYahooSearch(symbol) {
  const normalized = normalizeMarketSymbol(symbol);
  const params = new URLSearchParams({
    q: normalized,
    quotesCount: "8",
    newsCount: "6",
    enableFuzzyQuery: "false",
    quotesQueryId: "tss_match_phrase_query",
  });
  const raw = await fetchJson(`https://query1.finance.yahoo.com/v1/finance/search?${params.toString()}`, { ua: YAHOO_UA });
  const quotes = (raw.quotes || []).filter((quote) => String(quote.quoteType || "").toUpperCase() === "EQUITY");
  const best =
    quotes.find((quote) => normalizeMarketSymbol(quote.symbol) === normalized) ||
    quotes.find((quote) => normalizeMarketSymbol(quote.symbol).startsWith(normalized)) ||
    quotes[0] ||
    {};
  return {
    quote: best.symbol
      ? {
          symbol: best.symbol,
          longName: best.longname || best.shortname || "",
          shortName: best.shortname || best.longname || "",
          exchange: best.exchDisp || best.exchange || "",
          sector: best.sectorDisp || best.sector || "",
          industry: best.industryDisp || best.industry || "",
          quoteType: best.typeDisp || best.quoteType || "",
        }
      : {},
    news: (raw.news || [])
      .filter((item) => item.title && item.link)
      .slice(0, 5)
      .map((item) => ({
        title: item.title,
        publisher: item.publisher || "",
        url: item.link,
        date: item.providerPublishTime ? item.providerPublishTime * 1000 : null,
        relatedTickers: item.relatedTickers || [],
      })),
  };
}

async function getNasdaqInfo(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) return {};
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const raw = await fetchJson(`https://api.nasdaq.com/api/quote/${safeSymbol}/info?assetclass=stocks`);
  const data = raw?.data || {};
  return {
    companyName: data.companyName || "",
    stockType: data.stockType || "",
    exchange: data.exchange || "",
    isNasdaqListed: Boolean(data.isNasdaqListed),
    isNasdaq100: Boolean(data.isNasdaq100),
    marketStatus: data.marketStatus || "",
    primaryVolume: parseMarketNumber(data.primaryData?.volume),
  };
}

function financialMetric(table = {}, matcher) {
  const row = (table.rows || []).find((item) => matcher.test(item.value1 || ""));
  const headers = table.headers || {};
  if (!row) return null;
  const latest = parseFinancialNumber(row.value2);
  const previous = parseFinancialNumber(row.value3);
  return {
    label: row.value1,
    period: headers.value2 || "",
    previousPeriod: headers.value3 || "",
    raw: row.value2 || "",
    previousRaw: row.value3 || "",
    value: latest,
    previous,
    yoy: percentChange(latest, previous),
  };
}

async function getNasdaqFinancials(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) return {};
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const raw = await fetchJson(`https://api.nasdaq.com/api/company/${safeSymbol}/financials?frequency=1`);
  const income = raw?.data?.incomeStatementTable || {};
  const revenue = financialMetric(income, /^Total Revenue$/i);
  const grossProfit = financialMetric(income, /^Gross Profit$/i);
  const operatingIncome = financialMetric(income, /^Operating Income$/i);
  const netIncome = financialMetric(income, /^(Net Income|Income After Taxes)$/i);
  return {
    period: income.headers?.value2 || "",
    previousPeriod: income.headers?.value3 || "",
    revenue,
    grossProfit,
    operatingIncome,
    netIncome,
    grossMargin: revenue?.value && Number.isFinite(grossProfit?.value) ? (grossProfit.value / revenue.value) * 100 : null,
    operatingMargin: revenue?.value && Number.isFinite(operatingIncome?.value) ? (operatingIncome.value / revenue.value) * 100 : null,
    netMargin: revenue?.value && Number.isFinite(netIncome?.value) ? (netIncome.value / revenue.value) * 100 : null,
  };
}

async function getNasdaqShortInterest(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) return {};
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const raw = await fetchJson(`https://api.nasdaq.com/api/quote/${safeSymbol}/short-interest?assetclass=stocks`);
  const latest = raw?.data?.shortInterestTable?.rows?.[0] || {};
  return {
    settlementDate: latest.settlementDate || "",
    interest: parseMarketNumber(latest.interest),
    avgDailyShareVolume: parseMarketNumber(latest.avgDailyShareVolume),
    daysToCover: Number(latest.daysToCover) || null,
  };
}

async function getNasdaqChart(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) throw new Error("nasdaq chart supports US symbols only");
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const url = `https://api.nasdaq.com/api/quote/${safeSymbol}/chart?assetclass=stocks`;
  const raw = await fetchJson(url);
  const data = raw?.data;
  if (!data?.chart?.length) throw new Error("nasdaq chart unavailable");

  const points = data.chart
    .map((point) => ({
      time: Number(point.x),
      close: Number(point.y ?? point.z?.value),
    }))
    .filter((point) => Number.isFinite(point.time) && Number.isFinite(point.close));

  if (!points.length) throw new Error("nasdaq chart empty");

  const previousClose = parseMarketNumber(data.previousClose) || points[0].close;
  const candles = points.map((point, index) => {
    const open = index === 0 ? previousClose : points[index - 1].close;
    return {
      time: point.time,
      open,
      high: Math.max(open, point.close),
      low: Math.min(open, point.close),
      close: point.close,
      volume: 0,
      closeSeries: true,
    };
  });

  const price = parseMarketNumber(data.lastSalePrice) || candles.at(-1).close;
  const change = parseMarketNumber(data.netChange);
  const changePercent =
    parseMarketNumber(data.percentageChange) ??
    (Number.isFinite(change) && previousClose ? (change / previousClose) * 100 : null);

  return {
    symbol: data.symbol || symbol.toUpperCase(),
    currency: "USD",
    exchange: data.exchange || "NASDAQ",
    provider: "Nasdaq Chart",
    sourceUrl: url,
    updatedAt: candles.at(-1)?.time || Date.now(),
    price,
    previousClose,
    change: Number.isFinite(change) ? change : price - previousClose,
    changePercent,
    ohlc: false,
    synthetic: true,
    candles,
  };
}

function normalizeSpark(raw, symbol, sourceUrl, range, interval) {
  const payload = raw?.[symbol.toUpperCase()] || raw?.[symbol] || raw?.[Object.keys(raw || {})[0]];
  if (!payload?.timestamp?.length || !payload?.close?.length) throw new Error("spark series unavailable");

  const closes = payload.close;
  const previousClose = Number(payload.chartPreviousClose || payload.previousClose || closes[0]);
  const candles = payload.timestamp
    .map((time, index) => {
      const close = closes[index];
      const open = index === 0 ? previousClose : closes[index - 1];
      if (!Number.isFinite(open) || !Number.isFinite(close)) return null;
      return {
        time: time * 1000,
        open,
        high: Math.max(open, close),
        low: Math.min(open, close),
        close,
        volume: 0,
        closeSeries: true,
      };
    })
    .filter(Boolean);

  const price = candles.at(-1)?.close;
  const change = Number.isFinite(price) ? price - previousClose : null;
  const changePercent = Number.isFinite(change) && previousClose ? (change / previousClose) * 100 : null;

  return {
    symbol: payload.symbol || symbol.toUpperCase(),
    currency: symbol.endsWith(".ST") ? "SEK" : "USD",
    exchange: "Close series",
    provider: "Yahoo Spark",
    sourceUrl,
    range,
    interval,
    updatedAt: candles.at(-1)?.time || Date.now(),
    price,
    previousClose,
    change,
    changePercent,
    ohlc: false,
    synthetic: true,
    candles,
  };
}

async function getSparkSeries(symbol, range, interval, options = {}) {
  const safeSymbol = encodeURIComponent(symbol.toUpperCase());
  const safeRange = encodeURIComponent(range);
  const safeInterval = encodeURIComponent(interval);
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${safeSymbol}&range=${safeRange}&interval=${safeInterval}`,
    `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${safeSymbol}&range=${safeRange}&interval=${safeInterval}`,
  ];

  let lastError;
  for (const url of urls) {
    try {
      const raw = await fetchJson(url, { ua: YAHOO_UA, cacheMs: options.cacheMs });
      return normalizeSpark(raw, symbol, url, range, interval);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("spark unavailable");
}

function stooqSymbol(symbol) {
  const upper = symbol.toUpperCase();
  const aliases = {
    "SIVE.ST": "sivef.us",
  };
  if (aliases[upper]) return aliases[upper];
  if (/^[A-Z]+$/i.test(symbol)) return `${symbol.toLowerCase()}.us`;
  return symbol.toLowerCase();
}

function parseCsvLine(line) {
  return line.split(",").map((cell) => cell.trim());
}

async function getStooqQuote(symbol) {
  const stooq = stooqSymbol(symbol);
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(stooq)}&f=sd2t2ohlcv&h&e=csv`;
  const csv = await fetchText(url);
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("stooq empty response");
  const [csvSymbol, date, time, open, high, low, close, volume] = parseCsvLine(lines[1]);
  const values = [open, high, low, close].map(Number);
  if (values.some((value) => !Number.isFinite(value))) throw new Error("stooq quote unavailable");

  const [openValue, highValue, lowValue, closeValue] = values;
  const updatedAt = Date.parse(`${date}T${time}Z`) || Date.now();
  const change = closeValue - openValue;

  return {
    symbol: symbol.toUpperCase(),
    currency: "USD",
    exchange: csvSymbol,
    provider: "Stooq Quote",
    sourceUrl: url,
    range: "1d",
    interval: "1d",
    updatedAt,
    price: closeValue,
    previousClose: openValue,
    change,
    changePercent: openValue ? (change / openValue) * 100 : null,
    ohlc: true,
    synthetic: false,
    candles: [
      {
        time: updatedAt,
        open: openValue,
        high: highValue,
        low: lowValue,
        close: closeValue,
        volume: Number(volume) || 0,
      },
    ],
  };
}

async function handleCandles(reqUrl, res) {
  const symbol = reqUrl.searchParams.get("symbol") || "NVDA";
  const range = reqUrl.searchParams.get("range") || "1d";
  const interval = reqUrl.searchParams.get("interval") || "5m";
  try {
    const data = await getCandles(symbol, range, interval);
    send(res, 200, JSON.stringify(data));
  } catch (error) {
    send(
      res,
      200,
      JSON.stringify({
        symbol,
        requestedRange: range,
        requestedInterval: interval,
        provider: "待补源",
        updatedAt: Date.now(),
        error: error.message,
        candles: [],
      })
    );
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function handleQuotes(reqUrl, res) {
  const detailed = reqUrl.searchParams.get("detail") === "1";
  const symbols = (reqUrl.searchParams.get("symbols") || "NVDA,AAOI,AXTI,SIVE.ST,MRVL")
    .split(",")
    .map((symbol) => symbol.trim())
    .filter(Boolean)
    .slice(0, 36);

  const quotes = await mapWithConcurrency(
    symbols,
    6,
    async (symbol) => {
      try {
        const data = await getCandles(symbol, "1d", "5m", { cacheMs: detailed ? DETAIL_QUOTE_CACHE_MS : QUOTE_CACHE_MS });
        let summary = {};
        try {
          const summarySymbol = resolveStaticMarketSymbol(data.symbol || symbol);
          if (/^[A-Z]+$/i.test(summarySymbol)) summary = await getNasdaqSummary(summarySymbol);
        } catch {
          summary = {};
        }
        let details = {};
        if (detailed) {
          const detailSymbol = resolveStaticMarketSymbol(data.symbol || symbol);
          const [search, info, financials, shortInterest] = await Promise.all([
            getYahooSearch(detailSymbol).catch(() => ({})),
            getNasdaqInfo(detailSymbol).catch(() => ({})),
            getNasdaqFinancials(detailSymbol).catch(() => ({})),
            getNasdaqShortInterest(detailSymbol).catch(() => ({})),
          ]);
          details = {
            profile: {
              companyName: info.companyName || search.quote?.longName || search.quote?.shortName || "",
              stockType: info.stockType || search.quote?.quoteType || "",
              sector: summary.sector || search.quote?.sector || "",
              industry: summary.industry || search.quote?.industry || "",
              exchange: summary.exchange || info.exchange || search.quote?.exchange || "",
              isNasdaqListed: info.isNasdaqListed,
              isNasdaq100: info.isNasdaq100,
              marketStatus: info.marketStatus || "",
            },
            financials,
            shortInterest,
            news: search.news || [],
          };
        }
        return {
          symbol: data.symbol,
          requestedSymbol: symbol,
          currency: data.currency,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          updatedAt: data.updatedAt,
          provider: data.provider,
          ...summary,
          ...details,
        };
      } catch (error) {
        return { requestedSymbol: symbol, error: error.message };
      }
    }
  );

  const cacheControl = detailed
    ? "public, max-age=300, s-maxage=900, stale-while-revalidate=3600"
    : "public, max-age=60, s-maxage=120, stale-while-revalidate=600";
  send(res, 200, JSON.stringify({ provider: "Yahoo Finance", updatedAt: Date.now(), quotes }), "application/json; charset=utf-8", cacheControl);
}

function normalizeLiveStatus(status = {}) {
  const text = status.text || status.raw_text?.text || "";
  const facetSymbols = (status.raw_text?.facets || [])
    .filter((facet) => facet.type === "symbol" && facet.original)
    .map((facet) => String(facet.original).replace(/^\$/, "").toUpperCase());
  return {
    id: String(status.id || ""),
    date: status.created_at ? new Date(status.created_at).toISOString() : "",
    title: text.replace(/\s+/g, " ").trim().slice(0, 180),
    body: text,
    symbols: unique([...facetSymbols, ...extractSymbolsFromText(text).map((symbol) => symbol.toUpperCase())]),
    sentiment: inferImportSentiment(text),
    theme: classifyImportTheme(text),
    url: status.url || (status.id ? `https://x.com/aleabitoreddit/status/${status.id}` : ""),
    engagement: {
      likes: metricNumber(status.likes),
      retweets: metricNumber(status.retweets ?? status.reposts),
      replies: metricNumber(status.replies),
      views: metricNumber(status.views),
    },
  };
}

async function handleSerenityLive(reqUrl, res) {
  try {
    const raw = await fetchJson("https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses", { ua: YAHOO_UA, cacheMs: LIVE_CACHE_MS });
    const items = (raw.results || [])
      .filter((item) => item.type === "status")
      .map(normalizeLiveStatus)
      .filter((item) => item.id && item.body)
      .slice(0, 8);
    send(
      res,
      200,
      JSON.stringify({
        provider: "FxTwitter public profile statuses",
        capturedAt: Date.now(),
        profile: raw.results?.[0]?.author || null,
        items,
      }),
      "application/json; charset=utf-8",
      "public, max-age=15, s-maxage=30, stale-while-revalidate=120"
    );
  } catch (error) {
    send(
      res,
      200,
      JSON.stringify({ provider: "FxTwitter public profile statuses", capturedAt: Date.now(), error: error.message, items: [] }),
      "application/json; charset=utf-8",
      "public, max-age=15, s-maxage=30, stale-while-revalidate=120"
    );
  }
}

function parsePerformanceRecords(value = "") {
  try {
    const records = JSON.parse(value || "[]");
    return Array.isArray(records)
      ? records
          .map((item) => ({
            id: String(item.id || `${item.symbol}:${item.date}`),
            symbol: normalizeMarketSymbol(item.symbol),
            date: item.date,
            title: String(item.title || ""),
          }))
          .filter((item) => item.symbol && Number.isFinite(Date.parse(item.date)))
          .slice(0, 18)
      : [];
  } catch {
    return [];
  }
}

function nearestClose(candles = [], targetMs) {
  return candles.find((bar) => bar.time >= targetMs && Number.isFinite(bar.close)) || null;
}

function returnPercent(price, entry) {
  if (!Number.isFinite(price) || !Number.isFinite(entry) || entry <= 0) return null;
  return ((price - entry) / entry) * 100;
}

async function historicalCandlesFor(symbol, startMs) {
  const marketSymbol = resolveStaticMarketSymbol(symbol);
  const period1 = Math.floor((startMs - 3 * 86_400_000) / 1000);
  const period2 = Math.floor((Date.now() + 2 * 86_400_000) / 1000);
  const safeSymbol = encodeURIComponent(marketSymbol);
  const raw = await fetchJson(
    `https://query1.finance.yahoo.com/v8/finance/chart/${safeSymbol}?period1=${period1}&period2=${period2}&interval=1d&events=history`,
    { ua: YAHOO_UA }
  );
  const result = raw?.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const quote = result?.indicators?.quote?.[0] || {};
  const candles = timestamps
    .map((time, index) => ({
      time: time * 1000,
      close: Number(quote.close?.[index]),
      low: Number(quote.low?.[index]),
    }))
    .filter((bar) => Number.isFinite(bar.time) && Number.isFinite(bar.close));
  return { marketSymbol, candles };
}

async function performanceForRecord(record = {}) {
  const startMs = Date.parse(record.date);
  const { marketSymbol, candles } = await historicalCandlesFor(record.symbol, startMs);
  const entry = nearestClose(candles, startMs);
  if (!entry) throw new Error("entry price unavailable");
  const horizons = [7, 30, 90].map((days) => {
    const bar = nearestClose(candles, startMs + days * 86_400_000);
    return {
      days,
      price: bar?.close ?? null,
      returnPercent: bar ? returnPercent(bar.close, entry.close) : null,
      available: Boolean(bar),
    };
  });
  const available = candles.filter((bar) => bar.time >= entry.time);
  const minClose = Math.min(...available.map((bar) => bar.close).filter(Number.isFinite));
  const latest = available.at(-1);
  return {
    ...record,
    marketSymbol,
    entryPrice: entry.close,
    entryDate: new Date(entry.time).toISOString(),
    currentPrice: latest?.close ?? null,
    currentReturnPercent: latest ? returnPercent(latest.close, entry.close) : null,
    maxDrawdownPercent: Number.isFinite(minClose) ? returnPercent(minClose, entry.close) : null,
    horizons,
  };
}

async function handlePerformance(reqUrl, res) {
  const records = parsePerformanceRecords(reqUrl.searchParams.get("records") || "[]");
  const results = await mapWithConcurrency(records, 5, async (record) => {
    try {
      return await performanceForRecord(record);
    } catch (error) {
      return { ...record, error: error.message };
    }
  });
  send(
    res,
    200,
    JSON.stringify({ provider: "Yahoo Finance historical chart", updatedAt: Date.now(), results }),
    "application/json; charset=utf-8",
    "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400"
  );
}

function readJsonFile(fileName) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "data", fileName), "utf8"));
}

function writeJsonFile(fileName, data) {
  fs.writeFileSync(path.join(ROOT, "data", fileName), JSON.stringify(data, null, 2));
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function stableHash(value = "") {
  return crypto.createHash("sha1").update(String(value)).digest("hex").slice(0, 16);
}

function cleanImportText(value = "", limit = 16_000) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim()
    .slice(0, limit);
}

function statusIdFromUrl(url = "") {
  const text = String(url || "").trim();
  return text.match(/(?:status|statuses|conversation)\/(\d{12,})/)?.[1] || (text.match(/^\d{15,22}$/)?.[0] || "");
}

function canonicalStatusUrl(url = "") {
  const id = statusIdFromUrl(url);
  return id ? `https://x.com/aleabitoreddit/status/${id}` : String(url || "").trim();
}

function statusRefsFromText(text = "") {
  const refs = [];
  const source = String(text || "");
  STATUS_REF_RE.lastIndex = 0;
  for (const match of source.matchAll(STATUS_REF_RE)) {
    const raw = match[0];
    const id = match[1] || match[2] || statusIdFromUrl(raw);
    if (!id) continue;
    refs.push({
      id,
      raw,
      index: match.index || 0,
      url: canonicalStatusUrl(id),
    });
  }
  const seen = new Set();
  return refs.filter((ref) => {
    if (seen.has(ref.id)) return false;
    seen.add(ref.id);
    return true;
  });
}

function sourceListForItem(item = {}) {
  if (item.sourceList?.length) return unique(item.sourceList);
  if (Array.isArray(item.source)) return unique(item.source);
  return unique(String(item.source || "").split(/\s+\+\s+/));
}

function firstSentence(text = "", limit = 180) {
  const clean = cleanImportText(text, limit * 3).replace(/\s+/g, " ");
  if (!clean) return "";
  const sentence = clean.match(/^(.{24,}?[.!?。！？])\s/)?.[1] || clean;
  return sentence.length > limit ? `${sentence.slice(0, limit - 1).trim()}…` : sentence;
}

function extractSymbolsFromText(text = "") {
  return unique(
    [...String(text || "").matchAll(/\$+\s*([A-Z][A-Z0-9.]{1,8})/g)]
      .map((match) => match[1].replace(/\.+$/, ""))
      .filter((symbol) => !TICKER_STOPLIST.has(symbol))
  );
}

function inferImportSentiment(text = "") {
  const lower = String(text || "").toLowerCase();
  if (/bear|short|avoid|sell|reduce|risk|dilution|atm|debt|convertible|broken|invalid|稀释|融资|债务|风险|做空|卖出|减仓|失效/.test(lower)) {
    return "bear";
  }
  if (/bull|long|buy|accumulate|winner|upside|breakout|conviction|favorite|看多|买入|加仓|上行|突破|高确信/.test(lower)) {
    return "bull";
  }
  return "neutral";
}

function classifyImportTheme(text = "") {
  const lower = String(text || "").toLowerCase();
  if (/atm|dilution|convertible|debt|selling \$6|稀释|融资|债务|可转债|资本结构/.test(lower)) return "capital-structure-veto";
  if (/cpo|co-packaged|silicon photonics|siph|photonics|光子|硅光|共封装|光互连/.test(lower)) return "cpo-silicon-photonics";
  if (/inp|substrate|photonic substrates|衬底|基板|材料瓶颈/.test(lower)) return "substrate-materials";
  if (/laser|pluggables|optics|transceiver|光模块|激光|光器件/.test(lower)) return "optical-components";
  if (/neocloud|gpu cloud|nbis|算力合同|云算力/.test(lower)) return "neocloud";
  if (/hyperscaler|compute|ai infra|accelerator|gpu|cluster|算力|ai 基建|加速器|集群/.test(lower)) return "ai-infrastructure";
  if (/housing|real estate|reit|地产/.test(lower)) return "hard-assets";
  if (/power|vera rubin|electricity|energy|电力|能源/.test(lower)) return "power-architecture";
  return "general";
}

function importMateriality(item = {}) {
  const text = `${item.title || ""} ${item.body || ""}`;
  let score = 30;
  if (item.sentiment === "bull" || item.sentiment === "bear") score += 10;
  score += Math.min(25, (item.symbols || []).length * 5);
  if ((item.body || "").length > 140) score += 8;
  if (item.theme && item.theme !== "general") score += 10;
  if (/favorite|high conviction|sizable position|most consequential|target|PT|flipped bearish|ATM|conviction|bottleneck|客户|订单|瓶颈/i.test(text)) {
    score += 16;
  }
  return Math.min(100, score);
}

function metricNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const text = String(value).trim().toLowerCase().replace(/,/g, "");
  const multiplier = text.endsWith("k") ? 1_000 : text.endsWith("m") ? 1_000_000 : text.endsWith("b") ? 1_000_000_000 : 1;
  const parsed = Number(text.replace(/[kmb]$/, ""));
  return Number.isFinite(parsed) ? Math.round(parsed * multiplier) : 0;
}

function normalizeTwitterDate(value = "") {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
}

function fxStatusText(status = {}) {
  return status.text || status.raw_text?.text || "";
}

function fxStatusSymbols(status = {}) {
  const text = fxStatusText(status);
  const facetSymbols = (status.raw_text?.facets || [])
    .filter((facet) => facet.type === "symbol" && facet.original)
    .map((facet) => String(facet.original).toUpperCase());
  return unique([...facetSymbols, ...extractSymbolsFromText(text)]);
}

function fxEngagement(status = {}) {
  return {
    likes: metricNumber(status.likes),
    retweets: metricNumber(status.retweets ?? status.reposts),
    replies: metricNumber(status.replies),
    views: metricNumber(status.views),
    quotes: metricNumber(status.quotes),
    bookmarks: metricNumber(status.bookmarks),
  };
}

async function fetchFxTwitterStatusForImport(id = "") {
  const apiUrl = `https://api.fxtwitter.com/aleabitoreddit/status/${encodeURIComponent(id)}`;
  const payload = await fetchJson(apiUrl);
  const tweet = payload.tweet || {};
  if (payload.code && payload.code !== 200) throw new Error(payload.message || `FxTwitter code ${payload.code}`);
  if (!tweet.id) throw new Error("FxTwitter status missing tweet");

  const text = fxStatusText(tweet);
  return {
    id: String(tweet.id || id),
    url: canonicalStatusUrl(tweet.url || `https://x.com/aleabitoreddit/status/${id}`),
    apiUrl,
    text,
    date: normalizeTwitterDate(tweet.created_at),
    symbols: fxStatusSymbols(tweet),
    sentiment: inferImportSentiment(text),
    theme: classifyImportTheme(text),
    engagement: fxEngagement(tweet),
    author: tweet.author
      ? {
          screenName: tweet.author.screen_name,
          followers: metricNumber(tweet.author.followers),
          avatarUrl: tweet.author.avatar_url || "",
        }
      : undefined,
  };
}

function normalizeFxCommentForImport(status = {}, fallbackParentId = "") {
  const text = fxStatusText(status);
  if (!status?.id || !text) return null;
  const author = status.author || {};
  return {
    id: String(status.id),
    date: normalizeTwitterDate(status.created_at),
    author: author.screen_name || author.screenName || "",
    authorFollowers: metricNumber(author.followers),
    content: text,
    url: status.url || `https://x.com/${author.screen_name || "i"}/status/${status.id}`,
    symbols: fxStatusSymbols(status),
    engagement: fxEngagement(status),
    source: "fxtwitter-conversation",
    replyingTo: {
      status: status.replying_to?.status || fallbackParentId,
      author: status.replying_to?.screen_name || "aleabitoreddit",
      url: status.replying_to?.url || (fallbackParentId ? `https://x.com/aleabitoreddit/status/${fallbackParentId}` : ""),
    },
  };
}

function dedupeImportComments(comments = [], limit = 120) {
  const seen = new Set();
  return comments
    .filter((comment) => {
      const key = comment.id || comment.url || `${comment.author}:${comment.content}`;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => metricNumber(b.engagement?.likes) - metricNumber(a.engagement?.likes))
    .slice(0, limit);
}

async function fetchFxTwitterConversationForImport(id = "") {
  const apiUrl = `https://api.fxtwitter.com/2/conversation/${encodeURIComponent(id)}?ranking_mode=likes`;
  const payload = await fetchJson(apiUrl);
  if (payload.code && payload.code !== 200) throw new Error(payload.message || `FxTwitter conversation code ${payload.code}`);
  return {
    apiUrl,
    comments: dedupeImportComments((payload.replies || []).map((reply) => normalizeFxCommentForImport(reply, id)).filter(Boolean)),
  };
}

function mergeFxImportItem(item = {}, fxStatus = {}) {
  if (!fxStatus?.text) return item;
  const existingBody = item.body || "";
  const shouldUseFxBody =
    !existingBody ||
    existingBody.length < Math.min(900, fxStatus.text.length) ||
    /公开补源只提供了 X status URL|等待下一轮公开接口回填原文/i.test(existingBody);
  const body = shouldUseFxBody ? fxStatus.text : existingBody;
  const sources = unique([...sourceListForItem(item), "fxtwitter-status"]);
  const enriched = {
    ...item,
    id: fxStatus.id || item.id,
    date: fxStatus.date || item.date,
    sentiment: item.sentiment === "neutral" && fxStatus.sentiment !== "neutral" ? fxStatus.sentiment : item.sentiment,
    title: shouldUseFxBody ? firstSentence(fxStatus.text, 180) : item.title || firstSentence(fxStatus.text, 180),
    body,
    symbols: unique([...(item.symbols || []), ...(fxStatus.symbols || [])]),
    theme: item.theme && item.theme !== "general" ? item.theme : fxStatus.theme || item.theme,
    url: fxStatus.url || item.url,
    source: sources.join(" + "),
    sourceUrl: item.sourceUrl || fxStatus.url,
    sourceUrls: unique([...(item.sourceUrls || []), item.sourceUrl, item.url, fxStatus.url, fxStatus.apiUrl].filter(Boolean)),
    sourceList: sources,
    engagement: fxStatus.engagement || item.engagement,
    fxTwitter: {
      id: fxStatus.id,
      url: fxStatus.url,
      apiUrl: fxStatus.apiUrl,
      author: fxStatus.author,
      conversationApiUrl: fxStatus.conversationApiUrl,
      enrichedAt: new Date().toISOString(),
    },
    comments: dedupeImportComments([...(item.comments || []), ...(fxStatus.comments || [])]),
    oembedNotNeeded: true,
  };
  enriched.materiality = Math.max(Number(item.materiality) || 0, importMateriality(enriched));
  return enriched;
}

async function enrichImportItemsWithFxTwitter(importItems = []) {
  return Promise.all(
    importItems.map(async (item) => {
      const id = statusIdFromUrl(item.url);
      if (!id) return item;
      try {
        const fxStatus = await fetchFxTwitterStatusForImport(id);
        try {
          const conversation = await fetchFxTwitterConversationForImport(id);
          fxStatus.comments = conversation.comments;
          fxStatus.conversationApiUrl = conversation.apiUrl;
        } catch {
          fxStatus.comments = [];
        }
        return mergeFxImportItem(item, fxStatus);
      } catch {
        return item;
      }
    })
  );
}

function commentIdentityKey(comment = {}) {
  return String(comment.id || comment.url || [comment.author || comment.name || "", comment.date || "", comment.content || comment.text || ""].join(":")).trim();
}

function commentSignalScore(comment = {}, parent = {}) {
  const content = comment.content || comment.text || "";
  const text = `${content} ${parent.title || ""} ${parent.body || ""}`;
  const symbols = unique([...(comment.symbols || []), ...extractSymbolsFromText(text)]);
  let score = Math.min(36, symbols.length * 9);
  score += Math.min(22, metricNumber(comment.engagement?.likes) / 12);
  if ((comment.author || "").toLowerCase() === "aleabitoreddit") score += 26;
  if (/supply|supplier|customer|order|backlog|capacity|capex|margin|revenue|valuation|dilution|convertible|CHIPS|contract|bottleneck|substrate|photonics|laser|CPO|CoWoS|HBM|power|robot|drone|defense|AI/i.test(text)) score += 22;
  if (/long|short|position|entry|exit|trim|accumulate|bear|bull|target|PT|10x|risk|thesis/i.test(text)) score += 16;
  if (content.length > 120) score += 8;
  return Math.round(score);
}

function buildCommentSignals(items = []) {
  const signalMap = new Map();
  for (const item of items) {
    for (const comment of item.comments || []) {
      const content = comment.content || comment.text || "";
      const key = commentIdentityKey(comment);
      const symbols = unique([...(comment.symbols || []), ...extractSymbolsFromText(`${content} ${item.title || ""}`)]);
      const score = commentSignalScore(comment, item);
      if (score < 24 && !symbols.length) continue;
      const signal = {
        id: comment.id || comment.url || `${item.id}-${signalMap.size}`,
        score,
        author: comment.author || comment.name || "",
        authorFollowers: comment.authorFollowers || 0,
        date: comment.date || "",
        content,
        url: comment.url || "",
        symbols,
        engagement: comment.engagement || {},
        parent: {
          id: item.id,
          title: item.title,
          url: item.url,
          symbols: item.symbols || [],
          theme: item.theme,
        },
      };
      const mapKey = key || signal.id;
      const existing = signalMap.get(mapKey);
      if (!existing || signal.score > existing.score || metricNumber(signal.engagement?.likes) > metricNumber(existing.engagement?.likes)) {
        signalMap.set(mapKey, signal);
      }
    }
  }

  const signals = [...signalMap.values()];
  const ranked = signals.sort((a, b) => b.score - a.score || metricNumber(b.engagement?.likes) - metricNumber(a.engagement?.likes));
  const symbolMap = new Map();
  for (const signal of ranked) {
    for (const symbol of signal.symbols) {
      const bucket = symbolMap.get(symbol) || { symbol, mentions: 0, score: 0 };
      bucket.mentions += 1;
      bucket.score += signal.score;
      symbolMap.set(symbol, bucket);
    }
  }

  return {
    total: ranked.length,
    topSymbols: [...symbolMap.values()].sort((a, b) => b.score - a.score).slice(0, 16),
    items: ranked.slice(0, 60),
  };
}

function mergeManualImportReport(sources = [], importItems = []) {
  const importedCount = importItems.filter((item) => sourceListForItem(item).includes("manual-import")).length;
  const sourceReports = sources.filter((source) => source.source !== "manual-import");
  sourceReports.push({
    source: "manual-import",
    url: "manual-import",
    indexedClaim: null,
    manualImportCount: importedCount,
    parsedItems: importedCount,
  });
  return sourceReports;
}

function mergeConversationBackfillReport(sources = [], processedItems = [], commentsAdded = 0, items = []) {
  const sourceReports = sources.filter((source) => source.source !== "fxtwitter-conversation-backfill");
  const previous = sources.find((source) => source.source === "fxtwitter-conversation-backfill") || {};
  const conversationItems = items.filter(
    (item) => item.fxTwitter?.conversationApiUrl || sourceListForItem(item).includes("fxtwitter-conversation")
  );
  const cumulativeItems = conversationItems.length || metricNumber(previous.conversationBackfillItems) + processedItems.length;
  const cumulativeComments =
    conversationItems.reduce((total, item) => total + (item.comments?.length || 0), 0) ||
    metricNumber(previous.conversationBackfillComments) + commentsAdded;
  sourceReports.push({
    source: "fxtwitter-conversation-backfill",
    url: "https://api.fxtwitter.com/2/conversation",
    indexedClaim: null,
    conversationBackfillItems: cumulativeItems,
    conversationBackfillComments: cumulativeComments,
    parsedItems: cumulativeItems,
  });
  return sourceReports;
}

function coverageClaimsFromReports(sourceReports = [], mergedCommentCount = 0) {
  return sourceReports
    .flatMap((report) =>
      [
        report.profileTweetCount
          ? { source: report.source, type: "profile-tweet-count", label: "公开镜像账号总量", count: report.profileTweetCount, url: report.url }
          : null,
        report.fxTwitterProfileTweetCount
          ? {
              source: report.source,
              type: "fxtwitter-profile-tweet-count",
              label: "FxTwitter 账号档案",
              count: report.fxTwitterProfileTweetCount,
              followers: report.fxTwitterFollowers,
              url: report.url,
            }
          : null,
        report.thirdPartyScrapeClaim
          ? {
              source: report.source,
              type: "third-party-scrape",
              label: "第三方抓取样本",
              count: report.thirdPartyScrapeClaim,
              coverageWindow: report.coverageWindow,
              returnClaim: report.returnClaim,
              url: report.url,
            }
          : null,
        report.assetFeedPostCount ? { source: report.source, type: "supercycle-asset-feed", label: "Supercycle 资产喊单", count: report.assetFeedPostCount, url: report.url } : null,
        report.callerFeedPostCount ? { source: report.source, type: "supercycle-caller-feed", label: "Supercycle caller feed", count: report.callerFeedPostCount, url: report.url } : null,
        report.callerAssetCount ? { source: report.source, type: "supercycle-caller-assets", label: "Supercycle caller assets", count: report.callerAssetCount, url: report.url } : null,
        report.callerAssetPostCount ? { source: report.source, type: "supercycle-caller-asset-posts", label: "Supercycle asset-post links", count: report.callerAssetPostCount, url: report.url } : null,
        report.investCopilotArticleCount ? { source: report.source, type: "investcopilot-articles", label: "InvestCopilot Alea 文章", count: report.investCopilotArticleCount, url: report.url } : null,
        report.semiconStocksThesisCount
          ? {
              source: report.source,
              type: "semiconstocks-tracker-theses",
              label: "Serenity Tracker 策略论点",
              count: report.semiconStocksThesisCount,
              timelineEvents: report.semiconStocksTimelineEventCount || 0,
              latestDate: report.semiconStocksLatestDate || "",
              url: report.url,
            }
          : null,
        report.serenitySaidTweetCount
          ? {
              source: report.source,
              type: "serenitysaid-structured-feed",
              label: "SerenitySaid 结构化推文",
              count: report.serenitySaidTweetCount,
              latestId: report.serenitySaidLatestId || "",
              latestDate: report.serenitySaidLatestDate || "",
              updatedAt: report.serenitySaidUpdatedAt || "",
              url: report.url,
            }
          : null,
        report.twiscanPostCount
          ? {
              source: report.source,
              type: "twiscan-recent-mirror",
              label: "Twiscan 近期镜像正文",
              count: report.twiscanPostCount,
              resolved: report.twiscanResolvedCount || 0,
              unresolved: report.twiscanUnresolvedCount || 0,
              statusCoverageImpact: 0,
              url: "https://twiscan.com/en/x/aleabitoreddit",
            }
          : null,
        report.instalkerReaderPostCount
          ? {
              source: report.source,
              type: "instalker-reader-mirror",
              label: "Instalker Reader 镜像正文",
              count: report.instalkerReaderPostCount,
              resolved: report.instalkerReaderResolvedCount || 0,
              unresolved: report.instalkerReaderUnresolvedCount || 0,
              statusCoverageImpact: 0,
              url: "https://instalker.org/aleabitoreddit",
            }
          : null,
        report.instalkerLoadMoreFetched
          ? {
              source: report.source,
              type: "instalker-load-more",
              label: "Instalker 直连翻页",
              count: report.instalkerLoadMoreFetched,
              rawFetched: report.instalkerLoadMoreRawFetched || report.instalkerLoadMoreFetched,
              rawUniqueFetched: report.instalkerLoadMoreRawUniqueFetched || report.instalkerLoadMoreFetched,
              pages: report.instalkerLoadMorePages || 0,
              url: report.url,
            }
          : null,
        report.buysidePitchCount ? { source: report.source, type: "buyside-serenity-pitches", label: "Buyside Serenity pitches", count: report.buysidePitchCount, url: report.url } : null,
        report.fxTwitterReplyCount ? { source: report.source, type: "fxtwitter-reply-samples", label: "FxTwitter 回复样本", count: report.fxTwitterReplyCount, url: report.url } : null,
        report.conversationBackfillComments
          ? { source: report.source, type: "fxtwitter-conversation-backfill", label: "FxTwitter 会话评论补源", count: report.conversationBackfillComments, url: report.url }
          : null,
        report.fxTwitterWithRepliesArchived ? { source: report.source, type: "fxtwitter-with-replies", label: "FxTwitter 含回复时间线", count: report.fxTwitterWithRepliesArchived, url: report.url } : null,
        mergedCommentCount && report.source === "fxtwitter-reply-search"
          ? {
              source: "fxtwitter-comments",
              type: "merged-comment-samples",
              label: "已合并评论样本",
              count: mergedCommentCount,
              url: "https://api.fxtwitter.com/2/search?q=to%3Aaleabitoreddit",
            }
          : null,
        report.manualImportCount ? { source: report.source, type: "manual-import", label: "公开补源导入", count: report.manualImportCount, url: report.url } : null,
      ].filter(Boolean)
    )
    .sort((a, b) => b.count - a.count);
}

function rebuildDistillationFromTweets(tweets = {}, previousDistillation = {}) {
  const items = tweets.items || [];
  const sourceReports = tweets.sources || previousDistillation.sources || [];
  const symbolMap = new Map();
  const themeMap = new Map();
  const sourceMap = new Map();

  for (const item of items) {
    const theme = item.theme || "general";
    const sentiment = ["bull", "bear", "neutral"].includes(item.sentiment) ? item.sentiment : "neutral";
    themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
    for (const source of sourceListForItem(item)) {
      const sourceBucket = sourceMap.get(source) || { source, items: 0, oembed: 0 };
      sourceBucket.items += 1;
      if (item.oembed) sourceBucket.oembed += 1;
      sourceMap.set(source, sourceBucket);
    }

    const itemAssets = new Map((item.supercycle?.assets || []).map((asset) => [asset.symbol, asset]));
    for (const symbol of item.symbols || []) {
      const asset = itemAssets.get(symbol);
      const bucket =
        symbolMap.get(symbol) ||
        {
          symbol,
          mentions: 0,
          bull: 0,
          bear: 0,
          neutral: 0,
          materiality: 0,
          derivedWeight: 0,
          longWeight: 0,
          shortWeight: 0,
          weightMentions: 0,
          themes: {},
          latest: "",
        };
      bucket.mentions += 1;
      bucket[sentiment] = (bucket[sentiment] || 0) + 1;
      bucket.materiality += Number(item.materiality) || importMateriality(item);
      if (asset) {
        bucket.derivedWeight += Number(asset.weight) || 0;
        if (asset.direction === "long") bucket.longWeight += Number(asset.weight) || 0;
        if (asset.direction === "short") bucket.shortWeight += Number(asset.weight) || 0;
        bucket.weightMentions += 1;
      }
      bucket.themes[theme] = (bucket.themes[theme] || 0) + 1;
      if (!bucket.latest || Date.parse(item.date || "") > Date.parse(bucket.latest || "")) bucket.latest = item.date || bucket.latest;
      symbolMap.set(symbol, bucket);
    }
  }

  const symbols = [...symbolMap.values()]
    .map((entry) => {
      const weightBase = entry.weightMentions || 1;
      const derivedWeight = Math.min(100, Math.round((entry.derivedWeight / weightBase) * 10) / 10);
      const longWeight = Math.min(100, Math.round((entry.longWeight / weightBase) * 10) / 10);
      const shortWeight = Math.min(100, Math.round((entry.shortWeight / weightBase) * 10) / 10);
      return {
        ...entry,
        materiality: Math.min(100, Math.round(entry.materiality / entry.mentions)),
        derivedWeight,
        longWeight,
        shortWeight,
        dominantTheme: Object.entries(entry.themes).sort((a, b) => b[1] - a[1])[0]?.[0] || "general",
        sentimentScore: entry.bull * 18 - entry.bear * 22 + entry.neutral * 3 + Math.round((longWeight - shortWeight) / 4),
      };
    })
    .sort((a, b) => b.materiality + b.sentimentScore - (a.materiality + a.sentimentScore));

  const mergedCommentCount = items.reduce((total, item) => total + (item.comments?.length || 0), 0);
  const engagementTotals = items.reduce(
    (totals, item) => {
      const engagement = item.engagement || {};
      if (engagement.likes || engagement.retweets || engagement.replies || engagement.views) totals.items += 1;
      totals.likes += Number(engagement.likes) || 0;
      totals.retweets += Number(engagement.retweets) || 0;
      totals.replies += Number(engagement.replies) || 0;
      totals.views += Number(engagement.views) || 0;
      return totals;
    },
    { items: 0, likes: 0, retweets: 0, replies: 0, views: 0 }
  );
  const sourceUrls = unique([...(String(tweets.source || "").split(/\s*,\s*/) || []), "manual-import"].map((entry) => entry.trim()).filter(Boolean));

  return {
    generatedAt: new Date().toISOString(),
    source: sourceUrls.join(", "),
    sources: sourceReports,
    indexedClaim: tweets.indexedClaim || previousDistillation.indexedClaim || null,
    parsedItems: items.length,
    oembedEnriched: items.filter((item) => item.oembed).length,
    fxTwitterStatusEnriched: items.filter((item) => item.fxTwitter).length,
    commentCount: mergedCommentCount,
    commentSignals: buildCommentSignals(items),
    engagementTotals,
    coverageClaims: coverageClaimsFromReports(sourceReports, mergedCommentCount),
    coverageNote:
      tweets.indexedClaim && tweets.indexedClaim > items.length
        ? `Primary source claims ${tweets.indexedClaim} indexed tweets; ${items.length} merged public items were extractable across configured sources in this run.`
        : `${items.length} merged public items were extractable across configured sources in this run.`,
    sourceBreakdown: [...sourceMap.values()].sort((a, b) => b.items - a.items),
    symbols,
    themes: [...themeMap.entries()].map(([theme, count]) => ({ theme, count })).sort((a, b) => b.count - a.count),
    rules: previousDistillation.rules || [],
  };
}

function splitImportText(rawText = "") {
  const text = cleanImportText(rawText);
  if (!text) return [];
  const refs = statusRefsFromText(text);
  if (refs.length === 1) return [text];
  const blankBlocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  if (refs.length === 0 && blankBlocks.length > 1) return blankBlocks;
  if (refs.length === 0) return [text];
  return refs.map((ref, index) => text.slice(ref.index, refs[index + 1]?.index || text.length).trim()).filter(Boolean);
}

function importItemFromBlock(block = "", fallbackUrl = "", fallbackDate = "", sourceLabel = "manual-import") {
  const statusRef = statusRefsFromText(`${block}\n${fallbackUrl}`)[0];
  const statusUrl = canonicalStatusUrl(statusRef?.raw || statusRef?.id || fallbackUrl);
  const statusId = statusIdFromUrl(statusUrl);
  const body = cleanImportText(block.replace(STATUS_REF_RE, "").trim(), 8_000);
  const evidenceText = body || statusUrl || sourceLabel;
  const symbols = extractSymbolsFromText(evidenceText);
  const item = {
    id: statusId || `manual-${stableHash(`${statusUrl}:${evidenceText}`)}`,
    date: fallbackDate || new Date().toISOString(),
    sentiment: inferImportSentiment(evidenceText),
    title: firstSentence(body, 180) || "Serenity X 补源样本",
    body: body || "公开补源只提供了 X status URL，等待下一轮公开接口回填原文。",
    symbols,
    theme: classifyImportTheme(evidenceText),
    url: statusUrl || "https://x.com/aleabitoreddit",
    source: "manual-import",
    sourceUrl: statusUrl || "manual-import",
    sourceUrls: unique([statusUrl].filter(Boolean)),
    sourceList: ["manual-import"],
    manualImports: [
      {
        importedAt: new Date().toISOString(),
        source: sourceLabel,
        url: statusUrl || "",
        text: body,
      },
    ],
    oembedNotNeeded: Boolean(body),
  };
  item.materiality = importMateriality(item);
  return item;
}

function buildImportItems(payload = {}) {
  const entries = Array.isArray(payload.entries) ? payload.entries : [];
  const urlEntries = Array.isArray(payload.urls)
    ? payload.urls.map((url) => ({ url }))
    : Array.isArray(payload.statusUrls)
      ? payload.statusUrls.map((url) => ({ url }))
      : [];
  const normalizedEntries = [...entries, ...urlEntries];
  if (normalizedEntries.length) {
    return normalizedEntries
      .map((entry) =>
        importItemFromBlock(
          cleanImportText(entry.text || entry.body || ""),
          cleanImportText(entry.url || payload.url || "", 800),
          cleanImportText(entry.date || payload.date || "", 80),
          cleanImportText(entry.source || payload.source || "manual-import", 120)
        )
      )
      .filter((item) => item.body || item.url);
  }

  const rawText = cleanImportText(payload.text || payload.body || "");
  const fallbackUrl = cleanImportText(payload.url || "", 800);
  const hasEmbeddedStatusUrls = statusRefsFromText(rawText).length > 0;
  const blocks = fallbackUrl && !hasEmbeddedStatusUrls && rawText ? [rawText] : splitImportText(rawText);
  if (!blocks.length && fallbackUrl) blocks.push("");
  return blocks
    .map((block) => importItemFromBlock(block, fallbackUrl, cleanImportText(payload.date || "", 80), cleanImportText(payload.source || "manual-import", 120)))
    .filter((item) => item.body || item.url);
}

function mergeEngagement(existing = {}, incoming = {}) {
  const keys = ["likes", "retweets", "replies", "views", "quotes", "bookmarks"];
  return Object.fromEntries(keys.map((key) => [key, Math.max(metricNumber(existing?.[key]), metricNumber(incoming?.[key]))]));
}

function mergeImportedItem(existing = {}, imported = {}) {
  const sources = unique([...sourceListForItem(existing), ...sourceListForItem(imported), "manual-import"]);
  const importedText = imported.manualImports?.[0]?.text || "";
  const manualImports = unique([
    ...(existing.manualImports || []).map((entry) => JSON.stringify(entry)),
    ...(imported.manualImports || []).map((entry) => JSON.stringify(entry)),
  ])
    .slice(-8)
    .map((entry) => JSON.parse(entry));
  const shouldUseImportedBody =
    importedText &&
    ((existing.body || "").length < importedText.length || /^通过 Twitter oEmbed|公开补源只提供/.test(existing.body || ""));

  return {
    ...existing,
    title: shouldUseImportedBody ? imported.title : existing.title || imported.title,
    body: shouldUseImportedBody ? imported.body : existing.body || imported.body,
    sentiment: existing.sentiment === "neutral" && imported.sentiment !== "neutral" ? imported.sentiment : existing.sentiment || imported.sentiment,
    symbols: unique([...(existing.symbols || []), ...(imported.symbols || [])]),
    theme: existing.theme && existing.theme !== "general" ? existing.theme : imported.theme || existing.theme,
    materiality: Math.max(Number(existing.materiality) || 0, Number(imported.materiality) || 0),
    engagement: mergeEngagement(existing.engagement, imported.engagement),
    comments: dedupeImportComments([...(existing.comments || []), ...(imported.comments || [])]),
    fxTwitter: imported.fxTwitter || existing.fxTwitter,
    sourceList: sources,
    source: sources.join(" + "),
    sourceUrls: unique([...(existing.sourceUrls || []), existing.sourceUrl, imported.sourceUrl, ...(imported.sourceUrls || [])].filter(Boolean)),
    sourceUrl: existing.sourceUrl || imported.sourceUrl,
    manualImports,
  };
}

async function importResearchPayload(payload = {}) {
  const tweets = readJsonFile("serenity-tweets.json");
  const previousDistillation = readJsonFile("serenity-distillation.json");
  const importItems = await enrichImportItemsWithFxTwitter(buildImportItems(payload));
  if (!importItems.length) {
    const error = new Error("没有可导入的补源内容");
    error.statusCode = 400;
    throw error;
  }

  const byId = new Map((tweets.items || []).map((item) => [String(item.id), item]));
  let added = 0;
  let merged = 0;
  for (const item of importItems) {
    const existing = byId.get(String(item.id));
    if (existing) {
      byId.set(String(item.id), mergeImportedItem(existing, item));
      merged += 1;
    } else {
      byId.set(String(item.id), item);
      added += 1;
    }
  }

  const items = [...byId.values()].sort((a, b) => (Number(b.materiality) || 0) - (Number(a.materiality) || 0));
  const sourceReports = mergeManualImportReport(tweets.sources || [], items);
  const nextTweets = {
    ...tweets,
    source: unique([...(String(tweets.source || "").split(/\s*,\s*/) || []), "manual-import"].map((entry) => entry.trim()).filter(Boolean)).join(", "),
    sources: sourceReports,
    scrapedAt: new Date().toISOString(),
    items,
  };
  const distillation = rebuildDistillationFromTweets(nextTweets, previousDistillation);
  nextTweets.commentCount = distillation.commentCount;
  nextTweets.commentSignals = distillation.commentSignals;
  nextTweets.engagementTotals = distillation.engagementTotals;
  nextTweets.coverageClaims = distillation.coverageClaims;
  nextTweets.oembedEnriched = distillation.oembedEnriched;
  nextTweets.fxTwitterStatusEnriched = distillation.fxTwitterStatusEnriched;
  nextTweets.commentBackfillQueue = commentBackfillQueueSummary(nextTweets);

  writeJsonFile("serenity-tweets.json", nextTweets);
  writeJsonFile("serenity-distillation.json", distillation);

  return {
    added,
    merged,
    received: importItems.length,
    comments: importItems.reduce((total, item) => total + (item.comments?.length || 0), 0),
    symbols: unique(importItems.flatMap((item) => item.symbols || [])).slice(0, 16),
  };
}

function commentBackfillIntentScore(item = {}) {
  const symbols = unique(item.symbols || []);
  const equitySymbols = symbols.filter((symbol) => !CRYPTO_ONLY_SYMBOLS.has(String(symbol).toUpperCase()));
  const text = `${item.title || ""} ${item.text || ""} ${item.body || ""} ${item.strategy || ""} ${item.theme || ""}`;
  const lower = text.toLowerCase();
  let score = 0;

  if (equitySymbols.length) score += 54 + Math.min(36, equitySymbols.length * 6);
  if (item.sentiment === "bull" || item.sentiment === "bear") score += 18;
  if (item.theme && item.theme !== "general") score += 18;
  if (/long|short|buy|sell|hold|position|favorite|conviction|target|pt|upside|downside|sector|thesis|catalyst|margin|revenue|earnings|guidance|multiple|valuation|rerat|moat|bottleneck|supplier|customer|order|contract|capacity|inventory|cycle|breakout|accumulate|trim|hedge|portfolio|watchlist|选股|持仓|买入|卖出|加仓|减仓|看多|看空|目标价|催化|订单|客户|瓶颈|估值|组合/.test(lower)) {
    score += 42;
  }
  if (/cpo|silicon photonics|photonics|gpu|ai infra|neocloud|power|energy|semiconductor|memory|optics|uranium|defense|biotech|silver|bitcoin|光子|硅光|算力|半导体|电力|能源|军工|白银/.test(lower)) {
    score += 18;
  }
  if (/^@\w+/.test(String(item.text || item.title || "").trim())) score -= 35;
  if (!equitySymbols.length && symbols.length) score -= 22;
  if (!equitySymbols.length && !/(strategy|stock|sector|market|trade|alpha|portfolio|buy|sell|long|short|选股|股票|交易|组合)/.test(lower)) {
    score -= 44;
  }

  return score;
}

function commentBackfillCandidates(tweets = {}, limit = 5, minReplies = 10) {
  return (tweets.items || [])
    .map((item) => {
      const id = statusIdFromUrl(item.url || item.id || "");
      const comments = item.comments?.length || 0;
      const replies = Number(item.engagement?.replies) || 0;
      const views = Number(item.engagement?.views) || 0;
      const replyGap = Math.max(0, replies - comments);
      const intentScore = commentBackfillIntentScore(item);
      const tradableSymbols = (item.symbols || []).filter((symbol) => !CRYPTO_ONLY_SYMBOLS.has(String(symbol).toUpperCase()));
      const alreadyBackfilled = Boolean(item.fxTwitter?.commentsBackfilledAt || item.fxTwitter?.conversationApiUrl);
      const priority =
        replyGap * 1.45 +
        (Number(item.materiality) || 0) * 1.3 +
        intentScore +
        Math.min(40, Math.log10(views + 1) * 6) +
        (comments ? 0 : 28) +
        Math.min(18, (item.symbols?.length || 0) * 3);
      return {
        item,
        id,
        comments,
        replies,
        replyGap,
        intentScore,
        tradableSymbols,
        alreadyBackfilled,
        priority,
      };
    })
    .filter(
      (entry) =>
        entry.id &&
        !entry.alreadyBackfilled &&
        entry.tradableSymbols.length &&
        entry.intentScore > 0 &&
        entry.replyGap > 0 &&
        entry.replies >= minReplies &&
        entry.comments < 30
    )
    .sort((a, b) => b.priority - a.priority || Date.parse(b.item.date || 0) - Date.parse(a.item.date || 0))
    .slice(0, limit);
}

function commentBackfillQueueSummary(tweets = {}) {
  const thresholds = [25, 50, 100];
  const totalBackfilled = (tweets.items || []).filter((item) => item.fxTwitter?.commentsBackfilledAt || item.fxTwitter?.conversationApiUrl).length;
  const conversationReport = (tweets.sources || []).find((source) => source.source === "fxtwitter-conversation-backfill") || {};
  const byThreshold = Object.fromEntries(
    thresholds.map((minReplies) => [minReplies, commentBackfillCandidates(tweets, 10_000, minReplies).length])
  );
  const nextMinReplies = byThreshold[50] ? 50 : byThreshold[25] ? 25 : 50;
  const next = commentBackfillCandidates(tweets, 5, nextMinReplies).map((entry) => ({
    id: entry.id,
    title: entry.item.title || entry.item.text || "",
    symbols: (entry.tradableSymbols || []).slice(0, 8),
    replies: entry.replies,
    comments: entry.comments,
    priority: Math.round(entry.priority),
    minReplies: nextMinReplies,
  }));
  return {
    totalBackfilled,
    conversationItems: metricNumber(conversationReport.conversationBackfillItems),
    conversationComments: metricNumber(conversationReport.conversationBackfillComments),
    remaining25: byThreshold[25],
    remaining50: byThreshold[50],
    remaining100: byThreshold[100],
    nextMinReplies,
    next,
  };
}

async function backfillCommentsPayload(options = {}) {
  const tweets = readJsonFile("serenity-tweets.json");
  const previousDistillation = readJsonFile("serenity-distillation.json");
  const limit = Math.max(1, Math.min(20, Number(options.limit) || 5));
  const minReplies = Math.max(0, Math.min(500, Number(options.minReplies) || 10));
  const candidates = commentBackfillCandidates(tweets, limit, minReplies);
  const byId = new Map((tweets.items || []).map((item) => [String(item.id), item]));
  const processed = [];
  const errors = [];
  let commentsAdded = 0;

  for (const candidate of candidates) {
    try {
      const conversation = await fetchFxTwitterConversationForImport(candidate.id);
      const existing = byId.get(String(candidate.item.id)) || candidate.item;
      const before = existing.comments?.length || 0;
      const comments = dedupeImportComments([...(existing.comments || []), ...conversation.comments]);
      const after = comments.length;
      const sources = unique([...sourceListForItem(existing), "fxtwitter-conversation"]);
      const nextItem = {
        ...existing,
        comments,
        source: sources.join(" + "),
        sourceList: sources,
        sourceUrls: unique([...(existing.sourceUrls || []), existing.sourceUrl, existing.url, conversation.apiUrl].filter(Boolean)),
        fxTwitter: {
          ...(existing.fxTwitter || {}),
          conversationApiUrl: conversation.apiUrl,
          commentsBackfilledAt: new Date().toISOString(),
        },
      };
      byId.set(String(existing.id), nextItem);
      const added = Math.max(0, after - before);
      commentsAdded += added;
      processed.push({
        id: String(existing.id),
        url: existing.url,
        title: existing.title,
        symbols: existing.symbols || [],
        before,
        after,
        added,
        replies: candidate.replies,
      });
    } catch (error) {
      errors.push({
        id: candidate.id,
        url: candidate.item.url,
        error: error.message,
      });
    }
  }

  const items = [...byId.values()].sort((a, b) => (Number(b.materiality) || 0) - (Number(a.materiality) || 0));
  const sourceReports = mergeConversationBackfillReport(tweets.sources || [], processed, commentsAdded, items);
  const nextTweets = {
    ...tweets,
    sources: sourceReports,
    scrapedAt: new Date().toISOString(),
    items,
  };
  const distillation = rebuildDistillationFromTweets(nextTweets, previousDistillation);
  nextTweets.commentCount = distillation.commentCount;
  nextTweets.commentSignals = distillation.commentSignals;
  nextTweets.engagementTotals = distillation.engagementTotals;
  nextTweets.coverageClaims = distillation.coverageClaims;
  nextTweets.oembedEnriched = distillation.oembedEnriched;
  nextTweets.fxTwitterStatusEnriched = distillation.fxTwitterStatusEnriched;
  nextTweets.commentBackfillQueue = commentBackfillQueueSummary(nextTweets);

  writeJsonFile("serenity-tweets.json", nextTweets);
  writeJsonFile("serenity-distillation.json", distillation);

  return {
    requested: limit,
    minReplies,
    candidates: candidates.length,
    processed,
    errors,
    commentsAdded,
    symbols: unique(processed.flatMap((item) => item.symbols || [])).slice(0, 16),
  };
}

async function readJsonBody(req, limit = 512 * 1024) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > limit) {
      const error = new Error("请求内容过大");
      error.statusCode = 413;
      throw error;
    }
  }
  if (!body.trim()) return {};
  return JSON.parse(body);
}

function researchSnapshot(extra = {}) {
  try {
    const tweets = readJsonFile("serenity-tweets.json");
    const distillation = readJsonFile("serenity-distillation.json");
    return {
      ...extra,
      tweets: {
        scrapedAt: tweets.scrapedAt,
        indexedClaim: tweets.indexedClaim,
        parsedItems: tweets.items?.length || 0,
        oembedEnriched: tweets.oembedEnriched || 0,
        fxTwitterStatusEnriched: tweets.fxTwitterStatusEnriched || 0,
        fxTwitterProfile: tweets.fxTwitterProfile || null,
        fxTwitterArchive: tweets.fxTwitterArchive || null,
        commentCount: tweets.commentCount || 0,
        commentSignals: tweets.commentSignals || null,
        commentBackfillQueue: commentBackfillQueueSummary(tweets),
        coverageClaims: tweets.coverageClaims || [],
        sources: tweets.sources || [],
      },
      distillation: {
        generatedAt: distillation.generatedAt,
        parsedItems: distillation.parsedItems,
        indexedClaim: distillation.indexedClaim,
        oembedEnriched: distillation.oembedEnriched,
        fxTwitterStatusEnriched: distillation.fxTwitterStatusEnriched || 0,
        commentCount: distillation.commentCount || 0,
        commentSignals: distillation.commentSignals || null,
        coverageClaims: distillation.coverageClaims || [],
        sourceBreakdown: distillation.sourceBreakdown || [],
        symbols: (distillation.symbols || []).slice(0, 12),
        themes: distillation.themes || [],
      },
    };
  } catch (error) {
    return {
      ...extra,
      error: error.message,
    };
  }
}

function numberParam(reqUrl, name, fallback, min, max) {
  const value = Number(reqUrl.searchParams.get(name));
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function currentArchiveState() {
  try {
    return readJsonFile("serenity-tweets.json").fxTwitterArchive || {};
  } catch {
    return {};
  }
}

function stalledRoute(value) {
  return Number(value || 0) > 0;
}

function latestOnlyWhenStalled(pages, stalled, forceStalled = false) {
  if (forceStalled || !stalled || !pages) return pages;
  return Math.min(1, pages);
}

function skippedStalledRoutes(archive = {}, forceStalled = false, authorMicroSliceDays = 0) {
  if (forceStalled) return [];
  return [
    stalledRoute(archive.timelineStalledRuns) ? "主页时间线仅查最新页" : "",
    stalledRoute(archive.withRepliesStalledRuns) ? "含回复仅查最新页" : "",
    stalledRoute(archive.withRepliesRtsStalledRuns) ? "含转推评论流仅查最新页" : "",
    stalledRoute(archive.authorDateSliceStalled)
      ? authorMicroSliceDays
        ? `日期切片拆成 ${authorMicroSliceDays} 天窗口`
        : "日期切片停滞已跳过"
      : "",
    archive.authorExhausted ? "作者搜索已到末端" : "",
    archive.replyExhausted ? "评论搜索已到末端" : "",
  ].filter(Boolean);
}

function snapshotMetrics(snapshot = {}) {
  const archive = snapshot.tweets?.fxTwitterArchive || {};
  return {
    parsedItems: snapshot.tweets?.parsedItems || 0,
    commentCount: snapshot.tweets?.commentCount || 0,
    highSignalComments: snapshot.tweets?.commentSignals?.total || 0,
    timelineItems: archive.statusItems || archive.timelineItems || 0,
    replyComments: (archive.replyComments || 0) + (archive.withRepliesRtsComments || 0),
  };
}

function statusIdFromItem(item = {}) {
  const rawId = item.id || item.tweetId || item.fxTwitterV2?.id;
  if (rawId) return String(rawId);
  const match = String(item.url || item.sourceUrl || "").match(/status\/(\d+)/);
  return match ? match[1] : "";
}

function itemMonth(item = {}) {
  const value = item.date || item.createdAt || item.created_at || "";
  const match = String(value).match(/^\d{4}-\d{2}/);
  return match ? match[0] : "";
}

function uniqueArchiveItems(sourceEntries = []) {
  const byId = new Map();
  const sourceCounts = {};

  sourceEntries.forEach(([source, items]) => {
    const seenInSource = new Set();
    (items || []).forEach((item) => {
      const id = statusIdFromItem(item);
      if (!id) return;
      seenInSource.add(id);
      if (!byId.has(id)) {
        byId.set(id, { item, sources: new Set([source]) });
      } else {
        byId.get(id).sources.add(source);
      }
    });
    sourceCounts[source] = seenInSource.size;
  });

  return { byId, sourceCounts };
}

function publicStatusIdFromItem(item = {}) {
  const urls = [item.url, item.sourceUrl, ...(item.sourceUrls || [])].filter(Boolean);
  const fromUrl = urls.map((url) => statusIdFromUrl(url)).find(Boolean);
  if (fromUrl) return fromUrl;
  const rawId = String(item.id || item.tweetId || item.fxTwitterV2?.id || "").trim();
  return /^\d{15,22}$/.test(rawId) ? rawId : "";
}

function uniqueTweetIndexStatusItems(tweets = {}) {
  const byId = new Map();
  for (const item of tweets.items || []) {
    const id = publicStatusIdFromItem(item);
    if (!id) continue;
    if (!byId.has(id)) byId.set(id, item);
  }
  return byId;
}

function routeAudit(key, label, route = {}, options = {}) {
  const hasCursor = Boolean(route.cursor);
  const exhausted = Boolean(route.exhausted);
  const stalledRuns = Number(route.stalledRuns || 0);
  const lastNewItems = Number(route.lastNewItems || 0);
  const lastFetchedItems = Number(route.lastFetchedItems || 0);
  const lastNewComments = Number(route.lastNewComments || 0);
  const lastFetchedComments = Number(route.lastFetchedComments || 0);
  const cursorAdvanced = Boolean(route.lastCursorAdvanced);
  const stalled = hasCursor && !exhausted && stalledRuns > 0;
  const status = stalled ? `停滞 ${stalledRuns} 次` : hasCursor && !exhausted ? "可继续" : exhausted ? "已到末端" : "已暂停";
  const fetchedNote = lastFetchedComments
    ? `最近抓到 ${lastFetchedItems} 条原帖 / ${lastFetchedComments} 条评论，新增 ${lastNewItems} 条原帖 / ${lastNewComments} 条评论`
    : `最近抓到 ${lastFetchedItems} 条，新增 ${lastNewItems} 条`;
  return {
    key,
    label,
    items: route.items?.length || 0,
    pages: route.pagesFetched || 0,
    cursor: hasCursor,
    exhausted,
    stalled,
    stalledRuns,
    lastNewItems,
    lastFetchedItems,
    lastNewComments,
    lastFetchedComments,
    cursorAdvanced,
    status,
    tone: stalled ? "stalled" : hasCursor && !exhausted ? "hot" : exhausted ? "done" : "muted",
    note: stalled
      ? `${fetchedNote}${cursorAdvanced ? "，cursor 有推进但内容重复" : "，cursor 未推进"}`
      : options.note ||
        (hasCursor && !exhausted
          ? "保留 cursor，可继续翻页"
          : exhausted
            ? "公开接口已翻到末端"
            : "等待下一轮参数"),
  };
}

function buildExternalMirrorAudit(tweets = {}) {
  const twiscanReport = (tweets.sources || []).find((source) => source.source === "twiscan") || {};
  const readerReport = (tweets.sources || []).find((source) => source.source === "instalker-reader") || {};
  const instalkerReport = (tweets.sources || []).find((source) => source.source === "instalker") || {};
  const twiscanItems = (tweets.items || []).filter((item) => item.twiscan || sourceListForItem(item).includes("twiscan-recent-mirror"));
  const readerItems = (tweets.items || []).filter((item) => item.instalkerReader || sourceListForItem(item).includes("instalker-reader-mirror"));
  const mirrorMap = new Map();
  const readerMap = new Map();

  for (const item of twiscanItems) {
    const key =
      item.twiscan?.mirrorId ||
      (String(item.url || "").includes("twiscan.com") ? item.url : "") ||
      item.twiscan?.resolvedStatusId ||
      item.id ||
      `${item.title || ""}:${item.body || ""}`.slice(0, 160);
    const existing = mirrorMap.get(key) || { resolved: false };
    mirrorMap.set(key, {
      ...existing,
      resolved: existing.resolved || Boolean(item.twiscan?.resolvedStatusId),
    });
  }

  for (const item of readerItems) {
    const key =
      item.instalkerReader?.mirrorId ||
      item.instalkerReader?.resolvedStatusId ||
      item.id ||
      `${item.title || ""}:${item.body || ""}`.slice(0, 160);
    const existing = readerMap.get(key) || { resolved: false };
    readerMap.set(key, {
      ...existing,
      resolved: existing.resolved || Boolean(item.instalkerReader?.resolvedStatusId),
    });
  }

  const resolvedFromItems = [...mirrorMap.values()].filter((item) => item.resolved).length;
  const posts = Math.max(Number(twiscanReport.twiscanPostCount) || 0, mirrorMap.size);
  const resolved = Math.max(Number(twiscanReport.twiscanResolvedCount) || 0, resolvedFromItems);
  const unresolved = Math.max(0, Number(twiscanReport.twiscanUnresolvedCount) || posts - resolved);
  const readerResolvedFromItems = [...readerMap.values()].filter((item) => item.resolved).length;
  const readerPosts = Math.max(Number(readerReport.instalkerReaderPostCount) || 0, readerMap.size);
  const readerResolved = Math.max(Number(readerReport.instalkerReaderResolvedCount) || 0, readerResolvedFromItems);
  const readerUnresolved = Math.max(0, Number(readerReport.instalkerReaderUnresolvedCount) || readerPosts - readerResolved);

  return {
    twiscan: {
      posts,
      resolved,
      unresolved,
      url: "https://twiscan.com/en/x/aleabitoreddit",
      statusCoverageImpact: 0,
      note: posts
        ? "Twiscan 镜像用于交叉验证与策略蒸馏；已映射项合并到现有 X 状态，不扩大覆盖数。"
        : "暂无外部镜像补源。",
    },
    instalkerReader: {
      posts: readerPosts,
      resolved: readerResolved,
      unresolved: readerUnresolved,
      url: "https://instalker.org/aleabitoreddit",
      statusCoverageImpact: 0,
      note: readerPosts
        ? "Instalker Reader 镜像用于最新正文蒸馏；可映射项合并到现有 X 状态，其余仅作策略文本补源。"
        : "暂无 Instalker Reader 补源。",
    },
    instalkerLoadMore: {
      posts: Number(instalkerReport.instalkerLoadMoreFetched) || 0,
      rawFetched: Number(instalkerReport.instalkerLoadMoreRawFetched) || 0,
      rawUniqueFetched: Number(instalkerReport.instalkerLoadMoreRawUniqueFetched) || Number(instalkerReport.instalkerLoadMoreFetched) || 0,
      pages: Number(instalkerReport.instalkerLoadMorePages) || 0,
      url: "https://instalker.org/aleabitoreddit",
      statusCoverageImpact: 0,
      note: instalkerReport.instalkerLoadMoreFetched
        ? "Instalker 直连翻页用于交叉验证；当前去重状态均已映射到既有 X 状态，不扩大覆盖数。"
        : "暂无 Instalker 直连翻页补源。",
    },
  };
}

function buildArchiveAudit() {
  const archive = readJsonFile("serenity-fxtwitter-archive.json");
  const tweets = readJsonFile("serenity-tweets.json");
  const summary = archive.summary || tweets.fxTwitterArchive || {};
  const profile = tweets.fxTwitterProfile || {};
  const slices = archive.authorDateSlices?.slices || {};
  const sliceList = Object.values(slices);
  const dateSliceItems = sliceList.flatMap((slice) => slice.items || []);
  const topSlices = archive.authorTopDateSlices?.slices || {};
  const topSliceList = Object.values(topSlices);
  const topDateSliceItems = topSliceList.flatMap((slice) => slice.items || []);
  const statusSources = [
    ["timeline", archive.timeline?.items || []],
    ["withReplies", archive.withRepliesTimeline?.items || []],
    ["withRepliesRts", archive.withRepliesRetweets?.items || []],
    ["authorSearch", archive.authorSearch?.items || []],
    ["dateSlices", dateSliceItems],
    ["topDateSlices", topDateSliceItems],
  ];
  const { byId, sourceCounts } = uniqueArchiveItems(statusSources);
  const monthMap = new Map();

  byId.forEach(({ item, sources: itemSources }) => {
    const month = itemMonth(item);
    if (!month) return;
    if (!monthMap.has(month)) monthMap.set(month, { month, count: 0, sources: {} });
    const entry = monthMap.get(month);
    entry.count += 1;
    itemSources.forEach((source) => {
      entry.sources[source] = (entry.sources[source] || 0) + 1;
    });
  });

  const months = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));
  const maxMonthCount = months.reduce((max, month) => Math.max(max, month.count), 1);
  const routeUniqueItems = byId.size;
  const publicStatusItems = uniqueTweetIndexStatusItems(tweets);
  const readableStatusItems = Math.max(summary.statusItems || routeUniqueItems, routeUniqueItems, publicStatusItems.size);
  const profileTweetClaim = Number(profile.tweets || 0);
  const gap = Math.max(0, profileTweetClaim - readableStatusItems);
  const percent = profileTweetClaim ? Math.max(0, Math.min(100, (readableStatusItems / profileTweetClaim) * 100)) : 0;
  const exhaustedSlices = sliceList.filter((slice) => slice.exhausted).length;
  const stalledSlices = sliceList.filter((slice) => slice.cursor && !slice.exhausted && (slice.stalledRuns || 0) > 0).length;
  const exhaustedTopSlices = topSliceList.filter((slice) => slice.exhausted).length;
  const stalledTopSlices = topSliceList.filter((slice) => slice.cursor && !slice.exhausted && (slice.stalledRuns || 0) > 0).length;
  const nonEmptySlices = sliceList.filter((slice) => (slice.items?.length || 0) > 0);
  const sortedSlices = sliceList
    .slice()
    .sort((a, b) => String(a.since || "").localeCompare(String(b.since || "")));
  const nonEmptySortedSlices = nonEmptySlices
    .slice()
    .sort((a, b) => String(a.since || "").localeCompare(String(b.since || "")));
  const replySearch = archive.replySearch || {};
  const withRepliesRetweets = archive.withRepliesRetweets || {};
  const withRepliesRtsComments = (withRepliesRetweets.commentItems || []).reduce((total, item) => total + (item.comments?.length || 0), 0);

  return {
    updatedAt: archive.updatedAt || summary.updatedAt || tweets.scrapedAt || null,
    profile: {
      screenName: profile.screenName || "aleabitoreddit",
      name: profile.name || "Serenity",
      tweets: profileTweetClaim,
      followers: profile.followers || 0,
      fetchedAt: profile.fetchedAt || null,
    },
    coverage: {
      readableStatusItems,
      profileTweetClaim,
      gap,
      percent,
      routeUniqueItems,
      publicSourceItems: publicStatusItems.size,
      sourceCounts,
    },
    externalMirrors: buildExternalMirrorAudit(tweets),
    routes: [
      routeAudit("timeline", "主页时间线", archive.timeline),
      routeAudit("withReplies", "含回复时间线", archive.withRepliesTimeline),
      {
        ...routeAudit("withRepliesRts", "含转推评论流", withRepliesRetweets, { note: "include_rts 回复上下文补源" }),
        items: withRepliesRtsComments,
      },
      routeAudit("authorSearch", "作者搜索", archive.authorSearch, { note: "作者搜索窗口已扫完" }),
      {
        key: "dateSlices",
        label: "日期切片",
        items: sourceCounts.dateSlices || dateSliceItems.length,
        pages: sliceList.reduce((total, slice) => total + (slice.pagesFetched || 0), 0),
        cursor: sliceList.some((slice) => slice.cursor && !slice.exhausted),
        exhausted: exhaustedSlices === sliceList.length && sliceList.length > 0,
        stalled: stalledSlices > 0,
        stalledRuns: stalledSlices,
        status: stalledSlices ? `${stalledSlices} 个窗口停滞` : `${exhaustedSlices}/${sliceList.length} 已扫`,
        tone: stalledSlices ? "stalled" : exhaustedSlices === sliceList.length && sliceList.length > 0 ? "done" : "hot",
        note: stalledSlices ? `${exhaustedSlices}/${sliceList.length} 已扫，剩余窗口最近无新增` : "按月份窗口验证历史缺口",
      },
      {
        key: "topDateSlices",
        label: "Top 日期切片",
        items: sourceCounts.topDateSlices || topDateSliceItems.length,
        pages: topSliceList.reduce((total, slice) => total + (slice.pagesFetched || 0), 0),
        cursor: topSliceList.some((slice) => slice.cursor && !slice.exhausted),
        exhausted: exhaustedTopSlices === topSliceList.length && topSliceList.length > 0,
        stalled: stalledTopSlices > 0,
        stalledRuns: stalledTopSlices,
        status: topSliceList.length
          ? stalledTopSlices
            ? `${stalledTopSlices} 个窗口停滞`
            : `${exhaustedTopSlices}/${topSliceList.length} 已扫`
          : "等待",
        tone: stalledTopSlices ? "stalled" : exhaustedTopSlices === topSliceList.length && topSliceList.length > 0 ? "done" : "hot",
        note: topSliceList.length ? "feed=top 交叉补源，去重后计入覆盖" : "等待指定 Top 搜索窗口",
      },
      routeAudit("replySearch", "评论搜索", replySearch, { note: "评论线程搜索已到末端" }),
    ],
    comments: {
      threads: summary.replyThreads || replySearch.items?.length || 0,
      comments: (summary.replyComments || 0) + (summary.withRepliesRtsComments || withRepliesRtsComments || 0),
      pages: (summary.replyPages || replySearch.pagesFetched || 0) + (summary.withRepliesRtsPages || withRepliesRetweets.pagesFetched || 0),
      exhausted: Boolean(summary.replyExhausted || replySearch.exhausted),
    },
    slices: {
      total: sliceList.length,
      exhausted: exhaustedSlices,
      nonEmpty: nonEmptySlices.length,
      items: summary.authorDateSliceItems || dateSliceItems.length,
      pages: summary.authorDateSlicePages || sliceList.reduce((total, slice) => total + (slice.pagesFetched || 0), 0),
      topTotal: topSliceList.length,
      topExhausted: exhaustedTopSlices,
      topItems: summary.authorTopDateSliceItems || topDateSliceItems.length,
      topPages: summary.authorTopDateSlicePages || topSliceList.reduce((total, slice) => total + (slice.pagesFetched || 0), 0),
      earliestWindow: sortedSlices[0]?.since || "",
      latestWindow: sortedSlices.at(-1)?.until || "",
      earliestNonEmpty: nonEmptySortedSlices[0]?.since || "",
      latestNonEmpty: nonEmptySortedSlices.at(-1)?.until || "",
      recent: sortedSlices.slice(-8).map((slice) => ({
        since: slice.since || "",
        until: slice.until || "",
        items: slice.items?.length || 0,
        pages: slice.pagesFetched || 0,
        exhausted: Boolean(slice.exhausted),
      })),
    },
    months: months.map((month) => ({
      ...month,
      percent: maxMonthCount ? Math.round((month.count / maxMonthCount) * 100) : 0,
    })),
    nextActions: [
      archive.timeline?.cursor && !(archive.timeline?.stalledRuns > 0) ? "继续主页时间线 cursor 翻页" : "",
      archive.withRepliesTimeline?.cursor && !(archive.withRepliesTimeline?.stalledRuns > 0) ? "继续含回复 cursor 翻页" : "",
      archive.withRepliesRetweets?.cursor && !(archive.withRepliesRetweets?.stalledRuns > 0) ? "继续含转推评论流 cursor 翻页" : "",
      [archive.timeline, archive.withRepliesTimeline, archive.withRepliesRetweets].some((route) => route?.cursor && route?.stalledRuns > 0) || stalledSlices
        ? `cursor 停滞：${[
            archive.timeline?.cursor && archive.timeline?.stalledRuns > 0 ? "主页时间线" : "",
            archive.withRepliesTimeline?.cursor && archive.withRepliesTimeline?.stalledRuns > 0 ? "含回复时间线" : "",
            archive.withRepliesRetweets?.cursor && archive.withRepliesRetweets?.stalledRuns > 0 ? "含转推评论流" : "",
            stalledSlices ? "日期切片" : "",
          ]
            .filter(Boolean)
            .join("、")}，需要替代公开源`
        : "",
      gap ? `公开口径仍差 ${gap} 条，需用更多公开镜像交叉补齐` : "",
    ].filter(Boolean),
  };
}

async function handleArchiveAudit(_reqUrl, res) {
  send(res, 200, JSON.stringify(buildArchiveAudit()));
}

async function handleImportResearch(req, res) {
  if (req.method !== "POST") {
    send(res, 405, JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  const before = snapshotMetrics(researchSnapshot());
  try {
    const payload = await readJsonBody(req);
    const importSummary = await importResearchPayload(payload);
    const snapshot = researchSnapshot({
      status: "imported",
      mode: "manual-import",
      importSummary,
    });
    const after = snapshotMetrics(snapshot);
    send(
      res,
      200,
      JSON.stringify({
        ...snapshot,
        metrics: after,
        delta: metricDelta(before, after),
      })
    );
  } catch (error) {
    send(res, error.statusCode || 400, JSON.stringify({ error: error.message }));
  }
}

async function handleBackfillComments(req, reqUrl, res) {
  if (!["GET", "POST"].includes(req.method)) {
    send(res, 405, JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  const before = snapshotMetrics(researchSnapshot());
  try {
    const body = req.method === "POST" ? await readJsonBody(req) : {};
    const result = await backfillCommentsPayload({
      limit: body.limit ?? reqUrl.searchParams.get("limit"),
      minReplies: body.minReplies ?? reqUrl.searchParams.get("minReplies"),
    });
    const snapshot = researchSnapshot({
      status: "comments-backfilled",
      mode: "comment-backfill",
      commentBackfill: result,
    });
    const after = snapshotMetrics(snapshot);
    send(
      res,
      200,
      JSON.stringify({
        ...snapshot,
        metrics: after,
        delta: metricDelta(before, after),
      })
    );
  } catch (error) {
    send(res, error.statusCode || 400, JSON.stringify({ error: error.message }));
  }
}

function metricDelta(before = {}, after = {}) {
  return Object.fromEntries(
    Object.keys(after).map((key) => [key, (after[key] || 0) - (before[key] || 0)])
  );
}

function researchRefreshConfig(reqUrl) {
  const requestedMode = reqUrl.searchParams.get("mode");
  const mode = requestedMode === "backfill" ? "backfill" : requestedMode === "deep" ? "deep" : "incremental";
  const isDeep = mode === "deep";
  const isBackfill = mode === "backfill";
  const forceStalled = reqUrl.searchParams.get("forceStalled") === "1";
  const archive = currentArchiveState();
  let timelinePages = numberParam(reqUrl, "timelinePages", isBackfill ? 24 : isDeep ? 12 : 4, 0, isBackfill ? 80 : 30);
  let withRepliesPages = numberParam(reqUrl, "withRepliesPages", isBackfill ? 24 : isDeep ? 12 : 2, 0, isBackfill ? 80 : 30);
  let withRepliesRtsPages = numberParam(reqUrl, "withRepliesRtsPages", isBackfill ? 8 : isDeep ? 4 : 1, 0, isBackfill ? 30 : 12);
  let authorPages = numberParam(reqUrl, "authorPages", isBackfill ? 0 : isDeep ? 12 : 1, 0, 30);
  let authorDateSliceMonths = numberParam(reqUrl, "authorDateSliceMonths", isBackfill ? 0 : isDeep ? 4 : 0, 0, 24);
  let authorDateSlicePages = numberParam(reqUrl, "authorDateSlicePages", isBackfill ? 0 : isDeep ? 20 : 0, 0, 80);
  let authorMicroSliceDays = numberParam(reqUrl, "authorMicroSliceDays", isDeep ? 7 : 0, 0, 31);
  let authorMicroSlicePages = numberParam(reqUrl, "authorMicroSlicePages", isDeep ? 8 : 0, 0, 40);
  let authorMicroSliceLimit = numberParam(reqUrl, "authorMicroSliceLimit", isDeep ? 24 : 0, 0, 80);
  let replyPages = numberParam(reqUrl, "replyPages", isBackfill ? 0 : isDeep ? 10 : 4, 0, 30);
  const conversationLimit = numberParam(reqUrl, "conversationLimit", isBackfill ? 12 : isDeep ? 10 : 3, 0, 30);
  const dynamicOnly = mode !== "deep" || reqUrl.searchParams.get("dynamicOnly") === "1";
  const skipOembed = mode !== "deep" || reqUrl.searchParams.get("skipOembed") === "1";

  if (!forceStalled) {
    if (mode === "incremental") {
      timelinePages = Math.min(1, timelinePages);
      withRepliesPages = Math.min(1, withRepliesPages);
      withRepliesRtsPages = Math.min(1, withRepliesRtsPages);
      authorPages = 0;
      authorDateSliceMonths = 0;
      authorDateSlicePages = 0;
      authorMicroSliceDays = 0;
      authorMicroSlicePages = 0;
      authorMicroSliceLimit = 0;
      replyPages = 0;
    }
    timelinePages = latestOnlyWhenStalled(timelinePages, archive.timelineStalledRuns);
    withRepliesPages = latestOnlyWhenStalled(withRepliesPages, archive.withRepliesStalledRuns);
    withRepliesRtsPages = latestOnlyWhenStalled(withRepliesRtsPages, archive.withRepliesRtsStalledRuns);
    if (archive.authorExhausted) authorPages = 0;
    if (stalledRoute(archive.authorDateSliceStalled)) {
      authorDateSliceMonths = 0;
      authorDateSlicePages = 0;
      if (mode !== "deep") {
        authorMicroSliceDays = 0;
        authorMicroSlicePages = 0;
        authorMicroSliceLimit = 0;
      }
    }
    if (archive.replyExhausted) replyPages = 0;
  }

  const env = {
    ...process.env,
    SERENITY_OEMBED_TIMEOUT_MS: process.env.SERENITY_OEMBED_TIMEOUT_MS || "6",
    SERENITY_OEMBED_CONCURRENCY: process.env.SERENITY_OEMBED_CONCURRENCY || "4",
    SERENITY_FAST_REFRESH: "1",
    SERENITY_FXTWITTER_TIMEOUT_MS: process.env.SERENITY_FXTWITTER_TIMEOUT_MS || "12",
    SERENITY_FXTWITTER_TIMELINE_PAGES: String(timelinePages),
    SERENITY_FXTWITTER_WITH_REPLIES_PAGES: String(withRepliesPages),
    SERENITY_FXTWITTER_WITH_REPLIES_RTS_PAGES: String(withRepliesRtsPages),
    SERENITY_FXTWITTER_AUTHOR_SEARCH_PAGES: String(authorPages),
    SERENITY_FXTWITTER_AUTHOR_DATE_SLICE_MONTHS: String(authorDateSliceMonths),
    SERENITY_FXTWITTER_AUTHOR_DATE_SLICE_PAGES: String(authorDateSlicePages),
    SERENITY_FXTWITTER_AUTHOR_MICRO_SLICE_DAYS: String(authorMicroSliceDays),
    SERENITY_FXTWITTER_AUTHOR_MICRO_SLICE_PAGES: String(authorMicroSlicePages),
    SERENITY_FXTWITTER_AUTHOR_MICRO_SLICE_LIMIT: String(authorMicroSliceLimit),
    SERENITY_FXTWITTER_REPLY_SEARCH_PAGES: String(replyPages),
    SERENITY_FXTWITTER_CONVERSATION_LIMIT: String(conversationLimit),
  };

  delete env.SERENITY_SKIP_FXTWITTER;
  if (skipOembed) {
    env.SERENITY_SKIP_OEMBED = "1";
  } else {
    delete env.SERENITY_SKIP_OEMBED;
  }
  if (dynamicOnly) {
    env.SERENITY_DYNAMIC_ONLY = "1";
  } else {
    delete env.SERENITY_DYNAMIC_ONLY;
  }

  return {
    mode,
    timelinePages,
    withRepliesPages,
    withRepliesRtsPages,
    authorPages,
    authorDateSliceMonths,
    authorDateSlicePages,
    authorMicroSliceDays,
    authorMicroSlicePages,
    authorMicroSliceLimit,
    replyPages,
    conversationLimit,
    dynamicOnly,
    skipOembed,
    forceStalled,
    skippedStalledRoutes: skippedStalledRoutes(archive, forceStalled, authorMicroSliceDays),
    env,
    timeout: isBackfill ? BACKFILL_REFRESH_TIMEOUT_MS : isDeep ? RESEARCH_REFRESH_TIMEOUT_MS : Math.min(RESEARCH_REFRESH_TIMEOUT_MS, 180_000),
  };
}

function refreshConfigSummary(config = {}) {
  return {
    timelinePages: config.timelinePages,
    withRepliesPages: config.withRepliesPages,
    withRepliesRtsPages: config.withRepliesRtsPages,
    authorPages: config.authorPages,
    authorDateSliceMonths: config.authorDateSliceMonths,
    authorDateSlicePages: config.authorDateSlicePages,
    authorMicroSliceDays: config.authorMicroSliceDays,
    authorMicroSlicePages: config.authorMicroSlicePages,
    authorMicroSliceLimit: config.authorMicroSliceLimit,
    replyPages: config.replyPages,
    conversationLimit: config.conversationLimit,
    dynamicOnly: config.dynamicOnly,
    skipOembed: config.skipOembed,
    forceStalled: config.forceStalled,
    skippedStalledRoutes: config.skippedStalledRoutes || [],
  };
}

async function runResearchScrape(config, beforeMetrics = {}) {
  const { stdout } = await execFileAsync(process.execPath, [path.join(ROOT, "scripts/scrape-serenity.js")], {
    cwd: ROOT,
    timeout: config.timeout,
    maxBuffer: 4 * 1024 * 1024,
    killSignal: "SIGKILL",
    env: config.env,
  });
  const scrapeSummary = stdout ? JSON.parse(stdout) : {};
  const snapshot = researchSnapshot({
    status: "refreshed",
    mode: config.mode,
    refreshConfig: refreshConfigSummary(config),
    scrapeSummary,
  });
  const after = snapshotMetrics(snapshot);
  return { ...snapshot, metrics: after, delta: metricDelta(beforeMetrics, after), scrapeSummary };
}

function fxRoundSourceSummary(result = {}) {
  return (result.tweets?.sources || [])
    .filter((source) => ["fxtwitter-timeline", "fxtwitter-with-replies", "fxtwitter-with-replies-rts"].includes(source.source))
    .map((source) => ({
      source: source.source,
      pages: source.fxTwitterTimelinePages ?? source.fxTwitterWithRepliesPages ?? source.fxTwitterWithRepliesRtsPages ?? 0,
      fetched: source.fxTwitterTimelineFetched ?? source.fxTwitterWithRepliesFetched ?? source.fxTwitterWithRepliesRtsFetched ?? 0,
      archived: source.fxTwitterTimelineArchived ?? source.fxTwitterWithRepliesArchived ?? source.fxTwitterWithRepliesRtsArchived ?? 0,
      comments: source.fxTwitterWithRepliesRtsArchivedComments ?? 0,
      addedComments: source.fxTwitterWithRepliesRtsAddedComments ?? 0,
      cursor:
        source.fxTwitterTimelineNextCursor ||
        source.fxTwitterWithRepliesNextCursor ||
        source.fxTwitterWithRepliesRtsNextCursor ||
        "",
      errors: source.fxTwitterTimelineErrorCount ?? source.fxTwitterWithRepliesErrorCount ?? source.fxTwitterWithRepliesRtsErrorCount ?? 0,
    }));
}

function madeMaterialProgress(delta = {}) {
  return Boolean(delta.parsedItems || delta.commentCount || delta.highSignalComments || delta.timelineItems || delta.replyComments);
}

async function handleRefreshResearch(reqUrl, res) {
  const config = researchRefreshConfig(reqUrl);
  const before = snapshotMetrics(researchSnapshot());
  try {
    const result = await runResearchScrape(config, before);
    send(res, 200, JSON.stringify(result));
  } catch (error) {
    const snapshot = researchSnapshot({
      status: "stale",
      mode: config.mode,
      message: "刷新源响应过慢，已保留当前可用蒸馏数据。",
      refreshError: error.message,
      refreshConfig: refreshConfigSummary(config),
    });
    send(
      res,
      200,
      JSON.stringify({ ...snapshot, metrics: snapshotMetrics(snapshot), delta: metricDelta(before, snapshotMetrics(snapshot)) })
    );
  }
}

async function handleAutoBackfill(reqUrl, res) {
  const rounds = numberParam(reqUrl, "rounds", 3, 1, 5);
  const pages = numberParam(reqUrl, "pages", 80, 1, 80);
  const stopAfterFlat = numberParam(reqUrl, "stopAfterFlat", 2, 1, 3);
  const conversationLimit = numberParam(reqUrl, "conversationLimit", 0, 0, 12);
  const before = snapshotMetrics(researchSnapshot());
  let previousMetrics = before;
  let flatRounds = 0;
  let stopReason = "达到轮次上限";
  let lastResult = researchSnapshot({ status: "refreshed", mode: "auto-backfill" });
  const reports = [];

  try {
    for (let round = 1; round <= rounds; round += 1) {
      const roundUrl = new URL(reqUrl.toString());
      roundUrl.searchParams.set("mode", "backfill");
      roundUrl.searchParams.set("dynamicOnly", "1");
      roundUrl.searchParams.set("skipOembed", "1");
      roundUrl.searchParams.set("timelinePages", String(pages));
      roundUrl.searchParams.set("withRepliesPages", String(pages));
      roundUrl.searchParams.set("withRepliesRtsPages", String(Math.min(12, pages)));
      roundUrl.searchParams.set("authorPages", "0");
      roundUrl.searchParams.set("authorDateSliceMonths", "0");
      roundUrl.searchParams.set("authorDateSlicePages", "0");
      roundUrl.searchParams.set("replyPages", "0");
      roundUrl.searchParams.set("conversationLimit", String(conversationLimit));
      const config = { ...researchRefreshConfig(roundUrl), timeout: AUTO_BACKFILL_TIMEOUT_MS };
      const startedAt = Date.now();
      const result = await runResearchScrape(config, previousMetrics);
      const progressed = madeMaterialProgress(result.delta);
      flatRounds = progressed ? 0 : flatRounds + 1;
      lastResult = result;
      previousMetrics = result.metrics;
      reports.push({
        round,
        seconds: Math.round((Date.now() - startedAt) / 1000),
        delta: result.delta,
        metrics: result.metrics,
        progressed,
        flatRounds,
        sources: fxRoundSourceSummary(result),
      });

      if (flatRounds >= stopAfterFlat) {
        stopReason = `连续 ${flatRounds} 轮无新增，已暂停`;
        break;
      }
    }

    const after = snapshotMetrics(researchSnapshot());
    send(
      res,
      200,
      JSON.stringify({
        ...lastResult,
        status: "refreshed",
        mode: "auto-backfill",
        refreshConfig: {
          rounds,
          pages,
          stopAfterFlat,
          conversationLimit,
          dynamicOnly: true,
          skipOembed: true,
        },
        metrics: after,
        delta: metricDelta(before, after),
        autoBackfill: {
          roundsRun: reports.length,
          stopReason,
          reports,
        },
      })
    );
  } catch (error) {
    const snapshot = researchSnapshot({
      status: "stale",
      mode: "auto-backfill",
      message: "自动补档源响应过慢，已保留当前可用蒸馏数据。",
      refreshError: error.message,
    });
    send(
      res,
      200,
      JSON.stringify({ ...snapshot, metrics: snapshotMetrics(snapshot), delta: metricDelta(before, snapshotMetrics(snapshot)) })
    );
  }
}

function serveStatic(reqUrl, res) {
  const pathname = decodeURIComponent(reqUrl.pathname === "/" ? "/index.html" : reqUrl.pathname);
  const resolved = path.normalize(path.join(ROOT, pathname));

  if (!resolved.startsWith(ROOT)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  fs.readFile(resolved, (error, content) => {
    if (error) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }

    const type = MIME[path.extname(resolved)] || "application/octet-stream";
    send(res, 200, content, type);
  });
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (reqUrl.pathname === "/api/candles") {
      await handleCandles(reqUrl, res);
      return;
    }

    if (reqUrl.pathname === "/api/quotes") {
      await handleQuotes(reqUrl, res);
      return;
    }

    if (reqUrl.pathname === "/api/serenity-live") {
      await handleSerenityLive(reqUrl, res);
      return;
    }

    if (reqUrl.pathname === "/api/performance") {
      await handlePerformance(reqUrl, res);
      return;
    }

    if (reqUrl.pathname === "/api/refresh-research") {
      await handleRefreshResearch(reqUrl, res);
      return;
    }

    if (reqUrl.pathname === "/api/auto-backfill") {
      await handleAutoBackfill(reqUrl, res);
      return;
    }

    if (reqUrl.pathname === "/api/archive-audit") {
      await handleArchiveAudit(reqUrl, res);
      return;
    }

    if (reqUrl.pathname === "/api/import-research") {
      await handleImportResearch(req, res);
      return;
    }

    if (reqUrl.pathname === "/api/backfill-comments") {
      await handleBackfillComments(req, reqUrl, res);
      return;
    }

    serveStatic(reqUrl, res);
  } catch (error) {
    send(res, 502, JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Serenity Alpha running at http://localhost:${PORT}`);
});
