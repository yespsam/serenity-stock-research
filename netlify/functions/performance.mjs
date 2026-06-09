const MARKET_SYMBOL_ALIASES = {
  SIVE: "SIVEF",
  "SIVE.ST": "SIVEF",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
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

function parseRecords(value = "") {
  try {
    const records = JSON.parse(value || "[]");
    return Array.isArray(records)
      ? records
          .map((item) => ({
            id: String(item.id || `${item.symbol}:${item.date}`),
            symbol: normalizeSymbol(item.symbol),
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

function pct(price, entry) {
  if (!Number.isFinite(price) || !Number.isFinite(entry) || entry <= 0) return null;
  return ((price - entry) / entry) * 100;
}

async function candlesFor(symbol, startMs) {
  const marketSymbol = resolveMarketSymbol(symbol);
  const period1 = Math.floor((startMs - 3 * 86_400_000) / 1000);
  const period2 = Math.floor((Date.now() + 2 * 86_400_000) / 1000);
  const safe = encodeURIComponent(marketSymbol);
  const raw = await fetchJson(`https://query1.finance.yahoo.com/v8/finance/chart/${safe}?period1=${period1}&period2=${period2}&interval=1d&events=history`);
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

async function performanceFor(record) {
  const startMs = Date.parse(record.date);
  const { marketSymbol, candles } = await candlesFor(record.symbol, startMs);
  const entry = nearestClose(candles, startMs);
  if (!entry) throw new Error("entry price unavailable");
  const horizons = [7, 30, 90].map((days) => {
    const bar = nearestClose(candles, startMs + days * 86_400_000);
    return {
      days,
      price: bar?.close ?? null,
      returnPercent: bar ? pct(bar.close, entry.close) : null,
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
    currentReturnPercent: latest ? pct(latest.close, entry.close) : null,
    maxDrawdownPercent: Number.isFinite(minClose) ? pct(minClose, entry.close) : null,
    horizons,
  };
}

export default async (req) => {
  const url = new URL(req.url);
  const records = parseRecords(url.searchParams.get("records") || "[]");
  const results = await Promise.all(
    records.map(async (record) => {
      try {
        return await performanceFor(record);
      } catch (error) {
        return { ...record, error: error.message };
      }
    })
  );
  return json({ provider: "Yahoo Finance historical chart", updatedAt: Date.now(), results });
};

export const config = {
  path: "/api/performance",
  method: ["GET"],
};
