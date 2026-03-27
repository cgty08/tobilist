// XP SYSTEM v3.0 - OniList Kapsamli Level & Unvan Sistemi

// ===== XP ODULLERi =====
// Tasarim prensibi: Icerik eklemek az odul, kaliteli etkilesimler daha fazla odul
const XP_REWARDS = {
    // Kutuphane islemleri — XP YOK (dongu onleme)
    additem:              0,   // Icerik eklemek XP vermiyor
    completeitem:         0,   // Tamamladim degistirmek XP vermiyor
    dropitem:             0,   // Biraktim XP vermiyor
    startWatching:        0,   // Izliyorum XP vermiyor
    updateProgress:       0,   // Bolum guncellemek XP vermiyor

    // Etkilesim odulleri — gercek emek gerektiren seyler
    writeReview:         50,   // Yorum yazmak (en az 50 karakter) — 1 icerige 1 kez
    writeLongReview:    100,   // Detayli yorum (en az 200 karakter) — 1 icerige 1 kez
    rateitem:             0,   // Puan vermek tek basina XP vermiyor (reviewla birlikte olsun)
    addNote:              0,   // Not eklemek XP vermiyor

    // Giris & streak odulleri — ana XP kaynagi
    dailyLogin:          20,   // Gunluk giris
    weekStreak:         150,   // 7 gun streak
    monthStreak:        750,   // 30 gun streak

    // Bolum takibi — kaldirildi (dongu yapilabilir)
    episodeMilestone25:   0,
    episodeMilestone50:   0,
    episodeMilestone100:  0,
    hundredEpisodes:      0,
    addToFavorite:        0,
    firstOfType:          0,
};

// ===== LEVEL UNVAN SISTEMI =====
const LEVEL_TITLES = [
    { min: 1,  max: 2,   title: 'Acemi Izleyici',  icon: '🌱', color: '#6b7280' },
    { min: 3,  max: 4,   title: 'Merakli Seyirci', icon: '👀', color: '#3b82f6' },
    { min: 5,  max: 7,   title: 'Anime Meraklisi', icon: '🎌', color: '#8b5cf6' },
    { min: 8,  max: 10,  title: 'Seri Takipcisi',  icon: '📺', color: '#ec4899' },
    { min: 11, max: 14,  title: 'Otaku Adayi',     icon: '⚡', color: '#f59e0b' },
    { min: 15, max: 19,  title: 'Gercek Otaku',    icon: '🔥', color: '#ef4444' },
    { min: 20, max: 24,  title: 'Anime Uzmani',    icon: '🎯', color: '#10b981' },
    { min: 25, max: 29,  title: 'Manga Ustasi',    icon: '📚', color: '#06b6d4' },
    { min: 30, max: 39,  title: 'Efsane Otaku',    icon: '👑', color: '#f97316' },
    { min: 40, max: 49,  title: 'Anime Lordu',     icon: '🏆', color: '#eab308' },
    { min: 50, max: 999, title: 'Olumsuz Weeb',    icon: '💎', color: '#a855f7' },
];

function getLevelTitle(level) {
    return LEVEL_TITLES.find(t => level >= t.min && level <= t.max) || LEVEL_TITLES[LEVEL_TITLES.length - 1];
}

