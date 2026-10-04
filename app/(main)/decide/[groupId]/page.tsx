import Link from "next/link";
import { getCurrentGroup } from "@/lib/group";
import { getGroupSuggestions } from "@/lib/votes";
import { startOrGetDecideSession, getSuggestionsByIds, getSessionPicks } from "@/lib/decide";
import { createClient } from "@/lib/supabase/server";
import DecideNowClient from "@/components/decide/DecideNowClient";
import RealtimeRefresh from "@/components/realtime/RealtimeRefresh";

export default async function DecideNowPage() {
  const group = await getCurrentGroup();

  if (!group) {
    return (
      <main className="p-6 md:p-10">
        <p className="text-muted">You need to be part of a group to see this.</p>
      </main>
    );
  }

  const votingSuggestions = await getGroupSuggestions(group.id);

  if (votingSuggestions.length < 2) {
    return (
      <main className="p-6 md:p-10 text-center">
        <p className="text-muted">You need at least 2 movies up for debate to decide between.</p>
        <Link href="/watchlist" className="text-gold text-sm hover:underline mt-2 inline-block">
          Back to Watchlist
        </Link>
      </main>
    );
  }

  const session = await startOrGetDecideSession(group.id, votingSuggestions.map((s) => s.id));

  if (!session) {
    return (
      <main className="p-6 md:p-10">
        <p className="text-muted">Couldn&apos;t start a Decide Now session. Try again.</p>
      </main>
    );
  }

  const [candidates, picks, supabase] = await Promise.all([
    getSuggestionsByIds(session.candidateIds),
    getSessionPicks(session.id),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="p-6 md:p-10">
      <RealtimeRefresh table="decide_sessions" filter={`group_id=eq.${group.id}`} />
      <RealtimeRefresh table="decide_picks" filter={`session_id=eq.${session.id}`} />

      <Link href="/watchlist" className="text-sm text-muted hover:text-foreground">
        ← Back to List
      </Link>
      <div className="mt-8">
        <DecideNowClient
          key={session.id}
          session={session}
          suggestions={candidates}
          members={group.members}
          currentUserId={user?.id ?? ""}
          initialPicks={picks}
        />
      </div>
    </main>
  );
}