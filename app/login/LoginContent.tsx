"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../contexts/AuthContext";

import styles from "./login.module.css";

export function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Informe usuário e senha.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await login(username.trim(), password);

      router.push("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao fazer login."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.iconBox}>
            <span className="material-symbols-outlined">fingerprint</span>
          </div>

          <h1>PeopleTrack</h1>
          <p>Acesse seu painel de controle</p>
        </div>

        {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Nome de usuário
            <div className={styles.inputBox}>
              <span className="material-symbols-outlined">person</span>

              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Ex: admin.teste"
              />
            </div>
          </label>

          <label>
            <div className={styles.labelRow}>
              <span>Senha</span>
              <button type="button">Esqueceu a senha?</button>
            </div>

            <div className={styles.inputBox}>
              <span className="material-symbols-outlined">lock</span>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />

              <button
                type="button"
                className={styles.visibilityButton}
                onClick={() => setShowPassword((current) => !current)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </label>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "Entrando..." : "Entrar"}</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>

        <footer className={styles.footer}>
          Protegido por segurança de nível empresarial.
        </footer>
      </section>
    </main>
  );
}