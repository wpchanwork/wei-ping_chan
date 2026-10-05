/* ============================================================
   Site language switch (EN / 中文 / ES) — shared by index.html,
   projects.html and collaborators.html. See i18n.css.

   Each page also runs a tiny inline script in <head> that sets
   <html data-reading> before first paint (same as blog.html).

   The choice is stored under the blog's key, so a reader who picks
   中文 here also lands on the 中文 blog. The blog only has en/zh and
   falls back to English when the stored value is "es".

   Static text:   <span data-lang="en">…</span><span data-lang="zh">…</span><span data-lang="es">…</span>
   Generated text: SiteLang.t({ en, zh, es }) returns the same three spans.
   Page title:    <title data-zh="…" data-es="…">English title</title>
   ============================================================ */
window.SiteLang = (function () {
  const KEY = 'wpc-blog-lang';
  const LANGS = ['en', 'zh', 'es'];
  const HTML_LANG = { en: 'en', zh: 'zh-Hant', es: 'es' };
  const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const root = document.documentElement;
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const valid = l => LANGS.includes(l);
  const listeners = [];
  let titleEl, titleEn;

  function current() { return valid(root.getAttribute('data-reading')) ? root.getAttribute('data-reading') : 'en'; }

  function remember(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} }

  // ?lang= in the URL wins (and is remembered, so links to the other pages keep it),
  // then the reader's last choice, then English.
  function initial() {
    const q = new URLSearchParams(location.search).get('lang');
    if (valid(q)) { remember(q); return q; }
    try { const s = localStorage.getItem(KEY); if (valid(s)) return s; } catch (e) {}
    return 'en';
  }

  function apply(lang, persist) {
    root.setAttribute('data-reading', lang);
    root.lang = HTML_LANG[lang];
    if (titleEl) document.title = lang === 'en' ? titleEn : (titleEl.dataset[lang] || titleEn);
    document.querySelectorAll('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
    if (persist) {
      remember(lang);
      const u = new URL(location.href);
      if (lang === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', lang);
      history.replaceState(null, '', u);
    }
    listeners.forEach(fn => fn(lang));
  }

  function init() {
    titleEl = document.querySelector('title');
    titleEn = titleEl ? titleEl.textContent : document.title;
    document.querySelectorAll('[data-set-lang]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.setLang !== current()) apply(b.dataset.setLang, true);
    }));
    apply(initial(), false);
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
