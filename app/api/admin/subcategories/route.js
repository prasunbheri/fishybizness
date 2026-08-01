import { checkAuth } from '@/lib/auth'
import { listSubcategories, createSubcategory } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await checkAuth()
  if (!session) { console.error('[subcategories] GET Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const items = await listSubcategories()
    console.error(`[subcategories] GET ${items.length} subcategories`)
    return Response.json(items)
  } catch (e) {
    console.error('[subcategories] GET FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(request) {
  const session = await checkAuth()
  if (!session) { console.error('[subcategories] POST Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const data = await request.json()
    if (!data.category) {
      return Response.json({ error: 'Category is required' }, { status: 400 })
    }
    if (!data.name && !data.label) {
      return Response.json({ error: 'Name or label is required' }, { status: 400 })
    }
    console.error('[subcategories] POST creating', data.name || data.label, 'under', data.category)
    const item = await createSubcategory(data)
    revalidatePath('/products', 'page')
    revalidatePath('/', 'page')
    console.error('[subcategories] POST created', item.name)
    return Response.json(item, { status: 201 })
  } catch (e) {
    console.error('[subcategories] POST FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
