import { Breadcrumb } from '../components/Layout'
import { texts } from '../data/content'
import { useT } from '../lib/i18n'
import { getMonthDays, ROKUYO } from '../lib/koyomi'
import { pathOf, YEARS } from '../routes'

export function RokuyoPage({ year }: { year: number }) {
  const { lang, t } = useT()
  const tx = texts(lang)
  const months = Array.from({ length: 12 }, (_, i) => getMonthDays(year, i + 1))
  const all = months.flat()

  return (
    <div className="wrap page">
      <Breadcrumb items={[[t('トップ', '홈'), '/'], [t(`${year}年の六曜カレンダー`, `${year}년 육요 달력`)]]} />
      <header className="page-head">
        <p className="eyebrow">ROKUYO CALENDAR {year}</p>
        <h1>{t(`${year}年の六曜カレンダー`, `${year}년 육요 달력`)}</h1>
        <p className="lead">
          {t(
            `${year}年(令和${year - 2018}年)の大安・赤口・先勝・友引・先負・仏滅を月別カレンダーにしました。結婚式や引っ越し、契約など日取り選びの参考にどうぞ。`,
            `${year}년의 대안·적구·선승·우인·선부·불멸을 월별 달력으로 만들었습니다. 결혼식, 이사, 계약 등 날짜를 고를 때 참고하세요.`,
          )}
        </p>
      </header>

      <ul className="stat-chips">
        {ROKUYO.map((r) => (
          <li key={r} className={`rk-${r}`}>
            <b>{all.filter((d) => d.rokuyo === r).length}</b>
            {t('日', '일')}
            <span>{r}</span>
          </li>
        ))}
      </ul>

      <div className="mini-cals">
        {months.map((days, i) => (
          <section key={i} className="mini-cal" id={`m${i + 1}`}>
            <h2>{t(`${i + 1}月`, `${i + 1}월`)}</h2>
            <div className="mini-grid">
              {[...tx.weekdays].map((w, wi) => (
                <span key={w} className={`wd w${wi}`}>{w}</span>
              ))}
              {Array.from({ length: days[0].weekday }, (_, k) => (
                <span key={`e${k}`} />
              ))}
              {days.map((d) => (
                <span key={d.day} className={`md rk-${d.rokuyo}${d.luck === 'best' ? ' best' : ''}`}>
                  <b className={`w${d.weekday}`}>{d.day}</b>
                  <small>{d.rokuyo}</small>
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="card-block">
        <h2>{t(`${year}年の大安の日`, `${year}년 대안인 날`)}</h2>
        <dl className="taian-list">
          {months.map((days, i) => (
            <div key={i}>
              <dt>{t(`${i + 1}月`, `${i + 1}월`)}</dt>
              <dd>
                {days
                  .filter((d) => d.rokuyo === '大安')
                  .map((d) => `${d.day}${t('日', '일')}(${tx.weekdays[d.weekday]})`)
                  .join('・')}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card-block">
        <h2>{t('六曜の意味と良い時間帯', '육요의 의미와 좋은 시간대')}</h2>
        <table className="kichi-table rokuyo-table">
          <thead>
            <tr>
              <th>{t('六曜', '육요')}</th>
              <th>{t('意味', '의미')}</th>
              <th>{t('向いていること', '어울리는 일')}</th>
              <th>{t('控えたいこと', '피할 일')}</th>
            </tr>
          </thead>
          <tbody>
            {ROKUYO.map((r) => (
              <tr key={r}>
                <td className={`rk-${r}`}>
                  <b>{r}</b>
                  <small>{tx.rokuyo[r].yomi}</small>
                </td>
                <td>{tx.rokuyo[r].short}</td>
                <td>{tx.rokuyo[r].good}</td>
                <td>{tx.rokuyo[r].avoid}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note">
          {t(
            '六曜は旧暦の月と日を足して6で割った余りで決まります(0=大安、1=赤口、2=先勝、3=友引、4=先負、5=仏滅)。',
            '육요는 음력의 월과 일을 더해 6으로 나눈 나머지로 정해집니다(0=대안, 1=적구, 2=선승, 3=우인, 4=선부, 5=불멸).',
          )}
        </p>
      </section>

      <nav className="link-cards">
        {YEARS.filter((y) => y !== year).map((y) => (
          <a key={y} href={pathOf({ page: 'rokuyo', year: y })}>{t(`${y}年の六曜カレンダー`, `${y}년 육요 달력`)} →</a>
        ))}
        <a href={pathOf({ page: 'kichijitsu', year })}>{t(`${year}年の吉日カレンダー(一粒万倍日・天赦日)`, `${year}년 길일 달력`)} →</a>
        <a href="/#top">{t('生年月日であなたの開運日を無料鑑定', '생년월일로 나의 개운일 무료 감정')} →</a>
      </nav>
    </div>
  )
}
