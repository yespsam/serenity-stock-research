const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "netlify-dist");

const symbolIdentityData = readJsonIfExists("data/symbol-aliases.json") || { identities: [] };
const symbolIdentities = normalizeIdentities(symbolIdentityData.identities || []);
const aliasGroups = symbolIdentities.map((identity) => [identity.canonical, ...identity.aliases]);
const identityByAlias = buildIdentityByAlias(symbolIdentities);

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function readJsonIfExists(file) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(ROOT, from), to);
}

function normalizeSymbol(value = "") {
  return String(value || "").trim().replace(/^\$+/, "").toUpperCase();
}

function uniqueSymbols(values = []) {
  return [...new Set(values.map(normalizeSymbol).filter(Boolean))];
}

function normalizeIdentities(identities = []) {
  return identities
    .map((identity) => {
      const canonical = normalizeSymbol(identity.canonical);
      const marketSymbol = normalizeSymbol(identity.marketSymbol || canonical);
      const aliases = uniqueSymbols([canonical, marketSymbol, ...(identity.aliases || [])]);
      return {
        canonical,
        marketSymbol,
        companyName: identity.companyName || canonical,
        aliases,
        exchangeHint: identity.exchangeHint || "",
      };
    })
    .filter((identity) => identity.canonical);
}

function buildIdentityByAlias(identities = []) {
  const map = new Map();
  for (const identity of identities) {
    for (const alias of uniqueSymbols([identity.canonical, identity.marketSymbol, ...identity.aliases])) {
      map.set(alias, identity);
    }
  }
  return map;
}

function identityForSymbol(symbol = "") {
  return identityByAlias.get(normalizeSymbol(symbol));
}

function canonicalSymbol(symbol = "") {
  return identityForSymbol(symbol)?.canonical || normalizeSymbol(symbol);
}

function aliasesForSymbol(symbol = "") {
  const identity = identityForSymbol(symbol);
  return identity ? uniqueSymbols([identity.canonical, identity.marketSymbol, ...identity.aliases]) : [normalizeSymbol(symbol)].filter(Boolean);
}

function compactItem(item) {
  return {
    id: item.id,
    date: item.date,
    title: item.title || "",
    body: item.body || "",
    symbols: uniqueSymbols((item.symbols || []).map(canonicalSymbol)).slice(0, 12),
    theme: item.theme || "general",
    materiality: item.materiality || 0,
    sentiment: item.sentiment || "neutral",
    url: item.url || "",
  };
}

function validDate(value) {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return false;
  return time >= Date.parse("2024-01-01") && time <= Date.now() + 86_400_000;
}

function parsedTime(value) {
  const time = Date.parse(value || 0);
  return Number.isFinite(time) ? time : 0;
}

function isPublicTimelineStatus(item = {}) {
  if ((item.sourceList || []).includes("fxtwitter-timeline")) return true;
  return (item.sourceUrls || []).some(
    (url) => typeof url === "string" && url.includes("/profile/aleabitoreddit/statuses") && !url.includes("with_replies=1")
  );
}

function isLikelyReply(item = {}) {
  const text = String(item.title || item.body || "").trim();
  return text.startsWith("@");
}

function archiveItems(archive = {}) {
  return [
    ...(archive.timeline?.items || []),
    ...(archive.withRepliesTimeline?.items || []),
    ...(archive.authorSearch?.items || []),
  ];
}

function historyCandidate(item, symbol) {
  return {
    id: item.id || item.url || `${symbol}-${item.date}`,
    symbol: canonicalSymbol(symbol),
    date: item.date,
    title: item.title || "",
    body: item.body || "",
    sentiment: item.sentiment || "neutral",
    theme: item.theme || "general",
    materiality: item.materiality || 0,
    url: item.url || "",
  };
}

