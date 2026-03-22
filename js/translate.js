// ============================================================
//  OniList Translate v4.0 — Floating Bubble
//  API: Google Translate (unofficial, free, no key, no CORS)
//  Fallback: MyMemory API
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
        { code: 'hu',  label: 'Hungarian',  flag: '🇭🇺' },
        { code: 'fi',  label: 'Finnish',    flag: '🇫🇮' },
        { code: 'no',  label: 'Norwegian',  flag: '🇳🇴' },
        { code: 'da',  label: 'Danish',     flag: '🇩🇰' },
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
        { s: 'es', t: 'en', label: 'ES→EN' },
        { s: 'ru', t: 'en', label: 'RU→EN' },
    ];

    const SETTINGS_KEY = 'ont4_settings';
    const MAX_CHARS    = 1000;
    const AUTO_MS      = 700;

    let srcLang   = 'tr';
    let tgtLang   = 'en';
    let isOpen    = false;
    let isBusy    = false;
    let autoTimer = null;

    try {
        const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        if (s.src) srcLang = s.src;
        if (s.tgt) tgtLang = s.tgt;
    } catch(e) {}

    // ── Google Translate unofficial endpoint ─────────────────
    async function googleTranslate(text, from, to) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('Bad response');
        const result = data[0].filter(s => Array.isArray(s) && s[0]).map(s => s[0]).join('');
        if (!result) throw new Error('Empty');
        return result;
    }

    // ── MyMemory fallback ────────────────────────────────────
    async function myMemoryTranslate(text, from, to) {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.responseStatus !== 200) throw new Error(data.responseDetails || 'Failed');
        const t = data.responseData?.translatedText;
        if (!t) throw new Error('Empty');
        return t;
    }

    // ── Init ─────────────────────────────────────────────────
    function init() {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
        else inject();
    }

    function inject() {
        document.getElementById('ont4-root')?.remove();
        const wrap = document.createElement('div');
        wrap.id = 'ont4-root';
        wrap.innerHTML = buildHTML();
        document.body.appendChild(wrap);
        bindEvents();
    }

    function selOpts(sel) {
        return LANGUAGES.map(l => `<option value="${l.code}"${l.code === sel ? ' selected' : ''}>${l.flag} ${l.label}</option>`).join('');
    }

    function buildHTML() {
        const pills = QUICK.map(q =>
            `<button class="ont4-pill${q.s===srcLang&&q.t===tgtLang?' ont4-pill-on':''}" data-s="${q.s}" data-t="${q.t}">${q.label}</button>`
        ).join('');

        return `
<button id="ont4-fab" title="Translate" aria-label="Open translator">
    <svg id="ont4-icon-globe" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.8"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" stroke-width="1.8"/>
    </svg>
    <svg id="ont4-icon-x" width="18" height="18" fill="none" viewBox="0 0 24 24" style="display:none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
</button>

<div id="ont4-win" role="dialog" aria-label="Translator" aria-hidden="true">

    <div class="ont4-hdr">
        <div class="ont4-hdr-left">
            <span class="ont4-hdr-icon">🌐</span>
            <span class="ont4-hdr-title">Translate</span>
            <span class="ont4-hdr-badge">Google</span>
        </div>
        <button id="ont4-close" class="ont4-x-btn" aria-label="Close">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>

    <div class="ont4-lang-row">
        <select class="ont4-sel" id="ont4-src-sel">${selOpts(srcLang)}</select>
        <button class="ont4-swap" id="ont4-swap" title="Swap languages">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
            </svg>
        </button>
        <select class="ont4-sel" id="ont4-tgt-sel">${selOpts(tgtLang)}</select>
    </div>

    <div class="ont4-src-box">
        <textarea id="ont4-input" class="ont4-ta" placeholder="Type or paste text here…" maxlength="${MAX_CHARS}" spellcheck="false"></textarea>
        <div class="ont4-src-foot">
            <span id="ont4-cnt" class="ont4-cnt">0 / ${MAX_CHARS}</span>
            <div class="ont4-src-btns">
                <button id="ont4-clear" class="ont4-ghost-btn">✕ Clear</button>
                <button id="ont4-go" class="ont4-go-btn" disabled>
                    <span id="ont4-go-lbl">Translate</span>
                    <div id="ont4-go-dots" style="display:none" class="ont4-dots"><span></span><span></span><span></span></div>
                </button>
            </div>
        </div>
    </div>

    <div class="ont4-pills-row" id="ont4-pills">${pills}</div>

    <div class="ont4-out-box">
        <div id="ont4-skel" class="ont4-skel" style="display:none">
            <div class="ont4-sk" style="width:72%"></div>
            <div class="ont4-sk" style="width:52%"></div>
            <div class="ont4-sk" style="width:80%"></div>
            <div class="ont4-sk" style="width:40%"></div>
        </div>
        <div id="ont4-out" class="ont4-out"><span class="ont4-hint">Translation will appear here…</span></div>
        <div id="ont4-out-foot" class="ont4-out-foot" style="display:none">
            <span id="ont4-out-lang" class="ont4-out-lang"></span>
            <div class="ont4-out-acts">
                <button id="ont4-tts" class="ont4-act-btn">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                    Listen
                </button>
                <button id="ont4-copy" class="ont4-act-btn">
                    <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy
                </button>
            </div>
        </div>
        <div id="ont4-toast" class="ont4-toast">✅ Copied!</div>
    </div>

</div>`;
    }

    function bindEvents() {
        const fab    = document.getElementById('ont4-fab');
        const closeB = document.getElementById('ont4-close');
        const srcSel = document.getElementById('ont4-src-sel');
        const tgtSel = document.getElementById('ont4-tgt-sel');
        const swap   = document.getElementById('ont4-swap');
        const input  = document.getElementById('ont4-input');
        const clear  = document.getElementById('ont4-clear');
        const goBtn  = document.getElementById('ont4-go');
        const copyB  = document.getElementById('ont4-copy');
        const ttsB   = document.getElementById('ont4-tts');
        const pills  = document.getElementById('ont4-pills');

        fab.addEventListener('click', toggle);
        closeB.addEventListener('click', close);
        document.addEventListener('click', e => { if (isOpen && !document.getElementById('ont4-win').contains(e.target) && !fab.contains(e.target)) close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });

        input.addEventListener('input', () => {
            const len = input.value.length;
            const cnt = document.getElementById('ont4-cnt');
            cnt.textContent = `${len} / ${MAX_CHARS}`;
            cnt.classList.toggle('ont4-cnt-warn', len > MAX_CHARS * 0.85);
            goBtn.disabled = len === 0 || isBusy;
            clearTimeout(autoTimer);
            if (len > 2) autoTimer = setTimeout(doTranslate, AUTO_MS);
            else if (len === 0) resetOut();
        });

        input.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); clearTimeout(autoTimer); doTranslate(); }
        });

        goBtn.addEventListener('click', () => { clearTimeout(autoTimer); doTranslate(); });

        swap.addEventListener('click', () => {
            const prev = document.getElementById('ont4-out').dataset.val || '';
            [srcLang, tgtLang] = [tgtLang, srcLang];
            srcSel.value = srcLang; tgtSel.value = tgtLang;
            saveSettings(); updatePills();
            swap.classList.add('ont4-spin');
            setTimeout(() => swap.classList.remove('ont4-spin'), 420);
            if (prev) { input.value = prev; document.getElementById('ont4-cnt').textContent = `${prev.length} / ${MAX_CHARS}`; goBtn.disabled = false; resetOut(); clearTimeout(autoTimer); doTranslate(); }
        });

        srcSel.addEventListener('change', () => { srcLang = srcSel.value; saveSettings(); updatePills(); if (input.value.trim()) doTranslate(); });
        tgtSel.addEventListener('change', () => { tgtLang = tgtSel.value; saveSettings(); updatePills(); if (input.value.trim()) doTranslate(); });

        clear.addEventListener('click', () => {
            input.value = ''; document.getElementById('ont4-cnt').textContent = `0 / ${MAX_CHARS}`; document.getElementById('ont4-cnt').classList.remove('ont4-cnt-warn');
            goBtn.disabled = true; resetOut(); clearTimeout(autoTimer); input.focus();
        });

        copyB.addEventListener('click', () => {
            const text = document.getElementById('ont4-out').dataset.val || '';
            if (!text) return;
            const toast = () => { const t = document.getElementById('ont4-toast'); t.classList.add('ont4-toast-show'); setTimeout(() => t.classList.remove('ont4-toast-show'), 2000); };
            if (navigator.clipboard) navigator.clipboard.writeText(text).then(toast).catch(() => fbCopy(text, toast));
            else fbCopy(text, toast);
        });

        ttsB.addEventListener('click', () => {
            const text = document.getElementById('ont4-out').dataset.val || '';
            if (!text || !window.speechSynthesis) return;
            if (ttsB.classList.contains('ont4-tts-on')) { window.speechSynthesis.cancel(); ttsB.classList.remove('ont4-tts-on'); return; }
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = tgtLang === 'zh' ? 'zh-CN' : `${tgtLang}-${tgtLang.toUpperCase()}`;
            u.onstart = () => ttsB.classList.add('ont4-tts-on');
            u.onend = u.onerror = () => ttsB.classList.remove('ont4-tts-on');
            window.speechSynthesis.speak(u);
        });

        pills.addEventListener('click', e => {
            const p = e.target.closest('.ont4-pill');
            if (!p) return;
            srcLang = p.dataset.s; tgtLang = p.dataset.t;
            srcSel.value = srcLang; tgtSel.value = tgtLang;
            saveSettings(); updatePills();
            if (input.value.trim()) doTranslate();
        });
    }

    function toggle() { isOpen ? close() : open(); }

    function open() {
        isOpen = true;
        document.getElementById('ont4-win').classList.add('ont4-open');
        document.getElementById('ont4-win').setAttribute('aria-hidden', 'false');
        document.getElementById('ont4-fab').classList.add('ont4-fab-on');
        document.getElementById('ont4-icon-globe').style.display = 'none';
        document.getElementById('ont4-icon-x').style.display = 'block';
        setTimeout(() => document.getElementById('ont4-input')?.focus(), 200);
    }

    function close() {
        isOpen = false;
        document.getElementById('ont4-win').classList.remove('ont4-open');
        document.getElementById('ont4-win').setAttribute('aria-hidden', 'true');
        document.getElementById('ont4-fab').classList.remove('ont4-fab-on');
        document.getElementById('ont4-icon-globe').style.display = 'block';
        document.getElementById('ont4-icon-x').style.display = 'none';
        window.speechSynthesis?.cancel();
    }

    async function doTranslate() {
        const text = document.getElementById('ont4-input').value.trim();
        if (!text || isBusy) return;
        if (srcLang === tgtLang) { showResult(text); return; }

        isBusy = true; setLoading(true);

        try {
            const result = await googleTranslate(text, srcLang, tgtLang);
            showResult(result);
        } catch(err) {
            console.warn('[Translate] Google failed, trying fallback:', err.message);
            try {
                const result = await myMemoryTranslate(text, srcLang, tgtLang);
                showResult(result);
            } catch(err2) {
                showError('Translation failed. Please check your connection.');
            }
        } finally {
            isBusy = false; setLoading(false);
        }
    }

    function setLoading(on) {
        document.getElementById('ont4-go-lbl').style.display  = on ? 'none'  : 'inline';
        document.getElementById('ont4-go-dots').style.display = on ? 'flex'  : 'none';
        document.getElementById('ont4-go').disabled           = on;
        document.getElementById('ont4-skel').style.display    = on ? 'flex'  : 'none';
        document.getElementById('ont4-out').style.display     = on ? 'none'  : '';
        if (!on) document.getElementById('ont4-go').disabled  = document.getElementById('ont4-input').value.length === 0;
    }

    function showResult(text) {
        const out   = document.getElementById('ont4-out');
        const foot  = document.getElementById('ont4-out-foot');
        const lang  = document.getElementById('ont4-out-lang');
        out.dataset.val = text;
        out.innerHTML   = `<p class="ont4-text">${escHtml(text)}</p>`;
        out.style.display = '';
        out.classList.add('ont4-anim'); setTimeout(() => out.classList.remove('ont4-anim'), 400);
        lang.textContent = `${FLAGS[tgtLang]||''} ${NAMES[tgtLang]||tgtLang}`;
        foot.style.display = 'flex';
    }

    function showError(msg) {
        const out = document.getElementById('ont4-out');
        out.innerHTML = `<p class="ont4-err">⚠️ ${escHtml(msg)}</p>`;
        out.dataset.val = ''; out.style.display = '';
        document.getElementById('ont4-skel').style.display = 'none';
        document.getElementById('ont4-out-foot').style.display = 'none';
    }

    function resetOut() {
        const out = document.getElementById('ont4-out');
        out.innerHTML = '<span class="ont4-hint">Translation will appear here…</span>';
        out.removeAttribute('data-val');
        document.getElementById('ont4-out-foot').style.display = 'none';
    }

    function updatePills() {
        document.querySelectorAll('.ont4-pill').forEach(p =>
            p.classList.toggle('ont4-pill-on', p.dataset.s === srcLang && p.dataset.t === tgtLang)
        );
    }

    function saveSettings() {
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ src: srcLang, tgt: tgtLang })); } catch(e) {}
    }

    function fbCopy(text, cb) {
        const ta = Object.assign(document.createElement('textarea'), { value: text });
        Object.assign(ta.style, { position: 'fixed', opacity: '0' });
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); cb(); } catch(e) {}
        document.body.removeChild(ta);
    }

    function escHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
    }

    init();
})();