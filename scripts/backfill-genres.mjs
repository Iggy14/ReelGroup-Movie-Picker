// One-off: fill in `movies.genre` for rows saved before genre mapping existed.
// Usage: node --env-file=.env scripts/backfill-genres.mjs [--apply]
// Dry run by default. Needs SUPABASE_SERVICE_ROLE_KEY in .env (bypasses RLS).
import { createClient } from "@supabase/supabase-js";

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, TMDB_API_KEY: tmdbKey } =
  process.env;
if (!url || !key || !tmdbKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or TMDB_API_KEY");
  process.exit(1);
}
const apply = process.argv.includes("--apply");
const supabase = createClient(url, key);

const { data: movies, error } = await supabase
  .from("movies")
  .select("id, tmdb_id, title")
  .or("genre.is.null,genre.eq.");
if (error) throw error;

console.log(`${movies.length} movies missing a genre${apply ? "" : " (dry run, pass --apply to write)"}`);

let updated = 0;
for (const movie of movies) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movie.tmdb_id}?api_key=${tmdbKey}&language=en-US`
  );
  if (!res.ok) {
    console.warn(`SKIP ${movie.title} (tmdb ${movie.tmdb_id}): TMDB ${res.status}`);
    continue;
  }
  const details = await res.json();
  // Same format as lib/tmdb.ts: first two genre names, comma-joined.
  const genre = (details.genres ?? []).map((g) => g.name).slice(0, 2).join(", ");
  if (!genre) {
    console.warn(`SKIP ${movie.title}: TMDB has no genres`);
    continue;
  }
  console.log(`${movie.title} -> ${genre}`);
  if (apply) {
    const { error: upErr } = await supabase.from("movies").update({ genre }).eq("id", movie.id);
    if (upErr) {
      console.warn(`FAILED ${movie.title}: ${upErr.message}`);
      continue;
    }
  }
  updated++;
}
console.log(`${apply ? "Updated" : "Would update"} ${updated}/${movies.length}`);
