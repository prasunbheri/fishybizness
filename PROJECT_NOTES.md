# FishyBizness — Project Notes & Feature Reference

Memory file for future AI sessions. Read this before touching the code so nothing gets lost or broken.

---

## 1. Critical Facts (read first)

- **Live site:** `https://fishybiz.duckdns.org`
- **CAUTION — never test against `fishybizness.com`.** That domain currently points at Shopify's IP (`23.227.38.32`), not our app. Only use `fishybiz.duckdns.org`.
- **This is a modified Next.js 16** (App Router, React 19). APIs and file structure may differ from older Next.js training data. **Read `node_modules/next/dist/docs/` before writing Next.js code.** Heed deprecation notices.
- **Tailwind CSS 4.** Not all utilities from v3 exist. Example gotcha: there is **no `scale-115`** — use arbitrary values like `scale-[1.15]`.
- Data on the server is admin-created and must **never** be overwritten during deploys (see deploy section).

---

## 2. Tech Stack

| Piece | Choice |
|---|---|
| Framework | Next.js 16.2.12 (App Router) |
| React | 19.2.4 |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Animation | framer-motion 12 |
| Database | SQLite via `better-sqlite3` (WAL mode) |
| Excel | `exceljs` (admin backup/restore) |
| Hosting | Ubuntu server, PM2 (`fishybizness`), nginx reverse proxy (HTTPS) |
| Config | `next.config.mjs` (only a URL rewrite for images) |

---

## 3. Deployment & Environments

### Env vars (`.env.local`, gitignored)
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` — admin login credentials.
- `ADMIN_SECRET` — signs session cookies. **Warning:** `lib/auth.js` falls back to `'default-secret'` if unset — keep it set in production.
- `SENTRY_DSN` (server/edge) + `NEXT_PUBLIC_SENTRY_DSN` (client) — Sentry error monitoring. **Inert until set** — all Sentry configs (`sentry.*.config.js`, `instrumentation*.js`) guard on the DSN, so the app builds/runs fine without it.
- `.env.example` is committed (gitignore exception); `.env.local` is NOT.

### Full deploy flow (always after committing)
1. `git add ... && git commit -m "..." && git push origin main`
2. rsync to server with **mandatory exclusions** so admin data survives:
   ```bash
   rsync -azv --delete --exclude 'node_modules' --exclude '.git' --exclude '.next' \
     --exclude 'content/' --exclude 'public/images/' --exclude '*.db*' \
     -e "ssh -i /home/prasun/Downloads/fishybizness.pem" \
     /home/prasun/AI/fishybizness/ ubuntu@3.111.21.1:/home/ubuntu/fishybizness/
   ```
3. On server: `cd /home/ubuntu/fishybizness && npm run build && pm2 restart fishybizness --update-env`
4. Verify: `curl -s -o /dev/null -w '%{http_code}' https://fishybiz.duckdns.org/` (expect 200).
5. **Run the smoke test against the live site** before announcing anything:
   `BASE_URL=https://fishybiz.duckdns.org ADMIN_USER=admin ADMIN_PASS=fishybizness2024 npm run smoke`

### Local smoke test
- `npm run smoke` — automated puppeteer smoke test (`scripts/smoke-admin.mjs`): logs into admin, discovers real items via `/api/admin/<type>`, then loads **every** `<type>/<slug>` edit page + `<type>/new` create page and fails on any `pageerror` or crash screen. This catches the destroyed-editor-class runtime crashes that `npm run build` cannot.
- Needs `CHROME_PATH` (default `/usr/bin/google-chrome`); `BASE_URL`, `ADMIN_USER`, `ADMIN_PASS` env vars override defaults (`http://localhost:3001`, `admin`/`fishybizness2024`).
- `npm run build`, then `npm run start`, then curl `http://localhost:3000/<route>`.
- Kill server with `pkill -f 'next-server'` — this is slow; confirm with `ss -tlnp | grep :3000`.
- Local DB is `fishybizness.db` (test data). Never modify the production DB.

---

## 4. Public Site Pages

