# fishybizness 🐠

Aquarium shop website with project portfolio, product catalog, livestock showcase, and admin panel.

## Live Site

https://fishybiz.duckdns.org

## Admin Panel

https://fishybiz.duckdns.org/admin/login

| Credential | Value |
|---|---|
| Username | `admin` |
| Password | `fishybizness2024` |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Updating Content

Edit JSON files in `/content/`:

- **`content/livestock.json`** — Fish, plants, invertebrates
- **`content/products.json`** — Shop products (set `amazonUrl` when ready)
- **`content/projects.json`** — Portfolio projects
- **`content/shop.json`** — Shop info, hours, social links

Or use the admin panel at `/admin`.

## Deployment

```bash
git push
ssh to server, then:
cd ~/fishybizness && git pull && npm run build && pm2 restart fishybizness
```

## Tech Stack

Next.js 16, Tailwind CSS, Framer Motion
