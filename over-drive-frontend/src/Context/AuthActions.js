export const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_USER: "UPDATE_USER",
};

export const loginStart    = () => ({ type: AUTH_ACTIONS.LOGIN_START });
export const loginSuccess  = (user) => ({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
export const loginFailure  = (err)  => ({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: err });
export const registerStart   = () => ({ type: AUTH_ACTIONS.REGISTER_START });
export const registerSuccess = (user) => ({ type: AUTH_ACTIONS.REGISTER_SUCCESS, payload: user });
export const registerFailure = (err)  => ({ type: AUTH_ACTIONS.REGISTER_FAILURE, payload: err });
export const logout      = () => ({ type: AUTH_ACTIONS.LOGOUT });
export const clearError  = () => ({ type: AUTH_ACTIONS.CLEAR_ERROR });
export const updateUser  = (user) => ({ type: AUTH_ACTIONS.UPDATE_USER, payload: user });
