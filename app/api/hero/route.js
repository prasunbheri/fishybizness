import { getDB } from '@/lib/db'

export async function GET() {
  try {
    const db = getDB()
    const row = db.prepare("SELECT value FROM shop_info WHERE key = 'hero'").get()
    const data = row ? JSON.parse(row.value) : { type: 'images', images: [], video: null }
    return Response.json(data)
  } catch (e) {
    console.error('[hero] GET FAILED', e.message)
    return Response.json({ type: 'images', images: [], video: null })
  }
}
