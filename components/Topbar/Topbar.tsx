"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Topbar.module.css";

const THEME_STORAGE_KEY = "peopletrack_theme";

export function Topbar() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
      setIsDarkMode(true);
      return;
    }

    document.documentElement.classList.remove("dark-theme");
    setIsDarkMode(false);
  }, []);

  function toggleTheme() {
    const nextDarkMode = !isDarkMode;

    setIsDarkMode(nextDarkMode);

    if (nextDarkMode) {
      document.documentElement.classList.add("dark-theme");
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark-theme");
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    }
  }

  function getInitials(name?: string) {
    if (!name) return "US";

    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.spacer} />

      <div className={styles.actions}>
        <button type="button" className={styles.iconButton}>
          <span className="material-symbols-outlined">notifications</span>
          <span className={styles.notificationDot} />
        </button>

        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
          title={isDarkMode ? "Modo claro" : "Modo escuro"}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <div className={styles.avatar}>{getInitials(user?.nome)}</div>
      </div>
    </header>
  );
}