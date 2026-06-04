"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createFuncionario } from "../../services/funcionariosService";
import { createUsuario } from "../../services/usuariosService";

import { useAuth } from "../../contexts/AuthContext";
import { canRegisterEmployees, canRegisterUsers, } from "@/utils/permission";

import styles from "./cadastro.module.css";

type CadastroMode = "usuario" | "funcionario";


export function CadastroContent() {
  const router = useRouter();

  const [mode, setMode] = useState<CadastroMode>("funcionario");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);

  const { user } = useAuth();

  const allowUserRegistration = canRegisterUsers(user);
  const allowEmployeeRegistration = canRegisterEmployees(user);

  const [usuarioForm, setUsuarioForm] = useState({
    username: "",
    password: "",
    nome: "",
    cpf: "",
    cargo: "",
    role: "HR_STAFF",
  });

  const [funcionarioForm, setFuncionarioForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    data_nascimento: "",
    genero: "",
    cargo: "",
    horario_trabalho: "",
    presence_password: "",
  });

  function updateUsuarioField(field: keyof typeof usuarioForm, value: string) {
    setUsuarioForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateFuncionarioField(
    field: keyof typeof funcionarioForm,
    value: string
  ) {
    setFuncionarioForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetMessages() {
    setFeedbackMessage("");
    setErrorMessage("");
  }

  async function handleSubmitUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (
      !usuarioForm.username.trim() ||
      !usuarioForm.password.trim() ||
      !usuarioForm.nome.trim() ||
      !usuarioForm.cargo.trim()
    ) {
      setErrorMessage("Preencha os campos obrigatórios do usuário.");
      return;
    }

    if (!allowUserRegistration) {
      setErrorMessage("Seu perfil não tem permissão para cadastrar usuários.");
      return;
    } 

    try {
      setIsSubmitting(true);

      await createUsuario({
        username: usuarioForm.username.trim(),
        password: usuarioForm.password,
        nome: usuarioForm.nome.trim(),
        cpf: usuarioForm.cpf.trim() || null,
        cargo: usuarioForm.cargo.trim(),
        role: usuarioForm.role,
        is_active: true,
      });

      setFeedbackMessage("Usuário cadastrado com sucesso.");

      setUsuarioForm({
        username: "",
        password: "",
        nome: "",
        cpf: "",
        cargo: "",
        role: "HR_STAFF",
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao cadastrar usuário."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitFuncionario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (
      !funcionarioForm.nome.trim() ||
      !funcionarioForm.cpf.trim() ||
      !funcionarioForm.cargo.trim()
    ) {
      setErrorMessage("Preencha nome, CPF e cargo do funcionário.");
      return;
    }

    if (!allowEmployeeRegistration) {
      setErrorMessage("Seu perfil não tem permissão para cadastrar funcionários.");
    return;
    }

    try {
      setIsSubmitting(true);

      const funcionario = await createFuncionario({
        nome: funcionarioForm.nome.trim(),
        cpf: funcionarioForm.cpf.trim(),
        email: funcionarioForm.email.trim() || null,
        data_nascimento: funcionarioForm.data_nascimento || null,
        genero: funcionarioForm.genero || null,
        cargo: funcionarioForm.cargo.trim(),
        horario_trabalho: funcionarioForm.horario_trabalho.trim() || null,
        status: "ativo",
        presence_password: funcionarioForm.presence_password || null,
      });

      setFeedbackMessage("Funcionário cadastrado com sucesso.");

      setFuncionarioForm({
        nome: "",
        cpf: "",
        email: "",
        data_nascimento: "",
        genero: "",
        cargo: "",
        horario_trabalho: "",
        presence_password: "",
      });

      router.push(`/funcionarios/${funcionario.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar funcionário."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!allowUserRegistration && !allowEmployeeRegistration) {
    return (
      <main className={styles.main}>
        <section className={styles.pageHeader}>
          <h2>Acesso restrito</h2>
          <p>Seu perfil não possui permissão para realizar cadastros.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.pageHeader}>
        <h2>Registro</h2>
        <p>Adicione novos usuários ou funcionários à plataforma PeopleTrack.</p>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Novo Cadastro</h3>
            <p>
              Selecione o tipo de cadastro e preencha as informações
              necessárias.
            </p>
          </div>
        </div>

        <div className={styles.toggle}>
          {allowUserRegistration && (
            <button
              type="button"
              className={mode === "usuario" ? styles.activeToggle : ""}
              onClick={() => {
                setMode("usuario");
                resetMessages();
              }}
            >
              Cadastrar Usuário
            </button>
          )}

          {allowEmployeeRegistration && (
            <button
              type="button"
              className={mode === "funcionario" ? styles.activeToggle : ""}
              onClick={() => {
                setMode("funcionario");
                resetMessages();
              }}
            >
              Cadastrar Funcionário
            </button>
          )}
        </div>

        {feedbackMessage && (
          <div className={styles.successBox}>{feedbackMessage}</div>
        )}

        {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

        {mode === "usuario" ? (
          <form className={styles.form} onSubmit={handleSubmitUsuario}>
            <div className={styles.formGrid}>
              <label>
                Nome completo *
                <input
                  value={usuarioForm.nome}
                  onChange={(event) =>
                    updateUsuarioField("nome", event.target.value)
                  }
                  placeholder="Ex: João da Silva"
                />
              </label>

              <label>
                Nome de usuário *
                <input
                  value={usuarioForm.username}
                  onChange={(event) =>
                    updateUsuarioField("username", event.target.value)
                  }
                  placeholder="Ex: joao.silva"
                />
              </label>

              <label>
                CPF
                <input
                  value={usuarioForm.cpf}
                  onChange={(event) =>
                    updateUsuarioField("cpf", event.target.value)
                  }
                  placeholder="000.000.000-00"
                />
              </label>

              <label>
                Cargo / Função *
                <input
                  value={usuarioForm.cargo}
                  onChange={(event) =>
                    updateUsuarioField("cargo", event.target.value)
                  }
                  placeholder="Ex: Gestor de RH"
                />
              </label>

              <label>
                Perfil de acesso *
                <select
                  value={usuarioForm.role}
                  onChange={(event) =>
                    updateUsuarioField("role", event.target.value)
                  }
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="CEO">CEO</option>
                  <option value="RH_MANAGER">Gestor de RH</option>
                  <option value="LEADER">Liderança</option>
                  <option value="HR_STAFF">Equipe de RH</option>
                </select>
              </label>

              <label>
                Senha de acesso *
                <div className={styles.passwordField}>
                  <input
                    type={showUserPassword ? "text" : "password"}
                    value={usuarioForm.password}
                    onChange={(event) =>
                      updateUsuarioField("password", event.target.value)
                    }
                    placeholder="Mínimo de 6 caracteres"
                  />

                  <button
                    type="button"
                    onClick={() => setShowUserPassword((current) => !current)}
                  >
                    <span className="material-symbols-outlined">
                      {showUserPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>
            </div>

            <div className={styles.formFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => router.push("/dashboard")}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar usuário"}
              </button>
            </div>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleSubmitFuncionario}>
            <div className={styles.formGrid}>
              <label className={styles.fullWidth}>
                Nome completo *
                <input
                  value={funcionarioForm.nome}
                  onChange={(event) =>
                    updateFuncionarioField("nome", event.target.value)
                  }
                  placeholder="Ex: Maria Oliveira"
                />
              </label>

              <label>
                CPF *
                <input
                  value={funcionarioForm.cpf}
                  onChange={(event) =>
                    updateFuncionarioField("cpf", event.target.value)
                  }
                  placeholder="000.000.000-00"
                />
              </label>

              <label>
                E-mail corporativo
                <input
                  type="email"
                  value={funcionarioForm.email}
                  onChange={(event) =>
                    updateFuncionarioField("email", event.target.value)
                  }
                  placeholder="maria@empresa.com"
                />
              </label>

              <label>
                Data de nascimento
                <input
                  type="date"
                  value={funcionarioForm.data_nascimento}
                  onChange={(event) =>
                    updateFuncionarioField(
                      "data_nascimento",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Gênero
                <select
                  value={funcionarioForm.genero}
                  onChange={(event) =>
                    updateFuncionarioField("genero", event.target.value)
                  }
                >
                  <option value="">Não informado</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não informar">
                    Prefiro não informar
                  </option>
                </select>
              </label>

              <label>
                Cargo *
                <input
                  value={funcionarioForm.cargo}
                  onChange={(event) =>
                    updateFuncionarioField("cargo", event.target.value)
                  }
                  placeholder="Ex: Desenvolvedora"
                />
              </label>

              <label>
                Horário de trabalho
                <input
                  value={funcionarioForm.horario_trabalho}
                  onChange={(event) =>
                    updateFuncionarioField(
                      "horario_trabalho",
                      event.target.value
                    )
                  }
                  placeholder="Ex: 08:00 às 17:00"
                />
              </label>

              <label className={styles.fullWidth}>
                Senha inicial de presença
                <div className={styles.passwordField}>
                  <input
                    type={showEmployeePassword ? "text" : "password"}
                    value={funcionarioForm.presence_password}
                    onChange={(event) =>
                      updateFuncionarioField(
                        "presence_password",
                        event.target.value
                      )
                    }
                    placeholder="Mínimo de 6 caracteres"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowEmployeePassword((current) => !current)
                    }
                  >
                    <span className="material-symbols-outlined">
                      {showEmployeePassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </label>
            </div>

            <div className={styles.formFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => router.push("/dashboard")}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar funcionário"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}