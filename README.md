# ReelGroup

A group movie-decision app: friends suggest films, vote, mark movies as watched, and settle ties with a live "Decide Now" session.

## Features

- **Groups** — create a group or join one with an invite code
- **Suggest** — search TMDB and add a film with an optional reason
- **Vote** — up/down votes with optimistic UI; the top-voted film becomes Tonight's Pick
- **Decide Now** — a live bracket where each member makes a final pick; ties spawn a runoff automatically
- **Seen it** — per-member watched tracking and a full history, plus an "Everyone's Seen" row
- **Movie details modal** — overview, genres, rating and reason on any card
- **Realtime** — pages refresh on Postgres changes via Supabase Realtime
- **Auth** — email/password sign-up, login, and password reset

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router) with React 19 and TypeScript
- [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security, Realtime (`@supabase/ssr`)
- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- Tailwind CSS 4 and lucide-react icons
- Hosted on Vercel

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file and fill in the values:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | Purpose |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Server-only; used by backfill scripts (bypasses RLS) |
   | `TMDB_API_KEY` | TMDB search proxy (kept server-side) |
   | `GEMINI_API_KEY` | Reserved for planned AI features; not used yet |

3. In Supabase, add your site URL and `/reset-password` to Auth → URL Configuration → Redirect URLs so password reset emails work.

4. Start the dev server and open [http://localhost:3000](http://localhost:3000):

   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `node --env-file=.env scripts/backfill-genres.mjs [--apply]` | Backfill `movies.genre` for older rows (dry run unless `--apply`) |
| `node --env-file=.env scripts/backfill-overviews.mjs [--apply]` | Backfill `movies.overview` for older rows |

The backfill scripts need `SUPABASE_SERVICE_ROLE_KEY` and `TMDB_API_KEY` in `.env`.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — project structure, data model, and key patterns
- [`docs/TODO.md`](docs/TODO.md) — deferred work

## Deployment

Deploy on [Vercel](https://vercel.com/new) and set the same environment variables in the project settings.
