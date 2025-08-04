// Base API client with common configuration for fetch requests
export const API_BASE_URL = "http://localhost:5172/api";

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

// Helper function to get auth token from localStorage
const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};
// Generic fetch function with auth headers
export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {

  const token = getAuthToken();
  const refreshToken = getRefreshToken();
  // console.log("TST", endpoint)
  const headers = {
    ...defaultHeaders,
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(refreshToken && { "x-refresh-token": refreshToken }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  // console.log("TST", endpoint, response)

  // Handle 401 Unauthorized - log out user
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      // You may want to redirect to login page
      // window.location.href = '/login';
    }
  }
  // console.log("TST", endpoint, response)

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data; // Return data as `any`
}
