// DATA MANAGER v5.2 - Supabase + localStorage

const dataManager = {
    version: '5.3.0',
    currentUserId: null,
    saveTimeout: null,

    defaultData() {
        return {
            items: [],
            settings: { theme: 'dark', language: 'en', notifications: true },
            streak: { count: 0, lastVisit: null, longest: 0 },
            xp: { level: 1, current: 0, total: 0 },
            achievements: [],
            calendar: {},
            social: {
                name: '',
                bio: '',
                avatar: '👤',
                cover: 'gradient1',
                joinDate: new Date().toISOString()
                // email buraya yazilmaz — auth.users'dan okunur
            },
            favorites: [],
            watchHistory: []
        };
    },

    data: null,

    setUser(userId, remoteData = null) {
        this.currentUserId = userId;
        if (!userId) { this.data = this.defaultData(); return; }

        const SAFE_ITEM_KEYS = [
            'id','name','nameEn','type','status','poster','rating',
            'currentEpisode','totalEpisodes','chapters','genre','genres',
            'synopsis','addedDate','year','malId','anilistId','kitsuId',
            'source','review','notes'
        ];
        function sanitizeItems(items) {
            if (!Array.isArray(items)) return [];
            return items.map(item => {
                if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
                const safe = {};
                for (const key of SAFE_ITEM_KEYS) {
                    if (Object.prototype.hasOwnProperty.call(item, key)) safe[key] = item[key];
                }
                return safe.name ? safe : null;
            }).filter(Boolean);
        }

        const localKey = 'onilist_user_' + userId;
        const backupKey = 'onilist_backup_' + userId;
        if (remoteData) {
            this.data = this.deepMerge(this.defaultData(), remoteData);
            this.data.items = sanitizeItems(this.data.items);
            try {
                const s = JSON.stringify(this.data);
                localStorage.setItem(localKey, s);
                localStorage.setItem(backupKey, s);
            } catch(e) {}
        } else {
            try {
                const stored = localStorage.getItem(localKey) || localStorage.getItem(backupKey);
                this.data = stored ? this.deepMerge(this.defaultData(), JSON.parse(stored)) : this.defaultData();
                this.data.items = sanitizeItems(this.data.items);
            } catch(e) { this.data = this.defaultData(); }
        }
    },

    saveAll() {
        if (!this.currentUserId || !this.data) return false;

        // ── GÜVENLİK: Veri bütünlüğü kontrolü ──────────────────────────
        // XP manipülasyonu tespiti
        const xp = this.data.xp;
        if (
            typeof xp?.total !== 'number' || xp.total < 0 || xp.total > 9_999_999 ||
            typeof xp?.level !== 'number' || xp.level < 1 || xp.level > 999 ||
            typeof xp?.current !== 'number' || xp.current < 0
        ) {
            console.warn('[Security] Geçersiz XP değeri tespit edildi, kayıt engellendi.');
            return false;
        }

        // email alanı user_data'da asla tutulmamalı
        if (this.data.social?.email) {
            delete this.data.social.email;
        }

        // is_admin client tarafından yazılamaz
        if (this.data.is_admin !== undefined) {
            delete this.data.is_admin;
        }
        if (this.data.social?.is_admin !== undefined) {
            delete this.data.social.is_admin;
        }
        // ── GÜVENLİK SONU ───────────────────────────────────────────────

        // Once localStorage'a kaydet
        try {
            const s = JSON.stringify(this.data);
            localStorage.setItem('onilist_user_' + this.currentUserId, s);
            localStorage.setItem('onilist_backup_' + this.currentUserId, s);
        } catch(e) {
            console.warn('localStorage kayit hatasi (quota dolmus olabilir):', e.message);
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Yerel depolama dolu! Veriler yalnizca buluta kaydediliyor.', 'warning');
            }
        }

        // Sonra Supabase'e kaydet (800ms debounce — onceki 1500ms'den dusuruldu)
        clearTimeout(this.saveTimeout);
        const userId = this.currentUserId;
        const snapshot = JSON.parse(JSON.stringify(this.data));
        this.saveTimeout = setTimeout(() => {
            if (window.supabaseClient && userId) {
                window.supabaseClient
                    .from('user_data')
                    .upsert({ user_id: userId, data: snapshot, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
                    .then(({ error }) => { if (error) console.warn('Supabase save error:', error.message); });
            }
        }, 800);
        return true;
    },

    // Sayfa kapanirken veya kritik anlarda beklemeden kaydet
    // keepalive: true — tarayici sekmeyi kapansa bile istegi tamamlar
    flushNow() {
        if (!this.currentUserId || !this.data) return;
        clearTimeout(this.saveTimeout);

        // Supabase client uzerinden gonder
        if (window.supabaseClient) {
            window.supabaseClient
                .from('user_data')
                .upsert({ user_id: this.currentUserId, data: this.data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
                .then(({ error }) => { if (error) console.warn('Supabase flushNow error:', error.message); });
        }

        // Ayrica Beacon APi ile guvenli fallback (sayfa kapansa bile iletilir)
        try {
            const payload = JSON.stringify({
                user_id: this.currentUserId,
                data: this.data,
                updated_at: new Date().toISOString()
            });
            if (navigator.sendBeacon && payload.length < 64000) {
                // Beacon yalnizca localStorage yedek olarak — asil kayit Supabase uzerinden
                localStorage.setItem('onilist_user_' + this.currentUserId, JSON.stringify(this.data));
            }
        } catch(e) {}
    },

    save() { return this.saveAll(); },

    // deepMerge — prototype pollution korumasi eklendi:
    // __proto__, constructor, prototype anahtarlari yoksayiliyor
    deepMerge(target, source) {
        if (!source) return target;
        const result = { ...target };
        for (const key in source) {
            // Sadece kaynak objenin kendi anahtarlarini al, prototype zincirinden gelenleri degil
            if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
            // Tehlikeli anahtarlari engelle
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    },

    exportJSON() {
        return JSON.stringify({ version: this.version, exportDate: new Date().toISOString(), data: this.data }, null, 2);
    },

    exportCSV() {
        if (!this.data) return '';
        const headers = ['Isim','Tip','Durum','Mevcut','Toplam','Puan','Tur','Tarih'];
        const rows = this.data.items.map(i => [
            '"' + (i.name||'').replace(/"/g,'""') + '"', i.type, i.status,
            i.currentEpisode || 0, i.totalEpisodes || 0, i.rating || 0,
            i.genre || '',
            new Date(i.addedDate).toLocaleDateString('tr-TR')
        ]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    // importData — prototype pollution + alan whitelist + boyut limiti korumasi
    importData(rawData) {
        try {
            // DoS korumasi: 5MB ustu JSON'u reddet
            if (!rawData || rawData.length > 5_000_000) return false;
            const imported = JSON.parse(rawData);
            if (!this.data) return false;

            // Guvenli alan listesi — disaridan gelen nesnede sadece bu anahtarlara izin ver
            const SAFE_ITEM_KEYS = [
                'id','name','nameEn','type','status','poster','rating',
                'currentEpisode','totalEpisodes','chapters','genre','genres',
                'synopsis','addedDate','year','malId','anilistId','kitsuId',
                'source','review','notes'
            ];

            function sanitizeItem(item) {
                if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
                const safe = {};
                for (const key of SAFE_ITEM_KEYS) {
                    if (Object.prototype.hasOwnProperty.call(item, key)) {
                        safe[key] = item[key];
                    }
                }
                return (safe.name) ? safe : null;
            }

            let newItems = [];
            if (imported.data && Array.isArray(imported.data.items)) {
                newItems = imported.data.items;
            } else if (Array.isArray(imported)) {
                newItems = imported;
            }

            const existing = this.data.items.map(i => (i.name || '').toLowerCase());
            const sanitized = newItems
                .map(sanitizeItem)
                .filter(i => i && !existing.includes((i.name || '').toLowerCase()));

            this.data.items = [...this.data.items, ...sanitized];
            this.saveAll();
            return true;
        } catch(e) { return false; }
    },

    toggleFavorite(itemId) {
        if (!this.data) return;
        const idx = this.data.favorites.indexOf(itemId);
        if (idx > -1) this.data.favorites.splice(idx, 1);
        else this.data.favorites.push(itemId);
        this.saveAll();
    }
};

console.log('✅ Data Manager v5.3 loaded (secure)');