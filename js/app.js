// APP.JS v5.1 - TobiList Ana Uygulama - Hatalar düzeltildi

let currentSection = 'home';
let deferredPrompt;
let currentDiscoverType = 'all';
let currentGenreFilter = 'all';
let discoverPage = 1;
const DISCOVER_PAGE_SIZE = 40;

let allContent = [];
let trendingContent = [];
let seasonContent = [];
let contentLoaded = false;
let contentLoading = false;

// ===== INIT =====
function initializeApp() {
    console.log('TobiList v5.1 başlatılıyor...');

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

        const lang = dataManager.data.settings?.language || 'tr';
        const langSel = document.getElementById('languageSelect');
        if (langSel) langSel.value = lang;
        changeLanguage();
    }

    const hour = new Date().getHours();
    const greet = hour < 6 ? 'Gece yarısı 🌙' : hour < 12 ? 'Günaydın ☀️' : hour < 18 ? 'İyi günler 🌤️' : 'İyi akşamlar 🌙';
    const gEl = document.getElementById('bannerGreeting');
    if (gEl) {
        const name = currentUser ? (dataManager.data?.social?.name || currentUser.displayName || '') : '';
        gEl.textContent = greet + (name ? ', ' + name + '!' : '!');
    }

    loadContentFromAPI();
    if (!isGuest) renderProfilePage();
    setupPWA();
    setupNetworkListeners();

    const msg = isGuest ? '🎭 Keşfetmeye başlayın!' : '✅ Hoş geldiniz' + (currentUser?.displayName ? ', ' + currentUser.displayName : '') + '!';
    showNotification(msg, 'success');
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
        const [seasonal, all] = await Promise.all([
            JikanAPI.fetchSeasonNow(20),
            JikanAPI.loadAllContent()
        ]);

        seasonContent = seasonal || [];
        allContent = all || [];
        trendingContent = allContent.filter(i => i.type === 'anime').slice(0, 20);
        contentLoaded = true;
        contentLoading = false;

        console.log('Yüklendi:', allContent.length, 'içerik');
        renderHomePage();
        renderDiscoverGrid();
    } catch(e) {
        console.error('API yüklenemedi:', e);
        contentLoading = false;
        contentLoaded = true; // Tekrar denemeyi önle
        renderHomePage();
        renderDiscoverGrid();
        showNotification('İçerik yüklenirken hata oluştu.', 'error');
    }
}

function showLoadingPlaceholders() {
    const skeleton = '<div class="media-card skeleton-card"><div class="skeleton-poster"></div><div class="media-info"><div class="skeleton-line" style="width:80%;height:14px;margin-bottom:6px;"></div><div class="skeleton-line" style="width:50%;height:10px;"></div></div></div>'.repeat(8);
    ['trendingGrid', 'seasonPopularGrid', 'homeRecommendationsGrid'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = skeleton;
    });
    const dg = document.getElementById('discoverGrid');
    if (dg) dg.innerHTML = '<div class="discover-loading"><div class="loader"></div><p style="margin-top:1rem;color:var(--text-muted);">500+ içerik yükleniyor...</p></div>';
}

