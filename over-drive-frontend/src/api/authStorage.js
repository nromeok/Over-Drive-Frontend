const TOKEN_KEY = "overdrive_token";
const USER_KEY = "overdrive_user";

export const authStorage = {
  // TOKEN
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },

  setUser: (user) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),

  clearUser: () => localStorage.removeItem(USER_KEY),

  // FULL CLEAR
  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};