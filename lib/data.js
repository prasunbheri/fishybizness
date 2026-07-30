import { promises as fs } from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')

async function readJSON(filename) {
  const filePath = path.join(contentDir, filename)
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

export async function getProjects() {
  return await readJSON('projects.json')
}

export async function getProject(slug) {
  const projects = await getProjects()
  return projects.find(p => p.slug === slug) || null
}

export async function getProducts() {
  return await readJSON('products.json')
}

export async function getProduct(slug) {
  const products = await getProducts()
  return products.find(p => p.slug === slug) || null
}

export async function getShopInfo() {
  return await readJSON('shop.json')
}

export async function getCategories() {
  const products = await getProducts()
  const cats = [...new Set(products.map(p => p.category))]
  return cats.sort()
}

export async function getLivestock() {
  return await readJSON('livestock.json')
}

export async function getLivestockItem(slug) {
  const items = await getLivestock()
  return items.find(i => i.slug === slug) || null
}

export async function getLivestockTypes() {
  const items = await getLivestock()
  return [...new Set(items.map(i => i.type))].sort()
}
