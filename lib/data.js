import { getDB, parseJSON } from './db'

function log(op, msg, extra) {
  console.error(`[data] ${op} ${msg}`, extra ? JSON.stringify(extra) : '')
}

export async function getProjects() {
  const db = getDB()
  const rows = db.prepare('SELECT * FROM projects ORDER BY date DESC').all()
  log('getProjects', `${rows.length} rows`)
  return rows.map(r => ({ ...r, images: parseJSON(r.images), tags: parseJSON(r.tags) }))
}

export async function getProject(slug) {
  const db = getDB()
  const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug)
  if (!row) { log('getProject', `NOT FOUND: ${slug}`); return null }
  return { ...row, images: parseJSON(row.images), tags: parseJSON(row.tags) }
}

export async function getProducts() {
  const db = getDB()
  const rows = db.prepare('SELECT * FROM products ORDER BY name').all()
  log('getProducts', `${rows.length} rows`)
  return rows.map(r => ({ ...r, images: parseJSON(r.images) }))
}

export async function getProduct(slug) {
  const db = getDB()
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug)
  if (!row) { log('getProduct', `NOT FOUND: ${slug}`); return null }
  return { ...row, images: parseJSON(row.images) }
}

export async function getShopInfo() {
  const db = getDB()
  const row = db.prepare("SELECT value FROM shop_info WHERE key = 'shop'").get()
  if (!row) { log('getShopInfo', 'NOT FOUND'); return {} }
  return JSON.parse(row.value)
}

export async function getCategories() {
  const db = getDB()
  const rows = db.prepare('SELECT * FROM categories ORDER BY name').all()
  log('getCategories', `${rows.length} rows`)
  return rows
}

export async function getSubcategories() {
  const db = getDB()
  const rows = db.prepare('SELECT * FROM subcategories ORDER BY category, name').all()
  log('getSubcategories', `${rows.length} rows`)
  return rows
}

export async function getLivestock() {
  const db = getDB()
  const rows = db.prepare('SELECT * FROM livestock ORDER BY name').all()
  log('getLivestock', `${rows.length} rows`)
  return rows.map(r => ({ ...r, images: parseJSON(r.images) }))
}

export async function getLivestockItem(slug) {
  const db = getDB()
  const row = db.prepare('SELECT * FROM livestock WHERE slug = ?').get(slug)
  if (!row) { log('getLivestockItem', `NOT FOUND: ${slug}`); return null }
  return { ...row, images: parseJSON(row.images) }
}

export async function getLivestockTypes() {
  const db = getDB()
  const rows = db.prepare('SELECT DISTINCT type FROM livestock ORDER BY type').all()
  log('getLivestockTypes', `${rows.length} types`)
  return rows.map(r => r.type)
}
