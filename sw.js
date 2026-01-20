// Service Worker for Majestor Kepseu Portfolio
const CACHE_NAME = 'portfolio-v5.5';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/animations.css',
    '/light-theme.css',
    '/script.js',
    '/theme-manager.js',
    '/lightbox.js',
    '/manifest.json',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/projects/project-styles.css',
    '/projects/virtualization-cluster.html',
    '/projects/exchange-server-dag.html',
    '/projects/multi-region-network.html',
    '/projects/secure-enterprise-network.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400&display=swap'
];

// Install event
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing v5.5...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating v5.5...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip Chrome extensions
    if (event.request.url.startsWith('chrome-extension://')) return;

    // Network-first for dynamic content, cache-first for static assets
    if (event.request.url.includes('/assets/') ||
        event.request.url.includes('cdnjs.cloudflare.com') ||
        event.request.url.includes('fonts.googleapis.com')) {
        // Cache-first for static assets
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
                })
        );
    } else {
        // Network-first for HTML pages
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    // Clone the response
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
                .catch(() => {
                    // If network fails, try cache
                    return caches.match(event.request)
                        .then(response => {
                            if (response) {
                                return response;
                            }
                            // If not in cache, return offline page
                            return caches.match('/index.html');
                        });
                })
        );
    }
});