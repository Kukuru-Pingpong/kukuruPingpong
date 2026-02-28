import type { Quote } from '../model/types';

const quotes: Quote[] = [
  // 한국 영화 레전드
  { id: 1, text: "한 놈만 패!", source: "친구", keywords: ["의리", "부산", "조폭", "주먹", "청춘"], category: 'movie' },
  { id: 2, text: "우리가 남이가!", source: "친구", keywords: ["동창", "우정", "배신", "부두", "그리움"], category: 'movie' },
  { id: 3, text: "내가 고자라니!", source: "바람의 파이터", keywords: ["격투", "운명", "분노", "링", "도전"], category: 'movie' },
  { id: 4, text: "묻지마, 걸어!", source: "타짜", keywords: ["도박", "화투", "승부", "사기", "인생"], category: 'movie' },
  { id: 5, text: "돈이 다림질이야.", source: "기생충", keywords: ["반지하", "계단", "냄새", "격차", "가족"], category: 'movie' },
  { id: 6, text: "제일 좋은 계획은 계획이 없는 거야.", source: "기생충", keywords: ["계획", "지하실", "비밀", "폭우", "기택"], category: 'movie' },
  { id: 7, text: "아직도 배가 고프다.", source: "올드보이", keywords: ["복수", "감금", "만두", "15년", "기억"], category: 'movie' },
  { id: 8, text: "내가 왕이 될 상인가!", source: "광해", keywords: ["대역", "궁궐", "광대", "왕좌", "백성"], category: 'movie' },
  { id: 9, text: "치킨은 국민 음식이야!", source: "극한직업", keywords: ["치킨", "형사", "잠복", "마약", "수사"], category: 'movie' },
  { id: 10, text: "살아남는 게 이기는 거야.", source: "신세계", keywords: ["잠입", "조직", "배신", "정체", "생존"], category: 'movie' },
  { id: 11, text: "보고 있나? 보고 있어?", source: "살인의 추억", keywords: ["비", "논길", "화성", "미제", "형사"], category: 'movie' },
  { id: 12, text: "사랑이 어떻게 변하니.", source: "봄날은 간다", keywords: ["녹음기", "강원도", "이별", "소리", "봄"], category: 'movie' },
  { id: 13, text: "할 수 있다! 할 수 있다!", source: "국가대표", keywords: ["스키점프", "올림픽", "도전", "비행", "눈물"], category: 'movie' },
  { id: 14, text: "내가 잡으면 끝이야.", source: "범죄도시", keywords: ["주먹", "대림동", "검거", "괴물", "거리"], category: 'movie' },
  { id: 15, text: "무궁화 꽃이 피었습니다.", source: "오징어 게임", keywords: ["달고나", "줄다리기", "구슬", "상금", "생존"], category: 'movie' },
  { id: 16, text: "깐부잖아, 우리.", source: "오징어 게임", keywords: ["편먹기", "약속", "노인", "게임", "신뢰"], category: 'movie' },
  { id: 17, text: "사딸라! 사딸라!", source: "야인시대", keywords: ["주먹", "종로", "싸움", "전설", "시장"], category: 'movie' },

  // 한국 드라마 레전드
  { id: 18, text: "도망치지 마. 괜찮지 않아도 괜찮아.", source: "사이코지만 괜찮아", keywords: ["동화", "나비", "트라우마", "성", "치유"], category: 'drama' },
  { id: 19, text: "어른도 아파. 어른이라 참는 거지.", source: "응답하라 1988", keywords: ["골목", "쌍문동", "추억", "성장", "가족"], category: 'drama' },
  { id: 20, text: "지금 이 순간이 제일 젊은 거야.", source: "응답하라 1988", keywords: ["바둑", "라면", "청춘", "이웃", "시간"], category: 'drama' },
  { id: 21, text: "쓸쓸해서 찬란한, 그것이 인생이야.", source: "도깨비", keywords: ["메밀꽃", "검", "첫눈", "저승", "영원"], category: 'drama' },
  { id: 22, text: "난 절대 무릎 꿇지 않아.", source: "이태원 클라쓰", keywords: ["포장마차", "복수", "꿈", "밤", "뜨거움"], category: 'drama' },
  { id: 23, text: "기러기 토마토 스위스 인도인 별똥별.", source: "이상한 변호사 우영우", keywords: ["고래", "법정", "김밥", "자폐", "정의"], category: 'drama' },
  { id: 24, text: "복수는 나의 것.", source: "더 글로리", keywords: ["복수", "바둑", "학교", "진실", "분노"], category: 'drama' },
  { id: 25, text: "선재야, 죽지 마.", source: "선재 업고 튀어", keywords: ["타임슬립", "우산", "운명", "밴드", "고백"], category: 'drama' },
  { id: 26, text: "악으로 악을 벌한다.", source: "빈센조", keywords: ["마피아", "금괴", "정의", "옥수수", "이탈리아"], category: 'drama' },
  { id: 27, text: "포기하면 편해. 근데 포기 안 하면 기적이 일어나.", source: "슬기로운 의사생활", keywords: ["병원", "수술", "밴드", "99즈", "우정"], category: 'drama' },
  { id: 28, text: "힘든 건 힘들다고 말해야 해.", source: "나의 아저씨", keywords: ["도청", "위로", "야근", "걸음", "술"], category: 'drama' },
  { id: 29, text: "해방되고 싶어.", source: "나의 해방일지", keywords: ["출퇴근", "해방", "삼형제", "고백", "일상"], category: 'drama' },
  { id: 30, text: "이번 생은 처음이라.", source: "이번 생은 처음이라", keywords: ["월세", "자취", "계약", "서른", "현실"], category: 'drama' },
];

export default quotes;
