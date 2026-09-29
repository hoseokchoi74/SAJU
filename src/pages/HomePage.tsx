import { useEffect, useState } from 'react'
import { BirthForm } from '../components/BirthForm'
import { Faq } from '../components/Faq'
import { KaiunCalendar } from '../components/KaiunCalendar'
import { Ranking } from '../components/Ranking'
import { TodayCard } from '../components/TodayCard'
import { useT } from '../lib/i18n'
import { getDayInfo, type DayInfo } from '../lib/koyomi'

// トップはビルド時に事前レンダリングする(AIクローラーなどJSを実行しない読み手にも本文が届くように)。
// 「今日」で内容が変わる部分(今日のこよみ・ランキング・開運カレンダー)はマウント後にクライアントで描画する。
export function HomePage() {
  const { t } = useT()
  const [today, setToday] = useState<DayInfo | null>(null)
  useEffect(() => {
    const now = new Date()
    setToday(getDayInfo(now.getFullYear(), now.getMonth() + 1, now.getDate()))
  }, [])

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{t('韓国の四柱推命 × 日本の六曜', '한국의 사주 × 일본의 육요')}</p>
            <h1>
              {t('あなたが', '당신이 ')}
              <em>{t('動く日', '움직일 날')}</em>
              {t('、', ',')}
              <br />
              <em>{t('休む日', '쉴 날')}</em>
              {t('がわかる。', '을 알 수 있다.')}
            </h1>
            <p className="lead">
              {t(
                '生年月日から韓国式の四柱推命であなたの本質と今月の流れを読み、六曜と開運日で「いつ、何をするか」までお伝えします。',
                '생년월일로 한국식 사주를 봐서 당신의 본질과 이달의 흐름을 읽고, 육요와 개운일로 "언제, 무엇을 할지"까지 알려드립니다.',
              )}
            </p>
            <BirthForm />
          </div>
          {today ? <TodayCard info={today} /> : <div className="today-card placeholder" aria-hidden />}
        </div>
      </section>

      {today && <Ranking today={today} />}
      {today && <KaiunCalendar today={today} />}

      <section className="section about" id="about">
        <div className="wrap">
          <p className="eyebrow center">HOW IT WORKS</p>
          <h2 className="section-title">{t('こよみサジュの占い方', '코요미 사주의 점치는 법')}</h2>
          <ol className="steps">
            <li>
              <span className="step-no">一</span>
              <h3>{t('四柱推命(韓国式)', '사주(한국식)')}</h3>
              <p>
                {t(
                  '生まれた年・月・日・時の干支から、あなたの本質と五行のバランスを読み解きます。韓国で「サジュ」と呼ばれ親しまれている占術です。',
                  '태어난 연·월·일·시의 간지로 당신의 본질과 오행의 균형을 풀어냅니다. 한국에서 "사주"라고 불리며 친숙한 점술입니다.',
                )}
              </p>
            </li>
            <li>
              <span className="step-no">二</span>
              <h3>{t('六曜・開運日', '육요·개운일')}</h3>
              <p>
                {t(
                  '大安・仏滅などの六曜に、一粒万倍日・天赦日などの吉日を重ね、日ごとの吉凶を整理します。',
                  '대안·불멸 같은 육요에 일립만배일·천사일 같은 길일을 겹쳐 날마다의 길흉을 정리합니다.',
                )}
              </p>
            </li>
            <li>
              <span className="step-no">三</span>
              <h3>{t('あなたの開運アクション', '당신의 개운 행동')}</h3>
              <p>
                {t(
                  'ふたつを掛け合わせ、「この日にこれをすると◎」「ここは控えめに」を具体的にお届けします。',
                  '둘을 합쳐 "이날 이걸 하면 ◎", "이건 자제"를 구체적으로 알려드립니다.',
                )}
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section faq-section">
        <div className="wrap">
          <Faq route={{ page: 'home' }} />
        </div>
      </section>

      <section className="line-cta">
        <div className="wrap line-inner">
          <div>
            <h2>{t('毎週月曜、あなたの干支の運勢をLINEでお届け', '매주 월요일, 당신 띠의 운세를 LINE으로 보내드립니다')}</h2>
            <p>{t('開運日の前日にはお知らせも。友だち追加は無料です。', '개운일 전날에는 알림도 보내드려요. 친구 추가는 무료입니다.')}</p>
          </div>
          <a className="btn-line" href="#top">{t('LINEで友だち追加', 'LINE 친구 추가')}</a>
        </div>
      </section>
    </>
  )
}
