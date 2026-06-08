const CACHE_NAME = "serenity-shell-v3";
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.webmanifest",
  "/assets/serenity-icon.svg",
  "/assets/serenity-ai-strategist.png",
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
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/index.html")))
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
      icon: "/assets/serenity-icon.svg",
      badge: "/assets/serenity-icon.svg",
      data: { url: data.url || "/#monitor" },
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
      icon: "/assets/serenity-icon.svg",
      badge: "/assets/serenity-icon.svg",
      data: { url: payload.url || "/#monitor" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/#monitor", self.location.origin).href;
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
