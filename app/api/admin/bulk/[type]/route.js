import { checkAuth } from '@/lib/auth'
import { bulkCreateItems, bulkColumns } from '@/lib/admin-data'
import ExcelJS from 'exceljs'
import { revalidatePath } from 'next/cache'

function log(type, msg, extra) {
  console.error(`[bulk/${type}] ${msg}`, extra ? JSON.stringify(extra) : '')
}

function normHeader(h) {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function cellText(v) {
  if (v === null || v === undefined) return ''
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'object') {
    if (v.richText) return v.richText.map(t => t.text).join('')
    if (v.text !== undefined) return v.text
    if (v.result !== undefined) return v.result
    return String(v)
  }
  return String(v)
}

export async function POST(request, { params }) {
  const session = await checkAuth()
  if (!session) { log('POST', 'Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { type } = await params
  const cols = bulkColumns[type]
  if (!cols) return Response.json({ error: `Unknown type: ${type}` }, { status: 400 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file) return Response.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.load(buffer)

    const ws = wb.worksheets[0]
    if (!ws) return Response.json({ error: 'Workbook is empty' }, { status: 400 })

    const colIndexByKey = {}
    ws.getRow(1).eachCell((cell, col) => {
      const key = normHeader(cellText(cell.value))
      if (key) colIndexByKey[key] = col
    })
    if (Object.keys(colIndexByKey).length === 0) {
      return Response.json({ error: 'Sheet has no header row' }, { status: 400 })
    }

    const rows = []
    ws.eachRow((row, rowNum) => {
      if (rowNum === 1) return
      const obj = {}
      let empty = true
      for (const col of cols) {
        const idx = colIndexByKey[normHeader(col)]
        if (!idx) continue
        const v = cellText(row.getCell(idx).value)
        obj[col] = v
        if (v.trim() !== '') empty = false
      }
      if (!empty) rows.push(obj)
    })

    if (rows.length === 0) {
      return Response.json({ error: 'No data rows found in the sheet' }, { status: 400 })
    }

    const result = await bulkCreateItems(type, rows)
    revalidatePath('/', 'page')
    revalidatePath(`/${type}`, 'page')
    log('POST', type, `created=${result.created.length} skipped=${result.skipped.length}`, { total: result.total })
    return Response.json(result)
  } catch (e) {
    log('POST', type, 'FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}
