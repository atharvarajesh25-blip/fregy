const CACHE_NAME = 'ts-v29.8-pwa-v3';
const BASE = new URL('./', self.registration.scope);
const APP_SHELL = [
  new URL('./', BASE).href,
  new URL('./index.html', BASE).href,
  new URL('./manifest.json', BASE).href,
  new URL('./icons/icon-192.png', BASE).href,
  new URL('./icons/icon-512.png', BASE).href,
  new URL('./icons/icon-maskable-512.png', BASE).href,
  new URL('./icons/apple-touch-icon.png', BASE).href,
  new URL('./icons/favicon-64.png', BASE).href
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached =>
        cached || caches.match(new URL('./index.html', BASE).href)
      ))
  );
});
