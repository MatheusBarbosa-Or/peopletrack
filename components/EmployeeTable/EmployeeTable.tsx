"use client";

import Link from "next/link";
import styles from "./EmployeeTable.module.css";
import type { Funcionario } from "../../services/funcionariosService";

type EmployeeTableProps = {
  employees: Funcionario[];
};

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

export function EmployeeTable({ employees }: EmployeeTableProps) {
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
            <input placeholder="Buscar por nome ou cargo..." />
          </div>

          <button type="button" className={styles.filterButton}>
            <span className="material-symbols-outlined">filter_list</span>
            Filtros
          </button>
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
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
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
    </section>
  );
}