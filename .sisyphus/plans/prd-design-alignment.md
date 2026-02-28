# PRD & Stitch Design Full Alignment

## TL;DR

> **Quick Summary**: Align the kukuruPingpong voice battle game with its PRD specification and Stitch retro Game Boy design. Covers backend game logic (HP=3, damage formula, 4-category weighted AI scoring), complete UI theme overhaul (dark neon → retro green pixel art), missing screens (nickname, redesigned lobby, PVP arena), and existing screen redesigns to match Stitch mockups.
> 
> **Deliverables**:
> - Backend: HP=3, PRD damage formula, 4-category weighted Gemini evaluation (Tone/Emotion/Rhythm/Pronunciation)
> - Frontend: Retro Game Boy green monochrome pixel art theme applied to ALL screens
> - New screens: Nickname input, redesigned Lobby (Stitch Screen 1), PVP Arena (Stitch Screen 2)
> - Redesigned screens: Recording (Stitch Screen 3), Result (Stitch Screen 4), Battle, KO, Character Select, Word Select
> - Shared: New JudgmentResult interface with per-category breakdown
> 
> **Estimated Effort**: Large (hackathon day - all hands)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 (types) → Task 3 (HP/damage) → Task 4 (Gemini prompt) → Task 9 (Result screen) → Final Verification

---

## Context

### Original Request
User requested full PRD compliance and Stitch design application for the kukuruPingpong hackathon project (Gemini 3 Seoul Hackathon, Feb 28 2026). The service must match PRD game rules (HP=3, specific damage formula, weighted 4-category AI scoring) and Stitch UI design (retro Game Boy green monochrome pixel art).

### Interview Summary
**Key Discussions**:
- Keep current keyword → AI sentence generation flow (not switching to pre-recorded audio)
- Full PRD compliance including HP=3, damage formula, evaluation criteria
- Apply Stitch retro Game Boy green design
- 4 Stitch design screenshots analyzed: Lobby, PVP Arena, Recording, Result

**Research Findings**:
- Frontend 77% complete with excellent FSD architecture, but dark neon theme must be replaced
- Backend has clean DDD but HP=100, wrong damage formula, wrong evaluation criteria
- 7-phase battle animation and 4-phase KO work well - preserve structure, restyle only
- WebSocket events are solid - minimal changes needed
- CSS is monolithic (1,409 lines) but well-structured with CSS variables

### Metis Review
**Identified Gaps** (addressed):
- Character selection not in PRD but working well → Keep and restyle (Decision: preserves existing gameplay, minimal risk)
- One-round KO possible with uncapped damage → Cap damage at 2 per round (ensures minimum 2 rounds per PRD Section 10)
- JudgmentResult interface change is cross-cutting (8+ files) → Define types FIRST as Wave 1 task
- Missing 4+ Stitch design screens → Apply retro tokens to all screens, pixel-perfect only for 4 designed screens
- RANK:S badge and TOTAL SCORE:3420 not in PRD → Cosmetic only (simple threshold + score multiplier)
- English vs Korean UI text → Follow Stitch design (English for arcade feel)
- Fractional HP display → Math.ceil damage to integers, heart icons (full/empty/half)
- Sequential recording is highest-risk → Schedule as last feature, game works without it

---

## Work Objectives

### Core Objective
Transform kukuruPingpong to fully comply with PRD game mechanics and match the Stitch retro Game Boy green pixel art design, creating a polished hackathon demo.

### Concrete Deliverables
- `apps/server/src/game/domain/value-objects/hp.vo.ts` → HP=3
- `apps/server/src/game/domain/services/battle.service.ts` → PRD damage formula
- `apps/server/src/ai/infrastructure/adapters/gemini.adapter.ts` → 4-category weighted prompt
- `apps/web/src/app/globals.css` → Retro green theme via CSS variables
- `apps/web/src/app/nickname/page.tsx` → New nickname screen
- All 9 existing screens restyled to retro theme
- Lobby and PVP Arena redesigned to match Stitch mockups
- Recording and Result screens redesigned to match Stitch mockups

### Definition of Done
- [ ] HP system uses 3 hearts (not 100) in both frontend and backend
- [ ] Damage formula matches PRD: `1 + (ScoreDiff/20)`, capped at 2
- [ ] AI evaluation returns 4 categories (Tone/Emotion/Rhythm/Pronunciation) with weights
- [ ] All screens use retro green pixel art theme
- [ ] Nickname screen exists and persists to localStorage
- [ ] Result screen shows 4-category score breakdown with dual bars
- [ ] Game playable end-to-end in both local and online modes

### Must Have
- HP = 3 hearts with heart icon display
- Damage = Math.ceil(1 + ScoreDiff/20), max 2
- 4-category AI scoring with PRD weights (0.4/0.3/0.2/0.1)
- Retro Game Boy green monochrome theme
- Pixel font (Press Start 2P or DungGeunMo)
- Nickname input screen with localStorage persistence
- Lobby matching Stitch Screen 1 (VS CPU / VS HUMAN / PASSWORD)
- PVP Arena matching Stitch Screen 2 (CREATE ROOM / JOIN ROOM)
- Recording HUD matching Stitch Screen 3 (3-heart HP, timer, REC button)
- Result matching Stitch Screen 4 (VICTORY banner, 4-category bars, RANK badge, REMATCH/EXIT)
- Tie-breaking logic (PRD Section 5.4: emotion → rhythm → decimal)

### Must NOT Have (Guardrails)
- Do NOT add sound effects, particle animations, glassmorphism, gradient borders (TODO.md extras)
- Do NOT build persistent ranking system (RANK badge is cosmetic threshold only)
- Do NOT implement CRT scanline effects, screen curvature, grid overlay textures
- Do NOT restructure WebSocket event names or callback patterns
- Do NOT change animation phase counts, timing, or flow (only restyle visual properties)
- Do NOT delete or restructure existing CSS selectors (override via variables first)
- Do NOT build real-time player count or ping measurement (footer is hardcoded decoration)
- Do NOT add avatar selection, profile pictures, or name uniqueness checks for nickname
- Do NOT change local mode game flow (sequential recording is online-only)
- Do NOT implement dynamic AI image generation, AI coach, or echo effects

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (hackathon time constraint)
- **Framework**: None
- **QA Policy**: Agent-Executed QA Scenarios for every task

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Game Logic**: Use Bash (node REPL / direct file read) — Verify constants and formulas

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - Foundation + Types):
├── Task 1: Define new JudgmentResult interface + shared types [quick]
├── Task 2: Retro theme CSS variables + pixel font import [visual-engineering]
├── Task 3: Backend HP=3 + PRD damage formula [quick]
├── Task 4: Update Gemini judge prompt (4-category weighted) [deep]
└── Task 5: Add nickname system (screen + localStorage + GameContext) [quick]

