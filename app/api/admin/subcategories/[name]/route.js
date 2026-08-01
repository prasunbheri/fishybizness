import { checkAuth } from '@/lib/auth'
import { deleteSubcategory } from '@/lib/admin-data'
import { updateSubcategory } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

function getCategory(request) {
  const url = new URL(request.url)
  return url.searchParams.get('category') || ''
}

export async function PUT(request, { params }) {
  const session = await checkAuth()
  if (!session) { console.error('[subcategories] PUT Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { name } = await params
  const category = getCategory(request)
  try {
    const data = await request.json()
    console.error('[subcategories] PUT renaming', name, 'under', category)
    const item = await updateSubcategory(name, category, data)
    revalidatePath('/products', 'page')
    revalidatePath('/', 'page')
    console.error('[subcategories] PUT renamed to', item.name)
    return Response.json(item)
  } catch (e) {
    console.error('[subcategories] PUT FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  const session = await checkAuth()
  if (!session) { console.error('[subcategories] DELETE Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { name } = await params
  const category = getCategory(request)
  console.error('[subcategories] DELETE', name, 'under', category)
  try {
    await deleteSubcategory(name, category)
    revalidatePath('/products', 'page')
    revalidatePath('/', 'page')
    console.error('[subcategories] DELETE OK', name)
    return Response.json({ deleted: true })
  } catch (e) {
    console.error('[subcategories] DELETE FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
