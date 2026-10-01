# AI Guide: Adding a Blog Post

Read this first. It covers everything needed to add a bilingual (EN default, 中文 toggle) blog post in the existing style. Do not redesign anything; only add content.

## How the blog works

- Static site on GitHub Pages (`https://wpchanwork.github.io/wei-ping_chan/`). No build step. Tailwind 2 via CDN plus `style.css`.
- `blog-posts.js` is the **registry**. The home page (latest post card), `blog.html` (list), and every post page read it.
- Each post is one HTML file, `blog/<slug>.html`, containing **both languages**. `<html data-reading="en|zh">` plus `[data-lang="en|zh"]` attributes decide what is shown.
- All behaviour lives in shared files, so **a new post needs no new JS or CSS**:
  - `blog/blog-post.js`, `blog/blog-post.css`: article page (language switch, TOC, section numbers, animations, reading time, inline figures, "More posts")
  - `share.js`, `share.css`: share buttons (Copy link, X, LinkedIn, Facebook, Threads, LINE)
  - `holo.js`, `holo.css`: pointer tilt on cards in `blog.html` (foil and glare layers exist but are intentionally not used)

## Steps (do exactly these 4)

1. **Copy** the newest file in `blog/` to `blog/<new-slug>.html`. Slug = lowercase English title, words joined by hyphens.
2. **Edit the copy.** Change only these parts:
   - `<head>`: `<title>` (format `English Title | Wei-Ping Chan`), `description`, `canonical`, every `og:*` and `twitter:*` value (URLs and image must be absolute `https://wpchanwork.github.io/wei-ping_chan/...`), `article:published_time`.
   - Hero: both `<img class="hero-img ...">` (same `src` twice, same `object-position`); both `<h1 class="post-title" ... data-split>` (EN and 中文, keep `data-split`); both `<p class="post-excerpt">`; `<time datetime="YYYY-MM-DD">`.
   - The two `<article class="reading-card prose-post">` bodies (EN: `lang="en" data-lang="en"`, 中文: `lang="zh-Hant" data-lang="zh"`). Replace their contents using the blocks below.
   - Last script tag: `<script src="blog-post.js" data-slug="<new-slug>"></script>`.
   - Leave everything else (nav, TOC rail, share panel, author card, "next" section, footer) untouched.
3. **Register** the post at the **top** of `window.BLOG_POSTS` in `blog-posts.js` (newest first). Title and excerpt must match the hero text exactly; the 中文 browser tab title is built from this entry. Add any new tag to `BLOG_TAG_ZH`.
   ```js
   {
     slug: '<new-slug>',
     url: 'blog/<new-slug>.html',
     date: 'YYYY-MM-DD',
     cover: 'imgs/web/<image>.jpg',
     coverPosition: '50% 40%',          // focal point, same value as the hero object-position
     tags: ['Education', 'AI'],
     title:   { en: '...', zh: '...' },
     excerpt: { en: '...', zh: '...' }  // 1 to 2 sentences
   },
   ```
4. **Sitemap and publish**: add a `<url>` for the new page in `sitemap.xml`, then commit and push to `main`. GitHub Pages deploys in 1 to 3 minutes.

Generated automatically, do not hand-write: post number ("No. 002"), reading time, localized date, TOC, section numbers, "More posts" cards, the home page card, the list card.

## Content blocks (inside each `<article>`)

