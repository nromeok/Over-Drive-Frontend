/**
 * Base API client
 * All requests go through here so the base URL and auth headers
 * are set in one place. Import `apiClient` in service files.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Core fetch wrapper.
 * @param {string} endpoint  - e.g. "/api/auth/login"
 * @param {object} options   - fetch options (method, body, etc.)
 * @param {string} [token]   - JWT token for protected routes
 */
export async function apiClient(endpoint, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Try to parse JSON; fall back to text for non-JSON responses
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // Normalise error shape — backend may send { message } or { error }
    const message =
      (typeof data === "object" && (data.message || data.error)) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
