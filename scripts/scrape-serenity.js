const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const FXTWITTER_ARCHIVE_FILE = path.join(DATA_DIR, "serenity-fxtwitter-archive.json");
const DEFAULT_SOURCES = [
  "https://www.eystockholdings.com/serenity",
  "https://instalker.org/aleabitoreddit",
  "https://r.jina.ai/http://r.jina.ai/http://https://instalker.org/aleabitoreddit",
  "https://serenity-sensei.com/",
  "https://serenity-skill.vercel.app/",
  "https://raw.githubusercontent.com/0xagata-prog/serenity-skill/HEAD/SKILL.md",
  "https://serenitysaid.com/",
  "https://semiconstocks.com/",
  "https://semiconstocks.com/zh.html",
  "https://supercycle.fi/",
  "https://supercycle.fi/c/aleabitoreddit",
  "https://youmind.com/zh-CN/landing/x-viral-articles/sivers-photonics-cpo-laser-chokepoint",
  "https://investcopilot.cloud/feed/?days=9999&twitter_author=aleabitoreddit",
  "https://www.buysidedigest.com/search/aleabitoreddit/feed/rss2/",
  "https://www.buysidedigest.com/search/aleabitoreddit/",
  "https://www.kucoin.com/news/insight/BTC/6a1d6b597e8a3c0007e840fc",
  "https://r.jina.ai/http://r.jina.ai/http://https://twiscan.com/en/x/aleabitoreddit",
  "https://supercycle.fi/assets/SIVE.ST",
  "https://supercycle.fi/assets/AAOI",
  "https://supercycle.fi/assets/LITE",
  "https://supercycle.fi/assets/MRVL",
  "https://supercycle.fi/assets/COHR",
  "https://supercycle.fi/assets/AEHR",
  "https://supercycle.fi/assets/NBIS",
  "https://supercycle.fi/assets/AXTI",
  "https://supercycle.fi/assets/LASR",
  "https://x.com/aleabitoreddit/status/2037352339154280568",
  "https://x.com/aleabitoreddit/status/2041157377928700262",
  "https://x.com/aleabitoreddit/status/1998925429890261130",
];
const SOURCE_URLS = process.argv.slice(2).filter(Boolean).length ? process.argv.slice(2).filter(Boolean) : DEFAULT_SOURCES;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const FETCH_TIMEOUT_MS = Number(process.env.SERENITY_FETCH_TIMEOUT_MS || 20);
const KUCOIN_TIMEOUT_MS = Number(process.env.SERENITY_KUCOIN_TIMEOUT_MS || 45);
const OEMBED_TIMEOUT_MS = Number(process.env.SERENITY_OEMBED_TIMEOUT_MS || 8);
const OEMBED_CONCURRENCY = Number(process.env.SERENITY_OEMBED_CONCURRENCY || 6);
const SUPERCYCLE_CALLER_HANDLE = "aleabitoreddit";
const SUPERCYCLE_CALLER_LIMIT = Number(process.env.SERENITY_CALLER_LIMIT || 100);
const SUPERCYCLE_CALLER_ASSET_LIMIT = Number(process.env.SERENITY_CALLER_ASSET_LIMIT || 40);
const SUPERCYCLE_CALLER_PAGE_LIMIT = Number(process.env.SERENITY_CALLER_PAGE_LIMIT || 20);
const SUPERCYCLE_CALLER_ASSET_SOURCE = process.env.SERENITY_CALLER_ASSET_SOURCE || "all";
const SUPERCYCLE_CALLER_TIMEOUT_MS = Number(process.env.SERENITY_CALLER_TIMEOUT_MS || 45);
const INVESTCOPILOT_ARTICLE_CONCURRENCY = Number(process.env.SERENITY_INVESTCOPILOT_CONCURRENCY || 6);
const INVESTCOPILOT_TIMEOUT_MS = Number(process.env.SERENITY_INVESTCOPILOT_TIMEOUT_MS || 20);
const INSTALKER_LOAD_MORE_PAGES = Number(process.env.SERENITY_INSTALKER_LOAD_MORE_PAGES || 12);
const INSTALKER_TIMEOUT_MS = Number(process.env.SERENITY_INSTALKER_TIMEOUT_MS || 20);
const FXTWITTER_TIMEOUT_MS = Number(process.env.SERENITY_FXTWITTER_TIMEOUT_MS || 10);
const FXTWITTER_PAGE_RETRIES = Number(process.env.SERENITY_FXTWITTER_PAGE_RETRIES || 3);
const FXTWITTER_CONCURRENCY = Number(process.env.SERENITY_FXTWITTER_CONCURRENCY || 8);
const FXTWITTER_STATUS_LIMIT = Number(process.env.SERENITY_FXTWITTER_STATUS_LIMIT || 500);
const FXTWITTER_TIMELINE_PAGES = Number(process.env.SERENITY_FXTWITTER_TIMELINE_PAGES || 8);
const FXTWITTER_WITH_REPLIES_PAGES = Number(process.env.SERENITY_FXTWITTER_WITH_REPLIES_PAGES || 4);
const FXTWITTER_WITH_REPLIES_RTS_PAGES = Number(process.env.SERENITY_FXTWITTER_WITH_REPLIES_RTS_PAGES || 0);
const FXTWITTER_AUTHOR_SEARCH_PAGES = Number(process.env.SERENITY_FXTWITTER_AUTHOR_SEARCH_PAGES || 8);
const FXTWITTER_AUTHOR_DATE_SLICE_MONTHS = Number(process.env.SERENITY_FXTWITTER_AUTHOR_DATE_SLICE_MONTHS || 0);
const FXTWITTER_AUTHOR_DATE_SLICE_PAGES = Number(process.env.SERENITY_FXTWITTER_AUTHOR_DATE_SLICE_PAGES || 20);
const FXTWITTER_AUTHOR_MICRO_SLICE_DAYS = Number(process.env.SERENITY_FXTWITTER_AUTHOR_MICRO_SLICE_DAYS || 0);
const FXTWITTER_AUTHOR_MICRO_SLICE_PAGES = Number(process.env.SERENITY_FXTWITTER_AUTHOR_MICRO_SLICE_PAGES || FXTWITTER_AUTHOR_DATE_SLICE_PAGES);
const FXTWITTER_AUTHOR_MICRO_SLICE_LIMIT = Number(process.env.SERENITY_FXTWITTER_AUTHOR_MICRO_SLICE_LIMIT || 32);
const FXTWITTER_AUTHOR_DATE_SLICES = process.env.SERENITY_AUTHOR_DATE_SLICES || "";
const FXTWITTER_AUTHOR_TOP_DATE_SLICES = process.env.SERENITY_AUTHOR_TOP_DATE_SLICES || "";
const FXTWITTER_AUTHOR_TOP_DATE_SLICE_PAGES = Number(process.env.SERENITY_FXTWITTER_AUTHOR_TOP_DATE_SLICE_PAGES || 0);
const FXTWITTER_REPLY_SEARCH_PAGES = Number(process.env.SERENITY_FXTWITTER_REPLY_SEARCH_PAGES || 6);
const FXTWITTER_CONVERSATION_LIMIT = Number(process.env.SERENITY_FXTWITTER_CONVERSATION_LIMIT || 10);
const COMMENT_LIMIT_PER_ITEM = Number(process.env.SERENITY_COMMENT_LIMIT_PER_ITEM || 120);
const RESET_FXTWITTER_ARCHIVE = process.env.SERENITY_RESET_FXTWITTER_ARCHIVE === "1";
const PRESERVE_PREVIOUS_SOURCES = process.env.SERENITY_PRESERVE_PREVIOUS_SOURCES === "1";
const TWISCAN_LOCAL_MATCH_SCORE = Number(process.env.SERENITY_TWISCAN_LOCAL_MATCH_SCORE || 72);

const TICKER_STOPLIST = new Set([
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
  "L6",
  "L7",
  "L8",
  "L9",
  "L14",
  "TICKER",
]);
const CRYPTO_ONLY_SYMBOLS = new Set(["BTC", "ETH", "SOL", "DOGE", "XRP"]);
const TEXT_MATCH_STOPWORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "before",
  "being",
  "between",
  "company",
  "could",
  "everyone",
  "first",
  "from",
  "have",
  "just",
  "like",
  "look",
  "looks",
  "next",
  "only",
  "people",
  "really",
  "seeing",
  "single",
  "that",
  "their",
  "there",
  "thing",
  "think",
  "this",
  "today",
  "with",
]);

function decodeHtml(value = "") {
  return value
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/<!-- -->/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value = "") {
  return decodeHtml(value.replace(/<[^>]+>/g, " "));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function sourceLabel(url = "") {
  if (url.includes("eystockholdings.com")) return "eystockholdings";
  if (url.includes("instalker.org")) return "instalker";
  if (url.includes("serenity-sensei.com")) return "serenity-sensei";
  if (url.includes("serenity-skill.vercel.app") || url.includes("0xagata-prog/serenity-skill")) return "serenity-skill";
  if (url.includes("serenitysaid.com")) return "serenitysaid";
  if (url.includes("semiconstocks.com")) return "semiconstocks";
  if (url.includes("supercycle.fi")) return "supercycle";
  if (url.includes("youmind.com")) return "youmind";
  if (url.includes("investcopilot.cloud")) return "investcopilot";
  if (url.includes("buysidedigest.com")) return "buysidedigest";
  if (url.includes("kucoin.com")) return "kucoin";
  if (url.includes("twiscan.com")) return "twiscan";
  if (isDirectStatusSource(url)) return "x-status-seed";
  return new URL(url).hostname.replace(/^www\./, "");
}

function sourceList(item) {
  if (item.sourceList?.length) return unique(item.sourceList);
  if (Array.isArray(item.source)) return unique(item.source);
  return unique(String(item.source || "").split(/\s+\+\s+/));
}

function statusId(url = "") {
  return url.match(/status\/(\d+)/)?.[1] || "";
}

function canonicalStatusUrl(url = "") {
  const id = statusId(url);
  return id ? `https://x.com/aleabitoreddit/status/${id}` : url;
}

function statusUrlFromItem(item = {}) {
  const urls = unique([item.url, item.sourceUrl, ...(item.sourceUrls || [])].filter(Boolean));
  const statusUrl = urls.find((url) => /(?:x|twitter)\.com\/aleabitoreddit\/status\/\d+/i.test(url || ""));
  if (!statusUrl && /^\d{12,}$/.test(String(item.id || ""))) return `https://x.com/aleabitoreddit/status/${item.id}`;
  return statusUrl ? canonicalStatusUrl(statusUrl) : "";
}

function isDirectStatusSource(url = "") {
  return /https?:\/\/(?:www\.)?(?:x|twitter)\.com\/aleabitoreddit\/status\/\d+/i.test(url);
}

function isSupercycleCallerSource(url = "") {
  return /https?:\/\/(?:www\.)?supercycle\.fi\/c\/aleabitoreddit\/?$/i.test(url);
}

function isInvestCopilotFeedSource(url = "") {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "investcopilot.cloud" &&
      parsed.pathname.replace(/\/+$/, "") === "/feed" &&
      (parsed.searchParams.get("twitter_author") || "").toLowerCase() === "aleabitoreddit"
    );
  } catch {
    return false;
  }
}

function isInstalkerSource(url = "") {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "instalker.org" && parsed.pathname.replace(/\/+$/, "") === "/aleabitoreddit";
  } catch {
    return false;
  }
}

function isJinaInstalkerSource(url = "") {
  return /r\.jina\.ai\/http:\/\/r\.jina\.ai\/http:\/\/https:\/\/instalker\.org\/aleabitoreddit/i.test(url);
}

function isTwiscanSource(url = "") {
  return /twiscan\.com\/en\/x\/aleabitoreddit/i.test(url);
}

function isSemiconStocksSource(url = "") {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "semiconstocks.com";
  } catch {
    return false;
  }
}

function isSerenitySaidSource(url = "") {
  try {
    const parsed = new URL(url);
    return parsed.hostname === "serenitysaid.com";
  } catch {
    return false;
  }
}

function absoluteUrl(value = "", sourceUrl = "") {
  if (!value) return "";
  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return value;
  }
}

function absoluteSupercycleUrl(value = "", sourceUrl = "https://supercycle.fi/") {
  return absoluteUrl(value, sourceUrl);
}

