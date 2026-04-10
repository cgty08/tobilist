// APi.JS v7.1 - Jikan + AniList + Kitsu — adaptive deep paging
// Cache stratejisi: sadece final "all_v7" sonucu localStorage'a yazilir,
// ara sorgular sadece memory cache'te tutulur → localStorage tasmaz.

// ===== CACHE =====
const APICache = {
    PREFIX: 'at7_',
    HOURS: 72,
    _mem: {},
    _persistQueue: {},

    get(key) {
        if (this._mem[key] && (Date.now() - this._mem[key].ts) / 3.6e6 < this.HOURS) {
            return this._mem[key].data;
        }
        try {
            const raw = localStorage.getItem(this.PREFIX + key);
            if (!raw) return null;
            const { data, ts } = JSON.parse(raw);
            if ((Date.now() - ts) / 3.6e6 > this.HOURS) {
                localStorage.removeItem(this.PREFIX + key);
                return null;
            }
            this._mem[key] = { data, ts };
            return data;
        } catch { return null; }
    },

    // mem=true => sadece bellege yaz (localStorage'a degil)
    set(key, data, memOnly = false) {
        const ts = Date.now();
        this._mem[key] = { data, ts };
        if (memOnly) return;
        const payload = JSON.stringify({ data, ts });
        this._schedulePersist(key, payload);
    },

    _schedulePersist(key, payload) {
        const fullKey = this.PREFIX + key;
        this._persistQueue[fullKey] = payload;

        const flush = () => {
            const queued = this._persistQueue[fullKey];
            if (!queued) return;
            delete this._persistQueue[fullKey];
            try {
                localStorage.setItem(fullKey, queued);
            } catch {
                try {
                    Object.keys(localStorage)
                        .filter(k => k.startsWith(this.PREFIX))
                        .map(k => {
                            try { const p = JSON.parse(localStorage.getItem(k)); return { key: k, ts: p?.ts || 0 }; }
                            catch { return { key: k, ts: 0 }; }
                        })
                        .sort((a, b) => a.ts - b.ts)
                        .slice(0, 10)
                        .forEach(({ key: k }) => localStorage.removeItem(k));
                    localStorage.setItem(fullKey, queued);
                } catch {}
            }
        };

        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(flush, { timeout: 1500 });
        } else {
            setTimeout(flush, 0);
        }
    },

    clear(key) {
        delete this._mem[key];
        try { localStorage.removeItem(this.PREFIX + key); } catch {}
    },

    clearAll() {
        this._mem = {};
        try {
            Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX)).forEach(k => localStorage.removeItem(k));
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

// ===== DEDUPLiCATE =====
function normalizeTitle(name) {
    return (name || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .replace(/^the/, '')
        .substring(0, 30);
}

function buildAltNames() {
    const out = [];
    const seen = new Set();
    for (const v of arguments) {
        if (!v) continue;
        if (Array.isArray(v)) {
            v.forEach(x => {
                const s = String(x || '').trim();
                if (!s) return;
                const k = s.toLowerCase();
                if (seen.has(k)) return;
                seen.add(k);
                out.push(s);
            });
            continue;
        }
        const s = String(v).trim();
        if (!s) continue;
        const k = s.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(s);
    }
    return out;
}

function normalizeSearchText(name) {
    return String(name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]+/g, '');
}

function levenshteinWithin(a, b, maxDist) {
    if (!a || !b) return false;
    if (a === b) return true;
    const la = a.length;
    const lb = b.length;
    if (Math.abs(la - lb) > maxDist) return false;

    let prev = new Array(lb + 1);
    let cur = new Array(lb + 1);
    for (let j = 0; j <= lb; j++) prev[j] = j;

    for (let i = 1; i <= la; i++) {
        cur[0] = i;
        let rowMin = cur[0];
        const ca = a.charCodeAt(i - 1);
        for (let j = 1; j <= lb; j++) {
            const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
            cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
            if (cur[j] < rowMin) rowMin = cur[j];
        }
        if (rowMin > maxDist) return false;
        const tmp = prev;
        prev = cur;
        cur = tmp;
    }
    return prev[lb] <= maxDist;
}

