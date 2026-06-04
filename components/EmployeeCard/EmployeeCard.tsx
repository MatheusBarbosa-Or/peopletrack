import Link from "next/link";
import type { Funcionario } from "../../services/funcionariosService";
import styles from "./EmployeeCard.module.css";

type EmployeeCardProps = {
  employee: Funcionario;
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

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Link href={`/funcionarios/${employee.id}`} className={styles.card}>
      <div className={styles.avatar}>{getInitials(employee.nome)}</div>

      <h3>{employee.nome}</h3>

      <p>{employee.cargo ?? "Cargo não informado"}</p>

      <span className={`${styles.status} ${styles[employee.status] ?? ""}`}>
        {getStatusLabel(employee.status)}
      </span>
    </Link>
  );
}