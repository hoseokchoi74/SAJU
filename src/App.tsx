import { useEffect, useMemo, useState } from 'react'
import { BirthForm } from './components/BirthForm'
import { KaiunCalendar } from './components/KaiunCalendar'
import { Ranking } from './components/Ranking'
import { TodayCard } from './components/TodayCard'
import { loadLang, LangProvider, reviewEnabled, saveLang, useT, type Lang } from './lib/i18n'
import { getDayInfo } from './lib/koyomi'

export default function App() {
  const [lang, setLang] = useState<Lang>(loadLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const switchLang = () => {
    const next = lang === 'ja' ? 'ko' : 'ja'
    setLang(next)
    saveLang(next)
  }

  return (
    <LangProvider value={lang}>
      <Page />
      {reviewEnabled() && (
        <button className="lang-toggle" onClick={switchLang} aria-label="表示言語の切り替え(検討用)">
          <span className="lang-tag">{lang === 'ja' ? 'JA' : 'KO'}</span>
          {lang === 'ja' ? '한국어로 보기' : '日本語に戻す'}
        </button>
      )}
    </LangProvider>
  )
}

function Page() {
  const { t } = useT()
  const now = new Date()
  const today = useMemo(() => getDayInfo(now.getFullYear(), now.getMonth() + 1, now.getDate()), [])
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="logo" href="#top">
            <span className="logo-seal">暦</span>
            <span className="logo-text">
              <b>{t('こよみサジュ', '코요미 사주')}</b>
              <small>{t('韓国式四柱推命 × 六曜', '한국식 사주 × 육요')}</small>
            </span>
          </a>
          <button className="menu-btn" aria-label={t('メニュー', '메뉴')} onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
          </button>
          <nav className={menuOpen ? 'nav open' : 'nav'} onClick={() => setMenuOpen(false)}>
            <a href="#ranking">{t('干支別の運勢', '띠별 운세')}</a>
            <a href="#calendar">{t('開運カレンダー', '개운 달력')}</a>
            <a href="#about">{t('こよみサジュとは', '코요미 사주란?')}</a>
            <a className="nav-cta" href="#top">{t('無料で鑑定', '무료 감정')}</a>
          </nav>
        </div>
      </header>

      <main id="top">
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
            <TodayCard info={today} />
          </div>
        </section>

        <Ranking today={today} />
        <KaiunCalendar today={today} />

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

        <section className="line-cta">
          <div className="wrap line-inner">
            <div>
              <h2>{t('毎週月曜、あなたの干支の運勢をLINEでお届け', '매주 월요일, 당신 띠의 운세를 LINE으로 보내드립니다')}</h2>
              <p>{t('開運日の前日にはお知らせも。友だち追加は無料です。', '개운일 전날에는 알림도 보내드려요. 친구 추가는 무료입니다.')}</p>
            </div>
            <a className="btn-line" href="#top">{t('LINEで友だち追加', 'LINE 친구 추가')}</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <span className="logo-seal small">暦</span>
            <nav>
              <a href="#top">{t('運営者情報', '운영자 정보')}</a>
              <a href="#top">{t('特定商取引法に基づく表記', '특정상거래법에 따른 표기')}</a>
              <a href="#top">{t('プライバシーポリシー', '개인정보처리방침')}</a>
              <a href="#top">{t('お問い合わせ', '문의')}</a>
            </nav>
          </div>
          <p className="disclaimer">
            {t(
              '当サイトの占い結果はエンターテインメントとしてお楽しみください。暦の計算は韓国天文研究院(KASI)のデータに基づく万歳暦を使用しています。',
              '이 사이트의 점 결과는 오락으로 즐겨 주세요. 달력 계산에는 한국천문연구원(KASI) 데이터에 기반한 만세력을 사용합니다.',
            )}
          </p>
          <p className="copy">© 2026 {t('こよみサジュ', '코요미 사주')}</p>
        </div>
      </footer>
    </>
  )
}
