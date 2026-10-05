import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface GroupMember {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  role: "admin" | "member";
  joined_at: string;
}

export interface CurrentGroup {
  id: string;
  name: string;
  createdAt: string;
  members: GroupMember[];
  currentUserRole: "admin" | "member";
  inviteCode: string | null;
}

// One Supabase Auth round-trip per request, shared by the layout, pages and getCurrentGroup.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentGroup = cache(async (): Promise<CurrentGroup | null> => {
  const supabase = await createClient();

  const user = await getCurrentUser();

  if (!user) return null;

  const { data: membership } = await supabase
    .from("group_members")
    .select("group_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  const [{ data: group }, { data: members }] = await Promise.all([
    supabase
      .from("groups")
      .select("id, name, invite_code, created_at")
      .eq("id", membership.group_id)
      .single(),
    supabase
      .from("group_members")
      .select("id, user_id, display_name, avatar_url, role, joined_at")
      .eq("group_id", membership.group_id),
  ]);

  if (!group) return null;

  const isAdmin = membership.role === "admin";

  return {
    id: group.id,
    name: group.name,
    createdAt: group.created_at,
    members: members ?? [],
    currentUserRole: membership.role as "admin" | "member",
    inviteCode: isAdmin ? group.invite_code : null,
  };
});