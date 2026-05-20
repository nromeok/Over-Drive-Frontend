import { apiClient } from "./client";
import { delay, MOCK_USER, MOCK_TOKEN } from "./mockData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await delay();
      // Simulate wrong password
      if (password.length < 3) throw new Error("Incorrect email or password.");
      return { token: MOCK_TOKEN, user: { ...MOCK_USER, email } };
    }
    return apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password) => {
    if (USE_MOCK) {
      await delay();
      return { token: MOCK_TOKEN, user: { ...MOCK_USER, name, email } };
    }
    return apiClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  getMe: async (token) => {
    if (USE_MOCK) {
      await delay(300);
      return MOCK_USER;
    }
    return apiClient("/api/auth/me", { method: "GET" }, token);
  },

  updateProfile: async (data, token) => {
    if (USE_MOCK) {
      await delay();
      return { ...MOCK_USER, ...data };
    }
    return apiClient("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }, token);
  },

  changePassword: async (data, token) => {
    if (USE_MOCK) {
      await delay();
      if (data.currentPassword === "wrong") throw new Error("Current password is incorrect.");
      return { message: "Password updated successfully." };
    }
    return apiClient("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(data),
    }, token);
  },
};
