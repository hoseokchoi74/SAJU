// 毎月1日に Vercel Cron から呼ばれ、Deploy Hook を叩いて本番を再ビルドする。
// (ナビの「今月の運勢」リンクと sitemap の日付はビルド日時で決まるため)
//
// Vercel の環境変数:
//   DEPLOY_HOOK_URL … Settings → Git → Deploy Hooks で作った URL
//   CRON_SECRET     … 任意の長いランダム文字列。Vercel Cron は Authorization: Bearer <CRON_SECRET> を付けて呼ぶ
export async function GET(request) {
  const secret = process.env.CRON_SECRET
  const hook = process.env.DEPLOY_HOOK_URL
  if (!secret || !hook) {
    return Response.json({ ok: false, error: 'CRON_SECRET または DEPLOY_HOOK_URL が未設定' }, { status: 500 })
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const res = await fetch(hook, { method: 'POST' })
  const body = await res.text()
  console.log(`deploy hook: ${res.status} ${body.slice(0, 200)}`)
  return Response.json({ ok: res.ok, status: res.status }, { status: res.ok ? 200 : 502 })
}
