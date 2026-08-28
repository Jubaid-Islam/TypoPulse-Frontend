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
  proxy.ts                  # Route protection
next.config.ts               # Rewrites proxying backend auth/GraphQL through same origin
```


---
## Getting Started

### Prerequisites

- Node.js (v18 or higher) or Bun installed
- A running instance of the backend server
- PostgreSQL database configured for the backend

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory of the frontend project:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** The frontend runs on port `3000`, while the backend runs on port `4000`.
>
> If your backend is running on a different port or URL, update the environment variables accordingly.

### 3. Running the Development Server

Start the local development server:

```bash
npm run dev
```

The frontend will be available at:

**http://localhost:3000**

The backend GraphQL API will be available at:

**http://localhost:3000/graphql**

### 4. Production Build

To create and run an optimized production build locally:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

> **Note:** The production server port depends on your Next.js configuration and environment settings.



---
