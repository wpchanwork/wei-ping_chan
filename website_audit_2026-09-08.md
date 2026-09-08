# Wei-Ping Chan 個人網頁審查報告

**審查日期：** 2026-09-08  
**網址：** https://wpchanwork.github.io/wei-ping_chan/  
**Repo：** https://github.com/wpchanwork/wei-ping_chan  
**審查員：** research-director → editorial-reviewer → review-board-chair  
**tiers_used：** Mid  
**language：** traditional-chinese

---

## 一、現狀分析

### 1. SEO（搜尋引擎最佳化）

| 項目 | 狀態 | 評分 |
|---|---|---|
| `sitemap.xml` | ❌ 不存在 | 0/10 |
| `robots.txt` | ❌ 不存在 | 0/10 |
| `<meta description>` | ⚠️ 部分頁面有（home, index, projects, collaborations），但 blog.html 和 illustrations.html 缺少 | 5/10 |
| Open Graph tags | ❌ 全站零 OG tags（分享到 LinkedIn/Facebook 無法正確預覽） | 0/10 |
| Twitter Card tags | ❌ 不存在 | 0/10 |
| Structured Data (JSON-LD) | ❌ 不存在（無 Person、WebSite schema） | 0/10 |
| Canonical URLs | ❌ 不存在 | 0/10 |
| Favicon | ❌ 不存在（瀏覽器分頁無圖示） | 0/10 |
| 圖片 alt text | ✅ 主要頁面（home, projects, collaborations）圖片皆有 alt text | 8/10 |
| HTML 語意結構 | ⚠️ `lang="en"` 正確；H1 使用合理（home、index 各 1 個），但 projects.html 和 colleberators.html 缺少 H1 | 6/10 |
| 頁面標題 | ⚠️ home.html 標題僅 "Wei-Ping Chan"，缺少角色描述；projects.html 好（有 "Projects — Wei-Ping Chan"） | 5/10 |

**SEO 總分：3.1/10** — 基礎 SEO 幾乎為零，搜尋引擎可收錄但呈現效果差。

---

### 2. 網頁設計

| 項目 | 狀態 | 評分 |
|---|---|---|
| 整體視覺呈現 | ✅ 深藍色系專業、統一；卡片式佈局清晰；Tailwind CSS 提供一致的間距和字體。首屏 hero 有大照片和明確的身分描述，印象良好。 | 8/10 |
| 導航結構 | ⚠️ home、projects、collaborations 三頁導航一致（6 項）。但 blog.html 和 illustrations.html 使用**舊版導航**（7 項，含 Illustrations 和 Blog），與主站導航不同步。此外 Talks 和 Background 是 home.html 的錨點連結，從 projects/collaborations 頁面點擊會跳轉回 home，但使用者可能預期獨立頁面。 | 5/10 |
| 行動裝置 RWD | ✅ viewport meta 正確；使用漢堡選單；grid 有 `md:` 斷點。index.html splash 有 `@media (max-width: 768px)` 微調。整體 RWD 可用。 | 7/10 |
| 載入速度 | 🔴 **嚴重問題**：imgs/ 資料夾本地 467MB（含大量 .tif/.psd/.ai 原始檔）。雖然 .gitignore 已排除大部分（僅保留 3 張海報），但本地 repo 臃腫。更關鍵的是，主站大量圖片託管在 **Google Drive thumbnail API**，每張圖片都需要一次外部 HTTP 請求且無法被 CDN 快取，在 Drive 限流時會完全不載入。瀏覽器截圖顯示滾動後出現大片空白，正是 Drive 圖片未能即時載入所致。 | 3/10 |
| index.html splash 頁 | ⚠️ 20 秒自動跳轉至 home.html。對 SEO 不利（搜尋引擎看到的是一個幾乎空白的 splash），對使用者體驗也增加一次不必要的等待。 | 4/10 |
| 程式碼品質 | ⚠️ 沒有使用 CSS/JS 壓縮；Tailwind 使用 CDN 全量載入（~3MB 未壓縮）；所有 CSS 內嵌在各 HTML 中導致重複；導航欄程式碼在每個頁面重複（未元件化）。 | 4/10 |
| 無障礙（a11y） | ⚠️ 漢堡按鈕有 `aria-label`；lightbox 有 `role="dialog"` 和 `aria-modal`。但外部連結缺少明確的視覺提示（僅靠顏色）；部分連結無 `aria-label`。 | 6/10 |

