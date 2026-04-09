// api/translate.js
// Vercel Serverless Function — Google Translate proxy

const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX_REQ = 20;
const _ipRate = new Map();

function getClientIp(req) {
    const fwd = req.headers['x-forwarded-for'];
    if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const prev = _ipRate.get(ip) || { count: 0, windowStart: now };
    if (now - prev.windowStart > RATE_WINDOW_MS) {
        const reset = { count: 1, windowStart: now };
        _ipRate.set(ip, reset);
        return { allowed: true, remaining: RATE_MAX_REQ - 1 };
    }
    if (prev.count >= RATE_MAX_REQ) {
        return { allowed: false, remaining: 0 };
    }
    prev.count += 1;
    _ipRate.set(ip, prev);
    return { allowed: true, remaining: RATE_MAX_REQ - prev.count };
}

function normalizeOrigin(req) {
    const origin = req.headers.origin || '';
    return typeof origin === 'string' ? origin.trim() : '';
}

function allowedOrigins() {
    const env = process.env.ALLOWED_ORIGINS || '';
    const list = env
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    list.push('https://onilist.com', 'https://www.onilist.com');
    return Array.from(new Set(list));
}

function isValidLangCode(code) {
    return typeof code === 'string' && /^[a-z]{2,3}(-[A-Za-z]{2,4})?$/.test(code);
}

export default async function handler(req, res) {
    const origin = normalizeOrigin(req);
    const allowList = allowedOrigins();
    const originAllowed = allowList.includes(origin);

    if (originAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
        return originAllowed ? res.status(200).end() : res.status(403).json({ error: 'Origin not allowed' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!originAllowed) {
        return res.status(403).json({ error: 'Origin not allowed' });
    }

    const ip = getClientIp(req);
    const rl = checkRateLimit(ip);
    res.setHeader('X-RateLimit-Limit', String(RATE_MAX_REQ));
    res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
    if (!rl.allowed) {
        return res.status(429).json({ error: 'Too many requests' });
    }

    const { text, from, to } = req.body;

    if (!text || !from || !to) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    if (typeof text !== 'string') {
        return res.status(400).json({ error: 'Invalid text' });
    }

    if (!isValidLangCode(from) || !isValidLangCode(to)) {
        return res.status(400).json({ error: 'Invalid language code' });
    }

    if (text.length > 2000) {
        return res.status(400).json({ error: 'Text too long' });
    }

    try {
        // Google Translate unofficial endpoint — sunucudan çağrılınca CORS yok
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Google returned ${response.status}`);
        }

        const data = await response.json();

        // Google yanıt formatı: [ [[translated, original], ...], ... ]
        const translated = data[0]
            .filter(seg => Array.isArray(seg) && seg[0])
            .map(seg => seg[0])
            .join('');

        if (!translated) {
            throw new Error('Empty translation');
        }

        return res.status(200).json({ result: translated });

    } catch (err) {
        console.error('[Translate API]', err.message);
        return res.status(500).json({ error: err.message });
    }
}