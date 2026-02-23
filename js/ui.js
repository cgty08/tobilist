// UI.JS v6.0 - Full TR/EN language support + bug fixes

// ===== TRANSLATIONS =====
const translations = {
    tr: {
        // NAV
        home: 'Ana Sayfa', library: 'Kütüphanem', discover: 'Keşfet',
        calendar: 'Takvim', analytics: 'Analitik', ai: 'AI Öneriler', achievements: 'Başarımlar',
        // HOME
        trending: '🔥 Şu An Trend', continueWatching: '▶️ Devam Et',
        seasonal: '🌸 Bu Sezon Popüler', highRated: '💡 Yüksek Puanlı',
        // LIBRARY
        libraryTitle: '📚 Kütüphanem', searchPlaceholder: 'İçerik ara...',
        allTypes: 'Tüm Tipler', allStatuses: 'Tüm Durumlar',
        newest: 'En Yeni', nameAZ: 'İsim (A-Z)', byRating: 'Puan', byProgress: 'İlerleme',
        // STATUS
        plantowatch: '📋 İzlenecek', watching: '▶️ İzliyorum', completed: '✅ Tamamlandı',
        onhold: '⏸️ Beklemede', dropped: '❌ Bırakıldı',
        // ITEM CARD
        statusLabel: 'Durum', episodeLabel: 'Bölüm İlerlemesi', ratingLabel: 'Puan', deleteBtn: '🗑️ Sil',
        // EMPTY
        noContent: 'İçerik bulunamadı', noContentSub: 'Henüz içerik eklenmemiş veya filtreler eşleşmedi.',
        addContent: '+ İçerik Ekle',
        // DISCOVER
        discoverTitle: '🔍 Keşfet', discoverSub: 'Anime, manga ve webtoon dünyasını keşfet',
        allBtn: 'Tümü', searchAnime: 'Ara...',
        byRatingSort: 'Puana Göre', byNameSort: 'İsme Göre', byYearSort: 'Yıla Göre',
        loadMore: 'Daha Fazla Yükle', noResults: '🔍 Sonuç bulunamadı',
        // PROFILE
        profileTitle: 'Kullanıcı', bioDefault: 'Anime, manga ve webtoon takipçisi',
        editBtn: '✏️ Düzenle', shareBtn: '📤 Paylaş',
        recentActivity: '📋 Son Aktiviteler', favoriteGenres: '💖 Favori Türler',
        recentAchievements: '🏆 Son Başarımlar', noActivity: 'Henüz aktivite yok',
        noGenres: 'Henüz tür yok', noAchievements: 'Henüz başarım yok',
        exportShare: '📤 Paylaş & Dışa Aktar',
        // STATS
        watching_stat: 'İzliyorum', completed_stat: 'Tamamlandı', plantowatch_stat: 'İzlenecek',
        onhold_stat: 'Beklemede', avgRating: 'Ort. Puan', streak: 'Streak',
        // CALENDAR
        calendarTitle: '📅 Yayın Takvimi', weeklySchedule: 'Haftalık Yayın Takvimi',
        syncBtn: '🔄 Senkronize Et', calLoading: '📡 Takvim yükleniyor...',
        // ANALYTICS
        analyticsTitle: '📊 Analitik',
        categoryDist: '📊 Kategori Dağılımı', statusDist: '📈 Durum Dağılımı',
        avgScore: '⭐ Ortalama Puan', summary: '📋 Genel Özet',
        totalContent: '📦 Toplam İçerik', streakLabel: '🔥 Streak', longestStreak: '📅 En Uzun Streak',
        outOf5: '5 üzerinden', reviews: 'değerlendirme',
        // AI
        aiTitle: 'AI Öneri Motoru', aiSub: 'İzleme alışkanlıklarını analiz ederek sana özel içerikler buluyor',
        watchingPattern: 'İzleme Paterni', favGenre: 'Favori Tür', avgRatingAI: 'Ort. Puan', accuracy: 'AI Doğruluğu',
        getNew: '✨ Yeni Öneriler Al', refresh: '🔄 Yenile',
        forYou: '💎 Size Özel', similar: '🎭 Beğendiklerinize Benzer',
        // ACHIEVEMENTS
        achievementsTitle: '🏆 Başarımlar', achievementsSub: 'İçerik ekle, tamamla ve seviyeleri geç',
        // SETTINGS
        settingsTitle: '⚙️ Ayarlar', themeTitle: '🎨 Tema',
        dark: 'Karanlık', light: 'Aydınlık', neon: 'Neon', pastel: 'Pastel',
        dataTitle: '📤 Veri Yönetimi', dataSub: 'Verilerinizi dışa aktarın veya içe aktarın',
        jsonDown: '📥 JSON İndir', csvDown: '📥 CSV İndir', importBtn: '📤 Veri Yükle',
        notifTitle: '🔔 Bildirimler', pushNotif: 'Push bildirimleri etkinleştir',
        accountTitle: '⚠️ Hesap İşlemleri', accountSub: 'Bu işlemler geri alınamaz.',
        logout: '🚪 Çıkış Yap', deleteAccount: '🗑️ Hesabı Sil',
        // NOTIFICATIONS
        loginSuccess: 'Hoş geldiniz! 🎉', logoutMsg: 'Çıkış yapıldı. Görüşürüz! 👋',
        guestStart: '🎭 Keşfetmeye başlayın!', welcomeBack: '✅ Hoş geldiniz',
        addedTo: '"İzlenecek" listesine eklendi!', alreadyIn: 'zaten listenizde!',
        itemAdded: 'eklendi!', itemDeleted: 'İçerik silindi 🗑️',
        themeChanged: 'Tema değiştirildi ✅', profileUpdated: 'Profil güncellendi! ✅',
        aiUpdated: 'AI önerileri güncellendi! 🤖', calSynced: 'Takvim güncellendi! ✅ Yeşil = kütüphanende var',
        exportedMsg: 'Veri dışa aktarıldı! 📥', importedMsg: 'Veri içe aktarıldı! ✅',
        importFailMsg: 'Dosya okunamadı! ❌', loginRequired: 'Bu özelliği kullanmak için giriş yapın! 🔐',
        enterName: 'Lütfen bir isim girin!', importLoginRequired: 'Veri içe aktarmak için giriş yapın!',
        profileLink: 'Profil linki kopyalandı! 🔗', profileLinkFail: 'Link kopyalanamadı',
        confirmDelete: 'Bu içeriği silmek istediğinize emin misiniz?',
        confirmLogout: 'Çıkış yapmak istediğinize emin misiniz?',
        confirmDeleteAccount: 'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!',
        // DAYS
        days: ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'],
    },
    en: {
        // NAV
        home: 'Home', library: 'My Library', discover: 'Discover',
        calendar: 'Calendar', analytics: 'Analytics', ai: 'AI Recs', achievements: 'Achievements',
        // HOME
        trending: '🔥 Trending Now', continueWatching: '▶️ Continue Watching',
        seasonal: '🌸 This Season', highRated: '💡 Highly Rated',
        // LIBRARY
        libraryTitle: '📚 My Library', searchPlaceholder: 'Search content...',
        allTypes: 'All Types', allStatuses: 'All Statuses',
        newest: 'Newest', nameAZ: 'Name (A-Z)', byRating: 'Rating', byProgress: 'Progress',
        // STATUS
        plantowatch: '📋 Plan to Watch', watching: '▶️ Watching', completed: '✅ Completed',
        onhold: '⏸️ On Hold', dropped: '❌ Dropped',
        // ITEM CARD
        statusLabel: 'Status', episodeLabel: 'Episode Progress', ratingLabel: 'Rating', deleteBtn: '🗑️ Remove',
        // EMPTY
        noContent: 'No content found', noContentSub: 'No items added yet, or no filter matches.',
        addContent: '+ Add Content',
        // DISCOVER
        discoverTitle: '🔍 Discover', discoverSub: 'Explore the world of anime, manga & webtoon',
        allBtn: 'All', searchAnime: 'Search...',
        byRatingSort: 'By Rating', byNameSort: 'By Name', byYearSort: 'By Year',
        loadMore: 'Load More', noResults: '🔍 No results found',
        // PROFILE
        profileTitle: 'User', bioDefault: 'Anime, manga & webtoon fan',
        editBtn: '✏️ Edit', shareBtn: '📤 Share',
        recentActivity: '📋 Recent Activity', favoriteGenres: '💖 Favorite Genres',
        recentAchievements: '🏆 Recent Achievements', noActivity: 'No activity yet',
        noGenres: 'No genres yet', noAchievements: 'No achievements yet',
        exportShare: '📤 Share & Export',
        // STATS
        watching_stat: 'Watching', completed_stat: 'Completed', plantowatch_stat: 'Plan to Watch',
        onhold_stat: 'On Hold', avgRating: 'Avg Rating', streak: 'Streak',
        // CALENDAR
        calendarTitle: '📅 Airing Calendar', weeklySchedule: 'Weekly Airing Schedule',
        syncBtn: '🔄 Sync', calLoading: '📡 Loading schedule...',
        // ANALYTICS
        analyticsTitle: '📊 Analytics',
        categoryDist: '📊 Category Breakdown', statusDist: '📈 Status Breakdown',
        avgScore: '⭐ Average Score', summary: '📋 Summary',
        totalContent: '📦 Total Entries', streakLabel: '🔥 Streak', longestStreak: '📅 Longest Streak',
        outOf5: 'out of 5', reviews: 'ratings',
        // AI
        aiTitle: 'AI Recommendation Engine', aiSub: 'Analyzing your habits to surface tailored picks',
        watchingPattern: 'Watching Pattern', favGenre: 'Fav. Genre', avgRatingAI: 'Avg. Rating', accuracy: 'AI Accuracy',
        getNew: '✨ Get New Recs', refresh: '🔄 Refresh',
        forYou: '💎 For You', similar: '🎭 Similar to What You Love',
        // ACHIEVEMENTS
        achievementsTitle: '🏆 Achievements', achievementsSub: 'Add, complete and level up',
        // SETTINGS
        settingsTitle: '⚙️ Settings', themeTitle: '🎨 Theme',
        dark: 'Dark', light: 'Light', neon: 'Neon', pastel: 'Pastel',
        dataTitle: '📤 Data Management', dataSub: 'Export or import your data',
        jsonDown: '📥 Download JSON', csvDown: '📥 Download CSV', importBtn: '📤 Import Data',
        notifTitle: '🔔 Notifications', pushNotif: 'Enable push notifications',
        accountTitle: '⚠️ Account Actions', accountSub: 'These actions cannot be undone.',
        logout: '🚪 Sign Out', deleteAccount: '🗑️ Delete Account',
        // NOTIFICATIONS
        loginSuccess: 'Welcome back! 🎉', logoutMsg: 'Signed out. See you! 👋',
        guestStart: '🎭 Start exploring!', welcomeBack: '✅ Welcome back',
        addedTo: 'added to "Plan to Watch"!', alreadyIn: 'is already in your list!',
        itemAdded: 'added!', itemDeleted: 'Entry removed 🗑️',
        themeChanged: 'Theme changed ✅', profileUpdated: 'Profile updated! ✅',
        aiUpdated: 'AI recs refreshed! 🤖', calSynced: 'Calendar synced! ✅ Green = in your library',
        exportedMsg: 'Data exported! 📥', importedMsg: 'Data imported! ✅',
        importFailMsg: 'Could not read file! ❌', loginRequired: 'Sign in to use this feature! 🔐',
        enterName: 'Please enter a title!', importLoginRequired: 'Sign in to import data!',
        profileLink: 'Profile link copied! 🔗', profileLinkFail: 'Could not copy link',
        confirmDelete: 'Remove this entry?',
        confirmLogout: 'Are you sure you want to sign out?',
        confirmDeleteAccount: 'Delete your account? This cannot be undone!',
        // DAYS
        days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    }
};

