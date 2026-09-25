import { useState, type FormEvent } from 'react'
import { DAY_MASTER_TEXT, PREFECTURES, ZODIAC } from '../data/content'
import { BRANCHES, ELEMENT_LUCK, getPillars, type Pillars } from '../lib/koyomi'

const years = Array.from({ length: 2025 - 1930 + 1 }, (_, i) => 2025 - i)
const range = (n: number, from = 1) => Array.from({ length: n }, (_, i) => i + from)

export function BirthForm() {
  const [y, setY] = useState(1990)
  const [m, setM] = useState(1)
  const [d, setD] = useState(1)
  const [h, setH] = useState(-1)
  const [pref, setPref] = useState(12) // 東京都
  const [result, setResult] = useState<Pillars | null>(null)

  const maxDay = new Date(y, m, 0).getDate()

  function submit(e: FormEvent) {
    e.preventDefault()
    setResult(
      getPillars({
        year: y,
        month: m,
        day: Math.min(d, maxDay),
        hour: h < 0 ? undefined : h,
        minute: h < 0 ? undefined : 0,
        longitude: PREFECTURES[pref][1],
      }),
    )
  }

  const dm = result && DAY_MASTER_TEXT[result.dayMaster]
  const zodiac = result && ZODIAC[BRANCHES.indexOf(result.year[1])]

  return (
    <form className="birth-form" onSubmit={submit}>
      <div className="field-row">
        <label>
          <span>生年月日</span>
          <div className="date-selects">
            <select value={y} onChange={(e) => setY(+e.target.value)} aria-label="年">
              {years.map((v) => (
                <option key={v} value={v}>{v}年</option>
              ))}
            </select>
            <select value={m} onChange={(e) => setM(+e.target.value)} aria-label="月">
              {range(12).map((v) => (
                <option key={v} value={v}>{v}月</option>
              ))}
            </select>
            <select value={Math.min(d, maxDay)} onChange={(e) => setD(+e.target.value)} aria-label="日">
              {range(maxDay).map((v) => (
                <option key={v} value={v}>{v}日</option>
              ))}
            </select>
          </div>
        </label>
      </div>
      <div className="field-row two">
        <label>
          <span>生まれた時刻</span>
          <select value={h} onChange={(e) => setH(+e.target.value)}>
            <option value={-1}>わからない</option>
            {range(24, 0).map((v) => (
              <option key={v} value={v}>{v}時台</option>
            ))}
          </select>
        </label>
        <label>
          <span>出生地</span>
          <select value={pref} onChange={(e) => setPref(+e.target.value)}>
            {PREFECTURES.map(([name], i) => (
              <option key={name} value={i}>{name}</option>
            ))}
          </select>
        </label>
      </div>
      <button className="btn-primary" type="submit">無料で鑑定する</button>
      <p className="form-note">登録不要・生年月日は保存されません</p>

      {result && dm && zodiac && (
        <div className="mini-result" role="status">
          <div className="pillars">
            {[
              ['時', result.hour ?? '—'],
              ['日', result.day],
              ['月', result.month],
              ['年', result.year],
            ].map(([label, p]) => (
              <div key={label} className={label === '日' ? 'pillar main' : 'pillar'}>
                <span>{label}柱</span>
                <b>{p[0]}</b>
                <b>{p[1] ?? ''}</b>
              </div>
            ))}
          </div>
          <p>
            あなたの本命は <b style={{ color: ELEMENT_LUCK[result.dayMasterElement].color }}>{result.dayMaster}({dm.yomi})</b>。
            {dm.image}のような人。{zodiac.kanji}年生まれです。
          </p>
          <p className="form-note">※ 詳しい鑑定結果ページは次のステップで公開予定です</p>
        </div>
      )}
    </form>
  )
}
