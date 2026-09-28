// ビルド後に暦・運勢ページを静的HTMLとして書き出し、sitemap.xml を生成する。
// 実行: npm run build(vite build → vite build --ssr → このスクリプト)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssr = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href)
const { render, staticRoutes, pathOf, metaOf, SITE } = ssr

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

/** index.html のタイトル・説明・canonical・OGP をページごとに差し替える */
function applyMeta(html, meta) {
  const swaps = [
    [/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`],
    [/(<meta name="description" content=")[^"]*/, `$1${esc(meta.description)}`],
    [/(<link rel="canonical" href=")[^"]*/, `$1${meta.canonical}`],
    [/(<meta property="og:title" content=")[^"]*/, `$1${esc(meta.title)}`],
    [/(<meta property="og:description" content=")[^"]*/, `$1${esc(meta.description)}`],
    [/(<meta property="og:url" content=")[^"]*/, `$1${meta.canonical}`],
  ]
  for (const [re, rep] of swaps) {
    if (!re.test(html)) throw new Error(`index.html に ${re} が見つかりません`)
    html = html.replace(re, rep)
  }
  return html
}

const routes = staticRoutes()
for (const r of routes) {
  const path = pathOf(r)
  const body = render(path)
  const html = applyMeta(template, metaOf(r)).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  if (!html.includes(body)) throw new Error(`#root への差し込みに失敗: ${path}`)
  // /kichijitsu/2026 → dist/kichijitsu/2026.html(vercel.json の cleanUrls で拡張子なしのURLになる)
  const out = join(dist, `${path}.html`)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

// sitemap.xml(トップ + 事前レンダリングした全ページ)
const today = new Date().toISOString().slice(0, 10)
const urls = [
  { loc: `${SITE}/`, changefreq: 'daily', priority: '1.0' },
  ...routes.map((r) => ({
    loc: SITE + pathOf(r),
    changefreq: r.page === 'kichijitsu' || r.page === 'rokuyo' ? 'monthly' : 'weekly',
    priority: r.page === 'eto' ? '0.6' : '0.8',
  })),
]
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n') +
  '\n</urlset>\n'
writeFileSync(join(dist, 'sitemap.xml'), xml)

console.log(`prerendered ${routes.length} pages, sitemap ${urls.length} urls`)
