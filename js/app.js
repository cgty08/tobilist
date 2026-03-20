// APP.JS v5.2 - OniList Ana Uygulama - Genişletilmiş İçerik

// =====================================================
// PLATFORM SETTINGS — Maintenance mode + restrictions
// =====================================================
window.platformSettings = {};

async function loadPlatformSettings() {
    if (!window.supabaseClient) return;
    try {
        const { data, error } = await window.supabaseClient
            .from('platform_settings')
            .select('key,value');
        if (error) { console.warn('platform_settings fetch error:', error.message); return; }
        window.platformSettings = {};
        (data || []).forEach(row => { window.platformSettings[row.key] = row.value; });
    } catch(e) { console.warn('loadPlatformSettings error:', e); }
}

function isFeatureEnabled(key) {
    const restrictions = window.platformSettings['restrictions'];
    if (!restrictions || restrictions[key] === undefined) return true;
    return restrictions[key] !== false;
}

// CSS class injection önlemi: type değeri her zaman bu listeden gelmeli
const VALID_TYPES = ['anime', 'manga', 'webtoon'];
function safeType(t) { return VALID_TYPES.includes(t) ? t : 'anime'; }

let currentSection = 'home';
let previousSection = 'home';
let discoverScrollPosition = 0;
let deferredPrompt;
let currentDiscoverType = 'all';
let currentGenreFilter = 'all';
let discoverPage = 1;
const DISCOVER_PAGE_SIZE = 60;

let allContent = [];
let trendingContent = [];
let seasonContent = [];
let contentLoaded = false;
let contentLoading = false;

// ===== INIT =====
function initializeApp() {
    console.log('OniList v5.2 başlatılıyor...');

    if (dataManager.data) {
        updateStreak();
        xpSystem.updateUI();
        updateStats();
        if (!isGuest) { filterItems(); checkAchievements(); }

        const theme = dataManager.data.settings?.theme || 'dark';
        document.body.setAttribute('data-theme', theme);
        document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
        const themeEl = document.querySelector('.theme-' + theme);
        if (themeEl) themeEl.classList.add('active');

        const lang = dataManager.data.settings?.language || 'en';
        const langSel = document.getElementById('languageSelect');
        if (langSel) langSel.value = lang;
        changeLanguage();
    }

    // Duyuru popup'ı devre dışı
    const hour = new Date().getHours();
    const greet = hour < 6 ? 'Good night 🌙' : hour < 12 ? 'Good morning ☀️' : hour < 18 ? 'Good afternoon 🌤️' : 'Good evening 🌙';
    const gEl = document.getElementById('bannerGreeting');
    if (gEl) {
        const name = currentUser ? (dataManager.data?.social?.name || currentUser.displayName || '') : '';
        gEl.textContent = greet + (name ? ', ' + name + '!' : '!');
    }

    loadContentFromAPI();
    if (!isGuest) renderProfilePage();
    setupPWA();
    setupNetworkListeners();

    // Platform settings yükle (restrictions)
    loadPlatformSettings();

    // Duyuruları kontrol et
    setTimeout(function() {
        if (typeof window._checkAnnouncements === 'function') window._checkAnnouncements();
    }, 1500);
}

// ===== API İÇERİK YÜKLEME =====
async function loadContentFromAPI() {
    if (contentLoaded || contentLoading) {
        renderHomePage();
        renderDiscoverGrid();
        return;
    }
    contentLoading = true;
    showLoadingPlaceholders();

    try {
        // Hızlı ön yükleme: AniList'ten ilk içerikler gelince hemen göster
        // window global kirliliği önlemek için custom event kullanılıyor
        function _fastContentHandler(e) {
            const fastContent = e.detail || [];
            if (!contentLoaded && fastContent.length > 0) {
                allContent = fastContent;
                trendingContent = fastContent.filter(i => i.type === 'anime').slice(0, 20);
                console.log('⚡ Hızlı içerik gösteriliyor:', fastContent.length);
                renderHomePage();
                renderDiscoverGrid();
            }
            document.removeEventListener('onilist:fastContentReady', _fastContentHandler);
        }
        document.addEventListener('onilist:fastContentReady', _fastContentHandler);

        const [seasonal, all] = await Promise.all([
            JikanAPI.fetchSeasonNow(20),
            JikanAPI.loadAllContent()
        ]);

        seasonContent = seasonal || [];
        allContent = all || [];
        trendingContent = allContent.filter(i => i.type === 'anime').slice(0, 20);
        contentLoaded = true;
        contentLoading = false;

        console.log('✅ Tam yükleme:', allContent.length, 'içerik');
        renderHomePage();
        renderDiscoverGrid();
    } catch(e) {
        console.error('API yüklenemedi:', e);
        contentLoading = false;
        contentLoaded = false; // Tekrar denemeye izin ver (geçici ağ hatası olabilir)
        renderHomePage();
        renderDiscoverGrid();
        showNotification('İçerik yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.', 'error');

        // Discover grid'e yeniden deneme butonu göster
        const dg = document.getElementById('discoverGrid');
        if (dg) {
            dg.innerHTML = '';
            const retryWrap = document.createElement('div');
            retryWrap.style.cssText = 'text-align:center;padding:3rem 1rem;color:var(--text-muted);';
            const retryIcon = document.createElement('div');
            retryIcon.style.cssText = 'font-size:2.5rem;margin-bottom:0.7rem;';
            retryIcon.textContent = '📡';
            const retryMsg = document.createElement('p');
            retryMsg.style.cssText = 'margin-bottom:1rem;font-size:0.9rem;';
            retryMsg.textContent = 'İçerik yüklenemedi. İnternet bağlantınızı kontrol edin.';
            const retryBtn = document.createElement('button');
            retryBtn.className = 'btn btn-primary';
            retryBtn.textContent = '🔄 Tekrar Dene';
            retryBtn.onclick = () => loadContentFromAPI();
            retryWrap.appendChild(retryIcon);
            retryWrap.appendChild(retryMsg);
            retryWrap.appendChild(retryBtn);
            dg.appendChild(retryWrap);
        }
    }
}

