// AUTH.JS v5.1 - Supabase Auth - Tüm hatalar düzeltildi

// ── ADMIN CONFIG ──────────────────────────────────────────────────────────────
// Admin status is read from the is_admin column in user_data (set server-side in Supabase).
// No admin emails are hardcoded here. To grant admin access: set is_admin = true in Supabase.
// ─────────────────────────────────────────────────────────────────────────────

let currentUser = null;
let isGuest = true;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    showLoadingScreen();
    initSupabaseSession();
});

async function initSupabaseSession() {
    let waited = 0;
    while (!window.supabaseClient && waited < 5000) {
        await new Promise(r => setTimeout(r, 100));
        waited += 100;
    }

    if (!window.supabaseClient) {
        console.warn('Supabase failed to load, switching to guest mode');
        guestMode();
        return;
    }

    // Güvenlik timeout - 8 saniye içinde cevap gelmezse guest moda geç
    let sessionResolved = false;
    const sessionTimeout = setTimeout(() => {
        if (!sessionResolved) {
            console.warn('Session timeout, switching to guest mode');
            guestMode();
        }
    }, 8000);

    try {
        const { data: { session }, error } = await window.supabaseClient.auth.getSession();
        sessionResolved = true;
        clearTimeout(sessionTimeout);

        if (error) {
            console.warn('Session error:', error.message);
            guestMode();
            return;
        }

        if (session && session.user) {
            await loginSuccess(session.user);
        } else {
            guestMode();
        }
    } catch(e) {
        sessionResolved = true;
        clearTimeout(sessionTimeout);
        console.error('Session check error:', e);
        guestMode();
    }

    // Auth state değişikliklerini dinle
    try {
        window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session && session.user) {
                if (!currentUser || currentUser.uid !== session.user.id) {
                    await loginSuccess(session.user);
                }
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                isGuest = true;
                dataManager.data = dataManager.defaultData();
                dataManager.currentUserId = null;
                updateUIForGuest();
                switchSection('home');
            }
        });
    } catch(e) {
        console.warn('Auth state listener error:', e);
    }
}