| Route | Features |
|---|---|
| `/` | Hero (shop info + optional video/image slideshow), slow-scrolling Recent Projects marquee, Featured Products (first 4), Featured Livestock (first 4), What We Do, social/contact CTA. `revalidate = 0`. |
| `/products` | Category + subcategory filter chips (with product counts), sort select, per-page selector (10–50), pagination. |
| `/products/[slug]` | ImageCarousel (thumbnails, crossfade, watermark), RichContent description, price/quantity, WhatsApp enquiry button (prefilled with product name + link), ViewTracker, **Similar Products** (same category, same subcategory first, up to 4). |
| `/livestock` | Type filter (fish/invertebrate/plant), sort, per-page, pagination, and **Group by temperament** toggle (`?group=temperament`) rendering section headers with counts. |
| `/livestock/[slug]` | Carousel, specs (difficulty, tank size, temperament, etc.), RichContent, ViewTracker, **Similar Livestock** (same type, up to 4). |
| `/projects` | Project grid. |
| `/projects/[slug]` | Carousel, RichContent description, ViewTracker. |
| `/utilities` | Card grid of all 16 utilities. |
| `/utilities/*` | 16 static calculators/checklists (see §6). |
| `/contact` | Shop info, hours, embedded Google Map, social links. |
| `/admin*` | Admin panel (auth-protected, see §7). |

Theme: dark/light follows OS `prefers-color-scheme` only. There is **no manual dark-mode toggle**.

---

## 5. Shared Components

- `Header.js` — sticky nav (Home, Projects, Products, Livestock, Utilities, Contact) + SocialLinks, mobile hamburger.
- `Footer.js`, `SocialLinks.js`, `socialIcons.js` — brand/contact/socials.
- `FloatingWhatsApp.js` — fixed bottom-right WhatsApp bubble. **WhatsApp number `917702855385` is hardcoded here AND in `lib/whatsapp.js`.**
- `Hero.js` — client component; fetches `/api/hero`; renders autoplay video OR slideshow (5s interval) as background; no watermark on hero.
- `ScrollingProjects.js` — home marquee of project cards.
  - **CSS marquee** (not framer-motion anymore): keyframe `marquee-scroll` translateX 0→-50% over 60s linear, class `.marquee-track`; `.marquee-track:hover { animation-play-state: paused }` in `app/globals.css`.
  - **Hover zoom:** image LazyBackground has `transition duration-500 group-hover:scale-[1.15]` (115%). Fallback initials div does not zoom.
- `ImageCarousel.js` — product/livestock/project gallery.
  - **Crossfade:** the outgoing image stays mounted via `prevIdx` state (cleared after 800ms; fade is 700ms). All navigation paths (`next`, `prev`, `changeTo` for dots/thumbs) set `prevIdx`.
  - **Pause on hover:** interval (4s) is skipped while `isHovering`.
  - Thumbnail strip below (64px, cyan ring on active), arrows, dots.
  - Context-menu/drag disabled (protection).
- `LazyBackground.js` — CSS `background-image` loader (NO `next/image` anywhere).
  - IntersectionObserver loads near-viewport images; watermark overlay via `watermark` prop.
  - **Watermark tile is 400px** (reduced from 110px for frequency).
- `ImageLightbox.js` — fullscreen viewer.
- `AnimatedSection.js` — framer-motion scroll reveal wrapper.
- `ViewTracker.js` — POSTs `{type, slug}` to `/api/view` on mount (`keepalive`). Counts every page load; no dedup.
- `Pagination.js`, `SortSelect.js` — listing-page helpers.
- `ProductCard.js`, `LivestockCard.js`, `ProjectCard.js` — card grids (first image = thumbnail, cover badge handled via image order).
- `AdminItemForm.js` — generic create/edit form engine. Field types: `text`, `textarea`, `richtext`, `select` (with `dependsOn` subcategory filtering), `number`, `array`, `tags`, `checkbox`, `images`. Images: multi-upload, **hover ★ sets as cover** (reorders image to index 0), "Cover" badge, delete per image.
  - **Undo/Redo:** built on a `useReducer` history stack (max 100 snapshots, stored alongside the form). Every field change pushes a snapshot; the **↩ Undo / ↪ Redo** buttons are always visible in the title bar (disabled when nothing to undo/redo), with an amber "Unsaved changes" badge when the form differs from its loaded baseline. Keyboard: `Ctrl/Cmd+Z` undo, `Ctrl/Cmd+Shift+Z` or `Ctrl/Cmd+Y` redo (page-wide, replaces native field undo). Applies to products, livestock, and projects.