function showLoadingPlaceholders() {
    const skeleton = '<div class="media-card skeleton-card"><div class="skeleton-poster"></div><div class="media-info"><div class="skeleton-line" style="width:80%;height:14px;margin-bottom:6px;"></div><div class="skeleton-line" style="width:50%;height:10px;"></div></div></div>'.repeat(8);
    ['trendingGrid', 'seasonPopularGrid', 'homeRecommendationsGrid'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = skeleton;
    });
    const dg = document.getElementById('discoverGrid');
    if (dg) dg.innerHTML = '<div class="discover-loading"><div class="loader"></div><p style="margin-top:1rem;color:var(--text-muted);">'+(_lang==='en'?'Loading content...':'Loading content...')+'</p></div>';
}

// ===== SLUG YARDIMCISI =====
function toSlug(str) {
    if (!str) return 'icerik';
    return str
        .toLowerCase()
        .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
        .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
        .replace(/[^a-z0-9\s-]/g,'')
        .trim().replace(/\s+/g,'-').replace(/-+/g,'-')
        .substring(0,60);
}

// ===== BÖLÜM GEÇİŞİ =====
// Section render işini tek yerde tutan yardımcı fonksiyon
function _renderSection(section, scrollY = 0) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const sEl = document.getElementById(section + 'Section');
    if (sEl) sEl.classList.add('active');
    const tabEl = document.querySelector('.nav-tab[data-section="' + section + '"]');
    if (tabEl) tabEl.classList.add('active');

    if (section === 'discover') {
        renderDiscoverGrid();
        if (scrollY) setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'instant' }), 80);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    switch(section) {
        case 'home':         renderHomePage(); break;
        case 'profile':      if (!isGuest) renderProfilePage(); break;
        case 'calendar':     if (!isGuest) renderCalendar(); break;
        case 'analytics':    if (!isGuest) renderAnalytics(); break;
        case 'achievements': if (!isGuest) renderAchievements(); break;
        case 'ai':           if (!isGuest) renderAISection(); break;
        case 'library':      if (!isGuest) filterItems(); break;
        case 'detail':       break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchSection(section, pushHistory = true) {
    previousSection = currentSection;
    currentSection = section;
    _renderSection(section);

    if (pushHistory && section !== 'detail') {
        history.pushState({ section }, '', '#' + section);
    }
    closeUserDropdown();
}

// Tarayici geri/ileri butonlari
window.addEventListener('popstate', function(e) {
    const state = e.state || {};
    const section = state.section || 'home';

    if (currentSection === 'detail') {
        const fromSection = state.section || previousSection || 'discover';
        const savedScrollY = state.discoverScrollY || discoverScrollPosition || 0;
        currentSection = fromSection;
        _renderSection(fromSection, savedScrollY);
        return;
    }

    switchSection(section, false);
});

// ===== ANA SAYFA =====
function renderHomePage() {
    const trending = trendingContent.length > 0 ? trendingContent.slice(0, 20) : [];
    const seasonal = seasonContent.length > 0 ? seasonContent.slice(0, 10) : [];
    const recs     = allContent.filter(i => i.rating && i.rating >= 8.0).slice(0, 20);

    renderMediaRow('trendingGrid', trending);
    renderMediaRow('seasonPopularGrid', seasonal.length > 0 ? seasonal : trending.slice(5, 15));
    renderMediaRow('homeRecommendationsGrid', recs.length > 0 ? recs : allContent.slice(20, 30));

    if (!isGuest) {
        renderContinueWatching();
        updateStats();
        xpSystem.updateUI();
        updateStreak();
    }
}

function renderContinueWatching() {
    const container = document.getElementById('continueWatchingGrid');
    if (!container || !dataManager.data) return;
    const watching = dataManager.data.items.filter(i => i.status === 'watching').slice(0, 8);

    if (watching.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted);font-size:0.9rem;padding:1rem;">'+(_lang==='en'?'No content with "Watching" status. <span style="color:var(--accent-secondary);cursor:pointer;" onclick="openAddModal()">Add content →</span>':'No content with \"Watching\" status. <span style=\"color:var(--accent-secondary);cursor:pointer;\" onclick=\"openAddModal()\">Add content →</span>')+'</div>';
        return;
    }

    container.innerHTML = watching.map(item => {
        const pct = (item.totalEpisodes || 0) > 0 ? ((item.currentEpisode || 0) / item.totalEpisodes * 100).toFixed(0) : 0;
        const itemJson = JSON.stringify({
            id: item.id, name: item.name, type: item.type,
            poster: item.poster, episodes: item.totalEpisodes,
            rating: item.rating, genres: item.genres || [], malId: item.malId
        });
        const safeItem = itemJson.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        return '<div class="media-card" style="cursor:pointer" onclick="openDetailPage(\'' + safeItem + '\')">' +
            '<div class="media-poster">' +
                (item.poster
                    ? '<img src="' + _esc(item.poster) + '" alt="' + _esc(item.name || '') + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                      '<div class="media-poster-fallback" style="display:none">' + getTypeIcon(item.type) + '</div>'
                    : '<div class="media-poster-fallback">' + getTypeIcon(item.type) + '</div>') +
                '<span class="media-type-badge ' + safeType(item.type) + '">' + safeType(item.type) + '</span>' +
                '<div class="media-score-badge">▶ ' + (item.currentEpisode || 0) + '/' + (item.totalEpisodes || '?') + '</div>' +
            '</div>' +
            '<div class="media-info">' +
                '<div class="media-title">' + _esc(item.name || 'Unknown') + '</div>' +
                '<div style="background:var(--bg-secondary);height:3px;border-radius:3px;margin:0.4rem 0;overflow:hidden;">' +
                    '<div style="width:' + pct + '%;height:100%;background:var(--accent-primary);"></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderMediaRow(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted);font-size:0.9rem;padding:1rem;text-align:center;grid-column:1/-1;">Loading...</div>';
        return;
    }

    container.innerHTML = items.map(item => {
        const inLibrary = !isGuest && dataManager.data?.items.some(i => (i.name || '').toLowerCase() === (item.name || '').toLowerCase());
        const rating = item.rating ? '⭐ ' + item.rating : '';
        const meta = [item.year, item.episodes ? item.episodes + ' Ep' : item.chapters ? item.chapters + ' Ch' : ''].filter(Boolean).join(' · ');

        const itemJson = JSON.stringify({
            id: item.id,
            name: item.name,
            type: item.type,
            poster: item.poster,
            episodes: item.episodes,
            chapters: item.chapters,
            rating: item.rating,
            genres: item.genres,
            malId: item.malId
        });
        const safeItem = itemJson.replace(/'/g, "\\'").replace(/"/g, '&quot;');

        const addBtn = isGuest
            ? '<button class="add-to-list-btn" onclick="openAuthModal(\'register\')">🔐 Sign up & add</button>'
            : '<button class="add-to-list-btn' + (inLibrary ? ' in-library' : '') + '" onclick="event.stopPropagation();quickAddFromJson(\'' + safeItem + '\')">' + (inLibrary ? (_lang==='en'?'✓ In List':'✓ Listende') : (_lang==='en'?'+ Add':'+ Ekle')) + '</button>';

        return '<div class="media-card" style="cursor:pointer" onclick="openDetailPage(\'' + safeItem + '\')">' +
            '<div class="media-poster">' +
                (item.poster
                    ? '<img src="' + _esc(item.poster) + '" alt="' + _esc(item.name || '') + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                      '<div class="media-poster-fallback" style="display:none">' + getTypeIcon(item.type) + '</div>'
                    : '<div class="media-poster-fallback">' + getTypeIcon(item.type) + '</div>') +
                '<span class="media-type-badge ' + safeType(item.type) + '">' + safeType(item.type) + '</span>' +
                (rating ? '<div class="media-score-badge">' + rating + '</div>' : '') +
            '</div>' +
            '<div class="media-info">' +
                '<div class="media-title">' + _esc(item.name || 'Unknown') + '</div>' +
                '<div class="media-meta">' + meta + '</div>' +
                addBtn +
            '</div>' +
        '</div>';
    }).join('');
}

// ===== KEŞFET =====
function filterDiscoverType(type, btn) {
    currentDiscoverType = type;
    discoverPage = 1;
    document.querySelectorAll('.discover-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderDiscoverGrid();
}

function filterByGenre(genre, btn) {
    currentGenreFilter = genre;
    discoverPage = 1;
    document.querySelectorAll('.genre-tag').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderDiscoverGrid();
}

function renderDiscoverGrid() {
    const grid = document.getElementById('discoverGrid');
    if (!grid) return;

    if (!contentLoaded) {
        grid.innerHTML = '<div class="discover-loading"><div class="loader"></div><p style="margin-top:1rem;color:var(--text-muted);">Loading content...</p></div>';
        return;
    }

    const searchEl = document.getElementById('discoverSearch');
    const sortEl   = document.getElementById('discoverSort');
    const search   = (searchEl ? searchEl.value : '').toLowerCase().trim();
    const sort     = sortEl ? sortEl.value : 'rating';

    let filtered = allContent.filter(item => {
        if (currentDiscoverType !== 'all' && item.type !== currentDiscoverType) return false;
        if (currentGenreFilter !== 'all' && !(item.genres || []).includes(currentGenreFilter)) return false;
        if (search && !(item.name || '').toLowerCase().includes(search) && !(item.nameEn || '').toLowerCase().includes(search)) return false;
        return true;
    });

    if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'name') filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'tr'));
    else if (sort === 'year') filtered.sort((a, b) => (b.year || 0) - (a.year || 0));

    const total = filtered.length;
    const page  = filtered.slice(0, discoverPage * DISCOVER_PAGE_SIZE);

    const statsEl = document.getElementById('discoverStats');
    if (statsEl) statsEl.textContent = total + (_lang==='en' ? ' results found' : ' results found');

    if (page.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;font-size:1.1rem;">🔍 No results found</div>';
        return;
    }

    grid.innerHTML = page.map(item => {
        const inLibrary = !isGuest && dataManager.data?.items.some(i => (i.name || '').toLowerCase() === (item.name || '').toLowerCase());
        const rating = item.rating ? '⭐ ' + item.rating : '';
        const meta = [item.year, item.type === 'anime' ? (item.episodes ? item.episodes + ' Ep' : '') : (item.chapters ? item.chapters + ' Ch' : '')].filter(Boolean).join(' · ');

        const itemJson = JSON.stringify({
            id: item.id, name: item.name, type: item.type,
            poster: item.poster, episodes: item.episodes,
            chapters: item.chapters, rating: item.rating,
            genres: item.genres, malId: item.malId
        });
        const safeItem = itemJson.replace(/'/g, "\\'").replace(/"/g, '&quot;');

        const addBtn = isGuest
            ? '<button class="add-to-list-btn" onclick="openAuthModal(\'register\')">🔐 Sign up & add</button>'
            : '<button class="add-to-list-btn' + (inLibrary ? ' in-library' : '') + '" onclick="event.stopPropagation();quickAddFromJson(\'' + safeItem + '\')">' + (inLibrary ? (_lang==='en'?'✓ In List':'✓ Listende') : (_lang==='en'?'+ Add':'+ Ekle')) + '</button>';

        return '<div class="media-card" style="cursor:pointer" onclick="openDetailPage(\'' + safeItem + '\')">' +
            '<div class="media-poster">' +
                (item.poster
                    ? '<img src="' + _esc(item.poster) + '" alt="' + _esc(item.name || '') + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                      '<div class="media-poster-fallback" style="display:none">' + getTypeIcon(item.type) + '</div>'
                    : '<div class="media-poster-fallback">' + getTypeIcon(item.type) + '</div>') +
                '<span class="media-type-badge ' + safeType(item.type) + '">' + safeType(item.type) + '</span>' +
                (rating ? '<div class="media-score-badge">' + rating + '</div>' : '') +
            '</div>' +
            '<div class="media-info">' +
                '<div class="media-title">' + _esc(item.name || 'Unknown') + '</div>' +
                '<div class="media-meta">' + meta + '</div>' +
                addBtn +
            '</div>' +
        '</div>';
    }).join('') + (page.length < total
        ? '<div style="grid-column:1/-1;text-align:center;padding:2rem;"><button class="btn btn-secondary" onclick="loadMoreDiscover()">Load More (' + (total - page.length) + ' remaining)</button></div>'
        : '');
}

