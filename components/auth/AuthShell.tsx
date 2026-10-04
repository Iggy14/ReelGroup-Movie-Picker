"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/login", label: "Sign In" },
  { href: "/signup", label: "Create Account" },
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Left: background photo panel - drop your image at public/auth-bg.jpg */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-[#0a0908] bg-cover bg-center"
        style={{ backgroundImage: "url('/auth-bg.jpg')" }}
      >
        {/* Dark + gold overlay so any photo reads cohesively with the theme */}
        <div className="absolute inset-0 bg-background/50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,9,8,0.95) 0%, rgba(10,9,8,0.5) 45%, rgba(10,9,8,0.6) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 100%, rgba(212,175,55,0.12), transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <span className="font-display text-2xl tracking-wide text-gold">
            REELGROUP
          </span>

          <div>
            <blockquote className="font-display italic text-4xl text-foreground/90 leading-snug max-w-lg">
              &ldquo;The best films are the ones you watch together.&rdquo;
            </blockquote>
            <p className="text-muted mt-4 tracking-widest text-sm uppercase">
              Curate &middot; Vote &middot; Decide &middot; Watch
            </p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-[480px] bg-surface flex flex-col justify-center px-8 sm:px-12 py-10">
        <div className="flex mb-8 border border-surface-border rounded-lg overflow-hidden">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 text-center py-2.5 text-sm font-medium transition-colors ${
                pathname === tab.href
                  ? "bg-surface-border text-gold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}