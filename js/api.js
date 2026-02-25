// API.JS v6.0 - Jikan + AniList + Kitsu — Genişletilmiş İçerik
// MangaDex kaldırıldı (CORS), AniList Kore manhwa ile webtoon zenginleştirildi

// ===== CACHE =====
const APICache = {
    PREFIX: 'at6_',
    HOURS: 72,   // 72 saat: 3 gün cache
    // Bellek içi cache - aynı oturumda tab yenilenirse tekrar API'ye gitme
    _mem: {},

    get(key) {
        // 1. Önce bellek cache'i (en hızlı)
        if (this._mem[key] && (Date.now() - this._mem[key].ts) / 3.6e6 < this.HOURS) {
            return this._mem[key].data;
        }
        // 2. localStorage (tarayıcı kapanıp açılsa bile)
        try {
            const raw = localStorage.getItem(this.PREFIX + key);
            if (!raw) return null;
            const { data, ts } = JSON.parse(raw);
            if ((Date.now() - ts) / 3.6e6 > this.HOURS) {
                localStorage.removeItem(this.PREFIX + key);
                return null;
            }
            this._mem[key] = { data, ts }; // Belleğe al
            return data;
        } catch { return null; }
    },

    set(key, data) {
        const ts = Date.now();
        this._mem[key] = { data, ts }; // Belleğe yaz
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify({ data, ts }));
        } catch {
            // localStorage doluysa eski at5_ kayıtlarını temizle
            try {
                Object.keys(localStorage)
                    .filter(k => k.startsWith('at6_'))
                    .sort((a, b) => {
                        try { return JSON.parse(localStorage.getItem(a)).ts - JSON.parse(localStorage.getItem(b)).ts; } catch { return 0; }
                    })
                    .slice(0, 5)
                    .forEach(k => localStorage.removeItem(k));
                localStorage.setItem(this.PREFIX + key, JSON.stringify({ data, ts }));
            } catch {}
        }
    },

    // Belirli bir key'i sil (takvim sync gibi durumlarda)
    clear(key) {
        delete this._mem[key];
        try { localStorage.removeItem(this.PREFIX + key); } catch {}
    },

    // Tüm cache'i sil
    clearAll() {
        this._mem = {};
        try {
            Object.keys(localStorage).filter(k => k.startsWith('at6_')).forEach(k => localStorage.removeItem(k));
        } catch {}
    }
};

// ===== GENRE MAP =====
function mapGenre(name) {
    if (!name) return null;
    const m = {
        'Action':'action','Adventure':'adventure','Comedy':'comedy','Drama':'drama',
        'Fantasy':'fantasy','Romance':'romance','Sci-Fi':'scifi','Science Fiction':'scifi',
        'Horror':'horror','Mystery':'mystery','Slice of Life':'slice','Slice Of Life':'slice',
        'Sports':'sports','Sport':'sports','Supernatural':'supernatural','Mecha':'mecha',
        'Psychological':'psychological','Thriller':'thriller','Shounen':'shounen',
        'Seinen':'seinen','Shoujo':'shoujo','Josei':'josei','Isekai':'isekai',
        'Historical':'historical','School':'school','School Life':'school','Music':'music',
        'Magic':'fantasy','Martial Arts':'action','Ecchi':null,'Hentai':null,'Boys Love':null,'Girls Love':null
    };
    if (name in m) return m[name];
    return name.toLowerCase().replace(/\s+/g,'_');
}

