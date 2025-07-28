"use client";
import NavBar from "../../common/NavBar";
// import SidebarLinks from "../../common/SidebarLinks";
// import { usePathname } from "next/navigation";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col pl-0 sm:pl-64">
        <NavBar />
        <main className="flex-1 mt-10">{children}</main>
      </div>
    </div>
  );
}