function fuzzyTokenMatch(term, text) {
    if (!term || !text) return false;
    const maxDist = term.length >= 7 ? 2 : 1;
    const tokens = String(text).split(/\s+/).filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
        const tok = normalizeSearchText(tokens[i]);
        if (!tok) continue;
        if (tok.includes(term) || term.includes(tok)) return true;
        if (Math.abs(tok.length - term.length) > maxDist) continue;
        if (levenshteinWithin(term, tok, maxDist)) return true;
    }
    return false;
}

function searchMatchScore(item, query) {
    const q = normalizeSearchText(query);
    if (!q) return 0;
    const names = [item.name, item.nameEn].concat(item.altNames || []);
    let best = 0;
    names.forEach(n => {
        const s = normalizeSearchText(n);
        if (!s) return;
        if (s === q) best = Math.max(best, 120);
        else if (s.startsWith(q)) best = Math.max(best, 90);
        else if (s.includes(q)) best = Math.max(best, 70);
        else if (q.includes(s) && s.length >= 4) best = Math.max(best, 50);
        else if (q.length >= 4 && fuzzyTokenMatch(q, s)) best = Math.max(best, 58);
    });
    return best;
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
            const fresh = !!(item.isFreshRelease || ex.isFreshRelease);
            const itemBetter = (item.rating || 0) > (ex.rating || 0) || (!ex.poster && item.poster);
            if (itemBetter) {
                item.isFreshRelease = fresh;
                const idx = result.findIndex(r => r.id === ex.id);
                if (idx !== -1) result[idx] = item;
                seenNames.set(key1, item);
                if (key2) seenNames.set(key2, item);
            } else if (fresh && !ex.isFreshRelease) {
                ex.isFreshRelease = true;
                const idx = result.findIndex(r => r.id === ex.id);
                if (idx !== -1) result[idx].isFreshRelease = true;
            }
            continue;
        }

        seenNames.set(key1, item);
        if (key2 && key2 !== key1) seenNames.set(key2, item);
        result.push(item);
    }
    return result;
}

function slimContentForCache(items) {
    return (items || []).map(i => ({
        id: i.id,
        name: i.name,
        nameEn: i.nameEn || '',
        altNames: i.altNames || [],
        type: i.type,
        poster: i.poster || '',
        rating: i.rating ?? null,
        year: i.year ?? null,
        episodes: i.episodes ?? null,
        chapters: i.chapters ?? null,
        genres: i.genres || [],
        malId: i.malId ?? null,
        anilistId: i.anilistId ?? null,
        source: i.source || null,
        synopsis: i.synopsis ? String(i.synopsis).substring(0, 140) : ''
    }));
}

