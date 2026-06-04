import type { UsuarioLogado } from "../services/authService";

export function canRegisterUsers(user: UsuarioLogado | null) {
  return user?.role === "ADMIN";
}

export function canRegisterEmployees(user: UsuarioLogado | null) {
  return user?.role === "ADMIN" || user?.role === "RH_MANAGER";
}

export function canTerminateEmployee(user: UsuarioLogado | null) {
  return user?.role === "RH_MANAGER";
}

export function canViewTerminationReason(user: UsuarioLogado | null) {
  return (
    user?.role === "ADMIN" ||
    user?.role === "CEO" ||
    user?.role === "RH_MANAGER"
  );
}