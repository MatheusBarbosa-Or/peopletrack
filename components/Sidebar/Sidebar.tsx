"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { canRegisterEmployees, canRegisterUsers } from "@/utils/permission";


export function Sidebar() {
  const pathname = usePathname();

  const { user, logout } = useAuth();
  const canAccessCadastro = canRegisterUsers(user) || canRegisterEmployees(user);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      label: "Funcionários",
      href: "/funcionarios",
      icon: "groups",
    },
    ...(canAccessCadastro
      ? [
          {
            label: "Cadastro",
            href: "/cadastro",
            icon: "person_add",
          },
        ]
      : []),
  ];

  function isActiveRoute(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className="material-symbols-outlined">groups</span>

        <div>
          <h1>PeopleTrack</h1>
          <p>Gestão de RH</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.profile}>
        <div className={styles.avatar}>
          {user?.nome
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() ?? "US"}
        </div>

        <div>
          <strong>{user?.nome ?? "Usuário"}</strong>
          <span>{user?.cargo ?? user?.role}</span>
        </div>

        <button type="button" onClick={logout} className={styles.logoutButton}>
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </aside>
  );
}