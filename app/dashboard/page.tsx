import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { DashboardContent } from "./dashboardContent";

import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <Sidebar />
        <Topbar />
        <DashboardContent />
      </div>
    </ProtectedRoute>
    
  );
}