'use strict';
// Self-contained: collects aggregated data from open sources into data/live-stats.json.
// Secrets stay in GitHub Secrets and never reach the app.
const fs = require('node:fs');
const path = require('node:path');

const OUT = path.join(__dirname, '..', 'data', 'live-stats.json');
const safe = (e) => String((e && e.message) || e).slice(0, 160);
const getJson = async (url, headers, ms = 15000) => {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(ms) });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { throw new Error('Не JSON, HTTP ' + res.status); }
  if (!res.ok || body.success === false) {
    const m = body && body.errors && body.errors[0] && body.errors[0].message;
    throw new Error('HTTP ' + res.status + (m ? ': ' + m : ''));
  }
  return body;
};

function rows(body, kind) {
  const result = (body && body.result) || {};
  const all = Object.keys(result).filter((k) => /^top_\d+$/.test(k) && Array.isArray(result[k])).flatMap((k) => result[k]);
  const code = kind === 'origin' ? ['originCountryAlpha2', 'originLocationAlpha2'] : ['targetCountryAlpha2', 'targetLocationAlpha2'];
  const name = kind === 'origin' ? ['originCountryName', 'originLocationName'] : ['targetCountryName', 'targetLocationName'];
  return all.map((r) => {
    const c = code.map((k) => r[k]).find((v) => typeof v === 'string' && /^[A-Za-z]{2}$/.test(v));
    const n = name.map((k) => r[k]).find((v) => typeof v === 'string');
    const v = Number(r.value);
    if (!c || !Number.isFinite(v)) return null;
    return { code: c.toUpperCase(), name: String(n || c).slice(0, 60), value: Number(v.toFixed(2)) };
  }).filter(Boolean).sort((a, b) => b.value - a.value).slice(0, 15);
}

async function radar() {
  const token = process.env.CLOUDFLARE_RADAR_API_TOKEN;
  if (!token) return { ok: false, error: 'Нет токена CLOUDFLARE_RADAR_API_TOKEN' };
  const h = { Authorization: 'Bearer ' + token, Accept: 'application/json' };
  const base = 'https://api.cloudflare.com/client/v4/radar';
  const [o, t] = await Promise.allSettled([
    getJson(base + '/attacks/layer3/top/locations/origin?dateRange=1d&limit=15&format=JSON', h),
    getJson(base + '/attacks/layer3/top/locations/target?dateRange=1d&limit=15&format=JSON', h)
  ]);
  const origins = o.status === 'fulfilled' ? rows(o.value, 'origin') : [];
  const targets = t.status === 'fulfilled' ? rows(t.value, 'target') : [];
  if (!origins.length && !targets.length) return { ok: false, error: [o, t].filter((x) => x.status === 'rejected').map((x) => safe(x.reason)).join(' | ') || 'Radar вернул пустой ответ' };
  return { ok: true, period: '24h', origins: origins.slice(0, 10), targets: targets.slice(0, 10), uzbekistan: { asTarget: targets.find((x) => x.code === 'UZ') || null, asOrigin: origins.find((x) => x.code === 'UZ') || null } };
}

