import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { Suspense } from "react";

import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Topbar } from "../../components/Topbar/Topbar";
import { FuncionariosContent } from "./FuncionariosContent";

import styles from "./funcionarios.module.css";

export default function FuncionariosPage() {
  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <Sidebar />
        <Topbar />
        <Suspense fallback={<main className={styles.main}>Carregando...</main>}>
          <FuncionariosContent />
        </Suspense>
      </div>
    </ProtectedRoute>
    
  );
}