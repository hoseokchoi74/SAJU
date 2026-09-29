// AEO/GEO: よくある質問(画面表示と FAQPage 構造化データで同じ文を使う)、JSON-LD、llms.txt。
// 答えは暦エンジンの計算結果から作るので、ページの表・一覧と必ず一致する。
import { SENJITSU_NAME_KO, texts, ZODIAC } from './data/content'
import { bank } from './data/bank'
import type { Lang } from './lib/i18n'
import { getMonthDays, getZodiacMonthly, type DayInfo, type Senjitsu } from './lib/koyomi'
import { metaOf, monthList, pathOf, SITE, staticRoutes, YEARS, type Route, type YM } from './routes'

declare const __BUILD_DATE__: string
export const BUILD_DAY = __BUILD_DATE__.slice(0, 10)

export interface QA {
  q: string
  a: string
}

const WD = { ja: '日月火水木金土', ko: '일월화수목금토' }
const yearDays = (year: number) => Array.from({ length: 12 }, (_, i) => getMonthDays(year, i + 1)).flat()
const md = (d: DayInfo, lang: Lang) =>
  lang === 'ko' ? `${d.month}월 ${d.day}일(${WD.ko[d.weekday]})` : `${d.month}月${d.day}日(${WD.ja[d.weekday]})`
const join = (xs: string[], lang: Lang) => xs.join(lang === 'ko' ? ', ' : '、')
const sName = (s: Senjitsu, lang: Lang) => (lang === 'ko' ? SENJITSU_NAME_KO[s] : s)

