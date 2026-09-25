import { useMemo, useState } from 'react'
import { BirthForm } from './components/BirthForm'
import { KaiunCalendar } from './components/KaiunCalendar'
import { Ranking } from './components/Ranking'
import { TodayCard } from './components/TodayCard'
import { getDayInfo } from './lib/koyomi'

export default function App() {
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
              <b>こよみサジュ</b>
              <small>韓国式四柱推命 × 六曜</small>
            </span>
          </a>
          <button className="menu-btn" aria-label="メニュー" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
          </button>
          <nav className={menuOpen ? 'nav open' : 'nav'} onClick={() => setMenuOpen(false)}>
            <a href="#ranking">干支別の運勢</a>
            <a href="#calendar">開運カレンダー</a>
            <a href="#about">こよみサジュとは</a>
            <a className="nav-cta" href="#top">無料で鑑定</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">韓国の四柱推命 × 日本の六曜</p>
              <h1>
                あなたが<em>動く日</em>、
                <br />
                <em>休む日</em>がわかる。
              </h1>
              <p className="lead">
                生年月日から韓国式の四柱推命であなたの本質と今月の流れを読み、
                六曜と開運日で「いつ、何をするか」までお伝えします。
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
            <h2 className="section-title">こよみサジュの占い方</h2>
            <ol className="steps">
              <li>
                <span className="step-no">一</span>
                <h3>四柱推命(韓国式)</h3>
                <p>生まれた年・月・日・時の干支から、あなたの本質と五行のバランスを読み解きます。韓国で「サジュ」と呼ばれ親しまれている占術です。</p>
              </li>
              <li>
                <span className="step-no">二</span>
                <h3>六曜・開運日</h3>
                <p>大安・仏滅などの六曜に、一粒万倍日・天赦日などの吉日を重ね、日ごとの吉凶を整理します。</p>
              </li>
              <li>
                <span className="step-no">三</span>
                <h3>あなたの開運アクション</h3>
                <p>ふたつを掛け合わせ、「この日にこれをすると◎」「ここは控えめに」を具体的にお届けします。</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="line-cta">
          <div className="wrap line-inner">
            <div>
              <h2>毎週月曜、あなたの干支の運勢をLINEでお届け</h2>
              <p>開運日の前日にはお知らせも。友だち追加は無料です。</p>
            </div>
            <a className="btn-line" href="#top">LINEで友だち追加</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <span className="logo-seal small">暦</span>
            <nav>
              <a href="#top">運営者情報</a>
              <a href="#top">特定商取引法に基づく表記</a>
              <a href="#top">プライバシーポリシー</a>
              <a href="#top">お問い合わせ</a>
            </nav>
          </div>
          <p className="disclaimer">
            当サイトの占い結果はエンターテインメントとしてお楽しみください。暦の計算は韓国天文研究院(KASI)のデータに基づく万歳暦を使用しています。
          </p>
          <p className="copy">© 2026 こよみサジュ</p>
        </div>
      </footer>
    </>
  )
}