function attr(block = "", name = "") {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return decodeHtml(block.match(new RegExp(`${escaped}="([^"]*)"`))?.[1] || "");
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseJsonAttr(block = "", name = "") {
  const raw = attr(block, name);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function stanceToSentiment(stance = "") {
  const clean = String(stance).toLowerCase();
  if (["short", "bear", "bearish"].includes(clean)) return "bear";
  if (["long", "bull", "bullish"].includes(clean)) return "bull";
  return "neutral";
}

function firstSentence(text = "", limit = 180) {
  const clean = decodeHtml(text).replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const sentence = clean.match(/^.{24,}?[.!?。！？](?:\s|$)/)?.[0] || clean;
  return sentence.length > limit ? `${sentence.slice(0, limit - 1)}…` : sentence;
}

function stableHash(value = "") {
  let hash = 0;
  for (const char of String(value)) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash.toString(36);
}

function parseWeight(value = "") {
  const parsed = Number(String(value).replace(/[%+,]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseMetricNumber(value = "") {
  const parsed = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function decodeJsonFragment(value = "") {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\u0026/g, "&");
  }
}

function extractSymbols(text = "") {
  return unique(
    [...text.matchAll(/\$+\s*([A-Z][A-Z0-9.]{1,8})/g)]
      .map((match) => match[1].replace(/\.+$/, ""))
      .filter((symbol) => !TICKER_STOPLIST.has(symbol))
  );
}

function symbolsFromTickerLabel(label = "") {
  const clean = stripTags(label).replace(/\s+/g, " ").trim();
  const direct = clean.match(/^\$([A-Z][A-Z0-9.]{1,8})/)?.[1];
  const parenthetical = clean.match(/\(([0-9A-Z]{2,8}\.[A-Z]{1,5})\)/)?.[1];
  const bareWithMarket = clean.match(/^([0-9A-Z]{2,8}\.[A-Z]{1,5})$/)?.[1];
  return unique([direct, parenthetical, bareWithMarket, ...extractSymbols(clean)].map((symbol) => symbol?.replace(/\.+$/, "")));
}

function sentimentFromBlock(block) {
  const explicit = stripTags(block.match(/<div class="tag-tight" style="color:var\(--(?:up|down|text-3)\)"[\s\S]*?<\/div>/)?.[0]);
  if (["bull", "bear", "neutral"].includes(explicit.toLowerCase())) return explicit.toLowerCase();
  const lower = stripTags(block).toLowerCase();
  if (lower.includes("bearish") || lower.includes("flipped bearish")) return "bear";
  if (lower.includes("bullish") || lower.includes("long ") || lower.includes("took a sizable position")) return "bull";
  return "neutral";
}

function classifyTheme(text = "") {
  const lower = text.toLowerCase();
  if (lower.includes("atm") || lower.includes("dilution") || lower.includes("selling $6")) return "capital-structure-veto";
  if (lower.includes("humanoid") || lower.includes("robotics") || lower.includes("physical ai") || lower.includes("绿的谐波") || lower.includes("谐波减速")) {
    return "robotics-physical-ai";
  }
  if (lower.includes("hbm") || lower.includes("memory") || lower.includes("dram") || lower.includes("nand") || lower.includes("sk hynix") || lower.includes("存储")) {
    return "memory-rotation";
  }
  if (
    lower.includes("cpo") ||
    lower.includes("co-packaged") ||
    lower.includes("silicon photonics") ||
    lower.includes("siph") ||
    lower.includes("photonics")
  )
    return "cpo-silicon-photonics";
  if (lower.includes("inp") || lower.includes("substrate") || lower.includes("photonic substrates")) return "substrate-materials";
  if (lower.includes("laser") || lower.includes("pluggables") || lower.includes("optics")) return "optical-components";
  if (
    lower.includes("hyperscaler") ||
    lower.includes("compute") ||
    lower.includes("ai infra") ||
    lower.includes("accelerator")
  )
    return "ai-infrastructure";
  if (lower.includes("neocloud") || lower.includes("gpu cloud") || lower.includes("nbis")) return "neocloud";
  if (lower.includes("housing") || lower.includes("real estate") || lower.includes("reit")) return "hard-assets";
  if (lower.includes("power") || lower.includes("vera rubin") || lower.includes("800v") || lower.includes("transformer") || lower.includes("switchgear")) {
    return "power-architecture";
  }
  if (lower.includes("macro") || lower.includes("oil") || lower.includes("lng") || lower.includes("vix") || lower.includes("宏观")) return "macro-hedge";
  if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("ethereum") || lower.includes("coinbase") || lower.includes("加密")) return "crypto-rotation";
  return "general";
}

function materialityScore(item) {
  let score = 30;
  if (item.sentiment === "bull" || item.sentiment === "bear") score += 10;
  score += Math.min(25, item.symbols.length * 5);
  if (item.body.length > 140) score += 8;
  if (item.theme !== "general") score += 10;
  if (/favorite|high conviction|sizable position|most consequential|target|PT|flipped bearish|ATM/i.test(`${item.title} ${item.body}`)) score += 16;
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

function isoDay(value) {
  const timestamp = Date.parse(value || "");
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString().slice(0, 10) : "";
}

function monthStart(value) {
  const timestamp = Date.parse(value || "");
  const date = Number.isFinite(timestamp) ? new Date(timestamp) : new Date();
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date, months) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

function addDays(date, days) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

function sliceKey(since, until) {
  return `${since}_${until}`;
}

function dayTimestamp(value = "") {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function dayRangeLength(since, until) {
  const start = dayTimestamp(since);
  const end = dayTimestamp(until);
  return start && end && end > start ? Math.round((end - start) / 86_400_000) : 0;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchUrl(url, accept = "text/html,*/*", timeoutSeconds = FETCH_TIMEOUT_MS) {
  const { stdout } = await execFileAsync(
    "curl",
    ["-L", "-sS", "--max-time", String(timeoutSeconds), "-A", UA, "-H", `Accept: ${accept}`, url],
    {
      maxBuffer: 8 * 1024 * 1024,
      timeout: Math.max(5, timeoutSeconds + 5) * 1000,
      killSignal: "SIGKILL",
    }
  );
  return stdout;
}

function sourceFetchTimeout(sourceUrl = "") {
  if (sourceUrl.includes("kucoin.com")) return KUCOIN_TIMEOUT_MS;
  if (sourceUrl.includes("twiscan.com") || sourceUrl.includes("r.jina.ai")) return Math.max(FETCH_TIMEOUT_MS, 30);
  return FETCH_TIMEOUT_MS;
}

async function fetchHtml(url, timeoutSeconds = FETCH_TIMEOUT_MS) {
  return fetchUrl(url, "text/html,*/*", timeoutSeconds);
}

async function fetchJsonUrl(url, timeoutSeconds = FETCH_TIMEOUT_MS) {
  const raw = await fetchUrl(url, "application/json,text/plain,*/*", timeoutSeconds);
  return JSON.parse(raw);
}

async function fetchFxTwitterProfile() {
  const payload = await fetchJsonUrl("https://api.fxtwitter.com/aleabitoreddit", FXTWITTER_TIMEOUT_MS);
  const user = payload.user || {};
  return {
    source: "fxtwitter",
    url: user.url || "https://x.com/aleabitoreddit",
    apiUrl: "https://api.fxtwitter.com/aleabitoreddit",
    screenName: user.screen_name || "aleabitoreddit",
    name: user.name || "Serenity",
    followers: metricNumber(user.followers),
    following: metricNumber(user.following),
    likes: metricNumber(user.likes),
    tweets: metricNumber(user.tweets),
    mediaCount: metricNumber(user.media_count),
    avatarUrl: user.avatar_url || "",
    bannerUrl: user.banner_url || "",
    joined: normalizeTwitterDate(user.joined),
    description: user.description || user.raw_description?.text || "",
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchFxTwitterStatus(id) {
  const apiUrl = `https://api.fxtwitter.com/aleabitoreddit/status/${encodeURIComponent(id)}`;
  const payload = await fetchJsonUrl(apiUrl, FXTWITTER_TIMEOUT_MS);
  const tweet = payload.tweet || {};
  if (payload.code && payload.code !== 200) throw new Error(payload.message || `FxTwitter code ${payload.code}`);
  if (!tweet.id) throw new Error("FxTwitter status missing tweet");

  const text = tweet.text || tweet.raw_text?.text || "";
  const facets = tweet.raw_text?.facets || [];
  const facetSymbols = facets
    .filter((facet) => facet.type === "symbol" && facet.original)
    .map((facet) => facet.original.toUpperCase());
  const symbols = unique([...facetSymbols, ...extractSymbols(text)]);
  const engagement = {
    likes: metricNumber(tweet.likes),
    retweets: metricNumber(tweet.retweets),
    replies: metricNumber(tweet.replies),
    views: metricNumber(tweet.views),
  };

  return {
    id: String(tweet.id || id),
    url: canonicalStatusUrl(tweet.url || `https://x.com/aleabitoreddit/status/${id}`),
    text,
    date: normalizeTwitterDate(tweet.created_at),
    symbols,
    sentiment: sentimentFromBlock(text),
    theme: classifyTheme(text),
    engagement,
    author: tweet.author
      ? {
          screenName: tweet.author.screen_name,
          followers: metricNumber(tweet.author.followers),
          avatarUrl: tweet.author.avatar_url || "",
        }
      : undefined,
    apiUrl,
  };
}

function fxCursorBottom(cursor) {
  return typeof cursor === "string" ? cursor : cursor?.bottom || cursor?.next || "";
}

function fxStatusText(status = {}) {
  return status.text || status.raw_text?.text || "";
}

function fxStatusSymbols(status = {}) {
  const text = fxStatusText(status);
  const facetSymbols = (status.raw_text?.facets || [])
    .filter((facet) => facet.type === "symbol" && facet.original)
    .map((facet) => facet.original.toUpperCase());
  return unique([...facetSymbols, ...extractSymbols(text)]);
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

function flattenFxResults(results = []) {
  return results.flatMap((entry) => {
    if (!entry) return [];
    if (entry.type === "thread") return (entry.statuses || []).filter((status) => status?.type === "status");
    return entry.type === "status" ? [entry] : [];
  });
}

function isSerenityFxStatus(status = {}) {
  return (status.author?.screen_name || status.author?.screenName || "").toLowerCase() === "aleabitoreddit";
}

function normalizeFxV2StatusItem(status, source = "fxtwitter-timeline", sourceUrl = "") {
  const text = fxStatusText(status);
  if (!status?.id || !text) return null;
  const symbols = fxStatusSymbols(status);
  const item = {
    id: String(status.id),
    date: normalizeTwitterDate(status.created_at),
    sentiment: sentimentFromBlock(text),
    title: firstSentence(text, 180),
    body: text,
    symbols,
    theme: classifyTheme(text),
    url: canonicalStatusUrl(status.url || `https://x.com/aleabitoreddit/status/${status.id}`),
    source,
    sourceUrl: sourceUrl || status.url,
    sourceUrls: unique([sourceUrl, status.url].filter(Boolean)),
    oembedNotNeeded: true,
    engagement: fxEngagement(status),
    fxTwitterV2: {
      id: String(status.id),
      author: status.author
        ? {
            screenName: status.author.screen_name,
            followers: metricNumber(status.author.followers),
            avatarUrl: status.author.avatar_url || "",
          }
        : undefined,
      fetchedAt: new Date().toISOString(),
    },
  };
  item.materiality = Math.min(100, materialityScore(item) + 8);
  return item;
}

function normalizeFxComment(status, fallbackParentId = "", source = "fxtwitter-reply-search") {
  const text = fxStatusText(status);
  if (!status?.id || !text) return null;
  const parentId = status.replying_to?.status || fallbackParentId || "";
  return {
    id: String(status.id),
    author: status.author?.screen_name || "",
    authorName: status.author?.name || status.author?.screen_name || "",
    authorUrl: status.author?.url || (status.author?.screen_name ? `https://x.com/${status.author.screen_name}` : ""),
    authorFollowers: metricNumber(status.author?.followers),
    date: normalizeTwitterDate(status.created_at),
    content: text,
    url: status.url || `https://x.com/${status.author?.screen_name || "i"}/status/${status.id}`,
    symbols: fxStatusSymbols(status),
    engagement: fxEngagement(status),
    source,
    replyingTo: parentId
      ? {
          status: parentId,
          url: status.replying_to?.url || `https://x.com/aleabitoreddit/status/${parentId}`,
          screenName: status.replying_to?.screen_name || "aleabitoreddit",
        }
      : undefined,
  };
}

function dedupeComments(comments = [], limit = COMMENT_LIMIT_PER_ITEM) {
  const seen = new Set();
  const result = [];
  for (const comment of comments.filter(Boolean)) {
    const key = comment.id || comment.url || `${comment.author}:${comment.content}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(comment);
  }
  return result
    .sort((a, b) => (metricNumber(b.engagement?.likes) || 0) - (metricNumber(a.engagement?.likes) || 0))
    .slice(0, limit);
}

function commentsToParentItems(comments = [], source = "fxtwitter-reply-thread", sourceUrl = "") {
  const grouped = new Map();
  for (const comment of comments.filter((entry) => entry?.replyingTo?.status)) {
    const id = comment.replyingTo.status;
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id).push(comment);
  }

  return [...grouped.entries()].map(([id, threadComments]) => {
    const uniqueComments = dedupeComments(threadComments);
    const text = uniqueComments.map((comment) => comment.content).join(" ");
    const item = {
      id,
      date: uniqueComments[0]?.date || "",
      sentiment: "neutral",
      title: `Serenity X 回复样本 ${id}`,
      body: `公开回复区样本：${firstSentence(text, 240)}`,
      symbols: unique(uniqueComments.flatMap((comment) => comment.symbols || [])),
      theme: classifyTheme(text),
      url: `https://x.com/aleabitoreddit/status/${id}`,
      source,
      sourceUrl,
      sourceUrls: unique([sourceUrl, `https://x.com/aleabitoreddit/status/${id}`].filter(Boolean)),
      oembedNotNeeded: true,
      comments: uniqueComments,
    };
    item.materiality = Math.min(88, materialityScore(item) + Math.min(18, uniqueComments.length));
    return item;
  });
}

function commentIdentityKey(comment = {}) {
  return String(comment.id || comment.url || [comment.author || comment.name || "", comment.date || "", comment.content || comment.text || ""].join(":")).trim();
}

function commentSignalScore(comment = {}, parent = {}) {
  const content = comment.content || comment.text || "";
  const text = `${content} ${parent.title || ""} ${parent.body || ""}`;
  const symbols = unique([...(comment.symbols || []), ...extractSymbols(text)]);
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
      const symbols = unique([...(comment.symbols || []), ...extractSymbols(`${content} ${item.title || ""}`)]);
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
      if (!existing || signal.score > existing.score || (signal.engagement?.likes || 0) > (existing.engagement?.likes || 0)) {
        signalMap.set(mapKey, signal);
      }
    }
  }

  const signals = [...signalMap.values()];
  const ranked = signals.sort((a, b) => b.score - a.score || (b.engagement?.likes || 0) - (a.engagement?.likes || 0));
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

function inferFxTwitterProfile(items = [], sourceReports = []) {
  const followers = Math.max(
    0,
    ...items.flatMap((item) => [item.fxTwitter?.author?.followers, item.fxTwitterV2?.author?.followers]).map(metricNumber)
  );
  const tweetClaim =
    sourceReports.map((report) => report.fxTwitterProfileTweetCount || report.profileTweetCount).filter(Boolean).sort((a, b) => b - a)[0] || null;
  if (!followers && !tweetClaim) return null;
  return {
    source: "inferred",
    url: "https://x.com/aleabitoreddit",
    screenName: "aleabitoreddit",
    name: "Serenity",
    followers,
    tweets: tweetClaim,
    inferred: true,
    fetchedAt: new Date().toISOString(),
  };
}

function mergeFxTwitterProfileClaim(baseProfile = null, items = [], sourceReports = []) {
  const inferred = inferFxTwitterProfile(items, sourceReports);
  const profile = {
    ...(inferred || {}),
    ...(baseProfile || {}),
  };
  const tweetClaim = Math.max(
    0,
    metricNumber(profile.tweets),
    ...sourceReports.map((report) => metricNumber(report.fxTwitterProfileTweetCount || report.profileTweetCount))
  );
  if (tweetClaim) profile.tweets = tweetClaim;
  if (!metricNumber(profile.followers) && inferred?.followers) profile.followers = inferred.followers;
  if (tweetClaim && tweetClaim > metricNumber(baseProfile?.tweets)) {
    profile.publicTweetClaimSource =
      sourceReports
        .filter((report) => metricNumber(report.fxTwitterProfileTweetCount || report.profileTweetCount) === tweetClaim)
        .map((report) => report.source)
        .filter(Boolean)[0] || "public-source";
    profile.publicTweetClaimUpdatedAt = new Date().toISOString();
  }
  return Object.keys(profile).length ? profile : null;
}

async function fetchFxV2Pages(baseUrl, pageLimit, label, startCursor = "") {
  const pages = [];
  const errors = [];
  let cursor = startCursor || "";
  let nextCursor = cursor;
  let exhausted = false;

  for (let page = 0; page < pageLimit; page += 1) {
    const url = new URL(baseUrl);
    const requestCursor = cursor;
    if (cursor) url.searchParams.set("cursor", cursor);
    let payload = null;
    let finalError = null;
    for (let attempt = 0; attempt < Math.max(1, FXTWITTER_PAGE_RETRIES); attempt += 1) {
      try {
        payload = await fetchJsonUrl(url.toString(), FXTWITTER_TIMEOUT_MS);
        if (payload.code && payload.code !== 200) throw new Error(payload.message || `${label} code ${payload.code}`);
        break;
      } catch (error) {
        finalError = error;
        if (/\b404\b|code 404/i.test(error.message)) break;
        if (attempt < Math.max(1, FXTWITTER_PAGE_RETRIES) - 1) {
          await delay(600 * (attempt + 1));
        }
      }
    }

    try {
      if (!payload) throw finalError || new Error(`${label} empty response`);
      if (payload.code && payload.code !== 200) throw new Error(payload.message || `${label} code ${payload.code}`);
      const results = payload.results || [];
      pages.push({
        url: url.toString(),
        results,
        cursor: payload.cursor,
      });
      cursor = fxCursorBottom(payload.cursor);
      nextCursor = cursor || "";
      if (!cursor) {
        exhausted = true;
        break;
      }
      if (!results.length && cursor !== requestCursor) continue;
      if (!results.length) break;
    } catch (error) {
      errors.push({ url: url.toString(), error: error.message });
      if (/\b404\b|code 404/i.test(error.message)) {
        exhausted = true;
        nextCursor = "";
      }
      break;
    }
  }

  return { pages, errors, truncated: Boolean(cursor && pages.length >= pageLimit && !exhausted), nextCursor, exhausted };
}

async function parseFxTwitterTimeline(archive = {}) {
  const sourceUrl = "https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses";
  const pageLimit = Math.max(0, FXTWITTER_TIMELINE_PAGES);
  const baseUrl = new URL(sourceUrl);
  baseUrl.searchParams.set("count", "100");
  const latestFetched = pageLimit
    ? await fetchFxV2Pages(baseUrl.toString(), 1, "fxtwitter timeline latest", "")
    : { pages: [], errors: [], truncated: false, nextCursor: "", exhausted: false };
  const remainingPages = Math.max(0, pageLimit - latestFetched.pages.length);
  const startCursor = archive.timeline?.cursor || latestFetched.nextCursor || "";
  const olderFetched = remainingPages
    ? await fetchFxV2Pages(baseUrl.toString(), remainingPages, "fxtwitter timeline archive", startCursor)
    : { pages: [], errors: [], truncated: false, nextCursor: startCursor, exhausted: false };
  const fetchedPages = [...latestFetched.pages, ...olderFetched.pages];
  const statuses = fetchedPages.flatMap((page) => flattenFxResults(page.results));
  const newItems = statuses.map((status) => normalizeFxV2StatusItem(status, "fxtwitter-timeline", sourceUrl)).filter(Boolean);
  const previousItems = mergeItems(archive.timeline?.items || []);
  const items = mergeItems([...previousItems, ...newItems]);
  const addedItems = Math.max(0, items.length - previousItems.length);
  const nextCursor = olderFetched.exhausted ? "" : olderFetched.nextCursor || archive.timeline?.cursor || latestFetched.nextCursor || "";
  const cursorAdvanced = Boolean(nextCursor && nextCursor !== startCursor);
  const errors = [...latestFetched.errors, ...olderFetched.errors];
  const stalled = fetchedPages.length > 0 && addedItems === 0;
  const routeExhausted = latestFetched.exhausted || olderFetched.exhausted ? true : fetchedPages.length ? false : Boolean(archive.timeline?.exhausted);
  const stalledRuns = fetchedPages.length ? (stalled ? (archive.timeline?.stalledRuns || 0) + 1 : 0) : archive.timeline?.stalledRuns || 0;

  return {
    label: "fxtwitter-timeline",
    indexedClaim: null,
    fxTwitterTimelinePages: fetchedPages.length,
    fxTwitterTimelineFetched: newItems.length,
    fxTwitterTimelineAdded: addedItems,
    fxTwitterTimelineArchived: items.length,
    fxTwitterTimelineStartCursor: startCursor,
    fxTwitterTimelineNextCursor: nextCursor,
    fxTwitterTimelineCursorAdvanced: cursorAdvanced,
    fxTwitterTimelineStalledRuns: stalledRuns,
    fxTwitterTimelineExhausted: routeExhausted,
    fxTwitterTimelineErrorCount: errors.length,
    fxTwitterTimelineErrors: errors.slice(0, 10),
    fxTwitterTimelineTruncated: Boolean(latestFetched.truncated || olderFetched.truncated),
    archive: {
      ...(archive.timeline || {}),
      cursor: nextCursor,
      pagesFetched: (archive.timeline?.pagesFetched || 0) + fetchedPages.length,
      items,
      exhausted: routeExhausted,
      lastFetchedItems: fetchedPages.length ? newItems.length : archive.timeline?.lastFetchedItems || 0,
      lastNewItems: fetchedPages.length ? addedItems : archive.timeline?.lastNewItems || 0,
      lastCursorAdvanced: fetchedPages.length ? cursorAdvanced : Boolean(archive.timeline?.lastCursorAdvanced),
      stalledRuns,
      lastStalledAt: stalled ? new Date().toISOString() : archive.timeline?.lastStalledAt || "",
      lastFetchedAt: new Date().toISOString(),
    },
    items,
  };
}

async function parseFxTwitterWithRepliesTimeline(archive = {}) {
  const sourceUrl = "https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses?with_replies=1";
  const pageLimit = Math.max(0, FXTWITTER_WITH_REPLIES_PAGES);
  const baseUrl = new URL("https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses");
  baseUrl.searchParams.set("count", "100");
  baseUrl.searchParams.set("with_replies", "1");

  const latestFetched = pageLimit
    ? await fetchFxV2Pages(baseUrl.toString(), 1, "fxtwitter with replies latest", "")
    : { pages: [], errors: [], truncated: false, nextCursor: "", exhausted: false };
  const remainingPages = Math.max(0, pageLimit - latestFetched.pages.length);
  const startCursor = archive.withRepliesTimeline?.cursor || latestFetched.nextCursor || "";
  const olderFetched = remainingPages
    ? await fetchFxV2Pages(baseUrl.toString(), remainingPages, "fxtwitter with replies archive", startCursor)
    : { pages: [], errors: [], truncated: false, nextCursor: startCursor, exhausted: false };

  const fetchedPages = [...latestFetched.pages, ...olderFetched.pages];
  const statuses = fetchedPages.flatMap((page) => flattenFxResults(page.results)).filter(isSerenityFxStatus);
  const newItems = statuses.map((status) => normalizeFxV2StatusItem(status, "fxtwitter-with-replies", sourceUrl)).filter(Boolean);
  const previousItems = mergeItems(archive.withRepliesTimeline?.items || []);
  const items = mergeItems([...previousItems, ...newItems]);
  const addedItems = Math.max(0, items.length - previousItems.length);
  const errors = [...latestFetched.errors, ...olderFetched.errors];
  const nextCursor = olderFetched.exhausted ? "" : olderFetched.nextCursor || archive.withRepliesTimeline?.cursor || latestFetched.nextCursor || "";
  const cursorAdvanced = Boolean(nextCursor && nextCursor !== startCursor);
  const stalled = fetchedPages.length > 0 && addedItems === 0;
  const routeExhausted = latestFetched.exhausted || olderFetched.exhausted ? true : fetchedPages.length ? false : Boolean(archive.withRepliesTimeline?.exhausted);
  const stalledRuns = fetchedPages.length ? (stalled ? (archive.withRepliesTimeline?.stalledRuns || 0) + 1 : 0) : archive.withRepliesTimeline?.stalledRuns || 0;

  return {
    label: "fxtwitter-with-replies",
    indexedClaim: null,
    fxTwitterWithRepliesPages: fetchedPages.length,
    fxTwitterWithRepliesFetched: newItems.length,
    fxTwitterWithRepliesAdded: addedItems,
    fxTwitterWithRepliesArchived: items.length,
    fxTwitterWithRepliesStartCursor: startCursor,
    fxTwitterWithRepliesNextCursor: nextCursor,
    fxTwitterWithRepliesCursorAdvanced: cursorAdvanced,
    fxTwitterWithRepliesStalledRuns: stalledRuns,
    fxTwitterWithRepliesExhausted: routeExhausted,
    fxTwitterWithRepliesErrorCount: errors.length,
    fxTwitterWithRepliesErrors: errors.slice(0, 10),
    fxTwitterWithRepliesTruncated: Boolean(latestFetched.truncated || olderFetched.truncated),
    archive: {
      ...(archive.withRepliesTimeline || {}),
      cursor: nextCursor,
      pagesFetched: (archive.withRepliesTimeline?.pagesFetched || 0) + fetchedPages.length,
      items,
      exhausted: routeExhausted,
      lastFetchedItems: fetchedPages.length ? newItems.length : archive.withRepliesTimeline?.lastFetchedItems || 0,
      lastNewItems: fetchedPages.length ? addedItems : archive.withRepliesTimeline?.lastNewItems || 0,
      lastCursorAdvanced: fetchedPages.length ? cursorAdvanced : Boolean(archive.withRepliesTimeline?.lastCursorAdvanced),
      stalledRuns,
      lastStalledAt: stalled ? new Date().toISOString() : archive.withRepliesTimeline?.lastStalledAt || "",
      lastFetchedAt: new Date().toISOString(),
      errors: errors.slice(0, 10),
    },
    items,
  };
}

async function parseFxTwitterWithRepliesRetweetsTimeline(archive = {}) {
  const sourceUrl = "https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses?with_replies=1&include_rts=1";
  const pageLimit = Math.max(0, FXTWITTER_WITH_REPLIES_RTS_PAGES);
  const baseUrl = new URL("https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses");
  baseUrl.searchParams.set("count", "100");
  baseUrl.searchParams.set("with_replies", "1");
  baseUrl.searchParams.set("include_rts", "1");
  const latestFetched = pageLimit
    ? await fetchFxV2Pages(baseUrl.toString(), 1, "fxtwitter with replies rts latest", "")
    : { pages: [], errors: [], truncated: false, nextCursor: "", exhausted: false };
  const remainingPages = Math.max(0, pageLimit - latestFetched.pages.length);
  const startCursor = archive.withRepliesRetweets?.cursor || latestFetched.nextCursor || "";
  const olderFetched = remainingPages
    ? await fetchFxV2Pages(baseUrl.toString(), remainingPages, "fxtwitter with replies rts archive", startCursor)
    : { pages: [], errors: [], truncated: false, nextCursor: startCursor, exhausted: false };
  const fetchedPages = [...latestFetched.pages, ...olderFetched.pages];
  const statuses = fetchedPages.flatMap((page) => flattenFxResults(page.results));
  const ownStatuses = statuses.filter(isSerenityFxStatus);
  const replyStatuses = statuses.filter((status) => !isSerenityFxStatus(status));
  const newItems = ownStatuses.map((status) => normalizeFxV2StatusItem(status, "fxtwitter-with-replies-rts", sourceUrl)).filter(Boolean);
  const comments = dedupeComments(
    replyStatuses.map((status) => normalizeFxComment(status, "", "fxtwitter-with-replies-rts")).filter(Boolean),
    Math.max(COMMENT_LIMIT_PER_ITEM, FXTWITTER_WITH_REPLIES_RTS_PAGES * 100)
  );
  const newCommentItems = commentsToParentItems(comments, "fxtwitter-with-replies-rts-thread", sourceUrl);
  const previousItems = mergeItems(archive.withRepliesRetweets?.items || []);
  const previousCommentItems = mergeItems(archive.withRepliesRetweets?.commentItems || []);
  const items = mergeItems([...previousItems, ...newItems]);
  const commentItems = mergeItems([...previousCommentItems, ...newCommentItems]);
  const addedItems = Math.max(0, items.length - previousItems.length);
  const previousCommentCount = previousCommentItems.reduce((total, item) => total + (item.comments?.length || 0), 0);
  const commentCount = commentItems.reduce((total, item) => total + (item.comments?.length || 0), 0);
  const addedComments = Math.max(0, commentCount - previousCommentCount);
  const nextCursor = olderFetched.exhausted ? "" : olderFetched.nextCursor || archive.withRepliesRetweets?.cursor || latestFetched.nextCursor || "";
  const cursorAdvanced = Boolean(nextCursor && nextCursor !== startCursor);
  const errors = [...latestFetched.errors, ...olderFetched.errors];
  const stalled = fetchedPages.length > 0 && addedItems === 0 && addedComments === 0;
  const routeExhausted = latestFetched.exhausted || olderFetched.exhausted ? true : fetchedPages.length ? false : Boolean(archive.withRepliesRetweets?.exhausted);
  const stalledRuns = fetchedPages.length ? (stalled ? (archive.withRepliesRetweets?.stalledRuns || 0) + 1 : 0) : archive.withRepliesRetweets?.stalledRuns || 0;

  return {
    label: "fxtwitter-with-replies-rts",
    indexedClaim: null,
    fxTwitterWithRepliesRtsPages: fetchedPages.length,
    fxTwitterWithRepliesRtsFetched: statuses.length,
    fxTwitterWithRepliesRtsOwnFetched: newItems.length,
    fxTwitterWithRepliesRtsCommentCount: comments.length,
    fxTwitterWithRepliesRtsAdded: addedItems,
    fxTwitterWithRepliesRtsAddedComments: addedComments,
    fxTwitterWithRepliesRtsArchived: items.length,
    fxTwitterWithRepliesRtsCommentThreads: commentItems.length,
    fxTwitterWithRepliesRtsArchivedComments: commentCount,
    fxTwitterWithRepliesRtsStartCursor: startCursor,
    fxTwitterWithRepliesRtsNextCursor: nextCursor,
    fxTwitterWithRepliesRtsCursorAdvanced: cursorAdvanced,
    fxTwitterWithRepliesRtsStalledRuns: stalledRuns,
    fxTwitterWithRepliesRtsExhausted: routeExhausted,
    fxTwitterWithRepliesRtsErrorCount: errors.length,
    fxTwitterWithRepliesRtsErrors: errors.slice(0, 10),
    fxTwitterWithRepliesRtsTruncated: Boolean(latestFetched.truncated || olderFetched.truncated),
    archive: {
      ...(archive.withRepliesRetweets || {}),
      cursor: nextCursor,
      pagesFetched: (archive.withRepliesRetweets?.pagesFetched || 0) + fetchedPages.length,
      items,
      commentItems,
      exhausted: routeExhausted,
      lastFetchedItems: fetchedPages.length ? newItems.length : archive.withRepliesRetweets?.lastFetchedItems || 0,
      lastFetchedComments: fetchedPages.length ? comments.length : archive.withRepliesRetweets?.lastFetchedComments || 0,
      lastNewItems: fetchedPages.length ? addedItems : archive.withRepliesRetweets?.lastNewItems || 0,
      lastNewComments: fetchedPages.length ? addedComments : archive.withRepliesRetweets?.lastNewComments || 0,
      lastCursorAdvanced: fetchedPages.length ? cursorAdvanced : Boolean(archive.withRepliesRetweets?.lastCursorAdvanced),
      stalledRuns,
      lastStalledAt: stalled ? new Date().toISOString() : archive.withRepliesRetweets?.lastStalledAt || "",
      lastFetchedAt: new Date().toISOString(),
      errors: errors.slice(0, 10),
    },
    items: mergeItems([...items, ...commentItems]),
  };
}

async function parseFxTwitterAuthorSearch(archive = {}) {
  const sourceUrl = "https://api.fxtwitter.com/2/search?q=from%3Aaleabitoreddit";
  const historicalExhausted = Boolean(archive.authorSearch?.exhausted);
  if (historicalExhausted && FXTWITTER_AUTHOR_SEARCH_PAGES <= 0) {
    const items = mergeItems(archive.authorSearch.items || []);
    return {
      label: "fxtwitter-author-search",
      indexedClaim: null,
      fxTwitterAuthorSearchPages: 0,
      fxTwitterAuthorSearchFetched: 0,
      fxTwitterAuthorSearchArchived: items.length,
      fxTwitterAuthorSearchStartCursor: archive.authorSearch.cursor || "",
      fxTwitterAuthorSearchNextCursor: archive.authorSearch.cursor || "",
      fxTwitterAuthorSearchErrorCount: 0,
      fxTwitterAuthorSearchErrors: [],
      fxTwitterAuthorSearchTruncated: false,
      fxTwitterAuthorSearchExhausted: true,
      archive: archive.authorSearch,
      items,
    };
  }
  const url = new URL("https://api.fxtwitter.com/2/search");
  url.searchParams.set("q", "from:aleabitoreddit");
  url.searchParams.set("feed", "latest");
  url.searchParams.set("count", "100");
  const startCursor = historicalExhausted ? "" : archive.authorSearch?.cursor || "";
  const fetched = await fetchFxV2Pages(url.toString(), FXTWITTER_AUTHOR_SEARCH_PAGES, "fxtwitter author search", startCursor);
  const statuses = fetched.pages.flatMap((page) => flattenFxResults(page.results));
  const newItems = statuses.map((status) => normalizeFxV2StatusItem(status, "fxtwitter-author-search", sourceUrl)).filter(Boolean);
  const items = mergeItems([...(archive.authorSearch?.items || []), ...newItems]);

  return {
    label: "fxtwitter-author-search",
    indexedClaim: null,
    fxTwitterAuthorSearchPages: fetched.pages.length,
    fxTwitterAuthorSearchFetched: newItems.length,
    fxTwitterAuthorSearchArchived: items.length,
    fxTwitterAuthorSearchStartCursor: startCursor,
    fxTwitterAuthorSearchNextCursor: fetched.nextCursor,
    fxTwitterAuthorSearchErrorCount: fetched.errors.length,
    fxTwitterAuthorSearchErrors: fetched.errors.slice(0, 10),
    fxTwitterAuthorSearchTruncated: fetched.truncated,
    fxTwitterAuthorSearchExhausted: historicalExhausted || fetched.exhausted,
    archive: {
      ...(archive.authorSearch || {}),
      cursor: historicalExhausted || fetched.exhausted ? "" : fetched.nextCursor || archive.authorSearch?.cursor || "",
      exhausted: historicalExhausted || fetched.exhausted,
      pagesFetched: (archive.authorSearch?.pagesFetched || 0) + fetched.pages.length,
      items,
      lastFetchedAt: new Date().toISOString(),
    },
    items,
  };
}

function buildAuthorDateSlices(archive = {}) {
  const explicitSlices = FXTWITTER_AUTHOR_DATE_SLICES
    .split(/\s*,\s*/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [since, until] = entry.split(/[_:|]/).map((part) => part?.trim());
      return since && until ? { key: sliceKey(since, until), since, until } : null;
    })
    .filter(Boolean);
  const microSlices = buildAuthorMicroDateSlices(archive);
  const microParentKeys = new Set(microSlices.map((slice) => slice.parentKey).filter(Boolean));
  if (!FXTWITTER_AUTHOR_DATE_SLICE_MONTHS) {
    const byKey = new Map([...explicitSlices, ...microSlices].map((slice) => [slice.key, slice]));
    return [...byKey.values()];
  }
  const archivedItems = [
    ...(archive.authorSearch?.items || []),
    ...(archive.timeline?.items || []),
    ...Object.values(archive.authorDateSlices?.slices || {}).flatMap((slice) => slice.items || []),
  ];
  const earliest = archivedItems
    .map((item) => isoDay(item.date))
    .filter(Boolean)
    .sort()[0];
  const firstUntil = earliest || new Date().toISOString().slice(0, 10);
  const firstSince = monthStart(firstUntil);
  const slices = [];
  let until = firstUntil;
  for (let index = 0; index < FXTWITTER_AUTHOR_DATE_SLICE_MONTHS; index += 1) {
    const sinceDate = index === 0 ? addMonths(firstSince, -1) : addMonths(monthStart(until), -1);
    const since = sinceDate.toISOString().slice(0, 10);
    const key = sliceKey(since, until);
    slices.push({ key, since, until });
    until = since;
  }
  const regularSlices = slices.filter((slice) => !microParentKeys.has(slice.key));
  const byKey = new Map([...explicitSlices, ...regularSlices, ...microSlices].map((slice) => [slice.key, slice]));
  return [...byKey.values()];
}

function buildAuthorMicroDateSlices(archive = {}) {
  const days = Math.max(0, FXTWITTER_AUTHOR_MICRO_SLICE_DAYS);
  const pageLimit = Math.max(0, FXTWITTER_AUTHOR_MICRO_SLICE_PAGES);
  const sliceLimit = Math.max(0, FXTWITTER_AUTHOR_MICRO_SLICE_LIMIT);
  if (!days || !pageLimit || !sliceLimit) return [];
  const sliceStates = archive.authorDateSlices?.slices || {};
  const stalledParents = Object.values(sliceStates)
    .filter((slice) => slice?.since && slice?.until && !slice.exhausted && (slice.stalledRuns || 0) > 0)
    .filter((slice) => dayRangeLength(slice.since, slice.until) > days)
    .sort((a, b) => String(a.since).localeCompare(String(b.since)));
  const microSlices = [];

  for (const parent of stalledParents) {
    let sinceDate = new Date(dayTimestamp(parent.since));
    const untilDate = new Date(dayTimestamp(parent.until));
    if (!Number.isFinite(sinceDate.getTime()) || !Number.isFinite(untilDate.getTime())) continue;

    while (sinceDate < untilDate && microSlices.length < sliceLimit) {
      const nextUntilDate = addDays(sinceDate, days);
      const microUntilDate = nextUntilDate < untilDate ? nextUntilDate : untilDate;
      const since = sinceDate.toISOString().slice(0, 10);
      const until = microUntilDate.toISOString().slice(0, 10);
      const key = sliceKey(since, until);
      const state = sliceStates[key];
      if (!state?.exhausted) {
        microSlices.push({
          key,
          since,
          until,
          parentKey: sliceKey(parent.since, parent.until),
          micro: true,
          pageLimit,
        });
      }
      sinceDate = microUntilDate;
    }
  }

  return microSlices;
}

async function parseFxTwitterAuthorDateSlices(archive = {}) {
  const sourceUrl = "https://api.fxtwitter.com/2/search?q=from%3Aaleabitoreddit+since%2FUNtil";
  const existing = archive.authorDateSlices || {};
  const sliceStates = { ...(existing.slices || {}) };
  const activeSlices = buildAuthorDateSlices(archive).filter((slice) => !sliceStates[slice.key]?.exhausted && Math.max(0, slice.pageLimit ?? FXTWITTER_AUTHOR_DATE_SLICE_PAGES));
  const reports = [];

  for (const slice of activeSlices) {
    const state = sliceStates[slice.key] || { since: slice.since, until: slice.until, cursor: "", items: [], pagesFetched: 0 };
    const pageLimit = Math.max(0, slice.pageLimit ?? FXTWITTER_AUTHOR_DATE_SLICE_PAGES);
    const url = new URL("https://api.fxtwitter.com/2/search");
    url.searchParams.set("q", `from:aleabitoreddit since:${slice.since} until:${slice.until}`);
    url.searchParams.set("feed", "latest");
    url.searchParams.set("count", "100");
    const fetched = await fetchFxV2Pages(url.toString(), pageLimit, `fxtwitter author date ${slice.key}`, state.cursor || "");
    const statuses = fetched.pages.flatMap((page) => flattenFxResults(page.results));
    const newItems = statuses.map((status) => normalizeFxV2StatusItem(status, "fxtwitter-author-date-slice", url.toString())).filter(Boolean);
    const previousItems = mergeItems(state.items || []);
    const items = mergeItems([...(state.items || []), ...newItems]);
    const addedItems = Math.max(0, items.length - previousItems.length);
    const stalled = fetched.pages.length > 0 && addedItems === 0;
    const nextState = {
      ...state,
      since: slice.since,
      until: slice.until,
      parentKey: slice.parentKey || state.parentKey || "",
      micro: Boolean(slice.micro || state.micro),
      pageLimit,
      cursor: fetched.exhausted ? "" : fetched.nextCursor || state.cursor || "",
      exhausted: fetched.exhausted || (!fetched.truncated && fetched.pages.length < pageLimit),
      pagesFetched: (state.pagesFetched || 0) + fetched.pages.length,
      items,
      lastFetchedItems: fetched.pages.length ? newItems.length : state.lastFetchedItems || 0,
      lastNewItems: fetched.pages.length ? addedItems : state.lastNewItems || 0,
      lastCursorAdvanced: fetched.pages.length ? Boolean(fetched.nextCursor && fetched.nextCursor !== (state.cursor || "")) : Boolean(state.lastCursorAdvanced),
      stalledRuns: fetched.pages.length ? (stalled ? (state.stalledRuns || 0) + 1 : 0) : state.stalledRuns || 0,
      lastStalledAt: stalled ? new Date().toISOString() : state.lastStalledAt || "",
      lastFetchedAt: new Date().toISOString(),
      errors: fetched.errors.slice(0, 10),
    };
    sliceStates[slice.key] = nextState;
    reports.push({
      key: slice.key,
      since: slice.since,
      until: slice.until,
      parentKey: slice.parentKey || "",
      micro: Boolean(slice.micro),
      pageLimit,
      pages: fetched.pages.length,
      fetched: newItems.length,
      added: addedItems,
      archived: items.length,
      stalledRuns: nextState.stalledRuns,
      exhausted: nextState.exhausted,
      errors: fetched.errors.slice(0, 3),
    });
  }

  const allItems = mergeItems(Object.values(sliceStates).flatMap((slice) => slice.items || []));
  return {
    label: "fxtwitter-author-date-slices",
    indexedClaim: null,
    fxTwitterAuthorDateSliceCount: Object.keys(sliceStates).length,
    fxTwitterAuthorDateSliceActive: activeSlices.length,
    fxTwitterAuthorDateSlicePages: reports.reduce((total, report) => total + report.pages, 0),
    fxTwitterAuthorDateSliceFetched: reports.reduce((total, report) => total + report.fetched, 0),
    fxTwitterAuthorDateSliceArchived: allItems.length,
    fxTwitterAuthorDateSliceReports: reports.slice(0, 12),
    archive: {
      ...existing,
      slices: sliceStates,
      lastFetchedAt: new Date().toISOString(),
    },
    items: allItems,
  };
}

function buildAuthorTopDateSlices() {
  return FXTWITTER_AUTHOR_TOP_DATE_SLICES.split(/\s*,\s*/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [since, until] = entry.split(/[_:|]/).map((part) => part?.trim());
      return since && until ? { key: sliceKey(since, until), since, until } : null;
    })
    .filter(Boolean);
}

async function parseFxTwitterAuthorTopDateSlices(archive = {}) {
  const sourceUrl = "https://api.fxtwitter.com/2/search?q=from%3Aaleabitoreddit+since%2FUNtil&feed=top";
  const existing = archive.authorTopDateSlices || {};
  const sliceStates = { ...(existing.slices || {}) };
  const activeSlices = buildAuthorTopDateSlices().filter((slice) => !sliceStates[slice.key]?.exhausted && Math.max(0, FXTWITTER_AUTHOR_TOP_DATE_SLICE_PAGES));
  const reports = [];

  for (const slice of activeSlices) {
    const state = sliceStates[slice.key] || { since: slice.since, until: slice.until, cursor: "", items: [], pagesFetched: 0 };
    const pageLimit = Math.max(0, FXTWITTER_AUTHOR_TOP_DATE_SLICE_PAGES);
    const url = new URL("https://api.fxtwitter.com/2/search");
    url.searchParams.set("q", `from:aleabitoreddit since:${slice.since} until:${slice.until}`);
    url.searchParams.set("feed", "top");
    url.searchParams.set("count", "100");
    const fetched = await fetchFxV2Pages(url.toString(), pageLimit, `fxtwitter author top date ${slice.key}`, state.cursor || "");
    const statuses = fetched.pages.flatMap((page) => flattenFxResults(page.results)).filter(isSerenityFxStatus);
    const newItems = statuses.map((status) => normalizeFxV2StatusItem(status, "fxtwitter-author-top-date-slice", url.toString())).filter(Boolean);
    const previousItems = mergeItems(state.items || []);
    const items = mergeItems([...(state.items || []), ...newItems]);
    const addedItems = Math.max(0, items.length - previousItems.length);
    const stalled = fetched.pages.length > 0 && addedItems === 0;
    const nextState = {
      ...state,
      since: slice.since,
      until: slice.until,
      pageLimit,
      cursor: fetched.exhausted ? "" : fetched.nextCursor || state.cursor || "",
      exhausted: fetched.exhausted || (!fetched.truncated && fetched.pages.length < pageLimit),
      pagesFetched: (state.pagesFetched || 0) + fetched.pages.length,
      items,
      lastFetchedItems: fetched.pages.length ? newItems.length : state.lastFetchedItems || 0,
      lastNewItems: fetched.pages.length ? addedItems : state.lastNewItems || 0,
      lastCursorAdvanced: fetched.pages.length ? Boolean(fetched.nextCursor && fetched.nextCursor !== (state.cursor || "")) : Boolean(state.lastCursorAdvanced),
      stalledRuns: fetched.pages.length ? (stalled ? (state.stalledRuns || 0) + 1 : 0) : state.stalledRuns || 0,
      lastStalledAt: stalled ? new Date().toISOString() : state.lastStalledAt || "",
      lastFetchedAt: new Date().toISOString(),
      errors: fetched.errors.slice(0, 10),
    };
    sliceStates[slice.key] = nextState;
    reports.push({
      key: slice.key,
      since: slice.since,
      until: slice.until,
      pageLimit,
      pages: fetched.pages.length,
      fetched: newItems.length,
      added: addedItems,
      archived: items.length,
      stalledRuns: nextState.stalledRuns,
      exhausted: nextState.exhausted,
      errors: fetched.errors.slice(0, 3),
    });
  }

  const allItems = mergeItems(Object.values(sliceStates).flatMap((slice) => slice.items || []));
  const activeCount = Object.values(sliceStates).filter((slice) => slice.cursor && !slice.exhausted).length;
  const archived = mergeItems(allItems).length;

  return {
    label: "fxtwitter-author-top-date-slices",
    indexedClaim: null,
    fxTwitterAuthorTopDateSliceCount: Object.keys(sliceStates).length,
    fxTwitterAuthorTopDateSliceActive: activeCount,
    fxTwitterAuthorTopDateSlicePages: reports.reduce((total, report) => total + report.pages, 0),
    fxTwitterAuthorTopDateSliceFetched: reports.reduce((total, report) => total + report.fetched, 0),
    fxTwitterAuthorTopDateSliceAdded: reports.reduce((total, report) => total + report.added, 0),
    fxTwitterAuthorTopDateSliceArchived: archived,
    fxTwitterAuthorTopDateSliceReports: reports,
    archive: {
      ...existing,
      slices: sliceStates,
    },
    items: allItems,
  };
}

async function parseFxTwitterReplySearch(archive = {}) {
  const sourceUrl = "https://api.fxtwitter.com/2/search?q=to%3Aaleabitoreddit";
  const url = new URL("https://api.fxtwitter.com/2/search");
  url.searchParams.set("q", "to:aleabitoreddit");
  url.searchParams.set("feed", "latest");
  url.searchParams.set("count", "100");
  const startCursor = archive.replySearch?.cursor || "";
  const fetched = await fetchFxV2Pages(url.toString(), FXTWITTER_REPLY_SEARCH_PAGES, "fxtwitter reply search", startCursor);
  const statuses = fetched.pages.flatMap((page) => flattenFxResults(page.results));
  const comments = dedupeComments(
    statuses.map((status) => normalizeFxComment(status, "", "fxtwitter-reply-search")).filter(Boolean),
    Math.max(COMMENT_LIMIT_PER_ITEM, FXTWITTER_REPLY_SEARCH_PAGES * 100)
  );
  const newItems = commentsToParentItems(comments, "fxtwitter-reply-thread", sourceUrl);
  const items = mergeItems([...(archive.replySearch?.items || []), ...newItems]);
  const archivedCommentCount = items.reduce((total, item) => total + (item.comments?.length || 0), 0);
  const replyExhausted = FXTWITTER_REPLY_SEARCH_PAGES > 0 && fetched.exhausted;
  const historicalExhausted = Boolean(archive.replySearch?.exhausted);

  return {
    label: "fxtwitter-reply-search",
    indexedClaim: null,
    fxTwitterReplySearchPages: fetched.pages.length,
    fxTwitterReplyCount: comments.length,
    fxTwitterReplyArchivedCount: archivedCommentCount,
    fxTwitterReplyThreadArchived: items.length,
    fxTwitterReplyStartCursor: startCursor,
    fxTwitterReplyNextCursor: fetched.nextCursor,
    fxTwitterReplySearchErrorCount: fetched.errors.length,
    fxTwitterReplySearchErrors: fetched.errors.slice(0, 10),
    fxTwitterReplySearchTruncated: fetched.truncated,
    fxTwitterReplySearchExhausted: replyExhausted || historicalExhausted,
    archive: {
      ...(archive.replySearch || {}),
      cursor: replyExhausted || historicalExhausted ? "" : fetched.nextCursor || archive.replySearch?.cursor || "",
      exhausted: replyExhausted || historicalExhausted,
      pagesFetched: (archive.replySearch?.pagesFetched || 0) + fetched.pages.length,
      items,
      lastFetchedAt: new Date().toISOString(),
    },
    items,
  };
}

async function parseFxTwitterConversations(items = []) {
  const sourceUrl = "https://api.fxtwitter.com/2/conversation";
  const candidates = unique(
    items
      .filter((item) => statusId(statusUrlFromItem(item)))
      .sort((a, b) => (b.engagement?.replies || 0) - (a.engagement?.replies || 0) || (b.materiality || 0) - (a.materiality || 0))
      .map((item) => statusId(statusUrlFromItem(item)))
  ).slice(0, FXTWITTER_CONVERSATION_LIMIT);

  const errors = [];
  const results = await mapWithConcurrency(candidates, Math.max(1, Math.min(FXTWITTER_CONCURRENCY, 4)), async (id) => {
    try {
      const url = `https://api.fxtwitter.com/2/conversation/${encodeURIComponent(id)}?ranking_mode=likes`;
      const payload = await fetchJsonUrl(url, FXTWITTER_TIMEOUT_MS);
      if (payload.code && payload.code !== 200) throw new Error(payload.message || `conversation code ${payload.code}`);
      const statusItem = normalizeFxV2StatusItem(payload.status, "fxtwitter-conversation", url);
      const comments = dedupeComments((payload.replies || []).map((reply) => normalizeFxComment(reply, id, "fxtwitter-conversation")).filter(Boolean));
      if (statusItem) statusItem.comments = dedupeComments([...(statusItem.comments || []), ...comments]);
      return statusItem || commentsToParentItems(comments, "fxtwitter-reply-thread", url)[0] || null;
    } catch (error) {
      errors.push({ id, error: error.message });
      return null;
    }
  });
  const parsedItems = results.filter(Boolean);

  return {
    label: "fxtwitter-conversation",
    indexedClaim: null,
    fxTwitterConversationCount: candidates.length,
    fxTwitterConversationFetched: parsedItems.length,
    fxTwitterReplyCount: parsedItems.reduce((total, item) => total + (item.comments?.length || 0), 0),
    fxTwitterConversationErrorCount: errors.length,
    fxTwitterConversationErrors: errors.slice(0, 20),
    items: parsedItems,
  };
}

async function fetchSupercycleCallerTabPages(
  tab,
  params = {},
  sourceUrl = "https://supercycle.fi/c/aleabitoreddit",
  timeoutSeconds = SUPERCYCLE_CALLER_TIMEOUT_MS
) {
  const origin = new URL(sourceUrl).origin;
  const pages = [];
  let cursor = "";

  for (let page = 0; page < SUPERCYCLE_CALLER_PAGE_LIMIT; page += 1) {
    const url = new URL(`/c/${SUPERCYCLE_CALLER_HANDLE}/tabs/${tab}`, origin);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    }
    if (cursor) url.searchParams.set("cursor", cursor);

    const payload = await fetchJsonUrl(url.toString(), timeoutSeconds);
    pages.push({
      url: url.toString(),
      html: payload.html || "",
      hasMore: Boolean(payload.hasMore),
      nextCursor: payload.nextCursor || "",
    });

    if (!payload.hasMore || !payload.nextCursor) break;
    cursor = payload.nextCursor;
  }

  return {
    pages,
    html: pages.map((page) => page.html).join("\n"),
    truncated: Boolean(pages.at(-1)?.hasMore && pages.at(-1)?.nextCursor),
  };
}

function stripTweetEmbed(html = "") {
  const paragraph = html.match(/<p[\s\S]*?<\/p>/)?.[0] || html;
  return stripTags(paragraph.replace(/<br\s*\/?>/g, "\n")).replace(/\s*\n\s*/g, " ").trim();
}

async function enrichWithOembed(item) {
  if (item.oembedNotNeeded && (item.body || "").length > 220) return item;
  if (process.env.SERENITY_FAST_REFRESH === "1" && (item.body || "").length > 180) return item;
  if (!item.url || !item.url.includes("/status/")) return item;
  const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(item.url)}&omit_script=true`;

  try {
    const raw = await fetchUrl(oembedUrl, "application/json,text/plain,*/*", OEMBED_TIMEOUT_MS);
    const json = JSON.parse(raw);
    const fullText = stripTweetEmbed(json.html);
    if (!fullText) return item;

    const symbols = unique([...item.symbols, ...extractSymbols(fullText)]);
    const enriched = {
      ...item,
      title: item.title && !item.title.endsWith("…") ? item.title : fullText.split(/[.!?]\s/)[0].slice(0, 180),
      body: fullText,
      symbols,
      theme: classifyTheme(`${item.title} ${item.body} ${fullText} ${item.theme}`),
      oembed: {
        author: json.author_name,
        url: json.url,
        enrichedAt: new Date().toISOString(),
      },
    };
    enriched.materiality = materialityScore(enriched);
    return enriched;
  } catch (error) {
    return {
      ...item,
      oembedError: error.message,
    };
  }
}

function mergeEngagement(existing = null, incoming = null) {
  if (!existing && !incoming) return undefined;
  const merged = {
    ...(existing || {}),
    ...(incoming || {}),
  };
  for (const key of ["likes", "retweets", "replies", "views"]) {
    const current = Number(existing?.[key]);
    const next = Number(incoming?.[key]);
    const best = Math.max(Number.isFinite(current) ? current : 0, Number.isFinite(next) ? next : 0);
    if (best) merged[key] = best;
  }
  return merged;
}

function buysideItemKey(item = {}) {
  if (!sourceList(item).some((source) => source.includes("buyside"))) return "";
  const detailUrl =
    item.buyside?.detailUrl ||
    (String(item.sourceUrl || "").includes("buysidedigest.com/elevator/") ? item.sourceUrl : "") ||
    (String(item.url || "").includes("buysidedigest.com/elevator/") ? item.url : "");
  const slug = detailUrl.split("/").filter(Boolean).pop();
  return slug ? `buyside-${slug}` : "";
}

function canonicalItemKey(item = {}) {
  return buysideItemKey(item) || statusId(item.url) || item.id || `${item.source}-${item.title}`;
}

function itemStatusId(item = {}) {
  const fromUrl = statusId(statusUrlFromItem(item));
  if (fromUrl) return fromUrl;
  const raw = String(item.id || item.tweetId || item.fxTwitterV2?.id || "");
  return /^\d{12,}$/.test(raw) ? raw : "";
}

function isTwiscanMirrorItem(item = {}) {
  return Boolean(item.twiscan) || sourceList(item).includes("twiscan-recent-mirror");
}

function isInstalkerReaderMirrorItem(item = {}) {
  return Boolean(item.instalkerReader) || sourceList(item).includes("instalker-reader-mirror");
}

function normalizedComparableText(value = "") {
  return decodeHtml(value)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[$#@]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function comparableTokens(value = "") {
  return unique(
    normalizedComparableText(value)
      .split(" ")
      .filter((token) => token.length > 2 && !TEXT_MATCH_STOPWORDS.has(token))
  );
}

function orderedPhraseBonus(leftTokens = [], rightSet = new Set()) {
  let run = 0;
  let best = 0;
  for (const token of leftTokens) {
    if (rightSet.has(token)) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }
  return best >= 8 ? 12 : best >= 5 ? 6 : 0;
}

function twiscanMatchScore(mirrorText = "", statusText = "") {
  const mirrorClean = normalizedComparableText(mirrorText);
  const statusClean = normalizedComparableText(statusText);
  if (!mirrorClean || !statusClean) return 0;
  const mirrorPrefix = mirrorClean.slice(0, Math.min(220, mirrorClean.length));
  const statusPrefix = statusClean.slice(0, Math.min(220, statusClean.length));
  if (mirrorPrefix.length > 48 && statusClean.includes(mirrorPrefix)) return 100;
  if (statusPrefix.length > 48 && mirrorClean.includes(statusPrefix)) return 100;

  const mirrorTokens = comparableTokens(mirrorText);
  const statusTokens = comparableTokens(statusText);
  if (mirrorTokens.length < 5 || statusTokens.length < 5) return 0;
  const statusSet = new Set(statusTokens);
  const overlap = mirrorTokens.filter((token) => statusSet.has(token)).length;
  const denominator = Math.min(mirrorTokens.length, statusTokens.length);
  const base = denominator ? (overlap / denominator) * 100 : 0;
  return Math.min(100, Math.round(base + orderedPhraseBonus(mirrorTokens, statusSet)));
}

function bestTwiscanStatusMatch(item = {}, candidates = []) {
  const mirrorText = `${item.title || ""} ${item.body || ""}`;
  let best = null;
  for (const candidate of candidates) {
    const score = twiscanMatchScore(mirrorText, `${candidate.title || ""} ${candidate.body || ""}`);
    if (!best || score > best.score) best = { ...candidate, score };
  }
  return best && best.score >= TWISCAN_LOCAL_MATCH_SCORE ? best : null;
}

function mirrorStatusCandidates(items = [], exclude = () => false) {
  return items
    .filter((item) => !exclude(item))
    .map((item) => {
      const id = itemStatusId(item);
      const text = `${item.title || ""} ${item.body || ""}`.trim();
      return id && text.length > 24
        ? {
            id,
            url: `https://x.com/aleabitoreddit/status/${id}`,
            title: item.title || "",
            body: item.body || "",
          }
        : null;
    })
    .filter(Boolean);
}