export function faqOf(r: Route, lang: Lang): QA[] {
  const t = (ja: string, ko: string) => (lang === 'ko' ? ko : ja)
  const tx = texts(lang)

  switch (r.page) {
    case 'home':
    case 'about':
      return [
        {
          q: t('こよみサジュとは何ですか？', '코요미 사주는 무엇인가요?'),
          a: t(
            '韓国式の四柱推命(サジュ)と日本の六曜・選日(一粒万倍日・天赦日など)を組み合わせた無料の占い・暦サイトです。生年月日から本質と今月の運勢を読み、開運日・注意日まで具体的にお伝えします。',
            '한국식 사주와 일본의 육요·선일(일립만배일·천사일 등)을 조합한 무료 운세·달력 사이트입니다. 생년월일로 본질과 이달의 운세를 읽고 개운일·주의일까지 구체적으로 알려드립니다.',
          ),
        },
        {
          q: t('韓国式四柱推命(サジュ)とは何ですか？', '한국식 사주란 무엇인가요?'),
          a: t(
            '生まれた年・月・日・時を干支(十干・十二支)で表した8文字(八字)から、その人の本質や運の流れを読む占術です。日本では四柱推命と呼ばれ、韓国では「サジュ(四柱)」として日常的に親しまれています。',
            '태어난 연·월·일·시를 간지(천간·지지)로 나타낸 여덟 글자(팔자)로 사람의 본질과 운의 흐름을 읽는 점술입니다. 일본에서는 사주추명, 한국에서는 "사주"로 일상적으로 친숙합니다.',
          ),
        },
        {
          q: t('生まれた時刻がわからなくても占えますか？', '태어난 시각을 몰라도 볼 수 있나요?'),
          a: t(
            'はい。時刻が不明な場合は時柱を除いた年・月・日の三柱で鑑定します。出生地を選ぶと、わかる場合は経度で真太陽時に補正します。',
            '네. 시각을 모르면 시주를 뺀 연·월·일 세 기둥으로 감정합니다. 시각을 알면 출생지 경도로 진태양시 보정을 합니다.',
          ),
        },
        {
          q: t('旧暦の誕生日で入力できますか？', '음력 생일로 입력할 수 있나요?'),
          a: t(
            '新暦(西暦)の生年月日で入力してください。四柱推命の年・月は旧暦ではなく立春などの節気で決まるため、新暦の日付がもっとも正確です。',
            '양력 생년월일로 입력해 주세요. 사주의 연·월은 음력이 아니라 입춘 같은 절기로 정해지기 때문에 양력 날짜가 가장 정확합니다.',
          ),
        },
        {
          q: t('暦のデータの出典は？', '달력 데이터의 출처는?'),
          a: t(
            '節入り(立春などの節気)の時刻は国立天文台 暦計算室の暦要項、旧暦・干支は韓国天文研究院(KASI)のデータにもとづく万歳暦を使っています。2026〜2027年の六曜・選日は日本の暦と全日照合しています。',
            '절입(입춘 등 절기) 시각은 일본 국립천문대 역계산실의 역요항, 음력·간지는 한국천문연구원(KASI) 데이터 기반 만세력을 씁니다. 2026~2027년 육요·선일은 일본 달력과 전일 대조했습니다.',
          ),
        },
        {
          q: t('料金はかかりますか？', '요금이 드나요?'),
          a: t('鑑定・カレンダーはすべて無料で、会員登録も不要です。入力した生年月日は保存しません。', '감정과 달력은 모두 무료이고 회원가입도 필요 없습니다. 입력한 생년월일은 저장하지 않습니다.'),
        },
      ]

    case 'kichijitsu': {
      const all = yearDays(r.year)
      const has = (d: DayInfo, s: Senjitsu) => d.senjitsu.includes(s)
      const tensha = all.filter((d) => has(d, '天赦日'))
      const ichi = all.filter((d) => has(d, '一粒万倍日'))
      const strongest = tensha.filter((d) => has(d, '一粒万倍日'))
      const ichiTaian = ichi.filter((d) => d.rokuyo === '大安')
      const tora = all.filter((d) => has(d, '寅の日'))
      const mi = all.filter((d) => has(d, '巳の日') || has(d, '己巳の日'))
      const tsuchinotomi = all.filter((d) => has(d, '己巳の日'))
      const y = r.year
      return [
        {
          q: t(`${y}年の天赦日はいつですか？`, `${y}년 천사일은 언제인가요?`),
          a: t(
            `${y}年の天赦日は${join(tensha.map((d) => md(d, lang)), lang)}の${tensha.length}日です。天赦日は年に数回しかない最上の吉日とされます。`,
            `${y}년 천사일은 ${join(tensha.map((d) => md(d, lang)), lang)}의 ${tensha.length}일입니다. 1년에 몇 번 없는 최상의 길일로 여겨집니다.`,
          ),
        },
        {
          q: t(`${y}年の最強開運日はいつですか？`, `${y}년 최강 개운일은 언제인가요?`),
          a: strongest.length
            ? t(
                `天赦日と一粒万倍日が重なる${join(strongest.map((d) => md(d, lang)), lang)}が、${y}年の最強開運日です。`,
                `천사일과 일립만배일이 겹치는 ${join(strongest.map((d) => md(d, lang)), lang)}이 ${y}년 최강 개운일입니다.`,
              )
            : t(`${y}年は天赦日と一粒万倍日が重なる日はありません。最上の吉日は天赦日です。`, `${y}년에는 천사일과 일립만배일이 겹치는 날이 없습니다. 최상의 길일은 천사일입니다.`),
        },
        {
          q: t(`${y}年の一粒万倍日は何日ありますか？`, `${y}년 일립만배일은 며칠인가요?`),
          a: t(
            `${ichi.length}日あります。そのうち大安と重なるのは${join(ichiTaian.map((d) => md(d, lang)), lang) || 'ありません'}です。`,
            `${ichi.length}일입니다. 그중 대안과 겹치는 날은 ${join(ichiTaian.map((d) => md(d, lang)), lang) || '없습니다'}입니다.`,
          ),
        },
        {
          q: t(`${y}年の寅の日・巳の日は何日ありますか？`, `${y}년 인일·사일은 며칠인가요?`),
          a: t(
            `寅の日は${tora.length}日、巳の日は${mi.length}日です。巳の日のうち60日に一度の己巳の日は${join(tsuchinotomi.map((d) => md(d, lang)), lang)}です。`,
            `인일은 ${tora.length}일, 사일은 ${mi.length}일입니다. 사일 중 60일에 한 번인 기사일은 ${join(tsuchinotomi.map((d) => md(d, lang)), lang)}입니다.`,
          ),
        },
        {
          q: t('一粒万倍日にするとよいことは？', '일립만배일에 하면 좋은 일은?'),
          a: t(
            `${tx.senjitsu['一粒万倍日']}。新しい財布の使い始め、口座開設、仕事や習いごとのスタートなど「始めること」に向く日です。借金や人からものを借りることは、苦労が増えるとされ避けるのが一般的です。`,
            `${tx.senjitsu['一粒万倍日']}. 새 지갑 사용 시작, 통장 개설, 일이나 배움의 시작 등 "시작하는 일"에 어울리는 날입니다. 빚을 지거나 남에게 빌리는 일은 고생이 늘어난다고 해서 피하는 것이 일반적입니다.`,
          ),
        },
      ]
    }

    case 'rokuyo': {
      const all = yearDays(r.year)
      const y = r.year
      const count = (k: string) => all.filter((d) => d.rokuyo === k).length
      const perMonth = Array.from({ length: 12 }, (_, i) => all.filter((d) => d.month === i + 1 && d.rokuyo === '大安').length)
      return [
        {
          q: t(`${y}年の大安は何日ありますか？`, `${y}년 대안은 며칠인가요?`),
          a: t(
            `${y}年の大安は${count('大安')}日です。月別では${perMonth.map((n, i) => `${i + 1}月${n}日`).join('、')}です。`,
            `${y}년 대안은 ${count('大安')}일입니다. 월별로는 ${perMonth.map((n, i) => `${i + 1}월 ${n}일`).join(', ')}입니다.`,
          ),
        },
        {
          q: t(`${y}年の仏滅は何日ありますか？`, `${y}년 불멸은 며칠인가요?`),
          a: t(`${y}年の仏滅は${count('仏滅')}日、友引は${count('友引')}日です。`, `${y}년 불멸은 ${count('仏滅')}일, 우인은 ${count('友引')}일입니다.`),
        },
        {
          q: t('六曜はどうやって決まるのですか？', '육요는 어떻게 정해지나요?'),
          a: t(
            '旧暦の月と日を足して6で割った余りで決まります。余りが0なら大安、1は赤口、2は先勝、3は友引、4は先負、5は仏滅です。そのため旧暦の毎月1日は月ごとに決まった六曜から始まります。',
            '음력의 월과 일을 더해 6으로 나눈 나머지로 정해집니다. 나머지 0은 대안, 1은 적구, 2는 선승, 3은 우인, 4는 선부, 5는 불멸입니다.',
          ),
        },
        {
          q: t('六曜の良い時間帯は？', '육요별 좋은 시간대는?'),
          a: t(
            `大安は${tx.rokuyo['大安'].short}、先勝は${tx.rokuyo['先勝'].short}、友引は${tx.rokuyo['友引'].short}、先負は${tx.rokuyo['先負'].short}、赤口は${tx.rokuyo['赤口'].short}とされます。`,
            `대안은 ${tx.rokuyo['大安'].short}, 선승은 ${tx.rokuyo['先勝'].short}, 우인은 ${tx.rokuyo['友引'].short}, 선부는 ${tx.rokuyo['先負'].short}, 적구는 ${tx.rokuyo['赤口'].short}으로 여겨집니다.`,
          ),
        },
      ]
    }

    case 'unsei': {
      const { year, month } = r.ym
      const data = getZodiacMonthly(year, month)
      const ranked = [...data.list].sort((a, b) => a.rank - b.rank)
      const zn = (b: number) => (lang === 'ko' ? ZODIAC[b].ko : `${ZODIAC[b].kanji}年`)
      const top = ranked.slice(0, 3)
      const last = ranked[11]
      const bk = bank(lang)
      const best = getMonthDays(year, month).filter((d) => d.luck === 'best' || d.senjitsu.includes('天赦日'))
      return [
        {
          q: t(`${year}年${month}月に運勢が一番良い干支は？`, `${year}년 ${month}월 운세가 가장 좋은 띠는?`),
          a: t(
            `1位は${zn(top[0].branch)}、2位は${zn(top[1].branch)}、3位は${zn(top[2].branch)}です。1位の${zn(top[0].branch)}は「${bk.relation(top[0].relation, top[0].variant).title}」。今月の干支は${data.monthPillar}です。`,
            `1위 ${zn(top[0].branch)}, 2위 ${zn(top[1].branch)}, 3위 ${zn(top[2].branch)}입니다. 1위 ${zn(top[0].branch)}는 "${bk.relation(top[0].relation, top[0].variant).title}". 이달의 간지는 ${data.monthPillar}입니다.`,
          ),
        },
        {
          q: t(`${year}年${month}月に注意したい干支は？`, `${year}년 ${month}월 조심할 띠는?`),
          a: t(
            `12位は${zn(last.branch)}です。「${bk.relation(last.relation, last.variant).caution}」を意識すると運気が安定します。`,
            `12위는 ${zn(last.branch)}입니다. "${bk.relation(last.relation, last.variant).caution}"을 의식하면 운이 안정됩니다.`,
          ),
        },
        {
          q: t(`${year}年${month}月の最強開運日は？`, `${year}년 ${month}월 최강 개운일은?`),
          a: best.length
            ? join(best.map((d) => `${md(d, lang)} ${[d.rokuyo, ...d.senjitsu.map((s) => sName(s, lang))].join('・')}`), lang)
            : t(`${month}月は大安と一粒万倍日が重なる日や天赦日はありません。`, `${month}월에는 대안과 일립만배일이 겹치는 날이나 천사일이 없습니다.`),
        },
      ]
    }

    case 'eto': {
      const { year, month } = r.ym
      const z = getZodiacMonthly(year, month).list[r.branch]
      const zd = ZODIAC[r.branch]
      const bk = bank(lang)
      const rt = bk.relation(z.relation, z.variant)
      const days = getMonthDays(year, month)
      const dayTag = (n: number) => {
        const d = days[n - 1]
        return `${md(d, lang)}(${[d.rokuyo, ...d.senjitsu.map((s) => sName(s, lang))].join('・')})`
      }
      const name = lang === 'ko' ? zd.ko : `${zd.kanji}年(${zd.animal}年)生まれ`
      const lucky = tx.luck[z.luckyElement]
      return [
        {
          q: t(`${zd.kanji}年生まれの${year}年${month}月の運勢は？`, `${zd.ko}의 ${year}년 ${month}월 운세는?`),
          a: t(
            `${name}の${month}月は12支中${z.rank}位(★${z.stars})。「${rt.title}」がテーマです。${rt.action}。`,
            `${name}의 ${month}월은 12띠 중 ${z.rank}위(★${z.stars}). "${rt.title}"가 테마입니다. ${rt.action}.`,
          ),
        },
        {
          q: t(`${zd.kanji}年生まれの${month}月の開運日は？`, `${zd.ko}의 ${month}월 개운일은?`),
          a: join(z.luckyDays.map(dayTag), lang),
        },
        {
          q: t(`${zd.kanji}年生まれが${month}月に注意する日は？`, `${zd.ko}가 ${month}월에 조심할 날은?`),
          a: t(
            `${join(z.cautionDays.map(dayTag), lang)}です。日の干支が${zd.kanji}と冲(正反対)になる日なので、大きな決断や無理は控えめに。`,
            `${join(z.cautionDays.map(dayTag), lang)}입니다. 일진이 ${zd.kanji}와 충(정반대)이 되는 날이라 큰 결정이나 무리는 자제하세요.`,
          ),
        },
        {
          q: t(`${zd.kanji}年生まれの${month}月のラッキーカラーは？`, `${zd.ko}의 ${month}월 행운의 색은?`),
          a: t(`ラッキーカラーは${lucky.colorName}、ラッキー方位は${lucky.direction}です。`, `행운의 색은 ${lucky.colorName}, 행운의 방위는 ${lucky.direction}입니다.`),
        },
      ]
    }

    default:
      return []
  }
}

