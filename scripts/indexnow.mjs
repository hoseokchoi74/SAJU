// 手動で全URLを IndexNow に通知する(デプロイ完了後に実行)。
//   node scripts/indexnow.mjs
import { submitSitemapToIndexNow } from '../api/_indexnow.js'

const r = await submitSitemapToIndexNow()
console.log(`IndexNow: HTTP ${r.status}, ${r.count} URLs ${r.body}`)
if (r.status !== 200 && r.status !== 202) process.exit(1)
