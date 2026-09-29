// 毎月1日、再デプロイ(api/redeploy.js)の1時間後に Vercel Cron から呼ばれ、全URLを IndexNow に通知する。
import { submitSitemapToIndexNow } from './_indexnow.js'

export async function GET(request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return Response.json({ ok: false, error: 'CRON_SECRET が未設定' }, { status: 500 })
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  try {
    const r = await submitSitemapToIndexNow()
    console.log(`indexnow: ${r.status} urls=${r.count} ${r.body}`)
    const ok = r.status === 200 || r.status === 202
    return Response.json({ ok, ...r }, { status: ok ? 200 : 502 })
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 502 })
  }
}
