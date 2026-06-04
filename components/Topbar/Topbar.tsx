"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Topbar.module.css";

export function Topbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      router.push("/funcionarios");
      return;
    }

    router.push(`/funcionarios?search=${encodeURIComponent(trimmedSearch)}`);
  }

  return (
    <header className={styles.topbar}>
      <form className={styles.searchBox} onSubmit={handleSubmit}>
        <span className="material-symbols-outlined">search</span>

        <input
          placeholder="Buscar funcionários..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </form>

      <div className={styles.actions}>
        <button type="button" className={styles.iconButton}>
          <span className="material-symbols-outlined">notifications</span>
          <span className={styles.notificationDot} />
        </button>

        <button type="button" className={styles.iconButton}>
          <span className="material-symbols-outlined">help</span>
        </button>

        <div className={styles.avatar}>AD</div>
      </div>
    </header>
  );
}