async function loginSuccess(user) {
    // displayName XSS koruması: script/html karakterleri temizleniyor
    function _sanitizeName(str) {
        if (!str) return '';
        return String(str).replace(/[<>"'&]/g, '').trim().substring(0, 50);
    }

    currentUser = {
        uid: user.id,
        id: user.id,
        displayName: _sanitizeName(user.user_metadata?.username || user.email.split('@')[0]),
        email: user.email
    };
    window.currentUser = currentUser;
    isGuest = false;

    // Önce localStorage'dan yükle (anında, kayıp riski yok)
    dataManager.setUser(user.id);

    // Admin status is controlled exclusively by is_admin column in Supabase user_data.
    // To grant admin: UPDATE user_data SET data = data || '{"is_admin": true}' WHERE data->>'email' = 'owner@email.com';

    try {
        const { data, error } = await window.supabaseClient
            .from('user_data')
            .select('data,is_admin')
            .eq('user_id', user.id)
            .single();

        // Set admin flag: DB column only — no email fallback (secure)
        if (data?.data?.is_admin === true || data?.is_admin === true) {
            currentUser.isAdmin = true;
        }

        if (!error && data && data.data) {
            // Data exists in Supabase - which is newer?
            const remoteItems = data.data.items || [];
            const localItems = dataManager.data.items || [];
            if (remoteItems.length >= localItems.length) {
                dataManager.setUser(user.id, data.data); // Remote is fuller, use it
            } else {
                dataManager.saveAll(); // Local is fuller, update Supabase
            }
        } else if (error && error.code === 'PGRST116') {
            // No record in Supabase (new user)
            if (!dataManager.data.items.length) {
                // Truly new - populate social info
                dataManager.data.social.name = currentUser.displayName;
                dataManager.data.social.email = currentUser.email;
            }
            dataManager.saveAll(); // Supabase'e ilk kaydı yap
        } else if (error) {
            console.warn('Supabase fetch error:', error.message);
            // localStorage data already loaded, no problem
        }
    } catch(e) {
        console.warn('Could not sync with Supabase, using localStorage:', e.message);
    }

    // ── BAN CHECK ────────────────────────────────────────────
    const userData = dataManager.data;
    if (userData && userData.banned === true) {
        // Check if ban has expired
        const banExpiry = userData.ban_expiry;
        const isExpired = banExpiry && new Date(banExpiry) < new Date();

        if (!isExpired) {
            // Banned user - restricted mode
            currentUser.isBanned = true;
            currentUser.banReason = userData.ban_reason || 'Rule violation';
            currentUser.banExpiry = banExpiry;
            window.currentUser = currentUser;

            updateUIForBanned();
            if (typeof initializeApp === 'function') initializeApp();
            hideLoadingScreen();
            document.dispatchEvent(new Event('onilist:authChange'));

            // Show ban notification
            setTimeout(() => {
                const expiryText = banExpiry
                    ? new Date(banExpiry).toLocaleDateString('en-US')
                    : 'permanent';
                showNotification(
                    '🚫 Your account has been restricted. Reason: ' + currentUser.banReason +
                    (banExpiry ? ' | Expires: ' + expiryText : ' | Permanent ban'),
                    'error'
                );
            }, 1500);
            return;
        } else {
            // Ban expired - remove automatically
            userData.banned = false;
            userData.ban_reason = null;
            userData.ban_expiry = null;
            dataManager.saveAll();
        }
    }
    // ── BAN CHECK END ───────────────────────────────────────

    updateUIForLoggedIn();
    if (typeof initializeApp === 'function') initializeApp();
    hideLoadingScreen();
    document.dispatchEvent(new Event('onilist:authChange'));
    // Duyuru otomatik popup devre dışı - admin panelden gönderilince gösterilir
}

function guestMode() {
    currentUser = null;
    window.currentUser = null;
    isGuest = true;
    dataManager.data = dataManager.defaultData();
    updateUIForGuest();
    if (typeof initializeApp === 'function') initializeApp();
    hideLoadingScreen();
    // Duyuru otomatik popup devre dışı - admin panelden gönderilince gösterilir
}

// ===== LOADING =====
function showLoadingScreen() {
    const ls = document.getElementById('loadingScreen');
    if (ls) { ls.style.opacity = '1'; ls.classList.remove('hidden'); }
}

function hideLoadingScreen() {
    const ls = document.getElementById('loadingScreen');
    if (ls) {
        ls.style.opacity = '0';
        setTimeout(() => ls.classList.add('hidden'), 500);
    }
}

// ===== AUTH MODAL =====
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    clearAllErrors();
    if (mode === 'register') showModalRegister();
    else if (mode === 'forgot') showModalForgot();
    else showModalLogin();
    setTimeout(() => {
        const content = modal.querySelector('.auth-modal-content');
        if (content) content.classList.add('show');
    }, 10);
}

// Modal backdrop tıklaması - metin seçimi sırasında kapanmaz
document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        let mdTarget = null;
        authModal.addEventListener('mousedown', (e) => { mdTarget = e.target; });
        authModal.addEventListener('mouseup', (e) => {
            if (mdTarget === authModal && e.target === authModal) closeAuthModal();
            mdTarget = null;
        });
    }
});

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    const content = modal.querySelector('.auth-modal-content');
    if (content) content.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function showModalLogin() {
    const lb = document.getElementById('modalLoginBox');
    const rb = document.getElementById('modalRegisterBox');
    const fb = document.getElementById('modalForgotBox');
    if (lb) lb.style.display = 'block';
    if (rb) rb.style.display = 'none';
    if (fb) fb.style.display = 'none';
    clearAllErrors();
}

function showModalRegister() {
    const lb = document.getElementById('modalLoginBox');
    const rb = document.getElementById('modalRegisterBox');
    const fb = document.getElementById('modalForgotBox');
    if (lb) lb.style.display = 'none';
    if (rb) rb.style.display = 'block';
    if (fb) fb.style.display = 'none';
    clearAllErrors();
}

