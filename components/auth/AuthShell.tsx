"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/login", label: "Sign In" },
  { href: "/signup", label: "Create Account" },
];

/* Dark + gold overlay so any photo reads cohesively with the theme */
function PhotoOverlay() {
  return (
    <>
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
    </>
  );
}

export default function AuthShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-dvh w-full max-w-full overflow-x-hidden flex flex-col lg:flex-row">
      {/* Mobile: full-bleed photo behind the form card */}
      <div
        className="lg:hidden absolute inset-0 overflow-hidden bg-[#0a0908] bg-cover bg-center"
        style={{ backgroundImage: "url('/auth-bg.jpg')" }}
      >
        <PhotoOverlay />
      </div>

      {/* Mobile: compact brand header */}
      <div className="lg:hidden relative z-10 flex flex-col items-center text-center px-6 pt-10 pb-6">
        <Image
          src="/reelgroup-logo.png"
          alt="ReelGroup"
          width={613}
          height={540}
          priority
          className="h-20 w-auto"
        />
        <p className="font-display italic text-lg text-foreground/90 leading-snug mt-3 max-w-xs">
          &ldquo;The best films are the ones you watch together.&rdquo;
        </p>
        <p className="text-muted mt-2 tracking-widest text-[11px] uppercase">
          Curate &middot; Vote &middot; Decide &middot; Watch
        </p>
      </div>

      {/* Desktop left: background photo panel - drop your image at public/auth-bg.jpg */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden bg-[#0a0908] bg-cover bg-center"
        style={{ backgroundImage: "url('/auth-bg.jpg')" }}
      >
        <PhotoOverlay />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <Image
            src="/reelgroup-logo.png"
            alt="ReelGroup"
            width={613}
            height={540}
            priority
            className="h-28 w-auto self-start"
          />

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
      <div className="relative z-10 min-w-0 mx-4 sm:mx-auto sm:max-w-md mb-8 rounded-2xl border border-surface-border bg-surface/95 backdrop-blur-sm shadow-2xl flex flex-col justify-center px-6 sm:px-10 py-8 lg:mx-0 lg:max-w-none lg:w-[480px] lg:mb-0 lg:rounded-none lg:border-0 lg:bg-surface lg:backdrop-blur-none lg:shadow-none lg:px-12 lg:py-10">
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