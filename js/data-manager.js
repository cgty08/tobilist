// DATA MANAGER v5.2 - Supabase + localStorage

const dataManager = {
    version: '5.2.0',
    currentUserId: null,
    saveTimeout: null,

    defaultData() {
        return {
            items: [],
            settings: { theme: 'dark', language: 'tr', notifications: true },
            streak: { count: 0, lastVisit: null, longest: 0 },
            xp: { level: 1, current: 0, total: 0 },
            achievements: [],
            calendar: {},
            social: {
                name: '',
                bio: '',
                avatar: '👤',
                cover: 'gradient1',
                joinDate: new Date().toISOString(),
                email: ''
            },
            favorites: [],
            watchHistory: []
        };
    },

    data: null,

    setUser(userId, remoteData = null) {
        this.currentUserId = userId;
        if (!userId) { this.data = this.defaultData(); return; }

        const localKey = 'onilist_user_' + userId;
        const backupKey = 'onilist_backup_' + userId;
        if (remoteData) {
            this.data = this.deepMerge(this.defaultData(), remoteData);
            try {
                const s = JSON.stringify(this.data);
                localStorage.setItem(localKey, s);
                localStorage.setItem(backupKey, s);
            } catch(e) {}
        } else {
            try {
                const stored = localStorage.getItem(localKey) || localStorage.getItem(backupKey);
                this.data = stored ? this.deepMerge(this.defaultData(), JSON.parse(stored)) : this.defaultData();
            } catch(e) { this.data = this.defaultData(); }
        }
    },

    saveAll() {
        if (!this.currentUserId || !this.data) return false;

        // Önce localStorage'a kaydet
        try {
            const s = JSON.stringify(this.data);
            localStorage.setItem('onilist_user_' + this.currentUserId, s);
            localStorage.setItem('onilist_backup_' + this.currentUserId, s);
        } catch(e) {
            console.warn('localStorage kayıt hatası (quota dolmuş olabilir):', e.message);
            // Kullanıcıya bildirim göster (showNotification global fonksiyon varsa)
            if (typeof showNotification === 'function') {
                showNotification('⚠️ Yerel depolama dolu! Veriler yalnızca buluta kaydediliyor.', 'warning');
            }
        }

        // Sonra Supabase'e kaydet
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
        }, 1500);
        return true;
    },

    save() { return this.saveAll(); },

    deepMerge(target, source) {
        if (!source) return target;
        const result = { ...target };
        for (const key in source) {
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
        const headers = ['İsim','Tip','Durum','Mevcut','Toplam','Puan','Tür','Tarih'];
        const rows = this.data.items.map(i => [
            '"' + (i.name||'').replace(/"/g,'""') + '"', i.type, i.status,
            i.currentEpisode || 0, i.totalEpisodes || 0, i.rating || 0,
            i.genre || '',
            new Date(i.addedDate).toLocaleDateString('tr-TR')
        ]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    importData(rawData) {
        try {
            const imported = JSON.parse(rawData);
            if (!this.data) return false;
            if (imported.data && imported.data.items) {
                const existing = this.data.items.map(i => i.name.toLowerCase());
                this.data.items = [...this.data.items, ...imported.data.items.filter(i => !existing.includes((i.name||'').toLowerCase()))];
            } else if (Array.isArray(imported)) {
                this.data.items = [...this.data.items, ...imported];
            }
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

console.log('✅ Data Manager v5.2 loaded');