import { useState, type ReactNode } from 'react'
import { useT } from '../lib/i18n'
import { currentLinks } from '../routes'

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useT()
  const [menuOpen, setMenuOpen] = useState(false)
  const links = currentLinks()

  return (
    <>
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="logo" href="/">
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
            <a href={links.unsei}>{t('干支別の運勢', '띠별 운세')}</a>
            <a href={links.kichijitsu}>{t('吉日カレンダー', '길일 달력')}</a>
            <a href={links.rokuyo}>{t('六曜カレンダー', '육요 달력')}</a>
            <a className="nav-cta" href="/#top">{t('無料で鑑定', '무료 감정')}</a>
          </nav>
        </div>
      </header>

      <main id="top">{children}</main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-top">
            <span className="logo-seal small">暦</span>
            <nav>
              <a href={links.unsei}>{t('干支別の運勢', '띠별 운세')}</a>
              <a href={links.kichijitsu}>{t('吉日カレンダー', '길일 달력')}</a>
              <a href={links.rokuyo}>{t('六曜カレンダー', '육요 달력')}</a>
              <a href="/#about">{t('こよみサジュとは', '코요미 사주란?')}</a>
            </nav>
          </div>
          <p className="disclaimer">
            {t(
              '当サイトの占い結果はエンターテインメントとしてお楽しみください。暦の計算は韓国天文研究院(KASI)の万歳暦と国立天文台の暦要項に基づいています。',
              '이 사이트의 점 결과는 오락으로 즐겨 주세요. 달력 계산은 한국천문연구원(KASI) 만세력과 일본 국립천문대 역요항을 기반으로 합니다.',
            )}
          </p>
          <p className="copy">© 2026 {t('こよみサジュ', '코요미 사주')}</p>
        </div>
      </footer>
    </>
  )
}

/** パンくず(ページ上部) */
export function Breadcrumb({ items }: { items: [string, string?][] }) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ol>
        {items.map(([label, href], i) => (
          <li key={i}>{href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}</li>
        ))}
      </ol>
    </nav>
  )
}
