// ============================================================
//  OniList Service Worker v1.2
//  Strateji:
//   - Shell dosyalari (HTML/CSS/JS): Cache-first
//   - APi istekleri (jikan/anilist): Network-first, cache fallback
//   - Resimler: Cache-first, 7 gun TTL
// ============================================================

const CACHE_NAME    = 'onilist-v1.4';
const API_CACHE     = 'onilist-api-v1.3';
const IMG_CACHE     = 'onilist-img-v1.3';

// Kurulumda onceden cache'e alinacak app shell dosyalari
const SHELL_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/auth.css',
    '/chat.css',
    '/app.js',
    '/auth.js',
    '/api.js',
    '/ui.js',
    '/chat.js',
    '/xp-system.js',
    '/data-manager.js',
    '/manifest.json',
    '/privacy.html',
    '/404.html',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-96.png'
];

// ===== iNSTALL — shell dosyalarini onceden cache'e al =====
// Zorunlu dosyalar (bunlar yoksa SW install olmaz):
const SHELL_REQUIRED = ['/', '/index.html', '/style.css', '/app.js', '/auth.js', '/api.js',
    '/ui.js', '/chat.js', '/xp-system.js', '/data-manager.js', '/manifest.json',
    '/auth.css', '/chat.css'];
// Opsiyonel dosyalar (bulunamazsa sessizce atla):
const SHELL_OPTIONAL = ['/privacy.html', '/404.html', '/icons/icon-192.png',
    '/icons/icon-512.png', '/icons/icon-96.png'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            // Zorunlu dosyalari cache'e al
            await cache.addAll(SHELL_REQUIRED);
            // Opsiyonel dosyalari tek tek dene, hata olursa atla
            await Promise.allSettled(
                SHELL_OPTIONAL.map(url =>
                    cache.add(url).catch(() => console.log('[SW] Opsiyonel dosya bulunamadi (normal):', url))
                )
            );
            return self.skipWaiting();
        }).catch(err => console.warn('[SW] install cache hatasi:', err))
    );
});

// ===== ACTiVATE — eski cache'leri temizle =====
self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME, API_CACHE, IMG_CACHE];
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => !currentCaches.includes(key))
                    .map(key => {
                        console.log('[SW] Eski cache siliniyor:', key);
                        return caches.delete(key);
                    })
            ))
            .then(() => self.clients.claim())
    );
});

// ===== FETCH — istek tiplerine gore strateji =====
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Chrome extension veya non-http istekleri atla
    if (!request.url.startsWith('http')) return;

    // Supabase APi — her zaman network (kullanici verisi kritik, asla stale gosterme)
    if (url.hostname.includes('supabase.co')) {
        return; // SW devreye girme, direkt network
    }

    // Jikan / AniList / Kitsu APi — Network-first, hata varsa cache
    if (
        url.hostname.includes('api.jikan.moe') ||
        url.hostname.includes('graphql.anilist.co') ||
        url.hostname.includes('kitsu.io')
    ) {
        event.respondWith(networkFirstStrategy(request, API_CACHE, 60 * 60 * 24)); // 24 saatlik cache
        return;
    }

    // Resimler (CDN'ler dahil) — Cache-first, yoksa network'ten al
    if (
        request.destination === 'image' ||
        url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg|ico)$/)
    ) {
        event.respondWith(cacheFirstStrategy(request, iMG_CACHE, 60 * 60 * 24 * 7)); // 7 gun
        return;
    }

    // Google Fonts — Cache-first
    if (
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')
    ) {
        event.respondWith(cacheFirstStrategy(request, CACHE_NAME, 60 * 60 * 24 * 30));
        return;
    }

    // App Shell (HTML/CSS/JS) — Cache-first, guncel degilse arka planda guncelle (Stale-While-Revalidate)
    if (
        request.destination === 'document' ||
        request.destination === 'script' ||
        request.destination === 'style' ||
        url.pathname.match(/\.(html|css|js|json)$/)
    ) {
        event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
        return;
    }

    // Diger tum istekler — Network-first
    event.respondWith(networkFirstStrategy(request, CACHE_NAME, 60 * 60));
});

// ============================================================
//  STRATEJi FONKSIYONLARi
// ============================================================

/**
 * Cache-First: Once cache'e bak, yoksa network'ten al ve cache'e yaz.
 * maxAge: saniye cinsinden cache suresi (eski cache varsa gecerli say)
 */
async function cacheFirstStrategy(request, cacheName, maxAge) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        // Cache tarihini kontrol et (Date header varsa)
        const dateHeader = cached.headers.get('date');
        if (dateHeader && maxAge) {
            const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
            if (age > maxAge) {
                // Suresi dolmus: arka planda yenile ama simdi yine cache'i don
                fetchAndCache(request, cache).catch(() => {});
            }
        }
        return cached;
    }

    try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
    } catch (err) {
        // Network yok ve cache yok — bos 503
        return new Response('You are offline and no cache is available.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
}

/**
 * Network-First: Once cache'e bak — suresi dolmamissa direkt don.
 * Suresi dolmussa veya cache yoksa network'e git, hata varsa cache'ten don.
 */
async function networkFirstStrategy(request, cacheName, maxAge) {
    const cache = await caches.open(cacheName);

    // Cache'de var mi ve suresi gecerli mi?
    if (maxAge) {
        const cached = await cache.match(request);
        if (cached) {
            const dateHeader = cached.headers.get('date');
            if (dateHeader) {
                const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
                if (age < maxAge) {
                    return cached; // Cache gecerli, network'e gitme
                }
            }
        }
    }

    try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Stale-While-Revalidate: Cache'i hemen don, arka planda guncelle.
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetchAndCache(request, cache).catch(() => null);

    if (cached) return cached;

    // Cache yoksa network yanitini bekle
    const fresh = await fetchPromise;
    if (fresh) return fresh;

    return new Response('Page could not be loaded. Please check your internet connection.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}

/** Network'ten al, cache'e yaz, response dondur */
async function fetchAndCache(request, cache) {
    const response = await fetch(request);
    if (response.ok || response.status === 0) {
        await cache.put(request, response.clone());
    }
    return response;
}

// ===== PUSH BILDIRIMLERI (ileride kullanim icin hazir) =====
self.addEventListener('push', event => {
    if (!event.data) return;
    try {
        const data = event.data.json();
        self.registration.showNotification(data.title || 'OniList', {
            body: data.body || '',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-96.png',
            data: { url: data.url || '/' }
        });
    } catch(e) {}
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
});

console.log('[SW] OniList Service Worker v1.2 active');