import { API_URL } from "./api";

export type Relatorio = {
  id: string;
  funcionario_id: string;
  autor_id: string | null;
  avaliacao: number;
  comentario: string;
  comentario_preview?: string;
  created_at: string | null;
};

type RelatoriosFuncionarioResponse = {
  funcionario_id: string;
  relatorios: Relatorio[];
};

export type CreateRelatorioPayload = {
  funcionario_id: string;
  autor_id: string | null;
  avaliacao: number;
  comentario: string;
};

export async function getRelatoriosByFuncionario(
  funcionarioId: string
): Promise<Relatorio[]> {
  const response = await fetch(
    `${API_URL}/funcionarios/${funcionarioId}/relatorios`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar relatórios");
  }

  const data: RelatoriosFuncionarioResponse = await response.json();

  return data.relatorios;
}

export async function createRelatorio(
  payload: CreateRelatorioPayload
): Promise<void> {
  const response = await fetch(`${API_URL}/relatorios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Erro ao criar relatório");
  }
}