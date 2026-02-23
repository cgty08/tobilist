// AUTH.JS v5.1 - Supabase Auth - Tüm hatalar düzeltildi

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
        console.warn('Supabase yüklenemedi, misafir moduna geçiliyor');
        guestMode();
        return;
    }

    // Güvenlik timeout - 8 saniye içinde cevap gelmezse guest moda geç
    let sessionResolved = false;
    const sessionTimeout = setTimeout(() => {
        if (!sessionResolved) {
            console.warn('Session zaman aşımı, misafir moduna geçiliyor');
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
    currentUser = {
        uid: user.id,
        displayName: user.user_metadata?.username || user.email.split('@')[0],
        email: user.email
    };
    isGuest = false;

    // Önce localStorage'dan yükle (anında, kayıp riski yok)
    dataManager.setUser(user.id);

    try {
        const { data, error } = await window.supabaseClient
            .from('user_data')
            .select('data')
            .eq('user_id', user.id)
            .single();

        if (!error && data && data.data) {
            // Supabase'de veri var - hangisi daha güncel?
            const remoteItems = data.data.items || [];
            const localItems = dataManager.data.items || [];
            if (remoteItems.length >= localItems.length) {
                dataManager.setUser(user.id, data.data); // Remote daha dolu, onu kullan
            } else {
                dataManager.saveAll(); // Local daha dolu, Supabase'i güncelle
            }
        } else if (error && error.code === 'PGRST116') {
            // Supabase'de kayıt yok (yeni kullanıcı)
            if (!dataManager.data.items.length) {
                // Gerçekten yeni - social bilgilerini doldur
                dataManager.data.social.name = currentUser.displayName;
                dataManager.data.social.email = currentUser.email;
            }
            dataManager.saveAll(); // Supabase'e ilk kaydı yap
        } else if (error) {
            console.warn('Supabase fetch error:', error.message);
            // localStorage verisi zaten yüklü, sorun yok
        }
    } catch(e) {
        console.warn('Could not sync with Supabase, using localStorage:', e.message);
    }

    updateUIForLoggedIn();
    if (typeof initializeApp === 'function') initializeApp();
    hideLoadingScreen();
    setTimeout(function() { if (typeof checkAnnouncements === 'function') checkAnnouncements(); }, 2500);
}

function guestMode() {
    currentUser = null;
    isGuest = true;
    dataManager.data = dataManager.defaultData();
    updateUIForGuest();
    if (typeof initializeApp === 'function') initializeApp();
    hideLoadingScreen();
    setTimeout(function() { if (typeof checkAnnouncements === 'function') checkAnnouncements(); }, 2500);
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
async function handleForgotPassword() {
    if (!window.supabaseClient) {
        showError('forgotError', 'Sunucu bağlantısı kurulamadı.');
        return;
    }

    const emailEl = document.getElementById('forgotEmail');
    if (!emailEl) return;

    const email = emailEl.value.trim();
    if (!email) { showError('forgotError', 'E-posta adresinizi girin!'); return; }
    clearAllErrors();

    try {
        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/index.html'
        });
        if (error) throw error;
        const successEl = document.getElementById('forgotSuccess');
        if (successEl) {
            successEl.style.display = 'block';
            successEl.textContent = '✅ ' + email + ' adresine şifre sıfırlama linki gönderildi!';
        }
    } catch(error) {
        showError('forgotError', getSupabaseErrorMessage(error.message));
    }
}

// ===== LOGOUT =====
async function handleLogout() {
    if (document.getElementById('logoutConfirmBox')) return;

    var box = document.createElement('div');
    box.id = 'logoutConfirmBox';
    box.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);z-index:999999;background:#141824;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:1.4rem 1.6rem;width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(255,51,102,0.15);font-family:DM Sans,sans-serif;opacity:0;transition:all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);';

    box.innerHTML = '<div style="display:flex;align-items:center;gap:0.7rem;margin-bottom:1rem;">'
        + '<div style="width:36px;height:36px;background:rgba(255,51,102,0.12);border:1px solid rgba(255,51,102,0.25);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">&#128075;</div>'
        + '<div>'
        + '<div style="color:#fff;font-weight:700;font-size:0.95rem;">&#199;&#305;k&#305;&#351; Yap</div>'
        + '<div style="color:#8892a4;font-size:0.78rem;margin-top:1px;">Hesab&#305;ndan &#231;&#305;kmak istiyor musun?</div>'
        + '</div></div>'
        + '<div style="display:flex;gap:0.6rem;">'
        + '<button id="logoutCancelBtn" style="flex:1;padding:0.6rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#a0a8b9;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;">&#304;ptal</button>'
        + '<button id="logoutConfirmBtn" style="flex:1;padding:0.6rem;background:linear-gradient(135deg,#ff3366,#ff5580);border:none;border-radius:10px;color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;box-shadow:0 4px 15px rgba(255,51,102,0.35);">&#199;&#305;k&#305;&#351; Yap</button>'
        + '</div>';

    document.body.appendChild(box);
    setTimeout(function() { box.style.opacity = '1'; box.style.transform = 'translateX(-50%) translateY(0)'; }, 10);

    function closeBox() {
        box.style.opacity = '0';
        setTimeout(function() { if (box.parentNode) box.parentNode.removeChild(box); }, 250);
    }

    document.getElementById('logoutCancelBtn').onclick = closeBox;

    document.getElementById('logoutConfirmBtn').onclick = async function() {
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
        showNotification('&#199;&#305;k&#305;&#351; yap&#305;ld&#305;. G&#246;r&#252;&#351;&#252;r&#252;z! &#128075;', 'info');
    };

    setTimeout(function() {
        document.addEventListener('click', function handler(e) {
            if (!box.contains(e.target)) { closeBox(); document.removeEventListener('click', handler); }
        });
    }, 100);
}