// ===== DEDUPLICATE =====
function normalizeTitle(name) {
    return (name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .replace(/^the/, '')
        .substring(0, 30);
}

function deduplicateContent(items) {
    const seenIds = new Set();
    const seenNames = new Map();
    const result = [];

    for (const item of items) {
        if (!item || !item.name || !item.poster) continue;
        if (seenIds.has(item.id)) continue;
        seenIds.add(item.id);

        const key1 = item.type + '_' + normalizeTitle(item.name);
        const key2 = item.nameEn ? item.type + '_' + normalizeTitle(item.nameEn) : null;

        const existingKey = seenNames.has(key1) ? key1 : (key2 && seenNames.has(key2) ? key2 : null);

        if (existingKey) {
            const ex = seenNames.get(existingKey);
            const itemBetter = (item.rating || 0) > (ex.rating || 0) || (!ex.poster && item.poster);
            if (itemBetter) {
                const idx = result.findIndex(r => r.id === ex.id);
                if (idx !== -1) result[idx] = item;
                seenNames.set(key1, item);
                if (key2) seenNames.set(key2, item);
            }
            continue;
        }

        seenNames.set(key1, item);
        if (key2 && key2 !== key1) seenNames.set(key2, item);
        result.push(item);
    }
    return result;
}

// ===== JIKAN API =====
const _Jikan = {
    BASE: 'https://api.jikan.moe/v4',
    _last: 0, _queue: [], _busy: false,

    async fetch(url) {
        return new Promise((resolve, reject) => {
            this._queue.push({ url, resolve, reject });
            if (!this._busy) this._run();
        });
    },

    async _run() {
        this._busy = true;
        while (this._queue.length) {
            const { url, resolve, reject } = this._queue.shift();
            const wait = Math.max(0, 500 - (Date.now() - this._last));
            if (wait) await new Promise(r => setTimeout(r, wait));
            try {
                const res = await fetch(url);
                this._last = Date.now();
                if (res.status === 429) { await new Promise(r => setTimeout(r, 4000)); this._queue.unshift({url,resolve,reject}); continue; }
                if (!res.ok) throw new Error('Jikan ' + res.status);
                resolve(await res.json());
            } catch(e) { reject(e); }
        }
        this._busy = false;
    },

    _na(i) {
        return {
            id: 'mal_a_' + i.mal_id,
            name: i.title, nameEn: i.title_english || i.title, type: 'anime',
            poster: i.images?.jpg?.large_image_url || i.images?.jpg?.image_url || '',
            rating: i.score ? +i.score.toFixed(1) : null,
            year: i.year || (i.aired?.from ? new Date(i.aired.from).getFullYear() : null),
            episodes: i.episodes || null,
            synopsis: (i.synopsis || '').substring(0, 600),
            genres: (i.genres || []).map(g => mapGenre(g.name)).filter(Boolean),
            malId: i.mal_id, source: 'jikan'
        };
    },

    _nm(i) {
        const isW = i.type === 'Manhwa' || i.type === 'Manhua';
        return {
            id: 'mal_m_' + i.mal_id,
            name: i.title, nameEn: i.title_english || i.title,
            type: isW ? 'webtoon' : 'manga',
            poster: i.images?.jpg?.large_image_url || i.images?.jpg?.image_url || '',
            rating: i.score ? +i.score.toFixed(1) : null,
            year: i.published?.from ? new Date(i.published.from).getFullYear() : null,
            chapters: i.chapters || null,
            synopsis: (i.synopsis || '').substring(0, 600),
            genres: (i.genres || []).map(g => mapGenre(g.name)).filter(Boolean),
            malId: i.mal_id, source: 'jikan'
        };
    },

    async topAnime(pages = 12) {
        const ck = 'jk_a_' + pages; const c = APICache.get(ck); if (c) return c;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/top/anime?page=${p}&limit=25&filter=bypopularity`);
                if (d.data) out.push(...d.data.map(i => this._na(i)));
                if (!d.pagination?.has_next_page) break;
            } catch { break; }
        }
        APICache.set(ck, out); return out;
    },

    async topManga(pages = 10) {
        const ck = 'jk_m_' + pages; const c = APICache.get(ck); if (c) return c;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/top/manga?page=${p}&limit=25&filter=bypopularity`);
                if (d.data) out.push(...d.data.map(i => this._nm(i)));
                if (!d.pagination?.has_next_page) break;
            } catch { break; }
        }
        APICache.set(ck, out); return out;
    },

    async topWebtoon(pages = 8) {
        const ck = 'jk_w_' + pages; const c = APICache.get(ck); if (c) return c;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/manga?type=manhwa&order_by=score&sort=desc&page=${p}&limit=25&sfw=true`);
                if (d.data) out.push(...d.data.map(i => this._nm(i)));
                if (!d.pagination?.has_next_page) break;
            } catch { break; }
        }
        APICache.set(ck, out); return out;
    },

    async topManhua(pages = 6) {
        // Çin webtoon
        const ck = 'jk_mh_' + pages; const c = APICache.get(ck); if (c) return c;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/manga?type=manhua&order_by=score&sort=desc&page=${p}&limit=25&sfw=true`);
                if (d.data) out.push(...d.data.map(i => this._nm(i)));
                if (!d.pagination?.has_next_page) break;
            } catch { break; }
        }
        APICache.set(ck, out); return out;
    },

    async seasonNow() {
        const ck = 'jk_season'; const c = APICache.get(ck); if (c) return c;
        try {
            const d = await this.fetch(`${this.BASE}/seasons/now?limit=25&sfw=true`);
            const out = (d.data || []).map(i => this._na(i));
            APICache.set(ck, out); return out;
        } catch { return []; }
    },

    async searchAnime(q, limit = 8) {
        try { const d = await this.fetch(`${this.BASE}/anime?q=${encodeURIComponent(q)}&limit=${limit}&sfw=true&order_by=score&sort=desc`); return (d.data||[]).map(i=>this._na(i)); } catch { return []; }
    },

    async searchManga(q, limit = 8) {
        try { const d = await this.fetch(`${this.BASE}/manga?q=${encodeURIComponent(q)}&limit=${limit}&sfw=true&order_by=score&sort=desc`); return (d.data||[]).map(i=>this._nm(i)); } catch { return []; }
    }
};

