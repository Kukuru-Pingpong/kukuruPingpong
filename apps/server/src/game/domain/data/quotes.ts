export interface Quote {
  id: number;
  text: string;
  actor: string;
  character: string;
  movie: string;
  audio: string;
}

const quotes: Quote[] = [
  { id: 1, text: "느그 서장 남천동 살제?", actor: "최민식", character: "최익현", movie: "범죄와의 전쟁", audio: "se_001.m4a" },
  { id: 2, text: "묻고 더블로 가!", actor: "김응수", character: "곽철용", movie: "타짜", audio: "se_002.m4a" },
  { id: 3, text: "어이가 없네?", actor: "유아인", character: "조태오", movie: "베테랑", audio: "se_003.m4a" },
  { id: 4, text: "살려는 드릴게.", actor: "박성웅", character: "이중구", movie: "신세계", audio: "se_004.m4a" },
  { id: 5, text: "누구냐, 넌.", actor: "최민식", character: "오대수", movie: "올드보이", audio: "se_005.m4a" },
  { id: 6, text: "이거 방탄유리야", actor: "원빈", character: "차태식", movie: "아저씨", audio: "se_006.m4a" },
  { id: 7, text: "너나 잘하세요.", actor: "이영애", character: "이금자", movie: "친절한 금자씨", audio: "se_007.m4a" },
  { id: 8, text: "니가 가라 하와이.", actor: "장동건", character: "한동수", movie: "친구", audio: "se_008.m4a" },
  { id: 9, text: "꼭 다 가져가야만 속이 후련했냐!", actor: "김래원", character: "오태식", movie: "해바라기", audio: "se_009.m4a" },
];

export function getQuoteById(id: number): Quote | undefined {
  return quotes.find((q) => q.id === id);
}

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default quotes;
