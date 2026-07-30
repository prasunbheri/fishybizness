import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const TOKEN_NAME = 'admin_token'

function base64URLEncode(str) {
  return Buffer.from(str).toString('base64url')
}

function base64URLDecode(str) {
  return Buffer.from(str, 'base64url').toString()
}

export function createToken(username) {
  const payload = {
    user: username,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }
  const data = base64URLEncode(JSON.stringify(payload))
  const secret = process.env.ADMIN_SECRET || 'default-secret'
  const hmac = base64URLEncode(
    require('crypto').createHmac('sha256', secret).update(data).digest('hex')
  )
  return `${data}.${hmac}`
}

function verifyToken(token) {
  try {
    const [data, sig] = token.split('.')
    const secret = process.env.ADMIN_SECRET || 'default-secret'
    const expectedSig = base64URLEncode(
      require('crypto').createHmac('sha256', secret).update(data).digest('hex')
    )
    if (sig !== expectedSig) return null
    const payload = JSON.parse(base64URLDecode(data))
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export function requireAdmin(session) {
  if (!session) {
    redirect('/admin/login')
  }
}

export function validateCredentials(username, password) {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  )
}

export { TOKEN_NAME }
