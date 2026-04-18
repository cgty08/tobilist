// UI.JS v6.0 - Full TR/EN language support + bug fixes

// ===== XSS KORUMA YARDIMCISI =====
// Kullanicidan gelen tum metinler innerHTML'e girmeden once bu fonksiyondan gecmeli
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ===== TRANSLATIONS =====
const translations = {
    tr: {
        // NAV
        home: 'Ana Sayfa', library: 'Kütüphanem', discover: 'Keşfet',
        messages: 'Mesajlar',
        calendar: 'Takvim', analytics: 'Analitik', ai: 'AI Öneriler', achievements: 'Başarımlar',
        // HEADER / AUTH
        loginBtn: 'Giriş Yap', registerBtn: 'Kayıt Ol', logoutBtn: '🚪 Çıkış Yap',
        guestBannerText: 'Misafir modundasınız —', guestBannerSave: 'Kayıt ol veya giriş yap',
        guestBannerSub: ' ile listeni kaydet!',
        // BANNER
        bannerGreeting: 'Hoş geldiniz 👋',
        bannerTitle: 'Anime Dünyanı', bannerTitleSpan: 'Takip Et & Keşfet',
        bannerSub: '500+ anime, manga ve webtoon arasından seç. Listeni oluştur, puan ver, level atla.',
        bannerAddBtn: '✨ İçerik Ekle', bannerDiscoverBtn: '🔍 Keşfet',
        bannerRegisterBtn: '✨ Ücretsiz Kayıt Ol', bannerLoginBtn: 'Giriş Yap',
        heroChipAI: '🤖 AI Öneriler', heroChipXP: '🏆 XP Sistemi',
        heroChipCal: '📅 Yayın Takvimi', heroChipAnalytics: '📊 Analitik',
        heroXPLabel: 'Toplam XP', streakDaysLabel: 'gün',
        // PLATFORM STATS
        liveUsersLabel: 'Kayıtlı Kullanıcı', liveTotalLabel: 'Toplam Takip',
        liveCompletedLabel: 'Tamamlanan', liveXPLabel: 'XP Kazanıldı', liveContentLabel: 'İçerik',
        // HOME SECTION TITLES
        trendingMore: 'Tümünü Gör →', continueMore: 'Kütüphane →',
        seasonMore: 'Hepsi →', highRatedMore: 'AI Önerileri →',
        // QUICK STATS
        watchingStatCard: 'İzliyorum', completedStatCard: 'Tamamlandı',
        planToWatchStatCard: 'İzlenecek', onHoldStatCard: 'Beklemede',
        avgRatingCard: 'Ort. Puan', streakCard: 'Streak',
        // FEATURES
        featuresTitle: 'Neden', featuresTitleSpan: 'OniList?',
        featuresSub: 'Anime takibini bir üst seviyeye taşıyan özellikler',
        feat1Title: 'AI Öneri Motoru',
        feat1Desc: 'İzleme alışkanlıklarını analiz ederek sana özel anime ve manga önerileri üretir.',
        feat2Title: 'XP & Başarım Sistemi',
        feat2Desc: 'Her eklediğinde, tamamladığında ve puan verdiğinde XP kazan. Seviyeleri geç, rozetler topla.',
        feat3Title: 'Haftalık Yayın Takvimi',
        feat3Desc: 'Hangi anime hangi gün yayında? Canlı takvimle takipte kal, listendekiler otomatik işaretlenir.',
        feat4Title: 'Kişisel Analitik',
        feat4Desc: 'Kaç anime izledin, ortalama puanın ne? Detaylı grafiklerle izleme alışkanlıklarını keşfet.',
        feat5Title: 'Günlük Streak',
        feat5Desc: "Her gün giriş yap, streak'ini kır! 7 gün üst üste girişe bonus XP.",
        feat6Title: 'Import & Export',
        feat6Desc: 'Verilerini JSON veya CSV olarak indir. Başka platformlardan listenizi kolayca aktar.',
        // GUEST CTA
        guestCTATitle: 'Anime listenizi kaydedin!',
        guestCTASub: 'Ücretsiz hesap oluşturun, izlediklerinizi takip edin, puan verin ve kişisel istatistiklerinizi görün.',
        guestCTARegister: '✨ Ücretsiz Kayıt Ol', guestCTALogin: 'Giriş Yap',
        // DISCOVER
        discoverBadge: '🔥 500+ İçerik',
        discoverHeroTitle: 'Keşfet',
        discoverHeroSub: 'Anime, manga ve webtoon dünyasını keşfet. Favori serini bul.',
        discoverSearchPlaceholder: 'Anime, manga veya webtoon ara...',
        discoverAllTab: '✨ Tümü', discoverAnimeTab: '🎬 Anime',
        discoverMangaTab: '📖 Manga', discoverWebtoonTab: '📱 Webtoon',
        // GENRE FILTERS
        genreAll: 'Tümü', genreAction: '⚔️ Aksiyon', genreAdventure: '🗺️ Macera',
        genreComedy: '😂 Komedi', genreDrama: '🎭 Drama', genreFantasy: '🔮 Fantastik',
        genreRomance: '💕 Romantik', genreScifi: '🚀 Sci-Fi', genreHorror: '👻 Korku',
        genreMystery: '🔍 Gizem', genrePsych: '🧠 Psikolojik', genreSports: '⚽ Spor',
        // LIBRARY FILTERS
        allTypesOpt: 'Tüm Tipler', allStatusesOpt: 'Tüm Durumlar',
        statusWatching: '▶️ İzliyorum', statusCompleted: '✅ Tamamlandı',
        statusOnHold: '⏸️ Beklemede', statusPlan: '📋 İzlenecek', statusDropped: '❌ Bırakıldı',
        sortRecent: 'En Yeni', sortName: 'İsim (A-Z)', sortRating: 'Puan', sortProgress: 'İlerleme',
        // COMMUNITY
        commTitle: '🌍', commTitleSpan: 'Topluluk',
        commSub: 'OniList büyüyor — seninle büyüyor',
        leaderboardTitle: 'XP Liderler', leaderboardLoading: 'Yükleniyor...',
        leaderboardProfileBtn: 'Profilini Gör →',
        platformStatsTitle: 'Platform İstatistikleri',
        commUsersLabel: 'Toplam Kullanıcı', commAnimeLabel: 'Takip Edilen Anime',
        commCompletedLabel: 'Tamamlanan', commXPLabel: 'Toplam XP', commStreakLabel: 'En Uzun Streak',
        joinTitle: 'Topluluğa Katıl',
        joinSub: 'Anime severlerin buluşma noktası. Listeni oluştur, başarımlar kazan ve topluluğun parçası ol.',
        joinBtn: '✨ Ücretsiz Katıl', joinDiscoverBtn: '🔍 İçerikleri Keşfet',
        joinBadgeFree: 'Ücretsiz', joinBadgeSafe: 'Güvenli', joinBadgeMobile: 'Mobil Uyumlu',
        // FOOTER
        footerSub: 'Anime, Manga & Webtoon Takip Platformu · Ücretsiz · 2025',
        footerDiscover: 'Keşfet', footerRegister: 'Kayıt Ol', footerHome: 'Ana Sayfa',
        // PROFILE
        profileEditBtn: 'Profili Düzenle', profileShareBtn: 'Paylaş',
        profileMsgBoxBtn: 'Mesaj Kutusu',
        profileAvgRatingLabel: 'Ortalama Puan', profileCompletionRateLabel: 'Tamamlama Oranı', profileActivityLevelLabel: 'Aktivite Seviyesi',
        profileDiscoverUsersTitle: 'Kullanıcı Keşfet', profileRefreshBtn: 'Yenile',
        profileSearchUsersPlaceholder: 'Kullanıcı ara...', profilePrivateMessagesTitle: 'Özel Mesajlar',
        profilePhotoChangeTitle: 'Fotoğraf değiştir', profilePhotoUploadTitle: 'Fotoğraf yükle',
        profileCompletedLabel: 'Tamamlanan', profileXPLabel: 'Toplam XP', profileStreakLabel: 'En Uzun Seri',
        profileStatusTitle: 'İzleme Durumu', profileActivityTitle: 'Son Aktiviteler',
        profileFavGenresTitle: 'Favori Türler', profileAchievementsTitle: 'Son Başarımlar',
        profileExportTitle: 'Dışa Aktar',
        profileTwitterBtn: "Twitter'da Paylaş", profileCopyBtn: 'Linki Kopyala', profileJSONBtn: 'JSON İndir',
        profileStreakSuffix: 'gün serisi',
        messagesPageTitle: '💌 Özel Mesajlar', messagesPageSub: 'Bir kullanıcı seçin ve anında konuşmaya başlayın.',
        openPrivateInboxBtn: 'Özel Mesajlar',
        profileJoinedRecently: 'Yeni katıldı', profileUnknownUser: 'Kullanıcı',
        profileActivityNew: 'Yeni', profileActivityActive: 'Aktif', profileActivityHardcore: 'Hardcore',
        droppedLabel: 'Bırakıldı',
        memberViewProfileBtn: 'Profil', memberMessageBtn: 'Mesaj',
        dmSelectConversation: 'Bir konuşma seçin',
        dmComposePlaceholder: 'Mesaj yaz...', dmSendBtn: 'Gönder',
        dmLoading: 'Yükleniyor...', dmUserNotFound: 'Kullanıcı bulunamadı.',
        dmNoMessagesYet: 'Henüz mesaj yok.', dmStartConversationHint: 'Soldan bir kullanıcı seçip mesajlaşmaya başlayabilirsiniz.',
        dmSendFirstMessage: 'Henüz mesaj yok. İlk mesajı gönderin.',
        dmSignInRequired: 'Mesajlaşma için giriş yapın.',
        dmUnavailable: 'Özel mesajlaşma şu an kullanılamıyor.',
        dmServerConfigRequired: 'Sunucu tarafı ayarı gerekiyor: private_messages tablosu.',
        dmLoadFailed: 'Mesajlar yüklenemedi.', dmErrorPrefix: 'Hata: ',
        dmSelectUserAndType: 'Kullanıcı seçip mesaj yazın.',
        dmSendFailedPrefix: 'Mesaj gönderilemedi: ',
        profileDropdownItem: '👤 Profilim', settingsDropdownItem: '⚙️ Ayarlar',
        achievementsDropdownItem: '🏆 Başarımlar',
        // CALENDAR
        calendarSyncBtn: '🔄 Senkronize Et',
        calNoAiring: 'Bu gün yayın yok',
        calEpisodeCount: 'bölüm', calMoreEpisodes: 'bölüm daha…',
        calNoData: 'Bu hafta için yayın verisi bulunamadı.',
        calError: 'Takvim yüklenemedi. Lütfen tekrar deneyin.',
        // DETAIL PAGE
        dpBack: '🏠 Ana Sayfa', dpSynopsisTitle: '📖 Özet',
        dpReviewTitle: '✏️ Puan & Yorum', dpCommentsTitle: '💬 Yorumlar',
        dpInfoTitle: 'ℹ️ Bilgiler', dpSimilarTitle: '🎯 Benzer İçerikler',
        dpTypeLabel: 'Tür', dpRankLabel: 'Sıralama', dpMembersLabel: 'Üye',
        dpStudioLabel: 'Stüdyo', dpStatusLabel: 'Durum',
        dpAddToList: '+ Listeye Ekle', dpInList: '✓ Listende', dpBackBtn: '← Geri',
        dpRatingText: 'Puan seç', dpCommentPlaceholder: 'Düşüncelerini yaz (isteğe bağlı)...',
        dpSubmitReview: '💬 Yorumu Gönder', dpUpdateReview: '✏️ Yorumu Güncelle',
        dpSynopsisLoading: 'Açıklama yükleniyor...',
        dpCommentsCount: 'yorum',
        // SETTINGS
        settingsThemeTitle: '🎨 Tema',
        settingsDataTitle: '📤 Veri Yönetimi',
        settingsDataSub: 'Verilerinizi dışa aktarın veya içe aktarın',
        settingsNotifTitle: '🔔 Bildirimler',
        settingsNotifLabel: 'Push bildirimleri etkinleştir',
        settingsDangerTitle: '⚠️ Hesap İşlemleri',
        settingsDangerSub: 'Bu işlemler geri alınamaz.',
        settingsLogoutBtn: '🚪 Çıkış Yap', settingsDeleteBtn: '🗑️ Hesabı Sil',
        themeDark: 'Karanlık', themeLight: 'Aydınlık', themeNeon: 'Neon', themePastel: 'Pastel',
        // ADD MODAL
        addModalTitle: '✨ Yeni İçerik Ekle',
        addModalAPILabel: '🔍 Jikan API\'den Ara (opsiyonel)',
        addModalAPIPlaceholder: 'Anime veya manga adı yazın...',
        addModalNameLabel: 'İsim *', addModalNamePlaceholder: 'Anime / Manga adı',
        addModalTypeLabel: 'Tip *', addModalPosterLabel: 'Poster URL (opsiyonel)',
        addModalStatusLabel: 'Durum', addModalGenreLabel: 'Tür',
        addModalGenrePlaceholder: 'Örn: Action', addModalEpLabel: 'Bölüm Sayısı',
        addModalNotesLabel: 'Notlar', addModalNotesPlaceholder: 'Opsiyonel notlar...',
        addModalSubmitBtn: '✅ Ekle',
        // AI PAGE
        aiWatchingLabel: 'İzleme Paterni', aiFavGenreLabel: 'Favori Tür',
        aiAvgLabel: 'Ort. Puan', aiAccuracyLabel: 'AI Doğruluğu',
        aiNewRecsBtn: '✨ Yeni Öneriler Al', aiRefreshBtn: '🔄 Yenile',
        aiForYouTitle: '💎 Size Özel', aiSimilarTitle: '🎭 Beğendiklerinize Benzer',
        // LOADING
        loadingText: 'Yükleniyor...',
        offlineBanner: '⚠️ İnternet bağlantınız yok — Offline modda çalışıyorsunuz',
        installTitle: '📱 Uygulamayı Yükleyin', installSub: 'Cihazınıza ekleyin, offline kullanın!',
        installBtn: 'Yükle', installDismiss: 'Daha Sonra',
        // DROPDOWN
        addBtn: '+ Ekle',
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
        messages: 'Messages',
        calendar: 'Calendar', analytics: 'Analytics', ai: 'AI Recs', achievements: 'Achievements',
        // HEADER / AUTH
        loginBtn: 'Sign In', registerBtn: 'Sign Up', logoutBtn: '🚪 Sign Out',
        guestBannerText: 'You are in guest mode —', guestBannerSave: 'Sign up or sign in',
        guestBannerSub: ' to save your list!',
        // BANNER
        bannerGreeting: 'Welcome 👋',
        bannerTitle: 'Your Anime World', bannerTitleSpan: 'Track & Discover',
        bannerSub: 'Choose from 500+ anime, manga & webtoon. Build your list, rate, level up.',
        bannerAddBtn: '✨ Add Content', bannerDiscoverBtn: '🔍 Discover',
        bannerRegisterBtn: '✨ Sign Up Free', bannerLoginBtn: 'Sign In',
        heroChipAI: '🤖 AI Recs', heroChipXP: '🏆 XP System',
        heroChipCal: '📅 Airing Calendar', heroChipAnalytics: '📊 Analytics',
        heroXPLabel: 'Total XP', streakDaysLabel: 'days',
        // PLATFORM STATS
        liveUsersLabel: 'Users', liveTotalLabel: 'Total Tracking',
        liveCompletedLabel: 'Completed', liveXPLabel: 'XP Earned', liveContentLabel: 'Content',
        // HOME SECTION TITLES
        trendingMore: 'See All →', continueMore: 'Library →',
        seasonMore: 'All →', highRatedMore: 'AI Recs →',
        // QUICK STATS
        watchingStatCard: 'Watching', completedStatCard: 'Completed',
        planToWatchStatCard: 'Plan to Watch', onHoldStatCard: 'On Hold',
        avgRatingCard: 'Avg Rating', streakCard: 'Streak',
        // FEATURES
        featuresTitle: 'Why', featuresTitleSpan: 'OniList?',
        featuresSub: 'Features that take your anime tracking to the next level',
        feat1Title: 'AI Recommendation Engine',
        feat1Desc: 'Analyzes your watching habits to generate personalized anime and manga picks.',
        feat2Title: 'XP & Achievement System',
        feat2Desc: 'Earn XP every time you add, complete, or rate. Level up and collect badges.',
        feat3Title: 'Weekly Airing Calendar',
        feat3Desc: 'Which anime airs on which day? Stay on top with the live calendar, auto-marks your library.',
        feat4Title: 'Personal Analytics',
        feat4Desc: 'How many anime have you watched? Explore your habits with detailed charts.',
        feat5Title: 'Daily Streak',
        feat5Desc: 'Log in every day, keep your streak! Bonus XP for 7 consecutive days.',
        feat6Title: 'Import & Export',
        feat6Desc: 'Download your data as JSON or CSV. Easily import your list from other platforms.',
        // GUEST CTA
        guestCTATitle: 'Save your anime list!',
        guestCTASub: 'Create a free account, track what you watch, rate titles, and see your personal stats.',
        guestCTARegister: '✨ Sign Up Free', guestCTALogin: 'Sign In',
        // DISCOVER
        discoverBadge: '🔥 500+ Content',
        discoverHeroTitle: 'Discover',
        discoverHeroSub: 'Explore the world of anime, manga & webtoon. Find your next favorite.',
        discoverSearchPlaceholder: 'Search anime, manga or webtoon...',
        discoverAllTab: '✨ All', discoverAnimeTab: '🎬 Anime',
        discoverMangaTab: '📖 Manga', discoverWebtoonTab: '📱 Webtoon',
        // GENRE FILTERS
        genreAll: 'All', genreAction: 'Action', genreAdventure: 'Adventure',
        genreComedy: 'Comedy', genreDrama: 'Drama', genreFantasy: 'Fantasy',
        genreRomance: 'Romance', genreScifi: 'Sci-Fi', genreHorror: 'Horror',
        genreMystery: 'Mystery', genrePsych: 'Psychological', genreSports: 'Sports',
        // LIBRARY FILTERS
        allTypesOpt: 'All Types', allStatusesOpt: 'All Statuses',
        statusWatching: '▶️ Watching', statusCompleted: '✅ Completed',
        statusOnHold: '⏸️ On Hold', statusPlan: '📋 Plan to Watch', statusDropped: '❌ Dropped',
        sortRecent: 'Newest', sortName: 'Name (A-Z)', sortRating: 'Rating', sortProgress: 'Progress',
        // COMMUNITY
        commTitle: '🌍', commTitleSpan: 'Community',
        commSub: 'OniList is growing — growing with you',
        leaderboardTitle: 'XP Leaders', leaderboardLoading: 'Loading...',
        leaderboardProfileBtn: 'View Profile →',
        platformStatsTitle: 'Platform Statistics',
        commUsersLabel: 'Total Users', commAnimeLabel: 'Anime Tracked',
        commCompletedLabel: 'Completed', commXPLabel: 'Total XP', commStreakLabel: 'Longest Streak',
        joinTitle: 'Join the Community',
        joinSub: 'The meeting point of anime fans. Build your list, earn achievements and be part of the community.',
        joinBtn: '✨ Join Free', joinDiscoverBtn: '🔍 Explore Content',
        joinBadgeFree: 'Free', joinBadgeSafe: 'Secure', joinBadgeMobile: 'Mobile Friendly',
        // FOOTER
        footerSub: 'Anime, Manga & Webtoon Tracking Platform · Free · 2026',
        footerDiscover: 'Discover', footerRegister: 'Sign Up', footerHome: 'Home',
        // PROFILE
        profileEditBtn: 'Edit Profile', profileShareBtn: 'Share',
        profileMsgBoxBtn: 'Message Box',
        profileAvgRatingLabel: 'Average Rating', profileCompletionRateLabel: 'Completion Rate', profileActivityLevelLabel: 'Activity Level',
        profileDiscoverUsersTitle: 'Discover Members', profileRefreshBtn: 'Refresh',
        profileSearchUsersPlaceholder: 'Search users...', profilePrivateMessagesTitle: 'Private Messages',
        profilePhotoChangeTitle: 'Change photo', profilePhotoUploadTitle: 'Upload photo',
        profileCompletedLabel: 'Completed', profileXPLabel: 'Total XP', profileStreakLabel: 'Longest Streak',
        profileStatusTitle: 'Watch Status', profileActivityTitle: 'Recent Activity',
        profileFavGenresTitle: 'Favorite Genres', profileAchievementsTitle: 'Recent Achievements',
        profileExportTitle: 'Export',
        profileTwitterBtn: 'Share on Twitter', profileCopyBtn: 'Copy Link', profileJSONBtn: 'Download JSON',
        profileStreakSuffix: 'day streak',
        messagesPageTitle: '💌 Private Messages', messagesPageSub: 'Pick a user and start chatting instantly.',
        openPrivateInboxBtn: 'Private Inbox',
        profileJoinedRecently: 'Recently joined', profileUnknownUser: 'User',
        profileActivityNew: 'New', profileActivityActive: 'Active', profileActivityHardcore: 'Hardcore',
        droppedLabel: 'Dropped',
        memberViewProfileBtn: 'Profile', memberMessageBtn: 'Message',
        dmSelectConversation: 'Select a conversation',
        dmComposePlaceholder: 'Type a message...', dmSendBtn: 'Send',
        dmLoading: 'Loading...', dmUserNotFound: 'No users found.',
        dmNoMessagesYet: 'No messages yet.', dmStartConversationHint: 'Select a user on the left to start chatting.',
        dmSendFirstMessage: 'No messages yet. Send the first one.',
        dmSignInRequired: 'Sign in to use messaging.',
        dmUnavailable: 'Private messaging is currently unavailable.',
        dmServerConfigRequired: 'Server-side setup is required: private_messages table.',
        dmLoadFailed: 'Messages could not be loaded.', dmErrorPrefix: 'Error: ',
        dmSelectUserAndType: 'Select a user and type a message.',
        dmSendFailedPrefix: 'Message could not be sent: ',
        profileDropdownItem: '👤 My Profile', settingsDropdownItem: '⚙️ Settings',
        achievementsDropdownItem: '🏆 Achievements',
        // CALENDAR
        calendarSyncBtn: '🔄 Sync',
        calNoAiring: 'No airings today',
        calEpisodeCount: 'episodes', calMoreEpisodes: 'more episodes…',
        calNoData: 'No schedule data found for this week.',
        calError: 'Failed to load calendar. Please try again.',
        // DETAIL PAGE
        dpBack: '🏠 Home', dpSynopsisTitle: '📖 Synopsis',
        dpReviewTitle: '✏️ Rate & Review', dpCommentsTitle: '💬 Reviews',
        dpInfoTitle: 'ℹ️ Info', dpSimilarTitle: '🎯 Similar Content',
        dpTypeLabel: 'Type', dpRankLabel: 'Rank', dpMembersLabel: 'Members',
        dpStudioLabel: 'Studio', dpStatusLabel: 'Status',
        dpAddToList: '+ Add to List', dpInList: '✓ In Library', dpBackBtn: '← Back',
        dpRatingText: 'Select rating', dpCommentPlaceholder: 'Write your thoughts (optional)...',
        dpSubmitReview: '💬 Submit Review', dpUpdateReview: '✏️ Update Review',
        dpSynopsisLoading: 'Loading description...',
        dpCommentsCount: 'reviews',
        // SETTINGS
        settingsThemeTitle: '🎨 Theme',
        settingsDataTitle: '📤 Data Management',
        settingsDataSub: 'Export or import your data',
        settingsNotifTitle: '🔔 Notifications',
        settingsNotifLabel: 'Enable push notifications',
        settingsDangerTitle: '⚠️ Account Actions',
        settingsDangerSub: 'These actions cannot be undone.',
        settingsLogoutBtn: '🚪 Sign Out', settingsDeleteBtn: '🗑️ Delete Account',
        themeDark: 'Dark', themeLight: 'Light', themeNeon: 'Neon', themePastel: 'Pastel',
        // ADD MODAL
        addModalTitle: '✨ Add New Content',
        addModalAPILabel: '🔍 Search via Jikan API (optional)',
        addModalAPIPlaceholder: 'Type anime or manga title...',
        addModalNameLabel: 'Title *', addModalNamePlaceholder: 'Anime / Manga title',
        addModalTypeLabel: 'Type *', addModalPosterLabel: 'Poster URL (optional)',
        addModalStatusLabel: 'Status', addModalGenreLabel: 'Genre',
        addModalGenrePlaceholder: 'e.g. Action', addModalEpLabel: 'Episode Count',
        addModalNotesLabel: 'Notes', addModalNotesPlaceholder: 'Optional notes...',
        addModalSubmitBtn: '✅ Add',
        // AI PAGE
        aiWatchingLabel: 'Watching Pattern', aiFavGenreLabel: 'Fav. Genre',
        aiAvgLabel: 'Avg. Rating', aiAccuracyLabel: 'AI Accuracy',
        aiNewRecsBtn: '✨ Get New Recs', aiRefreshBtn: '🔄 Refresh',
        aiForYouTitle: '💎 For You', aiSimilarTitle: '🎭 Similar to What You Love',
        // LOADING
        loadingText: 'Loading...',
        offlineBanner: '⚠️ No internet connection — Working in offline mode',
        installTitle: '📱 Install App', installSub: 'Add to your device, use offline!',
        installBtn: 'Install', installDismiss: 'Later',
        // DROPDOWN
        addBtn: '+ Add',
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
let _lang = 'en';

function t(key) {
    return translations[_lang]?.[key] || translations['tr']?.[key] || key;
}

function getCurrentLang() { return _lang; }

// ===== LANGUAGE CHANGE =====
function changeLanguage() {
    const langSel = document.getElementById('languageSelect');
    _lang = langSel ? langSel.value : 'en';
    if (dataManager.data) {
        dataManager.data.settings.language = _lang;
        dataManager.saveAll();
    }
    applyLanguage();
}

function applyLanguage() {
    // Update html lang attribute
    const htmlEl = document.getElementById('htmlRoot') || document.documentElement;
    if (htmlEl) htmlEl.lang = _lang;

    // Nav tabs via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[_lang]?.[key]) el.textContent = translations[_lang][key];
    });

    // data-i18n-placeholder support
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[_lang]?.[key]) el.placeholder = translations[_lang][key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (translations[_lang]?.[key]) el.title = translations[_lang][key];
    });

    const set = (id, key) => { const e=document.getElementById(id); if(e) e.textContent=t(key); };
    const setHTML = (id, html) => { const e=document.getElementById(id); if(e) e.innerHTML=html; };
    const setAttr = (id, attr, key) => { const e=document.getElementById(id); if(e) e.setAttribute(attr, t(key)); };
    const setAll = (sel, key) => { document.querySelectorAll(sel).forEach(e => e.textContent = t(key)); };

    // ===== HEADER =====
    const guestLoginBtns = document.querySelectorAll('#guestHeaderBtns button');
    if (guestLoginBtns.length >= 2) {
        guestLoginBtns[0].textContent = t('loginBtn');
        guestLoginBtns[1].textContent = t('registerBtn');
    }

    // Streak badge days suffix
    const streakDaysEl = document.getElementById('streakDays');
    const streakBadgeEl = document.getElementById('streakBadge');
    if (streakDaysEl && streakBadgeEl) {
        const days = streakDaysEl.textContent;
        streakBadgeEl.innerHTML = '🔥 <strong id="streakDays">' + days + '</strong> ' + t('streakDaysLabel');
    }

    // Guest app banner
    const guestBanner = document.getElementById('guestAppBanner');
    if (guestBanner) {
        const bannerBtns = guestBanner.querySelectorAll('button');
        if (bannerBtns.length >= 2) {
            bannerBtns[0].textContent = t('registerBtn');
            bannerBtns[1].textContent = t('loginBtn');
        }
    }

    // ===== OFFLINE / INSTALL BANNERS =====
    const offlineEl = document.getElementById('offlineBanner');
    if (offlineEl) offlineEl.textContent = t('offlineBanner');
    const installTitleEl = document.querySelector('.install-title');
    if (installTitleEl) installTitleEl.textContent = t('installTitle');
    const installSubEl = document.querySelector('#installBanner > div > div:last-child');
    if (installSubEl) installSubEl.textContent = t('installSub');
    const installBtn = document.querySelector('.btn-install');
    if (installBtn) installBtn.textContent = t('installBtn');
    const dismissBtn = document.querySelector('.btn-dismiss');
    if (dismissBtn) dismissBtn.textContent = t('installDismiss');

    // ===== LOADING =====
    const loadingTextEl = document.querySelector('.loading-text');
    if (loadingTextEl) loadingTextEl.textContent = t('loadingText');

    // ===== HOME SECTION TITLES =====
    const trendingTitleEl = document.querySelector('#trendingGrid')?.closest('.home-section-block')?.querySelector('.sh-title');
    if (trendingTitleEl) trendingTitleEl.textContent = t('trending');
    const continueTitleEl = document.querySelector('#continueWatchingGrid')?.closest('.home-section-block')?.querySelector('.sh-title');
    if (continueTitleEl) continueTitleEl.textContent = t('continueWatching');
    const seasonTitleEl = document.querySelector('#seasonPopularGrid')?.closest('.home-section-block')?.querySelector('.sh-title');
    if (seasonTitleEl) seasonTitleEl.textContent = t('seasonal');
    const highRatedEl = document.querySelector('#homeRecommendationsGrid')?.closest('.home-section-block')?.querySelector('.sh-title');
    if (highRatedEl) highRatedEl.textContent = t('highRated');

    // More buttons in home
    const trendingMoreEl = document.querySelector('#trendingGrid')?.closest('.home-section-block')?.querySelector('.sh-more');
    if (trendingMoreEl) trendingMoreEl.textContent = t('trendingMore');
    const continueMoreEl = document.querySelector('#continueWatchingGrid')?.closest('.home-section-block')?.querySelector('.sh-more');
    if (continueMoreEl) continueMoreEl.textContent = t('continueMore');
    const seasonMoreEl = document.querySelector('#seasonPopularGrid')?.closest('.home-section-block')?.querySelector('.sh-more');
    if (seasonMoreEl) seasonMoreEl.textContent = t('seasonMore');
    const highRatedMoreEl = document.querySelector('#homeRecommendationsGrid')?.closest('.home-section-block')?.querySelector('.sh-more');
    if (highRatedMoreEl) highRatedMoreEl.textContent = t('highRatedMore');

    // Hero banner text
    const bannerTitleEl = document.querySelector('.banner-title');
    if (bannerTitleEl) bannerTitleEl.innerHTML = t('bannerTitle') + '<br><span class="gradient-text">' + t('bannerTitleSpan') + '</span>';
    const bannerSubEl = document.querySelector('.banner-sub');
    if (bannerSubEl) bannerSubEl.textContent = t('bannerSub');

    // Hero chips
    const chips = document.querySelectorAll('.hero-chip');
    const chipKeys = ['heroChipAI', 'heroChipXP', 'heroChipCal', 'heroChipAnalytics'];
    chips.forEach((chip, i) => { if (chipKeys[i]) chip.textContent = t(chipKeys[i]); });

    // BSC labels (hero stat cards)
    const bscLabels = document.querySelectorAll('.bsc .bsc-label');
    if (bscLabels.length >= 4) {
        bscLabels[3].textContent = t('heroXPLabel');
    }

    // Platform stats labels
    const psbLabels = document.querySelectorAll('.psb-label');
    const psbKeys = ['liveUsersLabel', 'liveTotalLabel', 'liveCompletedLabel', 'liveXPLabel', 'liveContentLabel'];
    psbLabels.forEach((el, i) => { if (psbKeys[i]) el.textContent = t(psbKeys[i]); });

    // Quick stats labels
    set('watchingStatLabel', 'watching_stat');
    set('completedStatLabel', 'completed_stat');
    set('planToWatchStatLabel', 'plantowatch_stat');
    set('onHoldStatLabel', 'onhold_stat');
    set('avgRatingLabel', 'avgRating');
    set('streakBadgeLabel', 'streak');

    // Quick stats card labels (in homeSection)
    const qsCards = document.querySelectorAll('.qs-card .qs-label');
    const qsKeys = ['watchingStatCard', 'completedStatCard', 'planToWatchStatCard', 'onHoldStatCard', 'avgRatingCard', 'streakCard'];
    qsCards.forEach((el, i) => { if (qsKeys[i]) el.textContent = t(qsKeys[i]); });

    // ===== FEATURES SECTION =====
    const featTitleEl = document.querySelector('.features-title');
    if (featTitleEl) featTitleEl.innerHTML = t('featuresTitle') + ' <span class="gradient-text">' + t('featuresTitleSpan') + '</span>';
    const featSubEl = document.querySelector('.features-sub');
    if (featSubEl) featSubEl.textContent = t('featuresSub');

    const featCards = document.querySelectorAll('.feature-card');
    const featData = [
        ['feat1Title','feat1Desc'],['feat2Title','feat2Desc'],['feat3Title','feat3Desc'],
        ['feat4Title','feat4Desc'],['feat5Title','feat5Desc'],['feat6Title','feat6Desc']
    ];
    featCards.forEach((card, i) => {
        if (!featData[i]) return;
        const titleEl = card.querySelector('.feature-title');
        const descEl = card.querySelector('.feature-desc');
        if (titleEl) titleEl.textContent = t(featData[i][0]);
        if (descEl) descEl.textContent = t(featData[i][1]);
    });

    // ===== GUEST CTA =====
    const guestCTA = document.getElementById('guestCTA');
    if (guestCTA) {
        const h3 = guestCTA.querySelector('h3');
        const p = guestCTA.querySelector('p');
        const btns = guestCTA.querySelectorAll('button');
        if (h3) h3.textContent = t('guestCTATitle');
        if (p) p.textContent = t('guestCTASub');
        if (btns[0]) btns[0].textContent = t('guestCTARegister');
        if (btns[1]) btns[1].textContent = t('guestCTALogin');
    }

    // Banner actions (dynamic, updated by auth)
    const bannerActionsEl = document.getElementById('bannerActions');
    if (bannerActionsEl && bannerActionsEl.innerHTML.trim() !== '') {
        // Re-set based on current user state
        if (typeof isGuest !== 'undefined') {
            if (isGuest) {
                bannerActionsEl.innerHTML = '<button class="btn btn-primary btn-large" onclick="openAuthModal(\'register\')">' + t('bannerRegisterBtn') + '</button><button class="btn btn-ghost btn-large" onclick="openAuthModal(\'login\')">' + t('bannerLoginBtn') + '</button>';
            } else {
                bannerActionsEl.innerHTML = '<button class="btn btn-primary btn-large" onclick="openAddModal()">' + t('bannerAddBtn') + '</button><button class="btn btn-ghost btn-large" onclick="switchSection(\'discover\')">' + t('bannerDiscoverBtn') + '</button>';
            }
        }
    }

    // ===== COMMUNITY =====
    const commTitleEl = document.querySelector('.community-header .features-title');
    if (commTitleEl) commTitleEl.innerHTML = t('commTitle') + ' <span class="gradient-text">' + t('commTitleSpan') + '</span>';
    const commSubEl = document.querySelector('.community-header .features-sub');
    if (commSubEl) commSubEl.textContent = t('commSub');

    const lbTitleEl = document.querySelector('.leaderboard-card .cc-title');
    if (lbTitleEl) lbTitleEl.textContent = t('leaderboardTitle');
    const lbLoadingEl = document.querySelector('.lb-loading');
    if (lbLoadingEl) lbLoadingEl.textContent = t('leaderboardLoading');
    const lbProfileBtn = document.querySelector('.leaderboard-card .btn-secondary');
    if (lbProfileBtn) lbProfileBtn.textContent = t('leaderboardProfileBtn');

    const platStatsTitleEl = document.querySelector('.community-stats-card .cc-title');
    if (platStatsTitleEl) platStatsTitleEl.textContent = t('platformStatsTitle');
    const csiLabels = document.querySelectorAll('.csi-label');
    const csiKeys = ['commUsersLabel','commAnimeLabel','commCompletedLabel','commXPLabel','commStreakLabel'];
    csiLabels.forEach((el, i) => { if (csiKeys[i]) el.textContent = t(csiKeys[i]); });

    const joinCard = document.querySelector('.join-card');
    if (joinCard) {
        const joinTitleEl = joinCard.querySelector('.cc-title');
        const joinSubEl = joinCard.querySelector('p');
        const joinBtns = joinCard.querySelectorAll('button');
        const joinBadges = joinCard.querySelectorAll('.jb');
        if (joinTitleEl) joinTitleEl.textContent = t('joinTitle');
        if (joinSubEl) joinSubEl.textContent = t('joinSub');
        if (joinBtns[0]) joinBtns[0].textContent = t('joinBtn');
        if (joinBtns[1]) joinBtns[1].textContent = t('joinDiscoverBtn');
        if (joinBadges[0]) joinBadges[0].textContent = t('joinBadgeFree');
        if (joinBadges[1]) joinBadges[1].textContent = t('joinBadgeSafe');
        if (joinBadges[2]) joinBadges[2].textContent = t('joinBadgeMobile');
    }

    // ===== FOOTER =====
    const footerSubEl = document.querySelector('.site-footer > p');
    if (footerSubEl) footerSubEl.textContent = t('footerSub');
    const footerLinks = document.querySelectorAll('.footer-links span');
    if (footerLinks.length >= 5) {
        footerLinks[0].textContent = t('footerDiscover');
        footerLinks[2].textContent = t('footerRegister');
        footerLinks[4].textContent = t('footerHome');
    }

    // ===== DISCOVER =====
    const ds = document.getElementById('discoverSearch');
    if (ds) ds.placeholder = t('discoverSearchPlaceholder');
    const discoverBadgeEl = document.querySelector('.discover-hero-badge');
    if (discoverBadgeEl) discoverBadgeEl.textContent = t('discoverBadge');
    const discoverHeroTitleEl = document.querySelector('.discover-hero-title');
    if (discoverHeroTitleEl) discoverHeroTitleEl.textContent = t('discoverHeroTitle');
    const discoverHeroSubEl = document.querySelector('.discover-hero-sub');
    if (discoverHeroSubEl) discoverHeroSubEl.textContent = t('discoverHeroSub');

    // Discover type tabs
    const discoverTabs = document.querySelectorAll('.discover-tab');
    const tabKeys = ['discoverAllTab','discoverAnimeTab','discoverMangaTab','discoverWebtoonTab'];
    discoverTabs.forEach((tab, i) => { if (tabKeys[i]) tab.textContent = t(tabKeys[i]); });

    // Sort dropdown
    const discoverSortEl = document.getElementById('discoverSort');
    if (discoverSortEl) {
        const opts = discoverSortEl.options;
        if (opts[0]) opts[0].text = '⭐ ' + t('byRatingSort');
        if (opts[1]) opts[1].text = '🔤 ' + t('byNameSort');
        if (opts[2]) opts[2].text = '📅 ' + t('byYearSort');
    }

    // Genre filter tags
    const genreTags = document.querySelectorAll('.genre-tag');
    const genreKeys = ['genreAll','genreAction','genreAdventure','genreComedy','genreDrama','genreFantasy','genreRomance','genreScifi','genreHorror','genreMystery','genrePsych','genreSports'];
    genreTags.forEach((tag, i) => { if (genreKeys[i]) tag.textContent = t(genreKeys[i]); });

    // ===== LIBRARY =====
    const ls = document.getElementById('searchInput');
    if (ls) ls.placeholder = t('searchPlaceholder');

    const libraryTitleEl = document.querySelector('#librarySection .page-title');
    if (libraryTitleEl) libraryTitleEl.textContent = t('libraryTitle');

    const typeFilterEl = document.getElementById('typeFilter');
    if (typeFilterEl) {
        const opts = typeFilterEl.options;
        if (opts[0]) opts[0].text = t('allTypesOpt');
    }

    const statusFilterEl = document.getElementById('statusFilter');
    if (statusFilterEl) {
        const opts = statusFilterEl.options;
        if (opts[0]) opts[0].text = t('allStatusesOpt');
        if (opts[1]) opts[1].text = t('statusWatching');
        if (opts[2]) opts[2].text = t('statusCompleted');
        if (opts[3]) opts[3].text = t('statusOnHold');
        if (opts[4]) opts[4].text = t('statusPlan');
        if (opts[5]) opts[5].text = t('statusDropped');
    }

    const sortByEl = document.getElementById('sortBy');
    if (sortByEl) {
        const opts = sortByEl.options;
        if (opts[0]) opts[0].text = t('sortRecent');
        if (opts[1]) opts[1].text = t('sortName');
        if (opts[2]) opts[2].text = t('sortRating');
        if (opts[3]) opts[3].text = t('sortProgress');
    }

    // ===== PROFILE =====
    const profileEditBtn = document.querySelector('#profileSection button[onclick*="editProfile"]');
    if (profileEditBtn && profileEditBtn.textContent.trim() !== t('profileEditBtn')) profileEditBtn.textContent = t('profileEditBtn');
    const profileShareBtn = document.querySelector('#profileSection button[onclick*="shareProfile"]');
    if (profileShareBtn) profileShareBtn.textContent = t('profileShareBtn');
    const profileMsgBoxBtn = document.querySelector('#profileSection button[onclick*="dmMessageInput"]');
    if (profileMsgBoxBtn) profileMsgBoxBtn.textContent = t('profileMsgBoxBtn');

    const piLabels = document.querySelectorAll('.profile-insight-card .pi-label');
    const piKeys = ['profileAvgRatingLabel', 'profileCompletionRateLabel', 'profileActivityLevelLabel'];
    piLabels.forEach((el, i) => { if (piKeys[i]) el.textContent = t(piKeys[i]); });

    const profileDiscoverTitle = document.querySelector('#messagesSection .profile-members-block .psb-title');
    if (profileDiscoverTitle) profileDiscoverTitle.textContent = t('profileDiscoverUsersTitle');
    const profileRefreshBtn = document.querySelector('#messagesSection .profile-members-block button');
    if (profileRefreshBtn) profileRefreshBtn.textContent = t('profileRefreshBtn');

    const profileDmTitle = document.querySelector('#messagesSection .profile-dm-block .psb-title');
    if (profileDmTitle) profileDmTitle.textContent = t('profilePrivateMessagesTitle');

    const profileStatCards = document.querySelectorAll('.profile-stat-card .psc-label');
    const profileStatKeys = [null, null, null, 'profileCompletedLabel', 'profileXPLabel', 'profileStreakLabel'];
    profileStatCards.forEach((el, i) => { if (profileStatKeys[i]) el.textContent = t(profileStatKeys[i]); });

    const profileStatusTitleEl = document.querySelector('#profileSection .psb-title[data-i18n="profileStatusTitle"]');
    if (profileStatusTitleEl) profileStatusTitleEl.textContent = t('profileStatusTitle');
    const profileActivityTitleEl = document.querySelector('#profileSection .psb-title[data-i18n="profileActivityTitle"]');
    if (profileActivityTitleEl) profileActivityTitleEl.textContent = t('profileActivityTitle');
    const profileFavTitleEl = document.querySelector('#profileSection .psb-title[data-i18n="profileFavGenresTitle"]');
    if (profileFavTitleEl) profileFavTitleEl.textContent = t('profileFavGenresTitle');
    const profileAchTitleEl = document.querySelector('#profileSection .psb-title[data-i18n="profileAchievementsTitle"]');
    if (profileAchTitleEl) profileAchTitleEl.textContent = t('profileAchievementsTitle');
    const profileExportTitleEl = document.querySelector('#profileSection .psb-title[data-i18n="profileExportTitle"]');
    if (profileExportTitleEl) profileExportTitleEl.textContent = t('profileExportTitle');

    const profileTwitterBtnEl = document.querySelector('#profileSection [data-i18n="profileTwitterBtn"]');
    if (profileTwitterBtnEl) profileTwitterBtnEl.textContent = t('profileTwitterBtn');
    const profileCopyBtnEl = document.querySelector('#profileSection [data-i18n="profileCopyBtn"]');
    if (profileCopyBtnEl) profileCopyBtnEl.textContent = t('profileCopyBtn');
    const profileJsonBtnEl = document.querySelector('#profileSection [data-i18n="profileJSONBtn"]');
    if (profileJsonBtnEl) profileJsonBtnEl.textContent = t('profileJSONBtn');

    // Profile streak badge suffix
    const profileStreakBadge = document.querySelector('.streak-badge');
    if (profileStreakBadge) {
        const val = document.getElementById('profileStreakBadge')?.textContent || '0';
        profileStreakBadge.innerHTML = '<span id="profileStreakBadge">' + val + '</span> ' + t('profileStreakSuffix');
    }

    // Dropdown menu items
    const dropdownItems = document.querySelectorAll('.user-dropdown .dropdown-item:not(.danger):not(#adminPanelLink)');
    if (dropdownItems[0]) dropdownItems[0].textContent = t('profileDropdownItem');
    if (dropdownItems[1]) dropdownItems[1].textContent = t('settingsDropdownItem');
    if (dropdownItems[2]) dropdownItems[2].textContent = t('achievementsDropdownItem');
    const logoutItem = document.querySelector('.dropdown-item.danger');
    if (logoutItem) logoutItem.textContent = t('logoutBtn');

    // ===== CALENDAR =====
    const calTitleEl = document.querySelector('#calendarSection .page-title');
    if (calTitleEl) calTitleEl.textContent = t('calendarTitle');
    const calHeaderSpan = document.querySelector('.calendar-header-row > span');
    if (calHeaderSpan) calHeaderSpan.textContent = t('weeklySchedule');
    const calSyncBtn = document.querySelector('.calendar-header-row .btn-secondary');
    if (calSyncBtn) calSyncBtn.textContent = t('calendarSyncBtn');

    // ===== ANALYTICS =====
    const analyticsTitleEl = document.querySelector('#analyticsSection .page-title');
    if (analyticsTitleEl) analyticsTitleEl.textContent = t('analyticsTitle');

    // ===== AI =====
    const aiTitleEl = document.querySelector('.ai-title');
    if (aiTitleEl) aiTitleEl.textContent = t('aiTitle');
    const aiSubEl = document.querySelector('.ai-sub');
    if (aiSubEl) aiSubEl.textContent = t('aiSub');

    const aacLabels = document.querySelectorAll('.aac .aac-label');
    const aacKeys = ['aiWatchingLabel', 'aiFavGenreLabel', 'aiAvgLabel', 'aiAccuracyLabel'];
    aacLabels.forEach((el, i) => { if (aacKeys[i]) el.textContent = t(aacKeys[i]); });

    const aiNewRecsBtnEl = document.querySelector('.ai-btn-row .btn-primary');
    if (aiNewRecsBtnEl) aiNewRecsBtnEl.textContent = t('aiNewRecsBtn');
    const aiRefreshBtnEl = document.querySelector('.ai-btn-row .btn-secondary');
    if (aiRefreshBtnEl) aiRefreshBtnEl.textContent = t('aiRefreshBtn');

    const aiSections = document.querySelectorAll('#aiSection .sh-title');
    if (aiSections[0]) aiSections[0].textContent = t('aiForYouTitle');
    if (aiSections[1]) aiSections[1].textContent = t('aiSimilarTitle');

    // ===== ACHIEVEMENTS =====
    const achTitleEl = document.querySelector('#achievementsSection .page-title');
    if (achTitleEl) achTitleEl.textContent = t('achievementsTitle');
    const achSubEl = document.querySelector('#achievementsSection .page-sub');
    if (achSubEl) achSubEl.textContent = t('achievementsSub');

    // ===== SETTINGS =====
    const settingsTitleEl = document.querySelector('#settingsSection .page-title');
    if (settingsTitleEl) settingsTitleEl.textContent = t('settingsTitle');

    const chartTitles = document.querySelectorAll('#settingsSection .chart-title');
    if (chartTitles[0]) chartTitles[0].textContent = t('settingsThemeTitle');
    if (chartTitles[1]) chartTitles[1].textContent = t('settingsDataTitle');
    if (chartTitles[2]) chartTitles[2].textContent = t('settingsNotifTitle');
    if (chartTitles[3]) chartTitles[3].textContent = t('settingsDangerTitle');

    const settingsDataSubEl = document.querySelector('#settingsSection .chart-container:nth-child(2) > p');
    if (settingsDataSubEl) settingsDataSubEl.textContent = t('settingsDataSub');

    const settingsNotifLabelEl = document.querySelector('.toggle-label > span');
    if (settingsNotifLabelEl) settingsNotifLabelEl.textContent = t('settingsNotifLabel');

    const settingsDangerSubEl = document.querySelector('.danger-zone > p');
    if (settingsDangerSubEl) settingsDangerSubEl.textContent = t('settingsDangerSub');

    const settingsLogoutBtn = document.querySelector('.btn-danger');
    if (settingsLogoutBtn) settingsLogoutBtn.textContent = t('settingsLogoutBtn');
    const settingsDeleteBtn = document.querySelector('.btn-danger-outline');
    if (settingsDeleteBtn) settingsDeleteBtn.textContent = t('settingsDeleteBtn');

    // Theme names
    const themeNames = document.querySelectorAll('.theme-name');
    const themeKeys = ['themeDark','themeLight','themeNeon','themePastel'];
    themeNames.forEach((el, i) => { if (themeKeys[i]) el.textContent = t(themeKeys[i]); });

    // Settings data buttons
    const settingsDataBtns = document.querySelectorAll('#settingsSection .chart-container:nth-child(2) button');
    if (settingsDataBtns[0]) settingsDataBtns[0].textContent = t('jsonDown');
    if (settingsDataBtns[1]) settingsDataBtns[1].textContent = t('csvDown');
    if (settingsDataBtns[2]) settingsDataBtns[2].textContent = t('importBtn');

    // ===== ADD MODAL =====
    const addModalTitleEl = document.querySelector('#addModal .modal-title');
    if (addModalTitleEl) addModalTitleEl.textContent = t('addModalTitle');

    const addFormGroups = document.querySelectorAll('#addForm .form-group label');
    if (addFormGroups[0]) addFormGroups[0].textContent = t('addModalAPILabel');
    const apiSearchEl = document.getElementById('apiSearch');
    if (apiSearchEl) apiSearchEl.placeholder = t('addModalAPIPlaceholder');

    // Add modal status select
    const itemStatusEl = document.getElementById('itemStatus');
    if (itemStatusEl) {
        const opts = itemStatusEl.options;
        if (opts[0]) opts[0].text = t('plantowatch');
        if (opts[1]) opts[1].text = t('watching');
        if (opts[2]) opts[2].text = t('completed');
        if (opts[3]) opts[3].text = t('onhold');
        if (opts[4]) opts[4].text = t('dropped');
    }

    // Add modal submit btn
    const addSubmitBtn = document.querySelector('#addForm button[type="submit"]');
    if (addSubmitBtn) addSubmitBtn.textContent = t('addModalSubmitBtn');
    const addContentBtnEl = document.getElementById('addContentBtn');
    if (addContentBtnEl) addContentBtnEl.textContent = t('addBtn');

    // ===== DETAIL PAGE =====
    const dpBackEl = document.querySelector('.dp-breadcrumb span:first-child');
    if (dpBackEl) dpBackEl.textContent = t('dpBack');
    const dpSynTitleEl = document.querySelector('#dpSynopsis')?.closest('.dp-card')?.querySelector('.dp-card-title');
    if (dpSynTitleEl) dpSynTitleEl.textContent = t('dpSynopsisTitle');
    const dpReviewTitleEl = document.querySelector('#reviewFormCard .dp-card-title');
    if (dpReviewTitleEl) dpReviewTitleEl.textContent = t('dpReviewTitle');
    const dpCommentsTitleEl = document.querySelector('#reviewsList')?.closest('.dp-card')?.querySelector('.dp-card-title');
    if (dpCommentsTitleEl) dpCommentsTitleEl.textContent = t('dpCommentsTitle');
    const dpInfoTitleEl = document.querySelector('.dp-info-card .dp-card-title');
    if (dpInfoTitleEl) dpInfoTitleEl.textContent = t('dpInfoTitle');
    const dpSimilarTitleEl = document.querySelector('#similarGrid')?.closest('.home-section-block')?.querySelector('.sh-title');
    if (dpSimilarTitleEl) dpSimilarTitleEl.textContent = t('dpSimilarTitle');
    const dpBackBtn = document.querySelector('.dp-back-btn');
    if (dpBackBtn) dpBackBtn.textContent = t('dpBackBtn');

    // Detail info labels
    const dpInfoLabels = document.querySelectorAll('.dp-info-label');
    const dpInfoKeys = ['dpTypeLabel','dpRankLabel','dpMembersLabel','dpStudioLabel','dpStatusLabel'];
    dpInfoLabels.forEach((el, i) => { if (dpInfoKeys[i]) el.textContent = t(dpInfoKeys[i]); });

    // Rating text (only if no rating selected)
    const ratingTextEl = document.getElementById('ratingText');
    if (ratingTextEl && (ratingTextEl.textContent === 'Puan sec' || ratingTextEl.textContent === 'Select rating')) {
        ratingTextEl.textContent = t('dpRatingText');
    }

    // Review textarea placeholder
    const reviewCommentEl = document.getElementById('reviewComment');
    if (reviewCommentEl) reviewCommentEl.placeholder = t('dpCommentPlaceholder');

    // Review submit button
    const reviewSubmitBtn = document.getElementById('reviewSubmitBtn');
    if (reviewSubmitBtn && (reviewSubmitBtn.textContent === '💬 Yorumu Gonder' || reviewSubmitBtn.textContent === '💬 Submit Review')) {
        reviewSubmitBtn.textContent = t('dpSubmitReview');
    }

    // Synopsis: re-apply stored synopsis in correct language, or update loading text
    const dpSynopsisEl = document.getElementById('dpSynopsis');
    if (dpSynopsisEl) {
        if (window._detailSynopsis && (window._detailSynopsis.en || window._detailSynopsis.tr)) {
            if (typeof _applyDetailSynopsis === 'function') _applyDetailSynopsis();
        } else if (dpSynopsisEl.textContent === 'Yukleniyor...' || dpSynopsisEl.textContent === 'Aciklama yukleniyor...' || dpSynopsisEl.textContent === 'Loading description...') {
            dpSynopsisEl.textContent = t('dpSynopsisLoading');
        }
    }

    // Add to list button (if not in library)
    const dpAddBtn = document.getElementById('dpAddBtn');
    if (dpAddBtn && !dpAddBtn.classList.contains('in-library')) {
        dpAddBtn.textContent = t('dpAddToList');
    }

    // Discover stats text — update both loading and loaded states
    const discoverStatsEl = document.getElementById('discoverStats');
    if (discoverStatsEl) {
        const txt = discoverStatsEl.textContent || '';
        // Loading state
        if (txt === 'Icerik yukleniyor...' || txt === 'Loading content...') {
            discoverStatsEl.textContent = _lang === 'en' ? 'Loading content...' : 'Icerik yukleniyor...';
        }
        // Loaded state: "786 results found" / "786 icerik bulundu"
        const numMatch = txt.match(/^(\d+)\s/);
        if (numMatch) {
            discoverStatsEl.textContent = numMatch[1] + (_lang === 'en' ? ' results found' : ' icerik bulundu');
        }
    }

    // Refresh current section content if needed
    if (typeof currentSection !== 'undefined') {
        if (currentSection === 'home') {
            if (typeof renderHomePage === 'function') renderHomePage();
        }
        if (currentSection === 'library') filterItems();
        if (currentSection === 'discover') renderDiscoverGrid();
        if (currentSection === 'analytics') renderAnalytics();
        if (currentSection === 'ai') renderAISection();
        if (currentSection === 'profile') renderProfilePage();
    }
    // Always update all visible add-to-list buttons (home media rows + discover)
    document.querySelectorAll('.add-to-list-btn').forEach(btn => {
        const inList = btn.classList.contains('in-library');
        btn.textContent = inList
            ? (_lang === 'en' ? '✓ In List' : '✓ Listende')
            : (_lang === 'en' ? '+ Add' : '+ Ekle');
    });
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
        const safeId = String(item.id).replace(/'/g, "\\'");
        const stars = [1,2,3,4,5].map(s =>
            `<button class="star-btn" onclick="event.stopPropagation();updateItem('${safeId}','rating',${s})">${s <= (item.rating || 0) ? '⭐' : '☆'}</button>`
        ).join('');
        const nextDisabled = item.totalEpisodes > 0 && (item.currentEpisode || 0) >= item.totalEpisodes;
        const actionButtons = `<div class="item-actions">
                    <button class="item-action-btn" onclick="event.stopPropagation();advanceEpisode('${safeId}')"${nextDisabled ? ' disabled' : ''}>▶ Next Ep</button>
                    <button class="item-action-btn item-action-complete" onclick="event.stopPropagation();completeItem('${safeId}')">✅ Complete</button>
                </div>`;

        return `<div class="item-card">
            <div class="item-poster" style="cursor:pointer" onclick="openDetailPageFromLibrary('${safeId}')">
                ${item.poster
                    ? `<img src="${item.poster}" alt="${(item.name||'').replace(/"/g,'&quot;')}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                       <div class="media-poster-fallback" style="display:none">${getTypeIcon(item.type)}</div>`
                    : `<div class="media-poster-fallback">${getTypeIcon(item.type)}</div>`}
                <span class="media-type-badge ${item.type}">${item.type}</span>
            </div>
            <div class="item-header">
                <span class="item-type-badge ${item.type}">${item.type}</span>
                <div class="item-title">${escapeHTML(item.name) || (t('noContent'))}</div>
            </div>
            <div class="item-body">
                <label>${t('statusLabel')}</label>
                <select onclick="event.stopPropagation();" onchange="event.stopPropagation();updateItem('${safeId}','status',this.value)">
                    ${Object.entries(statusLabels).map(([val, label]) =>
                        `<option value="${val}"${item.status === val ? ' selected' : ''}>${label}</option>`
                    ).join('')}
                </select>
                <label>${t('episodeLabel')}</label>
                <div class="ep-row">
                    <input type="number" min="0" max="${item.totalEpisodes || 9999}" value="${item.currentEpisode || 0}"
                        onclick="event.stopPropagation();" onchange="event.stopPropagation();updateItem('${safeId}','currentEpisode',parseInt(this.value)||0)" placeholder="Current">
                    <input type="number" min="0" value="${item.totalEpisodes || 0}"
                        onclick="event.stopPropagation();" onchange="event.stopPropagation();updateItem('${safeId}','totalEpisodes',parseInt(this.value)||0)" placeholder="Total">
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
                ${actionButtons}
                <label>${t('ratingLabel')}</label>
                <div class="star-rating">${stars}</div>
                <button class="delete-btn" onclick="event.stopPropagation();deleteItem('${safeId}')">${t('deleteBtn')}</button>
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

    // Kutuphane islemleri XP vermiyor — dongu onleme
    if (field === 'status' && value === 'completed' && oldValue !== 'completed') {
        if (item.totalEpisodes > 0) item.currentEpisode = item.totalEpisodes;
        checkAchievements(); // XP yok, sadece basarim kontrolu
    } else if (field === 'status') {
        checkAchievements();
    }
    // rating, notes, watching degisiklikleri XP vermiyor

    dataManager.saveAll();
    filterItems();
    updateStats();
}

function advanceEpisode(id) {
    if (!dataManager.data) return;
    const item = dataManager.data.items.find(i => String(i.id) === String(id));
    if (!item) return;

    const current = Number(item.currentEpisode || 0);
    const total = Number(item.totalEpisodes || 0);
    if (total > 0 && current >= total) {
        showNotification(_lang === 'en' ? 'Already at the final episode.' : 'Zaten son bolumdesiniz.', 'info');
        return;
    }

    item.currentEpisode = current + 1;
    if (total > 0 && item.currentEpisode >= total) {
        item.currentEpisode = total;
        item.status = 'completed';
    } else if (item.status === 'plantowatch' || item.status === 'dropped') {
        item.status = 'watching';
    }

    dataManager.saveAll();
    checkAchievements();
    filterItems();
    updateStats();
    showNotification(_lang === 'en' ? 'Episode progress saved.' : 'Bolum ilerlemesi kaydedildi.', 'success');
}

function completeItem(id) {
    if (!dataManager.data) return;
    const item = dataManager.data.items.find(i => String(i.id) === String(id));
    if (!item) return;

    item.status = 'completed';
    if (item.totalEpisodes > 0) item.currentEpisode = item.totalEpisodes;

    dataManager.saveAll();
    checkAchievements();
    filterItems();
    updateStats();
    showNotification(_lang === 'en' ? 'Marked as completed.' : 'Tamamlandi olarak isaretlendi.', 'success');
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

// Avatar'i bir element'e uygula (fotograf varsa fotograf, yoksa emoji)
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

    set('profileUsername', d.social.name || t('profileUnknownUser'));
    set('profileEmailDisplay', currentUser.email || '');
    set('profileBioText', d.social.bio || t('bioDefault'));

    // Avatar — fotograf veya emoji
    _applyAvatar('profileAvatarLarge', d.social);

    // Kapak
    const cover = document.getElementById('profileCoverBg');
    if (cover) {
        const covers = {
            gradient1: 'linear-gradient(135deg,rgba(255,51,102,0.18),rgba(124,58,237,0.12))',
            gradient2: 'linear-gradient(135deg,rgba(0,212,255,0.18),rgba(14,165,233,0.12))',
            gradient3: 'linear-gradient(135deg,rgba(16,185,129,0.18),rgba(5,150,105,0.12))',
            gradient4: 'linear-gradient(135deg,rgba(245,158,11,0.18),rgba(239,68,68,0.12))',
            gradient5: 'linear-gradient(135deg,rgba(139,92,246,0.18),rgba(236,72,153,0.12))',
            gradient6: 'linear-gradient(135deg,rgba(249,115,22,0.18),rgba(251,191,36,0.12))',
            gradient7: 'linear-gradient(135deg,rgba(6,182,212,0.18),rgba(99,102,241,0.12))',
        };
        cover.style.background = covers[d.social.cover || 'gradient1'];
    }

    updateStats();
    xpSystem.updateUI();

    const items = d.items || [];

    // Izleme durumu ozeti
    const watching   = items.filter(i => i.status === 'watching').length;
    const completed  = items.filter(i => i.status === 'completed').length;
    const planned    = items.filter(i => i.status === 'plantowatch').length;
    const dropped    = items.filter(i => i.status === 'dropped').length;
    const rated      = items.filter(i => i.rating);
    const avgRating  = rated.length ? (rated.reduce((s, i) => s + i.rating, 0) / rated.length).toFixed(1) : '—';
    const joinDateText = d.social?.joinDate
        ? new Date(d.social.joinDate).toLocaleDateString(_lang === 'en' ? 'en-GB' : 'tr-TR', { month: 'short', year: 'numeric' })
        : t('profileJoinedRecently');

    set('profileTotalAnime',    items.filter(i => i.type === 'anime').length);
    set('profileTotalManga',    items.filter(i => i.type === 'manga').length);
    set('profileTotalWebtoon',  items.filter(i => i.type === 'webtoon').length);
    set('profileCompletedTotal', completed);
    set('profileStreakVal',     d.streak?.longest || d.streak?.count || 0);
    set('profileXPTotal',      d.xp?.total || 0);
    set('profileJoinBadge', joinDateText);
    set('profileAvgRating', avgRating);
    set('profileCompletionRate', items.length ? Math.round((completed / items.length) * 100) + '%' : '0%');

    const actLevel = (items.length >= 120 || (d.streak?.count || 0) >= 30)
        ? t('profileActivityHardcore')
        : (items.length >= 45 || (d.streak?.count || 0) >= 10)
            ? t('profileActivityActive')
            : t('profileActivityNew');
    set('profileActivityLevel', actLevel);

    // Durum cubuklari
    const statusBar = document.getElementById('profileStatusBars');
    if (statusBar) {
        const total = items.length || 1;
        const bars = [
            { label: t('watching_stat'),    count: watching,  color: '#00d4ff' },
            { label: t('completed_stat'),   count: completed, color: '#10b981' },
            { label: t('plantowatch_stat'), count: planned,   color: '#a78bfa' },
            { label: t('droppedLabel'), count: dropped, color: '#f87171' },
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
                <span class="status-bar-label" style="color:var(--text-muted)">${t('avgRating')}</span>
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
            dropped:     t('droppedLabel')
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

    // Favori turler — bar chart
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

    // Son basarimlar
    const recentAch = document.getElementById('recentAchievements');
    if (recentAch) {
        const achList = typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS : [];
        const unlocked = achList.filter(a => (d.achievements || []).includes(a.id)).slice(-4).reverse();
        const _a = (obj) => (typeof obj === 'object' && obj !== null) ? (obj[_lang] || obj.tr || Object.values(obj)[0]) : obj;
        recentAch.innerHTML = unlocked.length > 0
            ? unlocked.map(a => `
                <div class="ach-mini">
                    <span class="ach-mini-icon">${a.icon}</span>
                    <div style="flex:1;min-width:0;">
                        <div class="ach-mini-name">${_a(a.title)}</div>
                    </div>
                    ${a.xp > 0 ? '<span class="ach-mini-xp">+' + a.xp + ' XP</span>' : ''}
                </div>`).join('')
            : '<div style="color:var(--text-muted);font-size:0.88rem;">' + t('noAchievements') + '</div>';
    }

}

let profileDirectoryCache = [];
let profileDirectoryLoadedAt = 0;
let profileDirectoryLoading = false;

const privateDMState = {
    backendChecked: false,
    backendAvailable: false,
    backendReason: '',
    rows: [],
    activeUserId: null,
    userIndex: {}
};

function _escHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function _encArg(str) {
    return encodeURIComponent(String(str || ''));
}

async function _fetchProfileDirectory(force = false) {
    const now = Date.now();
    if (!force && profileDirectoryCache.length > 0 && (now - profileDirectoryLoadedAt) < 120000) {
        return profileDirectoryCache;
    }
    if (profileDirectoryLoading || !window.supabaseClient) return profileDirectoryCache;

    profileDirectoryLoading = true;
    try {
        const { data, error } = await window.supabaseClient
            .from('public_leaderboard')
            .select('user_id,name,avatar,avatar_url,level,xp_total')
            .order('xp_total', { ascending: false })
            .limit(80);

        if (error) throw error;

        const myId = currentUser?.uid || currentUser?.id;
        profileDirectoryCache = (data || []).filter(u => u.user_id && u.user_id !== myId);
        profileDirectoryLoadedAt = Date.now();
        return profileDirectoryCache;
    } catch (e) {
        console.warn('Profile directory fetch error:', e.message);
        return profileDirectoryCache;
    } finally {
        profileDirectoryLoading = false;
    }
}

function _memberCardHtml(u) {
    const avatar = u.avatar_url
        ? '<div class="pm-avatar"><img src="' + _escHtml(u.avatar_url) + '" alt="avatar"></div>'
        : '<div class="pm-avatar">' + _escHtml(u.avatar || '👤') + '</div>';

    const safeName = u.name || t('profileUnknownUser');
    const name = _escHtml(safeName);
    const lvl = u.level || 1;
    const xp = Number(u.xp_total || 0).toLocaleString(_lang === 'en' ? 'en-US' : 'tr-TR');

    return '<div class="profile-member-card">'
        + avatar
        + '<div class="pm-meta"><div class="pm-name">' + name + '</div><div class="pm-sub">Lv.' + lvl + ' · ' + xp + ' XP</div></div>'
        + '<div class="pm-actions">'
        + '<button class="pm-action-btn" onclick="openPublicProfile(decodeURIComponent(\'' + _encArg(u.user_id) + '\'),decodeURIComponent(\'' + _encArg(safeName) + '\'))">' + t('memberViewProfileBtn') + '</button>'
        + '<button class="pm-action-btn" onclick="openPrivateChatWithUser(decodeURIComponent(\'' + _encArg(u.user_id) + '\'),decodeURIComponent(\'' + _encArg(safeName) + '\'))">' + t('memberMessageBtn') + '</button>'
        + '</div></div>';
}

async function renderProfileMemberDirectory(force = false) {
    const grid = document.getElementById('profileMemberGrid');
    const inp = document.getElementById('profileMemberSearch');
    if (!grid || !inp) return;

    if (!inp.dataset.bound) {
        inp.dataset.bound = '1';
        inp.addEventListener('input', () => renderProfileMemberDirectory(false));
    }

    grid.innerHTML = '<div class="dm-empty">' + t('dmLoading') + '</div>';
    const users = await _fetchProfileDirectory(force);
    const q = inp.value.trim().toLowerCase();
    const filtered = q ? users.filter(u => String(u.name || '').toLowerCase().includes(q)) : users;

    if (!filtered.length) {
        grid.innerHTML = '<div class="dm-empty">' + t('dmUserNotFound') + '</div>';
        return;
    }
    grid.innerHTML = filtered.slice(0, 40).map(_memberCardHtml).join('');
}

async function _checkPrivateDMBackend() {
    if (privateDMState.backendChecked) return privateDMState.backendAvailable;
    privateDMState.backendChecked = true;

    if (!window.supabaseClient || !currentUser) {
        privateDMState.backendAvailable = false;
        privateDMState.backendReason = 'Supabase unavailable.';
        return false;
    }

    try {
        const { error } = await window.supabaseClient
            .from('private_messages')
            .select('id', { head: true, count: 'exact' });

        if (error) {
            privateDMState.backendAvailable = false;
            privateDMState.backendReason = error.message || 'private_messages table unavailable.';
            return false;
        }
        privateDMState.backendAvailable = true;
        privateDMState.backendReason = '';
        return true;
    } catch (e) {
        privateDMState.backendAvailable = false;
        privateDMState.backendReason = e.message || 'private_messages table unavailable.';
        return false;
    }
}

async function _loadPrivateDMRows() {
    const uid = currentUser?.uid || currentUser?.id;
    if (!uid || !window.supabaseClient) return [];

    const { data, error } = await window.supabaseClient
        .from('private_messages')
        .select('*')
        .or('sender_id.eq.' + uid + ',receiver_id.eq.' + uid)
        .order('created_at', { ascending: true })
        .limit(600);

    if (error) throw error;
    return data || [];
}

async function _buildDMUserIndex(rows) {
    const ids = new Set();
    const uid = currentUser?.uid || currentUser?.id;
    rows.forEach(r => {
        const sid = r.sender_id;
        const rid = r.receiver_id;
        if (sid && sid !== uid) ids.add(sid);
        if (rid && rid !== uid) ids.add(rid);
    });

    const index = {};
    (profileDirectoryCache || []).forEach(u => {
        if (u.user_id) index[u.user_id] = u;
    });

    const missing = [...ids].filter(id => !index[id]);
    if (missing.length && window.supabaseClient) {
        const { data } = await window.supabaseClient
            .from('public_leaderboard')
            .select('user_id,name,avatar,avatar_url,level,xp_total')
            .in('user_id', missing);
        (data || []).forEach(u => { index[u.user_id] = u; });
    }

    const myName = dataManager.data?.social?.name || currentUser?.displayName || 'You';
    index[uid] = {
        user_id: uid,
        name: myName,
        avatar: dataManager.data?.social?.avatar || '👤',
        avatar_url: dataManager.data?.social?.avatarUrl || ''
    };

    privateDMState.userIndex = index;
}

function _dmMessageText(row) {
    return row.message || row.content || '';
}

function _formatDMTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleString(_lang === 'en' ? 'en-GB' : 'tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function _renderDMThreads() {
    const listEl = document.getElementById('dmThreadList');
    if (!listEl) return;

    const uid = currentUser?.uid || currentUser?.id;
    const byUser = {};
    privateDMState.rows.forEach(r => {
        const otherId = r.sender_id === uid ? r.receiver_id : r.sender_id;
        if (!otherId) return;
        if (!byUser[otherId]) byUser[otherId] = [];
        byUser[otherId].push(r);
    });

    const threadIds = Object.keys(byUser).sort((a, b) => {
        const aLast = byUser[a][byUser[a].length - 1]?.created_at || '';
        const bLast = byUser[b][byUser[b].length - 1]?.created_at || '';
        return aLast < bLast ? 1 : -1;
    });

    if (!threadIds.length) {
        listEl.innerHTML = '<div class="dm-empty">' + t('dmNoMessagesYet') + '</div>';
        return;
    }

    listEl.innerHTML = threadIds.map(id => {
        const rows = byUser[id];
        const last = rows[rows.length - 1];
        const meta = privateDMState.userIndex[id] || { name: t('profileUnknownUser') };
        const isActive = privateDMState.activeUserId === id;

        const unread = rows.filter(r => r.receiver_id === uid && r.sender_id === id && !r.read_at).length;
        return '<div class="dm-thread-item ' + (isActive ? 'active' : '') + '" onclick="openPrivateChatWithUser(decodeURIComponent(\'' + _encArg(id) + '\'),decodeURIComponent(\'' + _encArg(meta.name || t('profileUnknownUser')) + '\'))">'
            + '<div class="dm-thread-name">' + _escHtml(meta.name || t('profileUnknownUser')) + (unread ? ' (' + unread + ')' : '') + '</div>'
            + '<div class="dm-thread-preview">' + _escHtml(_dmMessageText(last)) + '</div>'
            + '</div>';
    }).join('');
}

function _renderDMConversation() {
    const msgEl = document.getElementById('dmChatMessages');
    const headEl = document.getElementById('dmChatHeader');
    if (!msgEl || !headEl) return;

    const uid = currentUser?.uid || currentUser?.id;
    const active = privateDMState.activeUserId;
    if (!active) {
        headEl.textContent = t('dmSelectConversation');
        msgEl.innerHTML = '<div class="dm-empty">' + t('dmStartConversationHint') + '</div>';
        return;
    }

    const user = privateDMState.userIndex[active] || { name: t('profileUnknownUser') };
    headEl.textContent = user.name || t('profileUnknownUser');

    const rows = privateDMState.rows.filter(r => {
        const sid = r.sender_id;
        const rid = r.receiver_id;
        return (sid === uid && rid === active) || (sid === active && rid === uid);
    });

    if (!rows.length) {
        msgEl.innerHTML = '<div class="dm-empty">' + t('dmSendFirstMessage') + '</div>';
        return;
    }

    msgEl.innerHTML = rows.map(r => {
        const me = r.sender_id === uid;
        return '<div class="dm-msg ' + (me ? 'me' : 'other') + '">'
            + _escHtml(_dmMessageText(r))
            + '<div class="dm-msg-time">' + _formatDMTime(r.created_at) + '</div>'
            + '</div>';
    }).join('');
    msgEl.scrollTop = msgEl.scrollHeight;
}

async function _markDMReadForActive() {
    const uid = currentUser?.uid || currentUser?.id;
    const active = privateDMState.activeUserId;
    if (!uid || !active || !window.supabaseClient) return;
    try {
        await window.supabaseClient
            .from('private_messages')
            .update({ read_at: new Date().toISOString() })
            .eq('receiver_id', uid)
            .eq('sender_id', active)
            .is('read_at', null);
    } catch (e) {
        console.warn('DM read update warning:', e.message);
    }
}

async function renderPrivateMessagingPanel() {
    const threadEl = document.getElementById('dmThreadList');
    const msgEl = document.getElementById('dmChatMessages');
    const inputEl = document.getElementById('dmMessageInput');
    if (!threadEl || !msgEl) return;

    if (inputEl && !inputEl.dataset.boundEnter) {
        inputEl.dataset.boundEnter = '1';
        inputEl.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (typeof window.sendCurrentDMMessage === 'function') window.sendCurrentDMMessage();
            }
        });
    }

    if (isGuest || !currentUser) {
        threadEl.innerHTML = '<div class="dm-empty">' + t('dmSignInRequired') + '</div>';
        msgEl.innerHTML = '<div class="dm-empty">' + t('dmSignInRequired') + '</div>';
        return;
    }

    const available = await _checkPrivateDMBackend();
    if (!available) {
        const reason = privateDMState.backendReason || 'private_messages table not found.';
        threadEl.innerHTML = '<div class="dm-empty">' + t('dmUnavailable') + '</div>';
        msgEl.innerHTML = '<div class="dm-empty">' + t('dmServerConfigRequired') + ' (' + _escHtml(reason) + ')</div>';
        return;
    }

    try {
        privateDMState.rows = await _loadPrivateDMRows();
        await _buildDMUserIndex(privateDMState.rows);
        _renderDMThreads();
        _renderDMConversation();
        await _markDMReadForActive();
    } catch (e) {
        threadEl.innerHTML = '<div class="dm-empty">' + t('dmLoadFailed') + '</div>';
        msgEl.innerHTML = '<div class="dm-empty">' + t('dmErrorPrefix') + _escHtml(e.message) + '</div>';
    }
}

window.refreshProfileMemberDirectory = function() {
    renderProfileMemberDirectory(true);
};

window.openPrivateChatWithUser = async function(userId, name) {
    if (!userId) return;
    if (typeof switchSection === 'function' && currentSection !== 'messages') {
        switchSection('messages');
    }
    privateDMState.activeUserId = userId;

    if (!privateDMState.userIndex[userId]) {
        privateDMState.userIndex[userId] = {
            user_id: userId,
            name: name || t('profileUnknownUser'),
            avatar: '👤',
            avatar_url: ''
        };
    }

    await renderPrivateMessagingPanel();
    const input = document.getElementById('dmMessageInput');
    if (input) input.focus();
};

window.sendCurrentDMMessage = async function() {
    const uid = currentUser?.uid || currentUser?.id;
    const targetId = privateDMState.activeUserId;
    const input = document.getElementById('dmMessageInput');
    const text = input ? input.value.trim() : '';

    if (!uid || !targetId || !text) {
        showNotification(t('dmSelectUserAndType'), 'info');
        return;
    }

    const sendPayloads = [
        { sender_id: uid, receiver_id: targetId, message: text },
        { sender_id: uid, receiver_id: targetId, content: text }
    ];

    let sent = false;
    let lastErr = null;
    for (const payload of sendPayloads) {
        try {
            const { error } = await window.supabaseClient.from('private_messages').insert(payload);
            if (!error) { sent = true; break; }
            lastErr = error;
        } catch (e) {
            lastErr = e;
        }
    }

    if (!sent) {
        showNotification(t('dmSendFailedPrefix') + (lastErr?.message || 'Unknown error'), 'error');
        return;
    }

    if (input) input.value = '';
    await renderPrivateMessagingPanel();
};

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

    // Onizlemeyi guncelle
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
    // avatarUrl modal icinde dogrudan set edildi, dokunmuyoruz

    dataManager.saveAll();
    closeEditProfile();
    renderProfilePage();
    updateHeaderUser();
    showNotification(t('profileUpdated'), 'success');
}

function selectAvatar(emoji) {
    document.getElementById('selectedAvatar').value = emoji;
    document.querySelectorAll('.avatar-option').forEach(btn =>
        btn.classList.toggle('selected', btn.textContent.trim() === emoji)
    );
    // Emoji secilince fotografi kaldir
    if (dataManager.data) dataManager.data.social.avatarUrl = null;
    _applyAvatar('avatarPreview', { avatar: emoji, avatarUrl: null });
}

function selectCoverColor(color) {
    document.getElementById('selectedCoverColor').value = color;
    document.querySelectorAll('.cc-opt').forEach(opt =>
        opt.classList.toggle('selected', opt.dataset.color === color)
    );
}

// ===== FOTOGRAF YUKLEME =====
function triggerAvatarUpload() {
    document.getElementById('avatarFileInput')?.click();
}

function handleAvatarUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showNotification(_lang === 'en' ? 'Please select an image file' : 'Lutfen bir gorsel dosyasi secin', 'error');
        return;
    }
    if (file.size > 3 * 1024 * 1024) {
        showNotification(_lang === 'en' ? "Image must be under 3MB" : "Gorsel 3MB'den kucuk olmali", 'error');
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

            // Onizle
            _applyAvatar('avatarPreview', { avatarUrl: dataUrl });

            // Kaydet (saveProfile'da da korunacak)
            if (dataManager.data) dataManager.data.social.avatarUrl = dataUrl;

            // Emoji secimini temizle
            document.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
            showNotification(_lang === 'en' ? 'Photo uploaded ✓' : 'Fotograf yuklendi ✓', 'success');
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
    showNotification(_lang === 'en' ? 'Photo removed' : 'Fotograf kaldirildi', 'info');
}

// ===== ACHIEVEMENTS =====
function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container || !dataManager.data) return;
    const unlocked = dataManager.data.achievements;
    const _a = (obj) => (typeof obj === 'object' && obj !== null)
        ? (obj[_lang] || obj.tr || Object.values(obj)[0])
        : obj;

    // Ozet banner
    const total    = ACHIEVEMENTS.length;
    const doneCount = unlocked.length;
    const pct      = Math.round((doneCount / total) * 100);
    const totalXP  = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).reduce((s, a) => s + (a.xp || 0), 0);

    // Basarimlari sirala: once kazanilanlar, sonra kilitliler
    const sorted = [...ACHIEVEMENTS].sort((a, b) => {
        const aD = unlocked.includes(a.id);
        const bD = unlocked.includes(b.id);
        if (aD && !bD) return -1;
        if (!aD && bD) return 1;
        return 0;
    });

    const rarityColor = { common: '#6b7280', uncommon: '#3b82f6', rare: '#8b5cf6', epic: '#ec4899', legendary: '#f59e0b' };

    container.innerHTML = `
        <!-- Ozet Bar -->
        <div style="grid-column:1/-1; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; padding:1.4rem 1.8rem; margin-bottom:.5rem;">
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
                <div>
                    <div style="font-size:1.1rem; font-weight:700; margin-bottom:.2rem;">🏆 ${_lang === 'en' ? 'Achievement Progress' : 'Basarim Ilerlemesi'}</div>
                    <div style="color:var(--text-secondary); font-size:.85rem;">${doneCount} / ${total} ${_lang === 'en' ? 'unlocked' : 'kazanildi'} · +${totalXP} XP</div>
                </div>
                <div style="font-size:2rem; font-weight:800; background:linear-gradient(135deg,#f59e0b,#ff3366); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">%${pct}</div>
            </div>
            <div style="height:8px; background:rgba(255,255,255,.07); border-radius:20px; overflow:hidden;">
                <div style="height:100%; width:${pct}%; background:linear-gradient(90deg,#ff3366,#f59e0b); border-radius:20px; transition:width .6s ease;"></div>
            </div>
        </div>
        ${sorted.map(ach => {
            const done = unlocked.includes(ach.id);
            const rCol = rarityColor[ach.rarity] || '#6b7280';
            return `<div class="ach-card${done ? ' unlocked' : ''}" style="${!done ? 'opacity:.5;' : ''}">
                <div class="ach-icon${done ? ' unlocked-icon' : ''}">${ach.icon}</div>
                <div class="ach-info">
                    <div class="ach-title">${_a(ach.title)}</div>
                    <div class="ach-desc">${_a(ach.desc)}</div>
                    <div style="display:flex;align-items:center;gap:.4rem;margin-top:.35rem;flex-wrap:wrap;">
                        ${ach.xp > 0 ? `<div class="ach-xp">+${ach.xp} XP</div>` : ''}
                        ${ach.rarity ? `<div style="font-size:.62rem;padding:1px 6px;border-radius:20px;background:rgba(255,255,255,.06);color:${rCol};font-weight:600;">${ach.rarity}</div>` : ''}
                    </div>
                </div>
                <div class="ach-status ${done ? 'done' : 'locked'}">${done ? '✓' : '🔒'}</div>
            </div>`;
        }).join('')}`;
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
    const completionRate = items.length ? Math.round((completed / items.length) * 100) : 0;

    const genreMap = {};
    items.forEach(i => {
        const gs = Array.isArray(i.genres) && i.genres.length ? i.genres : (i.genre ? [i.genre] : []);
        gs.forEach(g => {
            const key = String(g || '').trim();
            if (!key) return;
            genreMap[key] = (genreMap[key] || 0) + 1;
        });
    });
    const topGenres = Object.entries(genreMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const activityBuckets = Array.from({ length: 6 }, () => 0);
    items.forEach(i => {
        if (!i.addedDate) return;
        const diffDays = Math.floor((now - new Date(i.addedDate).getTime()) / dayMs);
        if (diffDays >= 0 && diffDays < 30) {
            const bucket = Math.floor(diffDays / 5);
            activityBuckets[Math.min(5, bucket)]++;
        }
    });
    const activityMax = Math.max(...activityBuckets, 1);

    const recentItems = [...items]
        .filter(i => i.addedDate)
        .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
        .slice(0, 5);

    const suggestions = [];
    if (planToWatch >= Math.max(10, completed * 2)) suggestions.push('Your backlog is stacking up. Try completing 3 items this week.');
    if (dropped >= Math.max(5, Math.floor(items.length * 0.2))) suggestions.push('Drop rate is high. Prioritize shorter titles (12-24 episodes).');
    if (anime / total > 0.7) suggestions.push('Your library is anime-heavy. Mix in manga/webtoon for variety.');
    if (completionRate >= 60) suggestions.push('Great consistency. Push for a 7-day completion streak challenge.');
    if (!suggestions.length) suggestions.push('Healthy balance detected. Keep rating titles to improve recommendations.');

    const bar = (label, val, tot, color) =>
        `<div class="bar-row">
            <div class="bar-header"><span>${label}</span><span style="font-weight:700;">${val}</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${tot > 0 ? (val/tot*100).toFixed(1) : 0}%;background:${color};"></div></div>
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
                    [t('streakLabel'), (dataManager.data.streak.count||0) + (_lang==='en'?' days':' gun')],
                    [t('longestStreak'), (dataManager.data.streak.longest||0) + (_lang==='en'?' days':' gun')]
                ].map(([l,v]) =>
                    `<div style="display:flex;justify-content:space-between;padding:.6rem 0;border-bottom:1px solid var(--border);">
                        <span style="color:var(--text-secondary);">${l}</span><strong>${v}</strong>
                    </div>`
                ).join('')}
            </div>
            <div class="analytics-kpi-grid">
                <div class="analytics-kpi"><span>Completion Rate</span><strong>${completionRate}%</strong></div>
                <div class="analytics-kpi"><span>Rated Titles</span><strong>${rated.length}</strong></div>
                <div class="analytics-kpi"><span>Active Watching</span><strong>${watching}</strong></div>
            </div>
        </div>
        <div class="chart-container"><h3 class="chart-title">Top Genres</h3>
            ${topGenres.length ? `<div class="analytics-chip-list">${topGenres.map(([name,count]) => `<span class="analytics-chip">${_escHtml(name)} · ${count}</span>`).join('')}</div>` : `<p style="color:var(--text-secondary);margin:0;">No genre data yet.</p>`}
            <div class="analytics-activity">
                ${activityBuckets.map((n, idx) => `<div class="activity-bar-wrap"><div class="activity-bar" style="height:${Math.max(14, Math.round((n/activityMax)*88))}px"></div><span>${idx*5+1}-${(idx+1)*5}</span></div>`).join('')}
            </div>
            <p style="margin-top:.7rem;color:var(--text-muted);font-size:.78rem;">Library adds in the last 30 days.</p>
        </div>
        <div class="chart-container"><h3 class="chart-title">Smart Suggestions</h3>
            <div class="insight-list">
                ${suggestions.map(s => `<div class="insight-item">💡 ${_escHtml(s)}</div>`).join('')}
            </div>
        </div>
        <div class="chart-container"><h3 class="chart-title">Recent Additions</h3>
            ${recentItems.length ? `<div class="recency-list">${recentItems.map(i => `<div class="recency-item"><span>${_escHtml(i.name || 'Untitled')}</span><small>${new Date(i.addedDate).toLocaleDateString(_lang === 'en' ? 'en-US' : 'tr-TR')}</small></div>`).join('')}</div>` : `<p style="color:var(--text-secondary);margin:0;">Add content to see timeline insights.</p>`}
        </div>`;
}

// ===== CALENDAR =====
// Bu haftanin Pazartesi baslangici ve Pazar bitisini hesapla
function _getWeekBounds() {
    const now   = new Date();
    const day   = now.getDay(); // 0=Paz,1=Pzt...
    // Pazartesi = gun 1; eger Pazar ise geri 6 gun
    const diffToMon = (day === 0) ? -6 : 1 - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + diffToMon);
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);
    return {
        start: Math.floor(mon.getTime() / 1000),
        end:   Math.floor(sun.getTime() / 1000),
        dates: Array.from({length:7}, (_,i) => {
            const d = new Date(mon);
            d.setDate(mon.getDate() + i);
            return d;
        })
    };
}

const ANILIST_WEEK_GQL = `
query ($page: Int, $perPage: Int, $start: Int, $end: Int) {
  Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage }
    airingSchedules(
      airingAt_greater: $start
      airingAt_lesser: $end
      sort: TIME
    ) {
      id
      episode
      airingAt
      media {
        id
                siteUrl
        title { romaji english }
        coverImage { medium color }
        averageScore
        popularity
        genres
        episodes
        format
                status
                seasonYear
                countryOfOrigin
      }
    }
  }
}`;

async function _fetchAniListCalendar() {
    const week = _getWeekBounds();
    const cacheKey = `cal_week_${week.start}`;
    const cached = APICache.get(cacheKey);
    if (cached) return cached;

    try {
        const pages = [];
        let hasNextPage = true;
        let page = 1;
        const maxPages = 6;

        while (hasNextPage && page <= maxPages) {
            const json = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    query: ANILIST_WEEK_GQL,
                    variables: { page, perPage: 50, start: week.start, end: week.end }
                })
            }).then(r => r.json());

            pages.push(json);
            hasNextPage = !!json?.data?.Page?.pageInfo?.hasNextPage;
            page++;
        }

        const allSchedules = pages.flatMap(j => j?.data?.Page?.airingSchedules || []);

        const byDay = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[] };
        const seenEpisode = new Set();

        allSchedules.forEach(s => {
            const media = s.media;
            if (!media || !media.title) return;
            const id  = media.id;
            const day = new Date(s.airingAt * 1000).getDay();
            const uniqKey = `${id}_${s.episode}`;
            if (seenEpisode.has(uniqKey)) return;
            seenEpisode.add(uniqKey);

            const entry = {
                id,
                name:       media.title.romaji || media.title.english || '?',
                nameEn:     media.title.english,
                score:      media.averageScore ? +((media.averageScore / 10).toFixed(1)) : null,
                popularity: media.popularity || 0,
                genres:     (media.genres || []).slice(0, 2),
                episode:    s.episode,
                totalEps:   media.episodes,
                cover:      media.coverImage?.medium,
                color:      media.coverImage?.color,
                airingAt:   s.airingAt,
                format:     media.format || 'ANIME',
                status:     media.status || null,
                seasonYear: media.seasonYear || null,
                country:    media.countryOfOrigin || null,
                siteUrl:    media.siteUrl || null
            };

            byDay[day].push(entry);
        });

        Object.keys(byDay).forEach(d => {
            byDay[d].sort((a, b) => {
                if (a.airingAt !== b.airingAt) return a.airingAt - b.airingAt;
                return b.popularity - a.popularity;
            });
        });

        APICache.set(cacheKey, byDay, true);
        return byDay;
    } catch(e) {
        console.warn('AniList Calendar error:', e.message);
        return null;
    }
}

async function renderCalendar() {
    const container = document.getElementById('weekdaysContainer');
    const summaryEl = document.getElementById('calendarSummary');
    const filterEl = document.getElementById('calendarTypeFilter');
    const searchEl = document.getElementById('calendarSearchInput');
    if (!container || !dataManager.data) return;

    const week     = _getWeekBounds();
    const dayNames = t('days');
    const dayJS    = [1, 2, 3, 4, 5, 6, 0];
    const myNames  = new Set(dataManager.data.items.map(i => (i.name || '').toLowerCase()));
    const todayJS  = new Date().getDay();

    if (filterEl) {
        const langTag = filterEl.dataset.lang || '';
        if (langTag !== 'en' || !filterEl.options.length) {
            const opts = [
                ['all', 'All releases'],
                ['in-library', 'In my library'],
                ['high-score', 'High rated (8+)'],
                ['today', 'Today only']
            ];
            filterEl.innerHTML = opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
            filterEl.dataset.lang = 'en';
        }
    }
    if (searchEl) searchEl.placeholder = 'Search title or genre...';

    // Legend
    const calSection = document.getElementById('calendarSection');
    if (calSection && !calSection.querySelector('.cal-legend')) {
        const legendEl = document.createElement('div');
        legendEl.className = 'cal-legend';
        legendEl.innerHTML = `
            <div class="cal-legend-item">
                <span class="cal-legend-pip" style="background:#10b981;"></span>
                <span>In your library</span>
            </div>
            <div class="cal-legend-item">
                <span class="cal-legend-pip" style="background:rgba(255,255,255,.18);"></span>
                <span>Not added yet</span>
            </div>`;
        container.parentElement.insertBefore(legendEl, container);
    }

    // Loading state
    container.className = 'weekdays';
    container.innerHTML = `<div class="cal-full-loading"><div class="cal-loading-spinner"></div><p>${t('calLoading')}</p></div>`;
    if (summaryEl) summaryEl.innerHTML = '';

    const byDay = await _fetchAniListCalendar();

    if (!byDay) {
        container.innerHTML = `<div class="cal-full-loading"><div style="font-size:2rem">⚠️</div><p>${t('calError')}</p></div>`;
        return;
    }

    const filterValue = filterEl ? filterEl.value : 'all';
    const searchValue = (searchEl?.value || '').trim().toLowerCase();

    const applyFilter = (arr, jsDay) => {
        return (arr || []).filter(a => {
            const inLib = myNames.has((a.name || '').toLowerCase()) || (a.nameEn && myNames.has((a.nameEn || '').toLowerCase()));
            if (filterValue === 'in-library' && !inLib) return false;
            if (filterValue === 'high-score' && !(a.score && a.score >= 8)) return false;
            if (filterValue === 'today' && jsDay !== todayJS) return false;
            if (!searchValue) return true;
            const text = `${(a.name || '').toLowerCase()} ${(a.nameEn || '').toLowerCase()} ${(a.genres || []).join(' ').toLowerCase()}`;
            return text.includes(searchValue);
        });
    };

    const totalEntries = Object.values(byDay).reduce((s, a) => s + a.length, 0);
    if (totalEntries === 0) {
        container.innerHTML = `<div class="cal-full-loading"><div style="font-size:2rem">📭</div><p>${t('calNoData')}</p></div>`;
        return;
    }

    const totalInLibrary = Object.values(byDay)
        .flat()
        .filter(a => myNames.has((a.name || '').toLowerCase()) || (a.nameEn && myNames.has((a.nameEn || '').toLowerCase()))).length;
    const dayCounts = dayJS.map(js => ({ js, count: (byDay[js] || []).length }));
    const topDay = dayCounts.sort((a, b) => b.count - a.count)[0];
    const topDayName = topDay ? dayNames[dayJS.indexOf(topDay.js)] : '-';

    if (summaryEl) {
        summaryEl.innerHTML = `
            <div class="cal-stat">
                <div class="cal-stat-label">Total episodes this week</div>
                <div class="cal-stat-value">${totalEntries}</div>
            </div>
            <div class="cal-stat">
                <div class="cal-stat-label">Matches in your library</div>
                <div class="cal-stat-value">${totalInLibrary}</div>
            </div>
            <div class="cal-stat">
                <div class="cal-stat-label">Busiest day</div>
                <div class="cal-stat-value">${topDayName}${topDay ? ` (${topDay.count})` : ''}</div>
            </div>`;
    }

    // Build the 7-column grid
    container.innerHTML = '';
    container.className = 'weekdays';

    let shownTotal = 0;

    dayNames.forEach((dayName, idx) => {
        const jsDay   = dayJS[idx];
        const isToday = (todayJS === jsDay);
        const dayDate = week.dates[idx];
        const dateStr = dayDate.toLocaleDateString(_lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'short' });
        const animes  = applyFilter(byDay[jsDay] || [], jsDay);
        const shown   = animes.slice(0, 20);
        shownTotal += shown.length;

        const col = document.createElement('div');
        col.className = 'cal-col' + (isToday ? ' cal-col--today' : '');

        col.innerHTML = `
            <div class="cal-col-header">
                <div class="cal-col-header-top">
                    <span class="cal-day-name">${dayName}</span>
                    ${isToday ? `<span class="cal-today-badge">${_lang === 'en' ? 'Today' : 'Bugun'}</span>` : ''}
                </div>
                <div class="cal-col-header-bottom">
                    <span class="cal-date-str">${dateStr}</span>
                    <span class="cal-ep-count">${animes.length ? animes.length + ' ep' : '—'}</span>
                </div>
            </div>
        `;

        const itemsWrap = document.createElement('div');
        itemsWrap.className = 'cal-items';

        if (shown.length === 0) {
            itemsWrap.innerHTML = `
                <div class="cal-empty">
                    <span class="cal-empty-icon">😴</span>
                    <span>${t('calNoAiring')}</span>
                </div>`;
        } else {
            shown.forEach(a => {
                const inLib      = myNames.has(a.name.toLowerCase()) || (a.nameEn && myNames.has((a.nameEn || '').toLowerCase()));
                const scoreColor = !a.score ? '#8892a4' : a.score >= 8 ? '#10b981' : a.score >= 6 ? '#f59e0b' : '#ef4444';
                const airTime    = new Date(a.airingAt * 1000).toLocaleTimeString(_lang === 'tr' ? 'tr-TR' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
                const accentColor = a.color || (inLib ? '#10b981' : 'rgba(255,255,255,0.08)');

                const itemObj = {
                    id: 'al_' + a.id,
                    name: a.name,
                    nameEn: a.nameEn || '',
                    type: 'anime',
                    poster: a.cover,
                    rating: a.score,
                    genres: a.genres || [],
                    episodes: a.totalEps,
                    anilistId: a.id,
                    status: a.status || null,
                    format: a.format || null,
                    source: 'anilist',
                    siteUrl: a.siteUrl || null
                };
                const safeItem = JSON.stringify(itemObj).replace(/'/g, "\'").replace(/"/g, '&quot;');

                const card = document.createElement('div');
                card.className = 'cal-card' + (inLib ? ' cal-card--inlib' : '');
                card.setAttribute('title', `${a.name} — Bolum ${a.episode}${a.totalEps ? '/'+a.totalEps : ''} • ${airTime}`);
                card.onclick = () => openDetailPage(safeItem);

                card.innerHTML = `
                    <div class="cal-card-cover-wrap">
                        ${a.cover
                            ? `<img class="cal-card-cover" src="${a.cover}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\'cal-card-cover-fb\'>🎬</div>'">`
                            : '<div class="cal-card-cover-fb">🎬</div>'
                        }
                    </div>
                    <div class="cal-card-body">
                        <div class="cal-card-title">${a.name}</div>
                        <div class="cal-card-meta">
                            <span class="cal-card-time">⏰ ${airTime}</span>
                            <span class="cal-card-ep">Bl.${a.episode}${a.totalEps ? '<span class="cal-card-ep-total">/' + a.totalEps + '</span>' : ''}</span>
                            ${a.format ? `<span class="cal-card-ep">${a.format}</span>` : ''}
                            ${a.score ? `<span class="cal-card-score" style="color:${scoreColor}">★${a.score}</span>` : ''}
                        </div>
                        ${a.genres && a.genres.length ? `<div class="cal-card-genres">${a.genres.slice(0,2).map(g => `<span class="cal-card-genre">${g}</span>`).join('')}</div>` : ''}
                    </div>
                `;
                itemsWrap.appendChild(card);
            });

            if (animes.length > 20) {
                const more = document.createElement('div');
                more.className = 'cal-more';
                more.textContent = `+${animes.length - 20} ${_lang === 'en' ? 'more' : 'daha'}`;
                itemsWrap.appendChild(more);
            }
        }

        col.appendChild(itemsWrap);
        container.appendChild(col);
    });

    if (shownTotal === 0) {
        container.innerHTML = `<div class="cal-full-loading"><div style="font-size:2rem">🔎</div><p>No matches for your filters.</p></div>`;
    }
}

function _injectCalendarStyles() {
    return;
}


async function syncCalendar() {
    // Bu haftanin cache key'ini temizle
    const week = _getWeekBounds();
    APICache.clear(`cal_week_${week.start}`);
    APICache.clear('cal_anilist_v2'); // eski cache'leri de temizle
    APICache.clear('cal_schedule');
    showNotification(_lang === 'en' ? 'Syncing calendar... 📡' : 'Takvim guncelleniyor... 📡', 'info');
    await renderCalendar();
    showNotification(t('calSynced'), 'success');
}

// ===== AI =====
function renderAISection() {
    if (!dataManager.data) return;
    const items = dataManager.data.items || [];
    const rated = items.filter(i => i.rating > 0);
    const avg   = rated.length > 0 ? (rated.reduce((a,i) => a + i.rating, 0) / rated.length).toFixed(1) : '-';

    const genres = {};
    items.forEach(i => { if (i.genre) genres[i.genre] = (genres[i.genre] || 0) + 1; });
    const topGenre = Object.entries(genres).sort((a,b) => b[1]-a[1])[0]?.[0] || '-';

    const completed = items.filter(i => i.status === 'completed').length;
    const watching  = items.filter(i => i.status === 'watching').length;
    const ratedPct = items.length > 0 ? (rated.length / items.length) : 0;
    const completedPct = items.length > 0 ? (completed / items.length) : 0;
    const confidence = Math.round(Math.max(52, Math.min(98,
        52 + (items.length * 1.15) + (ratedPct * 20) + (completedPct * 10)
    )));

    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('aiWatchingPattern', watching + (_lang==='en' ? ' active' : ' aktif'));
    set('aiFavoriteGenres', topGenre);
    set('aiAvgRating', avg);
    set('aiLibrarySize', items.length);
    set('aiCompletedCount', completed);
    set('aiAccuracyVal', confidence + '%');
    set('aiAccuracyRingVal', confidence + '%');

    const barFill = document.querySelector('.ai-dash-bar-fill');
    if (barFill) {
        const pct = items.length > 0 ? Math.min(100, Math.round(watching / items.length * 100)) : 0;
        barFill.style.width = Math.max(5, pct) + '%';
    }

    const emptyState = document.getElementById('aiEmptyState');
    const recsSection = document.querySelectorAll('.ai-recs-section');
    if (items.length < 3) {
        if (emptyState) emptyState.style.display = 'block';
        recsSection.forEach(s => s.style.display = 'none');
    } else {
        if (emptyState) emptyState.style.display = 'none';
        recsSection.forEach(s => s.style.display = 'block');
        generateAIRecommendations();
    }
}

let _aiRetryCount = 0;
function generateAIRecommendations() {
    if (!allContent || allContent.length === 0) {
        if (_aiRetryCount >= 5) {
            _aiRetryCount = 0;
            showNotification(_lang==='en'?'Could not load content. Please refresh.':'Icerik yuklenemedi. Sayfayi yenileyin.', 'error');
            return;
        }
        _aiRetryCount++;
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
        .slice(0,4).map(e => e[0]);

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

    renderMediaRow('aiRecommendations', recs.slice(0, 12));
    renderMediaRow('aiSimilarRecommendations', recs.slice(12, 24));
    _renderAITasteCard(myItems, topGenres);
    showNotification(t('aiUpdated'), 'success');
}

function _renderAITasteCard(myItems, topGenres) {
    const card = document.getElementById('aiAnalysisCard');
    const textEl = document.getElementById('aiAnalysisText');
    const tagsEl = document.getElementById('aiGenreTags');
    if (!card || !textEl) return;

    card.style.display = 'block';

    if (myItems.length === 0) {
        textEl.textContent = _lang==='en'
            ? 'Add items to your library to see your personalized analysis!'
            : 'Kutuphanene icerik ekledikce sana ozel analiz burada gorunecek!';
        return;
    }

    const completed = myItems.filter(i => i.status==='completed').length;
    const rated     = myItems.filter(i => i.rating > 0);
    const avg       = rated.length > 0 ? (rated.reduce((a,i) => a+i.rating, 0)/rated.length).toFixed(1) : null;
    const topFav    = myItems.filter(i => i.rating >= 5).map(i => i.name).slice(0, 3);
    const total     = myItems.length;

    let text = '';
    if (_lang === 'en') {
        if (topGenres.length > 0) { text += `You gravitate toward ${topGenres[0]}`; if (topGenres[1]) text += ` and ${topGenres[1]}`; text += '. '; }
        if (topFav.length > 0) text += `You rated ${topFav.slice(0,2).join(' and ')} highly. `;
        if (avg) {
            const n = parseFloat(avg);
            if (n >= 4.2) text += 'You have refined taste and high standards. ';
            else if (n >= 3) text += 'Your ratings are balanced and thoughtful. ';
            else text += "You're still exploring — try more titles! ";
        }
        if (completed > 0 && total > 0) {
            const rate = Math.round(completed/total*100);
            if (rate >= 70) text += `You complete ${rate}% of what you start — very committed! `;
            else if (rate >= 40) text += `Your completion rate is ${rate}%. `;
        }
        if (topGenres.length > 0) text += `Recs are ranked by your ${topGenres.slice(0,2).join(' & ')} preference.`;
        else text += 'Rate more titles to personalize your recommendations.';
    } else {
        if (topGenres.length > 0) { text += `${topGenres[0]} turunu cok seviyorsun`; if (topGenres[1]) text += `, ${topGenres[1]} de favorilerin arasinda`; text += '. '; }
        if (topFav.length > 0) text += `${topFav.slice(0,2).join(' ve ')} icin yuksek puan verdin. `;
        if (avg) {
            const n = parseFloat(avg);
            if (n >= 4.2) text += 'Rafine bir zevkin var. ';
            else if (n >= 3) text += 'Dengeli degerlendirmeler yapiyorsun. ';
            else text += 'Hala kesif asamandasin! ';
        }
        if (completed > 0 && total > 0) {
            const rate = Math.round(completed/total*100);
            if (rate >= 70) text += `Basladiklarinin %${rate}'ini bitiriyorsun. `;
        }
        if (topGenres.length > 0) text += `Oneriler ${topGenres.slice(0,2).join(' ve ')} zevkine gore siralanmistir.`;
        else text += 'Daha fazla puan verdikce oneriler kisisellesecek.';
    }

    textEl.textContent = text;

    if (tagsEl && topGenres.length > 0) {
        tagsEl.innerHTML = '';
        topGenres.forEach(g => {
            const tag = document.createElement('span');
            tag.className = 'ai-genre-tag';
            tag.textContent = g;
            tagsEl.appendChild(tag);
        });
    }
}