// Current language
let _lang = 'tr';

function t(key) {
    return translations[_lang]?.[key] || translations['tr']?.[key] || key;
}

function getCurrentLang() { return _lang; }

// ===== LANGUAGE CHANGE =====
function changeLanguage() {
    const langSel = document.getElementById('languageSelect');
    _lang = langSel ? langSel.value : 'tr';
    if (dataManager.data) {
        dataManager.data.settings.language = _lang;
        dataManager.saveAll();
    }
    applyLanguage();
}

function applyLanguage() {
    // Nav tabs via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[_lang]?.[key]) el.textContent = translations[_lang][key];
    });

    // Dynamic page text
    const set = (id, key) => { const e=document.getElementById(id); if(e&&t(key)) e.textContent=t(key); };

    // Stats badges
    set('watchingStatLabel', 'watching_stat');
    set('completedStatLabel', 'completed_stat');
    set('planToWatchStatLabel', 'plantowatch_stat');
    set('onHoldStatLabel', 'onhold_stat');
    set('avgRatingLabel', 'avgRating');
    set('streakBadgeLabel', 'streak');

    // Discover search placeholder
    const ds = document.getElementById('discoverSearch');
    if (ds) ds.placeholder = t('searchAnime');

    // Library search placeholder
    const ls = document.getElementById('searchInput');
    if (ls) ls.placeholder = t('searchPlaceholder');

    // Section headers (if currently rendered)
    const discoverStatEl = document.getElementById('discoverStats');
    if (discoverStatEl && !discoverStatEl.textContent.includes(t('discoverSub'))) {
        // re-render if on discover page
    }

    // Refresh current section content if needed
    if (typeof currentSection !== 'undefined') {
        if (currentSection === 'library') filterItems();
        if (currentSection === 'discover') renderDiscoverGrid();
        if (currentSection === 'analytics') renderAnalytics();
        if (currentSection === 'ai') renderAISection();
        if (currentSection === 'profile') renderProfilePage();
    }
}

