/* ============================================================
   Share kit — copy link + social share buttons, shared by the
   blog list and every article page. Styles live in share.css.

   Usage
     <div data-share></div>                 full row with labels
     <div data-share data-compact></div>    icon-only row
     ShareKit.render(el, { url, title })    render into any element
     ShareKit.popover(button, { url, title }) small menu (list cards)

   Without data-url/data-title the page's canonical URL and the
   visible <h1 class="post-title"> are used. Labels follow
   <html data-reading="en|zh"> through [data-lang] spans.
   ============================================================ */
(function () {
  const enc = encodeURIComponent;
  const bi = (en, zh) => '<span data-lang="en">' + en + '</span><span data-lang="zh">' + zh + '</span>';

  const ICONS = {
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>',
    threads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>',
    line: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863a.631.631 0 0 1 0 1.261H17.61v1.125h1.755a.63.63 0 1 1 0 1.259h-2.386a.631.631 0 0 1-.627-.629V8.108c0-.345.282-.63.63-.63h2.386a.63.63 0 0 1-.003 1.26H17.61v1.125h1.755zm-3.855 3.016a.63.63 0 0 1-.631.627.618.618 0 0 1-.51-.25l-2.443-3.317v2.94a.63.63 0 0 1-1.257 0V8.108a.627.627 0 0 1 .624-.628c.195 0 .375.105.495.255l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0a.632.632 0 0 1-.631.629.631.631 0 0 1-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917a.634.634 0 0 1-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756a.63.63 0 0 1 0 1.259M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>'
  };

  const NETWORKS = [
    { id: 'x', name: 'X', url: (u, t) => 'https://twitter.com/intent/tweet?url=' + enc(u) + '&text=' + enc(t) },
    { id: 'linkedin', name: 'LinkedIn', url: u => 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(u) },
    { id: 'facebook', name: 'Facebook', url: u => 'https://www.facebook.com/sharer/sharer.php?u=' + enc(u) },
    { id: 'threads', name: 'Threads', url: (u, t) => 'https://www.threads.net/intent/post?text=' + enc(t + ' ' + u) },
    { id: 'line', name: 'LINE', url: u => 'https://social-plugins.line.me/lineit/share?url=' + enc(u) }
  ];

  function defaults() {
    const canon = document.querySelector('link[rel="canonical"]');
    const lang = document.documentElement.getAttribute('data-reading') || 'en';
    const h1 = document.querySelector('.post-title[data-lang="' + lang + '"]') || document.querySelector('h1');
    return { url: canon ? canon.href : location.href, title: h1 ? h1.textContent.trim() : document.title };
  }

  // Readers who switched to 中文 share the Chinese version.
  function withLang(url) {
    const lang = document.documentElement.getAttribute('data-reading');
    if (lang !== 'zh') return url;
    const u = new URL(url, location.href); u.searchParams.set('lang', 'zh'); return u.href;
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
      ta.remove(); return ok;
    }
  }

  let toastEl, toastTimer;
  function toast(html) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'share-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = ICONS.check + '<span>' + html + '</span>';
    toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  function buttonsHTML(compact) {
    const label = (en, zh) => compact ? '' : '<span class="sk-text">' + bi(en, zh) + '</span>';
    let h = '<button type="button" class="sk-btn sk-copy" data-act="copy" title="Copy link" aria-label="Copy link">' +
      '<span class="sk-ico">' + ICONS.link + ICONS.check + '</span>' + label('Copy link', '複製連結') + '</button>';
    NETWORKS.forEach(n => {
      h += '<a class="sk-btn sk-' + n.id + '" data-net="' + n.id + '" target="_blank" rel="noopener noreferrer" title="' + n.name + '" aria-label="Share on ' + n.name + '">' +
        '<span class="sk-ico">' + ICONS[n.id] + '</span>' + (compact ? '' : '<span class="sk-text">' + n.name + '</span>') + '</a>';
    });
    return h;
  }

  function wire(el, opts) {
    const get = () => {
      const d = defaults();
      return { url: withLang(opts.url || el.dataset.url || d.url), title: opts.title || el.dataset.title || d.title };
    };
    // Build share URLs at click time so they follow the current language.
    el.querySelectorAll('[data-net]').forEach(a => {
      const net = NETWORKS.find(n => n.id === a.dataset.net);
      const refresh = () => { const s = get(); a.href = net.url(s.url, s.title); };
      refresh();
      a.addEventListener('pointerdown', refresh);
      a.addEventListener('focus', refresh);
      a.addEventListener('click', () => { refresh(); if (opts.onDone) opts.onDone(); });
    });
    el.querySelectorAll('[data-act="copy"]').forEach(b => b.addEventListener('click', async () => {
      if (!(await copy(get().url))) return;
      b.classList.add('done'); setTimeout(() => b.classList.remove('done'), 1800);
      toast(bi('Link copied', '已複製連結'));
      if (opts.onDone) opts.onDone();
    }));
  }

  function render(el, opts) {
    opts = opts || {};
    const compact = 'compact' in el.dataset || opts.compact;
    el.classList.add('share-kit');
    if (compact) el.classList.add('share-kit--compact');
    el.innerHTML = buttonsHTML(compact);
    wire(el, opts);
  }

  // Small floating menu anchored to a button (used on list cards).
  let openPop = null;
  function closePop() { if (openPop) { openPop.el.remove(); openPop.btn.setAttribute('aria-expanded', 'false'); openPop = null; } }
  function popover(btn, opts) {
    if (openPop && openPop.btn === btn) { closePop(); return; }
    closePop();
    const el = document.createElement('div');
    el.className = 'share-pop';
    el.setAttribute('role', 'menu');
    el.innerHTML = '<p class="share-pop-title">' + bi('Share', '轉貼') + '</p><div></div>';
    document.body.appendChild(el);
    render(el.lastElementChild, Object.assign({}, opts, { compact: false, onDone: closePop }));
    const r = btn.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
    let left = Math.min(window.innerWidth - w - 12, Math.max(12, r.right - w));
    let top = r.bottom + 8; if (top + h > window.innerHeight - 12) top = r.top - h - 8;
    el.style.left = left + 'px'; el.style.top = (top + window.scrollY) + 'px';
    requestAnimationFrame(() => el.classList.add('show'));
    btn.setAttribute('aria-expanded', 'true');
    openPop = { el, btn };
  }
  document.addEventListener('click', e => { if (openPop && !openPop.el.contains(e.target) && !openPop.btn.contains(e.target)) closePop(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });
  window.addEventListener('resize', closePop);

  window.ShareKit = { render, popover, copy, toast };
  const auto = () => document.querySelectorAll('[data-share]').forEach(el => render(el, {}));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto); else auto();
})();
