# Wei-Ping Chan 個人網站設計評估報告

**日期**：2026-09-08  
**評估者**：Product Designer (L3)  
**tiers_used**：High  
**language**：traditional-chinese  

---

## 核心判斷

現有網站在資訊架構與功能完整度上已達到良好的學術網站標準，但視覺語言過於「安全」——它看起來像一個優秀的 Tailwind 模板，而非一位橫跨生態學、光學物理、AI 與藝術的跨域研究者的個人品牌。Ping 的獨特性（從蝴蝶翅膀到氣候速度、從博物館數位化到永續基金會）在設計上幾乎沒有被表達出來。網站需要一次「從模板到個人敘事」的質感升級。

---

## 1. 整體視覺風格

### 現況

網站採用 Tailwind CSS 2.x 預設的灰白藍配色，圓角卡片 + 陰影的標準 SaaS 風格。這個視覺語言在 2022 年很主流，但到 2026 年已經非常泛用，無法區隔 Ping 與任何其他使用 Tailwind 模板的學者。

### 問題

- **無辨識度**：關掉名字後，這個網站可以屬於任何人。沒有視覺元素暗示「這個人研究蝴蝶翅膀的光學特性」或「這個人用 CFD 模擬昆蟲飛行」。
- **過度依賴 stock-like 構圖**：技能卡片的圖片（程式設計、資料分析等）排列整齊但缺乏敘事感，像是求職網站而非研究者 portfolio。
- **深色區塊（Datasets）與淺色區塊的切換缺乏過渡**，顯得生硬。

### 建議方向

- **引入「自然紋理 × 科學精準」的雙重視覺語言**：用 Ping 自己的研究圖像（蝴蝶翅膀多光譜影像、氣候速度地圖、SEM 微結構照片）作為背景紋理或裝飾元素，取代通用圖片。
- **參考 2025 Best Interactive Website 得主 Cecilia Baldoni**（cecibaldoni.github.io）的做法：她用手繪城市作為導航意象，將個人特質融入資訊架構。Ping 可以用類似的「視覺隱喻」——例如以光譜漸層、蝴蝶翅膀的微結構圖案、或氣候等溫線作為貫穿全站的視覺母題。
- **參考 Meg Mindlin**（megmindlin.com）的藝術×科學整合：她把科學插畫直接融入網站設計，而非只是「附在旁邊的圖片」。

---

## 2. 配色方案

### 現況

主色：`#14294b`（深海軍藍）  
輔色：`#2563eb`（標準藍）、`#eef2f7`（淺灰藍）  
強調：Tailwind 預設的 `blue-600`、`blue-100`  

這是一個「安全但無個性」的配色。海軍藍暗示權威與學術，但沒有任何色彩暗示 Ping 的研究領域。

### 問題

- 全站只有藍色系，缺乏層次與情緒變化。
- Collaborators 頁面的研究領域色彩（紫、綠、琥珀、青）比首頁更有性格，但這些色彩沒有回流到主站設計中。
- Hero 區的漸層 `rgba(15,23,42,...)` 過暗，壓制了背景圖片的敘事力。

### 建議方向

建立一組「自然科學色票」，從 Ping 的研究素材中提取：

| 色彩角色 | 建議來源 | 色彩方向 |
|---|---|---|
| 主色 | 深夜的天空（蛾類光誘實驗） | 深靛藍 `#0f1a2e` → 比現有更深更沉穩 |
| 輔色 1 | 蝴蝶翅膀的結構色 | 虹彩青綠 `#0d9488` ~ `#06b6d4` |
| 輔色 2 | 多光譜影像的琥珀通道 | 暖琥珀 `#d97706` ~ `#b45309` |
| 輔色 3 | 氣候速度地圖的紅移 | 珊瑚紅 `#dc2626`（少量使用） |
| 背景 | 標本紙張、博物館展櫃 | 暖白 `#faf8f5` 取代冷灰 `#f9fafb` |
| 中性色 | 岩石、土壤（田野調查） | 暖灰 `#78716c` 取代冷灰 `#64748b` |

這組色票同時能與 SOS 基金會的深色系（`#0f1f3d` 背景 + 金/青強調）形成視覺家族感，而非完全一致。

---

## 3. 字體選擇

### 現況

全站使用瀏覽器預設的 `font-sans`（即系統 sans-serif），沒有載入任何自訂字體。

### 問題