// ===== BASARiMLAR =====
// Her basarim hem TR hem EN title/desc iceriyor
const ACHIEVEMENTS = [
    // Koleksiyon
    { id: 'first_item',       icon: '🎬',
      title: { tr: 'Ilk Adim',         en: 'First Step'      },
      desc:  { tr: 'Ilk icerigini ekle', en: 'Add your first entry' },
      xp: 50,   rarity: 'common',    check: (d) => d.items.length >= 1 },
    { id: 'five_items',       icon: '📋',
      title: { tr: 'Baslangic',        en: 'Getting Started' },
      desc:  { tr: '5 icerik ekle',    en: 'Add 5 entries'   },
      xp: 30,   rarity: 'common',    check: (d) => d.items.length >= 5 },
    { id: 'ten_items',        icon: '📚',
      title: { tr: 'Koleksiyoncu',     en: 'Collector'       },
      desc:  { tr: '10 icerik ekle',   en: 'Add 10 entries'  },
      xp: 100,  rarity: 'common',    check: (d) => d.items.length >= 10 },
    { id: 'twentyfive_items', icon: '📦',
      title: { tr: 'Arsiv Kurucusu',   en: 'Archive Founder' },
      desc:  { tr: '25 icerik ekle',   en: 'Add 25 entries'  },
      xp: 200,  rarity: 'uncommon',  check: (d) => d.items.length >= 25 },
    { id: 'fifty_items',      icon: '🏛️',
      title: { tr: 'Arsivci',          en: 'Archivist'       },
      desc:  { tr: '50 icerik ekle',   en: 'Add 50 entries'  },
      xp: 350,  rarity: 'rare',      check: (d) => d.items.length >= 50 },
    { id: 'hundred_items',    icon: '💯',
      title: { tr: 'Yuzler Kulubu',    en: 'Century Club'    },
      desc:  { tr: '100 icerik ekle',  en: 'Add 100 entries' },
      xp: 700,  rarity: 'epic',      check: (d) => d.items.length >= 100 },
    { id: 'twohundred_items', icon: '🌌',
      title: { tr: 'Icerik Devi',      en: 'Content Giant'   },
      desc:  { tr: '200 icerik ekle',  en: 'Add 200 entries' },
      xp: 1500, rarity: 'legendary', check: (d) => d.items.length >= 200 },
    // Tamamlama
    { id: 'first_complete',   icon: '✅',
      title: { tr: 'Tamamlayici',      en: 'Finisher'        },
      desc:  { tr: 'Ilk serisini bitir', en: 'Complete your first series' },
      xp: 75,   rarity: 'common',    check: (d) => d.items.filter(i=>i.status==='completed').length >= 1 },
    { id: 'five_complete',    icon: '🎖️',
      title: { tr: 'Azimli',           en: 'Determined'      },
      desc:  { tr: '5 seri tamamla',   en: 'Complete 5 series' },
      xp: 150,  rarity: 'common',    check: (d) => d.items.filter(i=>i.status==='completed').length >= 5 },
    { id: 'ten_complete',     icon: '🏅',
      title: { tr: 'Maratonci',        en: 'Marathoner'      },
      desc:  { tr: '10 seri tamamla',  en: 'Complete 10 series' },
      xp: 300,  rarity: 'uncommon',  check: (d) => d.items.filter(i=>i.status==='completed').length >= 10 },
    { id: 'twentyfive_comp',  icon: '🎗️',
      title: { tr: 'Seri Katili',      en: 'Series Slayer'   },
      desc:  { tr: '25 seri tamamla',  en: 'Complete 25 series' },
      xp: 600,  rarity: 'rare',      check: (d) => d.items.filter(i=>i.status==='completed').length >= 25 },
    { id: 'fifty_complete',   icon: '⚔️',
      title: { tr: 'Izleme Canavari',  en: 'Watch Monster'   },
      desc:  { tr: '50 seri tamamla',  en: 'Complete 50 series' },
      xp: 1000, rarity: 'epic',      check: (d) => d.items.filter(i=>i.status==='completed').length >= 50 },
    { id: 'hundred_complete', icon: '🦁',
      title: { tr: 'Efsane Izleyici',  en: 'Legendary Viewer'},
      desc:  { tr: '100 seri tamamla', en: 'Complete 100 series' },
      xp: 2000, rarity: 'legendary', check: (d) => d.items.filter(i=>i.status==='completed').length >= 100 },
    // Puanlama
    { id: 'first_rate',       icon: '⭐',
      title: { tr: 'Elestirmen',       en: 'Critic'          },
      desc:  { tr: 'Ilk puanini ver',  en: 'Give your first rating' },
      xp: 20,   rarity: 'common',    check: (d) => d.items.filter(i=>i.rating>0).length >= 1 },
    { id: 'ten_rated',        icon: '🌟',
      title: { tr: 'Puanci',           en: 'Rater'           },
      desc:  { tr: '10 icerigi puanla', en: 'Rate 10 entries' },
      xp: 80,   rarity: 'common',    check: (d) => d.items.filter(i=>i.rating>0).length >= 10 },
    { id: 'perfect_score',    icon: '💫',
      title: { tr: 'Mukemmeliyetci',   en: 'Perfectionist'   },
      desc:  { tr: 'Bir icerige 10/10 ver', en: 'Give a 10/10 rating' },
      xp: 50,   rarity: 'uncommon',  check: (d) => d.items.filter(i=>i.rating>=10).length >= 1 },
    { id: 'harsh_critic',     icon: '😤',
      title: { tr: 'Acimasiz Kritik',  en: 'Harsh Critic'    },
      desc:  { tr: 'Bir icerige 1/10 ver', en: 'Give a 1/10 rating' },
      xp: 30,   rarity: 'uncommon',  check: (d) => d.items.filter(i=>i.rating===1).length >= 1 },
    // Yorum & Etkilesim
    { id: 'first_review',     icon: '✍️',
      title: { tr: 'Ilk Kalemim',      en: 'First Review'    },
      desc:  { tr: 'Ilk yorumunu yaz', en: 'Write your first review' },
      xp: 50,   rarity: 'common',    check: (d) => (d.reviewCount||0) >= 1 },
    { id: 'five_reviews',     icon: '📝',
      title: { tr: 'Yorumcu',          en: 'Reviewer'        },
      desc:  { tr: '5 yorum yaz',      en: 'Write 5 reviews' },
      xp: 150,  rarity: 'uncommon',  check: (d) => (d.reviewCount||0) >= 5 },
    { id: 'twenty_reviews',   icon: '🖊️',
      title: { tr: 'Kalem Ustasi',     en: 'Pen Master'      },
      desc:  { tr: '20 yorum yaz',     en: 'Write 20 reviews'},
      xp: 500,  rarity: 'rare',      check: (d) => (d.reviewCount||0) >= 20 },
    // Cesitlilik
    { id: 'all_types',        icon: '🌈',
      title: { tr: 'Cok Yonlu',        en: 'Versatile'       },
      desc:  { tr: 'Anime, manga ve webtoon ekle', en: 'Add anime, manga and webtoon' },
      xp: 80,   rarity: 'uncommon',  check: (d) => { const t=new Set(d.items.map(i=>i.type)); return t.has('anime')&&t.has('manga')&&t.has('webtoon'); } },
    { id: 'all_status',       icon: '🎭',
      title: { tr: 'Her Statuden',     en: 'Status Master'   },
      desc:  { tr: 'Tum durum kategorilerini kullan', en: 'Use all status categories' },
      xp: 60,   rarity: 'uncommon',  check: (d) => { const s=new Set(d.items.map(i=>i.status)); return s.has('watching')&&s.has('completed')&&s.has('plantowatch')&&s.has('dropped'); } },
    // Streak
    { id: 'three_streak',     icon: '🔥',
      title: { tr: 'Alev Aldi',        en: 'On Fire'         },
      desc:  { tr: '3 gun ust uste giris yap', en: 'Login 3 days in a row' },
      xp: 30,   rarity: 'common',    check: (d) => d.streak.count >= 3 },
    { id: 'week_streak',      icon: '🔥',
      title: { tr: 'Sadik Takipci',    en: 'Loyal Fan'       },
      desc:  { tr: '7 gun ust uste giris yap', en: 'Login 7 days in a row' },
      xp: 100,  rarity: 'uncommon',  check: (d) => d.streak.count >= 7 },
    { id: 'twoweek_streak',   icon: '💥',
      title: { tr: 'Kararli',          en: 'Committed'       },
      desc:  { tr: '14 gun ust uste giris yap', en: 'Login 14 days in a row' },
      xp: 200,  rarity: 'rare',      check: (d) => d.streak.count >= 14 },
    { id: 'month_streak',     icon: '💎',
      title: { tr: 'Efsane',           en: 'Legendary'       },
      desc:  { tr: '30 gun ust uste giris yap', en: 'Login 30 days in a row' },
      xp: 500,  rarity: 'epic',      check: (d) => d.streak.count >= 30 },
    { id: 'three_month',      icon: '🌙',
      title: { tr: 'Gece Bekcisi',     en: 'Night Guardian'  },
      desc:  { tr: '90 gun ust uste giris yap', en: 'Login 90 days in a row' },
      xp: 1500, rarity: 'legendary', check: (d) => d.streak.count >= 90 },
    // Level
    { id: 'level5',           icon: '🚀',
      title: { tr: 'Yukselen Yildiz',  en: 'Rising Star'     },
      desc:  { tr: "Seviye 5'e ulas",  en: 'Reach level 5'   },
      xp: 0,    rarity: 'common',    check: (d) => d.xp.level >= 5 },
    { id: 'level10',          icon: '👑',
      title: { tr: 'Anime Lordu',      en: 'Anime Lord'      },
      desc:  { tr: "Seviye 10'a ulas", en: 'Reach level 10'  },
      xp: 0,    rarity: 'uncommon',  check: (d) => d.xp.level >= 10 },
    { id: 'level20',          icon: '💎',
      title: { tr: 'Elmas Seviye',     en: 'Diamond Rank'    },
      desc:  { tr: "Seviye 20'ye ulas", en: 'Reach level 20' },
      xp: 0,    rarity: 'rare',      check: (d) => d.xp.level >= 20 },
    { id: 'level30',          icon: '🌟',
      title: { tr: 'Grandmaster',      en: 'Grandmaster'     },
      desc:  { tr: "Seviye 30'a ulas", en: 'Reach level 30'  },
      xp: 0,    rarity: 'epic',      check: (d) => d.xp.level >= 30 },
    { id: 'level50',          icon: '🦄',
      title: { tr: 'Olumsuz',          en: 'immortal'        },
      desc:  { tr: "Seviye 50'ye ulas", en: 'Reach level 50' },
      xp: 0,    rarity: 'legendary', check: (d) => d.xp.level >= 50 },
    // Ozel
    { id: 'dropped_low',      icon: '🗑️',
      title: { tr: 'Secici',           en: 'Selective'       },
      desc:  { tr: '5 seri birak',     en: 'Drop 5 series'   },
      xp: 40,   rarity: 'common',    check: (d) => d.items.filter(i=>i.status==='dropped').length >= 5 },
    { id: 'planner',          icon: '📅',
      title: { tr: 'Planlayici',       en: 'Planner'         },
      desc:  { tr: '10 icerik planla', en: 'Plan 10 entries' },
      xp: 50,   rarity: 'common',    check: (d) => d.items.filter(i=>i.status==='plantowatch').length >= 10 },
    { id: 'early_bird',       icon: '🌅',
      title: { tr: 'Erken Kus',        en: 'Early Bird'      },
      desc:  { tr: 'Sabah 6-9 arasi giris yap', en: 'Login between 6-9 AM' },
      xp: 25,   rarity: 'uncommon',  check: () => { const h=new Date().getHours(); return h>=6&&h<9; } },
    { id: 'night_owl',        icon: '🦉',
      title: { tr: 'Gece Kusu',        en: 'Night Owl'       },
      desc:  { tr: 'Gece yarisi 00-04 arasi giris yap', en: 'Login between midnight and 4 AM' },
      xp: 25,   rarity: 'uncommon',  check: () => { const h=new Date().getHours(); return h>=0&&h<4; } },
];