- `AdminItemList.js` — admin table with delete links.
- `RichTextEditor.js` — TipTap (ProseMirror) WYSIWYG: paragraph/H1/H2/H3, bold/italic/underline/strike, inline code, highlight, text color (presets + custom), font family (presets + custom), font size (`T <size>` toggle with preset chips 12–48 px — **no Apply button, applies instantly on click**), text align (left/center/right/justify), bullet/numbered lists, blockquote, code block, horizontal rule, link/unlink, clear formatting. Toolbar buttons `onMouseDown` preventDefault so selection survives clicks; font-size/color selection is saved on popup open and restored before applying (clicking a popup chip would otherwise close the popup/clear the internal selection). Loaded via `next/dynamic({ ssr: false })` with `immediatelyRender: true` so the editor renders synchronously on the client (avoids stuck "Loading editor..."). `useEditorState` selector for toolbar state. StarterKit `undoRedo: false` (form owns undo/redo); content resyncs on `revision` via `setContent(value, { emitUpdate: false })`. Output sanitized via `lib/sanitize.js` (keeps inline styles + class). Editor styles (`h1`/`pre`/`hr`/placeholder/text-align) in `globals.css` under `.rich-editor`.
- `RichContent.js` — server renderer: plain text becomes `<p>`; HTML rendered via `dangerouslySetInnerHTML` after sanitize. Requires `.rich-content` CSS.
- `utilityUi.js` — shared utility chrome: `UtilityHeader`, `Result`, `Toggle`, `Field`, `SelectField`, `Empty`, `Note`, `inputCls`/`selectCls`.

---

## 6. Utilities (16 total)

All static pages under `app/utilities/`, share `utilityUi.js`. Index list in `app/utilities/page.js`.

1. `water-volume` — tank volume from dimensions (glass/substrate/fill).
2. `fish-compatibility` — interactive pair-compatibility chart (`lib/fishCompatibility.js`).
3. `stocking-calculator` — 1cm-per-1.5L rule, group-size warnings (`lib/stockingData.js`).
4. `co2-dosing` — CO₂ from KH/pH.
5. `fertilizer-dosing` — KNO₃/KH₂PO₄/K₂SO₄ NPK dosing.
6. `heater-wattage` — watts + dual-heater advice.
7. `filter-flow` — L/h turnover.
8. `substrate` — litres/kg/bags.
9. `glass-thickness` — DIY tank glass + bracing.
10. `temperature-converter` — °C/°F/K + comfortable fish.
11. `maintenance-checklist` — interactive care routine; **progress saved in localStorage**.
12. `water-change` — litres to remove + dechlorinator dose.
13. `lighting` — lumens/watts for planted tanks.
14. `tap-mix` — RO/tap mixing to target hardness/TDS.
15. `feeding-calculator` — daily food grams/pinches.
16. `biotope` — fish matching by water hardness + temperature.

**Shared data:** `lib/stockingData.js` species entries have `{ id, name, adultCm, group, minGroup, water: [soft|neutral|hard], temp: [tropical|cool] }` + `waterLabels`, `estimateFishWeightGrams` (0.015×cm³).

---

## 7. Admin Panel

