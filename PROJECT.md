# K-Drama Battle (voice-battle)

**한국 드라마/영화 명대사 성우 배틀 게임**. 두 플레이어가 AI가 리믹스한 명대사를 누가 더 감정적으로, 정확하게 읽는지 겨루고, Google Gemini AI가 심판을 봅니다. 패배자는 HP 데미지를 받고, HP가 0이 되면 KO.

---

## 기술 스택

| 레이어 | 기술 | 버전 |
|---|---|---|
| 모노레포 | pnpm + Turborepo | pnpm 9.15, turbo ^2.3 |
| 백엔드 | NestJS (포트 4000) | ^10.4.15 |
| 프론트엔드 | Next.js App Router + React | Next ^15.1, React ^19.0 |
| 실시간 통신 | Socket.IO | 서버 ^4.8.3, 클라 ^4.8.1 |
| AI | Google Gemini | @google/generative-ai ^0.21.0 |
| 파일 업로드 | Multer | ^1.4.5-lts.1 |
| 스타일링 | 순수 CSS (globals.css 1,410줄) | — |
| DB | 없음 (인메모리 Map) | — |
| 언어 | TypeScript | ^5.7.2 |

---

## 게임 모드

- **로컬 모드**: 한 기기에서 2인 플레이 (P2는 AI TTS로 대체)
- **온라인 모드**: 6자리 방 코드로 매칭, WebSocket 실시간 통신

---

## 게임 흐름

### 온라인 모드

```
로비 → 방 생성/참가 (6자리 코드) → [game-start]
→ 캐릭터 선택 (동시) → [both-characters-selected]
→ 키워드 선택 (각자 제출) → [words-ready]
→ P1이 AI 문장 생성 → [sentence-generated]
→ 녹음 (동시) → [both-recordings-done]
→ P1이 AI 심판 요청 → [judgment-result]
→ 배틀 애니메이션 (7단계)
→ P1이 round-complete 전송 → [round-result]
→ HP 0이면 KO / 아니면 다음 라운드 (키워드 선택으로)
```

### 로컬 모드

```
로비 → 캐릭터 선택 (P1 → P2 순차)
→ 키워드 선택 (P1 → P2 순차, 명대사 풀에서)
→ AI 문장 생성
→ P1 녹음 → AI가 P2 TTS 생성
→ AI 심판 → 배틀 애니메이션 → 라운드 결과
→ HP 0이면 KO / 아니면 다음 라운드
```

---

## 백엔드 아키텍처

클린/DDD 스타일 레이어링: Domain → Application → Infrastructure

### AI 모듈 — REST API

| 엔드포인트 | 요청 | 응답 | Gemini 모델 |
|---|---|---|---|
| `POST /api/generate-sentence` | `{ word1, quote? }` | `{ sentence }` | gemini-2.5-flash |
| `POST /api/ai-word` | — | `{ word }` | 없음 (55개 풀에서 랜덤) |
| `POST /api/tts` | `{ text }` | binary audio/wav | gemini-2.5-flash-preview-tts |
| `POST /api/generate-character-image` | `{ name, emoji, description }` | binary image | gemini-2.0-flash-exp-image-generation |
| `POST /api/judge` | FormData: audio1, audio2, sentence | JudgmentResult JSON | gemini-2.5-flash |

### AI 심판 평가 기준 (Gemini 프롬프트)

- 감정이입 (emotion)
- 표현력 (expression)
- 발음 정확도 (pronunciation)
- 몰입감 (immersion)

### JudgmentResult 구조

```typescript
{
  player1_score: number;    // 0~100
  player2_score: number;    // 0~100
  winner: number;           // 1 또는 2
  reason: string;           // 승리 이유
  player1_feedback: string; // P1에 대한 피드백
  player2_feedback: string; // P2에 대한 피드백
}
```

### 게임 모듈 — WebSocket 이벤트

#### 클라이언트 → 서버

| 이벤트 | 페이로드 | 동작 |
|---|---|---|
| `create-room` | — | 방 생성, `{ roomCode, playerNum }` 응답 |
| `join-room` | `roomCode` | 방 참가, `game-start` 브로드캐스트 |
| `select-character` | `{ characterId }` | 둘 다 선택 시 `both-characters-selected` |
| `submit-word` | `{ word }` | 상대방에게 `opponent-word-submitted`, 둘 다 시 `words-ready` |
| `sentence-ready` | `{ sentence }` | 방에 `sentence-generated` 브로드캐스트 |
| `recording-done` | `{ audioBase64 }` | 상대방에게 `opponent-recording-done`, 둘 다 시 `both-recordings-done` |
| `judgment-ready` | `judgment` | 방에 `judgment-result` 브로드캐스트 |
| `round-complete` | `{ hp, round, ko }` | 방에 `round-result` 브로드캐스트 |