const RARITY_COLORS = {
    common:    { bg:'rgba(107,114,128,0.15)', border:'rgba(107,114,128,0.4)', text:'#9ca3af', label:'Yaygin'  },
    uncommon:  { bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.4)',  text:'#60a5fa', label:'Nadir'   },
    rare:      { bg:'rgba(139,92,246,0.15)',  border:'rgba(139,92,246,0.4)',  text:'#a78bfa', label:'Ender'   },
    epic:      { bg:'rgba(236,72,153,0.15)',  border:'rgba(236,72,153,0.4)',  text:'#f472b6', label:'Epik'    },
    legendary: { bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.5)', text:'#fbbf24', label:'Efsane'  },
};

// ===== XP GÜVENLİK KATMANI =====
const _XPSecurity = (() => {
    // İzin verilen XP miktarları ve sebepleri — bunların dışında hiçbir şey kabul edilmez
    const ALLOWED_XP_EVENTS = new Map([
        ['writeReview',    50 ],
        ['writeLongReview',100],
        ['dailyLogin',     20 ],
        ['weekStreak',     150],
        ['monthStreak',    750],
        ['achievement',    null], // achievement XP değişken olabilir, ayrıca kontrol edilir
    ]);

    // Maksimum izin verilen achievement XP'si
    const MAX_ACHIEVEMENT_XP = 2000;

    // Rate limiting: hangi event ne zaman son tetiklendi
    const _lastFired = {};

    // Cooldown süreleri (ms)
    const COOLDOWNS = {
        writeReview:     0,        // Her içerik için 1 kez (içerik bazında kontrol ayrıca var)
        writeLongReview: 0,
        dailyLogin:      20 * 60 * 60 * 1000, // 20 saat
        weekStreak:      6 * 24 * 60 * 60 * 1000,
        monthStreak:     25 * 24 * 60 * 60 * 1000,
        achievement:     0,
    };

    // XP session sayacı — tek oturumda kazanılabilecek max XP
    const SESSION_XP_LIMIT = 5000;
    let _sessionXP = 0;

    return {
        /**
         * Belirli bir event için XP verilmesine izin var mı?
         * @param {string} eventKey - ALLOWED_XP_EVENTS anahtarı
         * @param {number} amount   - istenen XP miktarı
         * @returns {boolean}
         */
        canGrant(eventKey, amount) {
            // 1. Event whitelist kontrolü
            if (!ALLOWED_XP_EVENTS.has(eventKey)) {
                console.warn('[XPSecurity] Bilinmeyen XP eventi reddedildi:', eventKey);
                return false;
            }

            // 2. Miktar kontrolü
            const allowed = ALLOWED_XP_EVENTS.get(eventKey);
            if (eventKey !== 'achievement' && allowed !== null && amount !== allowed) {
                console.warn('[XPSecurity] Geçersiz XP miktarı reddedildi:', amount, 'beklenen:', allowed);
                return false;
            }
            if (eventKey === 'achievement' && (amount < 0 || amount > MAX_ACHIEVEMENT_XP)) {
                console.warn('[XPSecurity] Achievement XP sınırı aşıldı:', amount);
                return false;
            }

            // 3. Rate limiting
            const cd = COOLDOWNS[eventKey] || 0;
            if (cd > 0) {
                const last = _lastFired[eventKey] || 0;
                if (Date.now() - last < cd) {
                    console.warn('[XPSecurity] Cooldown aktif, event reddedildi:', eventKey);
                    return false;
                }
            }

            // 4. Session XP limiti
            if (_sessionXP + amount > SESSION_XP_LIMIT) {
                console.warn('[XPSecurity] Oturum XP limiti aşıldı. Kalan limit:', SESSION_XP_LIMIT - _sessionXP);
                return false;
            }

            return true;
        },

        /**
         * XP verildiğinde çağır — sayaçları günceller
         */
        record(eventKey, amount) {
            _lastFired[eventKey] = Date.now();
            _sessionXP += amount;
        },

        /**
         * Mevcut toplam XP'nin makul aralıkta olup olmadığını kontrol eder
         * (Supabase'e kaydetmeden önce dataManager.saveAll() tarafından çağrılır)
         */
        validateTotals(xpData) {
            if (typeof xpData.total !== 'number' || xpData.total < 0 || xpData.total > 9_999_999) return false;
            if (typeof xpData.level !== 'number' || xpData.level < 1 || xpData.level > 999) return false;
            if (typeof xpData.current !== 'number' || xpData.current < 0) return false;
            // Level ile total XP tutarsızlığı (hile tespiti)
            // Level 1'de bile minimum 0 XP, level 50'de yaklaşık 300*1.6^49 ≈ 5M XP gerekir
            // Basit kontrol: level > 1 ise total XP en az xpPerLevel olmalı
            const minExpected = Math.floor(300 * Math.pow(1.6, xpData.level - 2)); // level-1 için gereken
            if (xpData.level > 1 && xpData.total < minExpected * 0.5) {
                console.warn('[XPSecurity] XP/Level tutarsızlığı tespit edildi. Level:', xpData.level, 'Total:', xpData.total);
                return false;
            }
            return true;
        },

        resetSession() {
            _sessionXP = 0;
        }
    };
})();

