import { checkAuth } from '@/lib/auth'
import { deleteCategory } from '@/lib/admin-data'
import { listItems } from '@/lib/admin-data'
import { updateCategory } from '@/lib/admin-data'
import { deleteSubcategoriesByCategory } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

export async function PUT(request, { params }) {
  const session = await checkAuth()
  if (!session) { console.error('[categories] PUT Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { name } = await params
  try {
    const data = await request.json()
    console.error('[categories] PUT renaming', name)
    const item = await updateCategory(name, data)
    revalidatePath('/products', 'page')
    revalidatePath('/', 'page')
    console.error('[categories] PUT renamed to', item.name)
    return Response.json(item)
  } catch (e) {
    console.error('[categories] PUT FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  const session = await checkAuth()
  if (!session) { console.error('[categories] DELETE Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { name } = await params
  console.error('[categories] DELETE', name)
  try {
    const products = await listItems('products')
    const affected = products.filter(p => p.category === name)
    if (affected.length) {
      console.error(`[categories] DELETE blocked: ${affected.length} products use "${name}"`)
      return Response.json({
        error: `Cannot delete "${name}" — ${affected.length} product(s) use this category`,
        products: affected.map(p => ({ slug: p.slug, name: p.name, category: p.category })),
      }, { status: 400 })
    }
    await deleteCategory(name)
    await deleteSubcategoriesByCategory(name)
    revalidatePath('/products', 'page')
    revalidatePath('/', 'page')
    console.error('[categories] DELETE OK', name)
    return Response.json({ deleted: true })
  } catch (e) {
    console.error('[categories] DELETE FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
