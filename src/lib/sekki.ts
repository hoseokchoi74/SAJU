// 節入り時刻の決定。
// 2004〜2027年は国立天文台(NAOJ)の公表値、それ以外は太陽視黄経の計算式を使う。
// ※ manseryeok の節気データは全年同じ固定値で、月柱の切り替わりも年によってずれるため使わない。
import { NAOJ_SETSU } from './setsu-naoj.ts'

const RAD = Math.PI / 180
const DAY = 86400000
const JST = 9 * 3600000
const BRANCHES = '子丑寅卯辰巳午未申酉戌亥'

/** ΔT(TT−UT, 日)。Espenak & Meeus の多項式 */
function deltaT(year: number): number {
  const t = year - 2000
  let sec: number
  if (year < 1961) sec = 29.07 + 0.407 * (year - 1950) - (year - 1950) ** 2 / 233 + (year - 1950) ** 3 / 2547
  else if (year < 1986) sec = 45.45 + 1.067 * (year - 1975) - (year - 1975) ** 2 / 260 - (year - 1975) ** 3 / 718
  else if (year < 2005) sec = 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5
  else sec = 62.92 + 0.32217 * t + 0.005589 * t * t
  return sec / 86400
}

/**
 * 太陽の視黄経(度)。Meeus『Astronomical Algorithms』25章の簡易式。
 * NAOJ 2012〜2027年の480節気と比べ平均 −4.45分早く出るため、時刻側で補正する(残差 ±12分程度)。
 */
export function solarLongitude(jd: number): number {
  const T = (jd + deltaT(2000 + (jd - 2451545) / 365.25) - 2451545) / 36525
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * RAD
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M)
  const omega = (125.04 - 1934.136 * T) * RAD
  return ((((L0 + C - 0.00569 - 0.00478 * Math.sin(omega)) % 360) + 360) % 360)
}

const BIAS_MS = 4.45 * 60000

/** 太陽黄経が target 度になる時刻(UT の ms) */
function timeOfLongitude(target: number, guessMs: number): number {
  let jd = guessMs / DAY + 2440587.5
  for (let i = 0; i < 30; i++) {
    const diff = ((target - solarLongitude(jd) + 540) % 360) - 180
    jd += (diff / 360) * 365.2422
    if (Math.abs(diff) < 1e-8) break
  }
  return (jd - 2440587.5) * DAY + BIAS_MS
}

export interface Setsu {
  /** その節から始まる月の支(小寒=丑, 立春=寅, …, 大雪=子) */
  branch: string
  /** 節入り時刻(UT の ms) */
  ms: number
  /** 節入り日(日本時間)を YYYYMMDD の数値で */
  jstDate: number
  source: 'naoj' | 'calc'
}

const cache = new Map<number, Setsu[]>()

/** その年の12の節(小寒〜大雪)を時刻順に */
export function setsuOfYear(year: number): Setsu[] {
  const hit = cache.get(year)
  if (hit) return hit
  const naoj = NAOJ_SETSU[year]?.split(' ')
  const list: Setsu[] = []
  for (let k = 0; k < 12; k++) {
    let ms: number
    if (naoj) {
      const s = naoj[k]
      // 公表値は分単位(切り捨て)なので30秒を足して中央に寄せる
      ms = Date.UTC(year, +s.slice(0, 2) - 1, +s.slice(2, 4), +s.slice(4, 6), +s.slice(6, 8)) - JST + 30000
    } else {
      ms = timeOfLongitude((285 + 30 * k) % 360, Date.UTC(year, 0, 6) + k * 30.44 * DAY)
    }
    const j = new Date(ms + JST)
    list.push({
      branch: BRANCHES[(k + 1) % 12],
      ms,
      jstDate: j.getUTCFullYear() * 10000 + (j.getUTCMonth() + 1) * 100 + j.getUTCDate(),
      source: naoj ? 'naoj' : 'calc',
    })
  }
  cache.set(year, list)
  return list
}

/** 日本時間の日付が属する節月の支。節入り日は丸ごと新しい月として扱う(日本の選日の慣習) */
export function setsuBranchOfDate(year: number, month: number, day: number): string {
  const key = year * 10000 + month * 100 + day
  let branch = setsuOfYear(year - 1)[11].branch // 前年の大雪(子月)
  for (const s of setsuOfYear(year)) if (s.jstDate <= key) branch = s.branch
  return branch
}

/**
 * ある時刻(UT の ms)の節月と、立春で切り替わる年。四柱推命の年柱・月柱に使う。
 * monthIndex: 寅月=0 … 丑月=11
 */
export function setsuAt(ms: number): { monthIndex: number; sajuYear: number } {
  const y = new Date(ms + JST).getUTCFullYear()
  const all = [...setsuOfYear(y - 1), ...setsuOfYear(y)]
  let idx = -1
  for (let i = 0; i < all.length; i++) if (all[i].ms <= ms) idx = i
  // all[i] の k = i % 12: 小寒=0(丑), 立春=1(寅) … → 寅月=0 に揃える
  const k = idx % 12
  const monthIndex = (k + 11) % 12
  const risshun = setsuOfYear(y)[1].ms
  return { monthIndex, sajuYear: ms < risshun ? y - 1 : y }
}
