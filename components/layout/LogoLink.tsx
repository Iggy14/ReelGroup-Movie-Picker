"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LogoLink() {
  const pathname = usePathname();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/tonight") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link
      href="/tonight"
      onClick={handleClick}
      className="justify-self-start md:pl-6"
      aria-label="ReelGroup"
    >
      <Image
        src="/reelgroup-logo.png"
        alt="ReelGroup"
        width={613}
        height={540}
        priority
        className="h-12 w-auto"
      />
    </Link>
  );
}
