const CACHE_NAME = "serenity-shell-v5";
const BASE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const shellPath = (path) => `${BASE_PATH}${path}`;
const SHELL_ASSETS = [
  shellPath("/"),
  shellPath("/index.html"),
  shellPath("/styles.css"),
  shellPath("/app.js"),
  shellPath("/manifest.webmanifest"),
  shellPath("/data/symbol-aliases.json"),
  shellPath("/assets/serenity-icon.svg"),
  shellPath("/assets/serenity-ai-strategist.png"),
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(shellPath("/index.html"))))
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type !== "SERENITY_NOTIFY") return;
  event.waitUntil(
    self.registration.showNotification(data.title || "Serenity 新推文", {
      body: data.body || "",
      tag: data.tag || "serenity-live",
      renotify: true,
      icon: shellPath("/assets/serenity-icon.svg"),
      badge: shellPath("/assets/serenity-icon.svg"),
      data: { url: data.url || shellPath("/#monitor") },
    })
  );
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "Serenity 新推文", body: event.data?.text() || "" };
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || "Serenity 新推文", {
      body: payload.body || "",
      tag: payload.tag || "serenity-live",
      renotify: true,
      icon: shellPath("/assets/serenity-icon.svg"),
      badge: shellPath("/assets/serenity-icon.svg"),
      data: { url: payload.url || shellPath("/#monitor") },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || shellPath("/#monitor"), self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.startsWith(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(targetUrl);
        return;
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
