// AUTH.JS v5.1 - Supabase Auth - Tum hatalar duzeltildi

// ── ADMiN CONFiG ──────────────────────────────────────────────────────────────
// Admin status is read from the is_admin column in user_data (set server-side in Supabase).
// No admin emails are hardcoded here. To grant admin access: set is_admin = true in Supabase.
// ─────────────────────────────────────────────────────────────────────────────

let currentUser = null;
let isGuest = true;

// ===== iNiT =====
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

    // Guvenlik timeout - 8 saniye icinde cevap gelmezse guest moda gec
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

    // Auth state degisikliklerini dinle (subscription saklaniyor, memory leak onlenir)
    try {
        if (window._authSubscription) {
            window._authSubscription.unsubscribe();
        }
        const { data: { subscription } } = window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
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
        window._authSubscription = subscription;
    } catch(e) {
        console.warn('Auth state listener error:', e);
    }
}

async function loginSuccess(user) {
    // displayName XSS korumasi: script/html karakterleri temizleniyor
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

    // Once localStorage'dan yukle (aninda, kayip riski yok)
    dataManager.setUser(user.id);

    // Mevcut kullanici adi bos veya 'User'sa user_metadata.username ile guncelle
    const _metaName = user.user_metadata?.username;
    if (_metaName && (!dataManager.data.social?.name || dataManager.data.social.name === 'User' || dataManager.data.social.name === '')) {
        dataManager.data.social.name = _metaName;
    }

    // Admin status is controlled exclusively by is_admin column in Supabase user_data.
    // To grant admin: UPDATE user_data SET data = data || '{"is_admin": true}' WHERE data->>'email' = 'owner@email.com';

    // ── BAN CHECK: Supabase'den gelen remote data kullanilir.
    // localStorage manipule edilerek ban atlanamaz. ────────────
    let _remoteDataForBan = null;

    try {
        const { data, error } = await window.supabaseClient
            .from('user_data')
            .select('data,is_admin')
            .eq('user_id', user.id)
            .single();

        // Admin: DB kolonu VEYA owner email
        const OWNER_EMAILS = ['list086@gmail.com'];
        if (OWNER_EMAILS.includes(currentUser.email?.toLowerCase()) || data?.data?.is_admin === true || data?.is_admin === true) {
            currentUser.isAdmin = true;
        }

        // Ban kontrolu icin remote data'yi sakla
        if (!error && data && data.data) {
            _remoteDataForBan = data.data;
        }

        if (!error && data && data.data) {
            // Data exists in Supabase — always prefer remote on mobile (localStorage may be empty)
            const remoteItems = data.data.items || [];
            const localItems = dataManager.data.items || [];
            if (remoteItems.length >= localItems.length) {
                dataManager.setUser(user.id, data.data); // Remote is fuller, use it
            } else {
                dataManager.saveAll(); // Local is fuller, update Supabase
            }
            // Supabase verisi yuklendi, library/profile render edilecek (Ui updateUiForLoggedin fonksiyon sonunda cagriliyor)
            if (typeof renderLibrary === 'function') renderLibrary();
            if (typeof renderProfile === 'function') renderProfile();
            if (typeof updateXPDisplay === 'function') updateXPDisplay();
        } else if (error && error.code === 'PGRST116') {
            // Supabase'de kayit yok — YENI KULLANiCi KONTROLU
            // ONEMLI: localStorage'da veri varsa (eski kullanici, Supabase pause/silindi)
            // kesinlikle sifirlama yapma, mevcut lokal veriyi Supabase'e yukle.
            const hasLocalData = dataManager.data.items && dataManager.data.items.length > 0;
            const hasLocalXP   = dataManager.data.xp && dataManager.data.xp.total > 0;

            if (hasLocalData || hasLocalXP) {
                // Eski kullanici — Supabase kaydi kaybolmus, lokal veri saglam
                console.warn('[Auth] Supabase kaydi bulunamadi ama localStorage verisi var — Supabase\'e yukleniyor (veri korunuyor).');
                dataManager.saveAll();
            } else {
                // Gercekten yeni kullanici — sosyal bilgileri doldur
                // user_metadata.username kayit formundaki isimdir, once onu dene
                const _regName = user.user_metadata?.username || currentUser.displayName;
                dataManager.data.social.name  = _regName;
                dataManager.data.social.email = currentUser.email;
                dataManager.saveAll();
            }
        } else if (error) {
            console.warn('Supabase fetch error:', error.message);
            // localStorage verisi zaten yuklu, sorun yok
        }
    } catch(e) {
        console.warn('Could not sync with Supabase, using localStorage:', e.message);
    }

    // ── BAN CHECK ────────────────────────────────────────────
    // GUVENLiK: Ban durumu YALNiZCA Supabase'den gelen _remoteDataForBan uzerinden kontrol edilir.
    // dataManager.data (localStorage kaynakli) kullanilmaz — kullanici tarafindan manipule edilebilir.
    const _banSource = _remoteDataForBan;
    if (_banSource && _banSource.banned === true) {
        // Check if ban has expired
        const banExpiry = _banSource.ban_expiry;
        const isExpired = banExpiry && new Date(banExpiry) < new Date();

        if (!isExpired) {
            // Banned user - restricted mode
            currentUser.isBanned = true;
            currentUser.banReason = _banSource.ban_reason || 'Rule violation';
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
            // Ban expired - remove automatically from Supabase
            if (window.supabaseClient) {
                window.supabaseClient
                    .from('user_data')
                    .update({ data: { ..._banSource, banned: false, ban_reason: null, ban_expiry: null } })
                    .eq('user_id', user.id)
                    .then(({ error: e }) => { if (e) console.warn('Ban expiry clear error:', e.message); });
            }
            // Local kopyayi da temizle
            if (dataManager.data) {
                dataManager.data.banned = false;
                dataManager.data.ban_reason = null;
                dataManager.data.ban_expiry = null;
                dataManager.saveAll();
            }
        }
    }
    // ── BAN CHECK END ───────────────────────────────────────

    updateUIForLoggedIn();
    if (typeof initializeApp === 'function') initializeApp();
    hideLoadingScreen();
    document.dispatchEvent(new Event('onilist:authChange'));
    // Duyuru otomatik popup devre disi - admin panelden gonderilince gosterilir
}

