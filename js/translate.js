// ============================================================
//  OniList Translate v3.0 — Floating Bubble
//  API: MyMemory (ücretsiz, CORS yok, key gerektirmez)
//  UI: Sağ altta yüzen balon, tıklayınca açılıp kapanır
// ============================================================

(function () {
    'use strict';

    const LANGUAGES = [
        { code: 'en',  label: 'English',    flag: '🇬🇧' },
        { code: 'tr',  label: 'Turkish',    flag: '🇹🇷' },
        { code: 'ja',  label: 'Japanese',   flag: '🇯🇵' },
        { code: 'ko',  label: 'Korean',     flag: '🇰🇷' },
        { code: 'zh',  label: 'Chinese',    flag: '🇨🇳' },
        { code: 'de',  label: 'German',     flag: '🇩🇪' },
        { code: 'fr',  label: 'French',     flag: '🇫🇷' },
        { code: 'es',  label: 'Spanish',    flag: '🇪🇸' },
        { code: 'it',  label: 'Italian',    flag: '🇮🇹' },
        { code: 'pt',  label: 'Portuguese', flag: '🇧🇷' },
        { code: 'ru',  label: 'Russian',    flag: '🇷🇺' },
        { code: 'ar',  label: 'Arabic',     flag: '🇸🇦' },
        { code: 'hi',  label: 'Hindi',      flag: '🇮🇳' },
        { code: 'id',  label: 'Indonesian', flag: '🇮🇩' },
        { code: 'nl',  label: 'Dutch',      flag: '🇳🇱' },
        { code: 'pl',  label: 'Polish',     flag: '🇵🇱' },
        { code: 'sv',  label: 'Swedish',    flag: '🇸🇪' },
        { code: 'vi',  label: 'Vietnamese', flag: '🇻🇳' },
        { code: 'th',  label: 'Thai',       flag: '🇹🇭' },
        { code: 'uk',  label: 'Ukrainian',  flag: '🇺🇦' },
        { code: 'el',  label: 'Greek',      flag: '🇬🇷' },
        { code: 'cs',  label: 'Czech',      flag: '🇨🇿' },
        { code: 'ro',  label: 'Romanian',   flag: '🇷🇴' },
    ];

    const FLAGS = Object.fromEntries(LANGUAGES.map(l => [l.code, l.flag]));
    const NAMES = Object.fromEntries(LANGUAGES.map(l => [l.code, l.label]));

    const QUICK = [
        { s: 'en', t: 'tr', label: 'EN→TR' },
        { s: 'tr', t: 'en', label: 'TR→EN' },
        { s: 'ja', t: 'en', label: 'JA→EN' },
        { s: 'ko', t: 'en', label: 'KO→EN' },
        { s: 'de', t: 'en', label: 'DE→EN' },
        { s: 'fr', t: 'en', label: 'FR→EN' },
    ];

    // ── State ────────────────────────────────────────────────
    let srcLang      = 'en';
    let tgtLang      = 'tr';
    let isOpen       = false;
    let isLoading    = false;
    let autoTimer    = null;
    const MAX        = 500;
    const SETTINGS   = 'ont3_settings';
    const HISTORY    = 'ont3_history';

    // ── Load saved settings ──────────────────────────────────
    try {
        const s = JSON.parse(localStorage.getItem(SETTINGS) || '{}');
        if (s.src) srcLang = s.src;
        if (s.tgt) tgtLang = s.tgt;
    } catch(e) {}

    // ── Build & inject HTML ──────────────────────────────────
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', inject);
        } else {
            inject();
        }
    }

    function inject() {
        // Remove old version if exists
        document.getElementById('ont3-root')?.remove();
        document.getElementById('ont3-btn')?.remove();

        const wrap = document.createElement('div');
        wrap.id = 'ont3-root';
        wrap.innerHTML = buildHTML();
        document.body.appendChild(wrap);

        bindEvents();
    }

    function optionsHTML(selected) {
        return LANGUAGES.map(l =>
            `<option value="${l.code}"${l.code === selected ? ' selected' : ''}>${l.flag} ${l.label}</option>`
        ).join('');
    }

    function buildHTML() {
        return `
<!-- Toggle Button -->
<button id="ont3-btn" title="Translate" aria-label="Open translator">
    <span id="ont3-btn-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.8"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" stroke-width="1.8"/>
        </svg>
    </span>
    <span id="ont3-unread" style="display:none"></span>
</button>

<!-- Translate Window -->
<div id="ont3-window" role="dialog" aria-label="Translator" aria-hidden="true">

    <!-- Header -->
    <div id="ont3-header">
        <div id="ont3-title">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" style="flex-shrink:0">
                <circle cx="12" cy="12" r="10" stroke="url(#g1)" stroke-width="1.8"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="url(#g1)" stroke-width="1.8"/>
                <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
                        <stop offset="0%" stop-color="#ff3366"/>
                        <stop offset="100%" stop-color="#00d4ff"/>
                    </linearGradient>
                </defs>
            </svg>
            <span>Translate</span>
            <span id="ont3-badge">Free · Instant</span>
        </div>
        <button id="ont3-close" aria-label="Close">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>

    <!-- Lang Bar -->
    <div id="ont3-lang-bar">
        <select id="ont3-src-sel" class="ont3-sel" aria-label="Source language">${optionsHTML(srcLang)}</select>
        <button id="ont3-swap" title="Swap languages" aria-label="Swap">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
            </svg>
        </button>
        <select id="ont3-tgt-sel" class="ont3-sel" aria-label="Target language">${optionsHTML(tgtLang)}</select>
    </div>

    <!-- Input -->
    <div id="ont3-input-wrap">
        <textarea
            id="ont3-input"
            placeholder="Type text to translate…"
            maxlength="${MAX}"
            spellcheck="false"
            aria-label="Source text"
        ></textarea>
        <div id="ont3-input-footer">
            <span id="ont3-char">0 / ${MAX}</span>
            <button id="ont3-clear" title="Clear" aria-label="Clear">
                <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear
            </button>
        </div>
    </div>

    <!-- Translate Button -->
    <div id="ont3-btn-row">
        <div id="ont3-quick-row">
            ${QUICK.map(q => `<button class="ont3-qpill${q.s===srcLang&&q.t===tgtLang?' ont3-qactive':''}" data-s="${q.s}" data-t="${q.t}">${q.label}</button>`).join('')}
        </div>
        <button id="ont3-go" disabled>
            <span id="ont3-go-label">Translate</span>
            <div id="ont3-go-dots" style="display:none"><span></span><span></span><span></span></div>
        </button>
    </div>

    <!-- Output -->
    <div id="ont3-output-wrap">
        <!-- Skeleton -->
        <div id="ont3-skeleton" style="display:none">
            <div class="ont3-sk ont3-sk-70"></div>
            <div class="ont3-sk ont3-sk-50"></div>
            <div class="ont3-sk ont3-sk-80"></div>
        </div>
        <div id="ont3-output" aria-live="polite">
            <span id="ont3-placeholder">Translation will appear here…</span>
        </div>
        <div id="ont3-output-footer" style="display:none">
            <span id="ont3-lang-label"></span>
            <div id="ont3-output-actions">
                <button id="ont3-copy" title="Copy translation">
                    <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                </button>
                <button id="ont3-tts" title="Read aloud">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    Listen
                </button>
            </div>
        </div>
        <div id="ont3-copy-toast">✅ Copied!</div>
    </div>

</div>`;
    }

    // ── Events ───────────────────────────────────────────────
    function bindEvents() {
        const btn    = document.getElementById('ont3-btn');
        const win    = document.getElementById('ont3-window');
        const close  = document.getElementById('ont3-close');
        const srcSel = document.getElementById('ont3-src-sel');
        const tgtSel = document.getElementById('ont3-tgt-sel');
        const swap   = document.getElementById('ont3-swap');
        const input  = document.getElementById('ont3-input');
        const clear  = document.getElementById('ont3-clear');
        const goBtn  = document.getElementById('ont3-go');
        const copy   = document.getElementById('ont3-copy');
        const tts    = document.getElementById('ont3-tts');

        // Toggle open/close
        btn.addEventListener('click', () => toggleWindow());
        close.addEventListener('click', () => closeWindow());

        // Close on outside click
        document.addEventListener('click', e => {
            if (isOpen && !win.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                closeWindow();
            }
        });

        // Escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && isOpen) closeWindow();
        });

        // Input
        input.addEventListener('input', () => {
            const len = input.value.length;
            document.getElementById('ont3-char').textContent = `${len} / ${MAX}`;
            document.getElementById('ont3-char').classList.toggle('ont3-warn', len > MAX * 0.85);
            goBtn.disabled = len === 0 || isLoading;

            clearTimeout(autoTimer);
            if (len > 0) autoTimer = setTimeout(doTranslate, 800);
            else resetOutput();
        });

        input.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(autoTimer);
                doTranslate();
            }
        });

        // Go button
        goBtn.addEventListener('click', () => { clearTimeout(autoTimer); doTranslate(); });

        // Swap
        swap.addEventListener('click', () => {
            const outText = document.getElementById('ont3-output').dataset.result || '';
            [srcLang, tgtLang] = [tgtLang, srcLang];
            srcSel.value = srcLang;
            tgtSel.value = tgtLang;
            saveSettings();
            updateQuickPills();
            swap.classList.add('ont3-spin');
            setTimeout(() => swap.classList.remove('ont3-spin'), 420);

            if (outText) {
                input.value = outText;
                document.getElementById('ont3-char').textContent = `${outText.length} / ${MAX}`;
                goBtn.disabled = false;
                resetOutput();
                clearTimeout(autoTimer);
                doTranslate();
            }
        });

        // Language selects
        srcSel.addEventListener('change', () => { srcLang = srcSel.value; saveSettings(); updateQuickPills(); if (input.value.trim()) doTranslate(); });
        tgtSel.addEventListener('change', () => { tgtLang = tgtSel.value; saveSettings(); updateQuickPills(); if (input.value.trim()) doTranslate(); });

        // Clear
        clear.addEventListener('click', () => {
            input.value = '';
            document.getElementById('ont3-char').textContent = `0 / ${MAX}`;
            document.getElementById('ont3-char').classList.remove('ont3-warn');
            goBtn.disabled = true;
            resetOutput();
            clearTimeout(autoTimer);
            input.focus();
        });

        // Copy
        copy.addEventListener('click', () => {
            const text = document.getElementById('ont3-output').dataset.result || '';
            if (!text) return;
            const toast = document.getElementById('ont3-copy-toast');
            const done = () => { toast.classList.add('ont3-toast-show'); setTimeout(() => toast.classList.remove('ont3-toast-show'), 2000); };
            if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
            else fallbackCopy(text, done);
        });

        // TTS
        tts.addEventListener('click', () => {
            const text = document.getElementById('ont3-output').dataset.result || '';
            if (!text || !window.speechSynthesis) return;
            const active = tts.classList.contains('ont3-tts-on');
            window.speechSynthesis.cancel();
            if (active) { tts.classList.remove('ont3-tts-on'); return; }
            const u = new SpeechSynthesisUtterance(text);
            u.lang = tgtLang === 'zh' ? 'zh-CN' : `${tgtLang}-${tgtLang.toUpperCase()}`;
            u.onstart = () => tts.classList.add('ont3-tts-on');
            u.onend = u.onerror = () => tts.classList.remove('ont3-tts-on');
            window.speechSynthesis.speak(u);
        });

        // Quick pills
        document.getElementById('ont3-quick-row').addEventListener('click', e => {
            const pill = e.target.closest('.ont3-qpill');
            if (!pill) return;
            srcLang = pill.dataset.s;
            tgtLang = pill.dataset.t;
            srcSel.value = srcLang;
            tgtSel.value = tgtLang;
            saveSettings();
            updateQuickPills();
            if (input.value.trim()) doTranslate();
        });
    }

    // ── Window open/close ─────────────────────────────────────
    function toggleWindow() {
        isOpen ? closeWindow() : openWindow();
    }

    function openWindow() {
        isOpen = true;
        const win = document.getElementById('ont3-window');
        const btn = document.getElementById('ont3-btn');
        win.classList.add('ont3-open');
        win.setAttribute('aria-hidden', 'false');
        btn.classList.add('ont3-btn-active');
        setTimeout(() => document.getElementById('ont3-input')?.focus(), 150);
    }

    function closeWindow() {
        isOpen = false;
        const win = document.getElementById('ont3-window');
        const btn = document.getElementById('ont3-btn');
        win.classList.remove('ont3-open');
        win.setAttribute('aria-hidden', 'true');
        btn.classList.remove('ont3-btn-active');
        window.speechSynthesis?.cancel();
    }

    // ── Translation (MyMemory API) ────────────────────────────
    async function doTranslate() {
        const text = document.getElementById('ont3-input').value.trim();
        if (!text || isLoading) return;
        if (srcLang === tgtLang) { showResult(text); return; }

        isLoading = true;
        setLoading(true);

        try {
            // MyMemory free API — no key, no CORS issues
            const langPair = `${srcLang}|${tgtLang}`;
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // MyMemory returns responseStatus 200 on success
            if (data.responseStatus !== 200) {
                throw new Error(data.responseDetails || 'Translation failed');
            }

            const translated = data.responseData?.translatedText?.trim();
            if (!translated) throw new Error('Empty response');

            // MyMemory sometimes returns ALL CAPS for short texts — normalize
            const result = translated === translated.toUpperCase() && translated.length < 50
                ? translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase()
                : translated;

            showResult(result);
            saveHistory(text, result);

        } catch (err) {
            console.error('[OniList Translate]', err);
            showError('Translation failed. Please try again.');
        } finally {
            isLoading = false;
            setLoading(false);
        }
    }

    // ── UI helpers ────────────────────────────────────────────
    function setLoading(on) {
        document.getElementById('ont3-go-label').style.display = on ? 'none' : 'inline';
        document.getElementById('ont3-go-dots').style.display  = on ? 'flex'  : 'none';
        document.getElementById('ont3-go').disabled            = on;
        document.getElementById('ont3-skeleton').style.display = on ? 'flex'  : 'none';
        document.getElementById('ont3-output').style.display   = on ? 'none'  : '';
    }

    function showResult(text) {
        const out = document.getElementById('ont3-output');
        const footer = document.getElementById('ont3-output-footer');
        const label  = document.getElementById('ont3-lang-label');

        out.dataset.result = text;
        out.innerHTML = `<span class="ont3-result-text">${escHtml(text)}</span>`;
        out.classList.add('ont3-result-in');
        setTimeout(() => out.classList.remove('ont3-result-in'), 400);

        label.textContent = `${FLAGS[tgtLang] || ''} ${NAMES[tgtLang] || tgtLang}`;
        footer.style.display = 'flex';

        // hide placeholder
        document.getElementById('ont3-placeholder')?.remove();
    }

    function showError(msg) {
        const out = document.getElementById('ont3-output');
        out.innerHTML = `<span class="ont3-error">${escHtml(msg)}</span>`;
        out.style.display = '';
        document.getElementById('ont3-skeleton').style.display = 'none';
        document.getElementById('ont3-output-footer').style.display = 'none';
    }

    function resetOutput() {
        const out = document.getElementById('ont3-output');
        out.innerHTML = '<span id="ont3-placeholder">Translation will appear here…</span>';
        out.removeAttribute('data-result');
        document.getElementById('ont3-output-footer').style.display = 'none';
    }

    function updateQuickPills() {
        document.querySelectorAll('.ont3-qpill').forEach(p => {
            p.classList.toggle('ont3-qactive', p.dataset.s === srcLang && p.dataset.t === tgtLang);
        });
    }

    function saveSettings() {
        try { localStorage.setItem(SETTINGS, JSON.stringify({ src: srcLang, tgt: tgtLang })); } catch(e) {}
    }

    function saveHistory(src, tgt) {
        try {
            const list = JSON.parse(localStorage.getItem(HISTORY) || '[]');
            list.unshift({ src: src.slice(0, 80), tgt: tgt.slice(0, 80), sl: srcLang, tl: tgtLang, ts: Date.now() });
            localStorage.setItem(HISTORY, JSON.stringify(list.slice(0, 30)));
        } catch(e) {}
    }

    function fallbackCopy(text, cb) {
        const ta = Object.assign(document.createElement('textarea'), { value: text });
        Object.assign(ta.style, { position: 'fixed', opacity: '0' });
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); cb(); } catch(e) {}
        document.body.removeChild(ta);
    }

    function escHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    init();
})();