import { apiClient } from "./client";

/**
 * Normalize all auth responses into a single predictable shape
 */
const normalize = (res) => {
  // apiClient already returns parsed JSON
  const data = res;

  return {
    user: data?.user ?? null,
    token: data?.token ?? null,
  };
};

export const authService = {
  /**
   * LOGIN
   */
  login: async (email, password) => {
    const res = await apiClient("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return normalize(res);
  },

  /**
   * REGISTER
   */
  register: async (name, email, password, phone = null) => {
    const res = await apiClient("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
      }),
    });

    return normalize(res);
  },

  /**
   * GET CURRENT USER
   */
  getMe: async () => {
    const res = await apiClient("/api/auth/me", {
      method: "GET",
    });

    return res?.user ?? null;
  },
};