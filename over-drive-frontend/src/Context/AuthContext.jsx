import { createContext, useReducer, useContext, useCallback } from "react";
import AuthReducer from "./AuthReducer";
import {
  loginStart, loginSuccess, loginFailure,
  registerStart, registerSuccess, registerFailure,
  logout as logoutAction,
  clearError,
  updateUser,
} from "./AuthActions";
import { authService } from "../api/authService";

const TOKEN_KEY = "overdrive_token";
const USER_KEY  = "overdrive_user";

// ─── Helpers ───────────────────────────────

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

// ─── Initial state ─────────────────────────

const initialState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!(getStoredUser() && getStoredToken()),
  loading: false,
  error: null,
};

// ─── Context ────────────────────────────────

export const AuthContext = createContext(initialState);

// ─── Provider ───────────────────────────────

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // LOGIN
  const login = useCallback(async (email, password) => {
    dispatch(loginStart());

    try {
      const data = await authService.login(email, password);

      const token = data?.access_token;
      const user = data?.user;

      if (!token) {
        throw new Error("Login failed: token missing from server response");
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      dispatch(loginSuccess({ user, token }));

      return { success: true };
    } catch (err) {
      dispatch(loginFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  // REGISTER
  const register = useCallback(async (name, email, password) => {
    dispatch(registerStart());

    try {
      const data = await authService.register(name, email, password);

      const token = data?.access_token;
      const user = data?.user;

      if (!token) {
        throw new Error("Register failed: token missing from server response");
      }

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      dispatch(registerSuccess({ user, token }));

      return { success: true };
    } catch (err) {
      dispatch(registerFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  // OAuth login
  const loginWithToken = useCallback((token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch(loginSuccess({ user, token }));
  }, []);

  // LOGOUT
  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch(logoutAction());
  }, []);

  const clearAuthError = useCallback(() => dispatch(clearError()), []);

  const updateUserProfile = useCallback(
    (fields) => {
      const updated = { ...state.user, ...fields };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      dispatch(updateUser(fields));
    },
    [state.user]
  );

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        loginWithToken,
        logout: logoutUser,
        clearAuthError,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};