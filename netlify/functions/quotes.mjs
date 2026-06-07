const MARKET_SYMBOL_ALIASES = {
  SIVE: "SIVEF",
  "SIVE.ST": "SIVEF",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=30",
    },
  });
}

function normalizeSymbol(symbol = "") {
  return String(symbol || "").trim().replace(/^\$+/, "").toUpperCase();
}

function resolveMarketSymbol(symbol = "") {
  const normalized = normalizeSymbol(symbol);
  return MARKET_SYMBOL_ALIASES[normalized] || normalized;
}

function parseMarketNumber(value) {
  if (typeof value === "number") return value;
  if (!value) return null;
  const parsed = Number(String(value).replace(/[$,%+,]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNasdaqRange(value = "") {
  const matches = String(value || "").match(/[\d,.]+/g) || [];
  const numbers = matches.map(parseMarketNumber).filter(Number.isFinite);
  if (numbers.length < 2) return {};
  return {
    fiftyTwoWeekHigh: Math.max(numbers[0], numbers[1]),
    fiftyTwoWeekLow: Math.min(numbers[0], numbers[1]),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "application/json,text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function getYahooQuote(symbol) {
  const safe = encodeURIComponent(symbol);
  const attempts = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${safe}?range=1d&interval=5m&includePrePost=false&events=div%2Csplits`,
    `https://query1.finance.yahoo.com/v8/finance/chart/${safe}?range=5d&interval=1d&includePrePost=false&events=div%2Csplits`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${safe}?range=1mo&interval=1d&includePrePost=false&events=div%2Csplits`,
  ];
  let lastError;
  for (const url of attempts) {
    try {
      const raw = await fetchJson(url);
      const result = raw?.chart?.result?.[0];
      const meta = result?.meta || {};
      const quote = result?.indicators?.quote?.[0] || {};
      const close = (quote.close || []).filter(Number.isFinite).at(-1);
      const price = Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : close;
      const previousClose = Number.isFinite(meta.chartPreviousClose) ? meta.chartPreviousClose : meta.previousClose;
      if (!Number.isFinite(price)) throw new Error("No price");
      return {
        symbol: meta.symbol || symbol,
        currency: meta.currency || "USD",
        price,
        previousClose,
        change: Number.isFinite(previousClose) ? price - previousClose : null,
        changePercent: Number.isFinite(previousClose) && previousClose ? ((price - previousClose) / previousClose) * 100 : null,
        updatedAt: meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
        provider: "Yahoo Finance OHLC",
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Yahoo quote unavailable");
}

async function getNasdaqSummary(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) return {};
  const safe = encodeURIComponent(symbol);
  const raw = await fetchJson(`https://api.nasdaq.com/api/quote/${safe}/summary?assetclass=stocks`);
  const summary = raw?.data?.summaryData || {};
  return {
    marketCap: parseMarketNumber(summary.MarketCap?.value),
    oneYearTarget: parseMarketNumber(summary.OneYrTarget?.value),
    averageVolume: parseMarketNumber(summary.AverageVolume?.value),
    shareVolume: parseMarketNumber(summary.ShareVolume?.value),
    sector: summary.Sector?.value || "",
    industry: summary.Industry?.value || "",
    exchange: summary.Exchange?.value || "",
    ...parseNasdaqRange(summary.FiftTwoWeekHighLow?.value),
  };
}

async function quoteForSymbol(requestedSymbol) {
  const marketSymbol = resolveMarketSymbol(requestedSymbol);
  const quote = await getYahooQuote(marketSymbol);
  let summary = {};
  try {
    summary = await getNasdaqSummary(marketSymbol);
  } catch {
    summary = {};
  }
  return {
    ...quote,
    ...summary,
    requestedSymbol,
  };
}

export default async (req) => {
  const url = new URL(req.url);
  const symbols = (url.searchParams.get("symbols") || "NVDA,AAOI,AXTI,SIVEF,MRVL")
    .split(",")
    .map(normalizeSymbol)
    .filter(Boolean)
    .slice(0, 36);

  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        return await quoteForSymbol(symbol);
      } catch (error) {
        return { requestedSymbol: symbol, error: error.message };
      }
    })
  );

  return json({ provider: "Yahoo Finance / Nasdaq", updatedAt: Date.now(), quotes });
};

export const config = {
  path: "/api/quotes",
  method: ["GET"],
};
