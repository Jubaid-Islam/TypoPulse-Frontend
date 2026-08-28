# TypoPulse — Frontend

TypoPulse is a typing precision game: type 20 random lowercase letters as fast and accurately as possible. Every mistake adds a time penalty, so accuracy matters as much as raw speed.

## Tech Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Data fetching:** TanStack Query (`@tanstack/react-query`)
- **Auth:** better-auth (email/password), session via HTTP-only cookie
- **Backend:** Express + GraphQL Yoga (separate repo/service)
- **Deployment:** Vercel

## Features

- Timed typing challenge (20 characters per round)
- Live progress grid showing typed / current / upcoming characters
- Red flash feedback on incorrect keypress
- Personal best tracking with "faster/slower than best" comparison
- Game history with the all-time best run pinned to the top
- Global leaderboard (top players by best time)
- Auth-gated gameplay: guests can browse, but must log in to see history and save scores

---

## Game Logic

### Character sequence

Each round generates **20 random lowercase letters** (`a`–`z`), stored as a `chars: string[]` array. The player must type them in order.

```
TOTAL_CHARS = 20
```

### Typing flow (`useGame` hook)

- `currentIndex` tracks which character the player is currently on.
- A **correct** keypress:
  - Increments `correctChars`
  - Advances `currentIndex`
  - Records a WPM sample and a per-character timing sample
  - On the 20th correct character, ends the game (`isComplete = true`)
- An **incorrect** keypress:
  - Does **not** advance `currentIndex` — the player must retry the same character
  - Increments `wrongAttempts`
  - Applies a time penalty (see below)
  - Briefly flags `isWrongFlash = true` (~250ms) so the UI can flash the current character red

Because the round only ends once all 20 characters have been typed *correctly*, **`correctChars` is always 20 at game end** — `wrongAttempts` represents *extra* incorrect keystrokes made along the way, not characters that were skipped.

### Timing & scoring

| Term | Meaning |
|---|---|
| `rawTimeMs` | Elapsed time from game start to completion, unaffected by penalties |
| `penaltyMs` | `wrongAttempts * 500ms` — each mistake adds half a second |
| `totalTimeMs` | `rawTimeMs + penaltyMs` — the official score used for best-time and leaderboard comparisons |
| `accuracy` | `correctChars / (correctChars + wrongAttempts) * 100` |

The penalty is applied live during play (by shifting the internal start-time reference backward), so the on-screen timer already reflects mistakes in real time.

### Result screen

After a round, `GameResult` displays:
- Final time (`totalTimeMs`, including penalty)
- Accuracy, correct character count, mistake count
- Comparison against the player's **previous** best (captured *before* the round started, to avoid comparing a fresh best score against itself due to query refetch timing)
- A "New Best" badge if this run beat (or is) the player's best

---

## User / Auth Logic

- Authentication is handled by **better-auth** on the backend; the frontend calls `/api/auth/*` endpoints (login, register, logout, session).
- On successful login, the backend sets a session cookie (`better-auth.session_token`), which the frontend proxies through **same-origin rewrites** (`next.config.ts`) so the cookie is scoped to the frontend's own domain — required because the frontend and backend are deployed to different Vercel domains.
- `AuthContext` exposes the current `user` (or `null` for guests) app-wide.
- Route protection:
  - `/game` and `/history` require authentication.
  - `/login` and `/register` redirect away if already authenticated.
- Guests can still view the **Home** page and **Leaderboard**, but attempting to start a game or view history redirects to `/login?redirect=<original path>`.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, personal best summary, total games played |
| `/game` | The typing challenge itself; shows `GameResult` after completion |
| `/history` | List of the logged-in user's past games, best run pinned to top |
| `/leaderboard` | Top players ranked by best time (all users) |
| `/login`, `/register` | Auth forms |

---

## Project Structure (key parts)

```
src/
  app/                      # Next.js routes/pages
  components/
    game/                   # GameContainer, CharacterDisplay, GameResult, Timer, ProgressIndicator
    history/                # HistoryList
    leaderboard/            # LeaderboardTable, BestScoreHighlight
    dashboard/              # Home page stat cards
    shared/                 # Shared small UI (KeyboardShortcutHint, etc.)
    ui/                     # shadcn/ui primitives
  hooks/
    useGame.ts              # Core typing game state machine
    useAuth.ts / AuthContext
    useBestScore.ts
    useGameHistory.ts
    useLeaderboard.ts
    useSubmitGameResult.ts
  context/
    AuthContext.tsx
  types/
    index.ts                # Shared TS types (GameResult, LeaderboardEntry, etc.)
    constants.ts             # TOTAL_CHARS, PENALTY_MS_PER_WRONG
  middleware.ts              # Route protection (auth-gated pages)
next.config.ts               # Rewrites proxying backend auth/GraphQL through same origin
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `BACKEND_URL` | Base URL of the deployed backend (used by `next.config.ts` rewrites) |
| `NEXT_PUBLIC_API_URL` | Public-facing API base (if used directly by any client-side calls) |

---

## Getting Started

```bash
bun install
bun run dev
```

App runs at `http://localhost:3000` by default. Make sure a backend instance is reachable at the URL configured in `BACKEND_URL`.

### Build

```bash
bun run build
bun run start
```

---

## Notes on Cross-Origin Auth

Because the frontend (`*.vercel.app`) and backend (`*.vercel.app`, different project) are on different domains, cookies set directly by the backend would not be visible to the frontend's own origin. To work around this without a custom shared domain, `next.config.ts` rewrites `/api/auth/*` and `/graphql` requests through the frontend's own origin, so:

- The browser only ever talks to `typopulse-frontend.vercel.app`
- Next.js forwards those specific requests server-side to the backend
- The `Set-Cookie` response is seen by the browser as coming from the frontend's own origin, so the session cookie is stored correctly and sent on subsequent requests (including by `middleware.ts` for route protection)
