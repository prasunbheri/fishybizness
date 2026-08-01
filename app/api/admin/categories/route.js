import { checkAuth } from '@/lib/auth'
import { listCategories, createCategory } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await checkAuth()
  if (!session) { console.error('[categories] GET Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const items = await listCategories()
    console.error(`[categories] GET ${items.length} categories`)
    return Response.json(items)
  } catch (e) {
    console.error('[categories] GET FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(request) {
  const session = await checkAuth()
  if (!session) { console.error('[categories] POST Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const data = await request.json()
    if (!data.name && !data.label) {
      return Response.json({ error: 'Name or label is required' }, { status: 400 })
    }
    console.error('[categories] POST creating', data.name || data.label)
    const item = await createCategory(data)
    revalidatePath('/products', 'page')
    revalidatePath('/', 'page')
    console.error('[categories] POST created', item.name)
    return Response.json(item, { status: 201 })
  } catch (e) {
    console.error('[categories] POST FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
