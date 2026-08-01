import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  const formData = await request.formData()
  const type = formData.get('type') || 'products'
  const files = formData.getAll('files')

  console.error(`[upload] type=${type} files=${files.length}`)

  const uploadDir = path.join(process.cwd(), 'public', 'images', type)
  await mkdir(uploadDir, { recursive: true })

  const paths = []
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    await writeFile(path.join(uploadDir, filename), buffer)
    paths.push(`/images/${type}/${filename}`)
    console.error(`[upload] wrote ${filename} (${buffer.length} bytes)`)
  }

  return Response.json({ paths })
}
