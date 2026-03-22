// ============================================================
//  OniList Translate v5.0 — Floating Bubble
//  Kendi /api/translate proxy'nizi kullanır (Google Translate)
//  CORS sorunu yok — kendi domain'inizden çağrılıyor
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

    const SETTINGS_KEY = 'ont5_settings';
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

    // ── Kendi proxy'nizi çağırır ──────────────────────────────
    async function doTranslateAPI(text, from, to) {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, from, to })
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        if (!data.result) throw new Error('Empty response');
        return data.result;
    }

    // ── Init ─────────────────────────────────────────────────
    function init() {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
        else inject();
    }

    function inject() {
        document.getElementById('ont5-root')?.remove();
        const wrap = document.createElement('div');
        wrap.id = 'ont5-root';
        wrap.innerHTML = buildHTML();
        document.body.appendChild(wrap);
        bindEvents();
    }

    function selOpts(sel) {
        return LANGUAGES.map(l =>
            `<option value="${l.code}"${l.code === sel ? ' selected' : ''}>${l.flag} ${l.label}</option>`
        ).join('');
    }

    function buildHTML() {
        const pills = QUICK.map(q =>
            `<button class="ont5-pill${q.s===srcLang&&q.t===tgtLang?' ont5-pill-on':''}" data-s="${q.s}" data-t="${q.t}">${q.label}</button>`
        ).join('');

        return `
<button id="ont5-fab" title="Translate" aria-label="Open translator">
    <svg id="ont5-icon-open" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.8"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" stroke-width="1.8"/>
    </svg>
    <svg id="ont5-icon-close" width="18" height="18" fill="none" viewBox="0 0 24 24" style="display:none">
        <line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
</button>

<div id="ont5-win" aria-hidden="true">
    <div class="ont5-hdr">
        <div class="ont5-hdr-l">
            <span>🌐</span>
            <span class="ont5-hdr-title">Translate</span>
            <span class="ont5-badge">Google</span>
        </div>
        <button id="ont5-close" class="ont5-x-btn">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    </div>

    <div class="ont5-lang-row">
        <select class="ont5-sel" id="ont5-src-sel">${selOpts(srcLang)}</select>
        <button class="ont5-swap-btn" id="ont5-swap">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
            </svg>
        </button>
        <select class="ont5-sel" id="ont5-tgt-sel">${selOpts(tgtLang)}</select>
    </div>

    <div class="ont5-src-box">
        <textarea id="ont5-input" class="ont5-ta" placeholder="Type or paste text here…" maxlength="${MAX_CHARS}" spellcheck="false"></textarea>
        <div class="ont5-src-foot">
            <span id="ont5-cnt" class="ont5-cnt">0 / ${MAX_CHARS}</span>
            <div class="ont5-src-btns">
                <button id="ont5-clear" class="ont5-ghost-btn">✕ Clear</button>
                <button id="ont5-go" class="ont5-go-btn" disabled>
                    <span id="ont5-go-lbl">Translate</span>
                    <div id="ont5-go-dots" class="ont5-dots" style="display:none">
                        <span></span><span></span><span></span>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <div class="ont5-pills-row" id="ont5-pills">${pills}</div>

    <div class="ont5-out-box">
        <div id="ont5-skel" class="ont5-skel" style="display:none">
            <div class="ont5-sk" style="width:72%"></div>
            <div class="ont5-sk" style="width:50%"></div>
            <div class="ont5-sk" style="width:78%"></div>
        </div>
        <div id="ont5-out" class="ont5-out">
            <span class="ont5-hint">Translation will appear here…</span>
        </div>
        <div id="ont5-out-foot" class="ont5-out-foot" style="display:none">
            <span id="ont5-out-lang" class="ont5-out-lang"></span>
            <div class="ont5-out-acts">
                <button id="ont5-tts" class="ont5-act-btn">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    Listen
                </button>
                <button id="ont5-copy" class="ont5-act-btn">
                    <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                </button>
            </div>
        </div>
        <div id="ont5-toast" class="ont5-toast">✅ Copied!</div>
    </div>
</div>`;
    }

    function bindEvents() {
        const fab    = document.getElementById('ont5-fab');
        const closeB = document.getElementById('ont5-close');
        const srcSel = document.getElementById('ont5-src-sel');
        const tgtSel = document.getElementById('ont5-tgt-sel');
        const swap   = document.getElementById('ont5-swap');
        const input  = document.getElementById('ont5-input');
        const clear  = document.getElementById('ont5-clear');
        const goBtn  = document.getElementById('ont5-go');
        const copyB  = document.getElementById('ont5-copy');
        const ttsB   = document.getElementById('ont5-tts');

        fab.addEventListener('click', toggle);
        closeB.addEventListener('click', closeWin);
        document.addEventListener('click', e => {
            if (isOpen && !document.getElementById('ont5-win').contains(e.target) && !fab.contains(e.target)) closeWin();
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeWin(); });

        input.addEventListener('input', () => {
            const len = input.value.length;
            const cnt = document.getElementById('ont5-cnt');
            cnt.textContent = `${len} / ${MAX_CHARS}`;
            cnt.classList.toggle('ont5-cnt-warn', len > MAX_CHARS * 0.85);
            goBtn.disabled = len === 0 || isBusy;
            clearTimeout(autoTimer);
            if (len > 2) autoTimer = setTimeout(runTranslate, AUTO_MS);
            else if (len === 0) resetOut();
        });

        input.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(autoTimer);
                runTranslate();
            }
        });

        goBtn.addEventListener('click', () => { clearTimeout(autoTimer); runTranslate(); });

        swap.addEventListener('click', () => {
            const prev = document.getElementById('ont5-out').dataset.val || '';
            [srcLang, tgtLang] = [tgtLang, srcLang];
            srcSel.value = srcLang; tgtSel.value = tgtLang;
            saveSettings(); updatePills();
            swap.classList.add('ont5-spin');
            setTimeout(() => swap.classList.remove('ont5-spin'), 420);
            if (prev) {
                input.value = prev;
                document.getElementById('ont5-cnt').textContent = `${prev.length} / ${MAX_CHARS}`;
                goBtn.disabled = false;
                resetOut();
                clearTimeout(autoTimer);
                runTranslate();
            }
        });

        srcSel.addEventListener('change', () => { srcLang = srcSel.value; saveSettings(); updatePills(); if (input.value.trim()) runTranslate(); });
        tgtSel.addEventListener('change', () => { tgtLang = tgtSel.value; saveSettings(); updatePills(); if (input.value.trim()) runTranslate(); });

        clear.addEventListener('click', () => {
            input.value = '';
            document.getElementById('ont5-cnt').textContent = `0 / ${MAX_CHARS}`;
            document.getElementById('ont5-cnt').classList.remove('ont5-cnt-warn');
            goBtn.disabled = true;
            resetOut(); clearTimeout(autoTimer); input.focus();
        });

        copyB.addEventListener('click', () => {
            const text = document.getElementById('ont5-out').dataset.val || '';
            if (!text) return;
            const showToast = () => {
                const t = document.getElementById('ont5-toast');
                t.classList.add('ont5-toast-show');
                setTimeout(() => t.classList.remove('ont5-toast-show'), 2000);
            };
            if (navigator.clipboard) navigator.clipboard.writeText(text).then(showToast).catch(() => fbCopy(text, showToast));
            else fbCopy(text, showToast);
        });

        ttsB.addEventListener('click', () => {
            const text = document.getElementById('ont5-out').dataset.val || '';
            if (!text || !window.speechSynthesis) return;
            if (ttsB.classList.contains('ont5-tts-on')) {
                window.speechSynthesis.cancel();
                ttsB.classList.remove('ont5-tts-on');
                return;
            }
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = tgtLang === 'zh' ? 'zh-CN' : `${tgtLang}-${tgtLang.toUpperCase()}`;
            u.onstart = () => ttsB.classList.add('ont5-tts-on');
            u.onend = u.onerror = () => ttsB.classList.remove('ont5-tts-on');
            window.speechSynthesis.speak(u);
        });

        document.getElementById('ont5-pills').addEventListener('click', e => {
            const p = e.target.closest('.ont5-pill');
            if (!p) return;
            srcLang = p.dataset.s; tgtLang = p.dataset.t;
            srcSel.value = srcLang; tgtSel.value = tgtLang;
            saveSettings(); updatePills();
            if (input.value.trim()) runTranslate();
        });
    }

    function toggle() { isOpen ? closeWin() : openWin(); }

    function openWin() {
        isOpen = true;
        document.getElementById('ont5-win').classList.add('ont5-open');
        document.getElementById('ont5-win').setAttribute('aria-hidden', 'false');
        document.getElementById('ont5-fab').classList.add('ont5-fab-on');
        document.getElementById('ont5-icon-open').style.display = 'none';
        document.getElementById('ont5-icon-close').style.display = 'block';
        setTimeout(() => document.getElementById('ont5-input')?.focus(), 200);
    }

    function closeWin() {
        isOpen = false;
        document.getElementById('ont5-win').classList.remove('ont5-open');
        document.getElementById('ont5-win').setAttribute('aria-hidden', 'true');
        document.getElementById('ont5-fab').classList.remove('ont5-fab-on');
        document.getElementById('ont5-icon-open').style.display = 'block';
        document.getElementById('ont5-icon-close').style.display = 'none';
        window.speechSynthesis?.cancel();
    }

    async function runTranslate() {
        const text = document.getElementById('ont5-input').value.trim();
        if (!text || isBusy) return;
        if (srcLang === tgtLang) { showResult(text); return; }

        isBusy = true;
        setLoading(true);

        try {
            const result = await doTranslateAPI(text, srcLang, tgtLang);
            showResult(result);
        } catch(err) {
            console.error('[OniList Translate]', err);
            showError('Translation failed: ' + err.message);
        } finally {
            isBusy = false;
            setLoading(false);
        }
    }

    function setLoading(on) {
        document.getElementById('ont5-go-lbl').style.display  = on ? 'none'  : 'inline';
        document.getElementById('ont5-go-dots').style.display = on ? 'flex'  : 'none';
        document.getElementById('ont5-go').disabled           = on;
        document.getElementById('ont5-skel').style.display    = on ? 'flex'  : 'none';
        document.getElementById('ont5-out').style.display     = on ? 'none'  : '';
        if (!on) document.getElementById('ont5-go').disabled  = document.getElementById('ont5-input').value.length === 0;
    }

    function showResult(text) {
        const out  = document.getElementById('ont5-out');
        const foot = document.getElementById('ont5-out-foot');
        const lang = document.getElementById('ont5-out-lang');
        out.dataset.val  = text;
        out.innerHTML    = `<p class="ont5-result-text">${esc(text)}</p>`;
        out.style.display = '';
        out.classList.add('ont5-anim');
        setTimeout(() => out.classList.remove('ont5-anim'), 400);
        lang.textContent = `${FLAGS[tgtLang]||''} ${NAMES[tgtLang]||tgtLang}`;
        foot.style.display = 'flex';
    }

    function showError(msg) {
        const out = document.getElementById('ont5-out');
        out.innerHTML = `<p class="ont5-err-text">⚠️ ${esc(msg)}</p>`;
        out.dataset.val = ''; out.style.display = '';
        document.getElementById('ont5-skel').style.display = 'none';
        document.getElementById('ont5-out-foot').style.display = 'none';
    }

    function resetOut() {
        const out = document.getElementById('ont5-out');
        out.innerHTML = '<span class="ont5-hint">Translation will appear here…</span>';
        out.removeAttribute('data-val');
        document.getElementById('ont5-out-foot').style.display = 'none';
    }

    function updatePills() {
        document.querySelectorAll('.ont5-pill').forEach(p =>
            p.classList.toggle('ont5-pill-on', p.dataset.s === srcLang && p.dataset.t === tgtLang)
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

    function esc(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
    }

    init();
})();