// Base API client with common configuration for fetch requests
export const API_BASE_URL = "http://localhost:5100/api";

// Default headers
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Generic fetch function with auth headers
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers = {
    ...defaultHeaders,
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - log out user
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // You may want to redirect to login page
      // window.location.href = '/login';
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data as T;
}
