// 事前レンダリング用(vite build --ssr)。scripts/prerender.mjs から呼ばれる。
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Root } from './Root.tsx'

export { metaOf, pathOf, SITE, staticRoutes } from './routes.ts'
export { jsonLdOf, llmsFullTxt, llmsTxt } from './seo.ts'

export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <Root path={path} />
    </StrictMode>,
  )
}
