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
type SortOrder = "az" | "za" | "recentes" | "antigos";

export function FuncionariosContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    initialSearch ? "todos" : "ativo"
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>("az");

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
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = funcionarios.filter((funcionario) => {
      if (!normalizedSearch) {
        return true;
      }

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

    return [...filtered].sort((a, b) => {
      if (sortOrder === "az") {
        return a.nome.localeCompare(b.nome, "pt-BR");
      }

      if (sortOrder === "za") {
        return b.nome.localeCompare(a.nome, "pt-BR");
      }

      if (sortOrder === "recentes") {
        return (
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
        );
      }

      if (sortOrder === "antigos") {
        return (
          new Date(a.created_at ?? 0).getTime() -
          new Date(b.created_at ?? 0).getTime()
        );
      }

      return 0;
    });
  }, [funcionarios, searchTerm, sortOrder]);

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div>
          <h2>{searchTerm ? "Resultados da Pesquisa" : "Funcionários"}</h2>

          <p>
            {searchTerm
              ? `Mostrando ${filteredFuncionarios.length} resultado(s) para "${searchTerm}"`
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

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            <option value="az">Nome A-Z</option>
            <option value="za">Nome Z-A</option>
            <option value="recentes">Mais recentes</option>
            <option value="antigos">Mais antigos</option>
          </select>
        </div>
      </section>

      <section className={styles.searchSection}>
        <div className={styles.searchBox}>
          <span className="material-symbols-outlined">search</span>

          <input
            placeholder="Buscar por nome, CPF, e-mail ou cargo..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            className={styles.clearSearchButton}
            onClick={() => setSearchTerm("")}
          >
            Limpar busca
          </button>
        )}
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