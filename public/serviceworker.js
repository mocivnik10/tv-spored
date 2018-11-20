self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('the-magic-cache').then((cache) => {
      return cache.addAll([
        '/',
        'manifest.json',
        'site.js'
      ])
    })
  )
})