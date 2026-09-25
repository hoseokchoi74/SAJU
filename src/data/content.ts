// テンプレート文章バンク(第1段階: 手書きの見本。後でAIで一括生成して差し替える)
// *_KO は検討用の韓国語訳
import type { Lang } from '../lib/i18n'
import type { Element, Relation, Rokuyo, Senjitsu } from '../lib/koyomi'

export const ZODIAC = [
  { kanji: '子', yomi: 'ね', animal: 'ねずみ', ko: '쥐띠' },
  { kanji: '丑', yomi: 'うし', animal: 'うし', ko: '소띠' },
  { kanji: '寅', yomi: 'とら', animal: 'とら', ko: '호랑이띠' },
  { kanji: '卯', yomi: 'う', animal: 'うさぎ', ko: '토끼띠' },
  { kanji: '辰', yomi: 'たつ', animal: 'りゅう', ko: '용띠' },
  { kanji: '巳', yomi: 'み', animal: 'へび', ko: '뱀띠' },
  { kanji: '午', yomi: 'うま', animal: 'うま', ko: '말띠' },
  { kanji: '未', yomi: 'ひつじ', animal: 'ひつじ', ko: '양띠' },
  { kanji: '申', yomi: 'さる', animal: 'さる', ko: '원숭이띠' },
  { kanji: '酉', yomi: 'とり', animal: 'とり', ko: '닭띠' },
  { kanji: '戌', yomi: 'いぬ', animal: 'いぬ', ko: '개띠' },
  { kanji: '亥', yomi: 'い', animal: 'いのしし', ko: '돼지띠' },
]

/** その干支に当たる生まれ年(新しい順に6つ) */
export function birthYears(branch: number, latest = 2025): number[] {
  const out: number[] = []
  for (let y = latest; out.length < 6; y--) if ((((y - 4) % 12) + 12) % 12 === branch) out.push(y)
  return out
}

type RelationText = Record<Relation, { title: string; action: string; caution: string }>

const RELATION_TEXT: RelationText = {
  支合: {
    title: '人との縁がつながる、追い風の月',
    action: '気になる人に自分から連絡を。紹介や誘いは積極的に受けて◎',
    caution: '頼まれごとを抱えすぎないように',
  },
  三合: {
    title: 'チームワークで運が広がる月',
    action: '仲間との共同作業や相談ごとが実を結びやすい時期',
    caution: '人任せにせず、最後の確認は自分で',
  },
  比和: {
    title: '自分のペースが味方になる月',
    action: '続けてきたことをもう一歩深めると成果につながります',
    caution: '頑固になりすぎず、周りの意見にも耳を',
  },
  平: {
    title: '穏やかに整える、準備の月',
    action: '部屋や予定の整理整頓で、来月の運を呼び込んで',
    caution: '大きな決断は急がず、情報集めを優先',
  },
  害: {
    title: '小さなすれ違いに気をつけたい月',
    action: 'こまめな「ありがとう」が運気のお守りに',
    caution: '言葉足らずの誤解に注意。大事な話は対面で',
  },
  刑: {
    title: '心と体をいたわる、見直しの月',
    action: '睡眠と食事を整えることが最大の開運アクション',
    caution: '無理なスケジュールや衝動買いは控えめに',
  },
  冲: {
    title: '変化の波が来る、切り替えの月',
    action: '古いものを手放すと新しい流れが入ってきます',
    caution: '契約・引っ越しなど大きな決断は吉日を選んで',
  },
}

const RELATION_TEXT_KO: RelationText = {
  支合: {
    title: '사람과의 인연이 이어지는, 순풍의 달',
    action: '신경 쓰이는 사람에게 먼저 연락을. 소개나 초대는 적극적으로 받으면 ◎',
    caution: '부탁받은 일을 너무 많이 떠안지 않도록',
  },
  三合: {
    title: '팀워크로 운이 넓어지는 달',
    action: '동료와의 공동 작업이나 상담이 결실을 맺기 쉬운 시기',
    caution: '남에게 맡기지 말고 마지막 확인은 직접',
  },
  比和: {
    title: '나만의 페이스가 내 편이 되는 달',
    action: '계속해 온 일을 한 걸음 더 깊이 파면 성과로 이어집니다',
    caution: '너무 고집부리지 말고 주변 의견에도 귀를',
  },
  平: {
    title: '차분히 정돈하는 준비의 달',
    action: '방과 일정을 정리정돈해서 다음 달 운을 불러들이세요',
    caution: '큰 결정은 서두르지 말고 정보 수집을 우선',
  },
  害: {
    title: '작은 엇갈림에 주의하고 싶은 달',
    action: '자주 하는 "고마워"가 운의 부적이 됩니다',
    caution: '말이 부족해서 생기는 오해에 주의. 중요한 얘기는 직접 만나서',
  },
  刑: {
    title: '몸과 마음을 돌보는 재점검의 달',
    action: '수면과 식사를 챙기는 것이 최고의 개운 행동',
    caution: '무리한 일정이나 충동구매는 자제',
  },
  冲: {
    title: '변화의 물결이 오는 전환의 달',
    action: '낡은 것을 놓아주면 새로운 흐름이 들어옵니다',
    caution: '계약·이사 등 큰 결정은 길일을 골라서',
  },
}

