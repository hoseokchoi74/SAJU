import { bank } from '../data/bank'
import { birthYears, texts, ZODIAC } from '../data/content'
import { Faq, Updated } from '../components/Faq'
import { Breadcrumb } from '../components/Layout'
import { useT } from '../lib/i18n'
import { ELEMENT_LUCK, getMonthDays, getZodiacMonthly, type DayInfo } from '../lib/koyomi'
import { hasMonth, pathOf, shiftYM, type YM } from '../routes'

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export function EtoPage({ branch, ym }: { branch: number; ym: YM }) {
  const { lang, t } = useT()
  const tx = texts(lang)
  const bk = bank(lang)
  const data = getZodiacMonthly(ym.year, ym.month)
  const z = data.list[branch]
  const zd = ZODIAC[branch]
  const rt = bk.relation(z.relation, z.variant)
  const fc = bk.focus(z.focus, branch + ym.year * 12 + ym.month)
  const lucky = tx.luck[z.luckyElement]
  const days = getMonthDays(ym.year, ym.month)
  const dayLine = (n: number) => {
    const d = days[n - 1] as DayInfo
    const tags = [d.rokuyo, ...d.senjitsu.map((s) => tx.senjitsuName(s))].join('・')
    return { label: `${ym.month}/${n}(${tx.weekdays[d.weekday]})`, tags }
  }
  const name = t(`${zd.kanji}年(${zd.yomi}どし)`, `${zd.ko}(${zd.kanji})`)
  const title = t(`${zd.kanji}年生まれ ${ym.year}年${ym.month}月の運勢`, `${zd.ko} ${ym.year}년 ${ym.month}월 운세`)
  const prev = shiftYM(ym, -1)
  const next = shiftYM(ym, 1)

  return (
    <div className="wrap page">
      <Breadcrumb
        items={[
          [t('トップ', '홈'), '/'],
          [t(`${ym.year}年${ym.month}月の干支別運勢`, `${ym.year}년 ${ym.month}월 띠별 운세`), pathOf({ page: 'unsei', ym })],
          [name],
        ]}
      />
      <header className="page-head eto-head">
        <span className="zodiac-seal big">{zd.kanji}</span>
        <div>
          <p className="eyebrow">{ym.year}.{String(ym.month).padStart(2, '0')} FORTUNE</p>
          <h1>{title}</h1>
          <p className="sub">
            {lang === 'ja' ? `${zd.animal}年` : zd.ko}・{t('総合', '종합')} <span className="stars">{stars(z.stars)}</span>・
            {t(`12支中${z.rank}位`, `12띠 중 ${z.rank}위`)}
          </p>
          <Updated />
        </div>
      </header>

      <section className="card-block">
        <h2>{rt.title}</h2>
        <p className="focus"><span className={`focus-tag f-${z.focus}`}>{fc.label}</span>{fc.line}</p>
        <p className="rank-line"><b className="ok">{t('開運', '개운')}</b>{rt.action}</p>
        <p className="rank-line"><b className="ng">{t('注意', '주의')}</b>{rt.caution}</p>
        <p className="note">
          {t(
            `今月の干支は${data.monthPillar}。${zd.kanji}との関係は「${z.relation}」です。`,
            `이달의 간지는 ${data.monthPillar}. ${zd.kanji}와의 관계는 "${z.relation}"입니다.`,
          )}
        </p>
      </section>

      <div className="two-col">
        <section className="card-block">
          <h2>{t('開運日', '개운일')}</h2>
          <ul className="day-list">
            {z.luckyDays.map((n) => {
              const l = dayLine(n)
              return (
                <li key={n}>
                  <b>{l.label}</b>
                  <span className="tags">{l.tags}</span>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="card-block">
          <h2>{t('注意日', '주의일')}</h2>
          <ul className="day-list ng">
            {z.cautionDays.map((n) => {
              const l = dayLine(n)
              const d = days[n - 1]
              return (
                <li key={n}>
                  <b>{l.label}</b>
                  <span className="tags">
                    {t(`${d.dayPillar}の日(${zd.kanji}と冲)`, `${d.dayPillar}일(${zd.kanji}와 충)`)}・{l.tags}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="note">
            {t(
              '冲(ちゅう)は干支が正反対にぶつかる日。六曜が良くても、大きな決断や無理は控えめに。',
              '충은 띠가 정반대로 부딪히는 날. 육요가 좋아도 큰 결정이나 무리는 자제하세요.',
            )}
          </p>
        </section>
      </div>

      <dl className="lucky-grid wide">
        <div>
          <dt>{t('ラッキーカラー', '행운의 색')}</dt>
          <dd><span className="dot" style={{ background: ELEMENT_LUCK[z.luckyElement].color }} />{lucky.colorName}</dd>
        </div>
        <div>
          <dt>{t('ラッキー方位', '행운의 방위')}</dt>
          <dd>{lucky.direction}</dd>
        </div>
      </dl>

      <section className="card-block">
        <h2>{t(`${zd.kanji}年生まれの方`, `${zd.ko}에 해당하는 분`)}</h2>
        <p className="inline-days">
          {birthYears(branch, 2025)
            .map((y) => t(`${y}年生まれ(${ym.year - y}歳になる年)`, `${y}년생(${ym.year - y}세가 되는 해)`))
            .join('、')}
        </p>
        <p className="note">
          {t(
            '※ 四柱推命では年の切り替わりは立春(2月4日頃)です。1月〜立春前に生まれた方は前年の干支になります。',
            '※ 사주에서는 해가 바뀌는 기준이 입춘(2월 4일경)입니다. 1월~입춘 전에 태어난 분은 전년도 띠가 됩니다.',
          )}
        </p>
      </section>

      <Faq route={{ page: 'eto', branch, ym }} />

      <nav className="zodiac-chips" aria-label={t('ほかの干支', '다른 띠')}>
        {ZODIAC.map((o, b) => (
          <a key={b} href={pathOf({ page: 'eto', branch: b, ym })} className={b === branch ? 'on' : undefined}>
            {o.kanji}
          </a>
        ))}
      </nav>

      <nav className="pager">
        {hasMonth(prev) ? <a href={pathOf({ page: 'eto', branch, ym: prev })}>← {t(`${prev.month}月の運勢`, `${prev.month}월 운세`)}</a> : <span />}
        {hasMonth(next) ? <a href={pathOf({ page: 'eto', branch, ym: next })}>{t(`${next.month}月の運勢`, `${next.month}월 운세`)} →</a> : <span />}
      </nav>

      <nav className="link-cards">
        <a href={pathOf({ page: 'unsei', ym })}>{t(`${ym.year}年${ym.month}月の干支別ランキング`, `${ym.year}년 ${ym.month}월 띠별 랭킹`)} →</a>
        <a href="/#top">{t('生年月日で金運・恋愛運・仕事運まで無料鑑定', '생년월일로 재물운·연애운·일운까지 무료 감정')} →</a>
      </nav>
    </div>
  )
}