#### 서버 → 클라이언트

| 이벤트 | 페이로드 | 의미 |
|---|---|---|
| `game-start` | — | 양쪽 입장 완료, 캐릭터 선택으로 |
| `both-characters-selected` | `{ char1, char2 }` | 키워드 선택으로 |
| `opponent-word-submitted` | — | 상대방 키워드 제출 완료 |
| `words-ready` | `{ word1, word2 }` | P1이 문장 생성 |
| `sentence-generated` | `{ sentence }` | 녹음 화면으로 |
| `opponent-recording-done` | — | 상대방 녹음 완료 |
| `both-recordings-done` | `{ audio1, audio2 }` (base64) | 배틀 화면으로 |
| `judgment-result` | JudgmentResult | AI 심판 결과 |
| `round-result` | `{ hp, round }` | HP 업데이트 |
| `opponent-left` | — | 상대방 연결 해제 |

---

## 프론트엔드 구조

Feature-Sliced Design (FSD): `app/` → `features/` → `widgets/` → `entities/` → `shared/`

### 페이지

| 라우트 | 설명 |
|---|---|
| `/` | 로비 — 로컬/온라인 모드 선택 |
| `/online` | 온라인 로비 — 방 생성 (코드 표시 + 대기) / 코드로 참가 |
| `/character-select` | 4x2 그리드에서 캐릭터 선택 (로컬: P1→P2 순차, 온라인: 동시) |
| `/word-select` | 명대사에서 키워드 칩 선택 + BattleHud 표시 |
| `/recording` | 문장 표시, 오디오 비주얼라이저, 원형 녹음 버튼, 타이머 |
| `/battle` | 양쪽 녹음 동시 재생 → AI 심판 → 7단계 배틀 애니메이션 |
| `/result` | 애니메이션 점수 카운터, 승자 발표, AI 코멘트 |
| `/ko` | 4단계 KO 연출 (플래시 → KO 텍스트 → 캐릭터 → 결과 + 재대결) |

### 위젯

| 위젯 | 설명 |
|---|---|
| `AudioVisualizer` | Canvas 기반 실시간 주파수 바 (48개 바, 미러링, Web Audio API AnalyserNode) |
| `BattleHud` | 양쪽 HP 바 + 라운드 번호 (HP ≤40 노랑, ≤20 빨강 펄스) |
| `CharacterAvatar` | 캐릭터 PNG 이미지 래퍼 |

### 전역 상태 (GameContext)

단일 React Context — 외부 상태 라이브러리 없음

| 상태 | 설명 |
|---|---|
| `mode` | `'local'` \| `'online'` |
| `p1Character`, `p2Character` | 선택된 캐릭터 |
| `p1Hp`, `p2Hp` | 각 플레이어 HP (기본 100) |
| `round` | 현재 라운드 |
| `sentence`, `quoteSource` | AI 생성 문장, 원본 명대사 출처 |
| `recordings` | `[P1 Blob, P2 Blob]` |
| `judgment` | AI 심판 결과 |
| `playerNum` | 온라인에서 내 플레이어 번호 |
| `lastDamage`, `isKo`, `koLoser` | 배틀 결과 |
| `socketRef` | Socket.IO 인스턴스 |

---

## 캐릭터 (8종)

| ID | 이름 | 이모지 | 오라 컬러 | 캐치프레이즈 | 공격 대사 |
|---|---|---|---|---|---|
| 1 | 불꽃 대사왕 | 🔥 | #ff6b35 | 내 대사에 불을 붙여라! | 타올라라! |
| 2 | 눈물 여왕 | 💧 | #74b9ff | 눈물 없인 볼 수 없는 연기 | 느껴봐라, 이 감정! |
| 3 | 츤데레 검사 | ⚖️ | #a29bfe | 이의 있소! ...관심 없지만. | 판결을 내리겠다! |
| 4 | 열혈 형사 | 🔍 | #fdcb6e | 진실은 하나! 내 목소리! | 체포한다! |
| 5 | 재벌 3세 | 💎 | #e17055 | 돈으로 안 되는 건 없어. | 이게 바로 클래스! |
| 6 | 천재 해커 | 💻 | #00cec9 | 시스템을 해킹하겠어. | Access Granted! |
| 7 | 전설의 조폭 | 🐉 | #d63031 | 형님 먼저. | 한 놈만 팬다! |
| 8 | 로맨스 요정 | ✨ | #fd79a8 | 사랑은 타이밍이야. | 심장을 저격! |

캐릭터 이미지: `/public/characters/{id}.png` (Gemini로 사전 생성 + 배경 제거)
동적 생성: `useCharacterImage` 훅으로 Gemini 이미지 생성 → localStorage 캐싱

---

## 명대사 데이터 (30개)

### 영화 (17개)

