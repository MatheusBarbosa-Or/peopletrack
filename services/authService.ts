import { API_URL } from "./api";

export type UserRole =
  | "ADMIN"
  | "CEO"
  | "RH_MANAGER"
  | "LEADER"
  | "HR_STAFF";

export type UsuarioLogado = {
  id: string;
  username: string;
  nome: string;
  cpf: string | null;
  cargo: string;
  role: UserRole;
  is_active: boolean;
  created_at: string | null;
};

type LoginResponse = {
  message: string;
  usuario: UsuarioLogado;
};

export async function loginRequest(
  username: string,
  password: string
): Promise<UsuarioLogado> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Erro ao fazer login");
  }

  const data: LoginResponse = await response.json();

  return data.usuario;
}