- URL `/admin/login`; cookie `admin_token` (httpOnly, 24h, HMAC-SHA256 signed with `ADMIN_SECRET`).
- `app/admin/layout.js` — client-side auth guard via `/api/auth/check`; sidebar nav.
- **Dashboard** (`/admin`) — stats from `getDashboardStats()`: counts, total stock, out-of-stock, top 5 viewed products/livestock/projects, livestock by type.
- **Hero** — choose image slideshow or video; stored in `shop_info` key `hero`.
- **Livestock / Products / Projects** — list, create, edit (AdminItemForm + richtext), delete.
- **Categories** — categories + subcategories CRUD (rename cascades to products).
- **Backup** — export/restore full DB to Excel (`exceljs`), all tables.
- **Settings** — shop info (name, tagline, description, address, hours, socials).
- **Bulk Upload** — each list page (Products/Livestock/Projects) has an "⬆ Bulk Upload" button next to "+ Add New" (`components/BulkUploadButton.js` → modal with `.xlsx` template download + upload form + per-row result report). Backend: `app/api/admin/bulk/[type]` (POST) parses the Excel sheet and inserts rows via `bulkCreateItems` (`lib/admin-data.js`), all in a single transaction. `app/api/admin/bulk/[type]/template` (GET) downloads the template with headers + an Instructions sheet. **Templates include 2 grey italic `[Example]` rows per type; `isExampleRow` makes the importer ignore any row whose name/title starts with `[Example]`** (silently — not counted in totals; an examples-only file errors with a hint). Column headers are matched case/space-insensitively; a "name/title" column is required. Behavior: rows with empty required field → skipped; duplicate name within file → skipped; name whose slug already exists in DB → skipped. Returns `{ type, total, created: [{row,name,slug}], skipped: [{row,name,reason}] }`. `showPrice` accepts 1/0/yes/no (default 1), `quantity` coerced to int (default 0), `images`/`tags` split on commas/newlines into JSON arrays (first image = cover). Revalidates `/` + `/{type}`; the list reloads after a successful upload.

---

## 8. API Routes (`app/api/`)

| Route | Purpose |
|---|---|
| `/auth/login`, `/auth/logout`, `/auth/check` | Session management. |
| `/admin/[type]` + `/[slug]` | CRUD for `products` / `livestock` / `projects`. |
| `/admin/categories`, `/admin/subcategories` (+ `/[name]`) | Category/subcategory CRUD. |
| `/admin/hero` | Read/update hero (auth). |
| `/admin/backup` | Excel export/import (auth). |
| `/admin/bulk/[type]` + `/template` | Bulk create from uploaded Excel + `.xlsx` template download (auth). |
| `/admin/shop` | Shop info update (auth). |
| `/upload` | Saves files to `public/images/{type}/` as `{timestamp}-{rand}{ext}`, returns public paths. |
| `/view` | Increments `views` column. |
| `/hero` | Public hero data. |
| `/shop` | Public shop info. |
| `/images/[...path]` | Serves `public/images/**` with **same-origin check** (403 for hotlinks). Rewritten from `/images/:path*` in `next.config.mjs`. |

---

## 9. Data Layer

- `lib/db.js` — singleton `getDB()`. Tables: `categories`, `subcategories`, `products`, `livestock`, `projects`, `shop_info`.
  - `products` columns: name, slug, price (TEXT), showPrice, category, subcategory, description, images (JSON array), amazonUrl, quantity, views.
  - `livestock` columns: name, slug, scientificName, type, difficulty, minTankSize, maxSize, **temperament**, price, showPrice, description, images, quantity, views.
  - `projects` columns: title, slug, date, description, images, tags, views.
  - `migrate()` adds missing columns (price/showPrice/subcategory/views) via `ALTER TABLE`.
  - `seedIfEmpty()` seeds each table **only if empty** from `content/*.json`. Never re-seeds. Delete the `.db` file to force a re-seed.
  - WAL sidecar files (`*.db-wal`, `*.db-shm`) are normal — safe to delete only while the app is stopped.