// ===== XP CLASS =====
class XPSystem {
    constructor() {
        this.xpPerLevel = 300;    // Eskiden 120 — cok daha yuksek baz
        this.xpMultiplier = 1.6;  // Eskiden 1.4 — her level daha da zorlasiyor
    }

    /**
     * XP ekler.
     * @param {number} amount   - XP miktarı
     * @param {string} reason   - Görünen sebep (toast için)
     * @param {boolean} silent  - Toast gösterme
     * @param {string} eventKey - Güvenlik doğrulaması için event anahtarı (zorunlu iç kullanım)
     */
    addXP(amount, reason = '', silent = false, eventKey = '') {
        if (!dataManager.data) return;

        // ── GÜVENLİK: eventKey yoksa veya geçersizse reddet ──
        // Dışarıdan (konsol, uzantı vs.) eventKey olmadan çağrı gelirse bloke et
        if (!eventKey) {
            // Sadece stack'te dahili çağrı var mı kontrol et
            // Konsol çağrıları eventKey içermez → reddedilir
            console.warn('[XPSecurity] eventKey eksik — XP ekleme reddedildi. Kaynak:', reason);
            return;
        }

        if (!_XPSecurity.canGrant(eventKey, amount)) return;

        const xpData = dataManager.data.xp;
        xpData.current += amount;
        xpData.total   += amount;

        // Güvenlik doğrulaması geçince kaydet
        _XPSecurity.record(eventKey, amount);

        let leveled = false;
        while (xpData.current >= this.getRequiredXP(xpData.level)) {
            xpData.current -= this.getRequiredXP(xpData.level);
            xpData.level++;
            leveled = true;
            this.showLevelUpModal(xpData.level);
        }

        dataManager.saveAll();
        this.updateUI();
        if (!silent && reason) this._showXPToast(amount, reason);
        if (leveled) checkAchievements();
    }

