import { checkAuth } from '@/lib/auth'
import { getItem, updateItem, deleteItem } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

function log(method, type, slug, msg, extra) {
  console.error(`[admin/${type}] ${method} ${slug} ${msg}`, extra ? JSON.stringify(extra) : '')
}

export async function GET(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, slug } = await params
  try {
    const item = await getItem(type, slug)
    if (!item) {
      log('GET', type, slug, 'NOT FOUND')
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    log('GET', type, slug, 'found')
    return Response.json(item)
  } catch (e) {
    log('GET', type, slug, 'FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, slug } = await params
  try {
    const data = await request.json()
    log('PUT', type, slug, 'updating')
    const item = await updateItem(type, slug, data)
    revalidatePath(`/${type}`, 'page')
    revalidatePath(`/${type}/${slug}`, 'page')
    revalidatePath('/', 'page')
    log('PUT', type, slug, 'updated')
    return Response.json(item)
  } catch (e) {
    log('PUT', type, slug, 'FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, slug } = await params
  try {
    log('DELETE', type, slug, 'deleting')
    const result = await deleteItem(type, slug)
    revalidatePath(`/${type}`, 'page')
    revalidatePath('/', 'page')
    log('DELETE', type, slug, 'deleted')
    return Response.json(result)
  } catch (e) {
    log('DELETE', type, slug, 'FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}