// ===== JiKAN APi (MAL) =====
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
            altNames: buildAltNames(i.title_english, i.title_japanese, i.title, i.title_synonyms || []),
            poster: i.images?.jpg?.large_image_url || i.images?.jpg?.image_url || '',
            rating: i.score ? +i.score.toFixed(1) : null,
            year: i.year || (i.aired?.from ? new Date(i.aired.from).getFullYear() : null),
            episodes: i.episodes || null,
            synopsis: (i.synopsis || '').substring(0, 500),
            genres: (i.genres || []).map(g => mapGenre(g.name)).filter(Boolean),
            malId: i.mal_id, source: 'jikan'
        };
    },

    _nm(i) {
        const isW = i.type === 'Manhwa' || i.type === 'Manhua';
        return {
            id: 'mal_m_' + i.mal_id,
            name: i.title, nameEn: i.title_english || i.title,
            altNames: buildAltNames(i.title_english, i.title_japanese, i.title, i.title_synonyms || []),
            type: isW ? 'webtoon' : 'manga',
            poster: i.images?.jpg?.large_image_url || i.images?.jpg?.image_url || '',
            rating: i.score ? +i.score.toFixed(1) : null,
            year: i.published?.from ? new Date(i.published.from).getFullYear() : null,
            chapters: i.chapters || null,
            synopsis: (i.synopsis || '').substring(0, 500),
            genres: (i.genres || []).map(g => mapGenre(g.name)).filter(Boolean),
            malId: i.mal_id, source: 'jikan'
        };
    },

    async _fetchPages(urlFn, mapper, pages, ckKey, startPage = 1) {
        const c = APICache.get(ckKey); if (c) return c;
        const out = [];
        const endPage = startPage + pages - 1;
        for (let p = startPage; p <= endPage; p++) {
            try {
                const d = await this.fetch(urlFn(p));
                if (d.data) out.push(...d.data.map(mapper));
                if (!d.pagination?.has_next_page) break;
            } catch { break; }
        }
        APICache.set(ckKey, out, true); // memOnly
        return out;
    },

    topAnime(pages = 16, startPage = 1) {
        return this._fetchPages(
            p => `${this.BASE}/top/anime?page=${p}&limit=25&filter=bypopularity`,
            i => this._na(i), pages, 'jk_a_' + pages + '_s' + startPage, startPage
        );
    },
    topManga(pages = 12, startPage = 1) {
        return this._fetchPages(
            p => `${this.BASE}/top/manga?page=${p}&limit=25&filter=bypopularity`,
            i => this._nm(i), pages, 'jk_m_' + pages + '_s' + startPage, startPage
        );
    },
    topWebtoon(pages = 12, startPage = 1) {
        return this._fetchPages(
            p => `${this.BASE}/manga?type=manhwa&order_by=score&sort=desc&page=${p}&limit=25&sfw=true`,
            i => this._nm(i), pages, 'jk_w_' + pages + '_s' + startPage, startPage
        );
    },
    topManhua(pages = 8, startPage = 1) {
        return this._fetchPages(
            p => `${this.BASE}/manga?type=manhua&order_by=score&sort=desc&page=${p}&limit=25&sfw=true`,
            i => this._nm(i), pages, 'jk_mh_' + pages + '_s' + startPage, startPage
        );
    },

    async seasonNow() {
        const ck = 'jk_season'; const c = APICache.get(ck); if (c) return c;
        try {
            const d = await this.fetch(`${this.BASE}/seasons/now?limit=25&sfw=true`);
            const out = (d.data || []).map(i => this._na(i));
            APICache.set(ck, out, true);
            return out;
        } catch { return []; }
    },

    async searchAnime(q, limit = 8) {
        try { const d = await this.fetch(`${this.BASE}/anime?q=${encodeURIComponent(q)}&limit=${limit}&sfw=true&order_by=score&sort=desc`); return (d.data||[]).map(i=>this._na(i)); } catch { return []; }
    },
    async searchManga(q, limit = 8) {
        try { const d = await this.fetch(`${this.BASE}/manga?q=${encodeURIComponent(q)}&limit=${limit}&sfw=true&order_by=score&sort=desc`); return (d.data||[]).map(i=>this._nm(i)); } catch { return []; }
    }
};