async function refreshAIAnalysis() {
    showNotification(_lang === 'en' ? 'Refreshing AI data... ⚡' : 'AI verisi yenileniyor... ⚡', 'info');

    // AI onerilerinin gercekten degismesi icin tum icerik cache'lerini temizle.
    const keysToClear = ['all_v7', 'all_v7_fast', 'season_v7', 'jk_season', 'al_seasonal'];
    keysToClear.forEach(k => {
        try { APICache.clear(k); } catch(e) {}
    });

    try {
        contentLoaded = false;
        contentLoading = false;
        allContent = [];
        trendingContent = [];
        seasonContent = [];

        await loadContentFromAPI();
        renderAISection();
        showNotification(_lang === 'en' ? 'AI fully refreshed! 🤖' : 'AI tamamen yenilendi! 🤖', 'success');
    } catch (e) {
        console.error('AI hard refresh failed:', e);
        showNotification(_lang === 'en' ? 'AI refresh failed.' : 'AI yenileme basarisiz.', 'error');
    }
}



// ===== SOCIAL =====
function shareProfile() { copyProfileLink(); }

function shareToTwitter() {
    if (!dataManager.data) return;
    const count = dataManager.data.items.length;
    const text = _lang==='en'
        ? `Tracking ${count} titles on OniList! 🎌\n#OniList #Anime`
        : `OniList'te ${count} icerik takip ediyorum! 🎌\n#OniList #Anime`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
}

function copyProfileLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => showNotification(t('profileLink'), 'success'))
        .catch(() => showNotification(t('profileLinkFail'), 'error'));
}

// ===== EXPORT / IMPORT =====
function exportData(format) {
    if (!dataManager.data) { showNotification(_lang==='en'?'No data to export!':'Disa aktarilacak veri yok!', 'error'); return; }
    const content = format === 'json' ? dataManager.exportJSON() : dataManager.exportCSV();
    const type    = format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;';
    const blob    = new Blob([content], { type });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href = url;
    a.download = 'onilist-' + Date.now() + '.' + format;
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