// ===== DELETE ACCOUNT =====
async function deleteAccount() {
    if (!currentUser) return;
    if (!confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;

    try {
        if (window.supabaseClient) {
            await window.supabaseClient.from('user_data').delete().eq('user_id', currentUser.uid);
            await window.supabaseClient.auth.signOut();
        }
        currentUser = null;
        isGuest = true;
        dataManager.data = dataManager.defaultData();
        dataManager.currentUserId = null;
        updateUIForGuest();
        switchSection('home');
        showNotification('Hesap verileri silindi.', 'info');
    } catch(e) {
        showNotification('İşlem sırasında hata: ' + e.message, 'error');
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

    // Admin linki - sadece admin emaili için
    const adminEmails = ['admin@tobilist.com', 'cgty08@gmail.com', 'list086@gmail.com'];
    const adminLink = document.getElementById('adminPanelLink');
    if (adminLink && currentUser && adminEmails.includes(currentUser.email)) {
        adminLink.style.display = 'block';
    }
    // Admin header butonu
    const adminHeaderBtn = document.getElementById('adminHeaderBtn');
    if (adminHeaderBtn && currentUser && adminEmails.includes(currentUser.email)) {
        adminHeaderBtn.style.display = 'inline-block';
    } else if (adminHeaderBtn) {
        adminHeaderBtn.style.display = 'none';
    }

    const bannerActions = document.getElementById('bannerActions');
    if (bannerActions) {
        bannerActions.innerHTML = '<button class="btn btn-primary btn-large" onclick="openAddModal()">✨ İçerik Ekle</button><button class="btn btn-ghost btn-large" onclick="switchSection(\'discover\')">🔍 Keşfet</button>';
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
    hide('adminHeaderBtn');
    show('guestAppBanner', 'flex');

    const guestCTA = document.getElementById('guestCTA');
    if (guestCTA) guestCTA.style.display = 'block';
    const quickStats = document.getElementById('quickStatsRow');
    if (quickStats) quickStats.style.display = 'none';
    const continueBlock = document.getElementById('continueWatchingBlock');
    if (continueBlock) continueBlock.style.display = 'none';

    const bannerActions = document.getElementById('bannerActions');
    if (bannerActions) {
        bannerActions.innerHTML = '<button class="btn btn-primary btn-large" onclick="openAuthModal(\'register\')">✨ Ücretsiz Kayıt Ol</button><button class="btn btn-ghost btn-large" onclick="switchSection(\'discover\')">🔍 Keşfet</button>';
    }
}

function updateHeaderUser() {
    if (!currentUser) return;
    const username = dataManager.data?.social?.name || currentUser.displayName || 'Kullanıcı';
    const avatar = dataManager.data?.social?.avatar || '👤';
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('headerAvatar', avatar);
    setEl('headerUsername', username);
    setEl('dropdownAvatar', avatar);
    setEl('dropdownName', username);
    setEl('dropdownEmail', currentUser.email || '');
}

function requireAuth(section) {
    if (isGuest || !currentUser) {
        showNotification('Bu özelliği kullanmak için giriş yapın! 🔐', 'error');
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
        try {
            const s = JSON.stringify(dataManager.data);
            localStorage.setItem('tobilist_user_' + dataManager.currentUserId, s);
            localStorage.setItem('tobilist_backup_' + dataManager.currentUserId, s);
        } catch(e) {}
    }
});

console.log('✅ Auth v5.1 - Supabase loaded');