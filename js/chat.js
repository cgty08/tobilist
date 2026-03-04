// ============================================
//   CHAT.JS v2.0 - OniList Topluluk Sohbeti
//   Supabase Realtime + localStorage fallback
//   v2.0: ChatCore ortak modül ile refactor edildi
// ============================================

// ════════════════════════════════════════════
//  CHATCORE — OniChat + InlineChat paylaşımlı temel
// ════════════════════════════════════════════
const ChatCore = (function () {

    const TABLE         = 'chat_messages';
    const MAX_LEN       = 300;
    const RATE_LIMIT_MS = 2500;

    // ── Avatar cache ─────────────────────────────────────────
    const _avatarCache = {};

    async function loadAvatarCache() {
        if (!window.supabaseClient) return;
        try {
            const { data } = await window.supabaseClient
                .from('public_leaderboard')
                .select('user_id,name,avatar,avatar_url')
                .limit(50);
            if (data) data.forEach(u => {
                if (u.user_id) _avatarCache[u.user_id] = {
                    avatar: u.avatar || '👤',
                    avatarUrl: u.avatar_url || '',
                    name: u.name || ''
                };
            });
            // Global cache'i de güncelle (InlineChat de kullanır)
            window._avatarCache = _avatarCache;
        } catch(e) {}
    }

    function getAvatarHtml(row) {
        let url   = row.avatar_url || '';
        let emoji = row.avatar || '👤';

        const cache = _avatarCache[row.user_id] || (window._avatarCache && window._avatarCache[row.user_id]);
        if (!url && cache) { url = cache.avatarUrl || ''; emoji = cache.avatar || emoji; }

        if (!url && row.user_id) {
            const myId = getMyUserId();
            if (myId && row.user_id === myId) {
                const soc = window.dataManager?.data?.social || {};
                url   = soc.avatarUrl || '';
                emoji = soc.avatar || emoji;
            }
        }
        if (url) {
            return `<img src="${url}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;display:block;"
                onerror="this.style.display='none';this.nextSibling.style.display='flex'">` +
                `<span style="display:none;font-size:1rem;line-height:1;">${escapeHTML(emoji)}</span>`;
        }
        return `<span style="font-size:1rem;line-height:1;">${escapeHTML(emoji)}</span>`;
    }

    // ── Yardımcılar ──────────────────────────────────────────
    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getMyUserId() {
        const u = window.currentUser;
        if (!u) return null;
        return u.uid || u.id || null;
    }

    function getDisplayName(row) {
        if (row.display_name && row.display_name.trim()) return row.display_name.trim();
        if (row.email) return row.email.split('@')[0];
        return 'User';
    }

    function formatTime(isoStr) {
        if (!isoStr) return '';
        return new Date(isoStr).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }

    // ── Mesaj render (container ID dışarıdan verilir) ────────
    function renderMessage(row, containerId, onIncrementUnread) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (row.type === 'system') {
            const div = document.createElement('div');
            div.className = 'chat-system';
            div.textContent = escapeHTML(row.content);
            container.appendChild(div);
            scrollToBottom(containerId);
            return;
        }

        const myId      = getMyUserId();
        const isOwn     = !!(myId && row.user_id === myId);
        const avatarHtml = getAvatarHtml(row);
        const name      = escapeHTML(getDisplayName(row));
        const text      = escapeHTML(row.content || '');
        const time      = formatTime(row.created_at);
        const canClick  = !isOwn && row.user_id;
        const safeName  = getDisplayName(row).replace(/'/g, "\\'");
        const clickAttr = canClick
            ? `onclick="openPublicProfile('${row.user_id}','${safeName}')" style="cursor:pointer;" title="${name} profile"`
            : '';

        const div = document.createElement('div');
        div.className = 'chat-msg' + (isOwn ? ' own' : '');
        div.dataset.msgId = row.id || '';
        div.innerHTML =
            `<div class="chat-avatar" ${clickAttr}>${avatarHtml}</div>` +
            `<div class="chat-bubble-wrap">` +
            (!isOwn ? `<div class="chat-sender" ${canClick ? `onclick="openPublicProfile('${row.user_id}','${safeName}')" style="cursor:pointer;"` : ''}>${name}</div>` : '') +
            `<div class="chat-bubble">${text}</div>` +
            `<div class="chat-time">${time}</div>` +
            `</div>`;
        container.appendChild(div);

        if (!isOwn && typeof onIncrementUnread === 'function') onIncrementUnread();
        scrollToBottom(containerId);
    }

    function scrollToBottom(containerId, force) {
        const el = document.getElementById(containerId);
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        if (force || atBottom) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
    }

    // ── Mesaj yükleme ────────────────────────────────────────
    async function loadMessages(containerId, onDone) {
        if (!window.supabaseClient) {
            _systemMsg(containerId, '💡 Chat is temporarily unavailable.');
            return;
        }
        _loadingHTML(containerId);
        await loadAvatarCache();

        const { data, error } = await window.supabaseClient
            .from(TABLE).select('*')
            .order('created_at', { ascending: false }).limit(50);

        document.getElementById(containerId).innerHTML = '';

        if (error) {
            _systemMsg(containerId, '⚠️ Could not load messages.');
            console.warn('Chat load error:', error.message);
            return;
        }
        if (!data || data.length === 0) {
            _systemMsg(containerId, '👋 No messages yet. Be the first to send one!');
        } else {
            [...data].reverse().forEach(row => renderMessage(row, containerId, null));
        }
        scrollToBottom(containerId, true);
        if (typeof onDone === 'function') onDone();
    }

    // ── Realtime aboneliği ───────────────────────────────────
    function subscribeRealtime(channelName, containerId, onNewMsg, onStatusChange) {
        if (!window.supabaseClient) return null;

        const ch = window.supabaseClient
            .channel(channelName)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLE }, (payload) => {
                const myId = getMyUserId();
                if (myId && payload.new.user_id === myId) return; // kendi mesajını tekrar gösterme
                renderMessage(payload.new, containerId, onNewMsg);
            })
            .subscribe((status) => {
                if (typeof onStatusChange === 'function') onStatusChange(status);
            });
        return ch;
    }

    // ── Mesaj gönderme ───────────────────────────────────────
    async function sendMessage({ inputId, sendBtnId, containerId, onIncrementUnread }) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const text = input.value.trim();
        if (!text || text.length > MAX_LEN) return;

        // Rate limit
        const now = Date.now();
        if ((now - (_sendTimestamps[inputId] || 0)) < RATE_LIMIT_MS) {
            _systemMsg(containerId, `⏱ Too fast! Wait ${Math.ceil((RATE_LIMIT_MS - (now - (_sendTimestamps[inputId]||0))) / 1000)}s.`);
            return;
        }

        const user = window.currentUser;
        if (!user) return;

        _sendTimestamps[inputId] = now;
        input.value = '';
        input.style.height = 'auto';
        const sendBtn = document.getElementById(sendBtnId);
        if (sendBtn) sendBtn.disabled = true;

        const social      = window.dataManager?.data?.social || {};
        const displayName = social.name || user.displayName || user.email?.split('@')[0] || 'User';
        const avatar      = social.avatar || '👤';
        const avatarUrl   = social.avatarUrl || '';
        const uid         = user.uid || user.id;

        // Optimistic render
        renderMessage({
            id: 'opt_' + now, user_id: uid,
            display_name: displayName, avatar, avatar_url: avatarUrl,
            content: text, created_at: new Date().toISOString()
        }, containerId, onIncrementUnread);
        scrollToBottom(containerId, true);

        if (window.supabaseClient) {
            const base = { user_id: uid, display_name: displayName, avatar, content: text };
            try {
                const { error } = await window.supabaseClient.from(TABLE)
                    .insert({ ...base, email: user.email, avatar_url: avatarUrl });
                if (error) {
                    if (error.code === '42703' || error.message?.includes('column')) {
                        const { error: e2 } = await window.supabaseClient.from(TABLE).insert(base);
                        if (e2) _systemMsg(containerId, '⚠️ Could not send: ' + e2.message);
                    } else {
                        _systemMsg(containerId, '⚠️ Could not send: ' + error.message);
                    }
                }
            } catch(e) { console.warn('Chat send error:', e.message); }
        }

        setTimeout(() => { if (sendBtn) sendBtn.disabled = false; }, 800);
    }

    // ── Özel zamanlayıcı tablosu (rate limit için) ──────────
    const _sendTimestamps = {};

    // ── İç yardımcılar ──────────────────────────────────────
    function _systemMsg(containerId, text) {
        renderMessage({ type: 'system', content: text }, containerId, null);
    }

    function _loadingHTML(containerId) {
        const el = document.getElementById(containerId);
        if (el) el.innerHTML =
            '<div class="chat-loading"><span class="chat-loading-dots"><span></span><span></span><span></span></span></div>';
    }

    return {
        TABLE, MAX_LEN, RATE_LIMIT_MS,
        loadAvatarCache, getAvatarHtml, escapeHTML,
        getMyUserId, getDisplayName, formatTime,
        renderMessage, scrollToBottom,
        loadMessages, subscribeRealtime, sendMessage,
        cache: _avatarCache
    };
})();


