const BINANCE_BSTOCKS = [
  { symbol: "NVDAB", pair: "NVDABUSDT", displayPair: "NVDAB/USDT", equity: "NVDA", name: "NVIDIA bStock", themeLabel: "AI GPU" },
  { symbol: "TSLAB", pair: "TSLABUSDT", displayPair: "TSLAB/USDT", equity: "TSLA", name: "Tesla bStock", themeLabel: "EV / Robotics" },
  { symbol: "CRCLB", pair: "CRCLBUSDT", displayPair: "CRCLB/USDT", equity: "CRCL", name: "Circle bStock", themeLabel: "Stablecoin infra" },
  { symbol: "MUB", pair: "MUBUSDT", displayPair: "MUB/USDT", equity: "MU", name: "Micron bStock", themeLabel: "HBM / memory" },
  { symbol: "SNDKB", pair: "SNDKBUSDT", displayPair: "SNDKB/USDT", equity: "SNDK", name: "SanDisk bStock", themeLabel: "Storage" },
];
const BINANCE_API_BASES = [
  "https://api2.binance.com",
  "https://api.binance.com",
  "https://api1.binance.com",
  "https://api3.binance.com",
  "https://api4.binance.com",
  "https://data-api.binance.vision",
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=20, s-maxage=30, stale-while-revalidate=120",
    },
  });
}

function numberOrNull(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeTickers(tickers = []) {
  const byPair = new Map((Array.isArray(tickers) ? tickers : []).map((item) => [String(item.symbol || "").toUpperCase(), item]));
  return BINANCE_BSTOCKS.map((meta) => {
    const ticker = byPair.get(meta.pair) || {};
    return {
      ...meta,
      price: numberOrNull(ticker.lastPrice),
      change: numberOrNull(ticker.priceChange),
      changePercent: numberOrNull(ticker.priceChangePercent),
      volume: numberOrNull(ticker.volume),
      quoteVolume: numberOrNull(ticker.quoteVolume),
      highPrice: numberOrNull(ticker.highPrice),
      lowPrice: numberOrNull(ticker.lowPrice),
      openPrice: numberOrNull(ticker.openPrice),
      trades: numberOrNull(ticker.count),
      updatedAt: numberOrNull(ticker.closeTime),
    };
  });
}

async function fetchBinanceTickers() {
  const symbols = JSON.stringify(BINANCE_BSTOCKS.map((item) => item.pair));
  let lastError;
  for (const baseUrl of BINANCE_API_BASES) {
    try {
      const response = await fetch(`${baseUrl}/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`, {
        headers: {
          "user-agent": "Mozilla/5.0",
          accept: "application/json,text/plain,*/*",
        },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Binance ticker unavailable");
}

export default async () => {
  try {
    const tickers = await fetchBinanceTickers();
    return json({
      provider: "Binance Spot 24hr ticker",
      updatedAt: Date.now(),
      items: normalizeTickers(tickers),
    });
  } catch (error) {
    return json({
      provider: "Binance Spot 24hr ticker",
      updatedAt: Date.now(),
      error: error.message,
      items: normalizeTickers([]),
    });
  }
};

export const config = {
  path: "/api/binance-bstocks",
  method: ["GET"],
};
