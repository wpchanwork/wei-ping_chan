# AI Guide — Adding a Blog Post

Read this first. It is everything needed to add a bilingual (EN default / 中文) post in the existing style. Do not redesign anything; only add content.

## How the blog works (30-second version)

- Static site on GitHub Pages. No build step. Tailwind 2 via CDN + `style.css`.
- `blog-posts.js` is the **registry**. The home page (latest post), `blog.html` (list), and each post page all read it.
- Each post is one HTML file: `blog/<slug>.html`. It contains **both languages**; `<html data-reading="en|zh">` + `[data-lang]` attributes decide what is shown.
- All behaviour (language switch, TOC, numbering, animations, share buttons, reading time) is in shared files. **A new post needs no JS or CSS.**
  - `blog/blog-post.js`, `blog/blog-post.css` — article page
  - `share.js`, `share.css` — share buttons (Copy link, X, LinkedIn, Facebook, Threads, LINE)
  - `holo.js`, `holo.css` — foil effect on cards in `blog.html` only

## Steps (do exactly these 4)

1. **Copy** the newest file in `blog/` (e.g. `what-if-research-and-learning-no-longer-revolve-around-universities.html`) to `blog/<new-slug>.html`.
   - slug: lowercase English title, hyphenated.
2. **Edit the copy** — only these parts:
   - `<head>`: `<title>`, `description`, `canonical`, all `og:*` / `twitter:*` URLs, titles and image, `article:published_time`.
   - Hero: both `<img class="hero-img …">` `src` (same image twice) + `object-position`; both `<h1 class="post-title">` (en + zh); both `<p class="post-excerpt">`; `<time datetime>`.
   - The two `<article class="reading-card prose-post">` bodies (EN `lang="en" data-lang="en"`, 中文 `lang="zh-Hant" data-lang="zh"`). Replace their contents using the blocks below.
   - Last line: `<script src="blog-post.js" data-slug="<new-slug>"></script>`.
   - Leave nav, rail, share panel, author card, "next" section and footer untouched.
3. **Register** the post at the **top** of `window.BLOG_POSTS` in `blog-posts.js` (newest first). Add any new tag to `BLOG_TAG_ZH`.
   ```js
   {
     slug: '<new-slug>',
     url: 'blog/<new-slug>.html',
     date: 'YYYY-MM-DD',
     cover: 'imgs/web/<image>.jpg',
     coverPosition: '50% 40%',          // focal point; same value as the hero object-position
     tags: ['Education', 'AI'],
     title:   { en: '…', zh: '…' },
     excerpt: { en: '…', zh: '…' }      // 1–2 sentences
   },
   ```
4. **Sitemap**: add a `<url>` for the new page in `sitemap.xml`. Then commit + push to `main` (GitHub Pages deploys automatically).

Post number ("No. 002"), reading time, date format, TOC, section numbers, "More posts" cards and the home page card are all generated automatically.

## Content blocks (use inside each `<article>`)

| Block | Markup | Use for |
|---|---|---|
| Lead paragraph | `<p class="lead">…</p>` | First paragraph only (gets drop cap in EN) |
| Paragraph | `<p>…</p>` — inline `<strong>`, `<em>`, `<a href target="_blank" rel="noopener noreferrer">` OK | Body text |
| Section heading | `<h2 id="en-xxx">…</h2>` / `<h2 id="zh-xxx">…</h2>` | Sections. **IDs must be unique and prefixed `en-` / `zh-`**. Numbering + TOC are automatic. No `<h3>` styling exists — avoid. |
| Key sentence | `<p class="key"><strong>…</strong></p>` (`key key--amber` for variety) | Standalone bold thesis lines. Highlighter animates in. Use ~1 per section. |
| Pull quote | `<div class="pull"><p>…</p></div>` | 2–3 memorable closing lines per post, plain text only |
| From → To | `<div class="contrast"><div class="contrast-item"><small>From</small>…</div><div class="contrast-arrow" aria-hidden="true">→</div><div class="contrast-item contrast-item--to"><small>To</small>…</div></div>` | Contrasting two ideas (zh labels: 過去 / 未來) |
| Step flow | see existing post (`<div class="flow">` with `.flow-step`, last step `.flow-step--last`, `<p class="flow-caption">`) | Short sequences, 3–5 steps |
| Line breaks in a list-like paragraph | `<p>Line one.<br>Line two.</p>` | Short rhythmic lists |
| Further reading | `<hr class="post-divider">` + `<h2 id="en-reading">Further Reading</h2>` + `<div class="reading-list">` with `<a class="reading-link">` items (copy from existing post) | End of post |
| End mark | `<div class="end-mark" aria-hidden="true"></div>` | Always last element in each article |

Rules:
- Both articles should have the **same sequence of blocks** (same number of `h2`), so the TOC matches across languages.
- Use the author's text verbatim. Only choose which lines become `key` / `pull` / `h2`. If one language is missing, ask — do not translate silently.
- In the 中文 article, link to the 中文 version of external pages when one exists.
- Escape `&` as `&amp;` in HTML.

## Cover image

- Put the file in `imgs/web/`, JPEG, ~2000px wide, < 500 KB (re-save at quality ~84 if larger).
- The hero is a wide crop with the title over the **bottom-left**; a dark gradient covers the bottom. Choose photos whose subject sits in the upper/middle area, and set `object-position` / `coverPosition` to the subject (e.g. `42% 30%`).
- The same image is used for the list card and home page card.

## Quick self-check before committing

- Serve locally (`python -m http.server 8765`) and open `blog/<new-slug>.html`, `?lang=zh`, `blog.html`, `index.html#blog`.
- Console has no errors; EN/中文 toggle switches title, body, TOC; no horizontal scroll at 375px width.
