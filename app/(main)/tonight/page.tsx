import { getCurrentGroup } from "@/lib/group";
import { getGroupSuggestions, getTopSuggestion, getTonightsPickOverride } from "@/lib/votes";
import { getGroupSeen } from "@/lib/seen";
import MovieRow from "@/components/tonight/MovieRow";
import Badge from "@/components/ui/Badge";
import RealtimeRefresh from "@/components/realtime/RealtimeRefresh";
import MovieCard from "@/components/ui/MovieCard";

export default async function TonightPage() {
  const group = await getCurrentGroup();

  if (!group) {
    return (
      <main className="p-6 md:p-10">
        <p className="text-muted">You need to be part of a group to see this.</p>
      </main>
    );
  }

  const [suggestions, seen, manualPick] = await Promise.all([
  getGroupSuggestions(group.id),
  getGroupSeen(group.id),
  getTonightsPickOverride(group.id),
]);

  const topPick = manualPick ?? getTopSuggestion(suggestions);
  const otherSuggestions = suggestions.filter((s) => s.id !== topPick?.id);

  function nameFor(userId: string) {
    return group!.members.find((m) => m.user_id === userId)?.display_name;
  }

  return (
    <main className="p-6 md:p-10">
      <RealtimeRefresh table="votes" />
      <RealtimeRefresh table="suggestions" filter={`group_id=eq.${group.id}`} />

      {topPick ? (
        <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <MovieCard
            movie={{
              ...topPick.movie,
              suggestedByName: nameFor(topPick.suggestedBy),
              reason: topPick.reason,
            }}
            size="lg"
            posterOnly
            priority
            badge={<Badge>Tonight&apos;s Pick</Badge>}
          />
          <div className="md:pt-4">
            <p className="text-xs tracking-widest text-gold uppercase">Tonight&apos;s Pick</p>
            <h1 className="text-3xl sm:text-5xl font-display text-foreground mt-2">{topPick.movie.title}</h1>
            <p className="text-muted mt-3">
              {topPick.movie.year} · {topPick.movie.genre || "Unknown genre"}
              {topPick.movie.rating != null && <span className="text-gold"> · ★ {topPick.movie.rating.toFixed(1)}</span>}
            </p>
            {topPick.movie.overview && (
              <p className="text-foreground/80 mt-4 max-w-xl">{topPick.movie.overview}</p>
            )}
            {topPick.reason && (
              <p className="text-foreground/60 italic mt-3 max-w-xl">&ldquo;{topPick.reason}&rdquo;</p>
            )}
            {nameFor(topPick.suggestedBy) && (
              <p className="text-xs text-gold/80 mt-3">Suggested by {nameFor(topPick.suggestedBy)}</p>
            )}
          </div>
        </section>
      ) : (
        <div>
          <p className="text-xs tracking-widest text-muted uppercase">Tonight</p>
          <h1 className="text-4xl font-display text-foreground mt-1">Nothing suggested yet</h1>
          <p className="text-muted mt-2">Click &ldquo;Suggest a Film&rdquo; to get the group started.</p>
        </div>
      )}

      <MovieRow
        title="Up for Debate"
        subtitle="The group is split — cast your vote"
        movies={otherSuggestions.map((s) => ({
          id: s.id,
          title: s.movie.title,
          year: s.movie.year,
          genre: s.movie.genre,
          posterUrl: s.movie.posterUrl,
          rating: s.movie.rating,
          overview: s.movie.overview,
          reason: s.reason,
          suggestedByName: nameFor(s.suggestedBy),
        }))}
        emptyText="No other suggestions right now."
      />

      <MovieRow
        title="Everyone's Seen"
        subtitle="All members have watched these"
        movies={seen.map((s) => ({
          id: s.id,
          title: s.movie.title,
          year: s.movie.year,
          genre: s.movie.genre,
          posterUrl: s.movie.posterUrl,
          rating: s.movie.rating,
          overview: s.movie.overview,
          reason: s.reason,
          suggestedByName: nameFor(s.suggestedBy),
        }))}
        emptyText="Nothing watched together yet."
      />
    </main>
  );
}