function guestMode() {
    currentUser = null;
    window.currentUser = null;
    isGuest = true;
    dataManager.data = dataManager.defaultData();
    updateUIForGuest();
    if (typeof initializeApp === 'function') initializeApp();
    hideLoadingScreen();
    // Duyuru otomatik popup devre disi - admin panelden gonderilince gosterilir
}

// ===== LOADiNG =====
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

// Modal backdrop tiklamasi - metin secimi sirasinda kapanmaz
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

// Backdrop tiklamasi mousedown/mouseup ile ustte handle ediliyor

// ===== LOGiN =====
async function handleLogin(event) {
    event.preventDefault();

    if (!window.supabaseClient) {
        showError('loginError', 'Sunucu baglantisi kurulamadi. Lutfen sayfayi yenileyin.');
        return;
    }

    const emailEl = document.getElementById('loginEmail');
    const passwordEl = document.getElementById('loginPassword');
    if (!emailEl || !passwordEl) return;

    const email = emailEl.value.trim();
    const password = passwordEl.value;

    if (!email) { showError('loginError', 'Please enter your email address!'); return; }
    if (!password) { showError('loginError', 'Please enter your password!'); return; }

    const btn = document.getElementById('loginBtn');
    setButtonLoading(btn, true, 'Signing in...');
    clearAllErrors();

    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;

        closeAuthModal();
        showNotification('Welcome back! 🎉', 'success');
    } catch(error) {
        setButtonLoading(btn, false, '<span>Sign In</span><span class="btn-arrow">→</span>');
        showError('loginError', getSupabaseErrorMessage(error.message));
    }
}

