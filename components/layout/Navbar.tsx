import Link from "next/link";
import LogoLink from "@/components/layout/LogoLink";
import MobileMenu from "@/components/layout/MobileMenu";
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
    <header className="sticky top-0 z-50 border-b border-surface-border bg-background/95 backdrop-blur">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] px-4 sm:px-6 py-4">
        <LogoLink />

        <nav className="hidden md:flex items-center justify-center gap-6">
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

        <div className="flex items-center gap-3 sm:gap-6 justify-self-end">
          {group && <SuggestFilmButton groupId={group.id} />}
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