// ════════════════════════════════════════════
//  ONICHAT — Floating popup sohbet
// ════════════════════════════════════════════
const OniChat = (function () {

    const MSG_LOAD_LIMIT = 50;

    let isOpen      = false;
    let realtimeCh  = null;
    let unreadCount = 0;
    let initialized = false;

    function q(id) { return document.getElementById(id); }

    // ── HTML Şablonu ─────────────────────────────────────────
    function buildHTML() {
        const el = document.createElement('div');
        el.innerHTML = `
        <button id="chatToggleBtn" title="Community Chat" aria-label="Open Chat" style="display:none!important">
            💬
            <span id="chatBadge"></span>
        </button>
        <div id="chatWindow" role="dialog" aria-label="Topluluk Sohbeti">
            <div class="chat-header">
                <span class="chat-header-icon"></span>
                <div class="chat-header-info">
                    <div class="chat-header-title">Topluluk Sohbeti</div>
                    <div class="chat-header-sub">
                        <span class="chat-online-dot"></span>
                        <span id="chatOnlineText">Connecting...</span>
                    </div>
                </div>
                <button class="chat-close-btn" id="chatCloseBtn" title="Kapat">✕</button>
            </div>
            <div id="chatMessages">
                <div class="chat-loading">
                    <span class="chat-loading-dots"><span></span><span></span><span></span></span>
                </div>
            </div>
            <div id="chatGuestPrompt" class="chat-guest-prompt" style="display:none;">
                <div class="chat-guest-icon">🔐</div>
                <h4>Join the Chat</h4>
                <p>You need to sign in to send messages.</p>
                <button onclick="openAuthModal('login')">Sign In →</button>
            </div>
            <div class="chat-input-area" id="chatInputArea">
                <textarea id="chatInput" placeholder="Write something... (Enter = send)"
                    rows="1" maxlength="${ChatCore.MAX_LEN}"></textarea>
                <span id="chatCharCount" class="chat-char-count" style="display:none;"></span>
                <button id="chatSendBtn" disabled title="Send">➤</button>
            </div>
        </div>`;
        while (el.firstChild) document.body.appendChild(el.firstChild);
    }

    // ── Toggle ───────────────────────────────────────────────
    function toggle() {
        isOpen = !isOpen;
        const win = q('chatWindow');
        if (isOpen) {
            win.style.display = 'flex';
            requestAnimationFrame(() => win.classList.add('open'));
            resetUnread();
            ChatCore.scrollToBottom('chatMessages', true);
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

    // ── Karakter sayacı ──────────────────────────────────────
    function updateCharCount(val) {
        const counter = q('chatCharCount');
        if (!counter) return;
        const len = val.length;
        if (len > ChatCore.MAX_LEN * 0.7) {
            counter.style.display = 'block';
            counter.textContent = `${len}/${ChatCore.MAX_LEN}`;
            counter.className = 'chat-char-count' +
                (len >= ChatCore.MAX_LEN ? ' over' : len > ChatCore.MAX_LEN * 0.9 ? ' warn' : '');
        } else {
            counter.style.display = 'none';
        }
    }

    // ── Auth UI ──────────────────────────────────────────────
    function updateAuthUI() {
        const isLoggedIn = !!(window.currentUser && (window.currentUser.uid || window.currentUser.id));
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

    // ── Events ───────────────────────────────────────────────
    function bindEvents() {
        q('chatToggleBtn').addEventListener('click', toggle);
        q('chatCloseBtn').addEventListener('click', toggle);

        const input   = q('chatInput');
        const sendBtn = q('chatSendBtn');

        input.addEventListener('input', function () {
            updateCharCount(this.value);
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            sendBtn.disabled = !this.value.trim() || this.value.length > ChatCore.MAX_LEN;
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sendBtn.disabled) _send();
            }
        });
        sendBtn.addEventListener('click', _send);

        document.addEventListener('onilist:authChange', updateAuthUI);
        setTimeout(updateAuthUI, 1200);
    }

    function _send() {
        ChatCore.sendMessage({
            inputId: 'chatInput',
            sendBtnId: 'chatSendBtn',
            containerId: 'chatMessages',
            onIncrementUnread: incrementUnread
        });
    }

    // ── Init ─────────────────────────────────────────────────
    function init() {
        if (initialized) return;
        initialized = true;

        if (!document.querySelector('link[href*="chat.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet'; link.href = 'css/chat.css';
            document.head.appendChild(link);
        }

        buildHTML();
        bindEvents();

        ChatCore.loadMessages('chatMessages', () => {
            const el = document.getElementById('chatOnlineText');
            if (el) el.textContent = 'Online · Live';
            realtimeCh = ChatCore.subscribeRealtime(
                'chat_room_public',
                'chatMessages',
                incrementUnread,
                (status) => {
                    const el = document.getElementById('chatOnlineText');
                    if (!el) return;
                    if (status === 'SUBSCRIBED') el.textContent = 'Online · Live';
                    else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') el.textContent = 'Reconnecting...';
                }
            );
        });

        console.log('✅ OniChat v2.0 loaded');
    }

    return { init, toggle, updateAuthUI, _cache: ChatCore.cache };
})();

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', OniChat.init);
} else {
    OniChat.init();
}


// ════════════════════════════════════════════
//  INLINECHAT — Ana sayfa yerleşik sohbet
// ════════════════════════════════════════════
const InlineChat = (function () {

    let realtimeCh  = null;
    let initialized = false;

    function q(id) { return document.getElementById(id); }

    // ── Auth UI ──────────────────────────────────────────────
    function updateAuthUI() {
        const u = window.currentUser;
        const isLoggedIn = !!(u && (u.uid || u.id));
        const inputArea = q('inlineChatInputArea');
        const guest     = q('inlineChatGuest');
        if (!inputArea || !guest) return;

        if (isLoggedIn) {
            inputArea.style.display = 'flex';
            inputArea.style.flexDirection = 'column';
            guest.style.display = 'none';
            const avatarEl = q('inlineChatMyAvatar');
            if (avatarEl) {
                avatarEl.textContent = window.dataManager?.data?.social?.avatar || '👤';
            }
        } else {
            inputArea.style.display = 'none';
            guest.style.display = 'flex';
        }
    }

    // window.currentUser atandığı an yakalamak için setter trap
    function patchCurrentUserSetter() {
        if (window.__currentUserPatched) return;
        window.__currentUserPatched = true;
        let _val = window.currentUser;
        try {
            Object.defineProperty(window, 'currentUser', {
                configurable: true, enumerable: true,
                get() { return _val; },
                set(v) {
                    _val = v;
                    setTimeout(updateAuthUI, 0);
                    if (v && (v.uid || v.id)) setTimeout(updateAuthUI, 200);
                }
            });
        } catch(e) {
            setInterval(updateAuthUI, 1000);
        }
    }

    // ── Events ───────────────────────────────────────────────
    function bindEvents() {
        const input   = q('inlineChatInput');
        const sendBtn = q('inlineChatSendBtn');
        if (!input || !sendBtn) return;

        input.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
            sendBtn.disabled = !this.value.trim() || this.value.length > ChatCore.MAX_LEN;
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sendBtn.disabled) _send();
            }
        });
        sendBtn.addEventListener('click', _send);
        document.addEventListener('onilist:authChange', updateAuthUI);
    }

    function _send() {
        ChatCore.sendMessage({
            inputId: 'inlineChatInput',
            sendBtnId: 'inlineChatSendBtn',
            containerId: 'inlineChatMessages',
            onIncrementUnread: null
        });
    }

    // ── Init ─────────────────────────────────────────────────
    function init() {
        if (initialized) return;
        if (!q('inlineChatMessages')) return;
        initialized = true;
        patchCurrentUserSetter();
        bindEvents();

        ChatCore.loadMessages('inlineChatMessages', () => {
            realtimeCh = ChatCore.subscribeRealtime(
                'inline_chat_public',
                'inlineChatMessages',
                null,
                null
            );
        });

        updateAuthUI();
        [300, 700, 1500, 3000, 5000].forEach(t => setTimeout(updateAuthUI, t));
        console.log('✅ InlineChat v2.0 loaded');
    }

    return { init, updateAuthUI };
})();

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', InlineChat.init);
} else {
    setTimeout(InlineChat.init, 500);
}