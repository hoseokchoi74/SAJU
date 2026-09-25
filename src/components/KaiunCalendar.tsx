import { useMemo, useState } from 'react'
import { texts } from '../data/content'
import { useT } from '../lib/i18n'
import { getMonthDays, type DayInfo } from '../lib/koyomi'

export function KaiunCalendar({ today }: { today: DayInfo }) {
  const { lang, t } = useT()
  const tx = texts(lang)
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
        <h2 className="section-title">{t('開運カレンダー', '개운 달력')}</h2>
        <p className="section-sub">
          {t(
            '六曜と吉日をひと目で。日付をタップすると、その日のおすすめがわかります。',
            '육요와 길일을 한눈에. 날짜를 누르면 그날 추천하는 일을 알 수 있습니다.',
          )}
        </p>

        <div className="cal-layout">
          <div className="cal">
            <div className="cal-head">
              <button onClick={() => shift(-1)} aria-label={t('前の月', '이전 달')}>‹</button>
              <b>{ym.year}{t('年', '년 ')}{ym.month}{t('月', '월')}</b>
              <button onClick={() => shift(1)} aria-label={t('次の月', '다음 달')}>›</button>
            </div>
            <div className="cal-grid">
              {[...tx.weekdays].map((w, i) => (
                <span key={w} className={`cal-wd w${i}`}>{w}</span>
              ))}
              {Array.from({ length: lead }, (_, i) => (
                <span key={`e${i}`} />
              ))}
              {days.map((d) => {
                const isToday = ym.year === today.year && ym.month === today.month && d.day === today.day
                const cls = ['cal-day', `luck-${d.luck}`, `w${d.weekday}`, d.day === sel.day ? 'sel' : '', isToday ? 'today' : '']
                return (
                  <button key={d.day} className={cls.join(' ')} onClick={() => setSelected(d.day)} data-today={t('今日', '오늘')}>
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
              <span><i className="m-tensha" />{t('天赦日', '천사일')}</span>
              <span><i className="m-ichi" />{t('一粒万倍日', '일립만배일')}</span>
              <span><i className="m-kin" />{t('寅・巳の日(金運)', '인일·사일(금운)')}</span>
              <span><i className="sw best" />{t('最強開運日', '최강 개운일')}</span>
            </div>
          </div>

          <div className="day-detail">
            <p className="dd-date">
              {sel.month}{t('月', '월 ')}{sel.day}{t('日', '일')}({tx.weekdays[sel.weekday]})
              <span>
                {t('旧暦', '음력')} {sel.lunar.month}/{sel.lunar.day} ・ {sel.dayPillar}{t('の日', '일')}
              </span>
            </p>
            <p className={`dd-rokuyo rk-${sel.rokuyo}`}>
              {sel.rokuyo}
              <small>{tx.rokuyo[sel.rokuyo].short}</small>
            </p>
            {sel.senjitsu.map((s) => (
              <p key={s} className="dd-sen">
                <b>{tx.senjitsuName(s)}</b>
                {tx.senjitsu[s]}
              </p>
            ))}
            <p className="rank-line"><b className="ok">{t('おすすめ', '추천')}</b>{tx.rokuyo[sel.rokuyo].good}</p>
            <p className="rank-line"><b className="ng">{t('控えめに', '자제')}</b>{tx.rokuyo[sel.rokuyo].avoid}</p>

            <div className="best-days">
              <p>{ym.month}{t('月の最強開運日', '월의 최강 개운일')}</p>
              {best.length ? (
                <ul>
                  {best.map((d) => (
                    <li key={d.day}>
                      <button onClick={() => setSelected(d.day)}>
                        {d.day}{t('日', '일')}({tx.weekdays[d.weekday]}){' '}
                        <small>{[d.rokuyo, ...d.senjitsu.filter((s) => s === '天赦日' || s === '一粒万倍日')].join('×')}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <small>{t('今月は大安×一粒万倍日が重なる日はありません', '이번 달은 대안과 일립만배일이 겹치는 날이 없습니다')}</small>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
