import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles.css'
import { Root } from './Root.tsx'

const el = document.getElementById('root')!
const app = (
  <StrictMode>
    <Root path={location.pathname} />
  </StrictMode>
)

// 暦・運勢ページはビルド時に事前レンダリング済み(scripts/prerender.mjs)。トップはクライアントで描画する。
if (el.hasChildNodes()) hydrateRoot(el, app)
else createRoot(el).render(app)
