import { checkAuth } from '@/lib/auth'
import { listItems, createItem } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

function log(method, type, msg, extra) {
  console.error(`[admin/${type}] ${method} ${msg}`, extra ? JSON.stringify(extra) : '')
}

export async function GET(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type } = await params
  try {
    const items = await listItems(type)
    log('GET', type, `${items.length} items`)
    return Response.json(items)
  } catch (e) {
    log('GET', type, 'FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type } = await params
  try {
    const data = await request.json()
    log('POST', type, 'creating', { name: data.name || data.title })
    const item = await createItem(type, data)
    revalidatePath(`/${type}`, 'page')
    revalidatePath('/', 'page')
    log('POST', type, 'created', { slug: item.slug })
    return Response.json(item, { status: 201 })
  } catch (e) {
    log('POST', type, 'FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}