function buildHistoryCandidates(items = []) {
  const candidates = [];
  for (const group of aliasGroups) {
    const canonical = canonicalSymbol(group[0]);
    const aliases = new Set(uniqueSymbols(group.flatMap(aliasesForSymbol)));
    const hits = items
      .filter((item) => validDate(item.date))
      .filter((item) => (item.symbols || []).some((symbol) => aliases.has(normalizeSymbol(symbol))))
      .filter((item) => item.sentiment !== "bear")
      .sort((a, b) => {
        const materiality = Number(b.materiality || 0) - Number(a.materiality || 0);
        if (materiality) return materiality;
        return Date.parse(a.date || 0) - Date.parse(b.date || 0);
      });
    const early = hits
      .slice()
      .filter((item) => Number(item.materiality || 0) >= 55)
      .sort((a, b) => Date.parse(a.date || 0) - Date.parse(b.date || 0))[0];
    const strong = hits[0];
    for (const item of [early, strong].filter(Boolean)) {
      const key = `${canonical}:${item.id || item.url || item.date}`;
      if (!candidates.some((entry) => `${entry.symbol}:${entry.id}` === key)) candidates.push(historyCandidate(item, canonical));
    }
  }
  return candidates
    .sort((a, b) => Number(b.materiality || 0) - Number(a.materiality || 0) || Date.parse(a.date || 0) - Date.parse(b.date || 0))
    .slice(0, 18);
}

function buildMonitorSnapshot(tweets = {}, archive = null) {
  const datedItems = (tweets.items || []).filter((item) => validDate(item.date));
  const latestFromTweets = (
    datedItems.some((item) => isPublicTimelineStatus(item)) ? datedItems.filter((item) => isPublicTimelineStatus(item)) : datedItems
  ).sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0))[0];
  const latestArchiveFallback = archiveItems(archive)
    .filter((item) => validDate(item.date))
    .filter((item) => !isLikelyReply(item))
    .sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0))[0];
  const latest =
    parsedTime(latestArchiveFallback?.date) > parsedTime(latestFromTweets?.date) ? latestArchiveFallback : latestFromTweets;
  return {
    staticUpdatedAt: tweets.scrapedAt || "",
    latestCaptured: latest ? compactItem(latest) : null,
    profileTweets: tweets.fxTwitterProfile?.tweets || 0,
    source: "FxTwitter / SerenitySaid / public mirrors",
    pollIntervalSeconds: 1,
  };
}

function buildPublicSymbols(symbols = []) {
  const merged = new Map();
  for (const item of symbols) {
    const canonical = canonicalSymbol(item.symbol);
    if (!canonical) continue;
    const identity = identityForSymbol(canonical);
    const previous = merged.get(canonical) || {
      symbol: canonical,
      aliases: aliasesForSymbol(canonical).filter((alias) => alias !== canonical),
      marketSymbol: identity?.marketSymbol || canonical,
      mentions: 0,
      bull: 0,
      bear: 0,
      neutral: 0,
      materiality: 0,
      latest: "",
      dominantTheme: item.dominantTheme || "general",
      sentimentScore: 0,
      themeVotes: {},
    };
    previous.mentions += Number(item.mentions || 0);
    previous.bull += Number(item.bull || 0);
    previous.bear += Number(item.bear || 0);
    previous.neutral += Number(item.neutral || 0);
    previous.sentimentScore += Number(item.sentimentScore || 0);
    previous.materiality = Math.max(previous.materiality, Number(item.materiality || 0));
    if (parsedTime(item.latest) > parsedTime(previous.latest)) previous.latest = item.latest || "";
    const theme = item.dominantTheme || "general";
    previous.themeVotes[theme] = (previous.themeVotes[theme] || 0) + Number(item.mentions || 1);
    previous.dominantTheme = Object.entries(previous.themeVotes).sort((a, b) => b[1] - a[1])[0]?.[0] || previous.dominantTheme;
    merged.set(canonical, previous);
  }
  return [...merged.values()]
    .map(({ themeVotes, ...item }) => item)
    .sort((a, b) => Number(b.sentimentScore || 0) - Number(a.sentimentScore || 0) || Number(b.mentions || 0) - Number(a.mentions || 0))
    .slice(0, 220);
}

