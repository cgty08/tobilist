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
            <div class="item-poster">
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
function renderProfilePage() {
    if (!dataManager.data || !currentUser) return;
    const d = dataManager.data;
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };

    set('profileUsername', d.social.name || currentUser.displayName || t('profileTitle'));
    set('profileEmailDisplay', currentUser.email || '');
    set('profileBioText', d.social.bio || t('bioDefault'));

    const avatar = document.getElementById('profileAvatarLarge');
    if (avatar) avatar.textContent = d.social.avatar || '👤';

    const cover = document.getElementById('profileCoverBg');
    if (cover) {
        const covers = {
            gradient1: 'linear-gradient(135deg,#ff3366,#7c3aed)',
            gradient2: 'linear-gradient(135deg,#00d4ff,#0ea5e9)',
            gradient3: 'linear-gradient(135deg,#10b981,#059669)',
            gradient4: 'linear-gradient(135deg,#f59e0b,#ef4444)',
            gradient5: 'linear-gradient(135deg,#8b5cf6,#ec4899)'
        };
        cover.style.background = covers[d.social.cover || 'gradient1'];
    }

    updateStats();
    xpSystem.updateUI();

    // Recent activity
    const actList = document.getElementById('activityList');
    if (actList) {
        const recent = d.items.slice(0, 5);
        if (recent.length === 0) {
            actList.innerHTML = `<div style="color:var(--text-muted);font-size:0.9rem;padding:0.5rem;">${t('noActivity')}</div>`;
        } else {
            actList.innerHTML = recent.map(i =>
                `<div class="activity-item">
                    <div class="activity-icon">${getTypeIcon(i.type)}</div>
                    <div><strong>${i.name || ''}</strong>
                    <div class="activity-time">${_lang === 'en' ? 'Added' : 'Eklendi'}</div></div>
                </div>`
            ).join('');
        }
    }

    // Favorite genres
    const genres = {};
    d.items.forEach(i => { if (i.genre) genres[i.genre] = (genres[i.genre] || 0) + 1; });
    const favGenres = document.getElementById('favoriteGenres');
    if (favGenres) {
        const sorted = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 5);
        favGenres.innerHTML = sorted.length > 0
            ? sorted.map(([g, c]) => `<span class="genre-chip">${g} (${c})</span>`).join('')
            : `<div style="color:var(--text-muted);font-size:0.9rem;">${t('noGenres')}</div>`;
    }

    // Recent achievements
    const recentAch = document.getElementById('recentAchievements');
    if (recentAch) {
        const unlocked = ACHIEVEMENTS.filter(a => d.achievements.includes(a.id)).slice(0, 3);
        recentAch.innerHTML = unlocked.length > 0
            ? unlocked.map(a =>
                `<div class="ach-mini">
                    <span class="ach-mini-icon">${a.icon}</span>
                    <span class="ach-mini-name">${a.title}</span>
                    <span class="ach-mini-xp">+${a.xp} XP</span>
                </div>`).join('')
            : `<div style="color:var(--text-muted);font-size:0.9rem;">${t('noAchievements')}</div>`;
    }

    // Profile streaks
    set('profileStreakVal', d.streak?.longest || d.streak?.count || 0);
    set('profileXPTotal', d.xp?.total || 0);
}

