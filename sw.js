const CACHE = 'firibstop-uz-v3.0.0-shell-v43';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png',
  './icon-512.png', './icon-maskable-512.png', './scams.json', './styles.css',
  './app.js',
  './uz-fix.js',
  './native-api.js', './link-checker.js', './runtime.js', './radar-dashboard.js',
  './data/world-land.geojson', './data/uzbekistan-regions-schematic.geojson'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('firibstop-uz-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  // Do not intercept third-party resources or API calls. This keeps network and offline
  // failures honest, avoids caching remote content, and preserves the app's privacy model.
  if (url.origin !== self.location.origin || url.pathname.includes('/api/')) return;

  const isNavigation = event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname === '/';
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (isNavigation) {
      try {
        const response = await fetch(event.request, { cache: 'no-store' });
        if (response && response.ok) {
          await cache.put(event.request, response.clone()).catch(() => {});
        }
        return response;
      } catch {
        return (await cache.match(event.request)) || (await cache.match('./index.html')) || new Response('Офлайн. Откройте FiribStop после подключения к сети.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    }

    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.ok) await cache.put(event.request, response.clone()).catch(() => {});
      return response;
    } catch {
      return new Response('Ресурс недоступен офлайн.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
