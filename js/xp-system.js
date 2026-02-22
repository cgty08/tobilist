// XP SYSTEM v2.1
const XP_REWARDS = {
    addItem: 10,
    completeItem: 50,
    rateItem: 5,
    dailyLogin: 20,
    addNote: 5,
    weekStreak: 100
};

const ACHIEVEMENTS = [
    { id: 'first_item',    icon: '🎬', title: 'İlk Adım',        desc: 'İlk içeriğini ekle',           xp: 50,  check: (items) => items.length >= 1 },
    { id: 'ten_items',     icon: '📚', title: 'Koleksiyoncu',     desc: '10 içerik ekle',                xp: 100, check: (items) => items.length >= 10 },
    { id: 'fifty_items',   icon: '🏛️', title: 'Arşivci',         desc: '50 içerik ekle',                xp: 500, check: (items) => items.length >= 50 },
    { id: 'first_complete',icon: '✅', title: 'Tamamlayıcı',     desc: 'İlk serisini bitir',            xp: 75,  check: (items) => items.filter(i => i.status === 'completed').length >= 1 },
    { id: 'ten_complete',  icon: '🏅', title: 'Maratoncı',       desc: '10 seri tamamla',               xp: 200, check: (items) => items.filter(i => i.status === 'completed').length >= 10 },
    { id: 'five_star',     icon: '⭐', title: 'Eleştirmen',      desc: 'Bir içeriğe 5 yıldız ver',     xp: 30,  check: (items) => items.filter(i => i.rating >= 5).length >= 1 },
    { id: 'week_streak',   icon: '🔥', title: 'Sadık Takipçi',   desc: '7 gün üst üste giriş yap',    xp: 100, check: () => dataManager.data && dataManager.data.streak.count >= 7 },
    { id: 'month_streak',  icon: '💎', title: 'Efsane',          desc: '30 gün üst üste giriş yap',   xp: 500, check: () => dataManager.data && dataManager.data.streak.count >= 30 },
    { id: 'all_types',     icon: '🌈', title: 'Çok Yönlü',      desc: 'Anime, manga ve webtoon ekle',  xp: 80,  check: (items) => {
        const types = new Set(items.map(i => i.type));
        return types.has('anime') && types.has('manga') && types.has('webtoon');
    }},
    { id: 'level5',        icon: '🚀', title: 'Yükselen Yıldız', desc: "Seviye 5'e ulaş",              xp: 0,   check: () => dataManager.data && dataManager.data.xp.level >= 5 },
    { id: 'level10',       icon: '👑', title: 'Anime Lordu',     desc: "Seviye 10'a ulaş",             xp: 0,   check: () => dataManager.data && dataManager.data.xp.level >= 10 },
];

class XPSystem {
    constructor() {
        this.xpPerLevel = 100;
        this.xpMultiplier = 1.5;
    }

    addXP(amount, reason = '') {
        if (!dataManager.data) return;
        const xpData = dataManager.data.xp;
        xpData.current += amount;
        xpData.total += amount;

        const required = this.getRequiredXP(xpData.level);
        if (xpData.current >= required) {
            xpData.current -= required;
            xpData.level++;
            this.onLevelUp(xpData.level);
        }

        dataManager.saveAll();
        this.updateUI();

        if (reason) {
            showNotification('+' + amount + ' XP — ' + reason, 'success');
        }
    }

    getRequiredXP(level) {
        return Math.floor(this.xpPerLevel * Math.pow(this.xpMultiplier, level - 1));
    }

    onLevelUp(newLevel) {
        showNotification('🎉 Seviye ' + newLevel + "'e ulaştınız!", 'success');
        checkAchievements();
    }

    updateUI() {
        if (!dataManager.data) return;
        const xpData = dataManager.data.xp;
        const required = this.getRequiredXP(xpData.level);
        const progress = (xpData.current / required) * 100;

        const el = (id) => document.getElementById(id);
        if (el('userLevel')) el('userLevel').textContent = xpData.level;
        if (el('currentXP')) el('currentXP').textContent = xpData.current;
        if (el('nextLevelXP')) el('nextLevelXP').textContent = required;
        if (el('xpFill')) el('xpFill').style.width = progress + '%';
        if (el('heroXP')) el('heroXP').textContent = xpData.total;
        if (el('profileXPTotal')) el('profileXPTotal').textContent = xpData.total;
        if (el('profileLvBadge')) el('profileLvBadge').textContent = xpData.level;
    }
}

function checkAchievements() {
    if (!dataManager.data) return;
    const items = dataManager.data.items;
    const unlocked = dataManager.data.achievements;

    ACHIEVEMENTS.forEach(ach => {
        if (!unlocked.includes(ach.id) && ach.check(items)) {
            unlocked.push(ach.id);
            dataManager.saveAll();
            showNotification('🏆 Başarım: ' + ach.title + '!', 'success');
            if (ach.xp > 0) xpSystem.addXP(ach.xp, 'Başarım');
        }
    });
}

function updateStreak() {
    if (!dataManager.data) return;
    const today = new Date().toDateString();
    const streakData = dataManager.data.streak;

    if (!streakData.lastVisit) {
        streakData.count = 1;
        streakData.lastVisit = today;
    } else if (streakData.lastVisit !== today) {
        const lastDate = new Date(streakData.lastVisit);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / 86400000);

        if (diffDays === 1) {
            streakData.count++;
            xpSystem.addXP(XP_REWARDS.dailyLogin, 'Günlük giriş');
            if (streakData.count === 7) xpSystem.addXP(XP_REWARDS.weekStreak, '7 gün streak!');
            if (streakData.count > (streakData.longest || 0)) {
                streakData.longest = streakData.count;
            }
        } else if (diffDays > 1) {
            streakData.count = 1;
        }
        streakData.lastVisit = today;
    }

    dataManager.saveAll();

    const sd = document.getElementById('streakDays');
    if (sd) sd.textContent = streakData.count;
    const sh = document.getElementById('streakHome');
    if (sh) sh.textContent = streakData.count;
    const sp = document.getElementById('profileStreakVal');
    if (sp) sp.textContent = streakData.longest || streakData.count;
    const spb = document.getElementById('profileStreakBadge');
    if (spb) spb.textContent = streakData.count;
}

const xpSystem = new XPSystem();
console.log('✅ XP System v2.1 loaded');