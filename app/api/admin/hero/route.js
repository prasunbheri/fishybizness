import { checkAuth } from '@/lib/auth'
import { getDB } from '@/lib/db'

export async function GET() {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = getDB()
    const row = db.prepare("SELECT value FROM shop_info WHERE key = 'hero'").get()
    const data = row ? JSON.parse(row.value) : { type: 'images', images: [], video: null }
    return Response.json(data)
  } catch (e) {
    console.error('[hero] GET FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(request) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const db = getDB()
    const existing = db.prepare("SELECT value FROM shop_info WHERE key = 'hero'").get()

    if (existing) {
      db.prepare("UPDATE shop_info SET value = ? WHERE key = 'hero'").run(JSON.stringify(data))
    } else {
      db.prepare("INSERT INTO shop_info (key, value) VALUES ('hero', ?)").run(JSON.stringify(data))
    }

    console.error('[hero] PUT saved', { type: data.type, images: (data.images || []).length, video: data.video ? 'yes' : 'no' })
    return Response.json(data)
  } catch (e) {
    console.error('[hero] PUT FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
