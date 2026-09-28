import { Breadcrumb } from '../components/Layout'
import { texts } from '../data/content'
import { useT } from '../lib/i18n'
import { getMonthDays, type DayInfo, type Senjitsu } from '../lib/koyomi'
import { pathOf, YEARS } from '../routes'

const KINDS: Senjitsu[] = ['天赦日', '一粒万倍日', '寅の日', '巳の日', '己巳の日']
const hasMi = (d: DayInfo) => d.senjitsu.includes('巳の日') || d.senjitsu.includes('己巳の日')

export function KichijitsuPage({ year }: { year: number }) {
  const { lang, t } = useT()
  const tx = texts(lang)
  const months = Array.from({ length: 12 }, (_, i) => getMonthDays(year, i + 1))
  const all = months.flat()
  const count = (k: Senjitsu) => all.filter((d) => (k === '巳の日' ? hasMi(d) : d.senjitsu.includes(k))).length
  const taian = all.filter((d) => d.rokuyo === '大安').length
  const fmt = (d: DayInfo) => `${d.month}/${d.day}(${tx.weekdays[d.weekday]})`
  const tensha = all.filter((d) => d.senjitsu.includes('天赦日'))
  const ichiTaian = all.filter((d) => d.senjitsu.includes('一粒万倍日') && d.rokuyo === '大安')
  const tag = (d: DayInfo) => [...(d.rokuyo === '大安' ? ['大安'] : []), ...d.senjitsu]
  const tagName = (s: string) => (s === '大安' ? t('大安', '대안') : tx.senjitsuName(s as Senjitsu))

  return (
    <div className="wrap page">
      <Breadcrumb items={[[t('トップ', '홈'), '/'], [t(`${year}年の吉日カレンダー`, `${year}년 길일 달력`)]]} />
      <header className="page-head">
        <p className="eyebrow">KICHIJITSU CALENDAR {year}</p>
        <h1>{t(`${year}年の吉日カレンダー`, `${year}년 길일 달력`)}</h1>
        <p className="lead">
          {t(
            `${year}年(令和${year - 2018}年)の一粒万倍日・天赦日・寅の日・巳の日・大安を月別にまとめました。財布の新調や入籍、新しいことを始める日選びにどうぞ。`,
            `${year}년의 일립만배일·천사일·인일·사일·대안을 월별로 정리했습니다. 지갑 새로 장만하기, 혼인신고, 새로운 일을 시작할 날을 고를 때 참고하세요.`,
          )}
        </p>
      </header>

      <ul className="stat-chips">
        {KINDS.map((k) => (
          <li key={k}>
            <b>{count(k)}</b>
            {t('日', '일')}
            <span>{tx.senjitsuName(k)}</span>
          </li>
        ))}
        <li>
          <b>{taian}</b>
          {t('日', '일')}
          <span>{t('大安', '대안')}</span>
        </li>
      </ul>

      <section className="card-block best">
        <h2>{t(`${year}年の最強開運日(天赦日)`, `${year}년 최강 개운일(천사일)`)}</h2>
        <p>{tx.senjitsu['天赦日']}</p>
        <ul className="day-list">
          {tensha.map((d) => (
            <li key={d.month * 100 + d.day}>
              <b>{fmt(d)}</b>
              <span className="tags">{tag(d).filter((x) => x !== '天赦日').map(tagName).join('・') || '—'}</span>
            </li>
          ))}
        </ul>
        <h3>{t('一粒万倍日と大安が重なる日', '일립만배일과 대안이 겹치는 날')}</h3>
        <p className="inline-days">{ichiTaian.map(fmt).join('、') || '—'}</p>
      </section>

      {months.map((days, i) => {
        const rows = days.filter((d) => d.senjitsu.length > 0 || d.rokuyo === '大安')
        return (
          <section key={i} className="month-block" id={`m${i + 1}`}>
            <h2>{t(`${year}年${i + 1}月の吉日`, `${year}년 ${i + 1}월의 길일`)}</h2>
            <table className="kichi-table">
              <thead>
                <tr>
                  <th>{t('日付', '날짜')}</th>
                  <th>{t('六曜', '육요')}</th>
                  <th>{t('吉日', '길일')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.day} className={d.luck === 'best' ? 'best' : undefined}>
                    <td className={`w${d.weekday}`}>{fmt(d)}</td>
                    <td className={`rk-${d.rokuyo}`}>{d.rokuyo}</td>
                    <td>
                      {d.senjitsu.map((s) => (
                        <span key={s} className={`kt kt-${s}`}>{tx.senjitsuName(s)}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )
      })}

      <section className="card-block">
        <h2>{t('吉日の意味', '길일의 의미')}</h2>
        <dl className="meaning">
          {KINDS.map((k) => (
            <div key={k}>
              <dt>{tx.senjitsuName(k)}</dt>
              <dd>{tx.senjitsu[k]}</dd>
            </div>
          ))}
          <div>
            <dt>{t('大安', '대안')}</dt>
            <dd>{tx.rokuyo['大安'].short}。{tx.rokuyo['大安'].good}</dd>
          </div>
        </dl>
      </section>

      <nav className="link-cards">
        {YEARS.filter((y) => y !== year).map((y) => (
          <a key={y} href={pathOf({ page: 'kichijitsu', year: y })}>{t(`${y}年の吉日カレンダー`, `${y}년 길일 달력`)} →</a>
        ))}
        <a href={pathOf({ page: 'rokuyo', year })}>{t(`${year}年の六曜カレンダー`, `${year}년 육요 달력`)} →</a>
        <a href="/#top">{t('生年月日であなたの開運日を無料鑑定', '생년월일로 나의 개운일 무료 감정')} →</a>
      </nav>
    </div>
  )
}
