importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_NAME = 'bikeaffair-cache-v1';
const urlsToCache = [
    '/',  // Cache homepage
    '/assets/main.css',  // Cache main CSS
    '/assets/main.js',  // Cache main JS
    '/templates/page.offline.liquid',  // Cache offline page
    'https://www.thebikeaffair.com/cdn/shop/files/The_Bike_Affair_Logo_White.webp?v=1722755319&width=560',  // Cache logo
    'https://cdn.shopify.com/s/files/1/0558/5869/2257/files/TBA_192.png?v=1725728414',  // Cache icon
    'https://cdn.shopify.com/s/files/1/0558/5869/2257/files/TBA_512.png?v=1725728415',  // Cache icon
];

// Install event: caching essential resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: serve cached content or fetch from network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Serve from cache if available, else fetch from network
            return response || fetch(event.request).then(function(fetchResponse) {
                // Dynamically cache navigational assets
                if (event.request.url.startsWith(self.location.origin)) {
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, fetchResponse.clone());
                    });
                }
                return fetchResponse;
            });
        }).catch(function() {
            // Fallback to offline page if both cache and network fail
            return caches.match('/templates/page.offline.liquid');
        })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
