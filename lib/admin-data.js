import { promises as fs } from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

async function readJSON(filename) {
  const filePath = path.join(contentDir, filename)
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

async function writeJSON(filename, data) {
  const filePath = path.join(contentDir, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n')
}

const idMap = {
  livestock: { file: 'livestock.json', nameField: 'name', idField: 'id' },
  products: { file: 'products.json', nameField: 'name', idField: 'id' },
  projects: { file: 'projects.json', nameField: 'title', idField: 'id' },
}

export async function listItems(type) {
  const cfg = idMap[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  return await readJSON(cfg.file)
}

export async function getItem(type, slug) {
  const items = await listItems(type)
  return items.find(i => i.slug === slug) || null
}

export async function createItem(type, data) {
  const cfg = idMap[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const items = await readJSON(cfg.file)

  const name = data[cfg.nameField]
  const slug = slugify(name)
  const maxId = items.reduce((max, i) => Math.max(max, i[cfg.idField] || 0), 0)

  const item = {
    ...data,
    id: maxId + 1,
    slug,
  }

  items.push(item)
  await writeJSON(cfg.file, items)
  return item
}

export async function updateItem(type, slug, data) {
  const cfg = idMap[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const items = await readJSON(cfg.file)
  const idx = items.findIndex(i => i.slug === slug)
  if (idx === -1) throw new Error(`Item not found: ${slug}`)

  const updated = { ...items[idx], ...data }
  if (data[cfg.nameField]) {
    updated.slug = slugify(data[cfg.nameField])
  }

  items[idx] = updated
  await writeJSON(cfg.file, items)
  return updated
}

export async function deleteItem(type, slug) {
  const cfg = idMap[type]
  if (!cfg) throw new Error(`Unknown type: ${type}`)
  const items = await readJSON(cfg.file)
  const filtered = items.filter(i => i.slug !== slug)
  if (filtered.length === items.length) throw new Error(`Item not found: ${slug}`)
  await writeJSON(cfg.file, filtered)
  return { deleted: true }
}

export { slugify }