function buildPublicData() {
  const existingPublic = path.join(ROOT, "data/serenity-public.json");
  const requiredRaw = ["data/serenity-research.json", "data/serenity-tweets.json", "data/serenity-distillation.json"].every((file) =>
    fs.existsSync(path.join(ROOT, file))
  );
  if (!requiredRaw && fs.existsSync(existingPublic)) {
    return JSON.parse(fs.readFileSync(existingPublic, "utf8"));
  }

  const research = readJson("data/serenity-research.json");
  const tweets = readJson("data/serenity-tweets.json");
  const distillation = readJson("data/serenity-distillation.json");
  const fxTwitterArchive = readJsonIfExists("data/serenity-fxtwitter-archive.json");
  const previousPublic = fs.existsSync(existingPublic) ? JSON.parse(fs.readFileSync(existingPublic, "utf8")) : null;
  const picked = new Map();

  for (const group of aliasGroups) {
    const aliases = new Set(uniqueSymbols(group.flatMap(aliasesForSymbol)));
    const hits = (tweets.items || [])
      .filter((item) => (item.symbols || []).some((symbol) => aliases.has(normalizeSymbol(symbol))))
      .sort((a, b) => Number(b.materiality || 0) - Number(a.materiality || 0) || Date.parse(b.date || 0) - Date.parse(a.date || 0))
      .slice(0, 6);
    for (const item of hits) picked.set(String(item.id || item.url), compactItem(item));
  }

  const publicData = {
    generatedAt: new Date().toISOString(),
    profile: research.profile || {},
    stats: {
      parsedItems: distillation.parsedItems || tweets.items?.length || 0,
      commentCount: distillation.commentCount || tweets.commentCount || 0,
      profileTweets: tweets.fxTwitterProfile?.tweets || 0,
      latestItemDate: (tweets.items || [])
        .filter((item) => validDate(item.date))
        .sort((a, b) => Date.parse(b.date || 0) - Date.parse(a.date || 0))[0]?.date || "",
    },
    rules: (distillation.rules || []).slice(0, 9),
    symbols: buildPublicSymbols(distillation.symbols || []),
    items: [...picked.values()],
    history: buildHistoryCandidates(tweets.items || []),
    monitor: buildMonitorSnapshot(tweets, fxTwitterArchive),
  };

  const previousLatest = previousPublic?.monitor?.latestCaptured;
  const nextLatest = publicData.monitor?.latestCaptured;
  if (parsedTime(previousLatest?.date) > parsedTime(nextLatest?.date)) {
    publicData.monitor = {
      ...publicData.monitor,
      latestCaptured: previousLatest,
      profileTweets: Math.max(Number(publicData.monitor?.profileTweets || 0), Number(previousPublic?.monitor?.profileTweets || 0)),
      staticUpdatedAt: previousPublic.monitor?.staticUpdatedAt || publicData.monitor?.staticUpdatedAt || "",
    };
    publicData.stats = {
      ...publicData.stats,
      latestItemDate: previousLatest.date || publicData.stats.latestItemDate,
      profileTweets: Math.max(Number(publicData.stats?.profileTweets || 0), Number(previousPublic?.stats?.profileTweets || 0)),
    };
  }

  return publicData;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "data"), { recursive: true });

for (const file of ["index.html", "styles.css", "app.js", "manifest.webmanifest", "sw.js"]) {
  copyFile(file, path.join(OUT, file));
}
copyFile("assets/serenity-ai-strategist.png", path.join(OUT, "assets/serenity-ai-strategist.png"));
copyFile("assets/serenity-icon.svg", path.join(OUT, "assets/serenity-icon.svg"));
copyFile("data/symbol-aliases.json", path.join(OUT, "data/symbol-aliases.json"));

const publicData = buildPublicData();
fs.writeFileSync(path.join(ROOT, "data/serenity-public.json"), `${JSON.stringify(publicData, null, 2)}\n`);
fs.writeFileSync(path.join(OUT, "data/serenity-public.json"), `${JSON.stringify(publicData)}\n`);

console.log(`Built ${path.relative(ROOT, OUT)} with ${publicData.items.length} public evidence items.`);
