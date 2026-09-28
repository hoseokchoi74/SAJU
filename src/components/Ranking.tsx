import { useMemo, useState } from 'react'
import { bank } from '../data/bank'
import { birthYears, fmtDays, texts, ZODIAC } from '../data/content'
import { useT } from '../lib/i18n'
import { ELEMENT_LUCK, getZodiacMonthly, type DayInfo } from '../lib/koyomi'
import { hasMonth, pathOf } from '../routes'

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export function Ranking({ today }: { today: DayInfo }) {
  const { lang, t } = useT()
  const tx = texts(lang)
  const bk = bank(lang)
  const months = useMemo(() => {
    const next = today.month === 12 ? { year: today.year + 1, month: 1 } : { year: today.year, month: today.month + 1 }
    return [{ year: today.year, month: today.month, cur: true }, { ...next, cur: false }]
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
          <span className="nb">{target.year}{t('年', '년 ')}{target.month}{t('月', '월')}</span>{' '}
          <span className="nb">{t('干支別運勢ランキング', '띠별 운세 랭킹')}</span>
        </h2>
        <p className="section-sub">
          {t('今月の干支は', '이달의 간지는 ')}
          <b>{data.monthPillar}</b>
          {t(
            '。あなたの生まれ年の干支との相性で、ひと月の流れを読み解きます。',
            '. 당신이 태어난 해의 띠와의 궁합으로 한 달의 흐름을 풀어냅니다.',
          )}
        </p>
        <div className="tabs" role="tablist">
          {months.map((mo, i) => (
            <button key={i} role="tab" aria-selected={tab === i} className={tab === i ? 'tab on' : 'tab'} onClick={() => setTab(i)}>
              {mo.cur ? t('今月', '이번 달') : t('来月', '다음 달')}({mo.month}{t('月', '월')})
            </button>
          ))}
        </div>

        <ol className="rank-grid">
          {ranked.map((z) => {
            const zd = ZODIAC[z.branch]
            const rt = bk.relation(z.relation, z.variant)
            const fc = bk.focus(z.focus, z.branch + target.year * 12 + target.month)
            const lucky = tx.luck[z.luckyElement]
            const fold = z.rank > 3
            const isOpen = open.includes(z.branch)
            const cls = ['rank-card', z.rank <= 3 ? `top top${z.rank}` : '', fold ? 'fold' : '', isOpen ? 'open' : '']
            return (
              <li key={z.branch} className={cls.join(' ')}>
                <button type="button" className="rank-head" onClick={() => fold && toggle(z.branch)} aria-expanded={fold ? isOpen : undefined}>
                  <span className="rank-no">{z.rank}<small>{t('位', '위')}</small></span>
                  <span className="zodiac-seal">{zd.kanji}</span>
                  <span className="rank-name">
                    <b>
                      {t(`${zd.kanji}(${zd.yomi})年`, `${zd.ko}(${zd.kanji})`)}
                      {lang === 'ja' && zd.animal !== zd.yomi && <span className="animal">{zd.animal}</span>}
                    </b>
                    <small>{birthYears(z.branch).slice(0, 4).join('・')}{t('年生まれ', '년생')}</small>
                  </span>
                  <span className="stars" aria-label={`${z.stars}/5`}>{stars(z.stars)}</span>
                  {fold && <span className="chev" aria-hidden />}
                </button>
                <p className="rank-title">{rt.title}</p>
                <div className="rank-body">
                  <p className="focus"><span className={`focus-tag f-${z.focus}`}>{fc.label}</span>{fc.line}</p>
                  <p className="rank-line"><b className="ok">{t('開運', '개운')}</b>{rt.action}</p>
                  <p className="rank-line"><b className="ng">{t('注意', '주의')}</b>{rt.caution}</p>
                  <p className="days">
                    <span><b className="ok">{t('開運日', '개운일')}</b>{fmtDays(target.month, z.luckyDays)}</span>
                    <span><b className="ng">{t('注意日', '주의일')}</b>{fmtDays(target.month, z.cautionDays)}</span>
                  </p>
                  <p className="lucky">
                    <span className="dot" style={{ background: ELEMENT_LUCK[z.luckyElement].color }} />
                    {t('ラッキーカラー', '행운의 색')} {lucky.colorName}
                    <span className="sep">／</span>
                    {t('方位', '방위')} {lucky.direction}
                  </p>
                  {hasMonth(target) && (
                    <a className="more" href={pathOf({ page: 'eto', branch: z.branch, ym: target })}>
                      {t('詳しく見る', '자세히 보기')} →
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
        {hasMonth(target) && (
          <p className="section-more">
            <a href={pathOf({ page: 'unsei', ym: target })}>
              {t(`${target.year}年${target.month}月の運勢ランキングを詳しく見る`, `${target.year}년 ${target.month}월 운세 랭킹 자세히 보기`)} →
            </a>
          </p>
        )}
      </div>
    </section>
  )
}