// ===== REGiSTER =====
async function handleRegister(event) {
    event.preventDefault();

    if (!window.supabaseClient) {
        showError('registerError', 'Sunucu baglantisi kurulamadi. Lutfen sayfayi yenileyin.');
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
        showError('registerError', 'Kullanici adi en az 3 karakter olmali!');
        return;
    }
    if (!email) {
        showError('registerError', 'Please enter your email address!');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('registerError', 'Gecerli bir e-posta adresi giriniz!');
        return;
    }
    if (!password || password.length < 6) {
        showError('registerError', 'Password must be at least 6 characters!');
        return;
    }
    if (password !== confirm) {
        showError('registerError', 'Passwords do not match!');
        return;
    }

    const btn = document.getElementById('registerBtn');
    setButtonLoading(btn, true, 'Hesap olusturuluyor...');

    try {
        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { username } }
        });

        if (error) throw error;

        // Kullanici olusturuldu ama email dogrulama gerekebilir
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            // Email zaten kayitli
            throw new Error('User already registered');
        }

        setButtonLoading(btn, false, '<span>Create Account</span><span class="btn-arrow">→</span>');
        closeAuthModal();

        if (data.session) {
            // Email dogrulama kapali - direkt giris
            // username'i social.name olarak hemen kaydet
            setTimeout(() => {
                if (dataManager.data?.social) {
                    dataManager.data.social.name  = username;
                    dataManager.data.social.email = email;
                    dataManager.saveAll();
                    if (typeof updateHeaderUser === 'function') updateHeaderUser();
                }
            }, 600);
            showNotification('Account created! Welcome, ' + username + '! 🎉', 'success');
        } else {
            // Email dogrulama acik
            showNotification('Account created! Please verify your email address. 📧', 'info');
        }
    } catch(error) {
        setButtonLoading(btn, false, '<span>Create Account</span><span class="btn-arrow">→</span>');
        showError('registerError', getSupabaseErrorMessage(error.message));
    }
}

// ===== FORGOT PASSWORD =====
// ===== LOGOUT =====
async function handleLogout() {
    if (document.getElementById('logoutConfirmBox')) return;

    // DOM tabanli olusturma — innerHTML/XSS riski yok
    const box = document.createElement('div');
    box.id = 'logoutConfirmBox';
    box.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-8px);z-index:999999;background:#141824;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:1.4rem 1.6rem;width:320px;box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(255,51,102,0.15);font-family:DM Sans,sans-serif;opacity:0;transition:all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);';

    const iconDiv = document.createElement('div');
    iconDiv.style.cssText = 'width:36px;height:36px;background:rgba(255,51,102,0.12);border:1px solid rgba(255,51,102,0.25);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;';
    iconDiv.textContent = '👋';

    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'color:#fff;font-weight:700;font-size:0.95rem;';
    titleDiv.textContent = 'Cikis Yap';

    const subDiv = document.createElement('div');
    subDiv.style.cssText = 'color:#8892a4;font-size:0.78rem;margin-top:1px;';
    subDiv.textContent = 'Hesabindan cikmak istiyor musun?';

    const textWrap = document.createElement('div');
    textWrap.appendChild(titleDiv);
    textWrap.appendChild(subDiv);

    const headerRow = document.createElement('div');
    headerRow.style.cssText = 'display:flex;align-items:center;gap:0.7rem;margin-bottom:1rem;';
    headerRow.appendChild(iconDiv);
    headerRow.appendChild(textWrap);

    const cancelBtn = document.createElement('button');
    cancelBtn.style.cssText = 'flex:1;padding:0.6rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#a0a8b9;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;';
    cancelBtn.textContent = 'Iptal';

    const confirmBtn = document.createElement('button');
    confirmBtn.style.cssText = 'flex:1;padding:0.6rem;background:linear-gradient(135deg,#ff3366,#ff5580);border:none;border-radius:10px;color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;box-shadow:0 4px 15px rgba(255,51,102,0.35);';
    confirmBtn.textContent = 'Cikis Yap';

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
        showNotification('Cikis yapildi. Gorusuruz! 👋', 'info');
    };

    setTimeout(function() {
        document.addEventListener('click', function handler(e) {
            if (!box.contains(e.target)) { closeBox(); document.removeEventListener('click', handler); }
        });
    }, 100);
}


