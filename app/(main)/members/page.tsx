import { getCurrentGroup, getCurrentUser } from "@/lib/group";
import { getMemberStats } from "@/lib/memberStats";
import LogoutButton from "@/components/layout/LogoutButton";
import InviteCodeBox from "@/components/members/InviteCodeBox";

function colorForName(name: string) {
  const colors = ["#d4af37", "#8a6d3b", "#b5895a", "#6b5b3d", "#a3742f"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function formatMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default async function MembersPage() {
  const group = await getCurrentGroup();
  const user = await getCurrentUser();

  if (!group || !user) {
    return (
      <main className="p-10">
        <p className="text-muted">You need to be part of a group to see this.</p>
      </main>
    );
  }

  const stats = await getMemberStats(group.id);
  const currentMember = group.members.find((m) => m.user_id === user.id);
  const myStats = stats[user.id] ?? { suggested: 0, watched: 0 };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-73px)]">
      <aside className="contents md:flex md:flex-col md:w-72 md:flex-shrink-0 md:border-r md:border-surface-border md:p-8">
        <div className="order-1 md:order-none flex flex-col items-center text-center p-6 md:p-0 border-b border-surface-border md:border-b-0">
          {currentMember?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentMember.avatar_url}
              alt={currentMember.display_name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-background text-2xl font-medium"
              style={{
                backgroundColor: colorForName(currentMember?.display_name ?? "?"),
              }}
            >
              {(currentMember?.display_name ?? "?").charAt(0).toUpperCase()}
            </div>
          )}

          <p className="text-xl font-display text-foreground mt-3">
            {currentMember?.display_name}
          </p>
          <p className="text-xs text-gold mt-1">
            {group.currentUserRole === "admin" ? "Admin · Group Creator" : "Member"}
          </p>
          <p className="text-xs text-muted mt-1">{user.email}</p>
        </div>

        <div className="order-3 md:order-none flex flex-col md:flex-1 p-6 pt-0 md:p-0">
          <div className="border-t border-surface-border mt-6 pt-6">
            <p className="text-xs tracking-widest text-muted uppercase mb-3">
              Your Stats
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-surface-border rounded-lg p-3 text-center">
                <p className="text-2xl font-display text-gold">{myStats.watched}</p>
                <p className="text-xs text-muted mt-0.5">Watched</p>
              </div>
              <div className="border border-surface-border rounded-lg p-3 text-center">
                <p className="text-2xl font-display text-gold">{myStats.suggested}</p>
                <p className="text-xs text-muted mt-0.5">Suggested</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="order-2 md:order-none flex-1 p-6 md:p-10">
        <p className="text-xs tracking-widest text-gold uppercase border border-gold/40 inline-block rounded px-2 py-1">
          Your Group
        </p>
        <h1 className="text-4xl font-display text-foreground mt-3">{group.name}</h1>
        <p className="text-muted mt-2">
          {group.members.length} member{group.members.length !== 1 ? "s" : ""} · Active since{" "}
          {formatMonthYear(group.createdAt)}
        </p>

        {group.inviteCode && (
          <div className="mt-6">
            <InviteCodeBox inviteCode={group.inviteCode} />
          </div>
        )}

        <p className="text-xs tracking-widest text-muted uppercase mt-8 mb-3">Members</p>

        <div className="space-y-3">
          {group.members.map((member) => {
            const memberStats = stats[member.user_id] ?? { suggested: 0, watched: 0 };
            const isYou = member.user_id === user.id;

            return (
              <div
                key={member.id}
                className={`flex items-center gap-4 p-4 border rounded-lg bg-surface ${
                  isYou ? "border-gold/40" : "border-surface-border"
                }`}
              >
                {member.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.avatar_url}
                    alt={member.display_name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-background font-medium flex-shrink-0"
                    style={{ backgroundColor: colorForName(member.display_name) }}
                  >
                    {member.display_name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground truncate">{member.display_name}</p>
                    {isYou && (
                      <span className="text-xs text-gold border border-gold/40 rounded px-1.5 py-0.5">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted capitalize">
                    {member.role} · Member since {formatMonthYear(member.joined_at)}
                  </p>
                </div>

                <div className="flex gap-5 text-center flex-shrink-0">
                  <div>
                    <p className="text-gold font-display text-lg">{memberStats.watched}</p>
                    <p className="text-xs text-muted">Watched</p>
                  </div>
                  <div>
                    <p className="text-gold font-display text-lg">{memberStats.suggested}</p>
                    <p className="text-xs text-muted">Suggested</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}