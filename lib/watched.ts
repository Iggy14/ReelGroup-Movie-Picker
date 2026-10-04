import { createClient } from "@/lib/supabase/server";

/**
 * Returns a map of movie_id -> array of user_ids who have marked that movie
 * watched within this group. Used to show "2/4 watched" progress and to
 * determine when a movie qualifies for "Everyone's Seen".
 */
export async function getGroupWatched(
  groupId: string
): Promise<Record<string, string[]>> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("watched_by")
    .select("movie_id, user_id")
    .eq("group_id", groupId);

  const map: Record<string, string[]> = {};

  for (const row of data ?? []) {
    map[row.movie_id] ??= [];
    map[row.movie_id].push(row.user_id);
  }

  return map;
}