// ===== DELETE ACCOUNT (Permanent) =====
// DOM tabanli iki adimli onay — native confirm/prompt kullanilmaz (mobil uyumsuzluk, engellenme riski)
function deleteAccount() {
    if (!currentUser) return;
    if (document.getElementById('deleteAccountBox')) return;

    const email = currentUser.email || '';

    // ── ADiM 1: Ilk onay kutusu ──────────────────────────────
    const box = document.createElement('div');
    box.id = 'deleteAccountBox';
    box.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999999;background:#141824;border:1px solid rgba(239,68,68,0.35);border-radius:16px;padding:1.6rem;width:340px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.7);font-family:DM Sans,sans-serif;opacity:0;transition:opacity 0.25s;';

    function _closeBox() {
        box.style.opacity = '0';
        setTimeout(() => { if (box.parentNode) box.parentNode.removeChild(box); }, 250);
    }

    function _buildStep1() {
        box.textContent = '';
        // Ikon + Baslik
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = 'width:40px;height:40px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;margin-bottom:0.9rem;';
        iconDiv.textContent = '⚠️';

        const title = document.createElement('div');
        title.style.cssText = 'color:#fff;font-weight:700;font-size:1rem;margin-bottom:0.4rem;';
        title.textContent = 'Hesabi Kalici Sil';

        const desc = document.createElement('div');
        desc.style.cssText = 'color:#8892a4;font-size:0.82rem;line-height:1.5;margin-bottom:1.2rem;';
        desc.textContent = 'Bu islem GERI ALiNAMAZ. Tum verileriniz, listeniz ve basarimlariniz kalici olarak silinecek.';

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:0.6rem;';

        const cancelBtn = document.createElement('button');
        cancelBtn.style.cssText = 'flex:1;padding:0.6rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#a0a8b9;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;';
        cancelBtn.textContent = 'Iptal';
        cancelBtn.onclick = _closeBox;

        const nextBtn = document.createElement('button');
        nextBtn.style.cssText = 'flex:1;padding:0.6rem;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);border-radius:10px;color:#ef4444;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;';
        nextBtn.textContent = 'Devam Et →';
        nextBtn.onclick = _buildStep2;

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(nextBtn);
        box.appendChild(iconDiv);
        box.appendChild(title);
        box.appendChild(desc);
        box.appendChild(btnRow);
    }

    function _buildStep2() {
        box.textContent = '';

        const title = document.createElement('div');
        title.style.cssText = 'color:#ef4444;font-weight:700;font-size:0.95rem;margin-bottom:0.5rem;';
        title.textContent = '📧 E-posta adresinizi girin';

        const desc = document.createElement('div');
        desc.style.cssText = 'color:#8892a4;font-size:0.8rem;margin-bottom:0.8rem;';
        desc.textContent = 'Onaylamak icin kayitli e-posta adresinizi yazin:';

        const emailHint = document.createElement('div');
        emailHint.style.cssText = 'color:#ff3366;font-size:0.8rem;font-weight:600;margin-bottom:0.6rem;background:rgba(255,51,102,0.08);border-radius:6px;padding:0.4rem 0.6rem;word-break:break-all;';
        emailHint.textContent = email;

        const input = document.createElement('input');
        input.type = 'email';
        input.placeholder = 'E-posta adresiniz...';
        input.style.cssText = 'width:100%;padding:0.7rem 0.9rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;font-size:0.88rem;font-family:DM Sans,sans-serif;outline:none;box-sizing:border-box;margin-bottom:0.5rem;';
        input.addEventListener('focus', () => { input.style.borderColor = 'rgba(239,68,68,0.5)'; });
        input.addEventListener('blur', () => { input.style.borderColor = 'rgba(255,255,255,0.1)'; });

        const errMsg = document.createElement('div');
        errMsg.style.cssText = 'color:#ef4444;font-size:0.78rem;min-height:1rem;margin-bottom:0.5rem;display:none;';
        errMsg.textContent = '❌ E-posta eslesmedi!';

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:0.6rem;margin-top:0.3rem;';

        const backBtn = document.createElement('button');
        backBtn.style.cssText = 'flex:1;padding:0.6rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#a0a8b9;font-size:0.85rem;font-weight:600;cursor:pointer;font-family:DM Sans,sans-serif;';
        backBtn.textContent = '← Geri';
        backBtn.onclick = _buildStep1;

        const confirmBtn = document.createElement('button');
        confirmBtn.style.cssText = 'flex:1;padding:0.6rem;background:linear-gradient(135deg,#dc2626,#ef4444);border:none;border-radius:10px;color:#fff;font-size:0.85rem;font-weight:700;cursor:pointer;font-family:DM Sans,sans-serif;';
        confirmBtn.textContent = '🗑️ Hesabi Sil';
        confirmBtn.onclick = async () => {
            const typed = input.value.trim().toLowerCase();
            if (typed !== email.toLowerCase()) {
                errMsg.style.display = 'block';
                input.style.borderColor = 'rgba(239,68,68,0.6)';
                return;
            }
            errMsg.style.display = 'none';
            confirmBtn.disabled = true;
            confirmBtn.textContent = '⏳ Siliniyor...';
            await _doDelete();
        };

        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmBtn.click(); });

        btnRow.appendChild(backBtn);
        btnRow.appendChild(confirmBtn);
        box.appendChild(title);
        box.appendChild(desc);
        box.appendChild(emailHint);
        box.appendChild(input);
        box.appendChild(errMsg);
        box.appendChild(btnRow);
        setTimeout(() => input.focus(), 50);
    }

    async function _doDelete() {
        try {
            if (window.supabaseClient) {
                const userId = currentUser.id || currentUser.uid;

                // 1. Tum verileri sil
                await window.supabaseClient.from('user_data').delete().eq('user_id', userId);
                try { await window.supabaseClient.from('reviews').delete().eq('user_id', userId); } catch(e){}
                try { await window.supabaseClient.from('comments').delete().eq('user_id', userId); } catch(e){}

                // 2. Permanently delete from auth.users via RPC
                const { error: rpcErr } = await window.supabaseClient.rpc('delete_user');
                if (rpcErr) {
                    console.warn('RPC yok, hesap auth tablosundan silinemedi:', rpcErr.message);
                    showNotification('⚠️ Hesap verileri silindi ancak kimlik dogrulama kaydi tam silinemedi. Destek ekibiyle iletisime gecin.', 'warning');
                }

                // 3. localStorage temizle
                Object.keys(localStorage)
                    .filter(k => k.includes(userId) || k.includes('onilist'))
                    .forEach(k => localStorage.removeItem(k));

                // 4. Oturumu kapat
                await window.supabaseClient.auth.signOut();
            }

            _closeBox();
            currentUser = null;
            isGuest = true;
            dataManager.data = dataManager.defaultData();
            dataManager.currentUserId = null;
            updateUIForGuest();
            switchSection('home');
            showNotification('Hesabiniz silindi. Gorusuruz!', 'info');
        } catch(e) {
            console.error('Hesap silme hatasi:', e);
            showNotification('Hata olustu: ' + e.message, 'error');
            _closeBox();
        }
    }

    _buildStep1();
    document.body.appendChild(box);
    setTimeout(() => { box.style.opacity = '1'; }, 10);

    // Disariya tiklayinca kapat
    setTimeout(() => {
        document.addEventListener('click', function _handler(e) {
            if (!box.contains(e.target)) { _closeBox(); document.removeEventListener('click', _handler); }
        });
    }, 100);
}

