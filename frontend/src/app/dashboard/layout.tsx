import ProtectedLayout from "../(protected)/ProtectedLayout";
import DashboardShell from "../../components/Dashboard/DashboardShell";
//Layout for the dashboard page
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedLayout>
  );
}