// ===== BÖLÜM GEÇİŞİ =====
function switchSection(section) {
    currentSection = section;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const sEl = document.getElementById(section + 'Section');
    if (sEl) sEl.classList.add('active');
    const tabEl = document.querySelector('.nav-tab[data-section="' + section + '"]');
    if (tabEl) tabEl.classList.add('active');

    switch(section) {
        case 'home':         renderHomePage(); break;
        case 'discover':     renderDiscoverGrid(); break;
        case 'profile':      if (!isGuest) renderProfilePage(); break;
        case 'calendar':     if (!isGuest) renderCalendar(); break;
        case 'analytics':    if (!isGuest) renderAnalytics(); break;
        case 'achievements': if (!isGuest) renderAchievements(); break;
        case 'ai':           if (!isGuest) renderAISection(); break;
        case 'library':      if (!isGuest) filterItems(); break;
        case 'detail':       break; // handled by openDetailPage
    }

    closeUserDropdown();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== ANA SAYFA =====
function renderHomePage() {
    const trending = trendingContent.length > 0 ? trendingContent.slice(0, 10) : [];
    const seasonal = seasonContent.length > 0 ? seasonContent.slice(0, 10) : [];
    const recs     = allContent.filter(i => i.rating && i.rating >= 8.0).slice(0, 10);

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
        container.innerHTML = '<div style="color:var(--text-muted);font-size:0.9rem;padding:1rem;">"İzliyorum" statüsünde içerik yok. <span style="color:var(--accent-secondary);cursor:pointer;" onclick="openAddModal()">İçerik ekle →</span></div>';
        return;
    }

    container.innerHTML = watching.map(item => {
        const pct = (item.totalEpisodes || 0) > 0 ? ((item.currentEpisode || 0) / item.totalEpisodes * 100).toFixed(0) : 0;
        return '<div class="media-card">' +
            '<div class="media-poster">' +
                (item.poster
                    ? '<img src="' + item.poster + '" alt="' + (item.name || '') + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                      '<div class="media-poster-fallback" style="display:none">' + getTypeIcon(item.type) + '</div>'
                    : '<div class="media-poster-fallback">' + getTypeIcon(item.type) + '</div>') +
                '<span class="media-type-badge ' + item.type + '">' + item.type + '</span>' +
                '<div class="media-score-badge">▶ ' + (item.currentEpisode || 0) + '/' + (item.totalEpisodes || '?') + '</div>' +
            '</div>' +
            '<div class="media-info">' +
                '<div class="media-title">' + (item.name || 'İsimsiz') + '</div>' +
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
        container.innerHTML = '<div style="color:var(--text-muted);font-size:0.9rem;padding:1rem;text-align:center;grid-column:1/-1;">Yükleniyor...</div>';
        return;
    }

    container.innerHTML = items.map(item => {
        const inLibrary = !isGuest && dataManager.data?.items.some(i => (i.name || '').toLowerCase() === (item.name || '').toLowerCase());
        const rating = item.rating ? '⭐ ' + item.rating : '';
        const meta = [item.year, item.episodes ? item.episodes + ' Ep' : item.chapters ? item.chapters + ' Ch' : ''].filter(Boolean).join(' · ');

        // JSON stringify ile XSS güvenli hale getir
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
            ? '<button class="add-to-list-btn" onclick="openAuthModal(\'register\')">🔐 Kayıt ol & ekle</button>'
            : '<button class="add-to-list-btn' + (inLibrary ? ' in-library' : '') + '" onclick="event.stopPropagation();quickAddFromJson(\'' + safeItem + '\')">' + (inLibrary ? '✓ Listende' : '+ Ekle') + '</button>';

        return '<div class="media-card">' +
            '<div class="media-poster">' +
                (item.poster
                    ? '<img src="' + item.poster + '" alt="' + (item.name || '') + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                      '<div class="media-poster-fallback" style="display:none">' + getTypeIcon(item.type) + '</div>'
                    : '<div class="media-poster-fallback">' + getTypeIcon(item.type) + '</div>') +
                '<span class="media-type-badge ' + (item.type || 'anime') + '">' + (item.type || 'anime') + '</span>' +
                (rating ? '<div class="media-score-badge">' + rating + '</div>' : '') +
            '</div>' +
            '<div class="media-info">' +
                '<div class="media-title">' + (item.name || 'İsimsiz') + '</div>' +
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
        grid.innerHTML = '<div class="discover-loading"><div class="loader"></div><p style="margin-top:1rem;color:var(--text-muted);">İçerikler yükleniyor...</p></div>';
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
    if (statsEl) statsEl.textContent = total + ' içerik bulundu';

    if (page.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem;font-size:1.1rem;">🔍 Sonuç bulunamadı</div>';
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
            ? '<button class="add-to-list-btn" onclick="openAuthModal(\'register\')">🔐 Kayıt ol & ekle</button>'
            : '<button class="add-to-list-btn' + (inLibrary ? ' in-library' : '') + '" onclick="event.stopPropagation();quickAddFromJson(\'' + safeItem + '\')">' + (inLibrary ? '✓ Listende' : '+ Ekle') + '</button>';

        return '<div class="media-card">' +
            '<div class="media-poster">' +
                (item.poster
                    ? '<img src="' + item.poster + '" alt="' + (item.name || '') + '" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                      '<div class="media-poster-fallback" style="display:none">' + getTypeIcon(item.type) + '</div>'
                    : '<div class="media-poster-fallback">' + getTypeIcon(item.type) + '</div>') +
                '<span class="media-type-badge ' + (item.type || 'anime') + '">' + (item.type || 'anime') + '</span>' +
                (rating ? '<div class="media-score-badge">' + rating + '</div>' : '') +
            '</div>' +
            '<div class="media-info">' +
                '<div class="media-title">' + (item.name || 'İsimsiz') + '</div>' +
                '<div class="media-meta">' + meta + '</div>' +
                addBtn +
            '</div>' +
        '</div>';
    }).join('') + (page.length < total
        ? '<div style="grid-column:1/-1;text-align:center;padding:2rem;"><button class="btn btn-secondary" onclick="loadMoreDiscover()">Daha Fazla Yükle (' + (total - page.length) + ' kaldı)</button></div>'
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
        // HTML entity decode
        const decoded = jsonStr.replace(/&quot;/g, '"');
        const item = JSON.parse(decoded);
        quickAdd(item);
    } catch(e) {
        console.error('quickAddFromJson parse error:', e);
        showNotification('Ekleme sırasında hata oluştu.', 'error');
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
    xpSystem.addXP(XP_REWARDS.addItem, (item.name || '') + ' eklendi');
    checkAchievements();
    updateStats();
    showNotification('✅ ' + newItem.name + ' "İzlenecek" listesine eklendi!', 'success');
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
    if (!name) { showNotification('Lütfen bir isim girin!', 'error'); return; }

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
    xpSystem.addXP(XP_REWARDS.addItem, newItem.name + ' eklendi');
    checkAchievements();
    updateStats();
    filterItems();
    closeModal();
    showNotification('✅ ' + newItem.name + ' eklendi!', 'success');
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
                            ? '<img src="' + item.poster + '" alt="' + (item.name || '') + '">'
                            : '<div style="width:40px;height:55px;background:var(--bg-card);border-radius:4px;display:flex;align-items:center;justify-content:center;">' + getTypeIcon(item.type) + '</div>') +
                        '<div>' +
                            '<div class="api-result-title">' + (item.name || '') + '</div>' +
                            '<div class="api-result-meta">' + item.type + ' · ' + (item.episodes ? item.episodes + ' ep' : item.chapters ? item.chapters + ' ch' : '?') + (item.rating ? ' · ⭐' + item.rating : '') + '</div>' +
                        '</div>' +
                    '</div>';
                }).join('');
            } else {
                resultsDiv.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:0.8rem;font-size:0.85rem;">Sonuç bulunamadı</div>';
            }
        } catch {
            resultsDiv.innerHTML = '<div style="color:var(--danger);text-align:center;padding:0.8rem;font-size:0.85rem;">API bağlantı hatası</div>';
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
            if (p === 'granted') showNotification('Bildirimler etkinleştirildi! 🔔', 'success');
            else el.checked = false;
        });
    }
}

