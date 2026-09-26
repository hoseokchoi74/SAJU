# こよみサジュ (koyomisaju.com)

韓国式四柱推命 × 日本の六曜で「動く日・休む日」を伝える、日本向けの占いサイト。

## 構成
- **暦計算**: [@fullstackfamily/manseryeok](https://github.com/urstory/manseryeok-js) (KASI基準の万歳暦) — AI不使用
- `src/lib/koyomi.ts` — 六曜 / 選日(天赦日・一粒万倍日・寅の日・巳の日・己巳の日) / 干支の月運スコア / 四柱(出生地経度で真太陽時補正)
- `src/data/content.ts` — 文章テンプレートバンク(日本語 + 検討用韓国語)
- `src/lib/i18n.tsx` — 検討用の韓国語表示(開発サーバー、または `?review` 付きURLでのみ切替ボタン表示)

## 開発
```bash
npm install
npm run dev      # http://localhost:5180 (launch.json は --host 付き、同一Wi-Fiのスマホから確認可)
npm run build
```

## メモ
- 生年月日は新暦(西暦)のみ受け付ける。日本では旧暦の誕生日を使わず、四柱推命も節気基準のため。
- 旧暦は六曜計算にのみ使用。KASIの旧暦と日本の旧暦はほぼ一致するが、旧暦2033年問題の期間は要検証。
- ライブラリ内蔵の時刻補正は東経135°より東で分が60を超えるため、補正は `getPillars` で自前実装。
