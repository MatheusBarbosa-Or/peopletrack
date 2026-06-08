import { API_URL } from "./api";

export type Funcionario = {
  id: string;
  nome: string;
  cpf: string;
  email: string | null;
  data_nascimento: string | null;
  genero: string | null;
  cargo: string | null;
  horario_trabalho: string | null;
  status: string;
  created_at: string | null;
};

type FuncionariosResponse = {
  status_consultado: string;
  funcionarios: Funcionario[];
};

type FuncionarioResponse = {
  funcionario: Funcionario;
};

export type DesligamentoPayload = {
  terminated_by: string | null;
  reason_type:
  | "pedido_do_funcionario"
  | "baixo_desempenho"
  | "quebra_de_conduta"
  | "fim_de_contrato"
  | "reestruturacao"
  | "outro";
  description: string;
};

export type CreateFuncionarioPayload = {
  nome: string;
  cpf: string;
  email: string | null;
  data_nascimento: string | null;
  genero: string | null;
  cargo: string;
  horario_entrada: string | null;
  horario_saida: string | null;
  status: string;
};

export type UsuarioCriadoAutomaticamente = {
  id: string;
  username: string;
  role: string;
};

export type CreateFuncionarioResult = {
  funcionario: Funcionario;
  usuario_criado: UsuarioCriadoAutomaticamente | null;
};

type CreateFuncionarioResponse = {
  message: string;
  funcionario: Funcionario;
};

export type Desligamento = {
  id: string;
  employee_id: string;
  terminated_by: string | null;
  reason_type: string;
  description: string;
  terminated_at: string | null;
};

type DesligamentoResponse = {
  desligamento: Desligamento;
};

export async function createFuncionario(
  payload: CreateFuncionarioPayload
): Promise<CreateFuncionarioResult> {
  const response = await fetch(`${API_URL}/funcionarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Erro ao cadastrar funcionário");
  }

  const data = await response.json();

  return {
    funcionario: data.funcionario,
    usuario_criado: data.usuario_criado ?? null,
  };
}

export async function getFuncionarios(
  status: "ativo" | "desligado" | "todos" = "ativo"
): Promise<Funcionario[]> {
  const response = await fetch(`${API_URL}/funcionarios?status=${status}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar funcionários");
  }

  const data: FuncionariosResponse = await response.json();

  return data.funcionarios;
}

export async function getFuncionarioById(id: string): Promise<Funcionario> {
  const response = await fetch(`${API_URL}/funcionarios/${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar funcionário");
  }

  const data: FuncionarioResponse = await response.json();

  return data.funcionario;
}

export async function desligarFuncionario(
  id: string,
  payload: DesligamentoPayload
): Promise<void> {
  const response = await fetch(`${API_URL}/funcionarios/${id}/desligar`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Erro ao desligar funcionário");
  }
}

export async function getDesligamentoFuncionario(
  id: string
): Promise<Desligamento | null> {
  const response = await fetch(`${API_URL}/funcionarios/${id}/desligamento`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar desligamento");
  }

  const data: DesligamentoResponse = await response.json();

  return data.desligamento;
}