    getRequiredXP(level) {
        return Math.floor(this.xpPerLevel * Math.pow(this.xpMultiplier, level - 1));
    }

    showLevelUpModal(newLevel) {
        const t = getLevelTitle(newLevel);
        const old = document.getElementById('levelUpModal');
        if (old) old.remove();

        this._injectStyles();

        const modal = document.createElement('div');
        modal.id = 'levelUpModal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);animation:lvFadeIn 0.3s ease;';
        modal.innerHTML = `
            <div style="background:linear-gradient(135deg,#0d1117,#1a1f2e);border:1px solid ${t.color}44;border-radius:24px;padding:3rem 2.5rem;text-align:center;max-width:400px;width:90%;box-shadow:0 0 60px ${t.color}33;animation:lvScaleIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275);position:relative;overflow:hidden;">
                <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,${t.color}22,transparent 70%);pointer-events:none;"></div>
                <div style="font-size:4rem;margin-bottom:0.5rem;">${t.icon}</div>
                <div style="font-family:'Bebas Neue',cursive;font-size:0.95rem;letter-spacing:4px;color:${t.color};margin-bottom:0.3rem;text-transform:uppercase;">${typeof _lang !== 'undefined' && _lang === 'en' ? 'LEVEL UP!' : 'SEVIYE ATLADi!'}</div>
                <div style="font-family:'Bebas Neue',cursive;font-size:5rem;color:#fff;line-height:1;margin-bottom:0.5rem;text-shadow:0 0 40px ${t.color};">LV.${newLevel}</div>
                <div style="font-size:1.2rem;font-weight:700;color:${t.color};margin-bottom:0.3rem;">${t.icon} ${t.title}</div>
                <div style="color:#6b7280;font-size:0.85rem;margin-bottom:1.8rem;">${typeof _lang !== 'undefined' && _lang === 'en' ? 'New title: ' : 'Yeni unvanin: '}<strong style="color:#fff;">${t.title}</strong></div>
                <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.8rem;margin-bottom:1.5rem;font-size:0.82rem;color:#8892a4;">
                    ${typeof _lang !== 'undefined' && _lang === 'en' ? 'Next level: ' : 'Sonraki seviye: '}<strong style="color:#fff;">${this.getRequiredXP(newLevel)} XP</strong>
                </div>
                <button onclick="document.getElementById('levelUpModal').remove()" style="width:100%;padding:0.85rem;background:linear-gradient(135deg,${t.color},${t.color}cc);border:none;border-radius:12px;color:#fff;font-size:1rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">${typeof _lang !== 'undefined' && _lang === 'en' ? '🎉 Awesome!' : '🎉 Harika!'}</button>
            </div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        setTimeout(() => { if (modal.parentNode) modal.remove(); }, 6000);
    }

    _showXPToast(amount, reason) {
        this._injectStyles();
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:5rem;right:1.5rem;z-index:9998;background:linear-gradient(135deg,rgba(255,51,102,0.2),rgba(0,212,255,0.1));border:1px solid rgba(255,51,102,0.4);border-radius:12px;padding:0.6rem 1.1rem;font-family:\'DM Sans\',sans-serif;font-size:0.88rem;font-weight:700;color:#fff;backdrop-filter:blur(8px);animation:xpFloatUp 2s ease forwards;display:flex;align-items:center;gap:0.5rem;pointer-events:none;';
        toast.innerHTML = `<span style="color:#ff3366;">+${amount} XP</span><span style="font-weight:400;font-size:0.78rem;color:#8892a4;">— ${reason}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2100);
    }

    _injectStyles() {
        if (document.getElementById('xpSysStyles')) return;
        const s = document.createElement('style');
        s.id = 'xpSysStyles';
        s.textContent = `
            @keyframes lvFadeIn  { from{opacity:0} to{opacity:1} }
            @keyframes lvScaleIn { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
            @keyframes xpFloatUp { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-70px)} }
            @keyframes achSlideIn { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
            @keyframes achFadeOut { from{transform:translateX(0);opacity:1} to{transform:translateX(120%);opacity:0} }
        `;
        document.head.appendChild(s);
    }

    updateUI() {
        if (!dataManager.data) return;
        const xpData = dataManager.data.xp;
        const required = this.getRequiredXP(xpData.level);
        const progress = Math.min((xpData.current / required) * 100, 100);
        const t = getLevelTitle(xpData.level);

        const el = (id) => document.getElementById(id);
        if (el('userLevel'))        el('userLevel').textContent = xpData.level;
        if (el('currentXP'))        el('currentXP').textContent = xpData.current;
        if (el('nextLevelXP'))      el('nextLevelXP').textContent = required;
        if (el('xpFill'))           { el('xpFill').style.width = progress + '%'; el('xpFill').style.background = `linear-gradient(90deg,${t.color},${t.color}cc)`; }
        if (el('heroXP'))           el('heroXP').textContent = xpData.total;
        if (el('profileXPTotal'))   el('profileXPTotal').textContent = xpData.total;
        if (el('profileLvBadge'))   el('profileLvBadge').textContent = xpData.level;
        if (el('userLevelTitle'))   { el('userLevelTitle').textContent = t.title; el('userLevelTitle').style.color = t.color; }
        if (el('userLevelIcon'))    el('userLevelIcon').textContent = t.icon;
        if (el('headerLevelTitle')) { el('headerLevelTitle').textContent = t.title; el('headerLevelTitle').style.color = t.color; }
    }
}

