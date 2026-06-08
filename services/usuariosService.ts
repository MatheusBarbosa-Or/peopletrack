import { API_URL } from "./api";

export type Usuario = {
  id: string;
  username: string;
  nome: string;
  cpf: string | null;
  cargo: string;
  role: string;
  is_active: boolean;
  created_at: string | null;
};

export type CreateUsuarioPayload = {
  username: string;
  nome: string;
  cpf: string;
  cargo: string;
  role: string;
  is_active: boolean;
};

type CreateUsuarioResponse = {
  message: string;
  usuario: Usuario;
};

export async function createUsuario(
  payload: CreateUsuarioPayload
): Promise<Usuario> {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Erro ao cadastrar usuário");
  }

  const data: CreateUsuarioResponse = await response.json();

  return data.usuario;
}