function twiscanMirrorKey(item = {}) {
  return (
    item.twiscan?.mirrorId ||
    (String(item.url || "").includes("twiscan.com") ? item.url : "") ||
    `twiscan-${stableHash(`${item.title || ""} ${item.body || ""}`.slice(0, 2000))}`
  );
}

function resolveTwiscanMirrors(items = []) {
  const statusCandidates = mirrorStatusCandidates(items, isTwiscanMirrorItem);
  const seenMirrors = new Set();
  const resolvedMirrors = new Set();

  const resolvedItems = items.map((item) => {
    if (!isTwiscanMirrorItem(item)) return item;
    const mirrorKey = twiscanMirrorKey(item);
    seenMirrors.add(mirrorKey);
    const existingResolvedId = item.twiscan?.resolvedStatusId || "";
    const existingMatch = existingResolvedId
      ? {
          id: existingResolvedId,
          url: item.twiscan?.resolvedUrl || `https://x.com/aleabitoreddit/status/${existingResolvedId}`,
          score: item.twiscan?.matchScore || 100,
        }
      : null;
    const match = existingMatch || bestTwiscanStatusMatch(item, statusCandidates);

    if (!match) {
      return {
        ...item,
        twiscan: {
          ...(item.twiscan || {}),
          mirrorId: item.twiscan?.mirrorId || mirrorKey,
          note: "Mirror text does not expose stable X status IDs; used for strategy distillation only.",
        },
      };
    }

    resolvedMirrors.add(mirrorKey);
    const sources = unique([...sourceList(item), "twiscan-recent-mirror"]);
    return {
      ...item,
      id: match.id,
      url: match.url,
      source: sources.join(" + "),
      sourceList: sources,
      sourceUrls: unique([...(item.sourceUrls || []), item.sourceUrl, item.url, match.url].filter(Boolean)),
      twiscan: {
        ...(item.twiscan || {}),
        mirrorId: item.twiscan?.mirrorId || mirrorKey,
        resolvedStatusId: match.id,
        resolvedUrl: match.url,
        matchScore: match.score,
        note: "Mirror text mapped to an existing public X status by local text overlap.",
      },
    };
  });

  return {
    items: resolvedItems,
    total: seenMirrors.size,
    resolved: resolvedMirrors.size,
    unresolved: [...seenMirrors].filter((key) => !resolvedMirrors.has(key)).length,
  };
}