Wave 2 (After Wave 1 - Screen Overhaul, MAX PARALLEL):
├── Task 6: Redesign Lobby → Stitch Screen 1 (depends: 2, 5) [visual-engineering]
├── Task 7: Redesign PVP Arena → Stitch Screen 2 (depends: 2) [visual-engineering]
├── Task 8: Redesign Recording Screen → Stitch Screen 3 (depends: 1, 2, 3) [visual-engineering]
├── Task 9: Redesign Result Screen → Stitch Screen 4 (depends: 1, 2) [visual-engineering]
├── Task 10: Restyle Character Select + Word Select in retro theme (depends: 2) [visual-engineering]
└── Task 11: Restyle Battle + KO screens in retro theme (depends: 1, 2, 3) [visual-engineering]

Wave 3 (After Wave 2 - Integration + Polish):
├── Task 12: Frontend HP hearts display + damage animation (depends: 3, 8) [visual-engineering]
├── Task 13: Connect 4-category scores to Result screen bars (depends: 4, 9) [unspecified-high]
├── Task 14: Tie-breaking logic + rank badge (depends: 1, 4) [quick]
└── Task 15: Sequential recording flow - online mode (depends: 8, 11) [deep]

Wave FINAL (After ALL tasks - independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA with Playwright (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 4 → Task 9 → Task 13 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 6 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 4, 8, 9, 11, 13, 14 | 1 |
| 2 | — | 6, 7, 8, 9, 10, 11 | 1 |
| 3 | — | 8, 11, 12 | 1 |
| 4 | 1 | 13, 14 | 1 |
| 5 | — | 6 | 1 |
| 6 | 2, 5 | — | 2 |
| 7 | 2 | — | 2 |
| 8 | 1, 2, 3 | 12, 15 | 2 |
| 9 | 1, 2 | 13 | 2 |
| 10 | 2 | — | 2 |
| 11 | 1, 2, 3 | 15 | 2 |
| 12 | 3, 8 | — | 3 |
| 13 | 4, 9 | — | 3 |
| 14 | 1, 4 | — | 3 |
| 15 | 8, 11 | — | 3 |

### Agent Dispatch Summary

- **Wave 1**: 5 tasks — T1 `quick`, T2 `visual-engineering`, T3 `quick`, T4 `deep`, T5 `quick`
- **Wave 2**: 6 tasks — T6-T11 all `visual-engineering`
- **Wave 3**: 4 tasks — T12 `visual-engineering`, T13 `unspecified-high`, T14 `quick`, T15 `deep`
- **FINAL**: 4 tasks — F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.


### Wave 1 — Foundation + Types

- [ ] 1. Define New JudgmentResult Interface + Shared Types

  **What to do**:
  - Create a shared TypeScript interface for the new 4-category JudgmentResult
  - Update `apps/server/src/ai/domain/value-objects/judgment-result.vo.ts` to include per-category scores: `player1_tone`, `player1_emotion`, `player1_rhythm`, `player1_pronunciation` (and same for player2), plus `winner`, `reason`, `player1_feedback`, `player2_feedback`, `player1_total`, `player2_total`
  - Update `apps/web/src/shared/types/` to mirror the new interface
  - Update GameContext judgment state type to match
  - Weighted total calculation: `total = tone*0.4 + emotion*0.3 + rhythm*0.2 + pronunciation*0.1`

  **Must NOT do**:
  - Do NOT change the WebSocket event names
  - Do NOT change the Gemini prompt yet (Task 4 handles that)
  - Do NOT modify any UI components yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure type definition change, no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Tasks 4, 8, 9, 11, 13, 14
  - **Blocked By**: None

  **References**:
  - `apps/server/src/ai/domain/value-objects/judgment-result.vo.ts` — Current flat score interface to extend
  - `apps/web/src/shared/types/` — Frontend type definitions to mirror
  - `apps/web/src/contexts/GameContext.tsx` — `judgment` state field type
  - PRD.md Section 5.2 — Evaluation criteria with weights
  - Stitch Screen 4 (result) — Shows TONE/EMOTION/RHYTHM/PRONUNCIATION categories

  **Acceptance Criteria**:
  - [ ] JudgmentResult VO has all 8 per-category fields (4 per player)
  - [ ] Frontend types match backend VO exactly
  - [ ] GameContext `judgment` type updated
  - [ ] TypeScript compiles without errors: `npx tsc --noEmit`

  **QA Scenarios:**
  ```
  Scenario: TypeScript compilation succeeds
    Tool: Bash
    Steps:
      1. Run `pnpm --filter server exec tsc --noEmit` in project root
      2. Run `pnpm --filter web exec tsc --noEmit` in project root
    Expected Result: Both commands exit 0 with no type errors
    Evidence: .sisyphus/evidence/task-1-tsc-check.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `apps/server/src/ai/domain/value-objects/judgment-result.vo.ts`, `apps/web/src/shared/types/`

- [ ] 2. Retro Theme CSS Variables + Pixel Font Import

  **What to do**:
  - Import pixel font in `apps/web/src/app/layout.tsx`: add Google Fonts link for 'Press Start 2P' (supports Latin) and optionally 'DungGeunMo' for Korean
  - Override ALL CSS custom properties in `apps/web/src/app/globals.css` root to retro green palette:
    - `--bg-main: #306230` (darkest green)
    - `--bg-card: #0f380f` (very dark green for card backgrounds)
    - `--bg-surface: #8bac0f` (medium green for surfaces/content area)
    - `--text-primary: #0f380f` (dark green text on light surfaces)
    - `--text-light: #9bbc0f` (light green text on dark surfaces)
    - `--primary: #8bac0f` (accent / interactive)
    - `--accent: #306230`
    - `--border: #0f380f`
  - Set body background to `#9bbc0f` (the characteristic Game Boy screen color)
  - Set font-family to `'Press Start 2P', 'DungGeunMo', monospace` globally
  - Add `.retro-frame` CSS class for the bordered CRT-style card frames seen in Stitch designs
  - Add `.retro-button` CSS class for dark arcade-style buttons
  - Add `.retro-button-light` CSS class for light variant buttons
  - Add `.retro-header` CSS class for the top bar with title + nickname
  - Add `.retro-badge` CSS class for small label badges (INSERT COIN TO START, MULTIPLAYER LOBBY, etc.)
  - Reduce font sizes globally (pixel fonts need smaller sizes: headings 1rem-1.5rem, body 0.6rem-0.8rem)
  - Ensure all existing animations keep working with new color variables

  **Must NOT do**:
  - Do NOT delete existing CSS selectors or animation keyframes
  - Do NOT add CRT scanlines, screen curvature, or grid textures
  - Do NOT add sound effects or particle animations
  - Do NOT create a separate CSS file — modify globals.css in place

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Full CSS theme system overhaul requires design expertise
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Needed for cohesive design system implementation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Tasks 6, 7, 8, 9, 10, 11
  - **Blocked By**: None

  **References**:
  - `apps/web/src/app/globals.css` — Current 1,409-line stylesheet with CSS variables at top
  - `apps/web/src/app/layout.tsx` — Root layout where font import goes
  - Stitch Screenshot 1 (docs/screenshot 12.30.45.png) — Green palette, pixel font, card frames
  - Stitch Screenshot 4 (docs/screenshot 12.31.16.png) — Header bar, button styles, badge styles
  - Game Boy palette reference: `#0f380f` (darkest), `#306230`, `#8bac0f`, `#9bbc0f` (lightest)

  **Acceptance Criteria**:
  - [ ] Pixel font loads on page (check network tab or computed style)
  - [ ] Body background is green (#9bbc0f or similar)
  - [ ] No dark neon colors visible (#0a0a1a, #1a1a2e, etc. replaced)
  - [ ] `.retro-frame`, `.retro-button`, `.retro-header`, `.retro-badge` classes exist
  - [ ] Existing animations still function (battle phases, KO phases)

  **QA Scenarios:**
  ```
  Scenario: Retro theme visible on lobby
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Take screenshot
      3. Assert body background-color is in green range (r<180, g>150, b<100)
      4. Assert h1/h2 font-family contains 'Press Start 2P'
    Expected Result: Green background, pixel font visible
    Evidence: .sisyphus/evidence/task-2-retro-theme.png

  Scenario: No dark neon colors remain
    Tool: Bash (grep)
    Steps:
      1. Search globals.css for '#0a0a1a', '#1a1a2e', '#16213e'
    Expected Result: Zero matches (all replaced with green palette)
    Evidence: .sisyphus/evidence/task-2-no-dark-colors.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx`

- [ ] 3. Backend HP=3 + PRD Damage Formula

  **What to do**:
  - Update `apps/server/src/game/domain/value-objects/hp.vo.ts`:
    - Change `Hp.full()` to return `new Hp(3)` instead of `new Hp(100)`
    - Change max clamp from 100 to 3: `Math.min(3, value)`
  - Update `apps/server/src/game/domain/services/battle.service.ts`:
    - Replace damage formula: `const damage = Math.min(2, Math.ceil(1 + Math.abs(winnerScore - loserScore) / 20))`
    - Remove `MIN_DAMAGE = 5` constant (replaced by formula minimum of 1)
    - Max damage capped at 2 per round (ensures minimum 2 rounds per PRD Section 10)
  - Update `apps/web/src/shared/lib/calculateDamage.ts` (if exists) or `GameContext.tsx`:
    - Mirror the same damage formula on frontend
    - Update any `STARTING_HP = 100` to `STARTING_HP = 3`
  - Update `apps/web/src/contexts/GameContext.tsx`:
    - Change initial HP from 100 to 3 for both players
    - Update any HP comparison logic (e.g., HP bar percentages)
  - Use `lsp_find_references` and `ast_grep_search` for `STARTING_HP`, `MIN_DAMAGE`, `Hp.full`, `new Hp(100)` to find ALL consumers

  **Must NOT do**:
  - Do NOT change HP display logic yet (Task 12 handles heart icons)
  - Do NOT change WebSocket events
  - Do NOT modify frontend UI components

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Surgical constant and formula changes across known files
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Tasks 8, 11, 12
  - **Blocked By**: None

  **References**:
  - `apps/server/src/game/domain/value-objects/hp.vo.ts:9` — Current HP max = 100
  - `apps/server/src/game/domain/services/battle.service.ts:4-6` — Current damage formula
  - `apps/web/src/contexts/GameContext.tsx` — Frontend HP state initialization
  - PRD.md Section 6 — HP=3, Damage = 1 + (ScoreDiff/20)
  - PRD.md Section 10 — At least 2 rounds per session (justifies max damage = 2)

  **Acceptance Criteria**:
  - [ ] `Hp.full()` returns Hp with value 3
  - [ ] Damage for score diff 20 = Math.ceil(1+1) = 2
  - [ ] Damage for score diff 5 = Math.ceil(1+0.25) = 2 (ceil rounds up)
  - [ ] Damage for score diff 0 = Math.ceil(1+0) = 1
  - [ ] Damage never exceeds 2 (capped)
  - [ ] Frontend initial HP = 3 for both players

  **QA Scenarios:**
  ```
  Scenario: HP starts at 3
    Tool: Bash (grep)
    Steps:
      1. grep for 'Hp.full\|new Hp(3)\|STARTING_HP' in apps/server/src/ recursively
      2. grep for 'p1Hp.*3\|p2Hp.*3\|STARTING_HP.*3' in apps/web/src/ recursively
    Expected Result: All references show 3, not 100
    Evidence: .sisyphus/evidence/task-3-hp-check.txt

  Scenario: Damage formula correctness
    Tool: Bash (node eval)
    Steps:
      1. Run: node -e "console.log(Math.min(2, Math.ceil(1 + 20/20)))" → expect 2
      2. Run: node -e "console.log(Math.min(2, Math.ceil(1 + 0/20)))" → expect 1
      3. Run: node -e "console.log(Math.min(2, Math.ceil(1 + 80/20)))" → expect 2 (capped)
    Expected Result: 2, 1, 2 respectively
    Evidence: .sisyphus/evidence/task-3-damage-formula.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `hp.vo.ts`, `battle.service.ts`, `GameContext.tsx`

- [ ] 4. Update Gemini Judge Prompt (4-Category Weighted Scoring)

  **What to do**:
  - Modify `apps/server/src/ai/infrastructure/adapters/gemini.adapter.ts` judge method prompt
  - Replace current evaluation criteria (emotion/expression/pronunciation/immersion) with PRD criteria:
    - Tone Similarity (0.4 weight): How close is the voice tone/pitch to what the sentence demands
    - Emotion Match (0.3 weight): How well does the speaker convey the appropriate emotion
    - Rhythm Accuracy (0.2 weight): Pacing, pauses, speed matching the sentence's natural rhythm
    - Pronunciation Accuracy (0.1 weight): Clear and correct pronunciation of each word
  - Update the JSON response format in the prompt to return:
    ```json
    {
      "player1_tone": 0-100,
      "player1_emotion": 0-100,
      "player1_rhythm": 0-100,
      "player1_pronunciation": 0-100,
      "player2_tone": 0-100,
      "player2_emotion": 0-100,
      "player2_rhythm": 0-100,
      "player2_pronunciation": 0-100,
      "winner": 1 or 2,
      "reason": "string",
      "player1_feedback": "string",
      "player2_feedback": "string"
    }
    ```
  - Add weighted total calculation in the adapter: `total = tone*0.4 + emotion*0.3 + rhythm*0.2 + pronunciation*0.1`
  - Add tie-breaking instruction to prompt: if totals are equal, compare emotion first, then rhythm, then use decimal precision
  - Update the response parser to extract all 8 category scores + compute totals
  - Update the fallback response (on parse failure) to include 8 category scores (all 50)
  - Keep audio upload format (FormData with audio1, audio2, sentence) unchanged

  **Must NOT do**:
  - Do NOT change the API endpoint path or method
  - Do NOT change the audio upload format
  - Do NOT change other Gemini endpoints (TTS, sentence generation, image generation)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Gemini prompt engineering is delicate; wrong prompt = broken scoring. Needs careful testing.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Tasks 13, 14
  - **Blocked By**: Task 1 (needs new JudgmentResult interface)

  **References**:
  - `apps/server/src/ai/infrastructure/adapters/gemini.adapter.ts:182-201` - Current judge prompt
  - `apps/server/src/ai/infrastructure/controllers/ai.controller.ts` - Judge endpoint handler
  - `apps/server/src/ai/domain/value-objects/judgment-result.vo.ts` - Updated interface from Task 1
  - PRD.md Section 5.2 - Evaluation weights table
  - PRD.md Section 5.4 - Tie-breaking logic

  **Acceptance Criteria**:
  - [ ] Gemini prompt asks for 4 specific categories with scores 0-100
  - [ ] Response parser extracts all 8 category fields
  - [ ] Weighted totals computed correctly (tone*0.4 + emotion*0.3 + rhythm*0.2 + pronunciation*0.1)
  - [ ] Fallback response has all 8 category fields
  - [ ] Tie-breaking logic documented in prompt

  **QA Scenarios:**
  ```
  Scenario: Judge API returns 4-category scores
    Tool: Bash (curl)
    Preconditions: Server running on localhost:4000, test audio files available
    Steps:
      1. curl -X POST http://localhost:4000/api/judge -F audio1=@test.webm -F audio2=@test.webm -F sentence="test" -s | jq .
      2. Assert response has fields: player1_tone, player1_emotion, player1_rhythm, player1_pronunciation
      3. Assert all scores are numbers between 0 and 100
    Expected Result: JSON with all 8 category scores + winner + reason
    Failure Indicators: Missing fields, scores outside 0-100, parse errors
    Evidence: .sisyphus/evidence/task-4-judge-response.json

  Scenario: Fallback on Gemini failure
    Tool: Bash (grep)
    Steps:
      1. Search gemini.adapter.ts for fallback/default response
      2. Verify it includes all 8 category score fields
    Expected Result: Fallback has player1_tone through player2_pronunciation
    Evidence: .sisyphus/evidence/task-4-fallback-check.txt
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `gemini.adapter.ts`, `judgment-result.vo.ts`

- [ ] 5. Add Nickname System (Screen + localStorage + GameContext)

  **What to do**:
  - Create new route: `apps/web/src/app/nickname/page.tsx`
  - Create new feature screen: `apps/web/src/features/nickname/NicknameScreen.tsx`
  - Nickname screen design (following Stitch retro theme):
    - Retro header: 'KUKURU PINGPONG'
    - Title: 'ENTER YOUR NAME' or 'PLAYER REGISTRATION' in pixel font
    - Subtitle: 'TYPE YOUR CALLSIGN'
    - Text input field with retro border frame
    - Validation: max 10 chars, no empty, alphanumeric + Korean allowed
    - 'CONFIRM' button (retro-button style)
  - Add `nickname` state to GameContext (or use a separate hook)
  - On confirm: save to localStorage('kukuru_nickname'), navigate to lobby ('/')
  - Modify splash/lobby logic: if no nickname in localStorage, redirect to /nickname
  - Display nickname in header on all screens (matching Stitch design's 'STARLORD' badge)
  - Send nickname to server on room join/create (update socket events if needed)

  **Must NOT do**:
  - Do NOT add avatar selection or profile pictures
  - Do NOT add name uniqueness checking against server
  - Do NOT add color picker or customization

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple new page with localStorage and redirect logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: Task 6 (lobby needs nickname display)
  - **Blocked By**: None

  **References**:
  - `apps/web/src/app/page.tsx` - Current lobby page (needs redirect logic)
  - `apps/web/src/features/lobby/LobbyScreen.tsx` - Current lobby to add nickname check
  - `apps/web/src/contexts/GameContext.tsx` - Add nickname state
  - views.md Section 2 - Nickname View specification
  - Stitch Screen 1 header - Shows 'STARLORD' nickname badge

  **Acceptance Criteria**:
  - [ ] `/nickname` route exists and renders input form
  - [ ] Nickname saved to localStorage on confirm
  - [ ] Redirect to `/nickname` if no stored nickname when visiting lobby
  - [ ] Redirect to `/` (lobby) after nickname confirmed
  - [ ] Nickname displayed in header across screens
  - [ ] Input validation: max 10 chars, no empty submission

  **QA Scenarios:**
  ```
  Scenario: First visit redirects to nickname
    Tool: Playwright
    Steps:
      1. Clear localStorage
      2. Navigate to http://localhost:3000/
      3. Assert URL redirected to /nickname
      4. Enter 'STARLORD' in input field
      5. Click CONFIRM button
      6. Assert URL is now / (lobby)
      7. Assert localStorage has 'kukuru_nickname' = 'STARLORD'
    Expected Result: Nickname flow completes, stored, redirected
    Evidence: .sisyphus/evidence/task-5-nickname-flow.png

  Scenario: Return visit skips nickname
    Tool: Playwright
    Steps:
      1. Set localStorage 'kukuru_nickname' = 'TESTUSER'
      2. Navigate to http://localhost:3000/
      3. Assert URL stays at / (no redirect to /nickname)
      4. Assert page contains text 'TESTUSER' in header area
    Expected Result: Direct to lobby with nickname shown
    Evidence: .sisyphus/evidence/task-5-return-visit.png
  ```

  **Commit**: YES (groups with Wave 1)
  - Files: `apps/web/src/app/nickname/page.tsx`, `apps/web/src/features/nickname/NicknameScreen.tsx`, `GameContext.tsx`, `LobbyScreen.tsx`

### Wave 2 — Screen Overhaul (MAX PARALLEL)

- [ ] 6. Redesign Lobby to Match Stitch Screen 1

  **What to do**:
  - Completely redesign `apps/web/src/features/lobby/LobbyScreen.tsx` to match Stitch Screen 1
  - Layout:
    - Retro header bar: game icon + 'KUKURU PINGPONG' title + nickname badge + settings gear icon
    - 'INSERT COIN TO START' badge centered above title
    - 'SELECT MODE' large pixel heading
    - '> IMITATE LINES. BECOME LEGEND. <' subtitle in bordered badge
    - Two side-by-side retro-framed cards:
      - VS CPU: robot/game icon, 'VS CPU' heading, 'TRAINING MODE. TEST YOUR SKILL.' description, '> START GAME' dark button
      - VS HUMAN: crossed swords icon, 'VS HUMAN' heading, 'MULTIPLAYER. FIGHT REAL PLAYERS.', '> FIND MATCH' dark button
    - PASSWORD section below cards: bordered frame with '🔗 PASSWORD' header, 'ENTER 6-DIGIT SECRET CODE' subtitle, code input field, 'JOIN' button
    - Footer: 'INSERT COIN TO CONTINUE...', decorative 'ONLINE' status, hardcoded '1248 PLYRS', 'VER 1.0.4'
  - VS CPU button navigates to character select (local mode)
  - VS HUMAN button navigates to PVP Arena (/online)
  - PASSWORD JOIN connects to existing room-join socket logic
  - Use `.retro-frame`, `.retro-button`, `.retro-header`, `.retro-badge` classes from Task 2
  - Remove current dark neon card styles

  **Must NOT do**:
  - Do NOT implement real player count (hardcode decorative text)
  - Do NOT add settings functionality (gear icon is decorative for MVP)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7-11)
  - **Blocks**: None
  - **Blocked By**: Tasks 2 (theme), 5 (nickname)

  **References**:
  - Stitch Screenshot 1: `docs/\uc2a4\ud06c\ub9b0\uc0f7 2026-02-28 12.30.45.png` - Exact layout reference
  - `apps/web/src/features/lobby/LobbyScreen.tsx` - Current lobby to rewrite
  - `apps/web/src/app/page.tsx` - Route handler
  - views.md Section 3 - Lobby View specification

  **Acceptance Criteria**:
  - [ ] Lobby shows 'SELECT MODE' heading in pixel font
  - [ ] Two cards: VS CPU and VS HUMAN visible side-by-side
  - [ ] PASSWORD section with code input and JOIN button visible
  - [ ] Nickname shown in header
  - [ ] VS CPU navigates to character select
  - [ ] VS HUMAN navigates to /online (PVP Arena)
  - [ ] Green retro theme applied

  **QA Scenarios:**
  ```
  Scenario: Lobby matches Stitch design
    Tool: Playwright
    Steps:
      1. Set localStorage nickname
      2. Navigate to http://localhost:3000/
      3. Assert text 'SELECT MODE' visible
      4. Assert text 'VS CPU' visible
      5. Assert text 'VS HUMAN' visible
      6. Assert PASSWORD/code input section visible
      7. Take screenshot
    Expected Result: Layout matches Stitch Screen 1
    Evidence: .sisyphus/evidence/task-6-lobby.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `LobbyScreen.tsx`, `page.tsx`

- [ ] 7. Redesign PVP Arena to Match Stitch Screen 2

  **What to do**:
  - Redesign `apps/web/src/features/online-lobby/OnlineLobbyScreen.tsx` to match Stitch Screen 2
  - Layout:
    - Header bar: back arrow button + crossed swords icon + 'PVP ARENA' title + nickname badge
    - 'MULTIPLAYER LOBBY' badge centered
    - 'CHOOSE YOUR PATH' large heading
    - 'HOST A BATTLE OR JOIN THE FRAY' subtitle badge
    - Two side-by-side retro-framed cards:
      - CREATE ROOM: crown icon, 'CREATE ROOM' heading, 'BE THE KING' subtitle badge, '> PRESS START <' dark button
      - JOIN ROOM: key icon, 'JOIN ROOM' heading, 'ENTER ROOM CODE' subtitle badge, 6-digit code input, 'ENTER' dark button
    - Status text below: 'WAITING FOR CHALLENGER...' (appears after room creation)
    - Footer: 'SERVER: ASIA-1' + 'PING: 24MS' (hardcoded decorative)
  - CREATE ROOM triggers existing create-room socket event, displays room code in CREATE card
  - JOIN ROOM triggers existing join-room socket event with entered code
  - Back arrow navigates to lobby (/)
  - On game-start event, navigate to character-select

  **Must NOT do**:
  - Do NOT change WebSocket event names or payloads
  - Do NOT implement real ping measurement

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 8-11)
  - **Blocks**: None
  - **Blocked By**: Task 2 (theme)

  **References**:
  - Stitch Screenshot 2: `docs/\uc2a4\ud06c\ub9b0\uc0f7 2026-02-28 12.30.54.png` - Exact layout reference
  - `apps/web/src/features/online-lobby/OnlineLobbyScreen.tsx` - Current online lobby to rewrite
  - `apps/web/src/app/online/page.tsx` - Route handler
  - views.md Sections 5, 6, 7 - PVP selection, Room Host, Room Join specs

  **Acceptance Criteria**:
  - [ ] 'CHOOSE YOUR PATH' heading visible
  - [ ] CREATE ROOM and JOIN ROOM cards side-by-side
  - [ ] Room creation works (code displayed)
  - [ ] Room joining works (code input + enter)
  - [ ] Back button navigates to lobby
  - [ ] 'WAITING FOR CHALLENGER...' shown after room creation

  **QA Scenarios:**
  ```
  Scenario: PVP Arena layout
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/online
      2. Assert 'CHOOSE YOUR PATH' text visible
      3. Assert 'CREATE ROOM' and 'JOIN ROOM' visible
      4. Take screenshot
    Expected Result: Matches Stitch Screen 2 layout
    Evidence: .sisyphus/evidence/task-7-pvp-arena.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `OnlineLobbyScreen.tsx`

- [ ] 8. Redesign Recording Screen to Match Stitch Screen 3

  **What to do**:
  - Redesign `apps/web/src/features/recording/RecordingScreen.tsx` to match Stitch Screen 3
  - Layout:
    - Top HUD bar: Left player (icon + nickname + 3 heart icons) | 'VS' center | Right player (nickname + hearts + icon)
    - Heart icons: filled heart = remaining HP, empty heart = lost HP
    - Timer display: '05:00' format in bordered box below HUD
    - Central quote display area (dark retro frame):
      - Scene label: 'SCENE N: [source]' (use quoteSource from GameContext)
      - Quote text: large pixel font, centered, in double quotes
      - Progress bar below text
    - REC button: circular button with red dot indicator + 'REC' text
    - Audio visualizer: waveform bars in retro green style
    - 'HOLD TO RECORD' instruction text below visualizer
  - Change recording interaction to HOLD-TO-RECORD (press and hold to record, release or timeout to stop)
  - Keep 5-second recording limit (matches PRD Section 3.1)
  - Preserve existing audio recording/sending logic
  - Replace current BattleHud widget with new retro-styled HUD

  **Must NOT do**:
  - Do NOT change audio encoding or transmission logic
  - Do NOT change WebSocket recording events

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 9-11)
  - **Blocks**: Tasks 12, 15
  - **Blocked By**: Tasks 1 (types), 2 (theme), 3 (HP=3)

  **References**:
  - Stitch Screenshot 3: `docs/\uc2a4\ud06c\ub9b0\uc0f7 2026-02-28 12.31.07.png` - Exact layout reference
  - `apps/web/src/features/recording/RecordingScreen.tsx` - Current recording screen
  - `apps/web/src/widgets/audio-visualizer/` - Existing AudioVisualizer widget to restyle
  - `apps/web/src/widgets/battle-hud/` - Existing BattleHud to replace with retro HUD
  - views.md Section 8 - In-Game View specification

  **Acceptance Criteria**:
  - [ ] Top HUD shows 3 heart icons per player
  - [ ] Timer shows 05:00 format
  - [ ] Quote text displayed in large pixel font with scene label
  - [ ] REC button is circular with red indicator
  - [ ] Audio visualizer shows green waveform bars
  - [ ] Recording starts on press-and-hold, stops on release or 5s timeout

  **QA Scenarios:**
  ```
  Scenario: Recording screen layout
    Tool: Playwright
    Steps:
      1. Navigate to recording screen (may need to set up game state first)
      2. Assert heart icons visible (3 per player)
      3. Assert REC button visible
      4. Assert 'HOLD TO RECORD' text visible
      5. Take screenshot
    Expected Result: Retro recording screen matching Stitch Screen 3
    Evidence: .sisyphus/evidence/task-8-recording.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `RecordingScreen.tsx`, `AudioVisualizer`, `BattleHud`

- [ ] 9. Redesign Result Screen to Match Stitch Screen 4

  **What to do**:
  - Redesign `apps/web/src/features/result/ResultScreen.tsx` to match Stitch Screen 4
  - Layout:
    - Retro header bar: 'KUKURU PINGPONG' + nickname + settings
    - Large 'VICTORY!' banner (or 'DEFEAT!' for loser) in pixel text with retro frame
    - 'NEW RECORD!' subtitle (show when score exceeds previous best, or always show for MVP)
    - Left side - Winner display:
      - Character image in retro frame with 'WINNER' badge
      - Speech bubble with feedback text (from AI judgment)
      - 'PLAYER N' label + nickname
    - Right side - STATUS REPORT:
      - 'STATUS REPORT' header in bordered frame
      - 'YOU vs CPU/OPPONENT' labels
      - Four dual bar charts:
        - TONE: player1% vs player2% with opposing horizontal bars
        - EMOTION: same format
        - RHYTHM: same format
        - PRONUNCIATION: same format
      - TOTAL SCORE: display weighted total * 50 (to get 3000-5000 range like design)
      - RANK: S/A/B/C/D badge (S>=90, A>=80, B>=70, C>=60, D<60 based on weighted %)
    - Bottom buttons: 'REMATCH' (light retro-button) + 'EXIT TO LOBBY' (dark retro-button)
  - REMATCH triggers existing rematch logic
  - EXIT TO LOBBY navigates to / and destroys room session
  - NOTE: This screen initially renders with placeholder scores until Task 13 connects real 4-category data

  **Must NOT do**:
  - Do NOT implement persistent ranking system
  - Do NOT implement result sharing/export

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6-8, 10-11)
  - **Blocks**: Task 13
  - **Blocked By**: Tasks 1 (types), 2 (theme)

  **References**:
  - Stitch Screenshot 4: `docs/\uc2a4\ud06c\ub9b0\uc0f7 2026-02-28 12.31.16.png` - Exact layout reference
  - `apps/web/src/features/result/ResultScreen.tsx` - Current result screen to rewrite
  - `apps/web/src/app/result/page.tsx` - Route handler
  - views.md Section 9 - Result View specification
  - PRD Section 4.3 - Result flow

  **Acceptance Criteria**:
  - [ ] 'VICTORY!' or 'DEFEAT!' banner visible
  - [ ] Winner character with speech bubble shown
  - [ ] 4 category bars: TONE, EMOTION, RHYTHM, PRONUNCIATION
  - [ ] TOTAL SCORE displayed
  - [ ] RANK badge (S/A/B/C/D) shown
  - [ ] REMATCH and EXIT TO LOBBY buttons functional

  **QA Scenarios:**
  ```
  Scenario: Result screen layout
    Tool: Playwright
    Steps:
      1. Navigate to result screen (set up game state with mock judgment)
      2. Assert 'VICTORY' or 'DEFEAT' text visible
      3. Assert 'TONE', 'EMOTION', 'RHYTHM', 'PRONUNCIATION' labels visible
      4. Assert 'REMATCH' and 'EXIT TO LOBBY' buttons visible
      5. Take screenshot
    Expected Result: Matches Stitch Screen 4 layout
    Evidence: .sisyphus/evidence/task-9-result.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `ResultScreen.tsx`

- [ ] 10. Restyle Character Select + Word Select in Retro Theme

  **What to do**:
  - Restyle `apps/web/src/features/character-select/CharacterSelectScreen.tsx`:
    - Apply retro header bar with title + nickname
    - Title: 'CHOOSE YOUR FIGHTER' in pixel font
    - Character grid: 4x2 grid with retro-framed character cards
    - Selected character highlighted with green glow border
    - Character name and emoji in pixel font
    - 'CONFIRM' button (retro-button style)
    - Status text: 'WAITING FOR OPPONENT...' when online
  - Restyle `apps/web/src/features/word-select/WordSelectScreen.tsx`:
    - Apply retro header bar
    - Title: 'SELECT KEYWORD' in pixel font
    - Keyword chips styled as retro bordered badges
    - Selected keyword highlighted
    - Quote source displayed as scene label
    - Battle HUD at top with HP hearts
  - Both screens use `.retro-frame`, `.retro-button` classes from Task 2

  **Must NOT do**:
  - Do NOT change character data or selection logic
  - Do NOT change keyword data or selection logic
  - Do NOT change WebSocket events

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 2 (theme)

  **References**:
  - `apps/web/src/features/character-select/CharacterSelectScreen.tsx` - Current implementation
  - `apps/web/src/features/word-select/WordSelectScreen.tsx` - Current implementation
  - `apps/web/src/entities/character/` - Character data and types
  - `apps/web/src/entities/quote/` - Quote data

  **Acceptance Criteria**:
  - [ ] Character select uses retro green theme
  - [ ] 'CHOOSE YOUR FIGHTER' heading visible
  - [ ] Character cards have retro frames
  - [ ] Word select uses retro green theme
  - [ ] Keyword chips styled as retro badges

  **QA Scenarios:**
  ```
  Scenario: Character select retro theme
    Tool: Playwright
    Steps:
      1. Navigate to character-select
      2. Assert green background visible
      3. Assert 'CHOOSE YOUR FIGHTER' or character grid visible
      4. Take screenshot
    Expected Result: Retro styled character selection
    Evidence: .sisyphus/evidence/task-10-character-select.png
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `CharacterSelectScreen.tsx`, `WordSelectScreen.tsx`

- [ ] 11. Restyle Battle + KO Screens in Retro Theme

  **What to do**:
  - Restyle `apps/web/src/features/battle/BattleScreen.tsx`:
    - Change all color references to retro green palette
    - Keep all 7 animation phases intact (enter, scores, charge, projectile, hit, hp, done)
    - Score counter-up animation in pixel font with green text
    - Charge/projectile effects use green glow instead of neon colors
    - Hit effect uses screen shake + green flash instead of red
    - HP bar in retro style (replace percentage bar with heart icons)
    - Victory text in pixel font
    - Apply retro header with HUD (hearts, round indicator)
  - Restyle `apps/web/src/features/ko/KoScreen.tsx`:
    - Keep all 4 phases intact (flash, koText, character, result)
    - Flash effect: green flash instead of white/red
    - 'K.O.!' text in large pixel font
    - Character display with retro frame
    - Result with retro styling
    - 'REMATCH' and 'EXIT TO LOBBY' buttons in retro style

  **Must NOT do**:
  - Do NOT change animation phase counts, timing, or sequence logic
  - Do NOT change damage calculation or HP logic
  - Do NOT change audio playback or judgment logic

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1 (types), 2 (theme), 3 (HP)

  **References**:
  - `apps/web/src/features/battle/BattleScreen.tsx` - Current battle (7-phase animation)
  - `apps/web/src/features/ko/KoScreen.tsx` - Current KO (4-phase animation)
  - `apps/web/src/app/globals.css` - Animation keyframes to color-update only
  - PROJECT.md 'Battle Animation' section - 7 phases listed

  **Acceptance Criteria**:
  - [ ] Battle screen uses green palette (no neon/purple/blue remaining)
  - [ ] All 7 animation phases still work
  - [ ] KO screen uses green palette
  - [ ] All 4 KO phases still work
  - [ ] Score text in pixel font

  **QA Scenarios:**
  ```
  Scenario: Battle animations preserved with retro theme
    Tool: Bash (grep)
    Steps:
      1. Grep BattleScreen.tsx for all 7 phases: 'enter', 'scores', 'charge', 'projectile', 'hit', 'hp', 'done'
      2. Verify all 7 are present
      3. Grep for old dark colors (#0a0a, #1a1a, purple, neon) - should be 0 matches
    Expected Result: All phases present, no dark theme colors
    Evidence: .sisyphus/evidence/task-11-battle-phases.txt
  ```

  **Commit**: YES (groups with Wave 2)
  - Files: `BattleScreen.tsx`, `KoScreen.tsx`, `globals.css` (animation keyframes only)

### Wave 3 — Integration + Polish

- [ ] 12. Frontend HP Hearts Display + Damage Animation

  **What to do**:
  - Create a reusable `HeartBar` component in `apps/web/src/widgets/`
  - Display 3 heart icons per player: filled heart (remaining), empty heart (lost)
  - For fractional HP (e.g., 1.5 remaining): show 1 filled + 1 half-filled + 1 empty
  - Heart icons: use CSS-drawn hearts or Unicode hearts with retro green styling
  - Damage animation: when HP decreases, the losing heart should flash/pulse before becoming empty
  - Replace ALL existing HP bar/percentage displays across screens with HeartBar:
    - RecordingScreen HUD
    - BattleScreen HP phase
    - Any other screen showing HP
  - Ensure hearts display correctly for HP values: 3, 2.5, 2, 1.5, 1, 0.5, 0

  **Must NOT do**:
  - Do NOT change the underlying HP value or damage calculation (Task 3 handles that)
  - Do NOT add sound effects to damage

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 13, 14, 15)
  - **Blocks**: None
  - **Blocked By**: Tasks 3 (HP=3), 8 (Recording screen redesign)

  **References**:
  - Stitch Screenshot 3 - Shows heart icons (filled and empty)
  - `apps/web/src/widgets/battle-hud/` - Current BattleHud to enhance
  - `apps/web/src/features/recording/RecordingScreen.tsx` - Uses HUD
  - `apps/web/src/features/battle/BattleScreen.tsx` - HP animation phase

  **Acceptance Criteria**:
  - [ ] HeartBar component renders 3 hearts
  - [ ] Full hearts, half hearts, and empty hearts display correctly
  - [ ] Damage animation shows heart flashing before emptying
  - [ ] HeartBar used in recording and battle screens

  **QA Scenarios:**
  ```
  Scenario: Hearts display correctly
    Tool: Playwright
    Steps:
      1. Navigate to recording screen with HP state = 3 for P1, 2 for P2
      2. Assert P1 has 3 filled hearts
      3. Assert P2 has 2 filled + 1 empty heart
      4. Take screenshot
    Expected Result: Heart icons match HP values
    Evidence: .sisyphus/evidence/task-12-hearts.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `widgets/heart-bar/`, `RecordingScreen.tsx`, `BattleScreen.tsx`

- [ ] 13. Connect 4-Category Scores to Result Screen Bars

  **What to do**:
  - Wire the new JudgmentResult (from Task 1/4) to the Result screen (from Task 9)
  - Parse the 4-category scores from GameContext judgment state
  - Render dual horizontal bar charts for each category:
    - TONE: player1_tone% bar vs player2_tone% bar (opposing directions)
    - EMOTION: player1_emotion% vs player2_emotion%
    - RHYTHM: player1_rhythm% vs player2_rhythm%
    - PRONUNCIATION: player1_pronunciation% vs player2_pronunciation%
  - Calculate display total: `Math.round(weightedTotal * 50)` (to get 3000-5000 range)
  - Calculate rank from weighted total: S(>=90), A(>=80), B(>=70), C(>=60), D(<60)
  - Animate bar charts: bars grow from 0% to final width on mount
  - Also update KO screen to show final round scores if applicable

  **Must NOT do**:
  - Do NOT change the JudgmentResult interface (Task 1 did that)
  - Do NOT change the Gemini prompt (Task 4 did that)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Data wiring between backend response and UI components requires careful type mapping
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 12, 14, 15)
  - **Blocks**: None
  - **Blocked By**: Tasks 4 (Gemini prompt), 9 (Result screen layout)

  **References**:
  - Task 1 output: New JudgmentResult interface
  - Task 4 output: Gemini returns 8 category scores
  - Task 9 output: Result screen with 4-bar placeholder layout
  - `apps/web/src/contexts/GameContext.tsx` - judgment state
  - Stitch Screenshot 4 - Shows dual bar charts and TOTAL SCORE format

  **Acceptance Criteria**:
  - [ ] 4 category bars show real scores from AI judgment
  - [ ] Bar widths proportional to scores (0-100%)
  - [ ] Total score displays as multiplied value (e.g., 3420)
  - [ ] Rank badge shows letter based on score threshold
  - [ ] Bars animate on mount

  **QA Scenarios:**
  ```
  Scenario: Score bars render with real data
    Tool: Playwright
    Steps:
      1. Set up game state with mock judgment containing category scores
      2. Navigate to result screen
      3. Assert TONE bar width > 0
      4. Assert EMOTION, RHYTHM, PRONUNCIATION bars visible
      5. Assert TOTAL SCORE displays a number > 0
      6. Assert RANK badge shows a letter (S/A/B/C/D)
    Expected Result: All 4 bars rendered with data, total and rank shown
    Evidence: .sisyphus/evidence/task-13-score-bars.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `ResultScreen.tsx`, `KoScreen.tsx`

- [ ] 14. Tie-Breaking Logic + Cosmetic Rank Badge

  **What to do**:
  - Implement tie-breaking in backend `battle.service.ts`:
    - If weighted totals are equal: compare emotion scores
    - If emotion equal: compare rhythm scores
    - If rhythm equal: compare to 4 decimal places
    - The Gemini prompt (Task 4) should already be instructed to avoid ties, but this is the fallback
  - Implement cosmetic rank badge logic:
    - S rank: weighted total >= 90
    - A rank: >= 80
    - B rank: >= 70
    - C rank: >= 60
    - D rank: < 60
  - Create a `RankBadge` component with retro pixel styling (bordered square with letter)
  - The rank is purely cosmetic display on the result screen - no persistence

  **Must NOT do**:
  - Do NOT build persistent ranking system or leaderboard
  - Do NOT add rank progression or unlocking

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple comparison logic + basic component
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Tasks 1 (types), 4 (Gemini prompt)

  **References**:
  - `apps/server/src/game/domain/services/battle.service.ts` - Add tie-breaking
  - PRD.md Section 5.4 - Tie-breaking: emotion > rhythm > decimal
  - Stitch Screenshot 4 - Shows 'RANK: S' badge

  **Acceptance Criteria**:
  - [ ] Equal totals broken by emotion score
  - [ ] Equal emotion broken by rhythm score
  - [ ] RankBadge component exists
  - [ ] Correct rank displayed based on score

  **QA Scenarios:**
  ```
  Scenario: Tie-breaking works
    Tool: Bash (node eval)
    Steps:
      1. Simulate: P1 total=75.0, P2 total=75.0, P1 emotion=80, P2 emotion=70
      2. Assert P1 wins (higher emotion)
    Expected Result: Tie broken by emotion score
    Evidence: .sisyphus/evidence/task-14-tiebreak.txt
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `battle.service.ts`, `RankBadge component`

- [ ] 15. Sequential Recording Flow - Online Mode (LOWEST PRIORITY)

  **What to do**:
  - Implement turn-based recording for online mode per PRD Section 4.2:
    1. AI-generated sentence displayed to both players
    2. Player A gets recording turn (B sees 'OPPONENT IS RECORDING...' wait state)
    3. A records and sends
    4. A's recording plays for B (latency masking while AI analyzes A's audio)
    5. Player B gets recording turn (A sees 'OPPONENT IS RECORDING...')
    6. B records and sends
    7. B's recording plays for A (latency masking while AI analyzes B's audio)
    8. Both scores ready, proceed to battle phase
  - Add new socket events if needed:
    - `recording-turn`: Server tells a specific player it's their turn to record
    - `opponent-audio`: Server sends opponent's recording for playback
  - Add server-side turn management in GameGateway:
    - Track whose turn it is to record
    - On P1 recording-done: send P1's audio to P2, tell P2 to record
    - On P2 recording-done: trigger judging
  - Frontend RecordingScreen: show different UI based on turn state:
    - My turn: REC button active, HOLD TO RECORD visible
    - Opponent's turn: 'OPPONENT IS RECORDING...' text, waveform plays opponent's audio
  - Keep local mode unchanged (simultaneous is fine for local)
  - NOTE: This is the highest-risk, lowest-priority task. If time runs out, game still works with simultaneous recording.

  **Must NOT do**:
  - Do NOT change local mode flow
  - Do NOT build a generic turn management system (hardcode P1 -> P2 sequence)
  - Do NOT add timeouts for unresponsive players (edge case, skip for MVP)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex WebSocket flow changes with timing and state management
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on multiple Wave 2 outputs)
  - **Parallel Group**: Wave 3 (sequential within wave)
  - **Blocks**: None
  - **Blocked By**: Tasks 8 (Recording redesign), 11 (Battle restyle)

  **References**:
  - `apps/server/src/game/infrastructure/gateway/game.gateway.ts` - WebSocket event handlers
  - `apps/web/src/features/recording/RecordingScreen.tsx` - Frontend recording logic
  - `apps/web/src/contexts/GameContext.tsx` - Socket event listeners
  - PRD.md Section 4.2 - In-game flow (sequential)
  - PRD.md Section 7 - Latency resolution strategy
  - usr_flow.md Section 2.3 - Detailed in-game sequence diagram

  **Acceptance Criteria**:
  - [ ] Online mode: P1 records first, P2 waits
  - [ ] After P1 records, P2 hears P1's audio
  - [ ] Then P2 records, P1 hears P2's audio
  - [ ] AI judging happens during audio playback (latency masking)
  - [ ] Local mode unchanged (simultaneous)

  **QA Scenarios:**
  ```
  Scenario: Sequential recording in online mode
    Tool: Playwright (two browser contexts)
    Preconditions: Two browser contexts connected to same room
    Steps:
      1. Browser A: assert REC button is enabled
      2. Browser B: assert REC button is disabled, 'OPPONENT IS RECORDING' shown
      3. Browser A: click and hold REC for 3 seconds, release
      4. Browser B: assert opponent's audio starts playing
      5. Browser B: after playback, assert REC button becomes enabled
      6. Browser B: click and hold REC for 3 seconds, release
      7. Browser A: assert opponent's audio starts playing
    Expected Result: Turn-based recording flow works correctly
    Failure Indicators: Both REC buttons enabled simultaneously, no audio playback
    Evidence: .sisyphus/evidence/task-15-sequential-recording.png

  Scenario: Local mode unchanged
    Tool: Playwright
    Steps:
      1. Start local mode game
      2. Navigate to recording screen
      3. Assert REC button is enabled (no turn-based logic)
    Expected Result: Local mode still uses direct recording
    Evidence: .sisyphus/evidence/task-15-local-mode.png
  ```

  **Commit**: YES (groups with Wave 3)
  - Files: `game.gateway.ts`, `RecordingScreen.tsx`, `GameContext.tsx`

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` in both apps. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify no hardcoded dark neon colors remain (grep for `#0a0a`, `#1a1a`, `rgb(10,`).
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | Theme Leaks [N found] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` + `playwright` skill
  Start from clean state (clear localStorage). Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test full game flow: nickname → lobby → character select → word select → recording → battle → result/KO. Test both local and online modes. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Game Flow [PASS/FAIL] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect TODO.md items that snuck in. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Scope Creep [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

After each wave, create a single commit:
- Wave 1: `feat(core): foundation - types, theme tokens, HP=3, Gemini 4-category scoring, nickname`
- Wave 2: `feat(ui): retro Game Boy theme - lobby, pvp, recording, result, battle, KO redesign`
- Wave 3: `feat(game): HP hearts, score bars, tie-breaking, sequential recording`
- Final: `chore: final QA fixes`

---

## Success Criteria

### Verification Commands
```bash
# Backend HP = 3
grep -n "STARTING_HP\|Hp.full\|new Hp(3)" apps/server/src/ -r  # Expected: 3, not 100

# Damage formula
grep -n "ScoreDiff\|scoreDiff\|damage" apps/server/src/game/domain/services/battle.service.ts  # Expected: 1 + diff/20

# Gemini prompt has 4 categories
grep -n "tone\|emotion\|rhythm\|pronunciation" apps/server/src/ai/infrastructure/adapters/gemini.adapter.ts  # Expected: all 4 present

# Pixel font imported
grep -n "Press Start\|DungGeunMo\|pixel" apps/web/src/app/layout.tsx  # Expected: font import

# Green theme colors
grep -n "#8bac0f\|#9bbc0f\|#306230\|--retro" apps/web/src/app/globals.css  # Expected: retro palette

# Nickname route exists
ls apps/web/src/app/nickname/  # Expected: page.tsx exists

# Result screen has 4 categories
grep -n "tone\|emotion\|rhythm\|pronunciation\|TONE\|EMOTION\|RHYTHM\|PRONUNCIATION" apps/web/src/features/result/ -r  # Expected: all 4
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Game playable end-to-end (local + online modes)
- [ ] Retro green theme visible on all screens
- [ ] No dark neon colors remaining
