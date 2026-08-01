# fishybizness 🐠

Aquarium shop website with a product catalog, livestock showcase, project portfolio, and admin panel. Includes a growing set of aquarium utilities (volume, stocking, CO₂ dosing, and more).

## Live Site

https://fishybiz.duckdns.org

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **Tailwind CSS 4** + Framer Motion
- **SQLite** via `better-sqlite3` (auto-created and seeded from `/content/*.json`)
- Deployed with **PM2** on Ubuntu

---

## Installation Guide

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20.9+ (22 LTS recommended) |
| npm | 10+ |
| OS | Linux / macOS / WSL recommended (SQLite is a native module) |

> `better-sqlite3` compiles a native addon at install time. On Ubuntu you may need build tools first:
> ```bash
> sudo apt update && sudo apt install -y python3 make g++
> ```

### 1. Get the code

Clone the repository:

```bash
git clone git@github.com:prasunbheri/fishybizness.git
cd fishybizness
```

Or unpack a release tarball from the `release/` folder:

```bash
tar -xzf release/fishybizness-0.1.0.tar.gz
cd fishybizness
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the admin credentials **before** deploying:

| Variable | Purpose |
|---|---|
| `ADMIN_USERNAME` | Admin panel username |
| `ADMIN_PASSWORD` | Admin panel password — use something strong |
| `ADMIN_SECRET` | Signs session cookies. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### 4. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The first request creates `fishybizness.db` automatically and seeds it from the JSON files in `/content/`. No manual database setup is needed.

### 5. Run in production

```bash
npm run build
npm run start
```

The production server listens on `http://localhost:3000`. Point a reverse proxy (nginx/Caddy) at it for HTTPS.

---

## Configuration & Data

### Admin panel

- URL: `http://localhost:3000/admin/login`
- Log in with the credentials from `.env.local`.
- Manage products, livestock, projects, shop info, categories and hero images.

### Content files

The database auto-seeds on first run from `/content/` and is never re-seeded once it has data:

- `content/categories.json` — Shop categories
- `content/products.json` — Products (`amazonUrl` optional)
- `content/livestock.json` — Fish, plants, invertebrates
- `content/projects.json` — Portfolio projects
- `content/shop.json` — Shop info, hours, social links

You can edit these JSON files directly (delete the `.db` file to force a re-seed) or use the admin panel. The SQLite database lives at `fishybizness.db`.

### Utilities

The site ships a set of aquarium tools under `/utilities` (volume, fish compatibility, stocking calculator, CO₂ and fertilizer dosing, heater wattage, filter flow, substrate, glass thickness, temperature converter, maintenance checklist).

---

## Deploying to a Server (Ubuntu + PM2)

1. **Push to git**, then SSH into the server:

```bash
git push
ssh ubuntu@<server>
```

2. **On the server**, update and restart:

```bash
cd ~/fishybizness
git pull
npm run build
pm2 restart fishybizness        # or: pm2 start 'npm run start' --name fishybizness
```

3. **Data safety** — never overwrite the database, admin-uploaded images, or edited content when syncing files. If you use `rsync`, always exclude admin-created data:

```bash
rsync -avz --delete \
  --exclude 'node_modules' --exclude '.git' --exclude '.next' \
  --exclude 'content/' --exclude 'public/images/' --exclude '*.db*' \
  -e "ssh -i <your-key>.pem" \
  /local/fishybizness/ ubuntu@<server>:/home/ubuntu/fishybizness/
```

4. **Keep PM2 running across reboots** (optional but recommended):

```bash
pm2 save
pm2 startup
```

---

## Development notes

- `npm run lint` runs ESLint.
- The app writes the SQLite database with WAL mode enabled (`fishybizness.db-wal`, `.db-shm` are sidecar files — safe to delete when the app is stopped, never while running).
- Images uploaded via the admin panel are stored under `public/images/`.

## Project structure

```
app/             Pages, admin routes and API routes (Next.js App Router)
components/      Shared React components (incl. shared utility UI)
content/         JSON seed data for the database
lib/             Database access, auth, data helpers, calculator logic
public/          Static assets + admin-uploaded images
release/         Versioned source tarballs
```

## License

Proprietary — © fishybizness. All rights reserved.
