import { checkAuth } from '@/lib/auth'
import { getItem, updateItem, deleteItem } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

export async function GET(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, slug } = await params
  try {
    const item = await getItem(type, slug)
    if (!item) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(item)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, slug } = await params
  try {
    const data = await request.json()
    const item = await updateItem(type, slug, data)
    revalidatePath(`/${type}`, 'page')
    revalidatePath(`/${type}/${slug}`, 'page')
    revalidatePath('/', 'page')
    return Response.json(item)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, slug } = await params
  try {
    const result = await deleteItem(type, slug)
    revalidatePath(`/${type}`, 'page')
    revalidatePath('/', 'page')
    return Response.json(result)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}
