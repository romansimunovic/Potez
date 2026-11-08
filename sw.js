const CACHE_NAME = 'potez-pilot-v16';
const APP_SHELL = [
  '/',
  '/index.html',
  '/privacy.html',
  '/uvjeti.html',
  '/assets/styles.css',
  '/assets/accessibility.js',
  '/assets/navigation.js',
  '/assets/rewards.js',
  '/assets/app.js',
  '/assets/budget-data.js',
  '/assets/civic.js',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/potez-192.png',
  '/icons/potez-512.png',
  '/og-image.png'
];

const APP_SHELL_PATHS = new Set(APP_SHELL);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('potez-') && key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request)) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never intercept writes, third-party requests, or API calls.
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request).then(async (response) => {
      if (response.type === 'error') {
        return (await caches.match(request)) || (await caches.match('/index.html')) || response;
      }
      return response;
    }));
    return;
  }

  const isAppAsset =
    APP_SHELL_PATHS.has(url.pathname) ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/');

  if (isAppAsset) event.respondWith(networkFirst(request));
});
