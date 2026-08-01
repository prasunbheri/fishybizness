import { readFile } from 'fs/promises'
import path from 'path'

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
}

const root = path.join(process.cwd(), 'public', 'images')

export async function GET(request, { params }) {
  const { path: segments } = await params
  const filePath = path.join(root, ...segments)
  if (!filePath.startsWith(root)) {
    return new Response('Not found', { status: 404 })
  }
  try {
    const data = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    return new Response(data, {
      headers: {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=0',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
