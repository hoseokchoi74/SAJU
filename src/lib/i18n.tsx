// 検討用の韓国語表示。本番の訪問者には見せず、開発サーバー または ?review 付きURLでのみ切り替えボタンを出す。
import { createContext, useContext } from 'react'

export type Lang = 'ja' | 'ko'

const LangContext = createContext<Lang>('ja')
export const LangProvider = LangContext.Provider

export function useT() {
  const lang = useContext(LangContext)
  return { lang, t: (ja: string, ko: string) => (lang === 'ko' ? ko : ja) }
}

export const reviewEnabled = () => import.meta.env.DEV || new URLSearchParams(location.search).has('review')

const KEY = 'koyomi-lang'
export function loadLang(): Lang {
  try {
    return reviewEnabled() && localStorage.getItem(KEY) === 'ko' ? 'ko' : 'ja'
  } catch {
    return 'ja'
  }
}
export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {
    /* ストレージ不可でも表示は切り替わる */
  }
}
