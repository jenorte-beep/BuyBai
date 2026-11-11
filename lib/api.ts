import { CONFIG } from "./config";
import { getAccessToken } from "./auth";

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    requiresAuth = false,
    headers,
    ...resOptions
  } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Please login again.");
    }

    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${CONFIG.API_BASE_URL}${endpoint}`,
    {
      ...resOptions,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Request failed.";

    throw new Error(message);
  }

  return data as T;
}