**設計總分：5.3/10** — 視覺品質不錯但技術實作有明顯缺陷。

---

### 3. 內容

| 項目 | 狀態 | 評分 |
|---|---|---|
| 自我介紹 | ✅ 清楚簡潔：兩段涵蓋專長（data science、AI、computational modeling）、跨領域背景、具體技能。chips 顯示核心領域。 | 8/10 |
| 研究/專業經歷 | ✅ 完整涵蓋 Harvard 至今所有職位（Founding Director → Associate → Research Scientist → Postdoc → RA）和學歷（PhD → 碩後 → 碩士 → 學士），時間線清晰。 | 9/10 |
| 聯繫方式 | ✅ 多處可見（hero、footer、Contact 區塊）。Email、Google Scholar、LinkedIn、GitHub 四個連結齊全。 | 9/10 |
| 投資人/合作夥伴第一印象 | ⚠️ 對學術界非常好（Science、Nature 論文突出）。但對業界：缺少一句「我能幫你什麼」的 value proposition；Start-up 經驗（BioMuse-X、CropSky、PathoTracter）只在 Projects 頁而非首頁；缺少 CV/Resume 下載連結。 | 6/10 |
| 內容時效性 | ✅ 最新職位到 2026 年（Associate, OEB）；最新論文 2025 年；Talk 最新到 2026 年 4 月。Footer 版權 2026。 | 9/10 |
| 頁面拼字 | ⚠️ "colleberators.html" 拼寫錯誤（應為 "collaborators"）。這會出現在 URL 中，影響專業感。 | 4/10 |
| 「施工中」頁面 | 🔴 blog.html 和 illustrations.html 都是「Under Construction」佔位頁。導航已從主頁面移除這兩個連結，但檔案仍在 repo 中可被搜尋引擎收錄。且這兩頁的導航仍是舊版，會讓透過搜尋引擎進入的使用者困惑。 | 3/10 |
| Publications | ✅ 精選 6 篇高影響力論文（Science、Nature、Proc. R. Soc. B），附 DOI 連結。有 Google Scholar 全清單連結。 | 9/10 |
| Collaborations | ✅ 互動式地圖、篩選器、合作者卡片、依論文分組 — 是全站最出色的頁面。 | 9/10 |
| Technical Skills | ⚠️ 列出太多工具（含標括號的如 "(Visual Basic)"、"(Unreal Engine 5)"），可能分散重點。 | 6/10 |

**內容總分：7.2/10** — 學術內容紮實，但商業定位和細節品質待加強。

---

## 二、最高優先改善項目（立即處理）

### P1. 圖片託管從 Google Drive 遷移至 repo 或 CDN
- **問題：** 全站 ~40 張圖片使用 `drive.google.com/thumbnail` API。Google Drive 非設計為圖片 CDN，會限流、慢載、且瀏覽器無法快取。瀏覽器截圖已出現大片空白。
- **方案：** 將所有用於網頁的圖片轉為 WebP（品質 80%，寬度 ≤1200px），放入 `imgs/web/` 資料夾，從 .gitignore 排除中取消。或使用 GitHub LFS / Cloudflare R2 / imgbb 等專用圖片服務。
- **影響：** 載入速度預計從 5–10 秒降至 <2 秒。

### P2. 修正 `colleberators.html` 拼寫
- **問題：** 檔名拼錯，影響 URL 專業度。
- **方案：** 重新命名為 `collaborators.html`，全站更新連結，舊 URL 設 redirect 或保留一個跳轉頁。

### P3. 移除或隱藏 blog.html 和 illustrations.html
- **問題：** 「Under Construction」頁面降低專業感，且使用舊版導航。
- **方案：** 從 repo 中移除；或加 `<meta name="robots" content="noindex">` 防止收錄。

### P4. 移除 index.html splash 或將 home.html 設為 index
- **問題：** 多一層跳轉傷害 SEO 和使用者體驗。搜尋引擎主要收錄 index.html，而它幾乎是空白的。
- **方案：** 將 home.html 內容直接做為 index.html，或將 splash 改為 home.html 頂部的 hero section（不跳轉）。