// ===== PWA =====
function setupPWA() {
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
        showNotification('İnternet bağlantısı yeniden sağlandı! 🌐', 'success');
    });
    window.addEventListener('offline', () => {
        const ob = document.getElementById('offlineBanner');
        if (ob) ob.classList.add('show');
    });
}

// ===== MODAL KAPAT (dışına tıklayınca) =====
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

console.log('✅ App.js v5.1 loaded');
// =====================================================
// DETAY SAYFASI SİSTEMİ
// =====================================================

let currentDetailItem = null;

// Ana açma fonksiyonu - kartlara onclick ile bağlı
async function openDetailPage(itemJsonStr) {
    let item;
    try {
        const decoded = (itemJsonStr || '').replace(/&quot;/g, '"');
        item = JSON.parse(decoded);
    } catch(e) { console.error('Detail parse error:', e); return; }

    currentDetailItem = item;

    // Detay section'ı göster
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const detailSec = document.getElementById('detailSection');
    if (detailSec) detailSec.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Temel bilgileri hemen doldur
    _fillDetailBasic(item);

    // Jikan'dan tam detay çek
    _fetchFullDetail(item);

    // Yorumları yükle
    loadReviews(item.id);

    // Kullanıcının mevcut puanını yükle
    loadUserReview(item.id);

    // Benzer içerikleri yükle
    loadSimilarContent(item);
}

