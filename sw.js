/**
 * Service Worker — Eid Wishes PWA
 * Cache-first for offline support
 */
const SW_VERSION = '1.0.0';
const CACHE_NAME = `eid-wishes-v${SW_VERSION}`;
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './icons/icon-192.svg',
    './icons/icon-512.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Google Fonts: stale-while-revalidate
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache =>
                cache.match(event.request).then(cached => {
                    const fetchPromise = fetch(event.request).then(res => {
                        if (res.ok) cache.put(event.request, res.clone());
                        return res;
                    }).catch(() => cached);
                    return cached || fetchPromise;
                })
            )
        );
        return;
    }

    // Same-origin: cache-first
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).then(res => {
                if (res.ok && res.type === 'basic') {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return res;
            });
        }).catch(() => {
            if (event.request.destination === 'document') {
                return caches.match('./index.html');
            }
        })
    );
});