// ===== Ui STATE =====
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
        bannerActions.textContent = '';
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary btn-large';
        addBtn.onclick = () => openAddModal();
        addBtn.textContent = (typeof _lang !== 'undefined' && _lang === 'en') ? '✨ Add Content' : '✨ Icerik Ekle';
        const discBtn = document.createElement('button');
        discBtn.className = 'btn btn-ghost btn-large';
        discBtn.onclick = () => switchSection('discover');
        discBtn.textContent = (typeof _lang !== 'undefined' && _lang === 'en') ? '🔍 Discover' : '🔍 Kesfet';
        bannerActions.appendChild(addBtn);
        bannerActions.appendChild(discBtn);
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
        bannerActions.textContent = '';
        const regBtn = document.createElement('button');
        regBtn.className = 'btn btn-primary btn-large';
        regBtn.onclick = () => openAuthModal('register');
        regBtn.textContent = (typeof _lang !== 'undefined' && _lang === 'en') ? '✨ Sign Up Free' : '✨ Ucretsiz Kayit Ol';
        const discBtn = document.createElement('button');
        discBtn.className = 'btn btn-ghost btn-large';
        discBtn.onclick = () => switchSection('discover');
        discBtn.textContent = (typeof _lang !== 'undefined' && _lang === 'en') ? '🔍 Discover' : '🔍 Kesfet';
        bannerActions.appendChild(regBtn);
        bannerActions.appendChild(discBtn);
    }
}

