import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { loadLang, LangProvider, reviewEnabled, saveLang, useT, type Lang } from './lib/i18n'
import { EtoPage } from './pages/EtoPage'
import { HomePage } from './pages/HomePage'
import { KichijitsuPage } from './pages/KichijitsuPage'
import { RokuyoPage } from './pages/RokuyoPage'
import { UnseiPage } from './pages/UnseiPage'
import { resolve, type Route } from './routes'

export function Root({ path }: { path: string }) {
  const route = resolve(path)
  // 事前レンダリングされたHTMLと一致させるため、初回は日本語で描画し、マウント後に検討用の言語設定を読む
  const [lang, setLang] = useState<Lang>('ja')
  const [review, setReview] = useState(false)

  useEffect(() => {
    setReview(reviewEnabled())
    setLang(loadLang())
  }, [])

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
      <Layout>
        <Page route={route} />
      </Layout>
      {review && (
        <button className="lang-toggle" onClick={switchLang} aria-label="表示言語の切り替え(検討用)">
          <span className="lang-tag">{lang === 'ja' ? 'JA' : 'KO'}</span>
          {lang === 'ja' ? '한국어로 보기' : '日本語に戻す'}
        </button>
      )}
    </LangProvider>
  )
}

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case 'home':
      return <HomePage />
    case 'kichijitsu':
      return <KichijitsuPage year={route.year} />
    case 'rokuyo':
      return <RokuyoPage year={route.year} />
    case 'unsei':
      return <UnseiPage ym={route.ym} />
    case 'eto':
      return <EtoPage branch={route.branch} ym={route.ym} />
    default:
      return <NotFound />
  }
}

function NotFound() {
  const { t } = useT()
  return (
    <div className="wrap page">
      <header className="page-head">
        <h1>{t('ページが見つかりません', '페이지를 찾을 수 없습니다')}</h1>
        <p className="lead">
          <a href="/">{t('トップページへ戻る', '홈으로 돌아가기')}</a>
        </p>
      </header>
    </div>
  )
}
