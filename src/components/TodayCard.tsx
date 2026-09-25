import { texts } from '../data/content'
import { useT } from '../lib/i18n'
import type { DayInfo } from '../lib/koyomi'

export function TodayCard({ info }: { info: DayInfo }) {
  const { lang, t } = useT()
  const tx = texts(lang)
  const r = tx.rokuyo[info.rokuyo]
  return (
    <aside className="today-card" aria-label={t('今日のこよみ', '오늘의 달력')}>
      <div className="today-top">
        <span>{t('今日のこよみ', '오늘의 달력')}</span>
        <span>
          {info.year}
          {t('年', '년 ')}
          {info.month}
          {t('月', '월 ')}
          {info.day}
          {t('日', '일')}({tx.weekdays[info.weekday]})
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
            <dt>{t('旧暦', '음력')}</dt>
            <dd>
              {info.lunar.isLeapMonth ? t('閏', '윤') : ''}
              {info.lunar.month}
              {t('月', '월 ')}
              {info.lunar.day}
              {t('日', '일')}
            </dd>
          </div>
          <div>
            <dt>{t('日の干支', '일진')}</dt>
            <dd>{info.dayPillar}</dd>
          </div>
          <div>
            <dt>{t('月の干支', '월건')}</dt>
            <dd>{info.monthPillar}</dd>
          </div>
        </dl>
        {info.senjitsu.length > 0 && (
          <ul className="badges">
            {info.senjitsu.map((s) => (
              <li key={s} className={s === '天赦日' || s === '一粒万倍日' ? 'badge gold' : 'badge'} title={tx.senjitsu[s]}>
                {tx.senjitsuName(s)}
              </li>
            ))}
          </ul>
        )}
        <div className="today-advice">
          <p>
            <b className="ok">{t('◎ おすすめ', '◎ 추천')}</b>
            {r.good}
          </p>
          <p>
            <b className="ng">{t('△ 控えめに', '△ 자제하기')}</b>
            {r.avoid}
          </p>
        </div>
      </div>
    </aside>
  )
}