// ===== BAN MOD Ui =====
function updateUIForBanned() {
    if (!currentUser) return;

    const show = (id, disp = 'flex') => { const e = document.getElementById(id); if (e) e.style.display = disp; };
    const hide = (id) => { const e = document.getElementById(id); if (e) e.style.display = 'none'; };

    // Header: normal kullanici gibi goster (giris yapmis)
    hide('guestHeaderBtns');
    show('userMenuWrapper', 'flex');
    hide('addContentBtn');       // Icerik ekleme yasak
    show('levelBadge', 'flex');
    show('streakBadge', 'flex');
    show('totalBadge', 'flex');
    hide('guestAppBanner');

    // Tum nav tab'larini kilitle - sadece library ve discover acik
    document.querySelectorAll('[data-section]').forEach(tab => {
        const section = tab.getAttribute('data-section');
        const allowed = ['library', 'discover', 'home'];
        if (!allowed.includes(section)) {
            tab.setAttribute('onclick', "showBanNotice()");
        }
    });

    // Banner aksiyonlari - sadece kesfet
    const bannerActions = document.getElementById('bannerActions');
    if (bannerActions) {
        bannerActions.textContent = '';
        const discBtn = document.createElement('button');
        discBtn.className = 'btn btn-ghost btn-large';
        discBtn.onclick = () => switchSection('discover');
        discBtn.textContent = (typeof _lang !== 'undefined' && _lang === 'en') ? '🔍 Discover' : '🔍 Kesfet';
        bannerActions.appendChild(discBtn);
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
    showNotification('🚫 Hesabin ' + expiryText + ' kisitli. Sebep: ' + reason, 'error');
}

// Prevent banned user from writing in chat - called from chat.js
function isBannedUser() {
    return !!(window.currentUser?.isBanned);
}



function updateHeaderUser() {
    if (!currentUser) return;
    const social   = dataManager.data?.social || {};
    const username = social.name || currentUser.displayName || 'Kullanici';
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    // Avatar: sadece dropdown icindeki avatar alanini guncelle
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
        showNotification(typeof _lang !== 'undefined' && _lang === 'en' ? 'Sign in to use this feature! 🔐' : 'Bu ozelligi kullanmak icin giris yapin! 🔐', 'error');
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

// ===== PASSWORD UTiLiTiES =====
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
    const labels = ['', 'Cok zayif', 'Zayif', 'Orta', 'Guclu', 'Cok guclu'];
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
    if (!msg) return 'Bir hata olustu.';
    if (msg.includes('Invalid login credentials')) return 'Invalid email or password!';
    if (msg.includes('Email not confirmed')) return 'Please verify your email! Check your inbox.';
    if (msg.includes('User already registered')) return 'This email is already registered! Try signing in.';
    if (msg.includes('Password should be')) return 'Password must be at least 6 characters!';
    if (msg.includes('Unable to validate')) return 'Gecersiz e-posta adresi!';
    if (msg.includes('Email rate limit')) return 'Cok fazla deneme. Lutfen birkac dakika bekleyin.';
    if (msg.includes('network') || msg.includes('fetch')) return 'Internet baglantinizi kontrol edin.';
    if (msg.includes('signup')) return 'Registration failed. Please try again.';
    return msg;
}

// Sayfa kapanmadan kaydet
window.addEventListener('beforeunload', () => {
    if (dataManager && dataManager.currentUserId && dataManager.data) {
        // 1. localStorage'a yaz (senkron, her zaman calisir)
        try {
            const s = JSON.stringify(dataManager.data);
            localStorage.setItem('onilist_user_' + dataManager.currentUserId, s);
            localStorage.setItem('onilist_backup_' + dataManager.currentUserId, s);
        } catch(e) {}

        // 2. Bekleyen Supabase zamanlayicisini iptal edip aninda gonder
        dataManager.flushNow();
    }
});

console.log('✅ Auth v5.2 - Supabase loaded (secure)');


// ===== SIFRE DEGISTIRME (Ayarlar sayfasi) =====
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
    const labels = ['Zayif 😟','Orta 😐','Iyi 👍','Guclu 💪'];
    bar.style.width = (score * 25) + '%';
    bar.style.background = colors[score-1] || '#ef4444';
    txt.textContent = pw.length ? labels[score-1] || 'Zayif' : '';
    txt.style.color = colors[score-1] || '#ef4444';
}


