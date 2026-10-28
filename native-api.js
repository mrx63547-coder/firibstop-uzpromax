/* FiribStop standalone API layer.
 *
 * Inside the Capacitor APK there is no Node server, so requests to /api/* are answered here:
 *   - /api/news, /api/analytics, /api/attacks  -> RSS feeds are fetched directly from the sources
 *     through the native HTTP plugin (CapacitorHttp), which is not subject to browser CORS rules.
 *   - /api/radar-data, /api/site-security-events, /api/intel/urlhaus -> need secret API keys that
 *     must never be shipped inside an APK, so they report "unavailable" instead of failing.
 * In a normal browser / PWA on a server nothing is intercepted and the real server is used.
 *
 * The RSS parsing below mirrors news-feed.js (server). tests/standalone-api.test.js keeps them in sync.
 */
(function (global) {
  'use strict';

  const VERSION = '2.8.0-standalone';
  const FEEDS = [
    { name: 'UZCERT — официальные новости Узбекистана', url: 'https://uzcert.uz/ru/feed', official: true },
    { name: 'SecurityLab — новости ИБ', url: 'https://www.securitylab.ru/_services/export/rss/news/', official: false },
    { name: 'Securelist — аналитика киберугроз', url: 'https://securelist.ru/feed/', official: false },
    { name: 'Kaspersky — блог и новости ИБ', url: 'https://www.kaspersky.ru/blog/feed/', official: false },
    { name: 'Anti-Malware.ru — новости ИБ', url: 'https://www.anti-malware.ru/rss.xml', official: false }
  ];
  const MAX_FEED_CHARS = 2 * 1024 * 1024;
  const CACHE_MS = 5 * 60 * 1000;
  const FAIL_CACHE_MS = 30 * 1000;
  const FEED_TIMEOUT_MS = 8000;
  const NATIVE_UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36 FiribStop/2.8';
  let cache = { items: [], sources: [], updatedAt: null, fetchedAt: 0, ttl: CACHE_MS, stale: false };
  let pending = null;

  const origFetch = typeof global.fetch === 'function' ? global.fetch.bind(global) : null;

  function isStandalone() {
    if (global.FIRIBSTOP_STANDALONE === true) return true;
    try {
      const c = global.Capacitor;
      if (!c) return false;
      if (typeof c.isNativePlatform === 'function') return !!c.isNativePlatform();
      if (typeof c.getPlatform === 'function') return c.getPlatform() !== 'web';
    } catch (_) {}
    return false;
  }

  /* ---------- RSS parsing (same rules as news-feed.js) ---------- */
  function decode(s) {
    return String(s == null ? '' : s)
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => { const k = Number(n); try { return Number.isFinite(k) ? String.fromCodePoint(k) : ''; } catch (e) { return ''; } })
      .replace(/&#x([\da-f]+);/gi, (_, n) => { const k = parseInt(n, 16); try { return Number.isFinite(k) ? String.fromCodePoint(k) : ''; } catch (e) { return ''; } })
      .replace(/\s+/g, ' ').trim();
  }
  function tag(block, names) {
    for (const name of names) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const m = block.match(new RegExp('<' + escaped + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + escaped + '\\s*>', 'i'));
      if (m) return m[1];
    }
    return '';
  }
  function cleanUrl(raw) {
    try { const u = new URL(decode(raw)); return ['http:', 'https:'].includes(u.protocol) ? u.href : ''; }
    catch (e) { return ''; }
  }
  function classify(text) {
    const types = [
      ['ransomware', /ransomware|ransom|шифровальщик|вымогател/i],
      ['уязвимости', /vulnerabilit|cve-|zero.day|уязвимост|эксплуатац/i],
      ['фишинг', /phish|scam|fraud|фишинг|мошеннич/i],
      ['утечка данных', /data breach|leak|exposed data|утечк/i],
      ['вредоносное ПО', /malware|trojan|botnet|вредоносн|троян/i],
      ['кибератака / инцидент', /cyber.?attack|hack(ed|ing)?|incident|attack|кибератак|взлом|инцидент/i]
    ];
    for (const [name, re] of types) if (re.test(text)) return name;
    return 'кибербезопасность';
  }
  function idOf(url) {
    const b64 = btoa(unescape(encodeURIComponent(url)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 80);
  }
  function parseFeed(xml, feed) {
    const blocks = xml.match(/<(?:item|entry)(?:\s[^>]*)?>[\s\S]*?<\/(?:item|entry)\s*>/gi) || [];
    return blocks.map((b) => {
      const title = decode(tag(b, ['title']));
      let link = tag(b, ['link']);
      if (!link) {
        const m = b.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i);
        if (m) link = m[1];
      }
      let url = cleanUrl(link);
      if (!url) { const m = b.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i); if (m) url = cleanUrl(m[1]); }
      const description = decode(tag(b, ['description', 'summary', 'content:encoded', 'content'])).slice(0, 700);
      const rawDate = decode(tag(b, ['pubDate', 'published', 'updated', 'dc:date', 'date']));
      const timestamp = rawDate ? Date.parse(rawDate) : NaN;
      const date = Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
      if (!title || !url) return null;
      const text = title + ' ' + description;
      return {
        id: idOf(url), title, description, url, date,
        source: feed.name, category: classify(text),
        important: /critical|actively exploited|zero.day|ransomware|data breach|кибератак|критическ|активно эксплуат/i.test(text),
        official: feed.official, region: null,
        confidence: 'Источник публикации; географическая привязка не подтверждена'
      };
    }).filter(Boolean);
  }

  /* ---------- transport ---------- */
  function headerOf(headers, name) {
    if (!headers) return '';
    for (const k of Object.keys(headers)) if (k.toLowerCase() === name) return String(headers[k]);
    return '';
  }
  function b64ToBytes(s) {
    const bin = atob(String(s).replace(/\s/g, ''));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function decodeBytes(bytes, contentType) {
    let charset = (String(contentType || '').match(/charset=([\w-]+)/i) || [])[1];
    if (!charset) {
      let head = '';
      for (let i = 0; i < Math.min(200, bytes.length); i++) head += String.fromCharCode(bytes[i]);
      charset = (head.match(/<\?xml[^>]*encoding=["']([\w-]+)["']/i) || [])[1];
    }
    try { return new TextDecoder(charset || 'utf-8').decode(bytes); }
    catch (e) { return new TextDecoder('utf-8').decode(bytes); }
  }
  async function httpGetText(url) {
    const http = global.Capacitor && global.Capacitor.Plugins && global.Capacitor.Plugins.CapacitorHttp;
    let status, data, contentType;
    if (http && typeof http.request === 'function') {
      const res = await http.request({
        url, method: 'GET',
        headers: {
          'User-Agent': NATIVE_UA,
          'Accept': 'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.9, */*;q=0.5',
          'Accept-Language': 'ru,en;q=0.8'
        },
        responseType: 'arraybuffer',
        connectTimeout: FEED_TIMEOUT_MS,
        readTimeout: FEED_TIMEOUT_MS
      });
      status = res.status; data = res.data; contentType = headerOf(res.headers, 'content-type');
    } else if (origFetch) {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), FEED_TIMEOUT_MS);
      try {
        const r = await origFetch(url, { signal: ctl.signal, redirect: 'follow' });
        status = r.status; contentType = r.headers.get('content-type') || '';
        data = new Uint8Array(await r.arrayBuffer());
      } finally { clearTimeout(timer); }
    } else {
      throw new Error('Нет доступа к сети');
    }
    if (status < 200 || status >= 300) throw new Error('HTTP ' + status);
    let text = '';
    if (data instanceof Uint8Array) text = decodeBytes(data, contentType);
    else if (typeof data === 'string') {
      if (/^\s*</.test(data)) text = data;               // plugin already returned text
      else { try { text = decodeBytes(b64ToBytes(data), contentType); } catch (e) { text = data; } } // base64 body
    }
    text = text.replace(/^\uFEFF/, '').trimStart();
    if (text.length > MAX_FEED_CHARS) throw new Error('Ответ RSS слишком большой');
    if (!text.includes('<')) throw new Error('Ответ не похож на XML');
    if (/^<!doctype html|^<html/i.test(text)) throw new Error('Источник вернул HTML вместо RSS (возможна блокировка)');
    return text;
  }

  async function fetchFeedOnce(feed) {
    const items = parseFeed(await httpGetText(feed.url), feed);
    if (!items.length) throw new Error('В ленте нет записей');
    return { items, status: { name: feed.name, ok: true, count: items.length } };
  }
  async function fetchFeed(feed) {
    try { return await fetchFeedOnce(feed); }
    catch (first) {
      if (/HTTP 4\d\d/.test(String(first && first.message))) throw first;
      await new Promise((r) => setTimeout(r, 400));
      return await fetchFeedOnce(feed);
    }
  }
  async function refreshNews() {
    const results = await Promise.all(FEEDS.map(async (feed) => {
      try { return await fetchFeed(feed); }
      catch (error) { return { items: [], status: { name: feed.name, ok: false, error: String((error && error.message) || error).slice(0, 120), count: 0 } }; }
    }));
    const seen = new Set();
    const fresh = results.flatMap((r) => r.items).filter((item) => {
      const key = item.url.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true;
    }).sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)).slice(0, 160);
    const sources = results.map((r) => r.status);
    if (!fresh.length && cache.items.length) {
      cache = Object.assign({}, cache, { sources, fetchedAt: Date.now(), ttl: FAIL_CACHE_MS, stale: true });
      return cache;
    }
    cache = { items: fresh, sources, updatedAt: new Date().toISOString(), fetchedAt: Date.now(), ttl: fresh.length ? CACHE_MS : FAIL_CACHE_MS, stale: false };
    return cache;
  }
  function loadNews(force) {
    if (!force && cache.fetchedAt && Date.now() - cache.fetchedAt < (cache.ttl || CACHE_MS)) return Promise.resolve(cache);
    if (!pending) pending = refreshNews().finally(() => { pending = null; });
    return pending;
  }

  /* ---------- /api/* routes ---------- */
  const UNAVAILABLE_RADAR = 'В автономной версии приложения Cloudflare Radar недоступен: для него нужен секретный API-ключ, который нельзя безопасно хранить внутри APK. Остальные разделы работают без сервера.';
  const UNAVAILABLE_SITE = 'В автономной версии события защиты сайта Cloudflare недоступны: это служебные данные владельца сайта и они требуют секретный ключ.';

  async function route(u, method) {
    const p = u.pathname;
    const force = u.searchParams.get('refresh') === '1';
    if (p === '/api/health') return { status: 200, body: { ok: true, service: 'FiribStop standalone', version: VERSION, mode: 'standalone', now: new Date().toISOString() } };
    if (p === '/api/news') {
      const d = await loadNews(force);
      return { status: 200, body: { items: d.items, sources: d.sources, updatedAt: d.updatedAt, stale: Boolean(d.stale) } };
    }
    if (p === '/api/analytics') {
      const d = await loadNews(false);
      const categories = {}, sources = {}, months = {};
      for (const n of d.items) {
        categories[n.category] = (categories[n.category] || 0) + 1;
        sources[n.source] = (sources[n.source] || 0) + 1;
        if (n.date) { const m = n.date.slice(0, 7); months[m] = (months[m] || 0) + 1; }
      }
      return { status: 200, body: { total: d.items.length, important: d.items.filter((x) => x.important).length, categories, sources, months, updatedAt: d.updatedAt, method: 'Статистика публикаций из RSS, не статистика всех кибератак.' } };
    }
    if (p === '/api/attacks') {
      const d = await loadNews(false);
      return { status: 200, body: { items: d.items.filter((x) => /кибератак \/ инцидент|вредоносное ПО|утечка данных|фишинг|ransomware|уязвимости/i.test(x.category)), updatedAt: d.updatedAt, notice: 'Это сообщения СМИ и бюллетени безопасности, не подтверждённый глобальный поток атак.' } };
    }
    if (p === '/api/radar-data') return { status: 200, body: { configured: false, status: 'standalone_unavailable', message: UNAVAILABLE_RADAR, topOrigins: [], topTargets: [], vectors: [], protocols: [], fetchedAt: null, sourceUpdatedAt: null } };
    if (p === '/api/site-security-events') return { status: 200, body: { configured: false, status: 'standalone_unavailable', message: UNAVAILABLE_SITE } };
    if (p === '/api/intel/urlhaus') return { status: 503, body: { error: 'Онлайн-проверка URLhaus недоступна в автономной версии (нужен секретный ключ). Локальная проверка работает без интернета.', source: 'URLhaus (abuse.ch)' } };
    if (p === '/api/threat-status') return { status: 200, body: { available: false, count: 0, updatedAt: null, error: 'Автономный режим: используется встроенная база data/threats.json.' } };
    if (p === '/api/regions') return { status: 404, body: { error: 'Используется встроенная схема регионов' } };
    return { status: 404, body: { error: 'Not found' } };
  }

  function localInterceptTarget(input) {
    try {
      const raw = typeof input === 'string' ? input : (input && input.url) ? input.url : String(input);
      const u = new URL(raw, global.location.href);
      return (u.origin === global.location.origin && u.pathname.startsWith('/api/')) ? u : null;
    } catch (e) { return null; }
  }

  if (origFetch) {
    global.fetch = function (input, init) {
      if (!isStandalone()) return origFetch(input, init);
      const u = localInterceptTarget(input);
      if (!u) return origFetch(input, init);
      if (u.pathname === '/api/threats') return origFetch('./data/threats.json', init);
      const method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      return route(u, method).then((r) => new Response(JSON.stringify(r.body), {
        status: r.status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      })).catch((e) => new Response(JSON.stringify({ error: String((e && e.message) || e).slice(0, 160), items: [], sources: [] }), {
        status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8' }
      }));
    };
  }

  global.FiribStopStandalone = { VERSION, FEEDS, active: isStandalone, route, loadNews, parseFeed, httpGetText, decodeBytes };
})(typeof window !== 'undefined' ? window : globalThis);