- `lib/data.js` — public reads (products, livestock, projects, categories, shop info, dashboard stats).
- `lib/admin-data.js` — admin CRUD + backup/restore + `slugify` + `bulkCreateItems`/`bulkColumns`. Schemas map columns/json cols per type. `createItem` delegates to a sync `insertItem(db, cfg, data)` so the bulk importer can run inserts inside one transaction.
- `lib/auth.js` — token create/verify, `requireAdmin`.
- `lib/sanitize.js` — `sanitizeHtml` (strips script/iframe/style/object/embed/frame, `on*` handlers, `javascript:`/`data:` URLs), `stripTags`.
- `lib/image-loader.js` — global image loader with **max 4 concurrent** loads + queue.
- `lib/whatsapp.js` — `WHATSAPP_NUMBER = '917702855385'`, `WHATSAPP_MSG`, `buildWhatsAppLink`, `whatsappUrl`.

---

## 10. Content / Seed Data (`content/`)

- `categories.json`, `subcategories.json` (via categories), `products.json`, `livestock.json`, `projects.json`, `shop.json` (mapped to `shop_info` key `shop`).
- Seed livestock uses `temperament` for **plants as light level** ("Low light", "Moderate light", "High light") while fish use "Peaceful"/"Semi-aggressive" — a known semantic quirk that the group-by-temperament feature exposes.

---

## 11. Implementation Gotchas / Things I Learned (DON'T FORGET)

1. **No `next/image`** — the entire site uses CSS background-image + `LazyBackground`. Don't introduce `next/image` without checking the docs; there's no `images` config in `next.config.mjs`.
2. **Tailwind 4 arbitrary values:** non-standard scale steps must be `scale-[1.15]`, not `scale-115`.
3. **Tailwind transition conflict:** `transition-opacity` and `transition-transform` both set `transition-property`, so combining them silently drops one. Use plain `transition` when you need opacity + transform together.
4. **Carousel crossfade timing:** the outgoing image must stay mounted longer than the fade duration. `prevIdx` clears after **800ms**; fade is **700ms**. If you change the fade duration, update the timeout.
5. **Marquee is CSS now** (`marquee-track` in `globals.css`), not framer-motion. It duplicates the projects array and translates `-50%`. Hover pause and 115% zoom both live in the CSS/class.
6. **Temperament grouping** (`app/livestock/page.js`): `groupByTemperament` orders groups by `temperamentOrder` preference list, unknown values appended alphabetically. Works together with the type filter.
7. **Image protection:** served via API with same-origin check; carousel blocks context menu + drag; watermark overlays product/livestock/project images (400px tile).
8. **Views:** `/api/view` increments on every mount — no de-duplication, refreshes inflate counts.
9. **Auth cookie** is `httpOnly` + `secure` in production; fallback secret if `ADMIN_SECRET` missing.
10. **Database seeding** is table-level and only-when-empty; `INSERT OR IGNORE` in some paths. Don't rely on content JSON edits to update an existing DB.
11. **Uploads go to `public/images/{type}/`** with timestamp+random filename. rsync excludes `public/images/` so admin uploads survive deploys.
12. **Grouped livestock view disables pagination** (shows all items in sections).
13. `revalidate = 0` used on home + list/detail pages → dynamic rendering; utilities are static.
14. `npm run lint` = `eslint` (no fix flag configured in script).
15. **This Next.js fork (16.2.12) adds `unstable_catchError` from `next/error`** — component-level error boundaries (used in `components/ErrorBoundary.js`). `error.js` / `global-error.js` receive `unstable_retry` (preferred over `reset`) per the fork's docs. Error boundaries only catch render errors, not event-handler errors.
16. **The admin edit-page crash class** (destroyed TipTap editor → `getHTML()` threw `Cannot read properties of null (reading 'cached')`): always guard `editor.isDestroyed` before `editor.getHTML()`/`setContent()` in effects/onUpdate. `npm run smoke` + the ErrorBoundary around `AdminItemForm` now contain this class of bug.
17. **Sentry** wraps `next.config.mjs` with `withSentryConfig` — inert without `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN`. Client DSN must be `NEXT_PUBLIC_` or it won't be inlined into browser bundles. `instrumentation-client.js` must export `onRouterTransitionStart = Sentry.captureRouterTransitionStart` or the build warns.

---

## 12. Git History — Feature Milestones (most recent first)

- Bulk upload templates get grey `[Example]` rows; importer ignores any `[Example]`-prefixed rows on upload

