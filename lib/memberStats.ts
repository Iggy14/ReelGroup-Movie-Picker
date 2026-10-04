import { createClient } from "@/lib/supabase/server";

export interface MemberStats {
  suggested: number;
  watched: number;
}

export async function getMemberStats(
  groupId: string
): Promise<Record<string, MemberStats>> {
  const supabase = await createClient();

  const [{ data: suggestions }, { data: watched }] = await Promise.all([
    supabase.from("suggestions").select("suggested_by").eq("group_id", groupId),
    supabase.from("watched_by").select("user_id").eq("group_id", groupId),
  ]);

  const stats: Record<string, MemberStats> = {};

  for (const row of suggestions ?? []) {
    const userId = row.suggested_by as string;
    stats[userId] ??= { suggested: 0, watched: 0 };
    stats[userId].suggested += 1;
  }

  for (const row of watched ?? []) {
    const userId = row.user_id as string;
    stats[userId] ??= { suggested: 0, watched: 0 };
    stats[userId].watched += 1;
  }

  return stats;
}