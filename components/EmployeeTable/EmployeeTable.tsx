"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import styles from "./EmployeeTable.module.css";
import type { Funcionario } from "../../services/funcionariosService";

type EmployeeTableProps = {
  employees: Funcionario[];
  maxItems?: number;
};

type StatusFilter = "todos" | "ativo" | "desligado" | "afastado" | "ferias";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    ativo: "Ativo",
    desligado: "Desligado",
    afastado: "Afastado",
    ferias: "Férias",
  };

  return labels[status] ?? status;
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export function EmployeeTable({ employees, maxItems = 10 }: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ativo");

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return employees
      .filter((employee) => {
        if (statusFilter === "todos") {
          return true;
        }

        return employee.status === statusFilter;
      })
      .filter((employee) => {
        if (!normalizedSearch) {
          return true;
        }

        const searchableContent = [
          employee.nome,
          employee.cpf,
          employee.email,
          employee.cargo,
          employee.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableContent.includes(normalizedSearch);
      });
  }, [employees, searchTerm, statusFilter]);

  const visibleEmployees = filteredEmployees.slice(0, maxItems);

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h3>Listagem de Funcionários</h3>
          <p>Gerencie e visualize dados da equipe.</p>
        </div>

        <div className={styles.tools}>
          <div className={styles.search}>
            <span className="material-symbols-outlined">search</span>

            <input
              placeholder="Buscar por nome, CPF ou cargo..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
          >
            <option value="ativo">Ativos</option>
            <option value="desligado">Desligados</option>
            <option value="afastado">Afastados</option>
            <option value="ferias">Férias</option>
            <option value="todos">Todos</option>
          </select>
        </div>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Cargo</th>
              <th>Status</th>
              <th>Cadastro</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {visibleEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            ) : (
              visibleEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className={styles.employeeCell}>
                      <div className={styles.employeeAvatar}>
                        {getInitials(employee.nome)}
                      </div>

                      <div>
                        <strong>{employee.nome}</strong>
                        <span>{employee.email ?? "E-mail não informado"}</span>
                      </div>
                    </div>
                  </td>

                  <td>{employee.cargo ?? "-"}</td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[employee.status] ?? ""
                      }`}
                    >
                      {getStatusLabel(employee.status)}
                    </span>
                  </td>

                  <td>{formatDate(employee.created_at)}</td>

                  <td className={styles.actionCell}>
                    <Link href={`/funcionarios/${employee.id}`}>
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span>
          Mostrando {visibleEmployees.length} de {filteredEmployees.length}{" "}
          resultado(s)
        </span>
      </div>
    </section>
  );
}