- Move bulk upload UI from Settings to the Products/Livestock/Projects list pages (`BulkUploadButton` modal in `AdminItemList` header)

- Bulk upload for products/livestock/projects from Excel (admin Settings: templates + upload + per-row results; `app/api/admin/bulk/[type]` + `/template`; `bulkCreateItems` in `lib/admin-data.js`)

- (next) Similar products/livestock on detail pages
- Add guardrails: `npm run smoke` admin smoke test (`scripts/smoke-admin.mjs`), `ErrorBoundary` (via `unstable_catchError`) around `AdminItemForm`, `app/error.js` + `app/global-error.js` fallbacks, Sentry error monitoring (inert until `SENTRY_DSN` set)
- `8750eba` Fix live "This page couldn't load" crash on admin edit pages — the `revision`/value-sync effect called `editor.getHTML()` on a destroyed editor (`this.schema = null` → `DOMSerializer.fromSchema(null).cached` threw). Guarded `revision` effect with `editor.isDestroyed` and `onUpdate` with `editor.isDestroyed` before `getHTML()`.
- `19aa4b3` Notes: font-size fix + client-only editor load
- `8cbe42e` Document TipTap rich text editor in notes
- `231b232` Fix font size/color selection loss (popup-ref bug ate chip clicks) + instant font-size presets (no Apply button) + client-only editor load (`immediatelyRender: true`)
- `5fd7a66` Rewrite rich text editor on TipTap (headings, color, font family/size, align, lists, links, code blocks, highlight) — replaces `document.execCommand` editor
- `2e4194e` Font size (px number input + presets) in rich text editor
- `ab082a8` Fix rich-text undo (revision-based content sync; Ctrl+Z now reverts description)
- `8a3779a` Zoom home projects images to 115% on hover
- `92fabd6` Add group by temperament to livestock listing
- `e5c6daf` Crossfade between carousel images
- `16e45e8` Pause image carousel and projects marquee on hover
- `7818f74` Add water change, lighting, tap-mix, feeding and biotope calculators
- `8806243` Image thumbnail strip with active highlight
- `a48a34d` Show list/formatting styles live in the rich text editor
- `fce260b` Reduce watermark frequency (400px tile)
- `6ecb34b` Rich text editor for descriptions
- `060e1b5` Choose cover image in admin form (★)
- `291f533` README installation guide + release 0.1.0 tarball
- `f26ec68` 9 aquarium utility calculators + maintenance checklist
- `f9fe43e` Watermark and download protection
- `36b5e18` Lazy image loading with concurrency limit
- `a2ef32c` WhatsApp enquiry button on product pages
- `cad4bfb` Livestock view tracking + most-viewed section
- `204005e` View tracking + admin dashboard stats
- `d401205` Pagination with per-page selector
- `8810bf1` Product count on subcategory chips
- `ffeef17` Admin backup/restore via Excel
- `8d00c64` Serve uploads via API (no restart needed)
- `fedbdc2` Product subcategories with admin management
- `692d23a` Embedded Google Map on contact
- `1f2d219` WhatsApp social link
- `5388160` Admin panel with CRUD for livestock/products/projects
- `ca3d45a` Livestock section + slow-scrolling projects
- `4cdeae5` Full project
- (older commits: initial app)

---

## 13. Backlog — Features Discussed But NOT Built

Discussed with user (feature-picker dismissed, nothing chosen yet). Natural next candidates, all user-facing (non-utilities):
- Enquiry basket (multi-item WhatsApp checkout using `buildWhatsAppLink`)
- Site-wide search (products + livestock + projects)
- Wishlist / favorites (localStorage)
- Related items on detail pages
- Most-viewed / recently-viewed sections (view tracking already exists)
- Testimonials, FAQ page, public gallery (admin-managed content)
- Manual dark/light toggle
- Share buttons on detail pages

---

## 14. Current Production Data Status

Production DB is admin-managed and sparse (e.g. livestock ≈ 1 item, temperament "Peaceful"). New content is added via the admin panel, not by editing JSON. Never rsync `content/`, `public/images/`, or `*.db*` to the server.
