import qrcode from 'qrcode-generator'
import { LINE_ADD_URL } from '../config'
import { useT } from '../lib/i18n'

/** LINE公式の「友だち追加」ボタン(LINE のブランドガイドラインに沿って公式画像を使う) */
function AddButton() {
  return (
    <a className="line-add" href={LINE_ADD_URL} target="_blank" rel="noopener">
      <img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加" height={36} width={116} />
    </a>
  )
}

/** 友だち追加URLのQRコード(PCで表示。スマホで読み取ってもらう) */
function Qr({ size = 120 }: { size?: number }) {
  const qr = qrcode(0, 'M')
  qr.addData(LINE_ADD_URL)
  qr.make()
  const n = qr.getModuleCount()
  let d = ''
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c},${r}h1v1h-1z`
  return (
    <svg className="line-qr" viewBox={`-2 -2 ${n + 4} ${n + 4}`} width={size} height={size} role="img" aria-label="LINE友だち追加QRコード">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  )
}

/** トップの大きな帯 */
export function LineBand() {
  const { t } = useT()
  if (!LINE_ADD_URL) return null
  return (
    <section className="line-cta" id="line">
      <div className="wrap line-inner">
        <div>
          <h2>{t('開運日のお知らせや今月の運勢をLINEでお届け', '개운일 알림과 이달의 운세를 LINE으로 보내드립니다')}</h2>
          <p>{t('友だち追加は無料。配信はいつでも停止できます。', '친구 추가는 무료. 수신은 언제든 끌 수 있습니다.')}</p>
          <div className="line-actions">
            <AddButton />
          </div>
        </div>
        <div className="line-qr-box">
          <Qr />
          <small>{t('スマホで読み取り', '휴대폰으로 스캔')}</small>
        </div>
      </div>
    </section>
  )
}

/** 鑑定結果や運勢ページの下に置く小さなカード */
export function LineCard({ context }: { context: 'result' | 'page' }) {
  const { t } = useT()
  if (!LINE_ADD_URL) return null
  return (
    <aside className="line-card">
      <div className="line-card-text">
        <b>
          {context === 'result'
            ? t('あなたの開運日を忘れないように', '나의 개운일을 잊지 않도록')
            : t('毎月の運勢と開運日をLINEで', '매달의 운세와 개운일을 LINE으로')}
        </b>
        <span>
          {context === 'result'
            ? t('LINEで友だち追加すると、開運日のお知らせや月の運勢が届きます。', 'LINE 친구 추가하면 개운일 알림과 월 운세를 받을 수 있습니다.')
            : t('一粒万倍日・天赦日などの最強開運日もお知らせします。', '일립만배일·천사일 같은 최강 개운일도 알려드립니다.')}
        </span>
      </div>
      <AddButton />
    </aside>
  )
}

/** フッター用のテキストリンク */
export function LineLink() {
  const { t } = useT()
  if (!LINE_ADD_URL) return null
  return (
    <a href={LINE_ADD_URL} target="_blank" rel="noopener">
      {t('LINE公式アカウント', 'LINE 공식 계정')}
    </a>
  )
}