// ===== ANİLİST GraphQL =====
const _AniList = {
    BASE: 'https://graphql.anilist.co',
    _last: 0,

    async query(gql, vars = {}) {
        const wait = Math.max(0, 800 - (Date.now() - this._last));
        if (wait) await new Promise(r => setTimeout(r, wait));
        const res = await fetch(this.BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: gql, variables: vars })
        });
        this._last = Date.now();
        if (res.status === 429) { await new Promise(r => setTimeout(r, 60000)); return this.query(gql, vars); }
        if (!res.ok) throw new Error('AniList ' + res.status);
        const json = await res.json();
        if (json.errors) throw new Error(json.errors[0]?.message || 'AniList error');
        return json.data;
    },

    _norm(i, forceType) {
        const isKorean = i.countryOfOrigin === 'KR';
        const isChinese = i.countryOfOrigin === 'CN' || i.countryOfOrigin === 'TW';
        let type = forceType;
        if (!type) {
            if (isKorean || isChinese) type = 'webtoon';
            else if ((i.format||'').toUpperCase() === 'MANGA') type = 'manga';
            else type = 'anime';
        }
        const studio = i.studios?.nodes?.[0]?.name || null;
        const director = (i.staff?.edges || []).find(e => e.role === 'Director')?.node?.name?.full || null;
        return {
            id: 'al_' + i.id,
            name: i.title?.romaji || i.title?.english || i.title?.native || 'Unknown',
            nameEn: i.title?.english || i.title?.romaji || '',
            type,
            poster: i.coverImage?.extraLarge || i.coverImage?.large || i.coverImage?.medium || '',
            color: i.coverImage?.color || null,
            rating: i.averageScore ? +(i.averageScore / 10).toFixed(1) : null,
            popularity: i.popularity || 0,
            year: i.seasonYear || i.startDate?.year || null,
            endYear: i.endDate?.year || null,
            episodes: i.episodes || null,
            chapters: i.chapters || null,
            volumes: i.volumes || null,
            status: i.status || null,
            synopsis: (i.description || '').replace(/<[^>]*>/g, '').substring(0, 600),
            genres: (i.genres || []).map(g => mapGenre(g)).filter(Boolean),
            tags: (i.tags || []).filter(t => !t.isMediaSpoiler && t.rank >= 60).slice(0,5).map(t => t.name),
            studio: studio,
            director: director,
            anilistId: i.id, source: 'anilist'
        };
    },

    FRAG: `id title{romaji english native} format coverImage{extraLarge large medium color} averageScore meanScore popularity seasonYear startDate{year} endDate{year} episodes chapters volumes description genres tags{name rank isMediaSpoiler} countryOfOrigin status studios{nodes{name}} staff{edges{role node{name{full}}}}`,

    async topAnime(pages = 10) {
        const ck = 'al_a_' + pages; const c = APICache.get(ck); if (c) return c;
        const gql = `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:ANIME,sort:[POPULARITY_DESC],isAdult:false){${this.FRAG}}}}`;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.query(gql, { p });
                out.push(...(d?.Page?.media || []).map(i => this._norm(i, 'anime')));
                if (!d?.Page?.pageInfo?.hasNextPage) break;
            } catch(e) { console.warn('AniList anime p' + p, e.message); break; }
        }
        APICache.set(ck, out); return out;
    },

    async topManga(pages = 8) {
        // Japon manga (CN/KR hariç)
        const ck = 'al_m_' + pages; const c = APICache.get(ck); if (c) return c;
        const gql = `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[POPULARITY_DESC],isAdult:false,countryOfOrigin:"JP"){${this.FRAG}}}}`;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.query(gql, { p });
                out.push(...(d?.Page?.media || []).map(i => this._norm(i, 'manga')));
                if (!d?.Page?.pageInfo?.hasNextPage) break;
            } catch(e) { console.warn('AniList manga p' + p, e.message); break; }
        }
        APICache.set(ck, out); return out;
    },

    async topWebtoon(pages = 12) {
        // Kore manhwa - AniList'in en güçlü olduğu alan
        const ck = 'al_w_' + pages; const c = APICache.get(ck); if (c) return c;
        const gql = `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[POPULARITY_DESC],isAdult:false,countryOfOrigin:"KR"){${this.FRAG}}}}`;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.query(gql, { p });
                out.push(...(d?.Page?.media || []).map(i => this._norm(i, 'webtoon')));
                if (!d?.Page?.pageInfo?.hasNextPage) break;
            } catch(e) { console.warn('AniList webtoon p' + p, e.message); break; }
        }
        APICache.set(ck, out); return out;
    },

    async topManhua(pages = 6) {
        // Çin manhwa
        const ck = 'al_mh_' + pages; const c = APICache.get(ck); if (c) return c;
        const gql = `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[POPULARITY_DESC],isAdult:false,countryOfOrigin:"CN"){${this.FRAG}}}}`;
        const out = [];
        for (let p = 1; p <= pages; p++) {
            try {
                const d = await this.query(gql, { p });
                out.push(...(d?.Page?.media || []).map(i => this._norm(i, 'webtoon')));
                if (!d?.Page?.pageInfo?.hasNextPage) break;
            } catch(e) { console.warn('AniList manhua p' + p, e.message); break; }
        }
        APICache.set(ck, out); return out;
    },

    async seasonal() {
        const ck = 'al_seasonal'; const c = APICache.get(ck); if (c) return c;
        const month = new Date().getMonth(), year = new Date().getFullYear();
        const season = ['WINTER','WINTER','WINTER','SPRING','SPRING','SPRING','SUMMER','SUMMER','SUMMER','FALL','FALL','FALL'][month];
        const gql = `query($s:MediaSeason,$y:Int){Page(perPage:50){media(season:$s,seasonYear:$y,type:ANIME,sort:[POPULARITY_DESC],isAdult:false){${this.FRAG}}}}`;
        try {
            const d = await this.query(gql, { s: season, y: year });
            const out = (d?.Page?.media || []).map(i => this._norm(i, 'anime'));
            APICache.set(ck, out); return out;
        } catch { return []; }
    },

    async search(q, limit = 10) {
        const gql = `query($q:String,$n:Int){Page(perPage:$n){media(search:$q,sort:[SEARCH_MATCH],isAdult:false){${this.FRAG}}}}`;
        try {
            const d = await this.query(gql, { q, n: limit });
            return (d?.Page?.media || []).map(i => this._norm(i));
        } catch { return []; }
    }
};

