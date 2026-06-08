"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../contexts/AuthContext";
import { createFuncionario } from "../../services/funcionariosService";
import { canRegisterEmployees } from "../../utils/permission";
import { formatCpfInput, getAdultMaxDate } from "../../utils/formatters";

import styles from "./cadastro.module.css";

const CARGO_OPTIONS = [
  "Administrador",
  "CEO",
  "Gestor de RH",
  "Analista de RH",
  "Assistente de RH",
  "Líder de Setor",
  "Analista Administrativo",
  "Analista Financeiro",
  "Desenvolvedor Júnior",
  "Desenvolvedor Pleno",
  "Desenvolvedor Sênior",
  "Analista de Dados",
  "Designer",
  "Gerente de Produto",
];

const ENTRADA_OPTIONS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
];

const SAIDA_OPTIONS = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

function isValidExitTime(entrada: string, saida: string) {
  if (!entrada || !saida) return true;

  const entradaHora = Number(entrada.split(":")[0]);
  const saidaHora = Number(saida.split(":")[0]);

  return saidaHora > entradaHora;
}

export function CadastroContent() {
  const router = useRouter();
  const { user } = useAuth();

  const allowEmployeeRegistration = canRegisterEmployees(user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [funcionarioForm, setFuncionarioForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    data_nascimento: "",
    genero: "",
    cargo: "",
    horario_entrada: "",
    horario_saida: "",
  });

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

  async function handleSubmitFuncionario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (!allowEmployeeRegistration) {
      setErrorMessage("Seu perfil não tem permissão para cadastrar funcionários.");
      return;
    }

    if (
      !funcionarioForm.nome.trim() ||
      !funcionarioForm.cpf.trim() ||
      !funcionarioForm.cargo.trim() ||
      !funcionarioForm.horario_entrada ||
      !funcionarioForm.horario_saida
    ) {
      setErrorMessage(
        "Preencha nome, CPF, cargo, horário de entrada e horário de saída."
      );
      return;
    }

    if (
      !isValidExitTime(
        funcionarioForm.horario_entrada,
        funcionarioForm.horario_saida
      )
    ) {
      setErrorMessage("O horário de saída deve ser posterior ao horário de entrada.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await createFuncionario({
        nome: funcionarioForm.nome.trim(),
        cpf: funcionarioForm.cpf.trim(),
        email: funcionarioForm.email.trim() || null,
        data_nascimento: funcionarioForm.data_nascimento || null,
        genero: funcionarioForm.genero || null,
        cargo: funcionarioForm.cargo.trim(),
        horario_entrada: funcionarioForm.horario_entrada || null,
        horario_saida: funcionarioForm.horario_saida || null,
        status: "ativo",
      });

      if (result.usuario_criado) {
        setFeedbackMessage(
          `Funcionário cadastrado com sucesso. Conta de acesso criada automaticamente: ${result.usuario_criado.username}`
        );
      } else {
        setFeedbackMessage(
          "Funcionário cadastrado com sucesso. Este cargo não gera conta de acesso ao sistema."
        );
      }

      setFuncionarioForm({
        nome: "",
        cpf: "",
        email: "",
        data_nascimento: "",
        genero: "",
        cargo: "",
        horario_entrada: "",
        horario_saida: "",
      });

      setTimeout(() => {
        router.push(`/funcionarios/${result.funcionario.id}`);
      }, 900);
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

  if (!allowEmployeeRegistration) {
    return (
      <main className={styles.main}>
        <section className={styles.pageHeader}>
          <h2>Acesso restrito</h2>
          <p>Seu perfil não possui permissão para cadastrar funcionários.</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.pageHeader}>
        <h2>Cadastro de Funcionário</h2>
        <p>
          Registre novos funcionários. Quando o cargo possuir acesso ao sistema,
          a conta de usuário será criada automaticamente.
        </p>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Novo Funcionário</h3>
            <p>
              Preencha os dados funcionais. CPF, e-mail e idade serão validados
              pelo backend.
            </p>
          </div>
        </div>

        {feedbackMessage && (
          <div className={styles.successBox}>{feedbackMessage}</div>
        )}

        {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

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
                  updateFuncionarioField(
                    "cpf",
                    formatCpfInput(event.target.value)
                  )
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
                placeholder="maria.oliveira@empresa.com"
              />
            </label>

            <label>
              Data de nascimento
              <input
                type="date"
                max={getAdultMaxDate()}
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
              <select
                value={funcionarioForm.cargo}
                onChange={(event) =>
                  updateFuncionarioField("cargo", event.target.value)
                }
              >
                <option value="">Selecione um cargo</option>

                {CARGO_OPTIONS.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Horário de entrada *
              <select
                value={funcionarioForm.horario_entrada}
                onChange={(event) => {
                  const novaEntrada = event.target.value;

                  updateFuncionarioField("horario_entrada", novaEntrada);

                  if (
                    funcionarioForm.horario_saida &&
                    !isValidExitTime(novaEntrada, funcionarioForm.horario_saida)
                  ) {
                    updateFuncionarioField("horario_saida", "");
                  }
                }}
              >
                <option value="">Selecione</option>

                {ENTRADA_OPTIONS.map((horario) => (
                  <option key={horario} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Horário de saída *
              <select
                value={funcionarioForm.horario_saida}
                onChange={(event) =>
                  updateFuncionarioField("horario_saida", event.target.value)
                }
              >
                <option value="">Selecione</option>

                {SAIDA_OPTIONS.filter((saida) =>
                  isValidExitTime(funcionarioForm.horario_entrada, saida)
                ).map((horario) => (
                  <option key={horario} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.infoBox}>
            <span className="material-symbols-outlined">info</span>

            <p>
              A senha inicial de presença e, quando necessário, a senha de acesso
              ao sistema serão geradas automaticamente pelo backend.
            </p>
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
      </section>
    </main>
  );
}