// ===== THEME =====
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (dataManager.data) { dataManager.data.settings.theme = theme; dataManager.saveAll(); }
    document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
    const el = document.querySelector('.theme-' + theme);
    if (el) el.classList.add('active');
    showNotification(t('themeChanged'), 'success');
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'success') {
    const el = document.getElementById('notification');
    if (!el) return;
    el.textContent = message;
    el.className = 'notification ' + type + ' show';
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => el.classList.remove('show'), 3500);
}

function getTypeIcon(type) {
    return { anime: '🎬', manga: '📖', webtoon: '📱' }[type] || '📺';
}

// ===== STATS =====
function updateStats() {
    if (!dataManager.data) return;
    const items = dataManager.data.items;
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

    const anime      = items.filter(i => i.type === 'anime').length;
    const manga      = items.filter(i => i.type === 'manga').length;
    const webtoon    = items.filter(i => i.type === 'webtoon').length;
    const completed  = items.filter(i => i.status === 'completed').length;
    const watching   = items.filter(i => i.status === 'watching').length;
    const onHold     = items.filter(i => i.status === 'onhold').length;
    const planToWatch= items.filter(i => i.status === 'plantowatch').length;
    const rated      = items.filter(i => i.rating > 0);
    const avg = rated.length > 0 ? (rated.reduce((a, i) => a + i.rating, 0) / rated.length).toFixed(1) : '0.0';

    set('totalCount', items.length);
    set('heroAnimeCount', anime);
    set('heroMangaCount', manga);
    set('heroWebtoonCount', webtoon);
    set('watchingCount', watching);
    set('completedCount', completed);
    set('onHoldCount', onHold);
    set('planToWatchCount', planToWatch);
    set('avgRatingHome', avg);
    set('profileTotalAnime', anime);
    set('profileTotalManga', manga);
    set('profileTotalWebtoon', webtoon);
    set('profileCompletedTotal', completed);
}

// ===== LIBRARY =====
function filterItems() {
    if (!dataManager.data) return;
    const searchEl  = document.getElementById('searchInput');
    const typeEl    = document.getElementById('typeFilter');
    const statusEl  = document.getElementById('statusFilter');
    const sortEl    = document.getElementById('sortBy');

    const search = searchEl ? searchEl.value.toLowerCase() : '';
    const type   = typeEl ? typeEl.value : 'all';
    const status = statusEl ? statusEl.value : 'all';
    const sort   = sortEl ? sortEl.value : 'recent';

    let filtered = dataManager.data.items.filter(i => {
        if (type !== 'all' && i.type !== type) return false;
        if (status !== 'all' && i.status !== status) return false;
        if (search && !(i.name || '').toLowerCase().includes(search)) return false;
        return true;
    });

    if (sort === 'name') filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'progress') filtered.sort((a, b) => {
        const pa = a.totalEpisodes > 0 ? a.currentEpisode / a.totalEpisodes : 0;
        const pb = b.totalEpisodes > 0 ? b.currentEpisode / b.totalEpisodes : 0;
        return pb - pa;
    });
    else filtered.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));

    renderLibraryGrid(filtered);
}

function renderLibraryGrid(items) {
    const container = document.getElementById('itemsGrid');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = `<div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>${t('noContent')}</h3>
            <p>${t('noContentSub')}</p>
            <button class="btn btn-primary" onclick="openAddModal()">${t('addContent')}</button>
        </div>`;
        return;
    }

    const statusLabels = {
        plantowatch: t('plantowatch'),
        watching:    t('watching'),
        completed:   t('completed'),
        onhold:      t('onhold'),
        dropped:     t('dropped')
    };

    container.innerHTML = items.map(item => {
        const progress = (item.totalEpisodes || 0) > 0
            ? Math.min(100, ((item.currentEpisode || 0) / item.totalEpisodes * 100)).toFixed(0) : 0;
        const stars = [1,2,3,4,5].map(s =>
            `<button class="star-btn" onclick="updateItem('${item.id}','rating',${s})">${s <= (item.rating || 0) ? '⭐' : '☆'}</button>`
        ).join('');

        return `<div class="item-card">
            <div class="item-poster" style="cursor:pointer" onclick="openDetailPageFromLibrary('${item.id}')">
                ${item.poster
                    ? `<img src="${item.poster}" alt="${(item.name||'').replace(/"/g,'&quot;')}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                       <div class="media-poster-fallback" style="display:none">${getTypeIcon(item.type)}</div>`
                    : `<div class="media-poster-fallback">${getTypeIcon(item.type)}</div>`}
                <span class="media-type-badge ${item.type}">${item.type}</span>
            </div>
            <div class="item-header">
                <span class="item-type-badge ${item.type}">${item.type}</span>
                <div class="item-title">${item.name || (t('noContent'))}</div>
            </div>
            <div class="item-body">
                <label>${t('statusLabel')}</label>
                <select onchange="updateItem('${item.id}','status',this.value)">
                    ${Object.entries(statusLabels).map(([val, label]) =>
                        `<option value="${val}"${item.status === val ? ' selected' : ''}>${label}</option>`
                    ).join('')}
                </select>
                <label>${t('episodeLabel')}</label>
                <div class="ep-row">
                    <input type="number" min="0" max="${item.totalEpisodes || 9999}" value="${item.currentEpisode || 0}"
                        onchange="updateItem('${item.id}','currentEpisode',parseInt(this.value)||0)" placeholder="Current">
                    <input type="number" min="0" value="${item.totalEpisodes || 0}"
                        onchange="updateItem('${item.id}','totalEpisodes',parseInt(this.value)||0)" placeholder="Total">
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
                <label>${t('ratingLabel')}</label>
                <div class="star-rating">${stars}</div>
                <button class="delete-btn" onclick="deleteItem('${item.id}')">${t('deleteBtn')}</button>
            </div>
        </div>`;
    }).join('');
}