function loadMoreDiscover() {
    discoverPage++;
    renderDiscoverGrid();
}

let discoverSearchTimeout;
function onDiscoverSearch() {
    discoverPage = 1;
    clearTimeout(discoverSearchTimeout);
    discoverSearchTimeout = setTimeout(renderDiscoverGrid, 300);
}

// ===== HIZLI EKLE =====
function quickAddFromJson(jsonStr) {
    try {
        const decoded = jsonStr.replace(/&quot;/g, '"');
        const item = JSON.parse(decoded);
        quickAdd(item);
    } catch(e) {
        console.error('quickAddFromJson parse error:', e);
        showNotification(_lang==='en'?'Error while adding.':'Error while adding.', 'error');
    }
}

function quickAdd(item) {
    if (isGuest) { openAuthModal('register'); return; }
    if (!item || !dataManager.data) return;

    if (dataManager.data.items.some(i => (i.name || '').toLowerCase() === (item.name || '').toLowerCase())) {
        showNotification((item.name || '') + ' zaten listenizde!', 'info');
        return;
    }

    const newItem = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: item.name || '',
        type: item.type || 'anime',
        status: 'plantowatch',
        poster: item.poster || '',
        rating: 0,
        currentEpisode: 0,
        totalEpisodes: item.episodes || item.chapters || 0,
        genre: (item.genres || [])[0] || '',
        notes: '',
        addedDate: new Date().toISOString(),
        malId: item.malId || null
    };

    dataManager.data.items.unshift(newItem);
    dataManager.saveAll();
    checkAchievements();
    updateStats();
    showNotification('✅ ' + _esc(newItem.name) + (_lang==='en'?' added to "Plan to Watch"!':' added to "Plan to Watch"!'), 'success');
    renderDiscoverGrid();
    renderHomePage();
}

