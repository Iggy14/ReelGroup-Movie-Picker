import { getCurrentGroup } from "@/lib/group";
import { getGroupSeen } from "@/lib/seen";
import PosterCard from "@/components/ui/PosterCard";
import RealtimeRefresh from "@/components/realtime/RealtimeRefresh";

export default async function SeenItPage() {
  const group = await getCurrentGroup();

  if (!group) {
    return (
      <main className="p-6 md:p-10">
        <p className="text-muted">You need to be part of a group to see this.</p>
      </main>
    );
  }

  const seen = await getGroupSeen(group.id);

  return (
    <main className="p-6 md:p-10">
      <RealtimeRefresh table="suggestions" filter={`group_id=eq.${group.id}`} />

      <p className="text-xs tracking-widest text-muted uppercase">Watch History</p>
      <h1 className="text-4xl font-display text-foreground mt-1">Seen It</h1>
      <p className="text-muted mt-2">
        {seen.length} film{seen.length !== 1 ? "s" : ""} watched together
      </p>

      {seen.length === 0 ? (
        <p className="text-muted mt-10">
          Nothing watched together yet — mark films as watched from the Watchlist.
        </p>
      ) : (
        <div className="flex gap-6 flex-wrap mt-8">
          {seen.map((item) => (
            <PosterCard
              key={item.id}
              title={item.movie.title}
              year={item.movie.year ?? 0}
              genre={item.movie.genre ?? ""}
              posterUrl={item.movie.posterUrl ?? ""}
              rating={item.movie.rating ?? undefined}
            />
          ))}
        </div>
      )}
    </main>
  );
}