async function feodo() {
  const res = await fetch('https://feodotracker.abuse.ch/downloads/ipblocklist.json', { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('Feodo HTTP ' + res.status);
  const list = await res.json();
  if (!Array.isArray(list)) throw new Error('Feodo: неожиданный формат');
  const online = list.filter((x) => String(x.status).toLowerCase() === 'online');
  const count = (arr, key, limit = 6) => Object.entries(arr.reduce((m, x) => {
    const k = String(x[key] || '—').trim();
    m[k] = (m[k] || 0) + 1;
    return m;
  }, {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit).map(([name, n]) => ({ name, count: n }));
  // Use only active records. Country values in Feodo Tracker are ISO country codes.
  const countryCounts = online.reduce((m, x) => {
    const country = String(x.country || '').trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(country)) return m;
    m[country] = (m[country] || 0) + 1;
    return m;
  }, {});
  const byCountry = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 15)
    .map(([name, n]) => ({ name, count: n }));
  const uzOnline = online.filter((x) => x.country === 'UZ').length;
  return {
    ok: true,
    total: list.length,
    online: online.length,
    uzOnline,
    byMalware: count(online, 'malware'),
    byCountry
  };
}

async function uzcert() {
  const res = await fetch('https://uzcert.uz/ru/feed', { headers: { 'User-Agent': 'Mozilla/5.0 FiribStop-stats' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('UZCERT HTTP ' + res.status);
  const xml = await res.text();
  const clean = (s) => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  const tag = (b, n) => { const m = b.match(new RegExp('<' + n + '[^>]*>([\\s\\S]*?)</' + n + '>', 'i')); return m ? clean(m[1]) : ''; };
  const items = (xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []).map((b) => {
    const url = tag(b, 'link');
    const d = Date.parse(tag(b, 'pubDate'));
    return { title: tag(b, 'title'), url: /^https?:\/\//.test(url) ? url : '', date: Number.isFinite(d) ? new Date(d).toISOString() : null };
  }).filter((i) => i.title && i.url).slice(0, 6);
  return { ok: items.length > 0, items, error: items.length ? undefined : 'Лента UZCERT пуста' };
}

async function cisaKev() {
  const url = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'FiribStop-UZ-OpenData/1.0', Accept: 'application/json' },
    signal: AbortSignal.timeout(20000)
  });
  if (!res.ok) throw new Error('CISA KEV HTTP ' + res.status);
  const body = await res.json();
  if (!body || !Array.isArray(body.vulnerabilities)) throw new Error('CISA KEV: неожиданный формат');

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start30 = new Date(today.getTime() - 29 * 86400000);
  const start7 = new Date(today.getTime() - 6 * 86400000);
  const isoDay = (date) => date.toISOString().slice(0, 10);
  const daily = new Map();
  for (let i = 0; i < 30; i++) {
    const date = new Date(start30.getTime() + i * 86400000);
    daily.set(isoDay(date), 0);
  }

  const recent30 = [];
  let added7 = 0;
  for (const item of body.vulnerabilities) {
    if (!item || typeof item.dateAdded !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.dateAdded)) continue;
    const date = new Date(item.dateAdded + 'T00:00:00Z');
    if (!Number.isFinite(date.getTime()) || date < start30 || date > today) continue;
    recent30.push(item);
    daily.set(item.dateAdded, (daily.get(item.dateAdded) || 0) + 1);
    if (date >= start7) added7++;
  }
  const vendors = Object.entries(recent30.reduce((acc, item) => {
    const name = String(item.vendorProject || 'Unknown').trim().slice(0, 80);
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8)
    .map(([name, count]) => ({ name, count }));
  const byDay = Array.from(daily, ([date, count]) => ({ date, count }));
  const newestDate = body.vulnerabilities.map(x => String(x && x.dateAdded || '')).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x)).sort().pop() || null;
  return {
    ok: true,
    fetchedAt: now.toISOString(),
    catalogVersion: String(body.catalogVersion || ''),
    dateReleased: String(body.dateReleased || ''),
    newestDateAdded: newestDate,
    totalKnown: body.vulnerabilities.length,
    addedLast7Days: added7,
    addedLast30Days: recent30.length,
    byDay,
    topVendors30Days: vendors,
    source: url
  };
}

(async () => {
  const run = async (fn) => { try { return await fn(); } catch (e) { return { ok: false, error: safe(e) }; } };
  const [r, f, u, k] = await Promise.all([run(radar), run(feodo), run(uzcert), run(cisaKev)]);
  const out = { generatedAt: new Date().toISOString(), cloudflareRadar: r, feodoTracker: f, uzcert: u, cisaKev: k };
  console.log('radar:', r.ok ? 'ok' : r.error, '| feodo:', f.ok ? 'ok' : f.error, '| uzcert:', u.ok ? 'ok' : u.error, '| CISA KEV:', k.ok ? 'ok (' + k.addedLast30Days + ' added in 30d)' : k.error);
  if (![r, f, u, k].some((x) => x.ok)) { console.error('Все источники недоступны'); process.exit(1); }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
})();