type RokuyoText = Record<Rokuyo, { yomi: string; short: string; good: string; avoid: string }>

const ROKUYO_TEXT: RokuyoText = {
  大安: { yomi: 'たいあん', short: '一日中すべてが吉', good: '入籍・契約・新しいことのスタート', avoid: '特になし。思い切って動いて◎' },
  赤口: { yomi: 'しゃっこう', short: '正午(11〜13時)のみ吉', good: 'お昼前後の用事', avoid: '火や刃物の扱い、お祝いごと' },
  先勝: { yomi: 'せんしょう', short: '午前が吉、午後は凶', good: '急ぎの用事は午前中に', avoid: '午後からの大事な約束' },
  友引: { yomi: 'ともびき', short: '朝夕は吉、昼は凶', good: '結婚式・友人とのお出かけ', avoid: '弔事' },
  先負: { yomi: 'せんぶ', short: '午前は凶、午後が吉', good: '静かに過ごし、用事は午後に', avoid: '勝負ごと・急な決断' },
  仏滅: { yomi: 'ぶつめつ', short: '万事に凶とされる日', good: '掃除・断捨離・物事の区切り', avoid: 'お祝いごと・新規の契約' },
}

const ROKUYO_TEXT_KO: RokuyoText = {
  大安: { yomi: '대안', short: '하루 종일 모든 일이 길함', good: '혼인신고·계약·새로운 일 시작', avoid: '특별히 없음. 과감하게 움직이면 ◎' },
  赤口: { yomi: '적구', short: '정오(11~13시)만 길함', good: '점심 전후의 용무', avoid: '불·칼 다루기, 축하할 일' },
  先勝: { yomi: '선승', short: '오전은 길, 오후는 흉', good: '급한 용무는 오전 중에', avoid: '오후의 중요한 약속' },
  友引: { yomi: '우인', short: '아침·저녁은 길, 낮은 흉', good: '결혼식·친구와의 외출', avoid: '장례 등 흉사' },
  先負: { yomi: '선부', short: '오전은 흉, 오후가 길', good: '조용히 보내고 용무는 오후에', avoid: '승부·급한 결정' },
  仏滅: { yomi: '불멸', short: '만사에 흉하다고 여겨지는 날', good: '청소·물건 정리·일 매듭짓기', avoid: '축하할 일·새 계약' },
}

const SENJITSU_TEXT: Record<Senjitsu, string> = {
  天赦日: '年に数回の最上の吉日。何を始めても◎',
  一粒万倍日: '始めたことが万倍に実る日。財布の新調に',
  寅の日: '出したお金が戻ってくる金運の日',
  巳の日: '弁財天の縁日。金運・芸事のお願いに',
  己巳の日: '60日に一度の、巳の日より強い金運日',
}

const SENJITSU_TEXT_KO: Record<Senjitsu, string> = {
  天赦日: '1년에 몇 번뿐인 최상의 길일. 무엇을 시작해도 ◎',
  一粒万倍日: '시작한 일이 만 배로 결실을 맺는 날. 지갑 새로 장만하기에 좋음',
  寅の日: '나간 돈이 다시 돌아오는 금운의 날',
  巳の日: '변재천(재물·예능의 여신)의 날. 금운·예능 관련 소원에',
  己巳の日: '60일에 한 번, 사일(巳の日)보다 강한 금운일',
}

export const SENJITSU_NAME_KO: Record<Senjitsu, string> = {
  天赦日: '천사일',
  一粒万倍日: '일립만배일',
  寅の日: '인일(寅の日)',
  巳の日: '사일(巳の日)',
  己巳の日: '기사일(己巳の日)',
}

type DayMasterText = Record<string, { yomi: string; image: string }>

const DAY_MASTER_TEXT: DayMasterText = {
  甲: { yomi: 'きのえ', image: 'まっすぐ伸びる大樹' },
  乙: { yomi: 'きのと', image: 'しなやかな草花' },
  丙: { yomi: 'ひのえ', image: '明るく照らす太陽' },
  丁: { yomi: 'ひのと', image: 'やさしく灯るろうそく' },
  戊: { yomi: 'つちのえ', image: 'どっしりとした山' },
  己: { yomi: 'つちのと', image: '実りを育てる田畑' },
  庚: { yomi: 'かのえ', image: '鍛えられた鋼' },
  辛: { yomi: 'かのと', image: 'きらめく宝石' },
  壬: { yomi: 'みずのえ', image: '広がる大海' },
  癸: { yomi: 'みずのと', image: 'めぐみの雨' },
}