// ===== EKLE MODAL =====
function openAddModal() {
    if (isGuest) { openAuthModal('register'); return; }
    const modal = document.getElementById('addModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const form = document.getElementById('addForm');
    if (form) form.reset();
    const apiResults = document.getElementById('apiResults');
    if (apiResults) apiResults.innerHTML = '';
}

function closeModal() {
    const modal = document.getElementById('addModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

function addItem(event) {
    event.preventDefault();
    if (!dataManager.data) return;

    const nameEl   = document.getElementById('itemName');
    const typeEl   = document.getElementById('itemType');
    const posterEl = document.getElementById('itemPoster');
    const statusEl = document.getElementById('itemStatus');
    const genreEl  = document.getElementById('itemGenre');
    const notesEl  = document.getElementById('itemNotes');

    const name = nameEl ? nameEl.value.trim() : '';
    if (!name) { showNotification('Please enter a name!', 'error'); return; }

    const newItem = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name,
        type: typeEl ? typeEl.value : 'anime',
        poster: posterEl ? posterEl.value.trim() : '',
        status: statusEl ? statusEl.value : 'plantowatch',
        genre: genreEl ? genreEl.value : '',
        notes: notesEl ? notesEl.value.trim() : '',
        rating: 0,
        currentEpisode: 0,
        totalEpisodes: 0,
        addedDate: new Date().toISOString()
    };

    dataManager.data.items.unshift(newItem);
    dataManager.saveAll();
    checkAchievements();
    updateStats();
    filterItems();
    closeModal();
    showNotification('✅ ' + _esc(newItem.name) + (_lang==='en'?' added!':' eklendi!'), 'success');
}

// ===== JIKAN ARAMA (modal içi) =====
let searchTimeout;
async function searchAPI() {
    const queryEl = document.getElementById('apiSearch');
    const resultsDiv = document.getElementById('apiResults');
    if (!queryEl || !resultsDiv) return;

    const query = queryEl.value.trim();
    clearTimeout(searchTimeout);
    if (query.length < 2) { resultsDiv.innerHTML = ''; return; }

    searchTimeout = setTimeout(async () => {
        resultsDiv.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:0.8rem;font-size:0.85rem;">🔍 Aranıyor...</div>';
        try {
            const results = await JikanAPI.searchAll(query, 5);
            if (results.length > 0) {
                resultsDiv.innerHTML = results.map(item => {
                    const safeData = JSON.stringify({
                        title: item.name,
                        episodes: item.episodes || item.chapters,
                        poster: item.poster,
                        type: item.type
                    }).replace(/"/g, '&quot;');

                    return '<div class="api-result-item" onclick="fillFromAPI(\'' + safeData.replace(/'/g, "\\'") + '\')">' +
                        (item.poster
                            ? '<img src="' + _esc(item.poster) + '" alt="' + _esc(item.name || '') + '">'
                            : '<div style="width:40px;height:55px;background:var(--bg-card);border-radius:4px;display:flex;align-items:center;justify-content:center;">' + getTypeIcon(item.type) + '</div>') +
                        '<div>' +
                            '<div class="api-result-title">' + _esc(item.name || '') + '</div>' +
                            '<div class="api-result-meta">' + item.type + ' · ' + (item.episodes ? item.episodes + ' ep' : item.chapters ? item.chapters + ' ch' : '?') + (item.rating ? ' · ⭐' + item.rating : '') + '</div>' +
                        '</div>' +
                    '</div>';
                }).join('');
            } else {
                resultsDiv.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:0.8rem;font-size:0.85rem;">No results found</div>';
            }
        } catch {
            resultsDiv.innerHTML = '<div style="color:var(--danger);text-align:center;padding:0.8rem;font-size:0.85rem;">API connection error</div>';
        }
    }, 500);
}

function fillFromAPI(jsonStr) {
    try {
        const decoded = jsonStr.replace(/&quot;/g, '"');
        const data = JSON.parse(decoded);

        const nameEl   = document.getElementById('itemName');
        const posterEl = document.getElementById('itemPoster');
        const typeEl   = document.getElementById('itemType');
        const apiSearch = document.getElementById('apiSearch');
        const apiResults = document.getElementById('apiResults');

        if (nameEl)   nameEl.value   = data.title || '';
        if (posterEl) posterEl.value = data.poster || '';
        if (typeEl)   typeEl.value   = data.type || 'anime';
        if (apiSearch)   apiSearch.value = '';
        if (apiResults)  apiResults.innerHTML = '';

        showNotification("API'den bilgiler dolduruldu! ✓", 'success');
    } catch(e) {
        console.error('fillFromAPI error:', e);
    }
}

// ===== BİLDİRİMLER =====
function openNotifications() { showNotification('Bildirim merkezi yakında! 🔔', 'info'); }

function toggleNotifications() {
    const el = document.getElementById('pushNotifications');
    if (!el) return;
    if (el.checked && 'Notification' in window) {
        Notification.requestPermission().then(p => {
            if (p === 'granted') showNotification('Notifications enabled! 🔔', 'success');
            else el.checked = false;
        });
    }
}

// ===== PWA =====
function setupPWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(reg => {
                console.log('✅ Service Worker kayıtlı:', reg.scope);
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[SW] Yeni sürüm mevcut, sayfa yenilendiğinde aktif olacak.');
                        }
                    });
                });
            })
            .catch(err => console.warn('Service Worker kaydedilemedi:', err));
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const banner = document.getElementById('installBanner');
        if (banner) banner.classList.add('show');
    });
}

function installPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        const banner = document.getElementById('installBanner');
        if (banner) banner.classList.remove('show');
    });
}

function dismissInstall() {
    const banner = document.getElementById('installBanner');
    if (banner) banner.classList.remove('show');
}

// ===== NETWORK =====
function setupNetworkListeners() {
    window.addEventListener('online', () => {
        const ob = document.getElementById('offlineBanner');
        if (ob) ob.classList.remove('show');
        showNotification('Connection restored! 🌐', 'success');
    });
    window.addEventListener('offline', () => {
        const ob = document.getElementById('offlineBanner');
        if (ob) ob.classList.add('show');
    });
}

// =====================================================
// LIBRARY'DEN DETAY SAYFASI
// =====================================================
function openDetailPageFromLibrary(itemId) {
    if (!dataManager.data) return;
    const item = dataManager.data.items.find(i => String(i.id) === String(itemId));
    if (!item) return;
    const itemJson = JSON.stringify({
        id: item.id, name: item.name, type: item.type,
        poster: item.poster, episodes: item.type === 'anime' ? item.totalEpisodes : null,
        chapters: item.type !== 'anime' ? item.totalEpisodes : null, rating: item.rating,
        genres: item.genres || [], malId: item.malId
    });
    openDetailPage(itemJson.replace(/"/g, '&quot;'));
}



// =====================================================
// DUYURU SİSTEMİ v2 - Güçlü & Güzel
// =====================================================
async function checkAnnouncements() {
    if (!window.supabaseClient) return;
    try {
        const { data, error } = await window.supabaseClient
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error || !data || data.length === 0) return;

        let dismissed = [];
        try { dismissed = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]'); } catch(e) {}
        const dismissedStr = dismissed.map(d => String(d));

        const visible = data.filter(a => !dismissedStr.includes(String(a.id)));
        if (visible.length === 0) return;

        showAnnouncementModal(visible[0]);
    } catch(e) { console.warn('Announcement check failed:', e); }
}
// auth.js'den erisim icin global
window._checkAnnouncements = checkAnnouncements;

function showAnnouncementModal(ann) {
    if (document.getElementById('annModal')) return;

    var colorMap = { info: '#00d4ff', success: '#10b981', warning: '#f59e0b', update: '#8b5cf6' };
    var accent = colorMap[ann.type] || colorMap.info;

    var banner = document.createElement('div');
    banner.id = 'annModal';
    banner.style.position       = 'fixed';
    banner.style.top            = '0';
    banner.style.left           = '0';
    banner.style.right          = '0';
    banner.style.zIndex         = '999999';
    banner.style.background     = 'linear-gradient(135deg,#0f1420f0,#0a0f1ef0)';
    banner.style.borderBottom   = '2px solid ' + accent + '88';
    banner.style.boxShadow      = '0 4px 24px rgba(0,0,0,0.5)';
    banner.style.backdropFilter = 'blur(12px)';
    banner.style.padding        = '.8rem 1.5rem';
    banner.style.display        = 'flex';
    banner.style.alignItems     = 'center';
    banner.style.gap            = '1rem';
    banner.style.transform      = 'translateY(-100%)';
    banner.style.transition     = 'transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275)';
    banner.style.fontFamily     = 'DM Sans,system-ui,sans-serif';

    // Sol renkli bar
    var bar = document.createElement('div');
    bar.style.cssText = 'width:4px;height:38px;border-radius:4px;flex-shrink:0;background:' + accent + ';';

    // Metin alani
    var textEl = document.createElement('div');
    textEl.style.cssText = 'flex:1;min-width:0;';

    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'color:#fff;font-size:.9rem;font-weight:700;line-height:1.3;';
    titleEl.textContent = ann.title || '';
    textEl.appendChild(titleEl);

    if (ann.content) {
        var msgEl = document.createElement('div');
        msgEl.style.cssText = 'color:#94a3b8;font-size:.8rem;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:700px;';
        msgEl.textContent = ann.content;
        textEl.appendChild(msgEl);
    }

    // Kapat butonu
    var annId = String(ann.id);
    var closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'flex-shrink:0;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#8892a4;cursor:pointer;padding:6px 16px;font-size:.82rem;font-weight:600;transition:all .2s;white-space:nowrap;';
    closeBtn.textContent = 'Kapat';
    closeBtn.addEventListener('mouseenter', function() { this.style.background = 'rgba(239,68,68,0.15)'; this.style.color = '#ef4444'; });
    closeBtn.addEventListener('mouseleave', function() { this.style.background = 'rgba(255,255,255,0.07)'; this.style.color = '#8892a4'; });
    closeBtn.addEventListener('click', function() { dismissAnnouncement(annId); });

    banner.appendChild(bar);
    banner.appendChild(textEl);
    banner.appendChild(closeBtn);
    document.body.appendChild(banner);

    // Yukaridan kayarak ac
    requestAnimationFrame(function() {
        requestAnimationFrame(function() { banner.style.transform = 'translateY(0)'; });
    });
}

function dismissAnnouncement(id) {
    let dismissed = [];
    try { dismissed = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]'); } catch(e) {}
    const idStr = String(id);
    if (!dismissed.map(d=>String(d)).includes(idStr)) {
        dismissed.push(idStr);
        localStorage.setItem('dismissed_announcements', JSON.stringify(dismissed));
    }
    const el = document.getElementById('annModal');
    if (el) {
        el.style.transition = 'transform 0.3s ease';
        el.style.transform  = 'translateY(-100%)';
        setTimeout(function() { el.remove(); }, 320);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }

    const editProfileModal = document.getElementById('editProfileModal');
    if (editProfileModal) {
        editProfileModal.addEventListener('click', function(e) {
            if (e.target === this) closeEditProfile();
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n' && !isGuest) {
        e.preventDefault();
        openAddModal();
    }
});

console.log('✅ App.js v5.2 loaded');
// =====================================================
// DETAY SAYFASI SİSTEMİ
// =====================================================

let currentDetailItem = null;

async function openDetailPage(itemJsonStr) {
    let item;
    try {
        const decoded = (itemJsonStr || '').replace(/&quot;/g, '"');
        item = JSON.parse(decoded);
    } catch(e) { console.error('Detail parse error:', e); return; }

    currentDetailItem = item;

    if (currentSection === 'discover') {
        discoverScrollPosition = window.scrollY || document.documentElement.scrollTop;
    }
    previousSection = currentSection;
    currentSection = 'detail';

    const _typeSlug = (item.type || 'icerik').toLowerCase();
    const _nameSlug = toSlug(item.name || item.nameEn || '');
    history.pushState(
        { section: previousSection, discoverScrollY: discoverScrollPosition, itemId: item.id },
        '',
        '#' + _typeSlug + '-' + _nameSlug
    );

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const detailSec = document.getElementById('detailSection');
    if (detailSec) detailSec.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    _fillDetailBasic(item);
    _fetchFullDetail(item);
    loadReviews(item.id);
    loadUserReview(item.id);
    loadSimilarContent(item);
}

function _fillDetailBasic(item) {
    const s = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };

    const posterEl = document.getElementById('dpPoster');
    if (posterEl) { posterEl.src = item.poster || ''; posterEl.onerror = () => posterEl.style.display = 'none'; }

    s('dpTitle', item.name);
    s('dpYear', item.year);
    s('dpScore', item.rating ? '⭐ ' + item.rating : '—');
    s('dpEpisodes', item.episodes ? item.episodes + ' Episodes' : item.chapters ? item.chapters + ' Episodes' : '—');
    window._detailSynopsis = { en: null, tr: null };
    const synopsisText = item.synopsis || ((typeof getCurrentLang === 'function' && getCurrentLang() === 'en') ? 'Loading description...' : 'Loading description...');
    s('dpSynopsis', synopsisText);
    s('dpStatus', '—');
    s('dpRank', '—');
    s('dpMembers', '—');
    s('dpStudio', '—');

    const badge = document.getElementById('dpTypeBadge');
    if (badge) { badge.textContent = (item.type || 'anime').toUpperCase(); badge.className = 'dp-type-badge ' + (item.type || 'anime'); }

    // Genres — API'den gelen veriler, _esc ile korunuyor
    const genresEl = document.getElementById('dpGenres');
    if (genresEl) {
        genresEl.innerHTML = (item.genres || []).map(g => `<span class="dp-genre-tag">${_esc(g)}</span>`).join('') || '<span style="color:var(--text-muted)">Loading...</span>';
    }

    const addBtn = document.getElementById('dpAddBtn');
    if (addBtn) {
        const inLib = !isGuest && dataManager.data?.items?.some(i => i.name?.toLowerCase() === item.name?.toLowerCase());
        addBtn.textContent = inLib ? (_lang==='en'?'✓ In List':'✓ Listende') : (_lang==='en'?'+ Add to List':'+ Listeye Ekle');
        addBtn.className = 'dp-add-btn' + (inLib ? ' in-library' : '');
        addBtn.onclick = () => {
            if (isGuest) { openAuthModal('register'); return; }
            quickAdd(item);
            addBtn.textContent = _lang==='en' ? '✓ In List' : '✓ Listende';
            addBtn.className = 'dp-add-btn in-library';
        };
    }

    const titleBc = document.getElementById('dpBreadcrumbTitle');
    if (titleBc) titleBc.textContent = item.name || '';
}

window._detailSynopsis = { en: null, tr: null };

async function _fetchFullDetail(item) {
    if (item.malId) {
        try {
            const type = item.type === 'anime' ? 'anime' : 'manga';
            const res = await fetch(`https://api.jikan.moe/v4/${type}/${item.malId}`);
            if (res.ok) {
                const { data: d } = await res.json();
                if (d) {
                    const s = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
                    s('dpScore', d.score ? '⭐ ' + d.score.toFixed(1) : null);
                    s('dpEpisodes', d.episodes ? d.episodes + ' Episodes' : d.chapters ? d.chapters + ' Episodes' : null);
                    s('dpStatus', d.status || null);
                    s('dpRank', d.rank ? '#' + d.rank : null);
                    s('dpMembers', d.members ? d.members.toLocaleString(_lang==='en'?'en-US':'tr-TR') : null);
                    s('dpStudio', (d.studios?.[0]?.name) || (d.authors?.[0]?.name) || null);
                    s('dpYear', d.year || (d.aired?.from ? new Date(d.aired.from).getFullYear() : null));

                    if (d.genres || d.themes) {
                        const genres = [...(d.genres || []), ...(d.themes || [])].map(g => g.name);
                        const el = document.getElementById('dpGenres');
                        if (el) el.innerHTML = genres.map(g => `<span class="dp-genre-tag">${_esc(g)}</span>`).join('');
                    }
                    if (d.images?.jpg?.large_image_url) {
                        const bg = document.getElementById('dpBannerBg');
                        if (bg) { bg.style.backgroundImage = `url(${d.images.jpg.large_image_url})`; bg.style.backgroundSize = 'cover'; bg.style.backgroundPosition = 'center top'; }
                    }

                    if (d.synopsis) {
                        window._detailSynopsis.en = d.synopsis;
                        _applyDetailSynopsis();
                        if (item.anilistId) _fetchAniListSynopsis(item.anilistId);
                        return;
                    }
                }
            }
        } catch(e) { /* fall through to AniList */ }
    }

    const aniId = item.anilistId || (item.id && String(item.id).startsWith('al_') ? String(item.id).replace('al_','') : null);
    if (aniId) {
        await _fetchAniListSynopsis(aniId);
        return;
    }

    if (item.name) {
        try {
            const res = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query($s:String){Media(search:$s,type:ANIME){id description(asHtml:false) coverImage{large color} averageScore episodes status startDate{year} genres studios{nodes{name}}}}`,
                    variables: { s: item.name }
                })
            });
            const json = await res.json();
            const m = json?.data?.Media;
            if (m) {
                const s = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
                s('dpScore', m.averageScore ? '⭐ ' + (m.averageScore/10).toFixed(1) : null);
                s('dpEpisodes', m.episodes ? m.episodes + ' Episodes' : null);
                s('dpStatus', m.status || null);
                s('dpStudio', m.studios?.nodes?.[0]?.name || null);
                s('dpYear', m.startDate?.year || null);
                if (m.genres?.length) {
                    const el = document.getElementById('dpGenres');
                    if (el) el.innerHTML = m.genres.map(g => `<span class="dp-genre-tag">${_esc(g)}</span>`).join('');
                }
                if (m.coverImage?.large) {
                    const bg = document.getElementById('dpBannerBg');
                    if (bg) { bg.style.backgroundImage = `url(${m.coverImage.large})`; bg.style.backgroundSize = 'cover'; bg.style.backgroundPosition = 'center top'; }
                    const poster = document.getElementById('dpPoster');
                    if (poster && !poster.src) poster.src = m.coverImage.large;
                }
                if (m.description) {
                    window._detailSynopsis.en = m.description.replace(/<[^>]+>/g, '').trim();
                    _applyDetailSynopsis();
                }
            }
        } catch(e) { /* ignore */ }
    }
}

async function _fetchAniListSynopsis(anilistId) {
    try {
        const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `query($id:Int){Media(id:$id){description(asHtml:false)}}`,
                variables: { id: parseInt(anilistId) }
            })
        });
        const json = await res.json();
        const desc = json?.data?.Media?.description;
        if (desc) {
            window._detailSynopsis.en = desc.replace(/<[^>]+>/g, '').trim();
            _applyDetailSynopsis();
        }
    } catch(e) { /* ignore */ }
}

function _applyDetailSynopsis() {
    const el = document.getElementById('dpSynopsis');
    if (!el) return;
    const lang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'tr';
    const text = (lang === 'tr' && window._detailSynopsis.tr)
        ? window._detailSynopsis.tr
        : window._detailSynopsis.en;
    if (text) el.textContent = text;
}

// ===== REVIEWS =====
async function loadReviews(contentId) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    container.innerHTML = '<div class="reviews-loading"><div class="mini-spinner"></div> Loading reviews...</div>';

    if (!window.supabaseClient) { container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">Could not load reviews.</p>'; return; }

    const { data, error } = await window.supabaseClient
        .from('reviews')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
        .limit(30);

    if (error || !data?.length) {
        container.innerHTML = '<div class="no-reviews"><div style="font-size:2.5rem;">💬</div><p>No reviews yet. Be the first!</p></div>';
        return;
    }

    const avg = (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1);
    const avgEl = document.getElementById('dpUserScore');
    if (avgEl) avgEl.textContent = avg + ' / 10';
    const cntEl = document.getElementById('dpReviewCount');
    if (cntEl) cntEl.textContent = data.length + ' yorum';

    container.innerHTML = data.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${_esc((r.username || 'U')[0].toUpperCase())}</div>
                <div class="review-meta">
                    <div class="review-username">${_esc(r.username)}</div>
                    <div class="review-date">${_fmtDate(r.created_at)}</div>
                </div>
                <div class="review-score-badge">${r.rating}<span>/10</span></div>
                ${!isGuest && currentUser?.uid === r.user_id ? `<button class="review-delete-btn" onclick="deleteReview('${_esc(String(r.id))}','${_esc(String(currentDetailItem?.id||''))}')">🗑️</button>` : ''}
            </div>
            ${r.comment ? `<p class="review-comment">${_esc(r.comment)}</p>` : ''}
        </div>
    `).join('');
}

async function loadUserReview(contentId) {
    if (isGuest || !window.supabaseClient) return;
    const { data } = await window.supabaseClient
        .from('reviews')
        .select('*')
        .eq('content_id', contentId)
        .eq('user_id', currentUser.uid)
        .single();

    if (data) {
        setStarRating(data.rating);
        const commentEl = document.getElementById('reviewComment');
        if (commentEl) commentEl.value = data.comment || '';
        const submitBtn = document.getElementById('reviewSubmitBtn');
        if (submitBtn) submitBtn.textContent = '✏️ Update Review';
    } else {
        setStarRating(0);
    }
}

let selectedRating = 0;
function setStarRating(rating) {
    selectedRating = rating;
    document.querySelectorAll('.star-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i < rating);
    });
    const ratingText = document.getElementById('ratingText');
    if (ratingText) ratingText.textContent = rating > 0 ? rating + ' / 10' : 'Select rating';
}

async function submitReview() {
    if (isGuest) { openAuthModal('register'); return; }
    if (!selectedRating) { showNotification('Please select a rating!', 'error'); return; }
    if (!currentDetailItem) return;

    const comment = document.getElementById('reviewComment')?.value?.trim() || '';
    const username = dataManager.data?.social?.name || currentUser?.displayName || 'Anonim';

    const { error } = await window.supabaseClient
        .from('reviews')
        .upsert({
            content_id:   currentDetailItem.id,
            content_name: currentDetailItem.name,
            content_type: currentDetailItem.type,
            user_id:      currentUser.uid,
            username,
            rating:       selectedRating,
            comment,
            updated_at:   new Date().toISOString()
        }, { onConflict: 'content_id,user_id' });

    if (error) { showNotification('Yorum gönderilemedi: ' + error.message, 'error'); return; }
    showNotification('✅ Yorumun kaydedildi!', 'success');

    if (dataManager.data) {
        const reviewedItems = dataManager.data.reviewedItems || [];
        const contentKey = String(currentDetailItem.id);
        const isNewReview = !reviewedItems.includes(contentKey);

        if (isNewReview && comment.length >= 50) {
            const reviewXP = comment.length >= 200
                ? XP_REWARDS.writeLongReview
                : XP_REWARDS.writeReview;
            xpSystem.addXP(reviewXP, (typeof _lang !== 'undefined' && _lang === 'en')
                ? (comment.length >= 200 ? 'Detailed review! ✍️' : 'Review written!')
                : (comment.length >= 200 ? 'Detaylı yorum! ✍️' : 'Yorum yazıldı!'));
            reviewedItems.push(contentKey);
            dataManager.data.reviewedItems = reviewedItems;
        }
        dataManager.data.reviewCount = (dataManager.data.reviewCount || 0) + 1;
        dataManager.saveAll();
    }
    checkAchievements();
    loadReviews(currentDetailItem.id);
}

async function deleteReview(reviewId, contentId) {
    if (!window.supabaseClient) return;
    const { error } = await window.supabaseClient.from('reviews').delete().eq('id', reviewId);
    if (!error) { showNotification('Yorum silindi.', 'info'); loadReviews(contentId); }
}

// ===== SIMILAR CONTENT =====
function loadSimilarContent(item) {
    const container = document.getElementById('similarGrid');
    if (!container) return;

    const genres = item.genres || [];
    const type = item.type;

    let similar = allContent.filter(c =>
        c.id !== item.id &&
        c.type === type &&
        c.name !== item.name &&
        (genres.length === 0 || c.genres?.some(g => genres.includes(g)))
    ).slice(0, 8);

    if (similar.length < 4) {
        similar = allContent.filter(c => c.type === type && c.id !== item.id).slice(0, 12);
    }

    if (!similar.length) {
        container.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;">'+(_lang==='en'?'No similar content found.':'No similar content found.')+'</p>';
        return;
    }

    renderMediaRow('similarGrid', similar);
}

function goBackFromDetail() {
    const fromSection = previousSection || 'discover';
    const savedScrollY = discoverScrollPosition || 0;

    currentSection = fromSection;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const sEl = document.getElementById(fromSection + 'Section');
    if (sEl) sEl.classList.add('active');
    const tabEl = document.querySelector('.nav-tab[data-section="' + fromSection + '"]');
    if (tabEl) tabEl.classList.add('active');

    history.replaceState({ section: fromSection, discoverScrollY: savedScrollY }, '', '#' + fromSection);

    if (fromSection === 'discover') {
        renderDiscoverGrid();
        setTimeout(() => window.scrollTo({ top: savedScrollY, behavior: 'instant' }), 80);
    } else {
        switch(fromSection) {
            case 'home':         renderHomePage(); break;
            case 'profile':      if (!isGuest) renderProfilePage(); break;
            case 'calendar':     if (!isGuest) renderCalendar(); break;
            case 'analytics':    if (!isGuest) renderAnalytics(); break;
            case 'achievements': if (!isGuest) renderAchievements(); break;
            case 'ai':           if (!isGuest) renderAISection(); break;
            case 'library':      if (!isGuest) filterItems(); break;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== XSS KORUMA YARDIMCILARI =====
function _esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function _fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(_lang==='en'?'en-GB':'tr-TR', { day:'numeric', month:'short', year:'numeric' });
}

// Star hover effects
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.star-btn').forEach((btn, idx) => {
        btn.addEventListener('mouseenter', () => {
            document.querySelectorAll('.star-btn').forEach((b, i) => {
                b.style.color = i <= idx ? '#f59e0b' : '';
            });
        });
        btn.addEventListener('mouseleave', () => {
            document.querySelectorAll('.star-btn').forEach((b, i) => {
                b.style.color = i < selectedRating ? '#f59e0b' : '';
            });
        });
    });
});