import { fetchApi } from "./client";

// Types
export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    usertype: string;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
  };
}

// API Functions
export async function login(data: LoginData): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser(): Promise<AuthResponse["user"]> {
  return fetchApi<AuthResponse["user"]>("/auth/me");
}