function updateItem(id, field, value) {
    if (!dataManager.data) return;
    const item = dataManager.data.items.find(i => String(i.id) === String(id));
    if (!item) return;
    const oldValue = item[field];
    item[field] = value;

    if (field === 'status' && value === 'completed' && oldValue !== 'completed') {
        if (item.totalEpisodes > 0) item.currentEpisode = item.totalEpisodes;
        xpSystem.addXP(XP_REWARDS.completeItem, item.name + (_lang === 'en' ? ' completed' : ' tamamlandı'));
        checkAchievements();
    } else if (field === 'rating' && value > 0 && oldValue !== value) {
        xpSystem.addXP(XP_REWARDS.rateItem, _lang === 'en' ? 'Rated!' : 'Puan verildi');
        if (value === 5) checkAchievements();
    }
    dataManager.saveAll(); // FIX: ensure saves to Supabase
    filterItems();
    updateStats();
}

function deleteItem(id) {
    if (!confirm(t('confirmDelete'))) return;
    if (!dataManager.data) return;
    dataManager.data.items = dataManager.data.items.filter(i => String(i.id) !== String(id));
    dataManager.saveAll(); // FIX: ensure saves to Supabase
    filterItems();
    updateStats();
    showNotification(t('itemDeleted'), 'info');
}

// ===== PROFILE =====

// Avatar'ı bir element'e uygula (fotoğraf varsa fotoğraf, yoksa emoji)
function _applyAvatar(elId, social) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (social && social.avatarUrl) {
        el.style.backgroundImage = 'url(' + social.avatarUrl + ')';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.textContent = '';
        el.classList.add('has-photo');
    } else {
        el.style.backgroundImage = '';
        el.style.backgroundSize = '';
        el.style.backgroundPosition = '';
        el.classList.remove('has-photo');
        el.textContent = (social && social.avatar) ? social.avatar : '👤';
    }
}

function renderProfilePage() {
    if (!dataManager.data || !currentUser) return;
    const d = dataManager.data;
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

    set('profileUsername', d.social.name || 'Kullanıcı');
    set('profileEmailDisplay', currentUser.email || '');
    set('profileBioText', d.social.bio || 'Anime, manga ve webtoon takipçisi');

    // Avatar — fotoğraf veya emoji
    _applyAvatar('profileAvatarLarge', d.social);

    // Kapak
    const cover = document.getElementById('profileCoverBg');
    if (cover) {
        const covers = {
            gradient1: 'linear-gradient(135deg,#ff3366,#7c3aed)',
            gradient2: 'linear-gradient(135deg,#00d4ff,#0ea5e9)',
            gradient3: 'linear-gradient(135deg,#10b981,#059669)',
            gradient4: 'linear-gradient(135deg,#f59e0b,#ef4444)',
            gradient5: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
            gradient6: 'linear-gradient(135deg,#f97316,#fbbf24)',
            gradient7: 'linear-gradient(135deg,#06b6d4,#6366f1)',
        };
        cover.style.background = covers[d.social.cover || 'gradient1'];
    }

    updateStats();
    xpSystem.updateUI();

    const items = d.items || [];

    // İzleme durumu özeti
    const watching   = items.filter(i => i.status === 'watching').length;
    const completed  = items.filter(i => i.status === 'completed').length;
    const planned    = items.filter(i => i.status === 'plantowatch').length;
    const dropped    = items.filter(i => i.status === 'dropped').length;
    const rated      = items.filter(i => i.rating);
    const avgRating  = rated.length ? (rated.reduce((s, i) => s + i.rating, 0) / rated.length).toFixed(1) : '—';

    set('profileTotalAnime',    items.filter(i => i.type === 'anime').length);
    set('profileTotalManga',    items.filter(i => i.type === 'manga').length);
    set('profileTotalWebtoon',  items.filter(i => i.type === 'webtoon').length);
    set('profileCompletedTotal', completed);
    set('profileStreakVal',     d.streak?.longest || d.streak?.count || 0);
    set('profileXPTotal',      d.xp?.total || 0);

    // Durum çubukları
    const statusBar = document.getElementById('profileStatusBars');
    if (statusBar) {
        const total = items.length || 1;
        const bars = [
            { label: t('watching_stat'),    count: watching,  color: '#00d4ff' },
            { label: t('completed_stat'),   count: completed, color: '#10b981' },
            { label: t('plantowatch_stat'), count: planned,   color: '#a78bfa' },
            { label: _lang === 'en' ? 'Dropped' : 'Bırakıldı', count: dropped, color: '#f87171' },
        ];
        statusBar.innerHTML = bars.map(b => `
            <div class="status-bar-row">
                <span class="status-bar-label">${b.label}</span>
                <div class="status-bar-track">
                    <div class="status-bar-fill" style="width:${Math.round(b.count/total*100)}%;background:${b.color};"></div>
                </div>
                <span class="status-bar-count">${b.count}</span>
            </div>`).join('') + `
            <div class="status-bar-row" style="margin-top:0.6rem;border-top:1px solid var(--border);padding-top:0.6rem;">
                <span class="status-bar-label" style="color:var(--text-muted)">Ort. Puan</span>
                <div class="status-bar-track">
                    <div class="status-bar-fill" style="width:${rated.length ? Math.round(parseFloat(avgRating)/5*100) : 0}%;background:#fbbf24;"></div>
                </div>
                <span class="status-bar-count" style="color:#fbbf24;">${avgRating}</span>
            </div>`;
    }

    // Son aktiviteler
    const actList = document.getElementById('activityList');
    if (actList) {
        const recent = [...items].reverse().slice(0, 6);
        const sColors = { watching:'#00d4ff', completed:'#10b981', plantowatch:'#a78bfa', onhold:'#fbbf24', dropped:'#f87171' };
        const sLabels = {
            watching:    t('watching_stat'),
            completed:   t('completed_stat'),
            plantowatch: t('plantowatch_stat'),
            onhold:      t('onhold_stat'),
            dropped:     _lang === 'en' ? 'Dropped' : 'Bırakıldı'
        };
        if (recent.length === 0) {
            actList.innerHTML = '<div style="color:var(--text-muted);font-size:0.88rem;padding:0.8rem 0;">' + t('noActivity') + '</div>';
        } else {
            actList.innerHTML = recent.map(i => `
                <div class="activity-item">
                    <div class="activity-icon">${getTypeIcon(i.type)}</div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;font-size:0.85rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${i.name || '—'}</div>
                        <div style="display:flex;gap:0.5rem;align-items:center;margin-top:0.1rem;">
                            <span style="font-size:0.72rem;color:${sColors[i.status] || 'var(--text-muted)'}">● ${sLabels[i.status] || ''}</span>
                            ${i.rating ? '<span style="font-size:0.72rem;color:#fbbf24;">★ ' + i.rating + '</span>' : ''}
                        </div>
                    </div>
                </div>`).join('');
        }
    }

    // Favori türler — bar chart
    const genres = {};
    items.forEach(i => { if (i.genre) genres[i.genre] = (genres[i.genre] || 0) + 1; });
    const favGenres = document.getElementById('favoriteGenres');
    if (favGenres) {
        const sorted = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const max = sorted[0]?.[1] || 1;
        favGenres.innerHTML = sorted.length > 0
            ? sorted.map(([g, c]) => `
                <div style="margin-bottom:0.55rem;">
                    <div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.18rem;">
                        <span>${g}</span><span style="color:var(--text-muted)">${c}</span>
                    </div>
                    <div style="height:3px;background:var(--border);border-radius:2px;overflow:hidden;">
                        <div style="width:${Math.round(c/max*100)}%;height:100%;background:linear-gradient(90deg,#ff3366,#00d4ff);border-radius:2px;"></div>
                    </div>
                </div>`).join('')
            : '<span style="color:var(--text-muted);font-size:0.88rem;">' + t('noGenres') + '</span>';
    }

    // Son başarımlar
    const recentAch = document.getElementById('recentAchievements');
    if (recentAch) {
        const achList = typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS : [];
        const unlocked = achList.filter(a => (d.achievements || []).includes(a.id)).slice(-4).reverse();
        recentAch.innerHTML = unlocked.length > 0
            ? unlocked.map(a => `
                <div class="ach-mini">
                    <span class="ach-mini-icon">${a.icon}</span>
                    <div style="flex:1;min-width:0;">
                        <div class="ach-mini-name">${a.title}</div>
                    </div>
                    ${a.xp > 0 ? '<span class="ach-mini-xp">+' + a.xp + ' XP</span>' : ''}
                </div>`).join('')
            : '<div style="color:var(--text-muted);font-size:0.88rem;">' + t('noAchievements') + '</div>';
    }
}