function showModalForgot() {
    const lb = document.getElementById('modalLoginBox');
    const rb = document.getElementById('modalRegisterBox');
    const fb = document.getElementById('modalForgotBox');
    if (lb) lb.style.display = 'none';
    if (rb) rb.style.display = 'none';
    if (fb) fb.style.display = 'block';
    clearAllErrors();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthModal();
        if (typeof closeModal === 'function') closeModal();
        if (typeof closeEditProfile === 'function') closeEditProfile();
    }
});

// Backdrop tıklaması mousedown/mouseup ile üstte handle ediliyor

// ===== LOGIN =====
async function handleLogin(event) {
    event.preventDefault();

    if (!window.supabaseClient) {
        showError('loginError', 'Sunucu bağlantısı kurulamadı. Lütfen sayfayı yenileyin.');
        return;
    }

    const emailEl = document.getElementById('loginEmail');
    const passwordEl = document.getElementById('loginPassword');
    if (!emailEl || !passwordEl) return;

    const email = emailEl.value.trim();
    const password = passwordEl.value;

    if (!email) { showError('loginError', 'E-posta adresi giriniz!'); return; }
    if (!password) { showError('loginError', 'Şifre giriniz!'); return; }

    const btn = document.getElementById('loginBtn');
    setButtonLoading(btn, true, 'Giriş yapılıyor...');
    clearAllErrors();

    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;

        closeAuthModal();
        showNotification('Hoş geldiniz! 🎉', 'success');
    } catch(error) {
        setButtonLoading(btn, false, '<span>Giriş Yap</span><span class="btn-arrow">→</span>');
        showError('loginError', getSupabaseErrorMessage(error.message));
    }
}

// ===== REGISTER =====
async function handleRegister(event) {
    event.preventDefault();

    if (!window.supabaseClient) {
        showError('registerError', 'Sunucu bağlantısı kurulamadı. Lütfen sayfayı yenileyin.');
        return;
    }

    const usernameEl = document.getElementById('registerUsername');
    const emailEl = document.getElementById('registerEmail');
    const passwordEl = document.getElementById('registerPassword');
    const confirmEl = document.getElementById('registerPasswordConfirm');

    if (!usernameEl || !emailEl || !passwordEl || !confirmEl) return;

    const username = usernameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value;
    const confirm = confirmEl.value;

    clearAllErrors();

    if (!username || username.length < 3) {
        showError('registerError', 'Kullanıcı adı en az 3 karakter olmalı!');
        return;
    }
    if (!email) {
        showError('registerError', 'E-posta adresi giriniz!');
        return;
    }
    if (!password || password.length < 6) {
        showError('registerError', 'Şifre en az 6 karakter olmalı!');
        return;
    }
    if (password !== confirm) {
        showError('registerError', 'Şifreler eşleşmiyor!');
        return;
    }

    const btn = document.getElementById('registerBtn');
    setButtonLoading(btn, true, 'Hesap oluşturuluyor...');

    try {
        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { username } }
        });

        if (error) throw error;

        // Kullanıcı oluşturuldu ama email doğrulama gerekebilir
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            // Email zaten kayıtlı
            throw new Error('User already registered');
        }

        setButtonLoading(btn, false, '<span>Hesap Oluştur</span><span class="btn-arrow">→</span>');
        closeAuthModal();

        if (data.session) {
            // Email doğrulama kapalı - direkt giriş
            showNotification('Hesabınız oluşturuldu! Hoş geldiniz, ' + username + '! 🎉', 'success');
        } else {
            // Email doğrulama açık
            showNotification('Hesabınız oluşturuldu! Lütfen e-posta adresinizi doğrulayın. 📧', 'info');
        }
    } catch(error) {
        setButtonLoading(btn, false, '<span>Hesap Oluştur</span><span class="btn-arrow">→</span>');
        showError('registerError', getSupabaseErrorMessage(error.message));
    }
}