function instalkerReaderMirrorKey(item = {}) {
  return item.instalkerReader?.mirrorId || `instalker-reader-${stableHash(`${item.title || ""} ${item.body || ""}`.slice(0, 2000))}`;
}

function resolveInstalkerReaderMirrors(items = []) {
  const statusCandidates = mirrorStatusCandidates(items, isInstalkerReaderMirrorItem);
  const seenMirrors = new Set();
  const resolvedMirrors = new Set();

  const resolvedItems = items.map((item) => {
    if (!isInstalkerReaderMirrorItem(item)) return item;
    const mirrorKey = instalkerReaderMirrorKey(item);
    seenMirrors.add(mirrorKey);
    const existingResolvedId = item.instalkerReader?.resolvedStatusId || "";
    const existingMatch = existingResolvedId
      ? {
          id: existingResolvedId,
          url: item.instalkerReader?.resolvedUrl || `https://x.com/aleabitoreddit/status/${existingResolvedId}`,
          score: item.instalkerReader?.matchScore || 100,
        }
      : null;
    const match = existingMatch || bestTwiscanStatusMatch(item, statusCandidates);

    if (!match) {
      return {
        ...item,
        instalkerReader: {
          ...(item.instalkerReader || {}),
          mirrorId: item.instalkerReader?.mirrorId || mirrorKey,
          note: "Reader mirror text does not expose stable X status IDs; used for strategy distillation only.",
        },
      };
    }

    resolvedMirrors.add(mirrorKey);
    const sources = unique([...sourceList(item), "instalker-reader-mirror"]);
    return {
      ...item,
      id: match.id,
      url: match.url,
      source: sources.join(" + "),
      sourceList: sources,
      sourceUrls: unique([...(item.sourceUrls || []), item.sourceUrl, item.url, match.url].filter(Boolean)),
      instalkerReader: {
        ...(item.instalkerReader || {}),
        mirrorId: item.instalkerReader?.mirrorId || mirrorKey,
        resolvedStatusId: match.id,
        resolvedUrl: match.url,
        matchScore: match.score,
        note: "Reader mirror text mapped to an existing public X status by local text overlap.",
      },
    };
  });

  return {
    items: resolvedItems,
    total: seenMirrors.size,
    resolved: resolvedMirrors.size,
    unresolved: [...seenMirrors].filter((key) => !resolvedMirrors.has(key)).length,
  };
}

function instalkerReaderResolutionStats(items = []) {
  const mirrors = new Map();
  for (const item of items.filter(isInstalkerReaderMirrorItem)) {
    const key = instalkerReaderMirrorKey(item);
    const existing = mirrors.get(key) || { resolved: false };
    mirrors.set(key, {
      resolved: existing.resolved || Boolean(item.instalkerReader?.resolvedStatusId),
    });
  }
  const resolved = [...mirrors.values()].filter((item) => item.resolved).length;
  return {
    total: mirrors.size,
    resolved,
    unresolved: Math.max(0, mirrors.size - resolved),
  };
}

function twiscanResolutionStats(items = []) {
  const mirrors = new Map();
  for (const item of items.filter(isTwiscanMirrorItem)) {
    const key = twiscanMirrorKey(item);
    const existing = mirrors.get(key) || { resolved: false };
    mirrors.set(key, {
      resolved: existing.resolved || Boolean(item.twiscan?.resolvedStatusId),
    });
  }
  const resolved = [...mirrors.values()].filter((item) => item.resolved).length;
  return {
    total: mirrors.size,
    resolved,
    unresolved: Math.max(0, mirrors.size - resolved),
  };
}

function readExistingTweetIndex() {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "serenity-tweets.json"), "utf8"));
  } catch {
    return null;
  }
}

function readFxTwitterArchive() {
  if (RESET_FXTWITTER_ARCHIVE) return {};
  try {
    return JSON.parse(fs.readFileSync(FXTWITTER_ARCHIVE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function fxArchiveSummary(archive = {}) {
  const timelineItems = archive.timeline?.items?.length || 0;
  const withRepliesItems = archive.withRepliesTimeline?.items?.length || 0;
  const withRepliesRtsItems = archive.withRepliesRetweets?.items?.length || 0;
  const withRepliesRtsCommentThreads = archive.withRepliesRetweets?.commentItems?.length || 0;
  const withRepliesRtsComments = (archive.withRepliesRetweets?.commentItems || []).reduce((total, item) => total + (item.comments?.length || 0), 0);
  const authorItems = archive.authorSearch?.items?.length || 0;
  const authorDateSliceItems = mergeItems(Object.values(archive.authorDateSlices?.slices || {}).flatMap((slice) => slice.items || [])).length;
  const authorDateSlicePages = Object.values(archive.authorDateSlices?.slices || {}).reduce((total, slice) => total + (slice.pagesFetched || 0), 0);
  const authorDateSliceExhausted = Object.values(archive.authorDateSlices?.slices || {}).filter((slice) => slice.exhausted).length;
  const authorDateSliceStalled = Object.values(archive.authorDateSlices?.slices || {}).filter(
    (slice) => slice.cursor && !slice.exhausted && (slice.stalledRuns || 0) > 0
  ).length;
  const authorTopDateSliceItems = mergeItems(Object.values(archive.authorTopDateSlices?.slices || {}).flatMap((slice) => slice.items || [])).length;
  const authorTopDateSlicePages = Object.values(archive.authorTopDateSlices?.slices || {}).reduce((total, slice) => total + (slice.pagesFetched || 0), 0);
  const authorTopDateSliceExhausted = Object.values(archive.authorTopDateSlices?.slices || {}).filter((slice) => slice.exhausted).length;
  const authorTopDateSliceStalled = Object.values(archive.authorTopDateSlices?.slices || {}).filter(
    (slice) => slice.cursor && !slice.exhausted && (slice.stalledRuns || 0) > 0
  ).length;
  const statusIds = new Set(
    [
      ...(archive.timeline?.items || []),
      ...(archive.withRepliesTimeline?.items || []),
      ...(archive.withRepliesRetweets?.items || []),
      ...(archive.authorSearch?.items || []),
      ...Object.values(archive.authorDateSlices?.slices || {}).flatMap((slice) => slice.items || []),
      ...Object.values(archive.authorTopDateSlices?.slices || {}).flatMap((slice) => slice.items || []),
    ]
      .map((item) => statusId(statusUrlFromItem(item)) || item.id || canonicalItemKey(item))
      .filter(Boolean)
  );
  const replyThreads = archive.replySearch?.items?.length || 0;
  const replyComments = (archive.replySearch?.items || []).reduce((total, item) => total + (item.comments?.length || 0), 0);
  return {
    statusItems: statusIds.size || Math.max(timelineItems, authorItems),
    timelineItems,
    timelinePages: archive.timeline?.pagesFetched || 0,
    timelineCursor: archive.timeline?.cursor || "",
    timelineExhausted: Boolean(archive.timeline?.exhausted),
    timelineStalledRuns: archive.timeline?.stalledRuns || 0,
    withRepliesItems,
    withRepliesPages: archive.withRepliesTimeline?.pagesFetched || 0,
    withRepliesCursor: archive.withRepliesTimeline?.cursor || "",
    withRepliesExhausted: Boolean(archive.withRepliesTimeline?.exhausted),
    withRepliesStalledRuns: archive.withRepliesTimeline?.stalledRuns || 0,
    withRepliesRtsItems,
    withRepliesRtsPages: archive.withRepliesRetweets?.pagesFetched || 0,
    withRepliesRtsCursor: archive.withRepliesRetweets?.cursor || "",
    withRepliesRtsExhausted: Boolean(archive.withRepliesRetweets?.exhausted),
    withRepliesRtsStalledRuns: archive.withRepliesRetweets?.stalledRuns || 0,
    withRepliesRtsLastNewItems: archive.withRepliesRetweets?.lastNewItems || 0,
    withRepliesRtsLastNewComments: archive.withRepliesRetweets?.lastNewComments || 0,
    withRepliesRtsLastFetchedItems: archive.withRepliesRetweets?.lastFetchedItems || 0,
    withRepliesRtsLastFetchedComments: archive.withRepliesRetweets?.lastFetchedComments || 0,
    withRepliesRtsCommentThreads,
    withRepliesRtsComments,
    authorItems,
    authorPages: archive.authorSearch?.pagesFetched || 0,
    authorCursor: archive.authorSearch?.cursor || "",
    authorExhausted: Boolean(archive.authorSearch?.exhausted),
    authorDateSliceItems,
    authorDateSlicePages,
    authorDateSliceCount: Object.keys(archive.authorDateSlices?.slices || {}).length,
    authorDateSliceExhausted,
    authorDateSliceStalled,
    authorTopDateSliceItems,
    authorTopDateSlicePages,
    authorTopDateSliceCount: Object.keys(archive.authorTopDateSlices?.slices || {}).length,
    authorTopDateSliceExhausted,
    authorTopDateSliceStalled,
    replyThreads,
    replyComments,
    replyPages: archive.replySearch?.pagesFetched || 0,
    replyCursor: archive.replySearch?.cursor || "",
    replyExhausted: Boolean(archive.replySearch?.exhausted),
    updatedAt: archive.updatedAt || "",
  };
}

function writeFxTwitterArchive(archive = {}) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const next = {
    ...archive,
    updatedAt: new Date().toISOString(),
  };
  next.summary = fxArchiveSummary(next);
  fs.writeFileSync(FXTWITTER_ARCHIVE_FILE, JSON.stringify(next, null, 2));
  return next;
}

function mergeSourceReportsWithPrevious(currentReports = [], previousReports = []) {
  const previousByUrl = new Map(previousReports.map((report) => [report.url, report]));
  return currentReports.map((report) => {
    const previous = previousByUrl.get(report.url);
    if (report.source === "instalker" && Number.isFinite(Number(report.instalkerLoadMoreRawUniqueFetched))) return report;
    if (!previous || (report.parsedItems || 0) >= (previous.parsedItems || 0) || !(previous.parsedItems > 0)) return report;
    return {
      ...previous,
      liveParsedItems: report.parsedItems || 0,
      liveError: report.error || report.fxTwitterProfileError || "",
      parsedItems: previous.parsedItems,
      stalePreserved: true,
      stalePreservedAt: new Date().toISOString(),
    };
  });
}

function reportStrength(report = {}) {
  return [
    report.parsedItems,
    report.fxTwitterWithRepliesArchived,
    report.fxTwitterWithRepliesRtsArchivedComments,
    report.fxTwitterWithRepliesRtsArchived,
    report.fxTwitterAuthorTopDateSliceArchived,
    report.fxTwitterAuthorDateSliceArchived,
    report.fxTwitterAuthorSearchArchived,
    report.fxTwitterTimelineArchived,
    report.fxTwitterReplyArchivedCount,
    report.fxTwitterReplyCount,
    report.fxTwitterConversationFetched,
    report.twiscanPostCount,
    report.twiscanResolvedCount,
    report.instalkerReaderPostCount,
    report.instalkerReaderResolvedCount,
    report.instalkerLoadMoreFetched,
    report.instalkerLoadMoreRawUniqueFetched,
    report.instalkerLoadMoreRawFetched,
    report.callerAssetPostCount,
    report.semiconStocksThesisCount,
    report.semiconStocksTimelineEventCount,
    report.thirdPartyScrapeClaim,
    report.investCopilotFeedTotalClaim,
    report.profileTweetCount,
    report.indexedClaim,
  ].reduce((total, value) => total + (Number(value) || 0), 0);
}

function dedupeSourceReports(reports = []) {
  const byKey = new Map();
  for (const report of reports.filter(Boolean)) {
    const key = `${report.source || ""}|${report.url || ""}`;
    const existing = byKey.get(key);
    if (!existing || reportStrength(report) >= reportStrength(existing)) {
      byKey.set(key, report);
    }
  }
  return [...byKey.values()];
}

function mergeItems(items) {
  const merged = new Map();

  for (const item of items.filter(Boolean)) {
    const key = canonicalItemKey(item);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, {
        ...item,
        id: item.id || key,
        sourceList: sourceList(item),
        sourceUrls: unique([...(item.sourceUrls || []), item.sourceUrl, item.url].filter(Boolean)),
      });
      continue;
    }

    const body = (item.body || "").length > (existing.body || "").length ? item.body : existing.body;
    const title = (item.title || "").length > (existing.title || "").length ? item.title : existing.title;
    const url = statusId(existing.url) ? existing.url : statusId(item.url) ? item.url : item.url || existing.url;
    const symbols = unique([...(existing.symbols || []), ...(item.symbols || [])]);
    const sources = unique([...sourceList(existing), ...sourceList(item)]);
    const sourceUrls = unique([...(existing.sourceUrls || []), ...(item.sourceUrls || []), item.sourceUrl, item.url].filter(Boolean));
    const supercycleAssets = unique([
      ...((existing.supercycle?.assets || []).map((asset) => JSON.stringify(asset))),
      ...((item.supercycle?.assets || []).map((asset) => JSON.stringify(asset))),
    ]).map((asset) => JSON.parse(asset));
    const engagement = mergeEngagement(existing.engagement, item.engagement);
    const investCopilot =
      existing.investCopilot || item.investCopilot
        ? {
            ...(existing.investCopilot || {}),
            ...(item.investCopilot || {}),
            tags: unique([...(existing.investCopilot?.tags || []), ...(item.investCopilot?.tags || [])]),
            facts: unique([...(existing.investCopilot?.facts || []), ...(item.investCopilot?.facts || [])]),
          }
        : undefined;
    const comments = dedupeComments([...(existing.comments || []), ...(item.comments || [])]);
    const sentiment =
      existing.sentiment === "neutral" && item.sentiment && item.sentiment !== "neutral" ? item.sentiment : existing.sentiment;

    const next = {
      ...existing,
      ...item,
      title,
      body,
      url,
      sentiment,
      symbols,
      source: sources.join(" + "),
      sourceList: sources,
      sourceUrls,
      comments,
      theme: classifyTheme(`${existing.theme} ${item.theme} ${title} ${body}`),
      supercycle: supercycleAssets.length
        ? {
            ...(existing.supercycle || {}),
            ...(item.supercycle || {}),
            assets: supercycleAssets,
          }
        : existing.supercycle || item.supercycle,
      engagement,
      investCopilot,
    };
    next.materiality = Math.max(existing.materiality || 0, item.materiality || 0, materialityScore(next));
    merged.set(key, next);
  }

  return [...merged.values()];
}

async function mapWithConcurrency(values, limit, mapper) {
  const results = new Array(values.length);
  let cursor = 0;

  async function worker() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(values[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, values.length) }, worker);
  await Promise.all(workers);
  return results;
}

function applyFxTwitterToItem(item, fxStatus) {
  if (!fxStatus?.text) return item;

  const existingBody = item.body || "";
  const shouldUseFxBody =
    !existingBody ||
    existingBody.length < Math.min(900, fxStatus.text.length) ||
    /原帖种子|回填全文|Search-result excerpt|Seed index|public summaries|linked X posts/i.test(existingBody);
  const body = shouldUseFxBody ? fxStatus.text : existingBody;
  const genericTitle = /原帖种子|status seed|twitter|tweet|thread/i.test(item.title || "") || (item.title || "").endsWith("…");
  const title = genericTitle && fxStatus.text ? firstSentence(fxStatus.text, 180) : item.title || firstSentence(fxStatus.text, 180);
  const symbols = unique([...(item.symbols || []), ...(fxStatus.symbols || [])]);
  const sources = unique([...sourceList(item), "fxtwitter-status"]);
  const sourceUrls = unique([...(item.sourceUrls || []), item.sourceUrl, item.url, fxStatus.url].filter(Boolean));

  const enriched = {
    ...item,
    title,
    body,
    date: fxStatus.date || item.date,
    url: fxStatus.url || item.url,
    symbols,
    source: sources.join(" + "),
    sourceList: sources,
    sourceUrls,
    sentiment: item.sentiment === "neutral" && fxStatus.sentiment !== "neutral" ? fxStatus.sentiment : item.sentiment,
    theme: classifyTheme(`${item.theme || ""} ${fxStatus.theme || ""} ${title} ${body}`),
    engagement: mergeEngagement(item.engagement, fxStatus.engagement),
    fxTwitter: {
      id: fxStatus.id,
      url: fxStatus.url,
      apiUrl: fxStatus.apiUrl,
      author: fxStatus.author,
      enrichedAt: new Date().toISOString(),
    },
  };
  enriched.materiality = Math.max(item.materiality || 0, materialityScore(enriched));
  return enriched;
}

async function enrichItemsWithFxTwitter(items) {
  if (process.env.SERENITY_SKIP_FXTWITTER === "1") {
    return {
      items,
      report: {
        source: "fxtwitter",
        url: "https://api.fxtwitter.com/aleabitoreddit",
        parsedItems: 0,
        skipped: true,
      },
    };
  }

  const statusIds = unique(items.map((item) => statusId(statusUrlFromItem(item))).filter(Boolean));
  const limitedIds = statusIds.slice(0, Math.max(0, FXTWITTER_STATUS_LIMIT));
  const errors = [];
  let profile = null;
  let profileError = "";

  try {
    profile = await fetchFxTwitterProfile();
  } catch (error) {
    profileError = error.message;
  }

  const statusResults = await mapWithConcurrency(limitedIds, Math.max(1, FXTWITTER_CONCURRENCY), async (id) => {
    try {
      return await fetchFxTwitterStatus(id);
    } catch (error) {
      errors.push({ id, error: error.message });
      return null;
    }
  });
  const statusMap = new Map(statusResults.filter(Boolean).map((entry) => [entry.id, entry]));
  const enriched = items.map((item) => {
    const id = statusId(statusUrlFromItem(item));
    return id && statusMap.has(id) ? applyFxTwitterToItem(item, statusMap.get(id)) : item;
  });

  return {
    items: enriched,
    report: {
      source: "fxtwitter",
      url: "https://api.fxtwitter.com/aleabitoreddit",
      indexedClaim: null,
      fxTwitterProfile: profile,
      fxTwitterProfileError: profileError,
      fxTwitterProfileTweetCount: profile?.tweets || null,
      fxTwitterFollowers: profile?.followers || null,
      fxTwitterStatusDiscovered: statusIds.length,
      fxTwitterStatusLimit: FXTWITTER_STATUS_LIMIT,
      fxTwitterStatusFetched: statusMap.size,
      fxTwitterStatusErrorCount: errors.length,
      fxTwitterStatusErrors: errors.slice(0, 20),
      fxTwitterTruncated: limitedIds.length < statusIds.length,
      parsedItems: statusMap.size,
    },
  };
}

async function enrichItems(items) {
  const fxTwitter = await enrichItemsWithFxTwitter(items);
  if (process.env.SERENITY_SKIP_OEMBED === "1") return fxTwitter;
  return {
    ...fxTwitter,
    items: await mapWithConcurrency(fxTwitter.items, Math.max(1, OEMBED_CONCURRENCY), enrichWithOembed),
  };
}

