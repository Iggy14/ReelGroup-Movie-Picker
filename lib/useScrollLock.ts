"use client";

import { useEffect } from "react";

let locks = 0;

/** Locks page scrolling while `active` is true. Safe with several modals open at once. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    if (locks++ === 0) html.style.overflow = "hidden";
    return () => {
      if (--locks === 0) html.style.overflow = "";
    };
  }, [active]);
}