// ===== FORGOT PASSWORD =====
// ===== LOGOUT =====
async function handleLogout() {
    if (document.getElementById('logoutConfirmBox')) return;

    // DOM tabanlı oluşturma — innerHTML/XSS riski yok
    const box = document.createElement('div');
    box.id = 'logoutConfirmBox';
    box.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-8px);z-index:999999;background:#141824;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:1.4rem 1.6rem;width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(255,51,102,0.15);font-family:DM Sans,sans-serif;opacity:0;transition:all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);';

    const iconDiv = document.createElement('div');
    iconDiv.style.cssText = 'width:36px;height:36px;background:rgba(255,51,102,0.12);border:1px solid rgba(255,51,102,0.25);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;';
    iconDiv.textContent = '👋';

    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'color:#fff;font-weight:700;font-size:0.95rem;';
    titleDiv.textContent = 'Çıkış Yap';

    const subDiv = document.createElement('div');
    subDiv.style.cssText = 'color:#8892a4;font-size:0.78rem;margin-top:1px;';
    subDiv.textContent = 'Hesabından çıkmak istiyor musun?';

    const textWrap = document.createElement('div');
    textWrap.appendChild(titleDiv);
    textWrap.appendChild(subDiv);

    const headerRow = document.createElement('div');
    headerRow.style.cssText = 'display:flex;align-items:center;gap:0.7rem;margin-bottom:1rem;';
    headerRow.appendChild(iconDiv);
    headerRow.appendChild(textWrap);

    const cancelBtn = document.createElement('button');
    cancelBtn.style.cssText = 'flex:1;padding:0.6rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#a0a8b9;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;';
    cancelBtn.textContent = 'İptal';

    const confirmBtn = document.createElement('button');
    confirmBtn.style.cssText = 'flex:1;padding:0.6rem;background:linear-gradient(135deg,#ff3366,#ff5580);border:none;border-radius:10px;color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;box-shadow:0 4px 15px rgba(255,51,102,0.35);';
    confirmBtn.textContent = 'Çıkış Yap';

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:0.6rem;';
    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);

    box.appendChild(headerRow);
    box.appendChild(btnRow);
    document.body.appendChild(box);

    setTimeout(function() {
        box.style.opacity = '1';
        box.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    function closeBox() {
        box.style.opacity = '0';
        setTimeout(function() { if (box.parentNode) box.parentNode.removeChild(box); }, 250);
    }

    cancelBtn.onclick = closeBox;

    confirmBtn.onclick = async function() {
        closeBox();
        try {
            if (window.supabaseClient) await window.supabaseClient.auth.signOut();
        } catch(e) { console.warn('Logout error:', e); }
        currentUser = null;
        isGuest = true;
        dataManager.data = dataManager.defaultData();
        dataManager.currentUserId = null;
        updateUIForGuest();
        switchSection('home');
        showNotification('Çıkış yapıldı. Görüşürüz! 👋', 'info');
    };

    setTimeout(function() {
        document.addEventListener('click', function handler(e) {
            if (!box.contains(e.target)) { closeBox(); document.removeEventListener('click', handler); }
        });
    }, 100);
}


// ===== DELETE ACCOUNT (Permanent) =====
async function deleteAccount() {
    if (!currentUser) return;
    
    const email = currentUser.email || '';
    const confirm1 = confirm('Hesabınızı KALICI olarak silmek istediğinize emin misiniz?\n\nBu işlem GERİ ALINAMAZ! Tüm verileriniz silinecek.');
    if (!confirm1) return;

    const typed = prompt('Onaylamak için e-posta adresinizi yazın:\n' + email);
    if (!typed || typed.trim().toLowerCase() !== email.toLowerCase()) {
        showNotification('E-posta adresi eşleşmedi. İşlem iptal edildi.', 'error');
        return;
    }

    try {
        if (window.supabaseClient) {
            const userId = currentUser.id || currentUser.uid;

            // 1. Tüm verileri sil
            await window.supabaseClient.from('user_data').delete().eq('user_id', userId);
            try { await window.supabaseClient.from('reviews').delete().eq('user_id', userId); } catch(e){}
            try { await window.supabaseClient.from('comments').delete().eq('user_id', userId); } catch(e){}

            // 2. Permanently delete from auth.users via RPC
            // Supabase'e SUPABASE_DELETE_USER_SQL.sql dosyasındaki fonksiyonu eklediyseniz çalışır
            const { error: rpcErr } = await window.supabaseClient.rpc('delete_user');
            if (rpcErr) {
                // RPC çalışmadıysa: kullanıcıyı devre dışı bırakmak için email'i değiştir
                // Bu sayede aynı email ile giriş yapılamaz
                const randomSuffix = Date.now();
                await window.supabaseClient.auth.updateUser({
                    email: 'deleted_' + randomSuffix + '_' + email
                });
                console.warn('RPC yok, email değiştirildi:', rpcErr.message);
            }

            // 3. localStorage temizle
            Object.keys(localStorage)
                .filter(k => k.includes(userId) || k.includes('onilist'))
                .forEach(k => localStorage.removeItem(k));

            // 4. Oturumu kapat
            await window.supabaseClient.auth.signOut();
        }

        currentUser = null;
        isGuest = true;
        dataManager.data = dataManager.defaultData();
        dataManager.currentUserId = null;
        updateUIForGuest();
        switchSection('home');
        showNotification('Hesabınız silindi. Görüşürüz!', 'info');
    } catch(e) {
        console.error('Hesap silme hatası:', e);
        showNotification('Hata oluştu: ' + e.message, 'error');
    }
}

// ===== UI STATE =====
function updateUIForLoggedIn() {
    if (!currentUser) return;

    const show = (id, disp = 'flex') => { const e = document.getElementById(id); if (e) e.style.display = disp; };
    const hide = (id) => { const e = document.getElementById(id); if (e) e.style.display = 'none'; };

    hide('guestHeaderBtns');
    show('userMenuWrapper', 'flex');
    show('addContentBtn', 'flex');
    show('levelBadge', 'flex');
    show('streakBadge', 'flex');
    show('totalBadge', 'flex');
    hide('guestAppBanner');

    document.querySelectorAll('.locked-tab').forEach(tab => {
        tab.classList.remove('locked-tab');
        const section = tab.getAttribute('data-section');
        if (section) tab.setAttribute('onclick', "switchSection('" + section + "')");
    });

    const guestCTA = document.getElementById('guestCTA');
    if (guestCTA) guestCTA.style.display = 'none';
    const quickStats = document.getElementById('quickStatsRow');
    if (quickStats) quickStats.style.display = 'grid';
    const continueBlock = document.getElementById('continueWatchingBlock');
    if (continueBlock) continueBlock.style.display = 'block';

    updateHeaderUser();

    const adminLink = document.getElementById('adminPanelLink');
    const adminShortcut = document.getElementById('adminShortcutBtn');
    if (currentUser && currentUser.isAdmin) {
        if (adminLink) adminLink.style.display = 'block';
        if (adminShortcut) adminShortcut.style.display = 'inline-flex';
    }

    const bannerActions = document.getElementById('bannerActions');
    if (bannerActions) {
        bannerActions.innerHTML = '<button class="btn btn-primary btn-large" onclick="openAddModal()">' + (typeof _lang !== 'undefined' && _lang === 'en' ? '✨ Add Content' : '✨ İçerik Ekle') + '</button><button class="btn btn-ghost btn-large" onclick="switchSection(\'discover\')">🔍 ' + (typeof _lang !== 'undefined' && _lang === 'en' ? 'Discover' : 'Keşfet') + '</button>';
    }
}

function updateUIForGuest() {
    const show = (id, disp = 'flex') => { const e = document.getElementById(id); if (e) e.style.display = disp; };
    const hide = (id) => { const e = document.getElementById(id); if (e) e.style.display = 'none'; };

    show('guestHeaderBtns', 'flex');
    hide('userMenuWrapper');
    hide('addContentBtn');
    hide('levelBadge');
    hide('streakBadge');
    hide('totalBadge');
    show('guestAppBanner', 'flex');

    const guestCTA = document.getElementById('guestCTA');
    if (guestCTA) guestCTA.style.display = 'block';
    const quickStats = document.getElementById('quickStatsRow');
    if (quickStats) quickStats.style.display = 'none';
    const continueBlock = document.getElementById('continueWatchingBlock');
    if (continueBlock) continueBlock.style.display = 'none';

    const bannerActions = document.getElementById('bannerActions');
    if (bannerActions) {
        bannerActions.innerHTML = '<button class="btn btn-primary btn-large" onclick="openAuthModal(\'register\')">✨ ' + (typeof _lang !== 'undefined' && _lang === 'en' ? 'Sign Up Free' : 'Ücretsiz Kayıt Ol') + '</button><button class="btn btn-ghost btn-large" onclick="switchSection(\'discover\')">🔍 ' + (typeof _lang !== 'undefined' && _lang === 'en' ? 'Discover' : 'Keşfet') + '</button>';
    }
}

// ===== BAN MOD UI =====
function updateUIForBanned() {
    if (!currentUser) return;

    const show = (id, disp = 'flex') => { const e = document.getElementById(id); if (e) e.style.display = disp; };
    const hide = (id) => { const e = document.getElementById(id); if (e) e.style.display = 'none'; };

    // Header: normal kullanıcı gibi göster (giriş yapmış)
    hide('guestHeaderBtns');
    show('userMenuWrapper', 'flex');
    hide('addContentBtn');       // İçerik ekleme yasak
    show('levelBadge', 'flex');
    show('streakBadge', 'flex');
    show('totalBadge', 'flex');
    hide('guestAppBanner');

    // Tüm nav tab'larını kilitle - sadece library ve discover açık
    document.querySelectorAll('[data-section]').forEach(tab => {
        const section = tab.getAttribute('data-section');
        const allowed = ['library', 'discover', 'home'];
        if (!allowed.includes(section)) {
            tab.setAttribute('onclick', "showBanNotice()");
        }
    });

    // Banner aksiyonları - sadece keşfet
    const bannerActions = document.getElementById('bannerActions');
    if (bannerActions) {
        bannerActions.innerHTML = '<button class="btn btn-ghost btn-large" onclick="switchSection(\'discover\')">🔍 ' + (typeof _lang !== 'undefined' && _lang === 'en' ? 'Discover' : 'Keşfet') + '</button>';
    }

    const guestCTA = document.getElementById('guestCTA');
    if (guestCTA) guestCTA.style.display = 'none';

    updateHeaderUser();
}

function showBanNotice() {
    const reason = window.currentUser?.banReason || 'Rule violation';
    const expiry = window.currentUser?.banExpiry;
    const expiryText = expiry
        ? new Date(expiry).toLocaleDateString('en-US') + ' until'
        : 'permanently';
    showNotification('🚫 Hesabın ' + expiryText + ' kısıtlı. Sebep: ' + reason, 'error');
}

// Prevent banned user from writing in chat - called from chat.js
function isBannedUser() {
    return !!(window.currentUser?.isBanned);
}



function updateHeaderUser() {
    if (!currentUser) return;
    const social   = dataManager.data?.social || {};
    const username = social.name || currentUser.displayName || 'Kullanıcı';
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // Avatar: sadece dropdown içindeki avatar alanını güncelle
    const dropAv = document.getElementById('dropdownAvatar');
    if (dropAv) {
        if (social.avatarUrl) {
            dropAv.style.cssText = 'background-image:url(' + social.avatarUrl + ');background-size:cover;background-position:center;width:40px;height:40px;border-radius:50%;flex-shrink:0;';
            dropAv.textContent = '';
        } else {
            dropAv.style.cssText = '';
            dropAv.textContent = social.avatar || '👤';
        }
    }

    setEl('headerUsername', username);
    setEl('dropdownName', username);
    setEl('dropdownEmail', currentUser.email || '');
}

function requireAuth(section) {
    if (isGuest || !currentUser) {
        showNotification(typeof _lang !== 'undefined' && _lang === 'en' ? 'Sign in to use this feature! 🔐' : 'Bu özelliği kullanmak için giriş yapın! 🔐', 'error');
        openAuthModal('login');
        return;
    }
    switchSection(section);
}

// ===== DROPDOWN =====
function toggleUserDropdown() {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.toggle('show');
}

function closeUserDropdown() {
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('show');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu-wrapper')) closeUserDropdown();
});

