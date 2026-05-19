import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";

/**
 * Layout for all authenticated pages.
 * Renders the sidebar on the left and the page content on the right.
 */
function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#F4F6F9]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
