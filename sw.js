// 手元の写し（c1b993e2a9）。ページは、つながっていれば新しいものを取り、つながらなければ写しを出す。字の形と図の部品は写しを使う
const CACHE = "gakuto-c1b993e2a9";
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./"])).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const keep = (res) => { if (res && res.ok) { const c = res.clone(); caches.open(CACHE).then((x) => x.put(req, c)); } return res; }; // 正しく届いたものだけを写す
  if (url.origin === location.origin) e.respondWith(fetch(req).then(keep).catch(() => caches.match(req).then((r) => r || caches.match("./"))));
  else if (/(^|\.)(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(url.hostname)) e.respondWith(caches.match(req).then((r) => r || fetch(req).then(keep)));
});
