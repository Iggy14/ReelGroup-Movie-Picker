import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentGroup } from "@/lib/group";
import Navbar from "@/components/layout/Navbar";
import RealtimeRefresh from "@/components/realtime/RealtimeRefresh";
import Footer from "@/components/layout/Footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const group = await getCurrentGroup();

  if (!group) {
    redirect("/groups/new");
  }

  return (
  <>
    <RealtimeRefresh table="group_members" filter={`group_id=eq.${group.id}`} />
    <Navbar group={group} />
    {children}
    <Footer />
  </>

);
}