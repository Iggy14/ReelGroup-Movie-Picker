import { getCurrentGroup } from "@/lib/group";
import { getGroupSuggestions } from "@/lib/votes";
import { getGroupWatched } from "@/lib/watched";
import { createClient } from "@/lib/supabase/server";
import VoteCard from "@/components/voting/VoteCard";
import RealtimeRefresh from "@/components/realtime/RealtimeRefresh";
import Link from "next/link";

export default async function WatchlistPage() {
  const group = await getCurrentGroup();

  if (!group) {
    return (
      <main className="p-6 md:p-10">
        <p className="text-muted">You need to be part of a group to see this.</p>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [suggestions, watchedMap] = await Promise.all([
    getGroupSuggestions(group.id),
    getGroupWatched(group.id),
  ]);

  return (
    <main className="p-6 md:p-10">
      <RealtimeRefresh table="votes" />
      <RealtimeRefresh table="suggestions" filter={`group_id=eq.${group.id}`} />
      <RealtimeRefresh table="watched_by" filter={`group_id=eq.${group.id}`} />

      <p className="text-xs tracking-widest text-muted uppercase">Group Watchlist</p>
      <h1 className="text-4xl font-display text-foreground mt-1">Up for Debate</h1>
      <p className="text-muted mt-2">
        {suggestions.length} film{suggestions.length !== 1 ? "s" : ""} · Vote to decide what you watch next
      </p>
      {suggestions.length >= 2 && (
      <Link
        href={`/decide/${group.id}`}
        className="inline-block mt-4 bg-gold hover:bg-gold-hover text-background text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        ⚡ Decide Now
      </Link>
    )}
      {suggestions.length === 0 ? (
        <p className="text-muted mt-10">
          No suggestions yet — click &ldquo;Suggest a Film&rdquo; to add the first one.
        </p>

      ) : (
        <div className="flex gap-6 flex-wrap mt-8">
          {suggestions.map((suggestion) => (
            <VoteCard
              key={suggestion.id}
              suggestion={suggestion}
              currentUserId={user?.id ?? ""}
              memberCount={group.members.length}
              groupId={group.id}
              watchedUserIds={watchedMap[suggestion.movie.id] ?? []}
              suggestedByName={group.members.find((m) => m.user_id === suggestion.suggestedBy)?.display_name}
            />
          ))}
        </div>
      )}
    </main>
  );
}