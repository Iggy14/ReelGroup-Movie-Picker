# ReelGroup — Architecture

ReelGroup is a group movie-decision app: friends suggest films, vote, mark
movies watched, and resolve ties through a live "Decide Now" session. Built
as a portfolio project and used in production by a real family group.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database / Auth | Supabase (Postgres, Row Level Security, Realtime) |
| Movie data | TMDB API (search, posters, ratings, overview) |
| Styling | Tailwind CSS — dark background + gold accent theme |
| Fonts | Playfair Display (serif, titles) + Inter (sans, UI) |
| Hosting | Vercel |

No AI integration yet — Gemini is planned but deferred.

## Project Structure

```
app/
├── (auth)/login, /signup, /forgot-password, /reset-password — custom two-column auth UI (AuthShell)
├── (main)/                      — route group: shared layout, Navbar, auth guard
│   ├── tonight/                 — hero (top pick), Up for Debate row, Everyone's Seen row
│   ├── watchlist/                — voting grid, Decide Now entry point
│   ├── decide/[groupId]/        — Decide Now bracket + waiting room
│   ├── seen-it/                 — full watch history
│   └── members/                 — profile sidebar, roster, invite code (admin only)
├── groups/new/                  — create a group OR join via invite code
└── api/
    ├── tmdb/search/              — proxies TMDB search (keeps API key server-side)
    └── ai/recommend, ai/verdict  — stubs, not yet implemented

components/
├── auth/AuthShell.tsx
├── layout/ (Navbar, AvatarStack, LogoutButton, Footer)
├── suggest/ (SuggestModal, MovieSearchInput, SuggestFilmButton)
├── voting/VoteCard.tsx           — vote buttons + Mark as Watched, optimistic UI
├── decide/ (FaceOff, WaitingRoom, DecideNowClient)
├── members/InviteCodeBox.tsx
├── realtime/RealtimeRefresh.tsx  — generic Postgres-changes → router.refresh()
└── ui/ (PosterCard, Badge)

lib/
├── supabase/ (client.ts, server.ts)
├── group.ts        — getCurrentGroup(), cached per-request
├── votes.ts         — suggestions + votes, top-pick ranking, tonight's-pick override
├── watched.ts        — per-movie watched_by map
├── seen.ts           — "Everyone's Seen" query
├── decide.ts          — Decide Now sessions, picks, candidate lookups
├── memberStats.ts      — per-member suggested/watched counts
└── tmdb.ts             — TMDB search + genre ID→name mapping

middleware.ts        — required for Supabase SSR session refresh
next.config.ts        — whitelists image.tmdb.org for next/image
```

## Data Model

All tables are protected by Row Level Security; members can only read/write
their own group's data.

- **groups** — id, name, invite_code, created_at
- **group_members** — group_id, user_id, display_name, avatar_url, role (admin/member), joined_at
- **movies** — cached TMDB data: tmdb_id, title, year, genre, poster_url, overview, rating
- **suggestions** — group_id, movie_id, suggested_by, reason, status, is_ai_suggested
  - `status`: `voting` → `watched`, or `tonights_pick` (set by Decide Now, overrides the vote-based top pick)
- **votes** — suggestion_id, user_id, value (up/down)
- **watched_by** — group_id, movie_id, user_id — per-user watched tracking
- **decide_sessions** — group_id, candidate_ids[], status (active/resolved), winner_suggestion_id
- **decide_picks** — session_id, user_id, suggestion_id — one final pick per member per session

### Security definer RPCs

RLS creates chicken-and-egg problems for actions that must bootstrap their
own permissions. These run as `security definer` so they execute atomically
with elevated privileges, but only ever act on the caller's own `auth.uid()`:

- `create_group_with_owner` — creates a group, generates its invite code, adds the creator as admin
- `join_group_by_invite_code` — joins an existing group by code
- `start_or_get_decide_session` — atomically returns the active Decide Now session or creates one
- `tally_decide_picks` (trigger, not RPC) — after every pick, checks if everyone's voted; crowns a winner on majority, or auto-starts a runoff session on a tie

## Key Architectural Patterns

**Server/Client boundary.** Server Components (`page.tsx` files) fetch data
directly via `lib/` helpers using the server Supabase client. Interactive
pieces are Client Components (`"use client"`) using the browser client.
`getCurrentGroup()` is wrapped in React's `cache()` so it dedupes within a
single request even when called from both a layout and a page.

**Realtime, not polling.** `<RealtimeRefresh table="..." filter="...">` is a
reusable, invisible component that subscribes to Postgres changes and calls
`router.refresh()` on any insert/update/delete. Pages compose several of
these rather than writing bespoke subscription logic per page.

**Optimistic UI, carefully.** Vote buttons and "Mark as Watched" update
instantly on click via local optimistic state, then quietly sync with the
server. The override is cleared only once incoming server props actually
confirm the change — not on a timer and not from a bare realtime event —
which avoids a flicker race between manual refreshes and realtime-triggered
ones.

**Session + tally over direct writes.** Shared decisions that multiple
people could clobber (Tonight's Pick) are never written directly by whoever
finishes first. Decide Now uses a session/picks/tally pattern: each member's
final choice is recorded independently, and a database trigger only resolves
the group's actual pick once everyone has voted — ties automatically spawn a
narrower runoff session instead of flip-flopping.

**Movie details modal.** `ui/MovieDetailsModal` (native `<dialog>`, blurred
backdrop) shows a movie's full overview, genres, rating and reason, with an
optional `actions` slot (VoteCard puts the vote/watched controls there).
Cards opt in via `PosterCard`'s `onSelect` prop; the footer stops click
propagation so its buttons don't open the modal. Server components that need
it render `ui/MovieCard` (read-only card + modal) to hold
the open state. Pass `overview` through any new data query that feeds a card.

**Auth redirect placement.** The "does this user have a group yet?" check
lives in `app/(main)/layout.tsx`, not in the login form's submit handler.
This matters because Supabase's email-confirmation link logs a user in
directly and redirects to the site root, bypassing any check that only runs
during form submission.

**Password reset.** `/forgot-password` calls `resetPasswordForEmail` with
`redirectTo=/reset-password`. That page is fully client-side: the browser
Supabase client exchanges the emailed `?code` for a session on init, then
`updateUser({ password })` sets the new one. The URL must be in Supabase's
Auth → URL Configuration redirect allow-list.

## Known Limitations

- No AI integration yet (Gemini planned: "Surprise Us" suggestions, "Let AI Decide" tiebreaker)
- Google/GitHub OAuth intentionally removed — not configured in Supabase
- Genre data is empty for movies suggested before the genre-mapping fix (TMDB search only returns genre IDs, not names; run `node --env-file=.env scripts/backfill-genres.mjs --apply` once to backfill; needs `SUPABASE_SERVICE_ROLE_KEY` in `.env`)
- Mobile responsiveness pass in progress (Navbar, Members, Decide Now bracket, grid alignment)