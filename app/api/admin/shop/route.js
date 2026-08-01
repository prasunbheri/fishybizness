import { checkAuth } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = getDB()
    const row = db.prepare("SELECT value FROM shop_info WHERE key = 'shop'").get()
    if (!row) return Response.json({ error: 'Shop info not found' }, { status: 404 })
    return Response.json(JSON.parse(row.value))
  } catch (e) {
    console.error('[admin/shop] GET FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(request) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await request.json()
    const db = getDB()
    db.prepare("UPDATE shop_info SET value = ? WHERE key = 'shop'").run(JSON.stringify(data))
    console.error('[admin/shop] PUT saved', { name: data.shopName, email: data.email, phone: data.phone })
    revalidatePath('/', 'page')
    revalidatePath('/contact', 'page')
    revalidatePath('/api/shop', 'page')
    return Response.json(data)
  } catch (e) {
    console.error('[admin/shop] PUT FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