// ===== EDIT PROFILE =====
function editProfile() {
    if (!dataManager.data) return;
    const d = dataManager.data.social;
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

    document.getElementById('editUsername').value = d.name || '';
    document.getElementById('editBio').value = d.bio || '';
    document.getElementById('selectedAvatar').value = d.avatar || '👤';
    document.getElementById('selectedCoverColor').value = d.cover || 'gradient1';

    // Önizlemeyi güncelle
    _applyAvatar('avatarPreview', d);

    document.querySelectorAll('.avatar-option').forEach(btn =>
        btn.classList.toggle('selected', btn.textContent.trim() === (d.avatar || '👤'))
    );
    document.querySelectorAll('.cc-opt').forEach(opt =>
        opt.classList.toggle('selected', opt.dataset.color === (d.cover || 'gradient1'))
    );

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

function saveProfile(event) {
    event.preventDefault();
    if (!dataManager.data) return;

    dataManager.data.social.name   = document.getElementById('editUsername').value.trim();
    dataManager.data.social.bio    = document.getElementById('editBio').value.trim();
    dataManager.data.social.avatar = document.getElementById('selectedAvatar').value;
    dataManager.data.social.cover  = document.getElementById('selectedCoverColor').value;
    // avatarUrl modal içinde doğrudan set edildi, dokunmuyoruz

    dataManager.saveAll();
    closeEditProfile();
    renderProfilePage();
    updateHeaderUser();
    showNotification('Profil güncellendi ✓', 'success');
}

function selectAvatar(emoji) {
    document.getElementById('selectedAvatar').value = emoji;
    document.querySelectorAll('.avatar-option').forEach(btn =>
        btn.classList.toggle('selected', btn.textContent.trim() === emoji)
    );
    // Emoji seçilince fotoğrafı kaldır
    if (dataManager.data) dataManager.data.social.avatarUrl = null;
    _applyAvatar('avatarPreview', { avatar: emoji, avatarUrl: null });
}

function selectCoverColor(color) {
    document.getElementById('selectedCoverColor').value = color;
    document.querySelectorAll('.cc-opt').forEach(opt =>
        opt.classList.toggle('selected', opt.dataset.color === color)
    );
}

// ===== FOTOĞRAF YÜKLEME =====
function triggerAvatarUpload() {
    document.getElementById('avatarFileInput')?.click();
}

function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showNotification('Lütfen bir görsel dosyası seçin', 'error');
        return;
    }
    if (file.size > 3 * 1024 * 1024) {
        showNotification("Görsel 3MB'den küçük olmalı", 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // 300x300 max, JPEG 0.85 kalite
            const canvas = document.createElement('canvas');
            const max = 300;
            const ratio = Math.min(max / img.width, max / img.height);
            canvas.width  = Math.round(img.width  * ratio);
            canvas.height = Math.round(img.height * ratio);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

            // Önizle
            _applyAvatar('avatarPreview', { avatarUrl: dataUrl });

            // Kaydet (saveProfile'da da korunacak)
            if (dataManager.data) dataManager.data.social.avatarUrl = dataUrl;

            // Emoji seçimini temizle
            document.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
            showNotification('Fotoğraf yüklendi ✓', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function removeAvatarPhoto() {
    if (dataManager.data) dataManager.data.social.avatarUrl = null;
    const emoji = document.getElementById('selectedAvatar')?.value || '👤';
    _applyAvatar('avatarPreview', { avatar: emoji, avatarUrl: null });
    showNotification('Fotoğraf kaldırıldı', 'info');
}

// ===== ACHIEVEMENTS =====
function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container || !dataManager.data) return;
    const unlocked = dataManager.data.achievements;

    container.innerHTML = ACHIEVEMENTS.map(ach => {
        const done = unlocked.includes(ach.id);
        return `<div class="ach-card${done ? ' unlocked' : ''}" style="${!done ? 'opacity:.55;filter:grayscale(.5);' : ''}">
            <div class="ach-icon${done ? ' unlocked-icon' : ''}">${ach.icon}</div>
            <div class="ach-info">
                <div class="ach-title">${ach.title}</div>
                <div class="ach-desc">${ach.desc}</div>
                ${ach.xp > 0 ? `<div class="ach-xp">+${ach.xp} XP</div>` : ''}
            </div>
            <div class="ach-status ${done ? 'done' : 'locked'}">${done ? '✓' : '🔒'}</div>
        </div>`;
    }).join('');
}

// ===== ANALYTICS =====
function renderAnalytics() {
    const container = document.getElementById('analyticsGrid');
    if (!container || !dataManager.data) return;
    const items = dataManager.data.items;
    const total = Math.max(items.length, 1);

    const anime      = items.filter(i => i.type === 'anime').length;
    const manga      = items.filter(i => i.type === 'manga').length;
    const webtoon    = items.filter(i => i.type === 'webtoon').length;
    const completed  = items.filter(i => i.status === 'completed').length;
    const watching   = items.filter(i => i.status === 'watching').length;
    const planToWatch= items.filter(i => i.status === 'plantowatch').length;
    const dropped    = items.filter(i => i.status === 'dropped').length;
    const rated      = items.filter(i => i.rating > 0);
    const avg = rated.length > 0 ? (rated.reduce((a, i) => a + i.rating, 0) / rated.length).toFixed(2) : '0.00';

    const bar = (label, val, tot, color) =>
        `<div class="bar-row">
            <div class="bar-header"><span>${label}</span><span style="font-weight:700;">${val}</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${(val/tot*100).toFixed(1)}%;background:${color};"></div></div>
        </div>`;

    container.innerHTML =
        `<div class="chart-container"><h3 class="chart-title">${t('categoryDist')}</h3>
            ${bar('🎬 Anime', anime, total, 'var(--accent-primary)')}
            ${bar('📖 Manga', manga, total, 'var(--accent-secondary)')}
            ${bar('📱 Webtoon', webtoon, total, 'var(--accent-tertiary)')}
        </div>
        <div class="chart-container"><h3 class="chart-title">${t('statusDist')}</h3>
            ${bar('✅ '+t('completed'), completed, total, '#10b981')}
            ${bar('▶️ '+t('watching'), watching, total, '#3b82f6')}
            ${bar('📋 '+t('plantowatch'), planToWatch, total, '#f59e0b')}
            ${bar('❌ '+t('dropped'), dropped, total, '#ef4444')}
        </div>
        <div class="chart-container" style="text-align:center;"><h3 class="chart-title">${t('avgScore')}</h3>
            <div style="font-size:4rem;font-weight:700;background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:1rem 0;">${avg}</div>
            <p style="color:var(--text-secondary);">${t('outOf5')} · ${rated.length} ${t('reviews')}</p>
        </div>
        <div class="chart-container"><h3 class="chart-title">${t('summary')}</h3>
            <div style="display:grid;gap:.8rem;">
                ${[
                    [t('totalContent'), items.length],
                    [t('streakLabel'), (dataManager.data.streak.count||0) + (_lang==='en'?' days':' gün')],
                    [t('longestStreak'), (dataManager.data.streak.longest||0) + (_lang==='en'?' days':' gün')]
                ].map(([l,v]) =>
                    `<div style="display:flex;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--border);">
                        <span style="color:var(--text-secondary);">${l}</span><strong>${v}</strong>
                    </div>`
                ).join('')}
            </div>
        </div>`;
}

// ===== CALENDAR =====
const ANILIST_CALENDAR_GQL = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    airingSchedules(notYetAired: false, sort: TIME_DESC) {
      id
      episode
      airingAt
      media {
        id
        title { romaji english native }
        coverImage { medium color }
        averageScore
        popularity
        genres
        status
        episodes
        format
        season
        seasonYear
        nextAiringEpisode { episode timeUntilAiring }
      }
    }
  }
}`;

async function _fetchAniListCalendar() {
    const cacheKey = 'cal_anilist_v2';
    const cached = APICache.get(cacheKey);
    if (cached) return cached;

    try {
        // Birden fazla sayfa çekiyoruz - daha kapsamlı veri
        const [r1, r2] = await Promise.all([
            fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ query: ANILIST_CALENDAR_GQL, variables: { page: 1, perPage: 50 } })
            }),
            fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ query: ANILIST_CALENDAR_GQL, variables: { page: 2, perPage: 50 } })
            })
        ]);

        const [j1, j2] = await Promise.all([r1.json(), r2.json()]);
        const schedules = [
            ...(j1?.data?.Page?.airingSchedules || []),
            ...(j2?.data?.Page?.airingSchedules || [])
        ];

        // Gün bazında grupla (0=Pazar...6=Cumartesi → biz Pzt-Pzr sırasına çevireceğiz)
        const byDay = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] };
        const seen  = new Set();

        schedules.forEach(s => {
            const media = s.media;
            if (!media || !media.title) return;
            const id   = media.id;
            if (seen.has(id)) return;
            seen.add(id);

            const day = new Date(s.airingAt * 1000).getDay(); // 0=Sun
            byDay[day].push({
                id,
                name:       media.title.romaji || media.title.english || '?',
                nameEn:     media.title.english,
                score:      media.averageScore ? (media.averageScore / 10).toFixed(1) : null,
                popularity: media.popularity || 0,
                genres:     (media.genres || []).slice(0, 2),
                episode:    s.episode,
                totalEps:   media.episodes,
                cover:      media.coverImage?.medium,
                color:      media.coverImage?.color,
                format:     media.format,
                status:     media.status,
            });
        });

        // Her gündeki listeyi popülariteye göre sırala
        Object.values(byDay).forEach(arr => arr.sort((a, b) => b.popularity - a.popularity));

        APICache.set(cacheKey, byDay);
        return byDay;
    } catch(e) {
        console.warn('AniList Calendar error:', e.message);
        return null;
    }
}

async function renderCalendar() {
    const container = document.getElementById('weekdaysContainer');
    if (!container || !dataManager.data) return;

    const dayNames = t('days'); // ['Pazartesi',...] or ['Monday',...]
    // JS getDay(): 0=Sun,1=Mon...6=Sat → dayJS dizi sırası Pzt=1..Pzr=0
    const dayJS = [1, 2, 3, 4, 5, 6, 0];
    const myNames = new Set(dataManager.data.items.map(i => (i.name || '').toLowerCase()));

    container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">
            <div style="font-size:2rem;margin-bottom:.5rem;">📡</div>
            <div>${t('calLoading')}</div>
        </div>`;

    const byDay = await _fetchAniListCalendar();

    if (!byDay) {
        // Fallback: kütüphanedeki izleniyor içerikleri göster
        const watching = dataManager.data.items.filter(i => i.status === 'watching');
        container.innerHTML = dayNames.map((day, idx) => {
            const items = watching.filter((_, i) => i % 7 === idx);
            return `<div class="weekday">
                <div class="weekday-name">${day}</div>
                ${items.length
                    ? items.map(i => `
                        <div class="cal-item my-lib">
                            <span class="cal-item-icon">${getTypeIcon(i.type)}</span>
                            <span class="cal-item-name">${i.name || ''}</span>
                        </div>`).join('')
                    : '<div class="cal-empty">—</div>'}
            </div>`;
        }).join('');

        // Fallback CSS
        _injectCalendarStyles();
        return;
    }

    _injectCalendarStyles();

    container.innerHTML = dayNames.map((dayName, idx) => {
        const jsDay  = dayJS[idx];
        const animes = (byDay[jsDay] || []).slice(0, 10);
        const isToday = (new Date().getDay() === jsDay);

        const rows = animes.length
            ? animes.map(a => {
                const inLib  = myNames.has(a.name.toLowerCase()) || (a.nameEn && myNames.has(a.nameEn.toLowerCase()));
                const scoreColor = a.score >= 8 ? '#10b981' : a.score >= 6 ? '#f59e0b' : '#ef4444';
                const accentColor = a.color || (inLib ? '#10b981' : '#ff3366');

                return `<div class="cal-item${inLib ? ' my-lib' : ''}" 
                    style="border-left:2px solid ${inLib ? '#10b981' : accentColor}22;"
                    title="${(a.name || '')} — Ep.${a.episode}${a.totalEps ? '/' + a.totalEps : ''}">
                    ${a.cover
                        ? `<img class="cal-cover" src="${a.cover}" alt="" loading="lazy" onerror="this.style.display='none'">`
                        : `<div class="cal-cover-fallback">🎬</div>`}
                    <div class="cal-item-info">
                        <div class="cal-item-name" style="color:${inLib ? '#10b981' : 'inherit'};">
                            ${inLib ? '✅ ' : ''}${a.name}
                        </div>
                        <div class="cal-item-meta">
                            <span class="cal-ep">Ep.${a.episode}${a.totalEps ? '/' + a.totalEps : ''}</span>
                            ${a.score ? `<span class="cal-score" style="color:${scoreColor};">★${a.score}</span>` : ''}
                            ${a.genres.length ? `<span class="cal-genre">${a.genres[0]}</span>` : ''}
                        </div>
                    </div>
                </div>`;
            }).join('')
            : `<div class="cal-empty">—</div>`;

        return `<div class="weekday${isToday ? ' today-col' : ''}">
            <div class="weekday-name">${dayName}${isToday ? ' <span class="today-dot">●</span>' : ''}</div>
            <div class="weekday-count">${animes.length} anime</div>
            ${rows}
            ${(byDay[jsDay] || []).length > 10
                ? `<div class="cal-more">+${(byDay[jsDay] || []).length - 10} daha…</div>`
                : ''}
        </div>`;
    }).join('');
}

