import { redirect } from "next/navigation";
import { getCurrentGroup, getCurrentUser } from "@/lib/group";
import Navbar from "@/components/layout/Navbar";
import RealtimeRefresh from "@/components/realtime/RealtimeRefresh";
import Footer from "@/components/layout/Footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

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