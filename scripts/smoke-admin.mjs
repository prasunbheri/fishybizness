import puppeteer from 'puppeteer-core'

const BASE = process.env.BASE_URL || 'http://localhost:3001'
const USER = process.env.ADMIN_USER || 'admin'
const PASS = process.env.ADMIN_PASS || 'fishybizness2024'
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome'
const TYPES = ['livestock', 'products', 'projects']

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  const failures = []
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  page.on('pageerror', e => {
    const msg = e.message.slice(0, 500)
    failures.push(`pageerror: ${msg}`)
    console.error(`  PAGEERROR: ${msg}`)
  })

  try {
    await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle0', timeout: 30000 })
    await page.type('input[type=text]', USER)
    await page.type('input[type=password]', PASS)
    await page.click('button[type=submit]')
    await page.waitForFunction(() => location.pathname === '/admin', { timeout: 20000 })
    console.log(`LOGIN OK @ ${BASE}`)
  } catch (e) {
    failures.push(`login failed: ${e.message}`)
  }

  for (const type of TYPES) {
    let slugs = []
    try {
      slugs = await page.evaluate(async t => {
        const r = await fetch(`/api/admin/${t}`)
        if (!r.ok) return []
        const items = await r.json()
        return Array.isArray(items) ? items.map(i => i.slug).filter(Boolean) : []
      }, type)
    } catch {
      // list fetch failed; continue with create-page check only
    }
    console.log(`\n[${type}] ${slugs.length} items found`)

    for (const slug of slugs) {
      const url = `/admin/${type}/${slug}`
      try {
        await page.goto(BASE + url, { waitUntil: 'networkidle0', timeout: 30000 })
        await page.waitForSelector('[contenteditable]', { timeout: 15000 })
        await sleep(400)
        const content = await page.$eval('[contenteditable]', el => el.innerHTML)
        const hasContent = !/is-empty|ProseMirror-trailingBreak/.test(content)
        const status = await page.evaluate(() => document.body.innerText.includes('This page couldn’t load'))
        console.log(`  OK  ${url} (content: ${hasContent ? 'yes' : 'empty'})`)
        if (status) failures.push(`${url}: page crash screen shown`)
      } catch (e) {
        failures.push(`${url}: ${e.message}`)
        console.error(`  FAIL ${url}: ${e.message}`)
      }
    }

    const createUrl = `/admin/${type}/new`
    try {
      await page.goto(BASE + createUrl, { waitUntil: 'networkidle0', timeout: 30000 })
      await page.waitForSelector('[contenteditable]', { timeout: 15000 })
      console.log(`  OK  ${createUrl}`)
    } catch (e) {
      failures.push(`${createUrl}: ${e.message}`)
      console.error(`  FAIL ${createUrl}: ${e.message}`)
    }
  }

  await browser.close()

  if (failures.length) {
    console.error(`\nSMOKE FAILED: ${failures.length} issue(s)`)
    process.exit(1)
  }
  console.log('\nSMOKE PASSED: all admin edit/create pages loaded without errors')
}

main().catch(e => {
  console.error('SMOKE FAILED:', e.message)
  process.exit(1)
})