- 系統字體在不同 OS 上呈現不一致（Windows 用 Segoe UI、Mac 用 SF Pro、Linux 用各種）。
- 缺乏排版層次感：標題、內文、標籤都是同一字體家族，僅靠大小和粗細區分。
- 這是最明顯的「模板感」來源之一。

### 建議方向

- **標題**：選用一款帶有科學精準感但不冰冷的 serif 或 slab-serif。推薦 **DM Serif Display**（Google Fonts 免費）或 **Playfair Display**——帶有些許「博物館感」的優雅。
- **內文**：**Inter** 或 **Source Sans 3**——高可讀性、OpenType 特性齊全、支援數字表格對齊（對研究者的數據呈現有幫助）。
- **程式碼/標籤**：**JetBrains Mono** 或 **Fira Code**——暗示技術能力。
- **中文**（若未來需要雙語）：**Noto Serif TC** 搭配 **Noto Sans TC**。

排版節奏建議：標題行高 1.15、內文行高 1.65、段落間距 1.2em。目前內文 `leading-relaxed` 是好的，但標題太鬆。

---

## 4. 版面佈局

### 現況

- 全站 `max-w-6xl`（1152px），內容區偏窄。
- 所有頁面都是「區塊堆疊」的線性佈局：Hero → 卡片格 → 卡片格 → Footer。
- 沒有任何「破格」元素打破節奏。

### 問題

- **視覺節奏單調**：每個區塊都是「標題 + 短橫線 + 卡片網格」，滾動三屏後就能預測下一屏的樣貌。
- **Hero 區缺乏深度**：大頭照 + 文字的水平排列是最安全的學術網站佈局，但 Ping 的背景足以支撐更有野心的開場。
- **Projects 頁沒有分級**：SOS、BioMuse-X 等重點專案與較早期的課題專案在視覺上權重相同。
- **Technical Skills 區過於像履歷**：四張卡片列出技能清單，這是 LinkedIn 做的事，個人網站應該展示能力的「證據」而非「清單」。

### 建議方向

- **Hero 重新設計**：考慮全幅沉浸式開場——用 Ping 的多光譜蝴蝶影像或氣候速度地圖作為動態背景（CSS `mix-blend-mode` 或 subtle parallax），大頭照縮小並偏移到一側，讓研究意象成為第一印象。參考 2025 Best Storytelling 得主 Erika Cedillo（erikacedillo.com）的做法：用個人故事而非頭銜開場。
- **引入「雜誌式」佈局節奏**：交替使用全幅圖片區、左右不對稱的文圖組合、以及留白呼吸區，打破均勻的卡片網格。
- **Projects 頁分層**：旗艦專案（SOS、BioMuse-X）用大卡全幅展示；研究專案按主題分組後用時間軸或 Masonry 佈局；早期/完成的專案收進可摺疊區。
- **Technical Skills 轉化為「能力故事」**：不列清單，而是用 2-3 個迷你案例展示能力如何被應用（例：「用 Python + R 建構了涵蓋 12,000+ 物種的氣候速度分析框架」）。

---

## 5. 互動效果

### 現況

- 卡片 hover 有 `translateY(-5px)` + 陰影放大。
- Collaborators 頁有 Leaflet 互動地圖 + 照片走馬燈 + hover 放大預覽。
- Talks 區有 lightbox 影片播放。
- 手機漢堡選單。

### 問題

- **互動效果過於保守**：hover 上浮是 2018 年的標準做法，現在已經不構成「驚喜」。
- **缺乏滾動驅動的敘事**（scroll-driven storytelling），這是 2025-2026 年最重要的網頁設計趨勢之一。
- **Collaborators 的照片走馬燈是全站最有活力的元素**，但其他頁面都沒有這種動態感。
- **頁面之間沒有過渡動畫**，每次導航都是硬切。

### 建議方向

- **Scroll-triggered animations**：用 Intersection Observer 或 CSS `scroll-timeline` 讓內容區塊在滾動時漸入（fade-in + slight slide），而非一次全部載入。節制使用——每個區塊一種進入動畫即可，避免過度。
- **Hero 區的微互動**：滑鼠移動時背景圖片有微妙的 parallax 位移（2-5px），增加深度感。
- **研究專案圖片**：hover 時不只是上浮，而是顯示一層半透明的關鍵字標籤或「Read more」提示。
- **數據視覺化元素**：在 Background 區的時間軸上加入 scroll-triggered 的進度動畫，讓學經歷不只是靜態文字。
- **頁面過渡**：用 View Transitions API（2026 年主流瀏覽器已支援）實現跨頁面的平滑過渡。

