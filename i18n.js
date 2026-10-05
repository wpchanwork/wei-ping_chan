/* ============================================================
   Site language switch (EN / 中文 / ES) — shared by index.html,
   projects.html and collaborators.html. See i18n.css.

   Load it in <head> (not deferred): it sets <html data-reading>
   before first paint.

   Which language a visitor sees, first match wins:
     1. ?lang= in the URL (kept for the rest of this tab, not saved)
     2. the reader's own choice from clicking the switch (localStorage,
        under the blog's key, so 中文 here also means 中文 on the blog;
        the blog only has en/zh and shows English for "es")
     3. their region, from an IP lookup cached for 30 days:
        Taiwan / China / Hong Kong / Macau → 中文, Spain / Latin America → ES
     4. the browser language (zh* → 中文, es* → ES), when the lookup fails
     5. English
   On a first visit the page stays hidden until the lookup answers
   (at most GEO_WAIT ms), so the language never visibly flips.

   Static text:   <span data-lang="en">…</span><span data-lang="zh">…</span><span data-lang="es">…</span>
   Generated text: SiteLang.t({ en, zh, es }) returns the same three spans.
   Page title:    <title data-zh="…" data-es="…">English title</title>
   ============================================================ */
window.SiteLang = (function () {
  const KEY = 'wpc-blog-lang';          // manual choice, shared with the blog
  const LINK_KEY = 'wpc-lang-link';     // ?lang= from a link, this tab only
  const GEO_KEY = 'wpc-geo-lang';       // { lang, t } from the IP lookup
  const GEO_URL = 'https://ipapi.co/country/';  // HTTPS, plain-text country code, free tier
  const GEO_TTL = 30 * 864e5, GEO_RETRY = 864e5, GEO_WAIT = 800;
  const REGION = {
    zh: ['TW', 'CN', 'HK', 'MO'],
    es: ['ES', 'MX', 'GT', 'SV', 'HN', 'NI', 'CR', 'PA', 'CU', 'DO', 'PR', 'CO', 'VE', 'EC', 'PE', 'BO', 'CL', 'AR', 'UY', 'PY', 'BR']
  };
  const LANGS = ['en', 'zh', 'es'];
  const HTML_LANG = { en: 'en', zh: 'zh-Hant', es: 'es' };
  const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const root = document.documentElement;
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const valid = l => LANGS.includes(l);
  const listeners = [];
  let titleEl, titleEn;

  function current() { return valid(root.getAttribute('data-reading')) ? root.getAttribute('data-reading') : 'en'; }

  const store = (s, k, v) => { try { if (v === undefined) return s.getItem(k); if (v === null) s.removeItem(k); else s.setItem(k, v); } catch (e) {} };

  function fromBrowser() {
    const l = String((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    return l.startsWith('zh') ? 'zh' : l.startsWith('es') ? 'es' : 'en';
  }
  function fromCountry(cc) {
    cc = String(cc || '').trim().toUpperCase();
    return REGION.zh.includes(cc) ? 'zh' : REGION.es.includes(cc) ? 'es' : 'en';
  }
  function cachedGeo() {
    try {
      const g = JSON.parse(store(localStorage, GEO_KEY) || 'null');
      if (g && valid(g.lang) && Date.now() < g.t) return g.lang;
    } catch (e) {}
    return null;
  }

  // Steps 1–3 and the cached step 4; null means "ask the IP lookup".
  function known() {
    const q = new URLSearchParams(location.search).get('lang');
    if (valid(q)) { store(sessionStorage, LINK_KEY, q); return q; }
    const link = store(sessionStorage, LINK_KEY);
    if (valid(link)) return link;
    const own = store(localStorage, KEY);
    if (valid(own)) return own;
    return cachedGeo();
  }

  let ready = false;
  function detect() {
    root.classList.add('lang-pending');
    let done = false;
    const finish = (lang, ttl) => {
      if (done) return; done = true;
      if (ttl) store(localStorage, GEO_KEY, JSON.stringify({ lang, t: Date.now() + ttl }));
      // A click on the switch while waiting wins over the lookup.
      if (!valid(store(localStorage, KEY)) && lang !== current()) ready ? apply(lang, false) : root.setAttribute('data-reading', lang);
      root.classList.remove('lang-pending');
    };
    // Shown if the lookup is slow or blocked; not cached, so a late answer still counts next time.
    setTimeout(() => finish(fromBrowser()), GEO_WAIT);
    const ctl = window.AbortController ? new AbortController() : null;
    if (ctl) setTimeout(() => ctl.abort(), 5000);
    fetch(GEO_URL, { signal: ctl && ctl.signal, credentials: 'omit' })
      .then(r => r.ok ? r.text() : Promise.reject(r.status))
      .then(cc => {
        if (!/^[A-Za-z]{2}$/.test(cc.trim())) throw cc;
        const lang = fromCountry(cc);
        if (done) store(localStorage, GEO_KEY, JSON.stringify({ lang, t: Date.now() + GEO_TTL })); else finish(lang, GEO_TTL);
      })
      // Lookup failed (offline, rate limit, blocker): use the browser language for a day, then try again.
      .catch(() => { const lang = fromBrowser(); done ? store(localStorage, GEO_KEY, JSON.stringify({ lang, t: Date.now() + GEO_RETRY })) : finish(lang, GEO_RETRY); });
  }

  // Runs now, in <head>, so the first paint is already in the right language.
  const first = known();
  root.setAttribute('data-reading', first || fromBrowser());
  if (!first) detect();

  // The blog only has en/zh and reads ?lang=, so pass the active language along (Spanish → English).
  function syncBlogLinks(lang) {
    document.querySelectorAll('a[href^="blog"]').forEach(a => {
      if (!a.dataset.blogHref) a.dataset.blogHref = a.getAttribute('href');
      const [path, hash] = a.dataset.blogHref.split('#');
      a.setAttribute('href', path + '?lang=' + (lang === 'zh' ? 'zh' : 'en') + (hash ? '#' + hash : ''));
    });
  }

  function apply(lang, persist) {
    root.setAttribute('data-reading', lang);
    root.lang = HTML_LANG[lang];
    if (titleEl) document.title = lang === 'en' ? titleEn : (titleEl.dataset[lang] || titleEn);
    document.querySelectorAll('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
    syncBlogLinks(lang);
    if (persist) {
      store(localStorage, KEY, lang);
      store(sessionStorage, LINK_KEY, null);
      const u = new URL(location.href);
      if (lang === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', lang);
      history.replaceState(null, '', u);
    }
    listeners.forEach(fn => fn(lang));
  }

  function init() {
    titleEl = document.querySelector('title');
    titleEn = titleEl ? titleEl.textContent : document.title;
    // Every click is saved, even on the active language, so it counts as the reader's own choice.
    document.querySelectorAll('[data-set-lang]').forEach(b => b.addEventListener('click', () => {
      apply(b.dataset.setLang, true);
      root.classList.remove('lang-pending');
    }));
    ready = true;
    apply(current(), false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  return {
    get: current,
    onChange(fn) { listeners.push(fn); },
    // Pick the string for the active language from { en, zh, es } (falls back to English).
    pick(map, lang) { lang = lang || current(); return map == null ? '' : typeof map === 'string' ? map : (map[lang] ?? map.en); },
    // Render { en, zh, es } as three language spans; CSS shows the active one.
    // Values are escaped unless html is true.
    t(map, html) {
      if (map == null) return '';
      if (typeof map === 'string') return html ? map : esc(map);
      return LANGS.map(l => {
        const v = map[l] ?? map.en;
        return '<span data-lang="' + l + '" lang="' + HTML_LANG[l] + '">' + (html ? v : esc(v)) + '</span>';
      }).join('');
    },
    // Dates: "YYYY-MM-DD" or "YYYY-MM" → "April 9, 2026" / "2026 年 4 月 9 日" / "9 de abril de 2026".
    date(iso, lang) {
      const [y, m, d] = String(iso).split('-').map(Number);
      if (lang === 'zh') return y + ' 年 ' + m + ' 月' + (d ? ' ' + d + ' 日' : '');
      if (lang === 'es') return (d ? d + ' de ' : '') + MONTHS_ES[m - 1] + ' de ' + y;
      const opts = d ? { year: 'numeric', month: 'long', day: 'numeric' } : { year: 'numeric', month: 'long' };
      return new Date(y, m - 1, d || 1).toLocaleDateString('en-US', opts);
    },
    esc
  };
})();