function _injectCalendarStyles() {
    if (document.getElementById('calendarStylesV2')) return;
    const s = document.createElement('style');
    s.id = 'calendarStylesV2';
    s.textContent = `
        #weekdaysContainer {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.6rem;
            align-items: start;
        }
        @media (max-width: 900px) {
            #weekdaysContainer { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 600px) {
            #weekdaysContainer { grid-template-columns: repeat(2, 1fr); }
        }
        .weekday {
            background: var(--bg-card, #141824);
            border: 1px solid var(--border, rgba(255,255,255,.08));
            border-radius: 14px;
            padding: 0.7rem;
            min-height: 120px;
        }
        .today-col {
            border-color: rgba(255,51,102,.45);
            background: rgba(255,51,102,.04);
        }
        .weekday-name {
            font-size: .78rem;
            font-weight: 800;
            letter-spacing: .5px;
            text-transform: uppercase;
            color: var(--text-secondary, #8892a4);
            margin-bottom: .2rem;
            display: flex;
            align-items: center;
            gap: .3rem;
        }
        .today-dot { color: #ff3366; font-size: .6rem; animation: pulse 2s infinite; }
        .weekday-count {
            font-size: .65rem;
            color: var(--text-muted, #4b5563);
            margin-bottom: .5rem;
        }
        .cal-item {
            display: flex;
            align-items: center;
            gap: .4rem;
            padding: .3rem .35rem;
            border-radius: 7px;
            margin-bottom: .22rem;
            background: rgba(255,255,255,.03);
            border-left: 2px solid rgba(255,255,255,.05);
            transition: background .15s;
            cursor: default;
        }
        .cal-item:hover { background: rgba(255,255,255,.07); }
        .cal-item.my-lib { background: rgba(16,185,129,.07); }
        .cal-cover {
            width: 28px;
            height: 38px;
            border-radius: 4px;
            object-fit: cover;
            flex-shrink: 0;
        }
        .cal-cover-fallback {
            width: 28px; height: 38px;
            border-radius: 4px;
            background: rgba(255,255,255,.05);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: .9rem;
            flex-shrink: 0;
        }
        .cal-item-info { flex: 1; min-width: 0; }
        .cal-item-name {
            font-size: .72rem;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 1.3;
        }
        .cal-item-meta {
            display: flex;
            align-items: center;
            gap: .3rem;
            margin-top: .1rem;
            flex-wrap: wrap;
        }
        .cal-ep    { font-size: .62rem; color: var(--text-muted, #4b5563); }
        .cal-score { font-size: .62rem; font-weight: 700; }
        .cal-genre {
            font-size: .58rem;
            background: rgba(255,255,255,.06);
            padding: 1px 5px;
            border-radius: 3px;
            color: var(--text-secondary, #8892a4);
        }
        .cal-empty { font-size: .78rem; color: var(--text-muted, #4b5563); padding: .3rem 0; text-align: center; }
        .cal-more  { font-size: .65rem; color: var(--accent-primary, #ff3366); text-align: center; padding: .2rem 0; opacity: .7; }
        .cal-item-icon { font-size: .9rem; flex-shrink: 0; }
    `;
    document.head.appendChild(s);
}

