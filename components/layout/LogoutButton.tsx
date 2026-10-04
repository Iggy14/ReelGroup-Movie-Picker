"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-foreground/80 hover:text-red-400 transition-colors border border-surface-border hover:border-red-400/50 rounded-lg px-4 py-2"
    >
      <LogOut className="w-4 h-4" />
      Log Out
    </button>
  );
}