// ===== KİTSU API =====
const _Kitsu = {
    BASE: 'https://kitsu.io/api/edge',

    async fetch(url) {
        const res = await fetch(url, { headers: { 'Accept': 'application/vnd.api+json' } });
        if (!res.ok) throw new Error('Kitsu ' + res.status);
        return res.json();
    },

    _na(i) {
        const a = i.attributes || {};
        const title = a.canonicalTitle || a.titles?.en || a.titles?.en_jp || 'Unknown';
        return {
            id: 'kt_a_' + i.id, name: title, nameEn: a.titles?.en || title, type: 'anime',
            poster: a.posterImage?.large || a.posterImage?.medium || a.posterImage?.small || '',
            rating: a.averageRating ? +(parseFloat(a.averageRating) / 10).toFixed(1) : null,
            year: a.startDate ? new Date(a.startDate).getFullYear() : null,
            episodes: a.episodeCount || null,
            synopsis: (a.synopsis || '').substring(0, 600),
            genres: [], kitsuId: i.id, source: 'kitsu'
        };
    },

    _nm(i) {
        const a = i.attributes || {};
        const title = a.canonicalTitle || a.titles?.en || a.titles?.en_jp || 'Unknown';
        const sub = (a.subtype || '').toLowerCase();
        const isW = sub === 'manhwa' || sub === 'manhua' || sub === 'webtoon';
        return {
            id: 'kt_m_' + i.id, name: title, nameEn: a.titles?.en || title,
            type: isW ? 'webtoon' : 'manga',
            poster: a.posterImage?.large || a.posterImage?.medium || a.posterImage?.small || '',
            rating: a.averageRating ? +(parseFloat(a.averageRating) / 10).toFixed(1) : null,
            year: a.startDate ? new Date(a.startDate).getFullYear() : null,
            chapters: a.chapterCount || null,
            synopsis: (a.synopsis || '').substring(0, 600),
            genres: [], kitsuId: i.id, source: 'kitsu'
        };
    },

    async topAnime(pages = 7) {
        const ck = 'kt_a_' + pages; const c = APICache.get(ck); if (c) return c;
        const out = [];
        for (let p = 0; p < pages; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/anime?sort=-averageRating&page[limit]=20&page[offset]=${p * 20}&filter[subtype]=TV,ONA&fields[anime]=canonicalTitle,titles,posterImage,averageRating,startDate,episodeCount,synopsis`);
                if (d.data) out.push(...d.data.map(i => this._na(i)));
                await new Promise(r => setTimeout(r, 400));
            } catch(e) { break; }
        }
        APICache.set(ck, out); return out;
    },

    async topManga(pages = 6) {
        const ck = 'kt_m_' + pages; const c = APICache.get(ck); if (c) return c;
        const out = [];
        for (let p = 0; p < pages; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/manga?sort=-averageRating&page[limit]=20&page[offset]=${p * 20}&fields[manga]=canonicalTitle,titles,posterImage,averageRating,startDate,chapterCount,synopsis,subtype`);
                if (d.data) out.push(...d.data.map(i => this._nm(i)));
                await new Promise(r => setTimeout(r, 400));
            } catch(e) { break; }
        }
        APICache.set(ck, out); return out;
    },

    async search(q, type = 'anime', limit = 5) {
        try {
            const d = await this.fetch(`${this.BASE}/${type}?filter[text]=${encodeURIComponent(q)}&page[limit]=${limit}`);
            if (type === 'anime') return (d.data || []).map(i => this._na(i));
            return (d.data || []).map(i => this._nm(i));
        } catch { return []; }
    }
};