const DAY_MASTER_TEXT_KO: DayMasterText = {
  甲: { yomi: '갑', image: '곧게 뻗는 큰 나무' },
  乙: { yomi: '을', image: '유연한 풀꽃' },
  丙: { yomi: '병', image: '밝게 비추는 태양' },
  丁: { yomi: '정', image: '은은하게 빛나는 촛불' },
  戊: { yomi: '무', image: '듬직한 산' },
  己: { yomi: '기', image: '결실을 키우는 논밭' },
  庚: { yomi: '경', image: '단련된 강철' },
  辛: { yomi: '신', image: '반짝이는 보석' },
  壬: { yomi: '임', image: '넓게 펼쳐진 바다' },
  癸: { yomi: '계', image: '은혜로운 비' },
}

const LUCK_NAME: Record<Element, { colorName: string; direction: string }> = {
  木: { colorName: 'グリーン', direction: '東' },
  火: { colorName: 'レッド', direction: '南' },
  土: { colorName: 'イエロー', direction: '中央' },
  金: { colorName: 'ホワイト', direction: '西' },
  水: { colorName: 'ネイビー', direction: '北' },
}

const LUCK_NAME_KO: typeof LUCK_NAME = {
  木: { colorName: '초록', direction: '동' },
  火: { colorName: '빨강', direction: '남' },
  土: { colorName: '노랑', direction: '중앙' },
  金: { colorName: '흰색', direction: '서' },
  水: { colorName: '남색', direction: '북' },
}

/** 言語に合わせた文章バンクを返す */
export function texts(lang: Lang) {
  const ko = lang === 'ko'
  return {
    relation: ko ? RELATION_TEXT_KO : RELATION_TEXT,
    rokuyo: ko ? ROKUYO_TEXT_KO : ROKUYO_TEXT,
    senjitsu: ko ? SENJITSU_TEXT_KO : SENJITSU_TEXT,
    senjitsuName: (s: Senjitsu) => (ko ? SENJITSU_NAME_KO[s] : s),
    dayMaster: ko ? DAY_MASTER_TEXT_KO : DAY_MASTER_TEXT,
    luck: ko ? LUCK_NAME_KO : LUCK_NAME,
    weekdays: ko ? '일월화수목금토' : '日月火水木金土',
  }
}

// 出生地(都道府県庁所在地)の経度 — 真太陽時の補正に使う [日本語, 経度, 韓国語]
export const PREFECTURES: [string, number, string][] = [
  ['北海道', 141.35, '홋카이도'], ['青森県', 140.74, '아오모리현'], ['岩手県', 141.15, '이와테현'],
  ['宮城県', 140.87, '미야기현'], ['秋田県', 140.1, '아키타현'], ['山形県', 140.36, '야마가타현'],
  ['福島県', 140.47, '후쿠시마현'], ['茨城県', 140.45, '이바라키현'], ['栃木県', 139.88, '도치기현'],
  ['群馬県', 139.06, '군마현'], ['埼玉県', 139.65, '사이타마현'], ['千葉県', 140.12, '지바현'],
  ['東京都', 139.69, '도쿄도'], ['神奈川県', 139.64, '가나가와현'], ['新潟県', 139.02, '니가타현'],
  ['富山県', 137.21, '도야마현'], ['石川県', 136.63, '이시카와현'], ['福井県', 136.22, '후쿠이현'],
  ['山梨県', 138.57, '야마나시현'], ['長野県', 138.18, '나가노현'], ['岐阜県', 136.72, '기후현'],
  ['静岡県', 138.38, '시즈오카현'], ['愛知県', 136.91, '아이치현'], ['三重県', 136.51, '미에현'],
  ['滋賀県', 135.87, '시가현'], ['京都府', 135.76, '교토부'], ['大阪府', 135.52, '오사카부'],
  ['兵庫県', 135.18, '효고현'], ['奈良県', 135.83, '나라현'], ['和歌山県', 135.17, '와카야마현'],
  ['鳥取県', 134.24, '돗토리현'], ['島根県', 133.05, '시마네현'], ['岡山県', 133.93, '오카야마현'],
  ['広島県', 132.46, '히로시마현'], ['山口県', 131.47, '야마구치현'], ['徳島県', 134.56, '도쿠시마현'],
  ['香川県', 134.04, '가가와현'], ['愛媛県', 132.77, '에히메현'], ['高知県', 133.53, '고치현'],
  ['福岡県', 130.42, '후쿠오카현'], ['佐賀県', 130.3, '사가현'], ['長崎県', 129.87, '나가사키현'],
  ['熊本県', 130.74, '구마모토현'], ['大分県', 131.61, '오이타현'], ['宮崎県', 131.42, '미야자키현'],
  ['鹿児島県', 130.56, '가고시마현'], ['沖縄県', 127.68, '오키나와현'], ['海外・わからない', 135, '해외·모름'],
]
