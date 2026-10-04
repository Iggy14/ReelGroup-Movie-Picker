import type { GroupMember } from "@/lib/group";

interface AvatarStackProps {
  members: GroupMember[];
  label?: string;
}

// Generates a consistent color from a string so each member gets a stable fallback color
function colorForName(name: string) {
  const colors = ["#d4af37", "#8a6d3b", "#b5895a", "#6b5b3d", "#a3742f"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function AvatarStack({ members, label }: AvatarStackProps) {
  if (members.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {members.map((member) =>
          member.avatar_url ? (
            <img
              key={member.id}
              src={member.avatar_url}
              alt={member.display_name}
              className="w-8 h-8 rounded-full border-2 border-background object-cover"
            />
          ) : (
            <div
              key={member.id}
              title={member.display_name}
              className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-background"
              style={{ backgroundColor: colorForName(member.display_name) }}
            >
              {member.display_name.charAt(0).toUpperCase()}
            </div>
          )
        )}
      </div>
      {label && <span className="text-sm text-muted whitespace-nowrap">{label}</span>}
    </div>
  );
}
