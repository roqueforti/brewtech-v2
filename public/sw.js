self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Simple fetch listener to make it installable
  e.respondWith(fetch(e.request));
});
