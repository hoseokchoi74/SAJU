import { useT } from '../lib/i18n'
import type { Route } from '../routes'
import { BUILD_DAY, faqOf } from '../seo'

/** よくある質問(FAQPage 構造化データと同じ文)。答えを先に言い切る形で、AIの回答・引用に使われやすくする */
export function Faq({ route }: { route: Route }) {
  const { lang, t } = useT()
  const items = faqOf(route, lang)
  if (!items.length) return null
  return (
    <section className="card-block faq" id="faq">
      <h2>{t('よくある質問', '자주 묻는 질문')}</h2>
      <dl>
        {items.map(({ q, a }) => (
          <div key={q}>
            <dt>{q}</dt>
            <dd>{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** 最終更新日(構造化データの dateModified と同じ) */
export function Updated() {
  const { t } = useT()
  const [y, m, d] = BUILD_DAY.split('-').map(Number)
  return (
    <p className="updated">
      {t('最終更新', '최종 업데이트')}: <time dateTime={BUILD_DAY}>{t(`${y}年${m}月${d}日`, `${y}년 ${m}월 ${d}일`)}</time>
      {' ・ '}
      <a href="/about">{t('計算方法と出典', '계산 방법과 출처')}</a>
    </p>
  )
}
