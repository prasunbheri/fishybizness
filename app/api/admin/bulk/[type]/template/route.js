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

const exampleRows = {
  products: [
    ['[Example] API Freshwater Master Test Kit', '24.99', 'yes', 'Test Kits', 'Water Testing', 'Liquid test kit for ammonia, nitrite, nitrate and pH.', 'testkit.jpg, https://example.com/testkit-2.png', 'https://example.com/api-master-kit', 12],
    ['[Example] Fluval AquaClear Power Filter', '39.50', 'no', 'Filtration', 'Filters', 'Hang-on-back filter for tanks up to 75 gallons.', 'aqc.png', '', 4],
  ],
  livestock: [
    ['[Example] Neon Tetra', 'Paracheirodon innesi', 'Fish', 'Beginner', '10 gallons', '1.5 inches', 'Peaceful', '1.99', 'yes', 'Small schooling fish — keep in groups of 6+.', 'neon-tetra.jpg', 20],
    ['[Example] Java Fern', 'Microsorum pteropus', 'Plant', 'Easy', '5 gallons', '12 inches', 'Low light', '4.50', 'yes', 'Attach to wood or rock, do not bury the rhizome.', 'java-fern.jpg', 15],
  ],
  projects: [
    ['[Example] 20 Gallon Planted Shrimp Tank', '2024-06-15', 'A low-tech planted tank built for Neocaridina shrimp.', 'tank-front.jpg, tank-detail.jpg', 'planted, shrimp, low-tech'],
    ['[Example] 60G Nano Reef Rebuild', '2024-08-01', 'A mixed reef with soft corals and two clownfish.', 'reef-1.jpg', 'reef, nano, corals'],
  ],
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

  for (const ex of exampleRows[type] || []) {
    const r = ws.addRow(ex)
    r.font = { italic: true, color: { argb: 'FF6B7280' } }
    r.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } }
    })
  }

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
  is.addRow(['Note', 'The grey italic rows at the top of the sheet are EXAMPLES — delete them and add your own data starting from the next row.'])
  is.addRow(['Note', 'Rows whose first column starts with [Example] are always ignored on upload, so you can also just leave them in place.'])
  is.addRow(['Note', 'Do not rename or remove the header row.'])
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
