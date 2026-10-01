/* ============================================================
   Article page controller — shared by every page in blog/.
   Include after ../blog-posts.js, ../holo.js and ../share.js:
     <script src="blog-post.js" data-slug="<slug>"></script>

   Handles: EN/中文 switching, title + pull-quote word animation,
   section numbering, scroll reveals, highlighter on key lines,
   TOC rail with progress, reading bar, hero parallax, and the
   "more posts" grid.
   ============================================================ */
(function () {
  const SLUG = document.currentScript.dataset.slug;
  const post = (window.BLOG_POSTS || []).find(p => p.slug === SLUG) || {};
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const langAttr = l => (l === 'zh' ? 'zh-Hant' : 'en');

  /* ---------- one-time enhancement of the markup ---------- */

  // Split text into spans for staggered animation (words in English, characters in Chinese).
  function split(el, cls) {
    const text = el.textContent.trim();
    const zh = /[一-鿿]/.test(text);
    const parts = zh ? Array.from(text) : text.split(/\s+/);
    el.setAttribute('aria-label', text);
    el.innerHTML = parts.map((w, i) => '<span class="' + cls + '" aria-hidden="true" style="--i:' + i + '">' + esc(w) + '</span>').join(zh ? '' : ' ');
  }
  $$('[data-split]').forEach(el => split(el, 'w'));

  $$('.prose-post').forEach(article => {
    article.querySelectorAll('h2').forEach((h, i) => {
      h.dataset.title = h.textContent.trim();
      h.insertAdjacentHTML('afterbegin', '<span class="h-idx" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>');
    });
    article.querySelectorAll('.key').forEach(k => { k.innerHTML = '<span class="mark">' + k.innerHTML + '</span>'; });
    article.querySelectorAll('.pull').forEach(pq => {
      const p = pq.querySelector('p');
      split(p, 'pw');
      pq.insertAdjacentHTML('afterbegin', '<span class="pull-mark" aria-hidden="true">“</span>');
    });
    article.querySelectorAll('.end-mark').forEach(m => {
      const c = ['#0d9488', '#14b8a6', '#d97706'];
      m.innerHTML = c.map((col, n) => '<i style="--c:' + col + ';--n:' + n + '"></i>').join('');
    });
    article.querySelectorAll('.post-figure > img').forEach(img => {
      const frame = document.createElement('div');
      frame.className = 'post-figure-frame';
      img.replaceWith(frame); frame.appendChild(img);
    });
    article.querySelectorAll('.contrast, .flow, .reading-link, .pull, .post-figure').forEach(el => el.classList.add('rv'));
  });

  // Reveal on scroll
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .15 });
  $$('.prose-post h2, .prose-post .key, .rv, .end-mark').forEach(el => reduced ? el.classList.add('in') : revealIO.observe(el));

  // Stagger the flow steps once revealed
  $$('.flow').forEach(f => f.querySelectorAll('.flow-step, .flow-arrow').forEach((s, i) => { s.style.transitionDelay = (i * 110) + 'ms'; }));

  // Elements used by the scroll handler (declared early: applyLang triggers it).
  const bar = $('#read-progress');
  const media = $('.essay-hero-media');
  const hero = $('#essay-hero');
  const fill = $('#toc-fill');
  const num = $('#rail-num');
  let lastIdx = -1, ticking = false;

  /* ---------- language-dependent rendering ---------- */

  function readingTime(lang) {
    const text = $('.prose-post[data-lang="' + lang + '"]').textContent;
    const mins = lang === 'zh'
      ? Math.ceil((text.match(/[一-鿿]/g) || []).length / 400)
      : Math.ceil(text.trim().split(/\s+/).length / 230);
    return lang === 'zh' ? '約 ' + mins + ' 分鐘閱讀' : mins + ' min read';
  }

  function renderSpecimenRow(lang) {
    const all = window.BLOG_POSTS || [];
    const no = String(all.length - all.indexOf(post)).padStart(3, '0');
    const tags = (post.tags || []).map(t => '<span class="tag">' + esc(BlogLang.tag(t, lang)) + '</span>').join('<span class="sep"></span>');
    $('#specimen-row').innerHTML = '<span class="no">No. ' + no + '</span><span>' + (lang === 'zh' ? '文章' : 'Blog') + '</span><span class="sep"></span>' + tags;
  }

  let tocHeads = [], tocLinks = [];
  function buildToc(lang) {
    tocHeads = $$('.prose-post[data-lang="' + lang + '"] h2[id]');
    $('#toc-list').innerHTML = tocHeads.map(h =>
      '<li><a href="#' + h.id + '" lang="' + langAttr(lang) + '">' + esc(h.dataset.title) + '</a></li>').join('');
    tocLinks = $$('#toc-list a');
    $('#rail-total').textContent = '/ ' + String(tocHeads.length).padStart(2, '0');
    lastIdx = -2; // force the counter to refresh for the new language
    onScroll();
  }

  function renderMore(lang) {
    const others = (window.BLOG_POSTS || []).filter(p => p.slug !== SLUG).slice(0, 3);
    const grid = $('#more-grid');
    grid.style.display = others.length ? '' : 'none';
    const title = $('.next-title');
    if (!others.length) title.innerHTML = '<span lang="en" data-lang="en">Back to the blog</span><span lang="zh-Hant" data-lang="zh">回到文章列表</span>';
    grid.innerHTML = others.map(p =>
      '<a class="more-card" href="../' + esc(p.url) + (lang === 'zh' ? '?lang=zh' : '') + '">' +
        '<img src="../' + esc(p.cover) + '" alt="" loading="lazy" style="object-position:' + esc(p.coverPosition || 'center') + '">' +
        '<div class="more-card-body"><div class="more-card-date">' + esc(BlogLang.formatDate(p.date, lang)) + '</div>' +
        '<div class="more-card-title" lang="' + langAttr(lang) + '">' + esc(p.title[lang] || p.title.en) + '</div></div></a>'
    ).join('');
  }

  const TITLES = {
    en: (post.title && post.title.en) + ' — Wei-Ping Chan',
    zh: (post.title && post.title.zh) + '｜Wei-Ping Chan'
  };

  function applyLang(lang, persist) {
    root.setAttribute('data-reading', lang);
    root.lang = langAttr(lang);
    document.title = TITLES[lang];
    $$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
    if (post.date) $('#post-date').textContent = BlogLang.formatDate(post.date, lang);
    $('#read-time').textContent = readingTime(lang);
    const q = lang === 'zh' ? '?lang=zh' : '';
    $('#back-link').href = '../blog.html' + q;
    $('#all-posts-btn').href = '../blog.html' + q;
    renderSpecimenRow(lang);
    renderMore(lang);
    buildToc(lang);
    if (persist) BlogLang.set(lang);
  }

  const main = $('#essay-main');
  $$('[data-set-lang]').forEach(b => b.addEventListener('click', () => {
    const lang = b.dataset.setLang;
    if (lang === root.getAttribute('data-reading')) return;
    const bodyTop = $('.essay-body').getBoundingClientRect().top + window.scrollY;
    const inBody = window.scrollY > bodyTop - 80;
    main.classList.add('switching');
    setTimeout(() => {
      applyLang(lang, true);
      if (inBody) window.scrollTo({ top: bodyTop - 60 });
      requestAnimationFrame(() => main.classList.remove('switching'));
    }, reduced ? 0 : 220);
  }));
  applyLang(BlogLang.get(), false);

  /* ---------- scroll-linked effects ---------- */

  function onScroll() {
    const article = $('.prose-post[data-lang="' + root.getAttribute('data-reading') + '"]');
    if (!article) return;
    const r = article.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight * .35 - r.top) / r.height));
    bar.style.transform = 'scaleX(' + p + ')';
    fill.style.setProperty('--p', p.toFixed(4));

    if (!reduced && hero.getBoundingClientRect().bottom > 0) media.style.setProperty('--py', (window.scrollY * .3).toFixed(1) + 'px');

    let idx = -1;
    tocHeads.forEach((h, i) => { if (h.getBoundingClientRect().top < window.innerHeight * .3) idx = i; });
    if (idx !== lastIdx) {
      tocLinks.forEach((a, i) => a.classList.toggle('active', i === idx));
      const val = String(Math.max(idx + 1, 0)).padStart(2, '0');
      if (reduced) num.textContent = val;
      else { num.classList.add('tick'); setTimeout(() => { num.textContent = val; num.classList.remove('tick'); }, 180); }
      lastIdx = idx;
    }
  }
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
