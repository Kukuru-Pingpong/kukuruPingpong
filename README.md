# 🎮 쿠쿠루삥뽕 (Kukuru-Pingpong)

[![Hackathon](https://img.shields.io/badge/Gemini_3_Seoul_Hackathon-Participant-blue)](https://cerebralvalley.ai/e/gemini-3-seoul-hackathon)

> **"영화 속 명대사를 따라하며 AI 평가 기반으로 대결하는 실시간 턴제 음성 배틀 게임"**
> 
> (Gemini 3 서울 해커톤 "엔터테인먼트 트랙" 출품작 - 팀 **Kukuru-Pingpong**)

---

## 📝 프로젝트 소개

**쿠쿠루삥뽕**은 한국의 대중적인 밈이자 영화/드라마 명대사를 활용한 실시간 턴제 음성 배틀 게임입니다. 짧고 강렬한 세션(1~3분) 동안 유저들은 유명 영화의 명대사를 직접 연기하며 대결을 펼치며, **Google Gemini API**가 음성 심판이 되어 영화의 원본 대사와 유저의 목소리를 비교하여 승패를 결정합니다.

단순히 목소리를 녹음하는 것을 넘어, Gemini를 활용한 **4중 AI 파이프라인**을 게임 루프의 핵심에 배치하여 몰입감 높은 엔터테인먼트 경험을 창조했습니다.

---

## ✨ 핵심 기능 및 임팩트

### 1. 🤖 AI 기반 정밀 음성 판정 (Voice Judge)
- 두 플레이어의 녹음 음성을 `gemini-2.5-flash` 모델로 분석합니다.
- 어조(Tone), 감정이입(Emotion), 리듬(Rhythm), 발음(Pronunciation) 등 4가지 지표를 기준(총점 100점)으로 평가하여 점수를 부여하고 냉철한 승패 피드백을 제공합니다.

### 2. 💥 실시간 데미지 및 HP 격투 시스템
- 각 플레이어는 100의 HP(하트 3개)를 가지며, 두 플레이어가 획득한 AI 점수 차이에 비례해 상대의 HP를 깎는 직관적인 대결 룰을 적용했습니다.

### 3. ⏱️ 무호흡 레이턴시 마스킹 (Latency Masking)
- 상대방 턴의 음성을 듣는 "재생/연출 시간" 동안 백그라운드에서 실시간으로 AI 점수 평가를 수행하여, **로딩 화면 없이 끊김 없고 몰입감 넘치는 멀티플레이 경험**을 완성했습니다.

### 4. 🔗 다양한 Gemini API 다중 활용 결합
- **대사 리믹스 (Sentence Generator):** 무작위 키워드와 원본 대사를 `gemini-2.5-flash` 모델로 합성하여 기발하고 새로운 대사를 창조합니다.
- **TTS (Text-to-Speech):** `gemini-2.5-flash-preview-tts` 모델을 이용해 로컬 모드에서 AI 상대방의 대사를 고품질 음성으로 실시간 변환하여 게임 내 에셋으로 활용합니다.
- **이미지 생성 (Image Generator):** `gemini-2.0-flash-exp-image-generation` 모델 파이프라인으로 플레이어들의 개성 넘치는 8종의 캐릭터 초상화를 생성하여 인게임에 적용했습니다.

---

## 🎯 게임 플로우

1. **로비**: 로컬(1기기 2P) 또는 온라인(6자리 방 코드) 모드 선택
2. **캐릭터 & 키워드 선택**: 8종의 고유 캐릭터와 30개 이상의 한국 콘텐츠 명대사 중 조합 선택
3. **AI 대사 생성**: 선택된 키워드와 대사를 기반으로 AI가 기발한 연기 대본 생성
4. **녹음 배틀**: 화면에 표시된 대사를 플레이어가 각자의 목소리로 연기 (제한 시간 5초)
5. **AI 심판 및 연출**: 7단계 배틀 애니메이션과 함께 Gemini 음성 심판의 평가 점수 적용
6. **결과**: 지속되는 라운드를 거쳐 어느 한쪽의 HP가 먼저 소진되면 승패(KO)가 결정됩니다.

---

## 🛠️ 기술 스택

- **Frontend:** Next.js 15, React 19, Socket.io-client
- **Backend:** NestJS, Socket.io
- **AI & Cloud:** Google Gemini API, Google Cloud Platform (GCP)
- **Architecture:** pnpm workspaces + Turborepo 기반 Monorepo 구조
- **Architecture Design:** FSD (Feature-Sliced Design) 패턴 적용 프론트엔드 설계 및 백엔드 DDD 스타일 레이어링

---

## 🚀 프로젝트 구조 및 로컬 실행 방법

본 프로젝트는 **pnpm workspace**와 **Turborepo** 기반으로 구축되었습니다.

### 1. 환경 변수 설정 (`.env`)
환경 변수 파일 하나로 서버와 프론트엔드의 구동이 가능하도록 설정해야 합니다. (기본 포트: Web `3000`, Server `4000`)

```bash
# 최상위 루트 .env 파일 또는 각 앱 별 설정
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=4000
NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
```

### 2. 의존성 패키지 설치
```bash
pnpm install
```

### 3. 전체 서비스 통합 실행
명령어 하나로 웹 프론트엔드와 NestJS 백엔드 서버를 동시에 병렬로 구동합니다.

```bash
pnpm run dev
```

서버만 띄우거나 웹만 띄우고 싶다면 아래의 스크립트를 사용합니다.
```bash
# 백엔드 로컬 실행
pnpm run dev:server

# 프론트엔드 로컬 실행
pnpm run dev:web
```

---

## 🎬 데모 및 제출 자료

*(본 섹션에는 해커톤 제출용 작동 데모 링크와 발표 영상 링크가 포함될 예정입니다)*
- [Kukuru-Pingpong GitHub Repository](https://github.com/Kukuru-Pingpong/kukuruPingpong)
- [3분 기술 데모 시연 영상](./asset/video/kkrp_demo.mp4)

---
> **🏆 개발 배경**: 본 프로젝트는 2026년 2월 28일 개최된 "Gemini 3 서울 해커톤"의 엔터테인먼트 트랙 프로덕션 스프린트 출품작으로 기획되었습니다. 한국 엔터테인먼트의 명대사 콘텐츠와 혁신적인 Google Gemini AI 파이프라인을 융합하여 남녀노소 즐길 수 있는 창의적인 파티형 배틀 게임으로 구현되었습니다.