// ---- JSON-LD ----

const ORG = { '@type': 'Organization', '@id': `${SITE}/#org`, name: 'こよみサジュ', url: `${SITE}/` }

function breadcrumbOf(r: Route): [string, string][] {
  const home: [string, string] = ['トップ', `${SITE}/`]
  const self: [string, string] = [metaOf(r).title.split('｜')[0], metaOf(r).canonical]
  if (r.page === 'home') return [home]
  if (r.page === 'eto') return [home, [`${r.ym.year}年${r.ym.month}月の干支別運勢`, SITE + pathOf({ page: 'unsei', ym: r.ym })], self]
  return [home, self]
}

export function jsonLdOf(r: Route): object[] {
  const meta = metaOf(r)
  const out: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': meta.canonical,
      url: meta.canonical,
      name: meta.title,
      description: meta.description,
      inLanguage: 'ja',
      dateModified: BUILD_DAY,
      isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'こよみサジュ', url: `${SITE}/` },
      publisher: ORG,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbOf(r).map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
    },
  ]
  const faq = faqOf(r, 'ja')
  if (faq.length) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    })
  }
  return out
}

// ---- llms.txt ----

export function llmsTxt(): string {
  const months = monthList()
  const lines = [
    '# こよみサジュ (Koyomi Saju)',
    '',
    '> 韓国式四柱推命(サジュ)と日本の六曜・選日(一粒万倍日・天赦日・寅の日・巳の日)を組み合わせた、日本向けの無料占い・暦サイト。暦の計算は国立天文台の暦要項(節入り時刻)と韓国天文研究院(KASI)の万歳暦(旧暦・干支)にもとづき、2026〜2027年の六曜・選日は日本の暦と全日照合済み。',
    '',
    '## 暦カレンダー',
    ...YEARS.flatMap((y) => [
      `- [${y}年の吉日カレンダー](${SITE}/kichijitsu/${y}): 一粒万倍日・天赦日・寅の日・巳の日・己巳の日・大安の月別一覧と最強開運日`,
      `- [${y}年の六曜カレンダー](${SITE}/rokuyo/${y}): 大安・赤口・先勝・友引・先負・仏滅の月別カレンダーと大安の日一覧`,
    ]),
    '',
    '## 月別の干支(十二支)運勢',
    ...months.map((ym) => `- [${ym.year}年${ym.month}月の干支別運勢ランキング](${SITE}${pathOf({ page: 'unsei', ym })})`),
    '',
    '干支×月の個別ページ: `' + SITE + '/eto/{nezumi|ushi|tora|usagi|tatsu|hebi|uma|hitsuji|saru|tori|inu|inoshishi}/{YYYY-MM}`',
    '',
    '## サイトについて',
    `- [こよみサジュとは(計算方法・出典)](${SITE}/about)`,
    `- [無料鑑定(生年月日から金運・恋愛運・仕事運・健康運・対人運)](${SITE}/)`,
    `- [全ページの一覧と要点](${SITE}/llms-full.txt)`,
    '',
  ]
  return lines.join('\n')
}

/** 主要な事実を1ファイルに(AIの回答・引用用)。FAQ と同じ計算結果を使う */
export function llmsFullTxt(): string {
  const parts: string[] = [llmsTxt(), `最終更新: ${BUILD_DAY}`, '']
  const sections: Route[] = [
    { page: 'about' },
    ...YEARS.flatMap((year) => [{ page: 'kichijitsu', year }, { page: 'rokuyo', year }] as Route[]),
    ...monthList().map((ym: YM) => ({ page: 'unsei', ym }) as Route),
  ]
  for (const r of sections) {
    const m = metaOf(r)
    parts.push(`## ${m.title.split('｜')[0]}`, `URL: ${m.canonical}`, '')
    for (const { q, a } of faqOf(r, 'ja')) parts.push(`Q. ${q}`, `A. ${a}`, '')
  }
  return parts.join('\n')
}

/** sitemap 用 */
export const allStaticRoutes = staticRoutes
