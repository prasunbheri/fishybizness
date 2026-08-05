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

### Local smoke test
- `npm run build`, then `npm run start`, then curl `http://localhost:3000/<route>`.
- Kill server with `pkill -f 'next-server'` — this is slow; confirm with `ss -tlnp | grep :3000`.
- Local DB is `fishybizness.db` (test data). Never modify the production DB.

---

## 4. Public Site Pages

| Route | Features |
|---|---|
| `/` | Hero (shop info + optional video/image slideshow), slow-scrolling Recent Projects marquee, Featured Products (first 4), Featured Livestock (first 4), What We Do, social/contact CTA. `revalidate = 0`. |
| `/products` | Category + subcategory filter chips (with product counts), sort select, per-page selector (10–50), pagination. |
| `/products/[slug]` | ImageCarousel (thumbnails, crossfade, watermark), RichContent description, price/quantity, WhatsApp enquiry button (prefilled with product name + link), ViewTracker. |
| `/livestock` | Type filter (fish/invertebrate/plant), sort, per-page, pagination, and **Group by temperament** toggle (`?group=temperament`) rendering section headers with counts. |
| `/livestock/[slug]` | Carousel, specs (difficulty, tank size, temperament, etc.), RichContent, ViewTracker. |
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
  - **Undo:** the form keeps a `savedForm` snapshot (last loaded/saved state). When any unsaved edit is detected (JSON compare) it shows an amber "Unsaved changes" badge next to the title and a **"↩ Undo changes"** button beside Save that reverts all fields to the snapshot. Applies to products, livestock, and projects.
- `AdminItemList.js` — admin table with delete links.
- `RichTextEditor.js` — contentEditable WYSIWYG (bold/italic/underline/strike, H2/H3/¶, bullet/numbered lists, link/unlink, clear). Uses deprecated `document.execCommand`. Output sanitized via `lib/sanitize.js`.
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

---

## 8. API Routes (`app/api/`)

| Route | Purpose |
|---|---|
| `/auth/login`, `/auth/logout`, `/auth/check` | Session management. |
| `/admin/[type]` + `/[slug]` | CRUD for `products` / `livestock` / `projects`. |
| `/admin/categories`, `/admin/subcategories` (+ `/[name]`) | Category/subcategory CRUD. |
| `/admin/hero` | Read/update hero (auth). |
| `/admin/backup` | Excel export/import (auth). |
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
- `lib/admin-data.js` — admin CRUD + backup/restore + `slugify`. Schemas map columns/json cols per type.
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

---

## 12. Git History — Feature Milestones (most recent first)

- (next) Undo option for product/livestock/project edit forms
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
