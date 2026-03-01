// ============================================================
//  OniList Service Worker v1.0
//  Strateji:
//   - Shell dosyaları (HTML/CSS/JS): Cache-first
//   - API istekleri (jikan/anilist): Network-first, cache fallback
//   - Resimler: Cache-first, 7 gün TTL
// ============================================================

const CACHE_NAME    = 'onilist-v1.0';
const API_CACHE     = 'onilist-api-v1.0';
const IMG_CACHE     = 'onilist-img-v1.0';

// Kurulumda önceden cache'e alınacak app shell dosyaları
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
    '/manifest.json'
];

// ===== INSTALL — shell dosyalarını önceden cache'e al =====
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(SHELL_URLS))
            .then(() => self.skipWaiting())
            .catch(err => console.warn('[SW] Install cache hatası:', err))
    );
});

// ===== ACTIVATE — eski cache'leri temizle =====
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

// ===== FETCH — istek tiplerine göre strateji =====
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Chrome extension veya non-http istekleri atla
    if (!request.url.startsWith('http')) return;

    // Supabase API — her zaman network (kullanıcı verisi kritik, asla stale gösterme)
    if (url.hostname.includes('supabase.co')) {
        return; // SW devreye girme, direkt network
    }

    // Jikan / AniList / Kitsu API — Network-first, hata varsa cache
    if (
        url.hostname.includes('api.jikan.moe') ||
        url.hostname.includes('graphql.anilist.co') ||
        url.hostname.includes('kitsu.io')
    ) {
        event.respondWith(networkFirstStrategy(request, API_CACHE, 60 * 60 * 3)); // 3 saatlik cache
        return;
    }

    // Resimler (CDN'ler dahil) — Cache-first, yoksa network'ten al
    if (
        request.destination === 'image' ||
        url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg|ico)$/)
    ) {
        event.respondWith(cacheFirstStrategy(request, IMG_CACHE, 60 * 60 * 24 * 7)); // 7 gün
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

    // App Shell (HTML/CSS/JS) — Cache-first, güncel değilse arka planda güncelle (Stale-While-Revalidate)
    if (
        request.destination === 'document' ||
        request.destination === 'script' ||
        request.destination === 'style' ||
        url.pathname.match(/\.(html|css|js|json)$/)
    ) {
        event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
        return;
    }

    // Diğer tüm istekler — Network-first
    event.respondWith(networkFirstStrategy(request, CACHE_NAME, 60 * 60));
});

// ============================================================
//  STRATEJI FONKSİYONLARI
// ============================================================

/**
 * Cache-First: Önce cache'e bak, yoksa network'ten al ve cache'e yaz.
 * maxAge: saniye cinsinden cache süresi (eski cache varsa geçerli say)
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
                // Süresi dolmuş: arka planda yenile ama şimdi yine cache'i dön
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
        // Network yok ve cache yok — boş 503
        return new Response('Çevrimdışısınız ve önbellek bulunamadı.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
}

/**
 * Network-First: Önce network'e git, hata varsa cache'ten dön.
 */
async function networkFirstStrategy(request, cacheName, maxAge) {
    const cache = await caches.open(cacheName);
    try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: 'Çevrimdışısınız', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Stale-While-Revalidate: Cache'i hemen dön, arka planda güncelle.
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetchAndCache(request, cache).catch(() => null);

    if (cached) return cached;

    // Cache yoksa network yanıtını bekle
    const fresh = await fetchPromise;
    if (fresh) return fresh;

    return new Response('Sayfa yüklenemedi. İnternet bağlantınızı kontrol edin.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}

/** Network'ten al, cache'e yaz, response döndür */
async function fetchAndCache(request, cache) {
    const response = await fetch(request);
    if (response.ok || response.status === 0) {
        await cache.put(request, response.clone());
    }
    return response;
}

// ===== PUSH BİLDİRİMLERİ (ileride kullanım için hazır) =====
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

console.log('[SW] OniList Service Worker v1.0 aktif');