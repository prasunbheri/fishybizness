import { getDB } from '@/lib/db'

export async function POST(request) {
  try {
    const { type, slug } = await request.json()
    const table = type === 'product' ? 'products' : type === 'project' ? 'projects' : type === 'livestock' ? 'livestock' : null
    if (!table || !slug) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }
    const db = getDB()
    const result = db.prepare(`UPDATE ${table} SET views = views + 1 WHERE slug = ?`).run(slug)
    console.error(`[view] ${type} ${slug}`, result.changes ? '+1' : 'not found')
    return Response.json({ ok: true })
  } catch (e) {
    console.error('[view] FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