async function sendSettingsPasswordReset() {
    if (!currentUser || !currentUser.email) { showNotification("Oturum bilgisi bulunamadı.", "error"); return; }
    const successEl = document.getElementById("settingsResetSuccess");
    if (successEl) { successEl.style.display = "none"; successEl.textContent = ""; }
    try {
        const redirectUrl = window.location.origin + window.location.pathname + "?reset=1";
        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(currentUser.email, { redirectTo: redirectUrl });
        if (error && (error.message.includes("rate limit") || error.message.includes("Rate limit"))) { showNotification("Çok fazla deneme. Lütfen birkaç dakika bekleyin.", "error"); return; }
        if (successEl) { successEl.textContent = "✅ " + currentUser.email + " adresine şifre sıfırlama linki gönderildi!"; successEl.style.display = "block"; setTimeout(() => { successEl.style.display = "none"; }, 8000); }
    } catch(e) { showNotification("Hata: " + (e.message || "Bilinmeyen hata"), "error"); }
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

    if (!currentPw) { if (errEl) { errEl.textContent = '⚠️ Mevcut sifrenizi girin.'; errEl.style.display = 'block'; } return; }
    if (!newPw || newPw.length < 8) { if (errEl) { errEl.textContent = '⚠️ Yeni sifre en az 8 karakter olmalidir.'; errEl.style.display = 'block'; } return; }
    if (newPw !== confirmPw) { if (errEl) { errEl.textContent = '⚠️ Yeni sifreler eslesmiyor!'; errEl.style.display = 'block'; } return; }
    if (currentPw === newPw) { if (errEl) { errEl.textContent = '⚠️ Yeni sifre mevcut sifreyle ayni olamaz.'; errEl.style.display = 'block'; } return; }

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Updating...'; }

    try {
        if (!window.supabaseClient || !currentUser) throw new Error('Oturum bulunamadi.');

        const { error: signInErr } = await window.supabaseClient.auth.signInWithPassword({
            email: currentUser.email, password: currentPw
        });
        if (signInErr) throw new Error('Mevcut sifre yanlis!');

        const { error: updateErr } = await window.supabaseClient.auth.updateUser({ password: newPw });
        if (updateErr) throw updateErr;

        if (sucEl) {
            sucEl.textContent = (typeof _lang !== 'undefined' && _lang === 'en')
                ? '✅ Password updated successfully!'
                : '✅ Password updated successfully!';
            sucEl.style.display = 'block';
        }
        ['currentPassword','newPassword','confirmNewPassword'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        const bar = document.getElementById('settingsPwStrengthBar');
        if (bar) bar.style.width = '0%';
        if (btn) { btn.disabled = false; btn.textContent = '🔐 Update Password'; }
        setTimeout(() => { if (sucEl) sucEl.style.display = 'none'; }, 4000);
    } catch(e) {
        if (btn) { btn.disabled = false; btn.textContent = '🔐 Update Password'; }
        if (errEl) { errEl.textContent = '❌ ' + (e.message || 'Bir hata olustu.'); errEl.style.display = 'block'; }
    }
}

function togglePwVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
    else { input.type = 'password'; btn.textContent = '👁'; }
}

// ===== SIFREMI UNUTTUM - GELISMIS =====
async function handleForgotPassword() {
    if (!window.supabaseClient) { showError('forgotError', 'Sunucu baglantisi kurulamadi.'); return; }

    const emailEl = document.getElementById('forgotEmail');
    const btn = document.querySelector('#modalForgotBox .auth-btn-primary');
    if (!emailEl) return;

    const email = emailEl.value.trim();
    if (!email) { showError('forgotError', 'Please enter your email address!'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('forgotError', 'Gecerli bir e-posta adresi girin.'); return; }

    clearAllErrors();
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-spinner"></span> Gonderiliyor...'; }

    try {
        const redirectUrl = window.location.origin + window.location.pathname + '?reset=1';
        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
        if (error && (error.message.includes('rate limit') || error.message.includes('Rate limit'))) {
            throw new Error('Cok fazla deneme. Lutfen birkac dakika bekleyin.');
        }
        const successEl = document.getElementById('forgotSuccess');
        if (successEl) {
            successEl.style.display = 'block';
            successEl.textContent = '';
            const checkmark = document.createTextNode('✅ ');
            const strong = document.createElement('strong');
            strong.textContent = email;
            const rest = document.createTextNode(' adresine sifirlama linki gonderildi!');
            const small = document.createElement('small');
            small.style.opacity = '0.8';
            small.style.display = 'block';
            small.textContent = 'Gelmezse spam klasorunu kontrol edin. Link 1 saat gecerlidir.';
            successEl.appendChild(checkmark);
            successEl.appendChild(strong);
            successEl.appendChild(rest);
            successEl.appendChild(small);
        }
        if (btn) btn.style.display = 'none';
    } catch(e) {
        if (btn) { btn.disabled = false; btn.innerHTML = '<span>Sifirlama Linki Gonder</span>'; }
        showError('forgotError', e.message || 'Bir hata olustu.');
    }
}