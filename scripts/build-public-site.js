const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "netlify-dist");

const aliasGroups = [
  ["SIVEF", "SIVE", "SIVE.ST", "SIVEF"],
  ["AAOI"],
  ["AXTI"],
  ["LITE"],
  ["MRVL"],
  ["AEHR"],
  ["NBIS"],
  ["IREN"],
  ["COHR"],
  ["NVDA"],
  ["MSFT"],
  ["AMZN"],
  ["META"],
  ["MU"],
  ["TSM"],
  ["CIFR"],
  ["HOOD"],
  ["CRWV"],
  ["AVGO"],
  ["AMD"],
  ["JBL"],
  ["POET"],
  ["ALAB"],
  ["RKLB"],
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(ROOT, from), to);
}

function compactItem(item) {
  return {
    id: item.id,
    date: item.date,
    title: item.title || "",
    body: item.body || "",
    symbols: (item.symbols || []).slice(0, 12),
    theme: item.theme || "general",
    materiality: item.materiality || 0,
    sentiment: item.sentiment || "neutral",
    url: item.url || "",
  };
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
  const picked = new Map();

  for (const group of aliasGroups) {
    const aliases = new Set(group.map((symbol) => symbol.toUpperCase()));
    const hits = (tweets.items || [])
      .filter((item) => (item.symbols || []).some((symbol) => aliases.has(String(symbol).toUpperCase())))
      .sort((a, b) => Number(b.materiality || 0) - Number(a.materiality || 0) || Date.parse(b.date || 0) - Date.parse(a.date || 0))
      .slice(0, 6);
    for (const item of hits) picked.set(String(item.id || item.url), compactItem(item));
  }

  return {
    generatedAt: new Date().toISOString(),
    profile: research.profile || {},
    stats: {
      parsedItems: distillation.parsedItems || tweets.items?.length || 0,
      commentCount: distillation.commentCount || tweets.commentCount || 0,
      profileTweets: tweets.fxTwitterProfile?.tweets || 0,
    },
    rules: (distillation.rules || []).slice(0, 9),
    symbols: (distillation.symbols || []).slice(0, 220).map((item) => ({
      symbol: item.symbol,
      mentions: item.mentions || 0,
      bull: item.bull || 0,
      bear: item.bear || 0,
      neutral: item.neutral || 0,
      materiality: item.materiality || 0,
      latest: item.latest || "",
      dominantTheme: item.dominantTheme || "general",
      sentimentScore: item.sentimentScore || 0,
    })),
    items: [...picked.values()],
  };
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "data"), { recursive: true });

for (const file of ["index.html", "styles.css", "app.js"]) {
  copyFile(file, path.join(OUT, file));
}
copyFile("assets/serenity-ai-strategist.png", path.join(OUT, "assets/serenity-ai-strategist.png"));

const publicData = buildPublicData();
fs.writeFileSync(path.join(ROOT, "data/serenity-public.json"), `${JSON.stringify(publicData, null, 2)}\n`);
fs.writeFileSync(path.join(OUT, "data/serenity-public.json"), `${JSON.stringify(publicData)}\n`);

console.log(`Built ${path.relative(ROOT, OUT)} with ${publicData.items.length} public evidence items.`);
