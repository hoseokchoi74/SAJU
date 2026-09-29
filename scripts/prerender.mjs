// ビルド後に全ページを静的HTMLとして書き出し、sitemap.xml・llms.txt を生成する。
// 実行: npm run build(vite build → vite build --ssr → このスクリプト)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssr = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href)
const { render, staticRoutes, pathOf, metaOf, SITE, jsonLdOf, llmsTxt, llmsFullTxt } = ssr

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
    html = html.replace(re, () => rep.replace('$1', html.match(re)[1]))
  }
  return html
}

/** 構造化データ(WebPage・パンくず・FAQPage)。</script> の混入を防ぐため < をエスケープ */
function jsonLdTags(route) {
  return jsonLdOf(route)
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ')
}

const routes = staticRoutes()
for (const r of routes) {
  const path = pathOf(r)
  const body = render(path)
  const html = applyMeta(template, metaOf(r))
    .replace('</head>', () => `  ${jsonLdTags(r)}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`)
  if (!html.includes(body)) throw new Error(`#root への差し込みに失敗: ${path}`)
  // /kichijitsu/2026 → dist/kichijitsu/2026.html(vercel.json の cleanUrls で拡張子なしのURLになる)。トップは index.html
  const out = path === '/' ? join(dist, 'index.html') : join(dist, `${path}.html`)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

// sitemap.xml(事前レンダリングした全ページ)
const today = new Date().toISOString().slice(0, 10)
const urls = routes.map((r) => ({
  loc: r.page === 'home' ? `${SITE}/` : SITE + pathOf(r),
  changefreq: r.page === 'home' ? 'daily' : r.page === 'kichijitsu' || r.page === 'rokuyo' || r.page === 'about' ? 'monthly' : 'weekly',
  priority: r.page === 'home' ? '1.0' : r.page === 'eto' ? '0.6' : '0.8',
}))
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
    .join('\n') +
  '\n</urlset>\n'
writeFileSync(join(dist, 'sitemap.xml'), xml)

// AI向けのサイト案内(https://llmstxt.org/)
writeFileSync(join(dist, 'llms.txt'), llmsTxt())
writeFileSync(join(dist, 'llms-full.txt'), llmsFullTxt())

console.log(`prerendered ${routes.length} pages, sitemap ${urls.length} urls, llms.txt`)
