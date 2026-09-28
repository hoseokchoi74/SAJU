import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // ナビゲーションの「今月・今年」のリンク先に使う(クライアントと事前レンダリングで同じ値にする)
    __BUILD_DATE__: JSON.stringify(process.env.BUILD_DATE ?? new Date().toISOString()),
  },
})