// ===== BASARiM KONTROL & TOAST =====
function checkAchievements() {
    if (!dataManager.data) return;
    const d = dataManager.data;
    const unlocked = d.achievements;

    ACHIEVEMENTS.forEach(ach => {
        if (!unlocked.includes(ach.id)) {
            try {
                if (ach.check(d)) {
                    unlocked.push(ach.id);
                    dataManager.saveAll();
                    _showAchievementToast(ach);
                    const _a = (obj) => (typeof obj === 'object' && obj !== null) ? (obj[typeof _lang !== 'undefined' ? _lang : 'tr'] || obj.tr || Object.values(obj)[0]) : obj;
                    if (ach.xp > 0) xpSystem.addXP(ach.xp, (typeof _lang !== 'undefined' && _lang === 'en' ? 'Achievement: ' : 'Basarim: ') + _a(ach.title), true, 'achievement');
                }
            } catch(e) {}
        }
    });
}

function _showAchievementToast(ach) {
    if (typeof xpSystem !== 'undefined') xpSystem._injectStyles();
    const rarity = RARITY_COLORS[ach.rarity] || RARITY_COLORS.common;
    const isEn = typeof _lang !== 'undefined' && _lang === 'en';
    const RARiTY_LABELS = { tr:{common:'Yaygin',uncommon:'Nadir',rare:'Ender',epic:'Epik',legendary:'Efsane'}, en:{common:'Common',uncommon:'Uncommon',rare:'Rare',epic:'Epic',legendary:'Legendary'} };
    const rlabel = RARITY_LABELS[isEn?'en':'tr'][ach.rarity] || ach.rarity;
    const _a = (obj) => (typeof obj === 'object' && obj !== null) ? (obj[isEn?'en':'tr'] || obj.tr || Object.values(obj)[0]) : obj;
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;top:5rem;right:1.5rem;z-index:9997;background:${rarity.bg};border:1px solid ${rarity.border};border-left:3px solid ${rarity.text};border-radius:12px;padding:0.9rem 1.2rem;font-family:'DM Sans',sans-serif;backdrop-filter:blur(12px);min-width:240px;max-width:300px;animation:achSlideIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275),achFadeOut 0.4s ease 3.6s forwards;box-shadow:0 8px 24px rgba(0,0,0,0.4);`;
    toast.innerHTML = `
        <div style="font-size:0.63rem;font-weight:800;letter-spacing:2px;color:${rarity.text};text-transform:uppercase;margin-bottom:0.4rem;">🏆 ${isEn ? 'ACHiEVEMENT UNLOCKED' : 'BASARiM ACiLDi'} · ${rlabel.toUpperCase()}</div>
        <div style="display:flex;align-items:center;gap:0.7rem;">
            <span style="font-size:1.8rem;">${ach.icon}</span>
            <div>
                <div style="font-weight:700;color:#fff;font-size:0.9rem;margin-bottom:0.1rem;">${_a(ach.title)}</div>
                <div style="color:#8892a4;font-size:0.75rem;">${_a(ach.desc)}</div>
            </div>
        </div>
        ${ach.xp > 0 ? `<div style="margin-top:0.4rem;font-size:0.75rem;color:${rarity.text};font-weight:700;">+${ach.xp} XP</div>` : ''}
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
}

// ===== STREAK =====
function updateStreak() {
    if (!dataManager.data) return;
    const today = new Date().toDateString();
    const streakData = dataManager.data.streak;

    if (!streakData.lastVisit) {
        streakData.count = 1;
        streakData.lastVisit = today;
        xpSystem.addXP(XP_REWARDS.dailyLogin, 'Gunluk giris', true, 'dailyLogin');
    } else if (streakData.lastVisit !== today) {
        const lastDate = new Date(streakData.lastVisit);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / 86400000);
        if (diffDays === 1) {
            streakData.count++;
            xpSystem.addXP(XP_REWARDS.dailyLogin, 'Gunluk giris', false, 'dailyLogin');
            if (streakData.count === 7)  xpSystem.addXP(XP_REWARDS.weekStreak,  '7 gun streak! 🔥',  false, 'weekStreak');
            if (streakData.count === 30) xpSystem.addXP(XP_REWARDS.monthStreak, '30 gun streak! 💎', false, 'monthStreak');
            if (streakData.count > (streakData.longest || 0)) streakData.longest = streakData.count;
        } else if (diffDays > 1) {
            streakData.count = 1;
        }
        streakData.lastVisit = today;
    }

    dataManager.saveAll();
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('streakDays', streakData.count);
    set('streakHome', streakData.count);
    set('profileStreakVal', streakData.longest || streakData.count);
    set('profileStreakBadge', streakData.count);
    checkAchievements();
}

