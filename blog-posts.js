/* ============================================================
   Blog post registry — shared by index.html, blog.html and
   every page in blog/.

   To publish a new article:
     1. Copy an existing file in blog/ and rename it to <slug>.html
     2. Replace the title, excerpt, cover and both language bodies
     3. Add an entry at the TOP of BLOG_POSTS below (newest first)

   Paths (cover, url) are relative to the site root; pages inside
   blog/ prefix them with "../" automatically.
   ============================================================ */

window.BLOG_POSTS = [
  {
    slug: 'what-if-research-and-learning-no-longer-revolve-around-universities',
    url: 'blog/what-if-research-and-learning-no-longer-revolve-around-universities.html',
    date: '2026-10-01',
    cover: 'imgs/web/blog-universities-cover.jpg',
    coverPosition: '42% 30%',
    tags: ['Education', 'AI', 'Research'],
    title: {
      en: 'What If Research and Learning No Longer Revolve Around Universities?',
      zh: '如果研究與學習不再以大學為中心'
    },
    excerpt: {
      en: 'A conversation about how companies acquire new capabilities led me to a bigger question: as AI, startups, and new forms of education spread research and learning beyond campus, what role is left for universities?',
      zh: '從一段關於企業如何取得新技術能力的對話出發：當 AI、新創與新型教育讓研究與學習逐漸走出校園，大學還會扮演什麼角色？'
    }
  }
];

/* Tag labels shown when the reader switches to Chinese. */
window.BLOG_TAG_ZH = {
  'Education': '教育',
  'AI': 'AI',
  'Research': '研究'
};

/* Shared helpers ------------------------------------------------ */
window.BlogLang = (function () {
  const KEY = 'wpc-blog-lang';
  const valid = l => l === 'en' || l === 'zh';
  return {
    // ?lang= in the URL wins, then the reader's last choice, then English.
    get() {
      const q = new URLSearchParams(location.search).get('lang');
      if (valid(q)) return q;
      try { const s = localStorage.getItem(KEY); if (valid(s)) return s; } catch (e) {}
      return 'en';
    },
    set(lang) {
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      const u = new URL(location.href);
      if (lang === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', lang);
      history.replaceState(null, '', u);
    },
    formatDate(iso, lang) {
      const d = new Date(iso + 'T00:00:00');
      return lang === 'zh'
        ? d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日'
        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    tag(t, lang) { return lang === 'zh' ? (window.BLOG_TAG_ZH[t] || t) : t; }
  };
})();
