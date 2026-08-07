import { checkAuth } from '@/lib/auth'
import { bulkColumns } from '@/lib/admin-data'
import ExcelJS from 'exceljs'

const columnNotes = {
  products: {
    name: 'Required. Product name.',
    price: 'Display price, e.g. 29.99 or ₹2,499 (text is fine).',
    showPrice: '1 or 0 (or yes/no). Whether to show the price on the card. Defaults to 1.',
    category: 'Category name/slug. Leave empty if no category.',
    subcategory: 'Subcategory name under the category. Leave empty if none.',
    description: 'Description. Plain text or HTML.',
    images: 'Comma-separated image URLs or filenames. First image is the cover.',
    amazonUrl: 'Optional affiliate/product link.',
    quantity: 'Stock quantity (number). Defaults to 0.',
  },
  livestock: {
    name: 'Required. Livestock name.',
    scientificName: 'Scientific name, optional.',
    type: 'Type, e.g. Freshwater / Saltwater.',
    difficulty: 'Care difficulty, e.g. Beginner / Intermediate / Advanced.',
    minTankSize: 'Minimum tank size, e.g. 10 gallons or 40L.',
    maxSize: 'Maximum adult size, e.g. 4 inches.',
    temperament: 'Temperament, e.g. Peaceful / Semi-aggressive.',
    price: 'Display price, e.g. 29.99 or ₹2,499 (text is fine).',
    showPrice: '1 or 0 (or yes/no). Whether to show the price on the card. Defaults to 1.',
    description: 'Description. Plain text or HTML.',
    images: 'Comma-separated image URLs or filenames. First image is the cover.',
    quantity: 'Stock quantity (number). Defaults to 0.',
  },
  projects: {
    title: 'Required. Project title.',
    date: 'Date, e.g. 2024-05-01 or May 2024.',
    description: 'Description. Plain text or HTML.',
    images: 'Comma-separated image URLs or filenames. First image is the cover.',
    tags: 'Comma-separated tags, e.g. planted, nano, reef.',
  },
}

function log(msg) {
  console.error(`[bulk-template] ${msg}`)
}

export async function GET(request, { params }) {
  const session = await checkAuth()
  if (!session) { log('Unauthorized'); return Response.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { type } = await params
  const cols = bulkColumns[type]
  if (!cols) { log(`Unknown type: ${type}`); return Response.json({ error: `Unknown type: ${type}` }, { status: 400 }) }

  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(type)
  ws.addRow(cols)

  const header = ws.getRow(1)
  header.font = { bold: true }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF06B6D4' } }
  header.alignment = { vertical: 'middle', horizontal: 'center' }
  header.height = 22
  cols.forEach((c, i) => {
    ws.getColumn(i + 1).width = Math.max(14, c.length + 4)
  })
  ws.views = [{ state: 'frozen', ySplit: 1 }]

  const notes = columnNotes[type] || {}
  const is = wb.addWorksheet('Instructions')
  is.columns = [{ width: 22 }, { width: 80 }]
  is.addRow(['Column', 'How to fill it'])
  is.getRow(1).font = { bold: true }
  is.addRow(['', ''])
  for (const c of cols) {
    is.addRow([c, notes[c] || ''])
  }
  is.addRow(['', ''])
  is.addRow(['Note', 'Fill data starting from row 2. Do not rename or remove the header row.'])
  is.addRow(['Note', 'Rows with an empty required column are skipped and reported after upload.'])
  is.addRow(['Note', 'Uploading the same file twice will skip rows that already exist.'])

  const buffer = await wb.xlsx.writeBuffer()
  const filename = `bulk-${type}-template.xlsx`
  log(`GET template ${filename}`)
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
