import { bank } from '../data/bank'
import { fmtDays, texts, ZODIAC } from '../data/content'
import { useT } from '../lib/i18n'
import { BRANCHES, CATEGORIES, ELEMENT_LUCK, STEMS, type Element, type PersonalMonthly, type Pillars } from '../lib/koyomi'

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
const ELEMENT_ORDER: Element[] = ['木', '火', '土', '金', '水']

export function Result({ p, month }: { p: Pillars; month: PersonalMonthly }) {
  const { lang, t } = useT()
  const bk = bank(lang)
  const tx = texts(lang)
  const dm = bk.dayMaster(p.dayMaster)
  const theme = bk.tenGod(month.theme)
  const zodiac = ZODIAC[BRANCHES.indexOf(p.year[1])]
  const color = ELEMENT_LUCK[p.dayMasterElement].color
  const total = ELEMENT_ORDER.reduce((a, e) => a + month.counts[e], 0)
  const lucky = month.luckyElement
  const item = bk.luckyItem(lucky)
  // 同じ日干でも月ごと・運勢ごとに文が変わるように
  const seed = STEMS.indexOf(p.dayMaster) + month.month

  return (
    <div className="mini-result" role="status">
      <div className="pillars">
        {[
          [t('時', '시'), p.hour ?? '—'],
          [t('日', '일'), p.day],
          [t('月', '월'), p.month],
          [t('年', '년'), p.year],
        ].map(([label, pl], i) => (
          <div key={i} className={i === 1 ? 'pillar main' : 'pillar'}>
            <span>{label}{t('柱', '주')}</span>
            <b>{pl[0]}</b>
            <b>{pl[1] ?? ''}</b>
          </div>
        ))}
      </div>

      <div className="res-block">
        <p className="res-label">{t('あなたの本質', '당신의 본질')}</p>
        <p className="res-head">
          <b style={{ color }}>{p.dayMaster}</b>({dm.yomi}) — {dm.image}
        </p>
        <p>{dm.nature}</p>
        <p className="res-sub">
          {t(`日干: ${p.dayMaster}・${zodiac.kanji}年生まれ`, `일간: ${p.dayMaster} · ${zodiac.ko}`)}
        </p>
        <div className="gogyo">
          <p className="gogyo-title">
            {t('五行バランス', '오행 밸런스')}
            <small>
              {month.strong
                ? t('エネルギッシュタイプ(身強)', '에너지 넘치는 타입(신강)')
                : t('サポート活用タイプ(身弱)', '도움을 잘 살리는 타입(신약)')}
            </small>
          </p>
          {ELEMENT_ORDER.map((e) => (
            <div key={e} className="gogyo-row">
              <span className="gogyo-name">{e}</span>
              <span className="gogyo-bar">
                <i style={{ width: `${(month.counts[e] / total) * 100}%`, background: ELEMENT_LUCK[e].color }} />
              </span>
              <span className="gogyo-n">{month.counts[e]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="res-block theme">
        <p className="res-label">
          {month.month}
          {t('月の総合運', '월의 종합운')}
          <span className="tg">{bk.tenGodName(month.theme)}</span>
          <span className="stars">{stars(month.overall)}</span>
        </p>
        <p className="res-head">{theme.title}</p>
        <p>{theme.body}</p>
      </div>

      <ul className="cat-list">
        {CATEGORIES.map((c, i) => (
          <li key={c} className={`cat cat-${c}`}>
            <div className="cat-head">
              <b>{bk.categoryLabel(c)}</b>
              <span className="stars" aria-label={`${month.scores[c]}/5`}>{stars(month.scores[c])}</span>
            </div>
            <p>{bk.category(c, month.scores[c], seed + i)}</p>
            <p className="days">
              <span><b className="ok">{t('良い日', '좋은 날')}</b>{fmtDays(month.month, month.days[c].good)}</span>
              <span><b className="ng">{t('注意日', '주의할 날')}</b>{fmtDays(month.month, month.days[c].caution)}</span>
            </p>
            {c === 'health' && (
              <p className="care">
                <b>{t('ケアポイント', '케어 포인트')}</b>
                {bk.healthCare(month.weakElement)}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="res-block">
        <p className="res-label">{t('今月の開運アクション', '이달의 개운 행동')}</p>
        <p className="rank-line"><b className="ok">{t('開運', '개운')}</b>{theme.action}</p>
        <p className="rank-line"><b className="ng">{t('注意', '주의')}</b>{theme.caution}</p>
        <p className="days">
          <span><b className="ok">{t('開運日', '개운일')}</b>{fmtDays(month.month, month.luckyDays)}</span>
          <span><b className="ng">{t('注意日', '주의일')}</b>{fmtDays(month.month, month.cautionDays)}</span>
        </p>
      </div>

      <dl className="lucky-grid">
        <div>
          <dt>{t('ラッキーカラー', '행운의 색')}</dt>
          <dd><span className="dot" style={{ background: ELEMENT_LUCK[lucky].color }} />{tx.luck[lucky].colorName}</dd>
        </div>
        <div>
          <dt>{t('ラッキーナンバー', '행운의 숫자')}</dt>
          <dd>{item.numbers}</dd>
        </div>
        <div>
          <dt>{t('ラッキーアイテム', '행운의 아이템')}</dt>
          <dd>{item.item}</dd>
        </div>
        <div>
          <dt>{t('ラッキー方位', '행운의 방위')}</dt>
          <dd>{tx.luck[lucky].direction}</dd>
        </div>
      </dl>

      <p className="form-note">
        {t(
          '※ 健康運は生活のヒントです。体調に不安があるときは医療機関にご相談ください。年間の運勢や相性占いは近日公開予定です。',
          '※ 건강운은 생활 속 힌트입니다. 몸이 걱정될 때는 의료기관과 상담하세요. 연간 운세와 궁합 점은 곧 공개 예정입니다.',
        )}
      </p>
    </div>
  )
}
