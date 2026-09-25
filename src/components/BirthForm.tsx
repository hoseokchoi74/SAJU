import { useState, type FormEvent } from 'react'
import { PREFECTURES, texts, ZODIAC } from '../data/content'
import { useT } from '../lib/i18n'
import { BRANCHES, ELEMENT_LUCK, getPillars, type Pillars } from '../lib/koyomi'

const years = Array.from({ length: 2025 - 1930 + 1 }, (_, i) => 2025 - i)
const range = (n: number, from = 1) => Array.from({ length: n }, (_, i) => i + from)

export function BirthForm() {
  const { lang, t } = useT()
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

  const dm = result && texts(lang).dayMaster[result.dayMaster]
  const zodiac = result && ZODIAC[BRANCHES.indexOf(result.year[1])]

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

      {result && dm && zodiac && (
        <div className="mini-result" role="status">
          <div className="pillars">
            {[
              [t('時', '시'), result.hour ?? '—'],
              [t('日', '일'), result.day],
              [t('月', '월'), result.month],
              [t('年', '년'), result.year],
            ].map(([label, p], i) => (
              <div key={i} className={i === 1 ? 'pillar main' : 'pillar'}>
                <span>{label}{t('柱', '주')}</span>
                <b>{p[0]}</b>
                <b>{p[1] ?? ''}</b>
              </div>
            ))}
          </div>
          {lang === 'ko' ? (
            <p>
              당신의 본명은 <b style={{ color: ELEMENT_LUCK[result.dayMasterElement].color }}>{dm.yomi}({result.dayMaster})</b>.{' '}
              {dm.image} 같은 사람. {zodiac.ko}입니다.
            </p>
          ) : (
            <p>
              あなたの本命は <b style={{ color: ELEMENT_LUCK[result.dayMasterElement].color }}>{result.dayMaster}({dm.yomi})</b>。
              {dm.image}のような人。{zodiac.kanji}年生まれです。
            </p>
          )}
          <p className="form-note">{t('※ 詳しい鑑定結果ページは次のステップで公開予定です', '※ 자세한 감정 결과 페이지는 다음 단계에서 공개 예정입니다')}</p>
        </div>
      )}
    </form>
  )
}