---

## 6. 個人品牌呈現

### 現況

品牌定位是「Exploratory Data Scientist · Interdisciplinary Researcher」，副標「From Nature to Society」。標籤有 Data Science / AI / Computational Modeling / Ecology / Evolution。

### 問題

- **定位太廣**：「Exploratory Data Scientist」和「Interdisciplinary Researcher」都是正確但不鮮明的描述。這兩個詞放在 100 個人身上都能成立。
- **「From Nature to Society」是最有潛力的品牌語，但只出現在 Hero 區一行小字**，沒有被視覺化或展開。
- **缺乏個人敘事**：網站告訴訪客 Ping 會什麼（技能清單）和做了什麼（專案列表），但沒有告訴訪客 Ping 是「怎樣的人」和「為什麼做這些事」。
- 沒有「一句話」能讓人記住：訪客離開後能記得的是「那個哈佛的研究者」而非更具體的印象。

### 建議方向

- **提煉一個視覺化的品牌核心**：Ping 的獨特性在於「用資料科學的眼睛看自然界的模式，再將這些模式轉化為服務人類社會的工具」。這個「看見隱藏模式」的能力應該成為品牌的核心隱喻。
- **加入 personal statement 區塊**：不是現在的能力摘要，而是 2-3 句話說明「驅動力」。例如：*"I see patterns where others see noise — in butterfly wings, in climate data, in the gap between nature and technology."*
- **視覺隱喻**：蝴蝶翅膀在可見光下是一種顏色，在多光譜下是完全不同的故事——這正是「看見隱藏模式」的完美視覺隱喻。可以在首頁用一組對比圖（同一蝴蝶的可見光 vs. 多光譜影像）作為品牌敘事的開場。

---

## 7. 與 SOS / BioNarr / IoBI 的視覺連結

### 現況

- SOS 基金會網站（sos-commons.vercel.app）使用 Next.js，視覺風格是深色沉浸式 + 滾動敘事 + 金/青強調色，設計語言明顯比個人網站更成熟。
- 個人網站與 SOS 網站之間幾乎沒有視覺連結——配色不同、字體不同、佈局邏輯不同。
- 個人網站的 Footer 有 SOS Research 連結，但僅此而已。

### 問題

訪客從 Ping 的個人網站點進 SOS，或反過來，會感覺像進入了完全不同的品牌世界。對於一個 Founding Director 來說，個人品牌與組織品牌之間應該有可辨識的視覺關聯。

### 建議方向

- **共享色彩基因**：個人網站的深色區塊採用與 SOS 相似的深靛藍底色（`#0f1a2e`），並在 SOS、BioMuse-X 等專案卡片上使用對應組織的品牌色作為強調。
- **SOS 三元素的視覺呼應**：SOS 的核心是「Meaning + Pattern + Mechanism → Continuity」。個人網站的專案分類可以隱約對應這三個維度——藝術/文化專案 → Meaning、自然模式研究 → Pattern、技術應用 → Mechanism——在視覺上用色彩或圖標暗示歸屬。
- **專案卡片上標示組織歸屬**：SOS 專案加上 SOS logo 小徽章，讓品牌關聯一目了然。
- **統一「深色沉浸區」的視覺語言**：目前個人網站的 Datasets 區和 Contact 區是深色，但風格與 SOS 的深色區不同。統一漸層方向、overlay 透明度、文字排版，讓深色區塊成為兩站共享的視覺語彙。

---

## 8. 參考網站分析

以下是與 Ping 背景最相關的優秀個人網站，以及各自值得借鑑之處：

