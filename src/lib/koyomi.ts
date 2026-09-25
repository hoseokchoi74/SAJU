// こよみ計算エンジン: 万歳暦(manseryeok) + 六曜 + 選日 + 干支の相性スコア
// AIを使わず、すべて規則ベースで計算する。
import { calculateSaju, getGapja, solarToLunar } from '@fullstackfamily/manseryeok'

export const STEMS = '甲乙丙丁戊己庚辛壬癸'
export const BRANCHES = '子丑寅卯辰巳午未申酉戌亥'
export const ROKUYO = ['大安', '赤口', '先勝', '友引', '先負', '仏滅'] as const
export type Rokuyo = (typeof ROKUYO)[number]

export type Element = '木' | '火' | '土' | '金' | '水'
const ELEMENTS: Element[] = ['木', '火', '土', '金', '水']
const STEM_ELEMENT: Element[] = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']
const BRANCH_ELEMENT: Element[] = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水']

export const ELEMENT_LUCK: Record<Element, { color: string; colorName: string; direction: string }> = {
  木: { color: '#3f8f5a', colorName: 'グリーン', direction: '東' },
  火: { color: '#d2452f', colorName: 'レッド', direction: '南' },
  土: { color: '#c79a3b', colorName: 'イエロー', direction: '中央' },
  金: { color: '#b8b3a7', colorName: 'ホワイト', direction: '西' },
  水: { color: '#27406b', colorName: 'ネイビー', direction: '北' },
}

export type Senjitsu = '天赦日' | '一粒万倍日' | '寅の日' | '巳の日' | '己巳の日'

// 月支(節月) → 一粒万倍日となる日支
const ICHIRYU: Record<string, string> = {
  寅: '丑午', 卯: '酉寅', 辰: '子卯', 巳: '卯辰', 午: '巳午', 未: '酉午',
  申: '子未', 酉: '卯申', 戌: '午酉', 亥: '酉戌', 子: '亥子', 丑: '卯子',
}
// 季節(月支) → 天赦日となる日の干支
const TENSHA: Record<string, string> = {
  寅: '戊寅', 卯: '戊寅', 辰: '戊寅', 巳: '甲午', 午: '甲午', 未: '甲午',
  申: '戊申', 酉: '戊申', 戌: '戊申', 亥: '甲子', 子: '甲子', 丑: '甲子',
}

export type DayLuck = 'best' | 'good' | 'normal' | 'caution'

export interface DayInfo {
  year: number
  month: number
  day: number
  weekday: number
  lunar: { month: number; day: number; isLeapMonth: boolean }
  rokuyo: Rokuyo
  yearPillar: string
  monthPillar: string
  dayPillar: string
  senjitsu: Senjitsu[]
  luck: DayLuck
}

export function rokuyoOf(lunarMonth: number, lunarDay: number): Rokuyo {
  return ROKUYO[(lunarMonth + lunarDay) % 6]
}

export function getDayInfo(year: number, month: number, day: number): DayInfo {
  const r = solarToLunar(year, month, day)
  const { yearPillarHanja, monthPillarHanja, dayPillarHanja } = r.gapja
  const rokuyo = rokuyoOf(r.lunar.month, r.lunar.day)
  const monthBranch = monthPillarHanja[1]
  const dayBranch = dayPillarHanja[1]

  const senjitsu: Senjitsu[] = []
  if (TENSHA[monthBranch] === dayPillarHanja) senjitsu.push('天赦日')
  if (ICHIRYU[monthBranch].includes(dayBranch)) senjitsu.push('一粒万倍日')
  if (dayBranch === '寅') senjitsu.push('寅の日')
  if (dayPillarHanja === '己巳') senjitsu.push('己巳の日')
  else if (dayBranch === '巳') senjitsu.push('巳の日')

  let luck: DayLuck = 'normal'
  if (senjitsu.includes('天赦日') || (senjitsu.includes('一粒万倍日') && rokuyo === '大安')) luck = 'best'
  else if (rokuyo === '大安' || senjitsu.length > 0) luck = 'good'
  else if (rokuyo === '仏滅' || rokuyo === '赤口') luck = 'caution'

  return {
    year, month, day,
    weekday: new Date(year, month - 1, day).getDay(),
    lunar: r.lunar,
    rokuyo,
    yearPillar: yearPillarHanja,
    monthPillar: monthPillarHanja,
    dayPillar: dayPillarHanja,
    senjitsu,
    luck,
  }
}

export function getMonthDays(year: number, month: number): DayInfo[] {
  const count = new Date(year, month, 0).getDate()
  return Array.from({ length: count }, (_, i) => getDayInfo(year, month, i + 1))
}

