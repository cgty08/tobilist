// api/translate.js
// Vercel Serverless Function — Google Translate proxy
// Kendi sitenizde /api/translate endpoint'i oluşturur
// CORS sorunu olmaz çünkü kendi domain'inizden çağrılıyor

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, from, to } = req.body;

    if (!text || !from || !to) {
        return res.status(400).json({ error: 'Missing parameters' });
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