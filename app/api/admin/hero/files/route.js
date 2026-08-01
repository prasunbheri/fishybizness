import { checkAuth } from '@/lib/auth'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(request) {
  const session = await checkAuth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { filePath } = await request.json()
    if (!filePath) return Response.json({ error: 'filePath required' }, { status: 400 })

    const absolute = path.join(process.cwd(), 'public', filePath)
    await unlink(absolute)
    console.error('[hero] DELETE file', filePath)
    return Response.json({ deleted: filePath })
  } catch (e) {
    console.error('[hero] DELETE FAILED', e.message)
    return Response.json({ error: e.message }, { status: 400 })
  }
}
