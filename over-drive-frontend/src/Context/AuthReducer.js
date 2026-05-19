import { AUTH_ACTIONS } from "./AuthActions";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return { ...state, loading: true, error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return { ...state, user: action.payload, isAuthenticated: true, loading: false, error: null };
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return { ...state, user: null, isAuthenticated: false, loading: false, error: action.payload };
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, user: null, isAuthenticated: false, loading: false, error: null };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export default AuthReducer;