function parseMostMaterial(rendered) {
  const section = rendered.match(/<section class="mb-16">[\s\S]*?Most material[\s\S]*?<\/section>/)?.[0];
  if (!section) return null;
  const title = stripTags(section.match(/<blockquote[\s\S]*?<\/blockquote>/)?.[0]);
  const body = stripTags(section.match(/<p class="mt-6[\s\S]*?<\/p>/)?.[0]);
  const url = section.match(/href="(https:\/\/x\.com\/aleabitoreddit\/status\/\d+)"/)?.[1] || "";
  const date = stripTags(section.match(/<span class="tag tnum"[\s\S]*?<\/span>/)?.[0]);
  const text = `${title} ${body}`;
  const item = {
    id: url.split("/").pop() || "most-material",
    date,
    sentiment: "bull",
    title,
    body,
    symbols: extractSymbols(text),
    theme: classifyTheme(text),
    url,
    source: "eystockholdings-most-material",
  };
  item.materiality = materialityScore(item) + 10;
  return item;
}

function parseRecentTweets(rendered) {
  return [...rendered.matchAll(/<li class="grid grid-cols-12 gap-5 py-5"[\s\S]*?<\/li>/g)].map((match) => {
    const block = match[0];
    const url = block.match(/href="(https:\/\/x\.com\/aleabitoreddit\/status\/\d+)"/)?.[1] || "";
    const title = stripTags(block.match(/<h3[\s\S]*?<\/h3>/)?.[0]);
    const body = stripTags(block.match(/<p[\s\S]*?<\/p>/)?.[0]);
    const date = stripTags(block.match(/<div class="font-display tnum"[\s\S]*?<\/div>/)?.[0]);
    const text = `${title} ${body}`;
    const item = {
      id: url.split("/").pop(),
      date,
      sentiment: sentimentFromBlock(block),
      title,
      body,
      symbols: extractSymbols(text),
      theme: classifyTheme(text),
      url,
      source: "eystockholdings-recent",
    };
    item.materiality = materialityScore(item);
    return item;
  });
}

function parseMilestones(rendered, sourceUrl) {
  return [...rendered.matchAll(/<li class="grid grid-cols-12 gap-6"[\s\S]*?<\/li>/g)].map((match, index) => {
    const block = match[0];
    const date = stripTags(block.match(/<div class="tag md:text-right"[\s\S]*?<\/div>/)?.[0]);
    const title = stripTags(block.match(/<h3[\s\S]*?<\/h3>/)?.[0]);
    const paragraphs = [...block.matchAll(/<p[\s\S]*?<\/p>/g)].map((p) => stripTags(p[0])).filter(Boolean);
    const quote = stripTags(block.match(/<blockquote[\s\S]*?<\/blockquote>/)?.[0]);
    const text = `${title} ${paragraphs.join(" ")} ${quote}`;
    const item = {
      id: `milestone-${index + 1}`,
      date,
      sentiment: sentimentFromBlock(block),
      title,
      body: paragraphs.join(" "),
      quote,
      symbols: extractSymbols(text),
      theme: classifyTheme(text),
      url: sourceUrl,
      source: "eystockholdings-milestone",
    };
    item.materiality = materialityScore(item) + 14;
    return item;
  });
}

function attachSourceUrl(items, sourceUrl) {
  return items.filter(Boolean).map((item) => {
    const itemSourceUrl = item.sourceUrl || sourceUrl;
    return {
      ...item,
      sourceUrl: itemSourceUrl,
      sourceUrls: unique([...(item.sourceUrls || []), itemSourceUrl, sourceUrl].filter(Boolean)),
      sourceList: sourceList(item),
    };
  });
}

function parseEystock(rendered, sourceUrl) {
  const indexedClaim = Number(stripTags(rendered.match(/([0-9]+)<!-- --> tweets indexed/)?.[0]).match(/\d+/)?.[0]) || null;
  const items = [parseMostMaterial(rendered), ...parseRecentTweets(rendered), ...parseMilestones(rendered, sourceUrl)];
  return {
    label: "eystockholdings",
    indexedClaim,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function parseSensei(rendered, sourceUrl) {
  const meta = stripTags(rendered.match(/<div class="meta">([\s\S]*?)<\/div>/)?.[0]);
  const indexedClaim = Number(meta.match(/\/\s*([0-9]+)\s+tweets/i)?.[1]) || null;
  const generatedAt = meta.match(/generated\s+([^/]+?)\s+\/\//i)?.[1]?.trim() || "";
  const coverageWindow = meta.match(/\/\/\s*([0-9-]+\s*~\s*[0-9-]+)/)?.[1] || "";
  const cards = [...rendered.matchAll(/<div class="card" style="border-color:#[0-9a-fA-F]+">[\s\S]*?<\/div>\s*<\/div>/g)].map(
    (match) => match[0]
  );

  const items = cards
    .map((block, index) => {
      const tickerLabel = stripTags(block.match(/<span class="ticker"[\s\S]*?<\/span>(?:\s*<span class="market-tag">[\s\S]*?<\/span>)?/)?.[0]);
      const rationale = stripTags(block.match(/<div class="rationale">([\s\S]*?)<\/div>/)?.[0]);
      const quote = stripTags(block.match(/<div class="quote">([\s\S]*?)<\/div>/)?.[0]);
      const bullScore = (block.match(/bar-fill-bull/g) || []).length;
      const bearScore = (block.match(/bar-fill-bear/g) || []).length;
      const sentiment = bearScore > bullScore ? "bear" : bullScore > bearScore ? "bull" : "neutral";
      const intensity = Math.max(bullScore, bearScore);
      const symbols = unique([...symbolsFromTickerLabel(tickerLabel), ...extractSymbols(`${tickerLabel} ${rationale} ${quote}`)]);
      if (!tickerLabel || !rationale || !symbols.length) return null;

      const item = {
        id: `sensei-${symbols[0]}-${index + 1}`,
        date: generatedAt || coverageWindow,
        sentiment,
        title: `${tickerLabel} · ${firstSentence(rationale, 120)}`,
        body: `${rationale}${quote ? ` ${quote}` : ""}`,
        quote,
        symbols,
        theme: classifyTheme(`${tickerLabel} ${rationale} ${quote}`),
        url: sourceUrl,
        source: "serenity-sensei-analysis",
        sensei: {
          coverageWindow,
          generatedAt,
          tweetWindowCount: indexedClaim,
          intensity,
          tickerLabel,
        },
      };
      item.materiality = Math.min(100, materialityScore(item) + intensity * 8 + (indexedClaim ? 6 : 0));
      return item;
    })
    .filter(Boolean);

  return {
    label: "serenity-sensei",
    indexedClaim,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function parseSerenitySkillTweetItems(rendered = "", sourceUrl = "") {
  return [...rendered.matchAll(/\{body:"((?:\\.|[^"\\])*)",likes:([0-9]+),date:"([^"]+)",url:"([^"]+)"\}/g)]
    .map((match, index) => {
      const body = decodeJsonFragment(match[1]);
      const likes = metricNumber(match[2]);
      const date = match[3];
      const url = canonicalStatusUrl(match[4]);
      const symbols = extractSymbols(body);
      const sentiment = sentimentFromBlock(body);
      const item = {
        id: statusId(url) || `serenity-skill-tweet-${index + 1}`,
        date,
        sentiment,
        title: firstSentence(body, 180),
        body,
        symbols,
        theme: classifyTheme(body),
        url,
        source: "serenity-skill-tweet",
        sourceUrl,
        sourceUrls: unique([sourceUrl, url]),
        oembedNotNeeded: true,
        engagement: { likes },
      };
      item.materiality = Math.min(100, materialityScore(item) + 12 + Math.min(14, likes / 500));
      return item;
    })
    .filter(Boolean);
}

function parseSerenitySkillWikiItems(rendered = "", sourceUrl = "") {
  return [
    ...rendered.matchAll(
      /\{t:"([^"]+)",m:([0-9]+),s:"([^"]+)",desc_en:"((?:\\.|[^"\\])*)",desc_zh:"((?:\\.|[^"\\])*)",tw:\[([\s\S]*?)\]\}/g
    ),
  ]
    .map((match) => {
      const symbol = match[1];
      const mentions = metricNumber(match[2]);
      const sentiment = match[3] === "bear" ? "bear" : match[3] === "bull" ? "bull" : "neutral";
      const descEn = decodeJsonFragment(match[4]);
      const descZh = decodeJsonFragment(match[5]);
      const tweets = [...match[6].matchAll(/\{c:"((?:\\.|[^"\\])*)",l:([0-9]+),d:"([^"]+)"\}/g)].map((tweet) => ({
        content: decodeJsonFragment(tweet[1]),
        likes: metricNumber(tweet[2]),
        date: tweet[3],
      }));
      const body = [descZh, descEn, ...tweets.map((tweet) => tweet.content)].filter(Boolean).join(" ");
      const item = {
        id: `serenity-skill-wiki-${symbol}`,
        date: tweets.map((tweet) => tweet.date).sort().at(-1) || "",
        sentiment,
        title: `$${symbol} · ${firstSentence(descZh || descEn, 120)}`,
        body,
        symbols: unique([symbol, ...extractSymbols(body)]),
        theme: classifyTheme(body),
        url: sourceUrl,
        source: "serenity-skill-wiki",
        skillWiki: {
          mentions,
          tweets,
        },
        engagement: {
          likes: Math.max(0, ...tweets.map((tweet) => tweet.likes)),
        },
      };
      item.materiality = Math.min(100, materialityScore(item) + 10 + Math.min(18, mentions / 45));
      return item;
    })
    .filter(Boolean);
}

function parseMarkdownSections(markdown = "", heading = "") {
  const start = markdown.indexOf(`## ${heading}`);
  if (start < 0) return [];
  const rest = markdown.slice(start + heading.length + 3);
  const next = rest.search(/\n##\s+/);
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/\n###\s+(?:[0-9]+\.\s+)?([^\n]+)\n([\s\S]*?)(?=\n###\s+(?:[0-9]+\.\s+)?[^\n]+\n|\n##\s+|$)/g)].map(
    (match) => ({
      title: stripTags(match[1]).trim(),
      body: stripTags(match[2]).replace(/\s+/g, " ").trim(),
    })
  );
}

function parseMarkdownBlock(markdown = "", heading = "") {
  const start = markdown.indexOf(`## ${heading}`);
  if (start < 0) return "";
  const rest = markdown.slice(start + heading.length + 3);
  const next = rest.search(/\n##\s+/);
  return stripTags(next >= 0 ? rest.slice(0, next) : rest).replace(/\s+/g, " ").trim();
}

function parseSerenitySkillMarkdown(markdown = "", sourceUrl = "") {
  const mentalModels = parseMarkdownSections(markdown, "Mental Models");
  const decisionBody = parseMarkdownBlock(markdown, "Decision Heuristics");
  const coreThesisBody = parseMarkdownBlock(markdown, "Core Investment Thesis (as of 2026)");
  const antiBody = parseMarkdownBlock(markdown, "Honest Limits");
  const sectionItems = [
    ...mentalModels.map((section, index) => ({
      id: `serenity-skill-model-${index + 1}`,
      title: section.title,
      body: section.body,
      sentiment: /bear|anti|veto|exit|wrong|risk|FOMO/i.test(section.title) ? "neutral" : "bull",
      theme: classifyTheme(`${section.title} ${section.body}`),
      weightBoost: 14,
    })),
    decisionBody
      ? {
          id: "serenity-skill-decision-heuristics",
          title: "Decision Heuristics",
          body: decisionBody,
          sentiment: "neutral",
          theme: "general",
          weightBoost: 18,
        }
      : null,
    coreThesisBody
      ? {
          id: "serenity-skill-core-thesis",
          title: "Core Investment Thesis",
          body: coreThesisBody,
          sentiment: "bull",
          theme: "cpo-silicon-photonics",
          weightBoost: 20,
        }
      : null,
    antiBody
      ? {
          id: "serenity-skill-limits",
          title: "Honest Limits",
          body: antiBody,
          sentiment: "neutral",
          theme: "general",
          weightBoost: 8,
        }
      : null,
  ].filter(Boolean);

  return sectionItems.map((section) => {
    const item = {
      id: section.id,
      date: "2026-05",
      sentiment: section.sentiment,
      title: section.title,
      body: section.body,
      symbols: extractSymbols(section.body),
      theme: section.theme,
      url: sourceUrl,
      source: "serenity-skill-methodology",
      oembedNotNeeded: true,
    };
    item.materiality = Math.min(100, materialityScore(item) + section.weightBoost);
    return item;
  });
}

function parseSerenitySkillReturnClaim(rendered = "") {
  return (
    rendered.match(/<span class="stat-num">([^<]+)<\/span>\s*<div class="stat-label">(?:2026\s*)?YTD/i)?.[1] ||
    rendered.match(/Track record\s*\(2026 YTD as of May\):\*\*\s*([0-9,.]+%[+]?)/i)?.[1] ||
    rendered.match(/\bYTD:\s*([0-9,.]+%[+]?)/i)?.[1] ||
    ""
  );
}

function parseSerenitySkill(rendered, sourceUrl) {
  const scrapeClaim = parseMetricNumber(rendered.match(/Distilled from\s+([0-9,]+)\s+tweets/i)?.[1]) || null;
  const returnClaim = parseSerenitySkillReturnClaim(rendered);
  const coverageWindow = rendered.match(/snapshot through\s+([^.\n]+)/i)?.[1]?.trim() || "through May 2026";
  const htmlItems = [...parseSerenitySkillTweetItems(rendered, sourceUrl), ...parseSerenitySkillWikiItems(rendered, sourceUrl)];
  const markdownItems = parseSerenitySkillMarkdown(rendered, sourceUrl);
  const items = htmlItems.length ? htmlItems : markdownItems;

  return {
    label: "serenity-skill",
    indexedClaim: null,
    thirdPartyScrapeClaim: scrapeClaim,
    coverageWindow,
    returnClaim,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function parseCompactCount(value = "") {
  const clean = String(value).replace(/,/g, "").trim().toUpperCase();
  const match = clean.match(/([0-9]+(?:\.[0-9]+)?)(K|M)?/);
  if (!match) return null;
  const number = Number(match[1]);
  const multiplier = match[2] === "M" ? 1_000_000 : match[2] === "K" ? 1_000 : 1;
  return Number.isFinite(number) ? Math.round(number * multiplier) : null;
}

function parseInstalker(rendered, sourceUrl) {
  const description = decodeHtml(rendered.match(/<meta name="description" content="([^"]+)"/)?.[1] || "");
  const profileTweetCount = parseCompactCount(description.match(/([0-9.,]+K?)\s+Tweets/i)?.[1] || "");
  const blocks = [...rendered.matchAll(/<div class="activity-posts">[\s\S]*?(?=<div class="activity-posts">|<div class="main-loader|<div class="col-md-3|<\/body>)/g)].map(
    (match) => match[0]
  );

  const items = blocks
    .map((block, index) => {
      const id = block.match(/href="\/aleabitoreddit\/status\/(\d+)"/)?.[1] || "";
      const date = stripTags(block.match(/href="\/aleabitoreddit\/status\/\d+">([^<]+)<\/a>/)?.[1] || "");
      const descBlock = block.match(/<div class="activity-descp">([\s\S]*?)<\/div>/)?.[1] || "";
      const body = stripTags(descBlock).replace(/\s+View Details\s*$/i, "").trim();
      if (!id || !body) return null;
      const item = {
        id,
        date,
        sentiment: sentimentFromBlock(body),
        title: firstSentence(body),
        body,
        symbols: extractSymbols(body),
        theme: classifyTheme(body),
        url: `https://x.com/aleabitoreddit/status/${id}`,
        source: "instalker-recent",
        mirrorUrl: `https://instalker.org/aleabitoreddit/status/${id}`,
      };
      item.materiality = materialityScore(item) + (index < 5 ? 5 : 0);
      return item;
    })
    .filter(Boolean);

  return {
    label: "instalker",
    indexedClaim: null,
    profileTweetCount,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function cleanInstalkerReaderText(markdown = "") {
  return cleanTwiscanText(markdown)
    .replace(/^####\s+.+$/gim, " ")
    .replace(/\b\d+[KMB]?\s+Followers\b/gi, " ")
    .replace(/\b\d+[KMB]?\s+Following\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseInstalkerReader(rendered = "", sourceUrl = "") {
  const profileMarker =
    /\[!\[Image\s+\d+:[^\]]*aleabitoreddit Profile Picture[^\]]*\]\([^)]+\)\]\(https?:\/\/instalker\.org\/aleabitoreddit\)/gi;
  const chunks = rendered.split(profileMarker).slice(1);
  const items = chunks
    .map((chunk, index) => {
      const postChunk = chunk.split(/\n\[!\[Image\s+\d+:/)[0] || chunk;
      const body = cleanInstalkerReaderText(postChunk)
        .replace(/\s*####\s+\[[^\]]+\]\([^)]+\).*$/i, "")
        .trim();
      if (body.length < 24 || /^@\w+\s*$/i.test(body)) return null;
      const mirrorId = `instalker-reader-${stableHash(body.slice(0, 2000))}`;
      const item = {
        id: mirrorId,
        date: "",
        sentiment: sentimentFromBlock(body),
        title: firstSentence(body, 180),
        body,
        symbols: extractSymbols(body),
        theme: classifyTheme(body),
        url: `https://instalker.org/aleabitoreddit#reader-${index + 1}`,
        source: "instalker-reader-mirror",
        sourceUrl,
        sourceUrls: unique([sourceUrl, "https://instalker.org/aleabitoreddit"]),
        mirrorUrl: "https://instalker.org/aleabitoreddit",
        instalkerReader: {
          mirrorId,
          mirroredVia: "jina-reader",
          index: index + 1,
        },
      };
      item.materiality = materialityScore(item) + (index < 12 ? 6 : 0);
      return item;
    })
    .filter(Boolean);

  return {
    label: "instalker-reader",
    indexedClaim: null,
    instalkerReaderPostCount: items.length,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function cleanTwiscanText(markdown = "") {
  return decodeHtml(markdown)
    .replace(/^Title:.*$/gim, "")
    .replace(/^URL Source:.*$/gim, "")
    .replace(/^Markdown Content:\s*/gim, "")
    .replace(/!\[Image\s+\d+\]\([^)]+\)/g, " ")
    .replace(/\[!\[Image\s+\d+\]\([^)]+\)\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\bShow more\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTwiscan(rendered = "", sourceUrl = "") {
  const profileMarker = /\[!\[Image\s+\d+\]\([^)]+\)\]\(https?:\/\/twiscan\.com\/en\/x\/aleabitoreddit\)/gi;
  const chunks = rendered.split(profileMarker).slice(1);
  const items = chunks
    .map((chunk, index) => {
      const body = cleanTwiscanText(chunk);
      if (body.length < 24 || !/[#$@A-Z]/.test(body)) return null;
      const id = `twiscan-${stableHash(body.slice(0, 2000))}`;
      const symbols = extractSymbols(body);
      const item = {
        id,
        date: "",
        sentiment: sentimentFromBlock(body),
        title: firstSentence(body, 180),
        body,
        symbols,
        theme: classifyTheme(body),
        url: `https://twiscan.com/en/x/aleabitoreddit#${id}`,
        source: "twiscan-recent-mirror",
        sourceUrl,
        sourceUrls: unique([sourceUrl, "https://twiscan.com/en/x/aleabitoreddit"]),
        oembedNotNeeded: true,
        twiscan: {
          mirrorId: id,
          profileUrl: "https://twiscan.com/en/x/aleabitoreddit",
          mirroredVia: sourceUrl.includes("r.jina.ai") ? "jina-reader" : "direct",
          index: index + 1,
          note: "Mirror text does not expose stable X status IDs; used for strategy distillation only.",
        },
      };
      item.materiality = Math.min(100, materialityScore(item) + (index < 8 ? 10 : 4) + Math.min(10, symbols.length * 2));
      return item;
    })
    .filter(Boolean);

  return {
    label: "twiscan",
    indexedClaim: null,
    twiscanPostCount: items.length,
    items: attachSourceUrl(mergeItems(items), sourceUrl),
  };
}

function instalkerLoadMoreConfig(rendered = "") {
  const tag = rendered.match(/<[^>]*class="[^"]*add-nw-event[^"]*"[^>]*>/)?.[0] || "";
  return {
    cursor: attr(tag, "data-cursor"),
    data: attr(tag, "data-query"),
    page: Number(attr(tag, "data-ec")) || 2,
  };
}

async function fetchInstalkerHtmlWithCookies(sourceUrl, cookieFile) {
  const { stdout } = await execFileAsync(
    "curl",
    ["-L", "-sS", "--max-time", String(INSTALKER_TIMEOUT_MS), "-A", UA, "-c", cookieFile, "-b", cookieFile, "-H", "Accept: text/html,*/*", sourceUrl],
    {
      maxBuffer: 12 * 1024 * 1024,
      timeout: Math.max(8, INSTALKER_TIMEOUT_MS + 6) * 1000,
      killSignal: "SIGKILL",
    }
  );
  return stdout;
}

async function fetchInstalkerLoadMorePage({ page, cursor, data, cookieFile }) {
  const { stdout } = await execFileAsync(
    "curl",
    [
      "-L",
      "-sS",
      "--max-time",
      String(INSTALKER_TIMEOUT_MS),
      "-A",
      UA,
      "-c",
      cookieFile,
      "-b",
      cookieFile,
      "-H",
      "Accept: application/json,text/plain,*/*",
      "-H",
      "Content-Type: application/x-www-form-urlencoded; charset=UTF-8",
      "-H",
      "Origin: https://instalker.org",
      "-H",
      "Referer: https://instalker.org/aleabitoreddit",
      "-H",
      "X-Requested-With: XMLHttpRequest",
      "--data-urlencode",
      `page=${page}`,
      "--data-urlencode",
      `cursor=${cursor}`,
      "--data-urlencode",
      `data=${data}`,
      "--data-urlencode",
      "action=profile",
      "https://instalker.org/service/api",
    ],
    {
      maxBuffer: 12 * 1024 * 1024,
      timeout: Math.max(8, INSTALKER_TIMEOUT_MS + 6) * 1000,
      killSignal: "SIGKILL",
    }
  );
  return JSON.parse(stdout);
}

function normalizeInstalkerApiTweet(tweet = {}, id = "", page = 0) {
  const screenName = String(tweet.core?.screen_name || "").toLowerCase();
  if (screenName && screenName !== "aleabitoreddit") return null;
  const text = decodeHtml(tweet.full_text || tweet.text || "");
  const statusId = String(id || tweet.id_str || tweet.rest_id || tweet.id || "");
  if (!statusId || !text) return null;
  const entitySymbols = (tweet.entities?.symbols || []).map((entry) => entry.text).filter(Boolean);
  const symbols = unique([...entitySymbols, ...extractSymbols(text)]);
  const item = {
    id: statusId,
    date: normalizeTwitterDate(tweet.created_at),
    sentiment: sentimentFromBlock(text),
    title: firstSentence(text, 180),
    body: text,
    symbols,
    theme: classifyTheme(text),
    url: `https://x.com/aleabitoreddit/status/${statusId}`,
    source: "instalker-load-more",
    sourceUrl: "https://instalker.org/aleabitoreddit",
    sourceUrls: unique(["https://instalker.org/aleabitoreddit", `https://instalker.org/aleabitoreddit/status/${statusId}`]),
    mirrorUrl: `https://instalker.org/aleabitoreddit/status/${statusId}`,
    oembedNotNeeded: true,
    engagement: {
      likes: Number(tweet.favorite_count) || 0,
      retweets: Number(tweet.retweet_count) || 0,
      replies: Number(tweet.reply_count) || 0,
      views: parseMetricNumber(tweet.view_count) || 0,
      quotes: Number(tweet.quote_count) || 0,
      bookmarks: Number(tweet.bookmark_count) || 0,
    },
    instalker: {
      page,
      isRetweet: Boolean(tweet.is_retweet),
      isQuoteStatus: Boolean(tweet.is_quote_status),
      conversationId: tweet.conversation_id_str || "",
    },
  };
  item.materiality = Math.min(100, materialityScore(item) + Math.min(10, Math.max(0, 6 - page)));
  return item;
}

function instalkerPayloadTweets(payload = {}) {
  return {
    ...(payload.pinTweet || {}),
    ...(payload.tweets || {}),
  };
}

async function parseInstalkerSource(sourceUrl) {
  const cookieFile = path.join(os.tmpdir(), `serenity-instalker-${Date.now()}-${Math.random().toString(16).slice(2)}.cookies`);
  try {
    const html = await fetchInstalkerHtmlWithCookies(sourceUrl, cookieFile);
    const parsed = parseInstalker(html, sourceUrl);
    const config = instalkerLoadMoreConfig(html);
    const apiItemsById = new Map();
    const errors = [];
    let rawFetched = 0;
    const rawIds = new Set();
    let cursor = config.cursor;
    let page = config.page;

    for (let fetchedPages = 0; fetchedPages < INSTALKER_LOAD_MORE_PAGES && cursor && config.data; fetchedPages += 1) {
      try {
        const payload = await fetchInstalkerLoadMorePage({ page, cursor, data: config.data, cookieFile });
        const tweets = instalkerPayloadTweets(payload);
        const tweetEntries = Object.entries(tweets);
        rawFetched += tweetEntries.length;
        tweetEntries.forEach(([tweetId]) => {
          if (/^\d{12,}$/.test(String(tweetId))) rawIds.add(String(tweetId));
        });
        tweetEntries.forEach(([tweetId, tweet]) => {
          const item = normalizeInstalkerApiTweet(tweet, tweetId, page);
          if (item) apiItemsById.set(item.id, item);
        });
        cursor = payload.cursor || "";
        page += 1;
        if (!Object.keys(tweets).length) break;
      } catch (error) {
        errors.push({ page, error: error.message });
        break;
      }
    }

    const apiItems = [...apiItemsById.values()];
    return {
      ...parsed,
      instalkerLoadMorePages: Math.max(0, page - config.page),
      instalkerLoadMoreRawFetched: rawFetched,
      instalkerLoadMoreRawUniqueFetched: rawIds.size,
      instalkerLoadMoreFetched: apiItems.length,
      instalkerLoadMoreErrorCount: errors.length,
      instalkerLoadMoreErrors: errors.slice(0, 5),
      items: attachSourceUrl(mergeItems([...parsed.items, ...apiItems]), sourceUrl),
    };
  } finally {
    try {
      fs.unlinkSync(cookieFile);
    } catch {
      // temp cookie file may not exist if the first request failed
    }
  }
}

function parseSupercycleAssets(block) {
  return [...block.matchAll(/<span class="sym pos-sym">([^<]+)<\/span>[\s\S]*?<span class="name pos-name" title="([^"]*)">[\s\S]*?<span class="dir pos-dir ([^"]+)">([^<]+)<\/span>[\s\S]*?<span class="wt pos-wt">([^<]+)<\/span>/g)].map(
    (match) => ({
      symbol: stripTags(match[1]).toUpperCase(),
      name: decodeHtml(match[2]),
      direction: stripTags(match[4]).toLowerCase(),
      weight: parseWeight(match[5]),
      weightLabel: stripTags(match[5]),
    })
  );
}

function parseSupercycleBody(block) {
  const direct = block.match(/<div class="fr-text post-body(?: [^"]*)?">([\s\S]*?)<\/div>/)?.[1];
  const expanded = block.match(/<details class="fr-text post-body[\s\S]*?<div class="fr-post-full">([\s\S]*?)<\/div>/)?.[1];
  const preview = block.match(/<summary><span class="fr-post-preview">([\s\S]*?)<\/span>/)?.[1];
  return stripTags(direct || expanded || preview || "");
}

function parseSupercycle(rendered, sourceUrl) {
  const articles = [...rendered.matchAll(/<article class="fr-row feed-row thesis[\s\S]*?<\/article>/g)].map((match) => match[0]);
  const items = articles
    .filter(
      (block) =>
        block.includes("/c/aleabitoreddit") ||
        block.includes("caller_handle&quot;:&quot;aleabitoreddit&quot;") ||
        block.includes('caller_handle":"aleabitoreddit"')
    )
    .map((block, index) => {
      const url = block.match(/href="(https:\/\/x\.com\/aleabitoreddit\/status\/\d+)"/)?.[1] || "";
      const date = block.match(/<time class="post-age" datetime="([^"]+)"/)?.[1] || "";
      const tagTheme = stripTags(block.match(/<span class="post-tag-theme">([^<]+)<\/span>/)?.[0]);
      const body = parseSupercycleBody(block);
      const assets = parseSupercycleAssets(block);
      const text = `${tagTheme} ${body} ${assets.map((asset) => `${asset.symbol} ${asset.name}`).join(" ")}`;
      const longWeight = assets
        .filter((asset) => asset.direction === "long")
        .reduce((total, asset) => total + asset.weight, 0);
      const shortWeight = assets
        .filter((asset) => asset.direction === "short")
        .reduce((total, asset) => total + asset.weight, 0);
      const item = {
        id: statusId(url) || `supercycle-${index + 1}`,
        date,
        sentiment: shortWeight > longWeight ? "bear" : longWeight > 0 ? "bull" : "neutral",
        title: firstSentence(body),
        body,
        symbols: unique([...extractSymbols(text), ...assets.map((asset) => asset.symbol)]),
        theme: classifyTheme(text),
        url,
        source: "supercycle-thesis",
        supercycle: {
          theme: tagTheme,
          assets,
          longWeight,
          shortWeight,
        },
      };
      item.materiality = materialityScore(item) + (assets.length ? 12 : 0);
      return item;
    });

  return {
    label: "supercycle",
    indexedClaim: null,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function parseSupercycleCallerFeed(rendered, sourceUrl) {
  const articles = [...rendered.matchAll(/<article class="fr-row[\s\S]*?<\/article>/g)].map((match) => match[0]);
  const items = articles
    .filter((block) => block.includes("/c/aleabitoreddit") || block.includes("caller_handle&quot;:&quot;aleabitoreddit&quot;"))
    .map((block, index) => {
      const url = block.match(/href="(https:\/\/x\.com\/aleabitoreddit\/status\/\d+)"/)?.[1] || "";
      const date = block.match(/<time class="post-age" datetime="([^"]+)"/)?.[1] || "";
      const kind = attr(block, "data-feed-kind") || (block.includes("post-skipped") ? "skipped" : "thesis");
      const tagTheme =
        stripTags(block.match(/<span class="post-tag-theme">([^<]+)<\/span>/)?.[0]) ||
        stripTags(block.match(/<span class="post-tag-skipped">[\s\S]*?<\/span>/)?.[0]);
      const body = parseSupercycleBody(block);
      const assets = parseSupercycleAssets(block);
      const text = `${tagTheme} ${body} ${assets.map((asset) => `${asset.symbol} ${asset.name}`).join(" ")}`;
      const longWeight = assets
        .filter((asset) => asset.direction === "long")
        .reduce((total, asset) => total + asset.weight, 0);
      const shortWeight = assets
        .filter((asset) => asset.direction === "short")
        .reduce((total, asset) => total + asset.weight, 0);
      const sentiment =
        kind === "skipped"
          ? sentimentFromBlock(body)
          : shortWeight > longWeight
            ? "bear"
            : longWeight > 0
              ? "bull"
              : sentimentFromBlock(body);
      const item = {
        id: statusId(url) || `supercycle-caller-feed-${index + 1}`,
        date,
        sentiment,
        title: firstSentence(body),
        body,
        symbols: unique([...extractSymbols(text), ...assets.map((asset) => asset.symbol)]),
        theme: classifyTheme(text),
        url,
        source: kind === "skipped" ? "supercycle-caller-skipped" : "supercycle-caller-feed",
        oembedNotNeeded: true,
        supercycle: {
          kind,
          theme: tagTheme,
          assets,
          longWeight,
          shortWeight,
        },
      };
      item.materiality = Math.max(
        18,
        Math.min(100, materialityScore(item) + (kind === "thesis" ? 12 : -4) + (assets.length ? 8 : 0))
      );
      return item;
    })
    .filter((item) => item.url && item.body);

  return attachSourceUrl(items, sourceUrl);
}

function parseSupercycleCallerAssets(rendered, sourceUrl) {
  const rows = [...rendered.matchAll(/<details class="asset-shell"[\s\S]*?<\/details>/g)].map((match) => match[0]);
  const items = [];
  let assetPostCount = 0;
  let namedAssetCount = 0;

  for (const row of rows) {
    const ticker = attr(row, "data-asset-ticker");
    if (!ticker) continue;

    const props = parseJsonAttr(row, "data-analytics-toggle-props") || {};
    const sourceProvenance = attr(row, "data-asset-source") || props.source_provenance || "unknown";
    const stance = props.stance || row.match(/stance-(long|short|neutral)/)?.[1] || "neutral";
    const sentiment = stanceToSentiment(stance);
    const name = attr(row, "data-search-name") || stripTags(row.match(/<span class="asset-desktop-cell col-name[\s\S]*?<\/span>/)?.[0]);
    const firstCalledAt = attr(row, "data-asset-first-called-at");
    const lastUpdatedAt = attr(row, "data-asset-last-updated-at");
    const thesisCount = Number(attr(row, "data-asset-thesis-count")) || 0;
    const returnLabel = stripTags(row.match(/<span class="asset-return[^"]*">[\s\S]*?<\/span>/)?.[0]);
    const summary = stripTags(row.match(/<div class="d-synth-body">([\s\S]*?)<\/div>/)?.[1] || "");
    const claims = [
      ...(
        row.match(/<ul class="d-synth-claims">[\s\S]*?<\/ul>/)?.[0] || ""
      ).matchAll(/<li>([\s\S]*?)<\/li>/g),
    ].map((match) => stripTags(match[1]));
    const assetUrl = absoluteSupercycleUrl(`/assets/${ticker}`, sourceUrl);

    if (sourceProvenance === "named") namedAssetCount += 1;

    if (summary || claims.length) {
      const summaryItem = {
        id: `supercycle-caller-asset-summary-${ticker}`,
        date: lastUpdatedAt || firstCalledAt,
        sentiment,
        title: `${ticker} · Supercycle caller asset summary`,
        body: [
          summary,
          ...claims.map((claim) => `关键断言：${claim}`),
          thesisCount ? `Supercycle caller asset table records ${thesisCount} linked Serenity theses/posts.` : "",
          returnLabel ? `Observed return: ${returnLabel}.` : "",
        ]
          .filter(Boolean)
          .join(" "),
        symbols: unique([ticker, ...extractSymbols(`${summary} ${claims.join(" ")} ${name}`)]),
        theme: classifyTheme(`${ticker} ${name} ${summary} ${claims.join(" ")}`),
        url: assetUrl,
        source: "supercycle-caller-assets",
        oembedNotNeeded: true,
        supercycle: {
          asset: ticker,
          assetPath: `/assets/${ticker}`,
          name,
          sourceProvenance,
          stance,
          currentStance: stance,
          thesisCount,
          firstCalledAt,
          lastUpdatedAt,
          returnLabel,
          claims,
          summary,
        },
      };
      summaryItem.materiality = Math.min(
        100,
        materialityScore(summaryItem) +
          (sourceProvenance === "named" ? 16 : sourceProvenance === "proxy" ? 8 : 5) +
          Math.min(8, thesisCount)
      );
      items.push(summaryItem);
    }

    const postMap = new Map();
    const postPattern = /<a class="(?:d|m)-post-snippet" href="(https:\/\/x\.com\/aleabitoreddit\/status\/\d+)"([^>]*)>([\s\S]*?)<\/a>/g;
    for (const match of row.matchAll(postPattern)) {
      const url = canonicalStatusUrl(match[1]);
      const id = statusId(url);
      const titleAttr = decodeHtml(match[2].match(/title="([^"]*)"/)?.[1] || "");
      const snippet = stripTags(match[3]).replace(/^𝕏\s*/, "");
      const body = titleAttr.length > snippet.length ? titleAttr : snippet;
      const segment = row.slice(match.index, match.index + 2200);
      const thesisTitle = stripTags(segment.match(/<a class="(?:d|m)-post-thesis-link"[\s\S]*?<\/a>/)?.[0]);
      const existing = postMap.get(id);
      if (!existing || body.length > existing.body.length) {
        postMap.set(id, {
          id,
          url,
          body,
          thesisTitle,
        });
      }
    }

    assetPostCount += postMap.size;
    for (const post of postMap.values()) {
      const text = `${ticker} ${name} ${post.thesisTitle} ${post.body}`;
      const item = {
        id: post.id,
        date: lastUpdatedAt || firstCalledAt,
        sentiment,
        title: post.thesisTitle || firstSentence(post.body),
        body: post.body,
        symbols: unique([ticker, ...extractSymbols(text)]),
        theme: classifyTheme(text),
        url: post.url,
        source: "supercycle-caller-assets",
        oembedNotNeeded: true,
        supercycle: {
          asset: ticker,
          assetPath: `/assets/${ticker}`,
          name,
          sourceProvenance,
          stance,
          currentStance: stance,
          thesisTitle: post.thesisTitle,
          thesisCount,
          firstCalledAt,
          lastUpdatedAt,
          returnLabel,
        },
      };
      item.materiality = Math.min(
        100,
        materialityScore(item) +
          (sourceProvenance === "named" ? 12 : sourceProvenance === "proxy" ? 7 : 4) +
          (post.thesisTitle ? 4 : 0)
      );
      items.push(item);
    }
  }

  return {
    assetCount: rows.length,
    namedAssetCount,
    assetPostCount,
    items: attachSourceUrl(items, sourceUrl),
  };
}

async function parseSupercycleCaller(sourceUrl) {
  const [feedResult, assetsResult] = await Promise.allSettled([
    fetchSupercycleCallerTabPages(
      "feed",
      {
        feed: "all",
        limit: SUPERCYCLE_CALLER_LIMIT,
      },
      sourceUrl,
      SUPERCYCLE_CALLER_TIMEOUT_MS
    ),
    fetchSupercycleCallerTabPages(
      "assets",
      {
        source: SUPERCYCLE_CALLER_ASSET_SOURCE,
        sort: "updated",
        direction: "desc",
        limit: SUPERCYCLE_CALLER_ASSET_LIMIT,
      },
      sourceUrl,
      SUPERCYCLE_CALLER_TIMEOUT_MS
    ),
  ]);
  const feed =
    feedResult.status === "fulfilled"
      ? feedResult.value
      : {
          pages: [],
          html: "",
          truncated: false,
          error: feedResult.reason?.message || String(feedResult.reason),
        };
  const assets =
    assetsResult.status === "fulfilled"
      ? assetsResult.value
      : {
          pages: [],
          html: "",
          truncated: false,
          error: assetsResult.reason?.message || String(assetsResult.reason),
        };
  const feedItems = parseSupercycleCallerFeed(feed.html, sourceUrl);
  const assetSummary = parseSupercycleCallerAssets(assets.html, sourceUrl);
  const items = mergeItems([...feedItems, ...assetSummary.items]);

  return {
    label: "supercycle-caller",
    indexedClaim: null,
    callerFeedPostCount: feedItems.length,
    callerFeedPages: feed.pages.length,
    callerFeedTruncated: feed.truncated,
    callerFeedError: feed.error,
    callerAssetCount: assetSummary.assetCount,
    callerNamedAssetCount: assetSummary.namedAssetCount,
    callerAssetPostCount: assetSummary.assetPostCount,
    callerAssetPages: assets.pages.length,
    callerAssetSource: SUPERCYCLE_CALLER_ASSET_SOURCE,
    callerAssetsTruncated: assets.truncated,
    callerAssetError: assets.error,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function parseSupercycleAsset(rendered, sourceUrl) {
  const raw = rendered.match(/<script id="asset-page-bootstrap" type="application\/json">([\s\S]*?)<\/script>/)?.[1];
  if (!raw) {
    return {
      label: "supercycle-asset",
      indexedClaim: null,
      assetFeedPostCount: 0,
      items: [],
    };
  }

  let data = null;
  try {
    data = JSON.parse(raw);
  } catch {
    data = JSON.parse(decodeHtml(raw));
  }

  const ticker = data.ticker || sourceUrl.split("/").pop() || "asset";
  const caller = (data.callers || []).find((entry) => entry.caller?.handle?.toLowerCase() === "aleabitoreddit");
  if (!caller) {
    return {
      label: `supercycle-asset:${ticker}`,
      indexedClaim: null,
      assetFeedPostCount: 0,
      items: [],
    };
  }

  const rawPosts = [
    ...(caller.posts || []),
    ...(caller.regimes || []).flatMap((regime) => regime.posts || []),
  ];
  const posts = mergeItems(
    rawPosts
      .filter((post) => post?.text && post?.url)
      .map((post) => {
        const text = `${post.thesisTitle || ""} ${post.text}`;
        const item = {
          id: post.xPostId || post.id,
          date: post.createdAt,
          sentiment: post.stance === "short" ? "bear" : post.stance === "long" ? "bull" : "neutral",
          title: post.thesisTitle || firstSentence(post.text),
          body: post.text,
          symbols: unique([ticker, ...extractSymbols(text)]),
          theme: classifyTheme(text),
          url: canonicalStatusUrl(post.url),
          source: `supercycle-asset-${ticker}`,
          oembedNotNeeded: true,
          supercycle: {
            asset: ticker,
            assetPath: data.assetPath,
            sourceProvenance: post.sourceProvenance || caller.sourceProvenance,
            stance: post.stance || caller.currentStance,
            portfolioPath: post.portfolioPath,
            thesisTitle: post.thesisTitle,
            entryPrice: caller.entryPrice,
            latestPrice: caller.latestPrice,
            assetReturn: caller.assetReturn,
            currentStancePerformance: caller.currentStancePerformance,
            currentStance: caller.currentStance,
            thesisCount: caller.thesisCount,
            summary: caller.summary,
            claims: caller.claims || [],
          },
        };
        item.materiality =
          materialityScore(item) +
          (post.sourceProvenance === "named" ? 14 : 8) +
          (caller.currentStance === post.stance ? 4 : 0);
        return item;
      })
  );

  const summaryItem = {
    id: `supercycle-asset-summary-${ticker}`,
    date: caller.latestAt || caller.firstAt || "",
    sentiment: caller.currentStance === "short" ? "bear" : caller.currentStance === "long" ? "bull" : "neutral",
    title: `${ticker} · Supercycle Serenity 资产页摘要`,
    body: [
      caller.summary,
      ...(caller.claims || []).map((claim) => `关键断言：${claim}`),
      caller.thesisCount ? `Supercycle 当前记录 Serenity 对 ${ticker} 的 ${caller.thesisCount} 条 thesis/post。` : "",
    ]
      .filter(Boolean)
      .join(" "),
    symbols: unique([ticker, ...extractSymbols(`${caller.summary || ""} ${(caller.claims || []).join(" ")}`)]),
    theme: classifyTheme(`${ticker} ${caller.summary || ""} ${(caller.claims || []).join(" ")}`),
    url: sourceUrl,
    source: `supercycle-asset-summary-${ticker}`,
    oembedNotNeeded: true,
    supercycle: {
      asset: ticker,
      assetPath: data.assetPath,
      currentStance: caller.currentStance,
      thesisCount: caller.thesisCount,
      entryPrice: caller.entryPrice,
      latestPrice: caller.latestPrice,
      assetReturn: caller.assetReturn,
      currentStancePerformance: caller.currentStancePerformance,
      summary: caller.summary,
      claims: caller.claims || [],
    },
  };
  summaryItem.materiality = Math.min(100, materialityScore(summaryItem) + 20);

  return {
    label: `supercycle-asset:${ticker}`,
    indexedClaim: null,
    assetFeedPostCount: posts.length,
    items: attachSourceUrl([summaryItem, ...posts], sourceUrl),
  };
}

function metaContent(rendered, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return decodeHtml(rendered.match(new RegExp(`<meta ${escaped} content="([^"]+)"`))?.[1] || "");
}

function parseYouMindComments(rendered) {
  return [...rendered.matchAll(/\\"name\\":\\"((?:\\\\.|[^"\\])*)\\",\\"commentAt\\":\\"([^\\"]+)\\",\\"content\\":\\"((?:\\\\.|[^"\\])*)\\"/g)]
    .map((match) => ({
      name: decodeJsonFragment(match[1]),
      date: match[2],
      content: decodeJsonFragment(match[3]),
    }))
    .filter((comment) => comment.content && comment.content.length > 2)
    .slice(0, 30);
}

function parseYouMind(rendered, sourceUrl) {
  const title = metaContent(rendered, 'property="og:title"') || stripTags(rendered.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
  const description =
    metaContent(rendered, 'name="description"') || metaContent(rendered, 'property="og:description"') || "YouMind viral article tracking page.";
  const published = metaContent(rendered, 'property="article:published_time"');
  const author = metaContent(rendered, 'property="article:author"');
  const sourceLinks = unique([...rendered.matchAll(/https:\/\/x\.com\/aleabitoreddit\/status\/(\d+)/g)].map((match) => match[0]));
  const sourcePost = sourceLinks[0] || "";
  const comments = parseYouMindComments(rendered);
  const commentSymbols = unique(comments.flatMap((comment) => extractSymbols(comment.content)));
  const topicSymbols = unique([...extractSymbols(`${title} ${description}`), "SIVE", "MRVL", "AAPL", "AMD", "LITE", "COHR", ...commentSymbols]);

  const analysisItem = {
    id: `youmind-${statusId(sourcePost) || "sive-cpo"}`,
    date: published,
    sentiment: "bull",
    title: title.replace(/\s*\|\s*.*$/, ""),
    body: [
      description,
      "蒸馏结论：把 Sivers Photonics 视为 CPO / CW laser 供应链中的小市值瓶颈，并用客户映射、NDA 关系、TAM 扩张与量产验证来判断赔率。",
      comments.length ? `评论区提取到 ${comments.length} 条围绕 SIVE/LITE/COHR/客户确认/订单流的公开反馈。` : "",
    ]
      .filter(Boolean)
      .join(" "),
    symbols: topicSymbols,
    theme: "cpo-silicon-photonics",
    url: sourceUrl,
    sourcePost,
    source: "youmind-analysis",
    comments,
    author,
  };
  analysisItem.materiality = materialityScore(analysisItem) + 14;

  const statusItems = sourceLinks.map((url) => {
    const item = {
      id: statusId(url),
      date: published,
      sentiment: "bull",
      title: "YouMind 收录的 Serenity 原帖",
      body: description,
      symbols: topicSymbols,
      theme: "cpo-silicon-photonics",
      url,
      source: "youmind-source-post",
    };
    item.materiality = materialityScore(item) + 8;
    return item;
  });

  return {
    label: "youmind",
    indexedClaim: null,
    items: attachSourceUrl([analysisItem, ...statusItems], sourceUrl),
  };
}

function parseDirectStatus(sourceUrl) {
  const url = canonicalStatusUrl(sourceUrl);
  const item = {
    id: statusId(url),
    date: "",
    sentiment: "neutral",
    title: "Serenity X 原帖种子",
    body: "通过 Twitter oEmbed 回填全文，用于补足镜像站未稳定暴露的高信号喊单。",
    symbols: [],
    theme: "general",
    url,
    source: "x-status-seed",
  };
  item.materiality = materialityScore(item);

  return {
    label: "x-status-seed",
    indexedClaim: null,
    items: attachSourceUrl([item], sourceUrl),
  };
}

function parseKuCoin(rendered, sourceUrl) {
  const title =
    metaContent(rendered, 'property="og:title"') ||
    stripTags(rendered.match(/<title>([\s\S]*?)<\/title>/)?.[1]) ||
    "KuCoin Serenity methodology note";
  const description = metaContent(rendered, 'name="description"') || metaContent(rendered, 'property="og:description"');
  const contentEscaped = rendered.match(/"content":"((?:\\.|[^"\\])*)","anchorList"/)?.[1] || "";
  const articleText = stripTags(decodeJsonFragment(contentEscaped));
  const text = `${title} ${description} ${articleText}`;
  const thirdPartyScrapeClaim = Number(text.match(/scraped\s+([0-9,]+)\s+tweets\s+from\s+Serenity/i)?.[1]?.replace(/,/g, "")) || null;
  const coverageWindow = text.match(/Serenity\s*\(@aleabitoreddit\)[\s\S]{0,80}?([0-9]+\s+months?)/i)?.[1] || "";
  const returnClaim = text.match(/([0-9]+x)\s+returns/i)?.[1] || "";
  const body = [
    description || firstSentence(articleText, 220),
    thirdPartyScrapeClaim
      ? `第三方文章称其抓取 ${thirdPartyScrapeClaim.toLocaleString("en-US")} 条 Serenity 推文，并把方法归纳为先拆机器/BOM、定位最难替换的瓶颈、跨财报与行业信息验证，再输出方向、标的和仓位。`
      : "第三方文章把 Serenity 的研究流程归纳为供应链拆解、瓶颈识别、交叉验证与仓位表达。",
    "策略蒸馏：不先问买哪个 ticker，而是先确认终端机器、供应链层级、真实瓶颈、验证证据和仓位纪律。",
  ]
    .filter(Boolean)
    .join(" ");

  const item = {
    id: "kucoin-serenity-methodology",
    date: "",
    sentiment: "neutral",
    title: title.replace(/\s*\|\s*.*$/, ""),
    body,
    symbols: extractSymbols(text),
    theme: "ai-infrastructure",
    url: sourceUrl,
    source: "kucoin-methodology",
    thirdParty: {
      scrapeClaim: thirdPartyScrapeClaim,
      coverageWindow,
      returnClaim,
    },
  };
  item.materiality = Math.min(100, materialityScore(item) + 18);

  return {
    label: "kucoin",
    indexedClaim: null,
    thirdPartyScrapeClaim,
    coverageWindow,
    returnClaim,
    items: attachSourceUrl([item], sourceUrl),
  };
}

function parseBuysideDigest(rendered, sourceUrl) {
  const rssBlocks = [...rendered.matchAll(/<item>[\s\S]*?<\/item>/g)].map((match) => match[0]);
  if (rssBlocks.length) {
    const items = rssBlocks
      .map((block, index) => {
        const title = stripTags(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
        const detailUrl = decodeHtml(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "");
        const content =
          block.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] ||
          block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
          "";
        const body = stripTags(content)
          .replace(/^Pitch Summary:\s*/i, "")
          .replace(/\s*The post .*? appeared first on Buyside Digest\.?\s*$/i, "")
          .trim();
        if (!/@aleabitoreddit|Serenity/i.test(`${title} ${body}`)) return null;
        const originalUrl = canonicalStatusUrl(content.match(/https:\/\/x\.com\/aleabitoreddit\/status\/\d+/)?.[0] || "");
        const tickerLabel = title.match(/\(([^)]+)\)\s*(?:-|–|&#8211;)\s*Serenity/i)?.[1] || "";
        const titleSymbol =
          /^[A-Z0-9.]{2,8}$/i.test(tickerLabel) && !TICKER_STOPLIST.has(tickerLabel.toUpperCase())
            ? tickerLabel.toUpperCase()
            : "";
        const symbols = unique([titleSymbol, ...symbolsFromTickerLabel(tickerLabel), ...extractSymbols(`${title} ${body}`)]);
        const text = `${title} ${body}`;
        const item = {
          id: statusId(originalUrl) || `buyside-${detailUrl.split("/").filter(Boolean).pop() || index + 1}`,
          date: stripTags(block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || ""),
          sentiment: sentimentFromBlock(text),
          title: title.replace(/\s*(?:-|–)\s*Serenity\s*$/i, ""),
          body,
          symbols,
          theme: classifyTheme(text),
          url: originalUrl || detailUrl,
        source: "buyside-serenity-pitch",
        sourceUrl: detailUrl || sourceUrl,
        sourceUrls: unique([sourceUrl, detailUrl, originalUrl].filter(Boolean)),
          oembedNotNeeded: true,
          buyside: {
            sourceUrl,
            detailUrl,
            resultIndex: index + 1,
            note: "Public RSS pitch summary.",
          },
        };
        item.materiality = Math.min(100, materialityScore(item) + 12 + (symbols.length ? 8 : 0));
        return item;
      })
      .filter(Boolean);

    return {
      label: "buysidedigest",
      indexedClaim: null,
      buysidePitchCount: items.length,
      items: attachSourceUrl(items, sourceUrl),
    };
  }

  const resultBlocks = [
    ...rendered.matchAll(/<h2 class="entry-title"><a href="([^"]+)">([\s\S]*?)<\/a><\/h2>\s*<p>([\s\S]*?)<\/p>/g),
  ];
  const items = resultBlocks
    .map((match, index) => {
      const url = decodeHtml(match[1]);
      const title = stripTags(match[2]);
      const body = stripTags(match[3]).replace(/^Pitch Summary:\s*/i, "");
      if (!/@aleabitoreddit|Serenity/i.test(`${title} ${body}`)) return null;
      const tickerLabel = title.match(/\(([^)]+)\)\s*(?:-|–|&#8211;)\s*Serenity/i)?.[1] || "";
      const titleSymbol =
        /^[A-Z0-9.]{2,8}$/i.test(tickerLabel) && !TICKER_STOPLIST.has(tickerLabel.toUpperCase())
          ? tickerLabel.toUpperCase()
          : "";
      const symbols = unique([titleSymbol, ...symbolsFromTickerLabel(tickerLabel), ...extractSymbols(`${title} ${body}`)]);
      const text = `${title} ${body}`;
      const item = {
        id: `buyside-${url.split("/").filter(Boolean).pop() || index + 1}`,
        date: "",
        sentiment: sentimentFromBlock(text),
        title: title.replace(/\s*(?:-|–)\s*Serenity\s*$/i, ""),
        body,
        symbols,
        theme: classifyTheme(text),
        url,
        source: "buyside-serenity-pitch",
        sourceUrl: url,
        sourceUrls: unique([sourceUrl, url].filter(Boolean)),
        oembedNotNeeded: true,
        buyside: {
          sourceUrl,
          detailUrl: url,
          resultIndex: index + 1,
          note: "Search-result excerpt only; detail page requires login.",
        },
      };
      item.materiality = Math.min(100, materialityScore(item) + 10 + (symbols.length ? 8 : 0));
      return item;
    })
    .filter(Boolean);

  return {
    label: "buysidedigest",
    indexedClaim: null,
    buysidePitchCount: items.length,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function parseInvestCopilotTags(rendered = "", requiredClass = "") {
  return unique(
    [...rendered.matchAll(/<(?:a|span)[^>]*class="([^"]*\btag\b[^"]*)"[^>]*>([\s\S]*?)<\/(?:a|span)>/g)]
      .filter((match) => !requiredClass || match[1].split(/\s+/).includes(requiredClass))
      .map((match) => stripTags(match[2]))
      .filter((tag) => tag && !tag.startsWith("@") && !tag.startsWith("↗"))
  );
}

function parseInvestCopilotMdBox(rendered = "", label = "") {
  const pattern = new RegExp(
    `<div class="summary-box">\\s*<div class="label">${escapeRegExp(label)}<\\/div>\\s*<div class="md-body"[^>]*>([\\s\\S]*?)<\\/div>\\s*<\\/div>`,
    "i"
  );
  return stripTags(rendered.match(pattern)?.[1] || "");
}

function parseInvestCopilotFacts(rendered = "", label = "客观事实") {
  const pattern = new RegExp(
    `<div class="summary-box">\\s*<div class="label">${escapeRegExp(label)}<\\/div>\\s*<ul class="fact-list">([\\s\\S]*?)<\\/ul>`,
    "i"
  );
  return [...(rendered.match(pattern)?.[1] || "").matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => stripTags(match[1]));
}

function parseInvestCopilotMetrics(text = "") {
  const match = text.match(
    /likes:\s*([\d,]+)\s*\|\s*retweets:\s*([\d,]+)\s*\|\s*replies:\s*([\d,]+)\s*\|\s*views:\s*([\d,]+)/i
  );
  if (!match) return null;
  return {
    likes: parseMetricNumber(match[1]),
    retweets: parseMetricNumber(match[2]),
    replies: parseMetricNumber(match[3]),
    views: parseMetricNumber(match[4]),
  };
}

function parseInvestCopilotArticle(rendered = "", detailUrl = "", sourceUrl = "") {
  if (!rendered.includes("@aleabitoreddit")) return null;

  const title =
    stripTags(rendered.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1]) ||
    stripTags(rendered.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
  const originalUrl = canonicalStatusUrl(rendered.match(/href="(https:\/\/x\.com\/aleabitoreddit\/status\/\d+)"/)?.[1] || "");
  const articleId = detailUrl.match(/\/feed\/article\/(\d+)/)?.[1] || "";
  const date = stripTags(rendered.match(/<span class="meta-item">发布：([\s\S]*?)<\/span>/)?.[1] || "");
  const scrapedAt = stripTags(rendered.match(/<span class="meta-item">抓取：([\s\S]*?)<\/span>/)?.[1] || "");
  const importanceMatch = rendered.match(/<span class="importance-badge imp-(\d+)">([\s\S]*?)<\/span>/);
  const importance = Number(stripTags(importanceMatch?.[2] || importanceMatch?.[1] || "")) || null;
  const summary = parseInvestCopilotMdBox(rendered, "摘要");
  const facts = parseInvestCopilotFacts(rendered);
  const tags = parseInvestCopilotTags(rendered).filter((tag) => tag !== "Alea");
  const mutedTags = parseInvestCopilotTags(rendered, "muted-tag");
  const originalHtml = rendered.match(/<h3[^>]*>\s*原文\s*<\/h3>\s*<div class="md-body"[^>]*>([\s\S]*?)<\/div>/)?.[1] || "";
  const originalTextWithMetrics = stripTags(originalHtml);
  const engagement = parseInvestCopilotMetrics(originalTextWithMetrics);
  const body = originalTextWithMetrics
    .replace(
      /\s*likes:\s*[\d,]+\s*\|\s*retweets:\s*[\d,]+\s*\|\s*replies:\s*[\d,]+\s*\|\s*views:\s*[\d,]+/i,
      ""
    )
    .trim();
  const text = `${title} ${summary} ${facts.join(" ")} ${body} ${tags.join(" ")} ${mutedTags.join(" ")}`;
  const symbols = extractSymbols(text);

  const item = {
    id: statusId(originalUrl) || `investcopilot-${articleId}`,
    date,
    sentiment: sentimentFromBlock(text),
    title: firstSentence(body || title.replace(/^@aleabitoreddit:\s*/i, "")),
    body: body || summary || title,
    symbols,
    theme: classifyTheme(text),
    url: originalUrl || detailUrl,
    source: "investcopilot-twitter",
    sourceUrl: detailUrl,
    sourceUrls: unique([detailUrl, sourceUrl, originalUrl].filter(Boolean)),
    oembedNotNeeded: true,
    engagement: engagement
      ? {
          ...engagement,
          scrapedAt,
          detailUrl,
        }
      : undefined,
    investCopilot: {
      articleId,
      detailUrl,
      sourceUrl,
      summary,
      facts,
      tags,
      mutedTags,
      importance,
      scrapedAt,
    },
  };
  item.materiality = Math.min(
    100,
    materialityScore(item) +
      (importance ? importance * 3 : 0) +
      Math.min(10, (engagement?.replies || 0) / 20) +
      Math.min(8, (engagement?.views || 0) / 250000)
  );
  return item;
}

async function parseInvestCopilot(sourceUrl) {
  const rendered = await fetchUrl(sourceUrl, "text/html,*/*", INVESTCOPILOT_TIMEOUT_MS);
  const articleLinks = unique(
    [...rendered.matchAll(/href="(\/feed\/article\/\d+)"/g)].map((match) => absoluteUrl(match[1], sourceUrl))
  );
  const currentCount = Number(rendered.match(/data-meta="当前\s*([\d,]+)\s*\//)?.[1]?.replace(/,/g, "")) || articleLinks.length;
  const feedTotalClaim =
    Number(rendered.match(/data-meta="当前\s*[\d,]+\s*\/\s*共\s*([\d,]+)\s*条"/)?.[1]?.replace(/,/g, "")) || null;
  const detailResults = await mapWithConcurrency(
    articleLinks,
    Math.max(1, INVESTCOPILOT_ARTICLE_CONCURRENCY),
    async (detailUrl) => {
      try {
        const html = await fetchUrl(detailUrl, "text/html,*/*", INVESTCOPILOT_TIMEOUT_MS);
        return {
          detailUrl,
          item: parseInvestCopilotArticle(html, detailUrl, sourceUrl),
        };
      } catch (error) {
        return {
          detailUrl,
          error: error.message,
        };
      }
    }
  );
  const errors = detailResults.filter((entry) => entry?.error);
  const items = detailResults.map((entry) => entry?.item).filter(Boolean);

  return {
    label: "investcopilot",
    indexedClaim: null,
    investCopilotArticleCount: articleLinks.length || currentCount,
    investCopilotParsedArticles: items.length,
    investCopilotFeedTotalClaim: feedTotalClaim,
    investCopilotReplySignalCount: items.reduce((total, item) => total + (item.engagement?.replies || 0), 0),
    investCopilotErrorCount: errors.length,
    items: attachSourceUrl(mergeItems(items), sourceUrl),
  };
}

const SEMICON_TICKER_ALIASES = {
  "688017": ["688017.SHG"],
  SIVE: ["SIVE.ST", "SIVEF"],
  SOI: ["SOI.PA"],
  XFAB: ["XFAB.PA", "XFABF"],
  RPI: ["RPI.L"],
  WIN: ["3105.TW"],
};

function extractConstLiteral(rendered = "", constName = "") {
  const marker = `const ${constName} =`;
  const markerIndex = rendered.indexOf(marker);
  if (markerIndex < 0) return "";
  const openChar = constName === "TIMELINES" ? "{" : "[";
  const closeChar = openChar === "{" ? "}" : "]";
  const start = rendered.indexOf(openChar, markerIndex + marker.length);
  if (start < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = start; index < rendered.length; index += 1) {
    const char = rendered[index];
    const next = rendered[index + 1];

    if (lineComment) {
      if (char === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return rendered.slice(start, index + 1);
    }
  }

  return "";
}

function evaluateLiteral(literal = "", fallback) {
  if (!literal) return fallback;
  try {
    return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 1000 });
  } catch {
    return fallback;
  }
}

function semiconTickerSymbols(ticker = "") {
  const clean = String(ticker || "").replace(/^\$+/, "").trim();
  return unique([clean, ...(SEMICON_TICKER_ALIASES[clean] || [])].filter(Boolean));
}

function semiconCategoryTheme(category = "", text = "") {
  const clean = String(category || "").toLowerCase();
  if (clean === "robotics") return "robotics-physical-ai";
  if (clean === "memory") return "memory-rotation";
  if (clean === "neocloud") return "neocloud";
  if (clean === "macro") return "macro-hedge";
  if (clean === "crypto") return "crypto-rotation";
  if (clean === "risk") return "capital-structure-veto";
  if (clean === "demand") return "ai-infrastructure";
  return classifyTheme(text);
}

function semiconSentiment(row = {}) {
  const status = String(row.status || "").toLowerCase();
  const conviction = String(row.conviction || "").toLowerCase();
  if (status === "flipped" || conviction === "risk") return "bear";
  if (conviction === "high" || conviction === "safe") return "bull";
  return "neutral";
}

function semiconTimelineSentiment(event = {}) {
  const tag = String(event.tag || "").toUpperCase();
  if (tag === "FLIP" || tag === "RISK") return "bear";
  if (tag === "DISCLOSURE") return "neutral";
  return "bull";
}

function semiconMateriality(row = {}) {
  const conviction = String(row.conviction || "").toLowerCase();
  const status = String(row.status || "").toLowerCase();
  let score = 58;
  if (conviction === "high") score += 22;
  if (conviction === "safe") score += 14;
  if (conviction === "risk") score += 12;
  if (status === "flipped") score += 10;
  if (row.date) score += 8;
  return Math.min(100, score);
}

function parseSemiconStocks(rendered = "", sourceUrl = "") {
  const data = evaluateLiteral(extractConstLiteral(rendered, "DATA"), []);
  const timelines = evaluateLiteral(extractConstLiteral(rendered, "TIMELINES"), {});
  const rows = Array.isArray(data) ? data : [];
  const timelineMap = timelines && typeof timelines === "object" ? timelines : {};
  const locale = /\/zh(?:\.html)?$/i.test(new URL(sourceUrl).pathname) ? "zh" : "en";
  const latestBlock = rendered.match(/<div id="latest-banner"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/)?.[0] || "";
  const latestDate = attr(latestBlock, "data-latest-date") || "";
  const latestTitle = stripTags(latestBlock.match(/<span class="num[\s\S]*?<\/span>/)?.[0] || "");

  const thesisItems = rows.map((row) => {
    const ticker = String(row.ticker || "").trim();
    const name = String(row.name || "").trim();
    const text = [row.thesis, row.note, row.entry, row.cat, row.conviction, row.status].filter(Boolean).join(" ");
    const item = {
      id: `semiconstocks-thesis-${ticker}`,
      date: row.date || "",
      sentiment: semiconSentiment(row),
      title: `${ticker} · ${name}`.trim(),
      body: [row.thesis, row.note ? `Note: ${row.note}` : "", row.entry ? `Entry/access: ${row.entry}` : ""].filter(Boolean).join(" "),
      symbols: semiconTickerSymbols(ticker),
      theme: semiconCategoryTheme(row.cat, text),
      url: `${sourceUrl}#book`,
      source: "semiconstocks-thesis",
      oembedNotNeeded: true,
      semiconstocks: {
        ticker,
        name,
        category: row.cat || "",
        conviction: row.conviction || "",
        status: row.status || "",
        entry: row.entry || "",
        locale,
      },
    };
    item.materiality = Math.max(semiconMateriality(row), materialityScore(item));
    return item;
  });

  const timelineItems = Object.entries(timelineMap).flatMap(([ticker, events]) =>
    (Array.isArray(events) ? events : []).map((event) => {
      const text = [event.quote, event.gloss, event.tag].filter(Boolean).join(" ");
      const statusUrl = event.id ? `https://x.com/aleabitoreddit/status/${event.id}` : "";
      const item = {
        id: event.id || `semiconstocks-timeline-${ticker}-${stableHash(`${event.date || ""} ${text}`)}`,
        date: normalizeTwitterDate(event.date) || event.date || "",
        sentiment: semiconTimelineSentiment(event),
        title: firstSentence(event.quote || event.gloss || `${ticker} timeline event`, 180),
        body: [event.quote, event.gloss].filter(Boolean).join(" "),
        symbols: semiconTickerSymbols(ticker),
        theme: semiconCategoryTheme("", text),
        url: statusUrl || `${sourceUrl}#track`,
        source: "semiconstocks-timeline",
        sourceUrls: unique([sourceUrl, statusUrl].filter(Boolean)),
        oembedNotNeeded: !statusUrl,
        semiconstocks: {
          ticker,
          tag: event.tag || "",
          locale,
          sourceStatusId: event.id || "",
        },
      };
      item.materiality = Math.max(materialityScore(item) + 12, 72);
      return item;
    })
  );

  const items = mergeItems([...thesisItems, ...timelineItems]);
  return {
    label: "semiconstocks",
    indexedClaim: null,
    semiconStocksLocale: locale,
    semiconStocksThesisCount: rows.length,
    semiconStocksTimelineEventCount: timelineItems.length,
    semiconStocksLatestDate: latestDate,
    semiconStocksLatestTitle: latestTitle,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function extractNextFlightStrings(html = "") {
  const strings = [];
  for (const match of html.matchAll(/self\.__next_f\.push\((\[[\s\S]*?\])\)<\/script>/g)) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) strings.push(...parsed.filter((value) => typeof value === "string"));
    } catch {
      try {
        const parsed = vm.runInNewContext(match[1], Object.create(null), { timeout: 1000 });
        if (Array.isArray(parsed)) strings.push(...parsed.filter((value) => typeof value === "string"));
      } catch {
        // Ignore malformed flight chunks; other chunks usually carry the same page data.
      }
    }
  }
  return strings;
}

function balancedJsonObject(text = "", start = 0) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }
  return "";
}

function extractSerenitySaidData(html = "") {
  const joined = extractNextFlightStrings(html).join("\n");
  const start = joined.indexOf('{"tweets":[');
  if (start < 0) return null;
  const objectText = balancedJsonObject(joined, start);
  if (!objectText) return null;
  try {
    return JSON.parse(objectText);
  } catch {
    return null;
  }
}

function normalizeSerenitySaidTweet(tweet = {}, sourceUrl = "") {
  const id = String(tweet.tweet_id || "").trim();
  const content = String(tweet.content || "").trim();
  if (!id || !content) return null;
  const url = `https://x.com/aleabitoreddit/status/${id}`;
  const contentZh = String(tweet.content_zh || "").trim();
  const aiSummary = String(tweet.ai_summary || "").trim();
  const aiDirection = String(tweet.ai_direction || "").trim();
  const quoted = String(tweet.quoted_content || "").trim();
  const body = [content, quoted ? `Quoted: ${quoted}` : "", contentZh ? `中文译文：${contentZh}` : "", aiSummary ? `AI 解读：${aiSummary}` : ""]
    .filter(Boolean)
    .join("\n\n");
  const symbols = unique([...(Array.isArray(tweet.symbols) ? tweet.symbols : []), ...extractSymbols(`${content} ${contentZh} ${aiSummary}`)]);
  const keywords = unique(Array.isArray(tweet.keywords) ? tweet.keywords.map((keyword) => String(keyword || "").trim()) : []);
  const item = {
    id,
    url,
    sourceUrl,
    sourceUrls: unique([sourceUrl, url]),
    source: "serenitysaid",
    sourceList: ["serenitysaid"],
    date: normalizeTwitterDate(tweet.created_at),
    title: firstSentence(content, 220),
    body,
    text: content,
    symbols,
    sentiment: sentimentFromBlock(`${content} ${aiSummary}`),
    theme: classifyTheme(`${content} ${contentZh} ${aiDirection} ${aiSummary} ${keywords.join(" ")}`),
    engagement: {
      likes: metricNumber(tweet.likes),
      retweets: metricNumber(tweet.retweets),
      views: metricNumber(tweet.views),
    },
    images: Array.isArray(tweet.images) ? tweet.images.filter(Boolean) : [],
    serenitySaid: {
      localId: tweet.id || null,
      contentZh,
      aiSummary,
      aiDirection,
      keywords,
      inReplyToUsername: tweet.in_reply_to_username || "",
      quotedContent: quoted,
    },
  };
  item.materiality = Math.min(100, materialityScore(item) + 14 + Math.min(10, symbols.length * 2) + Math.min(8, Math.log10((item.engagement.views || 0) + 1)));
  return item;
}

function parseSerenitySaid(html, sourceUrl = "") {
  const data = extractSerenitySaidData(html) || {};
  const tweets = Array.isArray(data.tweets) ? data.tweets : [];
  const items = tweets.map((tweet) => normalizeSerenitySaidTweet(tweet, sourceUrl)).filter(Boolean);
  const profile = data.profile || {};
  const latest = items
    .slice()
    .sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0))[0];
  return {
    label: "serenitysaid",
    indexedClaim: null,
    profileTweetCount: metricNumber(profile.tweet_count),
    serenitySaidTweetCount: items.length,
    serenitySaidLatestId: latest?.id || "",
    serenitySaidLatestDate: latest?.date || "",
    serenitySaidUpdatedAt: profile.updated_at || "",
    serenitySaidKeywordCount: Array.isArray(data.keywords) ? data.keywords.length : 0,
    items: attachSourceUrl(items, sourceUrl),
  };
}

function parseSource(sourceUrl, html) {
  const rendered = html.split("<script>self.__next_f.push")[0] || html;
  if (isDirectStatusSource(sourceUrl)) return parseDirectStatus(sourceUrl);
  if (sourceUrl.includes("eystockholdings.com")) return parseEystock(rendered, sourceUrl);
  if (isJinaInstalkerSource(sourceUrl)) return parseInstalkerReader(html, sourceUrl);
  if (sourceUrl.includes("instalker.org")) return parseInstalker(html, sourceUrl);
  if (sourceUrl.includes("serenity-sensei.com")) return parseSensei(html, sourceUrl);
  if (sourceUrl.includes("serenity-skill.vercel.app") || sourceUrl.includes("0xagata-prog/serenity-skill")) {
    return parseSerenitySkill(html, sourceUrl);
  }
  if (isSerenitySaidSource(sourceUrl)) return parseSerenitySaid(html, sourceUrl);
  if (isSemiconStocksSource(sourceUrl)) return parseSemiconStocks(html, sourceUrl);
  if (isTwiscanSource(sourceUrl)) return parseTwiscan(html, sourceUrl);
  if (sourceUrl.includes("supercycle.fi/assets/")) return parseSupercycleAsset(html, sourceUrl);
  if (sourceUrl.includes("supercycle.fi")) return parseSupercycle(html, sourceUrl);
  if (sourceUrl.includes("youmind.com")) return parseYouMind(html, sourceUrl);
  if (sourceUrl.includes("investcopilot.cloud/feed/article/")) {
    const item = parseInvestCopilotArticle(html, sourceUrl, sourceUrl);
    return {
      label: "investcopilot",
      indexedClaim: null,
      investCopilotArticleCount: item ? 1 : 0,
      investCopilotParsedArticles: item ? 1 : 0,
      investCopilotReplySignalCount: item?.engagement?.replies || 0,
      items: attachSourceUrl([item], sourceUrl),
    };
  }
  if (sourceUrl.includes("buysidedigest.com")) return parseBuysideDigest(html, sourceUrl);
  if (sourceUrl.includes("kucoin.com")) return parseKuCoin(html, sourceUrl);
  return {
    label: sourceLabel(sourceUrl),
    indexedClaim: null,
    items: [],
  };
}

function summarize(items, indexedClaim, sourceReports = [], sourceUrls = []) {
  const symbolMap = new Map();
  const themeMap = new Map();
  const sourceMap = new Map();
  const mergedCommentCount = items.reduce((total, item) => total + (item.comments?.length || 0), 0);
  const coverageClaims = sourceReports
    .flatMap((report) =>
      [
        report.profileTweetCount
          ? {
              source: report.source,
              type: "profile-tweet-count",
              label: "公开镜像账号总量",
              count: report.profileTweetCount,
              url: report.url,
            }
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
        report.assetFeedPostCount
          ? {
              source: report.source,
              type: "supercycle-asset-feed",
              label: "Supercycle 资产喊单",
              count: report.assetFeedPostCount,
              url: report.url,
            }
          : null,
        report.callerFeedPostCount
          ? {
              source: report.source,
              type: "supercycle-caller-feed",
              label: "Supercycle caller feed",
              count: report.callerFeedPostCount,
              url: report.url,
            }
          : null,
        report.callerAssetCount
          ? {
              source: report.source,
              type: "supercycle-caller-assets",
              label: "Supercycle caller assets",
              count: report.callerAssetCount,
              url: report.url,
            }
          : null,
        report.callerAssetPostCount
          ? {
              source: report.source,
              type: "supercycle-caller-asset-posts",
              label: "Supercycle asset-post links",
              count: report.callerAssetPostCount,
              url: report.url,
            }
          : null,
        report.investCopilotArticleCount
          ? {
              source: report.source,
              type: "investcopilot-articles",
              label: "InvestCopilot Alea 文章",
              count: report.investCopilotArticleCount,
              url: report.url,
            }
          : null,
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
        report.buysidePitchCount
          ? {
              source: report.source,
              type: "buyside-serenity-pitches",
              label: "Buyside Serenity pitches",
              count: report.buysidePitchCount,
              url: report.url,
            }
          : null,
        report.fxTwitterReplyCount
          ? {
              source: report.source,
              type: "fxtwitter-reply-samples",
              label: "FxTwitter 回复样本",
              count: report.fxTwitterReplyCount,
              url: report.url,
            }
          : null,
        report.fxTwitterWithRepliesArchived
          ? {
              source: report.source,
              type: "fxtwitter-with-replies",
              label: "FxTwitter 含回复时间线",
              count: report.fxTwitterWithRepliesArchived,
              url: report.url,
            }
          : null,
        report.fxTwitterWithRepliesRtsArchivedComments
          ? {
              source: report.source,
              type: "fxtwitter-with-replies-rts",
              label: "FxTwitter 含回复/转推评论流",
              count: report.fxTwitterWithRepliesRtsArchivedComments,
              url: report.url,
            }
          : null,
        mergedCommentCount && report.source === "fxtwitter-reply-search"
          ? {
              source: "fxtwitter-comments",
              type: "merged-comment-samples",
              label: "已合并评论样本",
              count: mergedCommentCount,
              url: "https://api.fxtwitter.com/2/search?q=to%3Aaleabitoreddit",
            }
          : null,
      ].filter(Boolean)
    )
    .sort((a, b) => b.count - a.count);

  for (const item of items) {
    themeMap.set(item.theme, (themeMap.get(item.theme) || 0) + 1);
    for (const source of sourceList(item)) {
      const sourceBucket =
        sourceMap.get(source) ||
        {
          source,
          items: 0,
          oembed: 0,
        };
      sourceBucket.items += 1;
      if (item.oembed) sourceBucket.oembed += 1;
      sourceMap.set(source, sourceBucket);
    }

    const itemAssets = new Map((item.supercycle?.assets || []).map((asset) => [asset.symbol, asset]));
    for (const symbol of item.symbols) {
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
      bucket[item.sentiment] = (bucket[item.sentiment] || 0) + 1;
      bucket.materiality += item.materiality;
      if (asset) {
        bucket.derivedWeight += asset.weight;
        if (asset.direction === "long") bucket.longWeight += asset.weight;
        if (asset.direction === "short") bucket.shortWeight += asset.weight;
        bucket.weightMentions += 1;
      }
      bucket.themes[item.theme] = (bucket.themes[item.theme] || 0) + 1;
      bucket.latest ||= item.date;
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

  const themes = [...themeMap.entries()]
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count);

  const rules = [
    {
      rule: "瓶颈扫描优先",
      weight: 95,
      evidence: "先画 AI 基建完整供应链，找材料、激光、封装、测试、电力中最小且不可替代的节点，而不是追最显眼的 GPU 龙头。",
    },
    {
      rule: "小市值先于机构",
      weight: 90,
      evidence: "优先找机构暂时难买、卖方覆盖不足、流动性还小但 TAM 正在快速扩张的公司，等指数/纳斯达克/大基金进入前完成研究。",
    },
    {
      rule: "TAM 扩张重估",
      weight: 89,
      evidence: "当 CPO、InP、AI 光互连等市场从小基数走向数十亿美元级别时，普通 PE 模型容易失真，先算理论天花板和可捕获份额。",
    },
    {
      rule: "客户证据高于故事",
      weight: 88,
      evidence: "AAOI、SIVE、MRVL 相关样本强调 hyperscaler orders、reference design、直接客户、量产资格和产能锁定，故事必须落到可验证证据。",
    },
    {
      rule: "类比上一轮超级周期",
      weight: 86,
      evidence: "把新瓶颈映射到上一轮赢家：例如 AXTI/SOI、LITE/SIVE、光模块/激光/衬底之间的角色迁移，用旧周期理解新赔率。",
    },
    {
      rule: "垂直整合给溢价",
      weight: 84,
      evidence: "能从材料到器件、模块、测试或组装多层捕获价值的公司，在供给紧张时比单点参与者更有议价力。",
    },
    {
      rule: "资本结构一票否决",
      weight: 91,
      evidence: "IREN 等案例提醒：ATM、可转债、债务墙或融资路径恶化可以直接推翻多头 thesis，稀释风险优先于热度。",
    },
    {
      rule: "买前写反证清单",
      weight: 87,
      evidence: "每个候选股必须写清楚什么会让 thesis 失效：客户流失、技术替代、产能不兑现、TAM 被证伪、融资恶化或估值过热。",
    },
    {
      rule: "只因 thesis 破裂退出",
      weight: 86,
      evidence: "回撤本身不是卖出理由；如果核心证据仍在，按计划分批执行。若反证出现，则先降风险而不是用情绪补仓。",
    },
  ];
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
  const commentSignals = buildCommentSignals(items);

  return {
    generatedAt: new Date().toISOString(),
    source: sourceUrls.join(", "),
    sources: sourceReports,
    indexedClaim,
    parsedItems: items.length,
    oembedEnriched: items.filter((item) => item.oembed).length,
    fxTwitterStatusEnriched: items.filter((item) => item.fxTwitter).length,
    commentCount: mergedCommentCount,
    commentSignals,
    engagementTotals,
    coverageClaims,
    coverageNote:
      indexedClaim && indexedClaim > items.length
        ? `Primary source claims ${indexedClaim} indexed tweets; ${items.length} merged public items were extractable across configured sources in this run.`
        : `${items.length} merged public items were extractable across configured sources in this run.`,
    sourceBreakdown: [...sourceMap.values()].sort((a, b) => b.items - a.items),
    symbols,
    themes,
    rules,
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

function commentBackfillCandidates(items = [], limit = 5, minReplies = 10) {
  return (items || [])
    .map((item) => {
      const id = statusId(statusUrlFromItem(item) || item.url || item.id || "");
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

function commentBackfillQueueSummary(items = [], sourceReports = []) {
  const thresholds = [25, 50, 100];
  const totalBackfilled = (items || []).filter((item) => item.fxTwitter?.commentsBackfilledAt || item.fxTwitter?.conversationApiUrl).length;
  const conversationReport = (sourceReports || []).find((source) => source.source === "fxtwitter-conversation-backfill") || {};
  const byThreshold = Object.fromEntries(thresholds.map((minReplies) => [minReplies, commentBackfillCandidates(items, 10_000, minReplies).length]));
  const nextMinReplies = byThreshold[50] ? 50 : byThreshold[25] ? 25 : 50;
  const next = commentBackfillCandidates(items, 5, nextMinReplies).map((entry) => ({
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
    conversationItems: Number(conversationReport.conversationBackfillItems) || totalBackfilled,
    conversationComments: Number(conversationReport.conversationBackfillComments) || 0,
    remaining25: byThreshold[25],
    remaining50: byThreshold[50],
    remaining100: byThreshold[100],
    nextMinReplies,
    next,
  };
}

async function main() {
  const previousIndex = readExistingTweetIndex();
  const existingArchive = readFxTwitterArchive();
  const nextArchive = { ...existingArchive };
  const dynamicOnly = process.env.SERENITY_DYNAMIC_ONLY === "1";
  const parsedSources = dynamicOnly
    ? []
    : await Promise.all(
        SOURCE_URLS.map(async (sourceUrl) => {
          try {
            const parsed = isSupercycleCallerSource(sourceUrl)
              ? await parseSupercycleCaller(sourceUrl)
              : isInvestCopilotFeedSource(sourceUrl)
                ? await parseInvestCopilot(sourceUrl)
                : isInstalkerSource(sourceUrl)
                  ? await parseInstalkerSource(sourceUrl)
                  : parseSource(sourceUrl, isDirectStatusSource(sourceUrl) ? "" : await fetchHtml(sourceUrl, sourceFetchTimeout(sourceUrl)));
            return {
              report: {
                source: parsed.label,
                url: sourceUrl,
                indexedClaim: parsed.indexedClaim,
                profileTweetCount: parsed.profileTweetCount,
                instalkerLoadMorePages: parsed.instalkerLoadMorePages,
                instalkerLoadMoreRawFetched: parsed.instalkerLoadMoreRawFetched,
                instalkerLoadMoreRawUniqueFetched: parsed.instalkerLoadMoreRawUniqueFetched,
                instalkerLoadMoreFetched: parsed.instalkerLoadMoreFetched,
                instalkerLoadMoreErrorCount: parsed.instalkerLoadMoreErrorCount,
                instalkerLoadMoreErrors: parsed.instalkerLoadMoreErrors,
                thirdPartyScrapeClaim: parsed.thirdPartyScrapeClaim,
                assetFeedPostCount: parsed.assetFeedPostCount,
                callerFeedPostCount: parsed.callerFeedPostCount,
                callerFeedPages: parsed.callerFeedPages,
                callerFeedTruncated: parsed.callerFeedTruncated,
                callerFeedError: parsed.callerFeedError,
                callerAssetCount: parsed.callerAssetCount,
                callerNamedAssetCount: parsed.callerNamedAssetCount,
                callerAssetPostCount: parsed.callerAssetPostCount,
                callerAssetPages: parsed.callerAssetPages,
                callerAssetSource: parsed.callerAssetSource,
                callerAssetsTruncated: parsed.callerAssetsTruncated,
                callerAssetError: parsed.callerAssetError,
                investCopilotArticleCount: parsed.investCopilotArticleCount,
                investCopilotParsedArticles: parsed.investCopilotParsedArticles,
                investCopilotFeedTotalClaim: parsed.investCopilotFeedTotalClaim,
                investCopilotReplySignalCount: parsed.investCopilotReplySignalCount,
                investCopilotErrorCount: parsed.investCopilotErrorCount,
                semiconStocksLocale: parsed.semiconStocksLocale,
                semiconStocksThesisCount: parsed.semiconStocksThesisCount,
                semiconStocksTimelineEventCount: parsed.semiconStocksTimelineEventCount,
                semiconStocksLatestDate: parsed.semiconStocksLatestDate,
                semiconStocksLatestTitle: parsed.semiconStocksLatestTitle,
                serenitySaidTweetCount: parsed.serenitySaidTweetCount,
                serenitySaidLatestId: parsed.serenitySaidLatestId,
                serenitySaidLatestDate: parsed.serenitySaidLatestDate,
                serenitySaidUpdatedAt: parsed.serenitySaidUpdatedAt,
                serenitySaidKeywordCount: parsed.serenitySaidKeywordCount,
                twiscanPostCount: parsed.twiscanPostCount,
                instalkerReaderPostCount: parsed.instalkerReaderPostCount,
                buysidePitchCount: parsed.buysidePitchCount,
                coverageWindow: parsed.coverageWindow,
                returnClaim: parsed.returnClaim,
                parsedItems: parsed.items.length,
              },
              items: parsed.items,
            };
          } catch (error) {
            return {
              report: {
                source: sourceLabel(sourceUrl),
                url: sourceUrl,
                indexedClaim: null,
                parsedItems: 0,
                error: error.message,
              },
              items: [],
            };
          }
        })
      );

  const dynamicParsedSources = await Promise.all(
    [
      parseFxTwitterTimeline,
      parseFxTwitterWithRepliesTimeline,
      parseFxTwitterWithRepliesRetweetsTimeline,
      parseFxTwitterAuthorSearch,
      parseFxTwitterAuthorDateSlices,
      parseFxTwitterAuthorTopDateSlices,
      parseFxTwitterReplySearch,
    ].map(
      async (parser) => {
      try {
        const parsed = await parser(existingArchive);
        if (parsed.label === "fxtwitter-timeline" && parsed.archive) nextArchive.timeline = parsed.archive;
        if (parsed.label === "fxtwitter-with-replies" && parsed.archive) nextArchive.withRepliesTimeline = parsed.archive;
        if (parsed.label === "fxtwitter-with-replies-rts" && parsed.archive) nextArchive.withRepliesRetweets = parsed.archive;
        if (parsed.label === "fxtwitter-author-search" && parsed.archive) nextArchive.authorSearch = parsed.archive;
        if (parsed.label === "fxtwitter-author-date-slices" && parsed.archive) nextArchive.authorDateSlices = parsed.archive;
        if (parsed.label === "fxtwitter-author-top-date-slices" && parsed.archive) nextArchive.authorTopDateSlices = parsed.archive;
        if (parsed.label === "fxtwitter-reply-search" && parsed.archive) nextArchive.replySearch = parsed.archive;
        return {
          report: {
            source: parsed.label,
            url:
              parsed.label === "fxtwitter-timeline"
                ? "https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses"
                : parsed.label === "fxtwitter-with-replies"
                  ? "https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses?with_replies=1"
                : parsed.label === "fxtwitter-with-replies-rts"
                  ? "https://api.fxtwitter.com/2/profile/aleabitoreddit/statuses?with_replies=1&include_rts=1"
                : parsed.label === "fxtwitter-author-search"
                  ? "https://api.fxtwitter.com/2/search?q=from%3Aaleabitoreddit"
                : parsed.label === "fxtwitter-author-date-slices"
                  ? "https://api.fxtwitter.com/2/search?q=from%3Aaleabitoreddit+since%2FUNtil"
                : parsed.label === "fxtwitter-author-top-date-slices"
                  ? "https://api.fxtwitter.com/2/search?q=from%3Aaleabitoreddit+since%2FUNtil&feed=top"
                : "https://api.fxtwitter.com/2/search?q=to%3Aaleabitoreddit",
            indexedClaim: parsed.indexedClaim,
            fxTwitterTimelinePages: parsed.fxTwitterTimelinePages,
            fxTwitterTimelineFetched: parsed.fxTwitterTimelineFetched,
            fxTwitterTimelineAdded: parsed.fxTwitterTimelineAdded,
            fxTwitterTimelineArchived: parsed.fxTwitterTimelineArchived,
            fxTwitterTimelineStartCursor: parsed.fxTwitterTimelineStartCursor,
            fxTwitterTimelineNextCursor: parsed.fxTwitterTimelineNextCursor,
            fxTwitterTimelineCursorAdvanced: parsed.fxTwitterTimelineCursorAdvanced,
            fxTwitterTimelineStalledRuns: parsed.fxTwitterTimelineStalledRuns,
            fxTwitterTimelineErrorCount: parsed.fxTwitterTimelineErrorCount,
            fxTwitterTimelineErrors: parsed.fxTwitterTimelineErrors,
            fxTwitterTimelineTruncated: parsed.fxTwitterTimelineTruncated,
            fxTwitterWithRepliesPages: parsed.fxTwitterWithRepliesPages,
            fxTwitterWithRepliesFetched: parsed.fxTwitterWithRepliesFetched,
            fxTwitterWithRepliesAdded: parsed.fxTwitterWithRepliesAdded,
            fxTwitterWithRepliesArchived: parsed.fxTwitterWithRepliesArchived,
            fxTwitterWithRepliesStartCursor: parsed.fxTwitterWithRepliesStartCursor,
            fxTwitterWithRepliesNextCursor: parsed.fxTwitterWithRepliesNextCursor,
            fxTwitterWithRepliesCursorAdvanced: parsed.fxTwitterWithRepliesCursorAdvanced,
            fxTwitterWithRepliesStalledRuns: parsed.fxTwitterWithRepliesStalledRuns,
            fxTwitterWithRepliesErrorCount: parsed.fxTwitterWithRepliesErrorCount,
            fxTwitterWithRepliesErrors: parsed.fxTwitterWithRepliesErrors,
            fxTwitterWithRepliesTruncated: parsed.fxTwitterWithRepliesTruncated,
            fxTwitterWithRepliesRtsPages: parsed.fxTwitterWithRepliesRtsPages,
            fxTwitterWithRepliesRtsFetched: parsed.fxTwitterWithRepliesRtsFetched,
            fxTwitterWithRepliesRtsOwnFetched: parsed.fxTwitterWithRepliesRtsOwnFetched,
            fxTwitterWithRepliesRtsCommentCount: parsed.fxTwitterWithRepliesRtsCommentCount,
            fxTwitterWithRepliesRtsAdded: parsed.fxTwitterWithRepliesRtsAdded,
            fxTwitterWithRepliesRtsAddedComments: parsed.fxTwitterWithRepliesRtsAddedComments,
            fxTwitterWithRepliesRtsArchived: parsed.fxTwitterWithRepliesRtsArchived,
            fxTwitterWithRepliesRtsCommentThreads: parsed.fxTwitterWithRepliesRtsCommentThreads,
            fxTwitterWithRepliesRtsArchivedComments: parsed.fxTwitterWithRepliesRtsArchivedComments,
            fxTwitterWithRepliesRtsStartCursor: parsed.fxTwitterWithRepliesRtsStartCursor,
            fxTwitterWithRepliesRtsNextCursor: parsed.fxTwitterWithRepliesRtsNextCursor,
            fxTwitterWithRepliesRtsCursorAdvanced: parsed.fxTwitterWithRepliesRtsCursorAdvanced,
            fxTwitterWithRepliesRtsStalledRuns: parsed.fxTwitterWithRepliesRtsStalledRuns,
            fxTwitterWithRepliesRtsExhausted: parsed.fxTwitterWithRepliesRtsExhausted,
            fxTwitterWithRepliesRtsErrorCount: parsed.fxTwitterWithRepliesRtsErrorCount,
            fxTwitterWithRepliesRtsErrors: parsed.fxTwitterWithRepliesRtsErrors,
            fxTwitterWithRepliesRtsTruncated: parsed.fxTwitterWithRepliesRtsTruncated,
            fxTwitterAuthorSearchPages: parsed.fxTwitterAuthorSearchPages,
            fxTwitterAuthorSearchFetched: parsed.fxTwitterAuthorSearchFetched,
            fxTwitterAuthorSearchArchived: parsed.fxTwitterAuthorSearchArchived,
            fxTwitterAuthorSearchStartCursor: parsed.fxTwitterAuthorSearchStartCursor,
            fxTwitterAuthorSearchNextCursor: parsed.fxTwitterAuthorSearchNextCursor,
            fxTwitterAuthorSearchErrorCount: parsed.fxTwitterAuthorSearchErrorCount,
            fxTwitterAuthorSearchErrors: parsed.fxTwitterAuthorSearchErrors,
            fxTwitterAuthorSearchTruncated: parsed.fxTwitterAuthorSearchTruncated,
            fxTwitterAuthorSearchExhausted: parsed.fxTwitterAuthorSearchExhausted,
            fxTwitterAuthorDateSliceCount: parsed.fxTwitterAuthorDateSliceCount,
            fxTwitterAuthorDateSliceActive: parsed.fxTwitterAuthorDateSliceActive,
            fxTwitterAuthorDateSlicePages: parsed.fxTwitterAuthorDateSlicePages,
            fxTwitterAuthorDateSliceFetched: parsed.fxTwitterAuthorDateSliceFetched,
            fxTwitterAuthorDateSliceArchived: parsed.fxTwitterAuthorDateSliceArchived,
            fxTwitterAuthorDateSliceReports: parsed.fxTwitterAuthorDateSliceReports,
            fxTwitterAuthorTopDateSliceCount: parsed.fxTwitterAuthorTopDateSliceCount,
            fxTwitterAuthorTopDateSliceActive: parsed.fxTwitterAuthorTopDateSliceActive,
            fxTwitterAuthorTopDateSlicePages: parsed.fxTwitterAuthorTopDateSlicePages,
            fxTwitterAuthorTopDateSliceFetched: parsed.fxTwitterAuthorTopDateSliceFetched,
            fxTwitterAuthorTopDateSliceAdded: parsed.fxTwitterAuthorTopDateSliceAdded,
            fxTwitterAuthorTopDateSliceArchived: parsed.fxTwitterAuthorTopDateSliceArchived,
            fxTwitterAuthorTopDateSliceReports: parsed.fxTwitterAuthorTopDateSliceReports,
            fxTwitterReplySearchPages: parsed.fxTwitterReplySearchPages,
            fxTwitterReplyCount: parsed.fxTwitterReplyCount,
            fxTwitterReplyArchivedCount: parsed.fxTwitterReplyArchivedCount,
            fxTwitterReplyThreadArchived: parsed.fxTwitterReplyThreadArchived,
            fxTwitterReplyStartCursor: parsed.fxTwitterReplyStartCursor,
            fxTwitterReplyNextCursor: parsed.fxTwitterReplyNextCursor,
            fxTwitterReplySearchErrorCount: parsed.fxTwitterReplySearchErrorCount,
            fxTwitterReplySearchErrors: parsed.fxTwitterReplySearchErrors,
            fxTwitterReplySearchTruncated: parsed.fxTwitterReplySearchTruncated,
            parsedItems: parsed.items.length,
          },
          items: parsed.items,
        };
      } catch (error) {
        return {
          report: {
            source: parser.name,
            url: "https://api.fxtwitter.com/2/",
            indexedClaim: null,
            parsedItems: 0,
            error: error.message,
          },
          items: [],
        };
      }
    }
    )
  );
  const fxTwitterArchive = writeFxTwitterArchive(nextArchive);

  const allParsedSources = [...parsedSources, ...dynamicParsedSources];
  let sourceReports = mergeSourceReportsWithPrevious(allParsedSources.map((entry) => entry.report), previousIndex?.sources || []);
  if ((dynamicOnly || PRESERVE_PREVIOUS_SOURCES) && previousIndex?.sources?.length) {
    const currentReportUrls = new Set(sourceReports.map((report) => report.url));
    sourceReports = [...previousIndex.sources.filter((report) => !currentReportUrls.has(report.url)), ...sourceReports];
  }
  sourceReports = dedupeSourceReports(sourceReports);
  const rawItems = allParsedSources.flatMap((entry) => entry.items);
  const preservedItems = previousIndex?.items || [];
  const twiscanResolution = resolveTwiscanMirrors([...preservedItems, ...rawItems]);
  const instalkerReaderResolution = resolveInstalkerReaderMirrors(twiscanResolution.items);
  const baseItemsBeforeConversations = mergeItems(instalkerReaderResolution.items);
  const twiscanStats = twiscanResolutionStats(baseItemsBeforeConversations);
  const instalkerReaderStats = instalkerReaderResolutionStats(baseItemsBeforeConversations);
  sourceReports = sourceReports.map((report) =>
    report.source === "twiscan"
      ? (() => {
          const twiscanTotal = twiscanStats.total || Number(report.twiscanPostCount) || 0;
          const twiscanResolved = Math.min(twiscanTotal, twiscanStats.resolved);
          return {
            ...report,
            twiscanPostCount: twiscanTotal,
            twiscanResolvedCount: twiscanResolved,
            twiscanUnresolvedCount: Math.max(0, twiscanTotal - twiscanResolved),
          };
        })()
      : report.source === "instalker-reader"
        ? (() => {
            const readerTotal = instalkerReaderStats.total || Number(report.instalkerReaderPostCount) || 0;
            const readerResolved = Math.min(readerTotal, instalkerReaderStats.resolved);
            return {
              ...report,
              instalkerReaderPostCount: readerTotal,
              instalkerReaderResolvedCount: readerResolved,
              instalkerReaderUnresolvedCount: Math.max(0, readerTotal - readerResolved),
            };
          })()
      : report
  );

  const indexedClaim =
    sourceReports.map((report) => report.indexedClaim).filter((claim) => Number.isFinite(claim)).sort((a, b) => b - a)[0] || null;
  const conversationParsed = await parseFxTwitterConversations(baseItemsBeforeConversations);
  const conversationReport = {
    source: conversationParsed.label,
    url: "https://api.fxtwitter.com/2/conversation",
    indexedClaim: null,
    fxTwitterConversationCount: conversationParsed.fxTwitterConversationCount,
    fxTwitterConversationFetched: conversationParsed.fxTwitterConversationFetched,
    fxTwitterReplyCount: conversationParsed.fxTwitterReplyCount,
    fxTwitterConversationErrorCount: conversationParsed.fxTwitterConversationErrorCount,
    fxTwitterConversationErrors: conversationParsed.fxTwitterConversationErrors,
    parsedItems: conversationParsed.items.length,
  };
  sourceReports = [...sourceReports, mergeSourceReportsWithPrevious([conversationReport], previousIndex?.sources || [])[0]];
  const baseItems = mergeItems([...baseItemsBeforeConversations, ...conversationParsed.items]);
  const enrichedResult = await enrichItems(baseItems);
  const fxTwitterReport = enrichedResult.report
    ? mergeSourceReportsWithPrevious([enrichedResult.report], previousIndex?.sources || [])[0]
    : null;
  if (fxTwitterReport) sourceReports = [...sourceReports, fxTwitterReport];
  sourceReports = dedupeSourceReports(sourceReports);
  const items = mergeItems(enrichedResult.items).sort((a, b) => b.materiality - a.materiality);
  const previousSourceUrls = String(previousIndex?.source || "")
    .split(/\s*,\s*/)
    .map((url) => url.trim())
    .filter(Boolean);
  const persistedSourceUrls = PRESERVE_PREVIOUS_SOURCES ? unique([...previousSourceUrls, ...SOURCE_URLS]) : SOURCE_URLS;
  const distillation = summarize(items, indexedClaim, sourceReports, persistedSourceUrls);
  const fxTwitterProfile = mergeFxTwitterProfileClaim(fxTwitterReport?.fxTwitterProfile || previousIndex?.fxTwitterProfile || null, items, sourceReports);
  const commentBackfillQueue = commentBackfillQueueSummary(items, sourceReports);

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, "serenity-tweets.json"),
    JSON.stringify(
      {
        source: persistedSourceUrls.join(", "),
        sources: sourceReports,
        scrapedAt: new Date().toISOString(),
        indexedClaim,
        oembedEnriched: items.filter((item) => item.oembed).length,
        fxTwitterProfile,
        fxTwitterArchive: fxArchiveSummary(fxTwitterArchive),
        fxTwitterStatusEnriched: items.filter((item) => item.fxTwitter).length,
        commentCount: distillation.commentCount,
        commentSignals: distillation.commentSignals,
        commentBackfillQueue,
        engagementTotals: distillation.engagementTotals,
        coverageClaims: distillation.coverageClaims,
        items,
      },
      null,
      2
    )
  );
  fs.writeFileSync(path.join(DATA_DIR, "serenity-distillation.json"), JSON.stringify(distillation, null, 2));

  console.log(
    JSON.stringify(
      {
        sources: sourceReports,
        indexedClaim,
        parsedItems: items.length,
        oembedEnriched: distillation.oembedEnriched,
        fxTwitterStatusEnriched: items.filter((item) => item.fxTwitter).length,
        fxTwitterArchive: fxArchiveSummary(fxTwitterArchive),
        twiscanResolution: twiscanStats,
        commentCount: distillation.commentCount,
        engagementTotals: distillation.engagementTotals,
        coverageClaims: distillation.coverageClaims,
        symbols: distillation.symbols.slice(0, 12).map((item) => item.symbol),
        themes: distillation.themes,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
