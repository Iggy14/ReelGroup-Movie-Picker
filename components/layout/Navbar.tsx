import Link from "next/link";
import AvatarStack from "@/components/layout/AvatarStack";
import SuggestFilmButton from "@/components/suggest/SuggestFilmButton";
import type { CurrentGroup } from "@/lib/group";
interface NavbarProps {
  group: CurrentGroup | null;
}

const navLinks = [
  { href: "/tonight", label: "Tonight" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/seen-it", label: "Seen It" },
  { href: "/members", label: "Members" },
];

export default function Navbar({ group }: NavbarProps) {
  return (
    <header className="border-b border-surface-border">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Link href="/tonight" className="font-display text-xl tracking-wide text-gold">
            REELGROUP
          </Link>

          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-foreground/80 hover:text-foreground transition-colors group/link py-1"
>
                {link.label}
                <span className="absolute left-0 -bottom-0.5 w-full h-px bg-gold scale-x-0 group-hover/link:scale-x-100 transition-transform duration-200 origin-left" />
</Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          

          {group && <SuggestFilmButton groupId={group.id} />}
        </div>
      </div>
    </header>
  );
}