// ===== ANA FACADE =====
const JikanAPI = {

    async fetchSeasonNow(limit = 25) {
        const ck = 'season_v6'; const c = APICache.get(ck); if (c) return c;
        let results = [];
        try { results = await _AniList.seasonal(); } catch {}
        if (results.length < 10) { try { results = [...results, ...await _Jikan.seasonNow()]; } catch {} }
        const out = deduplicateContent(results).slice(0, limit);
        APICache.set(ck, out); return out;
    },

    async searchAll(query, limit = 8) {
        const [ja, jm, al, kt] = await Promise.allSettled([
            _Jikan.searchAnime(query, limit),
            _Jikan.searchManga(query, limit),
            _AniList.search(query, limit),
            _Kitsu.search(query, 'anime', 5)
        ]);
        const all = [
            ...(ja.status === 'fulfilled' ? ja.value : []),
            ...(jm.status === 'fulfilled' ? jm.value : []),
            ...(al.status === 'fulfilled' ? al.value : []),
            ...(kt.status === 'fulfilled' ? kt.value : []),
        ];
        return deduplicateContent(all).sort((a, b) => (b.rating||0) - (a.rating||0)).slice(0, limit * 2);
    },

    async loadAllContent(onProgress) {
        const ck = 'all_v6'; const c = APICache.get(ck);
        if (c) { if (onProgress) onProgress(c.length, c.length); return c; }

        // ── AŞAMA 1: HIZLI ÖN YÜKLEMİ (3-5 saniye) ──────────────────────────
        // Sadece AniList ilk sayfaları (hızlı GraphQL) → hemen ekrana yansıt
        const ckFast = 'all_v5_fast';
        const cached_fast = APICache.get(ckFast);

        if (!cached_fast) {
            if (onProgress) onProgress(0, 500);
            console.log('⚡ API: Hızlı ön yükleme başlıyor...');

            const [fastA, fastM, fastW] = await Promise.allSettled([
                _AniList.topAnime(3),    // 3×50 = 150 anime (hızlı)
                _AniList.topManga(3),    // 3×50 = 150 manga
                _AniList.topWebtoon(3),  // 3×50 = 150 webtoon
            ]);

            const fastAll = [
                ...(fastA.status === 'fulfilled' ? fastA.value : []),
                ...(fastM.status === 'fulfilled' ? fastM.value : []),
                ...(fastW.status === 'fulfilled' ? fastW.value : []),
            ];
            const fastDeduped = deduplicateContent(fastAll);
            APICache.set(ckFast, fastDeduped);
            if (onProgress) onProgress(fastDeduped.length, fastDeduped.length);
            console.log(`⚡ Hızlı yükleme tamamlandı: ${fastDeduped.length} içerik`);

            // UI'ya hızlı sonuçları göster
            if (window._onFastContentReady) window._onFastContentReady(fastDeduped);
        } else {
            if (onProgress) onProgress(cached_fast.length, cached_fast.length);
            if (window._onFastContentReady) window._onFastContentReady(cached_fast);
        }

        // ── AŞAMA 2: ARKA PLANDA TAM YÜKLEMİ ──────────────────────────────────
        // Bu Promise'i döndür ama UI'yı bloklamadan arka planda çalıştır
        if (onProgress) onProgress(0, 2000);
        console.log('🚀 API v5: Tam yükleme arka planda başlıyor...');

        // Grup 1: AniList (anime + manga + webtoon + manhua ayrı ayrı)
        const [alA, alM, alW, alMH, ktA, ktM] = await Promise.allSettled([
            _AniList.topAnime(10),   // 10×50 = 500 anime
            _AniList.topManga(8),    // 8×50  = 400 manga
            _AniList.topWebtoon(12), // 12×50 = 600 Kore webtoon
            _AniList.topManhua(6),   // 6×50  = 300 Çin webtoon
            _Kitsu.topAnime(7),      // 7×20  = 140 anime
            _Kitsu.topManga(6),      // 6×20  = 120 manga
        ]);

        // Grup 2: Jikan (rate limit ayrı - sıralı çalışır)
        const [jkA, jkM, jkW, jkMH] = await Promise.allSettled([
            _Jikan.topAnime(12),    // 12×25 = 300 anime
            _Jikan.topManga(10),    // 10×25 = 250 manga
            _Jikan.topWebtoon(8),   // 8×25  = 200 manhwa
            _Jikan.topManhua(6),    // 6×25  = 150 manhua
        ]);

        const all = [
            ...(alA.status  === 'fulfilled' ? alA.value  : []),
            ...(alM.status  === 'fulfilled' ? alM.value  : []),
            ...(alW.status  === 'fulfilled' ? alW.value  : []),
            ...(alMH.status === 'fulfilled' ? alMH.value : []),
            ...(ktA.status  === 'fulfilled' ? ktA.value  : []),
            ...(ktM.status  === 'fulfilled' ? ktM.value  : []),
            ...(jkA.status  === 'fulfilled' ? jkA.value  : []),
            ...(jkM.status  === 'fulfilled' ? jkM.value  : []),
            ...(jkW.status  === 'fulfilled' ? jkW.value  : []),
            ...(jkMH.status === 'fulfilled' ? jkMH.value : []),
        ];

        const deduped = deduplicateContent(all);
        const ac = deduped.filter(i => i.type === 'anime').length;
        const mc = deduped.filter(i => i.type === 'manga').length;
        const wc = deduped.filter(i => i.type === 'webtoon').length;
        console.log(`✅ ${deduped.length} içerik — Anime:${ac} Manga:${mc} Webtoon:${wc}`);

        APICache.set(ck, deduped);
        if (onProgress) onProgress(deduped.length, deduped.length);
        return deduped;
    }
};

console.log('✅ API v6.0 loaded — Jikan + AniList + Kitsu — ~3000+ içerik');