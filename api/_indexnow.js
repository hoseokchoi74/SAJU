// IndexNow(Bing・Yandex・Naver など。ChatGPT の検索は Bing の索引を使う)へ、サイトの全URLを通知する。
// キーは所有確認用に公開する値で、/<KEY>.txt に同じ文字列を置いている(public/)。
// "_" で始まるファイルは Vercel の API ルートにならない。
export const INDEXNOW_KEY = 'ab8eba909c62e8e69e306e2332b172e8'
const SITE = 'https://koyomisaju.com'

export async function submitSitemapToIndexNow() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!urlList.length) throw new Error('sitemap.xml から URL を取得できませんでした')
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: 'koyomisaju.com', key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList }),
  })
  // 200: 受理 / 202: 受理(キー確認待ち)
  return { status: res.status, count: urlList.length, body: (await res.text()).slice(0, 200) }
}