---

## 三、中期改善項目（1–4 週）

### M1. 建立基礎 SEO 檔案
- 加入 `sitemap.xml`（列出 index, home, projects, collaborators 四頁）
- 加入 `robots.txt`（允許所有爬蟲，指向 sitemap）
- 每頁加入 `<link rel="canonical" href="...">`

### M2. 加入 Open Graph 和 Twitter Card tags
每頁 `<head>` 加入：
```html
<meta property="og:title" content="Wei-Ping Chan — Data Scientist & Researcher">
<meta property="og:description" content="...">
<meta property="og:image" content="https://...profile-photo.jpg">
<meta property="og:url" content="https://wpchanwork.github.io/wei-ping_chan/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```
- **影響：** LinkedIn/Facebook/Twitter 分享時顯示正確的預覽圖和描述。

### M3. 加入 Favicon
- 製作一個簡單的 favicon（可用姓名首字母 "WC" 或科學圖案）
- 加入 `<link rel="icon" href="favicon.ico">`

### M4. 加入 JSON-LD 結構化資料
在 home.html 加入 `Person` schema：
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Wei-Ping Chan",
  "jobTitle": "Research Scientist",
  "affiliation": "Harvard University",
  "url": "https://wpchanwork.github.io/wei-ping_chan/",
  "sameAs": ["LinkedIn URL", "Google Scholar URL", "GitHub URL"]
}
```

### M5. 統一頁面標題格式
- `index.html` → "Wei-Ping Chan — Data Scientist & Interdisciplinary Researcher"
- `home.html` → "Wei-Ping Chan — Data Scientist & Interdisciplinary Researcher"
- `projects.html` → "Projects — Wei-Ping Chan"（已 OK）
- `collaborators.html` → "Collaboration Map — Wei-Ping Chan"（已 OK）

### M6. 加入 CV/Resume 下載
- 在 hero 區塊或 Contact 區塊加入 PDF 履歷下載按鈕
- 對投資人或商業合作者非常重要

---

## 四、長期建議（1–3 個月）

### L1. 遷移至靜態網站生成器
目前 5 個 HTML 檔案各自獨立，導航欄、footer 重複貼上。建議遷移至 Hugo / Eleventy / Astro 等 SSG：
- 導航、footer 元件化
- 自動生成 sitemap
- 圖片自動最佳化（WebP、srcset）
- Markdown 撰寫 blog 內容
- 可繼續部署在 GitHub Pages

### L2. 加入業界導向的 landing section
目前網站偏學術。若要對投資人/合作夥伴傳達價值：
- 在 hero 下方加一段 "What I Can Help With"：顧問服務、技術合作、演講邀請
- 將 Start-up 經驗從 Projects 提升至首頁
- 加入客戶/合作成果的 testimonial 或 impact metrics

### L3. 效能最佳化
- Tailwind CDN（~3MB）替換為僅包含使用到的 class 的 purged CSS（<20KB）
- 圖片加入 `loading="lazy"` 和 `srcset`（目前 collaborations 頁照片已有 `loading="lazy"`，但 home 和 projects 頁缺少）
- 考慮用 `<picture>` 提供 WebP 格式

### L4. 分析與追蹤
- 加入 Google Analytics 4 或 Plausible Analytics
- 追蹤訪客來源、停留時間、最受關注的頁面

### L5. 完善或移除 Blog/Illustrations
決定是否要維護這些頁面。如果要：用 SSG 建立 blog 系統。如果不要：徹底移除，不留「施工中」。

---

## 總結評分

| 面向 | 分數 | 評級 |
|---|---|---|
| SEO | 3.1/10 | 🔴 需要立即處理 |
| 網頁設計 | 5.3/10 | 🟡 視覺好但技術弱 |
| 內容 | 7.2/10 | 🟢 學術紮實，商業面可加強 |
| **綜合** | **5.2/10** | **🟡 中等偏下** |

**最關鍵的一句話：** 這個網站的內容品質（Nature、Science 論文、Harvard 背景）遠高於它的技術實作品質。修好圖片託管和基礎 SEO 後，分數可以迅速提升到 7+/10。

---

*報告結束。如需針對任何項目展開實作，請指示。*