// ===== BASARiMLAR SAYFASi =====
function renderAchievements() {
    const container = document.getElementById('achievementsSection');
    if (!container) return;

    // Dil yardimcisi - achievement title/desc icin
    const _a = (obj) => (typeof obj === 'object' && obj !== null)
        ? (obj[typeof _lang !== 'undefined' ? _lang : 'tr'] || obj.tr || Object.values(obj)[0])
        : obj;

    const unlocked  = dataManager.data?.achievements || [];
    const totalXP   = dataManager.data?.xp?.total || 0;
    const level     = dataManager.data?.xp?.level || 1;
    const t_i       = getLevelTitle(level);
    const requiredXP = xpSystem.getRequiredXP(level);
    const currentXP  = dataManager.data?.xp?.current || 0;
    const progress   = Math.min(Math.round((currentXP / requiredXP) * 100), 100);

    const isEn = typeof _lang !== 'undefined' && _lang === 'en';

    const rarityOrder = { legendary:0, epic:1, rare:2, uncommon:3, common:4 };
    const sorted = [...ACHIEVEMENTS].sort((a,b) => {
        const aU = unlocked.includes(a.id) ? 0 : 1;
        const bU = unlocked.includes(b.id) ? 0 : 1;
        if (aU !== bU) return aU - bU;
        return (rarityOrder[a.rarity]||4) - (rarityOrder[b.rarity]||4);
    });

    const unlockedCount = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).length;
    const totalCount    = ACHIEVEMENTS.length;
    const overallPct    = Math.round((unlockedCount / totalCount) * 100);

    // Rarity label - dile gore
    const RARITY_LABELS = {
        tr: { common:'Yaygin', uncommon:'Nadir', rare:'Ender', epic:'Epik', legendary:'Efsane' },
        en: { common:'Common', uncommon:'Uncommon', rare:'Rare', epic:'Epic', legendary:'Legendary' },
    };
    const rlabels = RARITY_LABELS[isEn ? 'en' : 'tr'];

    const RARITY_COLORS_EXT = {
        common:    { bg:'rgba(107,114,128,0.15)', border:'rgba(107,114,128,0.4)', text:'#9ca3af' },
        uncommon:  { bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.4)',  text:'#60a5fa' },
        rare:      { bg:'rgba(139,92,246,0.15)',  border:'rgba(139,92,246,0.4)',  text:'#a78bfa' },
        epic:      { bg:'rgba(236,72,153,0.15)',  border:'rgba(236,72,153,0.4)',  text:'#f472b6' },
        legendary: { bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.5)', text:'#fbbf24' },
    };

    container.innerHTML = `<div style="padding-bottom:2rem;">
        <div style="margin-bottom:2rem;">
            <h2 style="font-family:'Poppins',sans-serif;font-size:1.9rem;font-weight:700;margin-bottom:0.25rem;">🏆 ${isEn ? 'Achievements' : 'Basarimlar'}</h2>
            <p style="color:var(--text-secondary);">${isEn ? 'Complete tasks, earn XP and level up!' : 'Gorevleri tamamla, XP kazan, seviye atla!'}</p>
        </div>

        <!-- XP Kazanim Rehberi -->
        <div style="background:linear-gradient(135deg,rgba(255,51,102,0.08),rgba(0,212,255,0.04));border:1px solid rgba(255,51,102,0.15);border-radius:16px;padding:1.5rem;margin-bottom:2rem;">
            <h3 style="font-size:0.9rem;font-weight:700;margin-bottom:1rem;color:var(--text-primary);">⚡ ${isEn ? 'How to Earn XP' : 'XP Nasil Kazanilir?'}</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.6rem;">
                ${[
                    [isEn?'Write a short review':'Kisa yorum yaz',           '+' + XP_REWARDS.writeReview + ' XP',     '#10b981'],
                    [isEn?'Write a detailed review':'Detayli yorum yaz',     '+' + XP_REWARDS.writeLongReview + ' XP', '#10b981'],
                    [isEn?'Daily login':'Gunluk giris',                      '+' + XP_REWARDS.dailyLogin + ' XP',      '#ec4899'],
                    [isEn?'7-day streak':'7 gun streak',                     '+' + XP_REWARDS.weekStreak + ' XP',      '#ff3366'],
                    [isEn?'30-day streak':'30 gun streak',                   '+' + XP_REWARDS.monthStreak + ' XP',     '#ff3366'],
                    [isEn?'Rate content (with review)':'Puan + yorum ver',   '+' + XP_REWARDS.writeReview + ' XP',     '#f59e0b'],
                ].map(([label,xp,color])=>`
                    <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:0.5rem 0.8rem;">
                        <span style="font-size:0.78rem;color:#9ca3af;">${label}</span>
                        <span style="font-size:0.78rem;font-weight:700;color:${color};">${xp}</span>
                    </div>`).join('')}
            </div>
        </div>

        <!-- Profil Karti -->
        <div style="background:linear-gradient(135deg,rgba(255,51,102,0.1),rgba(0,212,255,0.06));border:1px solid rgba(255,51,102,0.2);border-radius:20px;padding:2rem;margin-bottom:2rem;display:flex;gap:2rem;flex-wrap:wrap;align-items:center;">
            <div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,${t_i.color}33,${t_i.color}11);border:3px solid ${t_i.color};display:flex;align-items:center;justify-content:center;font-size:2.8rem;flex-shrink:0;">${t_i.icon}</div>
            <div style="flex:1;min-width:160px;">
                <div style="font-size:0.72rem;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:0.3rem;">${isEn ? 'Current Title' : 'Mevcut Unvan'}</div>
                <div style="font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:0.2rem;">${t_i.title}</div>
                <div style="color:${t_i.color};font-size:0.88rem;font-weight:600;">${isEn ? 'Level' : 'Seviye'} ${level}</div>
                <div style="margin-top:0.7rem;">
                    <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:#6b7280;margin-bottom:0.3rem;">
                        <span>XP: ${currentXP} / ${requiredXP}</span><span>${progress}%</span>
                    </div>
                    <div style="background:rgba(255,255,255,0.07);border-radius:4px;height:6px;overflow:hidden;">
                        <div style="width:${progress}%;height:100%;border-radius:4px;background:linear-gradient(90deg,${t_i.color},${t_i.color}cc);transition:width 0.6s;"></div>
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                <div style="text-align:center;">
                    <div style="font-family:'Poppins',sans-serif;font-size:1.8rem;font-weight:700;background:linear-gradient(135deg,#ff3366,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${totalXP.toLocaleString()}</div>
                    <div style="font-size:0.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${isEn ? 'Total XP' : 'Toplam XP'}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-family:'Poppins',sans-serif;font-size:1.8rem;font-weight:700;color:#fff;">${unlockedCount}/${totalCount}</div>
                    <div style="font-size:0.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">${isEn ? 'Achievements' : 'Basarim'}</div>
                </div>
            </div>
            <div style="width:100%;">
                <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#6b7280;margin-bottom:0.4rem;">
                    <span>${isEn ? 'Overall Progress' : 'Genel Ilerleme'}</span><span>${overallPct}%</span>
                </div>
                <div style="background:rgba(255,255,255,0.07);border-radius:6px;height:8px;overflow:hidden;">
                    <div style="width:${overallPct}%;height:100%;border-radius:6px;background:linear-gradient(90deg,#ff3366,#00d4ff);transition:width 0.6s;"></div>
                </div>
            </div>
        </div>

        <!-- Unvan Yol Haritasi -->
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:1.5rem;margin-bottom:2rem;">
            <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:1rem;color:var(--text-primary);">🗺️ ${isEn ? 'Title Roadmap' : 'Unvan Yol Haritasi'}</h3>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                ${LEVEL_TITLES.map(lt => {
                    const isActive = level >= lt.min && level <= lt.max;
                    const isPast   = level > lt.max;
                    return `<div style="padding:0.35rem 0.85rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:${isActive?lt.color+'22':isPast?'rgba(16,185,129,0.1)':'rgba(255,255,255,0.04)'};border:1px solid ${isActive?lt.color+'55':isPast?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.07)'};color:${isActive?lt.color:isPast?'#10b981':'#4b5563'};${isActive?'box-shadow:0 0 10px '+lt.color+'33;':''}">
                        ${isPast?'✓ ':isActive?'● ':''}${lt.icon} ${lt.title} <span style="opacity:0.55;font-size:0.65rem;">Lv.${lt.min}${lt.max<999?'-'+lt.max:'+'}</span>
                    </div>`;
                }).join('')}
            </div>
        </div>

        <!-- Basarimlar -->
        <h3 style="font-size:0.95rem;font-weight:700;margin-bottom:1rem;color:var(--text-primary);">
            🏅 ${isEn ? 'All Achievements' : 'Tum Basarimlar'}
            <span style="font-size:0.75rem;font-weight:400;color:#6b7280;margin-left:0.5rem;">${unlockedCount} / ${totalCount} ${isEn ? 'unlocked' : 'acildi'}</span>
        </h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:0.85rem;">
            ${sorted.map(ach => {
                const isU = unlocked.includes(ach.id);
                const r   = RARITY_COLORS_EXT[ach.rarity] || RARITY_COLORS_EXT.common;
                const rlabel = rlabels[ach.rarity] || ach.rarity;
                const title = _a(ach.title);
                const desc  = _a(ach.desc);
                return `<div style="background:${isU?r.bg:'rgba(255,255,255,0.02)'};border:1px solid ${isU?r.border:'rgba(255,255,255,0.06)'};border-radius:14px;padding:1rem 1.1rem;display:flex;align-items:center;gap:0.85rem;${isU?'box-shadow:0 4px 14px rgba(0,0,0,0.3);':'opacity:0.5;'}">
                    <div style="font-size:1.7rem;width:46px;height:46px;display:flex;align-items:center;justify-content:center;background:${isU?r.bg:'rgba(255,255,255,0.04)'};border-radius:12px;flex-shrink:0;${!isU?'filter:grayscale(1);':''}">
                        ${isU ? ach.icon : '🔒'}
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:700;font-size:0.85rem;color:${isU?'#fff':'#4b5563'};margin-bottom:0.12rem;">${title}</div>
                        <div style="font-size:0.73rem;color:#6b7280;margin-bottom:0.28rem;">${desc}</div>
                        <div style="display:flex;align-items:center;gap:0.5rem;">
                            <span style="font-size:0.62rem;font-weight:700;letter-spacing:1px;color:${r.text};text-transform:uppercase;">${rlabel}</span>
                            ${ach.xp>0?`<span style="font-size:0.68rem;color:${isU?'#ff3366':'#4b5563'};font-weight:700;">+${ach.xp} XP</span>`:''}
                        </div>
                    </div>
                    ${isU?`<div style="color:#10b981;font-size:1rem;flex-shrink:0;">✓</div>`:''}
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

const xpSystem = new XPSystem();

// ── KONSOL KORUMASI ────────────────────────────────────────────────────────
// xpSystem'i global scope'tan gizle — konsol erişimini engeller
// Dahili modüller window.__xps üzerinden erişir, dışarıdan bu isim bilinmez
(() => {
    // window.xpSystem'i koru: yazma ve silmeyi engelle
    try {
        Object.defineProperty(window, 'xpSystem', {
            get() { return xpSystem; },
            set() { console.warn('[XPSecurity] xpSystem değiştirilemez.'); },
            configurable: false
        });
    } catch(e) {}

    // dataManager.saveAll'u XP doğrulamasıyla sar
    const _origSaveAll = dataManager.saveAll.bind(dataManager);
    dataManager.saveAll = function() {
        if (this.data && this.data.xp) {
            if (!_XPSecurity.validateTotals(this.data.xp)) {
                console.warn('[XPSecurity] Geçersiz XP tespit edildi — kayıt engellendi.');
                return false;
            }
        }
        return _origSaveAll();
    };
})();

// Oturum değiştiğinde XP sayacını sıfırla
document.addEventListener('onilist:authChange', () => _XPSecurity.resetSession());

console.log('✅ XP System v3.1 loaded (secure)');