// ===== EDIT PROFILE =====
function editProfile() {
    if (!dataManager.data) return;
    const d = dataManager.data.social;
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

    const eu = document.getElementById('editUsername');
    const eb = document.getElementById('editBio');
    const sa = document.getElementById('selectedAvatar');
    const sc = document.getElementById('selectedCoverColor');

    if (eu) eu.value = d.name || '';
    if (eb) eb.value = d.bio || '';
    if (sa) sa.value = d.avatar || '👤';
    if (sc) sc.value = d.cover || 'gradient1';

    document.querySelectorAll('.avatar-option').forEach(btn =>
        btn.classList.toggle('selected', btn.textContent === (d.avatar || '👤'))
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

    const eu = document.getElementById('editUsername');
    const eb = document.getElementById('editBio');
    const sa = document.getElementById('selectedAvatar');
    const sc = document.getElementById('selectedCoverColor');

    dataManager.data.social.name   = eu ? eu.value.trim() : '';
    dataManager.data.social.bio    = eb ? eb.value.trim() : '';
    dataManager.data.social.avatar = sa ? sa.value : '👤';
    dataManager.data.social.cover  = sc ? sc.value : 'gradient1';

    dataManager.saveAll(); // FIX: saves to both localStorage + Supabase
    closeEditProfile();
    renderProfilePage();
    updateHeaderUser();
    showNotification(t('profileUpdated'), 'success');
}

function selectAvatar(emoji) {
    const sa = document.getElementById('selectedAvatar');
    if (sa) sa.value = emoji;
    document.querySelectorAll('.avatar-option').forEach(btn =>
        btn.classList.toggle('selected', btn.textContent === emoji)
    );
}

function selectCoverColor(color) {
    const sc = document.getElementById('selectedCoverColor');
    if (sc) sc.value = color;
    document.querySelectorAll('.cc-opt').forEach(opt =>
        opt.classList.toggle('selected', opt.dataset.color === color)
    );
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
async function _fetchCalendarData() {
    const cached = APICache.get('cal_schedule');
    if (cached) return cached;

    const gql = `{Page(page:1,perPage:50){airingSchedules(notYetAired:false,sort:TIME_DESC){episode airingAt media{id title{romaji english}averageScore}}}}`;
    try {
        const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: gql })
        });
        if (!res.ok) throw new Error('AniList ' + res.status);
        const json = await res.json();
        const schedules = json?.data?.Page?.airingSchedules || [];

        const byDay = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
        schedules.forEach(s => {
            const day  = new Date(s.airingAt * 1000).getDay();
            const name = s.media?.title?.romaji || s.media?.title?.english || '';
            const score= s.media?.averageScore ? (s.media.averageScore/10).toFixed(1) : null;
            if (name && !byDay[day].find(e => e.name === name))
                byDay[day].push({ name, score, ep: s.episode });
        });

        APICache.set('cal_schedule', byDay);
        return byDay;
    } catch(e) {
        console.warn('Calendar API error:', e.message);
        return null;
    }
}

async function renderCalendar() {
    const container = document.getElementById('weekdaysContainer');
    if (!container || !dataManager.data) return;

    const dayNames = t('days'); // TR or EN days array
    const dayJS    = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun
    const myNames  = dataManager.data.items.map(i => (i.name || '').toLowerCase());

    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted);">${t('calLoading')}</div>`;

    const byDay = await _fetchCalendarData();

    if (!byDay) {
        const watching = dataManager.data.items.filter(i => i.status === 'watching');
        container.innerHTML = dayNames.map((day, idx) => {
            const items = watching.filter((_, i) => i % 7 === idx);
            return `<div class="weekday"><div class="weekday-name">${day}</div>
                ${items.length
                    ? items.map(i => `<div style="font-size:.8rem;padding:.3rem 0;border-bottom:1px solid var(--border);">${getTypeIcon(i.type)} ${i.name||''}</div>`).join('')
                    : `<div style="color:var(--text-muted);font-size:.8rem;">—</div>`}
            </div>`;
        }).join('');
        return;
    }

    container.innerHTML = dayNames.map((dayName, idx) => {
        const animes = (byDay[dayJS[idx]] || []).slice(0, 8);
        const rows = animes.length
            ? animes.map(a => {
                const inLib = myNames.includes(a.name.toLowerCase());
                return `<div style="font-size:.78rem;padding:.35rem .2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.3rem;${inLib?'color:#10b981;':''}">
                    ${inLib?'✅ ':'🎬 '}${a.name}
                    ${a.score?`<span style="margin-left:auto;font-size:.7rem;opacity:.6;">★${a.score}</span>`:''}
                </div>`;
            }).join('')
            : `<div style="color:var(--text-muted);font-size:.8rem;">—</div>`;
        return `<div class="weekday"><div class="weekday-name">${dayName}</div>${rows}</div>`;
    }).join('');
}

async function syncCalendar() {
    APICache.clear('cal_schedule');
    showNotification(_lang==='en'?'Syncing calendar... 📡':'Takvim güncelleniyor... 📡', 'info');
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

function generateAIRecommendations() {
    if (!allContent || allContent.length === 0) {
        showNotification(_lang==='en'?'Loading content, please wait...':'İçerikler yükleniyor, lütfen bekleyin...', 'info');
        setTimeout(generateAIRecommendations, 3000);
        return;
    }

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