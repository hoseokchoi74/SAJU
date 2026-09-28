import { readFileSync, existsSync, writeFileSync } from 'node:fs'
// 使い方: NAOJ の暦要項ページ(rekiyouYY2.html)を $TEMP/naojYYYY2.html に保存してから実行
//   node --experimental-strip-types scripts/gen-setsu-naoj.mts
const dec = new TextDecoder('shift_jis')
const SETSU = [285, 315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255] // 小寒〜大雪
const out: Record<number, string> = {}
for (let y = 2004; y <= 2027; y++) {
  const f = process.env.TEMP + `/naoj${y}2.html`
  if (!existsSync(f)) continue
  const html = dec.decode(readFileSync(f))
  if (!html.includes('二十四節気')) continue
  const txt = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  const re = /(\S+) (\d+)度 (\d+)月(\d+)日 (\d+)時(\d+)分/g
  const found = new Map<number, string>()
  let m: RegExpExecArray | null
  while ((m = re.exec(txt))) {
    const lon = +m[2]
    if (SETSU.includes(lon) && !found.has(lon)) found.set(lon, [m[3], m[4], m[5], m[6]].map((v) => v.padStart(2, '0')).join(''))
  }
  if (found.size !== 12) { console.error('incomplete', y, found.size); continue }
  out[y] = SETSU.map((l) => found.get(l)).join(' ')
}
const years = Object.keys(out).map(Number)
const body = years.map((y) => `  ${y}: '${out[y]}',`).join('\n')
writeFileSync('src/lib/setsu-naoj.ts', `// 国立天文台 暦計算室「暦要項 二十四節気」より、12の節(小寒・立春・啓蟄・清明・立夏・芒種・小暑・立秋・白露・寒露・立冬・大雪)の
// 節入り時刻(日本時間, MMDDhhmm)。https://eco.mtk.nao.ac.jp/koyomi/yoko/
// 範囲外の年は sekki.ts の計算式を使う。
export const NAOJ_SETSU: Record<number, string> = {\n${body}\n}\n`)
console.log('years', years[0], '-', years.at(-1), 'count', years.length)
