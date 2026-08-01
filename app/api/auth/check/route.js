import { checkAuth } from '@/lib/auth'

export async function GET() {
  const session = await checkAuth()
  if (!session) {
    console.error('[auth] check FAILED')
    return Response.json({ authenticated: false }, { status: 401 })
  }
  console.error('[auth] check OK', session.user)
  return Response.json({ authenticated: true, user: session.user })
}
