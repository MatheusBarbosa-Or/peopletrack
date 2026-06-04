import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { CadastroContent } from "./CadastroContent";

import styles from "./cadastro.module.css";

export default function CadastroPage() {
  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <Sidebar />
        <Topbar />
        <CadastroContent />
      </div>
    </ProtectedRoute>
    
  );
}