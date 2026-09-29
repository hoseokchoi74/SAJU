// ページ一覧と各ページのメタ情報。ビルド時の事前レンダリング(scripts/prerender.mjs)とクライアントの両方で使う。

export const SITE = 'https://koyomisaju.com'

/** 干支ページのURL(動物名のローマ字) */
export const ZODIAC_SLUGS = ['nezumi', 'ushi', 'tora', 'usagi', 'tatsu', 'hebi', 'uma', 'hitsuji', 'saru', 'tori', 'inu', 'inoshishi']

const ZODIAC_JA = [
  ['子', 'ね', 'ねずみ'], ['丑', 'うし', 'うし'], ['寅', 'とら', 'とら'], ['卯', 'う', 'うさぎ'],
  ['辰', 'たつ', 'たつ'], ['巳', 'み', 'へび'], ['午', 'うま', 'うま'], ['未', 'ひつじ', 'ひつじ'],
  ['申', 'さる', 'さる'], ['酉', 'とり', 'とり'], ['戌', 'いぬ', 'いぬ'], ['亥', 'い', 'いのしし'],
]

/** 暦ページを出す年 */
export const YEARS = [2026, 2027]

/** 月別運勢ページの範囲(公開済みのURLを消さないよう開始月は固定) */
const FIRST_MONTH = { year: 2026, month: 10 }
const LAST_MONTH = { year: 2027, month: 12 }

export interface YM {
  year: number
  month: number
}

export function monthList(): YM[] {
  const out: YM[] = []
  for (let { year, month } = FIRST_MONTH; year * 12 + month <= LAST_MONTH.year * 12 + LAST_MONTH.month; ) {
    out.push({ year, month })
    month++
    if (month > 12) {
      month = 1
      year++
    }
  }
  return out
}

export const ymSlug = ({ year, month }: YM) => `${year}-${String(month).padStart(2, '0')}`

export function shiftYM({ year, month }: YM, n: number): YM {
  const i = year * 12 + (month - 1) + n
  return { year: Math.floor(i / 12), month: (i % 12) + 1 }
}

export const hasMonth = (ym: YM) => monthList().some((m) => m.year === ym.year && m.month === ym.month)

export type Route =
  | { page: 'home' }
  | { page: 'about' }
  | { page: 'kichijitsu'; year: number }
  | { page: 'rokuyo'; year: number }
  | { page: 'unsei'; ym: YM }
  | { page: 'eto'; branch: number; ym: YM }
  | { page: 'notfound' }

export function pathOf(r: Route): string {
  switch (r.page) {
    case 'home':
      return '/'
    case 'about':
      return '/about'
    case 'kichijitsu':
      return `/kichijitsu/${r.year}`
    case 'rokuyo':
      return `/rokuyo/${r.year}`
    case 'unsei':
      return `/unsei/${ymSlug(r.ym)}`
    case 'eto':
      return `/eto/${ZODIAC_SLUGS[r.branch]}/${ymSlug(r.ym)}`
    default:
      return '/404'
  }
}

export function resolve(path: string): Route {
  const p = path.replace(/\.html$/, '').replace(/\/+$/, '') || '/'
  if (p === '/') return { page: 'home' }
  if (p === '/about') return { page: 'about' }
  let m = p.match(/^\/(kichijitsu|rokuyo)\/(\d{4})$/)
  if (m && YEARS.includes(+m[2])) return { page: m[1] as 'kichijitsu' | 'rokuyo', year: +m[2] }
  m = p.match(/^\/unsei\/(\d{4})-(\d{2})$/)
  if (m && hasMonth({ year: +m[1], month: +m[2] })) return { page: 'unsei', ym: { year: +m[1], month: +m[2] } }
  m = p.match(/^\/eto\/([a-z]+)\/(\d{4})-(\d{2})$/)
  if (m && ZODIAC_SLUGS.includes(m[1]) && hasMonth({ year: +m[2], month: +m[3] }))
    return { page: 'eto', branch: ZODIAC_SLUGS.indexOf(m[1]), ym: { year: +m[2], month: +m[3] } }
  return { page: 'notfound' }
}

