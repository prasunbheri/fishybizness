import { checkAuth } from '@/lib/auth'
import { getBackupData, restoreData, backupTables } from '@/lib/admin-data'
import ExcelJS from 'exceljs'
import { revalidatePath } from 'next/cache'

function log(msg, extra) {
  console.error(`[backup] ${msg}`, extra ? JSON.stringify(extra) : '')
}

export async function GET() {
  const session = await checkAuth()
  if (!session) { log('GET Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const data = await getBackupData()
    const wb = new ExcelJS.Workbook()
    for (const [table, cols] of Object.entries(backupTables)) {
      const ws = wb.addWorksheet(table)
      ws.addRow(cols)
      for (const row of data[table] || []) {
        ws.addRow(cols.map(c => (row[c] === null || row[c] === undefined ? '' : row[c])))
      }
    }
    const buffer = await wb.xlsx.writeBuffer()
    const filename = `fishybizness-backup-${new Date().toISOString().slice(0, 10)}.xlsx`
    log(`GET exported ${Object.values(data).reduce((n, r) => n + r.length, 0)} rows`)
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (e) {
    log('GET FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}

export async function POST(request) {
  const session = await checkAuth()
  if (!session) { log('POST Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file) return Response.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.load(buffer)

    const backup = {}
    for (const [table, cols] of Object.entries(backupTables)) {
      const ws = wb.getWorksheet(table)
      if (!ws) continue
      const rows = []
      ws.eachRow((row, rowNum) => {
        if (rowNum === 1) return
        const obj = {}
        let empty = true
        cols.forEach((c, i) => {
          let v = row.getCell(i + 1).value
          if (v === null || v === undefined) v = ''
          else if (typeof v === 'object' && v.richText) v = v.richText.map(t => t.text).join('')
          else if (typeof v === 'object' && v.text !== undefined) v = v.text
          else if (typeof v === 'object' && v.result !== undefined) v = v.result
          else if (typeof v === 'object') v = String(v)
          obj[c] = v
          if (String(v).trim() !== '') empty = false
        })
        if (!empty) rows.push(obj)
      })
      backup[table] = rows
    }

    log(`POST restoring`, Object.fromEntries(Object.entries(backup).map(([k, v]) => [k, v.length])))
    const result = await restoreData(backup)
    revalidatePath('/', 'page')
    revalidatePath('/products', 'page')
    revalidatePath('/livestock', 'page')
    revalidatePath('/projects', 'page')
    log('POST restored OK')
    return Response.json(result)
  } catch (e) {
    log('POST FAILED', { error: e.message })
    return Response.json({ error: e.message }, { status: 400 })
  }
}
