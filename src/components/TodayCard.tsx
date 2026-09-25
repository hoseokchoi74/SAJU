import { ROKUYO_TEXT, SENJITSU_TEXT } from '../data/content'
import type { DayInfo } from '../lib/koyomi'

export const WEEKDAYS = '日月火水木金土'

export function TodayCard({ info }: { info: DayInfo }) {
  const r = ROKUYO_TEXT[info.rokuyo]
  return (
    <aside className="today-card" aria-label="今日のこよみ">
      <div className="today-top">
        <span>今日のこよみ</span>
        <span>
          {info.year}年{info.month}月{info.day}日({WEEKDAYS[info.weekday]})
        </span>
      </div>
      <div className="today-body">
        <div className="today-rokuyo">
          <span className="ruby">{r.yomi}</span>
          <strong className={`rk rk-${info.rokuyo}`}>{info.rokuyo}</strong>
          <span className="today-short">{r.short}</span>
        </div>
        <dl className="today-meta">
          <div>
            <dt>旧暦</dt>
            <dd>
              {info.lunar.isLeapMonth ? '閏' : ''}
              {info.lunar.month}月{info.lunar.day}日
            </dd>
          </div>
          <div>
            <dt>日の干支</dt>
            <dd>{info.dayPillar}</dd>
          </div>
          <div>
            <dt>月の干支</dt>
            <dd>{info.monthPillar}</dd>
          </div>
        </dl>
        {info.senjitsu.length > 0 && (
          <ul className="badges">
            {info.senjitsu.map((s) => (
              <li key={s} className={s === '天赦日' || s === '一粒万倍日' ? 'badge gold' : 'badge'} title={SENJITSU_TEXT[s]}>
                {s}
              </li>
            ))}
          </ul>
        )}
        <div className="today-advice">
          <p>
            <b className="ok">◎ おすすめ</b>
            {r.good}
          </p>
          <p>
            <b className="ng">△ 控えめに</b>
            {r.avoid}
          </p>
        </div>
      </div>
    </aside>
  )
}
