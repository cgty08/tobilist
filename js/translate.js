// ============================================================
//  OniList Translate Widget v2.0
//  Yenilikler:
//   ✦ Otomatik Dil Tespiti (detect language)
//   ✦ Ses Okuma — Web Speech API (TTS)
//   ✦ Formality seçimi (Normal / Resmi / Samimi)
//   ✦ Favori çeviriler (yıldız / pin)
//   ✦ Kelime + Karakter sayacı
//   ✦ Skeleton loader animasyonu
//   ✦ Streaming efekti (kelime kelime çıkış)
//   ✦ Geçmiş silme & tek tık yükleme
//   ✦ Klavye kısayolları (Ctrl+Enter, Esc)
//   ✦ Siteye zarar vermez: tüm sınıflar "ont-" prefix'li
// ============================================================

(function () {
    'use strict';

    // ─── Dil Listesi ─────────────────────────────────────────
    const LANGUAGES = [
        { code: 'auto', label: '🔍 Otomatik Tespit', flag: '🔍' },
        { code: 'tr',   label: '🇹🇷 Türkçe',         flag: '🇹🇷' },
        { code: 'en',   label: '🇬🇧 English',         flag: '🇬🇧' },
        { code: 'ja',   label: '🇯🇵 日本語',           flag: '🇯🇵' },
        { code: 'ko',   label: '🇰🇷 한국어',           flag: '🇰🇷' },
        { code: 'zh',   label: '🇨🇳 中文',             flag: '🇨🇳' },
        { code: 'de',   label: '🇩🇪 Deutsch',         flag: '🇩🇪' },
        { code: 'fr',   label: '🇫🇷 Français',        flag: '🇫🇷' },
        { code: 'es',   label: '🇪🇸 Español',         flag: '🇪🇸' },
        { code: 'it',   label: '🇮🇹 Italiano',        flag: '🇮🇹' },
        { code: 'pt',   label: '🇧🇷 Português',       flag: '🇧🇷' },
        { code: 'ru',   label: '🇷🇺 Русский',         flag: '🇷🇺' },
        { code: 'ar',   label: '🇸🇦 العربية',          flag: '🇸🇦' },
        { code: 'hi',   label: '🇮🇳 हिन्दी',           flag: '🇮🇳' },
        { code: 'id',   label: '🇮🇩 Indonesia',       flag: '🇮🇩' },
        { code: 'nl',   label: '🇳🇱 Nederlands',      flag: '🇳🇱' },
        { code: 'pl',   label: '🇵🇱 Polski',          flag: '🇵🇱' },
        { code: 'sv',   label: '🇸🇪 Svenska',         flag: '🇸🇪' },
        { code: 'vi',   label: '🇻🇳 Tiếng Việt',     flag: '🇻🇳' },
        { code: 'th',   label: '🇹🇭 ภาษาไทย',        flag: '🇹🇭' },
        { code: 'uk',   label: '🇺🇦 Українська',      flag: '🇺🇦' },
        { code: 'el',   label: '🇬🇷 Ελληνικά',        flag: '🇬🇷' },
        { code: 'cs',   label: '🇨🇿 Čeština',         flag: '🇨🇿' },
        { code: 'ro',   label: '🇷🇴 Română',          flag: '🇷🇴' },
        { code: 'hu',   label: '🇭🇺 Magyar',          flag: '🇭🇺' },
    ];

    const LANG_NAMES = Object.fromEntries(
        LANGUAGES.filter(l => l.code !== 'auto').map(l => [l.code, l.label.replace(/^[^\s]+ /, '')])
    );
    const LANG_FLAGS = Object.fromEntries(LANGUAGES.map(l => [l.code, l.flag]));

    const QUICK_PAIRS = [
        { src: 'tr',   tgt: 'en', label: 'TR → EN' },
        { src: 'en',   tgt: 'tr', label: 'EN → TR' },
        { src: 'ja',   tgt: 'tr', label: 'JP → TR' },
        { src: 'ko',   tgt: 'tr', label: 'KR → TR' },
        { src: 'zh',   tgt: 'tr', label: 'ZH → TR' },
        { src: 'de',   tgt: 'tr', label: 'DE → TR' },
        { src: 'en',   tgt: 'ja', label: 'EN → JP' },
    ];

    const FORMALITY_OPTIONS = [
        { value: 'neutral',  label: '💬 Normal',  title: 'Standart çeviri' },
        { value: 'formal',   label: '👔 Resmi',   title: 'Resmi / profesyonel dil' },
        { value: 'informal', label: '😊 Samimi',  title: 'Günlük / arkadaşça dil' },
    ];

    const HISTORY_KEY   = 'onilist_translate_history_v2';
    const FAVORITES_KEY = 'onilist_translate_favorites';
    const SETTINGS_KEY  = 'onilist_translate_settings';
    const MAX_CHARS     = 3000;
    const AUTO_DELAY_MS = 900;

    // ─── State ────────────────────────────────────────────────
    let sourceLang    = 'auto';
    let targetLang    = 'en';
    let formality     = 'neutral';
    let isTranslating = false;
    let autoTimer     = null;
    let charCount     = 0;
    let detectedLang  = null;
    let currentTab    = 'history';

    // ─── DOM shortcuts ───────────────────────────────────────
    const $  = id  => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);

    // ─── Init ─────────────────────────────────────────────────
    function init() {
        loadSettings();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', render);
        } else {
            render();
        }
    }

    function loadSettings() {
        try {
            const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
            if (s.sourceLang) sourceLang = s.sourceLang;
            if (s.targetLang) targetLang = s.targetLang;
            if (s.formality)  formality  = s.formality;
        } catch (e) {}
    }

    function saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify({ sourceLang, targetLang, formality }));
        } catch (e) {}
    }

    // ─── Render ───────────────────────────────────────────────
    function render() {
        const root = document.getElementById('onilist-translate-root');
        if (!root) return;
        root.innerHTML = buildHTML();
        bindEvents();
        renderSideList();
    }

    function buildHTML() {
        const srcOptions = LANGUAGES.map(l =>
            `<option value="${l.code}"${l.code === sourceLang ? ' selected' : ''}>${l.label}</option>`
        ).join('');

        const tgtOptions = LANGUAGES.filter(l => l.code !== 'auto').map(l =>
            `<option value="${l.code}"${l.code === targetLang ? ' selected' : ''}>${l.label}</option>`
        ).join('');

        const formalityBtns = FORMALITY_OPTIONS.map(f =>
            `<button class="ont-form-btn${formality === f.value ? ' active' : ''}" data-form="${f.value}" title="${f.title}">${f.label}</button>`
        ).join('');

        const quickPills = QUICK_PAIRS.map(q =>
            `<button class="ont-quick-pill${q.src === sourceLang && q.tgt === targetLang ? ' active' : ''}" data-src="${q.src}" data-tgt="${q.tgt}">${q.label}</button>`
        ).join('');

        return `
<div class="ont-widget" id="ont-widget">

  <!-- ══ HEADER ══════════════════════════════════════════════ -->
  <div class="ont-header">
    <div class="ont-title">
      <span class="ont-logo-ring">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="url(#og1)" stroke-width="1.8"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="url(#og1)" stroke-width="1.8"/>
          <defs>
            <linearGradient id="og1" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stop-color="#ff3366"/>
              <stop offset="100%" stop-color="#00d4ff"/>
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span class="ont-title-text">Çeviri</span>
      <span class="ont-ai-badge">Claude AI</span>
    </div>
    <div class="ont-header-right">
      <span class="ont-kbd-hint">⌨ Ctrl+↵</span>
      <button class="ont-icon-btn" id="ont-panel-toggle" title="Geçmiş & Favoriler">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- ══ FORMALITY BAR ════════════════════════════════════════ -->
  <div class="ont-formality-bar">
    <span class="ont-form-label">Üslup:</span>
    <div class="ont-form-group" id="ont-form-group">${formalityBtns}</div>
  </div>

  <!-- ══ LANG BAR ════════════════════════════════════════════ -->
  <div class="ont-lang-bar">
    <div class="ont-lang-side">
      <select class="ont-lang-sel" id="ont-src-sel">${srcOptions}</select>
      <div class="ont-detect-chip" id="ont-detect-chip" style="display:none">
        <span class="ont-detect-dot"></span>
        <span id="ont-detect-label">Algılandı</span>
      </div>
    </div>

    <button class="ont-swap-btn" id="ont-swap-btn" title="Dilleri değiştir">
      <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
        <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/>
      </svg>
    </button>

    <div class="ont-lang-side ont-lang-right">
      <select class="ont-lang-sel" id="ont-tgt-sel">${tgtOptions}</select>
    </div>
  </div>

  <!-- ══ PANELS ══════════════════════════════════════════════ -->
  <div class="ont-panels">

    <!-- SOURCE -->
    <div class="ont-panel ont-panel-src">
      <div class="ont-panel-bar">
        <span class="ont-panel-flag" id="ont-src-flag">${LANG_FLAGS[sourceLang] || '🔍'}</span>
        <div class="ont-bar-actions">
          <button class="ont-tts-btn" id="ont-tts-src" title="Sesli oku" disabled>
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </button>
          <button class="ont-icon-btn ont-xs" id="ont-clear-btn" title="Temizle">
            <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <textarea
        id="ont-src-input"
        class="ont-textarea"
        placeholder="Çevirmek istediğiniz metni buraya yazın…"
        maxlength="${MAX_CHARS}"
        spellcheck="false"
      ></textarea>

      <div class="ont-panel-footer">
        <div class="ont-counters">
          <span id="ont-char-count" class="ont-cnt">0 / ${MAX_CHARS}</span>
          <span class="ont-cnt-sep">·</span>
          <span id="ont-word-count" class="ont-cnt">0 kelime</span>
        </div>
        <button class="ont-translate-btn" id="ont-translate-btn" disabled>
          <span id="ont-btn-label">Çevir</span>
          <div class="ont-dots" id="ont-btn-dots" style="display:none">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
    </div>

    <!-- GUTTER -->
    <div class="ont-gutter"></div>

    <!-- TARGET -->
    <div class="ont-panel ont-panel-tgt">
      <div class="ont-panel-bar">
        <span class="ont-panel-flag" id="ont-tgt-flag">${LANG_FLAGS[targetLang] || '🌐'}</span>
        <div class="ont-bar-actions">
          <button class="ont-tts-btn" id="ont-tts-tgt" title="Sesli oku" disabled>
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </button>
          <button class="ont-icon-btn ont-xs" id="ont-fav-btn" title="Favorilere ekle" disabled>
            <svg id="ont-fav-icon" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
          <button class="ont-icon-btn ont-xs" id="ont-copy-btn" title="Kopyala" disabled>
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div class="ont-skeleton" id="ont-skeleton" style="display:none">
        <div class="ont-sk-line ont-sk-w80"></div>
        <div class="ont-sk-line ont-sk-w60"></div>
        <div class="ont-sk-line ont-sk-w75"></div>
        <div class="ont-sk-line ont-sk-w45"></div>
      </div>

      <div class="ont-output" id="ont-output" aria-live="polite">
        <span class="ont-placeholder">Çeviri burada görünecek…</span>
      </div>

      <div class="ont-panel-footer ont-footer-right">
        <div class="ont-toast" id="ont-copy-toast">✅ Kopyalandı!</div>
        <div class="ont-toast ont-fav-toast" id="ont-fav-toast">⭐ Favorilere eklendi!</div>
      </div>
    </div>
  </div>

  <!-- ══ QUICK PILLS ══════════════════════════════════════════ -->
  <div class="ont-quick-bar">
    <span class="ont-quick-lbl">Hızlı:</span>
    <div class="ont-quick-pills" id="ont-quick-pills">${quickPills}</div>
  </div>

  <!-- ══ SIDE PANEL ══════════════════════════════════════════ -->
  <div class="ont-side-panel" id="ont-side-panel" style="display:none">
    <div class="ont-side-tabs">
      <button class="ont-side-tab active" data-tab="history" id="ont-tab-history">
        <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg> Geçmiş
      </button>
      <button class="ont-side-tab" data-tab="favorites" id="ont-tab-favorites">
        <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg> Favoriler
      </button>
      <button class="ont-side-clear" id="ont-side-clear" title="Tümünü temizle">🗑</button>
    </div>
    <div class="ont-side-body" id="ont-side-body"></div>
  </div>

</div>`;
    }

    // ─── Events ───────────────────────────────────────────────
    function bindEvents() {
        const srcInput     = $('ont-src-input');
        const translateBtn = $('ont-translate-btn');

        // Textarea
        srcInput.addEventListener('input', () => {
            charCount = srcInput.value.length;
            const wc  = srcInput.value.trim() ? srcInput.value.trim().split(/\s+/).length : 0;
            $('ont-char-count').textContent = `${charCount} / ${MAX_CHARS}`;
            $('ont-char-count').classList.toggle('ont-cnt-warn', charCount > MAX_CHARS * 0.85);
            $('ont-word-count').textContent = `${wc} kelime`;
            translateBtn.disabled  = charCount === 0 || isTranslating;
            $('ont-tts-src').disabled = charCount === 0;

            clearTimeout(autoTimer);
            if (charCount > 0) autoTimer = setTimeout(doTranslate, AUTO_DELAY_MS);
            else { resetOutput(); hideDetectChip(); }
        });

        srcInput.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); clearTimeout(autoTimer); doTranslate(); }
            if (e.key === 'Escape') srcInput.blur();
        });

        translateBtn.addEventListener('click', () => { clearTimeout(autoTimer); doTranslate(); });

        // Swap
        $('ont-swap-btn').addEventListener('click', () => {
            const outText  = $('ont-output').dataset.translation || '';
            const realSrc  = (sourceLang === 'auto' && detectedLang) ? detectedLang : (sourceLang === 'auto' ? targetLang : sourceLang);
            [sourceLang, targetLang] = [targetLang, realSrc];
            $('ont-src-sel').value = sourceLang;
            $('ont-tgt-sel').value = targetLang;
            hideDetectChip();
            updateFlags();
            updateQuickPills();
            saveSettings();
            if (outText) { srcInput.value = outText; charCount = outText.length; $('ont-char-count').textContent = `${charCount} / ${MAX_CHARS}`; translateBtn.disabled = false; $('ont-tts-src').disabled = false; resetOutput(); clearTimeout(autoTimer); doTranslate(); }
            $('ont-swap-btn').classList.add('ont-swap-spin');
            setTimeout(() => $('ont-swap-btn').classList.remove('ont-swap-spin'), 420);
        });

        // Lang selects
        $('ont-src-sel').addEventListener('change', () => {
            sourceLang = $('ont-src-sel').value;
            hideDetectChip();
            updateFlags();
            updateQuickPills();
            saveSettings();
            if (srcInput.value.trim()) doTranslate();
        });

        $('ont-tgt-sel').addEventListener('change', () => {
            targetLang = $('ont-tgt-sel').value;
            updateFlags();
            updateQuickPills();
            saveSettings();
            if (srcInput.value.trim()) doTranslate();
        });

        // Formality
        $('ont-form-group').addEventListener('click', e => {
            const btn = e.target.closest('.ont-form-btn');
            if (!btn) return;
            formality = btn.dataset.form;
            $$('.ont-form-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            saveSettings();
            if ($('ont-src-input').value.trim()) doTranslate();
        });

        // Clear
        $('ont-clear-btn').addEventListener('click', () => {
            srcInput.value = ''; charCount = 0;
            $('ont-char-count').textContent = `0 / ${MAX_CHARS}`;
            $('ont-char-count').classList.remove('ont-cnt-warn');
            $('ont-word-count').textContent = '0 kelime';
            translateBtn.disabled = true;
            $('ont-tts-src').disabled = true;
            resetOutput(); hideDetectChip(); clearTimeout(autoTimer);
            srcInput.focus();
        });

        // Copy
        $('ont-copy-btn').addEventListener('click', () => {
            const text = $('ont-output').dataset.translation || '';
            if (!text) return;
            const doCopy = () => showToast('ont-copy-toast');
            navigator.clipboard ? navigator.clipboard.writeText(text).then(doCopy).catch(fallbackCopy.bind(null, text, doCopy)) : fallbackCopy(text, doCopy);
        });

        // Favorites
        $('ont-fav-btn').addEventListener('click', () => {
            const tgtText = $('ont-output').dataset.translation || '';
            const srcText = $('ont-src-input').value.trim();
            if (!tgtText) return;
            addFavorite({ src: srcText, tgt: tgtText, srcLang: sourceLang === 'auto' ? (detectedLang || 'auto') : sourceLang, tgtLang: targetLang, ts: Date.now() });
            showToast('ont-fav-toast');
            const icon = $('ont-fav-icon');
            icon.setAttribute('fill', '#fbbf24');
            icon.setAttribute('stroke', '#fbbf24');
        });

        // TTS
        $('ont-tts-src').addEventListener('click', () => {
            const t = $('ont-src-input').value.trim();
            const l = sourceLang === 'auto' ? (detectedLang || 'tr') : sourceLang;
            if (t) toggleSpeak(t, l, $('ont-tts-src'));
        });

        $('ont-tts-tgt').addEventListener('click', () => {
            const t = $('ont-output').dataset.translation || '';
            if (t) toggleSpeak(t, targetLang, $('ont-tts-tgt'));
        });

        // Quick pills
        $('ont-quick-pills').addEventListener('click', e => {
            const pill = e.target.closest('.ont-quick-pill');
            if (!pill) return;
            sourceLang = pill.dataset.src;
            targetLang = pill.dataset.tgt;
            $('ont-src-sel').value = sourceLang;
            $('ont-tgt-sel').value = targetLang;
            hideDetectChip(); updateFlags(); updateQuickPills(); saveSettings();
            if ($('ont-src-input').value.trim()) doTranslate();
        });

        // Side panel toggle
        $('ont-panel-toggle').addEventListener('click', () => {
            const sp = $('ont-side-panel');
            const open = sp.style.display !== 'none';
            sp.style.display = open ? 'none' : 'block';
            if (!open) renderSideList();
        });

        // Tabs
        $('ont-tab-history').addEventListener('click',   () => setTab('history'));
        $('ont-tab-favorites').addEventListener('click', () => setTab('favorites'));

        // Clear all
        $('ont-side-clear').addEventListener('click', () => {
            const msg = currentTab === 'history' ? 'Tüm geçmiş silinsin mi?' : 'Tüm favoriler silinsin mi?';
            if (!confirm(msg)) return;
            localStorage.removeItem(currentTab === 'history' ? HISTORY_KEY : FAVORITES_KEY);
            renderSideList();
        });
    }

    // ─── Tab ──────────────────────────────────────────────────
    function setTab(tab) {
        currentTab = tab;
        $$('.ont-side-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        renderSideList();
    }

    // ─── Translation ──────────────────────────────────────────
    async function doTranslate() {
        const text = $('ont-src-input').value.trim();
        if (!text || isTranslating) return;

        isTranslating = true;
        setLoading(true);

        const fNote = { formal: 'Use formal, professional language.', informal: 'Use casual, friendly language.', neutral: '' }[formality];
        const isAuto = sourceLang === 'auto';

        const prompt = [
            'You are a professional translator.',
            isAuto
                ? `Identify the source language and translate to ${LANG_NAMES[targetLang]}.`
                : `Translate from ${LANG_NAMES[sourceLang]} to ${LANG_NAMES[targetLang]}.`,
            fNote,
            isAuto
                ? 'Respond with ONLY a JSON object: {"detectedLang":"<ISO 639-1 code>","translation":"<translated text>"}'
                : 'Respond with ONLY the translated text. No quotes, no explanation.',
            `\nText:\n${text}`
        ].filter(Boolean).join('\n');

        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1500,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error?.message || `HTTP ${res.status}`);
            }

            const data = await res.json();
            let raw = data.content?.[0]?.text?.trim() || '';
            if (!raw) throw new Error('Boş yanıt alındı');

            let translated = raw;

            if (isAuto) {
                try {
                    const clean = raw.replace(/```json|```/gi, '').trim();
                    const parsed = JSON.parse(clean);
                    translated = parsed.translation || raw;
                    if (parsed.detectedLang) { detectedLang = parsed.detectedLang; showDetectChip(parsed.detectedLang); }
                } catch (_) { translated = raw; }
            }

            streamOutput(translated);
            $('ont-tts-tgt').disabled = false;
            $('ont-copy-btn').disabled = false;
            $('ont-fav-btn').disabled = false;
            const icon = $('ont-fav-icon');
            icon.setAttribute('fill', 'none');
            icon.setAttribute('stroke', 'currentColor');

            saveToHistory({ src: text.slice(0, 120), tgt: translated.slice(0, 180), srcLang: isAuto ? (detectedLang || 'auto') : sourceLang, tgtLang: targetLang, formality, ts: Date.now() });

        } catch (err) {
            console.error('[OniList Translate v2]', err);
            showError('⚠️ ' + escapeHtml(err.message));
        } finally {
            isTranslating = false;
            setLoading(false);
        }
    }

    // ─── Streaming output ─────────────────────────────────────
    function streamOutput(text) {
        const out   = $('ont-output');
        const words = text.split(' ');
        let i = 0;
        out.innerHTML = '';
        const span = document.createElement('span');
        span.className = 'ont-output-text';
        out.appendChild(span);

        function tick() {
            if (i >= words.length) { out.dataset.translation = text; return; }
            span.textContent += (i > 0 ? ' ' : '') + words[i++];
            out.scrollTop = out.scrollHeight;
            requestAnimationFrame(tick);
        }
        tick();
    }

    // ─── TTS ──────────────────────────────────────────────────
    function toggleSpeak(text, langCode, btn) {
        if (!window.speechSynthesis) { alert('Tarayıcınız metin okumayı desteklemiyor.'); return; }
        const isActive = btn.classList.contains('ont-tts-active');
        window.speechSynthesis.cancel();
        $$('.ont-tts-btn').forEach(b => { b.classList.remove('ont-tts-active'); b.title = 'Sesli oku'; });
        if (isActive) return;

        const utter  = new SpeechSynthesisUtterance(text);
        utter.lang   = langCode === 'zh' ? 'zh-CN' : `${langCode}-${langCode.toUpperCase()}`;
        utter.rate   = 0.95;
        utter.onstart = () => { btn.classList.add('ont-tts-active'); btn.title = 'Durdur'; };
        utter.onend = utter.onerror = () => { btn.classList.remove('ont-tts-active'); btn.title = 'Sesli oku'; };
        window.speechSynthesis.speak(utter);
    }

    // ─── Helpers ─────────────────────────────────────────────
    function setLoading(on) {
        $('ont-btn-label').style.display = on ? 'none'  : 'inline';
        $('ont-btn-dots').style.display  = on ? 'flex'  : 'none';
        $('ont-skeleton').style.display  = on ? 'block' : 'none';
        $('ont-output').style.display    = on ? 'none'  : '';
        $('ont-translate-btn').disabled  = on || (!on && charCount === 0);
    }

    function resetOutput() {
        $('ont-output').innerHTML = '<span class="ont-placeholder">Çeviri burada görünecek…</span>';
        $('ont-output').removeAttribute('data-translation');
        ['ont-copy-btn','ont-fav-btn','ont-tts-tgt'].forEach(id => $(id).disabled = true);
    }

    function showError(msg) {
        $('ont-skeleton').style.display = 'none';
        $('ont-output').style.display   = '';
        $('ont-output').innerHTML = `<span class="ont-error-text">${msg}</span>`;
    }

    function updateFlags() {
        const sf = $('ont-src-flag');
        const tf = $('ont-tgt-flag');
        if (sf) sf.textContent = sourceLang === 'auto' ? '🔍' : (LANG_FLAGS[sourceLang] || '🌐');
        if (tf) tf.textContent = LANG_FLAGS[targetLang] || '🌐';
    }

    function updateQuickPills() {
        $$('.ont-quick-pill').forEach(p =>
            p.classList.toggle('active', p.dataset.src === sourceLang && p.dataset.tgt === targetLang)
        );
    }

    function showDetectChip(code) {
        const chip  = $('ont-detect-chip');
        const label = $('ont-detect-label');
        if (!chip) return;
        label.textContent = `${LANG_FLAGS[code] || '🌐'} ${LANG_NAMES[code] || code} algılandı`;
        chip.style.display = 'flex';
    }

    function hideDetectChip() {
        const c = $('ont-detect-chip');
        if (c) c.style.display = 'none';
        detectedLang = null;
    }

    function showToast(id) {
        const el = $(id);
        if (!el) return;
        el.style.display = 'block';
        el.classList.add('ont-toast-in');
        setTimeout(() => { el.classList.remove('ont-toast-in'); el.style.display = 'none'; }, 2200);
    }

    function fallbackCopy(text, cb) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity  = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); cb(); } catch(e) {}
        document.body.removeChild(ta);
    }

    function escapeHtml(s) {
        return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function formatAge(ts) {
        if (!ts) return '';
        const d = Math.floor((Date.now() - ts) / 1000);
        if (d < 60)    return 'az önce';
        if (d < 3600)  return `${Math.floor(d/60)}dk`;
        if (d < 86400) return `${Math.floor(d/3600)}sa`;
        return `${Math.floor(d/86400)}g`;
    }

    // ─── Storage ──────────────────────────────────────────────
    const load   = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; } };
    const getHist = () => load(HISTORY_KEY);
    const getFavs = () => load(FAVORITES_KEY);

    function saveToHistory(item) {
        try {
            const list = getHist().filter(h => h.src !== item.src);
            list.unshift(item);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 40)));
        } catch(e) {}
    }

    function addFavorite(item) {
        try {
            const list = getFavs().filter(f => f.tgt !== item.tgt);
            list.unshift(item);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(list.slice(0, 50)));
        } catch(e) {}
    }

    // ─── Side Panel Render ────────────────────────────────────
    function renderSideList() {
        const body  = $('ont-side-body');
        if (!body) return;
        const items = currentTab === 'history' ? getHist() : getFavs();

        if (!items.length) {
            body.innerHTML = `<div class="ont-side-empty">${currentTab === 'history' ? '⏱ Henüz çeviri yapılmadı' : '⭐ Henüz favori yok'}</div>`;
            return;
        }

        body.innerHTML = items.map((item, i) => `
<div class="ont-side-item" data-index="${i}">
  <div class="ont-side-item-top">
    <span class="ont-side-langs">${LANG_FLAGS[item.srcLang]||'🌐'} → ${LANG_FLAGS[item.tgtLang]||'🌐'}</span>
    <span class="ont-side-age">${formatAge(item.ts)}</span>
    <button class="ont-del-btn" data-del="${i}" title="Sil">✕</button>
  </div>
  <div class="ont-side-src">${escapeHtml((item.src||'').slice(0,100))}${(item.src||'').length>100?'…':''}</div>
  <div class="ont-side-tgt">${escapeHtml((item.tgt||'').slice(0,140))}${(item.tgt||'').length>140?'…':''}</div>
</div>`).join('');

        body.querySelectorAll('.ont-side-item').forEach(el => {
            el.addEventListener('click', e => {
                if (e.target.closest('.ont-del-btn')) return;
                loadItem(items[+el.dataset.index]);
            });
        });

        body.querySelectorAll('.ont-del-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const key  = currentTab === 'history' ? HISTORY_KEY : FAVORITES_KEY;
                const list = load(key);
                list.splice(+btn.dataset.del, 1);
                try { localStorage.setItem(key, JSON.stringify(list)); } catch(e) {}
                renderSideList();
            });
        });
    }

    function loadItem(item) {
        const inp = $('ont-src-input');
        inp.value = item.src || '';
        charCount = inp.value.length;
        $('ont-char-count').textContent = `${charCount} / ${MAX_CHARS}`;
        $('ont-word-count').textContent = `${inp.value.trim().split(/\s+/).filter(Boolean).length} kelime`;
        $('ont-translate-btn').disabled = false;
        $('ont-tts-src').disabled = false;

        if (item.srcLang && item.srcLang !== 'auto') { sourceLang = item.srcLang; $('ont-src-sel').value = sourceLang; }
        if (item.tgtLang) { targetLang = item.tgtLang; $('ont-tgt-sel').value = targetLang; }

        hideDetectChip(); updateFlags(); updateQuickPills();
        $('ont-side-panel').style.display = 'none';
        clearTimeout(autoTimer);
        doTranslate();
    }

    init();
})();