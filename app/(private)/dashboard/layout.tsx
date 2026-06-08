import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-black">
      <Sidebar />
      <Header />
      <main className="pl-60 pt-20 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