| 網站 | 特色 | 可借鑑之處 |
|---|---|---|
| **Cecilia Baldoni** (cecibaldoni.github.io) — 2025 Best Interactive Website | 手繪城市導航、Shrews 滾動敘事頁、插畫融入設計 | 用「視覺隱喻」取代通用導航；研究故事的滾動敘事呈現 |
| **Meg Mindlin** (megmindlin.com) — 2025 Best Use of Art/Visuals | 科學插畫直接作為設計元素、藝術×科學整合 | 將 Ping 的多光譜影像和 SEM 照片當作設計素材而非配圖 |
| **Madeline Eppley** (madeline-eppley.com) — 2025 Overall Best | 豐富的田野照片、研究頁區分 ongoing/completed | 用真實照片建立個人連結；專案狀態的清晰標示 |
| **Hira Javed** (hirajaved.com) — 2025 Most Aesthetic | 統一色票、色彩編碼的視覺履歷、每場演講配照片 | 全站色彩一致性；用色彩而非只用文字來傳達分類 |
| **Erika Cedillo** (erikacedillo.com) — 2025 Best Storytelling | 從個人故事開場、科普與專業並行 | 「為什麼做研究」的敘事方式；雙語（英/西）的處理 |
| **Julia Janicki** (juliahanjanicki.com) | 生物多樣性 + 資料視覺化 + 互動地圖 | 互動式資料視覺化作為 portfolio 展示方式 |
| **Patrick Manser** (patrick-manser.com) — 2025 Best Portfolio | 歡迎影片、推薦語、媒體報導整合 | 影片自我介紹的力量；social proof 的整合 |

---

## 9. 技術面建議

### 現況的技術限制

- Tailwind CSS 2.x（CDN 版）——無法使用 JIT、自訂 theme、或 Tailwind 4.x 的新功能。
- 所有頁面都是靜態 HTML，手動維護 navbar 和 footer（已在 4 個頁面各複製一次）。
- 圖片從 Google Drive 動態載入（依賴 `imgs/web/` 本地快取）。

### 建議

- **升級到靜態站生成器**（Astro 或 11ty）：共享 navbar/footer 元件、自動圖片最佳化（WebP/AVIF）、更好的 SEO。GitHub Pages 部署不受影響。
- **若偏好保持純 HTML**：至少用 `<template>` + JS 或 server-side include 統一重複元件。
- **圖片策略**：download_images.py 已就緒，下載後應產生多尺寸 srcset（300w, 600w, 1200w）並使用 `<picture>` 標籤 + lazy loading，提升 LCP。
- **字體載入**：使用 `font-display: swap` + preload critical fonts，避免 FOIT。

---

## 10. 優先建議摘要（行動清單）

以下按影響力排序，建議分三階段執行：

### Phase 1：品牌根基（1-2 週）

1. 定義品牌色票（從研究素材提取 5-6 色）與字體組合
2. 撰寫 personal statement（2-3 句核心敘事）
3. 選定 1-2 張「品牌級」研究圖片（多光譜蝴蝶、氣候速度地圖）

### Phase 2：視覺升級（2-4 週）

4. 重設計 Hero 區（沉浸式背景 + 個人敘事）
5. 引入自訂字體（標題 serif + 內文 sans）
6. 將背景色從冷灰切換到暖白
7. 加入 scroll-triggered 進入動畫
8. Technical Skills 從清單改為能力故事

### Phase 3：結構優化（4-6 週）

9. Projects 頁分層設計（旗艦 / 研究 / 早期）
10. 統一深色區塊與 SOS 網站的視覺語言
11. 考慮遷移到 Astro/11ty 以解決元件重複問題
12. 圖片最佳化 pipeline（多尺寸 + WebP）

---

## 附錄：Demo 分佈（P-9 遵循）

本評估中的建議方向已參考以下分佈：

- 🥇 **Best case**（~10%）：全面重新設計，類似 Cecilia Baldoni 的互動式城市導航——這需要大量設計與開發時間，效果最好但 ROI 需評估。
- 📊 **Typical case**（~60%）：在現有 HTML 結構上進行 Phase 1-2 的視覺升級——改配色、加字體、重設計 Hero、調整佈局節奏。這是最務實的路徑。
- ⚠️ **Risk case**（~5%）：過度設計導致載入速度變慢、或視覺風格過於「設計師」而失去學術可信度。需注意：學術網站的第一受眾是同行和潛在合作者，「質感」不等於「花俏」。

---

*報告完成。待 review-board-chair 審查。*

Sources:
- [Winners of the Best Personal Academic Websites Contest 2025](https://theacademicdesigner.com/2025/winners-of-the-best-personal-academic-websites-contest-2025/)
- [Top Web Design Trends for 2026](https://designmodo.com/web-design-trends/)
- [The 11 Biggest Web Design Trends of 2026](https://www.wix.com/blog/web-design-trends)
- [10 Dark-Themed Web Design Innovations](https://orpetron.com/blog/10-dark-themed-web-design-innovations-driving-creativity/)
- [40 Multidisciplinary Art Portfolio Website Examples](https://www.format.com/customers/art/multidisciplinary)
