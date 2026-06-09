const TICKER_STOPLIST = new Set(["L1", "L2", "L3", "L4", "L5", "L6", "L9", "TICKER"]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=15, s-maxage=30, stale-while-revalidate=120",
    },
  });
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function extractSymbols(text = "") {
  return unique(
    [...String(text || "").matchAll(/\$+\s*([A-Z][A-Z0-9.]{1,8})/g)]
      .map((match) => match[1].replace(/\.+$/, "").toUpperCase())
      .filter((symbol) => !TICKER_STOPLIST.has(symbol))
  );
}

function inferSentiment(text = "") {
  const lower = String(text || "").toLowerCase();
  if (/bear|short|avoid|sell|dilution|atm|debt|risk|稀释|融资|债务|风险|做空/.test(lower)) return "bear";
  if (/long|bull|buy|accumulate|winner|upside|conviction|undervalued|看多|买入|加仓|低估/.test(lower)) return "bull";
  return "neutral";
}

function classifyTheme(text = "") {
  const lower = String(text || "").toLowerCase();
  if (/atm|dilution|debt|convertible|稀释|融资|债务|资本结构/.test(lower)) return "capital-structure-veto";
  if (/cpo|silicon photonics|photonics|laser|optical|transceiver|光子|硅光|激光|光模块/.test(lower)) return "cpo-silicon-photonics";
  if (/neocloud|gpu cloud|datacenter|power|算力|数据中心|电力/.test(lower)) return "neocloud";
  if (/hbm|memory|dram|nand|记忆体|存储/.test(lower)) return "memory-rotation";
  if (/hyperscaler|asic|gpu|ai capex|networking|ai infra|ai 基建/.test(lower)) return "ai-infrastructure";
  return "general";
}

function normalizeStatus(status = {}) {
  const text = status.text || status.raw_text?.text || "";
  const symbols = unique([
    ...((status.raw_text?.facets || []).filter((facet) => facet.type === "symbol").map((facet) => facet.original || "").map((item) => item.replace(/^\$/, ""))),
    ...extractSymbols(text),
  ]).map((symbol) => symbol.toUpperCase());
  return {
    id: String(status.id || ""),
    date: status.created_at ? new Date(status.created_at).toISOString() : "",
    title: text.replace(/\s+/g, " ").trim().slice(0, 180),
    body: text,
    symbols,
    sentiment: inferSentiment(text),
    theme: classifyTheme(text),
    url: status.url || (status.id ? `https://x.com/aleabitoreddit/status/${status.id}` : ""),
    engagement: {
      likes: Number(status.likes) || 0,
      retweets: Number(status.retweets ?? status.reposts) || 0,
      replies: Number(status.replies) || 0,
      views: Number(status.views) || 0,
    },
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

export default async () => {
  try {
    const raw = await fetchJson("https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses");
    const results = (raw.results || [])
      .filter((item) => item.type === "status")
      .map(normalizeStatus)
      .filter((item) => item.id && item.body)
      .slice(0, 8);
    return json({
      provider: "FxTwitter public profile statuses",
      capturedAt: Date.now(),
      profile: results[0]?.id ? raw.results?.[0]?.author || null : null,
      items: results,
    });
  } catch (error) {
    return json({ provider: "FxTwitter public profile statuses", capturedAt: Date.now(), error: error.message, items: [] }, 200);
  }
};

export const config = {
  path: "/api/serenity-live",
  method: ["GET"],
};
