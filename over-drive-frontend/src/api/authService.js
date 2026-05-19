import { apiClient } from "./client";

/**
 * Auth API service
 * Adjust endpoint paths here if your backend uses different routes.
 */

export const authService = {
  /**
   * POST /api/auth/login
   * Expected response: { token: string, user: { id, name, email, role, ... } }
   */
  login: (email, password) =>
    apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  /**
   * POST /api/auth/register
   * Expected response: { token: string, user: { id, name, email, role, ... } }
   */
  register: (name, email, password) =>
    apiClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user (used to restore session).
   */
  getMe: (token) =>
    apiClient("/api/auth/me", { method: "GET" }, token),
};
