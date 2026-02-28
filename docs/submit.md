# 팀이름
Kukuru-Pingpong

# 깃 레포 링크 (Public)
https://github.com/Kukuru-Pingpong

프로젝트 설명

"쿠쿠루삥뽕(Kukuru-Pingpong)"은 한국의 대중적인 밈이자 영화 명대사를 활용한 실시간 턴제 음성 배틀 게임입니다. 짧고 강렬한 세션(1~3분) 동안 유저들은 유명 영화의 명대사를 직접 연기하며 대결을 펼치며, Google Gemini 3 API가 음성 심판이 되어 영화의 원본 대사와 유저의 목소리를 비교하여 승패를 결정합니다.

단순히 목소리를 녹음하는 것을 넘어, Gemini를 활용한 4중 AI 파이프라인을 게임 루프의 핵심에 배치하여 몰입감 높은 엔터테인먼트 경험을 창조했습니다.

핵심 기능 및 임팩트

1. AI 기반 정밀 음성 판정 (Voice Judge)
   - 두 플레이어의 녹음 음성을 gemini-1.5-flash 모델로 분석합니다. 어조(Tone), 감정이입(Emotion), 리듬(Rhythm), 발음(Pronunciation) 등 4가지 지표를 기준(총점 100점)으로 냉철하게 평가하여 점수를 부여하고 승패 피드백을 제공합니다.
2. 실시간 데미지 및 HP 격투 시스템
   - 두 플레이어가 부여받은 점수 차이에 비례해 상대의 HP를 깎는 직관적인 대결 룰을 적용했습니다.
3. 무호흡 레이턴시 마스킹 (Latency Masking)
   - 상대방 턴의 음성을 재생하는 "연출 시간" 동안 백그라운드에서 실시간으로 AI 점수 평가를 수행하여, 로딩 화면 없이 끊김 없고 몰입감 넘치는 멀티플레이 경험을 완성했습니다.
4. 다양한 Gemini API 다중 활용 결합
   - 텍스트 리믹스 (Sentence Generator): 엉뚱한 무작위 단어와 원본 대사를 gemini-2.5-flash 모델로 합성하여 기발한 새로운 대사를 창조합니다.
   - TTS (Text-to-Speech): gemini-2.5-flash-preview-tts 모델을 이용해 텍스트를 고품질 음성으로 실시간 변환하여 게임 내 에셋으로 활용합니다.
   - 이미지 생성 (Image Generator): gemini-3.1-flash-image-preview 모델을 기반으로 플레이어들의 개성 넘치는 캐릭터 초상화를 생성합니다.

기술 스택
- Frontend: Next.js 15, React 19, Socket.io-client (웹 마이크 녹음 및 실시간 소켓 통신)
- Backend: NestJS, Socket.io (실시간 룸 매칭 및 턴제 상태 동기화)
- AI / Cloud: Google Gemini API (Text, Audio Analysis, Image, TTS), Google Cloud Platform

기술데모 (1분 분량 영상)
*(영상 링크 또는 첨부 내용을 이곳에 기입해주세요)*

---

Team Name
Kukuru-Pingpong

GitHub Repository Link (Public)
https://github.com/Kukuru-Pingpong

Project Description

"Kukuru-Pingpong" is a real-time turn-based voice battle game utilizing popular Korean memes and famous movie quotes. During short and intense sessions (1-3 minutes), users act out famous movie quotes to compete against each other, while the Google Gemini 3 API serves as a voice judge, comparing the user's voice against the original quote to determine the winner.

Going beyond mere voice recording, we integrated a quadruple AI pipeline powered by Gemini at the core of the game loop to create a highly immersive entertainment experience.

Core Features and Impact

1. AI-Powered Precision Voice Judgment (Voice Judge)
   - Analyzes both players' recorded voices using the gemini-1.5-flash model. It evaluates based on four metrics (Total 100 points): Tone, Emotion, Rhythm, and Pronunciation, providing a fair score and text feedback on the outcome.
2. Real-Time Damage and HP Fighting System
   - Applies an intuitive fighting game rule where a player's HP is reduced proportionally by the point difference between the two competitors.
3. Breathless Latency Masking
   - Evaluates the AI score in the background in real-time during the "presentation time" when the opponent's voice is played, achieving a seamless and engaging multiplayer experience without loading screens.
4. Diverse Multi-Utilization of Gemini APIs
   - Text Remix (Sentence Generator): Synthesizes random, wacky words with the original quote using the gemini-2.5-flash model to create inventive new lines.
   - TTS (Text-to-Speech): Utilizes the gemini-2.5-flash-preview-tts model to convert text into high-quality voice in real-time, using it as an in-game asset.
   - Image Generation (Image Generator): Generates unique character portraits for the players based on the gemini-3.1-flash-image-preview model.

Tech Stack
- Frontend: Next.js 15, React 19, Socket.io-client (Web microphone recording and real-time socket communication)
- Backend: NestJS, Socket.io (Real-time room matching and turn-based state synchronization)
- AI / Cloud: Google Gemini API (Text, Audio Analysis, Image, TTS), Google Cloud Platform

Technical Demo (1-minute video)
*(Please insert video link or attachment here)*