// ===== ANILIST GraphQL =====
const _AniList = {
    BASE: 'https://graphql.anilist.co',
    _last: 0,

    async query(gql, vars = {}, _retries = 0) {
        const wait = Math.max(0, 600 - (Date.now() - this._last));
        if (wait) await new Promise(r => setTimeout(r, wait));
        const res = await fetch(this.BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: gql, variables: vars })
        });
        this._last = Date.now();
        if (res.status === 429) {
            if (_retries >= 3) throw new Error('AniList rate limit: max retries exceeded');
            const delay = 15000 * Math.pow(2, _retries);
            await new Promise(r => setTimeout(r, delay));
            return this.query(gql, vars, _retries + 1);
        }
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
        return {
            id: 'al_' + i.id,
            name: i.title?.romaji || i.title?.english || i.title?.native || 'Unknown',
            nameEn: i.title?.english || i.title?.romaji || '',
            altNames: buildAltNames(i.title?.english, i.title?.romaji, i.title?.native),
            type,
            poster: i.coverImage?.extraLarge || i.coverImage?.large || i.coverImage?.medium || '',
            rating: i.averageScore ? +(i.averageScore / 10).toFixed(1) : null,
            year: i.seasonYear || i.startDate?.year || null,
            episodes: i.episodes || null,
            chapters: i.chapters || null,
            synopsis: (i.description || '').replace(/<[^>]*>/g, '').substring(0, 500),
            genres: (i.genres || []).map(g => mapGenre(g)).filter(Boolean),
            anilistId: i.id, source: 'anilist'
        };
    },

    FRAG: `id title{romaji english native} format coverImage{extraLarge large} averageScore seasonYear startDate{year} episodes chapters description genres countryOfOrigin`,

    // Helper: pages yukle, memOnly cache
    async _pages(ck, gql, mapper, pages, startPage = 1) {
        const c = APICache.get(ck); if (c) return c;
        const out = [];
        const endPage = startPage + pages - 1;
        for (let p = startPage; p <= endPage; p++) {
            try {
                const d = await this.query(gql, { p });
                const media = d?.Page?.media || [];
                out.push(...media.map(mapper));
                if (!d?.Page?.pageInfo?.hasNextPage) break;
            } catch(e) { console.warn(ck + ' p' + p, e.message); await new Promise(r=>setTimeout(r,2000)); continue; }
        }
        APICache.set(ck, out, true); // memOnly
        return out;
    },

    topAnime(pages = 15, startPage = 1) {
        return this._pages('al_a_pop_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:ANIME,sort:[POPULARITY_DESC],isAdult:false){${this.FRAG}}}}`,
            i => this._norm(i, 'anime'), pages, startPage);
    },
    topManga(pages = 14, startPage = 1) {
        return this._pages('al_m_pop_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[POPULARITY_DESC],isAdult:false,countryOfOrigin:"JP"){${this.FRAG}}}}`,
            i => this._norm(i, 'manga'), pages, startPage);
    },
    topWebtoon(pages = 20, startPage = 1) {
        return this._pages('al_w_pop_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[POPULARITY_DESC],isAdult:false,countryOfOrigin:"KR"){${this.FRAG}}}}`,
            i => this._norm(i, 'webtoon'), pages, startPage);
    },
    topManhua(pages = 10, startPage = 1) {
        return this._pages('al_mh_pop_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[POPULARITY_DESC],isAdult:false,countryOfOrigin:"CN"){${this.FRAG}}}}`,
            i => this._norm(i, 'webtoon'), pages, startPage);
    },
    topAnimeByScore(pages = 10, startPage = 1) {
        return this._pages('al_a_score_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:ANIME,sort:[SCORE_DESC],isAdult:false,averageScore_greater:60){${this.FRAG}}}}`,
            i => this._norm(i, 'anime'), pages, startPage);
    },
    topMangaByScore(pages = 8, startPage = 1) {
        return this._pages('al_m_score_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[SCORE_DESC],isAdult:false,countryOfOrigin:"JP",averageScore_greater:60){${this.FRAG}}}}`,
            i => this._norm(i, 'manga'), pages, startPage);
    },
    topWebtoonByScore(pages = 10, startPage = 1) {
        return this._pages('al_w_score_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[SCORE_DESC],isAdult:false,countryOfOrigin:"KR"){${this.FRAG}}}}`,
            i => this._norm(i, 'webtoon'), pages, startPage);
    },
    topManhuaByScore(pages = 6, startPage = 1) {
        return this._pages('al_mh_score_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[SCORE_DESC],isAdult:false,countryOfOrigin:"CN"){${this.FRAG}}}}`,
            i => this._norm(i, 'webtoon'), pages, startPage);
    },
    topAnimeTrending(pages = 5, startPage = 1) {
        return this._pages('al_a_trend_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:ANIME,sort:[TRENDING_DESC],isAdult:false){${this.FRAG}}}}`,
            i => this._norm(i, 'anime'), pages, startPage);
    },
    topMangaTrending(pages = 5, startPage = 1) {
        return this._pages('al_m_trend_' + pages + '_s' + startPage,
            `query($p:Int){Page(page:$p,perPage:50){pageInfo{hasNextPage}media(type:MANGA,sort:[TRENDING_DESC],isAdult:false){${this.FRAG}}}}`,
            i => this._norm(i), pages, startPage);
    },

    async seasonal() {
        const ck = 'al_seasonal'; const c = APICache.get(ck); if (c) return c;
        const month = new Date().getMonth(), year = new Date().getFullYear();
        const season = ['WINTER','WINTER','WINTER','SPRING','SPRING','SPRING','SUMMER','SUMMER','SUMMER','FALL','FALL','FALL'][month];
        const gql = `query($s:MediaSeason,$y:Int){Page(perPage:50){media(season:$s,seasonYear:$y,type:ANIME,sort:[POPULARITY_DESC],isAdult:false){${this.FRAG}}}}`;
        try {
            const d = await this.query(gql, { s: season, y: year });
            const out = (d?.Page?.media || []).map(i => this._norm(i, 'anime'));
            APICache.set(ck, out, true);
            return out;
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

// ===== KITSU APi =====
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
        const kitsuTitles = Object.values(a.titles || {}).filter(Boolean);
        return {
            id: 'kt_a_' + i.id, name: title, nameEn: a.titles?.en || title, type: 'anime',
            altNames: buildAltNames(title, kitsuTitles),
            poster: a.posterImage?.large || a.posterImage?.medium || a.posterImage?.small || '',
            rating: a.averageRating ? +(parseFloat(a.averageRating) / 10).toFixed(1) : null,
            year: a.startDate ? new Date(a.startDate).getFullYear() : null,
            episodes: a.episodeCount || null,
            synopsis: (a.synopsis || '').substring(0, 500),
            genres: [], kitsuId: i.id, source: 'kitsu'
        };
    },

    _nm(i) {
        const a = i.attributes || {};
        const title = a.canonicalTitle || a.titles?.en || a.titles?.en_jp || 'Unknown';
        const kitsuTitles = Object.values(a.titles || {}).filter(Boolean);
        const sub = (a.subtype || '').toLowerCase();
        const isW = sub === 'manhwa' || sub === 'manhua' || sub === 'webtoon';
        return {
            id: 'kt_m_' + i.id, name: title, nameEn: a.titles?.en || title,
            altNames: buildAltNames(title, kitsuTitles),
            type: isW ? 'webtoon' : 'manga',
            poster: a.posterImage?.large || a.posterImage?.medium || a.posterImage?.small || '',
            rating: a.averageRating ? +(parseFloat(a.averageRating) / 10).toFixed(1) : null,
            year: a.startDate ? new Date(a.startDate).getFullYear() : null,
            chapters: a.chapterCount || null,
            synopsis: (a.synopsis || '').substring(0, 500),
            genres: [], kitsuId: i.id, source: 'kitsu'
        };
    },

    async topAnime(pages = 10, startPage = 0) {
        const ck = 'kt_a_' + pages + '_s' + startPage; const c = APICache.get(ck); if (c) return c;
        const out = [];
        const endPage = startPage + pages;
        for (let p = startPage; p < endPage; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/anime?sort=-averageRating&page[limit]=20&page[offset]=${p * 20}&filter[subtype]=TV,ONA&fields[anime]=canonicalTitle,titles,posterImage,averageRating,startDate,episodeCount,synopsis`);
                if (d.data) out.push(...d.data.map(i => this._na(i)));
                await new Promise(r => setTimeout(r, 400));
            } catch(e) { break; }
        }
        APICache.set(ck, out, true); // memOnly
        return out;
    },

    async topManga(pages = 8, startPage = 0) {
        const ck = 'kt_m_' + pages + '_s' + startPage; const c = APICache.get(ck); if (c) return c;
        const out = [];
        const endPage = startPage + pages;
        for (let p = startPage; p < endPage; p++) {
            try {
                const d = await this.fetch(`${this.BASE}/manga?sort=-averageRating&page[limit]=20&page[offset]=${p * 20}&fields[manga]=canonicalTitle,titles,posterImage,averageRating,startDate,chapterCount,synopsis,subtype`);
                if (d.data) out.push(...d.data.map(i => this._nm(i)));
                await new Promise(r => setTimeout(r, 400));
            } catch(e) { break; }
        }
        APICache.set(ck, out, true); // memOnly
        return out;
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
        const sixHourBucket = Math.floor(Date.now() / (6 * 3600 * 1000));
        const ck = 'season_v8_' + sixHourBucket;
        const c = APICache.get(ck);
        if (c) return c;
        let results = [];
        try { results = await _AniList.seasonal(); } catch {}
        if (results.length < 10) { try { results = [...results, ...await _Jikan.seasonNow()]; } catch {} }
        const out = deduplicateContent(results)
            .map(i => ({ ...i, isFreshRelease: true }))
            .slice(0, limit);
        APICache.set(ck, out, true);
        return out;
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
        return deduplicateContent(all)
            .sort((a, b) => {
                const ms = searchMatchScore(b, query) - searchMatchScore(a, query);
                if (ms !== 0) return ms;
                return (b.rating || 0) - (a.rating || 0);
            })
            .slice(0, limit * 2);
    },

    async loadAllContent(onProgress) {
        const ck = 'all_v8';
        const c = APICache.get(ck);
        if (c) {
            let merged = c;
            try {
                const fresh = await this.fetchSeasonNow(120);
                merged = deduplicateContent([...(fresh || []), ...c]);
            } catch {}
            if (onProgress) onProgress(merged.length, merged.length);
            return merged;
        }

        // ── ASAMA 1: HiZLi ON YUKLEMI (3-5 saniye) ─────────────────────────
        const ckFast = 'all_v8_fast';
        const cached_fast = APICache.get(ckFast);

        if (!cached_fast) {
            if (onProgress) onProgress(0, 500);
            console.log('⚡ APi: Hizli on yukleme basliyor...');
            const [fastA, fastM, fastW] = await Promise.allSettled([
                _AniList.topAnime(2),
                _AniList.topManga(2),
                _AniList.topWebtoon(2),
            ]);
            const fastAll = [
                ...(fastA.status === 'fulfilled' ? fastA.value : []),
                ...(fastM.status === 'fulfilled' ? fastM.value : []),
                ...(fastW.status === 'fulfilled' ? fastW.value : []),
            ];
            const fastDeduped = deduplicateContent(fastAll);
            APICache.set(ckFast, slimContentForCache(fastDeduped), true); // memOnly
            if (onProgress) onProgress(fastDeduped.length, fastDeduped.length);
            console.log(`⚡ Hizli yukleme: ${fastDeduped.length} icerik`);
            document.dispatchEvent(new CustomEvent('onilist:fastContentReady', { detail: fastDeduped }));
        } else {
            if (onProgress) onProgress(cached_fast.length, cached_fast.length);
            document.dispatchEvent(new CustomEvent('onilist:fastContentReady', { detail: cached_fast }));
        }

        // ── ASAMA 2: TAM YUKLEMI — 3 Batch paralel ─────────────────────────
        console.log('🚀 APi v7.2: Tam yukleme basliyor...');

        // Batch 1: AniList popularity (ana kaynak, en guvenilir)
        const [alA, alM, alW, alMH] = await Promise.allSettled([
            _AniList.topAnime(12),
            _AniList.topManga(10),
            _AniList.topWebtoon(14),
            _AniList.topManhua(8),
        ]);

        // Batch 2: AniList score + trending (popularity'de olmayan icerikler)
        const [alAS, alMS, alWS, alMHS, alAT, alMT] = await Promise.allSettled([
            _AniList.topAnimeByScore(7),
            _AniList.topMangaByScore(6),
            _AniList.topWebtoonByScore(8),
            _AniList.topManhuaByScore(4),
            _AniList.topAnimeTrending(4),
            _AniList.topMangaTrending(4),
        ]);

        // Batch 3: Jikan + Kitsu (MAL tabanli farkli icerikler)
        const [jkA, jkM, jkW, jkMH, ktA, ktM] = await Promise.allSettled([
            _Jikan.topAnime(12),
            _Jikan.topManga(10),
            _Jikan.topWebtoon(8),
            _Jikan.topManhua(6),
            _Kitsu.topAnime(8),
            _Kitsu.topManga(6),
        ]);

        const all = [
            ...(await this.fetchSeasonNow(120)),
            ...(alA.status   === 'fulfilled' ? alA.value   : []),
            ...(alM.status   === 'fulfilled' ? alM.value   : []),
            ...(alW.status   === 'fulfilled' ? alW.value   : []),
            ...(alMH.status  === 'fulfilled' ? alMH.value  : []),
            ...(alAS.status  === 'fulfilled' ? alAS.value  : []),
            ...(alMS.status  === 'fulfilled' ? alMS.value  : []),
            ...(alWS.status  === 'fulfilled' ? alWS.value  : []),
            ...(alMHS.status === 'fulfilled' ? alMHS.value : []),
            ...(alAT.status  === 'fulfilled' ? alAT.value  : []),
            ...(alMT.status  === 'fulfilled' ? alMT.value  : []),
            ...(jkA.status   === 'fulfilled' ? jkA.value   : []),
            ...(jkM.status   === 'fulfilled' ? jkM.value   : []),
            ...(jkW.status   === 'fulfilled' ? jkW.value   : []),
            ...(jkMH.status  === 'fulfilled' ? jkMH.value  : []),
            ...(ktA.status   === 'fulfilled' ? ktA.value   : []),
            ...(ktM.status   === 'fulfilled' ? ktM.value   : []),
        ];

        let deduped = deduplicateContent(all);

        // Ilk sonucta icerik az kalirsa daha derin sayfalari da yukle.
        if (deduped.length < 1500) {
            console.log('📈 APi: Derin sayfa genisletmesi basliyor...');
            const [
                alA2, alM2, alW2, alMH2,
                alAS2, alMS2,
                jkA2, jkM2,
                ktA2, ktM2
            ] = await Promise.allSettled([
                _AniList.topAnime(12, 13),
                _AniList.topManga(10, 11),
                _AniList.topWebtoon(10, 15),
                _AniList.topManhua(8, 9),
                _AniList.topAnimeByScore(8, 8),
                _AniList.topMangaByScore(8, 7),
                _Jikan.topAnime(12, 12),
                _Jikan.topManga(10, 10),
                _Kitsu.topAnime(10, 7),
                _Kitsu.topManga(8, 6),
            ]);

            const extra = [
                ...(alA2.status === 'fulfilled' ? alA2.value : []),
                ...(alM2.status === 'fulfilled' ? alM2.value : []),
                ...(alW2.status === 'fulfilled' ? alW2.value : []),
                ...(alMH2.status === 'fulfilled' ? alMH2.value : []),
                ...(alAS2.status === 'fulfilled' ? alAS2.value : []),
                ...(alMS2.status === 'fulfilled' ? alMS2.value : []),
                ...(jkA2.status === 'fulfilled' ? jkA2.value : []),
                ...(jkM2.status === 'fulfilled' ? jkM2.value : []),
                ...(ktA2.status === 'fulfilled' ? ktA2.value : []),
                ...(ktM2.status === 'fulfilled' ? ktM2.value : []),
            ];
            deduped = deduplicateContent([...all, ...extra]);
        }

        const ac = deduped.filter(i => i.type === 'anime').length;
        const mc = deduped.filter(i => i.type === 'manga').length;
        const wc = deduped.filter(i => i.type === 'webtoon').length;
        console.log(`✅ ${deduped.length} icerik — Anime:${ac} Manga:${mc} Webtoon:${wc}`);

        // Sadece final sonucu localStorage'a yaz (~2-3MB max)
        APICache.set(ck, slimContentForCache(deduped)); // localStorage'a hafif payload yaz
        if (onProgress) onProgress(deduped.length, deduped.length);
        return deduped;
    }
};

console.log('✅ APi v7.1 — adaptive deep paging, tek cache key');