// ---- 干支(十二支)の月運スコア ----

export type Relation = '支合' | '三合' | '比和' | '冲' | '刑' | '害' | '平'

const pairIn = (pairs: number[][], a: number, b: number) =>
  pairs.some((p) => p.includes(a) && p.includes(b) && a !== b)

const LIUHE = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]]
const SANHE = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]]
const HAI = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]]
const XING = [[2, 5], [5, 8], [2, 8], [1, 10], [10, 7], [1, 7], [0, 3]]
const SELF_XING = [4, 6, 9, 11]

export function branchRelation(a: number, b: number): Relation {
  if (a === b) return SELF_XING.includes(a) ? '刑' : '比和'
  if ((a + 6) % 12 === b) return '冲'
  if (pairIn(LIUHE, a, b)) return '支合'
  if (pairIn(SANHE, a, b)) return '三合'
  if (pairIn(XING, a, b)) return '刑'
  if (pairIn(HAI, a, b)) return '害'
  return '平'
}

const RELATION_SCORE: Record<Relation, number> = {
  支合: 1.5, 三合: 1.2, 比和: 0.8, 平: 0, 害: -0.7, 刑: -1.0, 冲: -1.5,
}

const generates = (a: Element, b: Element) => ELEMENTS[(ELEMENTS.indexOf(a) + 1) % 5] === b
const controls = (a: Element, b: Element) => ELEMENTS[(ELEMENTS.indexOf(a) + 2) % 5] === b

export interface ZodiacMonthly {
  branch: number
  relation: Relation
  score: number
  stars: number
  rank: number
  luckyElement: Element
}

/** 指定月の十二支別運勢。月の干支はその月の15日(節入り後)で判定する。 */
export function getZodiacMonthly(year: number, month: number): { monthPillar: string; list: ZodiacMonthly[] } {
  const monthPillar = getGapja(year, month, 15).monthPillarHanja
  const mStem = STEM_ELEMENT[STEMS.indexOf(monthPillar[0])]
  const mBranch = BRANCHES.indexOf(monthPillar[1])

  const list = Array.from({ length: 12 }, (_, b) => {
    const relation = branchRelation(b, mBranch)
    const own = BRANCH_ELEMENT[b]
    let score = 3 + RELATION_SCORE[relation]
    if (generates(mStem, own)) score += 0.5
    else if (mStem === own) score += 0.3
    else if (controls(own, mStem)) score += 0.2
    else if (controls(mStem, own)) score -= 0.5
    else if (generates(own, mStem)) score -= 0.2
    score += ((b * 7 + month * 3) % 12) / 100 // 同点回避の微小差
    score = Math.min(5, Math.max(1, score))
    // ラッキー五行: 自分の五行を生む五行
    const luckyElement = ELEMENTS[(ELEMENTS.indexOf(own) + 4) % 5]
    return { branch: b, relation, score, stars: Math.round(score), rank: 0, luckyElement }
  })

  ;[...list].sort((a, b) => b.score - a.score).forEach((z, i) => (z.rank = i + 1))
  return { monthPillar, list }
}

// ---- 個人の四柱 ----

export interface BirthInput {
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  longitude: number
}

export interface Pillars {
  year: string
  month: string
  day: string
  hour: string | null
  dayMaster: string
  dayMasterElement: Element
  correctedTime?: { hour: number; minute: number }
}

/**
 * 出生地の経度で真太陽時に補正してから四柱を出す。
 * ライブラリ内蔵の補正は東経135°より東(東京など)で分が60を超えるため、補正はここで行う。
 */
export function getPillars(input: BirthInput): Pillars {
  let { year, month, day } = input
  let hour = input.hour
  let minute = input.minute ?? 0
  let correctedTime: Pillars['correctedTime']

  if (hour !== undefined) {
    const offsetMin = Math.round((input.longitude - 135) * 4)
    const d = new Date(Date.UTC(year, month - 1, day, hour, minute + offsetMin))
    year = d.getUTCFullYear()
    month = d.getUTCMonth() + 1
    day = d.getUTCDate()
    hour = d.getUTCHours()
    minute = d.getUTCMinutes()
    if (offsetMin !== 0) correctedTime = { hour, minute }
  }

  const s = calculateSaju(year, month, day, hour, minute, { applyTimeCorrection: false })
  const dayMaster = s.dayPillarHanja[0]
  return {
    year: s.yearPillarHanja,
    month: s.monthPillarHanja,
    day: s.dayPillarHanja,
    hour: s.hourPillarHanja ?? null,
    dayMaster,
    dayMasterElement: STEM_ELEMENT[STEMS.indexOf(dayMaster)],
    correctedTime,
  }
}