// ===== PASSWORD UTILITIES =====
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; if (btn) btn.textContent = '🙈'; }
    else { input.type = 'password'; if (btn) btn.textContent = '👁️'; }
}

function checkPasswordStrength(password) {
    const bar = document.getElementById('strengthBar');
    const text = document.getElementById('strengthText');
    if (!bar || !text) return;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    const colors = ['', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
    const labels = ['', 'Çok zayıf', 'Zayıf', 'Orta', 'Güçlü', 'Çok güçlü'];
    const widths = ['', '20%', '40%', '60%', '80%', '100%'];
    bar.style.width = widths[s] || '0%';
    bar.style.background = colors[s] || '';
    text.textContent = labels[s] || '';
    text.style.color = colors[s] || '';
}

// ===== ERROR HELPERS =====
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) { el.textContent = '⚠️ ' + message; el.style.display = 'block'; }
}

function clearAllErrors() {
    ['loginError', 'registerError', 'forgotError', 'forgotSuccess'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; el.textContent = ''; }
    });
}

function setButtonLoading(btn, loading, html) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
        btn.innerHTML = '<span class="btn-spinner"></span> ' + html;
    } else {
        btn.innerHTML = html;
    }
}

function getSupabaseErrorMessage(msg) {
    if (!msg) return 'Bir hata oluştu.';
    if (msg.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı!';
    if (msg.includes('Email not confirmed')) return 'E-postanızı doğrulayın! Gelen kutunuzu kontrol edin.';
    if (msg.includes('User already registered')) return 'Bu e-posta zaten kayıtlı! Giriş yapmayı deneyin.';
    if (msg.includes('Password should be')) return 'Şifre en az 6 karakter olmalı!';
    if (msg.includes('Unable to validate')) return 'Geçersiz e-posta adresi!';
    if (msg.includes('Email rate limit')) return 'Çok fazla deneme. Lütfen birkaç dakika bekleyin.';
    if (msg.includes('network') || msg.includes('fetch')) return 'İnternet bağlantınızı kontrol edin.';
    if (msg.includes('signup')) return 'Kayıt işlemi başarısız. Lütfen tekrar deneyin.';
    return msg;
}

// Sayfa kapanmadan kaydet
window.addEventListener('beforeunload', () => {
    if (dataManager && dataManager.currentUserId && dataManager.data) {
        // 1. localStorage'a yaz (senkron, her zaman çalışır)
        try {
            const s = JSON.stringify(dataManager.data);
            localStorage.setItem('onilist_user_' + dataManager.currentUserId, s);
            localStorage.setItem('onilist_backup_' + dataManager.currentUserId, s);
        } catch(e) {}

        // 2. Bekleyen Supabase zamanlayıcısını iptal edip anında gönder
        dataManager.flushNow();
    }
});

console.log('✅ Auth v5.2 - Supabase loaded (secure)');


// ===== ŞİFRE DEĞİŞTİRME (Ayarlar sayfası) =====
function checkPasswordStrengthSettings(pw) {
    const bar = document.getElementById('settingsPwStrengthBar');
    const txt = document.getElementById('settingsPwStrengthText');
    if (!bar || !txt) return;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const colors = ['#ef4444','#f97316','#eab308','#22c55e'];
    const labels = ['Zayıf 😟','Orta 😐','İyi 👍','Güçlü 💪'];
    bar.style.width = (score * 25) + '%';
    bar.style.background = colors[score-1] || '#ef4444';
    txt.textContent = pw.length ? labels[score-1] || 'Zayıf' : '';
    txt.style.color = colors[score-1] || '#ef4444';
}

async function changePasswordSettings() {
    const currentPw = (document.getElementById('currentPassword')?.value || '').trim();
    const newPw = (document.getElementById('newPassword')?.value || '').trim();
    const confirmPw = (document.getElementById('confirmNewPassword')?.value || '').trim();
    const errEl = document.getElementById('pwChangeError');
    const sucEl = document.getElementById('pwChangeSuccess');
    const btn = document.getElementById('pwChangeBtn');

    if (errEl) errEl.style.display = 'none';
    if (sucEl) sucEl.style.display = 'none';

    if (!currentPw) { if (errEl) { errEl.textContent = '⚠️ Mevcut şifrenizi girin.'; errEl.style.display = 'block'; } return; }
    if (!newPw || newPw.length < 8) { if (errEl) { errEl.textContent = '⚠️ Yeni şifre en az 8 karakter olmalıdır.'; errEl.style.display = 'block'; } return; }
    if (newPw !== confirmPw) { if (errEl) { errEl.textContent = '⚠️ Yeni şifreler eşleşmiyor!'; errEl.style.display = 'block'; } return; }
    if (currentPw === newPw) { if (errEl) { errEl.textContent = '⚠️ Yeni şifre mevcut şifreyle aynı olamaz.'; errEl.style.display = 'block'; } return; }

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Güncelleniyor...'; }

    try {
        if (!window.supabaseClient || !currentUser) throw new Error('Oturum bulunamadı.');

        const { error: signInErr } = await window.supabaseClient.auth.signInWithPassword({
            email: currentUser.email, password: currentPw
        });
        if (signInErr) throw new Error('Mevcut şifre yanlış!');

        const { error: updateErr } = await window.supabaseClient.auth.updateUser({ password: newPw });
        if (updateErr) throw updateErr;

        if (sucEl) { sucEl.textContent = '✅ Password updated successfully!'; sucEl.style.display = 'block'; }
        ['currentPassword','newPassword','confirmNewPassword'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        const bar = document.getElementById('settingsPwStrengthBar');
        if (bar) bar.style.width = '0%';
        if (btn) { btn.disabled = false; btn.textContent = '🔐 Şifreyi Güncelle'; }
        setTimeout(() => { if (sucEl) sucEl.style.display = 'none'; }, 4000);
    } catch(e) {
        if (btn) { btn.disabled = false; btn.textContent = '🔐 Şifreyi Güncelle'; }
        if (errEl) { errEl.textContent = '❌ ' + (e.message || 'Bir hata oluştu.'); errEl.style.display = 'block'; }
    }
}

function togglePwVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
    else { input.type = 'password'; btn.textContent = '👁'; }
}

// ===== ŞİFREMİ UNUTTUM - GELİŞMİŞ =====
async function handleForgotPassword() {
    if (!window.supabaseClient) { showError('forgotError', 'Sunucu bağlantısı kurulamadı.'); return; }

    const emailEl = document.getElementById('forgotEmail');
    const btn = document.querySelector('#modalForgotBox .auth-btn-primary');
    if (!emailEl) return;

    const email = emailEl.value.trim();
    if (!email) { showError('forgotError', 'E-posta adresinizi girin!'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('forgotError', 'Geçerli bir e-posta adresi girin.'); return; }

    clearAllErrors();
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span> Gönderiliyor...'; }

    try {
        const redirectUrl = window.location.origin + window.location.pathname + '?reset=1';
        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
        if (error && (error.message.includes('rate limit') || error.message.includes('Rate limit'))) {
            throw new Error('Çok fazla deneme. Lütfen birkaç dakika bekleyin.');
        }
        const successEl = document.getElementById('forgotSuccess');
        if (successEl) {
            successEl.style.display = 'block';
            successEl.innerHTML = '✅ <strong>' + email + '</strong> adresine sıfırlama linki gönderildi!<br><small style="opacity:0.8;">Gelmezse spam klasörünü kontrol edin. Link 1 saat geçerlidir.</small>';
        }
        if (btn) btn.style.display = 'none';
    } catch(e) {
        if (btn) { btn.disabled = false; btn.innerHTML = '<span>Sıfırlama Linki Gönder</span>'; }
        showError('forgotError', e.message || 'Bir hata oluştu.');
    }
}