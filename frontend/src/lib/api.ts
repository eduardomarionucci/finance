const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8081";
const AUTH_STORAGE_KEY = "finance.jwt";

type ApiError = { message?: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const credentials = localStorage.getItem(AUTH_STORAGE_KEY);
  if (credentials) headers.set("Authorization", `Bearer ${credentials}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(error?.message ?? "Não foi possível concluir a operação.");
  }
  return response.json() as Promise<T>;
}

export type User = { id: number; name: string; email: string };
type AuthResponse = { token: string; user: User };

function saveToken(token: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
}

export async function register(name: string, email: string, password: string) {
  const response = await request<AuthResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveToken(response.token);
  return response.user;
}

export async function login(email: string, password: string) {
  const response = await request<AuthResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveToken(response.token);
  return response.user;
}

export function getCurrentUser() {
  return request<User>("/api/v1/users/me");
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