function _fillDetailBasic(item) {
    const s = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    const sh = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html || ''; };

    // Poster
    const posterEl = document.getElementById('dpPoster');
    if (posterEl) { posterEl.src = item.poster || ''; posterEl.onerror = () => posterEl.style.display = 'none'; }

    s('dpTitle', item.name);
    s('dpYear', item.year);
    s('dpScore', item.rating ? '⭐ ' + item.rating : '—');
    s('dpEpisodes', item.episodes ? item.episodes + ' Bölüm' : item.chapters ? item.chapters + ' Bölüm' : '—');
    s('dpSynopsis', item.synopsis || 'Açıklama yükleniyor...');
    s('dpStatus', '—');
    s('dpRank', '—');
    s('dpMembers', '—');
    s('dpStudio', '—');

    // Type badge
    const badge = document.getElementById('dpTypeBadge');
    if (badge) { badge.textContent = (item.type || 'anime').toUpperCase(); badge.className = 'dp-type-badge ' + (item.type || 'anime'); }

    // Genres
    sh('dpGenres', (item.genres || []).map(g => `<span class="dp-genre-tag">${g}</span>`).join('') || '<span style="color:var(--text-muted)">Yükleniyor...</span>');

    // Add button
    const addBtn = document.getElementById('dpAddBtn');
    if (addBtn) {
        const inLib = !isGuest && dataManager.data?.items?.some(i => i.name?.toLowerCase() === item.name?.toLowerCase());
        addBtn.textContent = inLib ? '✓ Listende' : '+ Listeye Ekle';
        addBtn.className = 'dp-add-btn' + (inLib ? ' in-library' : '');
        addBtn.onclick = () => {
            if (isGuest) { openAuthModal('register'); return; }
            quickAdd(item);
            addBtn.textContent = '✓ Listende';
            addBtn.className = 'dp-add-btn in-library';
        };
    }

    // Back breadcrumb
    const titleBc = document.getElementById('dpBreadcrumbTitle');
    if (titleBc) titleBc.textContent = item.name || '';
}

