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

// API Functions
export async function login(data: any): Promise<any>  {
  return fetchApi("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function signup(data: any): Promise<any> {
  return fetchApi("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getCurrentUser() {
  return fetchApi("/user/me");
}
