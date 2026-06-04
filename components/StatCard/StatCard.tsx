import styles from "./StatCard.module.css";

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  description: string;
  trend?: string;
  variant?: "primary" | "success" | "danger";
};

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  variant = "primary",
}: StatCardProps) {
  return (
    <article className={styles.card}>
      <span className={`${styles.backgroundIcon} material-symbols-outlined`}>
        {icon}
      </span>

      <div className={styles.header}>
        <span className="material-symbols-outlined">{icon}</span>
        <h3>{title}</h3>
      </div>

      <div className={styles.content}>
        <strong className={styles[variant]}>{value}</strong>

        {trend && <span className={styles.trend}>{trend}</span>}
      </div>

      <p>{description}</p>
    </article>
  );
}