async function _fetchFullDetail(item) {
    if (!item.malId) return;
    try {
        const type = item.type === 'anime' ? 'anime' : 'manga';
        const res = await fetch(`https://api.jikan.moe/v4/${type}/${item.malId}`);
        if (!res.ok) return;
        const { data: d } = await res.json();
        if (!d) return;

        const s = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };

        s('dpScore', d.score ? '⭐ ' + d.score.toFixed(1) : null);
        s('dpEpisodes', d.episodes ? d.episodes + ' Bölüm' : d.chapters ? d.chapters + ' Bölüm' : null);
        s('dpStatus', d.status || null);
        s('dpRank', d.rank ? '#' + d.rank : null);
        s('dpMembers', d.members ? d.members.toLocaleString('tr-TR') : null);
        s('dpStudio', (d.studios?.[0]?.name) || (d.authors?.[0]?.name) || null);
        s('dpSynopsis', d.synopsis || null);
        s('dpYear', d.year || (d.aired?.from ? new Date(d.aired.from).getFullYear() : null));

        if (d.genres || d.themes) {
            const genres = [...(d.genres || []), ...(d.themes || [])].map(g => g.name);
            const el = document.getElementById('dpGenres');
            if (el) el.innerHTML = genres.map(g => `<span class="dp-genre-tag">${g}</span>`).join('');
        }

        // Background poster if available
        if (d.images?.jpg?.large_image_url) {
            const bg = document.getElementById('dpBannerBg');
            if (bg) {
                bg.style.backgroundImage = `url(${d.images.jpg.large_image_url})`;
                bg.style.backgroundSize = 'cover';
                bg.style.backgroundPosition = 'center top';
            }
        }
    } catch(e) { /* ignore */ }
}

// ===== REVIEWS =====
async function loadReviews(contentId) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    container.innerHTML = '<div class="reviews-loading"><div class="mini-spinner"></div> Yorumlar yükleniyor...</div>';

    if (!window.supabaseClient) { container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">Yorumlar yüklenemedi.</p>'; return; }

    const { data, error } = await window.supabaseClient
        .from('reviews')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
        .limit(30);

    if (error || !data?.length) {
        container.innerHTML = '<div class="no-reviews"><div style="font-size:2.5rem;">💬</div><p>Henüz yorum yok. İlk yorumu sen yaz!</p></div>';
        return;
    }

    // Avg score
    const avg = (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1);
    const avgEl = document.getElementById('dpUserScore');
    if (avgEl) avgEl.textContent = avg + ' / 10';
    const cntEl = document.getElementById('dpReviewCount');
    if (cntEl) cntEl.textContent = data.length + ' yorum';

    container.innerHTML = data.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${(r.username || 'U')[0].toUpperCase()}</div>
                <div class="review-meta">
                    <div class="review-username">${_esc(r.username)}</div>
                    <div class="review-date">${_fmtDate(r.created_at)}</div>
                </div>
                <div class="review-score-badge">${r.rating}<span>/10</span></div>
                ${!isGuest && currentUser?.uid === r.user_id ? `<button class="review-delete-btn" onclick="deleteReview('${r.id}','${_esc(currentDetailItem?.id||'')}')">🗑️</button>` : ''}
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
        // Pre-fill form
        setStarRating(data.rating);
        const commentEl = document.getElementById('reviewComment');
        if (commentEl) commentEl.value = data.comment || '';
        const submitBtn = document.getElementById('reviewSubmitBtn');
        if (submitBtn) submitBtn.textContent = '✏️ Yorumu Güncelle';
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
    if (ratingText) ratingText.textContent = rating > 0 ? rating + ' / 10' : 'Puan seç';
}

async function submitReview() {
    if (isGuest) { openAuthModal('register'); return; }
    if (!selectedRating) { showNotification('Lütfen bir puan seç!', 'error'); return; }
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

    // Find similar from allContent
    let similar = allContent.filter(c =>
        c.id !== item.id &&
        c.type === type &&
        c.name !== item.name &&
        (genres.length === 0 || c.genres?.some(g => genres.includes(g)))
    ).slice(0, 8);

    if (similar.length < 4) {
        similar = allContent.filter(c => c.type === type && c.id !== item.id).slice(0, 8);
    }

    if (!similar.length) {
        container.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;">Benzer içerik bulunamadı.</p>';
        return;
    }

    renderMediaRow('similarGrid', similar);
}

function goBackFromDetail() {
    switchSection('home');
}

function _esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function _fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('tr-TR', { day:'numeric', month:'short', year:'numeric' });
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