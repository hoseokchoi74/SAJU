import { useMemo, useState } from 'react'
import { ROKUYO_TEXT, SENJITSU_TEXT } from '../data/content'
import { getMonthDays, type DayInfo } from '../lib/koyomi'
import { WEEKDAYS } from './TodayCard'

export function KaiunCalendar({ today }: { today: DayInfo }) {
  const [ym, setYm] = useState({ year: today.year, month: today.month })
  const days = useMemo(() => getMonthDays(ym.year, ym.month), [ym])
  const [selected, setSelected] = useState<number>(today.day)
  const sel = days[Math.min(selected, days.length) - 1]
  const lead = days[0].weekday
  const best = days.filter((d) => d.luck === 'best')

  const shift = (n: number) => {
    const m = ym.month + n
    setYm({ year: ym.year + Math.floor((m - 1) / 12), month: ((m - 1 + 12) % 12) + 1 })
    setSelected(1)
  }

  return (
    <section className="section tinted" id="calendar">
      <div className="wrap">
        <p className="eyebrow center">KAIUN CALENDAR</p>
        <h2 className="section-title">開運カレンダー</h2>
        <p className="section-sub">六曜と吉日をひと目で。日付をタップすると、その日のおすすめがわかります。</p>

        <div className="cal-layout">
          <div className="cal">
            <div className="cal-head">
              <button onClick={() => shift(-1)} aria-label="前の月">‹</button>
              <b>{ym.year}年{ym.month}月</b>
              <button onClick={() => shift(1)} aria-label="次の月">›</button>
            </div>
            <div className="cal-grid">
              {[...WEEKDAYS].map((w, i) => (
                <span key={w} className={`cal-wd w${i}`}>{w}</span>
              ))}
              {Array.from({ length: lead }, (_, i) => (
                <span key={`e${i}`} />
              ))}
              {days.map((d) => {
                const isToday = ym.year === today.year && ym.month === today.month && d.day === today.day
                const cls = ['cal-day', `luck-${d.luck}`, `w${d.weekday}`, d.day === sel.day ? 'sel' : '', isToday ? 'today' : '']
                return (
                  <button key={d.day} className={cls.join(' ')} onClick={() => setSelected(d.day)}>
                    <span className="n">{d.day}</span>
                    <span className="rk-s">{d.rokuyo}</span>
                    {d.senjitsu.length > 0 && (
                      <span className="marks">
                        {d.senjitsu.includes('天赦日') && <i className="m-tensha" title="天赦日" />}
                        {d.senjitsu.includes('一粒万倍日') && <i className="m-ichi" title="一粒万倍日" />}
                        {(d.senjitsu.includes('寅の日') || d.senjitsu.some((s) => s.includes('巳'))) && <i className="m-kin" title="金運日" />}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="legend">
              <span><i className="m-tensha" />天赦日</span>
              <span><i className="m-ichi" />一粒万倍日</span>
              <span><i className="m-kin" />寅・巳の日(金運)</span>
              <span><i className="sw best" />最強開運日</span>
            </div>
          </div>

          <div className="day-detail">
            <p className="dd-date">
              {sel.month}月{sel.day}日({WEEKDAYS[sel.weekday]})
              <span>旧暦 {sel.lunar.month}/{sel.lunar.day} ・ {sel.dayPillar}の日</span>
            </p>
            <p className={`dd-rokuyo rk-${sel.rokuyo}`}>
              {sel.rokuyo}
              <small>{ROKUYO_TEXT[sel.rokuyo].short}</small>
            </p>
            {sel.senjitsu.map((s) => (
              <p key={s} className="dd-sen">
                <b>{s}</b>
                {SENJITSU_TEXT[s]}
              </p>
            ))}
            <p className="rank-line"><b className="ok">おすすめ</b>{ROKUYO_TEXT[sel.rokuyo].good}</p>
            <p className="rank-line"><b className="ng">控えめに</b>{ROKUYO_TEXT[sel.rokuyo].avoid}</p>

            <div className="best-days">
              <p>{ym.month}月の最強開運日</p>
              {best.length ? (
                <ul>
                  {best.map((d) => (
                    <li key={d.day}>
                      <button onClick={() => setSelected(d.day)}>
                        {d.day}日({WEEKDAYS[d.weekday]}) <small>{[d.rokuyo, ...d.senjitsu.filter((s) => s === '天赦日' || s === '一粒万倍日')].join('×')}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <small>今月は大安×一粒万倍日が重なる日はありません</small>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
