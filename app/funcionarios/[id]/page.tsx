import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { Sidebar } from "../../../components/Sidebar/Sidebar";
import { Topbar } from "../../../components/Topbar/Topbar";
import { FuncionarioDetalheContent } from "./FuncionarioDetalheContent";

import styles from "./funcionarioDetalhe.module.css";

type FuncionarioDetalhePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FuncionarioDetalhePage({
  params,
}: FuncionarioDetalhePageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <div className={styles.page}>
        <Sidebar />
        <Topbar />
        <FuncionarioDetalheContent funcionarioId={id} />
      </div>
    </ProtectedRoute>
    
  );
}