| Block | Markup | Use for |
|---|---|---|
| Lead paragraph | `<p class="lead">...</p>` | First paragraph only (EN gets a drop cap) |
| Paragraph | `<p>...</p>`; inline `<strong>`, `<em>`, `<a href="..." target="_blank" rel="noopener noreferrer">` are fine | Body text |
| Section heading | `<h2 id="en-xxx">...</h2>` / `<h2 id="zh-xxx">...</h2>` | Sections. IDs must be unique and prefixed `en-` / `zh-`. Numbering and TOC are automatic. There is no `<h3>` style, so do not use `<h3>`. |
| Key sentence | `<p class="key"><strong>...</strong></p>`, or `class="key key--amber"` for variety | Standalone thesis lines. A highlighter animates in. About 1 per section. |
| Pull quote | `<div class="pull"><p>...</p></div>` | 2 to 3 memorable lines per post, plain text only |
| From / To | `<div class="contrast"><div class="contrast-item"><small>From</small>...</div><div class="contrast-arrow" aria-hidden="true">→</div><div class="contrast-item contrast-item--to"><small>To</small>...</div></div>` | Two contrasting ideas (中文 labels: 過去 / 未來) |
| Step flow | `<div class="flow" role="img" aria-label="A, then B, then C"><div class="flow-steps"><span class="flow-step"><b>01</b>A</span><span class="flow-arrow">→</span><span class="flow-step flow-step--last"><b>02</b>B</span></div><p class="flow-caption">...</p></div>` | Short sequences of 3 to 5 steps; last step gets `flow-step--last` |
| Inline photo | `<figure class="post-figure"><img src="../imgs/web/<file>.jpg" alt="..." width="W" height="H" loading="lazy"><figcaption>...</figcaption></figure>` | Photos inside the text. Same file in both articles, alt and caption translated. Frame, "Fig. / 圖" label and reveal are automatic. 1 to 3 per post. |
| Short lines | `<p>Line one.<br>Line two.</p>` | Rhythmic, list-like passages |
| Further reading | `<hr class="post-divider">`, then `<h2 id="en-reading">Further Reading</h2>` (中文 `延伸閱讀`), then `<div class="reading-list">` containing `<a class="reading-link" href="..." target="_blank" rel="noopener noreferrer"><span><span class="rl-src">Source</span><span class="rl-title">Title</span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg></a>` items | End of post |
| End mark | `<div class="end-mark" aria-hidden="true"></div>` | Always the last element in each article |

Structure rules:
- Both articles must have the **same sequence of blocks** (same number of `h2`), so the TOC matches in both languages.
- In the 中文 article, link to the 中文 version of an external page when one exists.
- Escape `&` as `&amp;` in HTML.

## Writing rules (for any text you write)

These apply to captions, alt text, excerpts, meta descriptions, labels and any other copy you create. They do **not** apply to the author's article text.

- **Avoid dashes** (`—`, `——`, `--`). Use commas, periods, colons or a new sentence instead. Example: "Nature enthusiasts excavating fossils in the field. Here, learning begins with a question in the ground." not "...in the field — learning begins...". In page titles use `|` as the separator.
- Call it a **"post" / "blog post"**, never an "essay". 中文 uses 文章.
- Keep the tone plain and personal; this is a personal site, not a journal.
- Use the author's text verbatim. Only decide which lines become `lead`, `key`, `pull` or `h2`. If one language is missing, ask; do not translate silently.
- Captions describe only what is known. Do not invent names, places, species or affiliations. Tie the caption to the post's argument in one sentence.

## Images

- Put files in `imgs/web/`, JPEG, about 2000 px wide, around 500 KB or less (re-save at quality 76 to 84 if larger).
- Cover: the hero is a wide crop with the title over the **bottom-left** and dark shading on the left and bottom. Prefer photos whose subject sits on the right or in the upper half. Set `object-position` and `coverPosition` to the subject (for example `42% 30%`). The same image is used for the list and home page cards.
- People with recognizable faces: confirm with the author that publishing is OK.

## Self-check before committing

- Serve locally with `python -m http.server 8765`, then open `blog/<new-slug>.html`, the same with `?lang=zh`, `blog.html`, and `index.html#blog`.
- No console errors. The EN / 中文 toggle switches title, body and TOC. No horizontal scroll at 375 px width.
- After deploying, check the live site in a **private / incognito window**. GitHub Pages lets browsers cache pages for up to 10 minutes, so a normal window may still show the old version.
