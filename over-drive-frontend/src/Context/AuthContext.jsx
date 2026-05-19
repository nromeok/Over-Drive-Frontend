import { createContext, useReducer, useContext, useCallback } from "react";
import AuthReducer from "./AuthReducer";
import {
  loginStart, loginSuccess, loginFailure,
  registerStart, registerSuccess, registerFailure,
  logout as logoutAction, clearError, updateUser,
} from "./AuthActions";

const TOKEN_KEY = "overdrive_token";
const USER_KEY  = "overdrive_user";

const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || null;
const getStoredUser  = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
};

const storedToken = getStoredToken();
const storedUser  = getStoredUser();

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!(storedUser && storedToken),
  loading: false,
  error: null,
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login = useCallback(async (email, password) => {
    dispatch(loginStart());
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed.");
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      dispatch(loginSuccess(data.user));
      return { success: true };
    } catch (err) {
      dispatch(loginFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    dispatch(registerStart());
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      dispatch(registerSuccess(data.user));
      return { success: true };
    } catch (err) {
      dispatch(registerFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch(logoutAction());
  }, []);

  const clearAuthError    = useCallback(() => dispatch(clearError()), []);
  const updateUserProfile = useCallback((fields) => {
    const updated = { ...state.user, ...fields };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    dispatch(updateUser(fields));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{
      user: state.user, token: state.token,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading, error: state.error,
      login, register, logout: logoutUser, clearAuthError, updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
