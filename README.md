# こよみサジュ (koyomisaju.com)

韓国式四柱推命 × 日本の六曜で「動く日・休む日」を伝える、日本向けの占いサイト。

## 構成
- **暦計算**: [@fullstackfamily/manseryeok](https://github.com/urstory/manseryeok-js) (KASI基準の万歳暦) — AI不使用
- `src/lib/koyomi.ts` — 六曜 / 選日(天赦日・一粒万倍日・寅の日・巳の日・己巳の日) / 干支の月運スコア / 四柱(出生地経度で真太陽時補正)
- `src/data/content.ts` — 文章テンプレートバンク(日本語 + 検討用韓国語)
- `src/lib/i18n.tsx` — 検討用の韓国語表示(開発サーバー、または `?review` 付きURLでのみ切替ボタン表示)

## ページ構成(SEO)
| URL | 内容 | 描画 |
|---|---|---|
| `/` | トップ(今日のこよみ・無料鑑定・ランキング) | クライアント(日付で変わるため) |
| `/kichijitsu/2026` | 年間の吉日カレンダー | ビルド時に事前レンダリング |
| `/rokuyo/2026` | 年間の六曜カレンダー | 〃 |
| `/unsei/2026-10` | 月別の干支ランキング | 〃 |
| `/eto/tora/2026-10` | 干支×月の運勢 | 〃 |

- `src/routes.ts` がページ一覧・タイトル/説明文・範囲(暦ページの年 `YEARS`、月別ページ `FIRST_MONTH`〜`LAST_MONTH`)を持つ。
- `npm run build` = クライアントビルド → SSRビルド(`src/entry-server.tsx`)→ `scripts/prerender.mjs` で `dist/**.html` と `sitemap.xml` を生成。Vercel の `cleanUrls` で拡張子なしのURLになる。
- ナビの「今月・今年」はビルド日時で決まるため、**毎月1回は再デプロイ**する。範囲を延ばすときは `LAST_MONTH` / `YEARS` を更新(公開済みURLを消さないよう `FIRST_MONTH` は動かさない)。

## 開発
```bash
npm install
npm run dev      # http://localhost:5180 (launch.json は --host 付き、同一Wi-Fiのスマホから確認可)
npm run build
```

## メモ
- 生年月日は新暦(西暦)のみ受け付ける。日本では旧暦の誕生日を使わず、四柱推命も節気基準のため。
- 旧暦は六曜計算にのみ使用。KASIの旧暦で2026〜2027年・2033〜2034年の六曜を日本のカレンダーと全日照合済み(差異0)。2033年の閏月はKASIも閏11月で、旧暦2033年問題の影響なし。
- ライブラリ内蔵の時刻補正は東経135°より東で分が60を超えるため、補正は `getPillars` で自前実装。
- **節入り**: manseryeok の節気データは全年同じ固定値で、月柱の切り替わり日も年によってずれる。`src/lib/sekki.ts` で 2004〜2027年は国立天文台の公表値(`setsu-naoj.ts`)、それ以外は太陽視黄経の計算式(Meeus, 残差±12分)で節入りを決め、選日の月と四柱の年柱・月柱に使う。NAOJ が翌年分を公表したら `scripts/gen-setsu-naoj.mts` で表を更新する。
- 選日(天赦日・一粒万倍日・寅/巳/己巳の日)は2026〜2027年を日本の吉日カレンダーと照合済み(差異0)。
