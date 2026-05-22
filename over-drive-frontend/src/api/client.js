import { getToken } from "../utils/authToken";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://over-drive-backend.onrender.com";

console.log("API BASE URL:", BASE_URL);

export async function apiClient(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const token = getToken();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const headers = {
      ...(options.headers || {}),
    };

    // Attach JWT if exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Only JSON header if not FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type");

    let data = null;

    if (contentType?.includes("application/json")) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || `Request failed (${response.status})`
      );
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}