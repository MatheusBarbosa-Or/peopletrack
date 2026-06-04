"use client";

import { useEffect, useMemo, useState } from "react";

import { EmployeeTable } from "../../components/EmployeeTable/EmployeeTable";
import { StatCard } from "../../components/StatCard/StatCard";
import { Funcionario, getFuncionarios, } from "../../services/funcionariosService";

import styles from "./dashboard.module.css";

export function DashboardContent() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadFuncionarios() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getFuncionarios("todos");

        setFuncionarios(data);
      } catch (error) {
        setErrorMessage("Não foi possível carregar os funcionários.");
      } finally {
        setIsLoading(false);
      }
    }

    loadFuncionarios();
  }, []);

  const stats = useMemo(() => {
    const total = funcionarios.length;
    const ativos = funcionarios.filter(
      (funcionario) => funcionario.status === "ativo"
    ).length;
    const desligados = funcionarios.filter(
      (funcionario) => funcionario.status === "desligado"
    ).length;

    const percentualAtivos =
      total > 0 ? ((ativos / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      ativos,
      desligados,
      percentualAtivos,
    };
  }, [funcionarios]);

  const funcionariosAtivos = funcionarios.filter(
    (funcionario) => funcionario.status === "ativo"
  );

  return (
    <main className={styles.main}>
      <section className={styles.heading}>
        <h2>Visão Geral</h2>
        <p>Métricas principais do quadro de funcionários.</p>
      </section>

      {isLoading && (
        <div className={styles.messageBox}>Carregando funcionários...</div>
      )}

      {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

      <section className={styles.statsGrid}>
        <StatCard
          title="Total de Funcionários"
          value={String(stats.total)}
          icon="groups"
          description="Total registrado no sistema"
          variant="primary"
        />

        <StatCard
          title="Funcionários Ativos"
          value={String(stats.ativos)}
          icon="check_circle"
          trend={`${stats.percentualAtivos}%`}
          description="Funcionários disponíveis na listagem principal"
          variant="success"
        />

        <StatCard
          title="Funcionários Desligados"
          value={String(stats.desligados)}
          icon="person_remove"
          description="Funcionários com desligamento registrado"
          variant="danger"
        />
      </section>

      <EmployeeTable employees={funcionariosAtivos} />
    </main>
  );
}