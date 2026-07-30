import { validateCredentials, createToken, TOKEN_NAME } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    const { username, password } = await request.json()
    if (!validateCredentials(username, password)) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const token = createToken(username)
    const cookieStore = await cookies()
    cookieStore.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
