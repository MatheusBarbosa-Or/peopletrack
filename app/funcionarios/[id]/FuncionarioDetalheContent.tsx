"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  DesligamentoPayload,
  Funcionario,
  desligarFuncionario,
  getFuncionarioById,
} from "../../../services/funcionariosService";

import {
  Relatorio,
  createRelatorio,
  getRelatoriosByFuncionario,
} from "../../../services/relatoriosService";

import { useAuth } from "../../../contexts/AuthContext";
import {
  canTerminateEmployee,
  canViewTerminationReason,
} from "@/utils/permission";

import styles from "./funcionarioDetalhe.module.css";

type FuncionarioDetalheContentProps = {
  funcionarioId: string;
};


const terminationReasons = [
  { value: "pedido_do_funcionario", label: "Pedido do funcionário" },
  { value: "baixo_desempenho", label: "Baixo desempenho" },
  { value: "quebra_de_conduta", label: "Quebra de conduta" },
  { value: "fim_de_contrato", label: "Fim de contrato" },
  { value: "reestruturacao", label: "Reestruturação" },
  { value: "outro", label: "Outro" },
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(date: string | null) {
  if (!date) return "Não informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

function calculateAge(date: string | null) {
  if (!date) return null;

  const birthDate = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
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

export function FuncionarioDetalheContent({
  funcionarioId,
}: FuncionarioDetalheContentProps) {
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [rating, setRating] = useState(4);
  const [comentario, setComentario] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(false);
  const [terminationReason, setTerminationReason] =
    useState<DesligamentoPayload["reason_type"]>("baixo_desempenho");
  const [terminationDescription, setTerminationDescription] = useState("");

  const idade = useMemo(
    () => calculateAge(funcionario?.data_nascimento ?? null),
    [funcionario]
  );

  const { user } = useAuth();

  const allowTerminate = canTerminateEmployee(user);
  const allowViewTerminationReason = canViewTerminationReason(user);

  async function loadData() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [funcionarioData, relatoriosData] = await Promise.all([
        getFuncionarioById(funcionarioId),
        getRelatoriosByFuncionario(funcionarioId),
      ]);

      setFuncionario(funcionarioData);
      setRelatorios(relatoriosData);
    } catch (error) {
      setErrorMessage("Não foi possível carregar a ficha do funcionário.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [funcionarioId]);

  async function handleCreateRelatorio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!comentario.trim()) {
      setFeedbackMessage("Informe um comentário antes de enviar.");
      return;
    }

    try {
      setFeedbackMessage("");

      await createRelatorio({
        funcionario_id: funcionarioId,
        autor_id: null,
        avaliacao: rating,
        comentario: comentario.trim(),
      });

      setComentario("");
      setRating(4);
      setFeedbackMessage("Relatório enviado com sucesso.");

      const updatedRelatorios = await getRelatoriosByFuncionario(funcionarioId);
      setRelatorios(updatedRelatorios);
    } catch (error) {
      setFeedbackMessage("Erro ao enviar relatório.");
    }
  }

  async function handleTermination(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (terminationDescription.trim().length < 10) {
      setFeedbackMessage("A descrição do desligamento precisa ter ao menos 10 caracteres.");
      return;
    }

    try {
      await desligarFuncionario(funcionarioId, {
        terminated_by: user?.id ?? null,
        reason_type: terminationReason,
        description: terminationDescription.trim(),
      });

      setIsTerminationModalOpen(false);
      setTerminationDescription("");
      setFeedbackMessage("Funcionário desligado com sucesso.");

      const updatedFuncionario = await getFuncionarioById(funcionarioId);
      setFuncionario(updatedFuncionario);
    } catch (error) {
      setFeedbackMessage("Erro ao desligar funcionário.");
    }
  }

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.messageBox}>Carregando ficha técnica...</div>
      </main>
    );
  }

  if (errorMessage || !funcionario) {
    return (
      <main className={styles.main}>
        <div className={styles.errorBox}>{errorMessage}</div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.pageHeader}>
        <Link href="/funcionarios" className={styles.backButton}>
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>

        <div>
          <h2>Ficha Técnica</h2>
          <p>Informações detalhadas e histórico de avaliações.</p>
        </div>
      </div>

      {feedbackMessage && (
        <div className={styles.messageBox}>{feedbackMessage}</div>
      )}

      <section className={styles.grid}>
        <aside className={styles.profileCard}>
          <div className={styles.profileCover} />

          <div className={styles.bigAvatar}>{getInitials(funcionario.nome)}</div>

          <h3>{funcionario.nome}</h3>
          <p>{funcionario.cargo ?? "Cargo não informado"}</p>

          <span
            className={`${styles.statusBadge} ${
              styles[funcionario.status] ?? ""
            }`}
          >
            {getStatusLabel(funcionario.status)}
          </span>
        </aside>

        <section className={styles.contentColumn}>
          <div className={styles.infoCard}>
            <h4>
              <span className="material-symbols-outlined">person</span>
              Informações Pessoais
            </h4>

            <div className={styles.infoGrid}>
              <div>
                <span>Nome completo</span>
                <strong>{funcionario.nome}</strong>
              </div>

              <div>
                <span>Cargo</span>
                <strong>{funcionario.cargo ?? "Não informado"}</strong>
              </div>

              <div>
                <span>CPF</span>
                <strong>{funcionario.cpf}</strong>
              </div>

              <div>
                <span>Gênero</span>
                <strong>{funcionario.genero ?? "Não informado"}</strong>
              </div>

              <div>
                <span>Data de nascimento</span>
                <strong>{formatDate(funcionario.data_nascimento)}</strong>
              </div>

              <div>
                <span>Idade</span>
                <strong>{idade !== null ? `${idade} anos` : "Não informado"}</strong>
              </div>

              <div>
                <span>E-mail para contato</span>
                <strong>{funcionario.email ?? "Não informado"}</strong>
              </div>

              <div>
                <span>Horário de trabalho</span>
                <strong>{funcionario.horario_trabalho ?? "Não informado"}</strong>
              </div>
            </div>
          </div>

          <form className={styles.evaluationCard} onSubmit={handleCreateRelatorio}>
            <h4>
              <span className="material-symbols-outlined">rate_review</span>
              Avaliação do Funcionário
            </h4>

            <div className={styles.ratingBox}>
              <span>Desempenho geral</span>

              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={star <= rating ? styles.starFilled : styles.starEmpty}
                  >
                    <span className="material-symbols-outlined">star</span>
                  </button>
                ))}
              </div>
            </div>

            <label className={styles.textareaLabel} htmlFor="comentario">
              Comentários
            </label>

            <textarea
              id="comentario"
              maxLength={500}
              value={comentario}
              onChange={(event) => setComentario(event.target.value)}
              placeholder="Insira suas observações sobre o desempenho..."
              rows={4}
            />

            <div className={styles.formFooter}>
              <span>{comentario.length}/500 caracteres</span>
              <button type="submit">Enviar avaliação</button>
            </div>
          </form>

          <div className={styles.reportsCard}>
            <h4>
              <span className="material-symbols-outlined">history</span>
              Relatórios registrados
            </h4>

            {relatorios.length === 0 ? (
              <p className={styles.emptyText}>
                Nenhum relatório registrado para este funcionário.
              </p>
            ) : (
              <div className={styles.reportsList}>
                {relatorios.map((relatorio) => (
                  <article key={relatorio.id} className={styles.reportItem}>
                    <div className={styles.reportHeader}>
                      <strong>{relatorio.avaliacao}/5 estrelas</strong>
                      <span>{formatDate(relatorio.created_at)}</span>
                    </div>

                    <p>{relatorio.comentario}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className={styles.dangerCard}>
            <div>
              <h4>Zona de Risco</h4>

              <p>
                Esta ação não apaga o funcionário do banco. Ela altera o status
                para desligado e registra a justificativa do desligamento.
              </p>
            </div>

            <button
              type="button"
              disabled={funcionario.status === "desligado" || !allowTerminate}
              onClick={() => setIsTerminationModalOpen(true)}
            >
              <span className="material-symbols-outlined">person_remove</span>
              Desligar funcionário
            </button>
          </div>
        </section>
      </section>

      {isTerminationModalOpen && (
        <div className={styles.modalOverlay}>
          <form className={styles.modal} onSubmit={handleTermination}>
            <div className={styles.modalHeader}>
              <h3>
                <span className="material-symbols-outlined">warning</span>
                Desligar funcionário
              </h3>

              <button
                type="button"
                onClick={() => setIsTerminationModalOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.warningText}>
                Você está prestes a desligar <strong>{funcionario.nome}</strong>.
                Informe o motivo para manter o histórico registrado.
              </p>

              <label>
                Motivo do desligamento
                <select
                  value={terminationReason}
                  onChange={(event) =>
                    setTerminationReason(
                      event.target.value as DesligamentoPayload["reason_type"]
                    )
                  }
                >
                  {terminationReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Descrição
                <textarea
                  value={terminationDescription}
                  maxLength={500}
                  onChange={(event) =>
                    setTerminationDescription(event.target.value)
                  }
                  placeholder="Descreva o motivo do desligamento..."
                  rows={4}
                />
              </label>

              <span className={styles.counter}>
                {terminationDescription.length}/500 caracteres
              </span>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsTerminationModalOpen(false)}
              >
                Cancelar
              </button>

              <button type="submit" className={styles.confirmButton}>
                Confirmar desligamento
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}