/** 事前レンダリングするページ(トップは日付に依存する部分だけクライアントで描画) */
export function staticRoutes(): Route[] {
  const out: Route[] = [{ page: 'home' }, { page: 'about' }]
  for (const year of YEARS) out.push({ page: 'kichijitsu', year }, { page: 'rokuyo', year })
  for (const ym of monthList()) {
    out.push({ page: 'unsei', ym })
    for (let b = 0; b < 12; b++) out.push({ page: 'eto', branch: b, ym })
  }
  return out
}

export interface Meta {
  title: string
  description: string
  canonical: string
}

export function metaOf(r: Route): Meta {
  const canonical = SITE + (r.page === 'home' ? '/' : pathOf(r))
  switch (r.page) {
    case 'kichijitsu':
      return {
        title: `${r.year}年の吉日カレンダー｜一粒万倍日・天赦日・寅の日・巳の日・大安の一覧｜こよみサジュ`,
        description: `${r.year}年(令和${r.year - 2018}年)の一粒万倍日・天赦日・寅の日・巳の日・己巳の日・大安を月別に一覧で。天赦日と一粒万倍日が重なる最強開運日もひと目でわかります。`,
        canonical,
      }
    case 'rokuyo':
      return {
        title: `${r.year}年の六曜カレンダー｜大安・仏滅・友引がひと目でわかる｜こよみサジュ`,
        description: `${r.year}年(令和${r.year - 2018}年)の六曜(大安・赤口・先勝・友引・先負・仏滅)を月別カレンダーで。大安の日の一覧と、六曜それぞれの意味・良い時間帯も解説します。`,
        canonical,
      }
    case 'unsei':
      return {
        title: `${r.ym.year}年${r.ym.month}月の干支別運勢ランキング｜韓国式四柱推命×六曜｜こよみサジュ`,
        description: `${r.ym.year}年${r.ym.month}月の運勢を十二支(干支)別にランキング。開運日・注意日、ラッキーカラーと方位も。韓国式四柱推命と六曜で読み解きます。`,
        canonical,
      }
    case 'eto': {
      const [k, yomi, animal] = ZODIAC_JA[r.branch]
      return {
        title: `${k}年(${yomi}どし・${animal})生まれ ${r.ym.year}年${r.ym.month}月の運勢｜開運日・注意日｜こよみサジュ`,
        description: `${k}年(${animal}年)生まれの${r.ym.year}年${r.ym.month}月の運勢。今月の開運日と注意日、開運アクション、ラッキーカラー・方位を韓国式四柱推命×六曜で。`,
        canonical,
      }
    }
    case 'about':
      return {
        title: 'こよみサジュとは｜計算方法・暦データの出典｜こよみサジュ',
        description: 'こよみサジュの占いの仕組み(韓国式四柱推命×六曜・選日)と、国立天文台の暦要項・韓国天文研究院の万歳暦にもとづく暦計算、検証方法をまとめています。',
        canonical,
      }
    default:
      return {
        title: 'こよみサジュ｜韓国式四柱推命×六曜の開運ごよみ',
        description: '韓国式四柱推命と六曜で、あなたの開運日と今月の運勢がわかる無料占いサイト。干支別運勢ランキング・開運カレンダーも毎月更新。',
        canonical,
      }
  }
}

/** ナビゲーション用: ビルド時点の年・月に一番近い公開ページ */
declare const __BUILD_DATE__: string
export function currentLinks() {
  const d = new Date(__BUILD_DATE__)
  const now = { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 }
  const months = monthList()
  const ym = months.find((m) => m.year === now.year && m.month === now.month) ?? months[0]
  const year = YEARS.includes(now.year) ? now.year : YEARS[0]
  return { unsei: pathOf({ page: 'unsei', ym }), kichijitsu: pathOf({ page: 'kichijitsu', year }), rokuyo: pathOf({ page: 'rokuyo', year }) }
}
