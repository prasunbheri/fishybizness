import { checkAuth } from '@/lib/auth'

export async function GET() {
  const session = await checkAuth()
  if (!session) {
    return Response.json({ authenticated: false }, { status: 401 })
  }
  return Response.json({ authenticated: true, user: session.user })
}
