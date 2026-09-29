import { bank } from '../data/bank'
import { birthYears, fmtDays, texts, ZODIAC } from '../data/content'
import { Faq, Updated } from '../components/Faq'
import { Breadcrumb } from '../components/Layout'
import { useT } from '../lib/i18n'
import { ELEMENT_LUCK, getMonthDays, getZodiacMonthly } from '../lib/koyomi'
import { hasMonth, pathOf, shiftYM, type YM } from '../routes'

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export function UnseiPage({ ym }: { ym: YM }) {
  const { lang, t } = useT()
  const tx = texts(lang)
  const bk = bank(lang)
  const data = getZodiacMonthly(ym.year, ym.month)
  const ranked = [...data.list].sort((a, b) => a.rank - b.rank)
  const best = getMonthDays(ym.year, ym.month).filter((d) => d.luck === 'best' || d.senjitsu.includes('天赦日'))
  const prev = shiftYM(ym, -1)
  const next = shiftYM(ym, 1)
  const title = t(`${ym.year}年${ym.month}月の干支別運勢ランキング`, `${ym.year}년 ${ym.month}월 띠별 운세 랭킹`)

  return (
    <div className="wrap page">
      <Breadcrumb items={[[t('トップ', '홈'), '/'], [title]]} />
      <header className="page-head">
        <p className="eyebrow">MONTHLY FORTUNE</p>
        <h1>{title}</h1>
        <p className="lead">
          {t('今月の干支は', '이달의 간지는 ')}
          <b>{data.monthPillar}</b>
          {t(
            '。生まれ年の干支(十二支)と今月の干支の相性から、ひと月の流れと開運日を読み解きます。',
            '. 태어난 해의 띠와 이달 간지의 궁합으로 한 달의 흐름과 개운일을 풀어냅니다.',
          )}
        </p>
        <Updated />
      </header>

      {best.length > 0 && (
        <p className="month-best">
          <b>{t(`${ym.month}月の最強開運日`, `${ym.month}월의 최강 개운일`)}</b>
          {best.map((d) => `${d.month}/${d.day}(${tx.weekdays[d.weekday]}) ${[d.rokuyo, ...d.senjitsu].join('・')}`).join('　')}
        </p>
      )}

      <ol className="rank-grid static">
        {ranked.map((z) => {
          const zd = ZODIAC[z.branch]
          const rt = bk.relation(z.relation, z.variant)
          const fc = bk.focus(z.focus, z.branch + ym.year * 12 + ym.month)
          const lucky = tx.luck[z.luckyElement]
          const href = pathOf({ page: 'eto', branch: z.branch, ym })
          return (
            <li key={z.branch} className={z.rank <= 3 ? `rank-card top top${z.rank}` : 'rank-card'}>
              <a className="rank-head" href={href}>
                <span className="rank-no">{z.rank}<small>{t('位', '위')}</small></span>
                <span className="zodiac-seal">{zd.kanji}</span>
                <span className="rank-name">
                  <b>
                    {t(`${zd.kanji}(${zd.yomi})年`, `${zd.ko}(${zd.kanji})`)}
                    {lang === 'ja' && zd.animal !== zd.yomi && <span className="animal">{zd.animal}</span>}
                  </b>
                  <small>{birthYears(z.branch).slice(0, 4).join('・')}{t('年生まれ', '년생')}</small>
                </span>
                <span className="stars">{stars(z.stars)}</span>
              </a>
              <p className="rank-title">{rt.title}</p>
              <p className="focus"><span className={`focus-tag f-${z.focus}`}>{fc.label}</span>{fc.line}</p>
              <p className="rank-line"><b className="ok">{t('開運', '개운')}</b>{rt.action}</p>
              <p className="days">
                <span><b className="ok">{t('開運日', '개운일')}</b>{fmtDays(ym.month, z.luckyDays)}</span>
                <span><b className="ng">{t('注意日', '주의일')}</b>{fmtDays(ym.month, z.cautionDays)}</span>
              </p>
              <p className="lucky">
                <span className="dot" style={{ background: ELEMENT_LUCK[z.luckyElement].color }} />
                {t('ラッキーカラー', '행운의 색')} {lucky.colorName}
                <span className="sep">／</span>
                {t('方位', '방위')} {lucky.direction}
              </p>
              <a className="more" href={href}>{t('詳しく見る', '자세히 보기')} →</a>
            </li>
          )
        })}
      </ol>

      <Faq route={{ page: 'unsei', ym }} />

      <nav className="pager">
        {hasMonth(prev) ? <a href={pathOf({ page: 'unsei', ym: prev })}>← {t(`${prev.year}年${prev.month}月`, `${prev.year}년 ${prev.month}월`)}</a> : <span />}
        {hasMonth(next) ? <a href={pathOf({ page: 'unsei', ym: next })}>{t(`${next.year}年${next.month}月`, `${next.year}년 ${next.month}월`)} →</a> : <span />}
      </nav>

      <nav className="link-cards">
        <a href={pathOf({ page: 'kichijitsu', year: ym.year })}>{t(`${ym.year}年の吉日カレンダー`, `${ym.year}년 길일 달력`)} →</a>
        <a href="/#top">{t('生年月日であなただけの運勢を無料鑑定', '생년월일로 나만의 운세 무료 감정')} →</a>
      </nav>
    </div>
  )
}
