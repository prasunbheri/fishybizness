import { getDB, parseJSON } from './db'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

function log(op, type, msg, extra) {
  console.error(`[admin-data] ${op} ${type} ${msg}`, extra ? JSON.stringify(extra) : '')
}

function row(item) {
  if (!item) return null
  const result = { ...item }
  if (result.images) result.images = parseJSON(result.images)
  if (result.tags) result.tags = parseJSON(result.tags)
  return result
}

const schemas = {
  products: {
    _type: 'products',
    nameField: 'name',
    columns: ['name', 'price', 'showPrice', 'category', 'subcategory', 'description', 'images', 'amazonUrl', 'quantity'],
    jsonCols: ['images'],
  },
  livestock: {
    _type: 'livestock',
    nameField: 'name',
    columns: ['name', 'scientificName', 'type', 'difficulty', 'minTankSize', 'maxSize', 'temperament', 'price', 'showPrice', 'description', 'images', 'quantity'],
    jsonCols: ['images'],
  },
  projects: {
    _type: 'projects',
    nameField: 'title',
    columns: ['title', 'date', 'description', 'images', 'tags'],
    jsonCols: ['images', 'tags'],
  },
}

export async function listItems(type) {
  const cfg = schemas[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const db = getDB()
  const rows = db.prepare(`SELECT * FROM ${type} ORDER BY ${cfg.nameField}`).all()
  log('list', type, `${rows.length} rows`)
  return rows.map(row)
}

export async function getItem(type, slug) {
  const db = getDB()
  const item = db.prepare(`SELECT * FROM ${type} WHERE slug = ?`).get(slug)
  if (!item) log('get', type, `NOT FOUND: ${slug}`)
  return row(item)
}

export async function createItem(type, data) {
  const cfg = schemas[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const db = getDB()
  const name = data[cfg.nameField]
  log('create', type, slugify(name), { cols: cfg.columns })
  return insertItem(db, cfg, data)
}

function insertItem(db, cfg, data) {
  const name = data[cfg.nameField]
  const slug = slugify(name)
  const cols = [...cfg.columns, 'slug']
  const placeholders = cols.map(() => '?').join(', ')
  const values = cols.map(c => {
    if (cfg.jsonCols?.includes(c)) return JSON.stringify(data[c] || [])
    if (c === 'slug') return slug
    return data[c] ?? null
  })
  db.prepare(`INSERT INTO ${cfg._type} (${cols.join(', ')}) VALUES (${placeholders})`).run(...values)
  return db.prepare(`SELECT * FROM ${cfg._type} WHERE slug = ?`).get(slug)
}

function splitList(v) {
  if (v === null || v === undefined) return []
  if (Array.isArray(v)) return v.map(x => String(x).trim()).filter(Boolean)
  return String(v)
    .split(/[,\n;]/)
    .map(x => x.trim())
    .filter(Boolean)
}

function boolToInt(v, fallback = 0) {
  if (v === true || v === 1 || v === '1') return 1
  if (v === false || v === 0 || v === '0') return 0
  const s = String(v ?? '').trim().toLowerCase()
  if (['yes', 'y', 'true', 'on'].includes(s)) return 1
  if (['no', 'n', 'false', 'off', ''].includes(s)) return 0
  return fallback
}

function coerceValue(col, v) {
  switch (col) {
    case 'showPrice':
      return boolToInt(v, 1)
    case 'quantity': {
      const n = parseInt(v, 10)
      return Number.isFinite(n) ? n : 0
    }
    case 'price':
      return v === '' || v === null || v === undefined ? '0' : String(v)
    default:
      return v
  }
}

export const bulkColumns = {
  products: ['name', 'price', 'showPrice', 'category', 'subcategory', 'description', 'images', 'amazonUrl', 'quantity'],
  livestock: ['name', 'scientificName', 'type', 'difficulty', 'minTankSize', 'maxSize', 'temperament', 'price', 'showPrice', 'description', 'images', 'quantity'],
  projects: ['title', 'date', 'description', 'images', 'tags'],
}

export async function bulkCreateItems(type, rows) {
  const cfg = schemas[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const db = getDB()
  const created = []
  const skipped = []
  const seen = new Set()

  const tx = db.transaction(() => {
    rows.forEach((raw, i) => {
      const nameField = cfg.nameField
      const name = String(raw[nameField] ?? '').trim()
      if (!name) {
        skipped.push({ row: i + 2, reason: 'missing required field' })
        return
      }
      const slug = slugify(name)
      if (!slug) {
        skipped.push({ row: i + 2, name, reason: 'invalid name' })
        return
      }
      if (seen.has(slug)) {
        skipped.push({ row: i + 2, name, reason: 'duplicate row in file' })
        return
      }
      const exists = db.prepare(`SELECT 1 FROM ${type} WHERE slug = ?`).get(slug)
      if (exists) {
        skipped.push({ row: i + 2, name, reason: 'already exists' })
        return
      }
      seen.add(slug)

      const data = { ...raw, [nameField]: name }
      for (const jc of cfg.jsonCols || []) data[jc] = splitList(raw[jc])
      for (const col of cfg.columns) {
        if (data[col] !== undefined) data[col] = coerceValue(col, data[col])
      }
      const item = insertItem(db, cfg, data)
      created.push({ row: i + 2, name: item[nameField], slug: item.slug })
    })
  })

  tx()
  log('bulkCreate', type, `created=${created.length} skipped=${skipped.length} of ${rows.length}`)
  return { type, total: rows.length, created, skipped }
}

export async function updateItem(type, slug, data) {
  const cfg = schemas[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const db = getDB()

  const existing = db.prepare(`SELECT * FROM ${type} WHERE slug = ?`).get(slug)
  if (!existing) throw new Error(`Item not found: ${slug}`)

  const setCols = cfg.columns.filter(c => data[c] !== undefined)
  const nameField = cfg.nameField
  let newSlug = null
  if (data[nameField] !== undefined && existing[nameField] !== data[nameField]) {
    newSlug = slugify(data[nameField])
    if (!newSlug || newSlug === slug) newSlug = null
  }
  if (newSlug) setCols.push('slug')

  log('update', type, slug, { setCols })

  const setClause = setCols.map(c => `${c} = ?`).join(', ')
  const values = setCols.map(c => {
    if (c === 'slug') return newSlug
    if (cfg.jsonCols?.includes(c)) return JSON.stringify(data[c] || [])
    return data[c]
  })

  db.prepare(`UPDATE ${type} SET ${setClause} WHERE slug = ?`).run(...values, slug)
  return db.prepare(`SELECT * FROM ${type} WHERE slug = ?`).get(newSlug || slug)
}

export async function deleteItem(type, slug) {
  const cfg = schemas[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const db = getDB()
  const result = db.prepare(`DELETE FROM ${type} WHERE slug = ?`).run(slug)
  if (result.changes === 0) {
    log('delete', type, `NOT FOUND: ${slug}`)
    throw new Error(`Item not found: ${slug}`)
  }
  log('delete', type, slug, 'OK')
  return { deleted: true }
}

export async function listCategories() {
  const db = getDB()
  return db.prepare('SELECT * FROM categories ORDER BY name').all()
}

export async function createCategory(data) {
  const db = getDB()
  const label = data.label || data.name
  const name = slugify(label)
  const existing = db.prepare('SELECT name FROM categories WHERE name = ?').get(name)
  if (existing) throw new Error(`Category "${name}" already exists`)
  db.prepare('INSERT INTO categories (name, label) VALUES (?, ?)').run(name, label)
  return { name, label }
}

export async function updateCategory(oldName, data) {
  const db = getDB()
  const label = (data.label || data.name || '').trim()
  if (!label) throw new Error('Label is required')
  const name = slugify(label)
  const existing = db.prepare('SELECT name FROM categories WHERE name = ?').get(name)
  if (existing && existing.name !== oldName) throw new Error(`Category "${name}" already exists`)
  if (name !== oldName) {
    db.prepare('UPDATE categories SET name = ?, label = ? WHERE name = ?').run(name, label, oldName)
    db.prepare('UPDATE subcategories SET category = ? WHERE category = ?').run(name, oldName)
    db.prepare('UPDATE products SET category = ? WHERE category = ?').run(name, oldName)
  } else {
    db.prepare('UPDATE categories SET label = ? WHERE name = ?').run(label, oldName)
  }
  return { name, label }
}

export async function deleteCategory(name) {
  const db = getDB()
  const result = db.prepare('DELETE FROM categories WHERE name = ?').run(name)
  if (result.changes === 0) throw new Error(`Category not found: ${name}`)
  return { deleted: true }
}

export async function listSubcategories() {
  const db = getDB()
  return db.prepare('SELECT * FROM subcategories ORDER BY category, name').all()
}

export async function createSubcategory(data) {
  const db = getDB()
  const category = data.category || data.parent
  if (!category) throw new Error('Category is required')
  const label = data.label || data.name
  const name = slugify(label)
  const existing = db.prepare('SELECT name FROM subcategories WHERE name = ? AND category = ?').get(name, category)
  if (existing) throw new Error(`Subcategory "${name}" already exists under "${category}"`)
  db.prepare('INSERT INTO subcategories (name, label, category) VALUES (?, ?, ?)').run(name, label, category)
  return { name, label, category }
}

export async function updateSubcategory(name, category, data) {
  const db = getDB()
  const label = (data.label || data.name || '').trim()
  if (!label) throw new Error('Label is required')
  const newName = slugify(label)
  const existing = db.prepare('SELECT name FROM subcategories WHERE name = ? AND category = ?').get(newName, category)
  if (existing && existing.name !== name) throw new Error(`Subcategory "${newName}" already exists under "${category}"`)
  if (newName !== name) {
    db.prepare('UPDATE subcategories SET name = ?, label = ? WHERE name = ? AND category = ?').run(newName, label, name, category)
    db.prepare('UPDATE products SET subcategory = ? WHERE subcategory = ? AND category = ?').run(newName, name, category)
  } else {
    db.prepare('UPDATE subcategories SET label = ? WHERE name = ? AND category = ?').run(label, name, category)
  }
  return { name: newName, label, category }
}

export async function deleteSubcategory(name, category) {
  const db = getDB()
  const result = db.prepare('DELETE FROM subcategories WHERE name = ? AND category = ?').run(name, category || '')
  if (result.changes === 0) throw new Error(`Subcategory not found: ${name}`)
  db.prepare(`UPDATE products SET subcategory = '' WHERE subcategory = ? AND category = ?`).run(name, category || '')
  return { deleted: true }
}

export async function deleteSubcategoriesByCategory(category) {
  const db = getDB()
  db.prepare('DELETE FROM subcategories WHERE category = ?').run(category)
  db.prepare(`UPDATE products SET subcategory = '' WHERE category = ?`).run(category)
  return { deleted: true }
}

export const backupTables = {
  categories: ['name', 'label'],
  subcategories: ['name', 'label', 'category'],
  products: ['name', 'slug', 'price', 'showPrice', 'category', 'subcategory', 'description', 'images', 'amazonUrl', 'quantity'],
  livestock: ['name', 'slug', 'scientificName', 'type', 'difficulty', 'minTankSize', 'maxSize', 'temperament', 'price', 'showPrice', 'description', 'images', 'quantity'],
  projects: ['title', 'slug', 'date', 'description', 'images', 'tags'],
  shop_info: ['key', 'value'],
}

export async function getBackupData() {
  const db = getDB()
  const result = {}
  for (const [table, cols] of Object.entries(backupTables)) {
    result[table] = db.prepare(`SELECT ${cols.join(', ')} FROM ${table}`).all()
  }
  return result
}

export async function restoreData(backup) {
  const db = getDB()
  const clearOrder = ['shop_info', 'projects', 'livestock', 'products', 'subcategories', 'categories']

  const run = db.transaction(() => {
    for (const table of clearOrder) {
      db.prepare(`DELETE FROM ${table}`).run()
    }
    db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('products', 'livestock', 'projects', 'subcategories')").run()

    for (const [table, cols] of Object.entries(backupTables)) {
      const rows = backup[table]
      if (!Array.isArray(rows) || rows.length === 0) continue
      const stmt = db.prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
      for (const row of rows) {
        const values = cols.map(c => {
          let v = row[c]
          if (v === undefined || v === null) return null
          if (typeof v === 'object') v = JSON.stringify(v)
          return v
        })
        stmt.run(...values)
      }
    }
  })

  run()
  return { restored: true }
}

export { slugify }
