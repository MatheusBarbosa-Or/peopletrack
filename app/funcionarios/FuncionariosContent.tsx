"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { EmployeeCard } from "../../components/EmployeeCard/EmployeeCard";
import {
  Funcionario,
  getFuncionarios,
} from "../../services/funcionariosService";

import styles from "./funcionarios.module.css";

type StatusFilter = "ativo" | "desligado" | "todos";

export function FuncionariosContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    search ? "todos" : "ativo"
  );
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadFuncionarios() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getFuncionarios(statusFilter);

        setFuncionarios(data);
      } catch (error) {
        setErrorMessage("Não foi possível carregar os funcionários.");
      } finally {
        setIsLoading(false);
      }
    }

    loadFuncionarios();
  }, [statusFilter]);

  const filteredFuncionarios = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return funcionarios;
    }

    return funcionarios.filter((funcionario) => {
      const searchableContent = [
        funcionario.nome,
        funcionario.cpf,
        funcionario.email,
        funcionario.cargo,
        funcionario.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });
  }, [funcionarios, search]);

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div>
          <h2>{search ? "Resultados da Pesquisa" : "Funcionários"}</h2>

          <p>
            {search
              ? `Mostrando ${filteredFuncionarios.length} resultado(s) para "${search}"`
              : "Gerencie e visualize os funcionários registrados no sistema."}
          </p>
        </div>

        <div className={styles.actions}>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
          >
            <option value="ativo">Ativos</option>
            <option value="desligado">Desligados</option>
            <option value="todos">Todos</option>
          </select>

          <button type="button">
            <span className="material-symbols-outlined">sort</span>
            Ordenar
          </button>
        </div>
      </section>

      {isLoading && (
        <div className={styles.messageBox}>Carregando funcionários...</div>
      )}

      {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

      {!isLoading && !errorMessage && filteredFuncionarios.length === 0 && (
        <div className={styles.emptyBox}>
          Nenhum funcionário encontrado para os filtros atuais.
        </div>
      )}

      {!isLoading && !errorMessage && filteredFuncionarios.length > 0 && (
        <section className={styles.grid}>
          {filteredFuncionarios.map((funcionario) => (
            <EmployeeCard key={funcionario.id} employee={funcionario} />
          ))}
        </section>
      )}
    </main>
  );
}