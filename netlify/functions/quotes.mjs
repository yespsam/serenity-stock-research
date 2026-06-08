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

async function getYahooSearch(symbol) {
  const safe = encodeURIComponent(symbol);
  const raw = await fetchJson(`https://query1.finance.yahoo.com/v1/finance/search?q=${safe}&quotesCount=8&newsCount=6`);
  const quotes = (raw.quotes || []).filter((quote) => quote.quoteType === "EQUITY");
  const best =
    quotes.find((quote) => normalizeSymbol(quote.symbol) === normalizeSymbol(symbol)) ||
    quotes.find((quote) => normalizeSymbol(quote.symbol).startsWith(normalizeSymbol(symbol))) ||
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

async function getNasdaqInfo(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) return {};
  const safe = encodeURIComponent(symbol);
  const raw = await fetchJson(`https://api.nasdaq.com/api/quote/${safe}/info?assetclass=stocks`);
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
  const rows = table.rows || [];
  const row = rows.find((item) => matcher.test(item.value1 || ""));
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
  const safe = encodeURIComponent(symbol);
  const raw = await fetchJson(`https://api.nasdaq.com/api/company/${safe}/financials?frequency=1`);
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
    grossMargin:
      revenue?.value && Number.isFinite(grossProfit?.value) ? (grossProfit.value / revenue.value) * 100 : null,
    operatingMargin:
      revenue?.value && Number.isFinite(operatingIncome?.value) ? (operatingIncome.value / revenue.value) * 100 : null,
    netMargin:
      revenue?.value && Number.isFinite(netIncome?.value) ? (netIncome.value / revenue.value) * 100 : null,
  };
}

async function getNasdaqShortInterest(symbol) {
  if (!/^[A-Z]+$/i.test(symbol)) return {};
  const safe = encodeURIComponent(symbol);
  const raw = await fetchJson(`https://api.nasdaq.com/api/quote/${safe}/short-interest?assetclass=stocks`);
  const latest = raw?.data?.shortInterestTable?.rows?.[0] || {};
  return {
    settlementDate: latest.settlementDate || "",
    interest: parseMarketNumber(latest.interest),
    avgDailyShareVolume: parseMarketNumber(latest.avgDailyShareVolume),
    daysToCover: Number(latest.daysToCover) || null,
  };
}

async function quoteForSymbol(requestedSymbol, detailed = false) {
  const marketSymbol = resolveMarketSymbol(requestedSymbol);
  const quote = await getYahooQuote(marketSymbol);
  let summary = {};
  try {
    summary = await getNasdaqSummary(marketSymbol);
  } catch {
    summary = {};
  }
  let details = {};
  if (detailed) {
    const [search, info, financials, shortInterest] = await Promise.all([
      getYahooSearch(marketSymbol).catch(() => ({})),
      getNasdaqInfo(marketSymbol).catch(() => ({})),
      getNasdaqFinancials(marketSymbol).catch(() => ({})),
      getNasdaqShortInterest(marketSymbol).catch(() => ({})),
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
    ...quote,
    ...summary,
    ...details,
    requestedSymbol,
  };
}

export default async (req) => {
  const url = new URL(req.url);
  const detailed = url.searchParams.get("detail") === "1";
  const symbols = (url.searchParams.get("symbols") || "NVDA,AAOI,AXTI,SIVEF,MRVL")
    .split(",")
    .map(normalizeSymbol)
    .filter(Boolean)
    .slice(0, 36);

  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        return await quoteForSymbol(symbol, detailed);
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