친구, 바람의 파이터, 타짜, 기생충 (x2), 올드보이, 광해, 극한직업, 신세계, 살인의 추억, 봄날은 간다, 국가대표, 범죄도시, 오징어 게임 (x2), 야인시대

### 드라마 (13개)

사이코지만 괜찮아, 응답하라 1988 (x2), 도깨비, 이태원 클라쓰, 이상한 변호사 우영우, 더 글로리, 선재 업고 튀어, 빈센조, 슬기로운 의사생활, 나의 아저씨, 나의 해방일지, 이번 생은 처음이라

각 명대사 구조: `{ id, text, source, keywords[5], category }`

---

## 핵심 도메인 로직

| 항목 | 내용 |
|---|---|
| HP | 100에서 시작, 0~100 클램핑 |
| 데미지 계산 | `max(승자점수 - 패자점수, 5)` — 압도적 승리 시 더 큰 데미지 |
| KO 조건 | HP ≤ 0 |
| 최소 데미지 | 5 (점수가 비슷해도 최소 5 데미지) |
| 게임 상태 | WAITING → CHARACTER_SELECT → WORD_SELECT → RECORDING → BATTLE |
| 방 코드 | 6자리 영숫자 대문자 (랜덤 생성) |
| P1 역할 | 온라인에서 P1이 문장 생성/심판 요청/라운드 완료를 전담 |

---

## 배틀 애니메이션 (7단계)

1. **enter** — 양쪽 캐릭터 등장
2. **scores** — 점수 카운트업 애니메이션
3. **charge** — 승자 캐릭터 차징 (오라 글로우 + 공격 대사 표시)
4. **projectile** — 투사체 발사
5. **hit** — 패자 피격 (흔들림 효과)
6. **hp** — HP 바 감소 애니메이션
7. **done** — 승리 텍스트 표시

---

## 저장소

- **백엔드**: `InMemoryRoomRepository` (Map), `PlayerRegistry` (Map) — 서버 재시작 시 모든 데이터 소실
- **프론트엔드**: React Context (런타임), localStorage (캐릭터 이미지 캐시)
- **DB 없음**

---

## 환경 변수

| 변수 | 위치 | 설명 |
|---|---|---|
| `GEMINI_API_KEY` | 백엔드, 스크립트 | Google Gemini API 키 |
| `PORT` | 백엔드 | HTTP 서버 포트 (기본: 4000) |
| `FRONTEND_URL` | 백엔드 | CORS 허용 원본 (기본: http://localhost:3000) |
| `NEXT_PUBLIC_BACKEND_URL` | 프론트엔드 | WebSocket 서버 URL (기본: http://localhost:4000) |

---

## Gemini AI 활용 (4중)

| 기능 | 모델 | 용도 |
|---|---|---|
| 문장 생성 | gemini-2.5-flash | 키워드 + 명대사를 리믹스하여 새 문장 생성 |
| 음성 심판 | gemini-2.5-flash | 두 음성 녹음을 비교 평가 (0~100점) |
| TTS | gemini-2.5-flash-preview-tts | 로컬 모드에서 AI 상대 음성 생성 (voice: Kore) |
| 이미지 생성 | gemini-2.0-flash-exp-image-generation | 치비 캐릭터 일러스트 생성 |

---

## 스크립트

| 파일 | 언어 | 용도 |
|---|---|---|
| `scripts/generate-character-images.mjs` | Node.js (ESM) | 8개 캐릭터 PNG 일괄 생성 (3초 딜레이, 이미 있으면 스킵) |
| `scripts/remove-bg.py` | Python (Pillow) | PNG 흰색 배경 → 투명 처리 (R,G,B > 225 → alpha 0) |

---

## 프로젝트 구조

```
/game/
  package.json, turbo.json, .env
  scripts/
    generate-character-images.mjs
    remove-bg.py
  apps/
    backend/src/
      main.ts, app.module.ts
      ai/
        ai.module.ts
        application/services/ai.service.ts
        domain/services/    (5개 포트 인터페이스)
        domain/value-objects/judgment-result.vo.ts
        infrastructure/adapters/gemini.adapter.ts
        infrastructure/controllers/ai.controller.ts
      game/
        game.module.ts
        application/services/room.service.ts
        domain/entities/    (Room, Player)
        domain/services/    (BattleService)
        domain/value-objects/ (GameState, Hp, RoomCode)
        domain/repositories/ (IRoomRepository)
        infrastructure/gateway/ (GameGateway, PlayerRegistry)
        infrastructure/repositories/ (InMemoryRoomRepository)
    front/src/
      app/          (9개 페이지 라우트)
      contexts/     (GameContext)
      entities/     (character, quote 데이터)
      features/     (9개 피처 스크린)
      shared/       (api, audio, socket, types, ui)
      widgets/      (audio-visualizer, battle-hud, character-avatar)
```
