import { useState, type FormEvent } from 'react'
import { PREFECTURES } from '../data/content'
import { useT } from '../lib/i18n'
import { getPersonalMonthly, getPillars, type PersonalMonthly, type Pillars } from '../lib/koyomi'
import { Result } from './Result'

const years = Array.from({ length: 2025 - 1930 + 1 }, (_, i) => 2025 - i)
const range = (n: number, from = 1) => Array.from({ length: n }, (_, i) => i + from)

export function BirthForm() {
  const { t } = useT()
  const [y, setY] = useState(1990)
  const [m, setM] = useState(1)
  const [d, setD] = useState(1)
  const [h, setH] = useState(-1)
  const [pref, setPref] = useState(12) // 東京都
  const [result, setResult] = useState<{ p: Pillars; month: PersonalMonthly } | null>(null)

  const maxDay = new Date(y, m, 0).getDate()

  function submit(e: FormEvent) {
    e.preventDefault()
    const p = getPillars({
      year: y,
      month: m,
      day: Math.min(d, maxDay),
      hour: h < 0 ? undefined : h,
      minute: h < 0 ? undefined : 0,
      longitude: PREFECTURES[pref][1],
    })
    // 20日以降は来月を表示(ランキングと同じ基準)。今月の場合は過ぎた日を開運日に出さない。
    const now = new Date()
    const [ty, tm, today] = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    const month =
      today >= 20
        ? getPersonalMonthly(p, tm === 12 ? ty + 1 : ty, tm === 12 ? 1 : tm + 1)
        : getPersonalMonthly(p, ty, tm, today)
    setResult({ p, month })
  }

  return (
    <form className="birth-form" onSubmit={submit}>
      <div className="field-row">
        <label>
          <span>{t('生年月日', '생년월일')}</span>
          <div className="date-selects">
            <select value={y} onChange={(e) => setY(+e.target.value)} aria-label={t('年', '년')}>
              {years.map((v) => (
                <option key={v} value={v}>{v}{t('年', '년')}</option>
              ))}
            </select>
            <select value={m} onChange={(e) => setM(+e.target.value)} aria-label={t('月', '월')}>
              {range(12).map((v) => (
                <option key={v} value={v}>{v}{t('月', '월')}</option>
              ))}
            </select>
            <select value={Math.min(d, maxDay)} onChange={(e) => setD(+e.target.value)} aria-label={t('日', '일')}>
              {range(maxDay).map((v) => (
                <option key={v} value={v}>{v}{t('日', '일')}</option>
              ))}
            </select>
          </div>
        </label>
      </div>
      <div className="field-row two">
        <label>
          <span>{t('生まれた時刻', '태어난 시각')}</span>
          <select value={h} onChange={(e) => setH(+e.target.value)}>
            <option value={-1}>{t('わからない', '모름')}</option>
            {range(24, 0).map((v) => (
              <option key={v} value={v}>{v}{t('時台', '시대')}</option>
            ))}
          </select>
        </label>
        <label>
          <span>{t('出生地', '출생지')}</span>
          <select value={pref} onChange={(e) => setPref(+e.target.value)}>
            {PREFECTURES.map(([ja, , ko], i) => (
              <option key={ja} value={i}>{t(ja, ko)}</option>
            ))}
          </select>
        </label>
      </div>
      <button className="btn-primary" type="submit">{t('無料で鑑定する', '무료로 감정하기')}</button>
      <p className="form-note">{t('登録不要・生年月日は保存されません', '가입 불필요 · 생년월일은 저장되지 않습니다')}</p>

      {result && <Result p={result.p} month={result.month} />}
    </form>
  )
}

