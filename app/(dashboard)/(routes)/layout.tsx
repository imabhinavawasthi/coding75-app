import { SidebarProvider } from "../_components/sidebar/sidebar-context";
import { DashboardShell } from "../_components/sidebar/dashboard-shell";

const DashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
};

export default DashboardLayout;
