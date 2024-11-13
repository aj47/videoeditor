const CACHE_NAME = 'video-editor-v1';
const urlsToCache = [
  '/',
  '/public/index.html',
  '/public/style.css',
  '/public/manifest.json',
  '/assets/ffmpeg/package/dist/umd/ffmpeg.js',
  '/assets/util/package/dist/umd/index.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.error('Fetch failed:', error);
          // Return a fallback response or throw the error
          throw error;
        });
      })
  );
});
