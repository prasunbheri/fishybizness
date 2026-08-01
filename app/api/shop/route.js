import { getShopInfo } from '@/lib/data'

export async function GET() {
  try {
    const shop = await getShopInfo()
    return Response.json(shop)
  } catch (e) {
    console.error('[shop] FAILED', e.message)
    return Response.json({ error: e.message }, { status: 500 })
  }
}
