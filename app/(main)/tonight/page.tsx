import { getCurrentGroup } from "@/lib/group";
import { getGroupSuggestions, getTopSuggestion, getTonightsPickOverride } from "@/lib/votes";
import { getGroupSeen } from "@/lib/seen";
import MovieRow from "@/components/tonight/MovieRow";
import Badge from "@/components/ui/Badge";
import RealtimeRefresh from "@/components/realtime/RealtimeRefresh";
import PosterCard from "@/components/ui/PosterCard";

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
        <section className="flex gap-8 items-start">
          <PosterCard
            title={topPick.movie.title}
            year={topPick.movie.year ?? 0}
            genre={topPick.movie.genre ?? ""}
            posterUrl={topPick.movie.posterUrl ?? ""}
            rating={topPick.movie.rating ?? undefined}
            size="lg"
            badge={<Badge>Tonight&apos;s Pick</Badge>}
          />
          <div className="pt-4">
            <p className="text-xs tracking-widest text-gold uppercase">Tonight&apos;s Pick</p>
            <h1 className="text-5xl font-display text-foreground mt-2">{topPick.movie.title}</h1>
            <p className="text-muted mt-3">
              {topPick.movie.year} · {topPick.movie.genre || "Unknown genre"}
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
        }))}
        emptyText="Nothing watched together yet."
      />
    </main>
  );
}