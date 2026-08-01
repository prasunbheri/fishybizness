import Database from 'better-sqlite3'
import path from 'path'
import { readFileSync, existsSync } from 'fs'

let db = null

const DB_PATH = path.join(process.cwd(), 'fishybizness.db')
const contentDir = path.join(process.cwd(), 'content')

function init() {
  console.error('[db] initializing tables')
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY,
      label TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subcategories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      label TEXT NOT NULL,
      category TEXT NOT NULL,
      UNIQUE(name, category)
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      price TEXT NOT NULL DEFAULT '0',
      showPrice INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL DEFAULT '',
      subcategory TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      images TEXT NOT NULL DEFAULT '[]',
      amazonUrl TEXT,
      quantity INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS livestock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      scientificName TEXT,
      type TEXT NOT NULL DEFAULT '',
      difficulty TEXT NOT NULL DEFAULT '',
      minTankSize TEXT,
      maxSize TEXT,
      temperament TEXT,
      price TEXT NOT NULL DEFAULT '0',
      showPrice INTEGER NOT NULL DEFAULT 1,
      description TEXT NOT NULL DEFAULT '',
      images TEXT NOT NULL DEFAULT '[]',
      quantity INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      date TEXT,
      description TEXT NOT NULL DEFAULT '',
      images TEXT NOT NULL DEFAULT '[]',
      tags TEXT NOT NULL DEFAULT '[]',
      views INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS shop_info (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)

  console.error('[db] tables ready')
}

function migrate() {
  const tables = {
    products: {
      price: "TEXT NOT NULL DEFAULT '0'",
      showPrice: 'INTEGER NOT NULL DEFAULT 1',
      subcategory: "TEXT NOT NULL DEFAULT ''",
      views: 'INTEGER NOT NULL DEFAULT 0',
    },
    livestock: { price: "TEXT NOT NULL DEFAULT '0'", showPrice: 'INTEGER NOT NULL DEFAULT 1', views: 'INTEGER NOT NULL DEFAULT 0' },
    projects: { views: 'INTEGER NOT NULL DEFAULT 0' },
  }
  for (const [table, cols] of Object.entries(tables)) {
    const existing = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name)
    for (const [col, def] of Object.entries(cols)) {
      if (!existing.includes(col)) {
        try {
          db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`)
          console.error(`[db] migrated ${table}: added ${col}`)
        } catch (e) {
          if (e.message.includes('duplicate column name')) {
            console.error(`[db] ${table}.${col} already present, skipping`)
          } else {
            throw e
          }
        }
      }
    }
  }
}

function seedIfEmpty() {
  const tables = ['categories', 'subcategories', 'products', 'livestock', 'projects', 'shop_info']
  const jsonFiles = { shop_info: 'shop.json' }

  for (const table of tables) {
    const { count } = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get()
    if (count > 0) {
      console.error(`[db] ${table} has ${count} rows, skipping seed`)
      continue
    }

    const file = jsonFiles[table] || `${table}.json`
    const filePath = path.join(contentDir, file)
    if (!existsSync(filePath)) {
      console.error(`[db] seed file not found: ${filePath}`)
      continue
    }

    try {
      const raw = readFileSync(filePath, 'utf-8')
      const data = JSON.parse(raw)

      console.error(`[db] seeding ${table} from ${file}`)

      if (table === 'shop_info') {
        db.prepare('INSERT OR IGNORE INTO shop_info (key, value) VALUES (?, ?)').run('shop', raw)
      } else if (table === 'categories') {
        const stmt = db.prepare('INSERT OR IGNORE INTO categories (name, label) VALUES (?, ?)')
        for (const c of data) stmt.run(c.name, c.label || c.name)
      } else if (table === 'subcategories') {
        const stmt = db.prepare('INSERT OR IGNORE INTO subcategories (name, label, category) VALUES (?, ?, ?)')
        for (const s of data) stmt.run(s.name, s.label || s.name, s.category)
      } else if (table === 'products') {
        const stmt = db.prepare(
          'INSERT OR IGNORE INTO products (name, slug, price, category, subcategory, description, images, amazonUrl, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )
        for (const p of data) stmt.run(p.name, p.slug, p.price, p.category, p.subcategory || '', p.description, JSON.stringify(p.images || []), p.amazonUrl || null, p.quantity ?? 0)
      } else if (table === 'livestock') {
        const stmt = db.prepare(
          'INSERT OR IGNORE INTO livestock (name, slug, scientificName, type, difficulty, minTankSize, maxSize, temperament, price, showPrice, description, images, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )
        for (const l of data) stmt.run(l.name, l.slug, l.scientificName || null, l.type, l.difficulty, l.minTankSize || null, l.maxSize || null, l.temperament || null, l.price ?? '0', l.showPrice ?? 1, l.description, JSON.stringify(l.images || []), l.quantity ?? 0)
      } else if (table === 'projects') {
        const stmt = db.prepare(
          'INSERT OR IGNORE INTO projects (title, slug, date, description, images, tags) VALUES (?, ?, ?, ?, ?, ?)'
        )
        for (const p of data) stmt.run(p.title, p.slug, p.date || null, p.description, JSON.stringify(p.images || []), JSON.stringify(p.tags || []))
      }

      console.error(`[db] seeded ${table} OK`)
    } catch (e) {
      console.error(`[db] seed ${table} FAILED:`, e.message)
    }
  }
}

export function getDB() {
  if (!db) {
    db = new Database(DB_PATH)
    init()
    migrate()
    seedIfEmpty()
  }
  return db
}

export function parseJSON(val) {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}