async function syncCalendar() {
    APICache.clear('cal_anilist_v2');
    APICache.clear('cal_schedule'); // eski cache'i de temizle
    showNotification(_lang === 'en' ? 'Syncing calendar... 📡' : 'Takvim güncelleniyor... 📡', 'info');
    await renderCalendar();
    showNotification(t('calSynced'), 'success');
}

// ===== AI =====
function renderAISection() {
    if (!dataManager.data) return;
    const items = dataManager.data.items;
    const rated = items.filter(i => i.rating > 0);
    const avg   = rated.length > 0 ? (rated.reduce((a, i) => a + i.rating, 0) / rated.length).toFixed(1) : '-';

    const genres = {};
    items.forEach(i => { if (i.genre) genres[i.genre] = (genres[i.genre] || 0) + 1; });
    const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('aiWatchingPattern', items.filter(i => i.status === 'watching').length + (_lang==='en'?' active':' aktif'));
    set('aiFavoriteGenres', topGenre);
    set('aiAvgRating', avg);

    generateAIRecommendations();
}

let _aiRetryCount = 0;
function generateAIRecommendations() {
    if (!allContent || allContent.length === 0) {
        if (_aiRetryCount >= 5) {
            _aiRetryCount = 0;
            showNotification(_lang==='en'?'Could not load content. Please refresh.':'İçerik yüklenemedi. Sayfayı yenileyin.', 'error');
            return;
        }
        _aiRetryCount++;
        showNotification(_lang==='en'?'Loading content, please wait...':'İçerikler yükleniyor, lütfen bekleyin...', 'info');
        setTimeout(generateAIRecommendations, 3000);
        return;
    }
    _aiRetryCount = 0;

    const myItems = dataManager.data?.items || [];
    const myNames = myItems.map(i => (i.name || '').toLowerCase());

    const genreScores = {};
    myItems.forEach(i => {
        if (i.genre) {
            if (!genreScores[i.genre]) genreScores[i.genre] = { count:0, total:0 };
            genreScores[i.genre].count++;
            genreScores[i.genre].total += (i.rating || 3);
        }
    });
    const topGenres = Object.entries(genreScores)
        .sort((a,b) => (b[1].total/b[1].count) - (a[1].total/a[1].count))
        .slice(0,4).map(e=>e[0]);

    let recs = allContent
        .filter(i => !myNames.includes((i.name||'').toLowerCase()))
        .filter(i => i.rating && i.rating >= 7.5)
        .map(item => {
            let score = item.rating || 0;
            if (topGenres.length > 0) {
                const match = (item.genres || []).filter(g => topGenres.includes(g)).length;
                score += match * 1.5;
            }
            return { ...item, _score: score };
        })
        .sort((a,b) => b._score - a._score);

    renderMediaRow('aiRecommendations', recs.slice(0,10));
    renderMediaRow('aiSimilarRecommendations', recs.slice(10,20));
    _renderAIAnalysisCard(myItems, topGenres);
    showNotification(t('aiUpdated'), 'success');
}

