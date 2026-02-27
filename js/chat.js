// ============================================
//   CHAT.JS v1.0 - OniList Topluluk Sohbeti
//   Supabase Realtime + localStorage fallback
// ============================================

const OniChat = (function () {

    // ── Config ──────────────────────────────────────────────
    const TABLE          = 'chat_messages';   // Supabase table adı
    const MAX_LEN        = 300;               // Maks karakter
    const MSG_LOAD_LIMIT = 50;                // Başlangıçta kaç mesaj yüklensin
    const RATE_LIMIT_MS  = 2500;              // Mesajlar arası min süre (ms)

    // ── State ────────────────────────────────────────────────
    let isOpen       = false;
    let realtimeCh   = null;
    let lastSentAt   = 0;
    let unreadCount  = 0;
    let initialized  = false;

    // ── HTML Şablonu ─────────────────────────────────────────
    function buildHTML() {
        const el = document.createElement('div');
        el.innerHTML = `
        <!-- Floating Button -->
        <button id="chatToggleBtn" title="Topluluk Sohbeti" aria-label="Sohbeti Aç">
            💬
            <span id="chatBadge"></span>
        </button>

        <!-- Chat Window -->
        <div id="chatWindow" role="dialog" aria-label="Topluluk Sohbeti">
            <!-- Header -->
            <div class="chat-header">
                <span class="chat-header-icon">🌍</span>
                <div class="chat-header-info">
                    <div class="chat-header-title">Topluluk Sohbeti</div>
                    <div class="chat-header-sub">
                        <span class="chat-online-dot"></span>
                        <span id="chatOnlineText">Bağlanıyor...</span>
                    </div>
                </div>
                <button class="chat-close-btn" id="chatCloseBtn" title="Kapat">✕</button>
            </div>

            <!-- Messages -->
            <div id="chatMessages">
                <div class="chat-loading">
                    <span class="chat-loading-dots">
                        <span></span><span></span><span></span>
                    </span>
                </div>
            </div>

            <!-- Guest Prompt (sadece giriş yapılmamışsa görünür) -->
            <div id="chatGuestPrompt" class="chat-guest-prompt" style="display:none;">
                <div class="chat-guest-icon">🔐</div>
                <h4>Sohbete Katıl</h4>
                <p>Mesaj göndermek için giriş yapman gerekiyor. Okumak herkese ücretsiz!</p>
                <button onclick="openAuthModal('login')">Giriş Yap →</button>
            </div>

            <!-- Input Area -->
            <div class="chat-input-area" id="chatInputArea">
                <textarea
                    id="chatInput"
                    placeholder="Bir şeyler yaz... (Enter = gönder)"
                    rows="1"
                    maxlength="${MAX_LEN}"
                ></textarea>
                <span id="chatCharCount" class="chat-char-count" style="display:none;"></span>
                <button id="chatSendBtn" disabled title="Gönder">➤</button>
            </div>
        </div>`;
        // Elementleri doğrudan body'ye ekle (diğer DOM'u bozmaz)
        while (el.firstChild) document.body.appendChild(el.firstChild);
    }

    // ── DOM Referansları ─────────────────────────────────────
    function q(id) { return document.getElementById(id); }

    // ── Toggle ───────────────────────────────────────────────
    function toggle() {
        isOpen = !isOpen;
        const win = q('chatWindow');
        if (isOpen) {
            win.style.display = 'flex';
            requestAnimationFrame(() => win.classList.add('open'));
            resetUnread();
            scrollToBottom(true);
            q('chatInput') && q('chatInput').focus();
            q('chatToggleBtn').innerHTML = '✕<span id="chatBadge"></span>';
        } else {
            win.classList.remove('open');
            setTimeout(() => { win.style.display = 'none'; }, 260);
            q('chatToggleBtn').innerHTML = '💬<span id="chatBadge"></span>';
        }
    }

    // ── Unread Badge ─────────────────────────────────────────
    function incrementUnread() {
        if (isOpen) return;
        unreadCount++;
        const badge = q('chatBadge');
        if (!badge) return;
        badge.classList.add('show');
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    }

    function resetUnread() {
        unreadCount = 0;
        const badge = q('chatBadge');
        if (badge) { badge.classList.remove('show'); badge.textContent = ''; }
    }

    // ── Scroll ───────────────────────────────────────────────
    function scrollToBottom(force) {
        const el = q('chatMessages');
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        if (force || atBottom) {
            setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
        }
    }

    // ── Render Mesaj ─────────────────────────────────────────
    function getMyUserId() {
        // auth.js'deki currentUser veya window.currentUser
        return (window.currentUser && window.currentUser.uid || window.currentUser.id) ? window.currentUser.uid || window.currentUser.id : null;
    }

    function getDisplayName(row) {
        // Önce display_name alanı, sonra email'den ilk kısım
        if (row.display_name) return row.display_name;
        if (row.email) return row.email.split('@')[0];
        return 'Kullanıcı';
    }

    function formatTime(isoStr) {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderMessage(row) {
        const container = q('chatMessages');
        if (!container) return;

        // Sistem mesajı
        if (row.type === 'system') {
            const div = document.createElement('div');
            div.className = 'chat-system';
            div.textContent = escapeHTML(row.content);
            container.appendChild(div);
            scrollToBottom(false);
            return;
        }

        const myId   = getMyUserId();
        const isOwn  = myId && row.user_id === myId;
        const avatar = row.avatar || '👤';
        const name   = escapeHTML(getDisplayName(row));
        const text   = escapeHTML(row.content || '');
        const time   = formatTime(row.created_at);

        const div = document.createElement('div');
        div.className = 'chat-msg' + (isOwn ? ' own' : '');
        div.dataset.msgId = row.id || '';
        div.innerHTML = `
            <div class="chat-avatar">${avatar}</div>
            <div class="chat-bubble-wrap">
                ${!isOwn ? `<div class="chat-sender">${name}</div>` : ''}
                <div class="chat-bubble">${text}</div>
                <div class="chat-time">${time}</div>
            </div>`;
        container.appendChild(div);

        if (!isOwn) incrementUnread();
        scrollToBottom(false);
    }

    function clearMessages() {
        const c = q('chatMessages');
        if (c) c.innerHTML = '';
    }

    function showLoading() {
        const c = q('chatMessages');
        if (!c) return;
        c.innerHTML = `<div class="chat-loading">
            <span class="chat-loading-dots"><span></span><span></span><span></span></span>
        </div>`;
    }

    function showSystemMsg(text) {
        renderMessage({ type: 'system', content: text });
    }

    // ── Supabase: Mesajları Yükle ─────────────────────────────
    async function loadMessages() {
        if (!window.supabaseClient) {
            clearMessages();
            showSystemMsg('💡 Sohbet geçici olarak kullanılamıyor.');
            return;
        }
        showLoading();

        const { data, error } = await window.supabaseClient
            .from(TABLE)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(MSG_LOAD_LIMIT);

        clearMessages();

        if (error) {
            showSystemMsg('⚠️ Mesajlar yüklenemedi. Tablo henüz oluşturulmamış olabilir.');
            console.warn('Chat load error:', error.message);
            setOnlineText('Bağlantı hatası');
            return;
        }

        if (!data || data.length === 0) {
            showSystemMsg('👋 Henüz mesaj yok. İlk mesajı sen gönder!');
        } else {
            // En eskiden en yeniye sırala
            [...data].reverse().forEach(row => renderMessage(row));
        }

        scrollToBottom(true);
        setOnlineText('Çevrimiçi · Canlı');
        subscribeRealtime();
    }

    // ── Supabase Realtime ────────────────────────────────────
    function subscribeRealtime() {
        if (!window.supabaseClient) return;
        if (realtimeCh) {
            try { window.supabaseClient.removeChannel(realtimeCh); } catch(e) {}
        }

        realtimeCh = window.supabaseClient
            .channel('chat_room_public')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: TABLE
            }, (payload) => {
                // Kendi gönderdiğimiz mesajı tekrar gösterme
                const myId = getMyUserId();
                if (myId && payload.new.user_id === myId) return;
                renderMessage(payload.new);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setOnlineText('Çevrimiçi · Canlı');
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    setOnlineText('Yeniden bağlanıyor...');
                }
            });
    }

    function setOnlineText(text) {
        const el = q('chatOnlineText');
        if (el) el.textContent = text;
    }

    // ── Mesaj Gönder ─────────────────────────────────────────
    async function sendMessage() {
        const input = q('chatInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text || text.length > MAX_LEN) return;

        // Rate limit
        const now = Date.now();
        if (now - lastSentAt < RATE_LIMIT_MS) {
            showSystemMsg(`⏱ Çok hızlı! ${Math.ceil((RATE_LIMIT_MS - (now - lastSentAt)) / 1000)}s bekle.`);
            return;
        }

        const user = window.currentUser;
        if (!user) return;

        lastSentAt = now;
        input.value = '';
        updateCharCount('');
        q('chatSendBtn').disabled = true;

        const userData = window.dataManager && window.dataManager.data;
        const displayName = (userData && userData.social && userData.social.name)
            ? userData.social.name
            : (user.email ? user.email.split('@')[0] : 'Kullanıcı');
        const avatar = (userData && userData.social && userData.social.avatar) || '👤';

        // Optimistic render (anında göster)
        const optimistic = {
            id: 'opt_' + now,
            user_id: user.uid || user.id,
            display_name: displayName,
            avatar: avatar,
            email: user.email,
            content: text,
            created_at: new Date().toISOString()
        };
        renderMessage(optimistic);
        scrollToBottom(true);

        if (!window.supabaseClient) {
            setTimeout(() => { q('chatSendBtn').disabled = false; }, 500);
            return;
        }

        const { error } = await window.supabaseClient
            .from(TABLE)
            .insert({
                user_id: user.uid || user.id,
                display_name: displayName,
                avatar: avatar,
                email: user.email,
                content: text
            });

        if (error) {
            console.warn('Chat send error:', error.message);
            showSystemMsg('⚠️ Mesaj gönderilemedi: ' + error.message);
        }

        setTimeout(() => { q('chatSendBtn').disabled = false; }, 800);
    }

    // ── Karakter sayacı ──────────────────────────────────────
    function updateCharCount(val) {
        const counter = q('chatCharCount');
        if (!counter) return;
        const len = val.length;
        if (len > MAX_LEN * 0.7) {
            counter.style.display = 'block';
            counter.textContent = `${len}/${MAX_LEN}`;
            counter.className = 'chat-char-count' + (len >= MAX_LEN ? ' over' : len > MAX_LEN * 0.9 ? ' warn' : '');
        } else {
            counter.style.display = 'none';
        }
    }

    // ── Auth durumuna göre input göster/gizle ────────────────
    function updateAuthUI() {
        const isLoggedIn = !!(window.currentUser && window.currentUser.uid || window.currentUser.id);
        const inputArea   = q('chatInputArea');
        const guestPrompt = q('chatGuestPrompt');
        if (!inputArea || !guestPrompt) return;
        if (isLoggedIn) {
            inputArea.classList.remove('hidden');
            guestPrompt.style.display = 'none';
        } else {
            inputArea.classList.add('hidden');
            guestPrompt.style.display = 'flex';
        }
    }

    // ── Event Listeners ───────────────────────────────────────
    function bindEvents() {
        q('chatToggleBtn').addEventListener('click', toggle);
        q('chatCloseBtn').addEventListener('click', toggle);

        const input = q('chatInput');
        const sendBtn = q('chatSendBtn');

        input.addEventListener('input', function () {
            const val = this.value;
            updateCharCount(val);
            // Auto-resize
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            // Send button aktif/pasif
            sendBtn.disabled = !val.trim() || val.length > MAX_LEN;
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sendBtn.disabled) sendMessage();
            }
        });

        sendBtn.addEventListener('click', sendMessage);

        // Auth değişikliklerini dinle (auth.js'den tetiklenir)
        document.addEventListener('onilist:authChange', updateAuthUI);
        // Fallback: 1 saniye sonra kontrol et
        setTimeout(updateAuthUI, 1200);
    }

    // ── Init ─────────────────────────────────────────────────
    function init() {
        if (initialized) return;
        initialized = true;

        // Stil dosyasının yüklendiğinden emin ol
        if (!document.querySelector('link[href*="chat.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/chat.css'; // projedeki css klasörüne koy
            document.head.appendChild(link);
        }

        buildHTML();
        bindEvents();
        loadMessages();

        console.log('✅ OniChat v1.0 loaded');
    }

    // Public API
    return { init, toggle, updateAuthUI };
})();

// ── Auto-init ────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', OniChat.init);
} else {
    OniChat.init();
}