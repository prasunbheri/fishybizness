import { checkAuth } from '@/lib/auth'
import { listItems, createItem } from '@/lib/admin-data'
import { revalidatePath } from 'next/cache'

export async function GET(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type } = await params
  try {
    const items = await listItems(type)
    return Response.json(items)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(request, { params }) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { type } = await params
  try {
    const data = await request.json()
    const item = await createItem(type, data)
    revalidatePath(`/${type}`, 'page')
    revalidatePath('/', 'page')
    return Response.json(item, { status: 201 })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}
