import { useMemo, useState } from 'react'
import { birthYears, RELATION_TEXT, ZODIAC } from '../data/content'
import { ELEMENT_LUCK, getZodiacMonthly, type DayInfo } from '../lib/koyomi'

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export function Ranking({ today }: { today: DayInfo }) {
  const months = useMemo(() => {
    const next = today.month === 12 ? { year: today.year + 1, month: 1 } : { year: today.year, month: today.month + 1 }
    return [{ year: today.year, month: today.month, label: '今月' }, { ...next, label: '来月' }]
  }, [today])
  // 20日以降は来月の運勢を先に見せる(動画公開のタイミングに合わせる)
  const [tab, setTab] = useState(today.day >= 20 ? 1 : 0)
  const target = months[tab]
  const data = useMemo(() => getZodiacMonthly(target.year, target.month), [target])
  const ranked = [...data.list].sort((a, b) => a.rank - b.rank)
  // モバイルでは4位以下を折りたたみ、タップで開く
  const [open, setOpen] = useState<number[]>([])
  const toggle = (b: number) => setOpen((o) => (o.includes(b) ? o.filter((x) => x !== b) : [...o, b]))

  return (
    <section className="section" id="ranking">
      <div className="wrap">
        <p className="eyebrow center">MONTHLY FORTUNE</p>
        <h2 className="section-title">
          <span className="nb">{target.year}年{target.month}月</span> <span className="nb">干支別運勢ランキング</span>
        </h2>
        <p className="section-sub">
          今月の干支は<b>{data.monthPillar}</b>。あなたの生まれ年の干支との相性で、ひと月の流れを読み解きます。
        </p>
        <div className="tabs" role="tablist">
          {months.map((mo, i) => (
            <button key={mo.label} role="tab" aria-selected={tab === i} className={tab === i ? 'tab on' : 'tab'} onClick={() => setTab(i)}>
              {mo.label}({mo.month}月)
            </button>
          ))}
        </div>

        <ol className="rank-grid">
          {ranked.map((z) => {
            const zd = ZODIAC[z.branch]
            const t = RELATION_TEXT[z.relation]
            const lucky = ELEMENT_LUCK[z.luckyElement]
            const fold = z.rank > 3
            const isOpen = open.includes(z.branch)
            const cls = ['rank-card', z.rank <= 3 ? `top top${z.rank}` : '', fold ? 'fold' : '', isOpen ? 'open' : '']
            return (
              <li key={z.branch} className={cls.join(' ')}>
                <button type="button" className="rank-head" onClick={() => fold && toggle(z.branch)} aria-expanded={fold ? isOpen : undefined}>
                  <span className="rank-no">{z.rank}<small>位</small></span>
                  <span className="zodiac-seal">{zd.kanji}</span>
                  <span className="rank-name">
                    <b>{zd.kanji}({zd.yomi})年</b>
                    <small>{birthYears(z.branch).slice(0, 4).join('・')}年生まれ</small>
                  </span>
                  <span className="stars" aria-label={`5つ星中${z.stars}`}>{stars(z.stars)}</span>
                  {fold && <span className="chev" aria-hidden />}
                </button>
                <p className="rank-title">{t.title}</p>
                <div className="rank-body">
                  <p className="rank-line"><b className="ok">開運</b>{t.action}</p>
                  <p className="rank-line"><b className="ng">注意</b>{t.caution}</p>
                  <p className="lucky">
                    <span className="dot" style={{ background: lucky.color }} />
                    ラッキーカラー {lucky.colorName}
                    <span className="sep">／</span>
                    方位 {lucky.direction}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