function _renderAIAnalysisCard(myItems, topGenres) {
    if (!document.getElementById('aiAnalysisCard')) {
        const section = document.querySelector('#aiSection .ai-recs-section');
        if (section) {
            section.insertAdjacentHTML('beforebegin',
                `<div id="aiAnalysisCard" style="background:rgba(255,51,102,.06);border:1px solid rgba(255,51,102,.2);border-radius:16px;padding:1.2rem 1.4rem;margin-bottom:1.5rem;">
                <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.7rem;">
                    <span style="font-size:1.1rem;">🤖</span>
                    <strong style="font-size:.95rem;">${_lang==='en'?'Your Taste Analysis':'Zevk Analizin'}</strong>
                </div>
                <div id="aiAnalysisText" style="color:var(--text-secondary);font-size:.88rem;line-height:1.7;"></div>
                </div>`
            );
        }
    }
    const el = document.getElementById('aiAnalysisText');
    if (!el) return;

    if (myItems.length === 0) {
        el.textContent = _lang==='en'
            ? 'Add items to your library to see your personalized analysis! 🌟'
            : 'Kütüphanene içerik ekledikçe sana özel analiz burada görünecek! 🌟';
        return;
    }

    const completed = myItems.filter(i=>i.status==='completed').length;
    const rated     = myItems.filter(i=>i.rating>0);
    const avg       = rated.length>0 ? (rated.reduce((a,i)=>a+i.rating,0)/rated.length).toFixed(1) : null;
    const topFav    = myItems.filter(i=>i.rating>=5).map(i=>i.name).slice(0,2);
    const total     = myItems.length;

    let text = '';
    if (_lang === 'en') {
        if (topGenres.length>0) { text+=`You seem to love ${topGenres[0]}`; if(topGenres[1]) text+=` and ${topGenres[1]}`; text+='. '; }
        if (topFav.length>0) text+=`You gave 5 stars to ${topFav.join(' and ')}. `;
        if (avg) {
            const n=parseFloat(avg);
            if(n>=4) text+='You have high standards! ';
            else if(n>=3) text+='You give balanced ratings. ';
            else text+="You're still exploring — try more titles! ";
        }
        if (completed>0&&total>0) {
            const rate=Math.round(completed/total*100);
            if(rate>=70) text+=`You finish ${rate}% of what you start — very dedicated! `;
            else if(rate>=40) text+=`Your completion rate is ${rate}%. `;
        }
        if (topGenres.length>0) text+=`Recs below are sorted by your ${topGenres.slice(0,2).join(' & ')} taste.`;
        else text+='Rate more titles to personalize your recs.';
    } else {
        if (topGenres.length>0) { text+=topGenres[0]+' türünü çok sevdiğin anlaşılıyor'; if(topGenres[1]) text+=', '+topGenres[1]+' de favorilerin arasında'; text+='. '; }
        if (topFav.length>0) text+=topFav.join(' ve ')+' için 5 yıldız verdin. ';
        if (avg) {
            const n=parseFloat(avg);
            if(n>=4) text+='Yüksek standartların var. ';
            else if(n>=3) text+='Dengeli değerlendirme yapıyorsun. ';
            else text+='Henüz keşif aşamandasın. ';
        }
        if (completed>0&&total>0) {
            const rate=Math.round(completed/total*100);
            if(rate>=70) text+=`Başladıklarının %${rate}'ini bitiriyorsun. `;
        }
        if (topGenres.length>0) text+=`Öneriler ${topGenres.slice(0,2).join(' ve ')} zevkine göre sıralandı.`;
        else text+='İçeriklere puan verdikçe öneriler daha kişisel olacak.';
    }
    el.textContent = text;
}

function refreshAIAnalysis() { renderAISection(); }

// ===== SOCIAL =====
function shareProfile() { copyProfileLink(); }

function shareToTwitter() {
    if (!dataManager.data) return;
    const count = dataManager.data.items.length;
    const text = _lang==='en'
        ? `Tracking ${count} titles on TobiList! 🎌\n#TobiList #Anime`
        : `TobiList'te ${count} içerik takip ediyorum! 🎌\n#TobiList #Anime`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
}

function copyProfileLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showNotification(t('profileLink'), 'success'))
        .catch(() => showNotification(t('profileLinkFail'), 'error'));
}

// ===== EXPORT / IMPORT =====
function exportData(format) {
    if (!dataManager.data) { showNotification(_lang==='en'?'No data to export!':'Dışa aktarılacak veri yok!', 'error'); return; }
    const content = format === 'json' ? dataManager.exportJSON() : dataManager.exportCSV();
    const type    = format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;';
    const blob    = new Blob([content], { type });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href = url;
    a.download = 'tobilist-' + Date.now() + '.' + format;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(t('exportedMsg'), 'success');
}

function importData() {
    const inp = document.getElementById('importInput');
    if (inp) inp.click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        if (isGuest || !dataManager.data) {
            showNotification(t('importLoginRequired'), 'error');
            return;
        }
        if (dataManager.importData(e.target.result)) {
            filterItems(); updateStats(); checkAchievements();
            showNotification(t('importedMsg'), 'success');
        } else {
            showNotification(t('importFailMsg'), 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

console.log('✅ UI.js v6.0 - Full EN/TR support loaded');