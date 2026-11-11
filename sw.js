const CACHE = 'bald-brawler-runtime-v1';
const VERSIONED_BINARY = /^game-[a-f0-9]+\.(wasm|pck)$/;

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !VERSIONED_BINARY.test(url.pathname.split('/').pop())) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) await cache.put(event.request, response.clone());
    return response;
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
